import type { INodeProperties } from 'n8n-workflow';

export const idModeValidation = [
  {
    type: 'regex' as const,
    properties: {
      regex: '^[0-9]+$',
      errorMessage: 'ID must be a positive integer',
    },
  },
];

export function resourceLocatorModes(
  searchListMethod: string,
  listPlaceholder: string,
  idPlaceholder = '1',
): NonNullable<INodeProperties['modes']> {
  return [
    {
      displayName: 'From List',
      name: 'list',
      type: 'list',
      placeholder: listPlaceholder,
      typeOptions: {
        searchListMethod,
        searchable: true,
      },
    },
    {
      displayName: 'By ID',
      name: 'id',
      type: 'string',
      placeholder: idPlaceholder,
      validation: idModeValidation,
    },
  ];
}

export const returnAllLimitFields = (resource: string): INodeProperties[] => [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: [resource],
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
        resource: [resource],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    default: 50,
  },
];

export const customFieldsFixedCollection: INodeProperties = {
  displayName: 'Custom Fields',
  name: 'customFieldsUi',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  default: {},
  placeholder: 'Add Custom Field',
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
