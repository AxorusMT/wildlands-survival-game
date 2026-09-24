import { compose } from '../score.ts';

// The marsh: a swung, murky groove in G minor. A clarinet-ish reed slinks over walking bass
// and a marimba riff, bongos and rimshots keep it bouncing, and a dark pad hangs like mist.
export const marsh = compose(
  {
    id: 'marsh',
    title: 'Mire Shuffle',
    mood: 'Marsh',
    bpm: 96,
    bars: 24,
    swing: { unit: 0.5, amount: 0.3 },
    parts: {
      kick: { inst: 'kick', vol: 0.85 },
      rim: { inst: 'rim', vol: 0.55, rev: 0.2 },
      bongo: { inst: 'tom', vol: 0.4, pan: 0.3, rev: 0.15 },
      conga: { inst: 'tom', vol: 0.45, pan: -0.3, rev: 0.15 },
      shaker: { inst: 'shaker', vol: 0.5, pan: 0.2 },
      bass: { inst: 'bass', vol: 0.9 },
      marimba: { inst: 'marimba', vol: 0.75, rev: 0.25, pan: -0.2 },
      pad: { inst: 'pad', vol: 0.6, rev: 0.5, cutoff: 1100 },
      reed: { inst: 'reed', vol: 1, rev: 0.35, echo: 0.12 },
      lead: { inst: 'marimba', vol: 0.9, rev: 0.3, echo: 0.15, pan: 0.15 },
      drip: { inst: 'drip', vol: 0.4, rev: 0.6, echo: 0.3, pan: 0.4 },
    },
  },
  (s) => {
    const progA = 'Gm Gm Eb D Gm Gm Cm D',
      progB = 'Eb F Dm Gm Eb F D D';
    const themeA =
      'g4:2 bb4:2 d5:2 c5:2 bb4:4 g4:4 | a4:2 bb4:2 a4:2 f#4:2 g4:8 | ' +
      'g4:2 bb4:2 eb5:2 d5:2 bb4:4 g4:4 | f#4:4 a4:4 c5:4 d5:4 | ' +
      'd5:2 bb4:2 g4:2 bb4:2 d5:4 f5:4 | e5:2 f5:2 e5:2 d5:2 bb4:4 g4:4 | ' +
      'c5:2 eb5:2 g5:2 f5:2 eb5:4 c5:4 | d5:4 c5:2 a4:2 f#4:4 d4:4';
    const groove = (bar: number, prog: string, full: boolean) => {
      const bars = s.progression(bar, prog).length;
      s.bass('bass', bar, prog, 'R:4 3:4 5:4 3:4', 31);
      s.arp('marimba', bar, prog, '0 2 1 2 3 2 1 2', 55, 2, { vel: full ? 0.8 : 0.65 });
      s.pad('pad', bar, prog, 58, { vel: 0.8 });
      s.grid('kick', bar, 'x.....x...x.....', bars);
      s.grid('rim', bar, '....x.......x...', bars);
      s.grid('shaker', bar, 'x.o.x.o.x.o.x.o.', bars);
      if (full) {
        s.grid('bongo', bar, '..x.o.x...x.o.xo', bars, { midi: 69 });
        s.grid('conga', bar, 'x.....o.x...o...', bars, { midi: 57 });
      }
    };

    // A (0–7)
    s.play('reed', 0, themeA);
    groove(0, progA, false);
    s.play('drip', 0, 'r:12 d6:4 | r:16 | r:8 g6:8 | r:16 | r:16 | r:4 bb5:12 | r:16 | r:16');

    // B (8–15)
    s.play(
      'lead',
      8,
      'bb4:4 g4:2 bb4:2 eb5:8 | c5:4 a4:2 c5:2 f5:8 | d5:2 f5:2 a5:2 f5:2 d5:4 a4:4 | ' +
        'g5:4 f5:2 d5:2 bb4:8 | eb5:2 g5:2 bb5:2 g5:2 eb5:4 g5:4 | a5:4 g5:2 f5:2 c5:4 f5:4 | ' +
        'f#5:2 a5:2 d6:2 a5:2 f#5:2 d5:2 a4:4 | d5:4 c5:4 a4:4 f#4:4',
    );
    s.play('reed', 8, 'g4:16 | a4:16 | f4:16 | d4:16 | g4:16 | a4:16 | a4:16 | f#4:8 r:8', {
      vel: 0.6,
    });
    groove(8, progB, true);

    // A' (16–23): the reed and marimba together
    s.play('reed', 16, themeA);
    s.play('lead', 16, themeA, { transpose: 12, vel: 0.6 });
    groove(16, progA, true);
    s.play('drip', 16, 'r:16 | r:12 a5:4 | r:16 | r:8 d6:8 | r:16 | r:16 | r:4 g6:12 | r:16');
  },
);
