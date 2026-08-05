# CTO Tech Recommendation: BirdSequencer Stack

> **שוחזר 2026-08-05** מתמליל השיחה.

**Prepared by:** CTO Agent
**Date:** 2026-04-27
**For:** Emily (Product Designer + CEO)
**Question:** "Why not React? What's the right stack for BirdSequencer?"

---

## The Honest Answer

**Vanilla JS was the right call for a prototype. React is the right call for the product we're actually building.**

---

## What We're Actually Building

The BirdSequencer isn't a static webpage. It's an application with:
- A **canvas** holding many independently positioned, stateful bird blocks
- A **real-time playback engine** updating visuals dozens of times per second without lag
- A **bird library panel** loading dynamically from an API
- A **URL/localStorage system** serializing and deserializing complex state
- **Audio loading states** — birds that show "loading," "ready," "playing," "error"
- Future: volume, resizing, waveform preview, mobile layout

This is a **stateful interactive application**, not a webpage.

---

## Vanilla JS vs. React: What Changes at Scale

### Vanilla JS

```js
// Every time something changes, you manually:
const el = document.querySelector(`[data-bird="${id}"]`);
el.classList.toggle('active');
el.classList.add('playing');
// Then manually sync state...
state.birds[id].active = true;
// Then update the URL...
updateURL(state);
// Then handle audio...
scheduleAudio(id);
```

This works — until you need to update many elements simultaneously, load audio in the background, and sync URL state on every change.

**The problem isn't JavaScript — it's manual DOM management at this scale.** You end up writing a mini-framework. That framework will be buggy, custom, and only you understand it.

### React

React solves the state → UI sync problem automatically.

```jsx
function BirdBlock({ speciesId, callType, x, y, playing, onDrag }) {
  return (
    <div
      className={`bird ${playing ? 'playing' : ''}`}
      style={{
        left: `${x * STEP_WIDTH}px`,
        top: `${(1 - y) * CANVAS_HEIGHT}px`,
        '--sound-color': COLORS[callType],
      }}
      onPointerDown={onDrag}
    />
  );
}

// The canvas is just mapping state to blocks:
{blocks.map(b => <BirdBlock key={b.id} {...b} playing={playhead === b.x} />)}
```

State changes → React updates only what changed. You don't touch the DOM.

---

## Final Stack Recommendation

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | **React + Vite** | Component model fits bird blocks. Vite = fast dev server, no config. |
| **Audio** | **Tone.js** | Built on Web Audio API. Handles precise scheduling, audio loading states, timing. |
| **State management** | **React useState / useReducer** | Built in. No extra library needed at MVP scale. |
| **Styling** | **CSS Modules + CSS Custom Properties** | Scoped styles. Custom properties for bird colors and theme. |
| **Build / Deploy** | **Vercel** | One command to deploy. Free tier sufficient. Integrates with GitHub. |
| **Bird sounds** | **Xeno-canto** | Fetch recordings, cache to localStorage. |
| **State persistence** | **localStorage + URL params** | React makes serialization cleaner. |
| **Version control** | **GitHub** | Required. |

---

## Why Tone.js Specifically

The Web Audio API is powerful but low-level:

```js
// Without Tone.js:
const source = audioCtx.createBufferSource();
source.buffer = buffer;
source.connect(audioCtx.destination);
source.start(audioCtx.currentTime + 0.1);
```

With Tone.js:
```js
const player = new Tone.Player(audioUrl).toDestination();
Tone.Transport.schedule(time => player.start(time), "1m");
```

Tone.js adds:
- **Transport** — a musical clock with bars/beats/steps, perfect for a sequencer
- **Player** — handles audio file loading, buffering, playback states
- **Loop** — native loop primitives
- **`Tone.loaded()`** — a Promise resolving when all audio is loaded

This handles the audio loading states automatically.

---

## Animation Plan (Playing Indicators)

### The states every bird needs

```
Default → Placed → Playing (playhead reached it) → back to Placed
```

### Implementation

```css
.bird {
  background: var(--sound-color);
  transition: transform 80ms ease;
}

.bird.playing {
  animation: birdPulse 120ms ease-out;
}

@keyframes birdPulse {
  0%   { transform: scale(1);    box-shadow: 0 0 8px var(--sound-color); }
  40%  { transform: scale(1.12); box-shadow: 0 0 20px var(--sound-color); }
  100% { transform: scale(1);    box-shadow: 0 0 8px var(--sound-color); }
}

.playhead {
  background: rgba(255, 255, 255, 0.35);
  width: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .bird.playing { animation: none; }
}
```

### Audio → Visual timing (the key insight)

**Audio timing and visual timing must be separate.** Audio is scheduled via `Tone.Transport` (precise, uses AudioContext.currentTime). Visuals update with `requestAnimationFrame` (smooth, 60fps).

```js
Tone.Transport.scheduleRepeat(time => {
  playAudioForStep(currentStep, time);   // audio fires precisely
  Tone.Draw.schedule(() => {
    setPlayhead(currentStep);            // visual on next animation frame
    currentStep = (currentStep + 1) % totalSteps;
  }, time);
}, stepDuration);
```

`Tone.Draw` is built specifically for this — it bridges the audio thread and the animation frame. This is how professional web audio apps are built.

---

## GitHub Setup

### Why Git from day one
- Safety net — every version recoverable
- Deployment — Vercel deploys from GitHub automatically on every push
- History — see how the product evolved

> **Note added 2026-08-05:** This project lost all documentation once because it lived only in a local folder. Git would have prevented that. This is no longer a theoretical benefit.

### Repository structure

```
bird-sequencer/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── Canvas/
│   │   ├── BirdBlock/
│   │   ├── BirdPanel/
│   │   ├── Playhead/
│   │   └── Controls/
│   ├── hooks/
│   │   ├── useSequencer.js
│   │   ├── useCanvas.js
│   │   └── useURL.js
│   ├── data/
│   │   └── birds.js
│   └── styles/
│       └── tokens.css
└── public/
    └── audio/
```

### Branching strategy (solo)

```
main          → always working, deployed to Vercel
dev           → active work
feature/name  → specific features
```

Rule: never push broken code to `main`.

### Setup commands

```bash
npm create vite@latest bird-sequencer -- --template react
cd bird-sequencer
npm install tone
npm install
git init && git add . && git commit -m "init: Vite + React + Tone.js"
git remote add origin https://github.com/[username]/bird-sequencer.git
git push -u origin main
```

Then in Vercel: connect GitHub repo → auto-deploy on push.

---

## Summary: What I Recommend

1. **Start directly with React + Vite** — the prototype phase is done
2. **Use Tone.js for audio** — loading states, precise timing, sequencer clock
3. **CSS Custom Properties** — one variable per sound type, all animations reference it
4. **Tone.Draw for animation sync** — the right way to bridge audio precision and visual smoothness
5. **GitHub from commit #1** — connect to Vercel immediately
6. **No TypeScript for MVP** — adds friction without benefit at this scale

**Confidence:** High. This is the stack for any serious browser audio application at this scale.

---

## Anticipated Questions

**"What if I want to learn this?"**
React is one of the most documented technologies in the world. Vite is the simplest build tool that exists. Tone.js has excellent docs.

**"Will it be too heavy/slow?"**
React + Tone.js bundled is ~100KB gzipped. For a music app loading audio files (50-200KB each), framework size is negligible.

**"Can we add TypeScript later?"**
Yes, trivially. Vite supports it with one config change.
