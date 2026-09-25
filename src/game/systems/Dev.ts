import { clamp } from '../../core/math.ts';
import { ITEMS, itemName } from '../../data/items.ts';
import { RECIPES } from '../../data/recipes.ts';
import { MOBS as MOB_SPECS } from '../../data/mobs.ts';
import {
  BIOME_SPANS,
  DIMENSIONS,
  DUNGEONS,
  LAVA_Y,
  LAYERS,
  WORLD_H,
  WORLD_W,
  caveY,
  underworldFloor,
} from '../../data/world.ts';
import { REALMS } from '../../data/realms/index.ts';
import { uniqueId } from '../ids.ts';
import { RULES } from '../rules.ts';
import { ANIMAL_HP } from '../WorldGenerator.ts';

import { System } from './System.ts';

/** Developer switches. They live for the session and are never written to the field record. */
export interface DevState {
  god: boolean;
  noclip: boolean;
  speed: number;
  unlocked: Set<string>;
}
export const newDevState = (): DevState => ({
  god: false,
  noclip: false,
  speed: 1,
  unlocked: new Set(),
});

/** Everything the console can summon: every creature and boss, and the Direwolf. */
export const MOBS = [...Object.keys(MOB_SPECS), 'direwolf'];
const FLIERS = ['bat', 'ember_bat'];
/** Places the console can send you, beyond regions and layers. */
const PLACES = [...DUNGEONS.map((d) => d.def.id), ...DIMENSIONS.map((d) => d.id)];
const TIMES: Record<string, number> = {
  dawn: 6 * 60,
  morning: 9 * 60,
  noon: 12 * 60,
  dusk: 19 * 60,
  night: 22 * 60,
  midnight: 0,
};
const WEATHERS = ['clear', 'cloudy', 'rain', 'storm'];

interface Command {
  usage: string;
  help: string;
  run: (args: string[]) => string[];
}

/** Finds an id by exact id, exact name, or unique prefix of either. */
function resolve(query: string, ids: string[], name = (id: string) => id) {
  const q = query.toLowerCase().replace(/\s+/g, '_');
  const exact = ids.find((id) => id === q || name(id).toLowerCase().replace(/\s+/g, '_') === q);
  if (exact) return { id: exact };
  const matches = ids.filter(
    (id) => id.startsWith(q) || name(id).toLowerCase().replace(/\s+/g, '_').startsWith(q),
  );
  if (matches.length === 1) return { id: matches[0] };
  return { matches };
}

