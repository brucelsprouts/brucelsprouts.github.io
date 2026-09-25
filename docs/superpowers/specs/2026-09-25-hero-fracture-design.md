# Hero "Fracture" — Design Spec

**Date:** 2026-09-25
**Branch:** `hero-fracture`
**Status:** Approved in brainstorming, pending spec review

## 1. Goal

Replace the hero's black hole with a more imaginative scene: a gravitationally
lensed black hole that is repeatedly **fractured by glass rifts**. The rifts are
jagged, refractive cracks in space. Each one tears open, links two parts of the
black hole, glows, then heals, and its glass shards spiral into the hole. While
doing this, make the hero cheaper to render, and make the page appear
immediately instead of behind the fixed-length ASCII loader.

Priority order, per the user: **how it looks** first, then cheap performance
wins. Deep optimisation work comes later.

## 2. Context and baseline

The current hero (`js/main.js`, `HERO_FRAG` + `heroScene`) is a full-screen
ray-marcher. Each pixel integrates up to 44 steps through the Schwarzschild
potential and evaluates about 100 value-noise hashes for the disk and the
nebula.

Measured with headless Chrome 154, 1264×625 viewport:

| Renderer | Tier 0 (379×188, 14 steps) | Tier 3 (986×488, 44 steps) |
|---|---|---|
| RX 9060 XT (D3D11) | 1000+ fps | 1000+ fps |
| WARP (`--disable-gpu`, i.e. acceleration off) | 4.4 ms | 30.8 ms |
| SwiftShader | 21.5 ms | 360 ms |

