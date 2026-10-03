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

## Project layout

- `index.html`: the page, with all sections.
- `src/main.css`: Tailwind, the Inter font, and the brand color tokens (`brand-50` to `brand-950`; `brand-700` is the logo blue, `#243292`).
- `src/main.js`: the entry point. It starts the modules in `src/js/`.
- `src/assets/images/`: content images. Run `scripts/optimize-images.sh` to make them again from `assets/source/`.
- `public/`: files that need a fixed URL (favicon, Open Graph image).
- `tests/`: Vitest tests.
- `docs/superpowers/`: the design spec and the implementation plan.
