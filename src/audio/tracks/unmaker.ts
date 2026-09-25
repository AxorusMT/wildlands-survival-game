import {
  ENTRANCE_BARS,
  FINALE_BARS,
  FINALE_BPM,
  FINALE_DROP_BARS,
  UNMAKER_PHASES,
} from '../../data/bosses.ts';
import { compose, type TrackMeta } from '../score.ts';

// The Unmaker: Brazilian phonk, like the edit you scroll past at two in the morning. A pitched
// 808 cowbell carries the hooks over a funk carioca tamborzão, a sliding distorted 808, and
// shouted "ah!" chops. There is a theme for each of its four phases, each faster and heavier than
// the last, so the music tightens as it weakens; and its death is scored by a phonk turn on the
// title theme, so the journey ends where it began.

/** The main hook, in F# minor (four bars). */
const HOOK =
  'f#5:2 f#5:1 r:1 a5:2 f#5:2 c#6:2 r:1 b5:1 a5:2 g5:2 | ' +
  'f#5:2 f#5:1 r:1 a5:2 f#5:2 d6:2 r:1 c#6:1 b5:2 a5:2 | ' +
  'f#5:2 f#5:1 r:1 a5:2 f#5:2 c#6:2 r:1 b5:1 a5:2 g5:2 | ' +
  'c#6:2 c#6:1 r:1 b5:2 a5:2 g5:3 a5:1 f#5:4';
/** The "montagem" hook: stuttered repeats, call and response (four bars). */
const HOOK_B =
  'c#6:1 c#6:1 r:1 c#6:1 b5:2 a5:2 b5:1 b5:1 r:1 b5:1 a5:2 f#5:2 | ' +
  'a5:1 a5:1 r:1 a5:1 g5:2 f#5:2 e5:2 f#5:2 g5:2 a5:2 | ' +
  'c#6:1 c#6:1 r:1 c#6:1 d6:2 c#6:2 b5:2 a5:2 b5:2 c#6:2 | ' +
  'f#6:3 e6:3 d6:2 c#6:4 a5:4';
const COUNTER =
  'f#4:4 c#5:4 a4:4 c#5:4 | f#4:4 d5:4 a4:4 d5:4 | f#4:4 c#5:4 a4:4 c#5:4 | c#5:4 b4:4 g4:4 a4:4';
const PROG = 'F#m F#m D C#',
  PROG_B = 'F#m E D C#';
/** The first two bars of a four-bar melody. */
const half = (m: string) => m.split(' | ').slice(0, 2).join(' | ');

const PARTS: TrackMeta['parts'] = {
  kick: { inst: 'bigkick', vol: 0.75 },
  clap: { inst: 'clap', vol: 0.55, rev: 0.2 },
  snare: { inst: 'snare', vol: 0.5, rev: 0.25 },
  hat: { inst: 'hat', vol: 0.28, pan: 0.2 },
  shaker: { inst: 'shaker', vol: 0.35, pan: -0.2 },
  tom: { inst: 'tom', vol: 0.45, pan: -0.15 },
  rim: { inst: 'rim', vol: 0.35, pan: 0.3 },
  bell: { inst: 'cowbell', vol: 0.75, rev: 0.2, echo: 0.12, cutoff: 12000 },
  bell2: { inst: 'cowbell', vol: 0.4, pan: 0.35, transpose: -12, duck: true },
  b808: { inst: 'phonk808', vol: 0.9 },
  vox: { inst: 'vox', vol: 0.5, rev: 0.3, echo: 0.1 },
  crash: { inst: 'crash', vol: 0.4, rev: 0.3 },
  impact: { inst: 'impact', vol: 0.8, rev: 0.5 },
  riser: { inst: 'riser', vol: 0.4, rev: 0.3 },
  swell: { inst: 'swell', vol: 0.35 },
};

type Score = Parameters<Parameters<typeof compose>[1]>[0];

/**
 * The phonk kit at an intensity from 1 to 4: the tamborzão, then busier hats and a shaker,
 * then claps on every beat and doubled toms, then a four-on-the-floor kick under it all.
 */
