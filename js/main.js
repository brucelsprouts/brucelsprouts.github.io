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
    // Web / Front-end
    { name: 'HTML',          icon: '⬡', desc: 'Solid foundation in semantic markup. Built multiple personal projects and this portfolio from scratch.' },
    { name: 'CSS',           icon: '⬡', desc: 'Comfortable with layouts, animations, custom properties, and responsive design — no frameworks needed.' },
    { name: 'JavaScript',    icon: '⬡', desc: 'Front-end scripting: DOM manipulation, fetch/async, canvas, and Three.js for interactive experiences.' },
    // Languages
    { name: 'Java',          icon: '⬡', desc: 'Primary language for CS coursework at Western — OOP, data structures, algorithms, and system design.' },
    { name: 'Python',        icon: '⬡', desc: 'Used in university projects and personal scripts; comfortable with core syntax and standard libraries.' },
    // Systems
    { name: 'Git',           icon: '⬡', desc: 'Daily driver for version control — branching, committing, and managing personal projects and repositories on GitHub.' },
    { name: 'Unix / Linux',  icon: '⬡', desc: 'Comfortable in the terminal: shell scripting, file system navigation, and course lab environments.' },
    // Creative
    { name: 'Blender',       icon: '⬡', desc: 'Just getting started — learning 3D modelling, lighting, and rendering. Still early but enjoying the process.' },
    { name: 'After Effects', icon: '⬡', desc: 'Used professionally during a video editing internship at AMG. Motion graphics, cuts, and transitions.' },
    { name: 'Photoshop',     icon: '⬡', desc: 'Image editing, compositing, and asset creation for web and creative projects.' },
  ],

  timeline: [
    {
      date: '2023 — Present',
      title: 'B.Sc. Computer Science',
      org: 'Western University',
      desc: 'CS student in London, Ontario. Coursework in algorithms, data structures, software engineering, and computer systems.',
    },
    {
      date: 'Summer 2024',
      title: 'Video Editing Intern',
      org: 'AMG',
      desc: 'Short-term summer internship producing video content — editing footage, motion graphics, and post-production in After Effects.',
    },
    {
      date: 'May 2021 — Sep 2023',
      title: 'Freelance English Tutor',
      org: 'Ignite Youth Club',
      desc: 'Remote tutoring over two years. Helped students strengthen reading, writing, and communication skills.',
    },
  ],

  projects: [
    {
      id: 1,
      title: 'Portfolio v1',
      category: 'coding',
      date: '2023-09-15',
      desc: 'First attempt at a personal portfolio. Left unfinished — missing assets, inconsistent styling, and nothing really felt cohesive. Decided to scrap it and start fresh rather than patch something that wasn\'t working.',
      stack: ['HTML', 'CSS', 'JavaScript'],
      youtube: null,
      github: 'https://github.com/brucelsprouts/brucelsprouts.github.io-1.0',
      demo: 'https://brucelsprouts.github.io/brucelsprouts.github.io-1.0/',
      thumb: 'assets/images/projects/portfolio-v1-1.png',
      images: ['assets/images/projects/portfolio-v1-1.png', 'assets/images/projects/portfolio-v1-2.png'],
      contain: true,
    },
    {
      id: 2,
      title: 'Get Jinxed — 4K Arcane Edit',
      category: 'video',
      date: '2024-11-16',
      desc: 'Personal YouTube edit of Jinx from Arcane Season 2, cut to "Get Jinxed". Styled after magazine cut-out collages — overlapping panels, clipped shapes, and photo layers composited over the footage for a uniquely styled visual.',
      stack: ['After Effects', 'Photoshop', 'YouTube'],
      youtube: 'https://www.youtube.com/embed/l32I3pNtN_c?rel=0',
      github: null,
      demo: 'https://youtu.be/l32I3pNtN_c',
      thumb: 'assets/images/projects/jinx-edit-1.png',
      images: null,
    },
    {
      id: 3,
      title: 'Nixie Counter',
      category: 'coding',
      date: '2025-05-18',
      desc: 'A retro Nixie-tube-style visitor counter served as a dynamically generated image from an Oracle cloud server. Embed it in any GitHub README or web page — it increments and renders in real time with configurable digit count and base value.',
      stack: ['PHP', 'Oracle Cloud', 'GitHub Profile'],
      youtube: null,
      github: 'https://github.com/brucelsprouts/nixiecounter',
      demo: null,
      thumb: 'assets/images/projects/nixiecounter-1.png',
      images: ['assets/images/projects/nixiecounter-1.png', 'assets/images/projects/nixiecounter-2.png'],
      contain: true,
    },
    {
      id: 4,
      title: 'Coffee & Donut',
      category: 'blender',
      date: '2026-02-01',
      desc: 'The classic Blender learning project — a coffee cup with liquid and an iced donut. Focused on modelling, lighting, shading, and render fundamentals.',
      stack: ['Blender'],
      youtube: null,
      github: null,
      demo: null,
      thumb: 'assets/images/projects/donut-1.png',
      images: ['assets/images/projects/donut-1.png', 'assets/images/projects/donut-2.png'],
      contain: true,
    },
    {
      id: 5,
      title: 'XPWaste',
      category: 'coding',
      date: '2026-03-10',
      desc: 'A desktop Pomodoro focus timer built for Old School RuneScape players. Tracks active study time, logs session history, supports custom notification sounds, and ships as a standalone Windows executable. OSRS and normal mode themes included.',
      stack: ['Python', 'Tkinter', 'PyInstaller'],
      youtube: null,
      github: 'https://github.com/brucelsprouts/xpwaste',
      demo: null,
      thumb: 'assets/images/projects/xpwaste-1.png',
      images: ['assets/images/projects/xpwaste-1.png', 'assets/images/projects/xpwaste-2.png'],
      contain: true,
    },
    {
      id: 6,
      title: 'Portfolio v2',
      category: 'coding',
      date: '2026-03-11',
      desc: 'Cyber-tech themed personal portfolio. Three.js solar system hero, GSAP scroll animations, a hidden aim-trainer minigame, and low-performance mode. Direction, design, and coding by me — built with AI assistance. If you\'re seeing this, you\'re already here.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'GSAP'],
      youtube: null,
      github: 'https://github.com/brucelsprouts/brucelsprouts.github.io',
      demo: null,
      thumb: 'assets/images/projects/portfolio-v2-1.png',
      images: ['assets/images/projects/portfolio-v2-1.png', 'assets/images/projects/portfolio-v2-2.png'],
      contain: true,
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
    this.spawnHexPanels();
    this.spawnErrorFeed();
    this.spawnGlitchBlocks();
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

  /* ── Rapidly updating hex address panels in screen corners ── */
  spawnHexPanels() {
    const container = document.getElementById('hex-panels');
    if (!container) return;
    this._hexIntervals = [];

    const positions = [
      { top: '12%',    right: '3%',  textAlign: 'right' },
      { top: '18%',    left:  '3%',  textAlign: 'left'  },
      { bottom: '16%', right: '3%',  textAlign: 'right' },
      { bottom: '20%', left:  '3%',  textAlign: 'left'  },
    ];

    positions.forEach((pos, idx) => {
      const panel = document.createElement('div');
      panel.className = 'hex-panel';
      Object.assign(panel.style, pos);

      const hex = () => Math.floor(Math.random() * 0xFFFF)
        .toString(16).toUpperCase().padStart(4, '0');
      const byte = () => Math.floor(Math.random() * 0xFF)
        .toString(16).toUpperCase().padStart(2, '0');

      const generate = () => {
        const lines = randInt(5, 10);
        return Array.from({ length: lines }, () =>
          `0x${hex()}  ` + Array.from({ length: randInt(4, 8) }, byte).join(' ')
        ).join('\n');
      };

      panel.textContent = generate();
      container.appendChild(panel);

      const iv = setInterval(() => {
        if (!panel.isConnected) { clearInterval(iv); return; }
        // Stagger updates — not all panels refresh at the same time
        if (Math.random() < 0.7 || idx % 2 === 0) panel.textContent = generate();
      }, randInt(60, 210));
      this._hexIntervals.push(iv);
    });
  },

  /* ── Scrolling error / system message feed at the bottom ── */
  spawnErrorFeed() {
    const container = document.getElementById('error-feed');
    if (!container || typeof gsap === 'undefined') return;

    const messages = [
      { text: 'ERR  PACKET LOSS 47% — RETRYING . . .', cls: 'crit' },
      { text: 'WARN  BUFFER OVERFLOW AT 0xDEADBEEF',   cls: 'warn' },
      { text: 'INFO  HANDSHAKE ATTEMPT 3 / 5',          cls: 'info' },
      { text: 'CRIT  SEGMENT FAULT 0x00000003',         cls: 'crit' },
      { text: 'SYS   REROUTING VIA NODE 94.17.203.41',  cls: 'info' },
      { text: 'WARN  ENCRYPTION KEY MISMATCH — FORCING',cls: 'warn' },
      { text: 'ERR   TIMEOUT EXCEEDED  8192 ms',        cls: 'crit' },
      { text: 'INFO  TUNNEL OK — LATENCY 1204 ms',      cls: 'info' },
      { text: 'WARN  FIREWALL SCAN DETECTED SPOOFING',  cls: 'warn' },
      { text: 'ERR   AUTH REJECTED — BRUTEFORCE ON',    cls: 'crit' },
      { text: '>>>   INJECTING PAYLOAD ██████░░ 78%',   cls: 'info' },
      { text: 'WARN  STACK TRACE CORRUPTED 0xC000003A', cls: 'warn' },
      { text: 'CRIT  KERNEL PANIC — RECOVERY ACTIVE',   cls: 'crit' },
      { text: '>>>   ACCESS LEVEL : ESCALATING . . .',  cls: 'info' },
      { text: 'INFO  NODE HASH 3F:2A:9B:41 ACCEPTED',   cls: 'info' },
      { text: 'ERR   FRAGMENTED PACKET DROP × 23',      cls: 'warn' },
      { text: 'SYS   MEMORY INTEGRITY CHECK FAILED',    cls: 'crit' },
      { text: '>>>   BYPASSING LAYER 3 FIREWALL . . .',  cls: 'info' },
    ];

    let lines = [];
    let idx   = randInt(0, messages.length - 1);

    const push = () => {
      if (!container.isConnected) return;

      // Shift existing lines up by one slot (20 px each)
      lines.forEach((l, i) => { l.style.bottom = `${(i + 1) * 22}px`; });

      const msg  = messages[idx % messages.length];
      idx++;
      const ts   = `[${Date.now().toString().slice(-6)}]  `;
      const line = document.createElement('div');
      line.className     = `error-line ${msg.cls}`;
      line.textContent   = ts + msg.text;
      line.style.bottom  = '0px';
      container.appendChild(line);
      lines.push(line);

      if (lines.length > 4) {
        const old = lines.shift();
        gsap.to(old, { opacity: 0, duration: 0.28, onComplete: () => old.remove() });
      }
    };

    // Initial burst so feed looks populated immediately
    push(); push(); push();
    this._errorInterval = setInterval(push, randInt(380, 820));
  },

  /* ── Random white corruption-block flashes across the loader ── */
  spawnGlitchBlocks() {
    const container = document.getElementById('glitch-overlay');
    if (!container) return;

    const flash = () => {
      if (!container.isConnected) return;

      const count = randInt(1, 4);
      for (let i = 0; i < count; i++) {
        const block = document.createElement('div');
        block.className = 'glitch-block';
        // Occasionally a wide thin scan-line, occasionally a squat rectangle
        const wide = Math.random() < 0.6;
        block.style.cssText = [
          `left:${randFloat(0, 88)}%`,
          `top:${randFloat(2, 97)}%`,
          `width:${wide ? randFloat(60, 320) : randFloat(8, 60)}px`,
          `height:${wide ? randFloat(1, 4)   : randFloat(4, 20)}px`,
          `background:rgba(255,255,255,${randFloat(0.04, 0.22)})`,
        ].join(';');
        container.appendChild(block);
        setTimeout(() => block.remove(), randInt(30, 160));
      }

      // Cluster rapid bursts with occasional quiet gaps
      const delay = Math.random() < 0.25
        ? randInt(20, 80)     // tight burst
        : randInt(150, 700);  // breathing room
      this._glitchBlockTimer = setTimeout(flash, delay);
    };

    flash();
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
    clearInterval(this._errorInterval);
    (this._hexIntervals || []).forEach(iv => clearInterval(iv));
    clearTimeout(this._glitchBlockTimer);

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
    clearInterval(this._errorInterval);
    clearTimeout(this._glitchBlockTimer);
    (this._hexIntervals || []).forEach(iv => clearInterval(iv));
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
      { r: 3.40, tx:  Math.PI * 0.08, tz:  Math.PI * 0.16, a0: Math.PI * 1.65, spd: 0.0028 },
      { r: 2.5, tx:  Math.PI * 0.04, tz:  Math.PI * 0.7, a0: Math.PI * 3.67, spd: 0.00067 },
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
    container.className = 'hero-fx-overlay';
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
    container.className = 'hero-fx-overlay';
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
    if (this._paused) return;
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

  pause()  { this._paused = true; },
  resume() { if (this._paused) { this._paused = false; this.animate(); } },
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

    // Close drawer helper
    const closeDrawer = () => {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    };

    // Close on link click
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

    // Close button
    const closeBtn = document.getElementById('drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    // Close on backdrop click (tap outside the list area)
    drawer.addEventListener('click', e => {
      if (e.target === drawer) closeDrawer();
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
        burger.blur();
      }
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
        ${skill.desc ? `<div class="skill-tooltip">${skill.desc}</div>` : ''}
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
  currentSort: 'date-desc',
  searchQuery: '',

  init() {
    this.all = DATA.projects;
    this.bindFilter();
    this.bindSort();
    this.bindSearch();
    this.filter();
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
      ? `<img src="${project.thumb}" onerror="this.onerror=null;this.src='${project.thumb.replace('.png', '.svg')}';" alt="${project.title} preview" loading="lazy" />`
      : `<div class="project-thumb-placeholder">${project.title.charAt(0)}</div>`;

    // Tech stack tags
    const stackHtml = project.stack
      .map(s => `<span class="stack-tag">${s}</span>`)
      .join('');

    // Action buttons
    const demoLabel = project.category === 'video' ? 'Watch on YouTube' : 'View Live';
    const linksHtml = [
      project.demo   ? `<a href="${project.demo}"   class="project-link primary"    target="_blank" rel="noopener noreferrer">${demoLabel}</a>`   : '',
      project.github ? `<a href="${project.github}" class="project-link secondary"  target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
    ].filter(Boolean).join('');

    const thumbAttrs = project.thumb
      ? ` class="project-thumb project-thumb--contain" style="background-image:url('${project.thumb.replace('.png', '.svg')}')"` 
      : ` class="project-thumb"`;

    card.innerHTML = `
      <div${thumbAttrs}>
        ${thumbHtml}
        <span class="card-expand-hint" aria-hidden="true"><svg viewBox="0 0 12 12" fill="none"><path d="M7.5 1.5H10.5V4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 10.5H1.5V7.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="10.5" y1="1.5" x2="7" y2="5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="1.5" y1="10.5" x2="5" y2="7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></span>
      </div>
      <div class="project-body">
        <p class="project-category monospace">${project.category}</p>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.desc}</p>
        <div class="project-stack">${stackHtml}</div>
        <div class="project-links">${linksHtml}</div>
      </div>
    `;

    // Open modal on card click (but not when clicking a link)
    card.addEventListener('click', (e) => {
      if (e.target.closest('.project-link')) return;
      projectModal.open(project);
    });

    return card;
  },

  filter() {
    let list = [...this.all];

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

    switch (this.currentSort) {
      case 'date-asc':  list.sort((a, b) => (a.date || '').localeCompare(b.date || '')); break;
      case 'date-desc': list.sort((a, b) => (b.date || '').localeCompare(a.date || '')); break;
      case 'alpha-asc': list.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'alpha-desc':list.sort((a, b) => b.title.localeCompare(a.title)); break;
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

  bindSort() {
    const btns = document.querySelectorAll('.sort-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSort = btn.dataset.sort;
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
    // Section header is handled by the global .section-header ScrollTrigger in initScrollAnimations
  },
};

/* ============================================================
   11. PROJECT MODAL — click a card to view details inline
============================================================ */
const projectModal = {
  _el:     null,
  _slides: [],
  _idx:    0,

  init() {
    this._el = document.getElementById('project-modal');
    if (!this._el) return;

    document.getElementById('modal-close')
      .addEventListener('click', () => this.close());
    document.getElementById('modal-backdrop')
      .addEventListener('click', () => this.close());

    document.addEventListener('keydown', (e) => {
      if (!this._el.classList.contains('open')) return;
      if (e.key === 'Escape')     this.close();
      if (e.key === 'ArrowLeft')  this._step(-1);
      if (e.key === 'ArrowRight') this._step(1);
    });
  },

  open(project) {
    // Populate text info
    document.getElementById('modal-category').textContent = project.category;
    document.getElementById('modal-title').textContent    = project.title;
    document.getElementById('modal-desc').textContent     = project.desc;

    // Stack tags
    document.getElementById('modal-stack').innerHTML =
      project.stack.map(s => `<span class="stack-tag">${s}</span>`).join('');

    // Links
    const demoLabel = project.category === 'video' ? 'Watch on YouTube' : 'View Live';
    document.getElementById('modal-links').innerHTML = [
      project.demo   ? `<a href="${project.demo}"   class="project-link primary"  target="_blank" rel="noopener noreferrer">${demoLabel}</a>` : '',
      project.github ? `<a href="${project.github}" class="project-link secondary" target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
    ].filter(Boolean).join('');

    // Build slides: YouTube embed first (if any), then images
    this._slides = [];
    if (project.youtube) this._slides.push({ type: 'youtube', src: project.youtube });
    if (project.images)  project.images.forEach(src => this._slides.push({ type: 'image', src, contain: !!project.contain }));
    this._idx = 0;
    this._renderMedia();

    this._el.classList.add('open');
    this._el.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (this._cleanupZoom) { this._cleanupZoom(); this._cleanupZoom = null; }
    this._el.classList.remove('open');
    this._el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Clear media so iframes stop playing
    document.getElementById('modal-media').innerHTML = '';
  },

  _step(dir) {
    if (!this._slides.length) return;
    this._idx = (this._idx + dir + this._slides.length) % this._slides.length;
    this._renderMedia();
  },

  _renderMedia() {
    if (this._cleanupZoom) { this._cleanupZoom(); this._cleanupZoom = null; }
    const mediaEl = document.getElementById('modal-media');
    if (!this._slides.length) { mediaEl.innerHTML = ''; return; }

    const slide = this._slides[this._idx];
    const multi = this._slides.length > 1;

    let html;
    if (slide.type === 'youtube') {
      html = `<div class="video-wrap"><iframe src="${slide.src}&autoplay=0" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>`;
    } else {
      const svgSrc  = slide.src.includes('.png') ? slide.src.replace('.png', '.svg') : slide.src;
      const navHtml = multi
        ? `<button class="gallery-nav prev" aria-label="Previous">&#8592;</button>
           <button class="gallery-nav next" aria-label="Next">&#8594;</button>
           <span class="gallery-counter">${this._idx + 1} / ${this._slides.length}</span>`
        : '';
      html = `<div class="img-gallery" style="background-image:url('${svgSrc}')">
        <img class="gallery-img" src="${slide.src}" onerror="this.onerror=null;this.src='${svgSrc}';" alt="" draggable="false" />
        <div class="gallery-zoom-controls">
          <button class="gallery-zoom-btn zoom-out" title="Zoom out">&#8722;</button>
          <span class="gallery-zoom-label">1&times;</span>
          <button class="gallery-zoom-btn zoom-in" title="Zoom in">&#43;</button>
        </div>
        ${navHtml}
      </div>`;
    }

    mediaEl.innerHTML = html;

    if (slide.type !== 'youtube') this._initZoom(mediaEl);

    if (multi) {
      const prev = mediaEl.querySelector('.prev');
      const next = mediaEl.querySelector('.next');
      if (prev) prev.addEventListener('click', () => this._step(-1));
      if (next) next.addEventListener('click', () => this._step(1));
    }
  },

  _initZoom(mediaEl) {
    const gallery  = mediaEl.querySelector('.img-gallery');
    const img      = mediaEl.querySelector('.gallery-img');
    const label    = mediaEl.querySelector('.gallery-zoom-label');
    if (!gallery || !img) return;

    // Rendered state (what the user sees)
    let scale = 1, tx = 0, ty = 0;
    // Target state (where we're animating toward)
    let tScale = 1, tTx = 0, tTy = 0;
    let dragging = false, startX = 0, startY = 0;
    let velX = 0, velY = 0, lastTime = 0;
    let rafId = null;
    const MIN = 1, MAX = 4, LERP = 0.15, MOM = 80;

    img.style.transition = 'none'; // JS owns all animation

    const clampTrans = (s, x, y) => {
      const mX = (gallery.clientWidth  * (s - 1)) / 2;
      const mY = (gallery.clientHeight * (s - 1)) / 2;
      return [Math.max(-mX, Math.min(mX, x)), Math.max(-mY, Math.min(mY, y))];
    };

    const applyTransform = () => {
      img.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
    };

    const updateLabel = () => {
      if (label) label.textContent = `${tScale.toFixed(1)}\xD7`;
    };

    const tick = () => {
      const ds = tScale - scale, dx = tTx - tx, dy = tTy - ty;
      const done = Math.abs(ds) < 0.0005 && Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05;
      if (done) {
        scale = tScale; tx = tTx; ty = tTy;
        applyTransform();
        gallery.classList.toggle('zoomed', scale > 1.02);
        rafId = null;
        return;
      }
      scale += ds * LERP;
      tx    += dx * LERP;
      ty    += dy * LERP;
      applyTransform();
      gallery.classList.toggle('zoomed', scale > 1.02);
      rafId = requestAnimationFrame(tick);
    };

    const scheduleRaf = () => { if (!rafId) rafId = requestAnimationFrame(tick); };

    const zoomTo = (newScale, pivotClientX, pivotClientY) => {
      const prev = tScale;
      tScale = Math.max(MIN, Math.min(MAX, newScale));
      if (tScale <= MIN) {
        tTx = 0; tTy = 0;
      } else if (pivotClientX !== undefined) {
        const rect  = gallery.getBoundingClientRect();
        const px    = pivotClientX - rect.left - rect.width  / 2;
        const py    = pivotClientY - rect.top  - rect.height / 2;
        const ratio = tScale / Math.max(prev, 0.01);
        tTx = (tTx - px) * ratio + px;
        tTy = (tTy - py) * ratio + py;
      }
      [tTx, tTy] = clampTrans(tScale, tTx, tTy);
      updateLabel();
      scheduleRaf();
    };

    // Wheel — zoom toward cursor
    const onWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaMode === 1 ? 20 : 1;
      const delta  = -e.deltaY * factor * 0.004;
      zoomTo(tScale + delta, e.clientX, e.clientY);
    };

    // Double-click — toggle 2.5x / reset
    const onDblClick = (e) => {
      if (e.target.closest('button')) return;
      tScale > 1.05 ? zoomTo(1) : zoomTo(2.5, e.clientX, e.clientY);
    };

    // Drag
    const startDrag = (cx, cy) => {
      if (tScale <= 1) return;
      dragging = true;
      startX = cx - tTx;
      startY = cy - tTy;
      velX = 0; velY = 0;
      lastTime = performance.now();
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      gallery.classList.add('is-dragging');
    };

    const moveDrag = (cx, cy) => {
      if (!dragging) return;
      const now = performance.now();
      const dt  = Math.max(1, now - lastTime);
      const nx  = cx - startX;
      const ny  = cy - startY;
      const [cx2, cy2] = clampTrans(tScale, nx, ny);
      velX = (cx2 - tTx) / dt;
      velY = (cy2 - tTy) / dt;
      tTx = cx2; tTy = cy2;
      // instant update during drag — no lerp lag
      scale = tScale; tx = tTx; ty = tTy;
      applyTransform();
      lastTime = now;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      gallery.classList.remove('is-dragging');
      // momentum
      const [cx, cy] = clampTrans(tScale, tTx + velX * MOM, tTy + velY * MOM);
      tTx = cx; tTy = cy;
      scheduleRaf();
    };

    const onMouseDown  = (e) => { if (e.button === 0 && !e.target.closest('button')) { e.preventDefault(); startDrag(e.clientX, e.clientY); } };
    const onMouseMove  = (e) => moveDrag(e.clientX, e.clientY);
    const onTouchStart = (e) => { if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchMove  = (e) => { if (e.touches.length === 1 && dragging) { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); } };

    mediaEl.querySelector('.zoom-in') .addEventListener('click', () => zoomTo(tScale + 0.5));
    mediaEl.querySelector('.zoom-out').addEventListener('click', () => zoomTo(tScale - 0.5));
    gallery.addEventListener('wheel',      onWheel,     { passive: false });
    gallery.addEventListener('dblclick',   onDblClick);
    gallery.addEventListener('mousedown',  onMouseDown);
    gallery.addEventListener('touchstart', onTouchStart, { passive: true });
    gallery.addEventListener('touchmove',  onTouchMove,  { passive: false });
    window .addEventListener('mousemove',  onMouseMove);
    window .addEventListener('mouseup',    endDrag);
    window .addEventListener('touchend',   endDrag);

    this._cleanupZoom = () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   endDrag);
      window.removeEventListener('touchend',  endDrag);
    };
  },
};

