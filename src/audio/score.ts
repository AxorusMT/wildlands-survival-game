// A small score notation for writing tracks as data.
//
// Melodies are space-separated tokens: `c5:4` is C5 for four steps (sixteenths by default),
// `r:2` is a rest, `c4+e4+g4:8` is a chord, and a token without `:n` reuses the last length.
// A leading `>` accents a note and `_` softens it. `|` marks a bar line and is checked, so a
// miscounted bar fails loudly when the track is built. Drum grids use one character per step:
// `x` hit, `X` accent, `o` ghost, `.` rest.

import type { InstrumentId } from './instruments.ts';
import {
  chordTones,
  noteToMidi,
  parseChord,
  pitchAtOrAbove,
  voiceChord,
  type Chord,
} from './theory.ts';

export interface PartDef {
  inst: InstrumentId;
  /** Linear level for the part (default 1). */
  vol?: number;
  /** Stereo position, -1 to 1. */
  pan?: number;
  /** Reverb send, 0–1. */
  rev?: number;
  /** Tempo-synced echo send, 0–1. */
  echo?: number;
  /** Route through the sidechain-ducked bus so it pumps against the kick. */
  duck?: boolean;
  /** Static low-pass cutoff in Hz. Parts with cutoff automation get a filter as well. */
  cutoff?: number;
  /** Semitone offset applied to every note in the part. */
  transpose?: number;
}

export interface NoteEvent {
  t: number;
  d: number;
  p: string;
  m: number;
  v: number;
}

export interface AutoEvent {
  t: number;
  d: number;
  p: string;
  param: 'cutoff' | 'vol';
  from: number;
  to: number;
}

export type ScoreEvent = NoteEvent | AutoEvent;

export interface Track {
  id: string;
  title: string;
  mood: string;
  bpm: number;
  beatsPerBar: number;
  bars: number;
  /** Bar the loop returns to after the first pass (skips intros). */
  loopBar: number;
  parts: Record<string, PartDef>;
  /** Sorted by time, in beats. */
  events: ScoreEvent[];
  /** Part whose notes duck the `duck` bus, with depth 0–1 and recovery in seconds. */
  sidechain?: { part: string; depth: number; release: number };
  /** Echo time in beats. */
  echoBeats: number;
  echoFeedback: number;
}

export interface TrackMeta {
  id: string;
  title: string;
  mood: string;
  bpm: number;
  beatsPerBar?: number;
  /** Steps per beat: 4 for sixteenths, 3 for triplet eighths. */
  stepsPerBeat?: number;
  bars: number;
  loopBar?: number;
  parts: Record<string, PartDef>;
  sidechain?: { part: string; depth: number; release: number };
  echoBeats?: number;
  echoFeedback?: number;
  /** Delays every other `unit` beats by `amount` of a unit (0.33 is a triplet shuffle). */
  swing?: { unit: number; amount: number };
}

interface PlayOptions {
  transpose?: number;
  vel?: number;
  /** Multiplies every length, for legato (>1) or staccato (<1) playing. */
  gate?: number;
}

export class Score {
  readonly events: ScoreEvent[] = [];
  readonly spb: number;
  readonly bpb: number;
  readonly meta: TrackMeta;
  private seed = 7;

  constructor(meta: TrackMeta) {
    this.meta = meta;
    this.spb = meta.stepsPerBeat ?? 4;
    this.bpb = meta.beatsPerBar ?? 4;
  }

  get stepsPerBar() {
    return this.spb * this.bpb;
  }

  private beat(bar: number) {
    return bar * this.bpb;
  }

