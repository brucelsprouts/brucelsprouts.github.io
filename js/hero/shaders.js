/* ============================================================
   hero/shaders.js — GLSL for every pass (GLSL ES 3.00)

   three.js prepends the version line, precision and its built-in
   attributes (position, uv), so each shader here starts at its own
   declarations. Table sizes and physical constants arrive as
   material.defines from the renderer.
============================================================ */
(function () {
  'use strict';
  const Hero = window.Hero = window.Hero || {};

  /* ── shared helpers ── */
  const COMMON = /* glsl */`
#define PI  3.14159265359
#define TAU 6.28318530718

float sq(float x) { return x * x; }

// Integer hash (pcg3d) — stable on every driver, no sin() precision games
uvec3 pcg3d(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  return v;
}
// Glass the camera has swung over the copy or up under the nav fades there,
// so both stay clean: 1 clear of the copy's box (suv x0, y0, x1, y1) and
// below the nav's edge (suv y), 0.15 well inside either
float overCopy(vec2 fc, vec2 res, vec4 b, float navY) {
  vec2  s = (fc - 0.5 * res) / res.y;
  vec2  d = max(b.xy - s, s - b.zw);
  float c = max(1.0 - smoothstep(-0.02, 0.012, max(d.x, d.y)), smoothstep(navY - 0.012, navY + 0.02, s.y));
  return 1.0 - 0.85 * c;
}
vec3 hash33(vec3 p) {
  return vec3(pcg3d(uvec3(ivec3(floor(p)) + ivec3(1 << 20)))) * (1.0 / 4294967295.0);
}
float hash12(vec2 p) {
  uvec3 h = pcg3d(uvec3(uvec2(ivec2(floor(p)) + ivec2(1 << 20)), 0x9E37u));
  return float(h.x) * (1.0 / 4294967295.0);
}
`;

  /* Value noise from a 256² texture: R holds random values, G the same
     values shifted by (37, 17), so one bilinear fetch returns two
     z-slices of a 3D lattice. One fetch per octave instead of eight
     hashes — the single biggest saving on software renderers. */
  const NOISE = /* glsl */`
uniform sampler2D uNoise;
float noise3(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;
  vec2 rg = textureLod(uNoise, (uv + 0.5) * (1.0 / 256.0), 0.0).yx;
  return mix(rg.x, rg.y, f.z);
}
float noise2(vec2 x) {
  vec2 p = floor(x);
  vec2 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return textureLod(uNoise, (p + f + 0.5) * (1.0 / 256.0), 0.0).b;
}
`;

  /* Lens plane ↔ screen, identical to the lens pass's ray setup.
     uView = (1 / (D·fov), roll, yShift, aspect). "suv" is
     (px − centre) / height with y up; "uv" is 0..1 texture space. */
  const VIEW = /* glsl */`
uniform vec4 uView;
vec2 lensToSuv(vec2 l) {
  vec2 v = l * uView.x;
  float c = cos(uView.y), s = sin(uView.y);
  return vec2(c * v.x + s * v.y, -s * v.x + c * v.y + uView.z);
}
vec2 lensDeltaToUv(vec2 d) {
  vec2 v = d * uView.x;
  float c = cos(uView.y), s = sin(uView.y);
  return vec2((c * v.x + s * v.y) / uView.w, -s * v.x + c * v.y);
}
vec2 suvToUv(vec2 s)   { return vec2(s.x / uView.w + 0.5, s.y + 0.5); }
vec4 suvToClip(vec2 s) { return vec4(s.x * 2.0 / uView.w, s.y * 2.0, 0.0, 1.0); }
`;

  /* Per-rift state, one entry per slot:
     uSlotA = (spawn, crackDur, healStart, healDur)   — crackDur 0 = empty slot
     uSlotB = (_, gain, seed, userRift)
     uSheetU, uSheetV = the rift's sheet of glass: its in-plane axes (world
       units), and in .w the camera's direction along them when it cracked
     Every fracture is a flat sheet through the hole's centre, fixed in the
     scene. A point of it — (x, y) along U, V and h out of it toward the
     camera — is seen through the hole's gravity: lensOf() looks up the
     photon orbit that reaches it (Hero.geo.lensOf), so glass near the hole
     bends round the shadow like the disk, and turns in perspective as the
     camera moves. uPxLens is lens units per buffer pixel, uPxScale buffer
     pixels per CSS pixel; uLight = (direction, angle) of the light the
     glass catches. */
  const SLOTS = /* glsl */`
uniform vec4 uSlotA[MAX_SLOTS];
uniform vec4 uSlotB[MAX_SLOTS];
uniform vec4 uSheetU[MAX_SLOTS];
uniform vec4 uSheetV[MAX_SLOTS];
uniform sampler2D uLensInv;
uniform vec3 uCamPos;
uniform vec3 uRight;
uniform vec3 uUp;
uniform float uTime;
uniform float uReduced;
uniform float uPxLens;
uniform float uPxScale;
uniform vec3 uLight;
uniform vec4 uDepthC;     // how far the disk hides glass behind it, redshift near the hole, crack width with distance, _
// The heal front, as a position along the main crack (0 where it starts,
// 1 where it ends): it runs from −0.1 to 1.2 over the heal (rifts.js
// schedules falls to match)
float healFront(vec4 A) { return (uTime - A.z) / max(A.w, 1e-3) * 1.3 - 0.1; }
vec3 sheetPoint(int slot, vec2 p, float h) {
  vec3 U = uSheetU[slot].xyz, V = uSheetV[slot].xyz;
  return U * p.x + V * p.y + cross(U, V) * h;
}
// Where the live camera sees world point P: the lens-plane point of its
// primary image. The table holds the bend on top of the straight-line
// impact parameter, per (angle round the hole from the camera, ln r).
vec2 lensOf(vec3 P) {
  vec3  e1  = uCamPos * (1.0 / LENS_D);
  float r   = max(length(P), 1.0);
  float z   = dot(P, e1);
  vec3  w   = P - z * e1;
  float wl  = length(w);
  float psi = acos(clamp(z / r, -1.0, 1.0));
  vec2  t   = vec2((psi * (1.0 / PI) * (INV_NX - 1.0) + 0.5) / INV_NX,
                   (clamp((log(r) - INV_L0) * (1.0 / (INV_L1 - INV_L0)), 0.0, 1.0) * (INV_NY - 1.0) + 0.5) / INV_NY);
  float b   = LENS_D * wl * inversesqrt(max(LENS_D * LENS_D + r * r - 2.0 * LENS_D * z, 1e-6))
            + textureLod(uLensInv, t, 0.0).r;
  b = clamp(b, 0.0, LENS_D * 0.999);
  float rho = LENS_D * b * inversesqrt(LENS_D * LENS_D - b * b);
  return wl > 1e-6 ? rho * vec2(dot(w, uRight), dot(w, uUp)) / wl : vec2(0.0);
}
// How much bigger than at the hole's depth P looks: nearer glass is larger
float perspOf(vec3 P) { return LENS_D / max(LENS_D - dot(P, uCamPos) * (1.0 / LENS_D), 1.0); }
// How far the camera has swung round the sheet since it cracked
vec2 sheetView(int slot) {
  vec3 e1 = uCamPos * (1.0 / LENS_D);
  return vec2(dot(e1, uSheetU[slot].xyz) - uSheetU[slot].w, dot(e1, uSheetV[slot].xyz) - uSheetV[slot].w);
}
// Glass behind the near side of the disk shows through the gas, dimmed
float diskCover(vec3 P) {
  vec3 C = uCamPos;
  if (C.y * P.y >= 0.0) return 0.0;
  vec3 X = C + (P - C) * (C.y / (C.y - P.y));
  if (dot(X, C) <= 0.0) return 0.0;
  float r = length(X.xz);
  return uDepthC.x * smoothstep(R_IN, R_IN + 0.35, r) * (1.0 - smoothstep(R_OUT * 0.58, R_OUT, r));
}
// Light from glass near the hole climbs out of its well: dimmer (and, in
// the crack's colour, redder). 1 beyond r = 6.
float gravDim(vec3 P) {
  float g = min(sqrt(1.0 - 1.0 / max(length(P), 1.05)) * 1.0954, 1.0);
  return mix(1.0, g * g * g, uDepthC.y);
}
`;

  /* ── fullscreen triangle ── */
  const FS_VERT = /* glsl */`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

  /* ============================================================
     0. NEBULA BAKE — once, 512×256 equirectangular, sqrt-encoded
  ============================================================ */
  const NEBULA_FRAG = COMMON + NOISE + /* glsl */`
uniform vec3 uNebCool;
uniform vec3 uNebWarm;
out vec4 fragColor;
float fbm6(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) { s += a * noise3(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; }
  return s;
}
void main() {
  vec2 uv  = gl_FragCoord.xy / vec2(512.0, 256.0);
  float lon = (uv.x - 0.5) * TAU;
  float lat = uv.y * PI;
  vec3 d = vec3(sin(lat) * cos(lon), cos(lat), sin(lat) * sin(lon));
  float n1 = fbm6(d * 1.8 + vec3(0.0, 0.0, 3.7));
  float n2 = fbm6(d * 3.1 + vec3(5.2, 1.3, 0.0));
  float n3 = fbm6(d * 2.6 + vec3(11.0));
  vec3 c = uNebCool * pow(max(n1 - 0.42, 0.0), 1.6) * 0.55
         + uNebWarm * pow(max(n2 - 0.48, 0.0), 1.6) * 0.35
         + 0.018 * n3 * vec3(0.90, 0.95, 1.05);
  fragColor = vec4(sqrt(max(c, 0.0) * NEB_ENC), 1.0);
}
`;

  /* ============================================================
     1. LENS PASS — black hole, disk, stars, nebula, photon ring
  ============================================================ */
  const LENS_FRAG = COMMON + NOISE + /* glsl */`
uniform vec2  uRes;
uniform float uTime;
uniform vec4  uView;
uniform vec3  uCamPos;
uniform vec3  uFwd;
uniform vec3  uRight;
uniform vec3  uUp;
uniform float uFov;
uniform sampler2D uLut;
uniform sampler2D uAux;
uniform sampler2D uNebula;
uniform float uIgnite;
uniform vec4  uWind;     // rigid drift, differential amplitude, inflow, hot-spot pulse — per frame on the CPU
uniform vec4  uPhase;    // band drift, filament drift, shimmer phase, _
uniform vec4  uSpotA[MAX_SPOTS];   // point lights on the disk (embers, rift anchor flares): x, z, tangent
uniform vec4  uSpotB[MAX_SPOTS];   // intensity, sharpness along the tangent, across it, cutoff radius²
uniform int   uSpots;
uniform int   uStarLayers;
uniform int   uCrossings;
uniform vec4  uDiskA;    // emission, opacity, inner glow, inner glow width
uniform vec4  uDiskB;    // _, beaming gain, min, max
uniform vec4  uDiskC;    // lane contrast, filament weight, ignition front glow, over-shadow
uniform vec4  uRingP;    // width, intensity, doppler asymmetry, nebula gain
uniform vec3  uDiskHot;
uniform vec3  uDiskMid;
uniform vec3  uDiskCool;
uniform vec3  uDiskBlue;
uniform vec3  uRingTint;
uniform float uStarGain;
out vec4 fragColor;

float fbm3(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { s += a * noise3(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; }
  return s * (1.0 / 0.875);
}
float fbm2(vec3 p) {
  return (noise3(p) * 0.5 + noise3(p * 2.03 + vec3(1.7, 9.2, 3.1)) * 0.25) * (1.0 / 0.75);
}

/* Blackbody-ish ramp for the observed temperature (1 ≈ inner edge at rest):
   deep amber → gold → gold-white, and past that a cold blue-white that only
   the approaching side reaches */
vec3 diskTint(float T) {
  vec3 c = mix(uDiskCool, uDiskMid, smoothstep(0.12, 0.55, T));
  c = mix(c, uDiskHot, smoothstep(0.50, 0.98, T));
  return mix(c, uDiskBlue, smoothstep(0.98, 1.55, T));
}

/* Disk emission at a crossing. p is on the y = 0 plane, nObs is the photon's
   direction of travel toward the camera (for Doppler), r = |p|. lite drops
   the finest noise: the secondary images it serves are squeezed into a thin
   ring where that detail can't show. */
vec4 diskSample(vec3 p, vec3 nObs, float r, bool lite) {
  // Rotation = rigid drift + a bounded differential term. Pure Keplerian
  // shear winds the pattern into ever-tighter rings that alias after ~30 s;
  // bounding it keeps the filaments loose forever.
  float wind = uWind.x + uWind.y * (inversesqrt(r * r * r) - 0.078);
  float cw = cos(wind), sw = sin(wind);
  vec2  q  = vec2(cw * p.x - sw * p.z, sw * p.x + cw * p.z);   // shear-corrected frame

  // Radial inflow: every structure drifts toward the horizon
  float rIn = r + uWind.z;

  // All noise is sampled in the Cartesian frame q, never from a raw angle —
  // atan jumps by 2π and would seam the disk. Bands and filaments vary slowly
  // across q but fast with radius, so they stretch along the orbit into
  // streaks instead of round cells.
  float n, band, fil;
  if (lite) {
    n    = fbm2(vec3(q * 0.80, rIn * 0.9));
    band = noise3(vec3(q * 0.90, rIn * 2.6 + uPhase.x));
    fil  = 0.5;
  } else {
    n    = fbm3(vec3(q * 0.80, rIn * 0.9));
    band = fbm2(vec3(q * 0.90, rIn * 2.6 + uPhase.x));
    fil  = noise3(vec3(q * 1.40, rIn * 6.5 + uPhase.y));
  }
  float ridge = 1.0 - abs(2.0 * fil - 1.0);                      // thin bright filaments
  float dens = clamp(n * 1.12 + band * 0.30 + ridge * uDiskC.y - 0.36, 0.0, 1.0);
  dens = pow(dens, uDiskC.x);                                    // dark lanes stay dark

  // Spiral arms from an integer harmonic (seam-free); angles come from q so
  // no atan is needed: sin(2a + ph) with cos/sin 2a built from q / r
  vec2  qn = q / r;
  float c2 = qn.x * qn.x - qn.y * qn.y, s2 = 2.0 * qn.x * qn.y;
  float ph = rIn * 1.6;
  dens *= 0.80 + 0.40 * (0.5 + 0.5 * (s2 * cos(ph) + c2 * sin(ph)));

  // Co-rotating hot spots (fixed points in q orbit at their radius' rate)
  float hs = exp(-14.0 * length(q - vec2(3.1, 1.2)))
           + 0.75 * exp(-12.0 * length(q + vec2(4.3, 2.1)));
  dens *= 1.0 + hs * uWind.w;

  // Turbulent shimmer, sin(4a + X), under 1 Hz
  float c4 = c2 * c2 - s2 * s2, s4 = 2.0 * s2 * c2;
  float X  = uPhase.z + r * 3.0;
  dens *= 1.0 + 0.07 * (s4 * cos(X) + c4 * sin(X));

  float inner   = smoothstep(R_IN, R_IN + 0.35, r);
  float outer   = 1.0 - smoothstep(R_OUT * 0.58, R_OUT, r);
  float falloff = 1.0 / (0.55 + r * 0.30);
  float glow    = 1.0 + uDiskA.z * exp(-(r - R_IN) / uDiskA.w);   // hot inner edge
  float e = dens * inner * outer * falloff * glow * uDiskA.x;

  // Point lights riding the disk: infalling embers and the flares where rift
  // ends touch it. Added here, so they are lensed exactly like the gas.
  for (int j = 0; j < MAX_SPOTS; j++) {
    if (j >= uSpots) break;
    vec4  a  = uSpotA[j];
    vec4  s  = uSpotB[j];
    vec2  dv = p.xz - a.xy;
    float d2 = dot(dv, dv);
    if (d2 < s.w) {                              // spots are small: most pixels skip the exp
      float dl = dot(dv, a.zw);
      e += s.x * exp(-(dl * dl * s.y + max(d2 - dl * dl, 0.0) * s.z));
    }
  }

  // Ignition: a front sweeps R_IN → R_OUT; its crest glows as it passes
  if (uIgnite < 1.0) {
    float ig    = max(uIgnite, 0.0);
    float igE   = 1.0 - sq(sq(1.0 - ig));
    float front = mix(R_IN - 0.6, R_OUT + 0.9, igE);
    float lit   = smoothstep(front + 0.45, front - 0.45, r);
    float crest = exp(-sq((r - front) / 0.38)) * (1.0 - ig) * uDiskC.z;
    e = e * lit + crest * (0.35 + dens) * inner * outer;
  }

  // Relativity: Doppler factor from the gas velocity and the photon's actual
  // direction, times gravitational redshift g = sqrt(1 − 1/r)
  vec3  vel   = vec3(p.z, 0.0, -p.x) / r;
  float beta  = min(sqrt(0.5 / (r - 1.0)), 0.62);
  float gam   = inversesqrt(1.0 - beta * beta);
  float dop   = 1.0 / (gam * (1.0 - beta * dot(vel, nObs)));
  float shift = dop * sqrt(1.0 - 1.0 / r);
  float beam  = clamp(uDiskB.y * shift * shift * shift, uDiskB.z, uDiskB.w);   // ∝ shift³
  float q4    = sqrt(sqrt(R_IN / r));
  float T     = q4 * q4 * q4 * shift * 1.25;                    // (R_IN / r)^¾ · shift

  return vec4(e * beam * diskTint(T), clamp(e * uDiskA.y, 0.0, 1.0));
}

/* Stars on a hash grid, sampled in the bent direction. The pixel footprint
   sets a floor on the star radius; brightness falls by the same area, so a
   star never shimmers in or out as the render scale changes. */
vec3 starLayer(vec3 d, float scale, float thresh, float salt, float pxA) {
  vec3 p  = d * scale;
  vec3 h  = hash33(p + salt);
  if (h.x < thresh) return vec3(0.0);
  vec3 f   = fract(p) - 0.5;
  vec3 off = (hash33(p + salt + 17.0) - 0.5) * 0.55;
  float dd = length(f - off);
  float rs = 0.075;
  float px = pxA * scale;
  float rr = max(rs, px * 0.85);
  float e  = sq(rs / rr) * (1.0 - smoothstep(0.30, 0.55, px));
  float mag = (h.x - thresh) / (1.0 - thresh);
  float s  = smoothstep(rr, 0.0, dd) * e * (0.25 + 1.1 * mag * mag)
           * (0.78 + 0.22 * sin(uTime * 1.3 + h.y * 80.0));
  vec3 tint = mix(vec3(1.00, 0.86, 0.72), vec3(0.76, 0.87, 1.08), h.z);
  return s * mix(vec3(1.0), tint, 0.5);
}

void main() {
  vec2  suv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float cr = cos(uView.y), sr = sin(uView.y);
  vec2  sv = suv - vec2(0.0, uView.z);
  vec2  uv = vec2(cr * sv.x - sr * sv.y, sr * sv.x + cr * sv.y);   // cursor roll

  vec3  dir  = normalize(uFwd + (uRight * uv.x + uUp * uv.y) * uFov);
  vec3  e1   = uCamPos * (1.0 / LENS_D);
  float cosA = -dot(dir, e1);
  vec3  perp = dir + cosA * e1;
  float sinA = length(perp);
  vec3  e2   = sinA > 1e-7 ? perp / sinA : uUp;
  float b    = LENS_D * sinA;                  // impact parameter
  float aAng = atan(sinA, cosA);               // angle off the hole's centre
  float bw   = max(fwidth(b), 1e-5);

  // One row of the table per b; one column per φ0
  float s  = (asinh((min(b, B_MAX) - B_CRIT) / LUT_W0) - LUT_A0) * (1.0 / (LUT_A1 - LUT_A0));
  float ty = (clamp(s, 0.0, 1.0) * (LUT_NB - 1.0) + 0.5) / LUT_NB;
  vec4  aux = textureLod(uAux, vec2(ty, 0.5), 0.0);

  float phi0 = mod(atan(-e1.y, e2.y), PI);    // first disk-plane crossing
  float tx   = (phi0 * (1.0 / PI) * (LUT_NPHI - 1.0) + 0.5) / LUT_NPHI;
  vec3  us   = textureLod(uLut, vec2(tx, ty), 0.0).rgb;

  // Escape angle: the table's bend (weak-field 1/b falloff past B_MAX)
  float delta  = aux.r * (b > B_MAX ? B_MAX / b : 1.0);
  float phiEnd = delta + PI - aAng;
  vec3  dOut   = cos(phiEnd) * e1 + sin(phiEnd) * e2;
  float pxA    = length(fwidth(dOut));          // outside any branch: derivatives stay defined

  float shadow = smoothstep(B_CRIT + bw, B_CRIT - bw, b);
  float crossW = mix(1.0, uDiskC.w, shadow);    // gas in front of the shadow

  // Disk crossings, composited front to back: the primary image (which
  // includes the far side arcing over the top), then the secondary image
  // under the shadow, then — mid/high tiers — the tertiary hugging the ring
  vec3  col   = vec3(0.0);
  float alpha = 0.0;
  float ib2   = 1.0 / (b * b) - INV_D3;
  if (crossW > 0.001) {
    // A uniform bound, so the D3D compiler keeps a real loop instead of
    // unrolling three copies of the disk — that alone halves compile time
    for (int k = 0; k < uCrossings; k++) {
      float phik = phi0 + float(k) * PI;
      if (phik >= phiEnd || alpha > 0.995) break;
      float u = k == 0 ? us.r : (k == 1 ? us.g : us.b);
      float r = 1.0 / max(u, 1e-4);
      if (r < R_IN || r > R_OUT) continue;
      float cp = cos(phik), sp = sin(phik);
      vec3  R  = cp * e1 + sp * e2;
      vec3  T  = -sp * e1 + cp * e2;
      // |u'| from the orbit's energy; it changes sign at periapsis
      float du   = sqrt(max(ib2 - u * u + u * u * u, 0.0)) * (phik < aux.b ? 1.0 : -1.0);
      vec3  nObs = normalize(du * R - u * T);
      vec4  ds   = diskSample(r * R, nObs, r, k > 0);   // one inlined copy keeps compiles quick
      col   += (1.0 - alpha) * ds.rgb * crossW;
      alpha += (1.0 - alpha) * ds.a * crossW;
    }
  }

  // Lensed sky
  vec3 sky = vec3(0.0);
  if (shadow < 0.999) {
    vec2 nuv = vec2(atan(dOut.z, dOut.x) * (0.5 / PI) + 0.5, acos(clamp(dOut.y, -1.0, 1.0)) / PI);
    vec3 nb  = textureLod(uNebula, nuv, 0.0).rgb;
    sky = nb * nb * (uRingP.w / NEB_ENC);
    for (int i = 0; i < uStarLayers; i++) {           // uniform bound: one compiled copy
      float fi = float(i);
      sky += starLayer(dOut, 90.0 + 125.0 * fi, 0.955 - 0.02 * fi, 71.0 * fi, pxA) * uStarGain * (1.0 - 0.2 * fi);
    }
  }
  col += sky * (1.0 - alpha) * (1.0 - shadow);

  // Photon ring: a thin analytic line at b_c, brighter on the approaching side
  float rw   = max(uRingP.x, bw * 1.2);
  float ring = exp(-sq((b - B_CRIT) / rw)) * (uRingP.x / rw)
             * smoothstep(B_CRIT - rw * 0.8, B_CRIT + rw * 0.6, b);
  ring *= uRingP.y * (1.0 - uRingP.z * uv.x / max(length(uv), 1e-4));
  col += ring * uRingTint * smoothstep(0.0, 0.6, uIgnite);

  fragColor = vec4(col, 1.0);
}
`;

  /* ============================================================
     2. OVERLAY — blit, glass shards, crack lines, splinters, particles
  ============================================================ */
  const BLIT_FRAG = /* glsl */`
uniform sampler2D uSrc;
in vec2 vUv;
out vec4 fragColor;
void main() { fragColor = vec4(textureLod(uSrc, vUv, 0.0).rgb, 1.0); }
`;

  /* Glass shards: the pieces a fracture's cracks close in, cut into convex
     parts and fanned from each part's centre. Every vertex carries its
     shard's whole life, so once written the CPU never touches it again.
       aT1 = shard centre.xy, offset.xy
       aT2 = rotation, scale, snap time (s after spawn), plate curvature
       aT3 = plate tilt.xy, brightness, film phase
       aT4 = fan weight (1 centre, 0 rim), rim height, rim inward normal (angle), rim is a crack (1) or a cut made for drawing (0)
       aT5 = when the crack along the rim arrives (s after spawn), slot, heal order ρ, how far it stands proud
       aT6 = fall start (after heal start; < 0 never), fall time, spin, orbit rate
     Positions are on the rift's sheet (see SLOTS). A shard is drawn where it
     sits but samples the scene through its own rotation, shift and scale,
     squashed along its tilt like a surface seen at an angle, so the picture
     breaks along every crack. Snapped out, it stands proud of the sheet and
     really leans: the side it tilts toward comes up out of the glass, so it
     turns in perspective against its neighbours as the camera moves. The
     steeper the tilt, the further its picture slides as the camera swings
     round. Near a crack the scene splits into R, G and B, and the shard is
     a tilted, curved plate that reflects the turning light. */
  const CELL_VERT = COMMON + VIEW + SLOTS + /* glsl */`
in vec4 aT1;
in vec4 aT2;
in vec4 aT3;
in vec4 aT4;
in vec4 aT5;
in vec4 aT6;
uniform vec4 uGlassA;     // settle time, colour band width (CSS px), band shift (CSS px), channel split
uniform vec4 uGlassD;     // light streaks: the way they sweep (angle), shift per unit of tilt, period, rate
uniform vec4 uGlassF;     // with the view: picture slide, streak sweep, film shift; squash along the tilt
uniform vec4 uGlassG;     // with the tilt: picture shift, shade toward/away from the light, how far it leans out of the sheet
out vec2  vSample;
out vec2  vBend;          // uv shift at the rim: inward normal × band shift
out vec3  vRim;           // fan weight, rim height px, band strength
out vec4  vLook;          // brightness, film phase, heat, alpha
out vec3  vPlate;         // plate normal.xy here, how far it has snapped out
out float vLit;
out float vStreak;        // lens units along the sweep, shifted by the shard's tilt
out vec2  vView;          // the camera's swing since the crack, seen from the glass
out float vGrav;          // its light, dimmed climbing out from near the hole

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
  vec2  view = sheetView(slot);

  vec2  rest = position.xy;
  vec2  r1   = rest - aT1.xy;
  vec2  tilt = aT3.xy;
  float tl   = length(tilt);
  vec2  tn   = tilt / max(tl, 1e-4);
  // squashed along the tilt (or stretched: the curvature's sign picks)
  float sqz  = uGlassF.w * (1.0 / cos(min(tl, 1.2)) - 1.0) * sign(aT2.w);
  vec2  rs   = r1 + tn * dot(r1, tn) * sqz * k;
  vec2  d    = rot2(aT2.x * k) * rs * (1.0 + aT2.y * k) - r1 + (aT1.zw + uGlassG.x * tilt) * k;
  // tilted glass bends the view more the steeper it is seen through
  vec2  slide = uGlassF.x * (dot(tilt, tilt) * view + 2.0 * dot(tilt, view) * tilt) * k;

  vec2  drawn = rest, rel = r1;
  vec2  nIn   = vec2(cos(aT4.z), sin(aT4.z));
  float heat = 0.0, loose = 0.0, sink = 1.0, tau = 0.0;
  if (falls && uTime > A.z + aT6.x) {
    // Breaks free and spirals into the hole, in the plane of its sheet. It
    // stays glass: what it shows is the scene behind wherever it is now,
    // bent by its tilt — a shard that kept its own patch of picture would
    // drag black sky across the disk.
    tau = clamp((uTime - A.z - aT6.x) / aT6.y, 0.0, 1.0);
    vec2  p0  = aT1.xy;
    float r0  = length(p0);
    float th  = atan(p0.y, p0.x) + aT6.w * (1.0 / (1.0 - 0.9 * tau) - 1.0);
    float r   = r0 * pow(1.0 - tau, 2.0 / 3.0);
    mat2  sp  = rot2(aT6.z * tau);
    rel   = sp * r1 * (1.0 - 0.6 * tau);
    drawn = r * vec2(cos(th), sin(th)) + rel;
    nIn   = sp * nIn;
    heat  = smoothstep(0.1, 0.85, tau);
    loose = smoothstep(0.0, 0.25, tau);          // a free shard catches light on every edge
    sink  = 1.0 - tau;                           // settles back into the sheet as it goes
  }
  float on = clamp(k, 0.0, 1.0);
  // snapped out, it stands a little proud of the sheet and leans: the side
  // it tilts toward comes up out of the glass, the other sinks back
  float h = (aT5.w + uGlassG.z * dot(rel, tn) * tan(min(tl, 1.2))) * on * sink;
  vec3  P = sheetPoint(slot, drawn, h);
  vec2  here = lensOf(P);
  float alpha = 1.0;
  if (tau > 0.0) {
    // shards already over the shadow shrink away instead of crossing its edge
    float r0i = length(lensOf(sheetPoint(slot, aT1.xy, 0.0)));
    alpha = (r0i > R_SH * 1.2 ? smoothstep(R_SH * 0.97, R_SH * 1.2, length(here)) : 1.0 - smoothstep(0.3, 1.0, tau))
          * (1.0 - step(1.0, tau));
  }

  vSample = suvToUv(lensToSuv(lensOf(sheetPoint(slot, drawn + d + slide, h))));
  vBend   = lensDeltaToUv(nIn * uPxLens * uGlassA.z * uPxScale);
  // the colour band shows once the crack along this rim has arrived, and
  // widens as the shard snaps out
  float band = aT4.w * smoothstep(0.0, 0.06, tRel - aT5.x) * (0.35 + 0.65 * on) * relax;
  vRim    = vec3(aT4.x, aT4.y / uPxLens * perspOf(P), mix(band, aT4.w, loose));
  vLit    = sq(max(dot(-nIn, uLight.xy), 0.0));            // the edge faces the light
  vPlate  = vec3(aT3.xy + aT2.w * r1, on);
  // brighter where it leans toward the light, darker where it leans away;
  // behind the near side of the disk, the gas shows through
  vLook   = vec4((1.0 + (aT3.z - 1.0) * on) * (1.0 + uGlassG.y * dot(tilt, uLight.xy) * on), aT3.w, heat,
                 alpha * B.y * (1.0 - diskCover(P)));
  vec2 sweep = vec2(cos(uGlassD.x), sin(uGlassD.x));
  vStreak = dot(drawn, sweep) + dot(tilt, sweep) * uGlassD.y * on + dot(view, sweep) * uGlassF.y;
  vView   = view;
  vGrav   = gravDim(P);
  gl_Position = suvToClip(lensToSuv(here));
}
`;

  const CELL_FRAG = COMMON + /* glsl */`
uniform sampler2D uScene;
uniform vec4 uGlassA;     // settle, band width (CSS px), band shift (CSS px), channel split
uniform vec4 uGlassB;     // edge glint, reflection, edge shadow, _
uniform vec4 uGlassC;     // light off-axis, shininess, film scale, iridescence
uniform vec4 uGlassD;     // light streaks: angle, tilt shift, period (lens units), rate (passes/s)
uniform vec4 uGlassE;     // light streaks: width (lens units), gain, thin line gain, thin line gap (lens units)
uniform vec4 uGlassF;     // with the view: picture slide, streak sweep, film shift; squash
uniform vec3 uLight;
uniform float uPxScale;
uniform float uTime;
uniform vec3 uCoreTint;
uniform vec3 uEmber;
uniform vec4 uCopy;       // the copy's box (suv): glass that swings over it fades
uniform float uNavY;      // …and the nav's lower edge (suv y), above which it fades
uniform vec2 uRes;
in vec2  vSample;
in vec2  vBend;
in vec3  vRim;
in vec4  vLook;
in vec3  vPlate;
in float vLit;
in float vStreak;
in vec2  vView;
in float vGrav;
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
  // a tilted, gently curved plate reflecting the turning light, seen from
  // where the camera is now, with a thin-film sheen whose colour shifts with
  // the angle
  vec3  n    = normalize(vec3(vPlate.xy, 1.0));
  vec3  L    = normalize(vec3(uLight.xy * uGlassC.x, 1.0));
  vec3  V    = vec3(vView, sqrt(max(1.0 - dot(vView, vView), 0.0)));
  float spec = pow(max(dot(reflect(-L, n), V), 0.0), uGlassC.y);
  float ang  = dot(n.xy, uLight.xy) + dot(n.xy, vView) * uGlassF.z;
  vec3  film = 0.5 + 0.5 * cos(TAU * (vLook.y + ang * uGlassC.z + vec3(0.0, 0.33, 0.67)));
  c += mix(vec3(1.0), film, uGlassC.w) * spec * uGlassB.y * vPlate.z * vGrav;
  // streaks of reflected light sweeping across the glass: a broad line and
  // a thin one beside it. Each shard's tilt moves its own, so they break
  // at every crack.
  float ph = fract(vStreak / uGlassD.z - uTime * uGlassD.w) - 0.5;
  float wd = uGlassE.x / uGlassD.z;
  float streak = exp(-sq(ph / wd)) + uGlassE.z * exp(-sq((ph - uGlassE.w / uGlassD.z) / (wd * 0.4)));
  c += mix(vec3(1.0), film, 0.5 * uGlassC.w) * uCoreTint * streak * uGlassE.y * vPlate.z * vGrav;
  c = mix(c, c * uEmber * 1.6, vLook.z * 0.7);                                    // reddens as it falls
  float a = vLook.w * overCopy(gl_FragCoord.xy, uRes, uCopy, uNavY);
  fragColor = vec4(c * a, a);
}
`;

  /* Crack lines: one strip per crack, two vertices per point.
       position = the point on the rift's sheet (see SLOTS)
       aNrm = miter normal on the sheet (its length is the miter's stretch)
       aLa  = arrival (s after spawn), front speed there (sheet units/s), core half-width (CSS px), heal order ρ
       aLb  = side (±1), slot, normal angle, hash
       aLc  = the glass stays put on the left, on the right (0/1)
     A crack is drawn as light: a white-hot core with red and blue edges. It
     is revealed per pixel — arrival time is linear along each segment, so
     the front is exact however fast it runs. Where the glass on a side
     stays put, the strip is wider and carries that side's band of split
     colour (moving shards draw their own). The strip is built on screen,
     square to the crack as the camera sees it now: wider where the glass
     is nearer, dimmer behind the near side of the disk, dimmer and redder
     deep in the hole's well. */
  const CRACK_VERT = COMMON + VIEW + SLOTS + /* glsl */`
in vec2 aNrm;
in vec4 aLa;
in vec4 aLb;
in vec2 aLc;
uniform vec4 uGlassA;     // settle, band width (CSS px), band shift (CSS px), channel split
uniform vec4 uCrackB;     // still-side band, glint sharpness, fringe px, core occlusion
out float vX;             // signed px from the centre line (+ left)
out vec3  vW;             // core half-width px, redshift, coverage
out vec4  vT;             // arrival, front speed (lens units/s), time since spawn, fade
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
  vec3  P  = sheetPoint(slot, position.xy, 0.0);
  vec2  c  = lensOf(P);
  // the crack's way on screen, from a point a little further along it
  float mk = max(length(aNrm), 1e-6);
  vec2  nm = aNrm / mk;
  vec2  ta = lensOf(sheetPoint(slot, position.xy + vec2(nm.y, -nm.x) * 0.02, 0.0)) - c;
  float tl = length(ta);
  vec2  nI = tl > 1e-9 ? vec2(-ta.y, ta.x) / tl : nm;
  float hwB = aLa.z * uPxScale * clamp(pow(perspOf(P), uDepthC.z), 0.45, 2.4);
  float hw  = max(hwB, 0.55);                   // never thinner than about a pixel...
  // room for the glow, or for this side's band of colour
  float ext = hw + (3.0 + 2.0 * uCrackB.z) * uPxScale + still * step(0.001, uCrackB.x) * uGlassA.y * 2.5 * uPxScale;
  vec2  lp  = c + nI * mk * side * ext * uPxLens;
  float front = healFront(A);
  float grav  = gravDim(P);
  vX    = side * ext;
  vW    = vec3(hw, 1.0 - grav, hwB / hw);       // ...but dimmer when it would be
  // a crack fades as the shards either side of it settle or fall
  vT    = vec4(aLa.x, aLa.y * tl / 0.02, uTime - A.x,
               (1.0 - smoothstep(aLa.w - 0.08, aLa.w + 0.22, front)) * B.y * (1.0 - diskCover(P)) * grav);
  // stretches that face the light flash as it swings round; the rest is uneven
  vGlint = vec2(pow(max(cos(2.0 * (aLb.z - uLight.z)), 0.0), uCrackB.y) * (0.35 + 0.65 * aLb.w),
                0.35 + 0.65 * sq(fract(aLb.w * 7.13)));
  vStill = aLc;
  vNUv   = lensDeltaToUv(nI * uPxLens);
  gl_Position = suvToClip(lensToSuv(lp));
}
`;

  const CRACK_FRAG = COMMON + /* glsl */`
