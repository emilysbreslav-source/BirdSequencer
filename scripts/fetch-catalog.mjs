/**
 * Builds the bird catalog the app ships with.
 *
 *   node scripts/fetch-catalog.mjs [country]
 *
 * Runs on a developer machine, never in the browser: the Xeno-canto key stays
 * in .env and the published app makes no requests to their servers.
 *
 * Writes src/data/catalog.<country>.json and prints a coverage matrix showing
 * which species actually have a usable recording for each sound type.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SPECIES, SOUND_TYPES } from '../src/data/species.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COUNTRY = process.argv[2] ?? 'Israel';

/**
 * A sequencer step is short, so length is graded rather than pass/fail.
 * A single threshold made everything over it tie, and quality then picked
 * a 34-second file over a 14-second one — the wrong way round for us.
 */
const LENGTH_BUCKETS = [8, 15, 25, 40];
const HARD_MAX_SECONDS = 40;

/** D and E are noisy or distant enough to be unpleasant. Never use them. */
const WORST_USABLE_QUALITY = 'C';

/** Xeno-canto asks that automated use stay gentle. One request per second. */
const REQUEST_GAP_MS = 1100;

const QUALITY_RANK = { A: 0, B: 1, C: 2, D: 3, E: 4 };

// ---------------------------------------------------------------- key

function readKey() {
  let env;
  try {
    env = readFileSync(resolve(ROOT, '.env'), 'utf8');
  } catch {
    fatal('No .env file found.', 'Copy .env.example to .env and add your Xeno-canto key.');
  }
  const key = env.match(/^XENO_CANTO_KEY=(.+)$/m)?.[1].trim();
  if (!key) {
    fatal('XENO_CANTO_KEY is empty in .env.', 'Get a key from your account page at xeno-canto.org.');
  }
  return key;
}

function fatal(message, hint) {
  console.error(`\n  ${message}`);
  if (hint) console.error(`  ${hint}`);
  console.error('');
  process.exit(1);
}

// ---------------------------------------------------------------- api

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function query(tags, key) {
  const url = `https://xeno-canto.org/api/3/recordings?query=${encodeURIComponent(tags)}&key=${key}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'BirdSequencer/0.1 (non-commercial; xeno-canto attribution shown in app)' },
  });
  const body = await res.json().catch(() => null);

  if (res.status === 401 || res.status === 403) {
    fatal('Xeno-canto rejected the key.', 'Check XENO_CANTO_KEY in .env, or regenerate it on your account page.');
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${body?.message ?? 'unknown error'}`);
  }
  await sleep(REQUEST_GAP_MS);
  return body.recordings ?? [];
}

// ---------------------------------------------------------------- picking

