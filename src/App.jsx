import { useState, useMemo } from 'react';
import catalog from './data/catalog.israel.json';
import { SPECIES, SOUND_TYPES } from './data/species.js';
import { useSequencer, STEPS } from './hooks/useSequencer.js';
import styles from './App.module.css';

/**
 * Phase 2 — the grid.
 *
 * Y picks the bird, X picks the moment. Every species owns one row, and the
 * panel row and the grid row are the same height so they line up: reading
 * across from a name lands on that bird's timeline.
 *
 * A cell holds one call. The active tab decides which call type gets placed,
 * and a species with nothing for that tab has its row disabled rather than
 * silently ignoring the click.
 */

/** Something is already playing when you arrive, so the page is never silent. */
const DEMO_CELLS = [
  'owl:calls:0',
  'bulbul:song:2',
  'hoopoe:calls:4',
  'sparrow:calls:6',
  'bulbul:song:8',
  'swallow:song:9',
  'hoopoe:calls:12',
  'crow:calls:14',
];

export default function App() {
  const [activeTab, setActiveTab] = useState('song');
  const [cells, setCells] = useState(() => new Set(DEMO_CELLS));

  const catalogById = useMemo(
    () => Object.fromEntries(catalog.species.map((s) => [s.id, s])),
    []
  );

  const pattern = useMemo(
    () =>
      [...cells].map((key) => {
        const [speciesId, soundId, step] = key.split(':');
        return { speciesId, soundId, step: Number(step) };
      }),
    [cells]
  );

  const { isReady, isPlaying, step, error, toggle } = useSequencer({
    catalog,
    pattern,
  });

  function toggleCell(speciesId, stepIndex) {
    const key = `${speciesId}:${activeTab}:${stepIndex}`;
    setCells((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  /** A cell is lit if any sound type is placed there, not just the active one. */
  function soundAt(speciesId, stepIndex) {
    for (const type of SOUND_TYPES) {
      if (cells.has(`${speciesId}:${type.id}:${stepIndex}`)) return type.id;
    }
    return null;
  }

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <h1 className={styles.wordmark}>BirdSequencer</h1>
        <span className={styles.country}>{catalog.country}</span>
        <button className={styles.clear} onClick={() => setCells(new Set())}>
          Clear
        </button>
      </header>

      {/* Four cells of one grid: tabs sit above the species names, the ruler
          above the timeline. Sharing the grid is what keeps a bird's name and
          its row on the same line — offsets would drift. */}
      <main className={styles.main}>
        <div className={styles.tabs} role="tablist">
          {SOUND_TYPES.map((type) => (
            <button
              key={type.id}
              role="tab"
              aria-selected={activeTab === type.id}
              className={`${styles.tab} ${activeTab === type.id ? styles.tabOn : ''}`}
              onClick={() => setActiveTab(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className={styles.ruler}>
          {Array.from({ length: STEPS }, (_, i) => (
            <span
              key={i}
              className={`${styles.tick} ${i === step ? styles.tickOn : ''}`}
            >
              {i % 4 === 0 ? i / 4 + 1 : ''}
            </span>
          ))}
        </div>

        <aside className={styles.panel}>
          <ul className={styles.speciesList}>
            {SPECIES.map((sp) => {
              const available = Boolean(catalogById[sp.id]?.sounds[activeTab]);
              return (
                <li
                  key={sp.id}
                  className={`${styles.species} ${available ? '' : styles.speciesOff}`}
                  title={available ? sp.he : `No ${activeTab} recording for ${sp.en}`}
                >
                  <span
                    className={`${styles.swatch} ${styles[sp.shape]}`}
                    style={{ background: sp.color }}
                  />
                  <span className={styles.speciesName}>{sp.en}</span>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className={styles.gridWrap}>
          <div className={styles.grid}>
            {SPECIES.map((sp) => {
              const available = Boolean(catalogById[sp.id]?.sounds[activeTab]);
              return (
                <div key={sp.id} className={styles.row}>
                  {Array.from({ length: STEPS }, (_, i) => {
                    const placed = soundAt(sp.id, i);
                    return (
                      <button
                        key={i}
                        className={[
                          styles.cell,
                          placed ? styles.cellOn : '',
                          i === step ? styles.cellUnderPlayhead : '',
                          i % 4 === 0 ? styles.cellBar : '',
                          available ? '' : styles.cellOff,
                        ].join(' ')}
                        style={placed ? { '--fill': sp.color } : undefined}
                        onClick={() => available && toggleCell(sp.id, i)}
                        disabled={!available && !placed}
                        aria-label={`${sp.en}, step ${i + 1}${placed ? ', on' : ''}`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
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
              : `${cells.size} placed`}
        </span>
        <span className={styles.credit}>
          Recordings from xeno-canto.org, CC licensed
        </span>
      </footer>
    </div>
  );
}
