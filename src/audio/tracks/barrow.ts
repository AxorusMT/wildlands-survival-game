import { compose } from '../score.ts';

// The Clockwork Barrow: A minor in the gears. A marimba ostinato ticking like an escapement, rim
// and tek clicks in lockstep, an organ hymn for the dead machine, and brass stabs as pistons fire.
export const barrow = compose(
  {
    id: 'barrow',
    title: 'The Engine Hymn',
    mood: 'The Clockwork Barrow',
    bpm: 108,
    bars: 24,
    parts: {
      kick: { inst: 'kick', vol: 0.6 },
      tek: { inst: 'tek', vol: 0.4, pan: 0.3 },
      rim: { inst: 'rim', vol: 0.45, rev: 0.3, pan: -0.3 },
      marimba: { inst: 'marimba', vol: 0.7, rev: 0.3 },
      synthbass: { inst: 'synthbass', vol: 0.6 },
      organ: { inst: 'organ', vol: 0.5, rev: 0.6 },
      brass: { inst: 'brass', vol: 0.5, rev: 0.4 },
      bell: { inst: 'bell', vol: 0.4, rev: 0.6, echo: 0.2 },
      pad: { inst: 'pad', vol: 0.35, rev: 0.6, cutoff: 1800 },
    },
  },
  (s) => {
    const progA = 'Am Am F G Am Am E E',
      progB = 'F G Am Am F G E E';
    const hymn =
      'a4:8 c5:8 | e5:12 r:4 | d5:8 c5:4 b4:4 | c5:16 | ' +
      'a4:4 b4:4 c5:4 e5:4 | f5:8 e5:8 | d5:4 c5:4 b4:8 | e5:16';
    const works = (bar: number, prog: string) => {
      const n = s.progression(bar, prog).length;
      s.arp('marimba', bar, prog, '0 2 1 2 3 2 1 2', 57, 2, { vel: 0.8 });
      s.grid('tek', bar, 'x.x.x.x.x.x.x.x.', n, { vel: 0.6 });
      s.grid('rim', bar, '....x.......x..x', n, { vel: 0.7 });
      s.grid('kick', bar, 'x.....x...x.....', n);
      s.bass('synthbass', bar, prog, 'R:4 R:2 R:2 5:4 R:4', 33);
      s.pad('pad', bar, prog, 57, { vel: 0.5 });
    };
    works(0, progA);
    s.hits('brass', 4, 'Am F G E', 'x.......x.....x.', 55, { vel: 0.5 });
    s.play('organ', 8, hymn);
    works(8, progB);
    s.play('organ', 16, hymn, { vel: 0.8 });
    s.play('bell', 16, hymn, { transpose: 12, vel: 0.5 });
    works(16, progA);
    s.hits('brass', 20, 'Am F G E', 'x.......x.....x.', 55, { vel: 0.6 });
  },
);