/** "0:34" and "1:02" both become seconds. */
function toSeconds(length) {
  const parts = String(length ?? '').split(':').map(Number);
  if (parts.some(Number.isNaN)) return Infinity;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

/** Xeno-canto's `type` is free text and often compound: "call, song". */
function hasType(recording, wanted) {
  return String(recording.type ?? '')
    .toLowerCase()
    .split(',')
    .map((t) => t.trim())
    .includes(wanted);
}

/**
 * Ranks candidates for one sound type. In order of importance:
 *   1. the exact type we asked for, over a fallback type
 *   2. no other species audible — we want one bird, not a dawn chorus
 *   3. short enough to work as a single step
 *   4. recording quality
 *   5. shorter still
 *
 * Length outranks quality on purpose. A clean 3-second B beats a pristine
 * 37-second A, because the long one is a bird calling repeatedly with gaps,
 * not the single hit a sequencer step needs.
 */
function lengthBucket(seconds) {
  const i = LENGTH_BUCKETS.findIndex((limit) => seconds <= limit);
  return i === -1 ? LENGTH_BUCKETS.length : i;
}

function pickBest(recordings, xcTypes) {
  const usable = recordings.filter(
    (r) =>
      toSeconds(r.length) <= HARD_MAX_SECONDS &&
      (QUALITY_RANK[r.q] ?? 9) <= QUALITY_RANK[WORST_USABLE_QUALITY]
  );

  const scored = usable
    .map((r) => {
      const typeIndex = xcTypes.findIndex((t) => hasType(r, t));
      if (typeIndex === -1) return null;
      const seconds = toSeconds(r.length);
      return {
        recording: r,
        typeIndex,
        alone: (r.also ?? []).filter(Boolean).length === 0 ? 0 : 1,
        quality: QUALITY_RANK[r.q] ?? 9,
        tooLong: lengthBucket(seconds),
        seconds,
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        a.typeIndex - b.typeIndex ||
        a.alone - b.alone ||
        a.tooLong - b.tooLong ||
        a.quality - b.quality ||
        a.seconds - b.seconds
    );

  return scored[0] ?? null;
}

/**
 * Downloads a recording into public/audio/ and returns its local path.
 *
 * The browser cannot fetch from xeno-canto.org directly — their bot protection
 * blocks cross-origin requests that carry real browser fingerprints, even
 * though curl gets a permissive CORS header. Serving the files ourselves also
 * means one download total instead of one per visitor.
 */
async function download(recording) {
  const dir = resolve(ROOT, 'public/audio');
  mkdirSync(dir, { recursive: true });
  const name = `xc${recording.id}.mp3`;
  const path = resolve(dir, name);

  if (existsSync(path)) return `/audio/${name}`;

  const res = await fetch(recording.file, {
    headers: { 'User-Agent': 'BirdSequencer/0.1 (non-commercial; attribution shown in app)' },
  });
  if (!res.ok) throw new Error(`audio download failed: HTTP ${res.status}`);
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
  await sleep(REQUEST_GAP_MS);
  return `/audio/${name}`;
}

function toCatalogEntry(pick, source, audioPath) {
  const r = pick.recording;
  return {
    xcId: r.id,
    url: `https://xeno-canto.org/${r.id}`,
    audio: audioPath,
    fileName: r['file-name'],
    seconds: pick.seconds,
    quality: r.q,
    xcType: r.type,
    country: r.cnt,
    location: r.loc,
    recordist: r.rec,
    license: r.lic,
    alsoAudible: (r.also ?? []).filter(Boolean),
    source, // 'country' or 'global'
  };
}

// ---------------------------------------------------------------- main

async function main() {
  const key = readKey();
  console.log(`\nBuilding catalog for ${COUNTRY}\n`);

  const catalog = {
    country: COUNTRY,
    generatedAt: new Date().toISOString().slice(0, 10),
    attribution:
      'Recordings from xeno-canto.org, used under Creative Commons licenses. ' +
      'Each recordist is credited in the interface.',
    species: [],
  };

  const coverage = [];

  for (const sp of SPECIES) {
    const name = `${sp.en}`;
    process.stdout.write(`  ${name.padEnd(26)}`);

    const base = `gen:${sp.genus} sp:${sp.species}`;
    let pool = [];
    let source = 'country';

    try {
      pool = await query(`${base} cnt:${COUNTRY}`, key);

      if (sp.allowGlobalFallback && pool.length < 3) {
        const global = await query(`${base} q:A`, key);
        pool = [...pool, ...global];
        source = 'global';
      }
    } catch (e) {
      console.log(`failed — ${e.message}`);
      continue;
    }

    const sounds = {};
    const row = { species: sp.en };

    for (const type of SOUND_TYPES) {
      const pick = pickBest(pool, type.xcTypes);
      if (!pick) {
        row[type.id] = '—';
        continue;
      }
      const inCountry = pick.recording.cnt === COUNTRY;
      try {
        const audioPath = await download(pick.recording);
        sounds[type.id] = toCatalogEntry(pick, inCountry ? 'country' : 'global', audioPath);
        row[type.id] = `${pick.recording.q}${inCountry ? '' : '*'} ${pick.seconds}s`;
      } catch (e) {
        row[type.id] = 'dl fail';
        console.log(`\n     ${type.label}: ${e.message}`);
      }
    }

    catalog.species.push({
      id: sp.id,
      en: sp.en,
      he: sp.he,
      latin: `${sp.genus} ${sp.species}`,
      shape: sp.shape,
      color: sp.color,
      sounds,
    });

    coverage.push(row);
    const found = Object.keys(sounds).length;
    console.log(`${pool.length} recordings → ${found}/${SOUND_TYPES.length} sound types${source === 'global' ? '  (global fallback)' : ''}`);
  }

  // ---- write

  const outDir = resolve(ROOT, 'src/data');
  mkdirSync(outDir, { recursive: true });
  const outFile = resolve(outDir, `catalog.${COUNTRY.toLowerCase()}.json`);
  writeFileSync(outFile, JSON.stringify(catalog, null, 2) + '\n');

  // ---- report

  console.log('\n  Coverage');
  console.log('  ' + '-'.repeat(58));
  console.log('  ' + 'Species'.padEnd(26) + SOUND_TYPES.map((t) => t.label.padEnd(11)).join(''));
  for (const row of coverage) {
    console.log(
      '  ' + row.species.padEnd(26) + SOUND_TYPES.map((t) => String(row[t.id]).padEnd(11)).join('')
    );
  }
  console.log('  ' + '-'.repeat(58));
  console.log('  * = recording is not from ' + COUNTRY);

  const gaps = coverage.flatMap((row) =>
    SOUND_TYPES.filter((t) => row[t.id] === '—').map((t) => `${row.species} has no ${t.label}`)
  );
  if (gaps.length) {
    console.log('\n  Gaps — these rows must be disabled when that tab is active:');
    for (const gap of gaps) console.log(`    ${gap}`);
  }

  console.log(`\n  Wrote ${outFile.replace(ROOT, '.')}\n`);
}

main().catch((e) => fatal(e.message));
