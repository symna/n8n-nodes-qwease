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

const idModeValidation = [
  {
    type: 'regex' as const,
    properties: {
      regex: '^[0-9]+$',
      errorMessage: 'ID must be a positive integer',
    },
  },
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
        operation: ['get', 'update'],
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
    modes: [
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
    ],
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
    displayName: 'Requested By',
    name: 'askedBy',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    description: 'User who requested the ticket (asked_by)',
    modes: [
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
    ],
  },
  {
    displayName: 'Assigned To',
    name: 'assignedTo',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    description: 'Agent responsible for the ticket',
    modes: [
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
    ],
  },
  {
    displayName: 'Assigned Group',
    name: 'assignedGroup',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create', 'update'],
      },
    },
    description: 'Support team assigned to the ticket',
    modes: [
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
    ],
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
