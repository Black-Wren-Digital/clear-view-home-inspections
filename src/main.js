import './main.css'
import { initMenu } from './js/menu.js'
import { initVideo } from './js/video.js'
import { initContactForm } from './js/contact-form.js'

initMenu()
initVideo()

const contactForm = document.getElementById('contact-form')
if (contactForm) initContactForm(contactForm)

for (const el of document.querySelectorAll('[data-year]')) {
	el.textContent = String(new Date().getFullYear())
}
