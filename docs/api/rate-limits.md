---
title: Rate limits
description: How many requests a key can make, and how to tell where you are.
---

Limits count **per key**, in one-minute windows. Two keys from the same
server don't share a limit.

| Endpoint | Standard key | Partner key |
|---|---|---|
| `GET` endpoints (`/me/`, `/players/…`) | 60 / minute | 300 / minute |
| `POST /lookup/players/` | 10 / minute | 30 / minute |

A bulk lookup counts as one request however many names are in it (up to
250), so a 250-player leaderboard sync is one request, not 250.

## Headers on every reply

```http
RateLimit-Limit: 60
RateLimit-Remaining: 57
RateLimit-Reset: 41
```

`RateLimit-Reset` is the number of seconds until the window starts over.

## When you go over

You get `429` with how long to wait, in the body and in `Retry-After`:

```json
{ "ok": false, "error": "rate_limited", "retry_after": 41 }
```

Wait that many seconds, then try again. Don't retry in a tight loop.

## Failed keys

Repeated requests with a missing or wrong key from one IP (20 a minute) get
`429` for the rest of that minute, even with a good key. Fix the key before
retrying.

## Be kind to the API

- Data changes slowly. Most players' numbers move a few times a day at most,
  and answers are cached for about 5 minutes, so polling faster than that
  returns the same thing.
- Store what you fetch and serve your pages from your own copy. Your site
  should keep working if Bonkverse is down.
- Need more? Ask on Discord; partner keys exist for that.
