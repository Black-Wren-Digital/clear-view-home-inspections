import { describe, it, expect, beforeEach } from 'vitest'
import { initVideo, EMBED_BASE } from '../src/js/video.js'

beforeEach(() => {
	document.body.innerHTML = `
    <div class="relative" id="frame">
      <button type="button" data-video-id="H6RSqJ-COWg" data-video-title="Clear View Home Inspections">Play</button>
    </div>`
	initVideo()
})

const frame = () => document.getElementById('frame')

describe('initVideo', () => {
	it('does not add an iframe before a click', () => {
		expect(frame().querySelector('iframe')).toBeNull()
	})

	it('replaces the button with a privacy-enhanced YouTube iframe on click', () => {
		frame().querySelector('button').click()
		const iframe = frame().querySelector('iframe')
		expect(frame().querySelector('button')).toBeNull()
		expect(iframe.getAttribute('src')).toBe(
			`${EMBED_BASE}H6RSqJ-COWg?autoplay=1&rel=0`
		)
		expect(EMBED_BASE).toBe('https://www.youtube-nocookie.com/embed/')
	})

	it('gives the iframe a title and the permissions it needs', () => {
		frame().querySelector('button').click()
		const iframe = frame().querySelector('iframe')
		expect(iframe.getAttribute('title')).toBe('Clear View Home Inspections')
		expect(iframe.getAttribute('allow')).toContain('autoplay')
		expect(iframe.hasAttribute('allowfullscreen')).toBe(true)
		expect(iframe.getAttribute('class')).toBe('absolute inset-0 h-full w-full')
	})

	it('adds only one iframe when the button is clicked twice', () => {
		const button = frame().querySelector('button')
		button.click()
		button.click()
		expect(frame().querySelectorAll('iframe')).toHaveLength(1)
	})
})
