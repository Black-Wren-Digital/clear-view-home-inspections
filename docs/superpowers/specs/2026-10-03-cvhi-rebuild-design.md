# Clear View Home Inspections: Site Rebuild Design

- **Date:** 2026-10-03
- **Status:** Approved design. Owner answers added on 2026-10-03.
- **Current site:** https://www.cvhi.us (Wix, one page)

## 1. Goal

Rebuild the current Clear View Home Inspections site in this repo with a modern design. The developer builds the site for the business owner. The new site replaces cvhi.us after the owner approves it.

### Success criteria

1. The new site has all of the content of the current site, with light text polish.
2. The owner can compare the new site with the current site section by section.
3. The site works well at phone width (375 px) and at desktop width (1440 px).
4. The contact form works on any static host, with or without a form service.
5. `npm run build` completes with no errors.
6. Lighthouse gives a score of 95 or more for performance, accessibility, and best practices.

### Out of scope

- Structured data and other SEO work, other than basic meta tags.
- Separate pages for each service.
- Analytics and marketing tools.
- The move of the cvhi.us domain away from Wix.
- React. The setup must let us add React later with no change of build tool.

## 2. Decisions

| Topic           | Decision                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------- |
| Content         | Light polish. Same sections and facts. Fix small errors and shorten headings.             |
| Brand           | Keep the current logo. The main color is the logo royal blue, `#243292`.                  |
| Page structure  | One page. Nav links jump to sections.                                                     |
| Hosting         | Host-neutral static site. Netlify or GitHub Pages is likely.                              |
| Tooling         | Vite with Tailwind CSS v4 (`@tailwindcss/vite`). Plain HTML and a small JavaScript file.  |
| Hero layout     | Option A: full-width house photo, blue gradient overlay, white text on the left.          |

## 3. Project structure

```
cvhi/
├── index.html          # the one page, with all 10 sections
├── src/
│   ├── main.css        # Tailwind import, theme tokens, small base styles
│   └── main.js         # mobile menu, video, contact form, footer year
├── public/
│   └── images/         # logo, hero photo, report sample, favicon
├── vite.config.js      # Vite with the Tailwind plugin, base: './'
├── package.json        # scripts: dev, build, preview
├── README.md           # run, build, deploy, and connect the form
└── .gitignore          # node_modules, dist, .superpowers
```

### Tooling details

- **Vite config:** Set `base: './'`. Relative asset paths then work on a custom domain and on a GitHub Pages project URL such as `user.github.io/cvhi/`.
- **Theme tokens** in `src/main.css` with the Tailwind `@theme` block:
  - `--color-brand: #243292` and a scale of shades from `brand-50` to `brand-950`.
  - `--font-sans` set to Inter Variable, then the system font stack.
- **Font:** `@fontsource-variable/inter` from npm. The site serves the font itself, so the page sends no request to Google.
- **Icons:** Inline SVG from the Lucide icon set, pasted into the HTML. The site has no icon dependency.
- **Images:** Download the full-size originals from Wix. Convert each image to WebP at the sizes the layout uses. Keep a JPEG fallback for the Open Graph image only. Set `width` and `height` on each `<img>` to stop layout shift. Load images below the hero with `loading="lazy"`.

## 4. Page layout

All sections are in `index.html`, in this order. Each section that the nav links to has an `id` and a `scroll-margin-top` value, so the sticky header does not cover the section heading.

| #  | Section          | `id`        | Nav label  | Background             |
| -- | ---------------- | ----------- | ---------- | ---------------------- |
| 1  | Sticky header    | —           | —          | White, bottom border   |
| 2  | Hero             | `top`       | —          | Photo, blue overlay    |
| 3  | Trust bar        | —           | —          | White                  |
| 4  | Why Clear View   | `about`     | —          | White                  |
| 5  | Services         | `services`  | Services   | Light gray (`slate-50`)|
| 6  | Your report      | `reports`   | Reports    | White                  |
| 7  | Reviews          | `reviews`   | Reviews    | Light gray             |
| 8  | FAQ              | `faq`       | FAQ        | White                  |
| 9  | Contact          | `contact`   | Contact    | Brand blue             |
| 10 | Footer           | —           | —          | Dark (`slate-900`)     |

