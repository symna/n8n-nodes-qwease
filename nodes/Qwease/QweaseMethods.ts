import type {
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from 'n8n-workflow';

import { qweaseApiRequest, qweaseListFromResponse } from './GenericFunctions';

export async function getForms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  const ticketType = this.getCurrentNodeParameter('type') as string | undefined;
  const response = await qweaseApiRequest.call(this, 'GET', '/forms/');
  const forms = qweaseListFromResponse(response);

  const filtered = ticketType
    ? forms.filter((form) => (form.form_type as string) === ticketType)
    : forms;

  if (filtered.length === 0) {
    return [
      {
        name: 'No forms found — check type or API access',
        value: '',
      },
    ];
  }

  return filtered.map((form) => {
    const id = form.id as number;
    const label = (form.name as string) || (form.title as string) || `Form ${id}`;
    const kind = (form.form_type as string) || ticketType || '';
    return {
      name: kind ? `${label} (${kind})` : label,
      value: id,
    };
  });
}

export async function getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  const response = await qweaseApiRequest.call(this, 'GET', '/users/');
  const users = qweaseListFromResponse(response);

  if (users.length === 0) {
    return [{ name: 'No users found', value: '' }];
  }

  return users.map((user) => {
    const id = user.id as number;
    const email = (user.email as string) || '';
    const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
    const label = name && email ? `${name} · ${email}` : email || name || `User ${id}`;
    return { name: label, value: id };
  });
}

export async function getClients(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  const response = await qweaseApiRequest.call(this, 'GET', '/client/');
  const clients = qweaseListFromResponse(response);

  if (clients.length === 0) {
    return [{ name: 'No organizations found', value: '' }];
  }

  return clients.map((client) => {
    const id = client.id as number;
    const label =
      (client.display_name as string) || (client.name as string) || `Organization ${id}`;
    return { name: label, value: id };
  });
}

export async function getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  const response = await qweaseApiRequest.call(this, 'GET', '/teams/');
  const teams = qweaseListFromResponse(response);

  if (teams.length === 0) {
    return [{ name: 'No teams found', value: '' }];
  }

  return teams.map((team) => {
    const id = team.id as number;
    const label = (team.display_name as string) || (team.name as string) || `Team ${id}`;
    return { name: label, value: id };
  });
}
