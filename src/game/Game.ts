import { clamp, dist } from '../core/math.ts';
import { seededRandom } from '../core/random.ts';
import type { Rng } from '../core/random.ts';
import type {
  GameMessage,
  GameResult,
  WorldEvent,
  GameState,
  InventoryEntry,
  ResourceNode,
  SaveStorage,
  Structure,
} from '../core/types.ts';
import { biomeAt, layerAt, lavaAt } from '../data/world.ts';
import { RULES } from './rules.ts';

import { Consumables } from './systems/Consumables.ts';
import { Crafting } from './systems/Crafting.ts';
import { Dev, newDevState } from './systems/Dev.ts';
import { Drops } from './systems/Drops.ts';
import { Effergy } from './systems/Effergy.ts';
import { Environment } from './systems/Environment.ts';
import { Interaction } from './systems/Interaction.ts';
import { Inventory } from './systems/Inventory.ts';
import { Physics } from './systems/Physics.ts';
import { Progress } from './systems/Progress.ts';
import { Survival } from './systems/Survival.ts';
import { Terrain } from './systems/Terrain.ts';
import { Wildlife } from './systems/Wildlife.ts';
import { SaveSystem } from './SaveSystem.ts';
import { WorldGenerator } from './WorldGenerator.ts';
/**
 * The expedition simulation. Game owns the saved record (`s`), the seeded random source, and
 * the message log; each concern lives in its own system under ./systems. The methods below are
 * the public surface used by the interface, the renderer, and the tests.
 */
export class Game {
  s!: GameState;
  rng!: Rng;
  messages!: GameMessage[];
  /** Passing events for effects and sound; not saved. */
  events: WorldEvent[] = [];
  /** Field-console switches for this session; not saved. */
  dev = newDevState();

  readonly terrain = new Terrain(this);
  readonly environment = new Environment(this);
  readonly inventory = new Inventory(this);
  readonly progress = new Progress(this);
  readonly crafting = new Crafting(this);
  readonly interaction = new Interaction(this);
  readonly consumables = new Consumables(this);
  readonly survival = new Survival(this);
  readonly physics = new Physics(this);
  readonly wildlife = new Wildlife(this);
  readonly effergy = new Effergy(this);
  readonly drops = new Drops(this);
  readonly devtools = new Dev(this);
  readonly world = new WorldGenerator(this);
  readonly saves = new SaveSystem(this);

  constructor(seed: number = RULES.defaultSeed) {
    this.newGame(seed);
  }

  /** Starts a fresh expedition from a seed. */
  newGame(seed: number = RULES.defaultSeed): this {
    this.rng = seededRandom(seed);
    this.s = {
      version: 3,
      layout: 3,
      seed,
      elapsed: 0,
      day: 1,
      weather: 'clear',
      weatherNext: 170,
      player: {
        x: RULES.spawnX,
        y: 0,
        vx: 0,
        vy: 0,
        grounded: true,
        face: 0,
        moving: false,
        weapon: 'fists',
        cloak: false,
        coat: false,
        boots: false,
        attackAt: 0,
        invuln: 0,
      },
      vitals: {
        health: 100,
        hydration: 68,
        calories: 70,
        protein: 65,
        stamina: 100,
        fatigue: 12,
        bodyTemp: 37,
        wetness: 0,
        illness: 0,
        infection: 0,
        hygiene: 80,
        morale: 73,
      },
      disease: null,
      inventory: [],
      nodes: [],
      animals: [],
      structures: [],
      caches: [],
      tiles: [],
      tileEdits: {},
      drops: [],
      effects: [],
      tutorial: { step: 0, tally: {} },
      chapter: 0,
      discoveries: ['meadow'],
      altar: { level: 1, xp: 0, attuned: null, kills: 0, activeBoss: null },
      placing: null,
      dead: false,
      lastSave: Date.now(),
    };
    this.messages = [];
    this.events = [];
    this.world.generate();
    this.s.player.y = this.groundTopAt(RULES.spawnX) + 1;
    this.say('Field record I · Stranded in the meadow. Find wood, stone, and fiber.');
    return this;
  }

  /** Advances the whole simulation by one frame. */
  tick(dt: number) {
    if (this.s.dead) return;
    dt = clamp(dt, 0, RULES.maxTickSeconds);
    this.environment.advance(dt);
    this.survival.advanceDecay(dt);
    this.progress.discover();
    this.environment.collectRain(dt);
    this.s.player.invuln = Math.max(0, this.s.player.invuln - dt);
    for (const a of this.s.animals) this.wildlife.step(a, dt);
    this.drops.step(dt);
    this.survival.update(dt);
    this.devtools.sustain();
  }

  event(type: WorldEvent['type'], x: number, y: number, kind: string, dir?: number, v?: number) {
    this.events.push({ type, x, y, kind, dir, v });
    if (this.events.length > 64) this.events.shift();
  }
  /** A sound effect at a place in the world (the player's position by default). */
  sound(name: string, x = this.s.player.x, y = this.s.player.y - 20, v = 1) {
    this.event('sfx', x, y, name, undefined, v);
  }
  /** Hands over and clears the events since the last call. */
  takeEvents() {
    const out = this.events;
    this.events = [];
    return out;
  }

