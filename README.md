# Clear View Home Inspections website

The website for Clear View Home Inspections, LLC (https://www.cvhi.us). It is a one-page static site built with [Vite](https://vite.dev) and [Tailwind CSS v4](https://tailwindcss.com).

## Requirements

- Node.js 24 (the version in `.nvmrc`). mise, fnm, and nvm read this file:
  - **mise:** set `idiomatic_version_file_enable_tools = ["node"]` in your mise config, then run `mise install`.
  - **fnm:** run `fnm use` (or enable `--use-on-cd`).
  - **nvm:** run `nvm use`.

  Netlify also reads `.nvmrc` for the build. In GitHub Actions, use `actions/setup-node` with `node-version-file: .nvmrc`.
- `package.json` accepts Node `^24.15.0 || ^26.0.0` (the two LTS lines the project supports), and `.npmrc` sets `engine-strict=true`. `npm install` fails with `EBADENGINE` on any other version. To move to a new LTS line, change `.nvmrc`, and add the line to `engines` if it is not there.

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
- **GitHub Pages:** Use a GitHub Actions workflow that sets up Node from `.nvmrc`, runs `npm ci` and `npm run build`, then uploads `dist/`. See the Vite guide: https://vite.dev/guide/static-deploy#github-pages. The Vite config uses `base: './'`, so the site works on a custom domain and on a `username.github.io/repo/` URL.

## Domain and DNS (at launch)

The domain cvhi.us is now registered through Wix. At launch, point it at the new host. Do not change the MX records, so that email to info@cvhi.us keeps working.

### GitHub Pages

1. In the repo settings, open **Pages** and set the source to **GitHub Actions** (the site has a build step, so it cannot deploy from a branch).
2. Verify cvhi.us for the GitHub account first. This prevents a domain takeover.
3. Add a file `public/CNAME` that contains `www.cvhi.us`. Vite copies it into `dist/`.
4. At the registrar, add apex `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`, plus the `AAAA` records from the GitHub docs. Add a `www` `CNAME` record that points to `<account>.github.io`.
5. Turn on **Enforce HTTPS**. It can take up to 24 hours to become available.

Docs: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

### Netlify

Add the domain in the Netlify dashboard (**Domain management**) and follow its DNS instructions. Keep the MX records as they are.

### After launch

When the site has a sitemap (part of the later SEO work), submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

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
