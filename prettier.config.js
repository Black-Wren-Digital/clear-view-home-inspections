/** @type {import('prettier').Config} */
export default {
	plugins: ['prettier-plugin-tailwindcss'],
	tailwindStylesheet: './src/main.css',
	semi: false,
	singleQuote: true,
	trailingComma: 'none',
	useTabs: true,
	tabWidth: 2,
	arrowParens: 'avoid',
	printWidth: 80,
	overrides: [
		{
			// Tabs in nested Markdown lists render inconsistently, so Markdown keeps spaces.
			files: '*.md',
			options: { useTabs: false }
		}
	]
}
