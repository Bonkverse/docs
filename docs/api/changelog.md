---
title: Changelog
description: Changes to the Bonkverse API.
---

## Skins (November 2026)

- Each player object has a `skin`: the skin code they last wore, a 512 px
  image, a 128 px thumbnail and when it was seen. `null` until Bonkverse
  has seen the player wear one, which for now means they signed in to
  Bonkverse. See [Skins](data-and-privacy.md#skins).

## Developer portal (November 2026)

- Make, copy and revoke your own keys at
  [bonkverse.io/developers/keys](https://bonkverse.io/developers/keys/), after
  agreeing to the [API terms](https://bonkverse.io/developers/terms/). Up to
  3 active keys per account. No API changes.

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

- **Skins from replays:** fill in `skin` for players who have never signed
  in to Bonkverse. The replay archive needs to record which skin was worn
  in each replay first.
