import type {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from 'n8n-workflow';

import { qweaseApiRequest, qweaseListFromResponse } from './GenericFunctions';
import {
  fetchFormFields,
  fetchFormStatusItems,
  resolveFormIdForLists,
} from './FormFieldsHelper';

function matchesFilter(label: string, filter?: string): boolean {
  if (!filter) {
    return true;
  }
  return label.toLowerCase().includes(filter.toLowerCase());
}

export async function getForms(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const ticketType = this.getCurrentNodeParameter('type') as string | undefined;
  const response = await qweaseApiRequest.call(this, 'GET', '/forms/');
  const forms = qweaseListFromResponse(response);

  const filtered = ticketType
    ? forms.filter((form) => (form.form_type as string) === ticketType)
    : forms;

  const results: INodeListSearchItems[] = [];

  for (const form of filtered) {
    const id = form.id as number;
    const label = (form.name as string) || (form.title as string) || `Form ${id}`;
    const kind = (form.form_type as string) || ticketType || '';
    const name = kind ? `${label} (${kind})` : label;
    if (!matchesFilter(name, filter)) {
      continue;
    }
    results.push({ name, value: String(id) });
  }

  if (results.length === 0) {
    return {
      results: [
        {
          name: 'No forms found — check type or API access',
          value: '',
        },
      ],
    };
  }

  return { results };
}

export async function getUsers(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = await qweaseApiRequest.call(this, 'GET', '/users/');
  const users = qweaseListFromResponse(response);

  const results: INodeListSearchItems[] = [];

  for (const user of users) {
    const id = user.id as number;
    const email = (user.email as string) || '';
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
    const name = fullName && email ? `${fullName} · ${email}` : email || fullName || `User ${id}`;
    if (!matchesFilter(name, filter)) {
      continue;
    }
    results.push({ name, value: String(id) });
  }

  if (results.length === 0) {
    return { results: [{ name: 'No users found', value: '' }] };
  }

  return { results };
}

export async function getTeams(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = await qweaseApiRequest.call(this, 'GET', '/teams/');
  const teams = qweaseListFromResponse(response);

  const results: INodeListSearchItems[] = [];

  for (const team of teams) {
    const id = team.id as number;
    const name = (team.display_name as string) || (team.name as string) || `Team ${id}`;
    if (!matchesFilter(name, filter)) {
      continue;
    }
    results.push({ name, value: String(id) });
  }

  if (results.length === 0) {
    return { results: [{ name: 'No teams found', value: '' }] };
  }

  return { results };
}

export async function getTickets(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = await qweaseApiRequest.call(this, 'GET', '/ticket/');
  const tickets = qweaseListFromResponse(response);

  const results: INodeListSearchItems[] = [];

  for (const ticket of tickets) {
    const id = ticket.id as number;
    const resume = (ticket.resume as string) || '';
    const displayName = (ticket.display_name as string) || '';
    const name = displayName || (resume ? `#${id} · ${resume}` : `Ticket ${id}`);
    if (!matchesFilter(name, filter) && !matchesFilter(String(id), filter)) {
      continue;
    }
    results.push({ name, value: String(id) });
  }

  if (results.length === 0) {
    return { results: [{ name: 'No tickets found', value: '' }] };
  }

  return { results };
}

export async function getFormStatuses(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const formId = await resolveFormIdForLists(this);
  if (!formId) {
    return {
      results: [
        {
          name: 'Select a Form (create) or Ticket (update) first',
          value: '',
        },
      ],
    };
  }

  const statuses = await fetchFormStatusItems(this, formId);
  const results: INodeListSearchItems[] = [];

  for (const status of statuses) {
    const id = status.id as number;
    const name =
      (status.display_name as string) || (status.name as string) || `Status ${id}`;
    if (!matchesFilter(name, filter) && !matchesFilter(String(id), filter)) {
      continue;
    }
    results.push({ name, value: String(id) });
  }

  if (results.length === 0) {
    return { results: [{ name: 'No statuses for this form', value: '' }] };
  }

  return { results };
}

export async function getFormCustomFields(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const formId = await resolveFormIdForLists(this);
  if (!formId) {
    return {
      results: [
        {
          name: 'Select a Form (create) or Ticket (update) first',
          value: '',
        },
      ],
    };
  }

  const fields = await fetchFormFields(this, formId);
  const results: INodeListSearchItems[] = [];

  for (const field of fields) {
    const name = `${field.name} (${field.technical_name})`;
    if (
      !matchesFilter(name, filter) &&
      !matchesFilter(field.technical_name, filter) &&
      !matchesFilter(field.name, filter)
    ) {
      continue;
    }
    results.push({ name, value: field.technical_name });
  }

  if (results.length === 0) {
    return { results: [{ name: 'No custom fields on this form', value: '' }] };
  }

  return { results };
}
