import { clamp } from '../../core/math.ts';
import { pick } from '../../core/random.ts';
import { biomeAt, layerAt } from '../../data/world.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

export class Environment extends System {
  timeOfDay() {
    return (
      (RULES.minutesAtStart + this.game.s.elapsed * RULES.minutesPerSecond) % RULES.minutesPerDay
    );
  }
  isNight() {
    const t = this.timeOfDay();
    return t < RULES.nightEndsAt || t > RULES.nightStartsAt;
  }
  temperature() {
    const p = this.game.s.player;
    return this.temperatureAt(p.x, p.y);
  }
  /** Air temperature at a place: the region by day and night, or the rock below ground. */
  temperatureAt(x: number, y: number) {
    const b = biomeAt(x, y),
      layer = layerAt(x, y);
    // Below ground the rock sets the temperature; only the upper mines feel the region above.
    if (layer.id === 'upper_mines') return layer.temp + b.temp * 0.25;
    if (layer.id !== 'surface') return layer.temp;
    return (
      b.temp +
      (this.isNight() ? -8 : 0) +
      (this.game.s.weather === 'rain' ? -4 : this.game.s.weather === 'storm' ? -7 : 0)
    );
  }
  // Moves the clock forward and occasionally turns the weather.
  advance(dt: number) {
    this.game.s.elapsed += dt;
    this.game.s.day =
      1 +
      Math.floor(
        (RULES.minutesAtStart + this.game.s.elapsed * RULES.minutesPerSecond) / RULES.minutesPerDay,
      );
    if (this.game.s.elapsed >= this.game.s.weatherNext) {
      this.game.s.weather = pick(this.game.rng, ['clear', 'clear', 'cloudy', 'rain', 'storm']);
      this.game.s.weatherNext =
        this.game.s.elapsed +
        RULES.weatherBaseSeconds +
        this.game.rng() * RULES.weatherJitterSeconds;
      this.game.say('Weather turning ' + this.game.s.weather + '.');
    }
  }
  // Rain catchers slowly fill while it rains or storms.
  collectRain(dt: number) {
    for (const st of this.game.s.structures)
      if (st.type === 'rain_catcher' && ['rain', 'storm'].includes(this.game.s.weather))
        st.water = clamp(st.water + dt * RULES.rainCatchRate, 0, RULES.rainCatchCapacity);
  }
}
