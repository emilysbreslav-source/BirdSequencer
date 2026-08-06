import catalog from './data/catalog.israel.json';
import { SPECIES, SOUND_TYPES } from './data/species.js';
import { useSequencer, STEPS } from './hooks/useSequencer.js';
import styles from './App.module.css';

/**
 * Phase 1 — the engine, audible.
 *
 * A fixed demo pattern proves the clock, the loading, and the audio-visual
 * sync. The real grid replaces it in Phase 2; the hook underneath does not
 * change, since it already takes an arbitrary pattern.
 */

const DEMO_PATTERN = [
  { speciesId: 'owl', soundId: 'calls', step: 0 },
  { speciesId: 'bulbul', soundId: 'song', step: 2 },
  { speciesId: 'hoopoe', soundId: 'calls', step: 4 },
  { speciesId: 'sparrow', soundId: 'calls', step: 6 },
  { speciesId: 'bulbul', soundId: 'song', step: 8 },
  { speciesId: 'swallow', soundId: 'song', step: 9 },
  { speciesId: 'hoopoe', soundId: 'calls', step: 12 },
  { speciesId: 'crow', soundId: 'calls', step: 14 },
];

export default function App() {
  const { isReady, isPlaying, step, error, toggle } = useSequencer({
    catalog,
    pattern: DEMO_PATTERN,
  });

  const byId = Object.fromEntries(catalog.species.map((s) => [s.id, s]));
  const activeNow = new Set(
    DEMO_PATTERN.filter((h) => h.step === step).map((h) => h.speciesId)
  );

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <h1 className={styles.wordmark}>BirdSequencer</h1>
        <span className={styles.country}>{catalog.country}</span>
      </header>

      <main className={styles.main}>
        <aside className={styles.panel}>
          <div className={styles.tabs}>
            {SOUND_TYPES.map((type) => (
              <span key={type.id} className={styles.tab}>
                {type.label}
              </span>
            ))}
          </div>

          <ul className={styles.speciesList}>
            {SPECIES.map((sp) => {
              const entry = byId[sp.id];
              const missing = SOUND_TYPES.filter((t) => !entry?.sounds[t.id]);
              return (
                <li
                  key={sp.id}
                  className={`${styles.species} ${activeNow.has(sp.id) ? styles.speciesActive : ''}`}
                >
                  <span
                    className={`${styles.swatch} ${styles[sp.shape]}`}
                    style={{ background: sp.color }}
                  />
                  <span className={styles.speciesName}>
                    {sp.en}
                    {missing.length > 0 && (
                      <em className={styles.missing}>
                        no {missing.map((t) => t.label.toLowerCase()).join(', ')}
                      </em>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className={styles.canvas}>
          <div className={styles.steps}>
            {Array.from({ length: STEPS }, (_, i) => (
              <span
                key={i}
                className={`${styles.step} ${i === step ? styles.stepOn : ''} ${
                  i % 4 === 0 ? styles.stepBar : ''
                }`}
              />
            ))}
          </div>
          <p className={styles.canvasNote}>
            Phase 1 — demo pattern. The grid arrives next.
          </p>
        </section>
      </main>

      <footer className={styles.transport}>
        <button
          className={styles.play}
          onClick={toggle}
          disabled={!isReady}
          aria-label={isPlaying ? 'Stop' : 'Play'}
        >
          {isPlaying ? '■' : '▶'}
        </button>
        <span className={styles.status}>
          {error
            ? `Audio failed: ${error}`
            : !isReady
              ? 'Loading recordings…'
              : isPlaying
                ? `Step ${step + 1} of ${STEPS}`
                : 'Ready'}
        </span>
        <span className={styles.credit}>
          Recordings from xeno-canto.org, CC licensed
        </span>
      </footer>
    </div>
  );
}
