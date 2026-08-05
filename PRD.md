# Product Requirements Document: BirdSequencer

> **שוחזר 2026-08-05** מתמליל השיחה. ⚠️ **חלקים ממסמך זה מיושנים** — הסקיצה השנייה שינתה את מודל האינטראקציה. ראה `sketch-decisions.md`.

**Product:** BirdSequencer
**Version:** 1.0 MVP
**Date:** 2026-04-27
**Owner:** Emily Breslav (Product Designer + CEO)
**Status:** Superseded in part — pending update after sketch 2 questions are answered

---

## 1. Problem Statement

### The Job to Be Done

> *"When I want to experience the beauty of Israeli nature and birdsong, I want to play and arrange bird sounds into a composition, so I can feel creative, connected to nature, and share something beautiful with others."*

There is no tool today that makes real bird sounds playable, arrangeable, and shareable as music. Existing bird apps (eBird, Merlin) are identification tools. Existing sequencers (GarageBand, Ableton) use synthetic or generic sounds. The intersection — real bird recordings as musical instruments — doesn't exist as a playful, accessible web experience.

### Who is this for?

**Primary:** Creative people (25-45) who are curious about nature and music, but aren't musicians. They would share this at a dinner table or send a link to a friend.

**Secondary:** Nature enthusiasts, birdwatchers, educators, Israeli diaspora who feel nostalgia for Israeli soundscapes.

**Explicitly not:** Professional audio engineers, ornithologists, musicians looking for a DAW.

---

## 2. Vision

**One sentence:** A web-based playground where anyone can compose a dawn chorus from real bird recordings and share it as a link.

**Success looks like:** Someone lands on the page, hears birds within 5 seconds, makes their first composition within 2 minutes, and sends the link to a friend.

---

## 3. Goals and Success Metrics

### Business Goals (MVP)
| Goal | Metric | Target | Measurement |
|------|--------|--------|-------------|
| People hear it | First sound < 5 seconds | 100% of visitors | Analytics event: `first_sound` |
| People compose | First composition made | >60% of visitors | localStorage check |
| People share | Link copied or shared | >20% of composers | URL copy event |
| People return | Return within 7 days | >30% | (V2, requires Supabase) |

### HEART Framework
| | Goal | Signal | Metric |
|--|------|--------|--------|
| **H**appiness | Users feel delighted | Shares, return visits | Share rate |
| **E**ngagement | Users compose multiple patterns | Session length, birds placed | Avg birds per session |
| **A**doption | Users discover the product | Referral source | % from shared links |
| **R**etention | Users return to their composition | URL revisit | (V2) |
| **T**ask success | Users hear their composition | Play pressed | % sessions with play event |

---

## 4. Features: MoSCoW

⚠️ **This list predates sketch 2.** Sketch 2 added: Record, waveform display, background swap, country selector, Click/Draw toggle, Instagram Story share. Those need to be triaged into this list before build.

### Must Have (MVP Blocker)

| # | Feature | Why |
|---|---------|-----|
| M1 | Grid: 10 species rows × 16 time steps | The product |
| M2 | Click a cell to toggle a call on/off | Core interaction |
| M3 | Play / Stop / Loop | Hear the composition |
| M4 | Precise audio timing (Tone.js) | Audio that doesn't stutter |
| M5 | Species panel with sound-type tabs | Choose what gets placed |
| M6 | Volume slider per row | Expressive control |
| M7 | Audio loading states | Users know when audio is ready |
| M8 | localStorage auto-save | Don't lose work on refresh |
| M9 | Share via URL (state in URL params) | The viral mechanic |
| M10 | Pre-loaded demo pattern | First-time visitors hear something immediately |
| M11 | Bird attribution (recordist, Xeno-canto ID) | Legal (CC BY license) + trust |
| M12 | Sky background | Visual identity |

### Should Have (Before V2)

| # | Feature | Why |
|---|---------|-----|
| S1 | Hover bird name → 2-second preview clip | Reduces friction, faster exploration |
| S2 | Undo | Error recovery |
| S3 | Keyboard shortcuts (Space = play/stop) | Power users |
| S4 | Mobile responsive layout | ~40% of web traffic |
| S5 | Empty state message | Onboarding |
| S6 | Error state for failed audio loads | Graceful degradation |
| S7 | Country selector | Expands audience beyond Israel |

### Could Have (V2)

| # | Feature | Why |
|---|---------|-----|
| C1 | Record composition to audio file | Export / share |
| C2 | Waveform display | Visual feedback |
| C3 | Instagram Story image export | Growth mechanic |
| C4 | Background image swap | Personalization |
| C5 | Animated bird SVGs (wing flap loop) | Delight — Emily to supply animations |
| C6 | Sound type as border style around bird | Visual encoding — Emily to supply reference |
| C7 | Featured compositions gallery | Showcase + inspiration |
| C8 | Named save slots (Supabase) | Multiple compositions |

### Won't Have (This Version)

