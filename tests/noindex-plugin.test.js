import { describe, it, expect } from 'vitest'
import { noindexPlugin } from '../scripts/vite-plugin-noindex.js'

describe('noindexPlugin', () => {
	it('adds a robots noindex meta tag to the head when enabled', () => {
		expect(noindexPlugin(true).transformIndexHtml()).toEqual([
			{
				tag: 'meta',
				attrs: { name: 'robots', content: 'noindex' },
				injectTo: 'head'
			}
		])
	})

	it('adds nothing when disabled', () => {
		expect(noindexPlugin(false).transformIndexHtml()).toEqual([])
	})
})
