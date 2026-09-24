import { compose } from '../score.ts';

// Daytime in the temperate lands: a bright, walking-pace adventure tune. Flute over nylon guitar,
// strings take the second strain, a chiptune pulse and glockenspiel restate the theme, then a
// lyrical bridge turns back home.
export const meadow = compose(
  {
    id: 'meadow',
    title: 'First Light on the Meadow',
    mood: 'Surface · day',
    bpm: 124,
    bars: 32,
    parts: {
      kick: { inst: 'kick', vol: 0.9 },
      snare: { inst: 'snare', vol: 0.45, rev: 0.2 },
      rim: { inst: 'rim', vol: 0.5, rev: 0.15 },
      shaker: { inst: 'shaker', vol: 0.55, pan: 0.3 },
      tamb: { inst: 'tamb', vol: 0.45, pan: -0.3 },
      crash: { inst: 'crash', vol: 0.5, rev: 0.2 },
      tom: { inst: 'tom', vol: 0.6, rev: 0.2 },
      bass: { inst: 'bass', vol: 0.85 },
      guitar: { inst: 'pluck', vol: 0.75, pan: -0.25, rev: 0.2 },
      harp: { inst: 'harp', vol: 0.7, pan: 0.25, rev: 0.35 },
      pad: { inst: 'pad', vol: 0.55, rev: 0.4 },
      flute: { inst: 'flute', vol: 1, rev: 0.35, echo: 0.12 },
      strings: { inst: 'strings', vol: 0.9, rev: 0.4 },
      pulse: { inst: 'pulse', vol: 0.55, rev: 0.25, echo: 0.2 },
      glock: { inst: 'bell', vol: 0.45, rev: 0.35, pan: 0.2 },
    },
  },
  (s) => {
    const progA = 'G D/F# Em C G D C D',
      progB = 'Em C G D Em C Am D',
      progC = 'C D Bm Em C D Am7 D';
    const themeA =
      'd5:4 g5:4 a5:2 b5:6 | a5:4 f#5:4 d5:8 | e5:4 g5:2 a5:2 b5:4 e6:4 | d6:6 c6:2 a5:4 g5:4 | ' +
      'd5:4 g5:4 a5:2 b5:6 | c6:4 b5:2 a5:2 f#5:8 | e5:4 g5:4 c6:4 e6:4 | d6:12 r:4';

    // A (0–7)
    s.play('flute', 0, themeA);
    s.arp('guitar', 0, progA, '0 2 1 2 3 2 1 2', 55, 2);
    s.bass('bass', 0, progA, 'R:4 5:4 8:4 5:4', 36);
    s.pad('pad', 0, progA, 60, { vel: 0.8 });
    s.grid('kick', 0, 'x.......x.......', 8);
    s.grid('rim', 0, '....x.......x...', 8);
    s.grid('shaker', 0, 'x.o.x.o.x.o.x.o.', 8);

    // B (8–15)
    s.play(
      'strings',
      8,
      'b4:6 e5:2 g5:8 | a5:6 g5:2 e5:8 | d5:6 g5:2 b5:8 | a5:6 f#5:2 d5:8 | ' +
        'b5:6 e6:2 d6:4 b5:4 | c6:6 b5:2 a5:4 g5:4 | e5:4 a5:4 c6:4 b5:4 | a5:6 b5:2 c6:4 d6:4',
    );
    s.play(
      'flute',
      8,
      'r:16 | r:16 | r:16 | r:8 a5:4 d6:4 | e6:16 | e6:8 c6:8 | c6:8 e6:8 | f#6:8 r:8',
      { vel: 0.6 },
    );
    s.hits('guitar', 8, progB, 'x.x.xx.x.xx.x.x.', 57, { vel: 0.8 });
    s.bass('bass', 8, progB, 'R:6 R:2 5:4 8:4', 36);
    s.pad('pad', 8, progB, 62);
    s.grid('kick', 8, 'x.....x.x.......', 8);
    s.grid('snare', 8, '....x.......x...', 7);
    s.grid('snare', 15, '....x.......x.xx');
    s.grid('tamb', 8, '..x...x...x...x.', 8);
    s.grid('shaker', 8, 'x.o.x.o.x.o.x.o.', 8);

    // A' (16–23): the theme on a pulse lead with glockenspiel
    s.grid('crash', 16, 'x...............');
    s.play('pulse', 16, themeA);
    s.play('glock', 16, themeA, { vel: 0.7 });
    s.play('flute', 16, 'r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | g5:8 c6:8 | b5:12 r:4', {
      vel: 0.6,
    });
    s.arp('guitar', 16, progA, '0 2 1 2 3 2 1 2', 55, 2);
    s.arp('harp', 16, progA, '0 1 2 3 4 5 4 3', 67, 2, { vel: 0.6 });
    s.bass('bass', 16, progA, 'R:4 5:4 8:4 5:4', 36);
    s.pad('pad', 16, progA, 62);
    s.grid('kick', 16, 'x.......x.x.....', 8);
    s.grid('snare', 16, '....x.......x...', 8);
    s.grid('tamb', 16, '..x...x...x...x.', 8);
    s.grid('shaker', 16, 'xoxoxoxoxoxoxoxo', 8);

    // C (24–31): the bridge
    s.play(
      'flute',
      24,
      'g5:6 e5:2 c5:8 | a5:6 f#5:2 d5:8 | b5:6 a5:2 f#5:4 d5:4 | g5:8 e5:8 | ' +
        'e6:6 d6:2 c6:8 | f#6:6 e6:2 d6:8 | c6:4 b5:4 a5:4 g5:4 | f#5:8 a5:4 d6:4',
    );
    s.play('strings', 24, 'e5:16 | f#5:16 | f#5:16 | e5:16 | g5:16 | a5:16 | e5:16 | d5:16', {
      vel: 0.55,
    });
    s.arp('harp', 24, progC, '0 1 2 3 2 1 2 3', 55, 2);
    s.bass('bass', 24, progC, 'R:8 5:8', 36);
    s.pad('pad', 24, progC, 60, { vel: 0.9 });
    s.grid('kick', 24, 'x.........x.....', 7);
    s.grid('rim', 24, '........x.......', 7);
    s.grid('shaker', 24, 'x.o.x.o.x.o.x.o.', 8);
    s.grid('tom', 31, '........x.x.xxxx', 1, { midi: 50 });
  },
);
