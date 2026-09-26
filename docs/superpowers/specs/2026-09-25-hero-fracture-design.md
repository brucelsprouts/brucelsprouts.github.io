# Hero "Fracture" — Design Spec

**Date:** 2026-09-25
**Branch:** `hero-fracture`
**Status:** Approved in brainstorming. Revised twice after building (user
feedback):
1. The rifts became sharp shattered-glass fractures instead of glowing tears.
2. The fractures became **running cracks** (from the screen edge, or along the
   black hole's rim) that break off large shards, with a light-and-colour
   layer: chromatic aberration along the cracks, reflections and sparkles
   (§4.2–§4.7).

## 1. Goal

Replace the hero's black hole with a more imaginative scene: a gravitationally
lensed black hole that repeatedly **shatters like glass**. A crack runs across
a sheet of glass hung through the hole's own space — tilted, seen through its
gravity — in from the edge of the screen or along the hole's bright rim, and
large shards break off along it. Every shard
reflects the black hole at its own tilt, so the image of the hole breaks
apart; light catches the shards and splits into colour along the cracks. Then
it heals: shards spiral into the hole or settle back flush. While doing this, make the hero
cheaper to render, and make the page appear immediately instead of behind the
fixed-length ASCII loader.

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
| Direction | **A: Fracture** (glass cracks), not B (Shattered Lens) or C (Wormhole Portals). After the first build the cracks were redrawn as sharp breaks in glass that shatter the hole's reflection, rather than glowing tears. After the second, the impact webs ("a bullet hole") became running cracks with large shards: a mix of edge runs and rim runs, chosen from three mock-ups (edge run, rim break, scattered shards). |
| Look | Imagined rather than a cracked screen: chromatic aberration along every crack, cracks drawn as light, shards that reflect a moving light with a thin-film sheen, sparkles. |
| Extras | **Click or tap to shatter: yes.** Photon-ring flare and spacetime ripple when debris falls in: **no.** |
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

### 4.2 Fracture anatomy

A fracture ("rift" in the code) is a **running crack** in a sheet of glass
that hangs through the black hole, tilted to the view and seen through its
gravity (§4.5). There is no impact point: the crack runs.

Two kinds, chosen per fracture (45% rim runs):
- **Edge run:** comes in from a screen edge (left, right or bottom), runs across
  the disk and curves around the copy, usually under it, then runs out the far
  side or dies out.
- **Rim run:** follows the black hole's rim, just outside the photon ring
  (1.02–1.1 × R_sh), below or above the copy, for 80–130° of arc. Both ends die
  out in whole glass.

Anatomy:
- **Main crack:** straight runs of 0.5–1.2 world units of glass with small
  kinks (±12°) and the occasional sharp turn (22–40°). Drawn a little bolder
  than the rest. All crack lengths are measured on the sheet, so they come out
  larger on its near side, smaller and denser on its far side, and squeezed
  where the hole bends the glass.
- **Branches:** from about 80% of the kinks, at 30–65°. Edge-run branches
  mostly alternate sides; rim-run branches point outward. 1.5–3.4 lens units
  long, ending at a free tip or at another crack.
- **Rungs:** one or two per branch, running back toward the crack the branch
  left. They close shards off.
- **Chips:** short cracks at some kinks that cut small shards, for detail.
- Cracks stop where they meet another crack (T-junctions); they never cross.

**Shards** are the pieces of glass fully enclosed by cracks:
- Each shows the scene behind it through its own shift (0.14–0.36 lens units,
  plus 0.35 per radian of tilt along the tilt), turn (4–13°, less for big
  pieces) and scale, squashed or stretched along its tilt like a surface seen
  at an angle, so the disk's streaks and the ring break into offset pieces.
- Each is tilted 0.3–0.75 rad (17–43°) and, once it snaps out, stands
  0.1–0.45 world units proud of its sheet and really leans (half its tilt):
  the side it tilts toward comes up out of the glass. So pieces turn in
  perspective against each other, and away from their cracks, as the view
  moves.
- Pieces still joined to whole glass stay put. A crack between two of them is
  just a line, like a crack that hasn't opened.
- Slivers smaller than 0.03 lens units² (about 15 px across) stay put too;
  moving, they only read as noise.

### 4.3 Light and colour

What makes it look imagined rather than a cracked screen:
- **Chromatic aberration along every crack:** a band about 8–12 px wide each
  side where the scene splits into R, G and B, so the ring and the disk
  streaks pick up rainbow fringes where cracks cross them. On moving shards it
  is strongest along their edges and grows as the crack opens; unmoved glass
  gets a thinner band.
- **Cracks drawn as light:** a white-hot core with red and blue edges, and a
  prismatic spark riding the front while it runs. The glow around each crack
  is split like light through a prism, red to one side and blue to the
  other, so the colour shows even over the black shadow. White and spectral,
  not the violet glow of the first build.
- **Reflections:** each shard is a tilted, curved plate. A slowly turning
  light (it also follows the cursor) makes a tight glint on the shards that
  face it, with a thin-film rainbow sheen. Shards tilt differently, so they
  catch the light at different moments; ones leaning toward the light are
  brighter, ones leaning away darker.
- **With the viewing angle:** the glint is worked out from where the camera is
  now, and the film's colour and the streaks shift with it. As the cursor
  swings the camera, glints hop from shard to shard, the streaks sweep across
  the glass, and each shard's picture slides by an amount that grows with the
  square of its tilt, the way steep glass bends the view more.
- **Light streaks:** parallel diagonal lines of reflected light, a broad one
  and a thin one beside it, sweep slowly across the shards (2.2 lens units
  apart, about one pass every 5 s). Each shard's tilt shifts its own streaks,
  so they break at every crack, the way light catches broken glass in anime.
- **Edges:** edges facing the light glint; the others darken, so the pieces
  read as thick glass.
- **Sparkles:** four-point star glints with small rainbow halos at crack
  junctions and branch points, twinkling while the fracture is open.
- **Disk flare:** where the main crack crosses the near side of the accretion
  disk, that spot flares as the front passes. The flare is added in the lens
  pass, so it is lensed correctly.
- **Depth:** a crack is as wide as the glass is near (a hairline on the far
  side of a sheet, bolder where it comes toward you). Glass behind the near
  side of the disk shows through the gas, 55% dimmer. Light from glass deep in
  the hole's well climbs out dimmer and redder (gravitational redshift: a
  crack at r = 2 is about 30% dimmer and warm-tinted).

