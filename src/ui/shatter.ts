// The fourth wall breaks. At the end of the Unmaker's death, the screen itself is struck: it
// cracks like a monitor, bleeds ink and dead lines, and falls away in pieces into the dark. The
// music dies with it; then, like an old tube warming up, the world comes back.
import { SHATTER_SECONDS } from '../data/bosses.ts';

type Pt = [number, number];
interface Shard {
  pts: Pt[];
  cx: number;
  cy: number;
  vx: number;
  spin: number;
  delay: number;
}
/** When each part happens, in seconds from the blow. */
const HOLD = 1.7,
  FALL = 3.7,
  DARK = 4.5;

export function shatter(
  source: HTMLCanvasElement,
  sound: (kind: string) => void,
  hush: (on: boolean) => void,
) {
  const w = innerWidth,
    h = innerHeight,
    diag = Math.hypot(w, h);
  const snap = document.createElement('canvas');
  snap.width = w;
  snap.height = h;
  snap.getContext('2d')!.drawImage(source, 0, 0, w, h);
  const cv = document.createElement('canvas');
  cv.id = 'shatter';
  cv.width = w;
  cv.height = h;
  document.body.appendChild(cv);
  document.body.classList.add('shattering');
  const c = cv.getContext('2d')!;

  // Where the blow lands, and the web of cracks around it: spokes, and rings between them.
  const r = Math.random,
    ix = w * (0.5 + (r() - 0.5) * 0.2),
    iy = h * (0.45 + (r() - 0.5) * 0.15),
    spokes = 16,
    radii = [0, 0.04, 0.11, 0.22, 0.38, 0.6, 1.2].map((k) => k * diag),
    angles = Array.from(
      { length: spokes },
      (_, i) => (i / spokes) * Math.PI * 2 + (r() - 0.5) * (Math.PI / spokes),
    );
  const vert: Pt[][] = radii.map((rad, k) =>
    angles.map((a) => {
      const j = k ? 1 + (r() - 0.5) * 0.3 : 0;
      return [ix + Math.cos(a) * rad * j, iy + Math.sin(a) * rad * j] as Pt;
    }),
  );
  const shards: Shard[] = [];
  for (let k = 0; k < radii.length - 1; k++)
    for (let i = 0; i < spokes; i++) {
      const n = (i + 1) % spokes,
        pts: Pt[] = [vert[k][i], vert[k][n], vert[k + 1][n], vert[k + 1][i]],
        cx = pts.reduce((s, p) => s + p[0], 0) / 4,
        cy = pts.reduce((s, p) => s + p[1], 0) / 4;
      shards.push({
        pts,
        cx,
        cy,
        vx: (cx - ix) * 0.35 + (r() - 0.5) * 120,
        spin: (r() - 0.5) * 3,
        delay: k === 0 ? 0 : r() * 0.45 + (radii.length - k) * 0.06,
      });
    }
  // Every crack as a jagged line, with how far from the blow it starts.
  const cracks: { from: number; line: Pt[] }[] = [];
  const jag = (a: Pt, b: Pt): Pt[] => {
    const line: Pt[] = [a];
    for (let s = 1; s < 5; s++) {
      const k = s / 5;
      line.push([
        a[0] + (b[0] - a[0]) * k + (r() - 0.5) * 10,
        a[1] + (b[1] - a[1]) * k + (r() - 0.5) * 10,
      ]);
    }
    line.push(b);
    return line;
  };
  for (let k = 0; k < radii.length - 1; k++)
    for (let i = 0; i < spokes; i++) {
      cracks.push({ from: radii[k], line: jag(vert[k][i], vert[k + 1][i]) });
      if (k) cracks.push({ from: radii[k], line: jag(vert[k][i], vert[k][(i + 1) % spokes]) });
    }
  // The panel behind the glass dies in stripes of colour.
  const bleeds = Array.from({ length: 9 }, () => ({
    x: ix + (r() - 0.5) * w * 0.5,
    wd: 1 + Math.floor(r() * 3),
    col: ['#ff2aa0', '#2af0ff', '#b0ff2a', '#ffffff', '#000000'][Math.floor(r() * 5)],
  }));

  const path = (pts: Pt[]) => {
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (const p of pts.slice(1)) c.lineTo(p[0], p[1]);
    c.closePath();
  };
  const drawCracks = (reach: number) => {
    c.lineJoin = 'round';
    for (const { from, line } of cracks) {
      if (from > reach) continue;
      for (const [col, off, wd] of [
        ['rgba(0,0,0,0.55)', 1, 2],
        ['rgba(255,255,255,0.9)', 0, 1.2],
      ] as const) {
        c.strokeStyle = col;
        c.lineWidth = wd;
        c.beginPath();
        c.moveTo(line[0][0] + off, line[0][1] + off);
        for (const p of line.slice(1)) c.lineTo(p[0] + off, p[1] + off);
        c.stroke();
      }
    }
  };
  const drawInk = (k: number) => {
    // A blot of dead crystal where it was struck, fringed with colour.
    for (const [col, rad] of [
      ['#ff2aa0', 46],
      ['#2af0ff', 40],
      ['#000000', 34],
    ] as const) {
      c.fillStyle = col;
      c.globalAlpha = col === '#000000' ? 0.95 : 0.5;
      for (let i = 0; i < 7; i++) {
        c.beginPath();
        c.arc(
          ix + Math.cos(i * 2.1) * rad * 0.35,
          iy + Math.sin(i * 1.7) * rad * 0.3,
          rad * k * (0.5 + (i % 3) * 0.25),
          0,
          Math.PI * 2,
        );
        c.fill();
      }
    }
    c.globalAlpha = 1;
  };

  const t0 = performance.now() / 1000,
    done = new Set<string>();
  const once = (key: string, fn: () => void) => {
    if (!done.has(key)) {
      done.add(key);
      fn();
    }
  };
  sound('screen_crack');
  const frame = () => {
    const t = performance.now() / 1000 - t0;
    c.clearRect(0, 0, w, h);
    if (t < HOLD) {
      // Struck: the cracks race outward, the ink spreads, the panel bleeds.
      c.drawImage(snap, 0, 0);
      if (t > 0.12)
        for (const b of bleeds) {
          c.fillStyle = b.col;
          c.globalAlpha = 0.75;
          c.fillRect(b.x, 0, b.wd, h);
        }
      c.globalAlpha = 1;
      drawInk(Math.min(1, t / 0.25));
      drawCracks(Math.min(1, t / 0.5) * diag);
    } else if (t < FALL) {
      // The glass falls out, piece by piece, into the dark.
      once('fall', () => sound('shatter'));
      if (t > HOLD + 0.35) once('hush', () => hush(true));
      c.fillStyle = '#000';
      c.fillRect(0, 0, w, h);
      for (const s of shards) {
        const ft = Math.max(0, t - HOLD - s.delay);
        if (s.cy + 520 * ft * ft > h + diag * 0.3) continue;
        c.save();
        c.translate(s.cx + s.vx * ft, s.cy + 520 * ft * ft);
        c.rotate(s.spin * ft);
        c.translate(-s.cx, -s.cy);
        path(s.pts);
        c.clip();
        c.drawImage(snap, 0, 0);
        c.strokeStyle = 'rgba(255,255,255,0.8)';
        c.lineWidth = 1.5;
        path(s.pts);
        c.stroke();
        c.restore();
      }
    } else if (t < DARK) {
      // Nothing. No signal.
      c.fillStyle = '#000';
      c.fillRect(0, 0, w, h);
      if (Math.floor(t * 2) % 2) {
        c.fillStyle = '#3a3a3a';
        c.font = '16px monospace';
        c.textAlign = 'center';
        c.fillText('NO SIGNAL', w / 2, h / 2);
      }
    } else if (t < SHATTER_SECONDS) {
      // An old tube warming up: a line of light, then the picture opening from it.
      once('on', () => {
        sound('crt_on');
        hush(false);
        document.body.classList.remove('shattering');
      });
      const k = (t - DARK) / (SHATTER_SECONDS - DARK);
      c.fillStyle = '#000';
      c.fillRect(0, 0, w, h);
      if (k < 0.35) {
        const lw = w * Math.min(1, k / 0.25);
        c.fillStyle = '#ffffff';
        c.fillRect((w - lw) / 2, h / 2 - 1, lw, 2);
      } else {
        const open = h * Math.min(1, (k - 0.35) / 0.5);
        c.clearRect(0, (h - open) / 2, w, open);
        c.fillStyle = `rgba(255,255,255,${(1 - k) * 0.8})`;
        c.fillRect(0, (h - open) / 2, w, open);
      }
    } else {
      cv.remove();
      document.body.classList.remove('shattering');
      return;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
