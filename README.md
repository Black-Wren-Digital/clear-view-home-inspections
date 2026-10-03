# Clear View Home Inspections website

The website for Clear View Home Inspections, LLC (https://www.cvhi.us). It is a one-page static site built with [Vite](https://vite.dev) and [Tailwind CSS v4](https://tailwindcss.com).

## Requirements

- Node.js 20.19 or later, or 22.12 or later.

## Commands

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm install`     | Installs the dependencies.                            |
| `npm run dev`     | Starts a local server with live reload.               |
| `npm test`        | Runs the tests once.                                  |
| `npm run build`   | Builds the site into `dist/`.                         |
| `npm run preview` | Serves the built site from `dist/` on port 4173.      |

## Deploy

The site is static. Any static host can serve the `dist/` folder.

- **Netlify:** Build command `npm run build`. Publish directory `dist`.
- **GitHub Pages:** Use a GitHub Actions workflow that runs `npm ci` and `npm run build`, then uploads `dist/`. See the Vite guide: https://vite.dev/guide/static-deploy#github-pages. The Vite config uses `base: './'`, so the site works on a custom domain and on a `username.github.io/repo/` URL.

## Contact form

The form in `index.html` (`<form id="contact-form">`) works on any host. Its `data-endpoint` attribute controls how it sends messages.

- **`data-endpoint=""` (the default):** the "Send message" button opens the visitor's email app. The app opens a new email to info@cvhi.us with the subject "Schedule Home Inspection" and the form text.
- **`data-endpoint` set to a URL:** the form posts the fields to that URL as URL-encoded data. On success, it shows "Thanks! We'll be in touch soon." On failure, it shows the phone number and the email, and it keeps the text in the form.

A hidden field named `_gotcha` stops simple spam bots. If it has a value, the form sends nothing.

### Connect Netlify Forms

1. Add `data-netlify="true"` to the `<form>` element.
2. Set `data-endpoint="/"`.
3. Deploy. Netlify finds the form named `contact` in the HTML at build time. The `netlify-honeypot="_gotcha"` attribute is already on the form.
4. In the Netlify dashboard, open **Forms → contact → Form notifications** and add an email notification to info@cvhi.us.

### Connect Formspree

1. Make a form at https://formspree.io and copy its URL, for example `https://formspree.io/f/abcdwxyz`.
2. Set `data-endpoint` to that URL.
3. Formspree reads the `_gotcha` field as its honeypot. The free plan accepts 50 messages each month.

## Project layout

- `index.html`: the page, with all sections.
- `src/main.css`: Tailwind, the Inter font, and the brand color tokens (`brand-50` to `brand-950`; `brand-700` is the logo blue, `#243292`).
- `src/main.js`: the entry point. It starts the modules in `src/js/`.
- `src/assets/images/`: content images. Run `scripts/optimize-images.sh` to make them again from `assets/source/`.
- `public/`: files that need a fixed URL (favicon, Open Graph image).
- `tests/`: Vitest tests.
- `docs/superpowers/`: the design spec and the implementation plan.
