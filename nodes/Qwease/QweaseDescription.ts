import type { INodeProperties } from 'n8n-workflow';

import { customFieldsFixedCollectionWithList } from './shared';

export const ticketOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['ticket'],
      },
    },
    options: [
      {
        name: 'Add Comment',
        value: 'addComment',
        action: 'Add a comment to a ticket',
      },
      {
        name: 'Create',
        value: 'create',
        action: 'Create a ticket',
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a ticket',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many tickets',
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update a ticket',
      },
    ],
    default: 'getAll',
  },
];

const idModeValidation = [
  {
    type: 'regex' as const,
    properties: {
      regex: '^[0-9]+$',
      errorMessage: 'ID must be a positive integer',
    },
  },
];

const userResourceLocatorModes: INodeProperties['modes'] = [
  {
    displayName: 'From List',
    name: 'list',
    type: 'list',
    placeholder: 'Select a user...',
    typeOptions: {
      searchListMethod: 'getUsers',
      searchable: true,
    },
  },
  {
    displayName: 'By ID',
    name: 'id',
    type: 'string',
    placeholder: '1',
    validation: idModeValidation,
  },
];

const teamResourceLocatorModes: INodeProperties['modes'] = [
  {
    displayName: 'From List',
    name: 'list',
    type: 'list',
    placeholder: 'Select a team...',
    typeOptions: {
      searchListMethod: 'getTeams',
      searchable: true,
    },
  },
  {
    displayName: 'By ID',
    name: 'id',
    type: 'string',
    placeholder: '1',
    validation: idModeValidation,
  },
];

const priorityOptions = [
  { name: 'Very High', value: 'very_high' },
  { name: 'High', value: 'high' },
  { name: 'Medium', value: 'medium' },
  { name: 'Low', value: 'low' },
  { name: 'Very Low', value: 'very_low' },
];

const optionalTicketFields: INodeProperties[] = [
  {
    displayName: 'Priority',
    name: 'priority',
    type: 'options',
    options: priorityOptions,
    default: '',
    description: 'Ticket priority',
  },
  {
    displayName: 'Requested By',
    name: 'askedBy',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'User who requested the ticket (asked_by)',
    modes: userResourceLocatorModes,
  },
  {
    displayName: 'Assigned To',
    name: 'assignedTo',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Agent responsible for the ticket',
    modes: userResourceLocatorModes,
  },
  {
    displayName: 'Assigned Group',
    name: 'assignedGroup',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Support team assigned to the ticket',
    modes: teamResourceLocatorModes,
  },
  {
    displayName: 'Status',
    name: 'statusId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Status from the form status model',
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select a status...',
        typeOptions: {
          searchListMethod: 'getFormStatuses',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: '1',
        validation: idModeValidation,
      },
    ],
  },
  {
    displayName: 'Desired Resolution Date',
    name: 'desiredResolutionDate',
    type: 'dateTime',
    default: '',
  },
  customFieldsFixedCollectionWithList(
    'getFormCustomFields',
    'Fields from the selected form (Create) or ticket form (Update).',
  ),
];

export const ticketFields: INodeProperties[] = [
  {
    displayName: 'Ticket',
    name: 'ticketId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['get', 'update', 'addComment'],
      },
    },
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select a ticket...',
        typeOptions: {
          searchListMethod: 'getTickets',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: '123',
        validation: idModeValidation,
      },
    ],
  },
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    options: [
      { name: 'Incident (INC)', value: 'INC' },
      { name: 'Request (REQ)', value: 'REQ' },
    ],
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    default: 'INC',
    description: 'Filters the form list below',
  },
  {
    displayName: 'Form',
    name: 'form',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    description: 'Ticket form from your Qwease tenant',
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select a form...',
        typeOptions: {
          searchListMethod: 'getForms',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: '1',
        validation: idModeValidation,
      },
    ],
  },
  {
    displayName: 'For User',
    name: 'forUser',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    description: 'Impacted / requester user in Qwease',
    modes: userResourceLocatorModes,
  },
  {
    displayName: 'Subject',
    name: 'resume',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    default: '',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    required: true,
    typeOptions: { rows: 4 },
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    default: '',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    options: optionalTicketFields,
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Subject',
        name: 'resume',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
      },
      ...optionalTicketFields,
    ],
  },
  {
    displayName: 'Comment',
    name: 'comment',
    type: 'string',
    required: true,
    typeOptions: { rows: 4 },
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['addComment'],
      },
    },
    default: '',
  },
  {
    displayName: 'Internal Comment',
    name: 'commentPrivate',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['addComment'],
      },
    },
    default: false,
    description: 'Whether the comment is internal (not visible to requester)',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
				description: 'Whether to return all results or only up to a given limit',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['getAll'],
      },
    },
    default: false,
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
				description: 'Max number of results to return',
    typeOptions: { minValue: 1 },
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    default: 50,
  },
];
