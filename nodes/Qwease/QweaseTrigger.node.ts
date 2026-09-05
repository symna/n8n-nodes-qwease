import { createHmac, timingSafeEqual } from 'crypto';

import type {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const EVENT_OPTIONS = [
  { name: 'Ticket Created', value: 'ticket_created' },
  { name: 'Ticket Updated', value: 'ticket_updated' },
  { name: 'Ticket Closed', value: 'ticket_closed' },
  { name: 'Ticket Comment Created', value: 'ticket_comment_created' },
  { name: 'Task Opened', value: 'task_opened' },
  { name: 'Task Completed', value: 'task_completed' },
  { name: 'Task Refused', value: 'task_refused' },
  { name: 'Webhook Test', value: 'webhook.test' },
];

function getRawBody(req: { rawBody?: Buffer | string; body?: unknown }): Buffer {
  if (req.rawBody) {
    return typeof req.rawBody === 'string' ? Buffer.from(req.rawBody, 'utf8') : req.rawBody;
  }
  // Fallback when raw body is unavailable (may fail HMAC on some n8n hosts)
  const serialized = JSON.stringify(req.body ?? {}, null, 0);
  return Buffer.from(serialized, 'utf8');
}

function verifyQweaseSignature(secret: string, rawBody: Buffer, signatureHeader: string): boolean {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const received = signatureHeader.trim();
  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(received, 'utf8');
  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }
  return timingSafeEqual(expectedBuf, receivedBuf);
}

export class QweaseTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Qwease Trigger',
    name: 'qweaseTrigger',
    icon: 'file:qwease.svg',
    group: ['trigger'],
    version: 1,
    description: 'Starts the workflow when Qwease sends a signed webhook event',
    defaults: {
      name: 'Qwease Trigger',
    },
    inputs: [],
    outputs: ['main'],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: '={{$parameter["path"]}}',
      },
    ],
    properties: [
      {
        displayName: 'Path',
        name: 'path',
        type: 'string',
        default: 'qwease',
        required: true,
        description: 'Webhook path suffix (production URL ends with /webhook/&lt;path&gt;)',
      },
      {
        displayName: 'Webhook Secret',
        name: 'webhookSecret',
        type: 'string',
        typeOptions: { password: true },
        default: '',
        required: true,
        description:
          'Secret shown once when creating the webhook in Qwease Admin → Integrations → Webhooks',
      },
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: EVENT_OPTIONS,
        default: [],
        description: 'Leave empty to accept all event types (including webhook.test)',
      },
      {
        displayName: 'Ignore Invalid Signature',
        name: 'ignoreInvalidSignature',
        type: 'boolean',
        default: false,
        description:
          'Whether to still emit the item when HMAC verification fails (not recommended in production)',
      },
    ],
		usableAsTool: true,
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const headerData = this.getHeaderData() as IDataObject;
    const secret = this.getNodeParameter('webhookSecret') as string;
    const events = this.getNodeParameter('events', []) as string[];
    const ignoreInvalidSignature = this.getNodeParameter(
      'ignoreInvalidSignature',
      false,
    ) as boolean;

    const signature =
      (headerData['x-qwease-signature-256'] as string) ||
      (headerData['X-Qwease-Signature-256'] as string) ||
      '';

    if (!signature) {
      throw new NodeOperationError(this.getNode(), 'Missing X-Qwease-Signature-256 header');
    }

    const rawBody = getRawBody(req as { rawBody?: Buffer | string; body?: unknown });
    const valid = verifyQweaseSignature(secret, rawBody, signature);

    if (!valid && !ignoreInvalidSignature) {
      throw new NodeOperationError(this.getNode(), 'Invalid Qwease webhook signature');
    }

    const body = (this.getBodyData() || {}) as IDataObject;
    const eventType =
      (body.event_type as string) ||
      (body.event === 'webhook.test' ? 'webhook.test' : '') ||
      '';

    if (events.length > 0) {
      const allowed =
        events.includes(eventType) ||
        (eventType === '' && body.event === 'webhook.test' && events.includes('webhook.test'));
      if (!allowed) {
        return {
          webhookResponse: { status: 200, body: { ignored: true, event_type: eventType } },
          noWebhookResponse: false,
          workflowData: [[]],
        };
      }
    }

    const item: IDataObject = {
      ...body,
      _qwease: {
        signature_valid: valid,
        event_type: eventType || body.event,
        received_at: new Date().toISOString(),
      },
    };

    return {
      workflowData: [[{ json: item }]],
    };
  }
}
