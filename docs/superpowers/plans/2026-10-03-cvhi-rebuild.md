# Clear View Home Inspections Site Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild https://www.cvhi.us as a modern, one-page static site with Vite and Tailwind CSS v4.

**Architecture:** One `index.html` holds all 10 sections as plain HTML with Tailwind classes. Three small JavaScript modules (`menu.js`, `video.js`, `contact-form.js`) add behavior, and `main.js` starts them. Vitest with jsdom tests the modules, and it also parses `index.html` to check the markup and the content.

**Tech Stack:** Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`), Vitest 5, jsdom 30, `@fontsource-variable/inter`, macOS `sips` and `cwebp` for the one-time image conversion.

**Spec:** `docs/superpowers/specs/2026-10-03-cvhi-rebuild-design.md`. Read it before you start. Section 5 of the spec is the source of all site text.

## Global Constraints

- Node.js `^20.19.0 || >=22.12.0` (required by Vite 8).
- Package versions: `vite@^8.3.2`, `tailwindcss@^4.3.3`, `@tailwindcss/vite@^4.3.3`, `vitest@^5.0.3`, `jsdom@^30.1.1`, `@fontsource-variable/inter@^5.3.0`.
- No other runtime dependencies. No icon library. No CDN. No Google Fonts. The page sends no request to a third party until the visitor clicks the video or a link.
- Brand color: `#243292` is the token `brand-700`. Use the `brand-*` scale from Task 1 for all blue.
- All site text comes from section 5 of the spec, exactly. Do not write new text.
- Phone link: `tel:3175780890`. Display text: `(317) 578-0890`. Email: `info@cvhi.us`.
- Vite `base: './'`.
- Each `<img>` has an `alt` attribute (empty only when decorative), a `width`, and a `height`.
- Each link to another site has `target="_blank"` and `rel="noopener noreferrer"`.
- Tap targets on phones are at least 44 × 44 px (`size-11` or `py-3` with padding).
- Inline SVG icons use exactly these attributes plus a size class: `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`. The paths come from Lucide (lucide-static 1.51.0) and are given in full in this plan.
- End every commit message with the line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

These are the 5 inputs or conditions that the spec implies but does not test directly. Each one has a test in the task that owns the code.

