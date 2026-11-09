---
title: Data and privacy
description: Where the numbers come from, what they mean, and how players control them.
---

## Where the numbers come from

Bonkverse archives public bonk.io replays. A replay is the end of one round,
and it records each player's name, whether they were a guest, and their
account level at that moment.

So the API knows a player's level **as of the last replay they appeared
in**. It doesn't see their account directly, and it can't see players who
haven't been in an archived room.

- **Registered players only.** Guest names aren't unique, so they're never
  matched.
- **Names are matched ignoring case.** `comet`, `Comet` and `COMET` are the same
  player; `username` in the reply is how they spell it.
- **No win rates.** Replays don't say who won.

## Account IDs and join dates

`account` comes from Bonkverse itself, not from replays: Bonkverse learns a
player's bonk.io account ID (DBID) from friend lists and from players who
sign in. It's `null` for players Bonkverse hasn't met that way yet.

- The DBID never changes, even when a player renames, so it's the best key
  if your site links bonk.io accounts. Store it next to the name.
- `joined` is estimated from the DBID (IDs were handed out in order), so it
  can be off by days or weeks. Say "joined around" rather than an exact date.

## What `seen_at` means \{#what-seen-at-means\}

`seen_at` is when Bonkverse collected the replay that showed this level. It
is **not** when the player levelled up, and it's not "last online".

| Field | Meaning |
|---|---|
| `level.value` | Their level in their latest archived replay |
| `level.peak` | The highest level seen in any of their replays |
| `level.seen_at` | When that latest replay was collected (a few minutes after the round). `null` if the replay was archived later from a backlog |
| `level.seen_day` | The day of that replay. Always set |
| `level.estimated` | `true` when `seen_day` is estimated (older cycles archived after the fact) |
| `level.replay` | The replay itself: watch it at `https://replays.bonkverse.io` |

If you show a date next to a level, label it "last seen" (or "as of"),
not "updated" or "levelled up". A player who stopped playing a year ago
will show a `seen_day` from a year ago, which is the truth.

## Players control their data

Players with a Bonkverse account can hide sections of their profile in
**Settings → Profile** on bonkverse.io. The API follows those settings:

- If they hide their **Level** section, the API returns them with
  `status: "private"` and `level: null`, and their level history is `403`.
- They can change this at any time, so a player who was `found` yesterday
  can be `private` today. When that happens, remove their level from your
  site at your next sync.

## What the API never returns

- Account XP from a player's own bonk.io login. Bonkverse sees it when a
  player signs in, but they gave it to Bonkverse, not to other sites.
- Friend lists, passwords, tokens or anything else from a bonk.io login.
- Guests.

## Your responsibilities

- Show where the data came from: "Levels from Bonkverse" with a link to the
  player's `profile_url` is perfect.
- Don't resell or republish the full dataset.
- Respect `private`: don't keep showing a level after a player hides it.