/** The field console: cheats and tools for testing the expedition. */
export class Dev extends System {
  readonly commands: Record<string, Command> = {
    help: {
      usage: 'help [command]',
      help: 'List commands, or explain one.',
      run: ([name]) => {
        if (name && this.commands[name]) {
          const c = this.commands[name];
          return [c.usage, c.help];
        }
        return [
          'Commands (Tab completes, ↑/↓ recalls):',
          ...Object.values(this.commands).map((c) => `  ${c.usage.padEnd(28)} ${c.help}`),
        ];
      },
    },
    give: {
      usage: 'give <item> [qty]',
      help: 'Put items straight into the pack.',
      run: (args) => {
        // Names may have spaces ("give obsidian pick 2"); a trailing number is the quantity.
        const n = /^\d+$/.test(args[args.length - 1] ?? '') ? args.pop() : undefined,
          query = args.join('_');
        if (!query) return ['! Usage: give <item> [qty]. Try "items" for ids.'];
        const found = resolve(query, Object.keys(ITEMS), itemName);
        if (!found.id) return this.ambiguous('item', query, found.matches);
        const qty = clamp(Math.floor(Number(n ?? 1)) || 1, 1, 9999);
        this.game.add(found.id, qty);
        return [`Gave ${qty} × ${itemName(found.id)}.`];
      },
    },
    items: {
      usage: 'items [filter]',
      help: 'List item ids.',
      run: ([f]) =>
        this.list(Object.keys(ITEMS).filter((id) => !f || id.includes(f.toLowerCase()))),
    },
    recipes: {
      usage: 'recipes [filter]',
      help: 'List recipe ids, marking unlocked ones.',
      run: ([f]) =>
        this.list(
          RECIPES.filter((r) => !f || r.id.includes(f.toLowerCase())).map(
            (r) => r.id + (this.game.dev.unlocked.has(r.id) ? '*' : ''),
          ),
        ),
    },
    unlock: {
      usage: 'unlock <recipe|all>',
      help: 'Make a recipe craftable anywhere, without materials.',
      run: (args) => this.setLock(args.join('_'), true),
    },
    lock: {
      usage: 'lock <recipe|all>',
      help: 'Return recipes to their normal station and material costs.',
      run: (args) => this.setLock(args.join('_'), false),
    },
    god: {
      usage: 'god',
      help: 'Toggle godmode: no damage, needs always met.',
      run: () => [`Godmode ${(this.game.dev.god = !this.game.dev.god) ? 'on' : 'off'}.`],
    },
    noclip: {
      usage: 'noclip',
      help: 'Toggle flying through rock; WASD moves freely.',
      run: () => {
        const on = (this.game.dev.noclip = !this.game.dev.noclip);
        if (!on) this.game.s.player.vy = 0;
        return [`Noclip ${on ? 'on' : 'off'}.`];
      },
    },
    speed: {
      usage: 'speed <multiplier>',
      help: 'Scale walking and noclip speed (1 is normal).',
      run: ([n]) => {
        const v = Number(n);
        if (!(v > 0)) return ['! Usage: speed <multiplier>, e.g. speed 3.'];
        this.game.dev.speed = clamp(v, 0.1, 20);
        return [`Speed ×${this.game.dev.speed}.`];
      },
    },
    summon: {
      usage: 'summon <mob> [count]',
      help: 'Summon creatures beside you: ' + MOBS.join(', ') + '.',
      run: ([query, n]) => {
        if (!query) return ['! Usage: summon <mob> [count]. Mobs: ' + MOBS.join(', ')];
        const found = resolve(query === 'boss' ? 'direwolf' : query, MOBS);
        if (!found.id) return this.ambiguous('mob', query, found.matches);
        const p = this.game.s.player,
          side = Math.cos(p.face) >= 0 ? 1 : -1;
        if (found.id === 'direwolf') {
          if (this.game.s.altar.activeBoss) return ['! A Direwolf hunt is already under way.'];
          this.game.effergy.summonBoss({ x: p.x + side * 260, y: p.y });
          return ['The Direwolf answers.'];
        }
        const count = clamp(Math.floor(Number(n ?? 1)) || 1, 1, 30);
        const spec = MOB_SPECS[found.id];
        if (spec?.boss) {
          const r = this.game.bosses.summon({ x: p.x + side * 60, y: p.y, kind: found.id }, true);
          return r.ok ? [spec.name + ' answers.'] : ['! ' + r.reason];
        }
        if (
          spec &&
          !['deer', 'wolf', 'boar', 'bat', 'scorpion', 'ember_bat', 'hellhound'].includes(found.id)
        ) {
          for (let i = 0; i < count; i++) {
            const x = p.x + side * (140 + i * 46);
            this.game.world.addAnimal(
              found.id,
              x,
              spec.move === 'walker' || spec.move === 'hopper'
                ? this.game.floorNear(x, p.y - 20)
                : p.y - 90,
              { body: true, vx: 0, vy: 0 },
            );
          }
          return [`Summoned ${count} × ${spec.name.toLowerCase()}.`];
        }
        for (let i = 0; i < count; i++) {
          const x = clamp(p.x + side * (140 + i * 46), 30, WORLD_W - 30),
            flier = FLIERS.includes(found.id),
            hp = ANIMAL_HP[found.id];
          const a = {
            id: uniqueId(),
            type: found.id,
            x,
            y: flier ? p.y - 70 : this.game.floorNear(x, p.y - 20),
            homeX: x,
            homeY: p.y,
            hp,
            maxHp: hp,
            angle: side > 0 ? Math.PI : 0,
            wanderAt: 0,
            attackAt: this.game.s.elapsed + 1,
            deadUntil: 0,
            warning: 0,
            phase: i,
            ...(flier ? { hoverY: p.y - 70 } : { walkY: p.y }),
          };
          this.game.s.animals.push(a);
        }
        return [`Summoned ${count} × ${found.id.replace('_', ' ')}.`];
      },
    },
    kill: {
      usage: 'kill [radius|all]',
      help: 'Slay creatures near you (default 600 px).',
      run: ([r]) => {
        const p = this.game.s.player,
          radius = r === 'all' ? Infinity : Number(r ?? 600) || 600;
        let n = 0;
        for (const a of this.game.s.animals)
          if (!a.deadUntil && Math.hypot(a.x - p.x, a.y - p.y) <= radius) {
            a.hp = 0;
            this.game.wildlife.kill(a);
            n++;
          }
        return [`Slew ${n} creature${n === 1 ? '' : 's'}.`];
      },
    },
    heal: {
      usage: 'heal',
      help: 'Restore every vital and cure illness.',
      run: () => {
        this.restore();
        return ['Fully restored.'];
      },
    },
    tp: {
      usage: 'tp <x [y] | biome | layer | dungeon | dimension>',
      help: 'Teleport to a position, region, depth layer, dungeon (crypt, frost_keep, tomb, citadel), or dimension (mycelia, skyreach, void).',
      run: (args) => this.teleport(args),
    },
    time: {
      usage: 'time <hh:mm | dawn | noon | dusk | night>',
      help: 'Set the time of day.',
      run: ([when]) => {
        const named = when ? TIMES[when.toLowerCase()] : undefined,
          m = /^(\d{1,2}):(\d{2})$/.exec(when ?? '');
        const minutes = named ?? (m ? +m[1] * 60 + +m[2] : NaN);
        if (!(minutes >= 0 && minutes < RULES.minutesPerDay))
          return ['! Usage: time <hh:mm | ' + Object.keys(TIMES).join(' | ') + '>'];
        const s = this.game.s,
          now = (RULES.minutesAtStart + s.elapsed * RULES.minutesPerSecond) % RULES.minutesPerDay;
        s.elapsed +=
          ((((minutes - now) % RULES.minutesPerDay) + RULES.minutesPerDay) % RULES.minutesPerDay) /
          RULES.minutesPerSecond;
        return [
          `Time set to ${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}.`,
        ];
      },
    },
    weather: {
      usage: 'weather <clear|cloudy|rain|storm>',
      help: 'Change the weather.',
      run: ([w]) => {
        if (!WEATHERS.includes(w)) return ['! Usage: weather <' + WEATHERS.join('|') + '>'];
        this.game.s.weather = w;
        this.game.s.weatherNext = this.game.s.elapsed + RULES.weatherBaseSeconds;
        return [`Weather: ${w}.`];
      },
    },
    realm: {
      usage: 'realm <id> [tier] | realm home | realm close',
      help: 'Open a generated realm (orchard, steppe, warren) at a tier and step in, go home, or collapse it.',
      run: ([id, tier]) => {
        const pocket = this.game.pocket;
        if (id === 'home') return pocket.leave().ok ? ['Home.'] : ['! No realm is open.'];
        if (id === 'close') {
          pocket.close();
          return ['The realm collapses.'];
        }
        const tpl = REALMS.find((r) => r.id === id);
        if (!tpl) return ['! Usage: realm <' + REALMS.map((r) => r.id).join('|') + '> [1-5]'];
        const t = Math.max(1, Math.min(5, Number(tier) || 1)),
          rec = pocket.record(tpl.id),
          god = this.game.dev.god;
        rec.best = Math.max(rec.best, t - 1);
        this.game.dev.god = true;
        const r = pocket.open(tpl.id, t);
        this.game.dev.god = god;
        return r.ok
          ? [
              `Opened the ${tpl.name}, tier ${t}${this.game.s.pocket?.mods.length ? ' · ' + this.game.s.pocket.mods.join(', ') : ''}.`,
            ]
          : ['! ' + r.reason];
      },
    },
    pos: {
      usage: 'pos',
      help: 'Show where you are.',
      run: () => {
        const p = this.game.s.player;
        return [
          `x ${Math.round(p.x)}, y ${Math.round(p.y)} · ${this.game.biome().name} · ${this.game.layer().name}`,
        ];
      },
    },
  };

