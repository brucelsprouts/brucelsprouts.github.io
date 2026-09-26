# Hero Running Cracks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero's impact-web fractures ("a bullet hole") with running cracks — edge runs and rim runs that break off large shards — and add the light-and-colour layer (chromatic aberration along cracks, cracks drawn as light, reflecting shards, sparkles), per spec §4.2–§4.7 of `docs/superpowers/specs/2026-09-25-hero-fracture-design.md`.

**Architecture:** A new pure-geometry module, `js/hero/pane.js`, keeps the glass as a planar partition: every crack cuts exactly one piece in two, cracks meet at T-junctions, free tips continue invisibly so they still divide the glass, and pieces are split into convex parts for drawing. `js/hero/rifts.js` keeps its scheduler and seeded streams but replaces the web generator with path planning (edge and rim runs around the copy), a crack network built on the pane, timing, shard tilts, emissions and new geometry writers. Only pieces closed in by cracks move and are drawn. The shaders gain the colour bands, plate reflections and star glints; the renderer wires the new uniforms.

**Tech Stack:** three.js r128 (cdnjs global), WebGL2 / GLSL ES 3.00 `ShaderMaterial`s, classic scripts on `window.Hero`, headless Chrome over CDP for verification (dev-only harness in the session scratchpad, not shipped).

**Repo conventions:** no package.json, no test runner, no build step. Dev-only tests and the harness live in the session scratchpad (`$SP` below), as the spec's §9 harness does. Commit only when the user asks (their standing instruction) — there are no commit steps.

`$SP` = `C:/Users/bruce/AppData/Local/Temp/claude/C--Users-bruce-Documents-GitHub-brucelsprouts-github-io/4ac4814f-5e96-4497-94f5-9a25bde93cbf/scratchpad`

---

## File structure

| File | Change | Responsibility |
|---|---|---|
| `js/hero/pane.js` | **Create** | Planar partition of the glass: `create`, `addPath`, `run`, `pointOn`; `convexParts`, `area`, `centroid`, `isCrack`. No THREE, no config, no randomness. |
| `js/hero/rifts.js` | **Rewrite** | Scheduler (kept), path planning (edge, rim, click), crack network on the pane, timing, shards, lines, flares, emissions, GPU geometry writers. |
| `js/hero/config.js` | Modify | New `rifts` section, `particles` stars, tiers (1/2/2 fractures). |
| `js/hero/shaders.js` | Modify | `SLOTS` (drop `uSlotC`), `CELL_*` (colour band, plate reflection), `CRACK_*` (light core, still-side band), `PARTICLE_*` (four-point stars). |
| `js/hero/renderer.js` | Modify | Uniforms (`uGlassA/B/C`, `uCrackA/B`), material uniform lists, `writeUniforms` call, slot count. |
| `index.html`, `debug.html` | Modify | Load `pane.js` before `rifts.js`. |
| `$SP/tests/pane.test.js` | Create (dev only) | Invariants of `pane.js` under Node. |

Apply markers: each code block below is preceded by an HTML comment. `write: PATH` replaces the whole file. `splice: PATH | from: A | to: B` replaces the lines from the first line starting with `A` up to (not including) the next line starting with `B`. `$SP/apply-plan.js` applies them.

---

### Task 1: `pane.js` — the glass as a planar partition

**Files:**
- Create: `js/hero/pane.js`
- Test: `$SP/tests/pane.test.js`

- [ ] **Step 1: Write the failing test**

<!-- write: $SP/tests/pane.test.js -->
```js
// node pane.test.js — invariants of js/hero/pane.js (dev only, not shipped)
const assert = require('assert');
const path = require('path');
global.window = {};
require(path.resolve('C:/Users/bruce/Documents/GitHub/brucelsprouts.github.io/js/hero/pane.js'));
const { create, area, centroid, convexParts, isCrack } = window.Hero.pane;

const RECT = [{ x: -8, y: -5 }, { x: 8, y: -5 }, { x: 8, y: 4.6 }, { x: -8, y: 4.6 }];
const RECT_AREA = 16 * 9.6;
const turn = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
const crossing = (p, q, a, b) => turn(p, q, a) * turn(p, q, b) < -1e-18 && turn(a, b, p) * turn(a, b, q) < -1e-18;
function mulberry32(a) {
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function check(pane, label) {
  let total = 0;
  for (const F of pane.faces) {
    const A = area(F.v);
    assert(A > 0, label + ': piece not counter-clockwise (area ' + A + ')');
    assert.strictEqual(F.v.length, F.e.length, label + ': edge list length');
    assert.strictEqual(new Set(F.v).size, F.v.length, label + ': repeated vertex');
    const n = F.v.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 2; j < n; j++) {
        if (i === 0 && j === n - 1) continue;
        assert(!crossing(F.v[i], F.v[(i + 1) % n], F.v[j], F.v[(j + 1) % n]), label + ': outline crosses itself');
      }
    }
    total += A;
  }
  assert(Math.abs(total - RECT_AREA) < 1e-6, label + ': pieces sum to ' + total);
  // every crack edge has a piece on each side, once each
  const seen = new Set();
  for (const F of pane.faces) {
    for (let i = 0; i < F.v.length; i++) {
      if (!isCrack(F.e[i])) continue;
      const key = F.v[i].id + '>' + F.v[(i + 1) % F.v.length].id;
      assert(!seen.has(key), label + ': edge twice in one direction');
      seen.add(key);
    }
  }
  for (const key of seen) {
    const [a, b] = key.split('>');
    assert(seen.has(b + '>' + a), label + ': crack edge with a piece on one side only');
  }
  for (const c of pane.cracks) {
    for (let i = 1; i < c.pts.length; i++) {
      assert(seen.has(c.pts[i - 1].id + '>' + c.pts[i].id), label + ': crack segment missing from the pieces');
    }
  }
  // convex parts tile each piece
  for (const F of pane.faces) {
    const parts = convexParts(F, () => 1);
    assert(parts, label + ': piece could not be triangulated');
    let s = 0;
    for (const p of parts) {
      const m = p.pts.length;
      for (let i = 0; i < m; i++) assert(turn(p.pts[i], p.pts[(i + 1) % m], p.pts[(i + 2) % m]) >= -1e-9, label + ': part not convex');
      assert.strictEqual(p.rim.length, m, label + ': rim flags');
      s += area(p.pts);
    }
    assert(Math.abs(s - area(F.v)) < 1e-6, label + ': parts sum to ' + s + ', piece ' + area(F.v));
  }
}

// 1. A crack across the pane cuts it in two
{
  const p = create(RECT);
  const c = p.addPath([{ x: -8, y: 0 }, { x: 0, y: 0.5 }, { x: 8, y: 0 }], { role: 'main' }, false, false);
  assert(c, 'across: no crack');
  assert.strictEqual(p.faces.length, 2);
  assert.strictEqual(c.pts.length, 3);
  check(p, 'across');
}
// 2. Free ends still divide the glass, through invisible extensions
{
  const p = create(RECT);
  const c = p.addPath([{ x: -3, y: 0 }, { x: 0, y: 0.4 }, { x: 3, y: 0 }], { role: 'main' }, true, true);
  assert(c, 'free: no crack');
  assert.strictEqual(p.faces.length, 2);
  assert(p.faces.every((F) => F.e.includes('X')), 'free: no extension');
  assert.strictEqual(c.start, 'tip');
  assert.strictEqual(c.end, 'tip');
  check(p, 'free');
}
// 3. A branch off a kink, then a rung back to the main crack, closes a piece in
{
  const p = create(RECT);
  const main = p.addPath([{ x: -8, y: 0 }, { x: -2, y: 0 }, { x: 2, y: 0.3 }, { x: 8, y: 0 }], { role: 'main' }, false, false);
  const br = p.run(main.pts[1], Math.PI / 3, (i) => (i < 3 ? { dir: Math.PI / 3, len: 0.6 } : null), { role: 'branch' }, { bridge: 0 });
  assert(br, 'branch: no crack');
  assert.strictEqual(br.end, 'tip');
  check(p, 'branch');
  const on = p.pointOn(br, 0.7);
  assert(on, 'pointOn');
  const rung = p.run(on.v, -Math.PI / 4, (i) => (i < 20 ? { dir: -Math.PI / 4, len: 0.5 } : null), { role: 'rung' }, { bridge: 0 });
  assert(rung && rung.end === 'hit', 'rung should meet the main crack');
  assert.strictEqual(main.pts.length, 5, 'the T-junction joins the main crack');
  assert(p.faces.some((F) => F.e.every(isCrack)), 'no piece closed in by cracks');
  check(p, 'rung');
}
// 4. Bridging: a tip close to a crack runs on to meet it
{
  const p = create(RECT);
  p.addPath([{ x: -8, y: 0 }, { x: 8, y: 0 }], { role: 'main' }, false, false);
  const c = p.pointOn(p.cracks[0], 0.5);
  const up = p.run(c.v, Math.PI / 2, (i) => (i < 2 ? { dir: Math.PI / 2, len: 1 } : null), { role: 'b' }, { bridge: 0 });
  const on = p.pointOn(up, 1);
  const back = p.run(on.v, -Math.PI / 3, (i) => (i < 1 ? { dir: -Math.PI / 3, len: 1.5 } : null), { role: 'r' }, { bridge: 5 });
  assert(back && back.end === 'hit', 'bridge: should run on to the main crack');
  check(p, 'bridge');
}
// 5. Centroid of a square
{
  const c = centroid([{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 }]);
  assert(Math.abs(c.x - 1) < 1e-12 && Math.abs(c.y - 1) < 1e-12, 'centroid');
}
// 6. Random networks keep every invariant
for (let seed = 1; seed <= 300; seed++) {
  const rng = mulberry32(seed);
  const p = create(RECT);
  const pts = [{ x: -7.6, y: rng() * 4 - 2 }];
  let x = -7.6, y = pts[0].y;
  while (x < 6.5) {
    x += 0.5 + rng();
    y = Math.max(-4.5, Math.min(4, y + (rng() - 0.5) * 1.2));
    pts.push({ x: Math.min(x, 7.5), y });
  }
  const main = p.addPath(pts, { role: 'main' }, rng() < 0.5, rng() < 0.5);
  assert(main, 'seed ' + seed + ': main');
  for (let k = 0; k < 25; k++) {
    const c = p.cracks[Math.floor(rng() * p.cracks.length)];
    const on = p.pointOn(c, rng());
    if (!on) continue;
    const d0 = on.dir + (rng() < 0.5 ? -1 : 1) * (0.4 + rng() * 1.2);
    let used = 0;
    const len = 0.5 + rng() * 3;
    p.run(on.v, d0, (i, px, py, dir) => {
      if (used >= len) return null;
      const l = 0.2 + rng() * 0.6;
      used += l;
      return { dir: dir + (rng() - 0.5) * 0.5, len: l };
    }, { role: 'b' }, { bridge: rng() * 2 });
  }
  check(p, 'seed ' + seed);
}
console.log('pane: all checks passed');
```

- [ ] **Step 2: Run it to see it fail**

Run: `node "$SP/tests/pane.test.js"`
Expected: FAIL — `Cannot find module …/js/hero/pane.js`.

- [ ] **Step 3: Write `pane.js`**

