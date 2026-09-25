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
import { RANGED } from '../data/gear.ts';
import { setActiveRealm } from '../data/realms/index.ts';
import { biomeAt, layerAt, lavaAt, syncPocket } from '../data/world.ts';
import { RULES } from './rules.ts';

import { Ailments } from './systems/Ailments.ts';
import { Armoury } from './systems/Armoury.ts';
import { Bosses } from './systems/Bosses.ts';
import { Unmaker } from './systems/Unmaker.ts';
import { Combat } from './systems/Combat.ts';
import { Consumables } from './systems/Consumables.ts';
import { Crafting } from './systems/Crafting.ts';
import { Dev, newDevState } from './systems/Dev.ts';
import { Drops } from './systems/Drops.ts';
import { Effergy } from './systems/Effergy.ts';
import { Environment } from './systems/Environment.ts';
import { Equipment, HOTBAR_SLOTS } from './systems/Equipment.ts';
import { Hands } from './systems/Hands.ts';
import { Interaction } from './systems/Interaction.ts';
import { Inventory } from './systems/Inventory.ts';
import { Larder } from './systems/Larder.ts';
import { Physics } from './systems/Physics.ts';
import { Pocket } from './systems/Pocket.ts';
import { Progress } from './systems/Progress.ts';
import { Realms } from './systems/Realms.ts';
import { STATION_LINES } from '../data/stations.ts';
import { Feats } from './systems/Feats.ts';
import { Skills } from './systems/Skills.ts';
import { Survival } from './systems/Survival.ts';
import { Durability } from './systems/Durability.ts';
import { ArmourForge } from './systems/ArmourForge.ts';
import { Terrain } from './systems/Terrain.ts';
import { Town } from './systems/Town.ts';
import { Wildlife } from './systems/Wildlife.ts';
import { LAYOUT, SaveSystem } from './SaveSystem.ts';
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
  readonly durability = new Durability(this);
  readonly armourForge = new ArmourForge(this);
  readonly ailments = new Ailments(this);
  readonly larder = new Larder(this);
  readonly physics = new Physics(this);
  readonly wildlife = new Wildlife(this);
  readonly effergy = new Effergy(this);
  readonly drops = new Drops(this);
  readonly equipment = new Equipment(this);
  readonly combat = new Combat(this);
  readonly armoury = new Armoury(this);
  readonly skills = new Skills(this);
  readonly feats = new Feats(this);
  readonly bosses = new Bosses(this);
  readonly unmaker = new Unmaker(this);
  readonly realms = new Realms(this);
  readonly pocket = new Pocket(this);
  readonly hands = new Hands(this);
  readonly town = new Town(this);
  readonly devtools = new Dev(this);
  readonly world = new WorldGenerator(this);
  readonly saves = new SaveSystem(this);

  constructor(seed: number = RULES.defaultSeed) {
    this.newGame(seed);
  }

  /** Starts a fresh expedition from a seed, in the Training Grounds if asked. */
  newGame(seed: number = RULES.defaultSeed, opts: { tutorial?: boolean } = {}): this {
    this.rng = seededRandom(seed);
    // A fresh world starts with the pocket strip empty.
    setActiveRealm(null);
    syncPocket();
    this.s = {
      version: 3,
      layout: LAYOUT,
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
        vitamins: 70,
      },
      disease: null,
      ailments: [],
      immune: {},
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
      hotbar: new Array(HOTBAR_SLOTS).fill(null),
      hotbarIndex: 0,
      accessories: [],
      maxHealth: 100,
      mana: 20,
      maxMana: 20,
      buffs: {},
      bosses: {},
      rift: { sigils: [] },
      wallEdits: {},
      spawn: null,
      town: { homes: {} },
      pocket: null,
      realms: {},
      armoury: {},
      meta: { renown: 0, skills: [], mastery: {}, feats: [] },
      placing: null,
      dead: false,
      lastSave: Date.now(),
    };
    this.messages = [];
    this.events = [];
    this.combat.projectiles = [];
    this.world.generate();
    this.s.player.y = this.groundTopAt(RULES.spawnX) + 1;
    // The expedition sets out in plain clothes: a linen underlayer and a hide vest.
    for (const id of ['linen_underlayer', 'hide_vest']) {
      this.inventory.add(id, 1);
      this.equipment.wear(id);
    }
    this.messages = [];
    if (opts.tutorial) this.pocket.startCourse();
    else this.say('Field record I · Stranded in the meadow. Find wood, stone, and fiber.');
    return this;
  }

  /** Advances the whole simulation by one frame. */
  tick(dt: number) {
    if (this.s.dead) return;
    dt = clamp(dt, 0, RULES.maxTickSeconds);
    // Hype moments slow the world; the Unmaker's own clock keeps real time with its music.
    this.unmaker.tickClock(dt);
    dt *= this.unmaker.timeScale();
    this.environment.advance(dt);
    this.survival.advanceDecay(dt);
    this.progress.discover();
    this.environment.collectRain(dt);
    this.s.player.invuln = Math.max(0, this.s.player.invuln - dt);
    for (const a of this.s.animals) this.wildlife.step(a, dt);
    this.combat.step(dt);
    this.drops.step(dt);
    this.equipment.update(dt);
    this.realms.update(dt);
    this.pocket.update(dt);
    this.feats.update();
    this.town.update(dt);
    this.ailments.update(dt);
    this.durability.update(dt);
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
    // The old kilns of the Ashen Steppe still burn hot enough to smelt.
    // Upgraded stations do the work of the ones below them.
    const ok = (t: string) =>
      t === type || (type === 'furnace' && t === 'kiln') || !!STATION_LINES[t]?.includes(type);
    return this.s.structures.find((st) => ok(st.type) && dist(st, this.s.player) <= radius);
  }
  nearLitFire() {
    // A hearth or a kitchen keeps its fire without feeding.
    const hearth = this.s.structures.find(
      (st) => (st.type === 'hearth' || st.type === 'kitchen') && dist(st, this.s.player) <= 155,
    );
    if (hearth) return hearth;
    const f = this.near('campfire', 155);
    return f && f.fuel > 0 ? f : null;
  }
  sheltered() {
    return !!this.near('shelter', 130);
  }
  /** Relics set on a shelf at camp (as many as renown allows). */
  shelvedRelics() {
    return this.skills.shelved();
  }
  cooled() {
    return !!this.larder.nearest();
  }
  /** The item in the player's hand: the active quick slot, else the ready weapon. */
  heldItem() {
    return this.equipment.held() ?? this.s.player.weapon;
  }
  /** Seconds one use of an item takes (the swing animation length). */
  useDuration(id: string) {
    return RANGED[id] ? RANGED[id].delay : 0.3;
  }
  /** Uses the held item toward a world point (the mouse cursor). */
  useAt(x: number, y: number) {
    return this.hands.useAt({ x, y });
  }
  /** Most health the player can have. */
  maxHealth() {
    return this.equipment.maxHealth();
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
  wallAt(tx: number, ty: number) {
    return this.terrain.wallAt(tx, ty);
  }
  wallEditAt(tx: number, ty: number) {
    return this.terrain.wallEditAt(tx, ty);
  }
  setWall(tx: number, ty: number, kind: number) {
    this.terrain.setWall(tx, ty, kind);
  }
  setTile(tx: number, ty: number, kind: number) {
    this.terrain.setTile(tx, ty, kind);
  }
  mineTileAt(x: number, y: number): GameResult {
    if (this.unmaker.frozen()) return { ok: false, reason: '' };
    return this.terrain.mineTileAt(x, y);
  }
  jump() {
    if (this.unmaker.frozen()) return false;
    return this.physics.jump();
  }
  move(dx: number, dy: number, dt: number) {
    // An entrance holds you where you stand.
    if (this.unmaker.frozen()) [dx, dy] = [0, 0];
    this.physics.move(dx, dy, dt * this.unmaker.timeScale());
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
  bestTool(kind: string) {
    return this.inventory.bestTool(kind);
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
    if (this.unmaker.frozen()) return { ok: false, reason: '' };
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
    if (this.unmaker.frozen()) return { ok: false, reason: '' };
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
