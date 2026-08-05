# Recovery Notes — 2026-08-05

## What happened

The entire `Products/BirdSequencer/` folder and the entire `B-brain/05-research/` folder were missing from the vault. Verified by `find` across the whole vault: zero files matching "bird".

Cause unknown. `Products/` was last modified 2026-08-02. Emily reports she has since disabled OneDrive.

**What survived the loss:** all agents (`cto-agent.md`, `designer-agent.md`, `product-manager-agent.md`, `researcher-agent.md` including its 30-minute research limit) and all skills. The infrastructure held; only the BirdSequencer outputs were gone.

**What made recovery possible:** the conversation transcript at
`C:\Users\emily\.claude\projects\C--Users-emily-Documents-emily-vault\86b056cf-f4cf-4b96-a77b-ac0f44e8fb7c.jsonl` (2.9 MB)

---

## Restored in full

| File | Source |
|------|--------|
| `Products/BirdSequencer/CLAUDE.md` | transcript — verbatim + sketch-2 updates merged |
| `Products/BirdSequencer/PRD.md` | transcript — verbatim |
| `Products/BirdSequencer/research/cto-tech-recommendation.md` | transcript — verbatim |
| `Products/BirdSequencer/research/synth-interfaces.md` | redirect stub |
| `B-brain/05-research/synth-interfaces-research.md` | transcript — verbatim, all 20 |
| `B-brain/05-research/xeno-canto-call-types.md` | reconstructed from researcher's summary — data accurate |

## Newly written (never existed as a file)

| File | Why it matters |
|------|----------------|
| `Products/BirdSequencer/sketch-decisions.md` | The current interaction model from both sketches, plus 27 unanswered questions. This lived **only** in the conversation and would have been lost permanently. The most valuable artifact of this recovery. |

## Partially lost

| File | What's missing |
|------|----------------|
| `B-brain/05-research/synth-interfaces-95-more.md` | All 95 names and verified URLs recovered. **The written descriptions are gone** — they were produced inside a subagent whose transcript was deleted. Rebuildable in one session; instructions are in the file. |

---

## What this cost

One subagent research session. Everything else recovered.

---

## The actual lesson

The CTO recommendation said "GitHub from commit #1" as a best practice. It wasn't a best practice — it was the thing that would have prevented this.

**Before writing any code: create the repo.** Documentation goes in it too, not just source.

Second point: work that lives only in a conversation is not saved. The `sketch-decisions.md` content — two sketch reviews and 27 design questions — nearly vanished because it was never written to disk. Decisions made in conversation need to land in a file the same session.
