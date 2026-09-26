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
    // closed: a corner lying on the cut a–c blocks the ear too
    const within = (p, a, b, c) => turn(a, b, p) >= -1e-12 && turn(b, c, p) >= -1e-12 && turn(c, a, p) >= -1e-12;
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
      // a chain lying along F's own outline (a crack running right along
      // another) would leave a piece with no area
      if (area(A) < 1e-9 || area(B) < 1e-9) return false;
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
            const hx = cur.x + dx * h.t, hy = cur.y + dy * h.t;
            if (selfCross(chain, cur, hx, hy)) return null;
            const hv = hitVertex(F, h, hx, hy);
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
          const hx = cur.x + ex * h.t, hy = cur.y + ey * h.t;
          if (selfCross(chain, cur, hx, hy)) return null;
          const bridge = isCrack(F.e[h.i]) && h.t <= ((o && o.bridge) || 0);
          const hv = hitVertex(F, h, hx, hy);
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
      // the path and its extensions must not cross themselves
      for (let a = 0; a + 1 < chain.length; a++) {
        for (let b = a + 2; b + 1 < chain.length; b++) if (crosses(chain[a], chain[a + 1], chain[b], chain[b + 1])) return null;
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