uniform sampler2D uScene;
uniform vec2  uRes;
uniform vec4  uGlassA;    // settle, band width (CSS px), band shift (CSS px), channel split
uniform vec4  uCrackA;    // core gain, glow gain, glint gain, tip gain
uniform vec4  uCrackB;    // still-side band, glint sharpness, fringe px, core occlusion
uniform vec4  uCrackC;    // how long the front's light trails it (s), _, _, _
uniform vec4  uCopy;      // the copy's box (suv): glass that swings over it fades
uniform float uNavY;      // …and the nav's lower edge (suv y), above which it fades
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
  // its glow split like light through a prism: red to one side, blue to the other
  float gw   = hw + 1.6 * uPxScale;
  vec3  glow = vec3(exp(-sq((x - 2.0 * f) / gw)), exp(-sq(d / gw)), exp(-sq((x + 2.0 * f) / gw)));
  // the crack front, in px along the crack
  float since = vT.z - vT.x;
  float fpx   = since * vT.y / uPxLens;
  float vis   = uReduced > 0.5 ? smoothstep(0.0, 1.5, since) : clamp(fpx + 0.5, 0.0, 1.0);
  // the front's light trails it: 22 px, or as far as it runs in uCrackC.x
  // seconds when that's further, so a fast front streaks instead of skipping
  float tip   = uReduced > 0.5 ? 0.0 : exp(-sq(min(fpx / (22.0 * uPxScale), since / uCrackC.x))) * step(0.0, fpx);
  float k     = vis * vT.w * overCopy(gl_FragCoord.xy, uRes, uCopy, uNavY);
  vec3  tint  = uCoreTint * mix(vec3(1.0), vec3(1.3, 0.72, 0.42), min(vW.y * 2.0, 1.0));   // redshifted near the hole
  vec3  light = core * tint * (uCrackA.x * vGlint.y + uCrackA.z * vGlint.x + uCrackA.w * tip) * vW.z
              + glow * tint * uCrackA.y * (1.0 + 4.0 * vGlint.x + 3.0 * tip);
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

  /* Shards: one instanced triangle each. Everything they will do — pop out,
     drift, spin, detach, spiral in — is a function of time and their
     attributes. aBary picks the corner (1,0,0), (0,1,0), (0,0,1). */
  const SHARD_VERT = COMMON + VIEW + SLOTS + /* glsl */`
in vec3 aBary;
in vec4 aShA;       // anchor.xy, size, rotation
in vec4 aShB;       // corner radii ×3, corner-angle seed
in vec4 aShT;       // appear (abs), detach (after heal start), fall duration, slot
in vec4 aShF;       // drift.xy, spin, orbit rate
out vec3  vBary;
out vec2  vTilt;
out float vFade;
out float vHeat;
out float vPop;
out float vGlint;
out float vSpin;
void main() {
  int   slot = int(aShT.w + 0.5);
  vec4  A = uSlotA[slot];
  vec4  B = uSlotB[slot];
  float app = uTime - aShT.x;
  if (A.y <= 0.0 || app < 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }

  float pp  = clamp(app / 0.35, 0.0, 1.0);
  float pop = 1.0 + 2.2 * pow(pp - 1.0, 3.0) + 1.2 * pow(pp - 1.0, 2.0);   // ease-out-back
  vec2  pos = aShA.xy + aShF.xy * (1.0 - exp(-app / 0.9));
  float rot = aShA.w + aShF.z * app;

  float Td = A.z + aShT.y;
  float fade = 1.0, heat = 0.0, stretch = 1.0;
  bool  gone = false;
  vec2  tang = vec2(0.0);
  if (uTime > Td) {
    // closed-form spiral in the plane of its sheet:
    // r = r0 (1 − τ)^(2/3), θ = θ0 + w (1/(1 − 0.9τ) − 1)
    float tau = clamp((uTime - Td) / aShT.z, 0.0, 1.0);
    vec2  p0  = aShA.xy + aShF.xy * (1.0 - exp(-max(Td - aShT.x, 0.0) / 0.9));
    float r0  = length(p0);
    float th  = atan(p0.y, p0.x) + aShF.w * (1.0 / (1.0 - 0.9 * tau) - 1.0);
    float r   = r0 * pow(1.0 - tau, 2.0 / 3.0);
    pos  = r * vec2(cos(th), sin(th));
    tang = vec2(-sin(th), cos(th));
    stretch = 1.0 + 3.0 * tau * tau;
    fade = 1.0 - step(1.0, tau);
    heat = smoothstep(0.05, 0.7, tau);
    rot += aShF.z * (uTime - Td) * 1.5;
    gone = true;
  }

  float k  = aBary.y + 2.0 * aBary.z;                 // corner 0, 1, 2
  float rk = k < 0.5 ? aShB.x : (k < 1.5 ? aShB.y : aShB.z);
  float jit = (fract(aShB.w * (k + 1.0) * 13.73) - 0.5) * 0.9;
  float ang = rot + k * (TAU / 3.0) + jit;
  vec2  off = vec2(cos(ang), sin(ang)) * rk * max(aShA.z * pop, uPxLens * 0.8);
  off += tang * dot(off, tang) * (stretch - 1.0);    // smear along the orbit as it falls

  vec3 P  = sheetPoint(slot, pos, 0.0);
  vec2 lp = lensOf(sheetPoint(slot, pos + off, 0.0));
  // falling in, it fades at the shadow's edge as the camera sees it
  if (gone) fade *= smoothstep(R_SH * 0.97, R_SH * 1.22, length(lensOf(P)));
  fade *= (1.0 - diskCover(P)) * gravDim(P);
  vBary = aBary;
  vTilt = vec2(cos(aShA.w * 3.1 + 1.0), sin(aShA.w * 2.3 + 2.0)) * (0.08 + 0.08 * fract(aShB.w * 7.1));
  vFade = fade * B.y;
  vHeat = heat;
  vPop  = pp;
  // A facet catches the light as the shard turns: a slow glint, never a strobe
  vGlint = pow(max(cos(rot * 2.0 + aShB.w), 0.0), 14.0);
  vSpin  = rot + aShB.w * 0.7;
  gl_Position = suvToClip(lensToSuv(lp));
}
`;

  const SHARD_FRAG = COMMON + VIEW + /* glsl */`
uniform sampler2D uScene;
uniform vec2  uRes;
uniform vec4  uShardP;    // edge gain, dispersion, body opacity, _
uniform vec3  uCyan;
uniform vec3  uEmber;
in vec3  vBary;
in vec2  vTilt;
in float vFade;
in float vHeat;
in float vPop;
in float vGlint;
in float vSpin;
out vec4 fragColor;
void main() {
  float e  = min(min(vBary.x, vBary.y), vBary.z);     // distance to the nearest edge
  float fw = max(fwidth(e), 1e-4);
  float edgeLine = 1.0 - smoothstep(fw * 0.5, fw * 1.8, e);
  vec2  uvHere = gl_FragCoord.xy / uRes;
  // bevelled glass: the scene bends most near the edges, split into R, G, B
  float bev = 1.0 - smoothstep(0.0, 0.3, e);
  vec2  dUv = lensDeltaToUv(vTilt * (0.35 + 0.65 * bev));
  vec3  refr;
  refr.r = textureLod(uScene, uvHere + dUv * (1.0 - uShardP.y), 0.0).r;
  refr.g = textureLod(uScene, uvHere + dUv, 0.0).g;
  refr.b = textureLod(uScene, uvHere + dUv * (1.0 + uShardP.y), 0.0).b;
  // A tilted facet: its corners catch different amounts of light, so the body
  // reads as a sliver of glass even over empty sky
  float facet = dot(vBary, vec3(0.9, 0.35, 0.05) + 0.1 * vec3(vTilt.x, vTilt.y, -vTilt.x) * 10.0);
  vec3 body = refr * vec3(0.90, 0.97, 1.08) + vec3(0.03, 0.045, 0.07) * (0.3 + facet);
  body += mix(vec3(0.55, 0.75, 1.0), vec3(1.0), vGlint) * (0.02 + 0.7 * vGlint) * (1.0 - 0.6 * e);
  body = mix(body, body * uEmber * 1.5, vHeat * 0.7);   // reddens as it falls
  // Each edge catches the light at its own angle as the shard spins: one
  // bright edge and two dim ones, like a real sliver
  float ek = vBary.x <= min(vBary.y, vBary.z) ? 0.0 : (vBary.y <= vBary.z ? 1.0 : 2.0);
  float edgeLight = 0.12 + 0.88 * pow(max(cos(vSpin + ek * 2.1), 0.0), 3.0);
  vec3  edgeC = mix(mix(vec3(0.8, 0.9, 1.0), uCyan, 0.3), uEmber, vHeat) * uShardP.x;
  float flash = exp(-vPop * 6.0) * 0.6;                 // a small glint as it pops out
  vec3  col = body + edgeC * edgeLine * (edgeLight + 0.6 * vGlint + 0.5 * vHeat + flash);
  float a   = uShardP.z * vFade;
  fragColor = vec4(col * a, a);
}
`;

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
    col = uDebrisCol * smoothstep(0.0, 0.08, x);
  }
  // Where it is on its sheet, seen through the hole's gravity
  vec3  P  = sheetPoint(slot, pos, 0.0);
  vec2  c  = lensOf(P);
  if (type > 1.5) col *= smoothstep(R_SH * 0.97, R_SH * 1.2, length(c));   // debris fades at the shadow
  col *= B.y * (1.0 - diskCover(P)) * gravDim(P);
  // Quad along the velocity as the camera sees it; nearer is bigger, never
  // smaller than about a pixel (energy kept)
  float sz  = size * perspOf(P);
  float wid = max(sz, uPxLens * 0.75);
  col *= sq(sz / wid);
  vec2  ax = length(vel) > 1e-5 ? normalize(vel) : vec2(1.0, 0.0);
  vec2  axI = lensOf(sheetPoint(slot, pos + ax * 0.02, 0.0)) - c;
  axI = length(axI) > 1e-9 ? normalize(axI) : vec2(1.0, 0.0);
  vec2  qp = position.xy;
  vec2  lp = c + axI * qp.x * wid * len + vec2(-axI.y, axI.x) * qp.y * wid;
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
  const BLOOM_DOWN_FRAG = /* glsl */`
uniform sampler2D uSrc;
uniform vec2  uTexel;       // source texel
uniform vec4  uThresh;      // threshold, knee, prefilter on/off, _
in vec2 vUv;
out vec4 fragColor;
vec3 S(vec2 o) { return textureLod(uSrc, vUv + o * uTexel, 0.0).rgb; }
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
vec3 karis(vec3 a, vec3 b, vec3 c, vec3 d) {
  vec3 m = (a + b + c + d) * 0.25;
  return m / (1.0 + luma(m));
}
void main() {
  vec3 A = S(vec2(-2.0, -2.0)), B = S(vec2(0.0, -2.0)), C = S(vec2(2.0, -2.0));
  vec3 D = S(vec2(-1.0, -1.0)), E = S(vec2(1.0, -1.0));
  vec3 F = S(vec2(-2.0,  0.0)), G = S(vec2(0.0,  0.0)), H = S(vec2(2.0,  0.0));
  vec3 I = S(vec2(-1.0,  1.0)), J = S(vec2(1.0,  1.0));
  vec3 K = S(vec2(-2.0,  2.0)), L = S(vec2(0.0,  2.0)), M = S(vec2(2.0,  2.0));
  vec3 c;
  if (uThresh.z > 0.5) {
    // Karis average per 2×2 group stops single hot pixels strobing
    vec3 k0 = karis(D, E, I, J), k1 = karis(A, B, F, G), k2 = karis(B, C, G, H);
    vec3 k3 = karis(F, G, K, L), k4 = karis(G, H, L, M);
    float w0 = 0.5, w1 = 0.125;
    c = (k0 * w0 + (k1 + k2 + k3 + k4) * w1);
    c = c / max(1.0 - luma(c), 1e-3);                  // undo the Karis weighting on average
    float br = max(c.r, max(c.g, c.b));
    float soft = clamp(br - uThresh.x + uThresh.y, 0.0, 2.0 * uThresh.y);
    soft = soft * soft / (4.0 * uThresh.y + 1e-5);
    c *= max(soft, br - uThresh.x) / max(br, 1e-5);
  } else {
    c = (D + E + I + J) * 0.125
      + (A + C + K + M) * 0.03125
      + (B + F + H + L) * 0.0625
      + G * 0.125;
  }
  fragColor = vec4(max(c, 0.0), 1.0);
}
`;

  const BLOOM_UP_FRAG = /* glsl */`
uniform sampler2D uSrc;
uniform vec2  uTexel;
uniform float uRadius;
in vec2 vUv;
out vec4 fragColor;
vec3 S(vec2 o) { return textureLod(uSrc, vUv + o * uTexel * uRadius, 0.0).rgb; }
void main() {
  vec3 c = S(vec2(0.0)) * 4.0
         + (S(vec2(-1.0, 0.0)) + S(vec2(1.0, 0.0)) + S(vec2(0.0, -1.0)) + S(vec2(0.0, 1.0))) * 2.0
         + (S(vec2(-1.0, -1.0)) + S(vec2(1.0, -1.0)) + S(vec2(-1.0, 1.0)) + S(vec2(1.0, 1.0)));
  fragColor = vec4(c * (1.0 / 16.0), 1.0);
}
`;

  /* ============================================================
     4. COMPOSITE — bloom, ACES, sRGB, vignette, scrim, grain, CA
  ============================================================ */
  const COMPOSITE_FRAG = COMMON + /* glsl */`
uniform sampler2D uSrc;
uniform sampler2D uBloom;
uniform vec2  uRes;
uniform float uTime;
uniform vec4  uPostA;     // exposure, bloom strength, vignette, grain
uniform vec4  uPostB;     // aberration, scrim strength, _, _
uniform vec4  uScrim;     // centre.xy, radii.xy (suv)
in vec2 vUv;
out vec4 fragColor;

// ACES fitted (Stephen Hill): sRGB → ACES → RRT/ODT → sRGB, linear in/out
vec3 aces(vec3 c) {
  const mat3 IN  = mat3(0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777);
  const mat3 OUT = mat3(1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602);
  c = IN * c;
  vec3 a = c * (c + 0.0245786) - 0.000090537;
  vec3 b = c * (0.983729 * c + 0.4329510) + 0.238081;
  return clamp(OUT * (a / b), 0.0, 1.0);
}
vec3 toSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
void main() {
  vec2 suv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 c;
  if (uPostB.x > 0.0) {
    // light radial chromatic aberration, zero at the centre
    vec2 dv = (vUv - 0.5) * uPostB.x * dot(suv, suv);
    c = vec3(textureLod(uSrc, vUv + dv, 0.0).r, textureLod(uSrc, vUv, 0.0).g, textureLod(uSrc, vUv - dv, 0.0).b);
  } else {
    c = textureLod(uSrc, vUv, 0.0).rgb;
  }
  c += textureLod(uBloom, vUv, 0.0).rgb * uPostA.y;

  // Soft elliptical scrim behind the hero copy keeps the name legible
  float sc = 1.0 - smoothstep(0.35, 1.0, length((suv - uScrim.xy) / uScrim.zw));
  c *= 1.0 - uPostB.y * sc;
  c *= 1.0 - uPostA.z * dot(suv, suv);

  c = toSrgb(aces(c * uPostA.x));
  c += (hash12(gl_FragCoord.xy + floor(uTime * 24.0) * 61.0) - 0.5) * uPostA.w;
  fragColor = vec4(c, 1.0);
}
`;

  Hero.shaders = {
    FS_VERT, NEBULA_FRAG, LENS_FRAG, BLIT_FRAG,
    CELL_VERT, CELL_FRAG, CRACK_VERT, CRACK_FRAG, SHARD_VERT, SHARD_FRAG, PARTICLE_VERT, PARTICLE_FRAG,
    BLOOM_DOWN_FRAG, BLOOM_UP_FRAG, COMPOSITE_FRAG,
  };
})();