  /** Runs one console line and returns the lines to print. Lines starting with ! are errors. */
  run(line: string): string[] {
    const [name, ...args] = line.trim().split(/\s+/);
    if (!name) return [];
    const cmd = this.commands[name.toLowerCase()];
    if (!cmd) return [`! Unknown command "${name}". Type help.`];
    return cmd.run(args);
  }

  /** Completions for the word being typed: commands first, then that command's arguments. */
  complete(line: string): string[] {
    const words = line.split(/\s+/),
      last = (words[words.length - 1] ?? '').toLowerCase();
    if (words.length <= 1) return Object.keys(this.commands).filter((c) => c.startsWith(last));
    const cmd = words[0].toLowerCase(),
      pool =
        cmd === 'give'
          ? Object.keys(ITEMS)
          : cmd === 'unlock' || cmd === 'lock'
            ? ['all', ...RECIPES.map((r) => r.id)]
            : cmd === 'summon'
              ? MOBS
              : cmd === 'realm'
                ? [...REALMS.map((r) => r.id), 'home', 'close']
                : cmd === 'tp'
                  ? [...BIOME_SPANS.map((b) => b.id), ...LAYERS.map((l) => l.id), ...PLACES]
                  : cmd === 'time'
                    ? Object.keys(TIMES)
                    : cmd === 'weather'
                      ? WEATHERS
                      : cmd === 'help'
                        ? Object.keys(this.commands)
                        : [];
    return words.length === 2 ? pool.filter((id) => id.startsWith(last)) : [];
  }