Particles:
- **Sparks:** glitter thrown off the running front and from branch points.
- **Glints:** the sparkles above.
- **Splinters:** a few small glass triangles thrown clear of the sharpest
  kinks.
- **Debris:** dust shed by everything falling in, following it down.

### 4.4 Fracture life cycle

| Phase | Duration | What happens |
|---|---|---|
| Run | 0.2–0.32 s | Very fast, but seen to run rather than appear: the front gets up to speed over the first 20% of the run, then races, crossing the screen in about a quarter of a second. It keeps its pace in the glass, so on screen it slows as it runs away into a sheet's far side. Its light trails it as a short streak (as far as it runs in 25 ms), with sparkles that fade about 1 lens unit behind it. Branches start 5–20 ms after it passes their roots and run at 0.85–1.0× its top speed; rungs follow. Each shard snaps to its tilt (ease-out-back) the moment its last crack closes it off. |
| Open | 3.5–5 s | Light sweeps over the shards and glints along the cracks; sparkles twinkle at junctions. |
| Heal | 1.8–2.6 s | A front runs along the crack from its start to its end. Cracks fade behind it. About half the small and medium shards break free and spiral into the hole in the plane of their sheet: they stay glass (refracting whatever is behind them), speed up, redden and fade at the shadow edge. Large shards and the rest settle back flush. |

Automatic fractures:
- At most **2** at once (1 on the lowest tier).
- The next one comes 2.6–4.6 s after the previous one.
- The first one starts ~0.8 s after the ignition intro finishes.

### 4.5 Placement

Fracture paths are planned in the **lens plane** as the camera sees it when
the fracture spawns, with the cursor centred: the plane through the hole that
faces the camera, in world units. On this plane the shadow radius is
R_sh ≈ b_c ≈ 2.6.

**The glass hangs in the black hole's space.** Each fracture is a flat sheet
through the hole's centre, fixed in the scene and tilted 28–52° so one side —
any way across the screen — runs back behind the hole. The tilt is capped so
the sheet's far edge is never more than twice the hole's distance from the
camera (about 39° for sheets that run back sideways). Each planned point is
lifted onto the sheet along the photon orbit through it, so at that moment
the fracture is drawn exactly as planned. From then on every point of the
glass is seen through the hole's gravity from wherever the camera is, using
the inverted geodesic table (§6.2):
- glass near the hole bends round the shadow the way the disk does;
- glass behind the hole, inside the shadow, can't be seen at all, so cracks
  steer round that part of the shadow, and a shard reaching into it stays put;
- as the slow orbit and the cursor move the camera, each sheet turns in
  perspective like the disk: its near side sweeps one way, its far side the
  other, and fractures on different sheets move differently. With the cursor
  hard over, a sheet's two ends move 100–250 px apart, and cracks along the
  ring slide round it.
Roll, pull-in and breathing carry the glass with them. Falling shards and
debris spiral into the hole in the plane of their sheet.

