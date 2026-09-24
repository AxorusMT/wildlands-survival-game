import { compose } from '../score.ts';

// The death page: a slow lament in A minor. Electric piano and strings carry the melody over
// harp and a quiet choir, with a low bell tolling at the start of each phrase.
export const fallen = compose(
  {
    id: 'fallen',
    title: 'What the Wild Takes',
    mood: 'Fallen',
    bpm: 66,
    bars: 16,
    parts: {
      toll: { inst: 'bell', vol: 0.5, rev: 0.7 },
      sub: { inst: 'sub', vol: 0.7 },
      harp: { inst: 'harp', vol: 0.6, rev: 0.55, pan: 0.2 },
      pad: { inst: 'pad', vol: 0.75, rev: 0.6 },
      choir: { inst: 'choir', vol: 0.7, rev: 0.7 },
      keys: { inst: 'epiano', vol: 0.9, rev: 0.45, echo: 0.15, pan: -0.15 },
      strings: { inst: 'strings', vol: 0.8, rev: 0.55 },
    },
    echoBeats: 1,
  },
  (s) => {
    const prog = 'Am F C G Am F Dm E F G Em Am Dm Am F E';
    const melody =
      'a4:6 b4:2 c5:4 e5:4 | f5:8 e5:4 c5:4 | e5:6 d5:2 c5:8 | d5:8 b4:8 | ' +
      'c5:6 d5:2 e5:4 a5:4 | a5:6 g5:2 f5:8 | f5:6 e5:2 d5:8 | e5:8 g#4:8 | ' +
      'c5:6 d5:2 f5:4 a5:4 | g5:8 d5:8 | b4:6 e5:2 g5:8 | a5:8 e5:8 | ' +
      'f5:6 e5:2 d5:4 a4:4 | c5:6 b4:2 a4:8 | a4:6 c5:2 f5:8 | g#4:8 b4:4 e5:4';
    s.play('keys', 0, melody);
    s.play('strings', 4, melody.split('|').slice(4).join('|'), { vel: 0.7 });
    s.pad('pad', 0, prog, 57, { vel: 0.8 });
    s.arp('harp', 0, prog, '0 1 2 3', 45, 4);
    s.pad('choir', 8, 'F G Em Am Dm Am F E', 64, { vel: 0.6 });
    s.bass('sub', 0, prog, 'R:16', 33);
    for (const bar of [0, 4, 8, 12]) s.at('toll', bar, 'a3', 4);
  },
);
