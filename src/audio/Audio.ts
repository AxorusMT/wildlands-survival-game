import { createMusicChain, MusicPlayer, type Deck } from './engine.ts';
import { Ambience, playSfx, type AmbienceLevels } from './sfx.ts';
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
/** The Unmaker's themes cut in at once, so they land on what happens on screen. */
const cutsIn = (id: string) => id.startsWith('unmaker');
let ac: AudioContext | undefined;
let master: GainNode | undefined;
let musicGain: GainNode | undefined;
let muffle: BiquadFilterNode | undefined;
let sfxBus: GainNode | undefined;
let ambience: Ambience | undefined;
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
  ambience = new Ambience(ac, sfxBus);
  setInterval(tick, 100);
}
function start() {
  init();
  ac?.resume();
}
function switchTo(id: string, now: number) {
  if (!player) return;
  // A Silent realm: the music fades away entirely.
  if (id === 'silence') {
    deck?.stop(now, 2.5);
    deck = undefined;
    current = id;
    return;
  }
  const quick = id === 'boss' || id === 'fallen';
  // The Unmaker's theme cuts in at once, so its build lines up with the entrance on screen.
  const cut = cutsIn(id);
  deck?.stop(now, cut ? 0.3 : quick ? 0.8 : 2.5);
  deck = player.play(
    TRACKS[id] ?? TRACKS.meadow,
    now + 0.08,
    cut ? 0 : current ? (quick ? 0.25 : 1.5) : 0,
  );
  current = id;
}
// Follows the scene and keeps the next second of music scheduled.
function tick() {
  if (!ac || !player || ac.state !== 'running') return;
  const now = ac.currentTime;
  if (desired !== current) {
    const urgent =
      !current || URGENT.has(desired) || URGENT.has(current) || cutsIn(desired) || cutsIn(current);
    if (urgent || now - desiredSince > SCENE_SETTLE) switchTo(desired, now);
  }
  player.schedule(now + LOOKAHEAD, now);
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
/** Where the listener stands in the world, for panning and distance. */
const listener = { x: 0, y: 0 };
const lastPlayed = new Map<string, number>();
/** Sounds that come in bursts (pickups, steps) are thinned so they never pile up. */
const MIN_GAP: Record<string, number> = { pickup: 0.06, click: 0.04, hit: 0.05 };
function setListener(x: number, y: number) {
  listener.x = x;
  listener.y = y;
}
/**
 * Plays a named sound effect (see sfx.ts). With a world position it is panned toward its side
 * and fades with distance; sounds far off screen are skipped.
 */
function effect(kind: string, at?: { x: number; y: number }, strength = 1) {
  start();
  if (!ac || !sfxBus) return;
  const now = ac.currentTime,
    gap = MIN_GAP[kind] ?? (kind.startsWith('step') ? 0.12 : 0.03);
  if (now - (lastPlayed.get(kind) ?? -1) < gap) return;
  let pan = 0,
    level = strength;
  if (at) {
    const dx = at.x - listener.x,
      d = Math.hypot(dx, (at.y - listener.y) * 1.4);
    if (d > 1100) return;
    pan = Math.max(-0.85, Math.min(0.85, dx / 650));
    level *= 1 / (1 + (d / 420) ** 2);
  }
  lastPlayed.set(kind, now);
  const g = ac.createGain(),
    p = ac.createStereoPanner();
  g.gain.value = level;
  p.pan.value = pan;
  g.connect(p).connect(sfxBus);
  if (!playSfx(ac, g, kind, 1, now + 0.005)) playSfx(ac, g, 'click', 1, now + 0.005);
  // Let the little graph go once the sound has rung out.
  setTimeout(() => g.disconnect(), 4000);
}
/** Sets the weather, fire, lava, cave, and wildlife beds (each 0–1). */
function setAmbience(levels: AmbienceLevels) {
  if (!ac || !ambience || ac.state !== 'running') return;
  ambience.update(levels);
}
function setVolumes(m: number, s: number) {
  settings.music = Math.max(0, Math.min(1, m));
  settings.sfx = Math.max(0, Math.min(1, s));
  if (ac && musicGain) musicGain.gain.setTargetAtTime(musicLevel(), ac.currentTime, 0.05);
  if (ac && sfxBus) sfxBus.gain.setTargetAtTime(settings.sfx * 0.8, ac.currentTime, 0.05);
  localStorage.setItem('wildlands-audio', JSON.stringify(settings));
}
/** Silences the music for a moment (the screen has gone dark), or brings it back. */
function setHushed(on: boolean) {
  if (ac && musicGain)
    musicGain.gain.setTargetAtTime(on ? 0 : musicLevel(), ac.currentTime, on ? 0.02 : 0.08);
}
/** Title of the track playing now, if any. */
function nowPlaying() {
  return current ? TRACKS[current]?.title : undefined;
}
export const Audio = {
  start,
  effect,
  setListener,
  setAmbience,
  setScene,
  setMuffled,
  setHushed,
  setVolumes,
  nowPlaying,
  settings,
};
