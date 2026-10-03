# Search visibility plan

- **Status:** Planned. Start after the owner accepts the preview and the Wix site is taken down.
- **Written:** 2026-10-03. Check the facts marked with a source again before you act on them, because search platforms change often.
- **Scope:** Organic search, local (map) search, and Google Local Services Ads. Paid search ads (pay per click) are out of scope.

## Contents

1. [Goal and measures](#1-goal-and-measures)
2. [How local search works](#2-how-local-search-works)
3. [Starting point](#3-starting-point)
4. [Phases](#4-phases)
   - [Phase 0: Launch safely](#phase-0-launch-safely)
   - [Phase 1: Google Business Profile](#phase-1-google-business-profile)
   - [Phase 2: Quick wins on the current page](#phase-2-quick-wins-on-the-current-page)
   - [Phase 3: Move to Astro and grow the site](#phase-3-move-to-astro-and-grow-the-site)
   - [Phase 4: Content](#phase-4-content)
   - [Phase 5: Reviews](#phase-5-reviews)
   - [Phase 6: Citations and links](#phase-6-citations-and-links)
   - [Phase 7: Local Services Ads](#phase-7-local-services-ads)
   - [Phase 8: Measure and improve](#phase-8-measure-and-improve)
5. [Owner inputs](#5-owner-inputs)
6. [Rules to stay safe](#6-rules-to-stay-safe)
7. [Sources](#7-sources)

## 1. Goal and measures

**Goal:** When a person in the service area searches for a home inspector or a related test, Clear View shows in the top 3 map results and on the first page of organic results, and the person calls or sends a message.

**Target searches.** Each target combines a service with a place. The owner confirms the place list (see [Owner inputs](#5-owner-inputs)).

| Service terms                                                                                                                                                                            | Place terms (proposed)                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| home inspector, home inspection, new construction inspection, pre-drywall inspection, radon testing, mold testing, termite inspection, well and septic inspection, commercial inspection | Fishers, Carmel, Noblesville, Westfield, Indianapolis, Zionsville, McCordsville, Geist, Hamilton County, "near me" |

**Measures.** Record a baseline in the first week after launch, then compare each month (see [Phase 8](#phase-8-measure-and-improve)).

| Measure                                              | Where to read it                     | Why it matters                                    |
| ---------------------------------------------------- | ------------------------------------ | ------------------------------------------------- |
| Calls, website clicks, and direction requests        | Google Business Profile, Performance | Map results bring most local leads.               |
| Phone link clicks and form messages from the website | Analytics events                     | These are the leads that the site itself creates. |
| Clicks, impressions, and average position by search  | Google Search Console                | Shows which searches find the site.               |
| Map rank for each target search, by area             | A rank grid tool or a manual check   | Map rank changes with the searcher's location.    |
| Google review count and average rating               | Google Business Profile              | Reviews drive map rank and the choice to call.    |
| Leads and cost per lead                              | Local Services Ads dashboard         | Shows if the paid listing earns its cost.         |

## 2. How local search works

For a search such as "home inspector Fishers", Google shows up to 3 kinds of results, from the top of the page down:

1. **Local Services Ads.** Paid listings for screened businesses. The business pays for each lead, not for each click.
2. **The map pack.** The top 3 Google Business Profiles near the searcher. Google ranks them on 3 factors ([Google: local ranking](https://support.google.com/business/answer/7091)):
   - **Relevance:** how well the profile matches the search.
   - **Distance:** how far the business is from the searcher.
   - **Prominence:** how well known the business is, from links, articles, and the review count and rating.

   Google also says: "There's no way to request or pay for a better local ranking on Google."

3. **Organic results.** Web pages. Google ranks pages that are helpful, show first-hand experience and trust, load fast, and have links from other sites.

AI answers (AI Overviews and AI Mode) use the same signals. Google says that they need no special files or markup ([Google: AI features](https://developers.google.com/search/docs/appearance/ai-features)). So this plan has no AI-specific work, such as an `llms.txt` file.

**What this means for the plan:** The Business Profile and reviews drive the map pack. Pages for each service and place, with real expertise, drive organic results. Local Services Ads buy the top spot while the other 2 grow.

## 3. Starting point

**Strengths:**

- A business that started in 1999 (BBB profile, A+ rating), with a licensed inspector who has his own on-camera video.
- A Google Business Profile exists (the Google reviews link opens its knowledge panel). Who controls it is not known yet.
- A fast, accessible site: Lighthouse performance 99, accessibility 100, best practices 100.
- The domain `cvhi.us` has years of history, and directories already list it.

**Gaps:**

- One page, so the site can match only a few searches.
- Only 1 review quote on the site. Strong local competitors show hundreds of Google reviews (one has 307).
- Yelp shows the business as "Closed".
- No structured data, no sitemap, and no `robots.txt`.
- The old Wix URLs (`/services`, `/home-inspections`, `/reports`, `/testimonials`, `/contact-us`) disappear when Wix goes away.
- No analytics and no Search Console data yet.

**Competitors to watch:** Franchises (WIN Home Inspection, HomeTeam, Pillar To Post) have a page for each city and service. Directories (Expertise.com, HomeAdvisor, HomeGuide, Thumbtack, the InterNACHI inspector directory) take many first-page spots. A listing on the right directories is part of [Phase 6](#phase-6-citations-and-links).

## 4. Phases

Do the phases in order. Phases 4 to 6 then continue each month. Each phase lists:

- **Why:** the reason the phase matters.
- **Options considered:** the alternatives, with the chosen one marked.
- **Steps:** what to do.
- **Done when:** how to know the phase is complete.

### Phase 0: Launch safely

**Why:** A launch can lose the rankings that the Wix site has. Each old URL that returns "not found" loses its history and its links. Search engines also need to learn the new site exists, and we need data from day one to measure anything later.

**Options considered:**

| Option                                                                  | For                                                   | Against                                                                                       | Decision                                                         |
| ----------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Keep the domain `cvhi.us`                                               | Keeps its history, links, and directory listings.     | Short name with no keywords.                                                                  | **Chosen.**                                                      |
| Move to a new keyword domain (for example a "fishers inspector" domain) | Keywords in the domain.                               | Starts with no history; every listing must change; keyword domains give little benefit today. | Rejected.                                                        |
| Redirect old URLs with instant meta refresh pages                       | Works on GitHub Pages; Google treats it as permanent. | Not a true server 301.                                                                        | **Chosen** while the site is on GitHub Pages.                    |
| Host on Netlify or Cloudflare Pages for true 301 redirects              | Server redirects, form handling (Netlify).            | A second hosting change.                                                                      | Option if the form provider choice moves the site to Netlify.    |
| Let the old URLs return 404                                             | No work.                                              | Loses their rankings and links.                                                               | Rejected.                                                        |
| Analytics: Cloudflare Web Analytics                                     | Free, no cookies, no consent banner needed.           | Basic reports; adds 1 third-party script.                                                     | **Chosen** (owner can change).                                   |
| Analytics: Google Analytics 4                                           | Free, detailed, links to Google Ads.                  | Cookies; heavier script; more setup.                                                          | Alternative if Local Services Ads data must join with site data. |
| Analytics: Plausible                                                    | No cookies, simple reports.                           | A monthly fee.                                                                                | Alternative.                                                     |
| No analytics                                                            | Keeps the "no third-party requests" rule.             | No way to measure website leads.                                                              | Rejected.                                                        |

Google's redirect rule: "Google Search interprets instant `meta refresh` redirects as permanent redirects" ([Google: redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects)).

**Steps:**

1. If the Wix site is still online, record its data first:
   - Export its Search Console data, if the owner has it (top pages and searches for the last 16 months).
   - Save the list of its indexed URLs. Search `site:cvhi.us` in Google, and save its sitemap from `https://www.cvhi.us/sitemap.xml`.
   - If Wix is already gone, find the old URLs in the Internet Archive (`web.archive.org/web/*/cvhi.us/*`).
2. Finish the launch items in `TODO.md`: remove `SITE_NOINDEX`, move the domain, and keep the MX records.
3. Add a redirect for each old URL. Map each one to the closest new page, not all to the home page. Until [Phase 3](#phase-3-move-to-astro-and-grow-the-site), the targets are sections of the home page. After Phase 3, change them to the new pages.
4. Add `robots.txt` (allow all, and give the sitemap URL) and `sitemap.xml`.
5. Add a canonical URL tag: `<link rel="canonical" href="https://www.cvhi.us/">`.
6. Verify the site in Google Search Console (domain property, through a DNS record) and in Bing Webmaster Tools. Submit the sitemap to both.
7. Add analytics. Track 2 events: a click on any `tel:` link, and a sent form message.
8. Set the form provider (see `TODO.md`), so that form leads are counted.

**Done when:**

- Each old URL redirects to a live page.
- Search Console shows the sitemap as read, with no errors.
- Analytics records a test phone click and a test form message.
- The baseline numbers from [Goal and measures](#1-goal-and-measures) are recorded.

### Phase 1: Google Business Profile

**Why:** The map pack shows above organic results for local searches, and the profile is the only way into it. Its completeness, accuracy, and reviews feed the relevance and prominence factors directly.

**Options considered:**

| Option                                                                            | For                                                           | Against                                                                                   | Decision                                                          |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Service-area profile (address hidden, service area shown)                         | Matches how inspections work: the inspector goes to the home. | The map pin is not shown.                                                                 | **Chosen**, if clients do not visit 11327 Reflection Point Drive. |
| Storefront profile (address shown)                                                | Map pin and directions.                                       | Google requires signage and staff at the address in business hours.                       | Only if clients visit the address.                                |
| Several profiles, one for each city                                               | More map pins.                                                | Breaks Google's rules without separate staff and offices at each place; risks suspension. | Rejected.                                                         |
| Keywords in the business name (for example "Clear View Home Inspections Fishers") | Small relevance gain.                                         | Breaks Google's name rules; risks suspension.                                             | Rejected.                                                         |

Google's rules: a business that works from a home address must hide that address, and the service area should stay within about 2 hours of driving from the base ([Google: service-area businesses](https://support.google.com/business/answer/3038177)).

**Steps:**

1. Find out who owns the profile. Search for the business on Google Maps, and sign in to [business.google.com](https://business.google.com) with the owner's Google account.
   - If another account owns it (for example an old agency or a Wix setup), request access from the profile page.
   - If no one can be reached, use Google's ownership request. Give it about 1 week.
2. Make the owner the primary owner, and add the developer as a manager.
3. Set the business name to the exact real name: "Clear View Home Inspections".
4. Set the primary category to **Home inspector**. Add secondary categories only where they match real services, for example a radon or mold category if Google offers one.
5. Choose service-area or storefront (see the options above). For a service area, add the cities and counties from [Owner inputs](#5-owner-inputs).
6. Fill in every field: phone, website (with a tracking tag, for example `https://www.cvhi.us/?utm_source=google&utm_medium=organic&utm_campaign=gbp`), hours, the year opened (1999), and a description of 750 characters or less in plain language.
7. Add each service, with a short description and a price if the owner wants to show one.
8. Add at least 10 real photos: the inspector at work, tools (moisture meter, radon monitor), the vehicle, and report pages. Then add 1 or 2 new photos each month.
9. Post an update every 2 weeks: a seasonal tip, a short case story, or an offer.
10. Set a review link (Google gives a short link), and use it in [Phase 5](#phase-5-reviews).
11. Turn on messages only if someone can reply within a few hours.

**Done when:**

- The owner has primary ownership.
- Every field is complete, with the correct category and service area.
- The profile shows 10 or more photos.

### Phase 2: Quick wins on the current page

**Why:** Small changes help search engines understand the business before any new pages exist. Structured data confirms the business details in a form machines read. Consistent business details everywhere tell Google that all mentions refer to the same business.

**Options considered:**

| Option                                                                  | For                                                                                   | Against                                                                        | Decision                         |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------- |
| `LocalBusiness` structured data (`HomeAndConstructionBusiness` subtype) | Google's documented type for local businesses; confirms name, phone, hours, and area. | Google lists no "home inspector" type, so the subtype is approximate.          | **Chosen.**                      |
| `FAQPage` structured data                                               | Valid markup.                                                                         | Google no longer shows FAQ rich results for sites like this one.               | Skip. No harm if added later.    |
| Review stars in structured data                                         | Stars in results would stand out.                                                     | Not allowed: a business's own reviews on its own site cannot get star results. | Rejected.                        |
| Shorter page title (about 60 characters)                                | Less cut off in results.                                                              | Owner must approve new text.                                                   | **Chosen**, with owner approval. |

Google's subtype rule: "Use the most specific LocalBusiness sub-type possible" ([Google: local business](https://developers.google.com/search/docs/appearance/structured-data/local-business)). Google's review rule: pages with `LocalBusiness` or `Organization` data cannot get star results "if the entity that's being reviewed controls the reviews about itself" ([Google: review snippets](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)).

**Steps:**

1. Add a JSON-LD block to `index.html` with `@type: HomeAndConstructionBusiness` and these properties: `name`, `url`, `telephone`, `email`, `address`, `areaServed` (the cities), `openingHoursSpecification`, `foundingDate` (1999), `image`, `logo`, and `sameAs` (the Google, Facebook, Yelp, and BBB profile URLs). Check it with the [Rich Results Test](https://search.google.com/test/rich-results).
   - For a service-area profile, decide with the owner whether the street address stays on the site. Keep the same choice everywhere.
2. Write one standard version of the business name, address, and phone number, and use it everywhere: the site, the profile, and every listing in [Phase 6](#phase-6-citations-and-links).
3. Propose a title of about 60 characters, for example "Home Inspector in Fishers & Indianapolis | Clear View". After owner approval, turn the `long-title` rule in `.htmlvalidate.mjs` back on.
4. Make `og:image` 1200 × 630 px when the owner gives a larger photo (see `TODO.md`).
5. Keep page speed in the "good" range for real visitors: LCP under 2.5 s, INP under 200 ms, CLS under 0.1 ([Google: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)).

**Done when:**

- The Rich Results Test finds the `LocalBusiness` data with no errors.
- The site, the profile, and the listings show the same name, address, and phone.

### Phase 3: Move to Astro and grow the site

**Why:** One page can rank for only a few searches. A page for each service, and for each place with real local value, lets the site match many more searches, and each page can answer one need fully. The current site needs a shared header and footer and Markdown articles to grow, which plain HTML does badly.

**Options considered:**

| Option                          | For                                                                                                                                                               | Against                                                                           | Decision                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Astro                           | Built on Vite; shared layouts; Markdown content collections; sitemap integration; static redirects; zero JavaScript by default; React components later if needed. | A migration; tests must move to the built pages.                                  | **Chosen.**                                              |
| Plain Vite with more HTML files | No new framework.                                                                                                                                                 | Header and footer copied into each file, or an HTML plugin; no Markdown articles. | Rejected.                                                |
| React single-page app           | One framework.                                                                                                                                                    | Pages render in JavaScript, which is slower and riskier for search.               | Rejected.                                                |
| Keep one page                   | No work.                                                                                                                                                          | Limits the searches the site can rank for.                                        | Rejected.                                                |
| A page for every nearby town    | More pages.                                                                                                                                                       | Near-copy town pages are "doorway abuse" under Google's spam policies.            | Rejected. Add a place page only with real local content. |

Google's spam policies name "pages targeted at specific regions or cities that funnel users to one page" as doorway abuse, and "using generative AI tools … to generate many pages without adding value" as scaled content abuse ([Google: spam policies](https://developers.google.com/search/docs/essentials/spam-policies)).

**Proposed URLs:**

| URL                                | Content                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/`                                | Home: the current page, shortened, with links to the pages below.                                       |
| `/services/`                       | All services, with a short summary of each.                                                             |
| `/services/home-inspection/`       | The full inspection: what we check, how long it takes, the report.                                      |
| `/services/new-construction/`      | New construction and pre-drywall inspections (one page or two; owner decides).                          |
| `/services/radon-testing/`         | Radon in Indiana, the test, the Indiana certification, results.                                         |
| `/services/mold-testing/`          | Mold and air sampling.                                                                                  |
| `/services/termite-inspection/`    | Termite (wood-destroying insect) certification.                                                         |
| `/services/well-and-septic/`       | Well and septic certifications, water sampling.                                                         |
| `/services/commercial-inspection/` | Commercial inspections.                                                                                 |
| `/areas/<city>/`                   | Only for places where the owner can give real local detail (housing types, common issues, local rules). |
| `/about/`                          | Doug Wehr, licenses, insurance, memberships, history since 1999.                                        |
| `/sample-report/`                  | Sample report pages, explained.                                                                         |
| `/reviews/`                        | Review quotes, with links to Google and Yelp.                                                           |
| `/faq/`                            | The questions buyers ask.                                                                               |
| `/contact/`                        | Phone, email, form, service area.                                                                       |
| `/articles/`                       | Articles from [Phase 4](#phase-4-content).                                                              |
| `/pricing/` (optional)             | Prices or price ranges, if the owner agrees.                                                            |

**Steps:**

1. Create the Astro project in this repo (Astro 7 needs Node 22.12 or later; the repo uses Node 24). Add Tailwind with `npx astro add tailwind` and the sitemap with `@astrojs/sitemap`.
2. Move the current page into a layout (header, footer, `<head>` tags) and a home page. Keep the design, the tokens in `src/main.css`, and the 3 scripts.
3. Move the tests: build the site, then run the page tests and `html-validate` against the built HTML in `dist/`.
4. Set `site: 'https://www.cvhi.us'` in the Astro config. Set a canonical URL on every page. Generate the sitemap at build time.
5. Move the old Wix redirects into Astro's `redirects` config, and point them at the new pages.
6. Add the pages in the order of the table above. Each page has a unique title and description, one `<h1>`, and links to related pages.
7. Add `Service` structured data on each service page, and `BreadcrumbList` on pages below the home page.
8. Update the deploy workflow to Astro's GitHub Pages action, or keep the current workflow with `astro build`.
9. Check each new page with Lighthouse: performance, accessibility, and best practices must each stay at 95 or more.

**Done when:**

- The service pages, `/about/`, `/sample-report/`, `/reviews/`, `/faq/`, and `/contact/` are live.
- The sitemap lists every page, and Search Console reads it.
- Each page scores 95 or more in Lighthouse.

### Phase 4: Content

**Why:** Google ranks pages that show first-hand experience. A buyer who reads a clear answer from a local inspector is more likely to call. Articles also earn links, and answer the questions that AI answers draw on.

**Options considered:**

| Option                                              | For                                       | Against                                                               | Decision      |
| --------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------- | ------------- |
| We draft from the owner's facts; the owner approves | Fast; the expertise comes from the owner. | Needs time from the owner for each page.                              | **Chosen.**   |
| Owner writes                                        | Strongest first-hand voice.               | Slow; depends on the owner's time.                                    | Rejected.     |
| Hire a writer                                       | No load on the owner.                     | Cost; still needs the owner's facts and review.                       | Option later. |
| Generate many pages with AI, no owner input         | Very fast.                                | Scaled content abuse under Google's spam policies; no real expertise. | Rejected.     |

**Steps:**

1. For each page, ask the owner 5 to 10 questions first (for example: "What do you find most often in new construction in Westfield?"). Record the answers.
2. Draft the page from those answers, in plain language, with the owner's examples and photos.
3. The owner reviews every page before it goes live. Show the author and the review date on articles.
4. Publish 2 articles a month. First topics:
   - What a home inspection in Indiana includes, and what it does not.
   - Radon in Central Indiana: why to test, how the test works, what the numbers mean.
   - New construction: why inspect a new home, and when (pre-drywall, final, 11-month warranty).
   - Common issues in Fishers and Carmel homes by age of the house.
   - How to read your inspection report.
   - Well and septic inspections for rural Hamilton County homes.
5. Plan seasonal topics: radon in winter, roofs and gutters in spring, winterization in autumn.
6. Link each article to the matching service page, and each service page to its articles.

**Done when:** 2 articles a month go live, each approved by the owner.

### Phase 5: Reviews

**Why:** Review count and rating feed the prominence factor of the map pack, and they decide which result a person calls. The gap to competitors is large (hundreds of reviews), so steady new reviews matter more than any other single step.

**Options considered:**

| Option                                                | For                                  | Against                                                | Decision                                 |
| ----------------------------------------------------- | ------------------------------------ | ------------------------------------------------------ | ---------------------------------------- |
| Ask every client, by text and email, after the report | Steady flow; follows Google's rules. | Needs a habit or an automation.                        | **Chosen.**                              |
| Automate the ask in the report software               | No manual step.                      | Depends on the software (owner input).                 | **Chosen** if the software supports it.  |
| Ask only happy clients ("review gating")              | Higher rating.                       | Against Google's policy.                               | Rejected.                                |
| Offer a discount or gift for a review                 | More reviews.                        | Against Google's policy.                               | Rejected.                                |
| Embed a Google reviews widget on the site             | Fresh reviews on the site.           | Adds a third-party script; no star results either way. | Rejected. Quote reviews as text instead. |

Google's policy prohibits offering incentives for reviews and asks businesses not to "discourage or prohibit negative reviews, or selectively solicit positive reviews from customers" ([Google: fake engagement](https://support.google.com/contributionpolicy/answer/7400114)).

**Steps:**

1. Send each client the Google review short link within 24 hours of the report, by text and email. Use one short, friendly message for everyone.
2. Reply to every review within 2 days, the positive and the negative ones. Keep each reply short, specific, and polite.
3. Each month, add 1 or 2 new review quotes (with permission) to the site, word for word.
4. After Google, invite some clients to review on Yelp and Facebook too, so that each platform shows recent reviews.

**Done when:** New Google reviews arrive each month, and every review has a reply.

### Phase 6: Citations and links

**Why:** Listings on trusted sites (citations) with the same name, address, and phone confirm that the business is real and where it works. Links from local and industry sites raise prominence and organic rank. Some directories also rank on the first page by themselves, so a good listing there brings leads directly.

**Options considered:**

| Option                                               | For                                            | Against                                              | Decision      |
| ---------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------- | ------------- |
| Claim and correct the main listings by hand          | Free; full control.                            | A few hours of work.                                 | **Chosen.**   |
| A paid listing service (for example a citation tool) | Updates many sites at once.                    | Yearly cost; some listings revert if the plan stops. | Option later. |
| Earn local links (realtors, chamber, sponsorships)   | Strong, lasting signals; also bring referrals. | Takes relationships and time.                        | **Chosen.**   |
| Buy links                                            | Fast.                                          | Against Google's spam policies.                      | Rejected.     |

**Steps:**

1. Fix Yelp first: claim the listing in Yelp for Business, and correct the "Closed" status, the phone, and the website.
2. Claim or create these listings, with the standard name, address, and phone:
   - **Maps and search:** Bing Places for Business, Apple Business Connect.
   - **Trust:** BBB (update the website and photos).
   - **Social:** Facebook (update the website, hours, and services).
   - **Home services directories:** Angi, HomeAdvisor, Thumbtack, HomeGuide, Expertise.com, Nextdoor.
   - **Industry:** the InterNACHI or ASHI directory (if the owner is a member), and the report software's inspector directory.
3. Make sure that public license records show the license: the Indiana Professional Licensing Agency (home inspector license) and the Indiana Department of Health list of certified radon testers.
4. Join the Fishers or Hamilton County chamber of commerce, if the owner agrees. Chambers list members with a link.
5. Ask partner realtors and lenders for a link from their "recommended vendors" pages.
6. Offer local help that earns mentions: a free radon talk at a library or a realtor office, or a short guide that local news can quote in Radon Action Month (January).

**Done when:**

- Yelp shows the business as open.
- Each listing above shows the standard name, address, and phone.
- At least 3 local links point to the site.

### Phase 7: Local Services Ads

**Why:** Local Services Ads show above the map pack and all other results. They give leads in weeks, while the organic and map work takes months. The business pays only for leads, and the screening badge adds trust.

**Options considered:**

| Option                                 | For                                      | Against                                                           | Decision                                 |
| -------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| Local Services Ads                     | Top position; pay per lead; trust badge. | Screening takes weeks; cost per lead; the owner must answer fast. | **Chosen**, after the eligibility check. |
| Google Search Ads (pay per click)      | Full control of keywords and text.       | Pays for clicks that do not call; needs ongoing management.       | Out of scope.                            |
| Paid directory leads (Angi, Thumbtack) | Leads without Google.                    | Shared leads; quality varies.                                     | Option, test with a small budget.        |
| No paid placement                      | No cost.                                 | Slower leads while organic work grows.                            | Rejected.                                |

Google says that businesses "pay only for leads related to your business and the services you offer", and that a business that does not answer calls or messages ranks lower ([Google: Local Services Ads](https://support.google.com/localservices/answer/6224841)).

**Steps:**

1. Check eligibility for the "Home inspector" category in the service area at [ads.google.com/local-services-ads](https://ads.google.com/local-services-ads). Third-party sources list home inspectors as an eligible category, but the area must be checked.
2. Prepare the screening documents: the Indiana home inspector license, proof of the insurance that Indiana requires, and the business registration. Expect background checks for the owner and any inspector.
3. Link the ads account to the Business Profile, so that reviews show on the ad.
4. Set the service area and the job types to match real services. Set the hours to the hours when someone answers the phone.
5. Start with a small weekly budget. Answer every lead within minutes, because responsiveness affects the ad's rank.
6. Each week, mark leads as booked or not. For leads that do not match the services, check the current lead credit process in the Local Services Ads help center.

**Done when:** The listing is live with the screening badge, and the cost per booked inspection is known.

### Phase 8: Measure and improve

**Why:** Search changes over months, and each change needs proof that it helped. A short monthly review keeps the effort on what works.

**Options considered:**

| Option                                                                         | For                                | Against                    | Decision                                        |
| ------------------------------------------------------------------------------ | ---------------------------------- | -------------------------- | ----------------------------------------------- |
| Free tools (Search Console, Bing Webmaster Tools, profile insights, analytics) | No cost; enough for one location.  | Reports in several places. | **Chosen.**                                     |
| A paid SEO suite (rank tracking, local grids, audits)                          | One dashboard; rank grids by area. | Monthly cost.              | Option later, if the free tools are not enough. |

**Steps (each month):**

1. Record the measures from [Goal and measures](#1-goal-and-measures) in one table, next to the baseline.
2. In Search Console, find searches with many impressions and a position from 5 to 20. Improve the matching page (better answer, clearer title, an internal link).
3. Check the profile: new photos, 2 posts, replies to all reviews.
4. Check Core Web Vitals and the Search Console indexing report. Fix new errors.
5. Choose next month's 2 article topics from the questions that clients asked.

**Done when:** A short monthly note exists, with the numbers and the changes made.

## 5. Owner inputs

The plan needs these facts from the owner. Only the owner can give them.

- [ ] **Profile access:** Which Google account owns the Business Profile?
- [ ] **Clients at the address:** Do clients ever visit 11327 Reflection Point Drive? (This decides service-area or storefront in [Phase 1](#phase-1-google-business-profile).)
- [ ] **Service area:** The cities and counties to serve, and the farthest place he drives to.
- [ ] **Licenses:** Indiana home inspector license, Indiana radon tester certification, and any others (mold, termite/WDI, well and septic). Numbers stay off the site unless the owner wants them shown.
- [ ] **Insurance:** General liability and errors and omissions, if any.
- [ ] **Memberships:** InterNACHI, ASHI, chamber of commerce.
- [ ] **Inspectors:** Who inspects (Doug Wehr, others), with a short bio and a photo of each.
- [ ] **Hours:** Office hours and the hours when someone answers calls.
- [ ] **Prices:** Prices or ranges for each service, if he wants them on the site and the profile.
- [ ] **Report software:** Which software makes the reports (it decides the review automation and a directory listing).
- [ ] **Photos:** 10 or more real work photos, and a larger hero photo.
- [ ] **Old data:** Access to Wix Search Console or analytics, if any.
- [ ] **Time:** About 30 minutes each month to answer content questions and approve pages.

## 6. Rules to stay safe

These rules keep the site and the profile in good standing with Google. Each one protects the work in the phases above.

- Use the real business name everywhere, with no added keywords or city names.
- Keep one Business Profile for one location.
- Ask every client for a review, in the same way, with no reward.
- Reply to every review, including the negative ones, politely.
- Add a place page only when it gives real local detail for that place.
- Base every page on the owner's real knowledge, and have the owner approve it.
- Earn links through real relationships and useful content.
- Keep the name, address, and phone the same on every site.
- Show review quotes as plain text, with no review star markup.

## 7. Sources

Checked on 2026-10-03.

- Google Business Profile Help: [Tips to improve your local ranking on Google](https://support.google.com/business/answer/7091)
- Google Business Profile Help: [Guidelines for representing your business on Google](https://support.google.com/business/answer/3038177)
- Google Search Central: [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- Google Search Central: [Local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- Google Search Central: [Review snippet structured data (self-serving reviews)](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- Google Search Central: [Changes to HowTo and FAQ rich results](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- Google Search Central: [Spam policies for Google web search](https://developers.google.com/search/docs/essentials/spam-policies)
- Google Search Central: [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- Google Search Central: [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- Google Maps contribution policy: [Fake engagement](https://support.google.com/contributionpolicy/answer/7400114)
- Google Local Services Ads Help: [Getting started with Local Services Ads](https://support.google.com/localservices/answer/6224841)
- AgencyAnalytics: [Google Guaranteed vs. Google Screened](https://agencyanalytics.com/blog/google-guaranteed-vs-google-screened) (third-party; for category and cost estimates)
- Indiana Professional Licensing Agency: [Home inspector licensing information](https://www.in.gov/pla/professions/home-inspectors-home/home-inspectors-licensing-information/)
- Indiana Department of Health: [Certified radon testers and mitigators](https://www.in.gov/health/leadsafe/radon-information-contractors/indiana-certified-radon-testers-and-mitigators/)
- Astro docs: [Styling (Tailwind)](https://docs.astro.build/en/guides/styling/)
