# cvhi.us — static site

Plain HTML/CSS. No build step, no framework. Every folder has an `index.html`, so URLs match the old Wix paths (`/services`, `/home-inspections`, `/reports`, `/testimonials`, `/contact-us`).

## Before launch
Search every page for `[OWNER:` (highlighted yellow on the page). Those spots need real info: license numbers, prices, hours, counties, reviews, and a sample report.

    grep -rn "OWNER:" --include=*.html .

## License numbers (fill locally)
License numbers are left as the tokens `{{HOME_INSPECTOR_LICENSE}}` and `{{RADON_TESTER_LICENSE}}` so they never go through chat. Fill them on your own machine before publishing:

    bash scripts/fill-licenses.sh

Keep in mind that once the site is live the numbers are public, which is the point: they're a trust signal, and Indiana's license lookup already lists them. Push only after the tokens are filled. Otherwise the literal `{{...}}` text will show on the site.

## Preview locally
    python3 -m http.server 8000   # then open http://localhost:8000

## Deploy (later, not yet)
1. Push this folder to a GitHub repo. Settings → Pages → deploy from `main` / root.
2. Verify cvhi.us for the GitHub account first (recommended to prevent domain takeover).
3. `CNAME` already contains `www.cvhi.us`. At the registrar, add apex A records 185.199.108.153, .109.153, .110.153, .111.153 (plus the AAAA records from the GitHub docs) and a `www` CNAME to `<account>.github.io`. Leave the MX records alone so info@cvhi.us keeps working.
4. Turn on Enforce HTTPS (can take up to 24 hours to become available).
5. Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

Docs: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Adding a blog post
Copy a folder under `/blog/`, then edit the title, meta description, canonical, JSON-LD, and content. Add the URL to `sitemap.xml`, `llms.txt`, and the cards on `/blog/index.html`.
# clearviewhomeinspections
# clearviewhomeinspections
# clearviewhomeinspections
