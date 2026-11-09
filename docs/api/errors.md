---
title: Errors
description: Every error code the API returns and what to do about it.
---

Every reply has the same shape. On success:

```json
{ "ok": true, "data": { "...": "..." } }
```

On failure, a stable, snake_case error code:

```json
{ "ok": false, "error": "player_not_found" }
```

Branch on `error`, not on the HTTP status alone and never on wording. Error
codes don't change within v1. Some errors carry extra fields (like
`retry_after`); more may be added.

| Status | `error` | What happened | What to do |
|---|---|---|---|
| 400 | `invalid_json` | The body isn't valid JSON | Send `Content-Type: application/json` and a JSON body |
| 400 | `usernames_required` | `usernames` is missing, empty or not a list | Send `{"usernames": ["..."]}` |
| 400 | `too_many_usernames` | More than 250 names; `max` says the limit | Split into several requests |
| 400 | `invalid_username` | A name is empty, not a string, or over 100 characters | Check your list |
| 401 | `missing_api_key` | No key sent | Add `Authorization: Bearer <key>` |
| 401 | `invalid_api_key` | Key wrong, malformed or revoked | Check the key; ask for a new one if it was revoked |
| 403 | `player_private` | The player hid their level on Bonkverse (level history only) | Show nothing for them |
| 404 | `player_not_found` | No replays for that registered name | Check spelling; they may not have played in an archived room |
| 405 | `method_not_allowed` | Wrong HTTP method; `Allow` says which | Use the method in the docs |
| 429 | `rate_limited` | Over your limit; `retry_after` is in seconds | Wait, then retry |
| 503 | `upstream_unavailable` | The replay archive didn't answer | Retry later; keep showing your stored data |

## Errors inside a bulk lookup

[Bulk lookup](endpoints/bulk-lookup.mdx) never fails because of one player. Each
player gets a `status` instead: `found`, `not_found`, `private` or
`unavailable`. Only a bad request as a whole (bad JSON, too many names, a
bad key) gets an error reply.