  /** Godmode keeps every need met; called each tick. */
  sustain() {
    if (!this.game.dev.god) return;
    this.restore();
  }

  private restore() {
    this.game.s.mana = this.game.equipment.maxMana();
    Object.assign(this.game.s.vitals, {
      health: this.game.maxHealth(),
      hydration: 100,
      calories: 100,
      protein: 100,
      stamina: 100,
      fatigue: 0,
      bodyTemp: 37,
      wetness: 0,
      illness: 0,
      infection: 0,
      hygiene: 100,
      morale: 100,
    });
    this.game.s.disease = null;
    this.game.s.dead = false;
  }

  private setLock(query: string | undefined, on: boolean) {
    const unlocked = this.game.dev.unlocked;
    if (!query) return [`! Usage: ${on ? 'unlock' : 'lock'} <recipe|all>`];
    if (query === 'all') {
      for (const r of RECIPES) if (on) unlocked.add(r.id);
      if (!on) unlocked.clear();
      return [on ? `Unlocked all ${RECIPES.length} recipes.` : 'All recipes locked again.'];
    }
    const found = resolve(
      query,
      RECIPES.map((r) => r.id),
      itemName,
    );
    if (!found.id) return this.ambiguous('recipe', query, found.matches);
    if (on) unlocked.add(found.id);
    else unlocked.delete(found.id);
    return [`${itemName(found.id)} ${on ? 'unlocked: craft it anywhere, for free' : 'locked'}.`];
  }

  private teleport(args: string[]) {
    const p = this.game.s.player;
    if (!args.length) return ['! Usage: tp <x [y] | biome | layer>'];
    const put = (x: number, y: number) => {
      p.x = clamp(x, 20, WORLD_W - 20);
      p.y = clamp(y, 40, WORLD_H - 20);
      p.vx = 0;
      p.vy = 0;
      return [`Teleported to ${Math.round(p.x)}, ${Math.round(p.y)} · ${this.game.layer().name}.`];
    };
    if (/^-?\d/.test(args[0])) {
      const x = Number(args[0]),
        y = args[1] !== undefined ? Number(args[1]) : this.game.groundTopAt(x) + 1;
      return put(x, y);
    }
    const target = args[0].toLowerCase();
    const dungeon = DUNGEONS.find((d) => d.def.id.startsWith(target));
    if (dungeon) {
      // Arrive outside the door: beside the facade, or at the Citadel's western gate.
      const x = dungeon.def.facade === 'none' ? dungeon.tx0 * 32 - 80 : dungeon.entrance.x - 400;
      const y = dungeon.def.facade === 'none' ? dungeon.entrance.y - 20 : this.game.groundTopAt(x);
      return put(x, this.game.floorNear(x, y - 40) + 1);
    }
    const dim = DIMENSIONS.find((d) => d.id.startsWith(target));
    if (dim) {
      const x = dim.start + dim.arrive + 80;
      return put(x, this.game.groundTopAt(x) + 1);
    }
    const span = BIOME_SPANS.find((s) => s.id.startsWith(target));
    if (span) return put(span.center, this.game.groundTopAt(span.center) + 1);
    const layer = LAYERS.find((l) => l.id.startsWith(target) || l.id.replace('_', '') === target);
    if (!layer) return [`! "${args[0]}" is not a position, region, or layer.`];
    if (layer.id === 'surface') return put(p.x, this.game.groundTopAt(p.x) + 1);
    if (layer.id === 'lower_hell') {
      for (let d = 0; d < WORLD_W; d += 64)
        for (const x of [p.x + d, p.x - d])
          if (x > 0 && x < WORLD_W && underworldFloor(x) < LAVA_Y - 40)
            return put(x, this.game.floorNear(x, underworldFloor(x) - 20) + 1);
    }
    const level = { upper_mines: 2, lower_mines: 4, upper_hell: 6 }[layer.id] ?? 2;
    return put(p.x, this.game.floorNear(p.x, caveY(p.x, level)) + 1);
  }

  private ambiguous(kind: string, query: string, matches?: string[]) {
    if (matches?.length)
      return [
        `! "${query}" could be: ${matches.slice(0, 12).join(', ')}${matches.length > 12 ? ', …' : ''}`,
      ];
    return [`! No ${kind} matches "${query}".`];
  }

  private list(ids: string[]) {
    if (!ids.length) return ['(none)'];
    const lines: string[] = [];
    for (let i = 0; i < ids.length; i += 6) lines.push('  ' + ids.slice(i, i + 6).join('  '));
    return lines;
  }
}