<!-- write: js/hero/pane.js -->
```js
/* ============================================================
   hero/pane.js — the glass as a planar partition

   A pane starts as one polygon and is cut into pieces by cracks.
   Every crack is a polyline that runs from a point on the outline of
   the piece it enters until it meets that piece's outline again (an
   older crack, or the pane's edge), so it always cuts exactly one
   piece in two, and cracks meet at T-junctions instead of crossing.
   A crack that dies out in whole glass (a free tip) carries on
   invisibly to the outline, so it still divides the glass; the two
   pieces either side of that invisible part are really one, which is
   why only pieces closed in by cracks on every side ever move.

   Pure geometry: no THREE, no config, no randomness of its own.
   Vertices are shared objects ({ x, y, id }), so a point on a crack
   is the same object in every piece that touches it. A piece is
   { v: [vertex], e: [edge] }, counter-clockwise, where e[i] (the edge
   v[i] → v[i + 1]) is 'Z' on the pane's edge, 'X' on an invisible
   extension, or the crack object that runs along it.
============================================================ */
(function () {
  'use strict';
  const Hero = window.Hero = window.Hero || {};

  const isCrack = (k) => !!k && typeof k === 'object';
  const turn = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

  function area(vs) {
    let s = 0;
    for (let i = 0, n = vs.length; i < n; i++) {
      const p = vs[i], q = vs[(i + 1) % n];
      s += p.x * q.y - q.x * p.y;
    }
    return s / 2;
  }

  function centroid(vs) {
    let a = 0, x = 0, y = 0;
    for (let i = 0, n = vs.length; i < n; i++) {
      const p = vs[i], q = vs[(i + 1) % n], w = p.x * q.y - q.x * p.y;
      a += w; x += (p.x + q.x) * w; y += (p.y + q.y) * w;
    }
    if (Math.abs(a) < 1e-12) {
      x = 0; y = 0;
      for (const p of vs) { x += p.x; y += p.y; }
      return { x: x / vs.length, y: y / vs.length };
    }
    return { x: x / (3 * a), y: y / (3 * a) };
  }

  function inside(vs, x, y) {
    let c = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const a = vs[i], b = vs[j];
      if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) c = !c;
    }
    return c;
  }

  // First crossing of the ray p + t·d (t > 0) with a piece's outline
  function rayHit(F, px, py, dx, dy) {
    let t = Infinity, i = -1, u = 0;
    for (let k = 0, n = F.v.length; k < n; k++) {
      const a = F.v[k], b = F.v[(k + 1) % n];
      const ex = b.x - a.x, ey = b.y - a.y;
      const den = dx * ey - dy * ex;
      if (Math.abs(den) < 1e-12) continue;
      const wx = a.x - px, wy = a.y - py;
      const tk = (wx * ey - wy * ex) / den, uk = (wx * dy - wy * dx) / den;
      if (tk > 1e-7 && uk >= -1e-9 && uk <= 1 + 1e-9 && tk < t) { t = tk; i = k; u = uk; }
    }
    return { t, i, u };
  }

  // Does segment p→q properly cross segment a→b?
  function crosses(p, q, a, b) {
    return turn(p, q, a) * turn(p, q, b) < -1e-18 && turn(a, b, p) * turn(a, b, q) < -1e-18;
  }

  function convex(pts) {
    for (let i = 0, n = pts.length; i < n; i++) {
      if (turn(pts[i], pts[(i + 1) % n], pts[(i + 2) % n]) < -1e-12) return false;
    }
    return true;
  }

  // Ear clipping of a simple counter-clockwise polygon: index triples, or null
  function earClip(P) {
    const idx = P.map((_, i) => i), tris = [];
    const within = (p, a, b, c) => turn(a, b, p) > 1e-12 && turn(b, c, p) > 1e-12 && turn(c, a, p) > 1e-12;
    while (idx.length > 3) {
      let found = -1;
      for (let k = 0; k < idx.length && found < 0; k++) {
        const a = P[idx[(k + idx.length - 1) % idx.length]], b = P[idx[k]], c = P[idx[(k + 1) % idx.length]];
        if (turn(a, b, c) <= 1e-12) continue;                // reflex or flat: not an ear
        let ok = true;
        for (const j of idx) {
          const p = P[j];
          if (p !== a && p !== b && p !== c && within(p, a, b, c)) { ok = false; break; }
        }
        if (ok) found = k;
      }
      if (found < 0) return null;
      tris.push([idx[(found + idx.length - 1) % idx.length], idx[found], idx[(found + 1) % idx.length]]);
      idx.splice(found, 1);
    }
    tris.push(idx.slice());
    return tris;
  }

  /* A piece cut into convex parts for drawing: drop the corners it runs
     straight through, ear-clip, then merge triangles back together while
     they stay convex (Hertel–Mehlhorn). Each part is { pts, rim, value }:
     rim[i] says whether edge i (pts[i] → pts[i + 1]) lies on the piece's
     outline, and value[i] is the largest edgeValue(j) over the outline
     edges j it covers (0 for a cut made only for drawing). Returns null if
     the outline can't be triangulated. */
  function convexParts(F, edgeValue) {
    const n = F.v.length, idx = [];
    for (let i = 0; i < n; i++) {
      const p = F.v[(i + n - 1) % n], c = F.v[i], q = F.v[(i + 1) % n];
      const l1 = Math.hypot(c.x - p.x, c.y - p.y), l2 = Math.hypot(q.x - c.x, q.y - c.y);
      if (l1 < 1e-9 || l2 < 1e-9) continue;
      if (Math.abs(turn(p, c, q)) > 1e-6 * l1 * l2) idx.push(i);
    }
    const m = idx.length;
    if (m < 3) return null;
    const P = idx.map((i) => F.v[i]);
    const val = idx.map((i, k) => {
      let best = 0;
      for (let j = i; j !== idx[(k + 1) % m]; j = (j + 1) % n) best = Math.max(best, edgeValue ? edgeValue(j) : 0);
      return best;
    });
    const tris = earClip(P);
    if (!tris) return null;
    const outline = (a, b) => b === (a + 1) % m;
    const parts = tris;
    for (let again = true; again;) {
      again = false;
      search:
      for (let x = 0; x < parts.length; x++) {
        const A = parts[x];
        for (let i = 0; i < A.length; i++) {
          const u = A[i], w = A[(i + 1) % A.length];
          if (outline(u, w)) continue;
          for (let y = 0; y < parts.length; y++) {
            if (y === x) continue;
            const B = parts[y], j = B.indexOf(w);
            if (j < 0 || B[(j + 1) % B.length] !== u) continue;
            const M = [];
            for (let k = 0; k < A.length; k++) M.push(A[(i + 1 + k) % A.length]);   // w … u
            for (let k = 2; k < B.length; k++) M.push(B[(j + k) % B.length]);       // after u … before w
            if (!convex(M.map((q) => P[q]))) continue;
            parts[x] = M;
            parts.splice(y, 1);
            again = true;
            break search;
          }
        }
      }
    }
    return parts.map((ix) => {
      const rim = ix.map((q, k) => outline(q, ix[(k + 1) % ix.length]));
      return { pts: ix.map((q) => P[q]), rim, value: ix.map((q, k) => (rim[k] ? val[q] : 0)) };
    });
  }

  function create(outline) {
    let ids = 0;
    const vert = (x, y) => ({ x, y, id: ids++ });
    const faces = [{ v: outline.map((p) => vert(p.x, p.y)), e: outline.map(() => 'Z') }];
    const cracks = [];

    // Put vertex nv on edge a–b: in every piece that has that edge, and in
    // the crack that runs along it
    function splitEdge(a, b, nv) {
      let kind = null;
      for (const F of faces) {
        for (let i = 0, n = F.v.length; i < n; i++) {
          const p = F.v[i], q = F.v[(i + 1) % n];
          if ((p === a && q === b) || (p === b && q === a)) {
            kind = F.e[i];
            F.v.splice(i + 1, 0, nv);
            F.e.splice(i + 1, 0, kind);
            break;
          }
        }
      }
      if (isCrack(kind)) {
        const P = kind.pts, ia = P.indexOf(a);
        if (P[ia + 1] === b) P.splice(ia + 1, 0, nv);
        else if (ia > 0 && P[ia - 1] === b) P.splice(ia, 0, nv);
      }
    }

    // The vertex where a ray met edge h.i of piece F: an end of that edge if
    // it's within a hair, else a new vertex on it
    function hitVertex(F, h, x, y) {
      const n = F.v.length, a = F.v[h.i], b = F.v[(h.i + 1) % n];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      if (h.u * len < 1e-4) return a;
      if ((1 - h.u) * len < 1e-4) return b;
      const v = vert(x, y);
      splitEdge(a, b, v);
      return v;
    }

    // Cut piece F in two along chain (both ends on F's outline); kinds[j] is
    // the edge chain[j] → chain[j + 1]
    function cut(F, chain, kinds) {
      const n = F.v.length, m = chain.length - 1;
      const i0 = F.v.indexOf(chain[0]), i1 = F.v.indexOf(chain[m]);
      if (i0 < 0 || i1 < 0 || i0 === i1) return false;
      const A = [], Ae = [], B = [], Be = [];
      for (let i = i0; ; i = (i + 1) % n) { A.push(F.v[i]); if (i === i1) break; Ae.push(F.e[i]); }
      for (let j = m; j >= 1; j--) { Ae.push(kinds[j - 1]); if (j > 1) A.push(chain[j - 1]); }
      for (let i = i1; ; i = (i + 1) % n) { B.push(F.v[i]); if (i === i0) break; Be.push(F.e[i]); }
      for (let j = 0; j < m; j++) { Be.push(kinds[j]); if (j + 1 < m) B.push(chain[j + 1]); }
      faces.splice(faces.indexOf(F), 1, { v: A, e: Ae }, { v: B, e: Be });
      return true;
    }

    // The piece a crack leaving vertex v along (dx, dy) goes into
    function pieceAt(v, dx, dy) {
      const x = v.x + dx * 1e-5, y = v.y + dy * 1e-5;
      for (const F of faces) if (F.v.indexOf(v) >= 0 && inside(F.v, x, y)) return F;
      return null;
    }

    function selfCross(chain, cur, nx, ny) {
      const q = { x: nx, y: ny };
      for (let j = 0; j + 2 < chain.length; j++) if (crosses(cur, q, chain[j], chain[j + 1])) return true;
      return false;
    }

    /* Grow a crack from vertex `start`, which must be on a piece's outline.
       step(i, x, y, dir) returns segment i as { dir, len }, or null to stop
       in a free tip; segment 0 always keeps dir0. The crack ends where it
       meets the outline (a T-junction, or the pane's edge). A free tip
       carries on invisibly to the outline — unless another crack is within
       o.bridge ahead, when the crack itself runs on to meet it. Returns the
       crack (meta, plus pts, start: 'root', end: 'hit' | 'tip'), or null
       if it can't start. */
    function run(start, dir0, step, meta, o) {
      const F = pieceAt(start, Math.cos(dir0), Math.sin(dir0));
      if (!F) return null;
      const crack = Object.assign({}, meta, { pts: [start], start: 'root', end: 'tip' });
      const chain = [start], kinds = [];
      let cur = start, dir = dir0;
      for (let i = 0; ; i++) {
        const s = i < 64 ? step(i, cur.x, cur.y, dir) : null;
        const nd = s && i > 0 ? s.dir : dir;
        const dx = Math.cos(nd), dy = Math.sin(nd);
        if (s) {
          const h = rayHit(F, cur.x, cur.y, dx, dy);
          if (h.i < 0) return null;
          if (h.t <= s.len) {
            // meets the outline: a T-junction, or the pane's edge
            const hv = hitVertex(F, h, cur.x + dx * h.t, cur.y + dy * h.t);
            chain.push(hv); kinds.push(crack); crack.pts.push(hv);
            crack.end = 'hit';
            break;
          }
        }
        const nx = s ? cur.x + dx * s.len : cur.x, ny = s ? cur.y + dy * s.len : cur.y;
        if (!s || selfCross(chain, cur, nx, ny)) {
          if (i === 0) return null;
          // a free tip: on to the outline the way it was going
          const ex = Math.cos(dir), ey = Math.sin(dir);
          const h = rayHit(F, cur.x, cur.y, ex, ey);
          if (h.i < 0) return null;
          const bridge = isCrack(F.e[h.i]) && h.t <= ((o && o.bridge) || 0);
          const hv = hitVertex(F, h, cur.x + ex * h.t, cur.y + ey * h.t);
          chain.push(hv);
          if (bridge) { kinds.push(crack); crack.pts.push(hv); crack.end = 'hit'; } else kinds.push('X');
          break;
        }
        const v = vert(nx, ny);
        chain.push(v); kinds.push(crack); crack.pts.push(v);
        cur = v; dir = nd;
      }
      if (!cut(F, chain, kinds)) return null;
      cracks.push(crack);
      return crack;
    }

    /* The first crack, along a planned polyline of { x, y } points. A free
       end dies out in whole glass and carries on invisibly to the pane's
       edge; an end that isn't free is moved onto the edge. */
    function addPath(pts, meta, startFree, endFree) {
      if (faces.length !== 1 || pts.length < 2) return null;
      const F = faces[0], n = pts.length;
      // where the line from p through q first reaches the pane's edge
      const toEdge = (p, q) => {
        let dx = q.x - p.x, dy = q.y - p.y;
        const l = Math.hypot(dx, dy) || 1;
        dx /= l; dy /= l;
        const h = rayHit(F, p.x, p.y, dx, dy);
        return h.i < 0 ? null : hitVertex(F, h, p.x + dx * h.t, p.y + dy * h.t);
      };
      const away = (p, q) => ({ x: 2 * p.x - q.x, y: 2 * p.y - q.y });
      const crack = Object.assign({}, meta, { pts: [], start: startFree ? 'tip' : 'edge', end: endFree ? 'tip' : 'edge' });
      const chain = [], kinds = [];
      if (startFree) {
        const e = toEdge(pts[0], away(pts[0], pts[1]));
        if (!e) return null;
        const v = vert(pts[0].x, pts[0].y);
        chain.push(e, v); kinds.push('X'); crack.pts.push(v);
      } else {
        const e = toEdge(pts[1], pts[0]);
        if (!e) return null;
        chain.push(e); crack.pts.push(e);
      }
      for (let i = 1; i < n - 1; i++) {
        const v = vert(pts[i].x, pts[i].y);
        chain.push(v); kinds.push(crack); crack.pts.push(v);
      }
      if (endFree) {
        const v = vert(pts[n - 1].x, pts[n - 1].y);
        chain.push(v); kinds.push(crack); crack.pts.push(v);
        const e = toEdge(pts[n - 1], away(pts[n - 1], pts[n - 2]));
        if (!e) return null;
        chain.push(e); kinds.push('X');
      } else {
        const e = toEdge(pts[n - 2], pts[n - 1]);
        if (!e) return null;
        chain.push(e); kinds.push(crack); crack.pts.push(e);
      }
      if (!cut(F, chain, kinds)) return null;
      cracks.push(crack);
      return crack;
    }

    // A vertex at fraction f of the way along a crack (added if needed),
    // with the crack's direction there
    function pointOn(crack, f) {
      const P = crack.pts;
      let total = 0;
      for (let i = 1; i < P.length; i++) total += Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y);
      let want = total * f;
      for (let i = 1; i < P.length; i++) {
        const a = P[i - 1], b = P[i], l = Math.hypot(b.x - a.x, b.y - a.y);
        if (want <= l || i === P.length - 1) {
          const dir = Math.atan2(b.y - a.y, b.x - a.x);
          const u = l > 0 ? Math.min(want / l, 1) : 0;
          if (u * l < 0.05) return { v: a, dir };
          if ((1 - u) * l < 0.05) return { v: b, dir };
          const v = vert(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u);
          splitEdge(a, b, v);
          return { v, dir };
        }
        want -= l;
      }
      return null;
    }

    return { faces, cracks, addPath, run, pointOn };
  }

  Hero.pane = { create, area, centroid, convexParts, isCrack };
})();
```

- [ ] **Step 4: Run the test to see it pass**

Run: `node "$SP/tests/pane.test.js"`
Expected: `pane: all checks passed`

---

### Task 2: Config — running cracks, light and colour

**Files:**
- Modify: `js/hero/config.js` (the `rifts`, `particles` and `tiers` sections)

- [ ] **Step 1: Replace the `rifts` section**

