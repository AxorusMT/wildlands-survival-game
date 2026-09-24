// Plays scored tracks through a small mixer: per-part level, filter, pan, reverb and echo
// sends, a sidechain-ducked bus for pumping pads, and a fader per playing track so scenes can
// crossfade. Works with a live AudioContext (scheduled a little ahead of time) or an
// OfflineAudioContext (scheduled all at once).

import { INSTRUMENTS, kit, PartOut, type Instrument, type Kit } from './instruments.ts';
import type { AutoEvent, NoteEvent, Track } from './score.ts';

function impulse(ctx: BaseAudioContext, seconds: number) {
  const rate = ctx.sampleRate,
    len = Math.floor(rate * seconds),
    ir = ctx.createBuffer(2, len, rate);
  let seed = 99;
  for (let c = 0; c < 2; c++) {
    const data = ir.getChannelData(c);
    let smooth = 0;
    for (let i = 0; i < len; i++) {
      seed = (seed * 16807) % 2147483647;
      const x = i / len,
        white = (seed / 2147483647) * 2 - 1,
        // The tail darkens as it decays, like a real hall.
        k = 0.85 - 0.75 * x;
      smooth = smooth + k * (white - smooth);
      data[i] = smooth * Math.exp(-x * 5.5) * (i < rate * 0.012 ? i / (rate * 0.012) : 1);
    }
  }
  return ir;
}

/** Linear up to 0.75, then bends smoothly; the shaper clamps anything past full scale. */
function softClip() {
  const curve = new Float32Array(2048);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1,
      a = Math.abs(x),
      y = a < 0.75 ? a : 0.75 + 0.24 * Math.tanh((a - 0.75) / 0.24);
    curve[i] = Math.sign(x) * y;
  }
  return curve;
}

/** Music output chain: glue compression and a soft limiter, shared by the game and previews. */
export function createMusicChain(ctx: BaseAudioContext, destination: AudioNode) {
  const input = ctx.createGain(),
    muffle = ctx.createBiquadFilter(),
    glue = ctx.createDynamicsCompressor(),
    makeup = ctx.createGain(),
    limiter = ctx.createDynamicsCompressor(),
    clipper = ctx.createWaveShaper();
  muffle.type = 'lowpass';
  muffle.frequency.value = 20000;
  muffle.Q.value = 0.5;
  glue.threshold.value = -16;
  glue.knee.value = 8;
  glue.ratio.value = 2.5;
  glue.attack.value = 0.01;
  glue.release.value = 0.18;
  makeup.gain.value = 1.2;
  limiter.threshold.value = -4;
  limiter.knee.value = 2;
  limiter.ratio.value = 16;
  limiter.attack.value = 0.002;
  limiter.release.value = 0.12;
  clipper.curve = softClip();
  clipper.oversample = '2x';
  input
    .connect(muffle)
    .connect(glue)
    .connect(makeup)
    .connect(limiter)
    .connect(clipper)
    .connect(destination);
  return { input, muffle };
}

interface PartBus {
  input: GainNode;
  out: PartOut;
  filter?: BiquadFilterNode;
  vol: number;
}

export class Deck {
  readonly fader: GainNode;
  readonly revSend: GainNode;
  private readonly duck: GainNode;
  private readonly parts = new Map<string, PartBus>();
  private readonly spb: number;
  private readonly lengthBeats: number;
  private readonly loopBeat: number;
  private readonly loopIndex: number;
  private idx = 0;
  private iter = 0;
  private kit: Kit;
  readonly track: Track;
  readonly start: number;
  stopAt = Infinity;

  constructor(player: MusicPlayer, track: Track, start: number, fadeIn: number) {
    this.track = track;
    this.start = start;
    const ctx = player.ctx;
    this.kit = kit(ctx);
    this.spb = 60 / track.bpm;
    this.lengthBeats = track.bars * track.beatsPerBar;
    this.loopBeat = track.loopBar * track.beatsPerBar;
    this.loopIndex = track.events.findIndex((e) => e.t >= this.loopBeat - 1e-6);
    this.fader = ctx.createGain();
    this.revSend = ctx.createGain();
    for (const p of [this.fader.gain, this.revSend.gain]) {
      if (fadeIn > 0) {
        p.setValueAtTime(0, 0);
        p.setValueAtTime(0, start);
        p.setTargetAtTime(1, start, fadeIn / 4);
      } else p.value = 1;
    }
    this.fader.connect(player.out);
    this.revSend.connect(player.reverbIn);
    const dry = ctx.createGain();
    dry.connect(this.fader);
    this.duck = ctx.createGain();
    this.duck.connect(this.fader);
    // Tempo-synced echo with a darkening feedback loop.
    const echoIn = ctx.createGain(),
      delay = ctx.createDelay(4),
      feedback = ctx.createGain(),
      tone = ctx.createBiquadFilter(),
      trim = ctx.createBiquadFilter();
    delay.delayTime.value = Math.min(3.9, track.echoBeats * this.spb);
    feedback.gain.value = track.echoFeedback;
    tone.type = 'lowpass';
    tone.frequency.value = 3200;
    trim.type = 'highpass';
    trim.frequency.value = 280;
    echoIn.connect(delay).connect(tone).connect(feedback).connect(delay);
    tone.connect(trim).connect(this.fader);
    trim.connect(this.revSend);
    const automated = new Set(
      track.events
        .filter((e): e is AutoEvent => 'param' in e && e.param === 'cutoff')
        .map((e) => e.p),
    );
    for (const [name, def] of Object.entries(track.parts)) {
      const inst: Instrument = INSTRUMENTS[def.inst],
        input = ctx.createGain(),
        vol = def.vol ?? 1,
        cutoff = def.cutoff ?? inst.cutoff;
      input.gain.value = vol;
      let node: AudioNode = input,
        filter: BiquadFilterNode | undefined;
      if (inst.insert) {
        const insert = inst.insert(this.kit);
        node.connect(insert.input);
        node = insert.output;
      }
      if (cutoff !== undefined || automated.has(name)) {
        filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = Math.min(cutoff ?? 20000, ctx.sampleRate / 2);
        filter.Q.value = 0.8;
        node = node.connect(filter);
      }
      const panner = ctx.createStereoPanner();
      panner.pan.value = def.pan ?? 0;
      node.connect(panner).connect(def.duck ? this.duck : dry);
      if (def.rev) {
        const send = ctx.createGain();
        send.gain.value = def.rev;
        panner.connect(send).connect(this.revSend);
      }
      if (def.echo) {
        const send = ctx.createGain();
        send.gain.value = def.echo;
        panner.connect(send).connect(echoIn);
      }
      this.parts.set(name, {
        input,
        out: new PartOut(this.kit, input, inst.vibrato ?? 5),
        filter,
        vol,
      });
    }
  }

