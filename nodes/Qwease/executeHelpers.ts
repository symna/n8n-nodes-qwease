import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { qweaseApiRequest, qweaseListFromResponse } from './GenericFunctions';
import { extractLocatorValue } from './FormFieldsHelper';

type CustomFieldsUi = {
  field?: Array<{ key: unknown; value: string }>;
};

export function parseOptionalInt(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return parseOptionalInt((value as { value: unknown }).value);
  }
  const n = typeof value === 'number' ? value : parseInt(String(value), 10);
  return Number.isNaN(n) ? undefined : n;
}

export function getResourceId(
  context: IExecuteFunctions,
  parameterName: string,
  itemIndex: number,
  fallback = '',
): string {
  const value = context.getNodeParameter(parameterName, itemIndex, fallback, {
    extractValue: true,
  }) as string | number;
  if (value === undefined || value === null || value === '') {
    return '';
  }
  return String(value);
}

export function buildCustomFieldsFromUi(
  customFieldsUi: CustomFieldsUi | undefined,
): IDataObject | undefined {
  const fields = customFieldsUi?.field;
  if (!fields?.length) {
    return undefined;
  }

  const result: IDataObject = {};
  for (const entry of fields) {
    const key = extractLocatorValue(entry.key);
    if (key) {
      result[key] = entry.value ?? '';
    }
  }
  return Object.keys(result).length ? result : undefined;
}

export async function executeGetAll(
  context: IExecuteFunctions,
  itemIndex: number,
  endpoint: string,
): Promise<INodeExecutionData[]> {
  const returnAll = context.getNodeParameter('returnAll', itemIndex) as boolean;
  const limit = context.getNodeParameter('limit', itemIndex) as number;
  const response = await qweaseApiRequest.call(context, 'GET', endpoint);
  const list = qweaseListFromResponse(response);
  const sliced = returnAll ? list : list.slice(0, limit);
  return sliced.map((entry) => ({ json: entry, pairedItem: { item: itemIndex } }));
}

export async function executeGetById(
  context: IExecuteFunctions,
  itemIndex: number,
  endpointPrefix: string,
  parameterName: string,
  label: string,
): Promise<INodeExecutionData> {
  const id = getResourceId(context, parameterName, itemIndex);
  if (!id) {
    throw new Error(`Select a ${label} (list or ID).`);
  }
  const response = await qweaseApiRequest.call(context, 'GET', `${endpointPrefix}${id}/`);
  return { json: response, pairedItem: { item: itemIndex } };
}

export function requireResourceId(
  context: IExecuteFunctions,
  parameterName: string,
  itemIndex: number,
  label: string,
): string {
  const id = getResourceId(context, parameterName, itemIndex);
  if (!id) {
    throw new Error(`Select a ${label} (list or ID).`);
  }
  return id;
}
