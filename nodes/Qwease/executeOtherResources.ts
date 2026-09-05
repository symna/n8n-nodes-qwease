import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { qweaseApiRequest, qweaseListFromResponse } from './GenericFunctions';
import {
  buildCustomFieldsFromUi,
  executeGetAll,
  executeGetById,
  parseOptionalInt,
  requireResourceId,
} from './executeHelpers';

type CollectionFields = IDataObject & {
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  client?: unknown;
  owner?: unknown;
  serialNumber?: string;
  isActive?: boolean;
  customFieldsUi?: { field?: Array<{ key: unknown; value: unknown }> };
};

function applyCommonOptional(body: IDataObject, fields: CollectionFields): void {
  if (fields.isActive !== undefined) {
    body.is_active = fields.isActive;
  }
  const customFields = buildCustomFieldsFromUi(fields.customFieldsUi);
  if (customFields) {
    body.custom_fields = customFields;
  }
}

export async function executeMe(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const response = await qweaseApiRequest.call(this, 'GET', '/me/');
  return [{ json: response, pairedItem: { item: itemIndex } }];
}

export async function executeUser(
  this: IExecuteFunctions,
  itemIndex: number,
  operation: string,
): Promise<INodeExecutionData[]> {
  if (operation === 'get') {
    return [await executeGetById(this, itemIndex, '/users/', 'userId', 'User')];
  }
  if (operation === 'getAll') {
    return executeGetAll(this, itemIndex, '/users/');
  }
  if (operation === 'create') {
    const client = parseOptionalInt(
      this.getNodeParameter('client', itemIndex, undefined, { extractValue: true }),
    );
    if (!client) {
      throw new Error('Select an Organization (list or ID).');
    }
    const body: IDataObject = {
      email: this.getNodeParameter('email', itemIndex) as string,
      first_name: this.getNodeParameter('firstName', itemIndex) as string,
      last_name: this.getNodeParameter('lastName', itemIndex) as string,
      client,
    };
    const additional = this.getNodeParameter(
      'additionalFields',
      itemIndex,
      {},
    ) as CollectionFields;
    applyCommonOptional(body, additional);
    const response = await qweaseApiRequest.call(this, 'POST', '/users/', body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  if (operation === 'update') {
    const userId = requireResourceId(this, 'userId', itemIndex, 'User');
    const fields = this.getNodeParameter('updateFields', itemIndex, {}) as CollectionFields;
    const body: IDataObject = {};
    if (fields.email) body.email = fields.email;
    if (fields.firstName) body.first_name = fields.firstName;
    if (fields.lastName) body.last_name = fields.lastName;
    const client = parseOptionalInt(fields.client);
    if (client !== undefined) body.client = client;
    applyCommonOptional(body, fields);
    if (Object.keys(body).length === 0) {
      throw new Error('Set at least one field to update.');
    }
    const response = await qweaseApiRequest.call(this, 'PATCH', `/users/${userId}/`, body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  throw new Error(`Unknown user operation: ${operation}`);
}

export async function executeOrganization(
  this: IExecuteFunctions,
  itemIndex: number,
  operation: string,
): Promise<INodeExecutionData[]> {
  if (operation === 'get') {
    return [
      await executeGetById(this, itemIndex, '/client/', 'organizationId', 'Organization'),
    ];
  }
  if (operation === 'getAll') {
    return executeGetAll(this, itemIndex, '/client/');
  }
  if (operation === 'create') {
    const body: IDataObject = {
      name: this.getNodeParameter('name', itemIndex) as string,
    };
    const additional = this.getNodeParameter(
      'additionalFields',
      itemIndex,
      {},
    ) as CollectionFields;
    applyCommonOptional(body, additional);
    const response = await qweaseApiRequest.call(this, 'POST', '/client/', body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  if (operation === 'update') {
    const organizationId = requireResourceId(
      this,
      'organizationId',
      itemIndex,
      'Organization',
    );
    const fields = this.getNodeParameter('updateFields', itemIndex, {}) as CollectionFields;
    const body: IDataObject = {};
    if (fields.name) body.name = fields.name;
    applyCommonOptional(body, fields);
    if (Object.keys(body).length === 0) {
      throw new Error('Set at least one field to update.');
    }
    const response = await qweaseApiRequest.call(
      this,
      'PATCH',
      `/client/${organizationId}/`,
      body,
    );
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  throw new Error(`Unknown organization operation: ${operation}`);
}

export async function executeDevice(
  this: IExecuteFunctions,
  itemIndex: number,
  operation: string,
): Promise<INodeExecutionData[]> {
  if (operation === 'get') {
    return [await executeGetById(this, itemIndex, '/device/', 'deviceId', 'Device')];
  }
  if (operation === 'getAll') {
    return executeGetAll(this, itemIndex, '/device/');
  }
  if (operation === 'create') {
    const client = parseOptionalInt(
      this.getNodeParameter('client', itemIndex, undefined, { extractValue: true }),
    );
    if (!client) {
      throw new Error('Select an Organization (list or ID).');
    }
    const body: IDataObject = {
      name: this.getNodeParameter('name', itemIndex) as string,
      client,
    };
    const additional = this.getNodeParameter(
      'additionalFields',
      itemIndex,
      {},
    ) as CollectionFields;
    if (additional.serialNumber) body.serial_number = additional.serialNumber;
    const owner = parseOptionalInt(additional.owner);
    if (owner !== undefined) body.owner = owner;
    applyCommonOptional(body, additional);
    const response = await qweaseApiRequest.call(this, 'POST', '/device/', body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  if (operation === 'update') {
    const deviceId = requireResourceId(this, 'deviceId', itemIndex, 'Device');
    const fields = this.getNodeParameter('updateFields', itemIndex, {}) as CollectionFields;
    const body: IDataObject = {};
    if (fields.name) body.name = fields.name;
    if (fields.serialNumber) body.serial_number = fields.serialNumber;
    const client = parseOptionalInt(fields.client);
    if (client !== undefined) body.client = client;
    const owner = parseOptionalInt(fields.owner);
    if (owner !== undefined) body.owner = owner;
    applyCommonOptional(body, fields);
    if (Object.keys(body).length === 0) {
      throw new Error('Set at least one field to update.');
    }
    const response = await qweaseApiRequest.call(this, 'PATCH', `/device/${deviceId}/`, body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  throw new Error(`Unknown device operation: ${operation}`);
}

export async function executeTeam(
  this: IExecuteFunctions,
  itemIndex: number,
  operation: string,
): Promise<INodeExecutionData[]> {
  if (operation === 'get') {
    return [await executeGetById(this, itemIndex, '/teams/', 'teamId', 'Team')];
  }
  if (operation === 'getAll') {
    return executeGetAll(this, itemIndex, '/teams/');
  }
  if (operation === 'create') {
    const body: IDataObject = {
      name: this.getNodeParameter('name', itemIndex) as string,
    };
    const additional = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
    const clients = parseMultiIds(additional.clients);
    const members = parseMultiIds(additional.members);
    const admins = parseMultiIds(additional.administrators);
    if (clients) body.client = clients;
    if (members) body.members = members;
    if (admins) body.administrators = admins;
    const response = await qweaseApiRequest.call(this, 'POST', '/teams/', body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  if (operation === 'update') {
    const teamId = requireResourceId(this, 'teamId', itemIndex, 'Team');
    const fields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
    const body: IDataObject = {};
    if (fields.name) body.name = fields.name;
    const clients = parseMultiIds(fields.clients);
    const members = parseMultiIds(fields.members);
    const admins = parseMultiIds(fields.administrators);
    if (clients) body.client = clients;
    if (members) body.members = members;
    if (admins) body.administrators = admins;
    if (Object.keys(body).length === 0) {
      throw new Error('Set at least one field to update.');
    }
    const response = await qweaseApiRequest.call(this, 'PATCH', `/teams/${teamId}/`, body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  throw new Error(`Unknown team operation: ${operation}`);
}

function parseMultiIds(value: unknown): number[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const raw = Array.isArray(value) ? value : String(value).split(',');
  const ids = raw
    .map((part) => parseInt(String(part).trim(), 10))
    .filter((n) => !Number.isNaN(n));
  return ids.length ? ids : undefined;
}

export async function executeSearch(
  this: IExecuteFunctions,
  itemIndex: number,
  operation: string,
): Promise<INodeExecutionData[]> {
  if (operation === 'quick') {
    const q = this.getNodeParameter('query', itemIndex) as string;
    const type = this.getNodeParameter('searchType', itemIndex) as string;
    const limit = this.getNodeParameter('quickLimit', itemIndex) as number;
    const response = (await qweaseApiRequest.call(this, 'GET', '/search/', {}, { q, type, limit })) as IDataObject;
    const results = (response.results as IDataObject) || {};
    const key = type === 'user' ? 'users' : 'tickets';
    const list = Array.isArray(results[key]) ? (results[key] as IDataObject[]) : [];
    if (list.length === 0) {
      return [{ json: response, pairedItem: { item: itemIndex } }];
    }
    return list.map((entry) => ({ json: entry, pairedItem: { item: itemIndex } }));
  }

  if (operation === 'advanced') {
    const conditionsRaw = this.getNodeParameter('conditionsJson', itemIndex);
    const conditions =
      typeof conditionsRaw === 'string' ? JSON.parse(conditionsRaw) : (conditionsRaw as IDataObject);
    const searchText = this.getNodeParameter('searchText', itemIndex, '') as string;
    const pageSize = this.getNodeParameter('pageSize', itemIndex) as number;
    const ordering = this.getNodeParameter('ordering', itemIndex, '') as string;
    const customFieldsDisplay = this.getNodeParameter(
      'customFieldsDisplay',
      itemIndex,
      false,
    ) as boolean;
    const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;

    const qs: IDataObject = {};
    if (customFieldsDisplay) {
      qs.custom_fields_display = 1;
    }

    const collected: IDataObject[] = [];
    let page = returnAll ? 1 : (this.getNodeParameter('page', itemIndex) as number);
    let totalPages = 1;

    do {
      const body: IDataObject = {
        conditions,
        page,
        page_size: pageSize,
        search: searchText || '',
      };
      if (ordering) {
        body.ordering = ordering;
      }

      const response = (await qweaseApiRequest.call(
        this,
        'POST',
        '/advanced-search/',
        body,
        qs,
      )) as IDataObject;
      const pageResults = qweaseListFromResponse(response);
      collected.push(...pageResults);
      totalPages = Number(response.total_pages || 1);
      page += 1;
    } while (returnAll && page <= totalPages);

    return collected.map((entry) => ({ json: entry, pairedItem: { item: itemIndex } }));
  }

  throw new Error(`Unknown search operation: ${operation}`);
}
