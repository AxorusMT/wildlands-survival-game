import { compose } from '../score.ts';

// The Undertow: A minor at the bottom of the sea. A sub bass like pressure on the ears, pads that
// sway like weed, bells echoing through the water, and a long, low call from something vast.
export const undertow = compose(
  {
    id: 'undertow',
    title: 'Pressure',
    mood: 'The Undertow',
    bpm: 64,
    bars: 16,
    parts: {
      sub: { inst: 'sub', vol: 0.7 },
      pad: { inst: 'pad', vol: 0.55, rev: 0.8, cutoff: 1200 },
      bell: { inst: 'bell', vol: 0.4, rev: 0.9, echo: 0.45 },
      howl: { inst: 'howl', vol: 0.35, rev: 0.9 },
      harp: { inst: 'harp', vol: 0.4, rev: 0.8, pan: 0.2 },
      drip: { inst: 'drip', vol: 0.35, rev: 0.8, echo: 0.4, pan: -0.3 },
      strings: { inst: 'strings', vol: 0.4, rev: 0.8, cutoff: 1400 },
    },
    echoBeats: 1.5,
    echoFeedback: 0.5,
  },
  (s) => {
    const progA = 'Am F C G Am F E E',
      progB = 'F G Am Am F G E E';
    const deep = (bar: number, prog: string) => {
      s.bass('sub', bar, prog, 'R:16', 33);
      s.pad('pad', bar, prog, 57, { vel: 0.6 });
      s.arp('harp', bar, prog, '0 2 1 3', 50, 4, { vel: 0.4 });
      for (let i = 0; i < 8; i++) s.at('drip', bar + i + 0.3, i % 2 ? 'e7' : 'a6', 0.25, 0.4);
    };
    s.play(
      'bell',
      0,
      'a5:8 e5:8 | c6:16 | b5:8 g5:8 | e5:16 | a5:8 c6:8 | f5:16 | e5:8 g#5:8 | a5:16',
    );
    s.play('howl', 2, 'a3:24 r:8 | e3:32', { vel: 0.6 });
    deep(0, progA);
    s.play(
      'strings',
      8,
      'c5:16 | d5:16 | e5:12 r:4 | a4:16 | c5:8 d5:8 | e5:8 d5:8 | b4:16 | g#4:16',
    );
    s.play('howl', 12, 'e3:32', { vel: 0.5 });
    deep(8, progB);
  },
);
