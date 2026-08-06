# Xeno-canto API Access — Findings

**Date:** 2026-08-06
**By:** CTO Agent
**Question:** How do we get audio from Xeno-canto, now that API v2 is deprecated?

> **Source caveat:** `xeno-canto.org` is behind Anubis bot protection and could not be fetched directly. Everything below comes from community API wrappers and third-party directories. **Verify against the official account page and terms when registering.**

---

## Getting a key

| | |
|---|---|
| Cost | Free |
| Requirement | Registered Xeno-canto account with a **verified email** |
| Where | Account page, after logging in |
| How it's sent | Query parameter `key` |
| XC's guidance | Create a key **for the app**, not a personal key |
| XC's warning | Never publish the key in a git repository |

## Limits and terms

- **~1000 requests/hour** reported by third-party directories. Treat as approximate — not confirmed from official docs.
- Mass/indiscriminate automated downloading is **actively discouraged**. Bulk data transfer is arranged by contacting them.
- Non-commercial use is fine. Recordings are Creative Commons; **attribution is required**.

## Query tags (v2 syntax, largely carried into v3)

`cnt:` country · `type:` call type · `q:` quality · `en:` English name · `grp:` group · `len:` length · `page:` pagination
Some tags accept operators: `=`, `>`, `<`, `-`

---

## The architectural consequence

**An API key cannot live in a browser app.** Anything shipped to the client is readable by anyone who opens devtools. Publishing it would also violate Xeno-canto's own guidance, and the repo is public.

Three ways out:

### Option A — Pre-fetch at build time ✅ recommended

A Node script queries Xeno-canto once, during development, and writes a curated catalog into the repo: species, call types, attribution, and audio URLs. The browser never sees a key because the browser never calls Xeno-canto.

- Key stays on Emily's machine, in `.env` (already gitignored)
- Zero runtime requests → rate limits become irrelevant
- Site works even if Xeno-canto is down
- Faster: no API round-trip before audio can load
- Honors "mass automated requests discouraged" — we query a handful of times, not per visitor

**Fits the product.** BirdSequencer has ~10 fixed species chosen for quality. It is not a search engine over 800,000 recordings. Live querying buys nothing.

Country switching still works: pre-fetch a catalog per country and ship them as separate JSON files.

### Option B — Serverless proxy on Vercel

Key lives in Vercel environment variables; the browser calls our function, which calls Xeno-canto.

Only needed if users must search the live database. Adds a backend, rate-limit exposure, and a failure mode we'd have to design around.

### Option C — Key in frontend

No. It leaks immediately, and the repo is public.

---

## Recommendation

**Option A.** Build-time pre-fetch, curated catalog committed as JSON.

Revisit only if the product grows a live search feature — at which point Option B becomes the upgrade path, and nothing built for A is wasted.

---

## What this changes in the plan

PRD Phase 1 says "Fetch one bird recording from Xeno-canto." That stays true, but the fetch happens in a **build script**, not in the app. The app reads a local JSON catalog.

New Phase 1 tasks:
- [ ] Emily registers and creates an app key → `.env` (never committed)
- [ ] `scripts/fetch-catalog.mjs` — queries XC, writes `src/data/catalog.israel.json`
- [ ] Catalog includes per recording: XC id, species, call type, quality, **recordist name**, license, audio URL
- [ ] Decide: hotlink XC audio URLs, or download files into `public/audio/`

The last one is open. Hotlinking is less to maintain but depends on their CDN staying up and sends every visitor to their servers. Downloading is more polite to them and more reliable for us, but the repo grows — roughly 10 species × 3 call types × ~150 KB ≈ 4–5 MB, which is acceptable.