function funk(s: Score, bar: number, n: number, level: number) {
  s.grid('kick', bar, level >= 4 ? 'x..xx.x.x.xxx.x.' : 'x..x..x...x..x..', n);
  s.grid('clap', bar, level >= 3 ? '....x.......x.x.' : '....x.......x...', n);
  s.grid('tom', bar, level >= 3 ? '..x..x.xx.x.x..x' : '..x..x...x..x..x', n, { midi: 50 });
  s.grid('rim', bar, 'x...x..x..x.x...', n, { vel: 0.8 });
  s.grid('hat', bar, level >= 2 ? 'xxxxxxxxxxxxxxxx' : 'x.x.x.x.x.x.x.x.', n, { vel: 0.7 });
  if (level >= 2) s.grid('shaker', bar, 'x.xxx.xxx.xxx.xx', n, { vel: 0.8 });
}
/** Shouted chops: "ah!" on two and four, or "hey!" stabs, or (at the top) on every eighth. */
function chops(s: Score, bar: number, n: number, kind: 'ah' | 'hey' | 'frenzy' = 'ah') {
  const line = {
    ah: 'r:4 f#4:2 r:6 f#4:2 r:2',
    hey: 'r:2 c#5:2 r:4 r:2 c#5:2 r:4',
    frenzy: 'f#4:2 r:2 c#5:2 r:2 f#4:2 r:2 c#5:2 a4:2',
  }[kind];
  for (let i = 0; i < n; i++) s.play('vox', bar + i, line);
}
/** A drop: impact, crash, and the shout. */
function slam(s: Score, bar: number) {
  s.note('impact', bar * 4, 60, 1);
  s.grid('crash', bar, 'x...............');
  s.play('vox', bar, 'f#5:4 r:12');
}
/** A roll into the next section, stopping for a beat of silence. */
function roll(s: Score, bar: number, gap = true) {
  s.grid('snare', bar, gap ? 'x.x.x.x.xxxx....' : 'x.x.x.x.xxxxXXXX');
}

