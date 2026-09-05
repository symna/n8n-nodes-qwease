import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class QweaseApi implements ICredentialType {
  name = 'qweaseApi';

  displayName = 'Qwease API';

  icon = 'file:qwease.svg' as const;

  documentationUrl = 'https://rest.qwease.fr/swagger/';

  properties: INodeProperties[] = [
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Bearer token from Qwease Administration (paste the token only, without the "Bearer" prefix)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiToken}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://rest.qwease.fr/api',
      url: '/me/',
    },
  };
}
