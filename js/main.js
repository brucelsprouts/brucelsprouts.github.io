/**
 * main.js — Cyber-tech Portfolio
 * Sections: Config · Data · Loader (Three.js + number rain) ·
 *           Hero (Three.js particles) · Nav · Skills ·
 *           History · Projects · Contact · Utilities
 *
 * Dependencies (loaded via CDN in index.html, injected before this script):
 *   - Three.js r128
 *   - GSAP 3.x + ScrollTrigger
 */

'use strict';

/* ============================================================
   1. SITE DATA  — edit this to personalise the portfolio
============================================================ */
const DATA = {
  skills: [
    { name: 'JavaScript',  icon: '⬡', level: 'Advanced'      },
    { name: 'TypeScript',  icon: '⬡', level: 'Advanced'      },
    { name: 'React',       icon: '⬡', level: 'Advanced'      },
    { name: 'Node.js',     icon: '⬡', level: 'Advanced'      },
    { name: 'Python',      icon: '⬡', level: 'Intermediate'  },
    { name: 'Three.js',    icon: '⬡', level: 'Intermediate'  },
    { name: 'CSS / SASS',  icon: '⬡', level: 'Advanced'      },
    { name: 'SQL',         icon: '⬡', level: 'Intermediate'  },
    { name: 'Git',         icon: '⬡', level: 'Advanced'      },
    { name: 'Docker',      icon: '⬡', level: 'Intermediate'  },
    { name: 'Blender',     icon: '⬡', level: 'Learning'      },
    { name: 'Figma',       icon: '⬡', level: 'Intermediate'  },
  ],

  timeline: [
    {
      date: '2026 — Present',
      title: 'Full-Stack Developer',
      org: 'Freelance',
      desc: 'Building web applications, developer tools, and interactive 3D experiences for clients across multiple industries.',
    },
    {
      date: '2024 — 2026',
      title: 'B.Sc. Computer Science',
      org: 'University',
      desc: 'Studied algorithms, data structures, software engineering, and computer graphics. Graduated with honors.',
    },
    {
      date: '2023',
      title: 'Frontend Developer Intern',
      org: 'Tech Startup',
      desc: 'Developed React components, optimised performance bottlenecks, and shipped features used by 50k+ users.',
    },
    {
      date: '2022',
      title: 'First Open-Source Contribution',
      org: 'GitHub',
      desc: 'Merged first PR into a popular open-source project. Became hooked on collaboration and building in public.',
    },
    {
      date: '2020',
      title: 'Started Coding',
      org: 'Self-taught',
      desc: 'Wrote first lines of HTML and CSS. Built a terrible website. Never looked back.',
    },
  ],

  projects: [
    {
      id: 1,
      title: 'Cyber Dashboard UI',
      category: 'coding',
      desc: 'Dark-mode analytics dashboard with real-time charts, WebSocket data feeds, and a fully accessible component library.',
      stack: ['React', 'TypeScript', 'D3.js', 'WebSockets'],
      demo: '#',
      github: '#',
      thumb: null,   // set to image path when available e.g. 'assets/images/project1.jpg'
    },
    {
      id: 2,
      title: 'Low-Poly World Generator',
      category: '3d',
      desc: 'Procedural terrain and biome generator built entirely in Three.js. Export to GLB/OBJ.',
      stack: ['Three.js', 'JavaScript', 'WebGL'],
      demo: '#',
      github: '#',
      thumb: null,
    },
    {
      id: 3,
      title: 'Motion Reel Editor',
      category: 'video',
      desc: 'Browser-based video editor for assembling motion reels with transitions, text overlays, and audio sync.',
      stack: ['FFmpeg WASM', 'React', 'Web Audio API'],
      demo: '#',
      github: '#',
      thumb: null,
    },
    {
      id: 4,
      title: 'Dev CLI Toolkit',
      category: 'tools',
      desc: 'Collection of CLI utilities for scaffolding, migrations, environment management, and code quality checks.',
      stack: ['Node.js', 'Commander.js', 'Bash'],
      demo: null,
      github: '#',
      thumb: null,
    },
    {
      id: 5,
      title: 'Portfolio OS Theme',
      category: 'coding',
      desc: 'OS-inspired portfolio concept with draggable windows, a fake terminal, and a functioning file system.',
      stack: ['Vanilla JS', 'CSS Grid', 'IndexedDB'],
      demo: '#',
      github: '#',
      thumb: null,
    },
    {
      id: 6,
      title: 'Shader Experiments',
      category: '3d',
      desc: 'Collection of GLSL fragment shaders: noise fields, raymarched geometry, and procedural textures.',
      stack: ['GLSL', 'Three.js', 'WebGL'],
      demo: '#',
      github: '#',
      thumb: null,
    },
  ],
};

/* ============================================================
   2. UTILITY HELPERS
============================================================ */

/** Random integer between min and max (inclusive) */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Random float between min and max */
const randFloat = (min, max) => Math.random() * (max - min) + min;

/** Clamp a value between lo and hi */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** Generate a block of ASCII symbol art (repeated character grid) */
function generateSymbolBlock(char, cols, rows) {
  return Array.from({ length: rows }, () => char.repeat(cols)).join('\n');
}

