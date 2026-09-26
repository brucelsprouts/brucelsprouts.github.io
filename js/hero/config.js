/* ============================================================
   hero/config.js — every tunable for the "Fracture" hero

   Look tuning happens here and only here. Units: world units are
   Schwarzschild radii (r_s = 1). Lens-plane units are world units on
   the plane through the hole that faces the camera; the shadow's
   edge sits at about 2.65 there. Colours are linear RGB; values
   above 1 are HDR and bloom.

   Loaded first of the js/hero/ scripts; nothing here touches THREE.
============================================================ */
(function () {
  'use strict';
  const Hero = window.Hero = window.Hero || {};

  Hero.config = {
    /* Framing matches the previous hero so the copy still sits on the shadow */
    camera: {
      fov: 0.62,
      narrowFovK: 1.15, narrowFovMax: 1.9,  // fov ×= clamp(k / aspect, 1, max) on narrow screens
      yShift: 0.02,                          // screen heights: centres the shadow behind the copy
      elevation: 0.10, elevSway: 0.022, elevSwayRate: 0.11,
      azimuthRate: 0.032,
      breathe: 0.015, breatheRate: 0.07,     // slow dolly, applied as FOV scale
      mouseAzimuth: 0.30, mouseElevation: 0.09, mouseRoll: 0.06, mousePull: 0.05,
      easeFast: 0.04, easeSlow: 0.012,       // per 60 fps frame: tilt, then roll + pull-in
    },

    time: {
      calmRate: 0.25,                        // prefers-reduced-motion runs the scene at ¼ speed
      maxStep: 0.05,                         // clock advances at most 50 ms per frame
    },

    disk: {
      rIn: 2.7, rOut: 8.2,
      emission: 3.2,
      opacity: 0.55,
      innerGlow: 2.4, innerGlowWidth: 0.42,  // the hot inner edge that blooms
      laneContrast: 2.2,                     // > 1 deepens the dark lanes between filaments
      filaments: 0.24,
      beamGain: 1.0,                         // intensity ∝ gain · (Doppler · redshift)³
      beamMin: 0.05, beamMax: 4.0,
      overShadow: 0.0,                       // near-side gas across the shadow; 0 keeps it clean behind the name
      // Infalling embers: pinpoints that spiral in from the rim, dark between falls
      embers: { count: 3, rate: [0.022, 0.009], duty: 0.62, intensity: 2.6, along: 120, across: 400 },
    },

    ignition: {
      duration: 1.6,                         // front sweeps R_IN → R_OUT after the first frame
      crest: 1.8,
    },

    ring: { width: 0.032, intensity: 1.3, doppler: 0.45 },

    sky: { stars: 1.0, nebula: 0.35 },

    post: {
      exposure: 0.5,
      bloomThreshold: 0.9, bloomKnee: 0.6, bloomStrength: 0.6, bloomRadius: 1.0,
      vignette: 0.34,
      scrim: 0.38,
      grain: 0.012,
      aberration: 0.006,
    },

    colors: {
      // warm matter
      diskHot:  [1.00, 0.86, 0.66],
      diskMid:  [1.00, 0.60, 0.24],
      diskCool: [0.70, 0.24, 0.07],
      diskBlue: [0.80, 0.88, 1.06],
      ring:     [1.00, 0.95, 0.86],
      nebulaCool: [0.55, 0.65, 1.00],
      nebulaWarm: [1.00, 0.75, 0.55],
      // cold glass
      riftCore:   [1.00, 0.98, 0.95],
      riftCyan:   [0.40, 0.95, 1.00],
      spark:  [3.2, 2.9, 2.4],
      mote:   [2.0, 2.2, 2.6],
      debris: [1.5, 0.52, 0.22],
      ember:  [1.00, 0.45, 0.22],
    },

    /* Rifts are running cracks in a sheet of glass hung through the black
       hole, tilted to the view and seen through its gravity: in from the
       screen edge, or along the rim. Branches split off, rungs run back and
       close shards in; each shard reflects the hole at its own tilt */
    rifts: {
      firstDelay: 0.8,                       // after the ignition finishes
      gap: [2.6, 4.6],
      crack: [0.2, 0.32],                    // s for the front to run the main crack's length: very fast, but seen to run
      crackAccel: 0.2,                       // of that, the part spent getting up to speed (then it races)
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
      branchChance: 0.8, branchAngle: [30, 65], branchLength: [1.5, 3.4], branchSegment: [0.35, 0.9],
      branchKink: 12, alternate: 0.7, branchSpeed: [0.85, 1.0], branchDelay: [0.005, 0.02], branchBridge: 0.8,
      rungTwice: 0.6, rungAngle: [80, 125], rungLength: [0.5, 1.4], rungBridge: 3.5,
      chipChance: 0.4, chipAngle: [40, 80], chipLength: [0.25, 0.6],
      // the glass: shards closed in by cracks move; the rest stays put
      offset: [0.14, 0.36], offsetJitter: [0.04, 0.15], bigOffset: 0.2, bigOffsetGain: 1.8,
      rotation: [0.07, 0.22], scale: [-0.03, 0.06],
      minShard: 0.03,                        // lens units²: slivers smaller than this stay put
      settle: 0.28,                          // s for a shard to snap to its tilt
      brightness: 0.35,
      fallChance: 0.5, fallMaxArea: 1.2, fall: [1.3, 2.1], fallSpin: [0.6, 2.2],
      // light and colour (CSS px)
      bandWidth: 9, bandShift: 5, bandSplit: 1.0,   // the split-colour band along each crack
      stillBand: 0.55,                       // the band where the glass stays put, relative
      edgeGlint: 0.9, edgeShadow: 0.35,
      tilt: [0.3, 0.75], curvature: [0.2, 0.45],    // each shard is a tilted, gently curved plate (radians)
      lightOffset: 0.6, shine: 150, reflection: 0.6, film: 1.6, iridescence: 0.45,
      // streaks of reflected light sweeping across the glass (lens units)
      streakAngle: -30,                      // degrees: the way they sweep; the lines run across it
      streakShift: 1.2,                      // how far a shard's tilt moves its streaks
      streakPeriod: 2.2, streakRate: 0.18,   // between streaks; passes per second
      streakWidth: 0.07, streakGain: 1.1, streakThin: 0.6, streakGap: 0.16,
      // with the viewing angle, as the cursor swings the camera: how far a shard's
      // picture slides (lens units per radian of view, scaled by its tilt²),
      // how far the streaks sweep (lens units per radian), how the film's colour
      // turns; and how much a tilted shard's picture is squashed along its tilt
      viewShift: 0.8, viewStreak: 4.0, viewFilm: 0.8, squash: 1.0,
      tiltShift: 0.35,                       // a shard's picture also shifts along its tilt (lens units per radian)
      tiltShade: 0.5,                        // and brightens leaning toward the light, darkens leaning away
      lean: 0.5,                             // and really leans out of the sheet (× its tilt), turning against its neighbours
      mainWidth: 2.2, branchWidth: 1.2, rungWidth: 0.75, chipWidth: 0.6, tipTaper: 0.5,
      lineGain: 1.3, glowGain: 0.22, tipGain: 6.0,
      tipTrail: 0.025,                       // s: the front's light trails it as far as it runs in this time
      glint: 5.0, glintPower: 40, fringe: 1.4, occlude: 0.3,
      lightAngle: 2.2, lightRate: 0.16, lightMouse: 0.8,
      // placement
      avoidInflate: 0.06, candidates: 8,
      crowdDistance: 1.2, crowdMax: 0.15, minOnscreen: 0.6,
      userCooldown: 0.8, userLength: [2.5, 4.5], userJitter: 25,
      // the glass hangs in the scene: each fracture is a flat sheet through the
      // hole's centre, tilted (degrees; capped where its far edge would pass
      // twice the hole's distance) so one side, any way across the screen, runs
      // back behind the hole. Shards stand proud of it as they snap out
      // (world units).
      sheetTilt: [28, 52],
      slide: 0.2,                            // radians of camera swing the copy's berth allows for (the rest fades over it)
      pop: [0.1, 0.45],
      diskCover: 0.55,                       // glass behind the near side of the disk shows through the gas this much dimmer
      redshift: 0.5,                         // how much light from glass deep in the hole's well dims and reddens
      widthDepth: 1.0,                       // crack width ∝ how much nearer than the hole it is, to this power
      subdivide: [0.14, 0.05],               // runs are cut into pieces this long at the shadow's edge, + per lens unit out
      paneOverrun: 4,                        // cracks off the pane's edge carry on this far (lens units)
      flare: 3.0, flareRadius: 0.45, anchors: 2, anchorSpacing: 2.0,
    },

    shards: {
      size: [0.04, 0.11],
      fall: [1.2, 2.2],
      spin: [0.2, 0.9],
      drift: [0.12, 0.35],
      orbit: [0.8, 1.6],
      edge: 1.4,
      dispersion: 0.6,
      opacity: 0.9,
    },

    particles: {
      sparkSize: [0.008, 0.018], sparkSpeed: [0.6, 2.4], sparkLife: [0.2, 0.5], sparkDrag: [1.5, 3.5],
      sparkGravity: 28,
      moteSize: [0.05, 0.09], moteLife: [0.4, 0.9],           // junction glints: four-point stars
      starSize: [0.08, 0.13], starLife: 0.2, starStep: 0.3,   // the star riding the running front
      starTrail: 1.0,                                         // lens units: how far behind the front its stars last
      debrisSize: [0.010, 0.022],
      split: { sparks: 0.18, motes: 0.06, debris: 0.3 },     // of the budget left after the front's stars
    },

    /* Scale is the ceiling for dynamic resolution (×CSS px); high uses min(DPR, 2) */
    tiers: {
      low:  { scaleMax: 0.75, bloomDiv: 4, bloomMips: 4, particles: 512,  shards: 4,  rifts: 1, starLayers: 1, crossings: 2, aberration: false },
      mid:  { scaleMax: 1.0,  bloomDiv: 2, bloomMips: 5, particles: 1536, shards: 8,  rifts: 2, starLayers: 2, crossings: 3, aberration: true },
      high: { scaleMax: 2.0,  bloomDiv: 2, bloomMips: 6, particles: 3072, shards: 12, rifts: 2, starLayers: 2, crossings: 3, aberration: true },
    },

    quality: {
      calibW: 512, calibH: 288, calibRuns: 6,
      lensBudgetMs: 10,
      scaleFloor: 0.4,
      windowMs: 1000,
      slowMs: 20, slowWindows: 2, down: 0.85,
      fastMs: 17.5, fastWindows: 3, up: 1.08,
      ignoreMs: 100,
    },
  };
})();
