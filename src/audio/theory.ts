// Pitch helpers for the score: note names, chord symbols, and smooth chord voicings.

const LETTERS: Record<string, number> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

/** Converts `c4`, `f#5`, `bb3`, or `e#5` to a MIDI note number (c4 = 60). */
export function noteToMidi(name: string): number {
  const m = /^([a-g])(#{1,2}|b{1,2})?(-?\d)$/.exec(name);
  if (!m) throw new Error(`Bad note "${name}"`);
  const acc = m[2] ? (m[2][0] === '#' ? m[2].length : -m[2].length) : 0;
  return (Number(m[3]) + 1) * 12 + LETTERS[m[1]] + acc;
}

export const midiToHz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

const QUALITIES: Record<string, number[]> = {
  '': [0, 4, 7],
  m: [0, 3, 7],
  '5': [0, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  '6': [0, 4, 7, 9],
  m6: [0, 3, 7, 9],
  '7': [0, 4, 7, 10],
  m7: [0, 3, 7, 10],
  maj7: [0, 4, 7, 11],
  m7b5: [0, 3, 6, 10],
  dim7: [0, 3, 6, 9],
  add9: [0, 4, 7, 14],
  madd9: [0, 3, 7, 14],
  '9': [0, 4, 7, 10, 14],
  m9: [0, 3, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  '7sus4': [0, 5, 7, 10],
};

export interface Chord {
  /** Pitch class of the root, 0–11. */
  root: number;
  /** Pitch class of the bass note (differs from root for slash chords). */
  bass: number;
  /** Intervals above the root. */
  intervals: number[];
}

const pitchClass = (letter: string, acc = '') =>
  (LETTERS[letter.toLowerCase()] + (acc === '#' ? 1 : acc === 'b' ? -1 : 0) + 12) % 12;

/** Parses chord symbols such as `Am`, `F#m7b5`, `Bbmaj7`, `C/E`, or `C#5`. */
export function parseChord(symbol: string): Chord {
  const m = /^([A-G])(#|b)?([^/]*)(?:\/([A-G])(#|b)?)?$/.exec(symbol);
  if (!m || !(m[3] in QUALITIES)) throw new Error(`Bad chord "${symbol}"`);
  const root = pitchClass(m[1], m[2]);
  return {
    root,
    bass: m[4] ? pitchClass(m[4], m[5]) : root,
    intervals: QUALITIES[m[3]],
  };
}

/** The chord's tones stacked upward from `low` (a MIDI note), one octave's worth of each. */
export function chordTones(chord: Chord, low: number): number[] {
  let base = low - ((((low - chord.root) % 12) + 12) % 12);
  if (base < low) base += 12;
  return chord.intervals.map((i) => base + i);
}

/** Lowest MIDI note at or above `low` with the given pitch class. */
export function pitchAtOrAbove(pc: number, low: number): number {
  return low + ((((pc - low) % 12) + 12) % 12);
}

/**
 * Picks a close-position voicing of the chord. With a previous voicing, the inversion that
 * moves the voices least is chosen; otherwise the one centred nearest `center`.
 */
export function voiceChord(chord: Chord, center: number, previous?: number[]): number[] {
  const pcs = chord.intervals.map((i) => (chord.root + i) % 12);
  const size = Math.min(pcs.length, 4);
  const candidates: number[][] = [];
  for (let inv = 0; inv < pcs.length; inv++) {
    for (let start = center - 14; start <= center + 2; start++) {
      if (((start % 12) + 12) % 12 !== pcs[inv]) continue;
      const notes = [start];
      for (let k = 1; k < size; k++)
        notes.push(pitchAtOrAbove(pcs[(inv + k) % pcs.length], notes[k - 1] + 1));
      candidates.push(notes);
    }
  }
  const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
  const cost = (v: number[]) =>
    previous && previous.length === v.length
      ? v.reduce((sum, n, i) => sum + Math.abs(n - previous[i]), 0) +
        Math.abs(mean(v) - center) * 0.35
      : Math.abs(mean(v) - center);
  return candidates.reduce((best, v) => (cost(v) < cost(best) ? v : best));
}