<!-- splice: js/hero/config.js | from:     /* Rifts are glass fractures | to:     shards: { -->
```js
    /* Rifts are running cracks in a pane of glass: in from the screen edge,
       or along the black hole's rim. Branches split off, rungs run back and
       close shards in; each shard reflects the hole at its own tilt */
    rifts: {
      firstDelay: 0.8,                       // after the ignition finishes
      gap: [2.6, 4.6],
      crack: [1.2, 2.0],                     // s for the front to run the main crack's length
      open: [3.5, 5.0], heal: [1.8, 2.6],
      rimChance: 0.45,                       // else an edge run
      paneMargin: 0.8,                       // the pane reaches this far past the screen (lens units)
      // edge runs: in from a side, round the copy, out the far side or dying out
      edgeSides: [0.4, 0.4, 0.2],            // left, right, bottom
      edgeClear: [0.35, 1.1],                // how far clear of the copy it passes
      edgePartial: 0.35, edgePartLength: [0.45, 0.8],
      // rim runs: just outside the photon ring, where it's clear of the copy
      rimRadius: [1.02, 1.1],                // × shadow radius
      rimSpan: [80, 130],                    // degrees of arc
      rimBelow: 0.7,                         // below the copy rather than above, when both are clear
      rimLeadIn: 0.4,                        // runs in from the screen edge first
      rimPull: 0.9,                          // how hard it holds to its radius
      // the main crack: straight runs with small kinks and the odd sharp turn
      segment: [0.5, 1.2], kink: 12, sharp: [22, 40], sharpChance: 0.18, straighten: 0.45,
      rimSegment: [0.4, 0.75], rimKink: 7, rimSharp: [14, 24], rimSharpChance: 0.08, rimStraighten: 0.6,
      minLength: 4,                          // lens units
      // off the main crack
      branchChance: 0.8, branchAngle: [30, 65], branchLength: [1.2, 3.0], branchSegment: [0.35, 0.9],
      branchKink: 12, alternate: 0.7, branchSpeed: [0.6, 0.9], branchBridge: 0.8,
      rungTwice: 0.6, rungAngle: [80, 125], rungLength: [0.4, 1.2], rungBridge: 3.5,
      chipChance: 0.4, chipAngle: [40, 80], chipLength: [0.25, 0.6],
      // the glass: shards closed in by cracks move; the rest stays put
      offset: [0.1, 0.28], offsetJitter: [0.03, 0.12], bigOffset: 0.2, bigOffsetGain: 1.8,
      rotation: [0.035, 0.12], scale: [-0.03, 0.06],
      minShard: 0.004,                       // lens units²: slivers smaller than this stay put
      settle: 0.28,                          // s for a shard to snap to its tilt
      brightness: 0.35,
      fallChance: 0.5, fallMaxArea: 1.2, fall: [1.3, 2.1], fallSpin: [0.6, 2.2],
      // light and colour (CSS px)
      bandWidth: 9, bandShift: 5, bandSplit: 1.0,   // the split-colour band along each crack
      stillBand: 0.55,                       // the band where the glass stays put, relative
      edgeGlint: 0.9, edgeShadow: 0.35,
      tilt: [0.15, 0.45], curvature: [0.08, 0.25],  // each shard is a tilted, gently curved plate
      lightOffset: 0.6, shine: 40, reflection: 0.5, film: 1.6, iridescence: 0.55,
      mainWidth: 1.7, branchWidth: 1.1, rungWidth: 0.8, chipWidth: 0.7, tipTaper: 0.5,
      lineGain: 1.3, glowGain: 0.14, tipGain: 6.0,
      glint: 5.0, glintPower: 40, fringe: 1.1, occlude: 0.3,
      lightAngle: 2.2, lightRate: 0.16, lightMouse: 0.8,
      // placement
      avoidInflate: 0.06, candidates: 8,
      crowdDistance: 1.2, crowdMax: 0.15, minOnscreen: 0.6,
      userCooldown: 0.8, userLength: [2.5, 4.5], userJitter: 25,
      depth: [-0.25, 0.35], parallax: 0.35,
      flare: 3.0, flareRadius: 0.45, anchors: 2, anchorSpacing: 2.0,
    },

```

- [ ] **Step 2: Replace the `particles` section**

<!-- splice: js/hero/config.js | from:     particles: { | to:     /* Scale is the ceiling -->
```js
    particles: {
      sparkSize: [0.008, 0.018], sparkSpeed: [0.6, 2.4], sparkLife: [0.2, 0.5], sparkDrag: [1.5, 3.5],
      sparkGravity: 28,
      moteSize: [0.05, 0.09], moteLife: [0.4, 0.9],           // junction glints: four-point stars
      starSize: [0.08, 0.13], starLife: 0.2, starStep: 0.3,   // the star riding the running front
      debrisSize: [0.010, 0.022],
      split: { sparks: 0.18, motes: 0.06, debris: 0.3 },     // of the budget left after the front's stars
    },

```

- [ ] **Step 3: One or two fractures at once**

<!-- splice: js/hero/config.js | from:     tiers: { | to:     quality: { -->
```js
    tiers: {
      low:  { scaleMax: 0.75, bloomDiv: 4, bloomMips: 4, particles: 512,  shards: 10, rifts: 1, starLayers: 1, crossings: 2, aberration: false },
      mid:  { scaleMax: 1.0,  bloomDiv: 2, bloomMips: 5, particles: 1536, shards: 24, rifts: 2, starLayers: 2, crossings: 3, aberration: true },
      high: { scaleMax: 2.0,  bloomDiv: 2, bloomMips: 6, particles: 3072, shards: 40, rifts: 2, starLayers: 2, crossings: 3, aberration: true },
    },