/* ============================================================
   12. CONTACT FORM
============================================================ */
const contact = {
  init() {
    const form   = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!this.validate(form)) return;

      const label    = form.querySelector('.btn-label');
      const sending  = form.querySelector('.btn-sending');
      const submitBtn = form.querySelector('.form-submit');

      label.style.display   = 'none';
      sending.style.display = 'inline';
      submitBtn.disabled    = true;

      try {
        const res = await fetch('https://formspree.io/f/xlgpbwdn', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form),
        });

        if (res.ok) {
          status.textContent = 'Message sent.';
          status.className   = 'form-status success';
          form.reset();
        } else {
          const data = await res.json();
          status.textContent = 'Failed to send — ' + (data?.errors?.[0]?.message ?? 'please try again.');
          status.className   = 'form-status error';
        }
      } catch {
        status.textContent = 'Network error — please try again.';
        status.className   = 'form-status error';
      } finally {
        label.style.display   = 'inline';
        sending.style.display = 'none';
        submitBtn.disabled    = false;
        setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 6000);
      }
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
    this._iv1 = setInterval(() => {
      if (Math.random() < 0.15) { this._scanFlash(); }
    }, 4000);

    // VHS-style horizontal noise lines — subtle, atmospheric
    this._iv2 = setInterval(() => {
      if (Math.random() < 0.28) { this._vhsLines(); }
    }, 2200);

    // Brief pixel-shift block — rare, striking
    this._iv3 = setInterval(() => {
      if (Math.random() < 0.12) { this._pixelShift(); }
    }, 5500);
  },
  pause()  { clearInterval(this._iv1); clearInterval(this._iv2); clearInterval(this._iv3); },
  resume() { this.init(); },

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
    if (document.body.classList.contains('low-perf')) return;
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
    if (document.body.classList.contains('low-perf')) return;
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
    if (document.body.classList.contains('low-perf')) return;
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
    if (document.body.classList.contains('low-perf')) return;
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
    if (document.body.classList.contains('low-perf')) return;
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
    if (document.body.classList.contains('low-perf')) return;
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
   20. LOW PERFORMANCE MODE
   Pauses/hides all decorative effects. Nav, content, projects,
   contact form, and NODE ACQUIRE minigame stay fully functional.
