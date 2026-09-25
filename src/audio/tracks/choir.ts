import { compose } from '../score.ts';

// The Frozen Choir: C minor in a cathedral of ice. A choir that never draws breath, an organ under
// it, bells rung by the wind, and strings singing the hymn that holds you in place.
export const choir = compose(
  {
    id: 'choir',
    title: 'Frozen Hymnal',
    mood: 'The Frozen Choir',
    bpm: 66,
    bars: 16,
    parts: {
      choir: { inst: 'choir', vol: 0.55, rev: 0.8 },
      organ: { inst: 'organ', vol: 0.4, rev: 0.7 },
      strings: { inst: 'strings', vol: 0.55, rev: 0.7 },
      bell: { inst: 'bell', vol: 0.45, rev: 0.8, echo: 0.3 },
      toll: { inst: 'toll', vol: 0.35, rev: 0.8 },
      harp: { inst: 'harp', vol: 0.45, rev: 0.6, pan: 0.2 },
      sub: { inst: 'sub', vol: 0.55 },
      timpani: { inst: 'timpani', vol: 0.45, rev: 0.6 },
      wind: { inst: 'wind', vol: 0.3, rev: 0.6 },
    },
  },
  (s) => {
    const progA = 'Cm Ab Eb Bb Cm Fm G G',
      progB = 'Ab Bb Cm Cm Ab Bb G G';
    const nave = (bar: number, prog: string) => {
      const n = s.progression(bar, prog).length;
      s.pad('choir', bar, prog, 62, { vel: 0.7 });
      s.pad('organ', bar, prog, 50, { vel: 0.5 });
      s.arp('harp', bar, prog, '0 1 2 3 4 3 2 1', 55, 2, { vel: 0.5 });
      s.bass('sub', bar, prog, 'R:16', 33);
      s.grid('timpani', bar, 'x...............', n, { vel: 0.6 });
      for (let i = 0; i < n; i += 4) s.at('toll', bar + i, 'c4', 8, 0.6);
    };
    s.play(
      'strings',
      0,
      'g4:8 ab4:8 | bb4:4 ab4:4 g4:8 | eb4:8 f4:8 | d4:16 | g4:4 c5:4 d5:4 eb5:4 | f5:8 eb5:8 | d5:4 c5:4 b4:8 | b4:8 d5:8',
    );
    s.play('wind', 0, 'c5:32 | g4:32', { vel: 0.5 });
    nave(0, progA);
    s.play(
      'bell',
      8,
      'eb5:8 d5:8 | c5:12 r:4 | ab4:8 bb4:8 | g4:16 | eb5:8 f5:8 | g5:8 f5:4 eb5:4 | d5:16 | b4:16',
    );
    s.play('strings', 8, 'c5:16 | d5:16 | eb5:16 | c5:16 | ab4:16 | bb4:16 | b4:16 | b4:16', {
      vel: 0.5,
    });
    nave(8, progB);
  },
);