With acceleration off, Chrome on Windows uses **WARP** ("Microsoft Basic Render
Driver"), which supports WebGL2, float render targets and
`KHR_parallel_shader_compile`. `heroScene.init` matches `basic render` as a
software renderer and forces tier 0. That tier renders a 379×187 buffer and
draws only every third frame, so the hero visibly runs at about 20 fps even
though the page loop runs at 58 fps. The "low fps, low pixel count" complaint
comes from this policy far more than from the hardware.

Other load and performance problems found:
- The hero keeps rendering after it scrolls out of view.
- The loader runs a fixed ~1.5 s count plus a ~1.1 s exit, so the name appears
  about 2.8 s after boot.
- The loader and the hero each create their own WebGL context.
- The loader-to-hero handoff animates a CSS `filter: blur()` on the WebGL
  canvas, which is expensive under software compositing.

## 3. Decisions (from brainstorming)

| Topic | Decision |
|---|---|
| Stack | three.js r128 via the existing cdnjs global. **No React or R3F for now.** R3F is three.js underneath, so the shaders and materials port later. |
| Loader | **Hidden, not deleted.** `LOADER_ENABLED = false`. The markup and code stay for a future redesign. |
| Page load | Simple CSS fade-in. The hero text animates immediately. |
| Direction | **A: Fracture** (glass cracks), not B (Shattered Lens) or C (Wormhole Portals). |
| Extras | **Click or tap to tear a rift: yes.** Photon-ring flare and spacetime ripple when debris falls in: **no.** |
| HUD | Remove the drifting number fragments and star-coordinate labels (`_spawnFloatingNumbers`, `_spawnStarCoordinates`). **Keep** the two static `.hud-corner` blocks (LAT/LON, STATUS/BUILD). |

## 4. Visual design

### 4.1 The black hole

The camera framing stays as it is today, so the hero copy still sits over the
shadow:
- distance 13
- elevation ~0.10 rad with slow sway
- azimuth drift 0.032 rad/s
- base FOV 0.62, widened on narrow aspects
- cursor tilt and roll with the two existing easing rates

Differences from today:
- **Lensing from a lookup table** (§6.2) instead of ray marching. The disk's
  primary image, the far side arcing over the top, and the thin secondary
  image under the shadow are all resolved at every quality level.
- **Disk:** keeps R_IN = 2.7 and R_OUT = 8.2, the bounded differential winding,
  the radial inflow, the co-rotating hot spots and the infalling embers. It
  gains:
  - more contrast between dark lanes and bright filaments
  - a hot inner edge that blooms
  - stronger Doppler beaming (approaching side brighter and bluer)
  - gravitational redshift, g = sqrt(1 − 1/r), which dims and reddens the
    inner edge
- **Ignition intro:** disk emission is multiplied by an ignition front that
  sweeps from R_IN to R_OUT over ~1.6 s after the first frame (§8).
- **Background:**
  - lensed procedural stars, 2 layers (1 on the lowest tier), computed per
    pixel so they stay crisp
  - the nebula is baked **once** into a 512×256 equirectangular texture and
    sampled in the bent ray direction
- **Photon ring:** thin analytic ring at the critical impact parameter,
  bright enough to bloom.
- HDR throughout. Bloom and tone mapping happen in post (§6.5, §6.6).

### 4.2 Rift anatomy (see the brainstorm diagram)

A rift is a jagged main crack plus 0–3 short branch cracks. Each crack is drawn
as a ribbon of "glass" around its centre line. Distance across the ribbon,
`d ∈ [0, 1]`, drives the shading:

- **Seam (`d < core`):**
  - white-hot HDR core with a cyan–violet tint toward its edges
  - pulses that travel from one end to the other (energy flowing between the
    two parts of the black hole it connects)
  - a slight flicker, never faster than 3 Hz
- **Glimpse inside the seam:** the scene sampled at the point mirrored
  through the hole's centre, so you see the **opposite side** of the black hole
  through the crack. It is tinted cold and blended with a slow,
  ShaderGradient-style liquid colour field (indigo / cyan / pale violet).
- **Glass lips (`core < d < 1`):**
  - refraction of the scene behind, offset along the crack normal
  - the offset follows a bevel profile that is strongest near the seam and
    fades toward the outer edge (liquid-glass style)
  - **dispersion**: R, G and B are sampled at slightly different offsets
  - thin rim highlights at the seam edge and the outer edge
  - faint liquid-chrome banding that follows `d` (Liquid Logo style)
- Edges are anti-aliased analytically (`fwidth`).

**Shards:** small irregular glass triangles along the rift. Each refracts the
scene behind it with dispersion and has bright, thin, blooming edges (edge
distance from barycentrics).

**Particles:**
- **Sparks** spray from the tearing tip. They are short-lived, stretched along
  their velocity, and pulled toward the hole.
- **Flow motes** travel along an open rift, from one end toward the other.
- **Debris** sheds from falling shards and follows them in.

**Anchor flare:** where a rift ends on the near side of the accretion disk, that
spot of the disk brightens. The flare is added in the lens pass, so it is
lensed correctly.

### 4.3 Rift life cycle

| Phase | Duration | What happens |
|---|---|---|
| Tear | 0.6–1.2 s | A hot tip races along the path, leaving the open crack. Sparks burst from it. Branches start once the tip passes their root. Shards pop out as the tip passes them. |
| Open | 3–5 s | Full width. Seam pulses and motes flow along it. Anchor flares are at full strength. Shards drift and slowly spin. |
| Heal | 1.0–1.6 s | The crack zips shut from both ends toward the middle. Shards detach and spiral into the hole: they speed up as they fall, stretch along their orbit, redden, and fade out at the shadow edge. Debris follows them. |

Automatic rifts:
- At most **3** at once (2 on the lowest tier).
- The next spawn comes 2.5–5 s after the previous one.
- The first one tears ~0.8 s after the ignition intro finishes.

### 4.4 Rift shapes and placement

All rift geometry lives in the **lens plane**: the plane through the hole that
faces the camera, in world units. On this plane the shadow radius is
R_sh ≈ b_c ≈ 2.6. Because the camera always looks at the hole, rifts stay
attached to it on screen. They get a small cursor parallax based on a
per-rift depth.

Shapes:
- **Arc:** hugs the shadow at 1.12–1.7 × R_sh and spans 50°–140°. Optionally
  one end drops to a disk anchor.
- **Bridge:** from a disk anchor on one side, arching over (or under) the
  shadow at 1.25–1.9 × R_sh, to a disk anchor on the other side.
- **Spoke** (click only): from the click point to the photon ring at
  1.03 × R_sh. If the click is inside the shadow, it tears outward to
  1.6 × R_sh instead.

Path construction:
- Jaggedness comes from midpoint displacement: 6 levels, 65 points,
  roughness about 0.55.
- Branches root at s ∈ [0.2, 0.8] of the main path. They leave at ±30–60°
  and are 15–35% of its length.
- Ribbon half-width tapers to zero at both ends, with noise variation.

Placement rules:
- **Disk anchors** are picked as near-side disk points (r ∈ [3.2, 7.5]),
  projected to the lens plane once when the rift spawns. Each frame, the
  anchor's lens-plane point is intersected with the disk plane (straight ray)
  to position the flare. This keeps the rift and its flare pinned together
  while the camera drifts.
- **Text avoidance:** the `.hero-content` bounding box is measured from the DOM
  on init and resize, converted to lens-plane units, and inflated by 6%. A
  candidate path is rejected and regenerated (up to 12 tries) if more than 15%
  of its length falls inside that box.

### 4.5 Click or tap to tear

- A primary click or tap inside `#hero` that does not land on a link, button
  or input tears a **spoke** rift from that point.
- Only one user rift can be active at a time, with a 0.8 s cooldown.
- If the rift limit is reached, the oldest automatic rift starts healing early.

### 4.6 Palette

- The site stays monochrome.
- Inside the hero: **warm matter, cold rifts.** The disk is gold-white fading
  to amber, with the Doppler colour shift. Rifts are white-hot with a
  cyan–violet tint and prismatic fringes.
- The ShaderGradient field inside the seam is the only saturated colour on the
  page.
- Every colour lives in one config object (§6.9).

## 5. Page load-in

1. The `#site-wrapper` inline `opacity:0; visibility:hidden` is removed. CSS
   fades it in over 0.6 s (`animation: … both`), so there's no JS dependency.
2. `#loader` gets `display: none`. `boot()` skips `loader.init()` when
   `LOADER_ENABLED` is false, and calls `heroAnimations.play()` straight away.
   If GSAP is missing, `heroAnimations` falls back to setting opacity to 1.
3. `#hero-canvas` starts at opacity 0 and fades in over 0.8 s when the renderer
   reports its first real frame. There is never a black or half-compiled flash.
4. The ignition intro (§4.1) runs from that first frame, then the first rift
   tears.

Target: hero text starts animating within 300 ms of `boot()`, versus ~2.8 s today.

## 6. Architecture

### 6.1 Files

The hero leaves `main.js` and moves into classic scripts under `js/hero/`. Each
file attaches to a shared `window.Hero` namespace. `index.html` injects them in
order (`async = false`) with the same `?v=` cache-busting as `main.js`, before
`main.js`.

| File | Responsibility |
|---|---|
| `js/hero/config.js` | Every tunable: colours, timings, sizes, counts, bloom, tier table. |
| `js/hero/geodesics.js` | Builds the lookup table on the CPU, plus JS helpers: lens-plane ↔ screen, lens-plane → disk intersection, b_c. |
| `js/hero/shaders.js` | GLSL for: nebula bake, lens pass, blit, rift ribbon, shard, particle, bloom (prefilter / down / up), composite. |
| `js/hero/rifts.js` | Seeded path generation, text avoidance, life-cycle scheduling, ribbon geometry, scheduling of shards and particles. |
| `js/hero/particles.js` | Instanced particle ring buffer and instanced shard buffer (write APIs). |
| `js/hero/renderer.js` | Render targets, pass orchestration, bloom chain, quality calibration, dynamic resolution, clock, pause/resume, input, public API. |

`main.js` keeps only a thin adapter. The old `HERO_VERT`, `HERO_FRAG`,
`heroScene`, the floating-number and star-coordinate spawners, and their
nav-safe helpers are deleted. The loader code stays, disabled.

### 6.2 Geodesic lookup table

Units: r_s = 1. The photon sphere is at 1.5. Photon orbits obey
u'' + u = 1.5u², with u = 1/r and φ measured in the orbit plane from the camera.
The existing shader's acceleration, −1.5h²·r̂/r⁴, produces exactly these orbits,
so the look stays consistent.

Building the table:
- The camera distance is **fixed at D = 13**. Dolly effects (breathing, cursor
  pull-in) become a matching FOV scale.
- For impact parameter b = |camPos × dir|:
  - α = asin(b / D)
  - u(0) = 1/D
  - u'(0) = cot(α) / D
  - Integrate with RK4 in φ up to Φ_MAX = 3.5π. Stop at u ≥ 1 (captured) or
    u ≤ 0 (escaped).
- Grid: 256 values of b over [0, B_MAX = 10], mapped non-uniformly so they
  cluster near b_c. 512 values of φ over [0, Φ_MAX].
- Stored as an **RGBA16F** `DataTexture` (r128 has no RG16F auto-mapping):
  - R = u(b, φ)
  - a second 256×1 texture holds φ_end(b) (escape or capture angle) and a
    captured flag
- Build time is about 5–15 ms on the main thread.
- For b > B_MAX, use the weak-field result φ_end ≈ π − α + 2/b, blended with the
  table's value at B_MAX.

Per pixel in the lens pass:
1. Take e1 = normalize(camPos) and e2 = the component of the ray perpendicular
   to e1, normalised.
2. Orbit points are r(φ)(cos φ·e1 + sin φ·e2).
3. Disk crossings are at φ_k = φ₀ + kπ for k = 0, 1, 2, where
   φ₀ = atan(−e1.y, e2.y) wrapped to [0, π). A crossing is valid when
   φ_k < φ_end.
4. Sample the disk at r = 1/u(b, φ_k) and composite front to back.
5. If the ray escapes, its bent direction is cos φ_end·e1 + sin φ_end·e2.

### 6.3 Frame pipeline

| # | Pass | Resolution | Output |
|---|---|---|---|
| 0 | Nebula bake (once) | 512×256 | `nebulaTex` (RGBA8) |
| 1 | Lens pass: disk (≤3 crossings, anchor flares, ignition), stars, nebula, photon ring | render scale s | `sceneRT` (RGBA16F) |
| 2 | Overlay: blit `sceneRT`, then rift ribbons → shards → particles (additive). The glass samples `sceneRT`. | s | `compositeRT` (RGBA16F) |
| 3 | Bloom: prefilter (13-tap, Karis average, soft threshold), downsample chain, tent upsample chain | ½ (¼ on the low tier), 4–6 mips | `bloomRT` |
| 4 | Composite: bloom, ACES-fitted tone map, sRGB encode, vignette, text scrim, grain, light radial chromatic aberration (off on the low tier) | s (canvas) | screen |

Overlay projection: an orthographic camera maps lens-plane (x, y) to screen
exactly as the lens pass maps rays: uv = (x, y) / (D·fov), then y-shift and
roll. Rifts, shards, particles and the lens pass therefore line up at every
aspect ratio.

### 6.4 Stateless, scheduled animation

When a rift spawns, **everything it will ever emit is written once**:
- ribbon geometry
- shard instances, with appear, detach and fall parameters
- spark, mote and debris particles, with *future* spawn times

After that, the vertex shaders compute each element's state from
`(uTime − spawnTime, seed, params)`. Per-frame CPU work is limited to uniforms.

This means the whole scene is a pure function of **seed + scene time**.
`?hero-seed=N&hero-time=T` reproduces a frame exactly: the scheduler
fast-forwards its seeded event list to T.

Implementation notes:
- Flow motes each travel between two path points (i → i+k), so no path
  texture is needed.
- Falling shards and debris share one closed-form spiral:
  - r(τ) = r₀(1 − τ)^(2/3)
  - θ(τ) = θ₀ + w(1/(1 − 0.9τ) − 1)
  - tangential stretch 1 + 3τ²
  - they fade and redden as r approaches R_sh

### 6.5 Quality and performance

**Calibration at startup:**
1. After shaders compile, render the lens pass 6 times at 512×288.
2. Sync with a 1-pixel `readPixels` and time the batch. This measures real GPU
   work and works on every driver, including WARP.
3. Pick a tier and a starting render scale that fits a ~10 ms lens budget.

**Tiers** (scale is the ceiling for dynamic resolution):

| Tier | Scale ceiling | Bloom | Max particles | Shards / rift | Rifts | Star layers | CA |
|---|---|---|---|---|---|---|---|
| low | 0.75 | ¼ res, 4 mips | 512 | 10 | 2 | 1 | off |
| mid | 1.0 | ½ res, 5 mips | 1536 | 24 | 3 | 2 | on |
| high | min(DPR, 2) | ½ res, 6 mips | 3072 | 40 | 3 | 2 | on |

**Dynamic resolution:**
- Track a moving average of rAF deltas, ignoring frames longer than 100 ms.
- Check every 1 s:
  - average > 20 ms for 2 windows in a row → scale × 0.85, floor 0.4
  - 3 windows in a row at ≤ 17.5 ms and scale below the calibrated value →
    scale × 1.08
- **No frame skipping on any tier.** The software-renderer special case is
  removed; WARP is handled by calibration like everything else.

**Pausing:**
- Rendering stops when `#hero` leaves the viewport (IntersectionObserver),
  when the tab is hidden, or in LITE mode.
- The scene clock only advances while running, capped at 50 ms per frame, so
  rifts don't all expire at once on resume.

### 6.6 Public API (`window.Hero`)

```js
Hero.init({ canvas, contentEl, onFirstFrame }) // → false if unsupported
Hero.pause(); Hero.resume();
Hero.tearAt(clientX, clientY);   // click-to-tear
Hero.stats();                    // { tier, scale, fps, rifts, particles }
Hero.benchmark();                // per-pass ms at fixed sizes (for debug.html)
```

### 6.7 Accessibility

- **Reduced motion:** time runs at 0.25× as today, there's no cursor-steered
  camera, tears are slow fades with no spark bursts, and the seam doesn't
  flicker.
- **LITE mode:** unchanged. It pauses the hero and hides the canvas.
- Nothing flashes faster than 3 Hz, and no large area ever flashes.
- The canvas stays `aria-hidden`.

### 6.8 Fallbacks and errors

- **No WebGL, no half-float render targets, or a shader that fails to compile**
  (checked through r128's `checkShaderErrors` plus a manual compile check):
  `#hero` gets a `hero-fallback` class. That shows a pure-CSS black-hole
  silhouette (black disc, warm ring glow, faint band) instead of an empty
  black box.
- **Context loss:** pause on `webglcontextlost`. Rebuild the hero on
  `webglcontextrestored`.
- **Resize:** debounced. Resizes render targets and recomputes the
  text-avoidance box. Rift geometry is in lens-plane units, so it doesn't
  change.

### 6.9 Config

All magic numbers live in `js/hero/config.js`:
- colours
- life-cycle timings
- rift widths and counts
- bloom threshold, knee and intensity
- the tier table
- ignition duration

This keeps look tuning to one file.

## 7. Integration changes outside `js/hero/`

- **`index.html`:**
  - remove the inline hidden style on `#site-wrapper`
  - add the hero script injection (ordered, cache-busted)
  - keep the loader markup
  - keep three.js and GSAP
- **`css/styles.css`:**
  - `#site-wrapper` fade-in keyframes
  - `#loader { display: none; }`, with a note pointing to `LOADER_ENABLED`
  - `#hero-canvas` opacity transition and a `.is-ready` state
  - `.hero-fallback` silhouette
- **`js/main.js`:**
  - adapter calls into `Hero`
  - `lowPerf.toggle` uses `Hero.pause()` / `Hero.resume()`
  - `waitForLibraries` also waits for `window.Hero`
  - `boot()` skips the loader and plays the hero text immediately
- **`debug.html`:** replace the `HERO_FRAG` regex extraction and old-tier
  benchmark with `Hero.benchmark()`. Keep the environment, CDN, WebGL and
  precision checks.

## 8. Timeline of a first visit (GPU)

| t (from `boot()`) | Event |
|---|---|
| 0 ms | Site already fading in (CSS). Hero text scramble starts. |
| ~50–150 ms | Hero init: context, lookup table, nebula bake, shader compile, calibration. |
| ~150–300 ms | First frame. Canvas fades in, ignition begins. |
| ~1.9 s | Ignition done. |
| ~2.7 s | First rift tears open. Rifts then cycle automatically. |

## 9. Verification

**Headless Chrome harness** (local dev tool driven over CDP, not shipped),
in three modes: `gpu`, `disablegpu` (WARP), `swiftshader`. It records:
- time to first hero frame
- `Hero.benchmark()` per-pass ms
- presented fps over 3 s
- the scale and tier chosen
- screenshots at a fixed `?hero-seed&hero-time`

Other checks:
- **Lookup-table self-test** (`?hero-debug`): compare table lookups against
  direct RK4 integration for 200 random rays. Crossing radius error < 0.5%
  and escape-angle error < 0.01 rad.
- **Visual QA** in the in-app browser at desktop and mobile sizes: rifts
  tear, open and heal; glass refraction and fringes; seam glimpse; sparks,
  motes and falling shards; ignition intro; click-to-tear; text legibility.

**Success criteria:**
1. WARP at 1280×720: every frame rendered, render scale ≥ 0.6, presented fps
   ≥ 45. Today: 0.3 scale, ~20 fps.
2. Mid/high GPU: 60 fps at scale ≥ 1.0.
3. Hero text animating ≤ 300 ms after `boot()`. Canvas visible ≤ 1 s after
   `boot()` on GPU.
4. With `#hero` out of view, no hero passes are drawn.
5. No console or WebGL errors in any mode. `debug.html` passes on GPU and
   warns (but works) on WARP.

## 10. Out of scope

- React / R3F migration (later)
- Loader redesign (later; the code is kept)
- three.js upgrade
- Sections below the hero
- Changes to the `Date.now()` cache-busting scheme
- Photon-ring flare and spacetime ripple effects (declined)
- Directions B and C