============================================================ */
const lowPerf = {
  active: false,

  init() {
    const btn = document.getElementById('low-perf-btn');
    if (!btn) return;
    btn.addEventListener('click', () => this.toggle());
  },

  toggle() {
    this.active = !this.active;
    document.body.classList.toggle('low-perf', this.active);
    const btn = document.getElementById('low-perf-btn');
    if (btn) btn.setAttribute('aria-pressed', String(this.active));
    if (this.active) {
      heroScene.pause();
      cursor._enabled = false;
      glitchEffects.pause();
    } else {
      heroScene.resume();
      cursor._enabled = true;
      glitchEffects.resume();
    }
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

/* ============================================================
   NODE ACQUIRE — Aim trainer easter egg
   Hidden in hero; activated via subtle HUD button.
   Tap / click decaying orbital nodes before they collapse.
   Scoring: base 100 pts + speed bonus, chain combo multiplier.
   30-second mission with grade S/A/B/C/D reveal at end.
============================================================ */
const nodeAcquire = {
  score:    0,
  combo:    0,
  maxCombo: 0,
  hits:     0,
  misses:   0,
  timeLeft: 30,
  running:  false,

  _timer:       null,
  _targets:     [],      // array of { el, timer, spawnTime, lifespan, x, y, type }
  _lastX:       null,   // centre of last hit — used for proximity spawn
  _lastY:       null,
  _overlay:     null,
  _field:       null,
  _scoreEl:     null,
  _comboEl:     null,
  _timerEl:     null,

  init() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Trigger button
    const btn = document.getElementById('node-acq-trigger');
    if (btn) btn.addEventListener('click', () => this.open());

    this._overlay  = document.getElementById('node-acq-overlay');
    this._field    = document.getElementById('naq-field');
    this._scoreEl  = document.getElementById('naq-score');
    this._comboEl  = document.getElementById('naq-combo');
    this._timerEl  = document.getElementById('naq-timer');
    this._reticle  = document.getElementById('naq-reticle');
    if (!this._overlay) return;

    // Reticle tracking
    this._onMouseMove = (e) => {
      if (!this._reticle) return;
      const rect = this._overlay.getBoundingClientRect();
      this._reticle.style.left = (e.clientX - rect.left) + 'px';
      this._reticle.style.top  = (e.clientY - rect.top)  + 'px';
    };
    this._onReticleClick = () => {
      if (!this._reticle) return;
      this._reticle.classList.remove('rct-fire');
      void this._reticle.offsetWidth; // reflow to restart animation
      this._reticle.classList.add('rct-fire');
    };

    document.getElementById('naq-start-btn').addEventListener('click',  () => this.start());
    document.getElementById('naq-close-start').addEventListener('click', () => this.close());
    document.getElementById('naq-retry-btn').addEventListener('click',  () => this.start());
    document.getElementById('naq-close-end').addEventListener('click',  () => this.close());
  },

  open() {
    if (!this._overlay) return;
    this._overlay.style.display = 'block';
    this._overlay.classList.add('naq-active');
    // Kill both JS cursor elements via CSS class (works even across z-index layers)
    document.body.classList.add('naq-playing');
    // Show reticle
    if (this._reticle) {
      this._reticle.style.display = 'block';
      this._overlay.addEventListener('mousemove', this._onMouseMove);
      this._overlay.addEventListener('click',     this._onReticleClick);
    }
    document.getElementById('naq-start-screen').classList.add('naq-visible');
    document.getElementById('naq-end-screen').classList.remove('naq-visible');
    const hc = document.querySelector('.hero-content');
    if (hc) hc.style.visibility = 'hidden';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(this._overlay, { opacity: 0 }, { opacity: 1, duration: 0.38, ease: 'power2.out' });
    }
  },

  start() {
    this.score = 0; this.combo = 0; this.maxCombo = 0;
    this.hits  = 0; this.misses = 0; this.timeLeft = 30;
    this.running = true;

    document.getElementById('naq-start-screen').classList.remove('naq-visible');
    document.getElementById('naq-end-screen').classList.remove('naq-visible');
    this._updateHUD();
    if (this._timerEl) this._timerEl.classList.remove('naq-urgency');

    clearInterval(this._timer);
    this._timer = setInterval(() => {
      this.timeLeft--;
      if (this._timerEl) {
        this._timerEl.textContent = String(this.timeLeft).padStart(2, '0');
        if (this.timeLeft <= 7) this._timerEl.classList.add('naq-urgency');
      }
      if (this.timeLeft <= 0) {
        clearInterval(this._timer);
        this._killAllTargets();
        this.running = false;
        setTimeout(() => this.end(), 320);
      }
    }, 1000);

    // Spawn 8 initial targets (staggered)
    for (let i = 0; i < 8; i++) {
      setTimeout(() => { if (this.running) this._spawnOne(); }, i * 110);
    }
  },

  _multi() {
    if (this.combo >= 10) return 5;
    if (this.combo >= 6)  return 3;
    if (this.combo >= 3)  return 2;
    return 1;
  },

  _updateHUD() {
    if (this._scoreEl) this._scoreEl.textContent = String(this.score).padStart(5, '0');
    if (this._comboEl) {
      const m = this._multi();
      this._comboEl.textContent = '×' + m;
      this._comboEl.style.color = m >= 5 ? 'rgba(255,200,80,1)'
        : m >= 3 ? 'rgba(160,255,160,1)' : '#fff';
    }
  },

  _spawnOne() {
    if (!this.running || !this._field) return;

    const isMobile = window.innerWidth < 768;
    const size     = isMobile ? randInt(90, 118) : randInt(98, 130);
    const lifespan = this.timeLeft > 18 ? 2300
      : this.timeLeft > 10 ? 1800
      : this.timeLeft > 5  ? 1400 : 1100;

    const fw  = this._field.offsetWidth  || window.innerWidth;
    const fh  = this._field.offsetHeight || window.innerHeight;
    const pad = size * 0.8;
    const cxMin = fw * 0.29, cxMax = fw * 0.71;
    const cyMin = fh * 0.30, cyMax = fh * 0.70;

    // Avoid overlaps; bias toward last hit position for flow
    let x, y, tries = 0;
    do {
      if (this._lastX != null && tries < 18) {
        const sp = 230;
        x = Math.max(pad, Math.min(fw - pad, this._lastX + randFloat(-sp, sp)));
        y = Math.max(pad + 66, Math.min(fh - pad - 34, this._lastY + randFloat(-sp, sp)));
      } else {
        x = randFloat(pad, fw - pad);
        y = randFloat(pad + 66, fh - pad - 34);
      }
      tries++;
      const inCenter = x > cxMin && x < cxMax && y > cyMin && y < cyMax;
      const tooClose = this._targets.some(t => {
        const cx = (t.x != null ? t.x : t.sx) || 0;
        const cy = (t.y != null ? t.y : t.sy) || 0;
        const dx = cx - x, dy = cy - y;
        return Math.sqrt(dx*dx + dy*dy) < size * 1.5;
      });
      if (!inCenter && !tooClose) break;
    } while (tries < 50);

    const el = document.createElement('div');
    el.className = 'naq-target';
    el.style.width  = size + 'px';
    el.style.height = size + 'px';
    el.style.left   = x + 'px';
    el.style.top    = y + 'px';
    el.innerHTML = [
      `<div class="naq-target-ring" style="animation-duration:${lifespan}ms"></div>`,
      `<div class="naq-target-pulse"></div>`,
      `<div class="naq-target-cross"></div>`,
      `<div class="naq-target-dot"></div>`,
    ].join('');

    const data = { el, timer: null, spawnTime: Date.now(), lifespan, x, y, type: 'circle' };
    this._targets.push(data);

    const onHit = (e) => { e.stopPropagation(); this._hit(data); };
    el.addEventListener('click', onHit);
    el.addEventListener('touchstart', (ev) => { ev.preventDefault(); onHit(ev); }, { passive: false });

    this._field.appendChild(el);
    data.timer = setTimeout(() => this._miss(data), lifespan);
  },

  _hit(data) {
    if (!this._targets.includes(data)) return;
    clearTimeout(data.timer);
    this._targets = this._targets.filter(t => t !== data);

    const elapsed = (Date.now() - data.spawnTime) / 1000;
    const ratio   = elapsed / (data.lifespan / 1000);
    const bonus   = ratio < 0.20 ? 100 : ratio < 0.45 ? 55 : ratio < 0.70 ? 20 : 0;

    this.combo++;
    this.hits++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    this._lastX = data.x;
    this._lastY = data.y;
    const m      = this._multi();
    const points = (100 + bonus) * m;
    this.score  += points;
    this._updateHUD();

    this._burst(data.x, data.y, m > 3 ? 4 : m > 1 ? 3 : 2);
    this._scorePop(data.x, data.y, '+' + points);

    if (this.combo === 3)  this._comboFlash('CHAIN ×2');
    if (this.combo === 6)  this._comboFlash('CHAIN ×3 — HOT');
    if (this.combo === 10) this._comboFlash('MAX CHAIN ×5 !!!');

    if (typeof gsap !== 'undefined') {
      gsap.to(data.el, {
        scale: 0, opacity: 0, duration: 0.16, ease: 'power2.in',
        onComplete: () => { data.el.remove(); this._spawnOne(); },
      });
    } else {
      data.el.remove();
      this._spawnOne();
    }
  },

  _miss(data) {
    if (!this._targets.includes(data)) return;
    this._targets = this._targets.filter(t => t !== data);
    this.misses++;
    const prevCombo = this.combo;
    this.combo = 0;
    this._updateHUD();
    if (prevCombo >= 3) this._comboFlash('CHAIN BROKEN');

    if (typeof gsap !== 'undefined') {
      const ring = data.el.querySelector('.naq-target-ring');
      if (ring) gsap.to(ring, { borderColor: 'rgba(255,70,70,0.9)', duration: 0.12 });
      gsap.to(data.el, {
        scale: 1.4, opacity: 0, duration: 0.32, ease: 'power1.out',
        onComplete: () => { data.el.remove(); if (this.running) this._spawnOne(); },
      });
    } else {
      data.el.remove();
      if (this.running) this._spawnOne();
    }
  },

  _killAllTargets() {
    this._targets.forEach(t => { clearTimeout(t.timer); t.el.remove(); });
    this._targets = [];
  },

  _burst(x, y, count) {
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'naq-burst';
      b.style.left            = x + 'px';
      b.style.top             = y + 'px';
      b.style.animationDelay  = (i * 0.07) + 's';
      this._field.appendChild(b);
      setTimeout(() => b.remove(), 520 + i * 80);
    }
  },

  _scorePop(x, y, text) {
    const el = document.createElement('div');
    el.className   = 'naq-score-pop';
    el.textContent = text;
    el.style.left  = x + 'px';
    el.style.top   = y + 'px';
    this._field.appendChild(el);
    setTimeout(() => el.remove(), 760);
  },

  _comboFlash(text) {
    const feed = document.getElementById('naq-hit-feed');
    if (!feed) return;
    feed.innerHTML = '';
    const el = document.createElement('div');
    el.className   = 'naq-combo-flash';
    el.textContent = text;
    feed.appendChild(el);
    setTimeout(() => { if (feed.contains(el)) el.remove(); }, 680);
  },

  end() {
    this._killAllTargets();
    clearInterval(this._timer);
    this.running = false;

    const acc   = (this.hits + this.misses) > 0
      ? Math.round(this.hits / (this.hits + this.misses) * 100) : 0;
    const grade = this.score >= 15000 ? 'S'
      : this.score >= 9000  ? 'A'
      : this.score >= 5000  ? 'B'
      : this.score >= 2000  ? 'C' : 'D';
    const maxM  = this.maxCombo >= 10 ? 5
      : this.maxCombo >= 6 ? 3
      : this.maxCombo >= 3 ? 2 : 1;

    const gradeEl = document.getElementById('naq-final-grade');
    if (gradeEl) { gradeEl.textContent = grade; gradeEl.className = 'naq-grade ' + grade; }

    const statEl = document.getElementById('naq-final-stats');
    if (statEl) {
      statEl.innerHTML =
        `HITS &nbsp;&nbsp;&nbsp; ${this.hits}   MISSES &nbsp; ${this.misses}<br>` +
        `ACC &nbsp;&nbsp;&nbsp;&nbsp; ${acc}%<br>` +
        `MAX COMBO &nbsp; ×${maxM}`;
    }

    const scoreEl = document.getElementById('naq-final-score');
    if (scoreEl) {
      const target = { v: 0 };
      const final  = this.score;
      if (typeof gsap !== 'undefined') {
        gsap.to(target, {
          v: final, duration: 1.3, ease: 'power2.out',
          onUpdate() { scoreEl.textContent = String(Math.round(target.v)).padStart(5, '0'); },
        });
      } else {
        scoreEl.textContent = String(final).padStart(5, '0');
      }
    }

    document.getElementById('naq-end-screen').classList.add('naq-visible');
  },

  close() {
    this._killAllTargets();
    clearInterval(this._timer);
    this.running = false;
    // Hide reticle and remove listeners
    if (this._reticle) {
      this._reticle.style.display = 'none';
      this._overlay.removeEventListener('mousemove', this._onMouseMove);
      this._overlay.removeEventListener('click',     this._onReticleClick);
    }
    // Restore JS cursor
    document.body.classList.remove('naq-playing');
    document.getElementById('naq-start-screen').classList.remove('naq-visible');
    document.getElementById('naq-end-screen').classList.remove('naq-visible');

    const hc = document.querySelector('.hero-content');
    if (!this._overlay) return;
    if (typeof gsap !== 'undefined') {
      gsap.to(this._overlay, {
        opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          this._overlay.style.display = 'none';
          this._overlay.classList.remove('naq-active');
          if (hc) hc.style.visibility = '';
        },
      });
    } else {
      this._overlay.style.display = 'none';
      this._overlay.classList.remove('naq-active');
      if (hc) hc.style.visibility = '';
    }
  },
};

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
  projectModal.init();
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

  // Low performance mode toggle
  lowPerf.init();

  // NODE ACQUIRE — hidden aim trainer minigame in hero
  nodeAcquire.init();

  // Fire the loader last — its exit callback triggers hero animations
  loader.init();
}

// Kick off when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => waitForLibraries(boot));
} else {
  waitForLibraries(boot);
}
