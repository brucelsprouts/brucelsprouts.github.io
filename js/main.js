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

    // Store refs
    this.threeScene = { renderer, scene, camera, ico, particles };

    // Handle resize
    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Animation loop
    const animate = () => {
      this.animFrame = requestAnimationFrame(animate);
      ico.rotation.x += 0.004;
      ico.rotation.y += 0.006;
      inner.rotation.copy(ico.rotation);
      particles.rotation.y += 0.0008;
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

  /* -- Fade the loader out and reveal the site -- */
  exit() {
    clearInterval(this._glitchInterval);

    const tl = gsap.timeline({ onComplete: () => this.cleanup() });

    // Fade out the progress counter
    tl.to('#loader-percent', { opacity: 0, duration: 0.2 });
    tl.to('#loader-label',   { opacity: 0, duration: 0.2 }, '<');

    // Scanline flash
    tl.to('#loader .scanlines', { opacity: 0, duration: 0.1 });
    tl.to('#loader .scanlines', { opacity: 1, duration: 0.05 });
    tl.to('#loader .scanlines', { opacity: 0, duration: 0.15 });

    // Slide loader up and out
    tl.to('#loader', {
      yPercent: -100,
      duration: 0.7,
      ease: 'power3.in',
    }, '+=0.1');

    // Reveal site simultaneously
    tl.to('#site-wrapper', {
      opacity: 1,
      visibility: 'visible',
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.4');

    // Trigger hero animations after reveal
    tl.call(() => heroAnimations.play(), null, '-=0.2');
  },

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

    // Thin wireframe torus knot — background accent
    const tkGeo = new THREE.TorusKnotGeometry(2.2, 0.06, 80, 10);
    const tkMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.025,
    });
    this.torusKnot = new THREE.Mesh(tkGeo, tkMat);
    this.scene.add(this.torusKnot);

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

    // Very slow torus knot spin
    if (this.torusKnot) {
      this.torusKnot.rotation.x += 0.0008;
      this.torusKnot.rotation.y += 0.0012;
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
   7. CURSOR GLOW
============================================================ */
const cursor = {
  init() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.matchMedia('(hover: none)').matches) return;

    window.addEventListener('mousemove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top  = `${e.clientY}px`;
    }, { passive: true });

    // Expand on clickable elements
    document.querySelectorAll('a, button, input, textarea, .project-card, .skill-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        glow.style.width  = '480px';
        glow.style.height = '480px';
        glow.style.background = 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)';
      });
      el.addEventListener('mouseleave', () => {
        glow.style.width  = '320px';
        glow.style.height = '320px';
        glow.style.background = 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)';
      });
    });
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
   12. SCROLL ANIMATIONS — section headers + contact
============================================================ */
const scrollAnimations = {
  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Section headers (except hero which has its own animation)
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

    // Contact section fade-in
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

    // Contact social links stagger
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

    // Timeline line draw illusion via scaleY
    gsap.from('.timeline::before', {
      scrollTrigger: {
        trigger: '#history',
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1,
      },
      scaleY: 0,
      transformOrigin: 'top',
      ease: 'none',
    });
  },
};

/* ============================================================
   13. GLITCH SCANLINE FLICKER — occasional random flicker
============================================================ */
const glitchEffects = {
  init() {
    // Occasionally flash a full-screen scanline sweep
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

  // Cursor glow
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

  // Ambient full-page glitch flicker
  glitchEffects.init();

  // Fire the loader last — its exit callback triggers hero animations
  loader.init();
}

// Kick off when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => waitForLibraries(boot));
} else {
  waitForLibraries(boot);
}