1. **Special characters in the form text** (`&`, `#`, `?`, line breaks) in mailto mode. A reasonable person expects the email app to show the full message, not a message cut at the first `&` or `#`. Test: Task 7, "encodes characters that would break the mailto URL".
2. **A double click on "Send message"** in endpoint mode. A reasonable person expects one message, not two. Test: Task 7, "ignores a second submit while the first request is in progress".
3. **A failed send** (a non-OK response such as Formspree's 422, or a network error). A reasonable person expects the typed text to stay in the form and the button to work again. Test: Task 7, "keeps the text and re-enables the button when the response is not OK" and "…when the network fails".
4. **The Escape key when the mobile menu is closed.** A reasonable person expects Escape to do nothing, and the focus not to jump to the menu button. Test: Task 5, "does not move focus on Escape when the menu is closed".
5. **A nav link jump under the sticky header.** A reasonable person expects to see the section heading, not a heading hidden under the header. Test: Task 3, "reserves space for the sticky header when it jumps to a section" (checks `scroll-pt-20` on `<html>`, which is 80 px against a 64 px header).

---

## File map

| File                             | Task | Responsibility                                                       |
| -------------------------------- | ---- | -------------------------------------------------------------------- |
| `package.json`                   | 1    | Scripts and dependencies                                             |
| `vite.config.js`                 | 1    | Vite, the Tailwind plugin, and the Vitest settings                   |
| `src/main.css`                   | 1    | Tailwind import, font, brand tokens, focus ring                      |
| `src/main.js`                    | 1    | Entry point. Tasks 4–7 each add one start call                       |
| `index.html`                     | 1, 3, 4 | The page. Task 1 makes a stub, Task 3 writes the top, Task 4 the rest |
| `README.md`                      | 1, 7 | How to run, build, deploy, and connect the form                      |
| `assets/source/*`                | 2    | Original images                                                      |
| `scripts/optimize-images.sh`     | 2    | Makes the web images from the originals                              |
| `src/assets/images/*.webp`       | 2    | Content images (Vite adds a hash to each name)                       |
| `public/*`                       | 2    | Favicon, apple-touch-icon, Open Graph image                          |
| `tests/page.test.js`             | 1, 3, 4 | Parses `index.html` and checks markup and content               |
| `tests/images.test.js`           | 2    | Checks that each image file exists                                   |
| `src/js/menu.js`                 | 5    | Mobile menu                                                          |
| `tests/menu.test.js`             | 5    | Tests for the mobile menu                                            |
| `src/js/video.js`                | 6    | Click-to-load YouTube video                                          |
| `tests/video.test.js`            | 6    | Tests for the video                                                  |
| `src/js/contact-form.js`         | 7    | Contact form: mailto mode and endpoint mode                          |
| `tests/contact-form.test.js`     | 7    | Tests for the contact form                                           |

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `vite.config.js`, `src/main.css`, `src/main.js`, `index.html`, `README.md`, `tests/page.test.js`
- Modify: none (`.gitignore` already exists with `node_modules/`, `dist/`, `.superpowers/`, `.DS_Store`)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - npm scripts `dev`, `build`, `preview`, `test`, `test:watch`.
  - Tailwind color tokens `brand-50` … `brand-950`, with `brand-700` = `#243292`. Font token `font-sans` = Inter Variable.
  - `tests/page.test.js` exports nothing. It defines `document` at the top of the file from `index.html`. Tasks 3 and 4 add `describe` blocks to this file.
  - `src/main.js` imports `./main.css`. Later tasks add imports and start calls.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "cvhi",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Install the dependencies**

Run:

```bash
npm install @fontsource-variable/inter@^5.3.0
npm install -D vite@^8.3.2 tailwindcss@^4.3.3 @tailwindcss/vite@^4.3.3 vitest@^5.0.3 jsdom@^30.1.1
```

Expected: `package.json` has the 6 packages, and `package-lock.json` exists.

- [ ] **Step 3: Write the failing test**

Create `tests/page.test.js`:

```js
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, it, expect } from 'vitest';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const { document } = new JSDOM(html).window;

const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

describe('document', () => {
  it('is in English', () => {
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });

  it('loads the main script as a module', () => {
    const script = document.querySelector('script[type="module"]');
    expect(script.getAttribute('src')).toBe('/src/main.js');
  });

  it('has the site title', () => {
    expect(document.title).toBe(
      'Clear View Home Inspections | Fishers & Indianapolis Home Inspector',
    );
  });
});
```

Note: `existsSync` and `text` are not used yet. Tasks 3 and 4 use them.

- [ ] **Step 4: Run the test to see it fail**

Run: `npx vitest run tests/page.test.js`
Expected: FAIL with `ENOENT: no such file or directory, open '.../index.html'`.

- [ ] **Step 5: Create `vite.config.js`**

```js
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  test: {
    environment: 'jsdom',
  },
});
```

- [ ] **Step 6: Create `src/main.css`**

```css
@import "tailwindcss";
@import "@fontsource-variable/inter";

@theme {
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji";

  --color-brand-50: #eef0fb;
  --color-brand-100: #dde1f7;
  --color-brand-200: #c3caf1;
  --color-brand-300: #9ea9e8;
  --color-brand-400: #7181dc;
  --color-brand-500: #4d5fcf;
  --color-brand-600: #3445b5;
  --color-brand-700: #243292;
  --color-brand-800: #1f2a78;
  --color-brand-900: #1b2463;
  --color-brand-950: #141a45;
}

@layer base {
  /* Two-tone focus ring: a blue outline with a white halo, visible on white and on blue. */
  :focus-visible {
    outline: 2px solid var(--color-brand-700);
    outline-offset: 2px;
    box-shadow: 0 0 0 5px #fff;
  }
}
```

- [ ] **Step 7: Create `src/main.js`**

```js
import './main.css';
```

- [ ] **Step 8: Create a stub `index.html`**

Task 3 replaces this file in full.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Clear View Home Inspections | Fishers &amp; Indianapolis Home Inspector</title>
    <script type="module" src="/src/main.js"></script>
  </head>
  <body class="font-sans text-slate-900">
    <h1 class="p-8 text-4xl font-bold text-brand-700">Clear View Home Inspections</h1>
  </body>
</html>
```

- [ ] **Step 9: Run the test to see it pass**

Run: `npx vitest run tests/page.test.js`
Expected: PASS, 3 tests.

- [ ] **Step 10: Check the build and the Tailwind tokens**

Run: `npm run build && grep -c "#243292" dist/assets/*.css`
Expected: the build completes with no warnings, and `grep` prints a number of 1 or more. This shows that Tailwind made the `text-brand-700` class from the theme token.

- [ ] **Step 11: Create `README.md`**

````markdown
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
````

- [ ] **Step 12: Commit**

```bash
git add package.json package-lock.json vite.config.js src/main.css src/main.js index.html README.md tests/page.test.js
git commit -m "chore: scaffold Vite and Tailwind project" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Images

**Files:**
- Create: `assets/source/logo.jpg`, `assets/source/house.jpg`, `assets/source/report.jpg`, `assets/source/video-thumb.jpg`
- Create: `scripts/optimize-images.sh`
- Create (generated): `src/assets/images/logo.webp`, `hero-house-640.webp`, `hero-house-1024.webp`, `report-sample-800.webp`, `report-sample-1200.webp`, `video-thumb.webp`
- Create (generated): `public/favicon-32.png`, `public/apple-touch-icon.png`, `public/og-image.jpg`
- Test: `tests/images.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: these files and pixel sizes. Tasks 3 and 4 use the sizes in `width` and `height` attributes.

| File                                       | Size (px)  |
| ------------------------------------------ | ---------- |
| `src/assets/images/logo.webp`              | 120 × 80   |
| `src/assets/images/hero-house-640.webp`    | 640 × 310  |
| `src/assets/images/hero-house-1024.webp`   | 1024 × 496 |
| `src/assets/images/report-sample-800.webp` | 800 × 631  |
| `src/assets/images/report-sample-1200.webp`| 1200 × 946 |
| `src/assets/images/video-thumb.webp`       | 960 × 540  |
| `public/favicon-32.png`                    | 32 × 32    |
| `public/apple-touch-icon.png`              | 180 × 180  |
| `public/og-image.jpg`                      | 948 × 496  |

- [ ] **Step 1: Write the failing test**

Create `tests/images.test.js`:

```js
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const files = [
  'src/assets/images/logo.webp',
  'src/assets/images/hero-house-640.webp',
  'src/assets/images/hero-house-1024.webp',
  'src/assets/images/report-sample-800.webp',
  'src/assets/images/report-sample-1200.webp',
  'src/assets/images/video-thumb.webp',
  'public/favicon-32.png',
  'public/apple-touch-icon.png',
  'public/og-image.jpg',
];

describe('images', () => {
  it.each(files)('%s exists and is not empty', (file) => {
    expect(statSync(resolve(root, file)).size).toBeGreaterThan(500);
  });
});
```

- [ ] **Step 2: Run the test to see it fail**

Run: `npx vitest run tests/images.test.js`
Expected: FAIL, 9 tests, each with `ENOENT`.

- [ ] **Step 3: Download the original images**

```bash
mkdir -p assets/source
curl -sSfL -o assets/source/logo.jpg "https://static.wixstatic.com/media/e018a7_8d8ba13c3a974ceab3aabd899e97b9ae~mv2.jpg"
curl -sSfL -o assets/source/house.jpg "https://static.wixstatic.com/media/e018a7_fd14e6c2b83b4105853ef75d80be4b23~mv2.jpg"
curl -sSfL -o assets/source/report.jpg "https://static.wixstatic.com/media/e018a7_1824f8a61d9241e0b359b04145ba86bb~mv2_d_2548_2008_s_2.jpg"
curl -sSfL -o assets/source/video-thumb.jpg "https://i.ytimg.com/vi/H6RSqJ-COWg/maxresdefault.jpg"
sips -g pixelWidth -g pixelHeight assets/source/*.jpg
```

Expected sizes: `logo.jpg` 886 × 586, `house.jpg` 1024 × 496, `report.jpg` 2548 × 2008, `video-thumb.jpg` 1280 × 720.

- [ ] **Step 4: Create `scripts/optimize-images.sh`**

```bash
#!/usr/bin/env bash
# Makes the web images from the originals in assets/source/.
# Needs macOS `sips` and `cwebp` (install with: brew install webp).
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=assets/source
OUT=src/assets/images
PUB=public
mkdir -p "$OUT" "$PUB"

cwebp -quiet -q 85 -resize 120 0  "$SRC/logo.jpg"        -o "$OUT/logo.webp"
cwebp -quiet -q 75 -resize 640 0  "$SRC/house.jpg"       -o "$OUT/hero-house-640.webp"
cwebp -quiet -q 75                "$SRC/house.jpg"       -o "$OUT/hero-house-1024.webp"
cwebp -quiet -q 80 -resize 800 0  "$SRC/report.jpg"      -o "$OUT/report-sample-800.webp"
cwebp -quiet -q 80 -resize 1200 0 "$SRC/report.jpg"      -o "$OUT/report-sample-1200.webp"
cwebp -quiet -q 80 -resize 960 0  "$SRC/video-thumb.jpg" -o "$OUT/video-thumb.webp"

# Square icons: pad the logo to a square with the brand blue, then resize.
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
sips -s format png --padToHeightWidth 886 886 --padColor 243292 "$SRC/logo.jpg" --out "$TMP/logo-square.png" >/dev/null
sips -z 32 32   "$TMP/logo-square.png" --out "$PUB/favicon-32.png" >/dev/null
sips -z 180 180 "$TMP/logo-square.png" --out "$PUB/apple-touch-icon.png" >/dev/null

# Open Graph image: a center crop of the house photo at about 1.91:1.
sips -c 496 948 "$SRC/house.jpg" --out "$PUB/og-image.jpg" >/dev/null

echo "Done."
```

- [ ] **Step 5: Run the script**

```bash
chmod +x scripts/optimize-images.sh
./scripts/optimize-images.sh
sips -g pixelWidth -g pixelHeight src/assets/images/*.webp public/*.png public/*.jpg
```

Expected: `Done.` The sizes match the table in **Interfaces**. Note: `sips` prints a `CGColor` line when it pads the logo. This line is normal.

- [ ] **Step 6: Run the test to see it pass**

Run: `npx vitest run tests/images.test.js`
Expected: PASS, 9 tests.

- [ ] **Step 7: Commit**

```bash
git add assets scripts src/assets public tests/images.test.js
git commit -m "feat: add optimized site images" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Page head, header, hero, trust bar, and Why Clear View

**Files:**
- Modify: `index.html` (replace the whole file)
- Test: `tests/page.test.js` (add `describe` blocks)

**Interfaces:**
- Consumes: the image files and sizes from Task 2. The `brand-*` tokens and the `text` helper and `root` constant from Task 1.
- Produces, for Tasks 4, 5, and 6:
  - `index.html` has 2 insertion comments. Task 4 replaces them: `<!-- @task4:sections -->` inside `<main>`, and `<!-- @task4:footer -->` after `</main>`.
  - Menu markup: `<button data-menu-button aria-controls="mobile-menu" aria-expanded="false">` and `<nav id="mobile-menu" hidden>` with `<a>` links.
  - Video markup: `<button data-video-id="H6RSqJ-COWg" data-video-title="Clear View Home Inspections">` inside a `relative aspect-video` container.

- [ ] **Step 1: Write the failing tests**

Add these blocks to the end of `tests/page.test.js`:

```js
describe('head', () => {
  const meta = (selector) => document.querySelector(selector)?.getAttribute('content');
  const description =
    'Clear View Home Inspections serves Central Indiana with residential and commercial home inspections, new construction and pre-drywall inspections, radon testing, and mold testing.';

  it('has the meta description', () => {
    expect(meta('meta[name="description"]')).toBe(description);
  });

  it('has Open Graph tags', () => {
    expect(meta('meta[property="og:type"]')).toBe('website');
    expect(meta('meta[property="og:title"]')).toBe(document.title);
    expect(meta('meta[property="og:description"]')).toBe(description);
    expect(meta('meta[property="og:image"]')).toBe('https://www.cvhi.us/og-image.jpg');
  });

  it('links the icons in public/', () => {
    const icon = document.querySelector('link[rel="icon"]').getAttribute('href');
    const touch = document.querySelector('link[rel="apple-touch-icon"]').getAttribute('href');
    expect(existsSync(resolve(root, 'public', icon.replace(/^\//, '')))).toBe(true);
    expect(existsSync(resolve(root, 'public', touch.replace(/^\//, '')))).toBe(true);
  });

  it('reserves space for the sticky header when it jumps to a section', () => {
    expect(document.documentElement.classList.contains('scroll-pt-20')).toBe(true);
  });
});

describe('header', () => {
  const navHrefs = ['#services', '#reports', '#reviews', '#faq', '#contact'];
  const navLabels = ['Services', 'Reports', 'Reviews', 'FAQ', 'Contact'];

  it('starts with a skip link to the main content', () => {
    const first = document.body.querySelector('a, button');
    expect(first.getAttribute('href')).toBe('#main');
    expect(text(first)).toBe('Skip to content');
    expect(document.querySelector('main#main')).not.toBeNull();
  });

  it('has the desktop nav links and the call button', () => {
    const links = [...document.querySelectorAll('nav[aria-label="Main"] a')];
    expect(links.slice(0, 5).map((a) => a.getAttribute('href'))).toEqual(navHrefs);
    expect(links.slice(0, 5).map(text)).toEqual(navLabels);
    expect(links[5].getAttribute('href')).toBe('tel:3175780890');
    expect(text(links[5])).toBe('Call (317) 578-0890');
  });

  it('has a mobile menu with the same links, closed by default', () => {
    const button = document.querySelector('[data-menu-button]');
    expect(button.getAttribute('aria-controls')).toBe('mobile-menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    const panel = document.getElementById('mobile-menu');
    expect(panel.hasAttribute('hidden')).toBe(true);
    expect([...panel.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(navHrefs);
  });
});

describe('hero', () => {
  it('has exactly one h1 with the headline', () => {
    const h1s = document.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(text(h1s[0])).toBe('Protect your investment. Choose Clear View.');
  });

  it('has the two buttons', () => {
    const hero = document.getElementById('top');
    const links = [...hero.querySelectorAll('a')].map((a) => [text(a), a.getAttribute('href')]);
    expect(links).toEqual([
      ['Schedule an inspection', '#contact'],
      ['Our services', '#services'],
    ]);
  });
});

describe('trust bar', () => {
  it('lists the four facts', () => {
    const items = [...document.querySelectorAll('[aria-label="Why clients choose us"] li')].map(text);
    expect(items).toEqual([
      'Serving Central Indiana since 1999',
      'Licensed home inspectors',
      'Report within 24 hours',
      'Based in Fishers, Indiana',
    ]);
  });
});

describe('why clear view', () => {
  it('has the heading and the video button', () => {
    const section = document.getElementById('about');
    expect(text(section.querySelector('h2'))).toBe(
      "If you're buying a house, you need a home inspection.",
    );
    const video = section.querySelector('button[data-video-id]');
    expect(video.dataset.videoId).toBe('H6RSqJ-COWg');
    expect(video.getAttribute('aria-label')).toBe('Play video: Clear View Home Inspections');
  });

  it('sends no request to YouTube before a click', () => {
    expect(document.querySelector('iframe')).toBeNull();
  });
});

describe('images', () => {
  it('give each image alt text, a width, a height, and a file that exists', () => {
    for (const img of document.querySelectorAll('img')) {
      expect(img.hasAttribute('alt')).toBe(true);
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
      const sources = [img.getAttribute('src'), ...(img.getAttribute('srcset') ?? '').split(',')]
        .map((s) => s.trim().split(/\s+/)[0])
        .filter(Boolean);
      for (const src of sources) {
        expect(existsSync(resolve(root, src)), src).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run tests/page.test.js`
Expected: FAIL. The 3 tests from Task 1 pass. The new tests fail, for example `expected undefined to be 'Clear View Home Inspections serves…'`.

- [ ] **Step 3: Replace `index.html`**

```html
<!doctype html>
<html lang="en" class="scroll-pt-20 motion-safe:scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Clear View Home Inspections | Fishers &amp; Indianapolis Home Inspector</title>
    <meta
      name="description"
      content="Clear View Home Inspections serves Central Indiana with residential and commercial home inspections, new construction and pre-drywall inspections, radon testing, and mold testing."
    />
    <meta name="theme-color" content="#243292" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.cvhi.us/" />
    <meta property="og:title" content="Clear View Home Inspections | Fishers &amp; Indianapolis Home Inspector" />
    <meta
      property="og:description"
      content="Clear View Home Inspections serves Central Indiana with residential and commercial home inspections, new construction and pre-drywall inspections, radon testing, and mold testing."
    />
    <meta property="og:image" content="https://www.cvhi.us/og-image.jpg" />
    <meta property="og:image:width" content="948" />
    <meta property="og:image:height" content="496" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="module" src="/src/main.js"></script>
  </head>
  <body class="bg-white font-sans text-slate-900 antialiased">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-700 focus:shadow-lg"
      >Skip to content</a
    >

    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" class="flex items-center gap-3 rounded-lg">
          <img src="./src/assets/images/logo.webp" alt="" width="120" height="80" class="h-10 w-auto rounded" />
          <span class="text-base leading-tight font-bold text-brand-700 sm:text-lg"
            >Clear View<span class="hidden sm:inline"> Home Inspections</span></span
          >
        </a>

        <nav aria-label="Main" class="hidden items-center gap-6 md:flex">
          <a href="#services" class="text-sm font-medium text-slate-600 hover:text-brand-700">Services</a>
          <a href="#reports" class="text-sm font-medium text-slate-600 hover:text-brand-700">Reports</a>
          <a href="#reviews" class="text-sm font-medium text-slate-600 hover:text-brand-700">Reviews</a>
          <a href="#faq" class="text-sm font-medium text-slate-600 hover:text-brand-700">FAQ</a>
          <a href="#contact" class="text-sm font-medium text-slate-600 hover:text-brand-700">Contact</a>
          <a
            href="tel:3175780890"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
            Call (317) 578-0890
          </a>
        </nav>

        <div class="flex items-center gap-1 md:hidden">
          <a
            href="tel:3175780890"
            class="inline-flex size-11 items-center justify-center rounded-lg text-brand-700 hover:bg-brand-50"
            aria-label="Call (317) 578-0890"
          >
            <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
          </a>
          <button
            type="button"
            class="group inline-flex size-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
            aria-controls="mobile-menu"
            aria-expanded="false"
            data-menu-button
          >
            <span class="sr-only">Menu</span>
            <svg class="size-6 group-aria-expanded:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></svg>
            <svg class="hidden size-6 group-aria-expanded:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
      </div>

      <nav id="mobile-menu" aria-label="Mobile" class="border-t border-slate-200 bg-white md:hidden" hidden>
        <ul class="mx-auto max-w-6xl space-y-1 px-4 py-3">
          <li><a href="#services" class="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-100">Services</a></li>
          <li><a href="#reports" class="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-100">Reports</a></li>
          <li><a href="#reviews" class="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-100">Reviews</a></li>
          <li><a href="#faq" class="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-100">FAQ</a></li>
          <li><a href="#contact" class="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-100">Contact</a></li>
        </ul>
      </nav>
    </header>

    <main id="main">
      <section id="top" class="relative isolate overflow-hidden bg-brand-900">
        <img
          src="./src/assets/images/hero-house-1024.webp"
          srcset="./src/assets/images/hero-house-640.webp 640w, ./src/assets/images/hero-house-1024.webp 1024w"
          sizes="100vw"
          alt="A two-story home with stone and cedar shingle siding"
          width="1024"
          height="496"
          fetchpriority="high"
          class="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          class="absolute inset-0 -z-10 bg-brand-950/85 md:bg-transparent md:bg-linear-to-r md:from-brand-950/95 md:via-brand-800/80 md:to-brand-700/20"
          aria-hidden="true"
        ></div>
        <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32 lg:py-40">
          <div class="max-w-xl text-white">
            <p class="text-sm font-semibold tracking-wider text-brand-200 uppercase">
              Indiana's clear choice for home inspections
            </p>
            <h1 class="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Protect your investment. Choose Clear View.
            </h1>
            <p class="mt-6 text-lg text-brand-100">
              Residential and commercial home inspections for Indianapolis and the surrounding counties.
            </p>
            <div class="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                class="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 shadow-sm hover:bg-brand-50"
                >Schedule an inspection</a
              >
              <a
                href="#services"
                class="inline-flex items-center justify-center rounded-lg border border-white/70 px-6 py-3 font-semibold text-white hover:bg-white/10"
                >Our services</a
              >
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Why clients choose us" class="border-b border-slate-200 bg-white">
        <ul class="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
          <li class="flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v3" /><path d="M16 2v3" /><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="m9 15 2 2 4-4" /></svg>
            </span>
            <span class="text-sm font-semibold text-slate-800">Serving Central Indiana since 1999</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m16 9-5.5 5.5L8 12" /></svg>
            </span>
            <span class="text-sm font-semibold text-slate-800">Licensed home inspectors</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            </span>
            <span class="text-sm font-semibold text-slate-800">Report within 24 hours</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
            </span>
            <span class="text-sm font-semibold text-slate-800">Based in Fishers, Indiana</span>
          </li>
        </ul>
      </section>

      <section id="about" class="bg-white">
        <div class="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <h2 class="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              If you're buying a house, you need a home inspection.
            </h2>
            <div class="mt-6 space-y-4 text-lg leading-relaxed text-slate-600">
              <p>
                Your home is your most important investment. Our inspections pay for themselves with equity
                protection and peace of mind.
              </p>
              <p>
                Clear View delivers a complete, thorough inspection of the plumbing, electrical, heating and air
                conditioning systems, foundation, roof, exterior and interior structures and surfaces, and built-in
                appliances.
              </p>
              <p>
                We stay in contact with you and your real estate agent from start to finish, so you get timely,
                accurate information.
              </p>
              <p>
                We serve residential and commercial clients in Indianapolis and the surrounding counties from our
                office in Fishers, Indiana.
              </p>
            </div>
          </div>
          <div class="relative aspect-video overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
            <button
              type="button"
              class="group absolute inset-0 h-full w-full cursor-pointer"
              data-video-id="H6RSqJ-COWg"
              data-video-title="Clear View Home Inspections"
              aria-label="Play video: Clear View Home Inspections"
            >
              <img
                src="./src/assets/images/video-thumb.webp"
                alt=""
                width="960"
                height="540"
                loading="lazy"
                class="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
              />
              <span class="absolute inset-0 flex items-center justify-center">
                <span class="flex size-16 items-center justify-center rounded-full bg-white/95 text-brand-700 shadow-lg transition group-hover:scale-105 motion-reduce:transition-none">
                  <svg class="ml-1 size-7" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg>
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <!-- @task4:sections -->
    </main>

    <!-- @task4:footer -->
  </body>
</html>
```

Note: the play icon uses `fill="currentColor"`, so it shows as a solid triangle. This is the one exception to the icon rule in **Global Constraints**.

- [ ] **Step 4: Run the tests to see them pass**

Run: `npx vitest run tests/page.test.js`
Expected: PASS, all tests.

- [ ] **Step 5: Check the build**

Run: `npm run build && ls dist/assets`
Expected: no errors and no warnings. `dist/assets` has hashed `.webp` files, for example `hero-house-1024-<hash>.webp`, plus one `.css` file and one `.js` file. Run `grep -o 'favicon-32.png' dist/index.html` and expect one match.

- [ ] **Step 6: Look at the page**

Run: `npm run dev`. Open the URL that Vite prints (usually `http://localhost:5173`).
Expected: the header, the hero with the house photo behind a blue overlay, the 4 trust facts, and the Why Clear View text with the video thumbnail. The menu button and the video do nothing yet (Tasks 5 and 6). Stop the server with Ctrl+C.

- [ ] **Step 7: Commit**

```bash
git add index.html tests/page.test.js
git commit -m "feat: add header, hero, trust bar, and about section" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Services, reports, reviews, FAQ, contact, and footer

**Files:**
- Modify: `index.html` (replace the 2 `@task4` comments)
- Modify: `src/main.js` (add the footer year)
- Test: `tests/page.test.js` (add `describe` blocks)

**Interfaces:**
- Consumes: the insertion comments from Task 3. Image sizes from Task 2.
- Produces, for Task 7:
  - `<form id="contact-form" name="contact" method="POST" data-endpoint="" netlify-honeypot="_gotcha">` with fields named `form-name` (hidden, value `contact`), `_gotcha`, `first_name`, `last_name`, `email`, `message`, one `<button type="submit">`, and one `<p role="status">`.
  - A sibling `<div data-form-success hidden tabindex="-1">` right after the form, in the same parent.
  - `<span data-year>2026</span>` in the footer.

- [ ] **Step 1: Write the failing tests**

Add these blocks to the end of `tests/page.test.js`:

```js
describe('page links', () => {
  it('points each in-page link at an element that exists', () => {
    for (const a of document.querySelectorAll('a[href^="#"]')) {
      const id = a.getAttribute('href').slice(1);
      expect(document.getElementById(id), a.getAttribute('href')).not.toBeNull();
    }
  });

  it('opens each external link in a new tab, safely', () => {
    for (const a of document.querySelectorAll('a[href^="http"]')) {
      expect(a.getAttribute('target'), a.href).toBe('_blank');
      expect(a.getAttribute('rel'), a.href).toBe('noopener noreferrer');
    }
  });

  it('uses one phone number and one email address', () => {
    for (const a of document.querySelectorAll('a[href^="tel:"]')) {
      expect(a.getAttribute('href')).toBe('tel:3175780890');
    }
    for (const a of document.querySelectorAll('a[href^="mailto:"]')) {
      expect(a.getAttribute('href')).toMatch(/^mailto:info@cvhi\.us(\?|$)/);
    }
  });

  it('gives each section with an id an h2, except the hero', () => {
    for (const section of document.querySelectorAll('main section[id]:not(#top)')) {
      expect(section.querySelector('h2'), section.id).not.toBeNull();
    }
  });
});

describe('services', () => {
  it('lists the eleven services in order', () => {
    const names = [...document.querySelectorAll('#services [data-service]')].map(text);
    expect(names).toEqual([
      'Full Home Inspections',
      'New Construction Inspections',
      'Pre-Drywall Inspections',
      'Foundation Inspections',
      'Commercial Inspections',
      'Termite Certification',
      'Radon Testing',
      'Mold Testing',
      'Air & Water Sampling',
      'Winterization & De-Winterization',
      'Well & Septic Certifications',
    ]);
  });

  it('ends with a call card', () => {
    const cta = document.querySelector('#services [data-service-cta] a');
    expect(cta.getAttribute('href')).toBe('tel:3175780890');
    expect(text(cta)).toBe('Not sure what you need? Call us');
  });
});

describe('reports', () => {
  it('has the heading and the text', () => {
    const section = document.getElementById('reports');
    expect(text(section.querySelector('h2'))).toBe('A clear report within 24 hours');
    expect(text(section)).toContain(
      'Within 24 hours of your inspection, you receive a detailed, easy-to-read report. It lists each defect, sorts the defects by severity, and includes photos.',
    );
  });
});

describe('reviews', () => {
  const section = () => document.getElementById('reviews');

  it('quotes the review word for word', () => {
    expect(text(section().querySelector('blockquote'))).toBe(
      'My fiance and I are in the process of buying our first home. After finding the perfect home, our realtor recommended [Clear View Home Inspections] for the inspection. Doug Wehr was our inspector and he was absolutely fantastic. He was incredibly thorough and made sure to explain every step of the process and every detail regarding any serious or potential issue in the home. We are so appreciative of his time and expertise during our experience. I would highly recommend Doug to any of my family and friends!',
    );
    expect(text(section().querySelector('figcaption'))).toBe('Krystal Schulz · First-time home buyer');
  });

  it('links to Google and Yelp reviews', () => {
    const links = [...section().querySelectorAll('a')].map((a) => [text(a), a.getAttribute('href')]);
    expect(links).toEqual([
      ['Read our Google reviews', 'https://share.google/r1sEf6h0a8sqJCZn8'],
      ['Read our Yelp reviews', 'https://www.yelp.com/biz/clear-view-home-inspections-fishers'],
    ]);
  });
});

describe('faq', () => {
  it('has three questions and opens the first one', () => {
    const items = [...document.querySelectorAll('#faq details')];
    expect(items.map((d) => text(d.querySelector('summary')))).toEqual([
      'What is a home inspection?',
      'Should I be present for the inspection?',
      'When can I expect my report?',
    ]);
    expect(items.map((d) => d.hasAttribute('open'))).toEqual([true, false, false]);
  });

  it('puts each answer under the correct question', () => {
    const answers = [...document.querySelectorAll('#faq details > p')].map(text);
    expect(answers[0]).toMatch(/^A home inspection is a thorough visual review/);
    expect(answers[1]).toMatch(/^We recommend it\./);
    expect(answers[2]).toMatch(/^Within 24 hours of the inspection/);
  });
});

describe('contact form', () => {
  const form = () => document.getElementById('contact-form');

  it('has the attributes that the form module and the hosts need', () => {
    expect(form().getAttribute('name')).toBe('contact');
    expect(form().getAttribute('method')).toBe('POST');
    expect(form().getAttribute('data-endpoint')).toBe('');
    expect(form().getAttribute('netlify-honeypot')).toBe('_gotcha');
    expect(form().querySelector('input[type="hidden"][name="form-name"]').value).toBe('contact');
    expect(form().querySelector('input[name="_gotcha"]').getAttribute('tabindex')).toBe('-1');
  });

  it('has four required fields, each with a visible label', () => {
    const labels = {};
    for (const name of ['first_name', 'last_name', 'email', 'message']) {
      const field = form().querySelector(`[name="${name}"]`);
      expect(field.required, name).toBe(true);
      labels[name] = text(document.querySelector(`label[for="${field.id}"]`));
    }
    expect(labels).toEqual({
      first_name: 'First name',
      last_name: 'Last name',
      email: 'Email',
      message: 'Message',
    });
    expect(form().querySelector('[name="email"]').type).toBe('email');
  });

  it('has a submit button, a status line, and a hidden success message', () => {
    expect(text(form().querySelector('button[type="submit"]'))).toBe('Send message');
    expect(form().querySelector('p[role="status"]')).not.toBeNull();
    const success = form().parentElement.querySelector('[data-form-success]');
    expect(success.hasAttribute('hidden')).toBe(true);
    expect(text(success)).toContain("Thanks! We'll be in touch soon.");
  });
});

describe('footer', () => {
  it('has the copyright line with a year placeholder', () => {
    const footer = document.querySelector('footer');
    expect(footer.querySelector('[data-year]').textContent).toBe('2026');
    expect(text(footer)).toContain('© 2026 Clear View Home Inspections, LLC. All rights reserved.');
  });
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run tests/page.test.js`
Expected: FAIL. The tests from Tasks 1 and 3 pass. The new tests fail. For example, `page links` fails with `#reviews: expected null not to be null`.

- [ ] **Step 3: Replace `<!-- @task4:sections -->` in `index.html`**

```html
      <section id="services" class="bg-slate-50">
        <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div class="max-w-2xl">
            <p class="text-sm font-semibold tracking-wider text-brand-700 uppercase">Services you can count on</p>
            <h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">What we inspect and test</h2>
          </div>
          <ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
              </span>
              <span class="font-semibold text-slate-900" data-service>Full Home Inspections</span>
            </li>
            <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" /><path d="m18 15 4-4" /><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" /></svg>
              </span>
              <span class="font-semibold text-slate-900" data-service>New Construction Inspections</span>
            </li>
            <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /><path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" /></svg>
              </span>
              <span class="font-semibold text-slate-900" data-service>Pre-Drywall Inspections</span>
            </li>
            <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" /></svg>
              </span>
              <span class="font-semibold text-slate-900" data-service>Foundation Inspections</span>
            </li>
            <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 12h4" /><path d="M10 8h4" /><path d="M14 21v-3a2 2 0 0 0-4 0v3" /><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" /><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /></svg>
              </span>
              <span class="font-semibold text-slate-900" data-service>Commercial Inspections</span>
            </li>
            <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20v-9" /><path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z" /><path d="M14.12 3.88 16 2" /><path d="M21 21a4 4 0 0 0-3.81-4" /><path d="M21 5a4 4 0 0 1-3.55 3.97" /><path d="M22 13h-4" /><path d="M3 21a4 4 0 0 1 3.81-4" /><path d="M3 5a4 4 0 0 0 3.55 3.97" /><path d="M6 13H2" /><path d="m8 2 1.88 1.88" /><path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" /></svg>
              </span>
              <span class="font-semibold text-slate-900" data-service>Termite Certification</span>
            </li>
            <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 12h.01" /><path d="M14 15.4641a4 4 0 0 1-4 0L7.52786 19.74597 A 1 1 0 0 0 7.99303 21.16211 10 10 0 0 0 16.00697 21.16211 1 1 0 0 0 16.47214 19.74597z" /><path d="M16 12a4 4 0 0 0-2-3.464l2.472-4.282a1 1 0 0 1 1.46-.305 10 10 0 0 1 4.006 6.94A1 1 0 0 1 21 12z" /><path d="M8 12a4 4 0 0 1 2-3.464L7.528 4.254a1 1 0 0 0-1.46-.305 10 10 0 0 0-4.006 6.94A1 1 0 0 0 3 12z" /></svg>
              </span>
              <span class="font-semibold text-slate-900" data-service>Radon Testing</span>
            </li>
            <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg>
              </span>
              <span class="font-semibold text-slate-900" data-service>Mold Testing</span>
            </li>
            <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" /></svg>
              </span>
              <span class="font-semibold text-slate-900" data-service>Air &amp; Water Sampling</span>
            </li>
            <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 20-1.25-2.5L6 18" /><path d="M10 4 8.75 6.5 6 6" /><path d="m14 20 1.25-2.5L18 18" /><path d="m14 4 1.25 2.5L18 6" /><path d="m17 21-3-6h-4" /><path d="m17 3-3 6 1.5 3" /><path d="M2 12h6.5L10 9" /><path d="m20 10-1.5 2 1.5 2" /><path d="M22 12h-6.5L14 15" /><path d="m4 10 1.5 2L4 14" /><path d="m7 21 3-6-1.5-3" /><path d="m7 3 3 6h4" /></svg>
              </span>
              <span class="font-semibold text-slate-900" data-service>Winterization &amp; De-Winterization</span>
            </li>
            <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12q2.5 2 5 0t5 0 5 0 5 0" /><path d="M2 19q2.5 2 5 0t5 0 5 0 5 0" /><path d="M2 5q2.5 2 5 0t5 0 5 0 5 0" /></svg>
              </span>
              <span class="font-semibold text-slate-900" data-service>Well &amp; Septic Certifications</span>
            </li>
            <li data-service-cta>
              <a
                href="tel:3175780890"
                class="flex h-full min-h-[5.5rem] flex-col justify-center rounded-xl bg-brand-700 p-5 text-white shadow-sm hover:bg-brand-800"
              >
                <span class="font-semibold">Not sure what you need?</span>
                <span class="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand-100">
                  Call us
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section id="reports" class="bg-white">
        <div class="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <img
            src="./src/assets/images/report-sample-800.webp"
            srcset="./src/assets/images/report-sample-800.webp 800w, ./src/assets/images/report-sample-1200.webp 1200w"
            sizes="(min-width: 1024px) 560px, 100vw"
            alt="Sample pages from a Clear View inspection report, with a summary page that sorts defects by category"
            width="800"
            height="631"
            loading="lazy"
            class="w-full rounded-2xl border border-slate-200 bg-white shadow-lg"
          />
          <div>
            <p class="text-sm font-semibold tracking-wider text-brand-700 uppercase">Inspection reports</p>
            <h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A clear report within 24 hours</h2>
            <p class="mt-6 text-lg leading-relaxed text-slate-600">
              Within 24 hours of your inspection, you receive a detailed, easy-to-read report. It lists each defect,
              sorts the defects by severity, and includes photos.
            </p>
          </div>
        </div>
      </section>

      <section id="reviews" class="bg-slate-50">
        <div class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
          <h2 class="text-center text-3xl font-bold tracking-tight sm:text-4xl">Satisfied Clear View clients</h2>
          <figure class="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <svg class="size-8 text-brand-200" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" /><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" /></svg>
            <blockquote class="mt-4 space-y-4 text-lg leading-relaxed text-slate-700">
              <p>
                My fiance and I are in the process of buying our first home. After finding the perfect home, our
                realtor recommended [Clear View Home Inspections] for the inspection.
              </p>
              <p>
                Doug Wehr was our inspector and he was absolutely fantastic. He was incredibly thorough and made sure
                to explain every step of the process and every detail regarding any serious or potential issue in the
                home. We are so appreciative of his time and expertise during our experience.
              </p>
              <p>I would highly recommend Doug to any of my family and friends!</p>
            </blockquote>
            <figcaption class="mt-6">
              <span class="font-semibold text-slate-900">Krystal Schulz</span>
              <span class="text-slate-500">· First-time home buyer</span>
            </figcaption>
          </figure>
          <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="https://share.google/r1sEf6h0a8sqJCZn8"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:border-brand-700 hover:text-brand-700"
            >
              Read our Google reviews
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
            </a>
            <a
              href="https://www.yelp.com/biz/clear-view-home-inspections-fishers"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:border-brand-700 hover:text-brand-700"
            >
              Read our Yelp reviews
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
            </a>
          </div>
        </div>
      </section>

      <section id="faq" class="bg-white">
        <div class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Questions about home inspections</h2>
          <div class="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200">
            <details class="group p-6" open>
              <summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                What is a home inspection?
                <svg class="size-5 shrink-0 text-brand-700 transition-transform group-open:rotate-45 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
              </summary>
              <p class="mt-4 leading-relaxed text-slate-600">
                A home inspection is a thorough visual review of the condition of a home's structure, craftsmanship,
                and electrical and mechanical systems by a licensed home inspector. It's the due diligence that gives
                you the awareness, confidence, and peace of mind to make an informed investment.
              </p>
            </details>
            <details class="group p-6">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                Should I be present for the inspection?
                <svg class="size-5 shrink-0 text-brand-700 transition-transform group-open:rotate-45 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
              </summary>
              <p class="mt-4 leading-relaxed text-slate-600">
                We recommend it. It isn't required, but you'll learn valuable information about your home that can
                save you hundreds, even thousands, of dollars in future repairs. A typical inspection takes two to
                three hours.
              </p>
            </details>
            <details class="group p-6">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                When can I expect my report?
                <svg class="size-5 shrink-0 text-brand-700 transition-transform group-open:rotate-45 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
              </summary>
              <p class="mt-4 leading-relaxed text-slate-600">
                Within 24 hours of the inspection, you'll receive a detailed, easy-to-read report that lists each
                defect, sorts the defects by severity, and includes photos.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section id="contact" class="bg-brand-700 text-white">
        <div class="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-5 lg:py-28">
          <div class="lg:col-span-2">
            <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Schedule your inspection</h2>
            <p class="mt-4 text-lg text-brand-100">
              Call, email, or send us a message, and we'll help you schedule your inspection.
            </p>
            <ul class="mt-8 space-y-5">
              <li>
                <a href="tel:3175780890" class="group flex items-center gap-4">
                  <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
                  </span>
                  <span class="text-lg font-semibold group-hover:underline">(317) 578-0890</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@cvhi.us?subject=Schedule%20Home%20Inspection" class="group flex items-center gap-4">
                  <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
                  </span>
                  <span class="text-lg font-semibold group-hover:underline">info@cvhi.us</span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?cid=8238996744037397548"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-4"
                >
                  <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                  </span>
                  <span class="leading-snug group-hover:underline">11327 Reflection Point Drive<br />Fishers, IN 46037</span>
                </a>
              </li>
            </ul>
          </div>

          <div class="rounded-2xl bg-white p-6 text-slate-900 shadow-xl sm:p-8 lg:col-span-3">
            <form
              id="contact-form"
              name="contact"
              method="POST"
              data-endpoint=""
              netlify-honeypot="_gotcha"
              class="grid gap-5 sm:grid-cols-2"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p class="hidden">
                <label>Leave this field empty: <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" /></label>
              </p>
              <div>
                <label for="first-name" class="block text-sm font-semibold text-slate-700">First name</label>
                <input id="first-name" name="first_name" type="text" autocomplete="given-name" required class="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-brand-600" />
              </div>
              <div>
                <label for="last-name" class="block text-sm font-semibold text-slate-700">Last name</label>
                <input id="last-name" name="last_name" type="text" autocomplete="family-name" required class="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-brand-600" />
              </div>
              <div class="sm:col-span-2">
                <label for="email" class="block text-sm font-semibold text-slate-700">Email</label>
                <input id="email" name="email" type="email" autocomplete="email" required class="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-brand-600" />
              </div>
              <div class="sm:col-span-2">
                <label for="message" class="block text-sm font-semibold text-slate-700">Message</label>
                <textarea id="message" name="message" rows="5" required class="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-brand-600"></textarea>
              </div>
              <div class="sm:col-span-2">
                <button
                  type="submit"
                  class="inline-flex w-full items-center justify-center rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  Send message
                </button>
                <p
                  class="mt-4 text-sm text-slate-600 empty:hidden data-[state=error]:font-medium data-[state=error]:text-red-700"
                  role="status"
                  aria-live="polite"
                ></p>
              </div>
            </form>
            <div data-form-success class="py-10 text-center" tabindex="-1" hidden>
              <p class="text-2xl font-bold text-slate-900">Thanks! We'll be in touch soon.</p>
              <p class="mt-2 text-slate-600">
                If you need us sooner, call
                <a href="tel:3175780890" class="font-semibold text-brand-700 underline">(317) 578-0890</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
```

- [ ] **Step 4: Replace `<!-- @task4:footer -->` in `index.html`**

```html
    <footer class="bg-slate-900 text-slate-400">
      <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p class="font-semibold text-white">Clear View Home Inspections, LLC</p>
          <address class="mt-3 leading-relaxed not-italic">11327 Reflection Point Drive<br />Fishers, IN 46037</address>
        </div>
        <ul class="space-y-2">
          <li><a href="tel:3175780890" class="inline-block py-1 hover:text-white">(317) 578-0890</a></li>
          <li><a href="mailto:info@cvhi.us" class="inline-block py-1 hover:text-white">info@cvhi.us</a></li>
        </ul>
        <ul class="space-y-2">
          <li>
            <a
              href="https://www.facebook.com/Clear-View-Home-Inspections-LLC-1574379252847638/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block py-1 hover:text-white"
              >Facebook</a
            >
          </li>
          <li>
            <a
              href="https://maps.google.com/?cid=8238996744037397548"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block py-1 hover:text-white"
              >Google Maps</a
            >
          </li>
        </ul>
      </div>
      <div class="border-t border-slate-800">
        <p class="mx-auto max-w-6xl px-4 py-6 text-sm sm:px-6">
          © <span data-year>2026</span> Clear View Home Inspections, LLC. All rights reserved.
        </p>
      </div>
    </footer>
```

- [ ] **Step 5: Add the footer year to `src/main.js`**

`src/main.js` becomes:

```js
import './main.css';

for (const el of document.querySelectorAll('[data-year]')) {
  el.textContent = String(new Date().getFullYear());
}
```

- [ ] **Step 6: Run the tests to see them pass**

Run: `npm test`
Expected: PASS, all tests in `tests/page.test.js` and `tests/images.test.js`.

- [ ] **Step 7: Check the build**

Run: `npm run build`
Expected: no errors and no warnings.

- [ ] **Step 8: Commit**

```bash
git add index.html src/main.js tests/page.test.js
git commit -m "feat: add services, reports, reviews, FAQ, contact, and footer" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Mobile menu

**Files:**
- Create: `src/js/menu.js`
- Modify: `src/main.js`
- Test: `tests/menu.test.js`

**Interfaces:**
- Consumes: the menu markup from Task 3 (`[data-menu-button]` with `aria-controls`, and the panel with that `id` and the `hidden` attribute).
- Produces: `export function initMenu(root = document): () => void`. It returns a cleanup function that removes all listeners. If no `[data-menu-button]` exists, it returns a cleanup function that does nothing.

- [ ] **Step 1: Write the failing tests**

Create `tests/menu.test.js`:

```js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initMenu } from '../src/js/menu.js';

let cleanup;

beforeEach(() => {
  document.body.innerHTML = `
    <a href="#elsewhere" id="elsewhere">Elsewhere</a>
    <button type="button" data-menu-button aria-controls="mobile-menu" aria-expanded="false">Menu</button>
    <nav id="mobile-menu" hidden>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </nav>`;
  cleanup = initMenu();
});

afterEach(() => cleanup());

const button = () => document.querySelector('[data-menu-button]');
const panel = () => document.getElementById('mobile-menu');
const pressEscape = () =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

describe('initMenu', () => {
  it('opens the menu on a click', () => {
    button().click();
    expect(button().getAttribute('aria-expanded')).toBe('true');
    expect(panel().hidden).toBe(false);
  });

  it('closes the menu on a second click', () => {
    button().click();
    button().click();
    expect(button().getAttribute('aria-expanded')).toBe('false');
    expect(panel().hidden).toBe(true);
  });

  it('closes the menu when a link in it is clicked', () => {
    button().click();
    panel().querySelector('a').click();
    expect(button().getAttribute('aria-expanded')).toBe('false');
    expect(panel().hidden).toBe(true);
  });

  it('closes the menu on Escape and moves focus to the button', () => {
    button().click();
    panel().querySelector('a').focus();
    pressEscape();
    expect(panel().hidden).toBe(true);
    expect(document.activeElement).toBe(button());
  });

  it('does not move focus on Escape when the menu is closed', () => {
    const link = document.getElementById('elsewhere');
    link.focus();
    pressEscape();
    expect(document.activeElement).toBe(link);
  });

  it('removes its listeners on cleanup', () => {
    cleanup();
    button().click();
    expect(panel().hidden).toBe(true);
  });

  it('does nothing when the page has no menu button', () => {
    document.body.innerHTML = '<p>No menu</p>';
    expect(() => initMenu()()).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run tests/menu.test.js`
Expected: FAIL with `Failed to resolve import "../src/js/menu.js"`.

- [ ] **Step 3: Create `src/js/menu.js`**

```js
// Opens and closes the mobile nav panel named by the button's aria-controls.
export function initMenu(root = document) {
  const button = root.querySelector('[data-menu-button]');
  const panel = button && root.querySelector(`#${button.getAttribute('aria-controls')}`);
  if (!button || !panel) return () => {};

  const controller = new AbortController();
  const { signal } = controller;

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };

  button.addEventListener('click', () => setOpen(!isOpen()), { signal });

  panel.addEventListener(
    'click',
    (event) => {
      if (event.target.closest('a')) setOpen(false);
    },
    { signal },
  );

  root.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        button.focus();
      }
    },
    { signal },
  );

  return () => controller.abort();
}
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `npx vitest run tests/menu.test.js`
Expected: PASS, 7 tests.

- [ ] **Step 5: Start the menu in `src/main.js`**

`src/main.js` becomes:

```js
import './main.css';
import { initMenu } from './js/menu.js';

initMenu();

for (const el of document.querySelectorAll('[data-year]')) {
  el.textContent = String(new Date().getFullYear());
}
```

- [ ] **Step 6: Check it in the browser**

Run: `npm run dev`. Open the page. Make the window narrower than 768 px, or use the device toolbar in the browser dev tools.
Expected:
1. The menu button opens the panel, and the icon changes to an ×.
2. A click on "FAQ" closes the panel and scrolls to the FAQ heading. The heading is not under the header.
3. The Escape key closes the open panel.

Stop the server.

- [ ] **Step 7: Commit**

```bash
git add src/js/menu.js src/main.js tests/menu.test.js
git commit -m "feat: add mobile menu" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Click-to-load video

**Files:**
- Create: `src/js/video.js`
- Modify: `src/main.js`
- Test: `tests/video.test.js`

**Interfaces:**
- Consumes: the video markup from Task 3 (`button[data-video-id][data-video-title]` inside a `relative` container).
- Produces: `export function initVideo(root = document): void`. It also exports `EMBED_BASE = 'https://www.youtube-nocookie.com/embed/'`.

- [ ] **Step 1: Write the failing tests**

Create `tests/video.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { initVideo, EMBED_BASE } from '../src/js/video.js';

beforeEach(() => {
  document.body.innerHTML = `
    <div class="relative" id="frame">
      <button type="button" data-video-id="H6RSqJ-COWg" data-video-title="Clear View Home Inspections">Play</button>
    </div>`;
  initVideo();
});

const frame = () => document.getElementById('frame');

describe('initVideo', () => {
  it('does not add an iframe before a click', () => {
    expect(frame().querySelector('iframe')).toBeNull();
  });

  it('replaces the button with a privacy-enhanced YouTube iframe on click', () => {
    frame().querySelector('button').click();
    const iframe = frame().querySelector('iframe');
    expect(frame().querySelector('button')).toBeNull();
    expect(iframe.getAttribute('src')).toBe(`${EMBED_BASE}H6RSqJ-COWg?autoplay=1&rel=0`);
    expect(EMBED_BASE).toBe('https://www.youtube-nocookie.com/embed/');
  });

  it('gives the iframe a title and the permissions it needs', () => {
    frame().querySelector('button').click();
    const iframe = frame().querySelector('iframe');
    expect(iframe.getAttribute('title')).toBe('Clear View Home Inspections');
    expect(iframe.getAttribute('allow')).toContain('autoplay');
    expect(iframe.hasAttribute('allowfullscreen')).toBe(true);
    expect(iframe.getAttribute('class')).toBe('absolute inset-0 h-full w-full');
  });

  it('adds only one iframe when the button is clicked twice', () => {
    const button = frame().querySelector('button');
    button.click();
    button.click();
    expect(frame().querySelectorAll('iframe')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run tests/video.test.js`
Expected: FAIL with `Failed to resolve import "../src/js/video.js"`.

- [ ] **Step 3: Create `src/js/video.js`**

```js
// Swaps a video poster button for the YouTube player only when the visitor clicks it,
// so the page sends no request to YouTube before that.
export const EMBED_BASE = 'https://www.youtube-nocookie.com/embed/';

export function initVideo(root = document) {
  for (const button of root.querySelectorAll('button[data-video-id]')) {
    button.addEventListener(
      'click',
      () => {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', `${EMBED_BASE}${encodeURIComponent(button.dataset.videoId)}?autoplay=1&rel=0`);
        iframe.setAttribute('title', button.dataset.videoTitle || 'Video');
        iframe.setAttribute(
          'allow',
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        );
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('class', 'absolute inset-0 h-full w-full');
        button.replaceWith(iframe);
        iframe.focus();
      },
      { once: true },
    );
  }
}
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `npx vitest run tests/video.test.js`
Expected: PASS, 4 tests.

- [ ] **Step 5: Start the video in `src/main.js`**

`src/main.js` becomes:

```js
import './main.css';
import { initMenu } from './js/menu.js';
import { initVideo } from './js/video.js';

initMenu();
initVideo();

for (const el of document.querySelectorAll('[data-year]')) {
  el.textContent = String(new Date().getFullYear());
}
```

- [ ] **Step 6: Check it in the browser**

Run: `npm run dev`. Open the page with the browser dev tools on the **Network** tab.
Expected:
1. No request to `youtube` or `ytimg` before the click.
2. A click on the thumbnail loads the player, and the video starts.

Stop the server.

- [ ] **Step 7: Commit**

```bash
git add src/js/video.js src/main.js tests/video.test.js
git commit -m "feat: load the YouTube video on click" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Contact form

**Files:**
- Create: `src/js/contact-form.js`
- Modify: `src/main.js`, `README.md`
- Test: `tests/contact-form.test.js`

**Interfaces:**
- Consumes: the form markup from Task 4 (field names `first_name`, `last_name`, `email`, `message`, `_gotcha`; attribute `data-endpoint`; `button[type="submit"]`; `[role="status"]` inside the form; `[data-form-success]` in the same parent as the form).
- Produces:
  - `export const CONTACT_EMAIL = 'info@cvhi.us'`
  - `export const CONTACT_PHONE = '(317) 578-0890'`
  - `export const MAIL_SUBJECT = 'Schedule Home Inspection'`
  - `export const MESSAGES = { mailto: string, sending: string, error: string }`
  - `export function buildMailto({ firstName, lastName, email, message }): string`
  - `export async function submitContactForm(form, { fetchImpl, openUrl } = {}): Promise<void>`
  - `export function initContactForm(form, deps): void`. `deps` is the same object that `submitContactForm` takes.

- [ ] **Step 1: Write the failing tests**

Create `tests/contact-form.test.js`:

```js
import { describe, it, expect, vi } from 'vitest';
import {
  buildMailto,
  submitContactForm,
  initContactForm,
  MESSAGES,
} from '../src/js/contact-form.js';

function renderForm({ endpoint = '' } = {}) {
  document.body.innerHTML = `
    <div>
      <form id="contact-form" data-endpoint="${endpoint}">
        <input type="hidden" name="form-name" value="contact">
        <input type="text" name="_gotcha">
        <input name="first_name" value="Jane">
        <input name="last_name" value="Doe">
        <input name="email" value="jane@example.com">
        <textarea name="message">Hello</textarea>
        <button type="submit">Send message</button>
        <p role="status"></p>
      </form>
      <div data-form-success hidden tabindex="-1">Thanks!</div>
    </div>`;
  return document.getElementById('contact-form');
}

const status = () => document.querySelector('[role="status"]');
const success = () => document.querySelector('[data-form-success]');
const button = () => document.querySelector('button[type="submit"]');

function deferred() {
  let resolve;
  const promise = new Promise((r) => (resolve = r));
  return { promise, resolve };
}

describe('buildMailto', () => {
  it('builds the mailto URL with the subject and the body', () => {
    expect(
      buildMailto({ firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', message: 'Hello' }),
    ).toBe(
      'mailto:info@cvhi.us?subject=Schedule%20Home%20Inspection&body=Name%3A%20Jane%20Doe%0D%0AEmail%3A%20jane%40example.com%0D%0A%0D%0AHello',
    );
  });

  it('encodes characters that would break the mailto URL', () => {
    const message = 'Radon & mold?\nLot #12, 50% done';
    const url = buildMailto({ firstName: 'A', lastName: 'B', email: 'a@b.co', message });
    expect(url.split('&')).toHaveLength(2);
    expect(url).not.toContain('#');
    const body = decodeURIComponent(url.split('&body=')[1]);
    expect(body.endsWith('Radon & mold?\nLot #12, 50% done')).toBe(true);
  });
});

describe('submitContactForm without an endpoint', () => {
  it('opens the email app with the form text and does not call fetch', async () => {
    const form = renderForm();
    const fetchImpl = vi.fn();
    const openUrl = vi.fn();
    await submitContactForm(form, { fetchImpl, openUrl });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(openUrl).toHaveBeenCalledOnce();
    expect(openUrl).toHaveBeenCalledWith(
      buildMailto({ firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', message: 'Hello' }),
    );
    expect(status().textContent).toBe(MESSAGES.mailto);
  });
});

describe('submitContactForm with an endpoint', () => {
  it('posts the form as URL-encoded data and shows the success message', async () => {
    const form = renderForm({ endpoint: 'https://formspree.io/f/test' });
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    await submitContactForm(form, { fetchImpl, openUrl: vi.fn() });

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, options] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://formspree.io/f/test');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams(options.body);
    expect(body.get('form-name')).toBe('contact');
    expect(body.get('first_name')).toBe('Jane');
    expect(body.get('email')).toBe('jane@example.com');
    expect(body.get('message')).toBe('Hello');

    expect(form.hidden).toBe(true);
    expect(success().hidden).toBe(false);
    expect(document.activeElement).toBe(success());
  });

  it('disables the button while the request is in progress', async () => {
    const form = renderForm({ endpoint: '/' });
    const request = deferred();
    const pending = submitContactForm(form, { fetchImpl: () => request.promise, openUrl: vi.fn() });
    expect(button().disabled).toBe(true);
    expect(status().textContent).toBe(MESSAGES.sending);
    request.resolve({ ok: true, status: 200 });
    await pending;
  });

  it('ignores a second submit while the first request is in progress', async () => {
    const form = renderForm({ endpoint: '/' });
    const request = deferred();
    const fetchImpl = vi.fn(() => request.promise);
    const first = submitContactForm(form, { fetchImpl, openUrl: vi.fn() });
    const second = submitContactForm(form, { fetchImpl, openUrl: vi.fn() });
    request.resolve({ ok: true, status: 200 });
    await Promise.all([first, second]);
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it('keeps the text and re-enables the button when the response is not OK', async () => {
    const form = renderForm({ endpoint: '/' });
    await submitContactForm(form, {
      fetchImpl: vi.fn().mockResolvedValue({ ok: false, status: 422 }),
      openUrl: vi.fn(),
    });
    expect(status().textContent).toBe(MESSAGES.error);
    expect(status().dataset.state).toBe('error');
    expect(form.hidden).toBe(false);
    expect(success().hidden).toBe(true);
    expect(form.elements.namedItem('message').value).toBe('Hello');
    expect(button().disabled).toBe(false);
  });

  it('keeps the text and re-enables the button when the network fails', async () => {
    const form = renderForm({ endpoint: '/' });
    await submitContactForm(form, {
      fetchImpl: vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
      openUrl: vi.fn(),
    });
    expect(status().textContent).toBe(MESSAGES.error);
    expect(form.elements.namedItem('first_name').value).toBe('Jane');
    expect(button().disabled).toBe(false);
  });

  it('can send again after a failure', async () => {
    const form = renderForm({ endpoint: '/' });
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce({ ok: true, status: 200 });
    await submitContactForm(form, { fetchImpl, openUrl: vi.fn() });
    await submitContactForm(form, { fetchImpl, openUrl: vi.fn() });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(success().hidden).toBe(false);
  });
});

describe('spam protection', () => {
  it('sends nothing when the hidden field has a value', async () => {
    const form = renderForm({ endpoint: '/' });
    form.elements.namedItem('_gotcha').value = 'spam';
    const fetchImpl = vi.fn();
    const openUrl = vi.fn();
    await submitContactForm(form, { fetchImpl, openUrl });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(openUrl).not.toHaveBeenCalled();
  });
});

describe('initContactForm', () => {
  it('stops the normal form post and handles the submit', async () => {
    const form = renderForm();
    const openUrl = vi.fn();
    initContactForm(form, { fetchImpl: vi.fn(), openUrl });
    const event = new Event('submit', { cancelable: true });
    form.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    await vi.waitFor(() => expect(openUrl).toHaveBeenCalledOnce());
  });
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run tests/contact-form.test.js`
Expected: FAIL with `Failed to resolve import "../src/js/contact-form.js"`.

- [ ] **Step 3: Create `src/js/contact-form.js`**

```js
// Sends the contact form. With no data-endpoint, it opens the visitor's email app (mailto).
// With a data-endpoint (Netlify Forms or Formspree), it posts the form and shows the result.
export const CONTACT_EMAIL = 'info@cvhi.us';
export const CONTACT_PHONE = '(317) 578-0890';
export const MAIL_SUBJECT = 'Schedule Home Inspection';

export const MESSAGES = {
  mailto: `Your email app should open with your message. If it doesn't, email us at ${CONTACT_EMAIL}.`,
  sending: 'Sending…',
  error: `Sorry, we couldn't send your message. Please call ${CONTACT_PHONE} or email ${CONTACT_EMAIL}.`,
};

export function buildMailto({ firstName, lastName, email, message }) {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  const body = [`Name: ${name}`, `Email: ${email}`, '', message].join('\r\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(body)}`;
}

function readFields(form) {
  const data = new FormData(form);
  const get = (name) => String(data.get(name) ?? '').trim();
  return {
    firstName: get('first_name'),
    lastName: get('last_name'),
    email: get('email'),
    message: get('message'),
  };
}

function setStatus(form, text, state) {
  const status = form.querySelector('[role="status"]');
  if (!status) return;
  status.textContent = text;
  status.dataset.state = state;
}

function showSuccess(form) {
  const success = form.parentElement?.querySelector('[data-form-success]');
  form.hidden = true;
  if (success) {
    success.hidden = false;
    success.focus();
  }
}

export async function submitContactForm(
  form,
  { fetchImpl = globalThis.fetch, openUrl = (url) => window.location.assign(url) } = {},
) {
  if (form.dataset.sending === 'true') return;
  if (form.elements.namedItem('_gotcha')?.value) return;

  const endpoint = form.dataset.endpoint?.trim();
  if (!endpoint) {
    openUrl(buildMailto(readFields(form)));
    setStatus(form, MESSAGES.mailto, 'info');
    return;
  }

  const button = form.querySelector('[type="submit"]');
  form.dataset.sending = 'true';
  if (button) button.disabled = true;
  setStatus(form, MESSAGES.sending, 'info');

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(new FormData(form)).toString(),
    });
    if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);
    setStatus(form, '', 'info');
    showSuccess(form);
  } catch {
    setStatus(form, MESSAGES.error, 'error');
  } finally {
    delete form.dataset.sending;
    if (button) button.disabled = false;
  }
}

export function initContactForm(form, deps) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitContactForm(form, deps);
  });
}
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `npx vitest run tests/contact-form.test.js`
Expected: PASS, 11 tests.

- [ ] **Step 5: Start the form in `src/main.js`**

`src/main.js` becomes:

```js
import './main.css';
import { initMenu } from './js/menu.js';
import { initVideo } from './js/video.js';
import { initContactForm } from './js/contact-form.js';

initMenu();
initVideo();

const contactForm = document.getElementById('contact-form');
if (contactForm) initContactForm(contactForm);

for (const el of document.querySelectorAll('[data-year]')) {
  el.textContent = String(new Date().getFullYear());
}
```

- [ ] **Step 6: Add the form section to `README.md`**

Add this section after the **Deploy** section:

````markdown
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
````

- [ ] **Step 7: Check it in the browser**

Run: `npm run dev`. Open the page. Fill in the form with a message that contains `&` and a line break. Click "Send message".
Expected: the email app opens a new email to info@cvhi.us. The subject is "Schedule Home Inspection". The body has the name, the email, and the full message, with the line break. The status line under the button shows the mailto message.

Then, check the empty-field case: clear the email field and click "Send message".
Expected: the browser shows its "Please fill out this field" message, and nothing is sent.

Stop the server.

- [ ] **Step 8: Commit**

```bash
git add src/js/contact-form.js src/main.js tests/contact-form.test.js README.md
git commit -m "feat: add contact form with mailto and endpoint modes" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Final verification

**Files:**
- Modify: only the files that a failed check points to.

**Interfaces:**
- Consumes: the whole site.
- Produces: a verified build, and the screenshots and Lighthouse report in `.superpowers/verify/` (this folder is in `.gitignore`).

- [ ] **Step 1: Run all tests**

Run: `npm test`
Expected: PASS. 5 test files: `page`, `images`, `menu`, `video`, `contact-form`.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: no errors and no warnings.

- [ ] **Step 3: Serve the build**

Run in the background: `npm run preview`
Expected: Vite prints `http://localhost:4173/`.

- [ ] **Step 4: Take screenshots at phone and desktop width**

```bash
mkdir -p .superpowers/verify
npx -y playwright@1.63.0 screenshot --channel chrome --viewport-size=375,812 --full-page http://localhost:4173/ .superpowers/verify/phone.png
npx -y playwright@1.63.0 screenshot --channel chrome --viewport-size=1440,900 --full-page http://localhost:4173/ .superpowers/verify/desktop.png
```

Open both images. Expected for each section:
1. No text overflows its box, and no element overlaps another.
2. The page has no horizontal scroll. At 375 px, the full-page image is exactly 375 px wide: run `sips -g pixelWidth .superpowers/verify/phone.png` and expect `375`.
3. On the phone image, the hero text is white on a dark overlay across the full width.
4. On the phone image, the services show as one column of cards.

If `--channel chrome` fails, run `npx -y playwright@1.63.0 install chromium` and run the commands again without `--channel chrome`.

- [ ] **Step 5: Run Lighthouse**

```bash
npx -y lighthouse http://localhost:4173/ \
  --only-categories=performance,accessibility,best-practices \
  --chrome-flags="--headless=new" \
  --output=json --output-path=.superpowers/verify/lighthouse.json --quiet
node -e "const r=require('./.superpowers/verify/lighthouse.json');for(const[k,c]of Object.entries(r.categories))console.log(k,Math.round(c.score*100))"
```

Expected: each score is 95 or more. If a score is lower, run this to list the failed audits:

```bash
node -e "const r=require('./.superpowers/verify/lighthouse.json');for(const a of Object.values(r.audits))if(a.score!==null&&a.score<0.9)console.log(a.id,'-',a.title)"
```

Fix each failed audit in the file it names. Then run Steps 1, 2, and 5 again.

- [ ] **Step 6: Check behavior in the built site**

Open `http://localhost:4173/` in Chrome. Check each item:
1. Each nav link scrolls to its section, and the section heading shows below the sticky header.
2. At a width under 768 px, the menu opens, closes, closes on a link click, and closes with the Escape key.
3. The Tab key moves through the page, and each link, button, and field shows the focus ring. The first Tab shows "Skip to content".
4. A click on the video thumbnail loads and plays the video.
5. The form opens the email app with the correct address, subject, and body.
6. The FAQ items open and close with a click, and with the Enter key.
7. The footer shows the current year.

- [ ] **Step 7: Check the endpoint mode against a local test server**

This check proves that the form posts correctly and shows each result. It does not change any committed file.

1. In a new terminal, start a test endpoint on port 8787. It returns OK for every POST:

   ```bash
   node -e "require('http').createServer((q,s)=>{let b='';q.on('data',c=>b+=c);q.on('end',()=>{console.log(q.method,b);s.writeHead(q.method==='OPTIONS'?204:200,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*'});s.end('{\"ok\":true}')})}).listen(8787)"
   ```

2. In Chrome dev tools on `http://localhost:4173/`, run in the **Console**:

   ```js
   document.getElementById('contact-form').dataset.endpoint = 'http://localhost:8787/';
   ```

3. Fill in the form and click "Send message".
   Expected: the test server prints `POST form-name=contact&_gotcha=&first_name=…`. The page shows "Thanks! We'll be in touch soon."
4. Reload the page. Stop the test server with Ctrl+C. Set the endpoint again as in item 2. Send the form again.
   Expected: the error message with the phone number and the email shows under the button. The text stays in the form, and the button works again.

- [ ] **Step 8: Stop the preview server and commit any fixes**

Stop `npm run preview`. If Steps 1–7 needed fixes, commit them:

```bash
git add -A
git commit -m "fix: address final verification findings" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

If no fixes were needed, there is nothing to commit.
