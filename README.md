# Bonkverse docs

The platform-wide docs site from RFC-0001, published at
**[docs.bonkverse.io](https://docs.bonkverse.io)**. Built with
[Docusaurus](https://docusaurus.io/) and themed like the replay site
(`src/css/custom.css`).

## What lives where

RFC-0001 splits docs in two:

| Where | What |
|---|---|
| **This repo** | Anything that spans services or faces outside developers: the public API guide (`docs/api/`), and next the platform architecture, cross-service contracts, RFCs, ADRs and the bonk.io reference |
| Each service repo's `docs/` (e.g. `Bonkverse/bonkverse/docs/`) | How that one system works and how to run it: app pages, runbooks, its own ADRs |

The public API's code lives in `Bonkverse/bonkverse` (`public_api/`). **A PR
there that changes `/api/v1/` links its matching PR here**, and new fields
go in `docs/api/changelog.md`.

## Run it

```bash
npm ci
npm start          # http://localhost:3000, live reload
npm run build      # static site in build/; fails on broken links or anchors
npm run serve      # preview the build
npm run typecheck
```

Node 20+.

## Writing pages

- Pages are in `docs/`, one folder per section (`docs/api/`); each section
  has its own sidebar in `sidebars.ts`. `docs/index.md` is the home page.
- Link to other pages by file (`[quickstart](quickstart.mdx)`), not by URL,
  so links survive pages moving.
- Code examples come in three tabs (curl, JavaScript, Python) with
  `groupId="lang"`, so a reader's language choice sticks across pages.
  Every example must run as pasted: real URLs, the key from
  `BONKVERSE_API_KEY`, nothing to fill in but the player name.
- Use `The Saucy Tulip` for runnable examples that demonstrate a successful
  lookup. Use made-up names for illustrative results such as private or missing players.
- Admonitions: `:::note[Title]` (the `:::note Title` form doesn't work with
  `future.v4`). Custom heading IDs: `## Heading \{#my-id\}`.
- Wide tables scroll inside themselves on phones; check pages at 390 px wide.

## Deploying

Every push to `main` builds and publishes to GitHub Pages
(`.github/workflows/deploy.yml`); pull requests only build, so a broken
link fails the PR. `static/CNAME` holds the domain.

One-time setup (already done if the site is live):

1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Cloudflare DNS: `CNAME docs → bonkverse.github.io`, **DNS only** (grey
   cloud) so GitHub can issue the HTTPS certificate.
3. Back in Settings → Pages: custom domain `docs.bonkverse.io`, then tick
   **Enforce HTTPS** once the certificate is ready.
