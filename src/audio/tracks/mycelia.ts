import { compose } from '../score.ts';

// The Mycelial Deep: E Lydian, bright and strange. Marimba and harp ripple like light through
// spores, a crystal lead drifts on top, a music box answers from somewhere in the fungus, and a
// soft pulse of sub bass is the cavern breathing.
export const mycelia = compose(
  {
    id: 'mycelia',
    title: 'Spore Light',
    mood: 'The Mycelial Deep',
    bpm: 88,
    bars: 22,
    parts: {
      crystal: { inst: 'crystal', vol: 0.8, rev: 0.6, echo: 0.35 },
      box: { inst: 'musicbox', vol: 0.55, rev: 0.6, echo: 0.3, pan: 0.3 },
      marimba: { inst: 'marimba', vol: 0.6, rev: 0.4, pan: -0.2 },
      harp: { inst: 'harp', vol: 0.5, rev: 0.55, pan: 0.25 },
      pad: { inst: 'pad', vol: 0.55, rev: 0.7, cutoff: 1800 },
      sub: { inst: 'sub', vol: 0.8 },
      kick: { inst: 'kick', vol: 0.45 },
      shaker: { inst: 'shaker', vol: 0.25, pan: 0.3 },
      chirp: { inst: 'chirp', vol: 0.3, rev: 0.6, echo: 0.4 },
      drip: { inst: 'drip', vol: 0.4, rev: 0.8, echo: 0.4 },
    },
    echoBeats: 0.75,
    echoFeedback: 0.45,
  },
  (s) => {
    const progA = 'Emaj7 F#/E Emaj7 F#/E C#m7 G#m7 Amaj7 B',
      progC = 'Emaj7:2 F#/E:2 Amaj7:2';
    const theme =
      'b5:4 d#6:4 f#6:4 a#5:4 | b5:8 g#5:4 f#5:4 | e5:4 g#5:4 b5:4 d#6:4 | c#6:12 a#5:4 | ' +
      'g#5:4 b5:4 c#6:4 e6:4 | d#6:8 b5:8 | a5:4 c#6:4 e6:4 g#6:4 | f#6:16';

    // A (0–7): the spores light up one by one.
    s.arp('marimba', 0, progA, '0 2 1 3 2 4 3 2', 52, 2);
    s.pad('pad', 0, progA, 62, { vel: 0.8 });
    s.bass('sub', 0, progA, 'R:8 R:8', 28);
    s.play('crystal', 0, theme);
    for (const [bar, note] of [
      [0.25, 'b6'],
      [1.5, 'f#7'],
      [3.2, 'd#7'],
      [5.6, 'g#6'],
      [6.8, 'c#7'],
    ] as const)
      s.at('chirp', bar, note);

    // B (8–15): the music box answers, a soft pulse joins.
    s.play('box', 8, theme, { transpose: 12, vel: 0.7 });
    s.play(
      'crystal',
      8,
      'e6:16 | d#6:16 | c#6:8 b5:8 | a#5:16 | g#5:8 b5:8 | c#6:16 | e6:8 c#6:8 | b5:16',
    );
    s.arp('harp', 8, progA, '0 1 2 3 4 3 2 1', 52, 2);
    s.pad('pad', 8, progA, 62, { vel: 0.7 });
    s.bass('sub', 8, progA, 'R:4 r:4 R:4 5:4', 28);
    s.grid('kick', 8, 'x.......x.......', 8, { vel: 0.8 });
    s.grid('shaker', 8, '..x...x...x...x.', 8);

    // C (16–21): drifting back into the dark.
    s.pad('pad', 16, progC, 64);
    s.bass('sub', 16, progC, 'R:16', 28, { vel: 0.8 });
    s.arp('marimba', 16, progC, '0 r 2 r 1 r 3 r', 52, 2, { vel: 0.7 });
    s.play(
      'crystal',
      16,
      'b5:4 d#6:4 f#6:8 | a#5:16 | g#5:4 b5:4 e6:8 | d#6:16 | c#6:8 e6:8 | f#6:16',
    );
    for (const [bar, note] of [
      [16.5, 'e7'],
      [17.7, 'b6'],
      [19.1, 'g#6'],
      [20.4, 'f#7'],
    ] as const)
      s.at('drip', bar, note);
  },
);
