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

const customFieldsProperty: INodeProperties = {
  displayName: 'Custom Fields',
  name: 'customFieldsUi',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
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
};

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
    displayName: 'Status ID',
    name: 'statusId',
    type: 'number',
    default: '',
    description: 'Status item ID (statut) from your Qwease tenant',
  },
  {
    displayName: 'Desired Resolution Date',
    name: 'desiredResolutionDate',
    type: 'dateTime',
    default: '',
  },
  customFieldsProperty,
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
