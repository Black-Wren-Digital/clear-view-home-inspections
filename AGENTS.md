# AGENTS.md

## What this is

The website for Clear View Home Inspections, LLC, a home inspection business in Fishers, Indiana. It replaces the owner's Wix site at https://www.cvhi.us with one static page: hero, why Clear View, services, sample report, reviews, FAQ, contact, footer.

- **Who it is for:** The developer builds it for the business owner, who approves all site text before launch.
- **Status:** A preview is live at https://black-wren-digital.github.io/clear-view-home-inspections/ with a `noindex` tag. The site is not launched: the domain still points to Wix.
- **Open work:** `TODO.md` lists the launch steps, the owner requests, the polish items, and the later SEO work. Read it before you start launch, form, content, or SEO work, and update it when you finish an item.

## How it is built

- Vite 8 and Tailwind CSS v4 (`@tailwindcss/vite`). Plain HTML in `index.html`. Three small JavaScript modules in `src/js/`, started by `src/main.js`. Vitest with jsdom for the tests.
- The site has no framework. React may come later, on the same Vite setup.
- Commands are the `package.json` scripts. The README covers the deploy, the contact form setup, and the domain and DNS steps.

## Conventions

- **Site text is owner-approved.** Change wording only when asked. Quote reviews word for word, with the reviewer's name as the review shows it. Add facts (years, licenses, prices, services) only from the owner.
- **Tests pin the page.** `tests/page.test.js` checks the exact text, the ids, the links, and some layout classes. For a content or layout change, change the test first, watch it fail, then change the page.
- **Brand color:** `brand-700` is the logo blue `#243292`. The `brand-50` to `brand-950` scale is in the `@theme` block of `src/main.css`.
- **Utility classes stay in the HTML.** Repeated cards repeat their class strings, as the services and footer do.
- **Tailwind scans only `index.html` and `src/js/`** (see `@source` in `src/main.css`). A class that only another file uses produces no CSS.
- **Icons** are inline SVG copied from Lucide (`lucide-static`), with `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"` and a size class.
- **The page loads nothing from third parties.** Inter is self-hosted through `@fontsource-variable/inter`. The YouTube player loads only on click, from `youtube-nocookie.com`.
- **Images:** The originals are in `assets/source/`. `scripts/optimize-images.sh` makes the WebP files and icons (macOS `sips` and `cwebp`). Content images go in `src/assets/images/`, where Vite hashes them. Files that need a fixed URL (favicon, Open Graph image) go in `public/`. Each `<img>` has `alt`, `width`, and `height`.
- **`base: './'`** in `vite.config.js` keeps all built paths relative, so one build works under `/clear-view-home-inspections/` and at a domain root.
- **Header height is shared.** The header is `h-16` plus a 1 px border. The hero's `min-h-[calc(100svh-4rem-1px)]` and the `scroll-pt-20` on `<html>` depend on it. Change them together.
- **Focus ring:** The `:focus-visible` rule in `src/main.css` sits outside the Tailwind layers on purpose, so `shadow-*` utilities cannot remove its white halo. An element that fills an `overflow-hidden` box uses `.focus-ring-inset`.
- **Accessibility bar:** WCAG AA contrast (4.5:1 for text), a visible focus ring on every control, a label on every field, and tap targets of 44 px on phones.
- **Node:** `.nvmrc` selects the version. `package.json` `engines` plus `engine-strict=true` in `.npmrc` make `npm install` fail on unsupported versions.

## Deployment

`.github/workflows/deploy.yml` runs on each push to `main`: install, `npm test`, build, deploy to GitHub Pages. The build sets `SITE_NOINDEX=true`, and `scripts/vite-plugin-noindex.js` then adds `<meta name="robots" content="noindex">`. This tag is for the preview only. Removing it is a launch step in `TODO.md`.

## Verify a change

1. `npm test` passes.
2. `npm run build` shows no warnings.
3. For a visual change, look at the page at 375 px and at 1440 px wide.
4. For a change to layout, color, or controls, run Lighthouse on `npm run preview`. Performance, accessibility, and best practices must each score 95 or more.

## Git

Work on a branch. The maintainer pushes and opens the pull requests.
