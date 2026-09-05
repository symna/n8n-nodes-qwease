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
      default: '',
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
      default: '',
      placeholder: idPlaceholder,
      validation: idModeValidation,
    },
  ] as unknown as NonNullable<INodeProperties['modes']>;
}

export const returnAllLimitFields = (resource: string): INodeProperties[] => [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
				description: 'Whether to return all results or only up to a given limit',
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
				description: 'Max number of results to return',
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

export function multiOptionsFromLoad(
  displayName: string,
  name: string,
  loadOptionsMethod: string,
  description?: string,
): INodeProperties {
  return {
    displayName,
    name,
    type: 'multiOptions',
    typeOptions: {
      loadOptionsMethod,
    },
    default: [],
    description,
  };
}

/** Custom fields with From list / By Name (listSearch method varies by scope) */
export function customFieldsFixedCollectionWithList(
  searchListMethod: string,
  description = 'Pick a field from your Qwease tenant (or enter technical_name)',
): INodeProperties {
  return {
    displayName: 'Custom Fields',
    name: 'customFieldsUi',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    placeholder: 'Add Custom Field',
    description,
    options: [
      {
        displayName: 'Field',
        name: 'field',
        values: [
          {
            displayName: 'Field',
            name: 'key',
            type: 'resourceLocator',
            default: { mode: 'list', value: '' },
            modes: [
              {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                default: '',
                placeholder: 'Select a field...',
                typeOptions: {
                  searchListMethod,
                  searchable: true,
                },
              },
              {
                displayName: 'By Name',
                name: 'name',
                type: 'string',
                default: '',
                placeholder: 'Customfield1',
                hint: 'technical_name from Qwease',
              },
            ] as unknown as NonNullable<INodeProperties['modes']>,
          },
          {
            displayName: 'Field Value',
            name: 'value',
            type: 'resourceLocator',
            default: { mode: 'list', value: '' },
            description:
              'For list fields: pick an option. Otherwise switch to By Value and enter text / ID.',
            typeOptions: {
              loadOptionsDependsOn: ['&key', '&key.value'],
            },
            modes: [
              {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                default: '',
                placeholder: 'Select an option...',
                typeOptions: {
                  searchListMethod: 'getCustomFieldOptions',
                  searchable: true,
                },
              },
              {
                displayName: 'By Value',
                name: 'id',
                type: 'string',
                default: '',
                placeholder: 'Text value or option ID',
                hint: 'Use for non-list fields, or paste an option ID',
              },
            ] as unknown as NonNullable<INodeProperties['modes']>,
          },
        ],
      },
    ],
  };
}