### Section details

1. **Sticky header**
   - Desktop: the logo and the business name on the left. The nav links and a "Call (317) 578-0890" button on the right.
   - Phone: the logo, a phone icon link (`tel:3175780890`), and a menu button. The menu button opens a panel with the nav links.
2. **Hero:** The house photo covers the full width. A gradient goes from dark brand blue on the left to almost clear on the right. The text block is on the left. It has an eyebrow line, an `<h1>`, one short paragraph, and 2 buttons: "Schedule an inspection" (to `#contact`) and "Our services" (to `#services`).
3. **Trust bar:** 4 short facts in one row on desktop. The facts show as a 2 × 2 grid on phones.
4. **Why Clear View:** Text on the left. The video on the right. On phones, the video goes below the text.
5. **Services:** A grid of cards. Each card has an icon and a service name. The last card is a brand-blue "Not sure what you need?" card with a call link. The grid has 12 cards. It has 4 columns on desktop, 2 on tablet, and 1 on phone.
6. **Your report:** The sample report image on the left. Text on the right.
7. **Reviews:** One centered quote card. Under the card, 2 outline buttons link to the reviews on Google and on Yelp. Both links open in a new tab.
8. **FAQ:** 3 `<details>` elements. The first one is open when the page loads.
9. **Contact:** Contact details on the left. The form, in a white card, on the right.
10. **Footer:** The business name, address, phone, and email. Links to Facebook and to Google Maps. The copyright line with the current year.

## 5. Content

This section gives the text for the new site. The owner must approve it. Text in quotes from other people stays word for word.

### Meta tags

- **Title:** `Clear View Home Inspections | Fishers & Indianapolis Home Inspector`
- **Description:** `Clear View Home Inspections serves Central Indiana with residential and commercial home inspections, new construction and pre-drywall inspections, radon testing, and mold testing.`
- **Open Graph:** the same title and description, `og:image` set to the hero photo (JPEG, 1200 × 630), `og:type` set to `website`.
- **Favicon:** made from the logo.

### Header nav

Services · Reports · Reviews · FAQ · Contact · button "Call (317) 578-0890"

### Hero

- **Eyebrow:** Indiana's clear choice for home inspections
- **H1:** Protect your investment. Choose Clear View.
- **Paragraph:** Residential and commercial home inspections for Indianapolis and the surrounding counties.
- **Buttons:** Schedule an inspection · Our services

### Trust bar

- Serving Central Indiana since 1999
- Licensed home inspectors
- Report within 24 hours
- Based in Fishers, Indiana

### Why Clear View

- **H2:** If you're buying a house, you need a home inspection.
- **Paragraph 1:** Your home is your most important investment. Our inspections pay for themselves with equity protection and peace of mind.
- **Paragraph 2:** Clear View delivers a complete, thorough inspection of the plumbing, electrical, heating and air conditioning systems, foundation, roof, exterior and interior structures and surfaces, and built-in appliances.
- **Paragraph 3:** We stay in contact with you and your real estate agent from start to finish, so you get timely, accurate information.
- **Paragraph 4:** We serve residential and commercial clients in Indianapolis and the surrounding counties from our office in Fishers, Indiana.
- **Video:** YouTube ID `H6RSqJ-COWg`, 1 minute 16 seconds.

### Services

- **Eyebrow:** Services you can count on
- **H2:** What we inspect and test
- **Cards:**
  1. Full Home Inspections
  2. New Construction Inspections
  3. Pre-Drywall Inspections
  4. Foundation Inspections
  5. Commercial Inspections
  6. Termite Certification
  7. Radon Testing
  8. Mold Testing
  9. Air & Water Sampling
  10. Winterization & De-Winterization
  11. Well & Septic Certifications
  12. Not sure what you need? · Call us →

