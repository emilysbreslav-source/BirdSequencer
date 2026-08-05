# BirdSequencer — Project Context

> **שוחזר 2026-08-05** מתמליל השיחה, אחרי שהתיקייה נמחקה. ראה `RECOVERY-NOTES.md`.

## What This Is

A web-based bird sound sequencer. Think Tone Matrix but with real Israeli bird recordings.

Users compose layered sequences from authentic bird calls — selecting species, call type, timing, and repetition. Compositions can be saved, shared, and remixed.

---

## Current Status

**Phase:** Pre-build planning — interaction model finalized via two sketches, 27 open questions pending
**Target:** MVP live in 2 weeks
**Launch:** Public (anonymous, no user accounts required)

⚠️ **The PRD below predates the second sketch.** See `sketch-decisions.md` for the current interaction model, which supersedes parts of this document.

---

## The Core Experience

**Original grid model (superseded — see `sketch-decisions.md`):**

```
         [ step 1 ] [ step 2 ] [ step 3 ] [ step 4 ] ...[ step 16 ]
Hoopoe (shir)  [ ✓ ]  [    ]  [ ✓ ]  [    ]  ...
Hoopoe (kriah) [    ]  [ ✓ ]  [    ]  [    ]  ...
Bulbul (shir)  [    ]  [    ]  [ ✓ ]  [ ✓ ]  ...
Swallow        [    ]  [    ]  [    ]  [ ✓ ]  ...
```

**Current model:** Free-placement canvas over a sky background. X = 16 time steps, Y = volume/height. Birds are placed as blocks, not toggled in a fixed grid.

---

## Architecture Decisions

### Frontend
- **MVP:** React + Vite (component model essential for grid/canvas state management)
- **V2:** Next.js if SEO or SSR becomes needed
- **Hosting:** Vercel (free tier, auto-deploy from GitHub)
- **Full rationale:** `research/cto-tech-recommendation.md`

### Audio
- **Library:** Tone.js (built on Web Audio API — handles Transport, loading states, precise timing)
- **Timing:** Tone.Transport for sequencer clock, Tone.Draw for audio-visual sync
- **Visual sync:** `Tone.Draw.schedule()` bridges audio thread → animation frame (never setInterval)
- **Audio files:** MP3, fetched from Xeno-canto CDN, cached in localStorage

### Data Source
- **Xeno-canto API** (free, open, Creative Commons licensed)
  - Attribution required (we display recordist names)
  - Most recordings CC BY or CC BY-NC-SA (non-commercial use OK)
  - ⚠️ API v2 deprecated; v3 requires a key. See `B-brain/05-research/xeno-canto-call-types.md`

### Storage
- **MVP:** localStorage for sequence state
- **Sharing:** Sequence encoded in URL params (base64 JSON)
- **V2:** Supabase (PostgreSQL + file storage for curated bird sounds)

### No Authentication
- Fully anonymous. No login required.
- Share = URL link. Anyone can open it and hear/remix.

---

## Bird Library

### Selection Criteria
- Species present in the selected country (resident or migratory)
- Clear, distinctive calls — recognizable to non-experts
- Quality recordings available on Xeno-canto (quality A or B)
- Attribution possible (CC BY / CC BY-NC-SA)

### MVP Species (6 confirmed, expanding to 10 per sketch)

| Hebrew | English | Latin | Shape | Xeno-canto status |
|--------|---------|-------|-------|-------------------|
| דוכיפת | Hoopoe | *Upupa epops* | ◆ Diamond | 1 rec (call, B) — needs global fallback |
| בולבול | Common Bulbul | *Pycnonotus xanthopygos* | ● Circle | 26 recs, best coverage ✓ |
| סנונית | Barn Swallow | *Hirundo rustica* | ▲ Triangle | 1 rec — needs global fallback |
| עורב אפור | Hooded Crow | *Corvus cornix* | ■ Square | 7 recs (call only) |
| ינשוף כוס חורבות | Little Owl | *Athene noctua* | ★ Star | 2 recs ✓ (ssp. *lilith*) |
| דרור | House Sparrow | *Passer domesticus* | ▬ Rectangle | 11 recs ✓ |

*Sketch 2 shows 10 species. 4 more to be selected.*

---

## Visual Direction

**Superseded.** Original direction was "Night Garden" (dark, jewel tones).
**Current direction (sketch 2):** Sky photograph background, swappable to other images later. See `sketch-decisions.md`.

**Emily's role:** Product Designer AND Design Director. She makes all design decisions.
**Designer Agent:** Executes Emily's direction in code.

---

## Success Metrics (MVP)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| First sound heard | < 5 seconds from landing | Analytics event |
| First composition created | > 60% of first-time visitors | localStorage check |
| Share rate | > 20% of composers share | URL copy event |
| Return visit | > 30% return within 7 days | (V2 with Supabase) |

---

## Team for This Project

| Agent | Role |
|-------|------|
| **Emily (you)** | CEO, Product Designer, Design Director |
| **PM Agent** | Product decisions, PRDs, prioritization |
| **CTO Agent** | Technical architecture, code, debugging |
| **Designer Agent** | UI components, executes Emily's direction |
| **Researcher Agent** | Bird research, Xeno-canto data, UI references (30-min limit per task) |
| **Gatekeeper** | Quality reviews |

---

## Key Files

```
Products/BirdSequencer/
├── CLAUDE.md                    ← You are here
├── PRD.md                       ← Product requirements (predates sketch 2)
├── sketch-decisions.md          ← CURRENT interaction model + open questions
├── RECOVERY-NOTES.md            ← What was lost and restored 2026-08-05
└── research/
    ├── cto-tech-recommendation.md
    └── synth-interfaces.md      ← redirect to B-brain

B-brain/05-research/
├── synth-interfaces-research.md    ← 20 interfaces, full
├── synth-interfaces-95-more.md     ← 95 interfaces (list restored, descriptions lost)
└── xeno-canto-call-types.md        ← per-species recording data
```

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-27 | **React + Vite** (upgraded from Vanilla JS) | Grid state management at 640+ cells needs React. Vanilla JS = writing a mini-framework. See `research/cto-tech-recommendation.md` |
| 2026-04-27 | **Tone.js** for audio | Built on Web Audio API. Handles Transport, loading states, and Tone.Draw for audio-visual sync. |
| 2026-04-27 | Xeno-canto API for sounds | Free, CC licensed, largest collection of Israeli birds |
| 2026-04-27 | localStorage + URL sharing for MVP | No backend needed, fastest path to share |
| 2026-04-27 | No user accounts V1 | Reduces friction, anonymous = accessible |
| 2026-04-27 | Tone.Draw for animation sync | Bridges audio thread precision + visual animation frame |
| 2026-04-27 | GitHub + Vercel from day 1 | Version control + auto-deploy. Every push deploys. |
| 2026-04-27 | Pre-loaded demo pattern | First-time visitors must hear something in < 5 seconds |
| 2026-05-10 | **Canvas replaces fixed grid** (sketch 1) | Free placement over background image. X = 16 snap steps, Y = volume. |
| 2026-05-10 | **Sky background** (sketch 2) | Replaces "Night Garden" dark aesthetic. Swappable later. |
| 2026-05-10 | **Tabs replace radial menu** (sketch 2) | Dawn / Romance / Calls tabs in panel. Sound type chosen before drag, not after. |
| 2026-05-10 | Functional reference: Online Sequencer | onlinesequencer.net — the interaction model to match |
| 2026-05-10 | Future reference: Google Arts "Nature" | Draw-the-sound mode for V3 |
