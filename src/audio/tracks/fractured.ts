import { compose } from '../score.ts';

// The Fractured Realms: B minor, broken and spliced. Chiptune pulses stutter over a supersaw pad,
// crystal and bell phrases from other realms cut in and out, and the beat skips like a scratched
// record where the worlds join.
export const fractured = compose(
  {
    id: 'fractured',
    title: 'Seams',
    mood: 'The Fractured Realms',
    bpm: 100,
    bars: 24,
    parts: {
      kick: { inst: 'kick', vol: 0.6 },
      snare: { inst: 'snare', vol: 0.4, rev: 0.3 },
      hat: { inst: 'hat', vol: 0.3, pan: 0.3 },
      pulse: { inst: 'pulse', vol: 0.45, rev: 0.3, echo: 0.3, pan: -0.2 },
      supersaw: { inst: 'supersaw', vol: 0.35, rev: 0.5, cutoff: 2000 },
      crystal: { inst: 'crystal', vol: 0.5, rev: 0.6, echo: 0.3 },
      bell: { inst: 'bell', vol: 0.4, rev: 0.7 },
      synthbass: { inst: 'synthbass', vol: 0.65 },
      riser: { inst: 'riser', vol: 0.3, rev: 0.5 },
    },
    echoBeats: 0.75,
    echoFeedback: 0.45,
  },
  (s) => {
    const progA = 'Bm G D A Bm G Em F#',
      progB = 'G A Bm Bm G A F# F#';
    const beat = (bar: number, prog: string, skip: boolean) => {
      const n = s.progression(bar, prog).length;
      s.grid('kick', bar, skip ? 'x..x..x...x..x..' : 'x.......x.......', n);
      s.grid('snare', bar, '....x.......x..x', n, { vel: 0.7 });
      s.grid('hat', bar, 'x.x.x.xxx.x.x.xx', n, { vel: 0.5 });
      s.bass('synthbass', bar, prog, 'R:3 R:3 R:2 5:4 R:4', 35);
      s.pad('supersaw', bar, prog, 60, { vel: 0.5 });
    };
    const shard =
      'b5:2 d6:2 f#6:4 e6:2 d6:2 c#6:4 | c#6:4 a5:4 b5:8 | d6:2 f#6:2 a6:4 g6:4 e6:4 | f#6:16 | ' +
      'b5:2 b5:2 d6:4 b5:2 f#5:2 a5:4 | g5:4 e5:4 b5:8 | a#5:4 c#6:4 e6:4 f#6:4 | b5:16';
    s.play('pulse', 0, shard);
    beat(0, progA, false);
    s.play(
      'crystal',
      8,
      'd6:8 e6:8 | f#6:12 r:4 | b5:8 d6:8 | f#5:16 | g5:8 a5:8 | b5:8 c#6:8 | a#5:16 | f#5:16',
    );
    for (let b = 8; b < 16; b += 2) s.at('bell', b + 1, b % 4 ? 'f#6' : 'b5', 2, 0.6);
    s.play('riser', 14, 'b4:32', { vel: 0.6 });
    beat(8, progB, true);
    s.play('pulse', 16, shard);
    s.play('crystal', 16, shard, { transpose: -12, vel: 0.5 });
    beat(16, progA, true);
  },
);