  private rand() {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  private part(name: string) {
    const def = this.meta.parts[name];
    if (!def) throw new Error(`${this.meta.id}: unknown part "${name}"`);
    return def;
  }

  note(part: string, beat: number, midi: number, beats: number, vel = 1) {
    const def = this.part(part);
    this.events.push({
      t: beat,
      d: beats,
      p: part,
      m: midi + (def.transpose ?? 0),
      v: vel * (0.94 + this.rand() * 0.12),
    });
  }

  /** One note by name at a (possibly fractional) bar, lasting `beats`. */
  at(part: string, bar: number, name: string, beats = 1, vel = 1) {
    this.note(part, this.beat(bar), noteToMidi(name), beats, vel);
  }

  /** Plays a melody string starting at `bar`. Returns the bar after the last note. */
  play(part: string, bar: number, melody: string, opts: PlayOptions = {}) {
    let step = 0,
      len = 4;
    const start = this.beat(bar);
    for (const raw of melody.trim().split(/\s+/)) {
      if (raw === '|') {
        if (step % this.stepsPerBar)
          throw new Error(`${this.meta.id}/${part} bar ${bar}: bar line at step ${step}`);
        continue;
      }
      let token = raw,
        vel = 1;
      if (token[0] === '>') [vel, token] = [1.2, token.slice(1)];
      else if (token[0] === '_') [vel, token] = [0.65, token.slice(1)];
      const [pitch, dur] = token.split(':');
      if (dur) len = Number(dur);
      if (!(len > 0)) throw new Error(`${this.meta.id}/${part}: bad length in "${raw}"`);
      if (pitch !== 'r')
        for (const name of pitch.split('+'))
          this.note(
            part,
            start + step / this.spb,
            noteToMidi(name) + (opts.transpose ?? 0),
            (len / this.spb) * (opts.gate ?? 0.95),
            vel * (opts.vel ?? 1),
          );
      step += len;
    }
    if (step % this.stepsPerBar)
      throw new Error(`${this.meta.id}/${part} bar ${bar}: melody ends at step ${step}`);
    return bar + step / this.stepsPerBar;
  }

  /** Drum grid; `|` separators are optional and ignored. The grid repeats `times` times. */
  grid(
    part: string,
    bar: number,
    pattern: string,
    times = 1,
    opts: { midi?: number; vel?: number } = {},
  ) {
    const cells = pattern.replace(/[|\s]/g, '');
    if (cells.length % this.stepsPerBar)
      throw new Error(`${this.meta.id}/${part} bar ${bar}: grid of ${cells.length} steps`);
    const bars = cells.length / this.stepsPerBar;
    for (let n = 0; n < times; n++)
      [...cells].forEach((c, i) => {
        const vel = c === 'X' ? 1.2 : c === 'x' ? 1 : c === 'o' ? 0.5 : 0;
        if (vel)
          this.note(
            part,
            this.beat(bar + n * bars) + i / this.spb,
            opts.midi ?? 60,
            1 / this.spb,
            vel * (opts.vel ?? 1),
          );
      });
    return bar + bars * times;
  }

  /**
   * Parses a progression like `Dm Bb F:2 C:.5 A:.5`, where `:n` is a length in bars
   * (default one). Returns [chord, startBar, bars] triples.
   */
  progression(bar: number, symbols: string): [Chord, number, number][] {
    const out: [Chord, number, number][] = [];
    let at = bar;
    for (const token of symbols.trim().split(/\s+/)) {
      if (token === '|') continue;
      const [sym, len] = token.split(':');
      const bars = len ? Number(len) : 1;
      out.push([parseChord(sym), at, bars]);
      at += bars;
    }
    return out;
  }

  /** Sustained, voice-led chords around `center` (MIDI). */
  pad(part: string, bar: number, symbols: string, center = 62, opts: PlayOptions = {}) {
    let prev: number[] | undefined;
    const prog = this.progression(bar, symbols);
    for (const [chord, at, bars] of prog) {
      prev = voiceChord(chord, center, prev);
      for (const m of prev)
        this.note(
          part,
          this.beat(at),
          m + (opts.transpose ?? 0),
          bars * this.bpb * (opts.gate ?? 1),
          opts.vel ?? 1,
        );
    }
    return this.endOf(prog);
  }

  /**
   * Rhythmic chord hits: each `x` in the one-bar `rhythm` starts a voiced chord that lasts
   * through following `-` cells.
   */
  hits(
    part: string,
    bar: number,
    symbols: string,
    rhythm: string,
    center = 62,
    opts: PlayOptions = {},
  ) {
    const cells = rhythm.replace(/[|\s]/g, '');
    if (cells.length !== this.stepsPerBar)
      throw new Error(`${this.meta.id}/${part}: rhythm needs ${this.stepsPerBar} steps`);
    let prev: number[] | undefined;
    const prog = this.progression(bar, symbols);
    for (const [chord, at, bars] of prog) {
      // Power chords (`E5`) keep their root, fifth, octave shape instead of being inverted.
      const low = pitchAtOrAbove(chord.root, center - 7);
      prev =
        chord.intervals.length === 2 ? [low, low + 7, low + 12] : voiceChord(chord, center, prev);
      const total = Math.round(bars * this.stepsPerBar);
      for (let s = 0; s < total; s++) {
        const c = cells[s % cells.length];
        if (c !== 'x' && c !== 'X' && c !== 'o') continue;
        let len = 1;
        while (s + len < total && cells[(s + len) % cells.length] === '-') len++;
        const vel = c === 'X' ? 1.2 : c === 'o' ? 0.6 : 1;
        for (const m of prev)
          this.note(
            part,
            this.beat(at) + s / this.spb,
            m + (opts.transpose ?? 0),
            (len / this.spb) * (opts.gate ?? 0.9),
            vel * (opts.vel ?? 1),
          );
      }
    }
    return this.endOf(prog);
  }

  /**
   * Arpeggio over a progression. `pattern` indexes chord tones stacked upward from `low`
   * (0 is the lowest tone, and indexes past the chord climb octaves); `r` rests. Each index
   * lasts `rate` steps and the pattern cycles through every chord.
   */
  arp(
    part: string,
    bar: number,
    symbols: string,
    pattern: string,
    low = 60,
    rate = 2,
    opts: PlayOptions = {},
  ) {
    const idx = pattern.trim().split(/\s+/);
    const prog = this.progression(bar, symbols);
    for (const [chord, at, bars] of prog) {
      const tones = chordTones(chord, low);
      const steps = Math.round(bars * this.stepsPerBar);
      for (let s = 0, k = 0; s < steps; s += rate, k++) {
        const token = idx[k % idx.length];
        if (token === 'r') continue;
        const i = Number(token);
        const m = tones[i % tones.length] + 12 * Math.floor(i / tones.length);
        this.note(
          part,
          this.beat(at) + s / this.spb,
          m + (opts.transpose ?? 0),
          (Math.min(rate, steps - s) / this.spb) * (opts.gate ?? 0.9),
          opts.vel ?? 1,
        );
      }
    }
    return this.endOf(prog);
  }

  /**
   * Bass line over a progression. Tokens are `R` root (or slash bass), `5` fifth, `8` octave,
   * `3` the chord's third, `7` its seventh (or flat seventh), `-5` the fifth below, or `r` rest,
   * each with `:n` steps. The pattern cycles through every chord.
   */
  bass(
    part: string,
    bar: number,
    symbols: string,
    pattern: string,
    low = 36,
    opts: PlayOptions = {},
  ) {
    const tokens = pattern
      .trim()
      .split(/\s+/)
      .map((t) => {
        const [deg, len] = t.split(':');
        return [deg, Number(len || 4)] as const;
      });
    const prog = this.progression(bar, symbols);
    for (const [chord, at, bars] of prog) {
      const root = pitchAtOrAbove(chord.bass, low);
      const third = chord.intervals.find((i) => i === 3 || i === 4) ?? 4;
      const seventh = chord.intervals.find((i) => i === 10 || i === 11) ?? 10;
      const steps = Math.round(bars * this.stepsPerBar);
      for (let s = 0, k = 0; s < steps; k++) {
        const [deg, len] = tokens[k % tokens.length];
        const offsets: Record<string, number> = {
          R: 0,
          '5': 7,
          '8': 12,
          '3': third,
          '7': seventh,
          '-5': -5,
        };
        if (deg !== 'r') {
          if (!(deg in offsets)) throw new Error(`${this.meta.id}/${part}: bad bass degree ${deg}`);
          this.note(
            part,
            this.beat(at) + s / this.spb,
            root + offsets[deg] + (opts.transpose ?? 0),
            (Math.min(len, steps - s) / this.spb) * (opts.gate ?? 0.9),
            opts.vel ?? 1,
          );
        }
        s += len;
      }
    }
    return this.endOf(prog);
  }

  /** Ramps a part's low-pass cutoff (Hz) or level over `bars`. */
  automate(
    part: string,
    param: 'cutoff' | 'vol',
    bar: number,
    bars: number,
    from: number,
    to: number,
  ) {
    this.part(part);
    this.events.push({ t: this.beat(bar), d: bars * this.bpb, p: part, param, from, to });
  }

  private endOf(prog: [Chord, number, number][]) {
    const [, at, bars] = prog[prog.length - 1];
    return at + bars;
  }

  build(): Track {
    const m = this.meta;
    const loopBar = m.loopBar ?? 0;
    const autos = this.events.filter((e): e is AutoEvent => 'param' in e);
    // Every automated parameter snaps back to its written default when the loop restarts.
    const resets: AutoEvent[] = [];
    for (const e of autos)
      if (!resets.some((r) => r.p === e.p && r.param === e.param)) {
        const def = m.parts[e.p];
        const value = e.param === 'vol' ? 1 : (def.cutoff ?? 20000);
        for (const bar of new Set([0, loopBar]))
          resets.push({ t: bar * this.bpb, d: 0, p: e.p, param: e.param, from: value, to: value });
      }
    const notes = this.events.filter((e): e is NoteEvent => !('param' in e));
    if (m.swing) {
      const { unit, amount } = m.swing;
      for (const n of notes) {
        const pos = n.t / unit;
        if (Math.abs(pos - Math.round(pos)) < 1e-6 && Math.round(pos) % 2 === 1)
          n.t += unit * amount;
      }
    }
    for (const n of notes)
      if (n.t >= m.bars * this.bpb - 1e-6)
        throw new Error(`${m.id}: note in part ${n.p} at beat ${n.t} is past the last bar`);
    const events: ScoreEvent[] = [...resets, ...autos, ...notes].sort((a, b) => a.t - b.t);
    return {
      id: m.id,
      title: m.title,
      mood: m.mood,
      bpm: m.bpm,
      beatsPerBar: this.bpb,
      bars: m.bars,
      loopBar,
      parts: m.parts,
      events,
      sidechain: m.sidechain,
      echoBeats: m.echoBeats ?? 0.75,
      echoFeedback: m.echoFeedback ?? 0.32,
    };
  }
}

export function compose(meta: TrackMeta, write: (s: Score) => void): Track {
  const s = new Score(meta);
  write(s);
  return s.build();
}
