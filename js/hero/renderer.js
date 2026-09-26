/* ============================================================
   hero/renderer.js — passes, quality, clock, input, public API

   Frame: lens pass → overlay (blit, glass shards, cracks, splinters, particles)
   → bloom → composite onto the canvas. The render scale is picked at
   startup by timing the lens pass (which works on every driver,
   WARP included) and then nudged by a slow dynamic-resolution loop.
   No frame is ever skipped.

   Public API (window.Hero):
     init({ canvas, contentEl, onFirstFrame, onFallback, avoidEls }) → false if unsupported
       contentEl — the hero copy: cracks stop short of it, the scrim sits behind it
       avoidEls  — anything else cracks should stay clear of (the nav bar)
     pause() / resume()        — LITE mode
     tearAt(clientX, clientY)  — click to shatter the glass there
     stats()                   — { tier, scale, fps, rifts, particles, … }
     benchmark()               — per-pass ms at 1280×720 (debug.html)

   Dev URL flags: ?hero-seed=N ?hero-time=T ?hero-freeze ?hero-debug
============================================================ */
(function () {
  'use strict';
  const Hero = window.Hero = window.Hero || {};

  const MAX_SLOTS  = 4;          // shader array size: 2 rifts + 2 still healing
  const MAX_FLARES = 6;          // where main cracks cross the near side of the disk
  const MAX_SPOTS  = 9;          // disk point lights: 3 embers + the flares

  const params = new URLSearchParams(window.location.search);
  const QP = {
    seed:   params.has('hero-seed') ? (parseInt(params.get('hero-seed'), 10) >>> 0) : null,
    time:   params.has('hero-time') ? Math.max(0, parseFloat(params.get('hero-time')) || 0) : 0,
    freeze: params.has('hero-freeze'),
    debug:  params.has('hero-debug'),
  };

  const S = {
    inited: false, ok: false, ready: false, running: false,
    reasons: { external: false, offscreen: false, hidden: false, lost: false },
    mat: {}, rt: {}, tex: {},
    mouse: { x: 0, y: 0 }, mouse2: { x: 0, y: 0 }, target: { x: 0, y: 0 },
    time: 0, frames: 0, lastNow: 0, raf: 0,
    dr: { acc: 0, n: 0, start: 0, slow: 0, fast: 0, fps: 0 },
    cam: {},                     // the live camera
    webs: [],                    // per slot: { cells, cracks } meshes
  };
  let U = null;                  // shared uniforms

  const later = (fn) => setTimeout(fn, 0);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const fstr  = (x) => { const s = String(+x); return /[.eE]/.test(s) ? s : s + '.0'; };
  const vec3  = (a) => new THREE.Vector3(a[0], a[1], a[2]);

  function makeRT(w, h, type, wrapS) {
    return new THREE.WebGLRenderTarget(Math.max(1, w | 0), Math.max(1, h | 0), {
      type: type || THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: wrapS || THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: false,
    });
  }

  function shaderMat(vert, frag, uniforms, defines, extra) {
    return new THREE.ShaderMaterial(Object.assign({
      glslVersion: THREE.GLSL3,
      vertexShader: vert,
      fragmentShader: frag,
      uniforms,
      defines: defines || {},
      depthTest: false,
      depthWrite: false,
    }, extra || {}));
  }

  const premultiplied = { transparent: true, side: THREE.DoubleSide, blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor };
  const additive = { transparent: true, side: THREE.DoubleSide, blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor };

  function drawFS(material, target) {
    S.fsMesh.material = material;
    S.renderer.setRenderTarget(target);
    S.renderer.render(S.fsScene, S.cam3);
  }

  // Did three compile and link this material? (r128 keeps the program on
  // the material's properties as currentProgram once it has been used)
  function programOk(material) {
    const p = S.renderer.properties.get(material).currentProgram;
    if (!p) return false;
    if (p.diagnostics && p.diagnostics.runnable === false) return false;
    return S.gl.getProgramParameter(p.program, S.gl.LINK_STATUS) === true;
  }

  /* Block until the GPU has finished everything queued so far: copy one
     texel of the last target into a 1×1 RGBA8 target and read it back.
     Sampling the target makes the copy wait on it; readPixels waits on
     the copy. This is what makes the timings measure real GPU work. */
  const syncPx = new Uint8Array(4);
  function gpuSync(lastTarget) {
    S.mat.sync.uniforms.uSrc.value = lastTarget.texture;
    drawFS(S.mat.sync, S.rt.sync);
    S.renderer.readRenderTargetPixels(S.rt.sync, 0, 0, 1, 1, syncPx);
  }

  /* ============================================================
     LENS PROGRAM — driven directly, outside three
     It is the one big shader. Compiled through three, it would block the
     main thread for ~200 ms (D3D, cold cache) while the hero copy animates
     in, because three asks for the link result straight away. Compiled
     here it links in the background (KHR_parallel_shader_compile) and the
     first frame simply waits for it. Its uniforms are the same shared
     objects the three materials use.
  ============================================================ */
  const LENS_VERT = `#version 300 es
precision highp float;
void main() {
  // fullscreen triangle from the vertex index: (-1,-1), (3,-1), (-1,3)
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

  function startLensProgram() {
    const gl = S.gl;
    S.parallel = gl.getExtension('KHR_parallel_shader_compile');
    const defs = lensDefines();
    const head = '#version 300 es\nprecision highp float;\nprecision highp int;\nprecision highp sampler2D;\n'
      + Object.keys(defs).map((k) => '#define ' + k + ' ' + defs[k]).join('\n') + '\n';
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vs, LENS_VERT);
    gl.compileShader(vs);
    gl.shaderSource(fs, head + Hero.shaders.LENS_FRAG);
    gl.compileShader(fs);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    S.lens = { prog, vs, fs, vao: gl.createVertexArray(), setters: [], units: [], ready: false };
  }

  // A setup step: 'wait' until the background link finishes, then check it
  function awaitLens() {
    const gl = S.gl, L = S.lens;
    if (S.parallel && !gl.getProgramParameter(L.prog, S.parallel.COMPLETION_STATUS_KHR)) return 'wait';
    if (!gl.getProgramParameter(L.prog, gl.LINK_STATUS)) {
      console.warn('[hero] lens shader failed to compile:', gl.getShaderInfoLog(L.fs) || gl.getProgramInfoLog(L.prog));
      return false;
    }
    gl.useProgram(L.prog);
    const n = gl.getProgramParameter(L.prog, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(L.prog, i);
      const u = U[info.name.replace(/\[0\]$/, '')];
      const loc = gl.getUniformLocation(L.prog, info.name);
      if (!u || !loc) continue;
      const size = info.size;
      switch (info.type) {
        case gl.FLOAT:      L.setters.push(() => gl.uniform1f(loc, u.value)); break;
        case gl.INT:        L.setters.push(() => gl.uniform1i(loc, u.value)); break;
        case gl.FLOAT_VEC2: L.setters.push(() => gl.uniform2f(loc, u.value.x, u.value.y)); break;
        case gl.FLOAT_VEC3: L.setters.push(() => gl.uniform3f(loc, u.value.x, u.value.y, u.value.z)); break;
        case gl.FLOAT_VEC4:
          if (size > 1) {
            const buf = new Float32Array(size * 4);
            L.setters.push(() => { for (let k = 0; k < size; k++) u.value[k].toArray(buf, k * 4); gl.uniform4fv(loc, buf); });
          } else {
            L.setters.push(() => gl.uniform4f(loc, u.value.x, u.value.y, u.value.z, u.value.w));
          }
          break;
        case gl.SAMPLER_2D:
          gl.uniform1i(loc, L.units.length);
          L.units.push(u);
          break;
      }
    }
    S.renderer.resetState();                          // three's state cache no longer matches GL
    L.ready = true;
    return true;
  }

  function drawLens(target) {
    const gl = S.gl, L = S.lens, props = S.renderer.properties;
    S.renderer.setRenderTarget(target);                // three binds the framebuffer and viewport
    gl.useProgram(L.prog);
    gl.bindVertexArray(L.vao);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.SCISSOR_TEST);
    for (let i = 0; i < L.setters.length; i++) L.setters[i]();
    for (let i = 0; i < L.units.length; i++) {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, props.get(L.units[i].value).__webglTexture);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
    S.renderer.resetState();
  }

  function dropLensProgram() {
    const gl = S.gl, L = S.lens;
    if (!L || !gl) return;
    gl.deleteProgram(L.prog);
    gl.deleteShader(L.vs);
    gl.deleteShader(L.fs);
    gl.deleteVertexArray(L.vao);
    S.lens = null;
  }

  /* ============================================================
     SETUP — spread over several tasks so the page keeps animating
  ============================================================ */
  function createCore() {
    // Ask for WebGL 2 ourselves: when it's missing, three would log an error
    // on its way to failing, and this device just gets the CSS silhouette
    const attrs = { alpha: false, depth: false, stencil: false, antialias: false,
      premultipliedAlpha: true, preserveDrawingBuffer: false };
    let gl = null, renderer;
    try { gl = S.canvas.getContext('webgl2', attrs); } catch (err) { gl = null; }
    if (!gl) return false;
    try {
      renderer = new THREE.WebGLRenderer(Object.assign({ canvas: S.canvas, context: gl }, attrs));
    } catch (err) {
      return false;
    }
    S.renderer = renderer;
    S.gl = gl;
    const ext = renderer.extensions;
    const floatTargets = ext.has('EXT_color_buffer_float') || ext.has('EXT_color_buffer_half_float');
    if (!renderer.capabilities.isWebGL2 || !floatTargets) { dropRenderer(); return false; }
    renderer.autoClear = false;
    renderer.debug.checkShaderErrors = true;

    // Half-float targets must actually be renderable here
    const probe = makeRT(4, 4);
    renderer.setRenderTarget(probe);
    const status = S.gl.checkFramebufferStatus(S.gl.FRAMEBUFFER);
    renderer.setRenderTarget(null);
    probe.dispose();
    if (status !== S.gl.FRAMEBUFFER_COMPLETE) { dropRenderer(); return false; }
    return true;
  }

  function dropRenderer() {
    if (!S.renderer) return;
    try { S.renderer.dispose(); S.renderer.forceContextLoss(); } catch (e) { /* already gone */ }
    S.renderer = null;
  }

  function createStatic() {
    const cfg = Hero.config, geo = Hero.geo;

    // Noise: R random, G = R shifted by (37, 17) for the one-fetch 3D trick
    const rng = Hero.rifts.mulberry32(1337);
    const N = 256, R = new Uint8Array(N * N), data = new Uint8Array(N * N * 4);
    for (let i = 0; i < N * N; i++) R[i] = (rng() * 256) | 0;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const i = y * N + x;
        data[i * 4] = R[i];
        data[i * 4 + 1] = R[((y - 17 + N) % N) * N + ((x - 37 + N) % N)];
        data[i * 4 + 2] = (rng() * 256) | 0;
        data[i * 4 + 3] = (rng() * 256) | 0;
      }
    }
    const noise = new THREE.DataTexture(data, N, N, THREE.RGBAFormat, THREE.UnsignedByteType);
    noise.wrapS = noise.wrapT = THREE.RepeatWrapping;
    noise.minFilter = noise.magFilter = THREE.LinearFilter;
    noise.needsUpdate = true;
    S.tex.noise = noise;

    // Geodesic tables
    const T = geo.build();
    S.lutMs = T.ms;
    S.tables = T;
    const lut = new THREE.DataTexture(T.lut, geo.NPHI, geo.NB, THREE.RGBAFormat, THREE.HalfFloatType);
    lut.minFilter = lut.magFilter = THREE.LinearFilter;
    lut.needsUpdate = true;
    const aux = new THREE.DataTexture(T.aux, geo.NB, 1, THREE.RGBAFormat, THREE.HalfFloatType);
    aux.minFilter = aux.magFilter = THREE.LinearFilter;
    aux.needsUpdate = true;
    S.tex.lut = lut;
    S.tex.aux = aux;
    // …and inverted: where the camera sees a point of space (the glass)
    const I = geo.buildInverse(T);
    S.invMs = I.ms;
    const lensInv = new THREE.DataTexture(I.half, I.nx, I.ny, THREE.RGBAFormat, THREE.HalfFloatType);
    lensInv.minFilter = lensInv.magFilter = THREE.LinearFilter;
    lensInv.needsUpdate = true;
    S.tex.lensInv = lensInv;
    // Upload now: the lens pass binds these directly, outside three's materials
    for (const t of [noise, lut, aux]) S.renderer.initTexture(t);
    if (QP.debug) console.info('[hero] LUT built in ' + T.ms.toFixed(1) + ' ms; self-test ' + JSON.stringify(geo.selfTest(T)));

    // Fullscreen triangle + a camera three is happy with (the shaders ignore it)
    S.fsGeo = new THREE.BufferGeometry();
    S.fsGeo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    S.cam3 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    S.fsScene = new THREE.Scene();
    S.rt.sync = makeRT(1, 1, THREE.UnsignedByteType);
    S.rt.tiny = makeRT(4, 4);

    const c = cfg.colors, d = cfg.disk, p = cfg.post, rc = cfg.rifts, sh = cfg.shards;
    U = {
      uRes:      { value: new THREE.Vector2(1, 1) },
      uTime:     { value: 0 },
      uView:     { value: new THREE.Vector4(1, 0, cfg.camera.yShift, 1) },
      uNoise:    { value: noise },
      uCamPos:   { value: new THREE.Vector3(0, 0, 13) },
      uFwd:      { value: new THREE.Vector3(0, 0, -1) },
      uRight:    { value: new THREE.Vector3(1, 0, 0) },
      uUp:       { value: new THREE.Vector3(0, 1, 0) },
      uFov:      { value: cfg.camera.fov },
      uLut:      { value: lut },
      uAux:      { value: aux },
      uNebula:   { value: null },
      uIgnite:   { value: 0 },
      uWind:     { value: new THREE.Vector4() },
      uPhase:    { value: new THREE.Vector4() },
      uSpotA:    { value: Array.from({ length: MAX_SPOTS }, () => new THREE.Vector4()) },
      uSpotB:    { value: Array.from({ length: MAX_SPOTS }, () => new THREE.Vector4()) },
      uSpots:    { value: 0 },
      uStarLayers: { value: 2 },
      uCrossings: { value: 2 },
      uDiskA:    { value: new THREE.Vector4(d.emission, d.opacity, d.innerGlow, d.innerGlowWidth) },
      uDiskB:    { value: new THREE.Vector4(0, d.beamGain, d.beamMin, d.beamMax) },
      uDiskC:    { value: new THREE.Vector4(d.laneContrast, d.filaments, cfg.ignition.crest, d.overShadow) },
      uRingP:    { value: new THREE.Vector4(cfg.ring.width, cfg.ring.intensity, cfg.ring.doppler, cfg.sky.nebula) },
      uDiskHot:  { value: vec3(c.diskHot) },
      uDiskMid:  { value: vec3(c.diskMid) },
      uDiskCool: { value: vec3(c.diskCool) },
      uDiskBlue: { value: vec3(c.diskBlue) },
      uRingTint: { value: vec3(c.ring) },
      uStarGain: { value: cfg.sky.stars },
      uNebCool:  { value: vec3(c.nebulaCool) },
      uNebWarm:  { value: vec3(c.nebulaWarm) },
      // rifts
      uSlotA:    { value: Array.from({ length: MAX_SLOTS }, () => new THREE.Vector4(0, 0, 1e9, 1)) },
      uSlotB:    { value: Array.from({ length: MAX_SLOTS }, () => new THREE.Vector4()) },
      uSheetU:   { value: Array.from({ length: MAX_SLOTS }, () => new THREE.Vector4(1, 0, 0, 0)) },   // each rift's sheet of glass
      uSheetV:   { value: Array.from({ length: MAX_SLOTS }, () => new THREE.Vector4(0, 1, 0, 0)) },
      uLensInv:  { value: lensInv },
      uDepthC:   { value: new THREE.Vector4(rc.diskCover, rc.redshift, rc.widthDepth, 0) },
      uReduced:  { value: 0 },
      uPxLens:   { value: 0.01 },
      uScene:    { value: null },
      uPxScale:  { value: 1 },
      uLight:    { value: new THREE.Vector3(1, 0, 0) },
      uGlassA:   { value: new THREE.Vector4(rc.settle, rc.bandWidth, rc.bandShift, rc.bandSplit) },
      uGlassB:   { value: new THREE.Vector4(rc.edgeGlint, rc.reflection, rc.edgeShadow, 0) },
      uGlassC:   { value: new THREE.Vector4(rc.lightOffset, rc.shine, rc.film, rc.iridescence) },
      uGlassD:   { value: new THREE.Vector4(rc.streakAngle * Math.PI / 180, rc.streakShift, rc.streakPeriod, rc.streakRate) },
      uGlassE:   { value: new THREE.Vector4(rc.streakWidth, rc.streakGain, rc.streakThin, rc.streakGap) },
      uGlassF:   { value: new THREE.Vector4(rc.viewShift, rc.viewStreak, rc.viewFilm, rc.squash) },
      uGlassG:   { value: new THREE.Vector4(rc.tiltShift, rc.tiltShade, rc.lean, 0) },
      uCrackA:   { value: new THREE.Vector4(rc.lineGain, rc.glowGain, rc.glint, rc.tipGain) },
      uCrackB:   { value: new THREE.Vector4(rc.stillBand, rc.glintPower, rc.fringe, rc.occlude) },
      uCrackC:   { value: new THREE.Vector4(rc.tipTrail, 0, 0, 0) },
      uCoreTint: { value: vec3(c.riftCore) },
      uCyan:     { value: vec3(c.riftCyan) },
      uShardP:   { value: new THREE.Vector4(sh.edge, sh.dispersion, sh.opacity, 0) },
      uEmber:    { value: vec3(c.ember) },
      uSparkCol: { value: vec3(c.spark) },
      uMoteCol:  { value: vec3(c.mote) },
      uDebrisCol:{ value: vec3(c.debris) },
      // post
      uPostA:    { value: new THREE.Vector4(p.exposure, p.bloomStrength, p.vignette, p.grain) },
      uPostB:    { value: new THREE.Vector4(p.aberration, p.scrim, 0, 0) },
      uScrim:    { value: new THREE.Vector4(0, -0.02, 0.60, 0.26) },
      uCopy:     { value: new THREE.Vector4(9, 9, 9, 9) },          // the copy's box (suv), none until measured
      uNavY:     { value: 9 },                                     // the nav's lower edge (suv y), none until measured
    };

    const sh_ = Hero.shaders;
    S.mat.sync = shaderMat(sh_.FS_VERT, sh_.BLIT_FRAG, { uSrc: { value: null } });
    S.fsMesh = new THREE.Mesh(S.fsGeo, S.mat.sync);
    S.fsMesh.frustumCulled = false;
    S.fsScene.add(S.fsMesh);
    S.flares = Array.from({ length: MAX_FLARES }, () => new THREE.Vector4());
    return true;
  }

  /* Everything in the disk that depends only on time is worked out here once
     per frame instead of in every pixel: the winding, drift phases, and the
     disk's point lights (embers spiralling in, rift anchor flares). */
  function updateDiskUniforms(t) {
    const cfg = Hero.config, em = cfg.disk.embers, rIn = cfg.disk.rIn, rOut = cfg.disk.rOut;
    U.uWind.value.set(t * 0.25, 11 + 9 * Math.sin(t * 0.10), t * 0.35, 0.9 + 0.3 * Math.sin(t * 0.5));
    U.uPhase.value.set(t * 0.14, t * 0.10, t * 3.5, 0);
    const A = U.uSpotA.value, B = U.uSpotB.value;
    let n = 0;
    const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
    // Embers: pinpoints that spiral in from the rim, dark between falls
    for (let k = 0; k < em.count; k++) {
      const phs = (t * (em.rate[0] + k * em.rate[1]) + k * 0.41) % 1;
      const phA = phs / em.duty;
      if (phA >= 1) continue;
      const rk = rOut * 0.92 + (rIn + 0.10 - rOut * 0.92) * phA * phA;
      const ak = k * 2.6 + t * 1.5 / Math.pow(rk, 1.5);
      const I = em.intensity * smooth(0.03, 0.12, phA) * (1 - smooth(0.90, 1.0, phA)) * (0.8 + 0.2 * Math.sin(t * 2.2 + k * 7));
      // cutoff where the streak has faded to e^-10 along its length
      A[n].set(Math.cos(ak) * rk, Math.sin(ak) * rk, -Math.sin(ak), Math.cos(ak));
      B[n].set(I, em.along, em.across, 10 / Math.min(em.along, em.across));
      n++;
    }
    if (S.rifts) {
      S.rifts.writeFlares(S.flares, t, S.cam);
      for (const f of S.flares) {
        if (f.z <= 0 || n >= MAX_SPOTS) continue;
        const k = 1 / (f.w * f.w);
        A[n].set(f.x, f.y, 0, 0);
        B[n].set(f.z, k, k, 9 * f.w * f.w);
        n++;
      }
    }
    U.uSpots.value = n;
  }

  function lensDefines() {
    const g = Hero.geo, d = Hero.config.disk;
    return {
      MAX_SPOTS: MAX_SPOTS,
      LENS_D: fstr(g.D), B_CRIT: fstr(g.B_C), B_MAX: fstr(g.B_MAX),
      LUT_W0: fstr(g.W0), LUT_A0: fstr(g.A0), LUT_A1: fstr(g.A1),
      LUT_NB: fstr(g.NB), LUT_NPHI: fstr(g.NPHI),
      INV_D3: fstr(1 / (g.D * g.D * g.D)),
      R_IN: fstr(d.rIn), R_OUT: fstr(d.rOut),
      NEB_ENC: '4.0',
    };
  }

  // The nebula is baked once into an equirectangular texture
  function createNebula() {
    const sh = Hero.shaders;
    S.mat.nebula = shaderMat(sh.FS_VERT, sh.NEBULA_FRAG,
      { uNoise: U.uNoise, uNebCool: U.uNebCool, uNebWarm: U.uNebWarm }, { NEB_ENC: '4.0' });
    S.rt.nebula = makeRT(512, 256, THREE.UnsignedByteType, THREE.RepeatWrapping);
    const t0 = performance.now();
    drawFS(S.mat.nebula, S.rt.nebula);                   // compiles and bakes in one go
    if (!programOk(S.mat.nebula)) return false;
    S.nebulaMs = +(performance.now() - t0).toFixed(1);
    U.uNebula.value = S.rt.nebula.texture;
    return true;
  }

  /* The small post programs the first frame needs are compiled now. The glass
     programs aren't needed until the first fracture (2.4 s in), so they
     compile one per frame after the copy has finished animating in. */
  function createPost() {
    const sh = Hero.shaders, g = Hero.geo;
    const d = Hero.config.disk;
    const slotDefs = {
      MAX_SLOTS: MAX_SLOTS, R_SH: fstr(g.shadowRadius), LENS_D: fstr(g.D), R_IN: fstr(d.rIn), R_OUT: fstr(d.rOut),
      INV_NX: fstr(g.INV.NX), INV_NY: fstr(g.INV.NY), INV_L0: fstr(g.INV.L0), INV_L1: fstr(g.INV.L1),
    };
    const pick = (keys) => { const o = {}; for (const k of keys) o[k] = U[k]; return o; };
    const slotU = ['uSlotA', 'uSlotB', 'uSheetU', 'uSheetV', 'uLensInv', 'uCamPos', 'uRight', 'uUp', 'uDepthC',
      'uTime', 'uReduced', 'uPxLens', 'uPxScale', 'uLight', 'uView'];

    S.mat.blit = shaderMat(sh.FS_VERT, sh.BLIT_FRAG, { uSrc: U.uScene });
    S.mat.bloomDown = shaderMat(sh.FS_VERT, sh.BLOOM_DOWN_FRAG, {
      uSrc: { value: null }, uTexel: { value: new THREE.Vector2() },
      uThresh: { value: new THREE.Vector4(Hero.config.post.bloomThreshold, Hero.config.post.bloomKnee, 1, 0) },
    });
    S.mat.bloomUp = shaderMat(sh.FS_VERT, sh.BLOOM_UP_FRAG, {
      uSrc: { value: null }, uTexel: { value: new THREE.Vector2() }, uRadius: { value: Hero.config.post.bloomRadius },
    }, null, { blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, transparent: true });
    S.mat.composite = shaderMat(sh.FS_VERT, sh.COMPOSITE_FRAG, Object.assign({
      uSrc: { value: null }, uBloom: { value: null },
    }, pick(['uRes', 'uTime', 'uPostA', 'uPostB', 'uScrim'])));

    S.mat.cell = shaderMat(sh.CELL_VERT, sh.CELL_FRAG, pick(slotU.concat(['uScene', 'uRes', 'uCopy', 'uNavY', 'uGlassA', 'uGlassB',
      'uGlassC', 'uGlassD', 'uGlassE', 'uGlassF', 'uGlassG', 'uCoreTint', 'uEmber'])), slotDefs, premultiplied);
    S.mat.crack = shaderMat(sh.CRACK_VERT, sh.CRACK_FRAG, pick(slotU.concat(['uScene', 'uRes', 'uCopy', 'uNavY', 'uGlassA', 'uCrackA',
      'uCrackB', 'uCrackC', 'uCoreTint'])), slotDefs, premultiplied);
    S.mat.shard = shaderMat(sh.SHARD_VERT, sh.SHARD_FRAG, pick(slotU.concat(['uScene', 'uRes', 'uShardP', 'uCyan',
      'uEmber'])), slotDefs, premultiplied);
    S.mat.particle = shaderMat(sh.PARTICLE_VERT, sh.PARTICLE_FRAG, pick(slotU.concat(['uSparkCol', 'uMoteCol',
      'uDebrisCol'])), slotDefs, additive);

    S.pendingCompile = ['cell', 'crack', 'shard', 'particle'];
    S.overlayReady = false;
    return true;
  }

  // One small post program per task, so no single task blocks for long
  function compileFramePost(k) {
    const step = () => {
      const m = S.mat[k];
      if (k === 'blit') U.uScene.value = S.rt.nebula.texture;
      else {
        m.uniforms.uSrc.value = S.rt.nebula.texture;
        if (m.uniforms.uBloom) m.uniforms.uBloom.value = S.rt.nebula.texture;
      }
      drawFS(m, S.rt.tiny);
      return programOk(m);
    };
    Object.defineProperty(step, 'name', { value: 'compile_' + k });
    return step;
  }

  // Compile one deferred glass program; the glass meshes stay hidden until
  // all four are ready (three compiles anything visible, even an empty draw)
  function compileNextOverlay() {
    const k = S.pendingCompile.shift();
    const scratch = new THREE.Scene();
    const m = new THREE.Mesh(S.fsGeo, S.mat[k]);
    m.frustumCulled = false;
    scratch.add(m);
    S.renderer.compile(scratch, S.cam3);
    if (!programOk(S.mat[k])) { fallback(); return false; }
    if (!S.pendingCompile.length) {
      S.overlayReady = true;
      S.shards.mesh.visible = true;
      S.particles.mesh.visible = true;
    }
    return true;
  }

  /* ── calibration: time the lens pass, pick a tier and a starting scale ── */
  function viewportArea() {
    const w = S.canvas.clientWidth || window.innerWidth;
    const h = S.canvas.clientHeight || window.innerHeight;
    return Math.max(w * h, 1);
  }

  function calibrate() {
    const cfg = Hero.config, q = cfg.quality;
    const rt = makeRT(q.calibW, q.calibH, THREE.UnsignedByteType);
    // a representative frame: fully ignited disk, camera at rest
    const cam = Hero.geo.camera(6, { x: 0, y: 0 }, { x: 0, y: 0 }, cfg.camera, cfg.camera.fov);
    setCameraUniforms(cam, q.calibW, q.calibH);
    U.uTime.value = 6; U.uIgnite.value = 1;
    updateDiskUniforms(6);
    drawLens(rt);
    gpuSync(rt);                                          // warm-up: first use is never representative
    const t0 = performance.now();
    for (let i = 0; i < q.calibRuns; i++) drawLens(rt);
    gpuSync(rt);
    const ms = (performance.now() - t0) / q.calibRuns;
    rt.dispose();

    const perPx = Math.max(ms, 0.02) / (q.calibW * q.calibH);
    const sFit = Math.sqrt(q.lensBudgetMs / perPx / viewportArea());
    const dprCap = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const name = sFit >= Math.max(1.25, dprCap) ? 'high' : (sFit >= 0.9 ? 'mid' : 'low');
    S.tierName = name;
    S.tier = cfg.tiers[name];
    S.ceiling = name === 'high' ? dprCap : S.tier.scaleMax;
    S.scale = S.calibScale = clamp(sFit, q.scaleFloor, S.ceiling);
    S.calibMs = ms;
    if (QP.debug) console.info('[hero] calibration ' + JSON.stringify({ lensMs512: +ms.toFixed(3), sFit: +sFit.toFixed(2), tier: name, scale: +S.scale.toFixed(2) }));
    return true;
  }

  function createScene() {
    const tier = S.tier;
    U.uStarLayers.value = tier.starLayers;
    U.uCrossings.value = tier.crossings;
    U.uPostB.value.x = tier.aberration ? Hero.config.post.aberration : 0;
    U.uReduced.value = S.reduced ? 1 : 0;

    S.rt.scene = makeRT(4, 4);
    S.rt.comp = makeRT(4, 4);
    S.rt.bloom = [];
    for (let i = 0; i < tier.bloomMips; i++) S.rt.bloom.push(makeRT(4, 4));
    U.uScene.value = S.rt.scene.texture;

    // Overlay scene: blit first (opaque), then the glass shards over it, the
    // crack lines on the shards, splinters, sparks
    S.overlay = new THREE.Scene();
    const blit = new THREE.Mesh(S.fsGeo, S.mat.blit);
    blit.frustumCulled = false;
    blit.renderOrder = 0;
    S.overlay.add(blit);

    const nSlots = tier.rifts + 2;
    const perSlot = Math.floor(tier.particles / nSlots);
    const mesh = (g, m, order) => {
      const x = new THREE.Mesh(g, m);
      x.frustumCulled = false;
      x.renderOrder = order;
      x.visible = false;
      S.overlay.add(x);
      return x;
    };
    S.webs = [];
    S.warm = 0;
    for (let k = 0; k < nSlots; k++) {
      S.webs.push({
        cells: mesh(Hero.rifts.createCellGeometry(), S.mat.cell, 1),
        cracks: mesh(Hero.rifts.createLineGeometry(), S.mat.crack, 2),
      });
    }
    S.shards = Hero.particles.createShards(S.mat.shard, tier.shards, nSlots);
    S.shards.mesh.renderOrder = 3;
    S.shards.mesh.visible = false;
    S.overlay.add(S.shards.mesh);
    S.particles = Hero.particles.createParticles(S.mat.particle, perSlot, nSlots);
    S.particles.mesh.renderOrder = 4;
    S.particles.mesh.visible = false;
    S.overlay.add(S.particles.mesh);

    S.rifts = Hero.rifts.create({
      tier, seed: S.seed, reduced: S.reduced,
      shardsPerRift: tier.shards, particlesPerSlot: perSlot,
      shards: S.shards, particles: S.particles,
      writeWeb: (slot, g) => {
        Hero.rifts.writeCellGeometry(S.webs[slot].cells.geometry, g, slot);
        Hero.rifts.writeLineGeometry(S.webs[slot].cracks.geometry, g, slot);
      },
      clearSlot: (k) => {
        S.webs[k].cells.geometry.setDrawRange(0, 0);
        S.webs[k].cracks.geometry.setDrawRange(0, 0);
        S.shards.clear(k); S.particles.clear(k);
      },
      baseFov: () => S.baseFov,
      cam: () => S.cam,
      tables: S.tables,
    });

    syncSize(true);
    measureText();
    return true;
  }

  function begin() {
    S.time = QP.time;
    S.ready = true;
    updateCamera(0);
    // Fast-forwarded (?hero-time) past the first rift: its programs are needed now
    while (S.pendingCompile.length && S.time >= overlayCompileAt()) if (!compileNextOverlay()) return false;
    measureText();
    S.rifts.update(S.time);                              // fast-forward the schedule to ?hero-time
    S.readyAt = performance.now();
    // the webfont changes the copy's size; re-measure once it lands
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureText);
    refreshRunning();
    return true;
  }

  // Setup steps run one per task. A step may return 'wait' to be polled again
  // next frame (the background shader link), or false to fall back.
  function runSteps(steps) {
    let i = 0;
    S.stepMs = {};
    const next = () => {
      if (!S.ok) return;
      const fn = steps[i];
      const name = fn.name || ('step' + i);
      let ok;
      const t0 = performance.now();
      try { ok = fn(); } catch (err) { console.warn('[hero] setup failed:', err); ok = false; }
      S.stepMs[name] = +((S.stepMs[name] || 0) + performance.now() - t0).toFixed(1);
      if (ok === false) { fallback(); return; }
      if (ok === 'wait') { requestAnimationFrame(next); return; }
      if (++i < steps.length) later(next);
    };
    later(next);
  }

  // Scene time at which the rift programs start compiling: half a second
  // before the first rift is due
  function overlayCompileAt() {
    const c = Hero.config;
    return c.ignition.duration + c.rifts.firstDelay - 0.5;
  }

  function fallback() {
    S.ok = false;
    S.ready = false;
    stop();
    teardown();
    dropRenderer();
    if (S.onFallback) S.onFallback();
  }

  // contextLost: the GPU objects died with the old context, so only the
  // references are dropped (deleting them would raise WebGL errors)
  function teardown(contextLost) {
    if (!contextLost) {
      dropLensProgram();
      for (const k in S.mat) S.mat[k].dispose();
      for (const k in S.rt) {
        const v = S.rt[k];
        if (Array.isArray(v)) v.forEach((r) => r.dispose()); else if (v) v.dispose();
      }
      for (const k in S.tex) S.tex[k].dispose();
      S.webs.forEach((w) => { w.cells.geometry.dispose(); w.cracks.geometry.dispose(); });
      if (S.shards) S.shards.dispose();
      if (S.particles) S.particles.dispose();
      if (S.fsGeo) S.fsGeo.dispose();
    }
    S.lens = null;
    S.mat = {}; S.rt = {}; S.tex = {}; S.webs = [];
    S.shards = S.particles = S.rifts = S.overlay = null;
  }

  /* ============================================================
     SIZE, TEXT BOX, CAMERA
  ============================================================ */
  function syncSize(force) {
    const w = S.canvas.clientWidth, h = S.canvas.clientHeight;
    if (w < 2 || h < 2) return;                          // hidden (LITE) or mid-layout
    if (!force && w === S.cssW && h === S.cssH) return;
    S.cssW = w; S.cssH = h;
    const c = Hero.config.camera;
    S.baseFov = c.fov * clamp(c.narrowFovK / (w / h), 1, c.narrowFovMax);
    applyScale();
  }

  function applyScale() {
    const r = S.renderer;
    r.setPixelRatio(S.scale);
    r.setSize(S.cssW, S.cssH, false);
    const buf = r.getDrawingBufferSize(new THREE.Vector2());
    S.bufW = buf.x; S.bufH = buf.y;
    S.rt.scene.setSize(S.bufW, S.bufH);
    S.rt.comp.setSize(S.bufW, S.bufH);
    let bw = Math.max(1, Math.round(S.bufW / S.tier.bloomDiv)), bh = Math.max(1, Math.round(S.bufH / S.tier.bloomDiv));
    for (const m of S.rt.bloom) { m.setSize(bw, bh); bw = Math.max(1, bw >> 1); bh = Math.max(1, bh >> 1); }
    U.uRes.value.set(S.bufW, S.bufH);
    U.uPxScale.value = S.bufH / S.cssH;
  }

  /* An element's layout box in canvas pixels, ignoring transforms: the copy
     slides in with GSAP, and rifts shaped around a box caught mid-slide
     would differ from ones shaped a second later. Fixed elements (the nav)
     are placed where they sit with the page scrolled to the top. */
  function layoutBox(el) {
    if (getComputedStyle(el).position === 'fixed') {
      const r = el.getBoundingClientRect();
      return { x0: r.left, y0: r.top, x1: r.right, y1: r.bottom };
    }
    let x = 0, y = 0, e = el;
    while (e && e !== S.heroEl) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    if (e !== S.heroEl) return null;
    return { x0: x, y0: y, x1: x + el.offsetWidth, y1: y + el.offsetHeight };
  }

  /* Text avoidance + scrim: the copy's box in screen units (suv) and in
     lens-plane units (at rest: no roll, no breathing), inflated a little */
  function measureText() {
    if (!S.rifts) return;
    const W = S.canvas.clientWidth, H = S.canvas.clientHeight;
    const el = S.contentEl;
    let b = null;
    if (el && W > 1 && H > 1) {
      for (const ch of el.children) {
        const r = layoutBox(ch);
        if (!r || r.x1 - r.x0 < 1 || r.y1 - r.y0 < 1) continue;
        b = b ? { x0: Math.min(b.x0, r.x0), y0: Math.min(b.y0, r.y0), x1: Math.max(b.x1, r.x1), y1: Math.max(b.y1, r.y1) } : r;
      }
      if (!b) b = layoutBox(el);
    }
    if (!b) { S.rifts.setAvoidBox(null); U.uCopy.value.set(9, 9, 9, 9); return; }
    const sx0 = (b.x0 - W / 2) / H, sx1 = (b.x1 - W / 2) / H;
    const sy0 = (H / 2 - b.y1) / H, sy1 = (H / 2 - b.y0) / H;
    U.uCopy.value.set(sx0, sy0, sx1, sy1);
    U.uScrim.value.set((sx0 + sx1) / 2, (sy0 + sy1) / 2,
      Math.max((sx1 - sx0) * 0.6, 0.2), Math.max((sy1 - sy0) * 0.7, 0.12));

    const rc = Hero.config.rifts, yS = Hero.config.camera.yShift;
    const k = Hero.geo.D * S.baseFov;
    const cx = (sx0 + sx1) / 2 * k, cy = ((sy0 + sy1) / 2 - yS) * k;
    const hx = (sx1 - sx0) / 2 * k * (1 + rc.avoidInflate), hy = (sy1 - sy0) / 2 * k * (1 + rc.avoidInflate);
    const keepOut = [{ x0: cx - hx, x1: cx + hx, y0: cy - hy, y1: cy + hy }];
    // Anything else to stay clear of (the nav bar): its band, full width
    U.uNavY.value = 9;
    for (const av of S.avoidEls) {
      const r = layoutBox(av);
      if (!r || r.y1 - r.y0 < 1 || r.y1 <= 0 || r.y0 >= H) continue;
      const top = r.y0 <= 2;                            // pinned to the top edge → keep out everything above it
      if (top) U.uNavY.value = Math.min(U.uNavY.value, (H / 2 - r.y1) / H);
      const yb = ((H / 2 - (r.y1 + 8)) / H - yS) * k;
      const yt = ((H / 2 - (r.y0 - 8)) / H - yS) * k;
      keepOut.push({ x0: -1e3, x1: 1e3, y0: yb, y1: top ? 1e3 : yt });
    }
    const hw = W / H / 2 * k;
    const screen = { x0: -hw, x1: hw, y0: (-0.5 - yS) * k, y1: (0.5 - yS) * k };
    S.rifts.setAvoidBox({ keepOut, screen });
  }

  // ?hero-time fast-forwards through rifts shaped around the copy, so wait
  // (briefly) for the webfont that sets its size, as live play would have
  let fontWaitUntil = 0;
  function awaitFonts() {
    if (!(QP.time > 0) || !document.fonts || document.fonts.status === 'loaded') return true;
    if (!fontWaitUntil) fontWaitUntil = performance.now() + 3000;
    return performance.now() > fontWaitUntil ? true : 'wait';
  }

  function setCameraUniforms(cam, bufW, bufH) {
    const D = Hero.geo.D;
    U.uCamPos.value.fromArray(cam.pos);
    U.uFwd.value.fromArray(cam.fwd);
    U.uRight.value.fromArray(cam.right);
    U.uUp.value.fromArray(cam.up);
    U.uFov.value = cam.fov;
    U.uView.value.set(1 / (D * cam.fov), cam.roll, cam.yShift, bufW / bufH);
    U.uPxLens.value = D * cam.fov / bufH;
    U.uRes.value.set(bufW, bufH);
  }

  function updateCamera(rawDt) {
    const c = Hero.config.camera;
    if (S.reduced) { S.target.x = 0; S.target.y = 0; }   // no cursor-steered camera
    const f = rawDt / 16.667;
    const k1 = 1 - Math.pow(1 - c.easeFast, f), k2 = 1 - Math.pow(1 - c.easeSlow, f);
    S.mouse.x += (S.target.x - S.mouse.x) * k1;  S.mouse.y += (S.target.y - S.mouse.y) * k1;
    S.mouse2.x += (S.target.x - S.mouse2.x) * k2; S.mouse2.y += (S.target.y - S.mouse2.y) * k2;
    Hero.geo.camera(S.time, S.mouse, S.mouse2, c, S.baseFov, S.cam);
    setCameraUniforms(S.cam, S.bufW, S.bufH);
    const rc = Hero.config.rifts;
    // The light the glass catches swings slowly round (and follows the cursor)
    const la = rc.lightAngle + S.time * rc.lightRate + S.mouse2.x * rc.lightMouse;
    U.uLight.value.set(Math.cos(la), Math.sin(la), la);
  }

  /* ============================================================
     FRAME
  ============================================================ */
  function runBloom(src, mips) {
    const d = S.mat.bloomDown, u = S.mat.bloomUp;
    d.uniforms.uSrc.value = src.texture;
    d.uniforms.uTexel.value.set(1 / src.width, 1 / src.height);
    d.uniforms.uThresh.value.z = 1;
    drawFS(d, mips[0]);
    d.uniforms.uThresh.value.z = 0;
    for (let i = 1; i < mips.length; i++) {
      d.uniforms.uSrc.value = mips[i - 1].texture;
      d.uniforms.uTexel.value.set(1 / mips[i - 1].width, 1 / mips[i - 1].height);
      drawFS(d, mips[i]);
    }
    for (let i = mips.length - 2; i >= 0; i--) {
      u.uniforms.uSrc.value = mips[i + 1].texture;
      u.uniforms.uTexel.value.set(1 / mips[i + 1].width, 1 / mips[i + 1].height);
      drawFS(u, mips[i]);
    }
  }

  function drawComposite(src, bloom, target) {
    const m = S.mat.composite;
    m.uniforms.uSrc.value = src.texture;
    m.uniforms.uBloom.value = bloom.texture;
    U.uPostA.value.y = Hero.config.post.bloomStrength / S.rt.bloom.length;
    drawFS(m, target);
  }

  function renderOverlay(target) {
    S.renderer.setRenderTarget(target);
    S.renderer.render(S.overlay, S.cam3);
  }

  function renderFrame() {
    drawLens(S.rt.scene);
    renderOverlay(S.rt.comp);
    runBloom(S.rt.comp, S.rt.bloom);
    drawComposite(S.rt.comp, S.rt.bloom[0], null);
  }

  function frame(now) {
    if (!S.running) return;
    S.raf = requestAnimationFrame(frame);
    const rawDt = Math.max(now - S.lastNow, 0);
    S.lastNow = now;
    const cfg = Hero.config;
    if (!QP.freeze && S.frames > 0) {
      S.time += Math.min(rawDt / 1000, cfg.time.maxStep) * (S.reduced ? cfg.time.calmRate : 1);
    }
    U.uTime.value = S.time;
    U.uIgnite.value = S.time / cfg.ignition.duration;
    updateCamera(Math.min(rawDt, 100));
    // One deferred rift program per frame, once the intro is over
    if (S.pendingCompile.length && S.time >= overlayCompileAt() && !compileNextOverlay()) return;
    S.rifts.update(S.time);
    S.rifts.writeUniforms(U.uSlotA.value, U.uSlotB.value, U.uSheetU.value, U.uSheetV.value, S.time);
    // Once the glass programs are ready, each slot's buffers go up to the GPU
    // on a quiet frame of their own (drawn empty), not on the frame its first
    // web lands: on a software renderer that first upload is a visible hitch
    const warm = S.overlayReady && S.warm < S.webs.length ? S.warm++ : -1;
    for (let k = 0; k < S.webs.length; k++) {
      const on = S.overlayReady && (!!S.rifts.slots[k] || k === warm);
      S.webs[k].cells.visible = on;
      S.webs[k].cracks.visible = on;
    }
    updateDiskUniforms(S.time);
    S.shards.flush();
    S.particles.flush();
    renderFrame();
    S.frames++;
    if (S.frames === 1) {
      S.firstFrameAt = performance.now();
      if (S.onFirstFrame) S.onFirstFrame();
    } else {
      trackFrame(now, rawDt);
    }
  }

  /* Dynamic resolution: average rAF deltas over 1 s windows. Two slow
     windows in a row step down; three fast ones step back up, but never
     past what calibration picked. */
  function trackFrame(now, dt) {
    const q = Hero.config.quality, dr = S.dr;
    if (dt < q.ignoreMs) { dr.acc += dt; dr.n++; }
    if (!dr.start) dr.start = now;
    if (now - dr.start < q.windowMs) return;
    dr.start = now;
    if (dr.n < 4) { dr.acc = dr.n = 0; return; }
    const avg = dr.acc / dr.n;
    dr.acc = dr.n = 0;
    dr.fps = Math.round(1000 / avg);
    if (avg > q.slowMs) {
      dr.fast = 0;
      if (++dr.slow >= q.slowWindows && S.scale > q.scaleFloor) {
        dr.slow = 0;
        S.scale = Math.max(q.scaleFloor, S.scale * q.down);
        applyScale();
      }
    } else if (avg <= q.fastMs) {
      dr.slow = 0;
      if (++dr.fast >= q.fastWindows && S.scale < S.calibScale) {
        dr.fast = 0;
        S.scale = Math.min(S.calibScale, S.scale * q.up);
        applyScale();
      }
    } else {
      dr.slow = dr.fast = 0;
    }
  }

  function start() {
    if (S.running) return;
    S.running = true;
    S.lastNow = performance.now();
    S.dr.start = 0; S.dr.acc = 0; S.dr.n = 0;
    S.raf = requestAnimationFrame(frame);
  }

  function stop() {
    S.running = false;
    cancelAnimationFrame(S.raf);
  }

  function refreshRunning() {
    const r = S.reasons;
    const run = S.ok && S.ready && !(r.external || r.offscreen || r.hidden || r.lost);
    if (run) { syncSize(); start(); } else stop();
  }

  function setReason(k, on) {
    if (S.reasons[k] === on) return;
    S.reasons[k] = on;
    refreshRunning();
  }

  /* ============================================================
     EVENTS
  ============================================================ */
  function bindEvents() {
    window.addEventListener('mousemove', (e) => {
      S.target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      S.target.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    if (S.heroEl) {
      S.heroEl.addEventListener('click', (e) => {
        if (e.button !== 0 || !S.running) return;
        if (e.target.closest && e.target.closest('a, button, input, textarea, select, label, [role="button"]')) return;
        Hero.tearAt(e.clientX, e.clientY);
      });
      if ('IntersectionObserver' in window) {
        // Ratio, not isIntersecting: a hero scrolled exactly out of view still
        // "intersects" along its bottom edge, and a sliver of a couple of
        // percent isn't worth a full render either
        new IntersectionObserver((entries) => {
          const e = entries[entries.length - 1];
          setReason('offscreen', !e.isIntersecting || e.intersectionRatio < 0.02);
        }, { threshold: [0, 0.02, 0.05] }).observe(S.heroEl);
      }
    }
    document.addEventListener('visibilitychange', () => setReason('hidden', document.hidden));
    S.reasons.hidden = document.hidden;

    let t = 0;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => { if (S.ready) { syncSize(); measureText(); } }, 150);
    };
    if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(S.canvas);
    window.addEventListener('resize', onResize);

    S.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      setReason('lost', true);
    });
    S.canvas.addEventListener('webglcontextrestored', () => {
      // Rebuild everything on the restored context; the schedule is a pure
      // function of (seed, time), so the rifts come back exactly where they were
      const t = S.time;
      S.ready = false;
      teardown(true);
      startLensProgram();
      const restore = function restore() {
        S.ready = true;
        updateCamera(0);
        while (S.pendingCompile.length && t >= overlayCompileAt()) if (!compileNextOverlay()) return false;
        S.rifts.update(t);
        measureText();
        setReason('lost', false);
        return true;
      };
      runSteps([createStatic, createNebula, createPost].concat(
        ['blit', 'bloomDown', 'bloomUp', 'composite'].map(compileFramePost),
        [awaitLens, createScene, restore]));
    });
  }

  /* ============================================================
     PUBLIC API
  ============================================================ */
  Hero.init = function (opts) {
    if (S.inited) return S.ok;
    S.inited = true;
    opts = opts || {};
    S.canvas = opts.canvas;
    S.contentEl = opts.contentEl || null;
    S.avoidEls = (opts.avoidEls || []).filter(Boolean);
    S.onFirstFrame = opts.onFirstFrame;
    S.onFallback = opts.onFallback;
    if (!S.canvas || typeof THREE === 'undefined') return false;
    S.heroEl = S.canvas.parentElement;
    S.initAt = performance.now();
    S.reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    S.seed = QP.seed !== null ? QP.seed : ((Date.now() ^ (Math.random() * 0x7fffffff)) >>> 0);
    const t0 = performance.now();
    if (!createCore()) return false;
    startLensProgram();                                  // links in the background from here on
    S.coreMs = +(performance.now() - t0).toFixed(1);
    S.ok = true;
    bindEvents();
    runSteps([createStatic, createNebula, createPost].concat(
      ['blit', 'bloomDown', 'bloomUp', 'composite'].map(compileFramePost),
      [awaitLens, calibrate, createScene, awaitFonts, begin]));
    return true;
  };

  Hero.pause  = function () { setReason('external', true); };
  Hero.resume = function () { setReason('external', false); };

  Hero.tearAt = function (clientX, clientY) {
    if (!S.ready || !S.rifts) return false;
    // A tear during the intro can't wait for the scheduled compiles
    while (S.pendingCompile.length) if (!compileNextOverlay()) return false;
    const r = S.canvas.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const sx = (clientX - r.left - r.width / 2) / r.height;
    const sy = (r.top + r.height / 2 - clientY) / r.height;
    const L = Hero.geo.screenToLens(sx, sy, S.cam);
    return S.rifts.tear(L.x, L.y, S.time, performance.now());
  };

  Hero.stats = function () {
    return {
      tier: S.tierName || null,
      scale: S.scale ? +S.scale.toFixed(3) : 0,
      fps: S.dr.fps,
      rifts: S.rifts ? S.rifts.activeCount(S.time) : 0,
      particles: S.rifts ? S.rifts.liveParticles(S.time) : 0,
      frames: S.frames,
      time: +S.time.toFixed(3),
      buffer: [S.bufW || 0, S.bufH || 0],
      running: S.running,
      calibMs: S.calibMs,
      lutMs: S.lutMs,
      invMs: S.invMs,
      initAt: S.initAt,
      readyAt: S.readyAt,
      firstFrameAt: S.firstFrameAt,
      coreMs: S.coreMs,
      nebulaMs: S.nebulaMs,
      setupMs: S.stepMs,
      seed: S.seed,
    };
  };

  /* Per-pass GPU ms at a fixed 1280×720, each pass timed over a batch with
     a readback sync (see gpuSync). Uses its own targets; the live view is
     restored afterwards. */
  Hero.benchmark = function (runs) {
    if (!S.ready) return null;
    const W = 1280, H = 720, N = runs || 6;
    const tier = S.tier;
    const scene = makeRT(W, H), comp = makeRT(W, H), out = makeRT(W, H, THREE.UnsignedByteType);
    const mips = [];
    let bw = Math.round(W / tier.bloomDiv), bh = Math.round(H / tier.bloomDiv);
    for (let i = 0; i < tier.bloomMips; i++) { mips.push(makeRT(bw, bh)); bw = Math.max(1, bw >> 1); bh = Math.max(1, bh >> 1); }
    const saved = { scene: U.uScene.value, view: U.uView.value.clone(), res: U.uRes.value.clone(), px: U.uPxLens.value, pxs: U.uPxScale.value };
    U.uScene.value = scene.texture;
    U.uView.value.w = W / H;
    U.uRes.value.set(W, H);
    U.uPxLens.value = Hero.geo.D * S.cam.fov / H;
    U.uPxScale.value = 1;

    const time = (fn, last) => {
      fn(); gpuSync(last);
      const t0 = performance.now();
      for (let i = 0; i < N; i++) fn();
      gpuSync(last);
      return +((performance.now() - t0) / N).toFixed(3);
    };
    const res = {
      width: W, height: H, tier: S.tierName,
      lens: time(() => drawLens(scene), scene),
      overlay: time(() => renderOverlay(comp), comp),
      bloom: time(() => runBloom(comp, mips), mips[0]),
      composite: time(() => drawComposite(comp, mips[0], out), out),
    };
    res.total = +(res.lens + res.overlay + res.bloom + res.composite).toFixed(3);

    // Sanity-check the finished image: all black or blown to white means the
    // GPU compiled the shaders but isn't producing a real picture
    const px = new Uint8Array(W * H * 4);
    S.renderer.readRenderTargetPixels(out, 0, 0, W, H, px);
    let lit = 0, white = 0;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i] > 8 || px[i + 1] > 8 || px[i + 2] > 8) lit++;
      if (px[i] > 250 && px[i + 1] > 250 && px[i + 2] > 250) white++;
    }
    res.image = { litPct: +(lit / (W * H) * 100).toFixed(1), whitePct: +(white / (W * H) * 100).toFixed(2) };

    U.uScene.value = saved.scene;
    U.uView.value.copy(saved.view);
    U.uRes.value.copy(saved.res);
    U.uPxLens.value = saved.px;
    U.uPxScale.value = saved.pxs;
    [scene, comp, out].concat(mips).forEach((r) => r.dispose());
    return res;
  };

  // Debug handles for the harness and debug.html (not part of the API)
  Hero._debug = { state: S, uniforms: () => U, params: QP };
})();