### Your report

- **Eyebrow:** Inspection reports
- **H2:** A clear report within 24 hours
- **Paragraph:** Within 24 hours of your inspection, you receive a detailed, easy-to-read report. It lists each defect, sorts the defects by severity, and includes photos.

### Reviews

- **Quote (word for word):**
  > My fiance and I are in the process of buying our first home. After finding the perfect home, our realtor recommended [Clear View Home Inspections] for the inspection. Doug Wehr was our inspector and he was absolutely fantastic. He was incredibly thorough and made sure to explain every step of the process and every detail regarding any serious or potential issue in the home. We are so appreciative of his time and expertise during our experience. I would highly recommend Doug to any of my family and friends!
- **Name:** Krystal Schulz
- **Label:** First-time home buyer
- **Links:**
  - "Read our Google reviews": `https://share.google/r1sEf6h0a8sqJCZn8`
  - "Read our Yelp reviews": `https://www.yelp.com/biz/clear-view-home-inspections-fishers`
- **More quotes:** The section can show more quotes later. Each quote must be the exact text of a real review, with the reviewer's name as the review shows it.

### FAQ

- **H2:** Questions about home inspections
- **What is a home inspection?** A home inspection is a thorough visual review of the condition of a home's structure, craftsmanship, and electrical and mechanical systems by a licensed home inspector. It's the due diligence that gives you the awareness, confidence, and peace of mind to make an informed investment.
- **Should I be present for the inspection?** We recommend it. It isn't required, but you'll learn valuable information about your home that can save you hundreds, even thousands, of dollars in future repairs. A typical inspection takes two to three hours.
- **When can I expect my report?** Within 24 hours of the inspection, you'll receive a detailed, easy-to-read report that lists each defect, sorts the defects by severity, and includes photos.

Note: On the current site, the answer to "Should I be present?" shows under "What's a home inspection?". The new site puts each answer under the correct question.

### Contact

- **H2:** Schedule your inspection
- **Paragraph:** Call, email, or send us a message, and we'll help you schedule your inspection.
- **Phone:** (317) 578-0890 (`tel:3175780890`)
- **Email:** info@cvhi.us
- **Address:** 11327 Reflection Point Drive, Fishers, IN 46037 (link to `https://maps.google.com/?cid=8238996744037397548`)
- **Form fields:** First name, Last name, Email, Message. Button: "Send message".

### Footer

- Clear View Home Inspections, LLC
- Address, phone, and email as above.
- Facebook: `https://www.facebook.com/Clear-View-Home-Inspections-LLC-1574379252847638/`
- © {current year} Clear View Home Inspections, LLC. All rights reserved.

### Removed from the current site

- The Twitter, Pinterest, Tumblr, and "Copy link" share buttons under the video.
- The "More" nav item and the duplicate nav in the footer.

## 6. Behavior

### Contact form

The form works on any static host. The `data-endpoint` attribute on the `<form>` element controls how it sends messages.

**Markup:**

```html
<form id="contact-form" name="contact" method="POST" data-endpoint="" netlify-honeypot="_gotcha">
  <input type="hidden" name="form-name" value="contact">
  <!-- hidden from people; bots fill it in -->
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="hidden">
  <!-- first_name, last_name, email, message: all required -->
</form>
```

**Flow in `src/main.js`:**

1. The visitor clicks "Send message". The browser checks the required fields and the email format with native HTML validation.
2. If `_gotcha` has a value, the script stops and does nothing.
3. If `data-endpoint` is empty, the script opens a `mailto:` link. The address is `info@cvhi.us`, the subject is "Schedule Home Inspection", and the body holds the name, the email, and the message.
4. If `data-endpoint` has a value, the script sends a `POST` request to that URL. The body is URL-encoded form data. The request has the header `Accept: application/json`.
   - If the response is OK, the script replaces the form with "Thanks! We'll be in touch soon."
   - If the request fails, the script shows an error message with the phone number and the email. The form text stays in place.
