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
        operation: ['create'],
      },
    },
    default: '',
  },
  {
    displayName: 'Subject',
    name: 'resume',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['update'],
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
    displayName: 'Description',
    name: 'description',
    type: 'string',
    typeOptions: { rows: 4 },
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['update'],
      },
    },
    default: '',
  },
  {
    displayName: 'Priority',
    name: 'priority',
    type: 'options',
    options: [
      { name: 'Very High', value: 'very_high' },
      { name: 'High', value: 'high' },
      { name: 'Medium', value: 'medium' },
      { name: 'Low', value: 'low' },
      { name: 'Very Low', value: 'very_low' },
    ],
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    default: '',
    description: 'Ticket priority',
  },
  {
    displayName: 'Client Organization',
    name: 'client',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getClients',
    },
    default: '',
    description: 'Organization (client) for the ticket',
  },
  {
    displayName: 'Requested By',
    name: 'askedBy',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getUsers',
    },
    default: '',
    description: 'User who requested the ticket (asked_by)',
  },
  {
    displayName: 'Assigned To',
    name: 'assignedTo',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getUsers',
    },
    default: '',
    description: 'Agent responsible for the ticket',
  },
  {
    displayName: 'Assigned Group',
    name: 'assignedGroup',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getTeams',
    },
    default: '',
    description: 'Support team assigned to the ticket',
  },
  {
    displayName: 'Status ID',
    name: 'statusId',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    default: '',
    description: 'Status item ID (statut) from your Qwease tenant',
  },
  {
    displayName: 'Process',
    name: 'process',
    type: 'options',
    options: [
      { name: 'Open', value: 'open' },
      { name: 'Closed', value: 'closed' },
    ],
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    default: '',
    description: 'Ticket lifecycle process state',
  },
  {
    displayName: 'Desired Resolution Date',
    name: 'desiredResolutionDate',
    type: 'dateTime',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    default: '',
  },
  {
    displayName: 'Follow Up Count',
    name: 'followUpCount',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    default: '',
  },
  {
    displayName: 'Last Follow Up',
    name: 'lastFollowUp',
    type: 'dateTime',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    default: '',
  },
  {
    displayName: 'Task IDs',
    name: 'taskIds',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    default: '',
    description: 'Comma-separated task IDs to link (e.g. 12, 34)',
  },
  {
    displayName: 'Custom Fields',
    name: 'customFieldsUi',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    default: {},
    placeholder: 'Add Custom Field',
    description:
      'Keys = technical_name from Qwease (e.g. Customfield1). List fields = option ID as value.',
    options: [
      {
        displayName: 'Field',
        name: 'field',
        values: [
          {
            displayName: 'Technical Name',
            name: 'key',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
          },
        ],
      },
    ],
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
