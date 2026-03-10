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

  /* -- Three.js loader scene: wireframe icosahedron on grid -- */
  initThree() {
    const canvas = document.getElementById('loader-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Wireframe icosahedron
    const geoIco = new THREE.IcosahedronGeometry(1.4, 1);
    const matIco = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const ico = new THREE.Mesh(geoIco, matIco);
    scene.add(ico);

    // Inner solid for depth
    const matSolid = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.85,
    });
    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 1), matSolid);
    scene.add(inner);

    // Horizontal grid
    const gridHelper = new THREE.GridHelper(12, 18, 0x222222, 0x111111);
    gridHelper.position.y = -2.5;
    scene.add(gridHelper);

    // Particle points cloud (floating nodes)
    const ptCount = 120;
    const ptPositions = new Float32Array(ptCount * 3);
    for (let i = 0; i < ptCount; i++) {
      ptPositions[i * 3]     = randFloat(-6, 6);
      ptPositions[i * 3 + 1] = randFloat(-4, 4);
      ptPositions[i * 3 + 2] = randFloat(-6, 6);
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPositions, 3));
    const ptMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.4 });
    const particles = new THREE.Points(ptGeo, ptMat);
    scene.add(particles);

    // Store refs — including materials so exit() can tween their opacity
    this.threeScene = {
      renderer, scene, camera, ico, inner, particles,
      matIco, matSolid, ptMat,
      spinMultiplier: 1,  // tweened upward during dissolve
    };

    // Handle resize
    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Animation loop — uses spinMultiplier so exit can accelerate the spin
    const animate = () => {
      this.animFrame = requestAnimationFrame(animate);
      const m = this.threeScene.spinMultiplier;
      ico.rotation.x   += 0.004 * m;
      ico.rotation.y   += 0.006 * m;
      inner.rotation.copy(ico.rotation);
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
          // Occasional horizontal jitter
          if (Math.random() < 0.1) {
            n.style.transform = `translateX(${randFloat(-8, 8)}px) skewX(${randFloat(-4, 4)}deg)`;
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

  /* -- Creative dissolve: scatter, corrupt, spin-up, then fade -- */
  exit() {
    clearInterval(this._glitchInterval);

    if (typeof gsap === 'undefined') {
      // Graceful fallback: instant hide
      document.getElementById('loader').style.display = 'none';
      const sw = document.getElementById('site-wrapper');
      sw.style.opacity = '1'; sw.style.visibility = 'visible';
      heroAnimations.play();
      this.cleanup();
      return;
    }

    // Phase 0 — Scramble the percent counter immediately
    let scrambles = 0;
    const scrambleIv = setInterval(() => {
      if (this.percentEl) {
        this.percentEl.style.filter = `skewX(${randFloat(-6, 6)}deg)`;
        this.percentEl.textContent  = randInt(0, 999).toString().padStart(3, '0');
      }
      if (++scrambles > 14) clearInterval(scrambleIv);
    }, 55);

    // Phase 1 — Erode ASCII symbol blocks
    setTimeout(() => {
      document.querySelectorAll('.symbol-block').forEach(el => this._erodeBlock(el));
    }, 80);

    const tl = gsap.timeline({ onComplete: () => this.cleanup() });

    // Counter split-fade
    tl.to('#loader-label',   { opacity: 0, y: -8,  duration: 0.25 }, 0.1);
    tl.to('#loader-percent', { opacity: 0, duration: 0.35, ease: 'power2.in',
      onStart: () => {
        if (this.percentEl) this.percentEl.style.filter = '';
      }
    }, 0.6);

    // Scatter every rain number outward — each flies a random direction
    tl.to('.rain-num', {
      x:        () => randFloat(-700, 700),
      y:        () => randFloat(-600, 600),
      opacity:  0,
      scale:    () => randFloat(0.05, 1.8),
      rotation: () => randInt(-200, 200),
      duration: () => randFloat(0.45, 0.85),
      stagger:  { amount: 0.4, from: 'random' },
      ease:     'power2.in',
    }, 0.05);

    // Symbol blocks fade after erosion
    tl.to('.symbol-block', { opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power2.in' }, 0.25);

    // 3D shape — spin accelerates then canvas fades
    if (this.threeScene) {
      tl.to(this.threeScene, {
        spinMultiplier: 12,
        duration: 0.7,
        ease: 'power2.in',
      }, 0.2);
      tl.to(this.threeScene.matIco,   { opacity: 0, duration: 0.45 }, 0.7);
      tl.to(this.threeScene.matSolid, { opacity: 0, duration: 0.45 }, 0.7);
      tl.to(this.threeScene.ptMat,    { opacity: 0, duration: 0.45 }, 0.7);
      tl.to('#loader-canvas', { opacity: 0, duration: 0.35 }, 0.85);
    }

    // Scanline burst sequence — rapid flicker then gone
    tl.to('#loader .scanlines', { opacity: 0.9, duration: 0.04 }, 0.65);
    tl.to('#loader .scanlines', { opacity: 0,   duration: 0.06 }, 0.70);
    tl.to('#loader .scanlines', { opacity: 0.7, duration: 0.04 }, 0.76);
    tl.to('#loader .scanlines', { opacity: 0.4, duration: 0.04 }, 0.82);
    tl.to('#loader .scanlines', { opacity: 0,   duration: 0.1  }, 0.87);

    // Loader background dissolves (black fades to transparent, revealing site behind)
    tl.to('#loader', {
      backgroundColor: 'rgba(0,0,0,0)',
      duration: 0.55,
      ease: 'power1.in',
    }, 0.88);

    // Site fades in underneath
    tl.to('#site-wrapper', {
      opacity:    1,
      visibility: 'visible',
      duration:   0.5,
      ease:       'power2.out',
    }, 0.9);

    // Hero text animations fire as site becomes fully visible
    tl.call(() => heroAnimations.play(), null, 1.1);
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
        // Show 100 cleanly, then exit
        if (this.percentEl) this.percentEl.textContent = '100';
        setTimeout(() => this.exit(), 500);
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
  scene: null,
  camera: null,
  particles: null,
  mouse: { x: 0, y: 0 },
  targetMouse: { x: 0, y: 0 },

  init() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const w = window.innerWidth, h = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(w, h);

    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    this.camera.position.z = 5;

    // Sparse particle field
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 300 : 700;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = randFloat(-8, 8);
      positions[i * 3 + 1] = randFloat(-5, 5);
      positions[i * 3 + 2] = randFloat(-6, 2);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: window.innerWidth < 768 ? 0.018 : 0.022,
      transparent: true,
      opacity: 0.35,
    });
    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);

    // ── UPGRADED GEOMETRY COMPOSITION ──
    // 1. Central wireframe octahedron — angular, structural focal shape
    const octGeo = new THREE.OctahedronGeometry(1.7, 0);
    const octMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, wireframe: true, transparent: true, opacity: 0.065,
    });
    const octahedron = new THREE.Mesh(octGeo, octMat);
    this.scene.add(octahedron);

    // 2. Orbital ring 1 — flat torus tilted 18°
    const r1Geo = new THREE.TorusGeometry(2.5, 0.007, 2, 90);
    const r1Mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
    const ring1 = new THREE.Mesh(r1Geo, r1Mat);
    ring1.rotation.x = Math.PI * 0.18;
    this.scene.add(ring1);

    // 3. Orbital ring 2 — larger, cross-tilted for depth
    const r2Geo = new THREE.TorusGeometry(3.3, 0.005, 2, 90);
    const r2Mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 });
    const ring2 = new THREE.Mesh(r2Geo, r2Mat);
    ring2.rotation.x = Math.PI * 0.42;
    ring2.rotation.z = Math.PI * 0.15;
    this.scene.add(ring2);

    // 4. Outer icosahedron shell — very faint structural cage
    const icoGeo  = new THREE.IcosahedronGeometry(4.2, 1);
    const icoMat  = new THREE.MeshBasicMaterial({
      color: 0xffffff, wireframe: true, transparent: true, opacity: 0.014,
    });
    const icoShell = new THREE.Mesh(icoGeo, icoMat);
    this.scene.add(icoShell);

    // Store shape refs for animate()
    this.shapes = { octahedron, ring1, ring2, icoShell };

    this.animate();

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      this.targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
  },

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth camera parallax following mouse
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    this.camera.position.x = this.mouse.x * 0.4;
    this.camera.position.y = this.mouse.y * 0.25;
    this.camera.lookAt(0, 0, 0);

    // Slow rotation of particle cloud
    this.particles.rotation.y += 0.0006;
    this.particles.rotation.x += 0.0002;

    // Rotate complex geometry with cursor-influenced micro-parallax
    if (this.shapes) {
      this.shapes.octahedron.rotation.y  += 0.003  + this.mouse.x * 0.0008;
      this.shapes.octahedron.rotation.x  += 0.001  + this.mouse.y * 0.0008;
      this.shapes.ring1.rotation.z       += 0.002;
      this.shapes.ring2.rotation.y       += 0.0015;
      this.shapes.icoShell.rotation.y    += 0.0005;
      this.shapes.icoShell.rotation.x    += 0.0003;
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
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7, delay: 0.1 })
      .to('.hero-name',    { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
      .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
      .to('.hero-cta',     { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .to('.hud-corner',   { opacity: 1, duration: 0.5 },        '-=0.2');

    // Set initial states
    gsap.set(['.hero-eyebrow', '.hero-name', '.hero-tagline', '.hero-cta'], { y: 30 });
    gsap.set('.hud-corner', { opacity: 0 });
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
            // Mini glitch flash
            card.style.filter = 'brightness(2)';
            setTimeout(() => { card.style.filter = ''; }, 80);
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

    // ── Contact section fade-in ──
    gsap.from('#contact .contact-layout', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
    });

    // ── Social links stagger ──
    gsap.from('.social-link', {
      scrollTrigger: {
        trigger: '.social-list',
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      x: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power3.out',
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
    // Full-screen scanline sweep at random intervals
    setInterval(() => {
      if (Math.random() < 0.15) {
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
      }
    }, 4000);
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

  // Fire the loader last — its exit callback triggers hero animations
  loader.init();
}

// Kick off when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => waitForLibraries(boot));
} else {
  waitForLibraries(boot);
}
