---
title: Changelog
description: Changes to the Bonkverse API.
---

## v1 (November 2026)

First release.

- [`GET /me/`](endpoints/me.mdx), [`GET /players/{username}/`](endpoints/player.mdx),
  [`GET /players/{username}/level-history/`](endpoints/level-history.mdx) and
  [`POST /lookup/players/`](endpoints/bulk-lookup.mdx).
- Levels come with when they were last seen (`seen_at`, `seen_day`).
- Players who hide their level on Bonkverse are `private` here too.
- Each player has an `account` with their bonk.io account ID (DBID) and
  an estimated join day, when Bonkverse knows them.

## Next

- **Skins:** each player's most recently seen skin, with a rendered image
  URL. The replay archive needs to record which skin was worn in each
  replay first.