/* ============================================================
   3. LOADER
============================================================ */
const loader = {
  el: null,
  percentEl: null,
  rainEl: null,
  threeScene: null,
  animFrame: null,
  progress: 0,

  init() {
    this.el         = document.getElementById('loader');
    this.percentEl  = document.getElementById('loader-percent');
    this.rainEl     = document.getElementById('number-rain');

    // Populate ASCII symbol blocks
    document.querySelectorAll('.symbol-block').forEach((el, i) => {
      el.textContent = generateSymbolBlock(i % 2 === 0 ? '+' : '|', 22, 14);
    });

    this.initThree();
    this.spawnNumbers();
    this.animateProgress();
  },

  /* -- Three.js loader scene: complex nested polyhedron + node lattice -- */
  initThree() {
    const canvas = document.getElementById('loader-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    // 1. Outer wireframe icosahedron — main structural cage
    const geoIco = new THREE.IcosahedronGeometry(1.6, 1);
    const matIco = new THREE.MeshBasicMaterial({
      color: 0xffffff, wireframe: true, transparent: true, opacity: 0.18,
    });
    const ico = new THREE.Mesh(geoIco, matIco);
    scene.add(ico);

    // 2. Inner solid — hides back-faces for depth illusion
    const matSolid = new THREE.MeshBasicMaterial({
      color: 0x000000, transparent: true, opacity: 0.88,
    });
    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 1), matSolid);
    scene.add(inner);

    // 3. Nested octahedron — counter-rotates inside the outer cage
    const matOct = new THREE.MeshBasicMaterial({
      color: 0xffffff, wireframe: true, transparent: true, opacity: 0.32,
    });
    const oct = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), matOct);
    scene.add(oct);

    // 4. Fibonacci-distributed node network with connecting edge lattice
    const nodeCount = 22;
    const npos = [];
    for (let i = 0; i < nodeCount; i++) {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.68 + (i % 3) * 0.17;
      npos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }
    const edgePts = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = npos[i*3]   - npos[j*3];
        const dy = npos[i*3+1] - npos[j*3+1];
        const dz = npos[i*3+2] - npos[j*3+2];
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 1.3) {
          edgePts.push(npos[i*3], npos[i*3+1], npos[i*3+2],
                       npos[j*3], npos[j*3+1], npos[j*3+2]);
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgePts), 3));
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.13 });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(edges);

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(npos), 3));
    const nodeMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.65 });
    const nodePts = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodePts);

    // 5. Ground grid
    const gridHelper = new THREE.GridHelper(14, 20, 0x1a1a1a, 0x0d0d0d);
    gridHelper.position.y = -2.8;
    scene.add(gridHelper);

    // 6. Background particle field
    const ptCount = 120;
    const ptPositions = new Float32Array(ptCount * 3);
    for (let i = 0; i < ptCount; i++) {
      ptPositions[i * 3]     = randFloat(-6, 6);
      ptPositions[i * 3 + 1] = randFloat(-4, 4);
      ptPositions[i * 3 + 2] = randFloat(-6, 6);
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPositions, 3));
    const ptMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.35 });
    const particles = new THREE.Points(ptGeo, ptMat);
    scene.add(particles);

    // Store all refs — materials tweened in exit(), spinMultiplier scaled in anim loop
    this.threeScene = {
      renderer, scene, camera,
      ico, inner, oct, edges, nodePts, particles,
      matIco, matSolid, matOct, edgeMat, nodeMat, ptMat,
      spinMultiplier: 1,
    };

    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Animation loop — spinMultiplier accelerated during dissolve, breathing pulse adds life
    const animate = () => {
      this.animFrame = requestAnimationFrame(animate);
      const m = this.threeScene.spinMultiplier;
      const t = Date.now() * 0.001;
      ico.rotation.x += 0.0035 * m;
      ico.rotation.y += 0.0055 * m;
      inner.rotation.copy(ico.rotation);
      // Octahedron counter-rotates for layered depth
      oct.rotation.x -= 0.005 * m;
      oct.rotation.y += 0.008 * m;
      // Node lattice co-rotates with outer cage
      edges.rotation.copy(ico.rotation);
      nodePts.rotation.copy(ico.rotation);
      // Breathing pulse — subtle scale oscillation
      const pulse = 1 + Math.sin(t * 0.7) * 0.028;
      ico.scale.setScalar(pulse);
      inner.scale.setScalar(pulse);
      particles.rotation.y += 0.0008 * m;
      renderer.render(scene, camera);
    };
    animate();
  },

  /* -- Spawn glitching number rain across the screen -- */
  spawnNumbers() {
    if (!this.rainEl) return;

    const total = window.innerWidth < 600 ? 60 : 140;

    for (let i = 0; i < total; i++) {
      const span = document.createElement('span');
      span.className = 'rain-num';
      span.style.left = `${randFloat(0, 100)}%`;
      span.style.top  = `${randFloat(0, 100)}%`;
      span.style.animationDelay  = `${randFloat(0, 2)}s`;
      span.style.animationDuration = `${randFloat(0.5, 1.5)}s`;
      // Random initial number
      span.textContent = randInt(0, 100).toString().padStart(2, '0');
      this.rainEl.appendChild(span);
    }

    // Continuously update random numbers to animate the "counting" feel
    this._glitchInterval = setInterval(() => {
      const nums = this.rainEl.querySelectorAll('.rain-num');
      nums.forEach(n => {
        if (Math.random() < 0.35) {
          n.textContent = randInt(0, 999).toString().padStart(3, '0');
          // Occasional horizontal jitter only — no rotation/skew
          if (Math.random() < 0.1) {
            n.style.transform = `translateX(${randFloat(-6, 6)}px)`;
            setTimeout(() => { n.style.transform = ''; }, 80);
          }
        }
      });
    }, 100);
  },

  /* -- Progressively corrupt a symbol-block's characters before it fades -- */
  _erodeBlock(el) {
    const chars = el.textContent.split('');
    // Collect indices of non-newline characters
    const mutable = [];
    chars.forEach((c, i) => { if (c !== '\n') mutable.push(i); });

    // Shuffle indices (Fisher-Yates)
    for (let i = mutable.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [mutable[i], mutable[j]] = [mutable[j], mutable[i]];
    }

    let step = 0;
    const batchSize = Math.ceil(mutable.length / 14);
    const iv = setInterval(() => {
      for (let b = 0; b < batchSize && step < mutable.length; b++, step++) {
        chars[mutable[step]] = Math.random() < 0.45
          ? ' '
          : String.fromCharCode(randInt(33, 47)); // punctuation noise
      }
      el.textContent = chars.join('');
      if (step >= mutable.length) clearInterval(iv);
    }, 35);
  },

  /* -- Creative exit: shape shatters + zoom-through tunnel into hero -- */
  exit() {
    clearInterval(this._glitchInterval);

    if (typeof gsap === 'undefined') {
      document.getElementById('loader').style.display = 'none';
      const sw = document.getElementById('site-wrapper');
      sw.style.opacity = '1'; sw.style.visibility = 'visible';
      heroAnimations.play();
      this.cleanup();
      return;
    }

    // Erode ASCII symbol blocks in background
    setTimeout(() => {
      document.querySelectorAll('.symbol-block').forEach(el => this._erodeBlock(el));
    }, 60);

    const tl = gsap.timeline({ onComplete: () => this.cleanup() });

    // ── Phase A (0–0.3s): peripheral UI strips away ──
    tl.to('#loader-label', { opacity: 0, y: -14, duration: 0.2 }, 0.0);
    tl.to('.symbol-block', { opacity: 0, duration: 0.25, stagger: 0.06 }, 0.0);

    // Rain numbers — stream toward the center like being sucked into a portal
    const cx = window.innerWidth  * 0.5;
    const cy = window.innerHeight * 0.5;
    const rainNums = this.rainEl ? this.rainEl.querySelectorAll('.rain-num') : [];
    if (rainNums.length) {
      gsap.to(rainNums, {
        x: (i, el) => (cx - parseFloat(el.style.left || '50%') / 100 * window.innerWidth)  * randFloat(0.05, 0.18),
        y: (i, el) => (cy - parseFloat(el.style.top  || '50%') / 100 * window.innerHeight) * randFloat(0.05, 0.18),
        opacity: 0,
        scale: 0,
        duration: () => randFloat(0.35, 0.65),
        stagger: { amount: 0.3, from: 'random' },
        ease: 'power3.in',
      });
    }

    // ── Phase B (0.25–0.7s): 3D shape explodes outward — shards fly to edges ──
    if (this.threeScene) {
      const ts = this.threeScene;

      // Spin faster — spinning apart as it breaks
      tl.to(ts, { spinMultiplier: 12, duration: 0.45, ease: 'power3.in' }, 0.22);

      // Outer cage shatters — flies outward and fades
      tl.to(ts.ico.scale,  { x: 3.5, y: 3.5, z: 3.5, duration: 0.38, ease: 'power2.out' }, 0.28);
      tl.to(ts.matIco,     { opacity: 0, duration: 0.38, ease: 'power1.in' }, 0.28);
      tl.to(ts.inner.scale,{ x: 0, y: 0, z: 0, duration: 0.3, ease: 'power3.in' }, 0.28);

      // Inner octahedron launches forward (zooms into camera)
      tl.to(ts.oct.position, { z: 8, duration: 0.45, ease: 'power3.in' }, 0.30);
      tl.to(ts.matOct, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.42);

      // Node edges scatter — different axes per group
      tl.to(ts.edges.scale, { x: 4, y: 4, z: 4, duration: 0.4, ease: 'expo.out' }, 0.26);
      tl.to(ts.edgeMat,     { opacity: 0, duration: 0.32, ease: 'power1.in' }, 0.30);
      tl.to(ts.nodePts.scale,{ x: 5, y: 5, z: 5, duration: 0.42, ease: 'expo.out' }, 0.24);
      tl.to(ts.nodeMat,     { opacity: 0, duration: 0.3, ease: 'power1.in' }, 0.32);

      // Background particles scatter outward then vanish
      tl.to(ts.particles.scale, { x: 3, y: 3, z: 3, duration: 0.55, ease: 'power2.out' }, 0.2);
      tl.to(ts.ptMat,           { opacity: 0, duration: 0.4, ease: 'power1.in' }, 0.3);
    }

    // ── Phase C (0.32–0.72s): percent number zooms toward viewer then bursts ──
    if (this.percentEl) this.percentEl.textContent = '100';
    tl.to('#loader-percent', {
      scale: 14,
      opacity: 0,
      duration: 0.42,
      ease: 'power3.in',
      transformOrigin: '50% 50%',
    }, 0.32);

    // ── Phase D (0.55–0.80s): hero warp arrive — zoom in from deep space ──
    // Prime the canvas in an over-zoomed blurry state just before it becomes visible,
    // then tween scale+blur back to normal so it feels like arriving at warp speed.
    tl.set('#site-wrapper', { opacity: 1, visibility: 'visible' }, 0.58);
    tl.set('#hero-canvas',  { scale: 2.6, filter: 'blur(18px)', opacity: 0 }, 0.58);
    tl.to('#hero-canvas',   {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.85,
      ease: 'power3.out',
      transformOrigin: '50% 50%',
    }, 0.62);
    tl.to('#loader-canvas', { opacity: 0, duration: 0.32, ease: 'power1.in' }, 0.60);
    tl.to('#loader .scanlines', { opacity: 0, duration: 0.12 }, 0.58);
    tl.to('#loader', { opacity: 0, duration: 0.4, ease: 'power1.in' }, 0.62);

    // Hero text starts as scene settles
    tl.call(() => heroAnimations.play(), null, 0.88);
  },

  /* -- Animate the % counter up to 100 then exit -- */
  animateProgress() {
    const duration = 2800; // ms — feel of a real boot
    const start    = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const rawT    = clamp(elapsed / duration, 0, 1);

      // Ease-out cubic for most of the range, then stall at 99 briefly
      const eased = rawT < 0.95
        ? 1 - Math.pow(1 - (rawT / 0.95), 3)
        : 1;

      const displayed = Math.floor(eased * 100);
      this.progress = displayed;

      if (this.percentEl) {
        this.percentEl.textContent = displayed;
        // Occasional one-frame glitch on the number
        if (Math.random() < 0.05) {
          const fake = randInt(Math.max(0, displayed - 20), Math.min(100, displayed + 20));
          this.percentEl.textContent = fake;
          setTimeout(() => { this.percentEl.textContent = displayed; }, 60);
        }
      }

      if (rawT < 1) {
        requestAnimationFrame(tick);
      } else {
        // Show 100 cleanly, brief pause then exit
        if (this.percentEl) this.percentEl.textContent = '100';
        setTimeout(() => this.exit(), 220);
      }
    };

    requestAnimationFrame(tick);
  },

  /* -- Remove loader DOM and dispose Three.js resources -- */
  cleanup() {
    // Remove loader DOM to free memory
    if (this.threeScene) {
      cancelAnimationFrame(this.animFrame);
      this.threeScene.renderer.dispose();
    }
    if (this.el) this.el.remove();
  },
};

