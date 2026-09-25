import { clamp, dist } from '../../core/math.ts';
import { itemName } from '../../data/items.ts';
import { TILE, WORLD_H, WORLD_W, lavaAt } from '../../data/world.ts';
import { uniqueId } from '../ids.ts';

import { System } from './System.ts';

/** Materials pop out of what you break, settle on the ground, and fly to you when you are near. */
export const DROP_RULES = {
  gravity: 900,
  magnetRadius: 150,
  collectRadius: 26,
  pickupDelay: 0.3,
  mergeRadius: 26,
  maxDrops: 240,
} as const;

export class Drops extends System {
  /** Spawns a stack that pops upward; `delay` holds it back (a felled tree lands first). */
  spawn(item: string, qty: number, x: number, y: number, delay = 0) {
    if (qty <= 0) return;
    const drops = this.game.s.drops;
    drops.push({
      id: uniqueId(),
      item,
      qty,
      x: clamp(x, 10, WORLD_W - 10),
      y: y - 6,
      vx: (this.game.rng() - 0.5) * 130,
      vy: -170 - this.game.rng() * 90,
      born: this.game.s.elapsed + delay,
      resting: false,
    });
    if (drops.length > DROP_RULES.maxDrops) drops.splice(0, drops.length - DROP_RULES.maxDrops);
  }
  private solid(x: number, y: number) {
    return !!this.game.tileAt(Math.floor(x / TILE), Math.floor(y / TILE));
  }
  step(dt: number) {
    const s = this.game.s,
      p = s.player,
      centre = { x: p.x, y: p.y - 20 };
    for (let i = s.drops.length - 1; i >= 0; i--) {
      const d = s.drops[i];
      if (s.elapsed < d.born) continue;
      const near = dist(d, centre);
      if (
        !s.dead &&
        s.elapsed - d.born > DROP_RULES.pickupDelay &&
        near < DROP_RULES.magnetRadius
      ) {
        if (near < DROP_RULES.collectRadius) {
          s.drops.splice(i, 1);
          this.game.add(d.item, d.qty);
          this.game.event('pickup', d.x, d.y, d.item);
          this.game.sound('pickup', d.x, d.y, 0.8);
          this.game.say('+' + d.qty + ' ' + itemName(d.item), 'good');
          continue;
        }
        // Pulled in faster the closer it gets.
        const pull = 420 + (DROP_RULES.magnetRadius - near) * 9;
        d.vx = ((centre.x - d.x) / near) * pull;
        d.vy = ((centre.y - d.y) / near) * pull;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.resting = false;
        continue;
      }
      if (d.resting) {
        // Ground dug out from under a drop lets it fall again.
        if (!this.solid(d.x, d.y + 2)) d.resting = false;
        else continue;
      }
      d.vy = Math.min(d.vy + DROP_RULES.gravity * dt, 600);
      const nx = d.x + d.vx * dt;
      if (this.solid(nx, d.y - 4)) d.vx *= -0.35;
      else d.x = clamp(nx, 10, WORLD_W - 10);
      const ny = d.y + d.vy * dt;
      if (d.vy > 0 && this.solid(d.x, ny)) {
        d.y = Math.floor(ny / TILE) * TILE - 1;
        if (d.vy > 160) {
          d.vy *= -0.3;
          d.vx *= 0.6;
        } else {
          d.vy = 0;
          d.vx = 0;
          d.resting = true;
        }
      } else if (d.vy < 0 && this.solid(d.x, ny - 8)) d.vy = 0;
      else d.y = Math.min(ny, WORLD_H - 20);
      if (lavaAt(d.x, d.y)) {
        s.drops.splice(i, 1);
        this.game.event('sizzle', d.x, d.y, d.item);
        this.game.sound('sizzle', d.x, d.y);
        continue;
      }
      // Stacks of the same thing lying together join up.
      if (d.resting) {
        const twin = s.drops.find(
          (o) => o !== d && o.resting && o.item === d.item && dist(o, d) < DROP_RULES.mergeRadius,
        );
        if (twin) {
          twin.qty += d.qty;
          s.drops.splice(i, 1);
        }
      }
    }
  }
}
