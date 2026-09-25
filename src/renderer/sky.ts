// Pixel skies: dithered bands, stars, sun and moon, clouds, and parallax silhouettes.
import { D, blendAt, daylight, duskiness, overcastOf, type RegionArt } from './art.ts';
import {
  PX,
  bayer,
  cached,
  clamp,
  hash,
  makeCanvas,
  mix,
  shade,
  sprite,
  blit,
  vnoise,
} from './px.ts';
import type { RenderGame } from './types.ts';

const gradients = new Map<string, HTMLCanvasElement>();
/** A 4-pixel-wide strip of banded, dithered sky; repeated across the screen. */
function skyStrip(top: string, bottom: string, height: number) {
  const key = top + bottom + height;
  let cv = gradients.get(key);
  if (!cv) {
    cv = makeCanvas(4, height);
    const k = cv.getContext('2d')!,
      bands = 9;
    for (let y = 0; y < height; y++) {
      const t = (y / height) * (bands - 1),
        band = Math.floor(t),
        frac = t - band;
      for (let x = 0; x < 4; x++) {
        const b = frac > bayer(x, y) ? band + 1 : band;
        k.fillStyle = mix(top, bottom, b / (bands - 1));
        k.fillRect(x, y, 1, 1);
      }
    }
    if (gradients.size > 64) gradients.clear();
    gradients.set(key, cv);
  }
  return cv;
}

/** Silhouette height (art px above the layer base) for a skyline shape at world-art x. */
function skyline(kind: RegionArt['skyline'], x: number, layer: number) {
  const n = (s: number, cell: number) => vnoise(x, layer * 97, cell, s);
  switch (kind) {
    case 'sea':
      return layer < 2 ? 4 + Math.sin(x / 23) * 1 : 10 + n(1, 40) * 22;
    case 'peaks': {
      const p = Math.abs(((x / (46 + layer * 10)) % 2) - 1);
      return 18 + (1 - p) * (44 - layer * 6) * (0.6 + n(2, 90) * 0.6) + n(3, 9) * 3;
    }
    case 'dunes':
      return 10 + Math.abs(Math.sin(x / (52 + layer * 8))) * 18 + n(4, 40) * 6;
    case 'mesa': {
      const v = n(5, 70);
      return v > 0.55 ? 34 - layer * 4 : v > 0.35 ? 18 : 8 + n(6, 12) * 3;
    }
    case 'spires': {
      const s = hash(Math.floor(x / 14), layer, 7);
      return 10 + n(8, 60) * 18 + (s > 0.75 ? (1 - Math.abs(((x % 14) - 7) / 7)) * 60 * s : 0);
    }
    case 'islands':
      return 4 + n(9, 30) * 8;
    case 'shards':
      return 6 + n(10, 20) * 12;
    default:
      return 12 + n(11, 70) * 24 + n(12, 20) * 6;
  }
}

function cloudSprite(v: number, dark: boolean) {
  return cached('cloud' + v + dark, () => {
    const w = 34 + Math.floor(hash(v, 1) * 30),
      h = 14;
    return sprite(
      w,
      h,
      0,
      0,
      (p) => {
        const lit = dark ? '#aeb4bc' : '#fbf8ef',
          mid = dark ? '#8d949c' : '#e3e2dc',
          low = dark ? '#6f767f' : '#c9ccd0';
        for (let i = 0; i < 5; i++) {
          const cx = 6 + (i / 4) * (w - 12),
            r = 4 + hash(v, i + 2) * 4;
          p.ellipse(cx, h - 4 - r * 0.6, r + 1, r, mid);
        }
        p.rect(3, h - 5, w - 6, 3, mid);
        // Light from above, shadow along the flat base.
        for (let y = 0; y < h; y++)
          for (let x = 0; x < w; x++)
            if (p.alpha(x, y)) {
              if (!p.alpha(x, y - 2)) p.set(x, y, lit);
              else if (y > h - 5) p.set(x, y, low);
            }
      },
      false,
    );
  });
}