/* ============================================================
   4. HERO — Three.js particle field + cursor parallax
============================================================ */
const heroScene = {
  renderer: null,
  scene:    null,
  camera:   null,
  mouse:       { x: 0, y: 0 },
  targetMouse: { x: 0, y: 0 },
  _tmp: null,   // reusable Vector3 for planet positioning

  init() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const w = window.innerWidth, h = window.innerHeight;
    const isMobile = w < 768;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);

    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);
    this.camera.position.z = 6;
    this._tmp   = new THREE.Vector3();

    // ── 1. Sparse star field ──
    const starCount = isMobile ? 180 : 340;
    const starPos   = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i*3]   = randFloat(-18, 18);
      starPos[i*3+1] = randFloat(-11, 11);
      starPos[i*3+2] = randFloat(-6, 0);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, transparent: true, opacity: 0.4 });
    const stars   = new THREE.Points(starGeo, starMat);
    this.scene.add(stars);

    // ── 2. Central core — icosahedron wireframe (the "sun") ──
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, wireframe: true, transparent: true, opacity: 0.22,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    this.scene.add(core);

    // ── 3. Orbital paths + planets ──
    // Each orbit: radius, tilt around X, tilt around Z, planet start angle, speed
    const orbitDefs = [
      { r: 1.55, tx:  Math.PI * 0.12, tz:  Math.PI * 0.03, a0: 0,              spd: 0.0088 },
      { r: 2.20, tx:  Math.PI * 0.24, tz:  Math.PI * 0.07, a0: Math.PI * 0.7,  spd: 0.0052 },
      { r: 4, tx:  Math.PI * 0.04, tz:  Math.PI * 0.9, a0: Math.PI * -0.35,    spd: 0.0008 },
      { r: 3.40, tx:  Math.PI * 0.08, tz:  Math.PI * 0.16, a0: Math.PI * 1.35, spd: 0.0028 },
      { r: 2, tx:  Math.PI * 0.04, tz:  Math.PI * 0.7, a0: Math.PI * 0.67, spd: 0.0028 },
    ];

    this._planets = orbitDefs.map(def => {
      // Draw circular orbit path in its tilted plane
      const pts = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * def.r, 0, Math.sin(a) * def.r));
      }
      const oGeo  = new THREE.BufferGeometry().setFromPoints(pts);
      const oMat  = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.065 });
      const orbit = new THREE.LineLoop(oGeo, oMat);
      orbit.rotation.x = def.tx;
      orbit.rotation.z = def.tz;
      this.scene.add(orbit);

      // Planet dot
      const pGeo  = new THREE.SphereGeometry(0.055, 8, 8);
      const pMat  = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
      const planet = new THREE.Mesh(pGeo, pMat);
      this.scene.add(planet);

      return {
        mesh:  planet,
        r:     def.r,
        euler: new THREE.Euler(def.tx, 0, def.tz),
        angle: def.a0,
        spd:   def.spd,
      };
    });

    this.shapes = { core, stars };
    this.animate();
    this._spawnFloatingNumbers();
    this._spawnStarCoordinates();

    window.addEventListener('resize',    () => this.onResize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      this.targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
  },

  /* Spawn faintly drifting ASCII number fragments over the hero canvas */
  _spawnFloatingNumbers() {
    const heroEl = document.getElementById('hero');
    if (!heroEl || typeof gsap === 'undefined') return;

    const container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden;';
    heroEl.appendChild(container);

    const fragments = [
      '01001101', '3.14159', '0xFFFF', '1.61803',
      '// NULL', '2.71828', '0b1010', '6.28318',
      '> 9.81',  '0x00FF',  '1.41421', '360.00',
      '// SYS',  '0.00001', '255:255', '> INIT',
    ];

    const count = window.innerWidth < 768 ? 7 : 13;
    for (let i = 0; i < count; i++) {
      const span   = document.createElement('span');
      span.textContent = fragments[i % fragments.length];
      const baseOpacity = randFloat(0.07, 0.14);
      span.style.cssText = [
        'position:absolute',
        `left:${randFloat(4, 88)}%`,
        `top:${randFloat(8, 88)}%`,
        `font-family:var(--ff-mono)`,
        `font-size:${randFloat(10, 13)}px`,
        `color:rgba(255,255,255,${baseOpacity.toFixed(2)})`,
        'letter-spacing:0.1em',
        'user-select:none',
        'white-space:nowrap',
      ].join(';');
      container.appendChild(span);

      // Gentle independent drift
      gsap.to(span, {
        y:        randFloat(-22, 22),
        x:        randFloat(-14, 14),
        duration: randFloat(10, 22),
        repeat:   -1,
        yoyo:     true,
        delay:    randFloat(0, 8),
        ease:     'sine.inOut',
      });
      // Slow opacity breathe
      gsap.to(span, {
        opacity:  randFloat(0.03, baseOpacity * 1.6),
        duration: randFloat(4, 9),
        repeat:   -1,
        yoyo:     true,
        delay:    randFloat(0, 5),
        ease:     'power1.inOut',
      });
    }
  },

  /* Spawn faint star-coordinate labels (dot/cross + RA-Dec text) around the edges */
  _spawnStarCoordinates() {
    const heroEl = document.getElementById('hero');
    if (!heroEl || typeof gsap === 'undefined') return;

    const container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden;';
    heroEl.appendChild(container);

    const coords = [
      "RA 14h 29m  Dec +02\u00b053'",  '\u03b1 047.3\u00b0 \u00b7 \u03b4 +12.4\u00b0',
      '[134.6, \u221208.1]',           '\u03b1 312.8\u00b0 \u00b7 \u03b4 \u221244.2\u00b0',
      "RA 06h 12m  Dec \u221217\u00b040'",  '[028.9, +61.3]',
      '\u03b1 198.4\u00b0 \u00b7 \u03b4 +05.7\u00b0',  "RA 22h 55m  Dec +08\u00b019'",
      '[267.1, \u221233.8]',           '\u03b1 083.6\u00b0 \u00b7 \u03b4 +22.0\u00b0',
      "RA 18h 36m  Dec \u221229\u00b000'",  '[351.2, +47.5]',
    ];

    // Positions around the edges — avoid the centre where the solar system lives
    const positions = [
      [6, 10],  [80, 8],  [12, 78], [82, 75],
      [38, 6],  [62, 88], [3, 42],  [90, 38],
      [48, 3],  [20, 90], [72, 12], [88, 62],
    ];

    const count = window.innerWidth < 768 ? 5 : positions.length;

    for (let i = 0; i < count; i++) {
      const [lPct, tPct] = positions[i];
      const baseOp   = randFloat(0.09, 0.18);
      const useCross = (i % 3 === 1); // alternate dot vs crosshair marker

      const wrap = document.createElement('div');
      wrap.style.cssText = [
        'position:absolute',
        `left:${lPct}%`,
        `top:${tPct}%`,
        'display:flex',
        'align-items:center',
        'gap:5px',
        `opacity:${baseOp.toFixed(2)}`,
      ].join(';');

      const marker = document.createElement('span');
      if (useCross) {
        marker.textContent = '+';
        marker.style.cssText = 'font-family:var(--ff-mono);font-size:9px;color:#fff;line-height:1;flex-shrink:0;';
      } else {
        marker.style.cssText = 'display:inline-block;width:3px;height:3px;border-radius:50%;background:#fff;flex-shrink:0;margin-top:1px;';
      }

      const label = document.createElement('span');
      label.textContent = coords[i % coords.length];
      label.style.cssText = [
        'font-family:var(--ff-mono)',
        `font-size:${randFloat(8, 10).toFixed(1)}px`,
        'color:#fff',
        'letter-spacing:0.06em',
        'white-space:nowrap',
        'user-select:none',
      ].join(';');

      wrap.appendChild(marker);
      wrap.appendChild(label);
      container.appendChild(wrap);

      // Slow independent drift
      gsap.to(wrap, {
        y: randFloat(-12, 12),
        x: randFloat(-6, 6),
        duration: randFloat(16, 32),
        repeat: -1, yoyo: true,
        delay: randFloat(0, 12),
        ease: 'sine.inOut',
      });
      // Appear → hold → disappear cycle (start hidden)
      gsap.set(wrap, { opacity: 0 });
      gsap.timeline({ repeat: -1, delay: randFloat(0, 20) })
        .to(wrap, { opacity: Math.min(baseOp * 2.2, 0.42), duration: randFloat(1.2, 2.5), ease: 'power2.in' })
        .to(wrap, { opacity: 0, duration: randFloat(1.0, 2.0), ease: 'power2.out', delay: randFloat(4, 14) })
        .to(wrap, { duration: randFloat(6, 18) }); // dark pause before next cycle
    }
  },

  animate() {
    requestAnimationFrame(() => this.animate());
    const t = Date.now() * 0.001;

    // Smooth camera parallax
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.04;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.04;
    this.camera.position.x = this.mouse.x * 0.22;
    this.camera.position.y = this.mouse.y * 0.14;
    this.camera.lookAt(0, -0.20, 0); // offset centres system above nav bar

    if (this.shapes) {
      const { core, stars } = this.shapes;
      core.rotation.y  += 0.0020;
      core.rotation.x  += 0.0009;
      const pulse = 1 + Math.sin(t * 0.42) * 0.022;
      core.scale.setScalar(pulse);
      stars.rotation.y += 0.00016;
    }

    // Advance each planet along its tilted orbit
    if (this._planets && this._tmp) {
      this._planets.forEach(p => {
        p.angle += p.spd;
        this._tmp.set(
          Math.cos(p.angle) * p.r,
          0,
          Math.sin(p.angle) * p.r
        );
        this._tmp.applyEuler(p.euler);
        p.mesh.position.copy(this._tmp);
      });
    }

    this.renderer.render(this.scene, this.camera);
  },

  onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  },
};

