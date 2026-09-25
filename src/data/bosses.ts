import type { BossSpec } from '../core/types.ts';

// The three Direwolves the Effergy of Beasts can summon, in order.
export const BOSSES: BossSpec[] = [
  {
    name: 'Eclipse Direwolf',
    kills: 6,
    hp: 380,
    bite: 19,
    rewards: { eclipse_fang: 1, direwolf_pelt: 2, beast_core: 1 },
    xp: 50,
    color: '#a8d9e5',
    glow: '#cdeaff',
  },
  {
    name: 'Ember Direwolf',
    kills: 9,
    hp: 620,
    bite: 26,
    rewards: { eclipse_fang: 2, direwolf_pelt: 3, beast_core: 2 },
    xp: 90,
    color: '#e89454',
    glow: '#ffbc70',
  },
  {
    name: 'Void Direwolf',
    kills: 12,
    hp: 920,
    bite: 34,
    rewards: { eclipse_fang: 3, direwolf_pelt: 5, beast_core: 3 },
    xp: 150,
    color: '#af86d3',
    glow: '#e3baf7',
  },
];

/**
 * The Unmaker's entrance is timed to its theme: the build lasts ENTRANCE_BARS bars at
 * UNMAKER_BPM, and the beat drops on the reveal.
 */
export const UNMAKER_BPM = 140,
  ENTRANCE_BARS = 4,
  ENTRANCE = (ENTRANCE_BARS * 4 * 60) / UNMAKER_BPM;
/** Seconds per beat of the Unmaker's theme, for anything that pulses with it. */
export const UNMAKER_BEAT = 60 / UNMAKER_BPM;

/** One of the Unmaker's phases: where it begins (a share of its health), its name, its theme. */
export interface UnmakerPhase {
  at: number;
  name: string;
  title: string;
  /** The tempo of the phase's theme, which the aura pulses to. */
  bpm: number;
  music: string;
  /** The host it keeps about it. */
  minions: [type: string, count: number][];
}
export const UNMAKER_PHASES: UnmakerPhase[] = [
  { at: 1, name: 'I', title: 'The Gaze', bpm: 140, music: 'unmaker', minions: [['watcher', 2]] },
  {
    at: 0.75,
    name: 'II',
    title: 'The Swarm',
    bpm: 145,
    music: 'unmaker_2',
    minions: [
      ['watcher', 2],
      ['void_wisp', 4],
    ],
  },
  {
    at: 0.5,
    name: 'III',
    title: 'The Unweaving',
    bpm: 150,
    music: 'unmaker_3',
    minions: [
      ['void_shade', 2],
      ['void_wisp', 3],
    ],
  },
  {
    at: 0.25,
    name: 'IV',
    title: 'The Collapse',
    bpm: 160,
    music: 'unmaker_4',
    minions: [
      ['void_shade', 2],
      ['void_stalker', 2],
      ['watcher', 2],
    ],
  },
];
/** Below this share of its health, the Unmaker makes its last stand. */
export const LAST_STAND = 0.1;
/**
 * The Unmaker's death is scored by a phonk turn on the title theme, at the title's own tempo:
 * a three-bar callback to the title's intro while it comes apart, then the drop on its burst.
 */
export const FINALE_BPM = 132,
  FINALE_DROP_BARS = 3,
  FINALE_BARS = 32,
  FINALE_SECONDS = (FINALE_BARS * 4 * 60) / FINALE_BPM;
/** In the death scene: the burst (on the finale's drop), the fall, and the scene's end. */
export const SUPERNOVA = (FINALE_DROP_BARS * 4 * 60) / FINALE_BPM,
  UNMADE = SUPERNOVA + 0.4;
/**
 * Then the fourth wall breaks: the screen cracks like a struck monitor and falls away into the
 * dark, before the world comes back like an old tube warming up.
 */
export const SHATTER_AT = SUPERNOVA + 3.2,
  SHATTER_SECONDS = 5.1,
  DEATH_SCENE = SHATTER_AT + SHATTER_SECONDS + 2.5;
