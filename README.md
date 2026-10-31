# Sai Kannadkar’s portfolio

Responsive, dependency-free HTML/CSS/JavaScript implementation of the Home and Skills frames in the supplied Figma design.

## Preview

Run `npm run dev` from this directory, then open http://127.0.0.1:5174. No dependencies need to be installed.

Run `npm test` to check crawlable HTML, metadata, local assets, public HTTP routes, redirects, and 404 responses. Run `npm run build` to validate and package only public files into `dist/`; run `npm run preview` to preview that output.

## Files

- `index.html`: Home, biography, and project links.
- `skills.html`: Skills page.
- `styles.css`: Shared styling and mobile layouts.
- Both HTML pages include all skills, contact details, and footer content directly. There is no client-side JavaScript requirement.
- `assets/`: Original downloaded Figma imagery and icons.

## Production and search

The canonical origin is `https://saikannadkar.me`. The published pages are `/` and `/skills`. Their metadata includes canonical URLs, Open Graph/Twitter previews, and JSON-LD for Person, WebSite, and ProfilePage/WebPage. Structured data describes the visible portfolio without invented credentials.

- `robots.txt` allows every user agent and links to `sitemap.xml`.
- `sitemap.xml` lists the two canonical pages. It deliberately omits invented modification dates.
- `llms.txt` supplies a source-linked portfolio summary for services that support it. It is not an indexing or AI-citation guarantee.
- `vercel.json` configures the static build, clean URLs, permanent aliases, security headers, and asset caching.
- `404.html` is a real missing-page response, not a homepage rewrite.
- Original PNG photos remain in source; only the optimized JPEG versions are included in `dist/`. Unused original assets and development scripts are not published.

## Replacing the current Vercel site

1. Deploy this checkout to the existing Vercel project where possible. Use Framework Preset **Other**, build command `npm run build`, and output directory `dist`. The checked-in Vercel config provides these settings.
2. Keep `saikannadkar.me` attached as the production domain. If `www.saikannadkar.me` is configured, retain its DNS and redirect to the canonical apex domain. Do not alter unrelated subdomains such as `n8n.saikannadkar.me`.
3. Protect preview deployments in Vercel. Vercel deployment URLs are not the canonical site; verify their automatic `X-Robots-Tag: noindex` behavior and access protection before sharing them.
4. Before promoting, check both pages, contact/project links, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/Resume_Sai_Kannadkar.pdf`, and a deliberately missing URL. Check `/index.html`, `/skills.html`, `/skills/`, HTTP-to-HTTPS, and www-to-apex redirects on the deployed host. Local tests do not prove Vercel's edge behavior.
5. Retain the existing Google Search Console and Bing Webmaster Tools verification, especially DNS TXT records. No HTML verification tag was found in the live homepage; check account settings for file-based verification before replacing the old deployment.
6. Submit `https://saikannadkar.me/sitemap.xml` in the existing Search Console and Bing properties, inspect `/` and `/skills`, and request indexing after launch. A Change of Address request is unnecessary because the domain is unchanged.
7. Compare Search Console's indexed pages, queries, and traffic before and after deployment. Export the current indexed URL inventory before launch: a public crawl cannot reveal every historically indexed URL. Add exact permanent redirects only for confirmed old pages with equivalent replacements; do not redirect all unknown paths to Home.

### Migration findings and limitations

The old homepage's public links were inspected during this change. `/robots.txt` and `/sitemap.xml` returned 404. The homepage URL, existing favicon, résumé URL, and `#top`, `#about`, `#projects`, `#skills`, and `#contact` anchors are preserved. `#skills` lands on the link to the new Skills page.

The Figma design omits the old Experience section and some biography details. The `#experience` destination has no equivalent section. Restoring that content requires a design/content decision; redirects cannot preserve its relevance. Rankings and AI citations can change even when the technical migration is correct.

The preserved résumé is copied unchanged from the old site, not reviewed or updated. Google Fonts requires an external connection. Lighthouse/Core Web Vitals, external link availability, schema rich-result eligibility, and live Vercel behavior should be checked after preview deployment; no live production deployment or Search Console submission has been performed by this work.

References: [Google AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Google site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json), [llms.txt proposal](https://llmstxt.org/).

Typography uses Google Fonts (Inter, DM Sans, and IBM Plex Mono), with system fallbacks if offline. Project and social links, email links, phone links, and back-to-top navigation are active. The “More about me” link opens Skills; the handle returns Home.