```

- [ ] **Step 4: Syntax check**

Run: `node --check js/hero/config.js`
Expected: no output.

---

### Task 3: `rifts.js` — paths, the crack network, glass, geometry

**Files:**
- Rewrite: `js/hero/rifts.js`

- [ ] **Step 1: Write the new module**

<!-- write: js/hero/rifts.js -->
```js
/* ============================================================
   hero/rifts.js — running cracks: paths, glass, schedule, geometry

   A rift is a crack running through a pane of glass that hangs in the
   lens plane (the plane through the hole that faces the camera, world
   units). It comes in from the edge of the screen, or runs along the
   black hole's rim just outside the photon ring. Branches split off
   its kinks and rungs run back from them; every piece of glass they
   close in is a shard that shows the scene behind through its own
   tilt, so the picture breaks along the cracks. When it heals, a
   front runs along the crack: shards it passes either fall into the
   hole or settle back flush.

   Its whole life — path, timing, every shard and particle — is decided
   once from its seed when it spawns, then animated on the GPU from the
   clock. The scene is a pure function of (seed, scene time): the
   scheduler can fast-forward to any time.

   Each rift draws from separate random streams: its timeline
   (durations, gap to the next rift), its path, its glass (the cracks
   off the main one, tilts, which shards fall) and its particles. The
   path depends on the viewport (it steers round the copy); the
   timeline never does, so the schedule is identical at every screen
   size.
============================================================ */
(function () {
  'use strict';
  const Hero = window.Hero = window.Hero || {};

  const TAU = Math.PI * 2;
  const lerp  = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const rad   = (deg) => deg * Math.PI / 180;
  const range = (rng, r) => lerp(r[0], r[1], rng());
  const sign  = (rng) => (rng() < 0.5 ? -1 : 1);
  const angDiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));   // a − b, in (−π, π]

  function mulberry32(a) {
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function mixSeed(a, b) {
    let h = (a ^ Math.imul(b + 0x9E3779B9, 0x85EBCA6B)) >>> 0;
    h = Math.imul(h ^ (h >>> 16), 0x7FEB352D) >>> 0;
    h = Math.imul(h ^ (h >>> 15), 0x846CA68B) >>> 0;
    return (h ^ (h >>> 16)) >>> 0;
  }

  // Distance along a polyline of { x, y } points, at each point
  function lengths(pts) {
    const s = [0];
    for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    return s;
  }
  const pathLen = (pts) => { const s = lengths(pts); return s[s.length - 1]; };

  // The nearest point of a polyline to (x, y): how far along it is, the
  // direction there, and which side of it (x, y) is on (+1 left)
  function nearest(pts, s, x, y) {
    let best = Infinity, out = null;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const ex = b.x - a.x, ey = b.y - a.y, l2 = Math.max(ex * ex + ey * ey, 1e-12);
      const u = clamp(((x - a.x) * ex + (y - a.y) * ey) / l2, 0, 1);
      const px = a.x + ex * u, py = a.y + ey * u;
      const d = (x - px) * (x - px) + (y - py) * (y - py);
      if (d < best) {
        const l = Math.sqrt(l2);
        best = d;
        out = { along: s[i - 1] + l * u, tx: ex / l, ty: ey / l, side: ex * (y - a.y) - ey * (x - a.x) >= 0 ? 1 : -1 };
      }
    }
    return out;
  }

  function segCross(p, q, a, b) {
    const t = (u, v, w) => (v.x - u.x) * (w.y - u.y) - (v.y - u.y) * (w.x - u.x);
    return t(p, q, a) * t(p, q, b) < 0 && t(a, b, p) * t(a, b, q) < 0;
  }
  function selfCrossing(pts) {
    for (let i = 1; i < pts.length; i++) {
      for (let j = i + 2; j < pts.length; j++) if (segCross(pts[i - 1], pts[i], pts[j - 1], pts[j])) return true;
    }
    return false;
  }

  function pick(rng, weights) {
    let u = rng() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < weights.length; i++) { u -= weights[i]; if (u <= 0) return i; }
    return weights.length - 1;
  }

  // When the heal front (shaders.js healFront) reaches ρ, after heal start
  const healAt = (rift, rho) => rift.healDur * (Math.min(rho, 1) + 0.1) / 1.3;

  /* ============================================================
     RiftSystem
  ============================================================ */
  function create(o) {
    const cfg = Hero.config, rc = cfg.rifts, geo = Hero.geo;
    const R_SH = geo.shadowRadius;
    const R_IN = cfg.disk.rIn, R_OUT = cfg.disk.rOut;
    const tier = o.tier;
    const nSlots = tier.rifts + 2;               // room for rifts still healing
    const slots = new Array(nSlots).fill(null);
    const records = [];                          // every rift ever scheduled (timelines only)
    const reduced = !!o.reduced;
    let box = null;
    let next = cfg.ignition.duration + rc.firstDelay;
    let index = 0;
    let userCooldownUntil = 0;

    /* ── timelines ── */
    function timeline(rng, spawn, user) {
      const crackDur = range(rng, rc.crack), openDur = range(rng, rc.open), healDur = range(rng, rc.heal);
      const gap = range(rng, rc.gap), depth = range(rng, rc.depth), phase = rng() * 100;
      // 1.5× covers the branches and rungs, which finish after the main crack
      const healStart = spawn + crackDur * (reduced ? 2.0 : 1.5) + openDur;
      // the last shards leave at ~0.9 of the heal and fall for up to rc.fall[1]
      return { spawn, crackDur, openDur, healDur, healStart, end: healStart + healDur + rc.fall[1] + 0.5, gap, depth, phase, user };
    }

    const isActive = (r, t) => r.spawn <= t && t < r.healStart;
    const liveAt = (r, t) => r.spawn <= t && t < r.end;

    function activeCount(t) {
      let n = 0;
      for (const r of slots) if (r && isActive(r, t)) n++;
      return n;
    }
    function freeSlot(t) {
      for (let k = 0; k < nSlots; k++) if (!slots[k] || slots[k].end <= t) return k;
      return -1;
    }
    // Earliest moment after t at which a blocked spawn could go ahead
    function nextRelease(t) {
      let m = Infinity;
      for (const r of slots) {
        if (!r) continue;
        if (r.healStart > t) m = Math.min(m, r.healStart);
        if (r.end > t) m = Math.min(m, r.end);
      }
      return m;
    }

    /* ── the screen, the pane, and where cracks may not go ── */
    const inRect = (x, y, b) => x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1;
    const blockedAt = (x, y) => !!box && box.keepOut.some((k) => inRect(x, y, k));
    // The screen in lens units at rest (16:9 until the copy has been measured)
    const screen = () => (box && box.screen) || { x0: -7.17, x1: 7.17, y0: -4.19, y1: 3.87 };
    function paneRect() {
      const s = screen(), m = rc.paneMargin;
      return { x0: s.x0 - m, x1: s.x1 + m, y0: s.y0 - m, y1: s.y1 + m };
    }

    /* ── planning a path ── */
    /* Walk a crack: straight runs with small kinks and the odd sharp turn,
       pulled toward the heading steer() asks for and bent round the keep-out
       zones. It stops when steer() returns null, when it is boxed in (a free
       end), at w.maxLen, or where it leaves the pane (an end on its edge). */
    function walk(start, dir0, w, rng) {
      const P = paneRect();
      const pts = [{ x: start.x, y: start.y }];
      let x = start.x, y = start.y, dir = dir0, len = 0, edge = false;
      for (let i = 0; i < 96 && len < w.maxLen - 1e-6; i++) {
        const l = Math.min(range(rng, w.seg), w.maxLen - len);
        const sharp = rng() < w.sharpChance, amt = sharp ? rad(range(rng, w.sharp)) : rad(w.kink) * (rng() * 2 - 1), sg = sign(rng);
        const target = w.steer(x, y, dir, len);
        if (target === null) break;
        if (i > 0) dir += (sharp ? sg * amt : amt) + angDiff(target, dir) * w.straighten;
        // round the keep-outs: the nearest clear heading, trying w.side first
        let ok = false;
        for (let k = 0; k < 13 && !ok; k++) {
          const d = dir + (k === 0 ? 0 : (k % 2 ? 1 : -1) * (w.side || 1) * rad(15 * Math.ceil(k / 2)));
          const tx = x + Math.cos(d) * l, ty = y + Math.sin(d) * l;
          if (!w.avoid || (!blockedAt(tx, ty) && !blockedAt((x + tx) / 2, (y + ty) / 2))) { dir = d; ok = true; }
        }
        if (!ok) break;
        x += Math.cos(dir) * l; y += Math.sin(dir) * l; len += l;
        pts.push({ x, y });
        if (!inRect(x, y, P)) { edge = true; break; }
      }
      return { pts, len, edge };
    }

    // Steer through waypoints: head for each in turn until within reach
    function via(wps, reach) {
      let k = 0;
      return (x, y) => {
        while (k < wps.length - 1 && Math.hypot(wps[k].x - x, wps[k].y - y) < reach) k++;
        return Math.atan2(wps[k].y - y, wps[k].x - x);
      };
    }

    const mainWalk = (steer, maxLen, side) => ({ seg: rc.segment, kink: rc.kink, sharp: rc.sharp, sharpChance: rc.sharpChance,
      straighten: rc.straighten, steer, maxLen, avoid: true, side });

    /* In from a screen edge, round the copy — under it if there's room,
       else over — and out the far side, or dying out part-way */
    function edgeRun(rng) {
      const s = screen(), P = paneRect();
      const K = box && box.keepOut[0];
      const navY = box && box.keepOut[1] ? box.keepOut[1].y0 : s.y1;
      const side = pick(rng, rc.edgeSides);                    // 0 left, 1 right, 2 bottom
      const clear = range(rng, rc.edgeClear);
      const partial = rng() < rc.edgePartial, part = range(rng, rc.edgePartLength);
      const j = [rng(), rng(), rng(), rng()];
      // the height it passes the copy at
      let pass = K ? K.y0 - clear : lerp(s.y0, s.y1, 0.3), under = true;
      if (K && pass < s.y0 + 0.5 && K.y1 + clear < navY - 0.4) { pass = K.y1 + clear; under = false; }
      const kx0 = K ? K.x0 : -2, kx1 = K ? K.x1 : 2;
      const beside = !K || (K.x0 > s.x0 + 1 && K.x1 < s.x1 - 1);   // room for the disk beside the copy
      const mid = K ? (K.y0 + K.y1) / 2 : 0;
      // where it crosses the disk beside the copy on its way in or out
      const band = (u) => clamp(beside ? lerp(pass + (under ? 0.3 : -0.3), under ? Math.max(mid, pass + 0.6) : Math.min(mid, pass - 0.6), u)
        : pass + lerp(-0.3, 0.3, u), s.y0 + 0.3, navY - 0.3);
      let start, wps, dir0, avoidSide;
      if (side === 2) {
        const right = j[0] < 0.5, x0 = lerp(kx0, kx1, lerp(0.15, 0.85, j[1]));
        start = { x: x0, y: P.y0 };
        wps = [{ x: x0 * 0.7, y: pass },
          { x: right ? kx1 + lerp(0.2, 0.9, j[2]) : kx0 - lerp(0.2, 0.9, j[2]), y: pass },
          { x: right ? P.x1 + 1 : P.x0 - 1, y: band(j[3]) }];
        dir0 = Math.PI / 2;
        avoidSide = right ? -1 : 1;
      } else {
        const L = side === 0, f = L ? 1 : -1;
        start = { x: L ? P.x0 : P.x1, y: band(j[0]) };
        wps = [{ x: (L ? kx0 : kx1) - f * lerp(0.2, 0.9, j[1]), y: pass },
          { x: (L ? kx1 : kx0) + f * lerp(0.2, 0.9, j[2]), y: pass + lerp(-0.3, 0.3, j[3]) },
          { x: L ? P.x1 + 1 : P.x0 - 1, y: band(1 - j[0]) }];
        dir0 = L ? 0 : Math.PI;
        avoidSide = (L ? -1 : 1) * (under ? 1 : -1);
      }
      const full = pathLen([start].concat(wps));
      const w = walk(start, dir0, mainWalk(via(wps, 1.0), partial ? full * part : full * 1.4, avoidSide), rng);
      return { kind: 'edge', pts: w.pts, startFree: false, endFree: !w.edge };
    }

    /* Along the black hole's rim, just outside the photon ring, where the
       ring is clear of the copy: below it or above it. Both ends die out in
       whole glass, unless it first runs in from the screen edge. */
    function rimRun(rng) {
      const s = screen(), P = paneRect();
      const navY = box && box.keepOut[1] ? box.keepOut[1].y0 : s.y1;
      const r0 = R_SH * range(rng, rc.rimRadius);
      const span = rad(range(rng, rc.rimSpan));
      const ccw = rng() < 0.5, pos = rng(), below = rng() < rc.rimBelow, leadIn = rng() < rc.rimLeadIn, ly = rng();
      const clearAt = (a) => {
        const x = Math.cos(a) * r0, y = Math.sin(a) * r0;
        return !blockedAt(x, y) && inRect(x, y, s);
      };
      // the clear stretch of ring round the bottom (or the top)
      const arcAround = (mid) => {
        if (!clearAt(mid)) return null;
        const st = rad(2);
        let a0 = mid, a1 = mid;
        while (a0 - st > mid - rad(170) && clearAt(a0 - st)) a0 -= st;
        while (a1 + st < mid + rad(170) && clearAt(a1 + st)) a1 += st;
        return [a0, a1];
      };
      const lo = arcAround(-Math.PI / 2), hi = arcAround(Math.PI / 2);
      const arc = (below && lo) || hi || lo;
      if (!arc || arc[1] - arc[0] < rad(40)) return null;
      const width = Math.min(span, arc[1] - arc[0]);
      const a0 = arc[0] + (arc[1] - arc[0] - width) * pos;
      const sg = ccw ? 1 : -1;
      const aS = ccw ? a0 : a0 + width, aE = ccw ? a0 + width : a0;
      const onArc = (x, y) => {
        const a = Math.atan2(y, x), r = Math.hypot(x, y);
        if (sg * angDiff(a, aE) > 0) return null;                          // past the end of the arc
        return a + sg * (Math.PI / 2 + rc.rimPull * (r - r0));             // the tangent, pulled back to r0
      };
      const arcStart = { x: Math.cos(aS) * r0, y: Math.sin(aS) * r0 };
      const w = { seg: rc.rimSegment, kink: rc.rimKink, sharp: rc.rimSharp, sharpChance: rc.rimSharpChance,
        straighten: rc.rimStraighten, avoid: true, side: -sg };
      if (!leadIn) {
        const r = walk(arcStart, aS + sg * Math.PI / 2, Object.assign(w, { steer: onArc, maxLen: r0 * width * 1.25 }), rng);
        return { kind: 'rim', pts: r.pts, startFree: true, endFree: !r.edge, r0 };
      }
      // in from the screen edge on the arc's side, then round the rim
      const start = { x: arcStart.x < 0 ? P.x0 : P.x1, y: clamp(arcStart.y + lerp(-1.2, 1.2, ly), s.y0 + 0.4, navY - 0.4) };
      let onRim = false;
      const steer = (x, y) => {
        if (!onRim && Math.hypot(x - arcStart.x, y - arcStart.y) < 0.7) onRim = true;
        return onRim ? onArc(x, y) : Math.atan2(arcStart.y - y, arcStart.x - x);
      };
      const lead = Math.hypot(arcStart.x - start.x, arcStart.y - start.y);
      const r = walk(start, Math.atan2(arcStart.y - start.y, arcStart.x - start.x),
        Object.assign(w, { steer, maxLen: lead * 1.3 + r0 * width * 1.25 }), rng);
      return { kind: 'rim', pts: r.pts, startFree: false, endFree: !r.edge, r0 };
    }

    // A click: a crack running both ways from the click, roughly round the hole
    function userRun(at, rng, avoid) {
      const r = Math.hypot(at.x, at.y);
      const base = r > 0.4 ? Math.atan2(at.y, at.x) + Math.PI / 2 : rng() * TAU;
      const d = base + rad(rc.userJitter) * (rng() * 2 - 1);
      const half = (dir) => walk(at, dir, { seg: rc.segment, kink: rc.kink, sharp: rc.sharp, sharpChance: rc.sharpChance,
        straighten: rc.straighten, steer: () => dir, maxLen: range(rng, rc.userLength), avoid }, rng);
      const f = half(d), b = half(d + Math.PI);
      return { kind: 'user', pts: b.pts.slice().reverse().concat(f.pts.slice(1)), startFree: !b.edge, endFree: !f.edge,
        origin: b.pts.length - 1 };
    }

    // How much of a path is on screen, and how much of it crowds open fractures
    function onscreen(pts) {
      const s = screen(), L = lengths(pts);
      let inside = 0;
      for (let i = 1; i < pts.length; i++) {
        if (inRect((pts[i - 1].x + pts[i].x) / 2, (pts[i - 1].y + pts[i].y) / 2, s)) inside += L[i] - L[i - 1];
      }
      return L[L.length - 1] > 0 ? inside / L[L.length - 1] : 0;
    }
    function crowding(pts, others) {
      if (!others.length) return 0;
      const d2 = rc.crowdDistance * rc.crowdDistance;
      let near = 0;
      for (const p of pts) if (others.some((q) => (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y) < d2)) near++;
      return near / pts.length;
    }

    /* ── a rift's path, decided at its spawn time ──
       Always planned, even for rifts long over by the time a fast-forward
       reaches them: later paths keep clear of earlier ones, so they must
       match live play exactly. */
    function shape(rift) {
      const rng = mulberry32(mixSeed(rift.seed, 0xA11CE));
      if (rift.user) {
        rift.path = userRun(rift.at, rng, !blockedAt(rift.at.x, rift.at.y));
        return rift.path.pts.length >= 3;
      }
      const others = [];
      for (const r of slots) {
        if (!r || r === rift || !r.path || !liveAt(r, rift.spawn)) continue;
        for (const p of r.path.pts) others.push(p);
      }
      let best = null, bestScore = Infinity;
      for (let k = 0; k < rc.candidates; k++) {
        const p = rng() < rc.rimChance ? rimRun(rng) : edgeRun(rng);
        if (!p || p.pts.length < 3 || selfCrossing(p.pts)) continue;
        const L = pathLen(p.pts), on = onscreen(p.pts), cr = crowding(p.pts, others);
        if (L >= rc.minLength && on >= rc.minOnscreen && cr <= rc.crowdMax) { best = p; break; }
        const score = cr + (1 - on) * 0.5 + (L < rc.minLength ? 1 : 0);
        if (score < bestScore) { bestScore = score; best = p; }
      }
      rift.path = best;
      return !!best;
    }

    /* ============================================================
       THE GLASS — the cracks off the main one, their timing, the shards
       Times here are seconds after the rift spawns.
    ============================================================ */
    function glass(rift, rng) {
      const path = rift.path, user = !!rift.user, pane = Hero.pane;
      const P = paneRect();
      const net = pane.create([{ x: P.x0, y: P.y0 }, { x: P.x1, y: P.y0 }, { x: P.x1, y: P.y1 }, { x: P.x0, y: P.y1 }]);
      const main = net.addPath(path.pts, { role: 'main', width: rc.mainWidth }, path.startFree, path.endFree);
      if (!main) return null;
      const origin = user ? main.pts[path.origin] : null;
      const avoid = !user || !blockedAt(rift.at.x, rift.at.y);

      // A crack off another: straight runs with small kinks, holding its
      // heading, turning aside from the keep-outs (or stopping short)
      function stepper(len, seg, kink) {
        let used = 0, heading = null;
        return (i, x, y, dir) => {
          if (heading === null) heading = dir;
          const l = Math.min(range(rng, seg), len - used), jig = (rng() * 2 - 1) * rad(kink);
          if (l < 0.04) return null;
          let d = i ? dir + jig + angDiff(heading, dir) * 0.25 : dir;
          if (avoid) {
            let ok = false;
            for (let k = 0; k < (i ? 7 : 1) && !ok; k++) {
              const t = d + (k === 0 ? 0 : (k % 2 ? 1 : -1) * rad(15 * Math.ceil(k / 2)));
              const tx = x + Math.cos(t) * l, ty = y + Math.sin(t) * l;
              if (!blockedAt(tx, ty) && !blockedAt((x + tx) / 2, (y + ty) / 2)) { d = t; ok = true; }
            }
            if (!ok) return null;
          }
          used += l;
          return { dir: d, len: l };
        };
      }

      // Branches off the kinks: alternating sides (outward, on the rim), with
      // the odd chip on the other side
      const kinks = main.pts.slice(1, -1);
      const branches = [];
      let side = sign(rng);
      for (const v of kinks) {
        const roll = rng(), alt = rng(), ang = rad(range(rng, rc.branchAngle)), len = range(rng, rc.branchLength);
        const chip = rng(), chipAng = rad(range(rng, rc.chipAngle)), chipLen = range(rng, rc.chipLength);
        const i = main.pts.indexOf(v), a = main.pts[i - 1];
        const d = Math.atan2(v.y - a.y, v.x - a.x);
        if (path.kind === 'rim') side = -Math.sin(d) * v.x + Math.cos(d) * v.y > 0 ? 1 : -1;   // away from the hole
        else if (alt < rc.alternate) side = -side;
        if (roll < rc.branchChance) {
          const br = net.run(v, d + side * ang, stepper(len, rc.branchSegment, rc.branchKink),
            { role: 'branch', side, root: v, parent: main, width: rc.branchWidth }, { bridge: rc.branchBridge });
          if (br) branches.push(br);
        }
        if (chip < rc.chipChance) {
          net.run(v, d - side * chipAng, stepper(chipLen, [0.15, 0.35], 8),
            { role: 'chip', root: v, parent: main, width: rc.chipWidth }, { bridge: 1.0 });
        }
      }
      // Rungs: back from each branch toward the crack it left, closing shards in
      for (const br of branches) {
        const n = rng() < rc.rungTwice ? 2 : 1;
        for (let k = 0; k < n; k++) {
          const f = range(rng, [0.3, 0.9]), ang = rad(range(rng, rc.rungAngle)), len = range(rng, rc.rungLength);
          const p = net.pointOn(br, f);
          if (!p) continue;
          net.run(p.v, p.dir - br.side * ang, stepper(len, [0.25, 0.7], 6),
            { role: 'rung', root: p.v, parent: br, width: rc.rungWidth }, { bridge: rc.rungBridge });
        }
      }

      // ── timing: the main crack's front covers it in crackDur ──
      const sMain = lengths(main.pts), Lm = sMain[sMain.length - 1];
      const sO = origin ? sMain[main.pts.indexOf(origin)] : 0;
      const reach = user ? Math.max(sO, Lm - sO) : Lm;
      const vMain = Math.max(reach, 0.5) / rift.crackDur;
      main.speed = vMain;
      main.arr = sMain.map((s) => Math.abs(s - sO) / vMain);
      const arrOn = (c, v) => { const i = c.pts.indexOf(v); return i >= 0 && c.arr ? c.arr[i] : 0; };
      // The rest start as the front passes their roots, and never reach a
      // crack before that crack does
      for (const c of net.cracks) {
        if (c === main) continue;
        const speed = vMain * range(rng, rc.branchSpeed), delay = range(rng, [0.02, 0.08]);
        const s = lengths(c.pts), L = s[s.length - 1];
        let t0 = arrOn(c.parent, c.root) + delay;
        if (c.end === 'hit') {
          const v = c.pts[c.pts.length - 1];
          for (const q of net.cracks) if (q !== c && q.arr && q.pts.indexOf(v) >= 0) t0 = Math.max(t0, arrOn(q, v) - L / speed + 0.03);
        }
        c.speed = speed;
        c.arr = s.map((x) => t0 + x / speed);
      }
      // The heal runs along the main crack (out from the click, for a click)
      const rhoAt = (x, y) => {
        const n = nearest(main.pts, sMain, x, y);
        return user ? Math.abs(n.along - sO) / Math.max(reach, 1e-6) : n.along / Math.max(Lm, 1e-6);
      };

      // ── shards: every piece closed in by cracks on all sides ──
      const edgeT = (F, i) => {
        const k = F.e[i];
        return pane.isCrack(k) ? Math.max(arrOn(k, F.v[i]), arrOn(k, F.v[(i + 1) % F.v.length])) : 0;
      };
      const shards = [];
      for (const F of net.faces) {
        F.moving = false;
        if (!F.e.every(pane.isCrack)) continue;
        // every random number is drawn first, so which pieces move never shifts the stream
        const r = { ja: rng() * TAU, jm: range(rng, rc.offsetJitter), m: range(rng, rc.offset), big: rng() < rc.bigOffset,
          rs: sign(rng), rot: range(rng, rc.rotation), sc: range(rng, rc.scale), ta: rng() * TAU, tm: range(rng, rc.tilt),
          cv: sign(rng) * range(rng, rc.curvature), br: rng(), film: rng(), fall: rng(), fj: rng(), fd: range(rng, rc.fall),
          fs: sign(rng) * range(rng, rc.fallSpin), fo: lerp(0.8, 1.6, rng()) };
        const A = pane.area(F.v), c = pane.centroid(F.v);
        if (A < rc.minShard || blockedAt(c.x, c.y)) continue;
        const parts = pane.convexParts(F, (i) => edgeT(F, i));
        if (!parts) continue;
        let t1 = 0;
        for (let i = 0; i < F.v.length; i++) t1 = Math.max(t1, edgeT(F, i));
        const rho = rhoAt(c.x, c.y);
        // The two sides of the crack slide past each other; on the rim,
        // pieces lean out from the hole or in toward it
        const m = r.m * (r.big ? rc.bigOffsetGain : 1);
        let ox, oy;
        if (path.kind === 'rim') {
          const rr = Math.hypot(c.x, c.y) || 1, out = rr > path.r0 ? 1 : -1;
          ox = c.x / rr * m * out; oy = c.y / rr * m * out;
        } else {
          const n = nearest(main.pts, sMain, c.x, c.y);
          ox = n.tx * m * n.side; oy = n.ty * m * n.side;
        }
        ox += Math.cos(r.ja) * r.jm; oy += Math.sin(r.ja) * r.jm;
        F.moving = true;
        shards.push({
          c, area: A, parts, t1, rho,
          off: [ox, oy], rot: r.rs * r.rot * clamp(1.2 / (1 + A), 0.35, 1), scale: r.sc,
          tilt: [Math.cos(r.ta) * r.tm, Math.sin(r.ta) * r.tm], curv: r.cv,
          bright: 1 + (r.br - 0.5) * rc.brightness, film: r.film,
          fall: !reduced && A <= rc.fallMaxArea && r.fall < rc.fallChance
            ? { start: healAt(rift, rho) + r.fj * 0.12, dur: r.fd, spin: r.fs, orbit: r.fo } : null,
        });
      }

      // ── the crack lines, and which side of each the glass stays put ──
      const leftOf = new Map();                  // "a>b" → the piece to the left of edge a → b
      for (const F of net.faces) for (let i = 0, n = F.v.length; i < n; i++) leftOf.set(F.v[i].id + '>' + F.v[(i + 1) % n].id, F);
      const still = (a, b) => { const F = leftOf.get(a.id + '>' + b.id); return F && F.moving ? 0 : 1; };
      const lines = [];
      for (const c of net.cracks) {
        const n = c.pts.length;
        if (n < 2) continue;
        const s = lengths(c.pts), L = s[n - 1];
        const taper = (x) => {
          let k = 1;
          if (c.end === 'tip') k = Math.min(k, clamp((L - x) / rc.tipTaper, 0, 1));
          if (c.start === 'tip') k = Math.min(k, clamp(x / rc.tipTaper, 0, 1));
          return 0.3 + 0.7 * k;
        };
        lines.push({
          pts: c.pts.map((v) => [v.x, v.y]), arr: c.arr, speed: c.speed,
          width: s.map((x) => c.width * taper(x)),
          rho: c.pts.map((v) => rhoAt(v.x, v.y)),
          still: c.pts.map((v, j) => {
            const a = c.pts[Math.min(j, n - 2)], b = c.pts[Math.min(j, n - 2) + 1];
            return [still(a, b), still(b, a)];                                // left, right
          }),
        });
      }

      // Where the main crack crosses the near side of the disk, the disk
      // flares as the front passes
      const anchors = [];
      const cam = geo.camera(rift.spawn, { x: 0, y: 0 }, { x: 0, y: 0 }, cfg.camera, o.baseFov());
      for (let i = 1; i < main.pts.length - 1 && anchors.length < rc.anchors; i++) {
        const v = main.pts[i];
        const d = geo.lensToDisk(v.x, v.y, cam);
        if (!d || d.r < R_IN * 1.05 || d.r > R_OUT * 0.85 || d.x * cam.pos[0] + d.z * cam.pos[2] <= 0) continue;
        if (anchors.some((q) => Math.hypot(q.x - v.x, q.y - v.y) < rc.anchorSpacing)) continue;
        anchors.push({ x: v.x, y: v.y, t: main.arr[i] });
      }
      return { main, net, lines, shards, anchors, branches, rhoAt };
    }

    /* ── what a rift emits: splinters and particles, all scheduled up front ── */
    function emissions(rift, g, rng) {
      const sc = cfg.shards, pc = cfg.particles, main = g.main;
      const T = (x) => rift.spawn + x;                               // spawn-relative → scene time
      const pts = main.pts, arr = main.arr, S = lengths(pts), L = S[S.length - 1];
      // a point part-way along the main crack: where, when the front gets there, which way
      function along(s) {
        let i = 1;
        while (i < pts.length - 1 && S[i] < s) i++;
        const a = pts[i - 1], b = pts[i], u = clamp((s - S[i - 1]) / Math.max(S[i] - S[i - 1], 1e-9), 0, 1);
        return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), t: lerp(arr[i - 1], arr[i], u), dir: Math.atan2(b.y - a.y, b.x - a.x) };
      }
      // the sharpest kinks first
      const kinks = [];
      for (let i = 1; i < pts.length - 1; i++) {
        const d1 = Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x), d2 = Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x);
        kinks.push({ v: pts[i], t: arr[i], turn: Math.abs(angDiff(d2, d1)), dir: d2 });
      }
      kinks.sort((a, b) => b.turn - a.turn);

      // Splinters: flakes of glass thrown off the sharpest kinks; they fall
      // in as the heal front passes. None in reduced motion.
      const shards = [];
      const nSplinters = reduced || !kinks.length ? 0 : o.shardsPerRift;
      for (let k = 0; k < nSplinters; k++) {
        const q = kinks[k % Math.min(kinks.length, 6)];
        const a = rng() * TAU, d = 0.1 * Math.sqrt(rng()), sd = sign(rng);
        const x = q.v.x + Math.cos(a) * d, y = q.v.y + Math.sin(a) * d;
        const drift = range(rng, sc.drift);
        shards.push({
          x, y, size: lerp(sc.size[0], sc.size[1], rng() * rng()), rot: rng() * TAU,
          r0: lerp(0.6, 1.0, rng()), r1: lerp(0.6, 1.0, rng()), r2: lerp(0.6, 1.0, rng()), seed: rng() * 97,
          appear: T(q.t) + 0.02 + rng() * 0.1,
          detach: healAt(rift, g.rhoAt(x, y)) + rng() * 0.15,
          fall: range(rng, sc.fall),
          dx: -Math.sin(q.dir) * sd * drift, dy: Math.cos(q.dir) * sd * drift,
          spin: sign(rng) * range(rng, sc.spin),
          orbit: range(rng, sc.orbit),
        });
      }

      const parts = [];
      const budget = o.particlesPerSlot;
      // A star rides the running front. Not in reduced motion.
      if (!reduced) {
        for (let s = pc.starStep * 0.5; s < L && parts.length < budget * 0.25; s += pc.starStep) {
          const p = along(s);
          parts.push({ x: p.x, y: p.y, vx: p.x + 0.002, vy: p.y, start: T(p.t), life: pc.starLife, size: range(rng, pc.starSize), type: 1 });
        }
      }
      const rest = Math.max(budget - parts.length, 0);
      const nSparks = reduced ? 0 : Math.floor(rest * pc.split.sparks);
      const nGlints = Math.floor(rest * pc.split.motes);
      const nDebris = Math.floor(rest * pc.split.debris);

      // Sparks: glitter thrown sideways off the running front, and from where branches split
      const roots = g.branches.map((b) => ({ x: b.root.x, y: b.root.y, t: b.arr[0], dir: Math.atan2(b.pts[1].y - b.pts[0].y, b.pts[1].x - b.pts[0].x) }));
      for (let k = 0; k < nSparks; k++) {
        const u = rng(), w = rng();
        const p = roots.length && u < 0.3 ? roots[Math.floor(w * roots.length)] : along(w * L);
        const a = p.dir + sign(rng) * (Math.PI / 2 + (rng() - 0.5) * 1.2), sp = range(rng, pc.sparkSpeed);
        parts.push({ x: p.x, y: p.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, start: T(p.t) + rng() * 0.05,
          life: range(rng, pc.sparkLife), size: range(rng, pc.sparkSize), type: 0, c0: range(rng, pc.sparkDrag), c1: pc.sparkGravity });
      }

      // Glints: the junctions twinkle now and then while the fracture is open
      const junctions = [];
      for (const c of g.net.cracks) {
        if (c === main) continue;
        junctions.push({ x: c.pts[0].x, y: c.pts[0].y, t: c.arr[0] });
        if (c.end === 'hit') { const v = c.pts[c.pts.length - 1]; junctions.push({ x: v.x, y: v.y, t: c.arr[c.arr.length - 1] }); }
      }
      for (let k = 0; k < nGlints && junctions.length; k++) {
        const jn = junctions[Math.floor(rng() * junctions.length)];
        const life = range(rng, pc.moteLife), u = rng(), size = range(rng, pc.moteSize);
        const from = T(jn.t) + 0.1, to = rift.healStart - life * 0.5;
        if (to <= from) continue;
        parts.push({ x: jn.x, y: jn.y, vx: jn.x + 0.002, vy: jn.y, start: lerp(from, to, u), life, size, type: 1 });
      }

      // Debris: dust shed by everything falling in, following it down
      const sources = [];
      for (const s of g.shards) if (s.fall) sources.push({ p: [s.c.x, s.c.y], start: s.fall.start, dur: s.fall.dur, orbit: s.fall.orbit });
      for (const s of shards) sources.push({ p: [s.x + s.dx, s.y + s.dy], start: s.detach, dur: s.fall, orbit: s.orbit });
      const per = sources.length ? Math.min(Math.floor(nDebris / sources.length), 12) : 0;
      for (const s of sources) {
        const r0 = Math.hypot(s.p[0], s.p[1]), th0 = Math.atan2(s.p[1], s.p[0]);
        for (let m = 0; m < per; m++) {
          parts.push({
            x: 0, y: 0, vx: 0, vy: 0,
            start: s.start + lerp(0.05, 0.45, rng()), life: s.dur * lerp(0.85, 1.15, rng()),
            size: range(rng, pc.debrisSize), type: 2,
            c0: r0 * lerp(0.96, 1.06, rng()), c1: th0 + lerp(-0.12, 0.12, rng()), c2: s.orbit * lerp(0.9, 1.15, rng()),
          });
        }
      }
      return { shards, parts };
    }

    /* ── write everything a rift will do into its slot ── */
    function build(rift) {
      const g = glass(rift, mulberry32(mixSeed(rift.seed, 0x61A55)));
      if (!g) return false;
      const em = emissions(rift, g, mulberry32(mixSeed(rift.seed, 0xE1155)));
      rift.anchors = g.anchors;
      o.writeWeb(rift.slot, g);
      o.shards.write(rift.slot, em.shards);
      o.particles.write(rift.slot, em.parts);
      rift.built = true;
      return true;
    }

    function place(rift, t) {
      const k = freeSlot(rift.spawn);
      if (k < 0) return false;
      rift.slot = k;
      slots[k] = rift;
      if (!shape(rift)) { slots[k] = null; return false; }
      // Only rifts still alive now are worth writing to the GPU
      if (liveAt(rift, t)) build(rift);
      return true;
    }

    function spawnAuto(at, t) {
      const seed = mixSeed(o.seed, index);
      const tl = timeline(mulberry32(mixSeed(seed, 0x7133)), at, false);
      const rift = Object.assign(tl, { id: index, seed, built: false });
      index++;
      next = at + tl.gap;
      records.push(rift);
      if (records.length > 64) records.shift();
      place(rift, t);
    }

    /* ── per frame ── */
    function update(t) {
      // Auto spawns, event-driven so fast-forward and live play agree exactly
      let guard = 0;
      while (t >= next && guard++ < 256) {
        if (activeCount(next) < tier.rifts && freeSlot(next) >= 0) {
          spawnAuto(next, t);
        } else {
          const rel = nextRelease(next);
          if (!Number.isFinite(rel)) break;
          next = rel;
        }
      }
      // Retire rifts that are over
      for (let k = 0; k < nSlots; k++) {
        const r = slots[k];
        if (r && r.end <= t) { slots[k] = null; o.clearSlot(k); }
      }
    }

    function writeUniforms(slotA, slotB, t) {
      for (let k = 0; k < slotA.length; k++) {
        const r = k < nSlots ? slots[k] : null;
        if (r && r.built && r.spawn <= t) {
          slotA[k].set(r.spawn, r.crackDur, r.healStart, r.healDur);
          slotB[k].set(r.depth, 1, r.phase, r.user ? 1 : 0);
        } else {
          slotA[k].set(0, 0, 1e9, 1);
          slotB[k].set(0, 0, 0, 0);
        }
      }
    }

    /* A flare where the main crack crosses the disk: each frame the point is
       sent straight through to the disk plane, so the flare stays pinned
       under the crack as the camera drifts */
    function writeFlares(flares, t, cam, parallax) {
      let f = 0;
      for (const r of slots) {
        if (!r || !r.built || !r.anchors) continue;
        for (const a of r.anchors) {
          if (f >= flares.length) break;
          const lx = a.x + parallax.x * r.depth, ly = a.y + parallax.y * r.depth;
          const d = geo.lensToDisk(lx, ly, cam);
          const t0 = r.spawn + a.t;
          let I = 0;
          if (d && d.r > R_IN && d.r < R_OUT && t >= t0) {
            const age = t - t0;
            const rise = clamp(age / 0.12, 0, 1);
            const fall = 1 - clamp((t - r.healStart) / (r.healDur * 0.8), 0, 1);
            // a pop as the front passes that settles to a steady glow
            I = rc.flare * rise * fall * (0.55 + 0.45 * Math.exp(-age / 0.5)) * (0.9 + 0.1 * Math.sin(t * 1.9 + r.phase));
          }
          flares[f].set(d ? d.x : 0, d ? d.z : 0, I, rc.flareRadius);
          f++;
        }
      }
      for (; f < flares.length; f++) flares[f].set(0, 0, 0, 1);
    }

    /* Click to shatter: one user fracture at a time (a new one heals the
       last), 0.8 s cooldown; at the limit the oldest automatic one heals early */
    function tear(lx, ly, t, nowMs) {
      if (nowMs < userCooldownUntil) return false;
      for (const r of slots) {
        if (r && r.user && isActive(r, t)) forceHeal(r, t);
      }
      if (activeCount(t) >= tier.rifts) {
        let oldest = null;
        for (const r of slots) if (r && !r.user && isActive(r, t) && (!oldest || r.spawn < oldest.spawn)) oldest = r;
        if (oldest) forceHeal(oldest, t);
      }
      const k = freeSlot(t);
      if (k < 0) return false;
      const seed = mixSeed(o.seed ^ 0x5EED, Math.floor(nowMs));
      const tl = timeline(mulberry32(seed), t, true);
      const par = o.parallax();
      const rift = Object.assign(tl, { id: -1, seed, built: false, at: { x: lx - par.x * tl.depth, y: ly - par.y * tl.depth } });
      rift.slot = k;
      slots[k] = rift;
      if (!shape(rift) || !build(rift)) { slots[k] = null; return false; }
      userCooldownUntil = nowMs + rc.userCooldown * 1000;
      return true;
    }

    function forceHeal(r, t) {
      if (r.healStart <= t) return;
      r.healStart = t;
      r.end = t + r.healDur + rc.fall[1] + 0.5;
    }

    return {
      nSlots, update, writeUniforms, writeFlares, tear,
      setAvoidBox(b) { box = b; },
      activeCount: (t) => activeCount(t),
      liveParticles(t) {
        let n = 0;
        for (let k = 0; k < nSlots; k++) if (slots[k]) n += o.particles.alive(k, t, slots[k].healStart);
        return n;
      },
      slots,
    };
  }

  /* ============================================================
     GEOMETRY — one shard mesh and one crack mesh per slot
  ============================================================ */
  const CELL_MAX_VERTS = 6144;
  const LINE_MAX_POINTS = 1024;

  function dynAttr(count, size) {
    return new THREE.BufferAttribute(new Float32Array(count * size), size).setUsage(THREE.DynamicDrawUsage);
  }

  // Upload only what was written
  function touch(g, names, count) {
    for (const k of names) {
      const a = g.attributes[k];
      a.updateRange.offset = 0;
      a.updateRange.count = count * a.itemSize;
      a.needsUpdate = true;
    }
  }

  function createCellGeometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', dynAttr(CELL_MAX_VERTS, 3));
    for (let k = 1; k <= 6; k++) g.setAttribute('aT' + k, dynAttr(CELL_MAX_VERTS, 4));
    g.setDrawRange(0, 0);
    return g;
  }

  // Every convex part of a shard is fanned from its own centre: three
  // vertices per edge, the first at the centre
  function writeCellGeometry(g, glassData, slot) {
    const P = g.attributes.position.array;
    const [T1, T2, T3, T4, T5, T6] = [1, 2, 3, 4, 5, 6].map((k) => g.attributes['aT' + k].array);
    const put = (A, o, a, b, c, d) => { A[o] = a; A[o + 1] = b; A[o + 2] = c; A[o + 3] = d; };
    let v = 0;
    for (const sh of glassData.shards) {
      let need = 0;
      for (const part of sh.parts) need += part.pts.length * 3;
      if (v + need > CELL_MAX_VERTS) break;
      const f = sh.fall;
      for (const part of sh.parts) {
        const pc = Hero.pane.centroid(part.pts), n = part.pts.length;
        for (let i = 0; i < n; i++) {
          const a = part.pts[i], b = part.pts[(i + 1) % n];
          const ex = b.x - a.x, ey = b.y - a.y, el = Math.hypot(ex, ey);
          if (el < 1e-7) continue;
          let nx = -ey / el, ny = ex / el;                       // inward, for a counter-clockwise part
          let h = (pc.x - a.x) * nx + (pc.y - a.y) * ny;
          if (h < 0) { nx = -nx; ny = -ny; h = -h; }
          if (h < 1e-7) continue;
          const nAng = Math.atan2(ny, nx);
          for (let corner = 0; corner < 3; corner++) {
            const p = corner === 0 ? pc : (corner === 1 ? a : b);
            const o3 = v * 3, o4 = v * 4;
            P[o3] = p.x; P[o3 + 1] = p.y; P[o3 + 2] = 0;
            put(T1, o4, sh.c.x, sh.c.y, sh.off[0], sh.off[1]);
            put(T2, o4, sh.rot, sh.scale, sh.t1, sh.curv);
            put(T3, o4, sh.tilt[0], sh.tilt[1], sh.bright, sh.film);
            put(T4, o4, corner === 0 ? 1 : 0, h, nAng, part.rim[i] ? 1 : 0);
            put(T5, o4, part.value[i], slot, sh.rho, 0);
            put(T6, o4, f ? f.start : -1, f ? f.dur : 1, f ? f.spin : 0, f ? f.orbit : 1);
            v++;
          }
        }
      }
    }
    touch(g, ['position', 'aT1', 'aT2', 'aT3', 'aT4', 'aT5', 'aT6'], v);
    g.setDrawRange(0, v);
  }

  function createLineGeometry() {
    const nv = LINE_MAX_POINTS * 2;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', dynAttr(nv, 3));
    g.setAttribute('aNrm', dynAttr(nv, 2));
    g.setAttribute('aLa', dynAttr(nv, 4));
    g.setAttribute('aLb', dynAttr(nv, 4));
    g.setAttribute('aLc', dynAttr(nv, 2));
    g.setIndex(new THREE.BufferAttribute(new Uint16Array(LINE_MAX_POINTS * 6), 1).setUsage(THREE.DynamicDrawUsage));
    g.setDrawRange(0, 0);
    return g;
  }

  // Unit normal of segment a → b (to its left)
  function segNormal(a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  }

  // One strip per crack, two vertices per point, mitred at the kinks
  function writeLineGeometry(g, glassData, slot) {
    const Pa = g.attributes.position.array, N = g.attributes.aNrm.array;
    const La = g.attributes.aLa.array, Lb = g.attributes.aLb.array, Lc = g.attributes.aLc.array, I = g.index.array;
    let v = 0, idx = 0, used = 0;
    glassData.lines.forEach((line, li) => {
      const pts = line.pts, n = pts.length;
      if (n < 2 || used + n > LINE_MAX_POINTS) return;
      const v0 = v;
      for (let i = 0; i < n; i++) {
        const n1 = segNormal(pts[Math.max(i - 1, 0)], pts[Math.max(i, 1)]);
        const n2 = segNormal(pts[Math.min(i, n - 2)], pts[Math.min(i + 1, n - 1)]);
        let mx = n1[0] + n2[0], my = n1[1] + n2[1];
        const ml = Math.hypot(mx, my);
        if (ml < 1e-6) { mx = n1[0]; my = n1[1]; } else { mx /= ml; my /= ml; }
        const k = 1 / Math.max(mx * n1[0] + my * n1[1], 0.5);
        const hash = (Math.abs(Math.sin((li + 1) * 12.9898 + i * 78.233)) * 43758.5453) % 1;
        for (let side = -1; side <= 1; side += 2) {
          Pa[v * 3] = pts[i][0]; Pa[v * 3 + 1] = pts[i][1]; Pa[v * 3 + 2] = 0;
          N[v * 2] = mx * k; N[v * 2 + 1] = my * k;
          La[v * 4] = line.arr[i]; La[v * 4 + 1] = line.speed; La[v * 4 + 2] = line.width[i] * 0.5; La[v * 4 + 3] = line.rho[i];
          Lb[v * 4] = side; Lb[v * 4 + 1] = slot; Lb[v * 4 + 2] = Math.atan2(my, mx); Lb[v * 4 + 3] = hash;
          Lc[v * 2] = line.still[i][0]; Lc[v * 2 + 1] = line.still[i][1];
          v++;
        }
      }
      for (let i = 0; i < n - 1; i++) {
        const a = v0 + 2 * i;
        I[idx++] = a; I[idx++] = a + 1; I[idx++] = a + 2;
        I[idx++] = a + 1; I[idx++] = a + 3; I[idx++] = a + 2;
      }
      used += n;
    });
    touch(g, ['position', 'aNrm', 'aLa', 'aLb', 'aLc'], v);
    g.index.updateRange.offset = 0;
    g.index.updateRange.count = idx;
    g.index.needsUpdate = true;
    g.setDrawRange(0, idx);
  }

  Hero.rifts = {
    create, mulberry32, mixSeed,
    createCellGeometry, writeCellGeometry, createLineGeometry, writeLineGeometry,
  };
})();
```

- [ ] **Step 2: Syntax check**

Run: `node --check js/hero/rifts.js`
Expected: no output.

---

### Task 4: Shaders — colour bands, light cores, plate reflections, stars

**Files:**
- Modify: `js/hero/shaders.js` (three splices)

- [ ] **Step 1: `SLOTS` without the impact uniform**

<!-- splice: js/hero/shaders.js | from:   /* Per-rift state, one entry per slot: | to:   /* ── fullscreen triangle ── */ -->
```js
  /* Per-rift state, one entry per slot:
     uSlotA = (spawn, crackDur, healStart, healDur)   — crackDur 0 = empty slot
     uSlotB = (depth, gain, seed, userRift)
     uPxLens is lens units per buffer pixel, uPxScale buffer pixels per CSS
     pixel; uLight = (direction, angle) of the light the glass catches. */
  const SLOTS = /* glsl */`
uniform vec4 uSlotA[MAX_SLOTS];
uniform vec4 uSlotB[MAX_SLOTS];
uniform vec2 uParallax;
uniform float uTime;
uniform float uReduced;
uniform float uPxLens;
uniform float uPxScale;
uniform vec3 uLight;
// The heal front, as a position along the main crack (0 where it starts,
// 1 where it ends): it runs from −0.1 to 1.2 over the heal (rifts.js
// schedules falls to match)
float healFront(vec4 A) { return (uTime - A.z) / max(A.w, 1e-3) * 1.3 - 0.1; }
`;

