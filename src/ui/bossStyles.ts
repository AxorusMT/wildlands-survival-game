// Each great foe announces itself in its own way: a title line, the colours and pattern of its
// health bar, the ornaments either side of its name, and the lettering of the name itself.

export type BarPattern =
  'solid' | 'segments' | 'stripes' | 'ticks' | 'drip' | 'shimmer' | 'pulse' | 'bubbles' | 'cracks';
export type BossFont = 'pixel' | 'caps' | 'serif';

export interface BossStyle {
  /** A line under the name: what it is, or what it rules. */
  epithet: string;
  /** Bar fill (two stops), track, frame, and name colours. */
  fill: [string, string];
  track: string;
  frame: string;
  name: string;
  pattern: BarPattern;
  font: BossFont;
  /** Ornaments either side of the name. */
  glyphs: [string, string];
  /** Cut corners, a plain box, or a rounded plate. */
  shape: 'notched' | 'box' | 'plate' | 'jagged';
}

const S = (
  epithet: string,
  fill: [string, string],
  track: string,
  frame: string,
  name: string,
  pattern: BarPattern,
  font: BossFont,
  glyphs: [string, string],
  shape: BossStyle['shape'] = 'notched',
): BossStyle => ({ epithet, fill, track, frame, name, pattern, font, glyphs, shape });