function sunSprite() {
  return cached('sun', () =>
    sprite(
      15,
      15,
      7,
      7,
      (p) => {
        p.ellipse(7.5, 7.5, 7, 7, '#f6d77a');
        p.ellipse(7.5, 7.5, 5.5, 5.5, '#fbe7a4');
        p.ellipse(6, 6, 2.5, 2.5, '#fff6d8');
      },
      false,
    ),
  );
}
function moonSprite() {
  return cached('moon', () =>
    sprite(
      12,
      12,
      6,
      6,
      (p) => {
        p.ellipse(6, 6, 5.5, 5.5, '#e6e2cf');
        p.ellipse(8, 5, 4.5, 5, '');
        for (let y = 0; y < 12; y++)
          for (let x = 0; x < 12; x++)
            if (Math.hypot(x + 0.5 - 8.4, y + 0.5 - 5) < 4.6) p.clear(x, y);
        p.set(3, 5, '#bdb8a4');
        p.set(4, 8, '#bdb8a4');
      },
      false,
    ),
  );
}

function silhouetteTree(kind: string, size: number, color: string) {
  return cached('bgtree' + kind + size + color, () => {
    const w = size + 2,
      h = Math.round(size * 1.6);
    return sprite(
      w,
      h,
      Math.floor(w / 2),
      h - 1,
      (p) => {
        const cx = w / 2;
        if (kind === 'pine' || kind === 'snowpine')
          p.poly(
            [
              [cx, 0],
              [w - 1, h - 3],
              [1, h - 3],
            ],
            color,
          );
        else if (kind === 'palm') {
          p.rect(Math.floor(cx), 3, 1, h - 3, color);
          p.ellipse(cx, 3, size / 2, 2, color);
        } else if (kind === 'cactus') {
          p.rect(Math.floor(cx) - 1, 2, 3, h - 2, color);
          p.rect(Math.floor(cx) - 4, h / 2, 2, 5, color);
        } else if (kind === 'shroom') {
          p.rect(Math.floor(cx) - 1, h / 3, 2, h, color);
          p.ellipse(cx, h / 3, size / 2 + 1, size / 4 + 1, color);
        } else {
          p.rect(Math.floor(cx), h / 2, 1, h / 2, color);
          p.ellipse(cx, h / 2.4, size / 2, size / 2.4, color);
        }
        p.rect(Math.floor(cx), h - 3, 1, 3, color);
      },
      false,
    );
  });
}

/**
 * Draws the sky and parallax layers for the view. `fx` is the world x the regional palette
 * follows (the player, or the menu's focal point).
 */