5. The submit button is disabled while the request is in progress, to stop double sends.

**How to connect a form service later (written in the README):**

- **Netlify Forms:** Add `data-netlify="true"` to the `<form>` element. Set `data-endpoint="/"`. Netlify finds the form in the HTML at build time.
- **Formspree:** Set `data-endpoint` to the Formspree form URL, for example `https://formspree.io/f/abcdwxyz`. Formspree reads the `_gotcha` field as its honeypot.

### Video

- The page shows a `<button>` with a local WebP thumbnail of the video and a play icon. The button has the label "Play video: Clear View Home Inspections".
- On click, the script replaces the button with an `<iframe>` from `https://www.youtube-nocookie.com/embed/H6RSqJ-COWg?autoplay=1`.
- The page sends no request to YouTube until the visitor clicks.

### Mobile menu

- The menu button has `aria-controls` and `aria-expanded`.
- A click toggles the panel and the `aria-expanded` value.
- A click on a nav link closes the panel.
- The Escape key closes the panel and moves focus back to the button.

### FAQ

- Native `<details>` and `<summary>` elements. No JavaScript.
- A plus or minus icon shows the state, with CSS on `details[open]`.

### Other

- `scroll-behavior: smooth` on `html`, only when `prefers-reduced-motion` is not set to `reduce`.
- The footer year comes from `new Date().getFullYear()`. The HTML holds the year 2026 as a fallback.

## 7. Accessibility

- A "Skip to content" link as the first element of the page. It shows when it gets focus.
- One `<h1>`. Each section has an `<h2>`.
- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`.
- Each `<img>` has `alt` text. Decorative SVG icons have `aria-hidden="true"`.
- Each form field has a visible `<label>`.
- Text contrast meets WCAG AA (4.5:1 for body text). WCAG is the Web Content Accessibility Guidelines. The hero gradient is dark enough behind the text block to keep this contrast.
- Visible focus outlines on all links, buttons, and fields.
- Tap targets are at least 44 × 44 px on phones.

## 8. Verification

The work is complete when all of these checks pass:

1. `npm run build` completes with no errors and no warnings.
2. `npm run preview` serves the built site, and each nav link scrolls to the correct section.
3. Screenshots at 375 px and 1440 px wide show each section with no overflow, no overlap, and no horizontal scroll.
4. The mobile menu opens, closes, and closes with the Escape key.
5. The video loads and plays after a click.
6. With an empty `data-endpoint`, the form opens the email app with the correct address, subject, and body.
7. With a test endpoint, the form shows the success message on an OK response and the error message on a failed response.
8. A Lighthouse audit of the built site gives 95 or more for performance, accessibility, and best practices.

## 9. Owner answers

The owner answered these questions on 2026-10-03. The content in section 5 includes the answers.

1. **Years in business:** The business started on January 19, 1999 (source: the BBB profile). The site says "since 1999", so the text stays correct each year. The current site says "25 years", which is out of date.
2. **Services list:** Add New Construction, Pre-Drywall, Foundation, and Commercial inspections as service cards.
3. **Address:** 11327 Reflection Point Drive, Fishers, IN 46037 is current.
4. **License:** Show "Licensed home inspectors". Do not show a license number.
5. **Reviews:** Link to the Google reviews and the Yelp reviews. The Yelp page shows the business as "Closed". The owner can correct this through Yelp for Business. The site links to Yelp anyway.
6. **Text:** The owner approves the polished text in section 5.

### Open item

- **More review quotes:** The Google and Yelp pages do not give the review text to automated tools. To show more quotes, someone must copy the exact text of each review into section 5. This does not block the build.
