import { compose } from '../score.ts';

// Tundra, taiga, and alpine heights: music box and glockenspiel over glassy harp, strings that
// ache a little, sleigh bells for the second strain, and wind gusting through everything.
export const cold = compose(
  {
    id: 'cold',
    title: 'Hoarfrost',
    mood: 'Tundra · taiga · alpine',
    bpm: 84,
    bars: 22,
    loopBar: 2,
    parts: {
      kick: { inst: 'kick', vol: 0.6 },
      rim: { inst: 'rim', vol: 0.35, rev: 0.4 },
      sleigh: { inst: 'tamb', vol: 0.4, pan: 0.3, rev: 0.2 },
      timp: { inst: 'timpani', vol: 0.6, rev: 0.5 },
      wind: { inst: 'wind', vol: 0.55, rev: 0.3 },
      sub: { inst: 'sub', vol: 0.8 },
      harp: { inst: 'harp', vol: 0.7, rev: 0.5, pan: -0.2 },
      pad: { inst: 'pad', vol: 0.75, rev: 0.55 },
      box: { inst: 'musicbox', vol: 0.9, rev: 0.45, echo: 0.25 },
      glock: { inst: 'bell', vol: 0.45, rev: 0.5, echo: 0.2, pan: 0.25 },
      strings: { inst: 'strings', vol: 0.85, rev: 0.5 },
    },
  },
  (s) => {
    const progA = 'Bm G D A Bm G Em F#',
      progB = 'G A F#m Bm Em A D F#',
      progA2 = 'Bm G Em F#';
    const bed = (bar: number, prog: string) => {
      s.arp('harp', bar, prog, '0 1 2 3 4 3 2 1', 59, 2);
      s.pad('pad', bar, prog, 62, { vel: 0.8 });
      s.bass('sub', bar, prog, 'R:16', 35);
    };

    // Intro (0–1)
    s.arp('harp', 0, 'Bm Bm', '0 1 2 3 4 5 4 3', 59, 2, { vel: 0.8 });
    s.pad('pad', 0, 'Bm:2', 62, { vel: 0.6 });
    s.note('wind', 0, 67, 6, 0.9);

    // A (2–9)
    const theme =
      'f#5:4 b5:4 c#6:2 d6:6 | d6:4 b5:4 g5:8 | a5:4 d6:4 e6:2 f#6:6 | e6:6 c#6:2 a5:8 | ' +
      'f#5:4 b5:4 c#6:2 d6:6 | e6:4 d6:4 b5:4 g5:4 | g5:4 b5:4 e6:4 d6:4 | c#6:8 a#5:4 f#5:4';
    s.play('box', 2, theme);
    bed(2, progA);
    s.grid('kick', 2, 'x.........x.....', 8, { vel: 0.8 });
    s.grid('rim', 2, '........x.......', 8);

    // B (10–17)
    const themeB =
      'd6:6 c#6:2 b5:8 | c#6:6 b5:2 a5:8 | a5:6 f#5:2 c#6:8 | d6:6 c#6:2 b5:8 | ' +
      'e6:6 d6:2 b5:4 g5:4 | a5:6 b5:2 c#6:4 e6:4 | f#6:8 e6:4 d6:4 | c#6:8 a#5:8';
    s.play('strings', 10, themeB, { transpose: -12 });
    s.play('glock', 10, themeB);
    bed(10, progB);
    s.grid('kick', 10, 'x.........x.....', 8);
    s.grid('rim', 10, '....x.......x...', 8);
    s.grid('sleigh', 10, 'x.o.x.o.x.o.x.o.', 8);
    s.bass('timp', 10, progB, 'R:16', 35);

    // A2 (18–21)
    s.play(
      'box',
      18,
      'f#5:4 b5:4 c#6:2 d6:6 | d6:4 b5:4 g5:8 | g5:4 b5:4 e6:4 d6:4 | c#6:8 a#5:4 f#5:4',
    );
    s.play('strings', 18, 'd5:16 | b4:16 | b4:16 | a#4:16', { vel: 0.6 });
    bed(18, progA2);
    s.grid('kick', 18, 'x.........x.....', 4, { vel: 0.8 });
    s.grid('sleigh', 18, 'x...x...x...x...', 4);

    for (const bar of [5, 9, 13, 17, 21]) s.note('wind', bar * 4, 62 + (bar % 3) * 4, 5, 0.7);
  },
);