  /** Schedules every event that starts before `until` (seconds). */
  schedule(until: number, skipBefore = -Infinity) {
    const events = this.track.events,
      loopLen = this.lengthBeats - this.loopBeat;
    for (;;) {
      if (this.idx >= events.length) {
        if (this.loopIndex < 0 || loopLen <= 0) return;
        this.iter++;
        this.idx = this.loopIndex;
      }
      const e = events[this.idx];
      const beat =
        this.iter === 0
          ? e.t
          : this.lengthBeats + (this.iter - 1) * loopLen + (e.t - this.loopBeat);
      const time = this.start + beat * this.spb;
      if (time > until || time >= this.stopAt) return;
      if ('param' in e) this.automate(e, time);
      else if (time >= skipBefore) this.fire(e, time);
      this.idx++;
    }
  }

  private automate(e: AutoEvent, time: number) {
    const bus = this.parts.get(e.p)!;
    if (e.param === 'cutoff' && bus.filter) {
      const f = bus.filter.frequency;
      f.setValueAtTime(e.from, time);
      if (e.d > 0) f.exponentialRampToValueAtTime(e.to, time + e.d * this.spb);
    } else if (e.param === 'vol') {
      const g = bus.input.gain;
      g.setValueAtTime(e.from * bus.vol, time);
      if (e.d > 0) g.linearRampToValueAtTime(e.to * bus.vol, time + e.d * this.spb);
    }
  }

  private fire(e: NoteEvent, time: number) {
    const def = this.track.parts[e.p],
      bus = this.parts.get(e.p)!;
    INSTRUMENTS[def.inst].voice(this.kit, bus.out, time, e.m, e.d * this.spb, e.v);
    const sc = this.track.sidechain;
    if (sc && sc.part === e.p) {
      const g = this.duck.gain;
      g.setTargetAtTime(1 - sc.depth, time, 0.004);
      g.setTargetAtTime(1, time + 0.03, sc.release / 3);
    }
  }

  /** Fades the deck out from `when` and stops scheduling new notes after the fade. */
  stop(when: number, fade: number) {
    for (const p of [this.fader.gain, this.revSend.gain])
      p.setTargetAtTime(0, when, fade / 4 + 0.001);
    this.stopAt = Math.min(this.stopAt, when + fade);
  }

  dispose() {
    for (const bus of this.parts.values()) bus.out.dispose();
    this.fader.disconnect();
    this.revSend.disconnect();
  }
}

export class MusicPlayer {
  readonly ctx: BaseAudioContext;
  readonly out: AudioNode;
  readonly reverbIn: GainNode;
  decks: Deck[] = [];

  constructor(ctx: BaseAudioContext, out: AudioNode) {
    this.ctx = ctx;
    this.out = out;
    this.reverbIn = ctx.createGain();
    const hp = ctx.createBiquadFilter(),
      conv = ctx.createConvolver(),
      ret = ctx.createGain();
    hp.type = 'highpass';
    hp.frequency.value = 200;
    conv.buffer = impulse(ctx, 2.8);
    ret.gain.value = 0.8;
    this.reverbIn.connect(hp).connect(conv).connect(ret).connect(out);
  }

  play(track: Track, when: number, fadeIn = 0) {
    const deck = new Deck(this, track, when, fadeIn);
    this.decks.push(deck);
    return deck;
  }

  /** Schedules all decks up to `until`, skipping notes already in the past, and drops finished decks. */
  schedule(until: number, now = this.ctx.currentTime) {
    for (const deck of this.decks) deck.schedule(until, now - 0.02);
    this.decks = this.decks.filter((deck) => {
      const done = now > deck.stopAt + 6;
      if (done) deck.dispose();
      return !done;
    });
  }
}
