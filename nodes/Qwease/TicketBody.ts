import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

type CustomFieldsUi = {
  field?: Array<{ key: string; value: string }>;
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

function buildCustomFieldsFromUi(customFieldsUi: CustomFieldsUi | undefined): IDataObject | undefined {
  const fields = customFieldsUi?.field;
  if (!fields?.length) {
    return undefined;
  }

  const result: IDataObject = {};
  for (const entry of fields) {
    if (entry.key) {
      result[entry.key] = entry.value ?? '';
    }
  }
  return Object.keys(result).length ? result : undefined;
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
  } else {
    const resume = this.getNodeParameter('resume', itemIndex, '') as string;
    if (resume) {
      body.resume = resume;
    }
    const description = this.getNodeParameter('description', itemIndex, '') as string;
    if (description) {
      body.description = description;
    }
  }

  const priority = this.getNodeParameter('priority', itemIndex, '') as string;
  if (priority) {
    body.priority = priority;
  }

  const askedBy = parseOptionalInt(getResourceId(this, 'askedBy', itemIndex));
  if (askedBy !== undefined) {
    body.asked_by = askedBy;
  }

  const assignedTo = parseOptionalInt(getResourceId(this, 'assignedTo', itemIndex));
  if (assignedTo !== undefined) {
    body.assigned_to = assignedTo;
  }

  const assignedGroup = parseOptionalInt(getResourceId(this, 'assignedGroup', itemIndex));
  if (assignedGroup !== undefined) {
    body.assigned_group = assignedGroup;
  }

  const statut = parseOptionalInt(this.getNodeParameter('statusId', itemIndex, ''));
  if (statut !== undefined) {
    body.statut = statut;
  }

  const desiredResolutionDate = this.getNodeParameter(
    'desiredResolutionDate',
    itemIndex,
    '',
  ) as string;
  if (desiredResolutionDate) {
    body.desired_resolution_date = desiredResolutionDate;
  }

  const customFields = buildCustomFieldsFromUi(
    this.getNodeParameter('customFieldsUi', itemIndex, {}) as CustomFieldsUi,
  );
  if (customFields) {
    body.custom_fields = customFields;
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
