import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

/**
 * The clock and the sound.
 *
 * Audio is scheduled on Tone.Transport, which runs on the audio thread and
 * keeps time accurately. The playhead is pushed to React through Tone.Draw,
 * which defers to the next animation frame. The two are deliberately
 * separate: a dropped frame must never delay a note.
 */

export const STEPS = 16;
export const LOOP_SECONDS = 8;

/** 16 steps across 8 seconds is one step every 500ms — an eighth note at 60bpm. */
const BPM = 60;
const STEP_INTERVAL = '8n';

/** Field recordings run long. Play only the opening of one as a single hit. */
const MAX_HIT_SECONDS = 1.8;

/**
 * @param {object}   options
 * @param {object}   options.catalog  parsed catalog.<country>.json
 * @param {Array}    options.pattern  [{ speciesId, soundId, step }]
 */
export function useSequencer({ catalog, pattern }) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState(null);

  /** speciesId:soundId -> Tone.Player */
  const playersRef = useRef(new Map());
  /** Read inside the audio callback, so it must not go stale between renders. */
  const patternRef = useRef(pattern);
  patternRef.current = pattern;

  // ---- load every sound in the catalog once

  useEffect(() => {
    let cancelled = false;
    const players = new Map();

    for (const species of catalog.species) {
      for (const [soundId, sound] of Object.entries(species.sounds)) {
        const player = new Tone.Player({ url: sound.audio }).toDestination();
        players.set(`${species.id}:${soundId}`, player);
      }
    }

    Tone.loaded()
      .then(() => {
        if (cancelled) return;
        playersRef.current = players;
        setIsReady(true);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message ?? 'Audio failed to load');
      });

    return () => {
      cancelled = true;
      for (const player of players.values()) player.dispose();
    };
  }, [catalog]);

  // ---- the loop

  useEffect(() => {
    if (!isReady) return;

    Tone.getTransport().bpm.value = BPM;

    let current = 0;

    const id = Tone.getTransport().scheduleRepeat((time) => {
      const stepNow = current;

      for (const hit of patternRef.current) {
        if (hit.step !== stepNow) continue;
        const player = playersRef.current.get(`${hit.speciesId}:${hit.soundId}`);
        if (!player?.loaded) continue;

        // Restart a player that is already sounding, rather than dropping the hit.
        if (player.state === 'started') player.stop(time);
        player.start(time, hit.offset ?? 0, MAX_HIT_SECONDS);
      }

      // Visuals ride the animation frame; audio above already fired precisely.
      Tone.getDraw().schedule(() => setStep(stepNow), time);

      current = (current + 1) % STEPS;
    }, STEP_INTERVAL);

    return () => {
      Tone.getTransport().clear(id);
    };
  }, [isReady]);

  // ---- transport control

  const play = useCallback(async () => {
    try {
      // Browsers only allow audio to begin inside a user gesture. If this
      // rejects, the button would otherwise look dead — so surface it.
      await Tone.start();
      Tone.getTransport().start();
      setIsPlaying(true);
      setError(null);
    } catch (e) {
      setError(e?.message ?? 'Could not start audio');
    }
  }, []);

  const stop = useCallback(() => {
    Tone.getTransport().stop();
    for (const player of playersRef.current.values()) {
      if (player.state === 'started') player.stop();
    }
    setIsPlaying(false);
    setStep(-1);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else play();
  }, [isPlaying, play, stop]);

  // Stop the transport if the component goes away mid-playback.
  useEffect(() => () => Tone.getTransport().stop(), []);

  return { isReady, isPlaying, step, error, play, stop, toggle };
}
