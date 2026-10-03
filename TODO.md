# TODO

Open follow-ups for the site. Check an item off (or delete it) in the same pull request that finishes it.

## Before launch

- [ ] **Choose a form provider.** The contact form opens the visitor's email app until `data-endpoint` is set on `<form id="contact-form">`. The README has setup steps for Netlify Forms and Formspree. Netlify Forms works only when Netlify hosts the site, so on GitHub Pages use Formspree (the free plan accepts 50 messages a month) or a similar service.
- [ ] **Test the form by hand.** Click "Send message" once in a real browser, and confirm that the email app opens a message to info@cvhi.us with the form text. Automated tests cannot open an email app. After a provider is connected, send one real test message.
- [ ] **Remove the preview `noindex`.** Delete the `SITE_NOINDEX` line from the **Build** step in `.github/workflows/deploy.yml`.
- [ ] **Move the domain from Wix.** Follow "Domain and DNS (at launch)" in the README: `public/CNAME`, DNS records, Enforce HTTPS. Keep the MX records, so email to info@cvhi.us keeps working.
- [ ] **Handle the old Wix URLs.** The Wix site used paths such as `/services`, `/home-inspections`, `/reports`, `/testimonials`, and `/contact-us`. Search results and old links point to them. GitHub Pages has no server redirects, so add one small HTML page per path that redirects to the matching section (`/#services`, `/#reports`, `/#reviews`, `/#contact`), or a `404.html` that does the same.
- [ ] **Check the share preview after launch.** `og:url` and `og:image` point to `https://www.cvhi.us/`, so link previews show the image only after the domain moves. Test a shared link after launch.

## Owner requests

- [ ] **Larger hero photo.** The current photo is 1024 × 496 px, so it looks soft on wide screens. With a larger original, regenerate the images, and make `public/og-image.jpg` 1200 × 630 px.
- [ ] **More review quotes.** Collect the exact text and the reviewer's name from Google (https://share.google/r1sEf6h0a8sqJCZn8) or Yelp (https://www.yelp.com/biz/clear-view-home-inspections-fishers). The Yelp listing shows the business as "Closed". The owner can correct this through Yelp for Business.

## Maintenance

- [ ] **Move to Node 26 after 2026-10-28,** when Node 26 becomes LTS. Change `.nvmrc` to `26`. The `engines` range already allows it. Node 24 enters maintenance on 2026-10-20 and reaches end of life on 2028-04-30.

## Polish (from the code review)

- [ ] **Phone tap targets under 44 px:** the footer links (32 px), the FAQ questions (28 px, because the padding is on `<details>` instead of `<summary>`), and the header logo link (40 px).
- [ ] **Mailto message length:** Some email apps fail on `mailto:` links longer than about 2,000 characters. Consider a `maxlength` on the message field while the form is in mailto mode.
- [ ] **Formspree field:** Formspree emails will show a "form-name: contact" field. Only Netlify needs it. Remove the hidden field if the site stays on Formspree.
- [ ] **Focus ring test:** The visible focus ring was checked with a one-off Chrome script. A committed browser test (for example Playwright) would catch a later CSS change that hides it.

## Later: SEO and marketing

- [ ] Structured data (`LocalBusiness` JSON-LD with the address, phone number, hours, and service area).
- [ ] Review the page title for search results. It has 67 characters, and Google often shows about 60. The owner approves any change. (`html-validate`'s `long-title` rule is off until then.)
- [ ] A canonical URL, `sitemap.xml`, and `robots.txt`. Submit the sitemap in Google Search Console and Bing Webmaster Tools.
- [ ] Separate pages for the main services.
- [ ] Analytics.
- [ ] React, if the site grows. Vite already supports it.
