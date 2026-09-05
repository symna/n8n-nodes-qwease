import { config } from '@n8n/node-cli/eslint';

export default [
	...config,
	{
		rules: {
			// Scan beta forbids usableAsTool on triggers; local recommended still requires it.
			'@n8n/community-nodes/node-usable-as-tool': 'off',
			// Modes use `default: ''` + `as unknown as modes` (types omit default; scan requires it).
			'n8n-nodes-base/node-param-array-type-assertion': 'off',
		},
	},
];
