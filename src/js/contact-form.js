// Sends the contact form. With no data-endpoint, it opens the visitor's email app (mailto).
// With a data-endpoint (Netlify Forms or Formspree), it posts the form and shows the result.
export const CONTACT_EMAIL = 'info@cvhi.us'
export const CONTACT_PHONE = '(317) 578-0890'
export const MAIL_SUBJECT = 'Schedule Home Inspection'

export const MESSAGES = {
	mailto: `Your email app should open with your message. If it doesn't, email us at ${CONTACT_EMAIL}.`,
	sending: 'Sending…',
	error: `Sorry, we couldn't send your message. Please call ${CONTACT_PHONE} or email ${CONTACT_EMAIL}.`
}

export function buildMailto({ firstName, lastName, email, message }) {
	const name = [firstName, lastName].filter(Boolean).join(' ')
	const body = [`Name: ${name}`, `Email: ${email}`, '', message].join('\r\n')
	return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(body)}`
}

function readFields(form) {
	const data = new FormData(form)
	const get = name => String(data.get(name) ?? '').trim()
	return {
		firstName: get('first_name'),
		lastName: get('last_name'),
		email: get('email'),
		message: get('message')
	}
}

function setStatus(form, text, state) {
	const status = form.querySelector('[role="status"]')
	if (!status) return
	status.textContent = text
	status.dataset.state = state
}

function showSuccess(form) {
	const success = form.parentElement?.querySelector('[data-form-success]')
	form.hidden = true
	if (success) {
		success.hidden = false
		success.focus()
	}
}

export async function submitContactForm(
	form,
	{
		fetchImpl = globalThis.fetch,
		openUrl = url => window.location.assign(url)
	} = {}
) {
	if (form.dataset.sending === 'true') return
	if (form.elements.namedItem('_gotcha')?.value) return

	const endpoint = form.dataset.endpoint?.trim()
	if (!endpoint) {
		openUrl(buildMailto(readFields(form)))
		setStatus(form, MESSAGES.mailto, 'info')
		return
	}

	const button = form.querySelector('[type="submit"]')
	form.dataset.sending = 'true'
	if (button) button.disabled = true
	setStatus(form, MESSAGES.sending, 'info')

	try {
		const response = await fetchImpl(endpoint, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams(new FormData(form)).toString()
		})
		if (!response.ok)
			throw new Error(`Form endpoint returned ${response.status}`)
		setStatus(form, '', 'info')
		showSuccess(form)
	} catch {
		setStatus(form, MESSAGES.error, 'error')
	} finally {
		delete form.dataset.sending
		if (button) button.disabled = false
	}
}

export function initContactForm(form, deps) {
	form.addEventListener('submit', event => {
		event.preventDefault()
		submitContactForm(form, deps)
	})
}
