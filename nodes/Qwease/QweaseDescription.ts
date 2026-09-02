import type { INodeProperties } from 'n8n-workflow';

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

export const ticketFields: INodeProperties[] = [
  {
    displayName: 'Ticket ID',
    name: 'ticketId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['get', 'update'],
      },
    },
    default: '',
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
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getForms',
      loadOptionsDependsOn: ['type'],
    },
    default: '',
    description: 'Ticket form from your Qwease tenant (loaded from API)',
  },
  {
    displayName: 'For User',
    name: 'forUser',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getUsers',
    },
    default: '',
    description: 'Requester user in Qwease',
  },
  {
    displayName: 'Subject',
    name: 'resume',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    default: '',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
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
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
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
