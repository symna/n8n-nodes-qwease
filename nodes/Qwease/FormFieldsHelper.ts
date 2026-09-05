import type { IDataObject, ILoadOptionsFunctions } from 'n8n-workflow';

import { qweaseApiRequest, qweaseListFromResponse, type QweaseContext } from './GenericFunctions';

export type QweaseFormField = {
  id: number;
  name: string;
  technical_name: string;
  fields_type: string;
  optionslist?: IDataObject[];
};

export function extractLocatorValue(value: unknown): string {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return extractLocatorValue((value as { value: unknown }).value);
  }
  return String(value);
}

export function parseOptionalId(value: unknown): number | undefined {
  const raw = extractLocatorValue(value);
  if (!raw) {
    return undefined;
  }
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? undefined : n;
}

export function extractStatutModelId(formDetails: IDataObject): number | undefined {
  const statutModel = formDetails.statut_model;
  if (typeof statutModel === 'number') {
    return statutModel;
  }
  if (statutModel && typeof statutModel === 'object') {
    return parseOptionalId((statutModel as IDataObject).id);
  }
  return undefined;
}

export function extractFormIdFromTicket(ticket: IDataObject): number | undefined {
  const form = ticket.form;
  if (typeof form === 'number') {
    return form;
  }
  if (form && typeof form === 'object') {
    return parseOptionalId((form as IDataObject).id);
  }
  return undefined;
}

export async function resolveFormIdForLists(
  context: ILoadOptionsFunctions,
): Promise<number | undefined> {
  const operation = context.getCurrentNodeParameter('operation') as string | undefined;

  if (operation === 'create') {
    return parseOptionalId(context.getCurrentNodeParameter('form'));
  }

  if (operation === 'update') {
    const ticketId = extractLocatorValue(context.getCurrentNodeParameter('ticketId'));
    if (!ticketId) {
      return undefined;
    }
    const ticket = (await qweaseApiRequest.call(
      context,
      'GET',
      `/ticket/${ticketId}/`,
    )) as IDataObject;
    return extractFormIdFromTicket(ticket);
  }

  return undefined;
}

export async function fetchFormFields(
  context: QweaseContext,
  formId: number,
): Promise<QweaseFormField[]> {
  const response = await qweaseApiRequest.call(
    context,
    'GET',
    '/forms-category/',
    {},
    { form: formId, depth: 2 },
  );
  const categories = qweaseListFromResponse(response);
  const fields: QweaseFormField[] = [];
  const seen = new Set<string>();

  for (const category of categories) {
    const categoryFields = category.fields;
    if (!Array.isArray(categoryFields)) {
      continue;
    }
    for (const field of categoryFields) {
      if (!field || typeof field !== 'object') {
        continue;
      }
      const entry = field as IDataObject;
      const technicalName = String(entry.technical_name || '');
      if (!technicalName || seen.has(technicalName)) {
        continue;
      }
      seen.add(technicalName);
      fields.push({
        id: parseOptionalId(entry.id) ?? 0,
        name: String(entry.name || entry.display_name || technicalName),
        technical_name: technicalName,
        fields_type: String(entry.fields_type || 'string'),
        optionslist: Array.isArray(entry.optionslist) ? entry.optionslist : undefined,
      });
    }
  }

  return fields;
}

export async function fetchFormStatusItems(
  context: QweaseContext,
  formId: number,
): Promise<IDataObject[]> {
  const formDetails = (await qweaseApiRequest.call(
    context,
    'GET',
    `/forms/${formId}/details/`,
  )) as IDataObject;
  const statutModelId = extractStatutModelId(formDetails);
  if (!statutModelId) {
    return [];
  }

  const response = await qweaseApiRequest.call(
    context,
    'GET',
    '/statusitem/',
    {},
    {
      related_status: statutModelId,
      position__in: '1,2,3,4',
    },
  );
  return qweaseListFromResponse(response);
}