- User accounts or login
- Draw-the-sound mode (V3 — see Google Arts reference)
- Comments or social features
- Native mobile app
- Monetization
- TypeScript (add in V2)

---

## 5. User Stories

### First-time visitor
1. **As a first-time visitor**, I want to hear bird sounds when I land, so I immediately understand what this is without reading anything.
2. **As a first-time visitor**, I want to place a bird and hear it in the loop, so I feel in control of the composition.
3. **As a first-time visitor**, I want to add a bird I recognize, so I feel a connection to something real.

### Returning composer
4. **As a returning user**, I want my last composition to still be there when I return.
5. **As a returning user**, I want to share my composition via a link, so a friend hears exactly what I made.
6. **As a returning user**, I want to move birds around, so I can refine without starting over.

### Nature enthusiast
7. **As a birdwatcher**, I want to see which recordist captured this sound, so I can trust the source.
8. **As a birdwatcher**, I want to know the Hebrew and Latin names, so this feels authentic and educational.

---

## 6. Technical Requirements

| Requirement | Spec |
|-------------|------|
| Framework | React + Vite |
| Audio engine | Tone.js (built on Web Audio API) |
| Audio timing | Tone.Transport + Tone.Draw (never setInterval for audio) |
| Visual response | < 50ms after audio trigger |
| First sound | < 5 seconds from page load |
| Audio source | Xeno-canto (CC licensed) |
| State persistence | localStorage (auto) + URL params (on share) |
| Hosting | Vercel (auto-deploy from GitHub) |
| Browser support | Chrome, Firefox, Safari, Edge (last 2 versions) |
| Accessibility | WCAG 2.1 AA — keyboard navigable, screen reader labels |
| Mobile | Works at 375px (may be simplified layout) |

---

## 7. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Xeno-canto API v2 deprecated, v3 needs key | **Confirmed** | High | Use GBIF mirror or obtain v3 key. See research doc. |
| Sparse Israel recordings (Hoopoe, Swallow) | **Confirmed** | Medium | Global fallback queries when country data insufficient |
| Audio fails to load (slow network) | Medium | Medium | Loading states per bird; graceful "unavailable" state |
| Mobile audio restrictions (iOS autoplay) | High | Medium | Require first user tap to start AudioContext |
| Canvas too complex for first-time user | Medium | High | Pre-loaded demo pattern; progressive disclosure |
| 2-week timeline too short | **High** | Medium | Sketch 2 added scope. Hard cut needed. |

---

## 8. Phased Work Plan

### Phase 0: Setup (Day 1)
- [ ] Create GitHub repository (`bird-sequencer`)
- [ ] Initialize Vite + React project
- [ ] Install Tone.js
- [ ] Connect GitHub → Vercel auto-deploy
- [ ] Verify: Hello world deploys at Vercel URL

### Phase 1: Audio Engine (Days 1-3)
- [ ] Implement Tone.Transport sequencer loop
- [ ] Fetch one bird recording from Xeno-canto
- [ ] Play it on a step trigger
- [ ] Tempo control working
- [ ] Verify: one bird sound plays in sync

### Phase 2: Canvas (Days 3-5)
- [ ] Canvas component with sky background
- [ ] Bird block component (place, move, delete)
- [ ] X snap to 16 steps, Y continuous
- [ ] Playhead sweep + animation
- [ ] Verify: visual and audio in sync

### Phase 3: Bird Library (Days 5-7)
- [ ] Bird catalog data structure
- [ ] Panel with tabs (Dawn / Romance / Calls)
- [ ] Hover to preview
- [ ] Drag to canvas
- [ ] Verify: 3 different birds playing together

### Phase 4: State + Sharing (Days 7-9)
- [ ] localStorage auto-save
- [ ] URL state encoding (base64)
- [ ] Share button → copy → confirmation
- [ ] Load from URL
- [ ] Pre-loaded demo pattern
- [ ] Verify: composition survives refresh and share

### Phase 5: Polish + Launch (Days 9-14)
- [ ] Full visual design
- [ ] Attribution footer
- [ ] Empty / error / loading states
- [ ] Mobile responsive
- [ ] Cross-browser check
- [ ] Accessibility audit
- [ ] Soft launch: share with 5 friends
- [ ] Iterate

---

## 9. Open Questions

**All architecture-blocking questions were resolved 2026-08-05.** See `sketch-decisions.md` → "The MVP Model — Complete".

Still open, but not blocking Phase 0–2:

| Question | Owner | Needed by |
|----------|-------|-----------|
| Which 4 species join the 6 to make 10? | Emily + Researcher | Phase 3 |
| What happens to placed birds when country changes? | Emily + CTO | Phase 3 |
| Xeno-canto v3 key, or route via GBIF mirror? | CTO | **Phase 1** |
| Empty / loading / error state design | Emily + Designer | Phase 5 |
| Instagram Story share format | Emily | V2 |
| Border style reference for sound types | Emily | Phase 2 |

---

*PRD v1.0 — restored 2026-08-05. Requires revision after sketch 2 questions are resolved.*