```

- [ ] **Step 2: Shards and crack lines**

<!-- splice: js/hero/shaders.js | from:   /* Glass shards: the cells of a fracture web | to:   /* Shards: one instanced triangle each. -->
```js
  /* Glass shards: the pieces a fracture's cracks close in, cut into convex
     parts and fanned from each part's centre. Every vertex carries its
     shard's whole life, so once written the CPU never touches it again.
       aT1 = shard centre.xy, offset.xy
       aT2 = rotation, scale, snap time (s after spawn), plate curvature
       aT3 = plate tilt.xy, brightness, film phase
       aT4 = fan weight (1 centre, 0 rim), rim height, rim inward normal (angle), rim is a crack (1) or a cut made for drawing (0)
       aT5 = when the crack along the rim arrives (s after spawn), slot, heal order ρ, _
       aT6 = fall start (after heal start; < 0 never), fall time, spin, orbit rate
     A shard is drawn where it sits but samples the scene through its own
     rotation, shift and scale, so the picture breaks along every crack.
     Near a crack the scene splits into R, G and B, and the shard is a
     slightly tilted, curved plate that reflects the turning light. */
  const CELL_VERT = COMMON + VIEW + SLOTS + /* glsl */`
in vec4 aT1;
in vec4 aT2;
in vec4 aT3;
in vec4 aT4;
in vec4 aT5;
in vec4 aT6;
uniform vec4 uGlassA;     // settle time, colour band width (CSS px), band shift (CSS px), channel split
out vec2  vSample;
out vec2  vBend;          // uv shift at the rim: inward normal × band shift
out vec3  vRim;           // fan weight, rim height px, band strength
out vec4  vLook;          // brightness, film phase, heat, alpha
out vec3  vPlate;         // plate normal.xy here, how far it has snapped out
out float vLit;

mat2 rot2(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
// ease-out-back: the shard snaps to its tilt with a touch of overshoot
float settle(float x) {
  x = clamp(x, 0.0, 1.0) - 1.0;
  return 1.0 + 2.70158 * x * x * x + 1.70158 * x * x;
}
float ease(float t, float t0, float dur) {
  float x = (t - t0) / dur;
  if (x <= 0.0) return 0.0;
  return uReduced > 0.5 ? smoothstep(0.0, 1.0, x * 0.25) : settle(x);
}
void main() {
  int  slot = int(aT5.y + 0.5);
  vec4 A = uSlotA[slot];
  vec4 B = uSlotB[slot];
  if (A.y <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float tRel  = uTime - A.x;
  float front = healFront(A);
  bool  falls = aT6.x >= 0.0 && uReduced < 0.5;
  float relax = falls ? 1.0 : 1.0 - smoothstep(aT5.z - 0.15, aT5.z + 0.15, front);
  float k = ease(tRel, aT2.z, uGlassA.x) * relax;

  vec2 rest = position.xy;
  vec2 par  = uParallax * B.x;
  vec2 r1   = rest - aT1.xy;
  vec2 d    = rot2(aT2.x * k) * r1 * (1.0 + aT2.y * k) - r1 + aT1.zw * k;

  vec2  drawn = rest;
  vec2  nIn   = vec2(cos(aT4.z), sin(aT4.z));
  float alpha = 1.0, heat = 0.0, loose = 0.0;
  if (falls && uTime > A.z + aT6.x) {
    // Breaks free and spirals into the hole. It stays glass: what it shows
    // is the scene behind wherever it is now, bent by its tilt — a shard
    // that kept its own patch of picture would drag black sky across the disk.
    float tau = clamp((uTime - A.z - aT6.x) / aT6.y, 0.0, 1.0);
    vec2  p0  = aT1.xy;
    float r0  = length(p0);
    float th  = atan(p0.y, p0.x) + aT6.w * (1.0 / (1.0 - 0.9 * tau) - 1.0);
    float r   = r0 * pow(1.0 - tau, 2.0 / 3.0);
    mat2  sp  = rot2(aT6.z * tau);
    drawn = r * vec2(cos(th), sin(th)) + sp * r1 * (1.0 - 0.6 * tau);
    nIn   = sp * nIn;
    // shards already over the shadow shrink away instead of crossing its edge
    alpha = (r0 > R_SH * 1.2 ? smoothstep(R_SH * 0.97, R_SH * 1.2, r) : 1.0 - smoothstep(0.3, 1.0, tau))
          * (1.0 - step(1.0, tau));
    heat  = smoothstep(0.1, 0.85, tau);
    loose = smoothstep(0.0, 0.25, tau);          // a free shard catches light on every edge
  }
  float on = clamp(k, 0.0, 1.0);

  vSample = suvToUv(lensToSuv(drawn + par + d));
  vBend   = lensDeltaToUv(nIn * uPxLens * uGlassA.z * uPxScale);
  // the colour band shows once the crack along this rim has arrived, and
  // widens as the shard snaps out
  float band = aT4.w * smoothstep(0.0, 0.06, tRel - aT5.x) * (0.35 + 0.65 * on) * relax;
  vRim    = vec3(aT4.x, aT4.y / uPxLens, mix(band, aT4.w, loose));
  vLit    = sq(max(dot(-nIn, uLight.xy), 0.0));            // the edge faces the light
  vPlate  = vec3(aT3.xy + aT2.w * r1, on);
  vLook   = vec4(1.0 + (aT3.z - 1.0) * on, aT3.w, heat, alpha * B.y);
  gl_Position = suvToClip(lensToSuv(drawn + par));
}
`;

  const CELL_FRAG = COMMON + /* glsl */`
uniform sampler2D uScene;
uniform vec4 uGlassA;     // settle, band width (CSS px), band shift (CSS px), channel split
uniform vec4 uGlassB;     // edge glint, reflection, edge shadow, _
uniform vec4 uGlassC;     // light off-axis, shininess, film scale, iridescence
uniform vec3 uLight;
uniform float uPxScale;
uniform vec3 uCoreTint;
uniform vec3 uEmber;
in vec2  vSample;
in vec2  vBend;
in vec3  vRim;
in vec4  vLook;
in vec3  vPlate;
in float vLit;
out vec4 fragColor;
void main() {
  // Near a crack the scene bends and splits into R, G and B.
  // Distance to the rim = fan weight × rim height.
  float band = exp(-vRim.x * vRim.y / (uGlassA.y * uPxScale)) * vRim.z;
  vec3 c;
  if (band > 0.02) {
    vec2 o = vBend * band;
    c.r = textureLod(uScene, vSample + o * (1.0 + uGlassA.w), 0.0).r;
    c.g = textureLod(uScene, vSample + o, 0.0).g;
    c.b = textureLod(uScene, vSample + o * (1.0 - uGlassA.w), 0.0).b;
  } else {
    c = textureLod(uScene, vSample, 0.0).rgb;
  }
  c *= vLook.x;
  // thick glass: edges that face the light glint, the rest fall into shadow
  c *= 1.0 - band * (1.0 - vLit) * uGlassB.z;
  c += uCoreTint * sq(band) * vLit * uGlassB.x;
  // a tilted, gently curved plate reflecting the turning light, with a
  // thin-film sheen whose colour shifts with the angle
  vec3  n    = normalize(vec3(vPlate.xy, 1.0));
  vec3  L    = normalize(vec3(uLight.xy * uGlassC.x, 1.0));
  float spec = pow(max(reflect(-L, n).z, 0.0), uGlassC.y);
  vec3  film = 0.5 + 0.5 * cos(TAU * (vLook.y + dot(n.xy, uLight.xy) * uGlassC.z + vec3(0.0, 0.33, 0.67)));
  c += mix(vec3(1.0), film, uGlassC.w) * spec * uGlassB.y * vPlate.z;
  c = mix(c, c * uEmber * 1.6, vLook.z * 0.7);                                    // reddens as it falls
  float a = vLook.w;
  fragColor = vec4(c * a, a);
}
`;

  /* Crack lines: one strip per crack, two vertices per point.
       aNrm = miter normal (lens units per unit of offset)
       aLa  = arrival (s after spawn), front speed (lens units/s), core half-width (CSS px), heal order ρ
       aLb  = side (±1), slot, normal angle, hash
       aLc  = the glass stays put on the left, on the right (0/1)
     A crack is drawn as light: a white-hot core with red and blue edges. It
     is revealed per pixel — arrival time is linear along each segment, so
     the front is exact however fast it runs. Where the glass on a side
     stays put, the strip is wider and carries that side's band of split
     colour (moving shards draw their own). */
  const CRACK_VERT = COMMON + VIEW + SLOTS + /* glsl */`
in vec2 aNrm;
in vec4 aLa;
in vec4 aLb;
in vec2 aLc;
uniform vec4 uGlassA;     // settle, band width (CSS px), band shift (CSS px), channel split
uniform vec4 uCrackB;     // still-side band, glint sharpness, fringe px, core occlusion
out float vX;             // signed px from the centre line (+ left)
out vec3  vW;             // core half-width px, _, coverage
out vec4  vT;             // arrival, front speed, time since spawn, fade
out vec2  vGlint;         // glint, brightness
out vec2  vStill;         // the glass stays put: left, right
out vec2  vNUv;           // uv per buffer px along the left normal
void main() {
  int  slot = int(aLb.y + 0.5);
  vec4 A = uSlotA[slot];
  vec4 B = uSlotB[slot];
  if (A.y <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float side  = aLb.x;
  float still = side > 0.0 ? aLc.x : aLc.y;
  float hwB = aLa.z * uPxScale;
  float hw  = max(hwB, 0.55);                   // never thinner than about a pixel...
  // room for the glow, or for this side's band of colour
  float ext = hw + 2.5 + still * step(0.001, uCrackB.x) * uGlassA.y * 2.5 * uPxScale;
  vec2  lp  = position.xy + uParallax * B.x + aNrm * side * ext * uPxLens;
  float front = healFront(A);
  vX    = side * ext;
  vW    = vec3(hw, 0.0, hwB / hw);              // ...but dimmer when it would be
  // a crack fades as the shards either side of it settle or fall
  vT    = vec4(aLa.x, aLa.y, uTime - A.x, (1.0 - smoothstep(aLa.w - 0.08, aLa.w + 0.22, front)) * B.y);
  // stretches that face the light flash as it swings round; the rest is uneven
  vGlint = vec2(pow(max(cos(2.0 * (aLb.z - uLight.z)), 0.0), uCrackB.y) * (0.35 + 0.65 * aLb.w),
                0.35 + 0.65 * sq(fract(aLb.w * 7.13)));
  vStill = aLc;
  vNUv   = lensDeltaToUv(normalize(aNrm) * uPxLens);
  gl_Position = suvToClip(lensToSuv(lp));
}
`;

  const CRACK_FRAG = COMMON + /* glsl */`
uniform sampler2D uScene;
uniform vec2  uRes;
uniform vec4  uGlassA;    // settle, band width (CSS px), band shift (CSS px), channel split
uniform vec4  uCrackA;    // core gain, glow gain, glint gain, tip gain
uniform vec4  uCrackB;    // still-side band, glint sharpness, fringe px, core occlusion
uniform vec3  uCoreTint;
uniform float uPxLens;
uniform float uPxScale;
uniform float uReduced;
in float vX;
in vec3  vW;
in vec4  vT;
in vec2  vGlint;
in vec2  vStill;
in vec2  vNUv;
out vec4 fragColor;
float line(float d, float hw) { return clamp(hw + 0.5 - d, 0.0, 1.0); }   // box-filtered edge
void main() {
  float hw = vW.x;
  float x  = vX, d = abs(x);
  float f  = uCrackB.z * uPxScale;
  // a hairline of white light, its edges split into a spectrum
  vec3  core = vec3(line(abs(x - f), hw), line(d, hw), line(abs(x + f), hw));
  float glow = exp(-sq(d / (hw + 1.6)));
  // the crack front, in px along the crack
  float since = vT.z - vT.x;
  float fpx   = since * vT.y / uPxLens;
  float vis   = uReduced > 0.5 ? smoothstep(0.0, 1.5, since) : clamp(fpx + 0.5, 0.0, 1.0);
  float tip   = uReduced > 0.5 ? 0.0 : exp(-sq(fpx / 22.0)) * step(0.0, fpx);
  float k     = vis * vT.w;
  vec3  light = core * uCoreTint * (uCrackA.x * vGlint.y + uCrackA.z * vGlint.x + uCrackA.w * tip) * vW.z
              + glow * uCoreTint * uCrackA.y * (1.0 + 4.0 * vGlint.x + 3.0 * tip);
  // where the glass on this side stays put, the crack's own band of split colour
  float still = x > 0.0 ? vStill.x : vStill.y;
  float bw    = uGlassA.y * uPxScale;
  float band  = still * uCrackB.x * exp(-d / bw) * smoothstep(hw * 0.5, hw + 1.0, d) * k;
  vec3  ca    = vec3(0.0);
  if (band > 0.01) {
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 o  = -sign(x) * vNUv * uGlassA.z * uPxScale * exp(-d / bw);     // toward the crack
    ca.r = textureLod(uScene, uv + o * (1.0 + uGlassA.w), 0.0).r;
    ca.g = textureLod(uScene, uv + o, 0.0).g;
    ca.b = textureLod(uScene, uv + o * (1.0 - uGlassA.w), 0.0).b;
  }
  float occ = core.g * uCrackB.w * vW.z * k;
  fragColor = vec4(ca * band + light * k, band + occ * (1.0 - band));
}
`;

