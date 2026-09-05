import type { INodeProperties } from 'n8n-workflow';

import {
  customFieldsFixedCollection,
  resourceLocatorModes,
  returnAllLimitFields,
} from './shared';

export const meOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['me'] } },
    options: [{ name: 'Get', value: 'get', action: 'Get current user profile' }],
    default: 'get',
  },
];

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['user'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a user' },
      { name: 'Get', value: 'get', action: 'Get a user' },
      { name: 'Get Many', value: 'getAll', action: 'Get many users' },
      { name: 'Update', value: 'update', action: 'Update a user' },
    ],
    default: 'getAll',
  },
];

export const userFields: INodeProperties[] = [
  {
    displayName: 'User',
    name: 'userId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: { show: { resource: ['user'], operation: ['get', 'update'] } },
    modes: resourceLocatorModes('getUsers', 'Select a user...'),
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['user'], operation: ['create'] } },
    default: '',
  },
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['user'], operation: ['create'] } },
    default: '',
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['user'], operation: ['create'] } },
    default: '',
  },
  {
    displayName: 'Organization',
    name: 'client',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: { show: { resource: ['user'], operation: ['create'] } },
    description: 'Organization (client) the user belongs to',
    modes: resourceLocatorModes('getClients', 'Select an organization...'),
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['user'], operation: ['create'] } },
    options: [
      {
        displayName: 'Active',
        name: 'isActive',
        type: 'boolean',
        default: true,
      },
      customFieldsFixedCollection,
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['user'], operation: ['update'] } },
    options: [
      { displayName: 'Email', name: 'email', type: 'string', default: '' },
      { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
      { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
      {
        displayName: 'Organization',
        name: 'client',
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        modes: resourceLocatorModes('getClients', 'Select an organization...'),
      },
      { displayName: 'Active', name: 'isActive', type: 'boolean', default: true },
      customFieldsFixedCollection,
    ],
  },
  ...returnAllLimitFields('user'),
];

export const organizationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['organization'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create an organization' },
      { name: 'Get', value: 'get', action: 'Get an organization' },
      { name: 'Get Many', value: 'getAll', action: 'Get many organizations' },
      { name: 'Update', value: 'update', action: 'Update an organization' },
    ],
    default: 'getAll',
  },
];

export const organizationFields: INodeProperties[] = [
  {
    displayName: 'Organization',
    name: 'organizationId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: { show: { resource: ['organization'], operation: ['get', 'update'] } },
    modes: resourceLocatorModes('getClients', 'Select an organization...'),
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['organization'], operation: ['create'] } },
    default: '',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['organization'], operation: ['create'] } },
    options: [
      { displayName: 'Active', name: 'isActive', type: 'boolean', default: true },
      customFieldsFixedCollection,
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['organization'], operation: ['update'] } },
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '' },
      { displayName: 'Active', name: 'isActive', type: 'boolean', default: true },
      customFieldsFixedCollection,
    ],
  },
  ...returnAllLimitFields('organization'),
];

export const deviceOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['device'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a device' },
      { name: 'Get', value: 'get', action: 'Get a device' },
      { name: 'Get Many', value: 'getAll', action: 'Get many devices' },
      { name: 'Update', value: 'update', action: 'Update a device' },
    ],
    default: 'getAll',
  },
];

export const deviceFields: INodeProperties[] = [
  {
    displayName: 'Device',
    name: 'deviceId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: { show: { resource: ['device'], operation: ['get', 'update'] } },
    modes: resourceLocatorModes('getDevices', 'Select a device...'),
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['device'], operation: ['create'] } },
    default: '',
  },
  {
    displayName: 'Organization',
    name: 'client',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: { show: { resource: ['device'], operation: ['create'] } },
    modes: resourceLocatorModes('getClients', 'Select an organization...'),
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['device'], operation: ['create'] } },
    options: [
      { displayName: 'Serial Number', name: 'serialNumber', type: 'string', default: '' },
      {
        displayName: 'Owner',
        name: 'owner',
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        modes: resourceLocatorModes('getUsers', 'Select a user...'),
      },
      { displayName: 'Active', name: 'isActive', type: 'boolean', default: true },
      customFieldsFixedCollection,
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['device'], operation: ['update'] } },
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '' },
      {
        displayName: 'Organization',
        name: 'client',
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        modes: resourceLocatorModes('getClients', 'Select an organization...'),
      },
      { displayName: 'Serial Number', name: 'serialNumber', type: 'string', default: '' },
      {
        displayName: 'Owner',
        name: 'owner',
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        modes: resourceLocatorModes('getUsers', 'Select a user...'),
      },
      { displayName: 'Active', name: 'isActive', type: 'boolean', default: true },
      customFieldsFixedCollection,
    ],
  },
  ...returnAllLimitFields('device'),
];

