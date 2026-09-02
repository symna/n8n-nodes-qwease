import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

type CustomFieldsUi = {
  field?: Array<{ key: string; value: string }>;
};

function parseOptionalInt(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const n = typeof value === 'number' ? value : parseInt(String(value), 10);
  return Number.isNaN(n) ? undefined : n;
}

function parseTaskIds(value: unknown): number[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const raw = String(value);
  const ids = raw
    .split(',')
    .map((part) => parseInt(part.trim(), 10))
    .filter((n) => !Number.isNaN(n));
  return ids.length ? ids : undefined;
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
    body.type = this.getNodeParameter('type', itemIndex) as string;
    body.form = this.getNodeParameter('form', itemIndex) as number;
    body.for_user = this.getNodeParameter('forUser', itemIndex) as number;
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

  const client = parseOptionalInt(this.getNodeParameter('client', itemIndex, ''));
  if (client !== undefined) {
    body.client = client;
  }

  const askedBy = parseOptionalInt(this.getNodeParameter('askedBy', itemIndex, ''));
  if (askedBy !== undefined) {
    body.asked_by = askedBy;
  }

  const assignedTo = parseOptionalInt(this.getNodeParameter('assignedTo', itemIndex, ''));
  if (assignedTo !== undefined) {
    body.assigned_to = assignedTo;
  }

  const assignedGroup = parseOptionalInt(this.getNodeParameter('assignedGroup', itemIndex, ''));
  if (assignedGroup !== undefined) {
    body.assigned_group = assignedGroup;
  }

  const statut = parseOptionalInt(this.getNodeParameter('statusId', itemIndex, ''));
  if (statut !== undefined) {
    body.statut = statut;
  }

  const process = this.getNodeParameter('process', itemIndex, '') as string;
  if (process) {
    body.process = process;
  }

  const desiredResolutionDate = this.getNodeParameter(
    'desiredResolutionDate',
    itemIndex,
    '',
  ) as string;
  if (desiredResolutionDate) {
    body.desired_resolution_date = desiredResolutionDate;
  }

  const followUpCount = parseOptionalInt(this.getNodeParameter('followUpCount', itemIndex, ''));
  if (followUpCount !== undefined) {
    body.follow_up_count = followUpCount;
  }

  const lastFollowUp = this.getNodeParameter('lastFollowUp', itemIndex, '') as string;
  if (lastFollowUp) {
    body.last_follow_up = lastFollowUp;
  }

  const tasks = parseTaskIds(this.getNodeParameter('taskIds', itemIndex, ''));
  if (tasks) {
    body.tasks = tasks;
  }

  const customFields = buildCustomFieldsFromUi(
    this.getNodeParameter('customFieldsUi', itemIndex, {}) as CustomFieldsUi,
  );
  if (customFields) {
    body.custom_fields = customFields;
  }

  return body;
}
