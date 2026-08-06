# BirdSequencer — Interaction Model & Open Questions

> **נכתב לראשונה 2026-08-05** משוחזר מהתמליל. תוכן זה מעולם לא היה קובץ — הוא חי רק בשיחה.
>
> **מסמך זה גובר על חלקים ב-PRD.md.** הוא משקף את המצב האחרון של העיצוב.

---

## Reference Products

| Reference | URL | What we take from it |
|-----------|-----|---------------------|
| **Online Sequencer** | https://onlinesequencer.net | The functional model — this is our closest match |
| **Google Arts "Nature"** | https://artsandculture.google.com/experiment/YAGuJyDB-XbbWg | Draw-the-sound mode, V3 aspiration |

---

## Sketch 1 — Free-Placement Canvas

**What it established:**

- Screen splits **75% canvas / 25% bird panel**
- **X axis:** 16 snap positions across an 8-second loop
- **Y axis:** volume — top = loud, bottom = quiet, continuous (no snap)
- Same species can appear multiple times on the canvas
- Blocks are freely draggable after placement
- Two overlapping birds → both play

**Block anatomy (sketch 1):**

```
short:        [◆]

extended:     [◆]━━━━━━━━━━━━━━[◆]
              start-cap      end-cap
              (color fill = duration indicator)
```

- Shape (geometry) = **species**
- Fill color = **call type**
- Width = **playback duration**, dragged from either end
- Caps show the bird shape at both ends; the middle is a colored bar

**Radial menu on click:** circles appear around the block — one per available call type, plus a trash icon.

**Species → shape mapping (approved by Emily):**

| Species | English | Latin | Shape |
|---------|---------|-------|-------|
| דוכיפת | Hoopoe | *Upupa epops* | ◆ Diamond |
| בולבול | Common Bulbul | *Pycnonotus xanthopygos* | ● Circle |
| סנונית | Barn Swallow | *Hirundo rustica* | ▲ Triangle |
| עורב אפור | Hooded Crow | *Corvus cornix* | ■ Square |
| ינשוף כוס חורבות | Little Owl | *Athene noctua* | ★ Star |
| דרור | House Sparrow | *Passer domesticus* | ▬ Rectangle |

**Call type → color (universal across species):**

| Call type | Color | Hex |
|-----------|-------|-----|
| Song | Warm amber | `#c9a45a` |
| Call | Sky blue | `#5b8fbd` |
| Third type | Deep purple | `#9b8fc4` |

**The unifying rule:** *Shape = species. Color = sound type.* Two dimensions, one law.

---

## Sketch 2 — Simplification (current)

**What changed:**

| Area | Sketch 1 | Sketch 2 |
|------|----------|----------|
| Call type selection | Radial menu after placement | **Three tabs in panel: Dawn / Romance / Calls** — chosen before drag |
| Block appearance | Per-species shape + per-type color | **All uniform purple squares** (unresolved — see Q5) |
| Background | "Night Garden" dark | **Sky photograph**, swappable later |
| Toolbar | Undo + Share + Clear | **Country selector, background swap, undo, delete** + Click/Draw toggle |
| Bottom bar | — | **Share, Record, Play, waveform, 8-second loop** |
| Panel size | 6 species | **10 species** with thumbnail photos |

**Why tabs are better:** They collapse four interactions into two. User picks tab (= sound type), picks bird, drags. The block is born knowing its sound. No radial menu needed.

**Toolbar layout (top):**
```
[🌐 Israel ▾] [🖼 background] [↩ undo] [🗑 delete]          [✋ Click | 🎨 Draw]
```

**Panel (left, 25%):**
```
Dawn | Romance | Calls        ← tabs
─────────────────────────
[photo] Bird's name
[photo] Bird's name
... × 10
```

**Bottom bar:**
```
[⤴ Share] [⏺ Record]  (▶)  ──── waveform ────
```

---

## Emily's Stated Future Direction

1. **Sky background swappable** to other images
2. **Instagram Story share** — generate a story-format visual from what the user created
3. **Birds become real SVGs**, not geometric shapes — Emily will supply
4. **Flight animation** — birds flap wings in a loop
5. **Sound type as border** around the bird, following its shape — Emily will supply reference
6. **Draw mode** — draw the sound, like the Google Arts "Nature" experiment