```

- [ ] **Step 3: Four-point star glints**

<!-- splice: js/hero/shaders.js | from:   /* Particles: sparks (0), glints (1), debris (2). | to:   const BLOOM_DOWN_FRAG -->
```js
  /* Particles: sparks (0), glints (1), debris (2).
     aPA = p0.xy + (velocity | destination).xy
     aPB = start, life, size, type   — debris start is relative to heal start
     aPC = type params (drag, gravity | orbit r0, θ0, w), slot
     Glints are four-point stars with a faint rainbow ring. */
  const PARTICLE_VERT = COMMON + VIEW + SLOTS + /* glsl */`
in vec4 aPA;
in vec4 aPB;
in vec4 aPC;
uniform vec3 uSparkCol;
uniform vec3 uMoteCol;
uniform vec3 uDebrisCol;
out vec2  vQuad;
out vec3  vCol;
out float vStar;
void main() {
  float type = aPB.w;
  int   slot = int(aPC.w + 0.5);
  vec4  A = uSlotA[slot];
  vec4  B = uSlotB[slot];
  float start = aPB.x + (abs(type - 2.0) < 0.5 ? A.z : 0.0);
  float age = uTime - start;
  float life = aPB.y;
  vStar = 0.0;
  if (A.y <= 0.0 || life <= 0.0 || age < 0.0 || age > life) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float x = age / life;
  vec2  pos, vel;
  float size = aPB.z, len = 1.0;
  vec3  col;
  if (type < 0.5) {                                   // spark: drag + pull toward the hole
    float k  = aPC.x;
    vec2  g  = -aPC.y * aPA.xy / pow(max(length(aPA.xy), 1.0), 3.0);
    float ek = exp(-k * age);
    pos = aPA.xy + aPA.zw * (1.0 - ek) / k + 0.5 * g * age * age;
    vel = aPA.zw * ek + g * age;
    len = 1.0 + min(length(vel) * 0.03 / max(size, 1e-3), 3.5);   // a short streak, not a needle
    col = mix(uSparkCol, uMoteCol, x) * pow(1.0 - x, 1.5);
  } else if (type < 1.5) {                            // glint: a brief star, barely drifting
    float e = smoothstep(0.0, 1.0, x);
    pos = mix(aPA.xy, aPA.zw, e);
    vel = aPA.zw - aPA.xy;
    col = uMoteCol * sin(PI * x) * (1.0 - smoothstep(A.z, A.z + 0.35, uTime));
    vStar = 1.0;
  } else {                                            // debris: same spiral as the shards
    float r0 = aPC.x, th0 = aPC.y, w = aPC.z;
    float r  = r0 * pow(1.0 - x, 2.0 / 3.0);
    float th = th0 + w * (1.0 / (1.0 - 0.9 * x) - 1.0);
    pos = r * vec2(cos(th), sin(th));
    vel = vec2(-sin(th), cos(th)) * (w * 0.9 / sq(1.0 - 0.9 * x)) * r;
    len = 1.0 + 3.0 * x * x;
    col = uDebrisCol * smoothstep(R_SH * 0.97, R_SH * 1.2, r) * smoothstep(0.0, 0.08, x);
  }
  col *= B.y;
  // Quad along the velocity; never smaller than about a pixel (energy kept)
  float wid = max(size, uPxLens * 0.75);
  col *= sq(size / wid);
  vec2  ax = length(vel) > 1e-5 ? normalize(vel) : vec2(1.0, 0.0);
  vec2  qp = position.xy;
  vec2  lp = pos + uParallax * B.x + ax * qp.x * wid * len + vec2(-ax.y, ax.x) * qp.y * wid;
  vQuad = qp;
  vCol  = col;
  gl_Position = suvToClip(lensToSuv(lp));
}
`;

  const PARTICLE_FRAG = COMMON + /* glsl */`
in vec2  vQuad;
in vec3  vCol;
in float vStar;
out vec4 fragColor;
void main() {
  vec2 q = vQuad;
  if (vStar > 0.5) {
    // a four-point star: a hot centre, thin arms, a faint rainbow ring
    float r    = length(q);
    float arms = exp(-abs(q.x) * 5.0 - q.y * q.y * 90.0) + exp(-abs(q.y) * 5.0 - q.x * q.x * 90.0);
    float core = exp(-r * r * 30.0);
    float ring = exp(-sq((r - 0.55) / 0.1)) * 0.3;
    vec3  hue  = 0.5 + 0.5 * cos(TAU * (atan(q.y, q.x) / TAU + vec3(0.0, 0.33, 0.67)));
    float fade = 1.0 - smoothstep(0.75, 1.0, r);
    fragColor = vec4(vCol * ((arms + core * 1.5) * fade + hue * ring), 0.0);
    return;
  }
  float f = exp(-dot(q, q) * 3.2);
  fragColor = vec4(vCol * f, 0.0);
}
`;

  /* ============================================================
     3. BLOOM — prefilter (13-tap, Karis, soft knee), down, tent up
  ============================================================ */