  say(message: string, tone = 'ink') {
    this.messages.unshift({ message, tone, at: this.s.elapsed });
    this.messages.length = Math.min(this.messages.length, 8);
  }

  // ─── Place and surroundings ───────────────────────────────────────────────
  biome(x = this.s.player.x, y = this.s.player.y) {
    return biomeAt(x, y);
  }
  layer(x = this.s.player.x, y = this.s.player.y) {
    return layerAt(x, y);
  }
  inLava() {
    const p = this.s.player;
    return lavaAt(p.x, p.y - 8);
  }
  near(type: string, radius = 110) {
    return this.s.structures.find((st) => st.type === type && dist(st, this.s.player) <= radius);
  }
  nearLitFire() {
    const f = this.near('campfire', 155);
    return f && f.fuel > 0 ? f : null;
  }
  sheltered() {
    return !!this.near('shelter', 130);
  }
  cooled() {
    const ice = this.near('icebox', 135);
    return !!(ice && ice.fuel > 0);
  }
  timeOfDay() {
    return this.environment.timeOfDay();
  }
  isNight() {
    return this.environment.isNight();
  }
  temperature() {
    return this.environment.temperature();
  }

  // ─── Terrain and movement ─────────────────────────────────────────────────
  tileAt(tx: number, ty: number) {
    return this.terrain.tileAt(tx, ty);
  }
  groundTopAt(x: number) {
    return this.terrain.groundTopAt(x);
  }
  floorNear(x: number, y: number) {
    return this.terrain.floorNear(x, y);
  }
  setTile(tx: number, ty: number, kind: number) {
    this.terrain.setTile(tx, ty, kind);
  }
  mineTileAt(x: number, y: number): GameResult {
    return this.terrain.mineTileAt(x, y);
  }
  jump() {
    return this.physics.jump();
  }
  move(dx: number, dy: number, dt: number) {
    this.physics.move(dx, dy, dt);
  }

  // ─── Pack ─────────────────────────────────────────────────────────────────
  count(id: string) {
    return this.inventory.count(id);
  }
  itemState(entry: InventoryEntry) {
    return this.inventory.itemState(entry);
  }
  add(id: string, qty = 1, options: { fresh?: number } = {}) {
    this.inventory.add(id, qty, options);
  }
  remove(id: string, qty = 1) {
    return this.inventory.remove(id, qty);
  }
  canAfford(cost: Record<string, number>) {
    return this.inventory.canAfford(cost);
  }
  toolTier(kind: string) {
    return this.inventory.toolTier(kind);
  }
  use(id: string): GameResult {
    return this.consumables.use(id);
  }

  // ─── Making and using things ──────────────────────────────────────────────
  /** Whether a recipe can be made right now (station, fuel, and materials, or a console unlock). */
  canCraft(id: string) {
    return this.crafting.check(id) === null;
  }
  /** Runs a field-console command and returns the lines to print. */
  command(line: string) {
    return this.devtools.run(line);
  }
  craft(id: string): GameResult {
    return this.crafting.craft(id);
  }
  place(id: string, x: number, y: number): GameResult {
    return this.crafting.place(id, x, y);
  }
  nearestInteractable(radius?: number) {
    return this.interaction.nearestInteractable(radius);
  }
  interact(): GameResult {
    return this.interaction.interact();
  }
  gather(node: ResourceNode): GameResult {
    return this.interaction.gather(node);
  }
  fish(): GameResult {
    return this.interaction.fish();
  }
  plant(st: Structure, crop: string): GameResult {
    return this.interaction.plant(st, crop);
  }
  storeInChest(chest: Structure, id: string): GameResult {
    return this.interaction.storeInChest(chest, id);
  }
  takeFromChest(chest: Structure, id: string): GameResult {
    return this.interaction.takeFromChest(chest, id);
  }

  // ─── Body ─────────────────────────────────────────────────────────────────
  wash(): GameResult {
    return this.survival.wash();
  }
  contract(disease: string) {
    this.survival.contract(disease);
  }
  vitalReasons() {
    return this.survival.vitalReasons();
  }
  recover() {
    this.survival.recover();
  }

  // ─── Hunting and the Effergy ──────────────────────────────────────────────
  attack(): GameResult {
    return this.wildlife.attack();
  }
  attune(mob?: string): GameResult {
    return this.effergy.attune(mob);
  }
  upgradeAltar(): GameResult {
    return this.effergy.upgradeAltar();
  }

  // ─── Field record ─────────────────────────────────────────────────────────
  save(storage?: SaveStorage, silent?: boolean) {
    return this.saves.save(storage, silent);
  }
  load(storage?: SaveStorage) {
    return this.saves.load(storage);
  }
}
