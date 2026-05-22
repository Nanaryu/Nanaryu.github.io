// =============================================================================
// triangles.js — Ghostly neon tessellated wave
//
// Three overlapping wave layers drift across a dark canvas. Each layer is a
// row of anchor pairs whose triangles are drawn with neon-glowing edges and
// near-transparent fills. A ghost-trail effect (painting a semi-transparent
// black rect instead of clearing the canvas) lets old frames linger.
//
// Structure:
//   1. Canvas setup & resize
//   2. Config
//   3. Utilities  (math, colour lerp, easing)
//   4. WaveLayer class
//   5. Animation loop
// =============================================================================


// ─── 1. Canvas setup ──────────────────────────────────────────────────────────

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Match the canvas pixel buffer to its CSS display size.
// Called on init and again after every resize.
function syncCanvasSize() {
  const rect  = canvas.getBoundingClientRect();
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
syncCanvasSize();

// Paint the first frame solid black so there's no white flash before the loop starts
ctx.fillStyle = '#050008';
ctx.fillRect(0, 0, canvas.width, canvas.height);


// ─── 2. Config ────────────────────────────────────────────────────────────────

const COLS        = 24;     // Anchor pairs across the canvas width
const SPREAD      = 0.28;   // How far anchors wander (fraction of canvas.height)
const SPEED       = 0.020;  // Step size toward target per frame — lower = smoother
const GHOST_ALPHA = 0.08;   // Opacity of the black overlay that creates ghost trails

// Neon colour palettes — one per wave layer.
// Each palette is [top-colour, mid-colour, bottom-colour]; triangles interpolate
// between them based on their vertical position on the canvas.
const PALETTES = [
  ['#ff2fff', '#bf00ff', '#7700cc'],  // magenta → violet
  ['#00ffe7', '#00aaff', '#0044ff'],  // cyan → electric blue
  ['#ff6ec7', '#ff2266', '#cc0055'],  // hot pink → rose
];


// ─── 3. Utilities ─────────────────────────────────────────────────────────────

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Ease-in-out quartic: very slow at both ends, fast in the middle.
// Used to make anchor movement feel organic rather than mechanical.
function easeInOutQuart(t) {
  return t < 0.5
    ? 8 * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

// Nudges `current` one frame-step toward `target` using eased interpolation.
// The easing input is normalised by the wave's vertical range so distant targets
// don't suddenly jump — the eased fraction stays small when far away.
function driftToward(current, target) {
  const distance  = target - current;
  const normalised = Math.min(Math.abs(distance) / (canvas.height * 0.6), 1);
  return current + distance * easeInOutQuart(normalised) * SPEED;
}

// ── Colour utilities ──────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Linearly interpolates between two hex colour strings.
// t=0 → colourA, t=1 → colourB
function lerpHex(colourA, colourB, t) {
  const [r1, g1, b1] = hexToRgb(colourA);
  const [r2, g2, b2] = hexToRgb(colourB);
  const r  = Math.round(lerp(r1, r2, t)).toString(16).padStart(2, '0');
  const g  = Math.round(lerp(g1, g2, t)).toString(16).padStart(2, '0');
  const b  = Math.round(lerp(b1, b2, t)).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}


// ─── 4. WaveLayer class ───────────────────────────────────────────────────────
//
// One wave is a row of anchor objects that each hold two bobbing points:
//
//   MAIN point  (a.y)  — sits at each column boundary
//   JOIN point  (a.jy) — sits halfway between two main points
//
// Triangles are tiled from these points exactly as in the original sketch.
// The join point always moves in the opposite vertical direction to the main
// point, which maintains the zig-zag tessellation shape.

class WaveLayer {
  // yOffset — vertical centre as a 0..1 fraction of canvas.height
  // palette  — array of three hex colours for this layer
  // opacity  — overall brightness/presence (0..1)
  constructor(yOffset, palette, opacity) {
    this.yOffset = yOffset;
    this.palette = palette;
    this.opacity = opacity;
    this.anchors = [];
    this.buildAnchors();
  }

  // Creates one anchor per column (plus one extra past the right edge so the
  // last triangle tile has a point to close against).
  buildAnchors() {
    this.anchors = [];
    const band     = canvas.height * SPREAD;
    const centreY  = canvas.height * this.yOffset;
    const colWidth = canvas.width  / COLS;

    for (let i = 0; i <= COLS + 1; i++) {
      this.anchors.push({
        x:   i * colWidth,

        // Main point — current Y and its wandering target
        y:   centreY + randomInRange(-band, band),
        yT:  centreY + randomInRange(-band, band),

        // Join point — current Y and its wandering target
        jy:  centreY + randomInRange(-band, band),
        jyT: centreY + randomInRange(-band, band),
      });
    }
  }

  update() {
    const band     = canvas.height * SPREAD;
    const centreY  = canvas.height * this.yOffset;
    const colWidth = canvas.width  / COLS;

    this.anchors.forEach((a, i) => {
      // Keep X positions current with the canvas width (important after resize)
      a.x = i * colWidth;

      // ── Main point ─────────────────────────────────────────────────────────
      if (Math.abs(a.y - a.yT) < 0.8) {
        a.yT = centreY + randomInRange(-band, band);
      }
      a.y = driftToward(a.y, a.yT);

      // ── Join point ─────────────────────────────────────────────────────────
      // Sent to the opposite side of the centre from the main point,
      // preserving the zig-zag shape. The offset mirrors how far the main
      // point currently is from centre.
      if (Math.abs(a.jy - a.jyT) < 0.8) {
        const offset = Math.abs(a.y - centreY) * 0.9;
        a.jyT = (a.y < centreY) ? centreY + offset : centreY - offset;
      }
      a.jy = driftToward(a.jy, a.jyT);
    });
  }

  draw() {
    const colWidth = canvas.width / COLS;

    for (let i = 0; i < this.anchors.length; i++) {
      const a = this.anchors[i];

      if (i === 0 && i + 1 < this.anchors.length) {
        // Leftmost column: no previous join point, just the leading triangle
        const next = this.anchors[i + 1];
        this._drawTriangle(
          a.x,              a.y,
          a.x + colWidth/2, a.jy,
          next.x,           next.y,
          0
        );
        continue;
      }

      if (i + 1 < this.anchors.length) {
        const prev = this.anchors[i - 1];
        const next = this.anchors[i + 1];

        // WHITE-equivalent: main[i] — join[i-1] — join[i]
        this._drawTriangle(
          a.x,                    a.y,
          prev.x + colWidth/2,    prev.jy,
          a.x    + colWidth/2,    a.jy,
          0
        );

        // BLACK-equivalent: main[i] — join[i] — main[i+1]
        this._drawTriangle(
          a.x,              a.y,
          a.x + colWidth/2, a.jy,
          next.x,           next.y,
          1
        );
      }
    }
  }

  // Draws one triangle with:
  //   - A near-transparent fill for ghostly depth
  //   - A thin bright neon stroke
  //   - A wide dim stroke for the bloom halo around each edge
  _drawTriangle(ax, ay, bx, by, cx, cy, colourIdx) {
    // Pick a colour by interpolating through the palette based on average Y
    const midY  = (ay + by + cy) / 3;
    const t     = Math.max(0, Math.min(1, midY / canvas.height));
    const colA  = this.palette[colourIdx       % this.palette.length];
    const colB  = this.palette[(colourIdx + 1) % this.palette.length];
    const colour = lerpHex(colA, colB, t);

    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.closePath();

    // Ghostly fill — very low opacity so many overlapping triangles
    // build up a faint luminous haze rather than a solid block of colour
    ctx.globalAlpha = this.opacity * 0.18;
    ctx.fillStyle   = colour;
    ctx.fill();

    // Thin neon edge — bright, sharp, with a tight glow
    ctx.globalAlpha  = this.opacity * 0.85;
    ctx.strokeStyle  = colour;
    ctx.lineWidth    = 0.7;
    ctx.shadowColor  = colour;
    ctx.shadowBlur   = 10;
    ctx.stroke();

    // Wide bloom pass — same path, wider line, more diffuse shadow
    // This second stroke is what gives the edges their soft light-bleed halo
    ctx.globalAlpha = this.opacity * 0.25;
    ctx.lineWidth   = 3;
    ctx.shadowBlur  = 28;
    ctx.stroke();

    // Reset shadow and alpha so nothing bleeds into unrelated draw calls
    ctx.shadowBlur  = 0;
    ctx.globalAlpha = 1;
  }
}


// ─── 5. Animation loop ────────────────────────────────────────────────────────

// Three layers at slightly different vertical positions.
// Staggering them means they drift in and out of phase, producing the sense
// that the surface is alive and not just repeating.
const layers = [
  new WaveLayer(0.34, PALETTES[0], 0.9),   // magenta/violet,    upper
  new WaveLayer(0.54, PALETTES[1], 0.75),  // cyan/electric blue, middle
  new WaveLayer(0.65, PALETTES[2], 0.55),  // hot pink/rose,      lower
];

function frame() {
  // Ghost trail — paint a near-opaque dark rect over the whole canvas.
  // Old frames are dimmed but not erased, so edges linger and fade out slowly.
  // Increasing GHOST_ALPHA makes trails shorter; decreasing it makes them linger longer.
  ctx.globalAlpha = GHOST_ALPHA;
  ctx.fillStyle   = '#050008';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  layers.forEach(layer => {
    layer.update();
    layer.draw();
  });

  requestAnimationFrame(frame);
}

frame();


// ─── Resize handling ──────────────────────────────────────────────────────────

let resizeDebounce;
window.addEventListener('resize', () => {
  clearTimeout(resizeDebounce);
  resizeDebounce = setTimeout(() => {
    syncCanvasSize();
    layers.forEach(layer => layer.buildAnchors());
  }, 100);
});