import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { qweaseApiRequest, qweaseListFromResponse } from './GenericFunctions';
import { buildTicketBodyFromParameters, getTicketIdParameter } from './TicketBody';
import {
  getClients,
  getClientsLoad,
  getDevices,
  getDevicesLoad,
  getFormCustomFields,
  getFormStatuses,
  getForms,
  getPages,
  getPagesLoad,
  getTasks,
  getTeams,
  getTeamsLoad,
  getTickets,
  getTicketsLoad,
  getUsers,
  getUsersLoad,
} from './QweaseMethods';
import { ticketFields, ticketOperations } from './QweaseDescription';
import {
  deviceFields,
  deviceOperations,
  meOperations,
  organizationFields,
  organizationOperations,
  searchFields,
  searchOperations,
  teamFields,
  teamOperations,
  userFields,
  userOperations,
} from './OtherResourcesDescription';
import {
  knowledgeFields,
  knowledgeOperations,
  taskFields,
  taskOperations,
} from './KnowledgeTaskDescription';
import {
  executeDevice,
  executeMe,
  executeOrganization,
  executeSearch,
  executeTeam,
  executeUser,
} from './executeOtherResources';
import { executeKnowledge, executeTask } from './executeKnowledgeTask';

export class Qwease implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Qwease',
    name: 'qwease',
    icon: 'file:qwease.png',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description:
      'Interact with Qwease ITSM (tickets, users, organizations, devices, knowledge, tasks, search)',
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
          { name: 'Ticket', value: 'ticket' },
          { name: 'User', value: 'user' },
          { name: 'Organization', value: 'organization' },
          { name: 'Device', value: 'device' },
          { name: 'Team', value: 'team' },
          { name: 'Knowledge', value: 'knowledge' },
          { name: 'Task', value: 'task' },
          { name: 'Search', value: 'search' },
          { name: 'Me', value: 'me' },
        ],
        default: 'ticket',
      },
      ...ticketOperations,
      ...ticketFields,
      ...userOperations,
      ...userFields,
      ...organizationOperations,
      ...organizationFields,
      ...deviceOperations,
      ...deviceFields,
      ...teamOperations,
      ...teamFields,
      ...knowledgeOperations,
      ...knowledgeFields,
      ...taskOperations,
      ...taskFields,
      ...searchOperations,
      ...searchFields,
      ...meOperations,
    ],
  };

  methods = {
    listSearch: {
      getForms,
      getUsers,
      getTeams,
      getTickets,
      getClients,
      getDevices,
      getPages,
      getTasks,
      getFormStatuses,
      getFormCustomFields,
    },
    loadOptions: {
      getUsersLoad,
      getClientsLoad,
      getTeamsLoad,
      getDevicesLoad,
      getTicketsLoad,
      getPagesLoad,
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let results: INodeExecutionData[] = [];

        if (resource === 'ticket') {
          if (operation === 'create') {
            const body = buildTicketBodyFromParameters.call(this, i, true);
            const response = await qweaseApiRequest.call(this, 'POST', '/ticket/', body);
            results = [{ json: response, pairedItem: { item: i } }];
          } else if (operation === 'get') {
            const ticketId = getTicketIdParameter.call(this, i);
            const response = await qweaseApiRequest.call(this, 'GET', `/ticket/${ticketId}/`);
            results = [{ json: response, pairedItem: { item: i } }];
          } else if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const limit = this.getNodeParameter('limit', i) as number;
            const response = await qweaseApiRequest.call(this, 'GET', '/ticket/');
            const list = qweaseListFromResponse(response);
            const sliced = returnAll ? list : list.slice(0, limit);
            results = sliced.map((entry) => ({ json: entry, pairedItem: { item: i } }));
          } else if (operation === 'update') {
            const ticketId = getTicketIdParameter.call(this, i);
            const body = buildTicketBodyFromParameters.call(this, i, false);
            if (Object.keys(body).length === 0) {
              throw new Error('Set at least one field to update.');
            }
            const response = await qweaseApiRequest.call(
              this,
              'PATCH',
              `/ticket/${ticketId}/`,
              body,
            );
            results = [{ json: response, pairedItem: { item: i } }];
          } else if (operation === 'addComment') {
            const ticketId = getTicketIdParameter.call(this, i);
            const comment = this.getNodeParameter('comment', i) as string;
            const isPrivate = this.getNodeParameter('commentPrivate', i, false) as boolean;
            const response = await qweaseApiRequest.call(
              this,
              'POST',
              `/ticket/${ticketId}/commentary/`,
              {
                content: comment,
                is_private: isPrivate,
                origin: 'api',
              },
            );
            results = [{ json: response, pairedItem: { item: i } }];
          }
        } else if (resource === 'user') {
          results = await executeUser.call(this, i, operation);
        } else if (resource === 'organization') {
          results = await executeOrganization.call(this, i, operation);
        } else if (resource === 'device') {
          results = await executeDevice.call(this, i, operation);
        } else if (resource === 'team') {
          results = await executeTeam.call(this, i, operation);
        } else if (resource === 'knowledge') {
          results = await executeKnowledge.call(this, i, operation);
        } else if (resource === 'task') {
          results = await executeTask.call(this, i, operation);
        } else if (resource === 'search') {
          results = await executeSearch.call(this, i, operation);
        } else if (resource === 'me') {
          results = await executeMe.call(this, i);
        }

        returnData.push(...results);
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
