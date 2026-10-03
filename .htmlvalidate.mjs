export default {
	extends: [
		'html-validate:recommended',
		'html-validate:document',
		'html-validate:prettier'
	],
	rules: {
		// Subresource integrity matters for files from other servers, not for our own bundle.
		'require-sri': ['error', { target: 'crossorigin' }],
		// Prettier wraps <title> onto 3 lines, and this rule counts that whitespace.
		// Title length is part of the later SEO work (see TODO.md).
		'long-title': 'off',
		// Phone links keep the number on one line with the whitespace-nowrap class
		// instead of &nbsp; entities. whitespace-normal marks a tel: link whose text
		// is not a phone number and may wrap.
		'tel-non-breaking': [
			'error',
			{ ignoreClasses: ['whitespace-nowrap', 'whitespace-normal'] }
		]
	}
}
