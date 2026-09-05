import type {
  IExecuteFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
  ILoadOptionsFunctions,
} from 'n8n-workflow';

const BASE_URL = 'https://rest.qwease.fr/api';

export type QweaseContext = IExecuteFunctions | ILoadOptionsFunctions;

export function qweaseListFromResponse(response: IDataObject | IDataObject[]): IDataObject[] {
  if (Array.isArray(response)) {
    return response;
  }
  const results = response.results ?? response.data;
  if (Array.isArray(results)) {
    return results;
  }
  return [];
}

export async function qweaseApiRequest(
  this: QweaseContext,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
): Promise<IDataObject> {
  const options: IHttpRequestOptions = {
    method,
    url: `${BASE_URL}${endpoint}`,
    json: true,
  };

  if (Object.keys(body).length) {
    options.body = body;
  }

  if (Object.keys(qs).length) {
    options.qs = qs;
  }

  return await this.helpers.httpRequestWithAuthentication.call(this, 'qweaseApi', options);
}