/* ============================================================
   5. HERO ANIMATIONS — GSAP text reveal after loader
============================================================ */
const heroAnimations = {
  play() {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#';

    // Set initial states BEFORE the timeline runs
    gsap.set(['.hero-eyebrow', '.hero-name', '.hero-tagline', '.hero-cta'], { opacity: 0, y: 24 });
    gsap.set('.hud-corner', { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Eyebrow fades in first
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0.15);

    // Hero name: simultaneous scramble-reveal + fade-in (tightened to 16 frames × 45ms)
    tl.add(() => {
      const nameEl = document.querySelector('.hero-name');
      if (!nameEl) return;
      const original = nameEl.getAttribute('data-text') || nameEl.textContent;
      let frame = 0, maxFrames = 16;
      const iv = setInterval(() => {
        frame++;
        nameEl.textContent = original.split('').map((ch, i) => {
          if (ch === ' ' || ch === '.') return ch;
          return frame / maxFrames > i / original.length
            ? ch : CHARS[randInt(0, CHARS.length - 1)];
        }).join('');
        if (frame >= maxFrames) { clearInterval(iv); nameEl.textContent = original; }
      }, 45);
    }, 0.5);

    tl.to('.hero-name',    { opacity: 1, y: 0, duration: 0.85 }, 0.5);
    tl.to('.hero-tagline', { opacity: 1, y: 0, duration: 0.65 }, 1.0);
    tl.to('.hero-cta',     { opacity: 1, y: 0, duration: 0.55 }, 1.45);
    tl.to('.hud-corner',   { opacity: 1, duration: 0.5  },        1.75);
  },
};

/* ============================================================
   6. NAVIGATION
============================================================ */
const nav = {
  init() {
    const navEl    = document.getElementById('nav');
    const burger   = document.getElementById('hamburger');
    const drawer   = document.getElementById('mobile-drawer');
    const links    = document.querySelectorAll('.nav-links a');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    // Scroll-based sticky style
    window.addEventListener('scroll', () => {
      navEl.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Mobile menu toggle
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      drawer.classList.toggle('open', isOpen);
      drawer.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer on link click
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', true);
        document.body.style.overflow = '';
      });
    });

    // Active nav link on scroll (IntersectionObserver)
    const sections = document.querySelectorAll('section[id]');
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            links.forEach(a => {
              a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(s => io.observe(s));
  },
};

/* ============================================================
   7. CURSOR — dot (immediate) + lagged ring + ambient glow
   Works by:
    · #cursor-dot  snaps each mousemove frame via style
    · #cursor-ring lerps toward the target in rAF loop (~12% per frame)
    · Hover state expands the ring and shrinks the dot
    · Mousedown pulses the ring inward then back
============================================================ */
const cursor = {
  dot:       null,
  ring:      null,
  target:    { x: 0, y: 0 },
  ringPos:   { x: 0, y: 0 },
  _raf:      null,
  _enabled:  false,

  init() {
    // No custom cursor on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    this.dot  = document.getElementById('cursor-dot');
    this.ring = document.getElementById('cursor-ring');
    if (!this.dot || !this.ring) return;

    this._enabled = true;

    // Hide cursor elements until first mouse move (avoid top-left flash)
    this.dot.style.opacity  = '0';
    this.ring.style.opacity = '0';

    window.addEventListener('mousemove', (e) => {
      const x = e.clientX, y = e.clientY;
      this.target.x = x;
      this.target.y = y;

      // Dot snaps immediately
      this.dot.style.left = `${x}px`;
      this.dot.style.top  = `${y}px`;

      // First move — reveal
      if (this.dot.style.opacity === '0') {
        this.dot.style.opacity  = '1';
        this.ring.style.opacity = '1';
        this.ringPos.x = x;
        this.ringPos.y = y;
      }
    }, { passive: true });

    // Lerp ring toward target in animation loop
    this._startLoop();

    // Hover expansion over interactive elements
    const hoverSel = 'a, button, input, textarea, select, .project-card, .skill-card, .filter-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSel)) {
        this.dot .classList.add('hovering');
        this.ring.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSel)) {
        this.dot .classList.remove('hovering');
        this.ring.classList.remove('hovering');
      }
    });

    // Click pulse
    document.addEventListener('mousedown', () => {
      this.ring.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
      this.ring.classList.remove('clicking');
    });
  },

  _startLoop() {
    const tick = () => {
      this._raf = requestAnimationFrame(tick);
      if (!this._enabled) return;

      // Exponential lerp — smooth lag without overshoot
      const lf = 0.13;
      this.ringPos.x += (this.target.x - this.ringPos.x) * lf;
      this.ringPos.y += (this.target.y - this.ringPos.y) * lf;

      this.ring.style.left = `${this.ringPos.x}px`;
      this.ring.style.top  = `${this.ringPos.y}px`;
    };
    tick();
  },
};

