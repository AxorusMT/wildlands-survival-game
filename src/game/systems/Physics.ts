import { clamp } from '../../core/math.ts';
import { TILE, WORLD_H, inShaft, regionBounds } from '../../data/world.ts';
import { DOOR_TILE } from '../../data/town.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

const STEP_SOUNDS: Record<number, string> = {
  1: 'step_soil',
  2: 'step_stone',
  3: 'step_sand',
  4: 'step_mud',
  5: 'step_snow',
  6: 'step_stone',
  8: 'step_stone',
  9: 'step_ash',
  10: 'step_stone',
};

export class Physics extends System {
  private stride = 0;
  private wasInLava = false;
  /** Footstep sound for the ground underfoot; grass tops the soil at the surface. */
  stepSound() {
    const p = this.game.s.player,
      tx = Math.floor(p.x / TILE),
      ty = Math.floor((p.y + 4) / TILE),
      kind = this.game.tileAt(tx, ty);
    if (kind === 1 && !this.game.tileAt(tx, ty - 1) && this.game.layer().id === 'surface')
      return 'step_grass';
    return STEP_SOUNDS[kind] ?? 'step_stone';
  }
  collides(x: number, y: number) {
    for (
      let tx = Math.floor((x - RULES.playerHalfWidth) / TILE);
      tx <= Math.floor((x + RULES.playerHalfWidth) / TILE);
      tx++
    )
      for (
        let ty = Math.floor((y - RULES.playerHeight) / TILE);
        ty <= Math.floor((y - RULES.playerFootInset) / TILE);
        ty++
      )
        if (this.game.tileAt(tx, ty)) return true;
    return false;
  }
  /** Mid-air jumps left (from wings or a cloud in a jar). */
  private airJumps = 0;
  jump() {
    const p = this.game.s.player,
      fx = this.game.equipment.effects();
    if (this.game.s.vitals.stamina < RULES.jumpStamina) return false;
    if (!p.grounded) {
      if (this.airJumps <= 0 || !fx.has('double_jump')) return false;
      this.airJumps--;
      p.vy = -RULES.jumpVelocity * 0.95;
      this.game.event('burst', p.x, p.y, '#e8f0ff');
      this.game.sound('jump', p.x, p.y, 0.8);
      return true;
    }
    const boost = fx.has('jump') || fx.has('speed') ? 1.18 : 1;
    p.vy = -RULES.jumpVelocity * boost;
    p.grounded = false;
    this.airJumps = 1;
    this.game.s.vitals.stamina -= RULES.jumpStamina;
    this.game.sound('jump');
    return true;
  }
  move(dx: number, dy: number, dt: number) {
    if (this.game.s.dead) return;
    const p = this.game.s.player,
      v = this.game.s.vitals;
    if (this.game.dev.noclip) {
      // Free flight for the field console: no gravity, no collisions.
      const fly = 520 * this.game.dev.speed;
      p.moving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
      if (dx) p.face = dx > 0 ? 0 : Math.PI;
      const [lo, hi] = regionBounds(p.x);
      p.x = clamp(p.x + dx * fly * dt, lo + 15, hi - 15);
      p.y = clamp(p.y + dy * fly * dt, 40, WORLD_H - 15);
      p.vx = 0;
      p.vy = 0;
      p.grounded = true;
      return;
    }
    p.moving = Math.abs(dx) > 0.1;
    if (p.moving && p.grounded) {
      this.stride += Math.abs(p.vx || 0) * dt;
      if (this.stride > RULES.strideLength) {
        this.stride = 0;
        this.game.sound(this.stepSound(), p.x, p.y, 0.8);
      }
    }
    const tired = v.stamina < 12 || v.fatigue > 80;
    const lava = this.game.inLava(),
      water = this.game.pocket.submerged();
    if (lava && !this.wasInLava) this.game.sound('sizzle', p.x, p.y, 1.3);
    this.wasInLava = lava;
    const speed =
      (lava ? 0.45 : water ? 0.6 : 1) *
      (tired ? RULES.tiredMoveSpeed : RULES.standardMoveSpeed) *
      (v.illness > 60 ? 0.82 : 1) *
      (p.boots ? 1.12 : 1) *
      this.game.equipment.speedBonus() *
      this.game.dev.speed;
    if (dx) p.face = dx > 0 ? 0 : Math.PI;
    p.vx = dx * speed;
    const shaft = inShaft(p.x, p.y);
    // Molten rock is thick: you sink slowly and can wade or struggle upward.
    if (lava) p.vy = dy < 0 ? -150 : Math.min(p.vy + 240 * dt, 60);
    // Deep water: you sink slowly and can swim up, at the cost of stamina.
    else if (water) {
      p.vy = dy < 0 ? Math.max(p.vy - 900 * dt, -170) : Math.min(p.vy + 260 * dt, 90);
      if (dy < 0) v.stamina = clamp(v.stamina - dt * 3, 0, RULES.maxVital);
    } else if (dy < 0 && (p.grounded || shaft) && v.stamina > RULES.jumpStamina) {
      if (p.grounded) this.jump();
      else {
        p.vy = -RULES.climbVelocity;
        v.stamina = clamp(v.stamina - dt * 5, 0, RULES.maxVital);
      }
    } else if (shaft && dy > 0) p.vy = Math.min(p.vy + 160 * dt, 170);
    else {
      // Featherfall and wings let you drift down slowly while holding jump.
      const fx = this.game.equipment.effects(),
        floaty = fx.has('buff:featherfall') || (fx.has('glide') && dy < 0 && p.vy > 0);
      p.vy = Math.min(p.vy + RULES.gravity * dt, floaty ? 120 : RULES.terminalVelocity);
    }
    const [lo, hi] = regionBounds(p.x);
    const nx = clamp(p.x + p.vx * dt, lo + 40, hi - 40);
    if (this.collides(nx, p.y)) {
      // Walking into a closed door opens it.
      const tx = Math.floor((nx + Math.sign(p.vx) * RULES.playerHalfWidth) / TILE);
      for (const ty of [Math.floor((p.y - 8) / TILE), Math.floor((p.y - 40) / TILE)])
        if (this.game.tileAt(tx, ty) === DOOR_TILE && this.game.town.push(tx, ty)) break;
    }
    if (!this.collides(nx, p.y)) p.x = nx;
    else if (p.grounded && !this.collides(nx, p.y - TILE) && this.collides(nx, p.y + 2)) {
      p.x = nx;
      p.y -= TILE;
    }
    const oldY = p.y,
      steps = Math.max(1, Math.ceil(Math.abs(p.vy * dt) / 7));
    for (let i = 0; i < steps; i++) {
      const ny = p.y + (p.vy * dt) / steps;
      const platform = this.game.s.structures.find(
        (st) =>
          st.type === 'platform' &&
          dy <= 0 &&
          Math.abs(st.x - p.x) < 35 &&
          p.y <= st.y - 1 &&
          ny >= st.y - 1,
      );
      if (platform) {
        p.y = platform.y - 1;
        p.vy = 0;
        p.grounded = true;
        break;
      }
      if (!this.collides(p.x, ny)) {
        p.y = ny;
        p.grounded = false;
      } else {
        if (p.vy > 0) {
          if (!p.grounded && p.vy > 200)
            this.game.sound('land', p.x, p.y, Math.min(1.4, p.vy / 450));
          p.grounded = true;
          if (p.vy > RULES.fallDamageVelocity && !this.game.dev.god)
            v.health = clamp(
              v.health - (p.vy - RULES.fallDamageVelocity) * 0.07,
              0,
              this.game.maxHealth(),
            );
          this.airJumps = 1;
        }
        p.vy = 0;
        break;
      }
    }
    if (p.vy >= 0 && !this.collides(p.x, p.y + 3)) p.grounded = false;
    if (p.y > WORLD_H - 15) {
      p.y = WORLD_H - 15;
      p.vy = 0;
      p.grounded = true;
    }
    if (p.moving || Math.abs(p.y - oldY) > 0.5) {
      v.stamina = clamp(v.stamina - dt * (tired ? 0.7 : 2.2), 0, RULES.maxVital);
      v.hydration = clamp(v.hydration - dt * 0.018, 0, RULES.maxVital);
    }
  }
}
