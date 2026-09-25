import { compose } from '../score.ts';

// The Hollow Void: C minor bent by tritones, almost still. Low pads hang in the dark, a crystal
// voice asks questions nobody answers, something far away howls, and bells ring out of time
// like stars going out.
export const voidsong = compose(
  {
    id: 'void',
    title: 'The Hollow Between',
    mood: 'The Hollow Void',
    bpm: 64,
    bars: 16,
    parts: {
      pad: { inst: 'pad', vol: 0.6, rev: 0.8, cutoff: 900 },
      choir: { inst: 'choir', vol: 0.45, rev: 0.85 },
      crystal: { inst: 'crystal', vol: 0.75, rev: 0.75, echo: 0.45 },
      bell: { inst: 'bell', vol: 0.45, rev: 0.8, echo: 0.4 },
      howl: { inst: 'howl', vol: 0.4, rev: 0.8 },
      sub: { inst: 'sub', vol: 0.8 },
      toll: { inst: 'toll', vol: 0.8, rev: 0.85 },
      swell: { inst: 'swell', vol: 0.4, rev: 0.6 },
      drip: { inst: 'drip', vol: 0.4, rev: 0.9, echo: 0.5 },
    },
    echoBeats: 1.5,
    echoFeedback: 0.55,
  },
  (s) => {
    const prog = 'Cm Ab Cm F# Cm Db Bbm F#';
    const ask =
      'g5:6 f#5:2 c5:8 | r:4 eb6:4 d6:8 | c6:6 b5:2 g5:8 | f#5:16 | ' +
      'g5:6 ab5:2 c6:8 | db6:8 c6:4 bb5:4 | f5:6 e5:2 f#5:8 | g5:16';

    // 0–3: the dark itself.
    s.pad('pad', 0, prog.split(' ').slice(0, 4).join(' '), 55);
    s.bass('sub', 0, 'Cm Ab Cm F#', 'R:16', 24);
    s.at('toll', 0, 'c2', 8);
    s.note('swell', 8, 60, 8);
    for (const [bar, note] of [
      [0.6, 'g6'],
      [1.4, 'f#7'],
      [2.7, 'c7'],
      [3.3, 'db7'],
    ] as const)
      s.at('drip', bar, note);

    // 4–11: the crystal voice.
    s.play('crystal', 4, ask);
    s.pad('pad', 4, prog, 55);
    s.bass('sub', 4, prog, 'R:8 r:4 R:4', 24);
    s.at('howl', 7, 'f#4', 8);
    s.at('toll', 8, 'c2', 8);

    // 12–15: the choir, and bells like stars going out.
    s.pad('choir', 12, 'Cm Ab Db F#', 62);
    s.pad('pad', 12, 'Cm Ab Db F#', 55, { vel: 0.8 });
    s.bass('sub', 12, 'Cm Ab Db F#', 'R:16', 24);
    s.play('bell', 12, 'c6:4 r:2 g6:4 r:6 | eb6:6 r:2 d6:8 | db6:4 r:4 ab5:8 | f#5:16');
    s.at('howl', 14, 'c4', 8);
    s.note('swell', 56, 60, 8);
  },
);
