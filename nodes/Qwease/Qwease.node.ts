import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { qweaseApiRequest } from './GenericFunctions';

export class Qwease implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Qwease',
    name: 'qwease',
    icon: 'file:qwease.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Qwease ITSM (tickets, helpdesk)',
    defaults: {
      name: 'Qwease',
    },
    inputs: ['main'],
    outputs: ['main'],
    usableAsTool: true,
    credentials: [
      {
        name: 'qweaseApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Ticket',
            value: 'ticket',
          },
        ],
        default: 'ticket',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['ticket'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            action: 'Create a ticket',
          },
          {
            name: 'Get',
            value: 'get',
            action: 'Get a ticket',
          },
          {
            name: 'Get Many',
            value: 'getAll',
            action: 'Get many tickets',
          },
          {
            name: 'Update',
            value: 'update',
            action: 'Update a ticket',
          },
        ],
        default: 'getAll',
      },
      {
        displayName: 'Ticket ID',
        name: 'ticketId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['ticket'],
            operation: ['get', 'update'],
          },
        },
        default: '',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Incident (INC)', value: 'INC' },
          { name: 'Request (REQ)', value: 'REQ' },
        ],
        displayOptions: {
          show: {
            resource: ['ticket'],
            operation: ['create'],
          },
        },
        default: 'INC',
      },
      {
        displayName: 'Form ID',
        name: 'form',
        type: 'number',
        required: true,
        displayOptions: {
          show: {
            resource: ['ticket'],
            operation: ['create'],
          },
        },
        default: 1,
      },
      {
        displayName: 'For User ID',
        name: 'forUser',
        type: 'number',
        required: true,
        displayOptions: {
          show: {
            resource: ['ticket'],
            operation: ['create'],
          },
        },
        default: 1,
      },
      {
        displayName: 'Subject',
        name: 'resume',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['ticket'],
            operation: ['create', 'update'],
          },
        },
        default: '',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: { rows: 4 },
        displayOptions: {
          show: {
            resource: ['ticket'],
            operation: ['create'],
          },
        },
        default: '',
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
          show: {
            resource: ['ticket'],
            operation: ['getAll'],
          },
        },
        default: false,
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: {
            resource: ['ticket'],
            operation: ['getAll'],
            returnAll: [false],
          },
        },
        default: 50,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'ticket') {
          if (operation === 'create') {
            const body = {
              type: this.getNodeParameter('type', i) as string,
              form: this.getNodeParameter('form', i) as number,
              for_user: this.getNodeParameter('forUser', i) as number,
              resume: this.getNodeParameter('resume', i) as string,
              description: this.getNodeParameter('description', i) as string,
            };
            const response = await qweaseApiRequest.call(this, 'POST', '/ticket/', body);
            returnData.push({ json: response, pairedItem: { item: i } });
          } else if (operation === 'get') {
            const ticketId = this.getNodeParameter('ticketId', i) as string;
            const response = await qweaseApiRequest.call(this, 'GET', `/ticket/${ticketId}/`);
            returnData.push({ json: response, pairedItem: { item: i } });
          } else if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const limit = this.getNodeParameter('limit', i) as number;
            const response = await qweaseApiRequest.call(this, 'GET', '/ticket/');
            const list = response.results ?? response.data ?? (Array.isArray(response) ? response : []);
            const sliced = returnAll ? list : list.slice(0, limit);
            for (const entry of sliced) {
              returnData.push({ json: entry, pairedItem: { item: i } });
            }
          } else if (operation === 'update') {
            const ticketId = this.getNodeParameter('ticketId', i) as string;
            const body = {
              resume: this.getNodeParameter('resume', i) as string,
            };
            const response = await qweaseApiRequest.call(this, 'PATCH', `/ticket/${ticketId}/`, body);
            returnData.push({ json: response, pairedItem: { item: i } });
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
