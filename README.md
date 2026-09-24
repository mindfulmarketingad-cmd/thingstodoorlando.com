# ThingsToDoOrlando.com

Affiliate tour and events site for Orlando, Florida, built with Next.js (App Router). Listings come from the Viator Partner API.

## How the data works

1. `.github/workflows/sync-viator.yml` runs `scripts/fetch-viator.mjs` with the `VIATOR_API_KEY` repository secret.
2. The script pages through **every** Viator product for Orlando (destination 663), plus Viator's tag taxonomy, and commits a trimmed snapshot to `data/viator-products.json`.
3. The site renders from that snapshot. No API key is needed on the web host. If the snapshot is empty and `VIATOR_API_KEY` is set on the host, the site falls back to live API calls (cached for 6 hours).

The workflow runs automatically when the script or workflow file changes, and on demand from **Actions > Sync Viator products > Run workflow**. Uncomment the `schedule` block to refresh prices weekly.

## URL structure

| Level | URL | Notes |
| --- | --- | --- |
| Home | `/` | H1 "Things To Do In Orlando" |
| Hubs | `/book-now`, `/blog`, `/search` | |
| Categories | `/book-now/[category]` | H1 "[Category] Tours and Events in Orlando Florida" |
| Items | `/book-now/[listing]`, `/blog/[post]` | Breadcrumbs: Home > Book Now > Category > Listing |
| Search | `/search/[query]` | Curated searches are indexable. All other queries are `noindex, follow` |

Uppercase paths (for example `/Book-now`) 308-redirect to lowercase.

## Local development

```bash
npm install
cp .env.example .env.local   # optional; the site builds without any env vars
npm run dev
```

Useful scripts: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run assets` (regenerates the logo, favicons, OG image and illustrations), `npm run sync:viator` (needs `VIATOR_API_KEY`).

## Environment variables

See `.env.example`. None are required to build. To make the contact form deliver email, set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (or `CONTACT_WEBHOOK_URL`).

## Security

- Strict security headers: CSP, HSTS, frame-ancestors none, nosniff, Referrer-Policy and Permissions-Policy (`next.config.ts`).
- The API key is only used server-side or in CI, and is never committed.
- Content is rendered as React text nodes. No user or API HTML is injected, and JSON-LD is escaped.
- Contact form: server-side validation, honeypot, minimum fill time and per-IP rate limiting.
- Outbound affiliate links use `rel="sponsored nofollow noopener noreferrer"`.