export const BOSS_STYLES: Record<string, BossStyle> = {
  // The Effergy's Direwolves (by altar level).
  direwolf1: S(
    'First of the Old Hunt',
    ['#6a3a8a', '#d8a0ff'],
    '#1a1022',
    '#8a6aa8',
    '#f0e0ff',
    'segments',
    'caps',
    ['☾', '☽'],
    'jagged',
  ),
  direwolf2: S(
    'Second of the Old Hunt',
    ['#8a2a1a', '#ff8a3a'],
    '#220c06',
    '#c8583a',
    '#ffe0c0',
    'segments',
    'caps',
    ['☾', '☽'],
    'jagged',
  ),
  direwolf3: S(
    'Last of the Old Hunt',
    ['#3a1a6a', '#b36cff'],
    '#0e061a',
    '#8a4ac8',
    '#e8d0ff',
    'segments',
    'caps',
    ['☾', '☽'],
    'jagged',
  ),
  // Dungeons and dimensions.
  hollow_king: S(
    'Lord of the Mossy Crypt',
    ['#3a5a2a', '#9ab88a'],
    '#141c10',
    '#6a7a5a',
    '#dfe8c8',
    'cracks',
    'serif',
    ['✝', '✝'],
    'plate',
  ),
  rime_colossus: S(
    'Heart of the Frost Keep',
    ['#5a8ab0', '#dff6ff'],
    '#10202c',
    '#9fd8ec',
    '#f0faff',
    'shimmer',
    'caps',
    ['❄', '❄'],
    'box',
  ),
  pharaoh: S(
    'Queen Beneath the Sands',
    ['#8a6a1a', '#f0d080'],
    '#241a08',
    '#d8b848',
    '#fff0c0',
    'ticks',
    'serif',
    ['☥', '☥'],
    'plate',
  ),
  archdemon: S(
    'Master of the Cinder Citadel',
    ['#6a0a0a', '#ff4a1a'],
    '#1a0404',
    '#c8301a',
    '#ffd0b0',
    'pulse',
    'caps',
    ['⛧', '⛧'],
    'jagged',
  ),
  sporemother: S(
    'Root of the Mycelial Deep',
    ['#2a6a60', '#58e0d0'],
    '#0a1c1a',
    '#3a9a8a',
    '#d0fff4',
    'bubbles',
    'pixel',
    ['✺', '✺'],
    'plate',
  ),
  tempest_roc: S(
    'Storm Above Skyreach',
    ['#5a7aa8', '#f8e08a'],
    '#101826',
    '#c8c0b0',
    '#fff8e0',
    'stripes',
    'caps',
    ['⚡', '⚡'],
    'notched',
  ),
  unmaker: S(
    'The End of All Things',
    ['#2a0a3a', '#ff5a8a'],
    '#06020a',
    '#b36cff',
    '#ffd0f0',
    'pulse',
    'serif',
    ['◉', '◉'],
    'jagged',
  ),
  // Band I.
  orchard_mother: S(
    'Matriarch of the Drowned Orchard',
    ['#3a6a5a', '#c8583a'],
    '#0e1c18',
    '#5ac8c0',
    '#e8fff8',
    'bubbles',
    'pixel',
    ['❦', '❦'],
    'plate',
  ),
  kiln_beast: S(
    'The Fire That Never Went Out',
    ['#5a2a1a', '#ffb060'],
    '#1c0a06',
    '#ff8a3a',
    '#fff0c0',
    'drip',
    'caps',
    ['▲', '▲'],
    'jagged',
  ),
  warren_queen: S(
    'She Who Burrows',
    ['#6a4a1a', '#ffd070'],
    '#1a1206',
    '#e8a030',
    '#fff0c0',
    'segments',
    'pixel',
    ['◆', '◆'],
    'notched',
  ),
  // Band II.
  lumen_stag: S(
    'Light of the Glasswood',
    ['#8ab8d8', '#ffffff'],
    '#101c28',
    '#bfe8ff',
    '#ffffff',
    'shimmer',
    'serif',
    ['✧', '✧'],
    'plate',
  ),
  ossuary_hydra: S(
    'The Many-Headed Fen',
    ['#4a5a3a', '#e6dcc6'],
    '#141810',
    '#d8ceb4',
    '#f4f0e0',
    'cracks',
    'caps',
    ['☠', '☠'],
    'jagged',
  ),
  // Band III.
  engine_saint: S(
    'Patron of the Last Machine',
    ['#8a6a2a', '#f0c870'],
    '#1c1408',
    '#d8a048',
    '#fff0c0',
    'ticks',
    'caps',
    ['⚙', '⚙'],
    'box',
  ),
  mirage_tyrant: S(
    'Lord of What Is Not There',
    ['#ffb060', '#fff0c0'],
    '#241808',
    '#f0c0c8',
    '#fff8f0',
    'shimmer',
    'serif',
    ['◌', '◌'],
    'plate',
  ),
  the_hymnal: S(
    'The Choir That Never Ceased',
    ['#6a88b0', '#e8f4ff'],
    '#101826',
    '#c8904a',
    '#f0f8ff',
    'ticks',
    'serif',
    ['♪', '♫'],
    'plate',
  ),
  // Band IV.
  mother_of_rot: S(
    'All Sickness Is Her Child',
    ['#4a5a1a', '#b8c870'],
    '#141808',
    '#8a9a3a',
    '#eef0c0',
    'drip',
    'pixel',
    ['☣', '☣'],
    'jagged',
  ),
  the_astronomer: S(
    'Keeper of the Drowned Sky',
    ['#2a2e60', '#bfd0ff'],
    '#06081a',
    '#9ab0ff',
    '#e8f0ff',
    'shimmer',
    'serif',
    ['✦', '✦'],
    'notched',
  ),
  pauper_king: S(
    'Sovereign of the Gutter',
    ['#8a6a1a', '#fff0a0'],
    '#1c1606',
    '#f0c850',
    '#fff4c8',
    'stripes',
    'serif',
    ['♔', '♔'],
    'plate',
  ),
  // Band V.
  the_leviathan: S(
    'What Waits Below',
    ['#1a4a6a', '#9ae0ff'],
    '#040c14',
    '#4a9ac0',
    '#d8f4ff',
    'bubbles',
    'caps',
    ['≈', '≈'],
    'plate',
  ),
  anvil_god: S(
    'Smith of the World',
    ['#8a2a0a', '#ffd070'],
    '#1a0804',
    '#ff6a2a',
    '#fff0d0',
    'cracks',
    'caps',
    ['⚒', '⚒'],
    'box',
  ),
  four_faced_warden: S(
    'It Keeps All Four Seasons',
    ['#8ad070', '#d8703a'],
    '#141c10',
    '#f0c850',
    '#fff8e0',
    'stripes',
    'serif',
    ['❀', '❄'],
    'notched',
  ),
};

/** A plain style for anything without its own. */
export const DEFAULT_BOSS_STYLE: BossStyle = S(
  'A great foe',
  ['#8b2635', '#e68668'],
  '#271c1c',
  '#cba19c',
  '#f5e0d7',
  'solid',
  'caps',
  ['✦', '✦'],
);

/** The Four-Faced Warden's bar follows its current face. */
export const WARDEN_FACES: [string, string][] = [
  ['#5a8a3a', '#b8f090'],
  ['#c8883a', '#fff0a0'],
  ['#8a3a1a', '#f09060'],
  ['#5a7aa8', '#e8f4ff'],
];