/* ============================================================
   8. SKILLS SECTION
============================================================ */
const skills = {
  init() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    // Populate skill cards
    DATA.skills.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.innerHTML = `
        <span class="skill-icon">${skill.icon}</span>
        <span class="skill-name">${skill.name}</span>
        <span class="skill-level">${skill.level}</span>
      `;
      grid.appendChild(card);
    });

    // Populate ASCII background
    const asciiBg = document.querySelector('#skills .ascii-bg');
    if (asciiBg) {
      const chars = '01010 ++++ ||||| ::::: ##### ~~~~~ ====== ......';
      let content = '';
      for (let r = 0; r < 40; r++) {
        let line = '';
        for (let c = 0; c < 60; c++) {
          line += chars[randInt(0, chars.length - 1)];
        }
        content += line + '\n';
      }
      asciiBg.textContent = content;
    }

    // Scroll-in animations via GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const cards = grid.querySelectorAll('.skill-card');
      cards.forEach((card, i) => {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.55,
          delay: (i % 4) * 0.07,  // stagger by column
          ease: 'power3.out',
          onStart() {
            // Brief glitch on entry
            card.style.filter = 'brightness(2) saturate(0)';
            setTimeout(() => { card.style.filter = ''; }, 120);
          },
        });
      });
    }
  },
};

/* ============================================================
   9. HISTORY / TIMELINE
============================================================ */
const history = {
  init() {
    const container = document.getElementById('timeline');
    if (!container) return;

    DATA.timeline.forEach(item => {
      const el = document.createElement('div');
      el.className = 'timeline-item';
      el.innerHTML = `
        <p class="timeline-date monospace">${item.date}</p>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-org monospace">${item.org}</p>
        <p class="timeline-desc">${item.desc}</p>
      `;
      container.appendChild(el);
    });

    // Scroll animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const items = container.querySelectorAll('.timeline-item');
      items.forEach((item, i) => {
        gsap.to(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: i * 0.08,
          ease: 'power3.out',
          onStart() {
            item.classList.add('revealed');
          },
        });
      });
    }
  },
};

/* ============================================================
   10. PROJECTS — render, filter, search
============================================================ */
const projects = {
  all: [],
  currentFilter: 'all',
  searchQuery: '',

  init() {
    this.all = DATA.projects;
    this.renderAll(this.all);
    this.bindFilter();
    this.bindSearch();
    this.bindScrollAnimations();
  },

  renderAll(list) {
    const grid = document.getElementById('projects-grid');
    const noResults = document.getElementById('no-results');
    if (!grid) return;

    grid.innerHTML = '';

    if (list.length === 0) {
      noResults.style.display = 'block';
      return;
    }
    noResults.style.display = 'none';

    list.forEach((project, i) => {
      const card = this.buildCard(project);
      grid.appendChild(card);

      // Scroll-in animation
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          y: 0,
          duration: 0.55,
          delay: (i % 3) * 0.08,
          ease: 'power3.out',
          onStart() {
            // Mini glitch flash on card entry
            card.style.filter = 'brightness(2)';
            setTimeout(() => { card.style.filter = ''; }, 80);
            // Scramble the project title on card reveal
            const titleEl = card.querySelector('.project-title');
            if (titleEl) {
              const orig = titleEl.textContent;
              const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!';
              let frame = 0, maxFrames = 10;
              const iv = setInterval(() => {
                frame++;
                titleEl.textContent = orig.split('').map((ch, i) =>
                  ch === ' ' ? ' ' : frame / maxFrames > i / orig.length
                    ? ch : CHARS[randInt(0, CHARS.length - 1)]
                ).join('');
                if (frame >= maxFrames) { clearInterval(iv); titleEl.textContent = orig; }
              }, 45);
            }
          },
        });
      } else {
        // Fallback: show immediately
        card.style.opacity = '1';
        card.style.transform = 'none';
      }
    });
  },

  buildCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.dataset.category = project.category;
    card.dataset.title    = project.title.toLowerCase();
    card.dataset.desc     = project.desc.toLowerCase();

    // Thumbnail
    const thumbHtml = project.thumb
      ? `<img src="${project.thumb}" alt="${project.title} preview" loading="lazy" />`
      : `<div class="project-thumb-placeholder">${project.title.charAt(0)}</div>`;

    // Tech stack tags
    const stackHtml = project.stack
      .map(s => `<span class="stack-tag">${s}</span>`)
      .join('');

    // Action buttons
    const linksHtml = [
      project.demo   ? `<a href="${project.demo}"   class="project-link primary"    target="_blank" rel="noopener noreferrer">Live Demo</a>`   : '',
      project.github ? `<a href="${project.github}" class="project-link secondary"  target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
    ].filter(Boolean).join('');

    card.innerHTML = `
      <div class="project-thumb">${thumbHtml}</div>
      <div class="project-body">
        <p class="project-category monospace">${project.category}</p>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.desc}</p>
        <div class="project-stack">${stackHtml}</div>
        <div class="project-links">${linksHtml}</div>
      </div>
    `;

    return card;
  },

  filter() {
    let list = this.all;

    if (this.currentFilter !== 'all') {
      list = list.filter(p => p.category === this.currentFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)  ||
        p.stack.some(s => s.toLowerCase().includes(q))
      );
    }

    this.renderAll(list);
  },

  bindFilter() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.filter();
      });
    });
  },

  bindSearch() {
    const input = document.getElementById('project-search');
    if (!input) return;
    input.addEventListener('input', () => {
      this.searchQuery = input.value;
      this.filter();
    });
  },

  bindScrollAnimations() {
    // Initial scroll-trigger set up is handled in renderAll per card.
    // Section header animation
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.from('#projects .section-header', {
        scrollTrigger: { trigger: '#projects', start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
      });
    }
  },
};

/* ============================================================
   11. CONTACT FORM
============================================================ */
const contact = {
  init() {
    const form   = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.validate(form)) return;

      const label    = form.querySelector('.btn-label');
      const sending  = form.querySelector('.btn-sending');
      const submitBtn = form.querySelector('.form-submit');

      // Simulate sending
      label.style.display  = 'none';
      sending.style.display = 'inline';
      submitBtn.disabled   = true;

      setTimeout(() => {
        label.style.display   = 'inline';
        sending.style.display  = 'none';
        submitBtn.disabled    = false;
        status.textContent    = '// Message transmitted successfully.';
        status.className      = 'form-status success';
        form.reset();
        // Clear after 5s
        setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
      }, 1600);
    });
  },

  validate(form) {
    const status = document.getElementById('form-status');
    let valid = true;

    ['name', 'email', 'message'].forEach(id => {
      const el = form.querySelector(`#${id}`);
      if (!el) return;
      el.classList.remove('error');
      if (!el.value.trim()) {
        el.classList.add('error');
        valid = false;
      }
    });

    const emailEl = form.querySelector('#email');
    if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.classList.add('error');
      valid = false;
    }

    if (!valid) {
      status.textContent = '// Required fields missing or invalid.';
      status.className   = 'form-status error';
    } else {
      status.textContent = '';
      status.className   = 'form-status';
    }

    return valid;
  },
};

