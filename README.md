# BirdSequencer

A browser-based sequencer built from real bird recordings.

Place birds on a canvas — horizontal position sets timing, vertical position sets volume — press play, and hear a composition made entirely of authentic field recordings. No account, no install. Every composition is a shareable link.

**Status:** Pre-build. Product definition complete, interaction model finalized, awaiting scope decisions before implementation.

---

## Concept

Most sequencers use synthetic sounds. Most bird apps are identification tools. This sits in between: real Creative Commons recordings from [Xeno-canto](https://xeno-canto.org), arranged as music.

A user picks a country, browses species, drags birds onto a sky, and presses play.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | React + Vite |
| Audio | Tone.js (Web Audio API) |
| Timing | `Tone.Transport` + `Tone.Draw` |
| Sound source | Xeno-canto (CC licensed) |
| Persistence | localStorage + URL params |
| Hosting | Vercel |

Rationale: [`research/cto-tech-recommendation.md`](research/cto-tech-recommendation.md)

---

## Documentation

| File | Contents |
|------|----------|
| [`CLAUDE.md`](CLAUDE.md) | Project context, architecture, decisions log |
| [`PRD.md`](PRD.md) | Requirements, metrics, phased plan |
| [`sketch-decisions.md`](sketch-decisions.md) | **Current interaction model + open questions** |
| [`research/cto-tech-recommendation.md`](research/cto-tech-recommendation.md) | Stack rationale |
| [`RECOVERY-NOTES.md`](RECOVERY-NOTES.md) | Why this repository exists |

Start with `sketch-decisions.md` — it supersedes parts of the PRD.

---

## Licensing

Bird recordings come from Xeno-canto under Creative Commons licenses (mostly CC BY / CC BY-NC-SA). **Attribution to recordists is required and displayed in the interface.** This project is non-commercial.

---

## Credits

Product design and direction: Emily Breslav
Built with the ABC-TOM agent system.