- **The pane** is the screen's lens-plane rectangle plus a margin. Cracks split
  it into pieces; a crack that dies out continues invisibly to the pane's edge
  (or the next crack), so every crack still divides the glass. A crack that
  runs off the pane is drawn 4 lens units past its edge, so a camera swung
  round never sees one stop short.

- **Edge runs** steer through waypoints around the keep-out zones. **Rim runs**
  follow the ring's arc. Both steer around keep-outs and end where they can't.
- **Text avoidance:** the `.hero-content` box (inflated 6%) and the nav band
  are keep-out zones, measured from layout boxes so the copy's intro slide
  doesn't move them. Cracks are planned clear of them, and a shard centred
  inside one stays put. The copy's box is widened further for glass that will
  slide most (by how far it moves on screen as the camera swings 0.2 rad round
  the hole), and glass the camera does swing over the copy or up under the nav
  fades there to 15%.
- **Different areas:** up to 8 candidate paths are planned. The first that
  stays clear of open fractures and has enough of itself on screen is used;
  otherwise the best-scoring one.
- **Disk flares:** points where the main crack crosses the near-side disk are
  found on screen each frame (their point of the sheet, seen through the
  hole's gravity) and intersected with the disk plane along a straight ray, so
  each flare stays pinned under the crack while the camera moves.

### 4.6 Click or tap to shatter

- A primary click or tap inside `#hero` that does not land on a link, button
  or input starts a crack running both ways from that point (the click is
  traced onto the new fracture's sheet from where the camera is, then planned
  from the view with the cursor centred, so it starts right under the
  cursor), roughly around the hole, 2.5–4.5 units of glass each way, with
  branches, rungs and shards. It heals outward from the click.
- The click wins: its cracks only avoid the copy if the click was outside it.
- Only one user fracture can be active at a time, with a 0.8 s cooldown.
- If the limit is reached, the oldest automatic fracture starts healing early.

### 4.7 Palette

- The site stays monochrome.
- Inside the hero: **warm matter, cold glass.** The disk is gold-white fading
  to amber, with the Doppler colour shift. The glass is cold white light that
  splits into spectral colour at its edges; the shards carry the disk's own
  colours, with a faint iridescent sheen.
- Every colour lives in one config object (§6.9).

## 5. Page load-in

1. The `#site-wrapper` inline `opacity:0; visibility:hidden` is removed. CSS
   fades it in over 0.6 s (`animation: … both`), so there's no JS dependency.
2. `#loader` gets `display: none`. `boot()` skips `loader.init()` when
   `LOADER_ENABLED` is false, and calls `heroAnimations.play()` straight away.
   If GSAP is missing, `heroAnimations` falls back to setting opacity to 1.
3. `#hero-canvas` starts at opacity 0 and fades in over 0.8 s when the renderer
   reports its first real frame. There is never a black or half-compiled flash.
4. The ignition intro (§4.1) runs from that first frame, then the first
   fracture lands.

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
| `js/hero/geodesics.js` | Builds the lookup table on the CPU and its inverse for the glass, plus JS helpers: lens-plane ↔ screen, lens-plane → disk intersection, b_c, and the glass sheets (frame, lift onto a sheet, where a point of space is seen). |
| `js/hero/shaders.js` | GLSL for: nebula bake, lens pass, blit, glass shards, crack lines, splinters, particles, bloom (prefilter / down / up), composite. |
| `js/hero/pane.js` | The glass as a planar partition: crack runs that split the piece they cross, T-junctions, free tips with invisible extensions, convex pieces for drawing. No THREE, no config. |
| `js/hero/rifts.js` | Seeded crack paths (edge and rim runs), each fracture's sheet of glass, branches and rungs, text avoidance, life-cycle scheduling, shard and crack geometry lifted onto the sheet, scheduling of splinters and particles. |
| `js/hero/particles.js` | Instanced particle buffer and instanced splinter buffer (write APIs). |
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

**Inverted, for the glass.** A point of space at radius r, an angle ψ round the
hole from the camera, is reached by the orbit with u(b, ψ) = 1/r, and u falls
steadily as b grows. So each table column is inverted once at startup into a
512 × 256 RGBA16F texture over (ψ, ln r), r = 1…48, holding the bend on top of
the straight-line impact parameter (small numbers, so half floats keep their
precision). The overlay's vertex shaders read it once per point: world point
→ b → lens-plane radius D·b/√(D² − b²) along the point's direction round the
axis. Build: about 15–20 ms. Lifting a planned point onto a sheet is the lens
pass's disk lookup with the sheet in place of the disk: φ₀ from the sheet's
normal, r = 1/u(b, φ₀). The self-test (debug.html) checks the inverted table
against orbits shot directly at random points (limit 0.02 lens units) and a
lift there and back (limit 0.01).

### 6.3 Frame pipeline

| # | Pass | Resolution | Output |
|---|---|---|---|
| 0 | Nebula bake (once) | 512×256 | `nebulaTex` (RGBA8) |
| 1 | Lens pass: disk (≤3 crossings, anchor flares, ignition), stars, nebula, photon ring | render scale s | `sceneRT` (RGBA16F) |
| 2 | Overlay: blit `sceneRT`, then glass shards (only pieces enclosed by cracks; each samples `sceneRT` through its own tilt, with chromatic edges and reflections) → crack lines (light cores; chromatic bands on the unmoved side) → splinters → particles (additive). | s | `compositeRT` (RGBA16F) |
| 3 | Bloom: prefilter (13-tap, Karis average, soft threshold), downsample chain, tent upsample chain | ½ (¼ on the low tier), 4–6 mips | `bloomRT` |
| 4 | Composite: bloom, ACES-fitted tone map, sRGB encode, vignette, text scrim, grain, light radial chromatic aberration (off on the low tier) | s (canvas) | screen |

Overlay projection: every point of glass is taken to the lens plane through
the inverted table (§6.2), then an orthographic camera maps lens-plane (x, y)
to screen exactly as the lens pass maps rays: uv = (x, y) / (D·fov), then
y-shift and roll. Shards, cracks, particles and the lens pass therefore line up
at every aspect ratio, and the glass is lensed the way the disk is.

### 6.4 Stateless, scheduled animation

When a fracture spawns, **everything it will ever do is written once**:
- shard geometry (convex pieces fanned from their centres), each vertex
  carrying its shard's tilt and plate normal, when it snaps, when it falls and
  how
- crack geometry, each point carrying when the crack front reaches it
- splinter instances, with appear, detach and fall parameters
- spark, glint and debris particles, with *future* spawn times

After that, the vertex shaders compute each element's state from
`(uTime − spawnTime, seed, params)`. Per-frame CPU work is limited to uniforms.

This means the whole scene is a pure function of **seed + scene time**.
`?hero-seed=N&hero-time=T` reproduces a frame exactly: the scheduler
fast-forwards its seeded event list to T.

Implementation notes:
- Cracks are revealed per pixel: arrival time is linear along each segment,
  so the front is exact however fast it runs.
- The heal front is one function of time shared by the shaders and the
  scheduler, so falls, fades and settling stay in step. It runs along the
  main crack: every shard and crack point carries its position along it
  (0 at the start, 1 at the end).
- The timeline (durations, gap) never depends on the viewport, so the schedule
  is identical at every screen size; the main crack's speed is its length
  divided by the run time.
- Falling shards, splinters and debris share one closed-form spiral:
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

| Tier | Scale ceiling | Bloom | Max particles | Splinters / fracture | Fractures | Star layers | CA |
|---|---|---|---|---|---|---|---|
| low | 0.75 | ¼ res, 4 mips | 512 | 4 | 1 | 1 | off |
| mid | 1.0 | ½ res, 5 mips | 1536 | 8 | 2 | 2 | on |
| high | min(DPR, 2) | ½ res, 6 mips | 3072 | 12 | 2 | 2 | on |

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
  fractures don't all expire at once on resume.

### 6.6 Public API (`window.Hero`)

```js
Hero.init({ canvas, contentEl, onFirstFrame }) // → false if unsupported
Hero.pause(); Hero.resume();
Hero.tearAt(clientX, clientY);   // click to shatter
Hero.stats();                    // { tier, scale, fps, rifts, particles }
Hero.benchmark();                // per-pass ms at fixed sizes (for debug.html)
```

### 6.7 Accessibility

- **Reduced motion:** time runs at 0.25× as today, there's no cursor-steered
  camera, cracks fade in instead of running, shards ease slowly into their
  tilts and settle back instead of falling, and there are no sparks,
  splinters or riding sparks.
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
  text-avoidance box. Fracture geometry is in lens-plane units, so it
  doesn't change.

### 6.9 Config

All magic numbers live in `js/hero/config.js`:
- colours
- life-cycle timings
- crack paths, widths and counts; light and colour
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
| ~2.4 s | First fracture starts running. Fractures then cycle automatically. |

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
  and escape-angle error < 0.01 rad. The inverted table (the glass) against
  orbits shot at random points < 0.02 lens units, and a lift onto a sheet and
  back < 0.01.
- **Visual QA** at desktop and mobile sizes: edge and rim runs run, open and
  heal; large shards break the ring and disk; chromatic bands, reflections and
  sparkles; falling shards; ignition intro; click to shatter; text
  legibility.

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
- Scattered-shard fractures (mock-up C)
