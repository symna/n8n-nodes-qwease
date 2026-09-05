import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { qweaseApiRequest, qweaseListFromResponse } from './GenericFunctions';
import {
  executeGetAll,
  executeGetById,
  parseOptionalInt,
  requireResourceId,
} from './executeHelpers';

type PageFields = IDataObject & {
  title?: string;
  pageType?: string;
  pageStatus?: string;
  parent?: unknown;
  order?: number;
  icon?: string;
  coverUrl?: string;
  color?: string;
};

type TaskFields = IDataObject & {
  taskTitle?: string;
  taskDescription?: string;
  taskPosition?: number;
  taskType?: string;
  taskStatus?: string;
  taskStatusCommentary?: string;
  taskValidator?: unknown;
};

function applyPageFields(body: IDataObject, fields: PageFields): void {
  if (fields.title) body.title = fields.title;
  if (fields.pageType) body.type = fields.pageType;
  if (fields.pageStatus) body.status = fields.pageStatus;
  const parent = parseOptionalInt(fields.parent);
  if (parent !== undefined) body.parent = parent;
  if (fields.order !== undefined && fields.order !== null) {
    body.order = fields.order;
  }
  if (fields.icon) body.icon = fields.icon;
  if (fields.coverUrl) body.cover_url = fields.coverUrl;
  if (fields.color) body.color = fields.color;
}

function applyTaskFields(body: IDataObject, fields: TaskFields): void {
  if (fields.taskTitle) body.task_title = fields.taskTitle;
  if (fields.taskDescription) body.task_description = fields.taskDescription;
  if (fields.taskPosition !== undefined && fields.taskPosition !== null) {
    body.task_position = fields.taskPosition;
  }
  if (fields.taskType) body.task_type = fields.taskType;
  if (fields.taskStatus) body.task_status = fields.taskStatus;
  if (fields.taskStatusCommentary) {
    body.task_status_commentary = fields.taskStatusCommentary;
  }
  const validator = parseOptionalInt(fields.taskValidator);
  if (validator !== undefined) body.task_validator = validator;
}

export async function executeKnowledge(
  this: IExecuteFunctions,
  itemIndex: number,
  operation: string,
): Promise<INodeExecutionData[]> {
  if (operation === 'get') {
    return [await executeGetById(this, itemIndex, '/pages/', 'pageId', 'Page')];
  }
  if (operation === 'getAll') {
    return executeGetAll(this, itemIndex, '/pages/');
  }
  if (operation === 'search') {
    const q = this.getNodeParameter('knowledgeQuery', itemIndex) as string;
    const response = await qweaseApiRequest.call(this, 'GET', '/pages/search/', {}, { q });
    const list = qweaseListFromResponse(response);
    if (list.length === 0 && response && typeof response === 'object') {
      return [{ json: response as IDataObject, pairedItem: { item: itemIndex } }];
    }
    return list.map((entry) => ({ json: entry, pairedItem: { item: itemIndex } }));
  }
  if (operation === 'create') {
    const body: IDataObject = {
      title: this.getNodeParameter('title', itemIndex) as string,
      type: this.getNodeParameter('pageType', itemIndex) as string,
      status: this.getNodeParameter('pageStatus', itemIndex) as string,
    };
    const additional = this.getNodeParameter('additionalFields', itemIndex, {}) as PageFields;
    applyPageFields(body, additional);
    const response = await qweaseApiRequest.call(this, 'POST', '/pages/', body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  if (operation === 'update') {
    const pageId = requireResourceId(this, 'pageId', itemIndex, 'Page');
    const fields = this.getNodeParameter('updateFields', itemIndex, {}) as PageFields;
    const body: IDataObject = {};
    applyPageFields(body, fields);
    if (Object.keys(body).length === 0) {
      throw new Error('Set at least one field to update.');
    }
    const response = await qweaseApiRequest.call(this, 'PATCH', `/pages/${pageId}/`, body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  if (operation === 'updateContent') {
    const pageId = requireResourceId(this, 'pageId', itemIndex, 'Page');
    const contentRaw = this.getNodeParameter('content', itemIndex);
    const body =
      typeof contentRaw === 'string' ? (JSON.parse(contentRaw) as IDataObject) : (contentRaw as IDataObject);
    const response = await qweaseApiRequest.call(this, 'PATCH', `/pages/${pageId}/content/`, body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  throw new Error(`Unknown knowledge operation: ${operation}`);
}

export async function executeTask(
  this: IExecuteFunctions,
  itemIndex: number,
  operation: string,
): Promise<INodeExecutionData[]> {
  if (operation === 'get') {
    return [await executeGetById(this, itemIndex, '/tasks/', 'taskId', 'Task')];
  }
  if (operation === 'getAll') {
    return executeGetAll(this, itemIndex, '/tasks/');
  }
  if (operation === 'create') {
    const ticket = parseOptionalInt(
      this.getNodeParameter('ticket', itemIndex, undefined, { extractValue: true }),
    );
    if (!ticket) {
      throw new Error('Select a Ticket (list or ID).');
    }
    const body: IDataObject = {
      ticket,
      task_title: this.getNodeParameter('taskTitle', itemIndex) as string,
      task_position: this.getNodeParameter('taskPosition', itemIndex) as number,
    };
    const additional = this.getNodeParameter('additionalFields', itemIndex, {}) as TaskFields;
    applyTaskFields(body, additional);
    const response = await qweaseApiRequest.call(this, 'POST', '/tasks/', body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  if (operation === 'update') {
    const taskId = requireResourceId(this, 'taskId', itemIndex, 'Task');
    const fields = this.getNodeParameter('updateFields', itemIndex, {}) as TaskFields;
    const body: IDataObject = {};
    applyTaskFields(body, fields);
    if (Object.keys(body).length === 0) {
      throw new Error('Set at least one field to update.');
    }
    const response = await qweaseApiRequest.call(this, 'PATCH', `/tasks/${taskId}/`, body);
    return [{ json: response, pairedItem: { item: itemIndex } }];
  }
  throw new Error(`Unknown task operation: ${operation}`);
}
