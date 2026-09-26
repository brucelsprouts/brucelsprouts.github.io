/* ============================================================
   hero/rifts.js — running cracks: paths, glass, schedule, geometry

   A rift is a crack running through a sheet of glass that hangs in the
   scene: a flat sheet through the hole's centre, tilted so one side runs
   back behind the hole, seen through the hole's gravity (Hero.geo). It
   comes in from the edge of the screen, or runs along the black hole's
   rim just outside the photon ring. Branches split off its kinks and
   rungs run back from them; every piece of glass they close in is a
   shard that shows the scene behind through its own tilt, so the
   picture breaks along the cracks. When it heals, a front runs along
   the crack: shards it passes either fall into the hole or settle back
   flush.

   Paths are planned where the camera sees them when the rift spawns with
   the cursor centred (lens-plane units, so they steer round the copy),
   then lifted onto the sheet. Lengths are drawn on the sheet itself:
   cracks come out smaller on the glass far away, and squeezed where the
   hole's gravity bends it. The front keeps its pace in the glass.

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
    const T = o.tables;                          // Hero.geo's photon tables, with the inverse
    const CENTRED = { x: 0, y: 0 };
    let now = null;                              // the rift being planned or built

    /* ── timelines ── */
    function timeline(rng, spawn, user) {
      const crackDur = range(rng, rc.crack), openDur = range(rng, rc.open), healDur = range(rng, rc.heal);
      const gap = range(rng, rc.gap), phase = rng() * 100;
      // the sheet: how steeply it tilts, and which way across the screen it runs back
      const tilt = rad(range(rng, rc.sheetTilt)), away = rng() * TAU;
      // 1.5× covers the branches and rungs, which finish after the main crack
      const healStart = spawn + crackDur * (reduced ? 2.0 : 1.5) + openDur;
      // the last shards leave at ~0.9 of the heal and fall for up to rc.fall[1]
      return { spawn, crackDur, openDur, healDur, healStart, end: healStart + healDur + rc.fall[1] + 0.5, gap, tilt, away, phase, user };
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
    // Glass inside the shadow where the rift's sheet runs behind the hole
    // can't be seen: no light from it gets out
    const hiddenAt = (x, y) => !!now && x * x + y * y < R_SH * R_SH && geo.sheetLift(x, y, now.cam0, now.sheet, T).hidden;
    // How far the glass seen at (x, y) slides on screen as the camera swings
    // rc.slide radians round the hole: the further in front of the hole (or
    // behind it), the more. Straight-line estimate from the sheet's tilt.
    function slideAt(x, y) {
      if (!now) return 0;
      const sh = now.sheet, D = geo.D, k = Math.tan(sh.tilt) * (Math.cos(sh.away) * x + Math.sin(sh.away) * y);
      const z = -D * k / Math.max(D - k, 1);
      return D * Math.abs(z) * rc.slide / (D - Math.min(z, D * 0.7));
    }
    // The copy keeps a wider berth from glass that will slide the most
    function blockedAt(x, y) {
      if (box) {
        for (let i = 0; i < box.keepOut.length; i++) {
          const k = box.keepOut[i], p = i === 0 ? slideAt(x, y) : 0;
          if (x > k.x0 - p && x < k.x1 + p && y > k.y0 - p * 0.3 && y < k.y1 + p * 0.3) return true;
        }
      }
      return hiddenAt(x, y);
    }
    // The screen in lens units at rest (16:9 until the copy has been measured)
    const screen = () => (box && box.screen) || { x0: -7.17, x1: 7.17, y0: -4.19, y1: 3.87 };
    function paneRect() {
      const s = screen(), m = rc.paneMargin;
      return { x0: s.x0 - m, x1: s.x1 + m, y0: s.y0 - m, y1: s.y1 + m };
    }

    /* ── the rift's sheet of glass ──
       Made from the view at the rift's spawn with the cursor centred. The
       tilt is capped so the sheet's far edge (at the pane's rim) is never
       more than twice the lens plane's distance from the camera. */
    function setSheet(rift) {
      const cam = geo.camera(rift.spawn, CENTRED, CENTRED, cfg.camera, o.baseFov());
      const P = paneRect(), ca = Math.cos(rift.away), sa = Math.sin(rift.away);
      const ext = Math.max(P.x0 * ca + P.y0 * sa, P.x1 * ca + P.y0 * sa, P.x0 * ca + P.y1 * sa, P.x1 * ca + P.y1 * sa, 1);
      rift.cam0 = cam;
      rift.sheet = geo.sheetFrame(cam, Math.min(rift.tilt, Math.atan(geo.D / (2 * ext))), rift.away);
    }
    // The point of the current rift's sheet seen at lens-plane (x, y)
    const lift = (x, y) => { const q = geo.sheetLift(x, y, now.cam0, now.sheet, T); return { x: q.x, y: q.y, hidden: q.hidden }; };
    const liftV = (v) => v.s || (v.s = lift(v.x, v.y));
    // Sheet length per lens-plane length, stepping from (x, y) along dir
    function stretchAt(x, y, dir) {
      const e = 0.04, a = lift(x, y), b = lift(x + Math.cos(dir) * e, y + Math.sin(dir) * e);
      return clamp(Math.hypot(b.x - a.x, b.y - a.y) / e, 0.35, 3);
    }
    // Distance along a polyline of pane vertices, measured on the sheet
    function lengthsS(pts) {
      const s = [0];
      for (let i = 1; i < pts.length; i++) { const a = liftV(pts[i - 1]), b = liftV(pts[i]); s.push(s[i - 1] + Math.hypot(b.x - a.x, b.y - a.y)); }
      return s;
    }

    /* ── planning a path ── */
    /* Walk a crack: straight runs with small kinks and the odd sharp turn,
       pulled toward the heading steer() asks for and bent round the keep-out
       zones. It stops when steer() returns null, when it is boxed in (a free
       end), at w.maxLen, or where it leaves the pane (an end on its edge).
       Segment lengths are drawn on the sheet; w.maxLen is in the lens plane. */
    function walk(start, dir0, w, rng) {
      const P = paneRect();
      const pts = [{ x: start.x, y: start.y }];
      let x = start.x, y = start.y, dir = dir0, len = 0, edge = false;
      for (let i = 0; i < 96 && len < w.maxLen - 1e-6; i++) {
        const ls = range(rng, w.seg);
        const sharp = rng() < w.sharpChance, amt = sharp ? rad(range(rng, w.sharp)) : rad(w.kink) * (rng() * 2 - 1), sg = sign(rng);
        const target = w.steer(x, y, dir, len);
        if (target === null) break;
        if (i > 0) dir += (sharp ? sg * amt : amt) + angDiff(target, dir) * w.straighten;
        const l = Math.min(ls / stretchAt(x, y, dir), w.maxLen - len);
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
      now = rift;
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
      // heading, turning aside from the keep-outs (or stopping short).
      // len and seg are on the sheet; the step it returns is in the lens plane.
      function stepper(len, seg, kink) {
        let used = 0, heading = null;
        return (i, x, y, dir) => {
          if (heading === null) heading = dir;
          const l = Math.min(range(rng, seg), len - used), jig = (rng() * 2 - 1) * rad(kink);
          if (l < 0.04) return null;
          let d = i ? dir + jig + angDiff(heading, dir) * 0.25 : dir;
          const li = l / stretchAt(x, y, d);
          if (avoid) {
            let ok = false;
            for (let k = 0; k < (i ? 7 : 1) && !ok; k++) {
              const t = d + (k === 0 ? 0 : (k % 2 ? 1 : -1) * rad(15 * Math.ceil(k / 2)));
              const tx = x + Math.cos(t) * li, ty = y + Math.sin(t) * li;
              if (!blockedAt(tx, ty) && !blockedAt((x + tx) / 2, (y + ty) / 2)) { d = t; ok = true; }
            }
            if (!ok) return null;
          }
          used += l;
          return { dir: d, len: li };
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

      // ── timing: the main crack's front covers it in crackDur. Like a real
      // crack it gets up to speed over the first part of the run, then races.
      // It keeps its pace in the glass, so on screen it slows running away. ──
      const sMain = lengths(main.pts), Lm = sMain[sMain.length - 1];
      const sO = origin ? sMain[main.pts.indexOf(origin)] : 0;
      const tMain = lengthsS(main.pts), Lt = tMain[tMain.length - 1];
      const tO = origin ? tMain[main.pts.indexOf(origin)] : 0;
      const reach = Math.max(user ? Math.max(tO, Lt - tO) : Lt, 0.5);
      const Ta = rift.crackDur * rc.crackAccel;
      const vTop = reach / (rift.crackDur - Ta / 2), xa = vTop * Ta / 2;
      const runAt = (x) => (x < xa ? Math.sqrt(2 * Ta * x / vTop) : Ta + (x - xa) / vTop);   // when the front is x along
      const paceAt = (x) => (x < xa ? Math.max(vTop * runAt(x) / Ta, vTop * 0.3) : vTop);    // and how fast it goes there
      main.arr = tMain.map((s) => runAt(Math.abs(s - tO)));
      main.pace = tMain.map((s) => paceAt(Math.abs(s - tO)));
      const arrOn = (c, v) => { const i = c.pts.indexOf(v); return i >= 0 && c.arr ? c.arr[i] : 0; };
      // The rest start as the front passes their roots, and never reach a
      // crack before that crack does
      for (const c of net.cracks) {
        if (c === main) continue;
        const speed = vTop * range(rng, rc.branchSpeed), delay = range(rng, rc.branchDelay);
        const s = lengthsS(c.pts), L = s[s.length - 1];
        let t0 = arrOn(c.parent, c.root) + delay;
        if (c.end === 'hit') {
          const v = c.pts[c.pts.length - 1];
          for (const q of net.cracks) if (q !== c && q.arr && q.pts.indexOf(v) >= 0) t0 = Math.max(t0, arrOn(q, v) - L / speed + 0.03);
        }
        c.pace = s.map(() => speed);
        c.arr = s.map((x) => t0 + x / speed);
      }
      // The heal runs along the main crack (out from the click, for a click)
      const reachL = Math.max(user ? Math.max(sO, Lm - sO) : Lm, 0.5);
      const rhoAt = (x, y) => {
        const n = nearest(main.pts, sMain, x, y);
        return user ? Math.abs(n.along - sO) / reachL : n.along / Math.max(Lm, 1e-6);
      };

      // ── shards: every piece closed in by cracks on all sides ──
      const edgeT = (F, i) => {
        const k = F.e[i];
        return pane.isCrack(k) ? Math.max(arrOn(k, F.v[i]), arrOn(k, F.v[(i + 1) % F.v.length])) : 0;
      };
      const shards = [];
      const proud = mulberry32(mixSeed(rift.seed, 0x9A0D));
      for (const F of net.faces) {
        F.moving = false;
        if (!F.e.every(pane.isCrack)) continue;
        const pop = range(proud, rc.pop);
        // every random number is drawn first, so which pieces move never shifts the stream
        const r = { ja: rng() * TAU, jm: range(rng, rc.offsetJitter), m: range(rng, rc.offset), big: rng() < rc.bigOffset,
          rs: sign(rng), rot: range(rng, rc.rotation), sc: range(rng, rc.scale), ta: rng() * TAU, tm: range(rng, rc.tilt),
          cv: sign(rng) * range(rng, rc.curvature), br: rng(), film: rng(), fall: rng(), fj: rng(), fd: range(rng, rc.fall),
          fs: sign(rng) * range(rng, rc.fallSpin), fo: lerp(0.8, 1.6, rng()) };
        const A = pane.area(F.v), c = pane.centroid(F.v);
        if (A < rc.minShard || blockedAt(c.x, c.y)) continue;
        const parts = pane.convexParts(F, (i) => edgeT(F, i));
        if (!parts) continue;
        for (const part of parts) {
          part.S = part.pts.map(liftV);
          part.pc = pane.centroid(part.pts);
          part.cS = lift(part.pc.x, part.pc.y);
        }
        if (parts.some((part) => part.S.some((q) => q.hidden))) continue;     // part of it is behind the hole
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
          c, cS: lift(c.x, c.y), area: A, parts, t1, rho,
          off: [ox, oy], rot: r.rs * r.rot * clamp(1.2 / (1 + A), 0.35, 1), scale: r.sc,
          tilt: [Math.cos(r.ta) * r.tm, Math.sin(r.ta) * r.tm], curv: r.cv,
          bright: 1 + (r.br - 0.5) * rc.brightness, film: r.film, pop,
          fall: !reduced && A <= rc.fallMaxArea && r.fall < rc.fallChance
            ? { start: healAt(rift, rho) + r.fj * 0.12, dur: r.fd, spin: r.fs, orbit: r.fo } : null,
        });
      }

      // ── the crack lines, and which side of each the glass stays put ──
      const leftOf = new Map();                  // "a>b" → the piece to the left of edge a → b
      for (const F of net.faces) for (let i = 0, n = F.v.length; i < n; i++) leftOf.set(F.v[i].id + '>' + F.v[(i + 1) % n].id, F);
      const still = (a, b) => { const F = leftOf.get(a.id + '>' + b.id); return F && F.moving ? 0 : 1; };
      const lines = [];
      // A crack that runs off the pane carries on past its edge: with the
      // cursor over, the camera sees round the side of the pane
      const onEdge = (v) => Math.min(Math.abs(v.x - P.x0), Math.abs(v.x - P.x1), Math.abs(v.y - P.y0), Math.abs(v.y - P.y1)) < 1e-6;
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
        const line = {
          pts: c.pts.map((v) => [v.x, v.y]), arr: c.arr.slice(), pace: c.pace.slice(),
          width: s.map((x) => c.width * taper(x)),
          rho: c.pts.map((v) => rhoAt(v.x, v.y)),
          still: c.pts.map((v, j) => {
            const a = c.pts[Math.min(j, n - 2)], b = c.pts[Math.min(j, n - 2) + 1];
            return [still(a, b), still(b, a)];                                // left, right
          }),
        };
        // straight on past end i (away from its neighbour j), the front keeping its pace
        const past = (i, j, put) => {
          const a = line.pts[i], b = line.pts[j], dx = a[0] - b[0], dy = a[1] - b[1], l = Math.hypot(dx, dy) || 1;
          const slope = (line.arr[i] - line.arr[j]) / l, x = a[0] + dx / l * rc.paneOverrun, y = a[1] + dy / l * rc.paneOverrun;
          put.call(line.pts, [x, y]);
          put.call(line.arr, line.arr[i] + (Math.abs(slope) > 1e-9 ? slope : 1 / line.pace[i]) * rc.paneOverrun);
          put.call(line.pace, line.pace[i]);
          put.call(line.width, line.width[i]);
          put.call(line.rho, rhoAt(x, y));
          put.call(line.still, line.still[i]);
        };
        if (onEdge(c.pts[0])) past(0, 1, Array.prototype.unshift);
        if (onEdge(c.pts[n - 1])) past(line.pts.length - 1, line.pts.length - 2, Array.prototype.push);
        lines.push(onSheet(line));
      }

      // Where the main crack crosses the near side of the disk, the disk
      // flares as the front passes. The flare stays under the crack's point
      // of the sheet, wherever the camera goes.
      const anchors = [];
      const cam = geo.camera(rift.spawn, { x: 0, y: 0 }, { x: 0, y: 0 }, cfg.camera, o.baseFov());
      for (let i = 1; i < main.pts.length - 1 && anchors.length < rc.anchors; i++) {
        const v = main.pts[i];
        const d = geo.lensToDisk(v.x, v.y, cam);
        if (!d || d.r < R_IN * 1.05 || d.r > R_OUT * 0.85 || d.x * cam.pos[0] + d.z * cam.pos[2] <= 0) continue;
        if (anchors.some((q) => Math.hypot(q.x - v.x, q.y - v.y) < rc.anchorSpacing)) continue;
        anchors.push({ x: v.x, y: v.y, s: liftV(v), t: main.arr[i] });
      }
      return { main, net, lines, shards, anchors, branches, rhoAt };
    }

    /* A line of lens-plane points onto the sheet. Straight on the glass, so
       each run is cut into pieces short enough near the hole for its
       bending of them to show; everything else is interpolated along. */
    function onSheet(line) {
      const out = { pts: [], arr: [], pace: [], width: [], rho: [], still: [] };
      const S = line.pts.map((p) => lift(p[0], p[1]));
      const put = (i, j, f) => {
        const a = S[i], b = S[j];
        out.pts.push([lerp(a.x, b.x, f), lerp(a.y, b.y, f)]);
        for (const k of ['arr', 'pace', 'width', 'rho']) out[k].push(lerp(line[k][i], line[k][j], f));
        out.still.push(line.still[i]);
      };
      for (let i = 0; i < S.length; i++) {
        put(i, i, 0);
        if (i === S.length - 1) break;
        const a = line.pts[i], b = line.pts[i + 1], m = pieces(a[0], a[1], b[0], b[1]);
        for (let k = 1; k < m; k++) put(i, i + 1, k / m);
      }
      return out;
    }

    /* ── what a rift emits: splinters and particles, all scheduled up front ── */
    function emissions(rift, g, rng) {
      const sc = cfg.shards, pc = cfg.particles, main = g.main;
      const At = (x) => rift.spawn + x;                              // spawn-relative → scene time
      const pts = main.pts, arr = main.arr, pace = main.pace, S = lengths(pts), L = S[S.length - 1];
      // a point part-way along the main crack: where, when the front gets there (and how fast), which way
      function along(s) {
        let i = 1;
        while (i < pts.length - 1 && S[i] < s) i++;
        const a = pts[i - 1], b = pts[i], u = clamp((s - S[i - 1]) / Math.max(S[i] - S[i - 1], 1e-9), 0, 1);
        return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), t: lerp(arr[i - 1], arr[i], u), v: lerp(pace[i - 1], pace[i], u),
          dir: Math.atan2(b.y - a.y, b.x - a.x) };
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
        const x = q.v.x + Math.cos(a) * d, y = q.v.y + Math.sin(a) * d, at = lift(x, y);
        const drift = range(rng, sc.drift);
        shards.push({
          x: at.x, y: at.y, size: lerp(sc.size[0], sc.size[1], rng() * rng()), rot: rng() * TAU,
          r0: lerp(0.6, 1.0, rng()), r1: lerp(0.6, 1.0, rng()), r2: lerp(0.6, 1.0, rng()), seed: rng() * 97,
          appear: At(q.t) + 0.02 + rng() * 0.1,
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
          const life = clamp(pc.starTrail / p.v, 0.05, pc.starLife), at = lift(p.x, p.y);
          parts.push({ x: at.x, y: at.y, vx: at.x + 0.002, vy: at.y, start: At(p.t), life, size: range(rng, pc.starSize), type: 1 });
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
        const a = p.dir + sign(rng) * (Math.PI / 2 + (rng() - 0.5) * 1.2), sp = range(rng, pc.sparkSpeed), at = lift(p.x, p.y);
        parts.push({ x: at.x, y: at.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, start: At(p.t) + rng() * 0.05,
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
        const from = At(jn.t) + 0.1, to = rift.healStart - life * 0.5;
        if (to <= from) continue;
        const at = lift(jn.x, jn.y);
        parts.push({ x: at.x, y: at.y, vx: at.x + 0.002, vy: at.y, start: lerp(from, to, u), life, size, type: 1 });
      }

      // Debris: dust shed by everything falling in, following it down
      const sources = [];
      for (const s of g.shards) if (s.fall) sources.push({ p: [s.cS.x, s.cS.y], start: s.fall.start, dur: s.fall.dur, orbit: s.fall.orbit });
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
      now = rift;
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
      setSheet(rift);
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

    function writeUniforms(slotA, slotB, sheetU, sheetV, t) {
      for (let k = 0; k < slotA.length; k++) {
        const r = k < nSlots ? slots[k] : null;
        if (r && r.built && r.spawn <= t) {
          const sh = r.sheet;
          slotA[k].set(r.spawn, r.crackDur, r.healStart, r.healDur);
          slotB[k].set(0, 1, r.phase, r.user ? 1 : 0);
          sheetU[k].set(sh.U[0], sh.U[1], sh.U[2], sh.view0[0]);
          sheetV[k].set(sh.V[0], sh.V[1], sh.V[2], sh.view0[1]);
        } else {
          slotA[k].set(0, 0, 1e9, 1);
          slotB[k].set(0, 0, 0, 0);
        }
      }
    }

    /* A flare where the main crack crosses the disk: each frame its point of
       the sheet is found on screen and sent straight through to the disk
       plane, so the flare stays pinned under the crack as the camera moves */
    function writeFlares(flares, t, cam) {
      let f = 0;
      for (const r of slots) {
        if (!r || !r.built || !r.anchors) continue;
        for (const a of r.anchors) {
          if (f >= flares.length) break;
          const p = geo.lensOf(geo.sheetPoint(r.sheet, a.s.x, a.s.y, 0), cam, T);
          const d = geo.lensToDisk(p.x, p.y, cam);
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
      const rift = Object.assign(timeline(mulberry32(seed), t, true), { id: -1, seed, built: false });
      setSheet(rift);
      // the point of the glass under the click, and where it sits in the view
      // the path is planned in (the cursor centred)
      rift.at = geo.lensOf(geo.sheetLift(lx, ly, o.cam(), rift.sheet, T).X, rift.cam0, T);
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
  const CELL_MAX_VERTS = 12288;
  const LINE_MAX_POINTS = 2048;

  // How many pieces a straight run from a to b (lens plane) is cut into, so
  // the hole's bending of it shows: rifts.subdivide = piece length at the
  // shadow's edge, and how much longer per lens unit further out
  function pieces(ax, ay, bx, by) {
    const sd = Hero.config.rifts.subdivide, R = Hero.geo.shadowRadius;
    const r = Math.hypot((ax + bx) / 2, (ay + by) / 2), l = Math.hypot(bx - ax, by - ay);
    return Math.max(1, Math.min(64, Math.ceil(l / (sd[0] + sd[1] * Math.max(r - R, 0)))));
  }

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
  // vertices per edge piece, the first at the centre. Planned in the lens
  // plane (rim heights, normals), placed on the sheet.
  function writeCellGeometry(g, glassData, slot) {
    const P = g.attributes.position.array;
    const [T1, T2, T3, T4, T5, T6] = [1, 2, 3, 4, 5, 6].map((k) => g.attributes['aT' + k].array);
    const put = (A, o, a, b, c, d) => { A[o] = a; A[o + 1] = b; A[o + 2] = c; A[o + 3] = d; };
    let v = 0;
    for (const sh of glassData.shards) {
      let need = 0;
      for (const part of sh.parts) {
        for (let i = 0, n = part.pts.length; i < n; i++) {
          const a = part.pts[i], b = part.pts[(i + 1) % n];
          need += pieces(a.x, a.y, b.x, b.y) * 3;
        }
      }
      if (v + need > CELL_MAX_VERTS) break;
      const f = sh.fall;
      for (const part of sh.parts) {
        const pc = part.pc, n = part.pts.length;
        for (let i = 0; i < n; i++) {
          const a = part.pts[i], b = part.pts[(i + 1) % n];
          const ex = b.x - a.x, ey = b.y - a.y, el = Math.hypot(ex, ey);
          if (el < 1e-7) continue;
          let nx = -ey / el, ny = ex / el;                       // inward, for a counter-clockwise part
          let h = (pc.x - a.x) * nx + (pc.y - a.y) * ny;
          if (h < 0) { nx = -nx; ny = -ny; h = -h; }
          if (h < 1e-7) continue;
          const nAng = Math.atan2(ny, nx);
          const A = part.S[i], B = part.S[(i + 1) % n], m = pieces(a.x, a.y, b.x, b.y);
          for (let k = 0; k < m; k++) {
            for (let corner = 0; corner < 3; corner++) {
              const u = corner === 1 ? k / m : (k + 1) / m;
              const px = corner === 0 ? part.cS.x : lerp(A.x, B.x, u), py = corner === 0 ? part.cS.y : lerp(A.y, B.y, u);
              const o3 = v * 3, o4 = v * 4;
              P[o3] = px; P[o3 + 1] = py; P[o3 + 2] = 0;
              put(T1, o4, sh.cS.x, sh.cS.y, sh.off[0], sh.off[1]);
              put(T2, o4, sh.rot, sh.scale, sh.t1, sh.curv);
              put(T3, o4, sh.tilt[0], sh.tilt[1], sh.bright, sh.film);
              put(T4, o4, corner === 0 ? 1 : 0, h, nAng, part.rim[i] ? 1 : 0);
              put(T5, o4, part.value[i], slot, sh.rho, sh.pop);
              put(T6, o4, f ? f.start : -1, f ? f.dur : 1, f ? f.spin : 0, f ? f.orbit : 1);
              v++;
            }
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
          La[v * 4] = line.arr[i]; La[v * 4 + 1] = line.pace[i]; La[v * 4 + 2] = line.width[i] * 0.5; La[v * 4 + 3] = line.rho[i];
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
