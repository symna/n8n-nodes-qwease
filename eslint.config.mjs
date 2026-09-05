import { config } from '@n8n/node-cli/eslint';

export default [
	...config,
	{
		rules: {
			// INodePropertyMode has no `default` in current n8n-workflow types;
			// autofix would break the TypeScript build.
			'n8n-nodes-base/node-param-default-missing': 'off',
		},
	},
];
