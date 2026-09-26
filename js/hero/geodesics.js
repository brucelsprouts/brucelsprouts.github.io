/* ============================================================
   hero/geodesics.js — photon orbits baked into a lookup table

   Units: r_s = 1, so the horizon is r = 1, the photon sphere r = 1.5.
   A photon's orbit obeys u'' + u = 1.5 u² (u = 1/r, φ measured in the
   orbit plane from the camera). That is exactly the path the old
   ray-marcher's −1.5 h² r̂ / r⁴ acceleration traced, so the look carries
   over, but now each pixel reads its disk crossings from a table
   instead of integrating 44 steps.

   The camera distance is fixed at D, so a ray is fully described by
   its impact parameter b. Table layout (RGBA16F, 512 × 256):
     x — φ0 ∈ [0, π], the first angle at which the orbit meets the
         disk plane (the others follow every π)
     y — b, asinh-spaced so rows crowd in around the photon ring
     R, G, B — u(b, φ0), u(b, φ0 + π), u(b, φ0 + 2π): the three disk
         crossings a pixel can see, read in one fetch
   A 256 × 1 side table holds, per b: the escape (or capture) angle
   as its offset from a straight line, a captured flag, and the
   periapsis angle (it decides which way the photon travels at each
   crossing, for Doppler beaming).
============================================================ */
(function () {
  'use strict';
  const Hero = window.Hero = window.Hero || {};

  const D       = 13;                  // camera distance, fixed
  const NB      = 256;                 // impact-parameter rows
  const NPHI    = 512;                 // φ0 columns over [0, π]
  const B_MAX   = 10;
  const PHI_MAX = 3.5 * Math.PI;
  const DPHI    = Math.PI / (NPHI - 1);

  // Critical impact parameter for a ray launched flat from D. The orbit's
  // energy u'² + u² − u³ = 1/b² − 1/D³ must equal the photon sphere's 4/27.
  const B_C = 1 / Math.sqrt(4 / 27 + 1 / (D * D * D));
  const INV_D3 = 1 / (D * D * D);

  // Row spacing: b = B_C + W0·sinh(A0 + s·(A1 − A0)). Near-linear within W0
  // of b_c, logarithmic beyond it, which is how the winding rays behave.
  const W0 = 0.04;
  const A0 = Math.asinh(-B_C / W0);
  const A1 = Math.asinh((B_MAX - B_C) / W0);

  const bOfS = (s) => B_C + W0 * Math.sinh(A0 + s * (A1 - A0));
  const sOfB = (b) => (Math.asinh((b - B_C) / W0) - A0) / (A1 - A0);

  /* ── half floats (DataTexture wants raw Uint16 bits) ── */
  const f32 = new Float32Array(1);
  const u32 = new Uint32Array(f32.buffer);

  function toHalf(v) {
    f32[0] = v;
    const x = u32[0];
    const sign = (x >>> 16) & 0x8000;
    let exp = ((x >>> 23) & 0xff) - 112;       // rebias 127 → 15
    let mant = x & 0x7fffff;
    if (exp <= 0) {                            // subnormal or zero
      if (exp < -10) return sign;
      mant = (mant | 0x800000) >> (1 - exp);
      return sign | ((mant + 0x1000) >> 13);
    }
    if (exp >= 31) return sign | 0x7c00;       // overflow → inf
    mant += 0x1000;                            // round to nearest
    if (mant & 0x800000) { mant = 0; exp++; if (exp >= 31) return sign | 0x7c00; }
    return sign | (exp << 10) | (mant >> 13);
  }

  function fromHalf(h) {
    const s = (h & 0x8000) ? -1 : 1;
    const e = (h >> 10) & 0x1f;
    const m = h & 0x3ff;
    if (e === 0) return s * m * 5.960464477539063e-8;   // 2^-24
    if (e === 31) return m ? NaN : s * Infinity;
    return s * Math.pow(2, e - 15) * (1 + m / 1024);
  }

  /* ── one photon orbit, RK4 in φ ──
     u(0) = 1/D, u'(0) = cot(α)/D with sin α = b/D. Calls sample(i, u) at
     φ = i·step/sub for every i, and returns how the orbit ends. */
  function trace(b, step, sub, maxPhi, sample) {
    const h = step / sub;
    const sinA = b / D;
    const out = { phiEnd: maxPhi, captured: 0.5, phiPeri: 64 };
    if (sinA < 1e-7) {                          // head-on: straight in
      out.phiEnd = 0; out.captured = 1;
      if (sample) sample(0, 1);
      return out;
    }
    const cosA = Math.sqrt(1 - sinA * sinA);
    let u = 1 / D, v = cosA / sinA / D, phi = 0;
    if (sample) sample(0, u);
    const nSteps = Math.ceil(maxPhi / h);
    for (let n = 1; n <= nSteps; n++) {
      // RK4 on (u, v)' = (v, 1.5u² − u)
      const k1u = v,                k1v = 1.5 * u * u - u;
      let uu = u + 0.5 * h * k1u,   vv = v + 0.5 * h * k1v;
      const k2u = vv,               k2v = 1.5 * uu * uu - uu;
      uu = u + 0.5 * h * k2u;       vv = v + 0.5 * h * k2v;
      const k3u = vv,               k3v = 1.5 * uu * uu - uu;
      uu = u + h * k3u;             vv = v + h * k3v;
      const k4u = vv,               k4v = 1.5 * uu * uu - uu;
      const un = u + h / 6 * (k1u + 2 * k2u + 2 * k3u + k4u);
      const vn = v + h / 6 * (k1v + 2 * k2v + 2 * k3v + k4v);

      if (v > 0 && vn <= 0 && out.phiPeri === 64) {       // periapsis
        out.phiPeri = phi + h * v / (v - vn);
      }
      if (un >= 1) {                                      // through the horizon
        out.phiEnd = phi + h * (1 - u) / (un - u);
        out.captured = 1;
        return out;
      }
      if (un <= 0) {                                      // escaped to infinity
        out.phiEnd = phi + h * u / (u - un);
        out.captured = 0;
        return out;
      }
      u = un; v = vn; phi = n * h;
      if (sample && n % sub === 0) sample(n / sub, u);
    }
    return out;                                           // still winding at PHI_MAX
  }

  /* ── build both tables ── */
  function build() {
    const t0 = performance.now();
    const lut = new Uint16Array(NPHI * NB * 4);
    const aux = new Uint16Array(NB * 4);
    const aux32 = new Float32Array(NB * 4);               // exact values, for the self-test
    const nSamples = 3 * (NPHI - 1) + 1;                  // φ = 0 … 3π on the column grid
    const row = new Float32Array(nSamples);

    for (let j = 0; j < NB; j++) {
      const b = bOfS(j / (NB - 1));
      const alpha = Math.asin(Math.min(b / D, 1));
      row.fill(NaN);
      const end = trace(b, DPHI, 1, PHI_MAX, (i, u) => { if (i < nSamples) row[i] = u; });
      // Past the end of the orbit, hold u at the horizon (captured) or at
      // infinity (escaped): both fall outside the disk, so no stale crossings
      const tail = end.captured >= 1 ? 1 : (end.captured <= 0 ? 0 : 2 / 3);
      for (let i = 0; i < nSamples; i++) {
        if (Number.isNaN(row[i]) || i * DPHI > end.phiEnd) row[i] = tail;
      }
      for (let i = 0; i < NPHI; i++) {
        const o = (j * NPHI + i) * 4;
        lut[o]     = toHalf(row[i]);
        lut[o + 1] = toHalf(row[i + NPHI - 1]);
        lut[o + 2] = toHalf(row[i + 2 * (NPHI - 1)]);
        lut[o + 3] = 0;
      }
      const delta = end.phiEnd - (Math.PI - alpha);        // bend beyond a straight line
      aux32[j * 4]     = delta;
      aux32[j * 4 + 1] = end.captured;
      aux32[j * 4 + 2] = end.phiPeri;
      aux32[j * 4 + 3] = end.phiEnd;
      aux[j * 4]     = toHalf(delta);
      aux[j * 4 + 1] = toHalf(end.captured);
      aux[j * 4 + 2] = toHalf(end.phiPeri);
      aux[j * 4 + 3] = 0;
    }
    return { lut, aux, aux32, ms: performance.now() - t0 };
  }

  /* ── CPU copy of the GPU lookup (bilinear on half floats) ── */
  function sampleTables(tables, b, phi0) {
    const s = Math.min(Math.max(sOfB(Math.min(b, B_MAX)), 0), 1);
    const y = s * (NB - 1);
    const x = Math.min(Math.max(phi0 / Math.PI, 0), 1) * (NPHI - 1);
    const y0 = Math.min(Math.floor(y), NB - 2), fy = y - y0;
    const x0 = Math.min(Math.floor(x), NPHI - 2), fx = x - x0;
    const u = [0, 0, 0];
    for (let k = 0; k < 3; k++) {
      const at = (xx, yy) => fromHalf(tables.lut[(yy * NPHI + xx) * 4 + k]);
      const top = at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx;
      const bot = at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx;
      u[k] = top * (1 - fy) + bot * fy;
    }
    const ax = (c) => fromHalf(tables.aux[y0 * 4 + c]) * (1 - fy) + fromHalf(tables.aux[(y0 + 1) * 4 + c]) * fy;
    return { u, delta: ax(0), captured: ax(1), phiPeri: ax(2) };
  }

  /* ── self-test (?hero-debug): table lookups vs direct integration ── */
  function selfTest(tables, n = 200, rIn = 2.7, rOut = 8.2) {
    let seed = 12345;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    let worstR = 0, worstEsc = 0, nCross = 0, nEsc = 0, sumR = 0, sumEsc = 0;
    for (let t = 0; t < n; t++) {
      // Uniform over the lens plane out to the screen's corner radius, like real pixels
      const rho = Math.sqrt(rnd()) * 7.5;
      const b = D * Math.sin(Math.atan(rho / D));
      if (Math.abs(b - B_C) < 0.02) { t--; continue; }     // the ring itself is analytic
      const phi0 = rnd() * Math.PI;
      const alpha = Math.asin(b / D);
      const look = sampleTables(tables, b, phi0);
      const targets = [phi0, phi0 + Math.PI, phi0 + 2 * Math.PI];
      const exact = [NaN, NaN, NaN];
      // Reference orbit at 16× the table's angular resolution, read at the
      // exact crossing angles by interpolating between neighbouring steps
      const h = DPHI / 16;
      let prevU = 1 / D;
      const endExact = trace(b, h, 1, PHI_MAX, (i, u) => {
        const phi = i * h;
        for (let k = 0; k < 3; k++) {
          if (Number.isNaN(exact[k]) && phi >= targets[k]) {
            exact[k] = i === 0 ? u : prevU + (u - prevU) * (1 - (phi - targets[k]) / h);
          }
        }
        prevU = u;
      });
      for (let k = 0; k < 3; k++) {
        if (targets[k] >= endExact.phiEnd || Number.isNaN(exact[k])) continue;
        const rE = 1 / exact[k];
        if (rE < rIn || rE > rOut) continue;               // only crossings the disk can show
        const err = Math.abs(1 / look.u[k] - rE) / rE;
        worstR = Math.max(worstR, err); sumR += err; nCross++;
      }
      if (endExact.captured === 0) {
        const phiEndLut = look.delta + Math.PI - alpha;
        const err = Math.abs(phiEndLut - endExact.phiEnd);
        worstEsc = Math.max(worstEsc, err); sumEsc += err; nEsc++;
      }
    }
    // The glass: where points of space are seen (the inverted table) against
    // shooting orbits at them directly, and a sheet's lift there and back
    const g = glassTest(tables, rnd);
    const res = {
      rays: n, crossings: nCross, escapes: nEsc,
      radiusErrMaxPct: +(worstR * 100).toFixed(4), radiusErrMeanPct: +(sumR / Math.max(nCross, 1) * 100).toFixed(4),
      escapeErrMaxRad: +worstEsc.toFixed(5), escapeErrMeanRad: +(sumEsc / Math.max(nEsc, 1)).toFixed(5),
      glassPoints: g.n, glassErrMax: g.shoot, glassRoundTripMax: g.round,
    };
    res.pass = res.radiusErrMaxPct < 0.5 && res.escapeErrMaxRad < 0.01 && res.glassErrMax < 0.02 && res.glassRoundTripMax < 0.01;
    return res;
  }

  function glassTest(T, rnd) {
    if (!T.inv) buildInverse(T);
    const cc = { azimuthRate: 0.03, elevation: 0.1, elevSway: 0, elevSwayRate: 0, mouseAzimuth: 0, mouseElevation: 0, mousePull: 0, mouseRoll: 0, breathe: 0, breatheRate: 0, yShift: 0 };
    const h = 0.002, rAt = (b, phi) => {                  // r where the orbit reaches angle phi
      let out = NaN, prev = null;
      trace(b, h, 1, phi + 0.01, (i, u) => { const p = i * h; if (Number.isNaN(out) && p >= phi && prev) out = 1 / (prev.u + (u - prev.u) * (phi - prev.p) / h); prev = { p, u }; });
      return out;
    };
    let shoot = 0, round = 0, n = 0;
    for (let t = 0; t < 24; t++) {
      const cam = camera(rnd() * 200, { x: 0, y: 0 }, { x: 0, y: 0 }, cc, 0.62);
      const e1 = cam.pos.map((v) => v / D);
      const r = 2.4 + rnd() * 12, psi = 0.2 + rnd() * 2.6, a = rnd() * Math.PI * 2;
      const d = [0, 1, 2].map((i) => Math.cos(a) * cam.right[i] + Math.sin(a) * cam.up[i]);
      const X = [0, 1, 2].map((i) => r * (Math.cos(psi) * e1[i] + Math.sin(psi) * d[i]));
      let lo = 0, hi = B_MAX;
      for (let k = 0; k < 32; k++) { const m = (lo + hi) / 2, rr = rAt(m, psi); if (!(rr > 0) || rr < r) lo = m; else hi = m; }
      const b = (lo + hi) / 2;
      if (b > B_MAX * 0.99) continue;
      const rho = D * b / Math.sqrt(D * D - b * b), got = lensOf(X, cam, T);
      shoot = Math.max(shoot, Math.hypot(got.x - rho * Math.cos(a), got.y - rho * Math.sin(a)));
      const sh = sheetFrame(cam, 0.4 + rnd() * 0.4, rnd() * Math.PI * 2);
      const lx = (rnd() * 2 - 1) * 6, ly = (rnd() * 2 - 1) * 4;
      if (Math.hypot(lx, ly) > SHADOW * 1.05) {
        const back = lensOf(sheetLift(lx, ly, cam, sh, T).X, cam, T);
        round = Math.max(round, Math.hypot(back.x - lx, back.y - ly));
      }
      n++;
    }
    return { n, shoot: +shoot.toFixed(4), round: +round.toFixed(4) };
  }

  /* ── camera + lens-plane helpers (mirror the shaders exactly) ── */
  const norm3 = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  /* Camera at scene time t. mouse eases fast (tilt), mouse2 slow (roll +
     pull-in). Distance stays at D; breathing and pull-in scale the FOV,
     which frames the hole identically. */
  function camera(t, mouse, mouse2, cc, baseFov, out) {
    const az = t * cc.azimuthRate + mouse.x * cc.mouseAzimuth;
    const el = cc.elevation + cc.elevSway * Math.sin(t * cc.elevSwayRate) + mouse.y * cc.mouseElevation;
    const pos = [Math.sin(az) * Math.cos(el) * D, Math.sin(el) * D, Math.cos(az) * Math.cos(el) * D];
    const fwd = [-pos[0] / D, -pos[1] / D, -pos[2] / D];
    const right = norm3([-fwd[2], 0, fwd[0]]);            // cross(fwd, +y)
    const up = cross3(right, fwd);
    const pull = Math.hypot(mouse2.x, mouse2.y);
    const o = out || {};
    o.pos = pos; o.fwd = fwd; o.right = right; o.up = up; o.az = az; o.el = el;
    o.fov = baseFov * (1 + cc.breathe * Math.sin(t * cc.breatheRate)) * (1 - cc.mousePull * pull);
    o.roll = mouse2.x * cc.mouseRoll;
    o.yShift = cc.yShift;
    return o;
  }

  // Lens plane ↔ screen. Screen units are "suv": (px − centre) / height, y up.
  function lensToScreen(lx, ly, cam) {
    const k = 1 / (D * cam.fov);
    const x = lx * k, y = ly * k;
    const c = Math.cos(cam.roll), s = Math.sin(cam.roll);   // undo the roll
    return { x: c * x + s * y, y: -s * x + c * y + cam.yShift };
  }

  function screenToLens(sx, sy, cam) {
    const x = sx, y = sy - cam.yShift;
    const c = Math.cos(cam.roll), s = Math.sin(cam.roll);
    const k = D * cam.fov;
    return { x: (c * x - s * y) * k, y: (s * x + c * y) * k };
  }

  // Straight ray from the camera through a lens-plane point, meeting y = 0
  function lensToDisk(lx, ly, cam) {
    const w = [cam.right[0] * lx + cam.up[0] * ly, cam.right[1] * lx + cam.up[1] * ly, cam.right[2] * lx + cam.up[2] * ly];
    const dy = w[1] - cam.pos[1];
    if (Math.abs(dy) < 1e-6) return null;
    const t = -cam.pos[1] / dy;
    if (t <= 0) return null;
    const x = cam.pos[0] + t * (w[0] - cam.pos[0]);
    const z = cam.pos[2] + t * (w[2] - cam.pos[2]);
    return { x, z, r: Math.hypot(x, z) };
  }

  /* ── the glass: sheets through the hole, seen through its gravity ──
     Each fracture is a flat sheet of glass through the hole's centre, tilted
     to the view and fixed in the scene. A point of it is seen along the
     photon orbit that reaches it, so glass near the hole bends round the
     shadow exactly as the disk does, and the cursor swings the camera round
     it like any other object in the scene. */
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  // Half floats → floats, once: the CPU reads the table exactly as the GPU does
  let H2F = null;
  function halfTable() {
    if (!H2F) { H2F = new Float32Array(65536); for (let h = 0; h < 65536; h++) H2F[h] = fromHalf(h); }
    return H2F;
  }
  function lutFloats(T) {
    if (!T.lutF) {
      const H = halfTable(), n = NPHI * NB, F = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { F[i * 3] = H[T.lut[i * 4]]; F[i * 3 + 1] = H[T.lut[i * 4 + 1]]; F[i * 3 + 2] = H[T.lut[i * 4 + 2]]; }
      T.lutF = F;
    }
    return T.lutF;
  }

  // u at orbit angle φ0 + kπ (φ0 in [0, π]) for impact parameter b: the lens pass's lookup
  function lutU(T, b, phi0, k) {
    const F = lutFloats(T);
    const y = Math.min(Math.max(sOfB(Math.min(b, B_MAX)), 0), 1) * (NB - 1);
    const x = Math.min(Math.max(phi0 / Math.PI, 0), 1) * (NPHI - 1);
    const y0 = Math.min(Math.floor(y), NB - 2), fy = y - y0;
    const x0 = Math.min(Math.floor(x), NPHI - 2), fx = x - x0;
    const at = (xx, yy) => F[(yy * NPHI + xx) * 3 + k];
    return (at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx) * (1 - fy) + (at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx) * fy;
  }

  /* Where a point of space is seen. Its orbit leaves the camera, sweeps
     angle ψ round the hole and arrives at radius r: the table inverted per
     column gives the impact parameter b. Stored as the bend on top of the
     straight-line b, per (ψ, ln r), so the half floats keep their precision. */
  const INV_NX = NPHI, INV_NY = 256, INV_R0 = 1, INV_R1 = 48;
  const INV_L0 = Math.log(INV_R0), INV_L1 = Math.log(INV_R1);
  // b of the straight line from the camera to radius r at angle ψ (sin ψ, cos ψ) round the hole
  const bFlat = (r, sp, cp) => D * r * sp / Math.sqrt(Math.max(D * D + r * r - 2 * D * r * cp, 1e-9));

  function buildInverse(T) {
    const t0 = performance.now();
    const F = lutFloats(T), dB = new Float32Array(INV_NX * INV_NY), half = new Uint16Array(INV_NX * INV_NY * 4);
    const col = new Float32Array(NB), R = new Float64Array(INV_NY);
    for (let i = 0; i < INV_NY; i++) R[i] = Math.exp(INV_L0 + i * (INV_L1 - INV_L0) / (INV_NY - 1));
    for (let j = 1; j < INV_NX; j++) {                     // column 0 (dead ahead) sees everything at b = 0
      const psi = j * Math.PI / (INV_NX - 1), sp = Math.sin(psi), cp = Math.cos(psi);
      for (let k = 0; k < NB; k++) col[k] = F[(k * NPHI + j) * 3];
      let k = 0, last = 0;
      for (let i = 0; i < INV_NY; i++) {
        const r = R[i], ut = 1 / r;
        while (k < NB - 1 && col[k + 1] >= ut) k++;        // u falls as b grows: col[k] ≥ ut > col[k + 1]
        if (k < NB - 1) {
          const den = col[k] - col[k + 1];
          const f = den > 1e-12 ? Math.min(Math.max((col[k] - ut) / den, 0), 1) : 0;
          last = bOfS((k + f) / (NB - 1)) - bFlat(r, sp, cp);
        }                                                  // past the table's last ray: carry the bend on
        dB[i * INV_NX + j] = last;
      }
    }
    for (let i = 0; i < INV_NX * INV_NY; i++) half[i * 4] = toHalf(dB[i]);
    T.inv = { dB, half, nx: INV_NX, ny: INV_NY, ms: performance.now() - t0 };
    return T.inv;
  }

  // The live camera's lens-plane point for world point X (its primary image)
  function lensOf(X, cam, T) {
    const e1 = [cam.pos[0] / D, cam.pos[1] / D, cam.pos[2] / D];
    const r = Math.max(Math.hypot(X[0], X[1], X[2]), 1e-9), z = dot3(X, e1);
    const w = [X[0] - z * e1[0], X[1] - z * e1[1], X[2] - z * e1[2]], wl = Math.hypot(w[0], w[1], w[2]);
    const psi = Math.acos(Math.min(Math.max(z / r, -1), 1));
    const inv = T.inv, x = psi / Math.PI * (inv.nx - 1);
    const y = Math.min(Math.max((Math.log(Math.max(r, INV_R0)) - INV_L0) / (INV_L1 - INV_L0), 0), 1) * (inv.ny - 1);
    const x0 = Math.min(Math.floor(x), inv.nx - 2), fx = x - x0, y0 = Math.min(Math.floor(y), inv.ny - 2), fy = y - y0;
    const at = (xx, yy) => inv.dB[yy * inv.nx + xx];
    const bend = (at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx) * (1 - fy) + (at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx) * fy;
    const b = Math.min(Math.max(D * wl / Math.sqrt(Math.max(D * D + r * r - 2 * D * z, 1e-9)) + bend, 0), D * 0.999);
    const rho = D * b / Math.sqrt(D * D - b * b);
    if (wl < 1e-9) return { x: 0, y: 0 };
    return { x: rho * dot3(w, cam.right) / wl, y: rho * dot3(w, cam.up) / wl };
  }

  /* A sheet through the hole, tilted by `tilt` so the side toward screen
     angle `away` (in the rest camera's view) runs back behind the hole.
     n faces the camera; (U, V) are its in-plane axes, U along the view's
     right; view0 is the camera's direction in (U, V) when it was made. */
  function sheetFrame(cam, tilt, away) {
    const e1 = [cam.pos[0] / D, cam.pos[1] / D, cam.pos[2] / D];
    const a = [0, 1, 2].map((i) => Math.cos(away) * cam.right[i] + Math.sin(away) * cam.up[i]);
    const n = [0, 1, 2].map((i) => Math.cos(tilt) * e1[i] + Math.sin(tilt) * a[i]);
    const rn = dot3(cam.right, n);
    const U = norm3([cam.right[0] - rn * n[0], cam.right[1] - rn * n[1], cam.right[2] - rn * n[2]]);
    const V = cross3(n, U);
    return { n, U, V, view0: [dot3(e1, U), dot3(e1, V)], tilt, away };
  }

  const sheetPoint = (sh, x, y, h) => [0, 1, 2].map((i) => sh.U[i] * x + sh.V[i] * y + sh.n[i] * (h || 0));

  /* The point of the sheet seen at lens-plane (lx, ly): the orbit through it
     crosses the sheet's plane first at φ0 (the lens pass finds the disk the
     same way). Inside the shadow, where the sheet is behind the hole, the
     orbit falls in first: that glass can't be seen (hidden), and stands in
     at the shadow's edge. Straight-line fallback where the orbit escapes
     first, and for the far reaches of a steep sheet, no further than 3× the
     distance to the lens plane. */
  const SHADOW = B_C / Math.sqrt(1 - (B_C / D) * (B_C / D));
  function sheetLift(lx, ly, cam, sh, T) {
    const e1 = [cam.pos[0] / D, cam.pos[1] / D, cam.pos[2] / D];
    let rho = Math.hypot(lx, ly), X = null, hidden = false;
    for (let pass = 0; pass < 2 && !X && rho > 1e-6; pass++) {
      const e2 = [0, 1, 2].map((i) => (lx * cam.right[i] + ly * cam.up[i]) / Math.hypot(lx, ly));
      const b = D * rho / Math.sqrt(D * D + rho * rho);
      let phi0 = Math.atan2(-dot3(e1, sh.n), dot3(e2, sh.n));
      if (phi0 < 0) phi0 += Math.PI;
      const u = lutU(T, b, phi0, 0);
      if (u > 1 / 40 && u < 0.97) {
        const r = 1 / u, c = Math.cos(phi0), s = Math.sin(phi0);
        X = [0, 1, 2].map((i) => r * (c * e1[i] + s * e2[i]));
        if (Math.hypot(X[0] - cam.pos[0], X[1] - cam.pos[1], X[2] - cam.pos[2]) > 3 * Math.hypot(D, rho)) X = null;
      } else if (u >= 0.97 && rho < SHADOW) {
        hidden = true;
        rho = SHADOW * 1.02;
      }
    }
    if (!X) {
      const d = [0, 1, 2].map((i) => cam.fwd[i] * D + lx * cam.right[i] + ly * cam.up[i]);
      const dn = dot3(d, sh.n);
      let t = Math.abs(dn) > 1e-9 ? -dot3(cam.pos, sh.n) / dn : 3;
      if (!(t > 0) || t > 3) t = 3;
      X = [0, 1, 2].map((i) => cam.pos[i] + t * d[i]);
    }
    return { x: dot3(X, sh.U), y: dot3(X, sh.V), X, hidden };
  }

  // A disk point (y = 0) projected onto the lens plane along its camera ray
  function diskToLens(x, z, cam) {
    const d = [x - cam.pos[0], -cam.pos[1], z - cam.pos[2]];
    const along = d[0] * cam.fwd[0] + d[1] * cam.fwd[1] + d[2] * cam.fwd[2];
    if (along <= 1e-6) return null;
    const t = D / along;
    const p = [cam.pos[0] + t * d[0], cam.pos[1] + t * d[1], cam.pos[2] + t * d[2]];
    return {
      x: p[0] * cam.right[0] + p[1] * cam.right[1] + p[2] * cam.right[2],
      y: p[0] * cam.up[0] + p[1] * cam.up[1] + p[2] * cam.up[2],
    };
  }

  Hero.geo = {
    D, NB, NPHI, B_MAX, B_C, W0, A0, A1, PHI_MAX,
    // The shadow's edge on the lens plane: rays with b = b_c leave the camera
    // at angle asin(b_c/D), which lands at radius D·tan of that angle
    shadowRadius: B_C / Math.sqrt(1 - (B_C / D) * (B_C / D)),
    bOfS, sOfB, toHalf, fromHalf, trace, build, sampleTables, selfTest,
    camera, lensToScreen, screenToLens, lensToDisk, diskToLens,
    INV: { NX: INV_NX, NY: INV_NY, L0: INV_L0, L1: INV_L1 },
    buildInverse, lutU, lensOf, sheetFrame, sheetPoint, sheetLift,
  };
})();
