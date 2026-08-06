/**
 * The species that own the rows.
 *
 * Shared by the app and by scripts/fetch-catalog.mjs, so the row order here
 * is the row order on screen and the order in the catalog.
 *
 * `shape` is the geometry that identifies the species; `color` fills it.
 * Sound type is encoded separately, as the border.
 */

export const SOUND_TYPES = [
  {
    id: 'dawn',
    label: 'Dawn',
    // Xeno-canto `type:` values to look for, best first.
    xcTypes: ['dawn song', 'song'],
  },
  {
    id: 'romance',
    label: 'Romance',
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
