import { compose } from '../score.ts';

// The Hollow Warren: C minor underground. Marimba ticking like claws in the dark, a sub bass you
// feel more than hear, dripping water, and a music box glinting like amber in the middle.
export const warren = compose(
  {
    id: 'warren',
    title: 'Under the Amber',
    mood: 'The Hollow Warren',
    bpm: 96,
    bars: 24,
    parts: {
      kick: { inst: 'kick', vol: 0.6 },
      rim: { inst: 'rim', vol: 0.4, rev: 0.4 },
      shaker: { inst: 'shaker', vol: 0.3, pan: 0.3 },
      drip: { inst: 'drip', vol: 0.4, rev: 0.7, echo: 0.4, pan: 0.4 },
      sub: { inst: 'sub', vol: 0.7 },
      marimba: { inst: 'marimba', vol: 0.75, rev: 0.35, pan: -0.15 },
      pizz: { inst: 'pizz', vol: 0.55, rev: 0.4, pan: 0.2 },
      musicbox: { inst: 'musicbox', vol: 0.55, rev: 0.6, echo: 0.3 },
      choir: { inst: 'choir', vol: 0.45, rev: 0.7 },
      pad: { inst: 'pad', vol: 0.5, rev: 0.6, cutoff: 1800 },
    },
    echoBeats: 0.75,
    echoFeedback: 0.4,
  },
  (s) => {
    const progA = 'Cm Ab Fm G Cm Ab Bb G',
      progB = 'Ab Bb Cm Cm Ab Bb G G';
    const claws =
      'c5:2 eb5:2 g5:2 eb5:2 c5:4 g4:4 | ab4:4 c5:4 eb5:8 | f5:2 ab5:2 f5:2 c5:2 f5:8 | d5:4 g5:4 b4:8 | ' +
      'c5:2 eb5:2 g5:2 c6:2 bb5:4 g5:4 | ab5:4 g5:4 eb5:8 | bb4:4 d5:4 f5:4 d5:4 | g4:16';
    const dark = (bar: number, prog: string) => {
      const n = s.progression(bar, prog).length;
      s.bass('sub', bar, prog, 'R:8 R:4 5:4', 30);
      s.pad('pad', bar, prog, 55, { vel: 0.6 });
      s.grid('kick', bar, 'x......x..x.....', n);
      s.grid('rim', bar, '....x.......x..x', n, { vel: 0.7 });
      s.grid('shaker', bar, '..o...o...o...o.', n);
      for (let i = 0; i < n; i += 2) s.at('drip', bar + i + 0.4, i % 4 ? 'g6' : 'c7', 0.25, 0.7);
    };
    s.play('marimba', 0, claws);
    s.play('pizz', 0, claws, { transpose: -12, vel: 0.5 });
    dark(0, progA);
    s.play(
      'musicbox',
      8,
      'eb6:8 d6:8 | c6:12 r:4 | ab5:8 bb5:8 | g5:16 | eb6:8 f6:8 | g6:8 f6:4 eb6:4 | d6:16 | b5:16',
    );
    s.pad('choir', 8, progB, 60, { vel: 0.7 });
    dark(8, progB);
    s.play('marimba', 16, claws);
    s.play('musicbox', 16, claws, { transpose: 12, vel: 0.4 });
    dark(16, progA);
  },
);
