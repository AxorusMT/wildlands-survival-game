import { createMusicChain, MusicPlayer, type Deck } from './engine.ts';
import { TRACKS } from './tracks/index.ts';

const saved: Partial<{ music: number; sfx: number }> = (() => {
  try {
    return JSON.parse(localStorage.getItem('wildlands-audio') || '{}') as Partial<{
      music: number;
      sfx: number;
    }>;
  } catch {
    return {};
  }
})();
const settings = { music: saved.music ?? 0.55, sfx: saved.sfx ?? 0.6 };
/** Seconds of music scheduled ahead of the clock. */
const LOOKAHEAD = 1.2;
/** How long a new surface scene must hold before the music follows it. */
const SCENE_SETTLE = 1.5;
/** Scenes that cut in (or out) without waiting for the scene to settle. */
const URGENT = new Set(['menu', 'boss', 'fallen']);
let ac: AudioContext | undefined;
let master: GainNode | undefined;
let musicGain: GainNode | undefined;
let muffle: BiquadFilterNode | undefined;
let sfxBus: GainNode | undefined;
let player: MusicPlayer | undefined;
let deck: Deck | undefined;
let current: string | undefined;
let desired = 'menu',
  desiredSince = 0,
  muffled = false;

const musicLevel = () => settings.music ** 2;

function init() {
  if (ac) return;
  const C = window.AudioContext;
  if (!C) return;
  ac = new C();
  const limiter = ac.createDynamicsCompressor();
  limiter.threshold.value = -3;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.15;
  master = ac.createGain();
  master.gain.value = 0.9;
  master.connect(limiter).connect(ac.destination);
  musicGain = ac.createGain();
  musicGain.gain.value = musicLevel();
  musicGain.connect(master);
  const chain = createMusicChain(ac, musicGain);
  muffle = chain.muffle;
  player = new MusicPlayer(ac, chain.input);
  sfxBus = ac.createGain();
  sfxBus.gain.value = settings.sfx * 0.8;
  sfxBus.connect(master);
  setInterval(tick, 100);
}
function start() {
  init();
  ac?.resume();
}
function switchTo(id: string, now: number) {
  if (!player) return;
  const quick = id === 'boss' || id === 'fallen';
  deck?.stop(now, quick ? 0.8 : 2.5);
  deck = player.play(TRACKS[id] ?? TRACKS.meadow, now + 0.08, current ? (quick ? 0.25 : 1.5) : 0);
  current = id;
}
// Follows the scene and keeps the next second of music scheduled.
function tick() {
  if (!ac || !player || ac.state !== 'running') return;
  const now = ac.currentTime;
  if (desired !== current) {
    const urgent = !current || URGENT.has(desired) || URGENT.has(current);
    if (urgent || now - desiredSince > SCENE_SETTLE) switchTo(desired, now);
  }
  player.schedule(now + LOOKAHEAD, now);
}
function tone(
  freq: number,
  when: number,
  duration: number,
  type: OscillatorType = 'sine',
  vol = 0.1,
  bus = sfxBus,
) {
  if (!ac || !bus) return;
  const osc = ac.createOscillator(),
    gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(30, freq), when);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), when + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  osc.connect(gain).connect(bus);
  osc.start(when);
  osc.stop(when + duration + 0.02);
}
/** Chooses the track for the current scene; see `musicScene`. */
function setScene(v: string) {
  if (v === desired) return;
  desired = v;
  desiredSince = ac?.currentTime ?? 0;
}
/** Dulls the music while the journal is open over the game. */
function setMuffled(on: boolean) {
  if (on === muffled || !ac || !muffle) return;
  muffled = on;
  muffle.frequency.setTargetAtTime(on ? 900 : 20000, ac.currentTime, 0.12);
}
function effect(kind: string) {
  start();
  const audio = ac;
  if (!audio) return;
  const pitches: Record<string, number[]> = {
    gather: [280, 420],
    craft: [330, 495, 660],
    hit: [155, 105],
    hurt: [105, 72],
    page: [380, 290],
    boss: [110, 82, 61],
    victory: [330, 440, 550, 770],
    mine: [170, 120],
    jump: [260, 370],
    fish: [315, 420],
    fell: [130, 92, 70, 58],
    crumble: [210, 150, 110],
    pickup: [660, 880],
    sizzle: [900, 700],
  };
  const seq = pitches[kind] || pitches.page;
  seq.forEach((f, i) =>
    tone(
      f,
      audio.currentTime + i * 0.075,
      kind === 'fell' ? 0.3 : kind === 'pickup' ? 0.09 : 0.16,
      kind === 'hurt' || kind === 'boss' || kind === 'sizzle' ? 'sawtooth' : 'triangle',
      kind === 'pickup' ? 0.07 : kind === 'fell' ? 0.22 : 0.17,
      sfxBus,
    ),
  );
}
function setVolumes(m: number, s: number) {
  settings.music = Math.max(0, Math.min(1, m));
  settings.sfx = Math.max(0, Math.min(1, s));
  if (ac && musicGain) musicGain.gain.setTargetAtTime(musicLevel(), ac.currentTime, 0.05);
  if (ac && sfxBus) sfxBus.gain.setTargetAtTime(settings.sfx * 0.8, ac.currentTime, 0.05);
  localStorage.setItem('wildlands-audio', JSON.stringify(settings));
}
/** Title of the track playing now, if any. */
function nowPlaying() {
  return current ? TRACKS[current]?.title : undefined;
}
export const Audio = { start, effect, setScene, setMuffled, setVolumes, nowPlaying, settings };