export function drawSky(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
  w: number,
  h: number,
  fx: number,
) {
  const tod = g.timeOfDay(),
    day = daylight(tod),
    dusk = clamp(duskiness(tod)),
    over = overcastOf(g),
    night = 1 - day,
    [A, B, k] = blendAt(fx),
    dim = D.biomeAt(fx, 0).id,
    alien = dim === 'mycelia' || dim === 'void' || !!A.alien;
  const q = (v: number) => Math.round(v * 24) / 24;
  let top = mix(A.sky[0], B.sky[0], q(k)),
    bottom = mix(A.sky[1], B.sky[1], q(k));
  if (!alien) {
    top = mix(mix(top, '#8b6d8e', q(dusk) * 0.35), '#0c1228', q(night) * 0.95);
    bottom = mix(mix(bottom, '#f0a070', q(dusk) * 0.55), '#233354', q(night) * 0.9);
    top = mix(top, '#7c848a', q(over) * 0.55);
    bottom = mix(bottom, '#a8aca8', q(over) * 0.5);
  }
  const surfY = Math.round(D.surfaceAt(fx) / PX) - ay,
    horizon = Math.max(40, Math.min(h + 40, surfY + 20));
  c.fillStyle = c.createPattern(skyStrip(top, bottom, horizon), 'repeat-x')!;
  c.fillRect(0, 0, w, horizon);
  c.fillStyle = bottom;
  c.fillRect(0, horizon, w, h - horizon);

  // Stars come out at night (and always in the alien skies).
  const starLevel = alien ? 1 : night * (1 - over);
  if (starLevel > 0.05) {
    const now = performance.now() / 1000;
    for (let i = 0; i < 140; i++) {
      const sx = Math.floor((((hash(i, 1) * 4000 - ax * 0.03) % w) + w) % w),
        sy = Math.floor(hash(i, 2) * horizon * 0.8);
      const tw = Math.sin(now * (1 + hash(i, 3) * 3) + i) > 0.3 ? 1 : 0.55;
      c.fillStyle = `rgba(250,245,225,${(starLevel * tw * (0.5 + hash(i, 4) * 0.5)).toFixed(2)})`;
      c.fillRect(sx, sy, 1, 1);
      if (hash(i, 5) > 0.93) {
        c.fillRect(sx - 1, sy, 3, 1);
        c.fillRect(sx, sy - 1, 1, 3);
      }
    }
  }
  if (!alien) {
    // The sun and moon ride an arc across the day.
    const arc = (phase: number) => [
      Math.round(w * (0.1 + phase * 0.8)),
      Math.round(horizon * 0.85 - Math.sin(phase * Math.PI) * horizon * 0.62),
    ];
    if (day > 0.02 && tod > 330 && tod < 1170) {
      const [sx, sy] = arc((tod - 330) / 840);
      c.globalAlpha = 1 - over * 0.7;
      blit(c, sunSprite(), sx, sy);
      c.globalAlpha = 1;
    } else {
      const phase = ((tod + 1440 - 1170) % 1440) / 600;
      if (phase < 1) {
        const [mx, my] = arc(phase);
        blit(c, moonSprite(), mx, my);
      }
    }
  }
  // Clouds drift with the wind and thicken with bad weather.
  const clouds = alien ? 0 : 5 + Math.round(over * 9),
    t = g.s.elapsed;
  for (let i = 0; i < clouds; i++) {
    const span = w + 140,
      speed = 1.2 + hash(i, 6) * 2.4,
      sx =
        ((((hash(i, 7) * 3000 - ax * (0.04 + hash(i, 8) * 0.04) + t * speed) % span) + span) %
          span) -
        70,
      sy = 6 + Math.floor(hash(i, 9) * horizon * 0.35);
    const cs = cloudSprite(i % 8, over > 0.6);
    c.globalAlpha = night > 0.5 ? 0.55 : 1;
    blit(c, cs, sx, sy);
    c.globalAlpha = 1;
  }

  // Four parallax layers, far to near, each a crisp silhouette with its own trees.
  const depth = [0.08, 0.16, 0.26, 0.38],
    rise = [72, 54, 36, 20],
    haze = [0.6, 0.42, 0.26, 0.12];
  for (let layer = 0; layer < 4; layer++) {
    const base =
      surfY -
      rise[layer] +
      Math.round((ay - (D.surfaceAt(fx) / PX - h * 0.6)) * depth[layer] * 0.35);
    if (base - 90 > h || base < -140) continue;
    let col = mix(mix(A.hills[layer], B.hills[layer], q(k)), bottom, haze[layer]);
    if (!alien) col = mix(col, '#141c30', q(night) * (0.75 - layer * 0.07));
    const shift = Math.round(ax * depth[layer]) + layer * 1000;
    c.fillStyle = col;
    const kindA = A.skyline,
      kindB = B.skyline;
    const floating = kindA === 'islands' || kindA === 'shards';
    for (let sx = 0; sx < w; sx++) {
      const wx = sx + shift,
        hgt = skyline(kindA, wx, layer) * (1 - k) + skyline(kindB, wx, layer) * k,
        y = Math.round(base - hgt);
      if (floating) {
        // Islands and shards hang in the air instead of rising from the ground.
        const band = vnoise(wx, layer, 26, 40);
        if (band > 0.55) {
          const thick = Math.round((band - 0.55) * 60);
          c.fillRect(sx, y - 30, 1, 3 + Math.round(thick * 0.3));
          c.fillRect(
            sx,
            y - 27 + Math.round(thick * 0.3),
            1,
            Math.max(0, thick - (Math.abs((wx % 26) - 13) > 9 ? 4 : 0)),
          );
        }
      } else c.fillRect(sx, y, 1, h - y);
    }
    // Background trees stand in fixed world slots, so they scroll with their hill.
    if (layer >= 1 && !floating) {
      const tree = k < 0.5 ? A.tree : B.tree,
        treeCol = shade(col, -0.12);
      for (let slot = Math.floor((shift - 20) / 14); slot * 14 - shift < w + 20; slot++) {
        if (vnoise(slot * 14, layer, 90, 44) < 0.4 || hash(slot, layer, 45) < 0.3) continue;
        const wx = slot * 14 + Math.floor(hash(slot, layer, 46) * 8),
          y = Math.round(
            base - (skyline(kindA, wx, layer) * (1 - k) + skyline(kindB, wx, layer) * k),
          ),
          size = 5 + layer * 2 + Math.floor(hash(slot, layer, 47) * 4);
        blit(c, silhouetteTree(tree, size, treeCol), wx - shift, y + 1);
      }
    }
  }
}
