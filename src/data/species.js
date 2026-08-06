/**
 * The species that own the rows.
 *
 * Shared by the app and by scripts/fetch-catalog.mjs, so the row order here
 * is the row order on screen and the order in the catalog.
 *
 * `shape` is the geometry that identifies the species; `color` fills it.
 * Sound type is encoded separately, as the border.
 */

/**
 * Two tabs, because Xeno-canto only has two distinct things for these species.
 *
 * The sketch had three — Dawn / Romance / Calls — but no recording of any of
 * our six is tagged `dawn song`, so Dawn and Romance both fell through to
 * `song` and produced the identical file. Two tabs that differ beat three
 * where two are the same.
 *
 * `xcTypes` lists the Xeno-canto `type:` values to accept, best match first.
 */
export const SOUND_TYPES = [
  {
    id: 'song',
    label: 'Song',
    xcTypes: ['song', 'subsong'],
  },
  {
    id: 'calls',
    label: 'Calls',
    xcTypes: ['call', 'alarm call', 'flight call'],
  },
];

export const SPECIES = [
  {
    id: 'hoopoe',
    genus: 'Upupa',
    species: 'epops',
    en: 'Hoopoe',
    he: 'דוכיפת',
    shape: 'diamond',
    color: 'var(--species-hoopoe)',
    // Only one Israeli recording exists, so allow the global pool.
    allowGlobalFallback: true,
  },
  {
    id: 'bulbul',
    genus: 'Pycnonotus',
    species: 'xanthopygos',
    en: 'White-spectacled Bulbul',
    he: 'בולבול',
    shape: 'circle',
    color: 'var(--species-bulbul)',
    allowGlobalFallback: false,
  },
  {
    id: 'swallow',
    genus: 'Hirundo',
    species: 'rustica',
    en: 'Barn Swallow',
    he: 'סנונית',
    shape: 'triangle',
    color: 'var(--species-swallow)',
    allowGlobalFallback: true,
  },
  {
    id: 'crow',
    genus: 'Corvus',
    species: 'cornix',
    en: 'Hooded Crow',
    he: 'עורב אפור',
    shape: 'square',
    color: 'var(--species-crow)',
    allowGlobalFallback: false,
  },
  {
    id: 'owl',
    genus: 'Athene',
    species: 'noctua',
    en: 'Little Owl',
    he: 'כוס חורבות',
    shape: 'star',
    color: 'var(--species-owl)',
    allowGlobalFallback: true,
  },
  {
    id: 'sparrow',
    genus: 'Passer',
    species: 'domesticus',
    en: 'House Sparrow',
    he: 'דרור',
    shape: 'rectangle',
    color: 'var(--species-sparrow)',
    allowGlobalFallback: false,
  },
];
