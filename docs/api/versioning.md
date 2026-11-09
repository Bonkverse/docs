---
title: Versioning
description: What can change in v1 and what can't.
---

The version is in the path: `/api/v1/`. Every reply also has an
`X-Bonkverse-API-Version: 1` header.

## Within v1

These never change:

- Field names, their types, and what they mean.
- Error codes.
- The `{"ok", "data"}` / `{"ok", "error"}` envelope.

These can change without notice, so write your code to allow them:

- **New fields** in any object. Ignore fields you don't know.
- **New error codes** and new `status` values. Treat unknown ones like
  `unavailable`.
- **Limits**, with notice in the [changelog](changelog.md) and on Discord.

## Breaking changes

A change that would break working code goes in `/api/v2/`. v1 keeps working
for at least three months after v2 ships, and key holders are told on
Discord first.