export const teamOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['team'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a team' },
      { name: 'Get', value: 'get', action: 'Get a team' },
      { name: 'Get Many', value: 'getAll', action: 'Get many teams' },
      { name: 'Update', value: 'update', action: 'Update a team' },
    ],
    default: 'getAll',
  },
];

export const teamFields: INodeProperties[] = [
  {
    displayName: 'Team',
    name: 'teamId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: { show: { resource: ['team'], operation: ['get', 'update'] } },
    modes: resourceLocatorModes('getTeams', 'Select a team...'),
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['team'], operation: ['create'] } },
    default: '',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['team'], operation: ['create'] } },
    options: [
      {
        displayName: 'Organization IDs',
        name: 'clientIds',
        type: 'string',
        default: '',
        description: 'Comma-separated organization IDs',
      },
      {
        displayName: 'Member IDs',
        name: 'memberIds',
        type: 'string',
        default: '',
        description: 'Comma-separated user IDs',
      },
      {
        displayName: 'Administrator IDs',
        name: 'administratorIds',
        type: 'string',
        default: '',
        description: 'Comma-separated user IDs',
      },
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['team'], operation: ['update'] } },
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '' },
      {
        displayName: 'Organization IDs',
        name: 'clientIds',
        type: 'string',
        default: '',
        description: 'Comma-separated organization IDs',
      },
      {
        displayName: 'Member IDs',
        name: 'memberIds',
        type: 'string',
        default: '',
        description: 'Comma-separated user IDs',
      },
      {
        displayName: 'Administrator IDs',
        name: 'administratorIds',
        type: 'string',
        default: '',
        description: 'Comma-separated user IDs',
      },
    ],
  },
  ...returnAllLimitFields('team'),
];

export const searchOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['search'] } },
    options: [
      {
        name: 'Advanced Search',
        value: 'advanced',
        action: 'Advanced ticket search',
        description: 'POST /advanced-search/ — filtered ticket list (same engine as support filters)',
      },
      {
        name: 'Quick Search',
        value: 'quick',
        action: 'Quick search',
        description: 'GET /search/ — search tickets or users by text',
      },
    ],
    default: 'advanced',
  },
];

export const searchFields: INodeProperties[] = [
  {
    displayName: 'Conditions (JSON)',
    name: 'conditionsJson',
    type: 'json',
    required: true,
    displayOptions: { show: { resource: ['search'], operation: ['advanced'] } },
    default:
      '{\n  "condition": {\n    "equation_type": "and",\n    "equation": []\n  }\n}',
    description:
      'Envelope with condition tree (conditions.condition). Empty equation = all visible tickets. See swagger /advanced-search/.',
  },
  {
    displayName: 'Search Text',
    name: 'searchText',
    type: 'string',
    displayOptions: { show: { resource: ['search'], operation: ['advanced'] } },
    default: '',
    description: 'Optional text search (min 2 characters)',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    typeOptions: { minValue: 1 },
    displayOptions: { show: { resource: ['search'], operation: ['advanced'] } },
    default: 1,
  },
  {
    displayName: 'Page Size',
    name: 'pageSize',
    type: 'number',
    typeOptions: { minValue: 1 },
    displayOptions: { show: { resource: ['search'], operation: ['advanced'] } },
    default: 10,
  },
  {
    displayName: 'Ordering',
    name: 'ordering',
    type: 'string',
    displayOptions: { show: { resource: ['search'], operation: ['advanced'] } },
    default: '',
    description: 'e.g. -created_at',
  },
  {
    displayName: 'Include Custom Fields Display',
    name: 'customFieldsDisplay',
    type: 'boolean',
    displayOptions: { show: { resource: ['search'], operation: ['advanced'] } },
    default: false,
  },
  {
    displayName: 'Return All Pages',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { resource: ['search'], operation: ['advanced'] } },
    default: false,
    description: 'If enabled, paginates until all results are fetched (ignores Page)',
  },
  {
    displayName: 'Query',
    name: 'query',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['search'], operation: ['quick'] } },
    default: '',
  },
  {
    displayName: 'Type',
    name: 'searchType',
    type: 'options',
    options: [
      { name: 'Ticket', value: 'ticket' },
      { name: 'User', value: 'user' },
    ],
    displayOptions: { show: { resource: ['search'], operation: ['quick'] } },
    default: 'ticket',
  },
  {
    displayName: 'Limit',
    name: 'quickLimit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 100 },
    displayOptions: { show: { resource: ['search'], operation: ['quick'] } },
    default: 10,
  },
];
