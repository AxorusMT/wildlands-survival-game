import { compose } from '../score.ts';

// The dungeons: A minor, slow and stately. A cracked music box plays a lullaby for the dead over
// plucked strings and a creaking organ; bells toll in the distance, water drips from the vaults,
// and in the second half a choir and trembling strings rise as if the halls were waking up.
export const dungeon = compose(
  {
    id: 'dungeon',
    title: 'Halls of the Hollow King',
    mood: 'Dungeons',
    bpm: 84,
    bars: 20,
    parts: {
      toll: { inst: 'toll', vol: 1.1, rev: 0.8 },
      organ: { inst: 'organ', vol: 0.45, rev: 0.6, cutoff: 1300 },
      box: { inst: 'musicbox', vol: 0.8, rev: 0.55, echo: 0.3 },
      pizz: { inst: 'pizz', vol: 0.55, rev: 0.4, pan: -0.25 },
      harp: { inst: 'harp', vol: 0.45, rev: 0.5, pan: 0.3 },
      strings: { inst: 'tremolo', vol: 0.5, rev: 0.6 },
      melody: { inst: 'strings', vol: 0.75, rev: 0.55 },
      choir: { inst: 'choir', vol: 0.6, rev: 0.75 },
      sub: { inst: 'sub', vol: 0.7 },
      taiko: { inst: 'taiko', vol: 0.7, rev: 0.6 },
      timp: { inst: 'timpani', vol: 0.7, rev: 0.5 },
      drip: { inst: 'drip', vol: 0.45, rev: 0.8, echo: 0.4 },
      swell: { inst: 'swell', vol: 0.35, rev: 0.5 },
    },
    echoBeats: 1.5,
    echoFeedback: 0.45,
  },
  (s) => {
    const intro = 'Am Am F E',
      progA = 'Am Am Dm E Am G E Am',
      progB = 'Am E Dm E Am Dm E Am';
    const lullaby =
      'e5:4 a5:4 c6:4 b5:4 | a5:6 g#5:2 a5:8 | f5:4 a5:4 d6:4 c6:4 | b5:12 g#5:4 | ' +
      'e5:4 a5:4 c6:4 e6:4 | d6:6 c6:2 b5:8 | c6:4 b5:4 a5:4 g#5:4 | a5:16';
    const toll = (bar: number, n: number) => {
      for (let b = 0; b < n; b += 2) s.at('toll', bar + b, 'a2', 4);
    };

    // Intro (0–3): a bell in the dark, the organ breathing, drips.
    toll(0, 4);
    s.pad('organ', 0, intro, 57, { vel: 0.8 });
    s.bass('sub', 0, intro, 'R:16', 33);
    for (const [bar, note] of [
      [0.5, 'e7'],
      [1.3, 'c7'],
      [2.1, 'a6'],
      [2.9, 'g#6'],
      [3.6, 'b6'],
    ] as const)
      s.at('drip', bar, note);
    s.note('swell', 12, 60, 4);

    // A (4–11): the music box lullaby over pizzicato.
    s.play('box', 4, lullaby);
    s.arp('pizz', 4, progA, '0 2 1 2 3 2 1 2', 45, 2);
    s.pad('organ', 4, progA, 57, { vel: 0.7 });
    s.bass('sub', 4, progA, 'R:8 5:8', 33);
    s.grid('taiko', 4, 'x...............', 8, { vel: 0.7 });
    toll(4, 8);

    // B (12–19): the halls wake; strings take the tune, choir and tremolo beneath.
    s.play(
      'melody',
      12,
      'a4:8 c5:8 | b4:8 e4:8 | f4:8 a4:4 c5:4 | b4:16 | a4:8 c5:4 e5:4 | d5:8 f5:8 | e5:8 g#4:8 | a4:16',
    );
    s.play('box', 12, lullaby, { transpose: 12, vel: 0.5 });
    s.pad('choir', 12, progB, 64);
    s.pad('strings', 12, progB, 55, { vel: 0.8 });
    s.arp('harp', 12, progB, '0 1 2 3 4 3 2 1', 57, 2, { vel: 0.8 });
    s.bass('sub', 12, progB, 'R:4 r:4 R:4 5:4', 33);
    s.grid('taiko', 12, 'x.......x.......', 7);
    s.grid('timp', 19, 'x...x...x.x.xxxx', 1, { midi: 45 });
    s.note('swell', 76, 60, 4);
  },
);
