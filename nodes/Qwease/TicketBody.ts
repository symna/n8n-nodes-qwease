import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { extractLocatorValue } from './FormFieldsHelper';

type CustomFieldsUi = {
  field?: Array<{ key: unknown; value: unknown }>;
};

type TicketOptionalFields = IDataObject & {
  priority?: string;
  askedBy?: unknown;
  assignedTo?: unknown;
  assignedGroup?: unknown;
  statusId?: unknown;
  desiredResolutionDate?: string;
  customFieldsUi?: CustomFieldsUi;
  resume?: string;
  description?: string;
};

function parseOptionalInt(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return parseOptionalInt((value as { value: unknown }).value);
  }
  const n = typeof value === 'number' ? value : parseInt(String(value), 10);
  return Number.isNaN(n) ? undefined : n;
}

function getResourceId(
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

function resolveLocatorValue(value: unknown): number | undefined {
  return parseOptionalInt(value);
}

function buildCustomFieldsFromUi(customFieldsUi: CustomFieldsUi | undefined): IDataObject | undefined {
  const fields = customFieldsUi?.field;
  if (!fields?.length) {
    return undefined;
  }

  const result: IDataObject = {};
  for (const entry of fields) {
    const key = extractLocatorValue(entry.key);
    if (key) {
      result[key] = extractLocatorValue(entry.value);
    }
  }
  return Object.keys(result).length ? result : undefined;
}

function applyOptionalFields(body: IDataObject, fields: TicketOptionalFields): void {
  if (fields.resume) {
    body.resume = fields.resume;
  }
  if (fields.description) {
    body.description = fields.description;
  }
  if (fields.priority) {
    body.priority = fields.priority;
  }

  const askedBy = resolveLocatorValue(fields.askedBy);
  if (askedBy !== undefined) {
    body.asked_by = askedBy;
  }

  const assignedTo = resolveLocatorValue(fields.assignedTo);
  if (assignedTo !== undefined) {
    body.assigned_to = assignedTo;
  }

  const assignedGroup = resolveLocatorValue(fields.assignedGroup);
  if (assignedGroup !== undefined) {
    body.assigned_group = assignedGroup;
  }

  const statut = parseOptionalInt(fields.statusId);
  if (statut !== undefined) {
    body.statut = statut;
  }

  if (fields.desiredResolutionDate) {
    body.desired_resolution_date = fields.desiredResolutionDate;
  }

  const customFields = buildCustomFieldsFromUi(fields.customFieldsUi);
  if (customFields) {
    body.custom_fields = customFields;
  }
}

export function buildTicketBodyFromParameters(
  this: IExecuteFunctions,
  itemIndex: number,
  includeRequired: boolean,
): IDataObject {
  const body: IDataObject = {};

  if (includeRequired) {
    const form = parseOptionalInt(getResourceId(this, 'form', itemIndex));
    const forUser = parseOptionalInt(getResourceId(this, 'forUser', itemIndex));
    if (!form || !forUser) {
      throw new Error('Select a Form and For User (list or ID).');
    }
    body.type = this.getNodeParameter('type', itemIndex) as string;
    body.form = form;
    body.for_user = forUser;
    body.resume = this.getNodeParameter('resume', itemIndex) as string;
    body.description = this.getNodeParameter('description', itemIndex) as string;

    const additionalFields = this.getNodeParameter(
      'additionalFields',
      itemIndex,
      {},
    ) as TicketOptionalFields;
    applyOptionalFields(body, additionalFields);
  } else {
    const updateFields = this.getNodeParameter(
      'updateFields',
      itemIndex,
      {},
    ) as TicketOptionalFields;
    applyOptionalFields(body, updateFields);
  }

  return body;
}

export function getTicketIdParameter(this: IExecuteFunctions, itemIndex: number): string {
  const ticketId = getResourceId(this, 'ticketId', itemIndex);
  if (!ticketId) {
    throw new Error('Select a Ticket (list or ID).');
  }
  return ticketId;
}