/* ============================================================
   12. SCROLL ANIMATIONS — section headers + contact + scramble reveals
============================================================ */
const scrollAnimations = {
  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // ── Section headers ──
    document.querySelectorAll('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power3.out',
      });
    });

    // ── Skill card text scramble on entry ──
    // Each skill name glitches through random chars before settling
    document.querySelectorAll('.skill-card').forEach(card => {
      const nameEl = card.querySelector('.skill-name');
      if (!nameEl) return;
      const original = nameEl.textContent;
      const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!';

      ScrollTrigger.create({
        trigger: card,
        start:   'top 90%',
        once:    true,
        onEnter: () => {
          let frame = 0;
          const maxFrames = 14;
          const iv = setInterval(() => {
            frame++;
            nameEl.textContent = original
              .split('')
              .map((ch, i) => {
                if (ch === ' ') return ' ';
                return frame / maxFrames > i / original.length
                  ? ch
                  : CHARS[randInt(0, CHARS.length - 1)];
              })
              .join('');
            if (frame >= maxFrames) {
              clearInterval(iv);
              nameEl.textContent = original;
            }
          }, 45);
        },
      });
    });

    // ── Timeline item text scramble on entry ──
    document.querySelectorAll('.timeline-title').forEach(el => {
      const original = el.textContent;
      const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01';
      ScrollTrigger.create({
        trigger: el,
        start:   'top 88%',
        once:    true,
        onEnter: () => {
          let frame = 0;
          const maxFrames = 12;
          const iv = setInterval(() => {
            frame++;
            el.textContent = original
              .split('')
              .map((ch, i) => {
                if (ch === ' ') return ' ';
                return frame / maxFrames > i / original.length
                  ? ch
                  : CHARS[randInt(0, CHARS.length - 1)];
              })
              .join('');
            if (frame >= maxFrames) { clearInterval(iv); el.textContent = original; }
          }, 40);
        },
      });
    });

    // ── Section tag line reveals (section-tag monospace labels) ──
    document.querySelectorAll('.section-tag').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
        opacity: 0,
        x: -20,
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    // ── Section titles scramble in on first reveal ──
    document.querySelectorAll('.section-title').forEach(el => {
      const original = el.textContent;
      const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01#!';
      ScrollTrigger.create({
        trigger: el,
        start:   'top 88%',
        once:    true,
        onEnter: () => {
          let frame = 0;
          const maxFrames = 20;
          const iv = setInterval(() => {
            frame++;
            el.textContent = original.split('').map((ch, i) => {
              if (ch === ' ' || ch === '&' || ch === '/') return ch;
              return frame / maxFrames > i / original.length
                ? ch : CHARS[randInt(0, CHARS.length - 1)];
            }).join('');
            if (frame >= maxFrames) { clearInterval(iv); el.textContent = original; }
          }, 50);
        },
      });
    });

    // ── Contact section fade-in ──
    gsap.from('#contact .contact-layout', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
    });

    // ── Social links stagger — use 'to' not 'from' to avoid stuck-invisible state ──
    gsap.set('.social-link', { opacity: 0, x: 20 });
    ScrollTrigger.create({
      trigger: '#contact',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to('.social-link', {
          opacity: 1,
          x: 0,
          stagger: 0.12,
          duration: 0.55,
          ease: 'power3.out',
          delay: 0.2,
        });
      },
    });

    // ── Timeline vertical line draw ──
    gsap.from('.timeline::before', {
      scrollTrigger: {
        trigger: '#history',
        start: 'top 70%',
        end:   'bottom 30%',
        scrub: 1,
      },
      scaleY: 0,
      transformOrigin: 'top',
      ease: 'none',
    });
  },
};

