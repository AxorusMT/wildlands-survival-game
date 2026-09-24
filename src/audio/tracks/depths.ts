import { compose } from '../score.ts';

// The lower cave layers: vast and ominous in Bb minor. Crystal bells ring out over a choir and
// a sub drone, a heartbeat kick, tremolo low strings, and reversed swells pulling you deeper.
export const depths = compose(
  {
    id: 'depths',
    title: 'Crystal Dark',
    mood: 'Deep caves',
    bpm: 80,
    bars: 20,
    parts: {
      heart: { inst: 'kick', vol: 0.8 },
      taiko: { inst: 'taiko', vol: 0.7, rev: 0.6 },
      swell: { inst: 'swell', vol: 0.4, rev: 0.5 },
      drip: { inst: 'drip', vol: 0.4, rev: 0.7, echo: 0.4, pan: -0.4 },
      sub: { inst: 'sub', vol: 0.9 },
      pad: { inst: 'pad', vol: 0.8, rev: 0.6, cutoff: 1200 },
      trem: { inst: 'tremolo', vol: 0.55, rev: 0.5, cutoff: 1800 },
      choir: { inst: 'choir', vol: 0.9, rev: 0.7 },
      crystal: { inst: 'crystal', vol: 1, rev: 0.6, echo: 0.35 },
      glint: { inst: 'crystal', vol: 0.45, rev: 0.6, echo: 0.4, pan: 0.4 },
    },
    echoBeats: 1.5,
    echoFeedback: 0.42,
  },
  (s) => {
    const progA = 'Bbm Gb Ebm F Bbm Gb Db F',
      progB = 'Gb Ab Bbm Bbm Gb Ab F F',
      progC = 'Bbm Gb Ebm F';
    const themeA =
      'f5:8 db5:4 bb4:4 | bb5:8 gb5:8 | eb5:6 gb5:2 bb5:8 | a5:8 c6:4 f5:4 | ' +
      'db6:8 c6:4 bb5:4 | bb5:6 ab5:2 gb5:8 | f5:6 ab5:2 db6:8 | c6:8 a5:8';
    const beat = (bar: number, bars: number) => {
      s.grid('heart', bar, 'x..x............', bars);
      s.grid('taiko', bar + 3, 'x.......x.......', 1);
    };

    // A (0–7)
    s.play('crystal', 0, themeA);
    s.pad('pad', 0, progA, 58);
    s.bass('sub', 0, progA, 'R:16', 34);
    beat(0, 8);
    s.grid('taiko', 7, 'x.......x...x.x.');

    // B (8–15)
    s.play(
      'choir',
      8,
      'db5:16 | eb5:16 | f5:8 db5:8 | bb4:16 | gb5:8 f5:8 | ab5:8 eb5:8 | a5:16 | c6:8 a5:8',
    );
    s.pad('trem', 8, progB, 50);
    s.pad('pad', 8, progB, 60);
    s.arp('glint', 8, progB, '4 r 3 r 5 r 2 r', 70, 2);
    s.bass('sub', 8, progB, 'R:16', 34);
    beat(8, 8);
    s.note('swell', 28, 60, 4);
    s.note('swell', 60, 60, 4);

    // C (16–19)
    s.play('crystal', 16, 'f5:8 db5:4 bb4:4 | bb5:8 gb5:8 | eb5:6 gb5:2 bb5:8 | a5:8 c6:4 f5:4');
    s.pad('choir', 16, progC, 58, { vel: 0.6 });
    s.pad('pad', 16, progC, 58);
    s.bass('sub', 16, progC, 'R:16', 34);
    beat(16, 4);
    s.note('swell', 76, 60, 4);

    for (const [bar, note] of [
      [1.5, 'f6'],
      [4.25, 'bb6'],
      [6.6, 'db7'],
      [10.3, 'f6'],
      [13.7, 'ab6'],
      [17.4, 'bb6'],
    ] as const)
      s.at('drip', bar, note);
  },
);
