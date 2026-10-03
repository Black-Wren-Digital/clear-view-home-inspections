// Swaps a video poster button for the YouTube player only when the visitor clicks it,
// so the page sends no request to YouTube before that.
export const EMBED_BASE = 'https://www.youtube-nocookie.com/embed/'

export function initVideo(root = document) {
	for (const button of root.querySelectorAll('button[data-video-id]')) {
		button.addEventListener(
			'click',
			() => {
				const iframe = document.createElement('iframe')
				iframe.setAttribute(
					'src',
					`${EMBED_BASE}${encodeURIComponent(button.dataset.videoId)}?autoplay=1&rel=0`
				)
				iframe.setAttribute('title', button.dataset.videoTitle || 'Video')
				iframe.setAttribute(
					'allow',
					'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
				)
				iframe.setAttribute('allowfullscreen', '')
				iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
				iframe.setAttribute('class', 'absolute inset-0 h-full w-full')
				button.replaceWith(iframe)
				iframe.focus()
			},
			{ once: true }
		)
	}
}