```

- [ ] **Step 4: Syntax check**

Run: `node --check js/hero/shaders.js`
Expected: no output.

---

### Task 5: Renderer — uniforms and materials

**Files:**
- Modify: `js/hero/renderer.js`

- [ ] **Step 1: Two fractures plus two healing**

Replace

```js
  const MAX_SLOTS  = 5;          // shader array size: 3 rifts + 2 still healing
  const MAX_FLARES = 6;          // impacts that land on the disk (one per rift)
```

with

```js
  const MAX_SLOTS  = 4;          // shader array size: 2 rifts + 2 still healing
  const MAX_FLARES = 6;          // where main cracks cross the near side of the disk
```

- [ ] **Step 2: Glass uniforms**

Replace the block from `      uSlotC:    { value: Array.from(` through `      uCrackB:   { value: new THREE.Vector4(rc.darkEdge, rc.glintPower, rc.fringe, rc.occlude) },` with

```js
      uPxScale:  { value: 1 },
      uLight:    { value: new THREE.Vector3(1, 0, 0) },
      uGlassA:   { value: new THREE.Vector4(rc.settle, rc.bandWidth, rc.bandShift, rc.bandSplit) },
      uGlassB:   { value: new THREE.Vector4(rc.edgeGlint, rc.reflection, rc.edgeShadow, 0) },
      uGlassC:   { value: new THREE.Vector4(rc.lightOffset, rc.shine, rc.film, rc.iridescence) },
      uCrackA:   { value: new THREE.Vector4(rc.lineGain, rc.glowGain, rc.glint, rc.tipGain) },
      uCrackB:   { value: new THREE.Vector4(rc.stillBand, rc.glintPower, rc.fringe, rc.occlude) },
```

- [ ] **Step 3: Material uniform lists**

Replace

```js
    const slotU = ['uSlotA', 'uSlotB', 'uSlotC', 'uParallax', 'uTime', 'uReduced', 'uPxLens', 'uPxScale', 'uLight', 'uView'];
```

with

```js
    const slotU = ['uSlotA', 'uSlotB', 'uParallax', 'uTime', 'uReduced', 'uPxLens', 'uPxScale', 'uLight', 'uView'];
```

and the `cell` / `crack` materials with

```js
    S.mat.cell = shaderMat(sh.CELL_VERT, sh.CELL_FRAG, pick(slotU.concat(['uScene', 'uGlassA', 'uGlassB', 'uGlassC',
      'uCoreTint', 'uEmber'])), slotDefs, premultiplied);
    S.mat.crack = shaderMat(sh.CRACK_VERT, sh.CRACK_FRAG, pick(slotU.concat(['uScene', 'uRes', 'uGlassA', 'uCrackA',
      'uCrackB', 'uCoreTint'])), slotDefs, premultiplied);
```

- [ ] **Step 4: Per-frame uniforms**

Replace `S.rifts.writeUniforms(U.uSlotA.value, U.uSlotB.value, U.uSlotC.value, S.time);` with `S.rifts.writeUniforms(U.uSlotA.value, U.uSlotB.value, S.time);`.

- [ ] **Step 5: Syntax check**

Run: `node --check js/hero/renderer.js`
Expected: no output.

---

### Task 6: Load `pane.js`

**Files:**
- Modify: `index.html` (hero script list), `debug.html` (diagnostics script list)

- [ ] **Step 1:** In `index.html`, add `'js/hero/pane.js',` on its own line after `'js/hero/particles.js',`.
- [ ] **Step 2:** In `debug.html`, change `['config', 'geodesics', 'shaders', 'particles', 'rifts', 'renderer']` to `['config', 'geodesics', 'shaders', 'particles', 'pane', 'rifts', 'renderer']`.

---

### Task 7: Verify

- [ ] **Step 1: Syntax and unit test**

Run: `for f in js/hero/*.js js/main.js; do node --check "$f" || echo FAIL $f; done; node "$SP/tests/pane.test.js"`
Expected: no FAIL lines; `pane: all checks passed`.

- [ ] **Step 2: No console errors, GPU and WARP**

Run the harness (`$SP/harness.mjs`) against `http://localhost:8901/?hero-seed=7&hero-time=8` in `gpu` and `warp` modes with `--wait "Hero.stats && Hero.stats().frames > 30" --eval "JSON.stringify(Hero.stats())"`.
Expected: `errors: []`, no `[hero]`/WebGL errors in `console`, `rifts` ≥ 1.

- [ ] **Step 3: Frozen screenshots through a fracture's life**

Run `$SP/tshot.sh NAME T` at T = 2.6, 3.2, 4.0, 6.5, 9.5, 11 (seed 7), then seeds 3 and 11 at T = 6.5.
Expected: edge and rim runs; large shards breaking the disk/ring; rainbow bands along cracks; no black holes, no seams inside shards, no cracks through the copy.

- [ ] **Step 4: Frame rate**

Harness `--fps 3000` at 1280×720: GPU ≥ 60 fps at scale ≥ 1; WARP ≥ 45 fps at scale ≥ 0.6.

- [ ] **Step 5: Modes**

`--reduced` (fades, nothing falls, no stars/sparks), `--mobile` 390×844 @3× (cracks clear of the copy), `nowebgl2` (CSS fallback, no errors), click at a point off the copy (a crack runs both ways), and `?hero-seed=7&hero-time=14.1` against live play (same path points and shard count).

- [ ] **Step 6: `debug.html`**

Harness on `http://localhost:8901/debug.html` in gpu and warp.
Expected: GPU all PASS; WARP warns only on GPU/driver and speed.

---

### Task 8: Tune and document

- [ ] **Step 1:** Adjust `config.js` values from the screenshots (band width/shift, reflection, tilt, offsets, crack widths, glow) until the look matches spec §4.3; re-run Task 7 steps 2–4 after changes.
- [ ] **Step 2:** Update the spec's file table and any numbers changed by tuning, and the README hero line if the description changed.

---

## Execution notes

What changed from the code above while carrying the plan out:

- **`pane.js`, found by the random test at 20,000 seeds:** `cut` refuses a
  split that leaves a piece with no area (a crack leaving a junction right
  along another crack); `run` refuses a final segment or free-tip extension
  that would cross the crack's own earlier segments; `addPath` refuses a path
  whose extensions cross it; ear clipping treats a corner lying on the cut as
  blocking the ear (a closed test), which collinear corners otherwise broke.
  The test's area check is `A > 1e-9` rather than `A > 0`.
- **Light streaks (added in tuning):** parallel lines of reflected light sweep
  across the shards, shifted by each shard's tilt so they break at the
  cracks. `CELL_VERT` passes `vStreak`; `CELL_FRAG` adds a broad and a thin
  line; new uniforms `uGlassD` (angle, tilt shift, period, rate) and `uGlassE`
  (width, gain, thin line, gap) from the `streak*` config keys.
- **Prism glow (added in tuning):** the crack glow is split into R, G and B
  lobes ±2 × fringe apart, and the strip is widened to fit it. The tip glow
  and the glow width scale with `uPxScale`.
- **Tuned values:** plate shine 150, curvature 0.2–0.45, reflection 0.6,
  iridescence 0.45 (a broad highlight lit whole shards as flat olive panels);
  main crack 2.2 px, branch 1.2, rung 0.75, chip 0.6; glow 0.22; fringe 1.4;
  branches 1.5–3.4 lens units, rungs 0.5–1.4; minimum moving shard 0.03 lens
  units²; splinters 4 / 8 / 12 per fracture, thrown 0.12–0.35 lens units.

### After review: glass in 3D, steeper reflections

Asked for after the first build: the glass should turn with the scene when
the cursor swings the camera, not sit on the page, and shards should reflect
at steeper angles.

- **The pane in the scene:** `Hero.geo.paneMaps(rest, cam)` gives the
  projective map (M0 + depth·M1) from the lens plane as seen with the cursor
  centred to the live camera's lens plane, for a pane `depth` world units in
  front of the hole, plus the live view direction seen from the pane.
  `paneMap` / `paneUnmap` do the same on the CPU (flares, clicks). The
  renderer builds the rest camera each frame with the cursor zeroed and sets
  `uPaneA`, `uPaneB`, `uPaneV`; every overlay vertex shader calls
  `pane(p, depth)` where it used to add `uParallax * depth` (`uParallax`
  and `rifts.parallax` are gone). Falling shards, splinters and debris blend
  their depth to 0 as they fall. A unit test checks the map against a direct
  3D projection over 2,000 random cameras (error below 1e-13).
- **Depth:** `rifts.depth` is now world units in front of the hole,
  −0.4 to 0.8. Shards stand `pop` 0.1–0.45 proud of the pane as they snap
  out (`aT5.w`, from a random stream of their own so the cracks and pieces
  of a given seed are unchanged).
- **Crack ends:** cracks that end on the pane's edge get an extra point
  `paneOverrun` (4) lens units further on, the front keeping its pace, so a
  swung camera never sees them stop short.
- **Steeper glass:** tilt 0.3–0.75 rad, turn 0.07–0.22 rad, shift
  0.14–0.36 + `tiltShift` 0.35 × tilt; the picture is squashed along the tilt
  by `squash` × (1/cos(tilt) − 1) (sign from the curvature); brightness
  × (1 + `tiltShade` 0.5 × tilt·light). New uniform `uGlassG`.
- **With the view (`uGlassF`):** the plate highlight uses the live view
  direction; the picture slides by `viewShift` × (|t|²v + 2(t·v)t); the
  streaks move `viewStreak` lens units per radian of view; the film's colour
  turns with `viewFilm`.

### After review: faster cracks

Asked for after the 3D glass: the cracks ran too slowly for glass.

- **Run time** `crack` 0.4–0.7 s (was 1.2–2.0). The front gets up to speed
  over the first `crackAccel` (30%) of the run at constant acceleration,
  then holds its top speed, reach / (T − Ta/2). `glass()` gives the main
  crack per-point arrivals from that curve and a per-point `pace` (never
  below 30% of top speed, so the start of the crack isn't left half drawn);
  every crack now carries `pace` instead of a single `speed`, and
  `aLa.y` is the front speed at that point.
- **Branches** run at 0.75–1.0× the top speed (was 0.6–0.9× the average),
  starting 0.01–0.04 s after the front passes their roots.
- **The front's light** trails it by 22 px or by as far as it runs in
  `tipTrail` (35 ms), whichever is longer (`uCrackC.x`), so a fast front
  streaks instead of skipping from frame to frame.
- **Riding stars** last `starTrail` (1 lens unit) ÷ the local front speed,
  between 0.05 s and `starLife`, so they make a short sparkle trail at any
  speed.

### After review: glass in the black hole's space, very fast cracks

Feedback: the cracks still read as a flat layer close to the screen, not part
of the live model; make them part of the black hole's own 3D space, and crack
really fast (but seen to run).

- Each fracture is now a flat sheet through the hole's centre, fixed in the
  scene (it no longer follows the slow orbit), tilted 28–52° so one side, any
  way across the screen, runs back behind the hole; capped so its far edge is
  at most twice the hole's distance away. `Hero.geo.sheetFrame`.
- Points of glass are seen through the hole's gravity: `Hero.geo.buildInverse`
  inverts the photon table per column into a 512×256 RGBA16F texture over
  (ψ, ln r) holding the bend on top of the straight-line impact parameter;
  `lensOf()` (GLSL and CPU) reads it once per point. The old homography
  (paneMaps / paneMap / paneUnmap, uPaneA/B/V) is gone.
- Paths are still planned in the lens plane (rest view at spawn) and lifted
  onto the sheet along the orbit through each point (`Hero.geo.sheetLift`, the
  lens pass's disk lookup with the sheet's normal). Round trip ≤ 0.2 px at
  1080p; the lift matches direct integration to 0.04%; `lensOf` matches
  orbits shot at random points to ≤ 0.7 px.
- Planning measures lengths on the sheet (stretch from the lift's local
  scale), so near cracks and shards are bigger, far ones smaller and denser,
  and radial cracks squeezed near the ring. The front's timing runs on the
  sheet too, so it slows on screen as it runs away.
- Glass behind the hole inside the shadow can't be seen: `sheetLift` flags it
  (the orbit falls in first) and stands it in at the shadow's edge; the planner
  treats it as a keep-out and shards touching it stay put. This removed long
  slivers where such points were being bent out round the ring.
- Lines and shard edges are cut into pieces (0.14 lens units at the shadow's
  edge, +0.05 per unit out) and interpolated on the sheet, so the hole's
  bending of them shows.
- Crack strips are built on screen square to the crack as the camera now sees
  it; width follows depth (∝ nearness, clamped 0.45–2.4×); cracks dim behind
  the near side of the disk and dim and redden deep in the well. Shards stand
  proud and lean out of the sheet by half their tilt; their view-dependent
  looks use the camera's swing since the crack, seen in the sheet's frame.
- The copy's keep-out widens by how far glass can slide (0.2 rad of swing);
  glass swung over the copy or under the nav fades to 15% there (uCopy, uNavY).
- Faster: main crack 0.2–0.32 s (was 0.4–0.7), accelerating over the first
  20%; branches 0.85–1.0× top speed, 5–20 ms after the front; tip trail 25 ms.
- Checks: fast-forward signature identical to live play; clicks land within
  0.03 px of the pointer with the camera swung; GPU 144 fps at scale 1 (vsync),
  WARP 62–64 fps at scale 0.68; debug.html all PASS on GPU, only the usual
  driver/speed warnings on WARP; spawning costs 2–4 ms of CPU; reduced motion,
  mobile (390×844) and the no-WebGL2 fallback clean.
