import { compose } from '../score.ts';

// Emberheart: E minor at the world's forge. Taiko and big kicks like hammers on an anvil,
// orchestral hits as the sparks fly, and brass that climbs as the magma does.
export const emberheart = compose(
  {
    id: 'emberheart',
    title: 'Anvil of the World',
    mood: 'Emberheart',
    bpm: 120,
    bars: 28,
    parts: {
      taiko: { inst: 'taiko', vol: 0.7, rev: 0.4 },
      bigkick: { inst: 'bigkick', vol: 0.6 },
      snare: { inst: 'snare', vol: 0.4, rev: 0.3 },
      orchhit: { inst: 'orchhit', vol: 0.45, rev: 0.4 },
      synthbass: { inst: 'synthbass', vol: 0.65 },
      brass: { inst: 'brass', vol: 0.6, rev: 0.5 },
      strings: { inst: 'strings', vol: 0.45, rev: 0.5 },
      choir: { inst: 'choir', vol: 0.4, rev: 0.7 },
      crash: { inst: 'crash', vol: 0.35, rev: 0.4 },
    },
  },
  (s) => {
    const progA = 'Em Em C D Em Em B B',
      progB = 'C D Em Em C D B B';
    const hammer = (bar: number, prog: string) => {
      const n = s.progression(bar, prog).length;
      s.grid('taiko', bar, 'x..x..x.x..x..x.', n);
      s.grid('bigkick', bar, 'x.......x.......', n);
      s.grid('snare', bar, '....x.......x...', n, { vel: 0.7 });
      s.bass('synthbass', bar, prog, 'R:2 R:2 R:2 R:2 5:4 R:4', 28);
      s.arp('strings', bar, prog, '0 1 2 1', 52, 2, { vel: 0.5 });
    };
    hammer(0, progA);
    s.hits('orchhit', 0, progA, 'x...........x...', 60, { vel: 0.5 });
    s.play(
      'brass',
      8,
      'e5:8 g5:8 | b5:12 r:4 | a5:8 g5:4 f#5:4 | g5:16 | e5:4 f#5:4 g5:4 b5:4 | c6:8 b5:8 | a5:4 g5:4 f#5:8 | b5:16',
      { transpose: -12 },
    );
    s.pad('choir', 8, progB, 62, { vel: 0.6 });
    hammer(8, progB);
    s.grid('crash', 16, 'x...............');
    s.play(
      'brass',
      16,
      'e5:8 g5:8 | b5:12 r:4 | a5:8 g5:4 f#5:4 | g5:16 | e5:4 f#5:4 g5:4 b5:4 | c6:8 b5:8 | a5:4 g5:4 f#5:8 | b5:16',
    );
    hammer(16, progA);
    s.hits('orchhit', 16, progA, 'x.......x...x...', 60, { vel: 0.6 });
    s.pad('choir', 24, 'Em:4', 62, { vel: 0.5 });
    hammer(24, 'Em Em C B');
  },
);
