import { compose } from '../score.ts';

// The first cave layer: a sneaky, bouncing groove in F# minor. Plucked bass that never sits
// still, a square lead doubled by glockenspiel, echoes off the rock, and water dripping in the
// dark during the quiet third section.
export const cave = compose(
  {
    id: 'cave',
    title: 'Lantern Glow',
    mood: 'Caves',
    bpm: 96,
    bars: 24,
    parts: {
      kick: { inst: 'kick', vol: 0.85 },
      rim: { inst: 'rim', vol: 0.5, rev: 0.35 },
      hat: { inst: 'hat', vol: 0.4, pan: 0.3, echo: 0.2 },
      bass: { inst: 'bass', vol: 1, echo: 0.1 },
      pad: { inst: 'pad', vol: 0.55, rev: 0.6, cutoff: 1500 },
      lead: { inst: 'square', vol: 0.8, rev: 0.4, echo: 0.3 },
      glock: { inst: 'bell', vol: 0.45, rev: 0.45, echo: 0.3, pan: 0.2 },
      pizz: { inst: 'pizz', vol: 0.6, rev: 0.3, echo: 0.25, pan: -0.3 },
      drip: { inst: 'drip', vol: 0.5, rev: 0.7, echo: 0.4 },
    },
    echoBeats: 0.75,
    echoFeedback: 0.4,
  },
  (s) => {
    const progA = 'F#m F#m D E F#m F#m Bm C#',
      progB = 'D E C#m F#m D E C# C#';
    const groove = 'R:2 r:1 R:1 8:2 R:2 5:2 8:2 5:2 R:2';
    const themeA =
      'c#5:3 f#5:3 a5:2 g#5:4 f#5:4 | e5:3 f#5:3 e5:2 c#5:8 | d5:3 f#5:3 a5:2 b5:4 a5:4 | ' +
      'g#5:6 e5:2 b4:8 | c#6:3 b5:3 a5:2 g#5:4 f#5:4 | a5:3 g#5:3 f#5:2 c#5:8 | ' +
      'd5:4 f#5:4 b5:4 a5:4 | g#5:8 e#5:4 c#5:4';

    // A (0–7)
    s.play('lead', 0, themeA);
    s.play('glock', 0, themeA, { transpose: 12, vel: 0.45 });
    s.bass('bass', 0, progA, groove, 30);
    s.pad('pad', 0, progA, 61, { vel: 0.8 });
    s.grid('kick', 0, 'x......x..x.....', 8);
    s.grid('rim', 0, '....x.......x...', 8);
    s.grid('hat', 0, 'x.x.x.x.x.x.x.x.', 8, { vel: 0.8 });

    // B (8–15)
    s.play(
      'lead',
      8,
      'f#5:6 e5:2 d5:4 a4:4 | g#5:6 f#5:2 e5:4 b4:4 | e5:4 g#5:4 c#6:4 b5:4 | a5:8 f#5:8 | ' +
        'a5:6 b5:2 a5:4 d6:4 | e6:6 d6:2 b5:8 | c#6:4 b5:2 g#5:2 e#5:8 | g#5:8 r:8',
    );
    s.arp('pizz', 8, progB, '0 1 2 3 2 1 2 1', 61, 2);
    s.bass('bass', 8, progB, groove, 30);
    s.pad('pad', 8, progB, 61);
    s.grid('kick', 8, 'x......x..x.....', 7);
    s.grid('kick', 15, 'x......x..x.x.x.');
    s.grid('rim', 8, '....x.......x...', 8);
    s.grid('hat', 8, 'x.xxx.xxx.xxx.xx', 8, { vel: 0.8 });

    // C (16–23): drips and echoes, the theme on glockenspiel alone
    s.play('glock', 16, themeA);
    s.bass('bass', 16, progA, 'R:6 r:2 5:4 8:4', 30, { vel: 0.8 });
    s.pad('pad', 16, progA, 61, { vel: 0.9 });
    s.grid('rim', 16, '............x...', 8);
    s.grid('kick', 20, 'x.........x.....', 4);
    const drips = [
      [16, 'c#7'],
      [16.75, 'a6'],
      [17.6, 'f#6'],
      [18.4, 'e7'],
      [19.1, 'b6'],
      [19.8, 'c#7'],
      [20.5, 'g#6'],
      [21.3, 'f#7'],
      [22.2, 'a6'],
      [23.1, 'c#7'],
    ] as const;
    for (const [bar, note] of drips) s.at('drip', bar, note);
  },
);