// ─── Phase I: the two-minute theme, with the entrance build ─────────────────────────────────
export const unmaker = compose(
  {
    id: 'unmaker',
    title: 'UNMAKER (Montagem do Vazio)',
    mood: 'Final boss · phase I',
    bpm: UNMAKER_PHASES[0].bpm,
    bars: 70,
    loopBar: ENTRANCE_BARS,
    sidechain: { part: 'kick', depth: 0.3, release: 0.12 },
    parts: PARTS,
  },
  (s) => {
    // The build (0–3): the entrance. The hook opens up from a muffle; the drop is held back.
    s.play('bell', 0, HOOK.replace(/f#5:4$/, 'r:4'));
    s.automate('bell', 'cutoff', 0, 3.75, 350, 9000);
    s.note('swell', 0, 60, 8);
    s.grid('hat', 1, 'x.x.x.x.x.x.x.x.', 2, { vel: 0.5 });
    s.grid('clap', 2, '....x.......x...');
    s.bass('b808', 2, 'F#m', 'R:16', 30);
    s.note('riser', 8, 60, 7);
    roll(s, 3);
    s.play('vox', 3, 'r:8 c#5:2 r:6');

    // A (4–11): the drop.
    slam(s, 4);
    s.play('bell', 4, HOOK);
    s.play('bell', 8, HOOK);
    s.bass('b808', 4, `${PROG} ${PROG}`, 'R:3 R:3 R:4 5:2 R:4', 30);
    funk(s, 4, 8, 1);
    chops(s, 5, 7);

    // B (12–19): the hook an octave up, "hey!" stabs, the 808 walking down.
    s.grid('crash', 12, 'x...............');
    for (const b of [12, 16]) {
      s.play('bell', b, HOOK, { transpose: 12, vel: 0.8 });
      s.play('bell2', b, HOOK);
    }
    s.bass('b808', 12, 'F#m:2 E:2 D:2 C#:2', 'R:3 R:3 R:2 8:2 5:2 R:4', 30);
    funk(s, 12, 8, 2);
    chops(s, 12, 8, 'hey');

    // Half-time (20–23): muffled, the 808 alone with the bell, then the roll back in.
    s.play('bell', 20, HOOK, { vel: 0.9 });
    s.automate('bell', 'cutoff', 20, 3.75, 900, 9000);
    s.bass('b808', 20, PROG, 'R:8 R:8', 30);
    s.grid('kick', 20, 'x.......x.......', 3);
    s.grid('clap', 20, '........x.......', 3);
    s.grid('kick', 23, 'x.......x.x.x.xx');
    roll(s, 23, false);
    s.note('riser', 88, 60, 4);

    // A' (24–31): the hook with its counter-melody, the 808 busier.
    slam(s, 24);
    for (const b of [24, 28]) {
      s.play('bell', b, HOOK);
      s.play('bell2', b, COUNTER, { transpose: 12 });
    }
    s.bass('b808', 24, `${PROG} ${PROG}`, 'R:2 R:1 R:3 R:2 5:2 R:2 8:2 R:2', 30);
    funk(s, 24, 8, 2);
    chops(s, 25, 7);

    // C (32–39): the montagem hook, the shouts leading.
    slam(s, 32);
    s.play('bell', 32, HOOK_B);
    s.play('bell', 36, HOOK_B);
    s.bass('b808', 32, `${PROG_B} ${PROG_B}`, 'R:3 R:3 R:2 R:2 5:2 R:4', 30);
    funk(s, 32, 8, 2);
    chops(s, 32, 8, 'hey');

    // D (40–47): the montagem hook up high, the main hook beneath it.
    s.grid('crash', 40, 'x...............');
    for (const b of [40, 44]) {
      s.play('bell', b, HOOK_B, { transpose: 12, vel: 0.8 });
      s.play('bell2', b, HOOK);
    }
    s.bass('b808', 40, `${PROG} ${PROG_B}`, 'R:2 R:2 R:2 8:2 R:2 5:2 R:4', 30);
    funk(s, 40, 8, 3);
    chops(s, 41, 7);

    // Breakdown (48–51): the bell alone in the dark, and a long rise.
    s.play('bell', 48, HOOK, { vel: 0.8 });
    s.automate('bell', 'cutoff', 48, 3.75, 500, 9000);
    s.bass('b808', 48, PROG, 'R:16', 30);
    s.note('swell', 48 * 4, 60, 8);
    s.note('riser', 49 * 4, 60, 11);
    s.grid('clap', 50, '....x.......x...');
    roll(s, 51);

    // E (52–59): the drop again, harder.
    slam(s, 52);
    for (const b of [52, 56]) {
      s.play('bell', b, HOOK);
      s.play('bell2', b, HOOK_B);
    }
    s.bass('b808', 52, `${PROG} ${PROG}`, 'R:2 R:1 R:1 R:2 R:2 5:2 8:2 R:4', 30);
    funk(s, 52, 8, 3);
    s.grid('crash', 56, 'x...............');
    chops(s, 53, 7);

    // F (60–69): both hooks and the counter, then the roll back to A.
    s.grid('crash', 60, 'x...............');
    s.play('bell', 60, HOOK_B);
    s.play('bell', 64, HOOK);
    s.play('bell', 68, half(HOOK_B));
    s.play('bell2', 60, COUNTER, { transpose: 12 });
    s.play('bell2', 64, COUNTER, { transpose: 12 });
    s.bass('b808', 60, `${PROG_B} ${PROG} F#m C#`, 'R:3 R:3 R:2 8:2 5:2 R:4', 30);
    funk(s, 60, 9, 3);
    chops(s, 60, 9, 'hey');
    roll(s, 69, false);
  },
);

/**
 * The later phases' themes: each opens on a slam as the phase begins, then loops a harder
 * arrangement, faster at each phase.
 */
function phaseTheme(n: 1 | 2 | 3) {
  const ph = UNMAKER_PHASES[n],
    level = n + 1,
    bars = 33 + (n === 3 ? 2 : 0);
  return compose(
    {
      id: ph.music,
      title: `UNMAKER ${['', 'II', 'III', 'IV'][n]} (${['', 'Enxame', 'Desfazer', 'Colapso'][n]})`,
      mood: `Final boss · phase ${ph.name}`,
      bpm: ph.bpm,
      bars,
      loopBar: 1,
      sidechain: { part: 'kick', depth: 0.3 + n * 0.05, release: 0.12 },
      parts: {
        ...PARTS,
        b808: { inst: 'phonk808', vol: 0.9 + n * 0.05 },
        bell: { ...PARTS.bell, vol: 0.75 + n * 0.04 },
      },
    },
    (s) => {
      // The slam as the phase begins.
      slam(s, 0);
      s.play('vox', 0, 'r:8 c#5:2 r:2 c#5:2 r:2');
      s.bass('b808', 0, 'F#m', 'R:4 R:4 R:2 R:2 R:4', 30);
      funk(s, 0, 1, level);
      const hi = n >= 2 ? 12 : 0;
      // Four eight-bar sections: hook, montagem, hook with counter, both hooks at the top.
      for (const [i, bar] of [1, 9, 17, 25].entries()) {
        if (i) slam(s, bar);
        const main = i % 2 ? HOOK_B : HOOK,
          under = i === 3 ? (i % 2 ? HOOK : HOOK_B) : COUNTER;
        s.play('bell', bar, main, { transpose: hi });
        s.play('bell', bar + 4, main, { transpose: hi });
        if (n >= 2 || i >= 2) {
          s.play('bell2', bar, under, { transpose: under === COUNTER ? 12 : 0 });
          s.play('bell2', bar + 4, under, { transpose: under === COUNTER ? 12 : 0 });
        }
        const busy =
          n >= 3
            ? 'R:2 R:1 R:1 R:2 8:1 R:1 R:2 5:2 8:2 R:2'
            : n >= 2
              ? 'R:2 R:1 R:3 R:2 5:2 R:2 8:2 R:2'
              : 'R:3 R:3 R:2 8:2 5:2 R:4';
        s.bass('b808', bar, `${i % 2 ? PROG_B : PROG} ${PROG}`, busy, 30);
        funk(s, bar, 8, level);
        chops(s, bar, 8, n >= 3 ? 'frenzy' : i % 2 ? 'hey' : 'ah');
        if (n >= 2) s.grid('crash', bar + 4, 'x...............');
      }
      // The last phase runs on two more bars of pure noise before it loops.
      if (n === 3) {
        s.play(
          'bell',
          33,
          'f#6:1 f#6:1 f#6:1 f#6:1 a6:1 a6:1 a6:1 a6:1 c#7:1 c#7:1 c#7:1 c#7:1 f#7:4',
        );
        s.play('bell', 34, 'f#6:2 f#6:2 e6:2 e6:2 d6:2 d6:2 c#6:4');
        s.bass('b808', 33, 'F#m C#', 'R:1 R:1 R:1 R:1', 30);
        s.grid('kick', 33, 'xxxxxxxxxxxxxxxx', 2);
        chops(s, 33, 2, 'frenzy');
        roll(s, 34, false);
      } else roll(s, 32, false);
    },
  );
}
export const unmaker2 = phaseTheme(1),
  unmaker3 = phaseTheme(2),
  unmaker4 = phaseTheme(3);

// ─── The finale: a phonk turn on the title theme ────────────────────────────────────────────
/**
 * "Wildlands (Unmade)": while the Unmaker comes apart, the title's own intro plays (pads, the bell
 * arpeggio, the distant howl) in D minor at the title's tempo; then, on its burst, the title theme
 * drops as phonk: its melody on the cowbell, its hook over the tamborzão, and its last phrase,
 * slowed, to close the journey where it began.
 */
export const unmakerFinale = compose(
  {
    id: 'unmaker_finale',
    title: 'Wildlands (Unmade)',
    mood: 'The end of the Unmaker',
    bpm: FINALE_BPM,
    bars: FINALE_BARS,
    loopBar: FINALE_DROP_BARS,
    sidechain: { part: 'kick', depth: 0.35, release: 0.14 },
    parts: {
      ...PARTS,
      pad: { inst: 'pad', vol: 0.55, rev: 0.5 },
      choir: { inst: 'choir', vol: 0.5, rev: 0.6 },
      arp: { inst: 'bell', vol: 0.4, rev: 0.4, echo: 0.2 },
      howl: { inst: 'howl', vol: 0.5, rev: 0.8, echo: 0.35, pan: -0.3 },
      sub: { inst: 'sub', vol: 0.6 },
    },
  },
  (s) => {
    const intro = 'Dm Bb Gm',
      progA = 'Dm Bb F C Dm Bb Gm A',
      drop2 = 'Bb C Dm F Gm Bb C A';
    // The title's own intro, as the Unmaker comes apart (0–2); a beat of silence before the burst.
    s.pad('pad', 0, intro, 62);
    s.pad('choir', 0, intro, 57, { vel: 0.8 });
    s.arp('arp', 0, 'Dm Bb', '0 2 1 3 2 4 3 5', 74, 2, { vel: 0.8 });
    s.play('arp', 2, 'g5:2 bb5:2 d6:2 g6:2 d6:2 bb5:2 r:4');
    s.bass('sub', 0, intro, 'R:16', 33, { vel: 0.8 });
    s.play('howl', 0, 'r:4 a4:28 | r:16');
    s.note('riser', 4, 60, 7);
    roll(s, 2);

    // The burst: the title theme as phonk (3–10).
    const themeA =
      'd5:6 e5:2 f5:4 a5:4 | g5:6 f5:2 d5:8 | c5:6 d5:2 f5:4 c6:4 | g5:12 e5:4 | ' +
      'd5:6 e5:2 f5:4 a5:4 | bb5:6 a5:2 g5:4 f5:4 | g5:6 f5:2 e5:4 d5:4 | c#5:8 e5:4 a5:4';
    // Chopped for the cowbell: every long note restruck on the off-beats.
    const chopped = themeA.replace(/([a-g]#?b?\d):(6|8|12)/g, (_m, n: string, len: string) =>
      Array.from({ length: Number(len) / 2 }, (_, i) => `${i % 2 ? '_' : ''}${n}:2`).join(' '),
    );
    slam(s, 3);
    s.play('bell', 3, chopped, { transpose: 12 });
    s.play('bell2', 3, themeA, { transpose: 12 });
    s.bass('b808', 3, progA, 'R:3 R:3 R:4 5:2 R:4', 26);
    funk(s, 3, 8, 2);
    chops(s, 4, 7);

    // The title's hook over the tamborzão (11–18).
    const hook1 =
      '>a5:3 a5:3 a5:2 g5:2 a5:2 c6:2 d6:2 | d6:3 c6:3 bb5:2 g5:4 f5:4 | ' +
      '>c6:3 c6:3 c6:2 a5:2 c6:2 f6:2 e6:2 | e6:6 d6:2 c6:4 g5:4 | ' +
      '>a5:3 a5:3 a5:2 g5:2 a5:2 c6:2 d6:2 | d6:3 c6:3 bb5:2 a5:2 bb5:2 c6:2 d6:2 | ' +
      '>f6:6 e6:2 d6:2 c6:2 a5:4 | c6:4 d6:4 e6:8';
    slam(s, 11);
    s.play('bell', 11, hook1);
    s.pad('choir', 11, 'Dm Bb F C Dm Bb F C', 64, { vel: 0.6 });
    s.bass('b808', 11, 'Dm Bb F C Dm Bb F C', 'R:2 R:1 R:3 R:2 5:2 R:2 8:2 R:2', 26);
    funk(s, 11, 8, 3);
    chops(s, 11, 8, 'hey');

    // Its second hook, both cowbells, everything (19–26).
    const hook2 =
      '>bb5:3 d6:3 f6:2 f6:4 d6:4 | >c6:3 e6:3 g6:2 g6:4 e6:4 | ' +
      '>f6:3 e6:3 d6:2 d6:4 a5:4 | c6:3 d6:3 f6:2 >a6:8 | ' +
      '>g6:6 f6:2 d6:4 bb5:4 | f6:6 d6:2 bb5:4 d6:4 | e6:6 d6:2 c6:4 e6:4 | >e6:8 c#6:4 a5:4';
    slam(s, 19);
    s.play('bell', 19, hook2);
    s.play('bell2', 19, hook1, { transpose: 12 });
    s.pad('pad', 19, drop2, 60);
    s.bass('b808', 19, drop2, 'R:2 R:1 R:1 R:2 R:2 5:2 8:2 R:4', 26);
    funk(s, 19, 8, 3);
    chops(s, 20, 7);

    // The last phrase, slowed and spacious, and the title's first chord to close (27–31).
    s.play('bell', 27, 'd5:8 e5:4 f5:4 | a5:8 g5:8 | f5:8 d5:8 | c#5:8 e5:4 a5:4');
    s.pad('pad', 27, 'Dm Bb Gm A', 60);
    s.pad('choir', 27, 'Dm Bb Gm A', 57, { vel: 0.9 });
    s.bass('b808', 27, 'Dm Bb Gm A', 'R:8 R:8', 26);
    s.grid('kick', 27, 'x.......x.......', 4);
    s.grid('clap', 27, '........x.......', 4);
    s.play('howl', 29, 'r:4 d5:12 | r:16');
    s.pad('pad', 31, 'Dm', 62);
    s.at('b808', 31, 'd2', 4);
    s.note('impact', 31 * 4, 60, 1);
  },
);
