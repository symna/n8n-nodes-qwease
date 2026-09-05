import { config } from '@n8n/node-cli/eslint';

export default [
	...config,
	{
		rules: {
			// INodePropertyMode has no `default` in current n8n-workflow types;
			// autofix would break the TypeScript build.
			'n8n-nodes-base/node-param-default-missing': 'off',
			// Official docs allow PNG 60×60; community lint 0.23 still SVG-only.
			// PNG keeps the validated brand mark (gradient) without broken embeds.
			'n8n-nodes-base/node-class-description-icon-not-svg': 'off',
			'@n8n/community-nodes/icon-validation': 'off',
		},
	},
];