/* ============================================================
   13. GLITCH SCANLINE FLICKER — occasional ambient random flicker
============================================================ */
const glitchEffects = {
  init() {
    // Occasional full-screen scanline sweep
    setInterval(() => {
      if (Math.random() < 0.15) { this._scanFlash(); }
    }, 4000);

    // VHS-style horizontal noise lines — subtle, atmospheric
    setInterval(() => {
      if (Math.random() < 0.28) { this._vhsLines(); }
    }, 2200);

    // Brief pixel-shift block — rare, striking
    setInterval(() => {
      if (Math.random() < 0.12) { this._pixelShift(); }
    }, 5500);
  },

  _scanFlash() {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9998;
      pointer-events: none;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0px, transparent 2px,
        rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 3px
      );
      opacity: 0;
    `;
    flash.setAttribute('aria-hidden', 'true');
    document.body.appendChild(flash);

    if (typeof gsap !== 'undefined') {
      gsap.to(flash, {
        opacity: 1, duration: 0.05,
        yoyo: true, repeat: 3,
        onComplete: () => flash.remove(),
      });
    } else {
      setTimeout(() => flash.remove(), 200);
    }
  },

  // Short horizontal VHS noise strips at random Y positions
  _vhsLines() {
    const count = randInt(1, 3);
    for (let i = 0; i < count; i++) {
      const line = document.createElement('div');
      line.style.cssText = `
        position: fixed;
        left: 0; right: 0;
        top: ${randFloat(5, 92)}vh;
        height: ${randFloat(1, 4)}px;
        background: rgba(255,255,255,${randFloat(0.02, 0.07).toFixed(3)});
        pointer-events: none;
        z-index: 9994;
        will-change: opacity;
      `;
      line.setAttribute('aria-hidden', 'true');
      document.body.appendChild(line);
      if (typeof gsap !== 'undefined') {
        gsap.to(line, {
          opacity: 0,
          duration: randFloat(0.06, 0.28),
          ease: 'steps(1)',
          onComplete: () => line.remove(),
        });
      } else {
        setTimeout(() => line.remove(), 300);
      }
    }
  },

  // Brief horizontal block with lateral offset — simulates VHS tape dropout
  _pixelShift() {
    const shiftX = randFloat(-18, 18);
    const block   = document.createElement('div');
    block.style.cssText = `
      position: fixed;
      left: 0; right: 0;
      top: ${randFloat(8, 88)}vh;
      height: ${randFloat(3, 10)}px;
      background: rgba(255,255,255,0.04);
      pointer-events: none;
      z-index: 9993;
      transform: translateX(${shiftX}px);
    `;
    block.setAttribute('aria-hidden', 'true');
    document.body.appendChild(block);
    if (typeof gsap !== 'undefined') {
      gsap.to(block, {
        opacity: 0, x: shiftX + randFloat(-6, 6),
        duration: 0.12, ease: 'steps(2)',
        onComplete: () => block.remove(),
      });
    } else {
      setTimeout(() => block.remove(), 120);
    }
  },
};

/* ============================================================
   14. SIDE LABELS — thin vertical HUD text on viewport edges
   Each section maps to a set of left/right monospace labels.
   They typewriter-in on section enter, fade out on leave.
============================================================ */
const sideLabels = {
  leftEl:  null,
  rightEl: null,
  _typeTimers: [],

  // Per-section label pairs
  MAP: {
    hero:     { l: '// HERO_ONLINE',       r: 'STATUS·ACTIVE'     },
    skills:   { l: '// MODULE_02',          r: 'SCANNING·MODULES'  },
    history:  { l: '// TIMELINE_NODE',      r: 'RETRIEVING·DATA'   },
    projects: { l: '// PROJECT_MATRIX',     r: 'ACCESSING·FILES'   },
    contact:  { l: '// ESTABLISH_LINK',     r: 'AWAITING·INPUT'    },
  },

  init() {
    if (typeof ScrollTrigger === 'undefined' || typeof gsap === 'undefined') return;

    this.leftEl  = this._create('left');
    this.rightEl = this._create('right');
    document.body.appendChild(this.leftEl);
    document.body.appendChild(this.rightEl);

    Object.entries(this.MAP).forEach(([id, labels]) => {
      const section = document.getElementById(id);
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start:   'top 55%',
        end:     'bottom 45%',
        onEnter:      () => this._show(labels.l, labels.r),
        onLeave:      () => this._hide(),
        onEnterBack:  () => this._show(labels.l, labels.r),
        onLeaveBack:  () => this._hide(),
      });
    });
  },

  _create(side) {
    const el = document.createElement('div');
    el.className   = `scroll-side-label scroll-side-label--${side}`;
    el.setAttribute('aria-hidden', 'true');
    return el;
  },

  _show(leftText, rightText) {
    this._clearTimers();
    gsap.to([this.leftEl, this.rightEl], { opacity: 1, duration: 0.3 });
    this.leftEl .classList.add('active');
    this.rightEl.classList.add('active');
    this._type(this.leftEl,  leftText);
    this._type(this.rightEl, rightText);
  },

  _hide() {
    this._clearTimers();
    gsap.to([this.leftEl, this.rightEl], {
      opacity: 0, duration: 0.25,
      onComplete: () => {
        this.leftEl .textContent = '';
        this.rightEl.textContent = '';
        this.leftEl .classList.remove('active');
        this.rightEl.classList.remove('active');
      },
    });
  },

  _type(el, text) {
    el.textContent = '';
    let i = 0;
    const step = () => {
      if (i >= text.length) { el.textContent = text; return; }
      // One-frame glitch char chance
      const ch = Math.random() < 0.18
        ? String.fromCharCode(randInt(33, 90))
        : text[i];
      el.textContent = text.slice(0, i) + ch;
      i++;
      this._typeTimers.push(setTimeout(step, 38 + randInt(0, 25)));
    };
    step();
  },

  _clearTimers() {
    this._typeTimers.forEach(clearTimeout);
    this._typeTimers = [];
  },
};

/* ============================================================
   15. SECTION FLASH — brief ASCII overlay on first section entry
   Gives the "being decoded / hacked" impression as sections appear.
============================================================ */
const sectionFlash = {
  CHARS: '01 +|#~=.:[]{}<>!?/@',

  init() {
    if (typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('section[id]').forEach(section => {
      let done = false;
      ScrollTrigger.create({
        trigger: section,
        start:   'top 78%',
        onEnter: () => {
          if (done) return;
          done = true;
          this._flash(section);
        },
      });
    });
  },

  _flash(section) {
    const overlay = document.createElement('div');
    overlay.className = 'ascii-flash-overlay';

    // Generate random ASCII block
    const rows = 10, cols = 55;
    let content = '';
    for (let r = 0; r < rows; r++) {
      let line = '';
      for (let c = 0; c < cols; c++) {
        line += this.CHARS[randInt(0, this.CHARS.length - 1)];
      }
      content += line + '\n';
    }
    overlay.textContent = content;
    section.appendChild(overlay);

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(overlay,
        { opacity: 0 },
        {
          opacity: 0.1,
          duration: 0.08,
          yoyo: true,
          repeat: 5,
          ease: 'steps(1)',
          onComplete: () => overlay.remove(),
        }
      );
    } else {
      setTimeout(() => overlay.remove(), 400);
    }
  },
};

/* ============================================================
   16. SCAN SWEEP — horizontal light line that sweeps through
   each section on first scroll-in, reinforcing the HUD "scan" feel.
============================================================ */
const scanSweep = {
  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('section[id]').forEach(section => {
      let swept = false;
      ScrollTrigger.create({
        trigger: section,
        start:   'top 75%',
        onEnter: () => {
          if (swept) return;
          swept = true;
          this._sweep(section);
        },
      });
    });
  },

  _sweep(section) {
    const line = document.createElement('div');
    line.className = 'scan-sweep-line';
    section.appendChild(line);

    gsap.fromTo(line,
      { top: '0%',   opacity: 0.7 },
      { top: '100%', opacity: 0,
        duration: 1.0,
        ease: 'power1.inOut',
        onComplete: () => line.remove(),
      }
    );
  },
};

/* ============================================================
   17. HACK-STYLE SCROLL TEXT — side floating labels that appear
   momentarily at the scroll position as the user passes sections,
   giving the impression of a system "rendering" the page data.
============================================================ */
const hackScroll = {
  PHRASES: [
    '> LOADING_ASSET...',
    '> DECRYPT_SEQUENCE',
    '> MODULE_ONLINE',
    '> RENDERING_DATA',
    '> SYNC_COMPLETE',
    '> ACCESS_GRANTED',
    '> INIT_SUBSYSTEM',
    '> BUFFER_FLUSH',
  ],
  _last: -1,

  init() {
    if (typeof gsap === 'undefined') return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (Math.random() < 0.3) this._spawnPhrase();
        ticking = false;
      });
    }, { passive: true });
  },

  _spawnPhrase() {
    // Pick a phrase (not the same as last)
    let idx;
    do { idx = randInt(0, this.PHRASES.length - 1); } while (idx === this._last);
    this._last = idx;

    const el = document.createElement('div');
    const onLeft = Math.random() < 0.5;

    el.style.cssText = `
      position: fixed;
      top: ${randFloat(20, 75)}vh;
      ${onLeft ? 'left: clamp(8px, 2vw, 32px)' : 'right: clamp(8px, 2vw, 32px)'};
      font-family: var(--ff-mono, monospace);
      font-size: 0.58rem;
      letter-spacing: 0.18em;
      color: rgba(255,255,255,0.18);
      pointer-events: none;
      z-index: 300;
      opacity: 0;
      white-space: nowrap;
      user-select: none;
    `;
    el.setAttribute('aria-hidden', 'true');
    el.textContent = this.PHRASES[idx];
    document.body.appendChild(el);

    gsap.to(el, {
      opacity: 1, duration: 0.15,
      onComplete: () => {
        gsap.to(el, {
          opacity: 0, duration: 0.4, delay: 0.6,
          onComplete: () => el.remove(),
        });
      },
    });
  },
};

/* ============================================================
   18. CLICK RIPPLE — radial burst of ASCII chars + expanding
   rings on every click, giving a "digital pool ripple" feel.
============================================================ */
const clickRipple = {
  CHARS: '01!@#%^*<>[]{}|~;:,./?',

  init() {
    document.addEventListener('click', (e) => {
      // Skip clicks inside form controls to avoid disrupting input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      this._spawn(e.clientX, e.clientY);
    });
  },

  _spawn(x, y) {
    const wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = [
      'position:fixed',
      `left:${x}px`,
      `top:${y}px`,
      'width:0;height:0',
      'pointer-events:none',
      'z-index:9500',
    ].join(';');
    document.body.appendChild(wrap);

    // Text characters only — radial burst, no rings
    const charCount = 14;
    for (let i = 0; i < charCount; i++) {
      const ch    = document.createElement('span');
      ch.textContent = this.CHARS[randInt(0, this.CHARS.length - 1)];
      const angle = (i / charCount) * Math.PI * 2 + randFloat(-0.2, 0.2);
      const dist  = randFloat(38, 110);
      ch.style.cssText = [
        'position:absolute',
        `font-family:var(--ff-mono)`,
        `font-size:${randFloat(10, 15)}px`,
        `color:rgba(255,255,255,${randFloat(0.3, 0.55).toFixed(2)})`,
        'top:0;left:0',
        'transform:translate(-50%,-50%)',
        'white-space:nowrap',
        'user-select:none',
      ].join(';');
      wrap.appendChild(ch);
      if (typeof gsap !== 'undefined') {
        gsap.to(ch, {
          x:        Math.cos(angle) * dist,
          y:        Math.sin(angle) * dist,
          opacity:  0,
          scale:    randFloat(0.6, 1.3),
          duration: randFloat(0.5, 0.95),
          delay:    randFloat(0, 0.06),
          ease:     'power2.out',
        });
      }
    }
    setTimeout(() => wrap.remove(), 1100);
  },
};

/* ============================================================
   19. HOVER GLITCH — brief character scramble on hover over
   interactive text elements, giving dynamic "hacked" feedback.
============================================================ */
const hoverGlitch = {
  CHARS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!',

  init() {
    if (window.matchMedia('(hover: none)').matches) return;

    const sel = '.skill-name, .project-title, .nav-links a, .timeline-title';
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest(sel);
      if (!el || el.dataset.glitching) return;
      this._glitch(el);
    });
  },

  _glitch(el) {
    const original = el.textContent.trim();
    if (!original || original.length > 45) return;

    el.dataset.glitching = '1';
    let frame = 0;
    const maxFrames = 7;
    const iv = setInterval(() => {
      frame++;
      el.textContent = original.split('').map((ch, i) => {
        if (ch === ' ' || ch === '/' || ch === '.') return ch;
        return frame / maxFrames > i / original.length
          ? ch : this.CHARS[randInt(0, this.CHARS.length - 1)];
      }).join('');
      if (frame >= maxFrames) {
        clearInterval(iv);
        el.textContent = original;
        delete el.dataset.glitching;
      }
    }, 38);
  },
};

/* ============================================================
   20. EASTER EGG — hidden interactions:
   · Konami code (↑↑↓↓←→←→BA): SYSTEM_OVERLOAD animation
   · Five rapid clicks on nav logo: ACCESS_GRANTED message
============================================================ */
const easterEgg = {
  KONAMI: ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
           'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'],
  _seq:        [],
  _clickCount: 0,
  _clickTimer: null,
  _active:     false,

  init() {
    // Konami key sequence detector
    document.addEventListener('keydown', (e) => {
      this._seq.push(e.key);
      if (this._seq.length > this.KONAMI.length) this._seq.shift();
      if (this._seq.join(',') === this.KONAMI.join(',')) {
        this._seq = [];
        this._fire('KONAMI');
      }
    });

    // Five rapid clicks on logo within 1.5 s
    const logo = document.querySelector('.nav-logo');
    if (logo) {
      logo.addEventListener('click', () => {
        this._clickCount++;
        clearTimeout(this._clickTimer);
        this._clickTimer = setTimeout(() => { this._clickCount = 0; }, 1500);
        if (this._clickCount >= 5) { this._clickCount = 0; this._fire('RAPID'); }
      });
    }
  },

  _fire(type) {
    if (this._active) return;
    this._active = true;
    const overlay = document.getElementById('easter-overlay');
    if (!overlay) { this._active = false; return; }

    const msgs = {
      KONAMI: '> KONAMI_SEQUENCE_DETECTED\n> ACCESS_LEVEL: ADMINISTRATOR\n> UNLOCKING_HIDDEN_LAYER...',
      RAPID:  '> PERSISTENCE.exe DETECTED\n> EASTER_EGG_UNLOCKED\n> WELCOME_TO_THE_VOID',
    };
    overlay.textContent = this._asciiBox(msgs[type] || msgs.RAPID);

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => {
          overlay.textContent = '';
          gsap.set(overlay, { opacity: 0 });
          this._active = false;
        },
      });
      // Flicker-in
      tl.to(overlay, { opacity: 1, duration: 0.04 });
      tl.to(overlay, { opacity: 0, duration: 0.04 }, 0.07);
      tl.to(overlay, { opacity: 1, duration: 0.06 }, 0.13);
      tl.to(overlay, { opacity: 0, duration: 0.04 }, 0.50);
      tl.to(overlay, { opacity: 1, duration: 0.04 }, 0.56);
      // Hold 2.2 s then fade
      tl.to(overlay, { opacity: 0, duration: 0.5, delay: 2.2 });
    } else {
      overlay.style.opacity = '1';
      setTimeout(() => {
        overlay.textContent = '';
        overlay.style.opacity = '0';
        this._active = false;
      }, 3200);
    }
  },

  _asciiBox(text) {
    const lines = text.split('\n');
    const w = Math.max(...lines.map(l => l.length));
    const bar = '+' + '-'.repeat(w + 2) + '+';
    return [bar, ...lines.map(l => `| ${l.padEnd(w)} |`), bar].join('\n');
  },
};

/* ============================================================
   14. BOOT SEQUENCE — wait for GSAP + Three.js then start
============================================================ */
function waitForLibraries(callback, maxWait = 5000) {
  const start = Date.now();
  const check = () => {
    if (typeof gsap !== 'undefined' && typeof THREE !== 'undefined') {
      callback();
    } else if (Date.now() - start < maxWait) {
      setTimeout(check, 50);
    } else {
      // Libraries timed out — run without them (graceful degradation)
      console.warn('Portfolio: GSAP or Three.js did not load. Running in fallback mode.');
      callback();
    }
  };
  check();
}

function boot() {
  // Register GSAP plugin if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Init Three.js hero scene early (canvas is hidden under loader)
  heroScene.init();

  // Custom cursor (dot + ring)
  cursor.init();

  // Navigation
  nav.init();

  // Populate sections (so content is ready when loader exits)
  skills.init();
  history.init();
  projects.init();
  contact.init();

  // Scroll animations (ScrollTrigger)
  scrollAnimations.init();

  // Ambient full-page scanline glitch flicker
  glitchEffects.init();

  // Side HUD labels that track active section
  sideLabels.init();

  // ASCII flash overlay on first section entry
  sectionFlash.init();

  // Scan sweep line through each section
  scanSweep.init();

  // Floating "system" phrases on scroll
  hackScroll.init();

  // Click ripple — digital pool ripple of ASCII chars on every click
  clickRipple.init();

  // Hover glitch — brief char scramble on hover over interactive elements
  hoverGlitch.init();

  // Easter egg — Konami code and rapid logo-click hidden interactions
  easterEgg.init();

  // Fire the loader last — its exit callback triggers hero animations
  loader.init();
}

// Kick off when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => waitForLibraries(boot));
} else {
  waitForLibraries(boot);
}
