import styles from './App.module.css';

/**
 * App shell — Phase 0.
 *
 * Establishes the three regions from the sketch and nothing else:
 * a toolbar, a species panel beside the grid area, and a transport bar.
 * The sky is the background of the whole interface, so each region is
 * translucent rather than opaque.
 *
 * No grid, no audio, no bird data yet. Those arrive in Phase 1 and 2.
 */
export default function App() {
  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <h1 className={styles.wordmark}>BirdSequencer</h1>
      </header>

      <main className={styles.main}>
        <aside className={styles.panel}>
          <p className={styles.placeholder}>
            Species panel — 10 rows, with sound-type tabs and a volume
            slider each.
          </p>
        </aside>

        <section className={styles.canvas}>
          <div className={styles.placeholderCanvas}>
            <span className={styles.placeholderTitle}>Grid area</span>
            <span>10 species rows &times; 16 steps</span>
          </div>
        </section>
      </main>

      <footer className={styles.transport}>
        <span className={styles.placeholder}>
          Transport — share, record, play, waveform.
        </span>
      </footer>
    </div>
  );
}
