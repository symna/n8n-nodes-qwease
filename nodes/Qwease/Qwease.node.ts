import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { qweaseApiRequest, qweaseListFromResponse } from './GenericFunctions';
import { buildTicketBodyFromParameters } from './TicketBody';
import { getClients, getForms, getTeams, getUsers } from './QweaseMethods';
import { ticketFields, ticketOperations } from './QweaseDescription';

export class Qwease implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Qwease',
    name: 'qwease',
    icon: 'file:qwease.png',
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
      ...ticketOperations,
      ...ticketFields,
    ],
  };

  methods = {
    loadOptions: {
      getForms,
      getUsers,
      getClients,
      getTeams,
    },
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
            const form = this.getNodeParameter('form', i) as number;
            const forUser = this.getNodeParameter('forUser', i) as number;

            if (!form || !forUser) {
              throw new Error('Select a Form and For User (refresh lists if empty).');
            }

            const body = buildTicketBodyFromParameters.call(this, i, true);
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
            const list = qweaseListFromResponse(response);
            const sliced = returnAll ? list : list.slice(0, limit);
            for (const entry of sliced) {
              returnData.push({ json: entry, pairedItem: { item: i } });
            }
          } else if (operation === 'update') {
            const ticketId = this.getNodeParameter('ticketId', i) as string;
            const body = buildTicketBodyFromParameters.call(this, i, false);
            if (Object.keys(body).length === 0) {
              throw new Error('Set at least one field to update.');
            }
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