---

## ✅ Resolved — 2026-08-05

### The core model changed: **Y = species, not volume**

Emily's clarification:

> "בלחיצה על ציר הX לאורך הגבהים של ציר הY בהתאמה לכל סוג ציפור שצויינה מצד שמאל, יהיה הסאונד של אותה הציפור"

**Each of the 10 birds in the left panel owns a row.** Y position selects *which bird*. X position selects *when*. Clicking a cell places that species at that time step.

This is the **Online Sequencer model** — which Emily named as the functional reference. It replaces the free-placement / drag-onto-canvas model from sketch 1.

**Consequence:** volume is no longer encoded by Y. It needs another home (per-row control) or drops from MVP. See Q-new-2.

### Visual encoding (final)

| Channel | Encodes |
|---------|---------|
| **Row (Y)** | Species |
| **Fill color** | Species |
| **Border** | Sound type — Emily to supply reference |
| **Column (X)** | Time step |
| **Width** | Duration (drag to extend) |

Emily on color: *"כל סאונד של ציפור מקבל צבע אחר בהתאמה לסוג הציפור"* — color follows species. Row and color reinforce each other, as in Online Sequencer.

### Other resolutions

| Q | Answer |
|---|--------|
| **Q7** Draw mode in MVP? | **No — hide the toggle entirely.** Add it when there's something behind it. |
| **Q10** What does Record capture? | **The composition → audio file.** No microphone. |
| **Q8/Q9** Y as volume | **Superseded** — Y is species |
| **Q5/Q6** Bird appearance | **Resolved** — fill = species color, border = sound type |

### Follow-ups — also resolved 2026-08-05

**Tabs — now two, not three (revised 2026-08-06).** The sketch had Dawn / Romance / Calls. Building the catalog showed that **no recording of any of our six species is tagged `dawn song`** on Xeno-canto. Dawn and Romance both fell through to `song` and returned the identical file — two tabs, one sound.

The only types that actually exist for these species are `song`, `call`, and `alarm call`. So the tabs are **Song** and **Calls**. A third can return when the catalog is large enough to support one.

Tabs select **which sound type gets placed**. Rows stay fixed to the species. Clicking a cell places that species' sound *of the active tab's type* — which the border then encodes.

→ **Handling missing types:** not every species has every type. Hoopoe has only "call" from Israel; Hooded Crow has no song. When a tab is active, species lacking that type must be visibly unavailable — greyed row, or the cell refuses placement. Recommend: grey the row label and disable its cells, so the constraint is visible rather than mysterious.

**Volume:** **a slider per row**, in the left panel next to each species. Mixer-like and conventional.

**Placement gesture:** **click-to-toggle.** With fixed rows, dragging from the panel is redundant — the row already identifies the species. This follows Online Sequencer and Chrome Music Lab. *(CTO decision, derived from the model rather than asked.)*

---

## The MVP Model — Complete

```
┌──────────────────┬────────────────────────────────────────┐
│ Dawn Romance Calls│           ← 16 steps →                │
├──────────────────┤                                        │
│ 🐦 Hoopoe   ▬▬●  │  ·  █  ·  ·  █  ·  ·  ·  ·  ·  ·  ·   │
│ 🐦 Bulbul   ▬▬●  │  █  ·  ·  █  ·  ·  █  ·  ·  ·  ·  ·   │
│ 🐦 Swallow  ▬▬●  │  ·  ·  █  ·  ·  █  ·  ·  ·  ·  ·  ·   │
│ 🐦 Crow     ▬▬●  │  ·  ·  ·  ·  █  ·  ·  ·  ·  ·  ·  ·   │
│ ...              │                                        │
│   ↑ volume       │              ↑ sky background          │
└──────────────────┴────────────────────────────────────────┘
  [⤴ Share] [⏺ Record]  (▶)  ──── waveform ────
```

