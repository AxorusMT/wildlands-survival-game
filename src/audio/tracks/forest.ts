import { compose } from '../score.ts';

// Deep woods: a 12/8 lilt in E minor. Wooden flute over triplet harp and pizzicato bass, hand
// drums, bells glinting through the canopy, and strings for the second strain.
export const forest = compose(
  {
    id: 'forest',
    title: 'Under the Canopy',
    mood: 'Forest · day',
    bpm: 76,
    stepsPerBeat: 3,
    bars: 22,
    loopBar: 2,
    parts: {
      kick: { inst: 'kick', vol: 0.75 },
      hand: { inst: 'tom', vol: 0.45, rev: 0.25, pan: 0.2 },
      shaker: { inst: 'shaker', vol: 0.45, pan: -0.3 },
      bass: { inst: 'pizz', vol: 0.9 },
      harp: { inst: 'harp', vol: 0.75, rev: 0.4, pan: -0.15 },
      pad: { inst: 'pad', vol: 0.6, rev: 0.5 },
      flute: { inst: 'flute', vol: 1, rev: 0.45, echo: 0.15 },
      strings: { inst: 'strings', vol: 0.85, rev: 0.45 },
      bell: { inst: 'bell', vol: 0.35, rev: 0.5, echo: 0.35, pan: 0.3 },
    },
    echoBeats: 1 / 3,
  },
  (s) => {
    const progA = 'Em C G D Em C Am B',
      progB = 'Cmaj7 D G Em Am C D B7',
      progC = 'Em C Am B';
    const grove = (bar: number, prog: string, busy: boolean) => {
      s.arp('harp', bar, prog, '0 1 2 3 2 1', 52, 1);
      s.bass('bass', bar, prog, 'R:3 r:3 5:3 r:3', 40);
      s.pad('pad', bar, prog, 59, { vel: 0.8 });
      const bars = s.progression(bar, prog).length;
      s.grid('kick', bar, 'x.....x.....', bars);
      s.grid('shaker', bar, busy ? 'x.ox.ox.ox.o' : 'x.....x.....', bars);
      if (busy) s.grid('hand', bar, '...x.o...x.x', bars, { midi: 62 });
    };

    // Intro (0–1)
    s.arp('harp', 0, 'Em Em', '0 1 2 3 4 5', 52, 1, { vel: 0.8 });
    s.pad('pad', 0, 'Em:2', 59, { vel: 0.7 });
    s.play('bell', 0, 'e6:3 b5:3 g6:6 | f#6:3 e6:3 b5:6');

    // A (2–9)
    const themeA =
      'b4:3 e5:2 f#5:1 g5:3 b5:3 | a5:4 g5:2 e5:6 | d5:3 g5:2 a5:1 b5:3 d6:3 | c6:4 b5:2 a5:6 | ' +
      'b5:3 g5:2 e5:1 f#5:3 g5:3 | e5:3 g5:3 c6:3 g5:3 | a5:4 g5:2 e5:3 c5:3 | d#5:6 f#5:3 b5:3';
    s.play('flute', 2, themeA);
    grove(2, progA, false);
    s.play('bell', 5, 'r:6 f#6:6', { vel: 0.7 });
    s.play('bell', 9, 'r:6 b6:6', { vel: 0.7 });

    // B (10–17)
    s.play(
      'strings',
      10,
      'e5:6 g5:6 | f#5:6 a5:6 | b5:4 a5:2 g5:6 | g5:4 f#5:2 e5:6 | ' +
        'c6:6 b5:3 a5:3 | g5:6 a5:3 b5:3 | c6:4 b5:2 a5:3 f#5:3 | d#5:4 e5:2 f#5:3 a5:3',
    );
    s.play('flute', 10, 'r:12 | r:12 | d6:12 | b5:12 | e6:12 | e6:12 | a5:6 d6:6 | b5:12', {
      vel: 0.55,
    });
    grove(10, progB, true);

    // C (18–21): the theme returns and turns back
    s.play(
      'flute',
      18,
      'b4:3 e5:2 f#5:1 g5:3 b5:3 | a5:4 g5:2 e5:6 | a5:4 g5:2 e5:3 c5:3 | d#5:6 f#5:3 b5:3',
    );
    s.play('bell', 18, 'b5:12 | e6:12 | c6:12 | b5:12', { vel: 0.5 });
    grove(18, progC, true);
  },
);
