import type {
  IExecuteFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
} from 'n8n-workflow';

const BASE_URL = 'https://rest.qwease.fr/api';

export async function qweaseApiRequest(
  this: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
): Promise<any> {
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

  return this.helpers.httpRequestWithAuthentication.call(this, 'qweaseApi', options);
}