| Element | Behavior |
|---------|----------|
| Row | One species, fixed |
| Column | One of 16 time steps |
| Click a cell | Toggles that species' call at that step |
| Cell fill color | Species |
| Cell border | Sound type (from active tab) |
| Cell width | Duration — drag to extend |
| Row slider | Volume for that species |
| Tabs | Which sound type places next |
| Background | **Sky photo behind the entire interface** — not just the grid. The panel, toolbar, and bottom bar all sit *over* the sky, presumably semi-transparent. Swappable later. |
| Record | Renders the composition to an audio file |
| Draw toggle | **Hidden in MVP** |

---

## Remaining Open Questions

### 1. Tabs — architecture

**Q1.** Are Dawn / Romance / Calls the final taxonomy, or an example? *(Xeno-canto uses: song, call, alarm call, flight call, dawn song.)*

**Q2.** A bird with only "call" and no "song" — does it appear only in the Calls tab, or in all tabs greyed out?

**Q3.** A bird with 2 sound types — appears in 2 tabs, dragging a different version from each?

**Q4.** After a bird is on the canvas, can its sound type be changed? Or do you drag a new one from another tab?

### 2. Bird appearance on canvas

**Q5.** All blocks are identical purple squares in the sketch. Is that:
- (A) Final for MVP — no species distinction on canvas
- (B) Placeholder — real design has per-species shape/color
- (C) Same shape, different color per species

**Q6.** Is species indicated on the canvas at all? Colors? Shapes? Hover tooltip? Or only in the panel?

### 3. Click vs Draw toggle

**Q7.** Is Draw mode in MVP, or is the toggle placeholder UI?
- If in MVP: what does drawing produce? Which sound?
- If not: is the Draw option disabled or hidden?

### 4. Y axis

**Q8.** Is Y volume, or purely visual (where the bird sits in the sky)?
- (A) Y = volume, top = loud
- (B) Y = visual only, all birds same volume
- (C) Y snapped to 10 discrete volume levels

**Q9.** If Y = volume, how does the user understand that without labels?

### 5. Record

**Q10.** What does Record capture?
- (A) The composition output → downloadable audio file
- (B) User's microphone mixed with the birds
- (C) A live performance including interactions

**Q11.** Maximum recording length? 8 seconds (one loop), 30 seconds, open-ended?

**Q12.** The bottom waveform shows:
- (A) Live oscilloscope of current playback
- (B) Static representation of the 8-second loop
- (C) The completed recording

### 6. States & edge cases

**Q13.** **Empty state** — new user, no birds. Empty sky? "Drag a bird to start"? Pre-loaded demo?

**Q14.** **Loading state** — how does a bird look while its audio is still downloading?

**Q15.** **Failed state** — Xeno-canto down or file corrupt. Is the bird marked? Is there a fallback?

**Q16.** **Playing state** — what does the playhead look like? Vertical line? Does the triggered bird animate?

**Q17.** **Mobile (375px)** — does the panel collapse? Become a bottom sheet? Just shrink?

### 7. Interaction details

**Q18.** **Dragging from panel to canvas** — is there a ghost preview? What happens if released outside the canvas?

**Q19.** **Moving an existing bird** — long-press then drag, or plain drag? Snap to nearest step or free?

**Q20.** **Two birds on the same cell** — stacked, or does one replace the other?

**Q21.** **Delete** — select then toolbar trash? Drag off canvas? Right-click? Delete key?

**Q22.** **Undo** — how many steps? Does every action (place / move / delete) count?

### 8. Country & background

**Q23.** **Changing country mid-composition** — what happens to birds already placed? Stay (audio cached)? Disappear? Warning?

**Q24.** **Additional backgrounds** — shipped in MVP, or sky only in MVP and more in V2?

### 9. Share

**Q25.** What does Share do exactly? Generate a 1080×1920 image and download? Web Share API? Preview then choose?

**Q26.** Does the Story include **audio**? *(Instagram Stories support 15 seconds of audio.)*

**Q27.** When someone opens a shared link — do they get an **editable composition** or **playback only**?

---

## Scope Warning

Sketch 2 added Record, waveform, background swap, country selector, Click/Draw toggle, and Instagram Story export — none of which were in the original 2-week MVP scope.

**A hard scope cut is required before build begins.** Recommendation: Record, background swap, Draw mode, and Story export move to V2. MVP ships canvas + panel + play + share-by-URL.

That decision is Emily's.
