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
    { name: 'HTML',          icon: 'assets/icons/html5.svg',                    desc: 'Solid foundation in semantic markup. Built multiple personal projects and this portfolio from scratch.' },
    { name: 'CSS',           icon: 'assets/icons/css.svg',                     desc: 'Comfortable with layouts, animations, custom properties, and responsive design — no frameworks needed.' },
    { name: 'JavaScript',    icon: 'assets/icons/javascript.svg',              desc: 'Front-end scripting: DOM manipulation, fetch/async, canvas, and Three.js for interactive experiences.' },
    // Languages
    { name: 'Java',          icon: 'assets/icons/java-coffee-cup-logo.png',    desc: 'Primary language for CS coursework at Western — OOP, data structures, algorithms, and system design.' },
    { name: 'Python',        icon: 'assets/icons/python.svg',                  desc: 'Used in university projects and personal scripts; comfortable with core syntax and standard libraries.' },
    // Systems
    { name: 'Git',           icon: 'assets/icons/git.svg',                     desc: 'Daily driver for version control — branching, committing, and managing personal projects and repositories on GitHub.' },
    { name: 'Unix / Linux',  icon: 'assets/icons/linux.svg',                   desc: 'Comfortable in the terminal: shell scripting, file system navigation, and course lab environments.' },
    { name: 'Claude Code',   icon: 'assets/icons/claude.svg',                  desc: 'Proficient at creating projects using Claude Code, from planning and structure to implementation and iteration.' },
    // Creative
    { name: 'Blender',       icon: 'assets/icons/blender.svg',                 desc: 'Just getting started — learning 3D modelling, lighting, and rendering. Still early but enjoying the process.' },
    { name: 'After Effects', icon: 'assets/icons/aftereffects.svg',            desc: 'Used professionally during a video editing internship at AMG. Motion graphics, cuts, and transitions.' },
    { name: 'Photoshop',     icon: 'assets/icons/photoshop.svg',               desc: 'Image editing, compositing, and asset creation for web and creative projects.' },
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
      thumb: 'assets/images/projects/portfolio-v1/portfolio-v1-1.png',
      images: ['assets/images/projects/portfolio-v1/portfolio-v1-1.png', 'assets/images/projects/portfolio-v1/portfolio-v1-2.png'],
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
      thumb: 'assets/images/projects/jinx-edit/jinx-edit-1.png',
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
      thumb: 'assets/images/projects/nixiecounter/nixiecounter-1.png',
      images: ['assets/images/projects/nixiecounter/nixiecounter-1.png', 'assets/images/projects/nixiecounter/nixiecounter-2.png'],
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
      thumb: 'assets/images/projects/donut/donut-1.png',
      images: ['assets/images/projects/donut/donut-1.png', 'assets/images/projects/donut/donut-2.png'],
      contain: true,
    },
    {
      id: 5,
      title: 'XPWaste',
      category: 'coding',
      date: '2026-03-10',
      desc: 'Focus timer made for Old School RuneScape players who want to stay on task while grinding. Tracks study sessions, logs history, plays custom notification sounds, and ships as a standalone Windows exe. OSRS and normal mode themes included.',
      stack: ['Python', 'Tkinter', 'PyInstaller'],
      youtube: null,
      github: 'https://github.com/brucelsprouts/xpwaste',
      demo: null,
      thumb: 'assets/images/projects/xpwaste/xpwaste-1.png',
      images: ['assets/images/projects/xpwaste/xpwaste-1.png', 'assets/images/projects/xpwaste/xpwaste-2.png'],
      contain: true,
    },
    {
      id: 6,
      title: 'Portfolio v2',
      category: 'coding',
      date: '2026-07-29',
      desc: 'Cyber-tech themed personal portfolio. The hero is a raymarched black hole — light is integrated through the Schwarzschild potential, so the starfield bends around it and the far side of the accretion disk arcs over the top. It boots through an ASCII loader that renders a low-res draft of that same black hole into a grid of terminal glyphs, then dives through the horizon into the real thing. Plus GSAP scroll animations and low-performance mode. Direction, design, and coding by me — built with AI assistance. If you\'re seeing this, you\'re already here.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'GLSL', 'GSAP'],
      youtube: null,
      github: 'https://github.com/brucelsprouts/brucelsprouts.github.io',
      demo: null,
      thumb: 'assets/images/projects/portfolio-v2/portfolio-v2-1.png',
      images: ['assets/images/projects/portfolio-v2/portfolio-v2-1.png', 'assets/images/projects/portfolio-v2/portfolio-v2-2.png'],
      contain: true,
    },
    {
      id: 7,
      title: 'Hallway',
      category: 'blender',
      date: '2026-03-12',
      desc: 'Quick Blender study of a hallway built from repeating pillars with light entering from the left. A simple scene focused on practicing core rendering and lighting workflow while following a tutorial.',
      stack: ['Blender'],
      youtube: null,
      github: null,
      demo: null,
      thumb: 'assets/images/projects/hallway/hallway-1.png',
      images: ['assets/images/projects/hallway/hallway-1.png', 'assets/images/projects/hallway/hallway-2.png'],
      contain: true,
    },
    {
      id: 8,
      title: 'Ocean Buoy',
      category: 'blender',
      date: '2026-03-16',
      desc: 'Dark ocean night scene where the camera rocks along the water, dips into the ocean, and rises back out shortly after. Mainly a Blender render project with some video post-processing to polish the final look. Media order: edited render image, edited render video, unedited video, and a solids/shaders breakdown render.',
      stack: ['Blender', 'Video Post'],
      youtube: null,
      github: null,
      demo: null,
      thumb: 'assets/images/projects/ocean-buoy/ocean-buoy-1.png',
      media: [
        { type: 'image', src: 'assets/images/projects/ocean-buoy/ocean-buoy-1.png' },
        { type: 'video', src: 'assets/videos/ocean-buoy/ocean-buoy-2.mp4' },
        { type: 'video', src: 'assets/videos/ocean-buoy/ocean-buoy-3.mp4' },
        { type: 'image', src: 'assets/images/projects/ocean-buoy/ocean-buoy-4.png' },
      ],
      images: ['assets/images/projects/ocean-buoy/ocean-buoy-1.png', 'assets/images/projects/ocean-buoy/ocean-buoy-4.png'],
      videos: ['assets/videos/ocean-buoy/ocean-buoy-2.mp4', 'assets/videos/ocean-buoy/ocean-buoy-3.mp4'],
      contain: true,
    },
    {
      id: 9,
      title: 'Earth',
      category: 'blender',
      date: '2026-04-02',
      desc: 'Render of Earth built from UV spheres with a surface, atmosphere, and cloud layer. Compositing was also used for the horizon and glare pass to polish the final look.',
      stack: ['Blender', 'Compositing'],
      youtube: null,
      github: null,
      demo: null,
      thumb: 'assets/images/projects/earth/earth-1.png',
      images: ['assets/images/projects/earth/earth-1.png', 'assets/images/projects/earth/earth-2.png'],
      contain: true,
    },
    {
      id: 10,
      title: 'ClipStack',
      category: 'coding',
      date: '2026-04-03',
      desc: 'A desktop clipboard manager built with Tauri. Supports pinning clips, image previews, searchable history, a global shortcut, and light/dark themes.',
      stack: ['Tauri', 'Rust', 'TypeScript'],
      youtube: null,
      github: 'https://github.com/brucelsprouts/clipstack',
      demo: null,
      thumb: 'assets/images/projects/clipstack/clipstack-1.png',
      images: ['assets/images/projects/clipstack/clipstack-1.png', 'assets/images/projects/clipstack/clipstack-2.png'],
      contain: true,
    },
    {
      id: 11,
      title: 'Flora Discord Bot',
      category: 'coding',
      date: '2026-04-14',
      desc: 'Simple Discord bot for friend servers with welcome/goodbye helper messages and a reaction role panel that assigns one color role at a time.',
      stack: ['JavaScript', 'Node.js', 'Discord Bot'],
      youtube: null,
      github: 'https://github.com/brucelsprouts/flora',
      demo: null,
      thumb: 'assets/images/projects/flora/flora-1.png',
      images: [
        'assets/images/projects/flora/flora-1.png',
        'assets/images/projects/flora/flora-2.png',
        'assets/images/projects/flora/flora-3.png',
      ],
      contain: true,
    },
    {
      id: 12,
      title: 'huh?',
      category: 'coding',
      date: '2026-05-17',
      desc: 'Chrome extension and web app that explains dense text in plain English using Gemini. Highlight anything on the web, right-click, and get an ELI5 breakdown — hit "simpler" until it clicks. Supports multiple draggable cards, local history, and dark mode. No backend, no accounts — your API key stays in your browser.',
      stack: ['JavaScript', 'Chrome Extension', 'Gemini API'],
      youtube: null,
      github: 'https://github.com/brucelsprouts/huh-extension',
      demo: 'https://huh-extension.vercel.app/',
      thumb: 'assets/images/projects/huh/huh-1.png',
      images: ['assets/images/projects/huh/huh-1.png', 'assets/images/projects/huh/huh-2.png'],
      contain: true,
    },
    {
      id: 13,
      title: 'dcheck',
      category: 'coding',
      date: '2026-07-05',
      desc: 'A lightweight system tray app for Windows that logs connection drops. Left-click the tray icon to pull up a dark-themed canvas graph of your ping times. Connection timeouts get marked as red bars, and latency spikes show up in amber. Configurable ping target, checking frequency, clear logs, and launch-on-startup.',
      stack: ['Electron', 'HTML5 Canvas', 'Vanilla CSS/JS'],
      youtube: null,
      github: 'https://github.com/brucelsprouts/dcheck',
      demo: null,
      thumb: 'assets/images/projects/dcheck/dcheck-1.png',
      images: ['assets/images/projects/dcheck/dcheck-1.png'],
      contain: true,
    },
    {
      id: 14,
      title: 'brucekit',
      category: 'coding',
      date: '2026-07-21',
      desc: 'A hotkey-triggered launcher for the tiny tools I kept wishing Windows already had. One shortcut opens a searchable HUD in the tray — OCR grab, colour picker with eyedropper, clipboard history, and a network dropout monitor. Every tool is a self-contained module with its own error boundary, so adding one is a drop-in folder and a broken one can\'t take the launcher down. Fully local: no backend, no accounts, no telemetry.',
      stack: ['Rust', 'Tauri', 'React', 'TypeScript'],
      youtube: null,
      github: 'https://github.com/brucelsprouts/brucekit',
      demo: null,
      thumb: 'assets/images/projects/brucekit/brucekit-1.png',
      images: ['assets/images/projects/brucekit/brucekit-1.png', 'assets/images/projects/brucekit/brucekit-2.png'],
      contain: true,
    },
    {
      id: 15,
      title: 'Brutalism',
      category: 'blender',
      date: '2026-07-26',
      desc: 'An experiment to see how far Claude could drive Blender through an MCP connector. Working from a reference photo of a derelict brutalist housing block in freezing fog, the entire scene was generated from a Python script — no modelling by hand and no imported assets. Every mass is built as a solid and boolean-unioned into one watertight shell, with procedural weathering, an arcaded base, spalled slab edges with exposed rebar, and volumetric fog. Media order: final render, then a clay and wireframe breakdown of the generated geometry.',
      stack: ['Blender', 'Python', 'Claude Code', 'MCP'],
      youtube: null,
      github: null,
      demo: null,
      thumb: 'assets/images/projects/brutalism/brutalism-1.png',
      images: ['assets/images/projects/brutalism/brutalism-1.png', 'assets/images/projects/brutalism/brutalism-2.png'],
      contain: true,
    },
    {
      id: 16,
      title: 'TSE Camp',
      category: 'coding',
      date: '2026-08-14',
      desc: 'Logo, design, and build for Toronto STEM Exploration Camp, a free week-long STEM camp for youth aged 8 to 13 in North York, funded by the Government of Canada and run with VWAT Family Services. It had one job: tell a parent what the camp was, who it was for, and how to register, on a phone, in under a minute. Registration ran through the site, no backend, nothing to go down on a bad connection. All 30 spots filled. I also facilitated during the week, teaching and running experiments with the kids. Media order: landing page, disciplines, daily schedule.',
      stack: ['React', 'Vite', 'Tailwind CSS', 'Vercel'],
      youtube: null,
      github: null,
      demo: 'https://tsecamp.ca',
      thumb: 'assets/images/projects/tsecamp/tsecamp-1.png',
      images: [
        'assets/images/projects/tsecamp/tsecamp-1.png',
        'assets/images/projects/tsecamp/tsecamp-2.png',
        'assets/images/projects/tsecamp/tsecamp-3.png',
      ],
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

/** Format YYYY-MM-DD project date for display */
function formatProjectDate(dateStr) {
  if (!dateStr) return 'Date N/A';
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/** Convert a project title to a URL-safe slug */
function projectSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Sibling .svg placeholder for a raster asset — used as the blur-up
 *  background behind letterboxed thumbs and as the <img> onerror fallback.
 *  Extension-agnostic so jpg/webp assets get a placeholder too. */
function placeholderSrc(src) {
  return src.replace(/\.(png|jpe?g|webp)$/i, '.svg');
}

/* ============================================================
   3. LOADER — ASCII-rendered recursive lattice
   A Menger-sponge lattice is raymarched at low resolution
   (pass 1), then quantized into a grid of Share Tech Mono
   glyphs at full resolution (pass 2) — a genuine 3D object
   drawn in terminal characters. Progress drives convergence:
   the character grid subdivides, the lattice gains recursion
   depth, and the tonal ramp widens. On exit every cell streams
   inward and the grid collapses to a single point — the
   singularity that "becomes" the hero's black hole.
============================================================ */

const LOADER_VERT = `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/* Pass 1 — a monochrome "draft render" of the hero's black hole:
   the same Schwarzschild-bent geodesics, accretion disk and photon
   ring, but luminance-only and at terminal resolution. The site is
   literally compiling a low-res preview of what you're about to see.
   On exit the camera dives through the horizon into the real thing. */
const LOADER_SCENE_FRAG = `
precision highp float;

uniform vec2  uRes;        // render-target resolution
uniform float uTime;
uniform float uProgress;   // 0..1 boot progress — disk powers up
uniform float uCollapse;   // 0..1 exit — camera dives into the hole

const float R_IN   = 2.60;
const float R_OUT  = 7.80;
const float B_CRIT = 2.598;

float hash13(vec3 p3) {
  p3  = fract(p3 * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash13(i);
  float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 3; i++) {
    s += a * vnoise(p);
    p *= 2.04;
    a *= 0.5;
  }
  return s;
}

/* Disk emission — a simplified cut of the hero's disk: spiral wind,
   radial inflow, brightness scaling with boot progress */
float diskEmission(vec3 p) {
  float r = length(p.xz);
  if (r < R_IN || r > R_OUT) return 0.0;

  float ang  = atan(p.z, p.x);
  float wind = uTime * 0.30 + 10.0 * (inversesqrt(r * r * r) - 0.08);
  float a    = ang + wind;
  vec2  q    = vec2(cos(a), sin(a)) * r;

  float rIn  = r + uTime * 0.35;
  float n    = fbm(vec3(q * 0.80, rIn * 0.45));
  float band = fbm(vec3(rIn * 2.0 + a * 0.9, a * 1.2, uTime * 0.12));
  float dens = pow(clamp(n * 1.25 + band * 0.35 - 0.28, 0.0, 1.0), 1.4);

  float inner   = smoothstep(R_IN, R_IN + 0.9, r);
  float outer   = 1.0 - smoothstep(R_OUT * 0.55, R_OUT, r);
  float falloff = 1.0 / (0.55 + r * 0.30);

  // Continuous base band + turbulent detail — the annulus must stay
  // solid at terminal resolution, detail rides on top of it
  return (dens * 5.5 + 0.55) * inner * outer * falloff;
}

/* Doppler beaming — approaching side brighter, like the hero */
float doppler(vec3 p, vec3 camPos) {
  float r = max(length(p.xz), R_IN);
  vec3  v = normalize(cross(vec3(0.0, 1.0, 0.0), vec3(p.x, 0.0, p.z)));
  float beta = clamp(0.52 / sqrt(r * 0.45), 0.0, 0.55);
  float d = 1.0 / max(1.0 - beta * dot(v, normalize(camPos - p)), 0.25);
  return clamp(pow(d, 2.2) * 0.45, 0.12, 2.4);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  // Camera: framed like the hero (dist 13, near-equatorial) so the draft
  // lines up with the real render it hands off to; exit dives into the hole
  float dive = smoothstep(0.0, 0.85, uCollapse);
  float dist = mix(13.0, 2.2, dive * dive);
  float az   = uTime * 0.05;
  float el   = 0.14;
  vec3  camPos = vec3(sin(az) * cos(el), sin(el), cos(az) * cos(el)) * dist;

  vec3 fwd   = normalize(-camPos);
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up    = cross(right, fwd);
  vec3 rd    = normalize(fwd + right * uv.x * 0.62 + up * uv.y * 0.62);

  vec3  pos = camPos;
  vec3  h   = cross(pos, rd);
  float h2  = dot(h, h);
  float b   = length(cross(camPos, rd));

  float lum      = 0.0;
  float alpha    = 0.0;
  bool  captured = false;

  for (int i = 0; i < 56; i++) {
    float r = length(pos);
    if (r < 1.02) { captured = true; break; }
    if (r > 44.0 && dot(rd, pos) > 0.0) break;

    float dt   = clamp(r * 0.11, 0.05, 1.6);
    vec3  npos = pos + rd * dt;

    if (pos.y * npos.y < 0.0 && alpha < 0.99) {
      float t   = pos.y / (pos.y - npos.y);
      vec3  hit = mix(pos, npos, t);
      float e   = diskEmission(hit);
      if (e > 0.0) {
        e *= doppler(hit, camPos);
        float a = clamp(e * 0.55, 0.0, 1.0);
        lum   += (1.0 - alpha) * e;
        alpha += (1.0 - alpha) * a;
      }
    }

    rd  += (-1.5 * h2 * pos / pow(r, 5.0)) * dt;
    pos  = npos;
  }

  captured = captured || b < B_CRIT;
  if (captured) lum = 0.0;

  // No starfield: single-sample stars on a hash grid pop in and out as the
  // camera sweeps, and the glyph quantizer amplifies it into constant
  // blinking. The disk and ring carry the frame on their own.

  /* Photon ring */
  float ring = exp(-pow((b - B_CRIT) / 0.055, 2.0)) * 1.4;
  ring *= smoothstep(B_CRIT - 0.03, B_CRIT + 0.05, b);
  lum += ring;

  // Disk powers up over the boot; dive white-out handled by the ASCII pass
  lum *= 0.55 + 0.65 * uProgress;

  lum = lum / (1.0 + lum * 0.55);   // soft tonemap into glyph range

  // .g carries the shadow mask so the ASCII pass can keep the hole clean
  gl_FragColor = vec4(lum, captured ? 1.0 : 0.0, 0.0, 1.0);
}
`;

/* Pass 2 — quantize the scene into a terminal character grid.
   Each cell picks a glyph from the atlas by luminance; the grid
   subdivides (cells shrink in discrete snaps) as progress climbs. */
const LOADER_ASCII_FRAG = `
precision highp float;

uniform vec2      uRes;        // full output resolution
uniform float     uTime;
uniform float     uProgress;
uniform float     uCollapse;
uniform sampler2D uScene;      // pass-1 luminance
uniform sampler2D uAtlas;      // 10 glyphs, ramp " .:-=+*#%@"

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

void main() {
  float c = uCollapse;

  /* The collapse is all camera: pass 1 dives through the horizon, so the
     shadow swallows the frame cell by cell — no screen-space tricks. */
  vec2 ctr = 0.5 * uRes;
  vec2 suv = gl_FragCoord.xy;

  /* Character grid — subdivides in discrete snaps as the boot converges */
  float rows  = floor(mix(24.0, 64.0, uProgress) / 8.0) * 8.0;
  float cellH = uRes.y / rows;
  float cellW = cellH * 0.625;             // Share Tech Mono aspect

  vec2 cellId     = floor(suv / vec2(cellW, cellH));
  vec2 cellCenter = (cellId + 0.5) * vec2(cellW, cellH);
  vec2 sceneUv    = cellCenter / uRes;

  float lum    = 0.0;
  float shadow = 0.0;
  if (sceneUv.x > 0.0 && sceneUv.x < 1.0 && sceneUv.y > 0.0 && sceneUv.y < 1.0) {
    vec2 s = texture2D(uScene, sceneUv).rg;
    lum    = s.r;
    shadow = s.g;
  }

  // No per-cell crackle: random cells lighting up and vanishing 18x a
  // second reads as blinking stars scattered over the render. The grid
  // gets its life from the disk's motion and the subdivision snaps.

  /* Tonal ramp widens as the render converges: 4 levels → 10, but the
     levels always span the full atlas — a coarse boot renders in bold
     chunky glyphs ( - * @ ), not in the faint end of the ramp */
  float ramp = floor(mix(4.0, 10.0, uProgress));
  float gi   = clamp(floor(lum * ramp), 0.0, ramp - 1.0);
  gi = floor(gi * 9.0 / (ramp - 1.0) + 0.5);

  // Collapse crush: lit cells run toward '@' as the disk blueshifts past;
  // empty space stays black so the shadow reads until the flash
  gi = mix(gi, 9.0, smoothstep(0.45, 0.85, c) * step(0.02, lum));

  vec2 inCell = fract(suv / vec2(cellW, cellH));
  vec2 auv    = vec2((gi + inCell.x) / 10.0, inCell.y);
  float glyph = texture2D(uAtlas, auv).r;

  // Glyph tone carries a hint of the underlying luminance for depth
  float col = glyph * (0.55 + 0.45 * lum);

  // Vignette + subtle grain, matching the hero's finish. Grain is damped
  // inside the shadow so the hole reads as a true void.
  vec2 v = (gl_FragCoord.xy - ctr) / uRes.y;
  col *= 1.0 - 0.30 * dot(v, v);
  col += (hash21(gl_FragCoord.xy + fract(uTime) * 61.7) - 0.5) * 0.02
       * (1.0 - step(0.5, shadow));

  gl_FragColor = vec4(vec3(max(col, 0.0)), 1.0);
}
`;

/* 4×5 block-digit font for the percent readout — the counter itself
   is drawn in ASCII, matching the renderer it sits on top of */
const ASCII_DIGITS = {
  '0': ['####', '#  #', '#  #', '#  #', '####'],
  '1': ['  # ', ' ## ', '  # ', '  # ', ' ###'],
  '2': ['####', '   #', '####', '#   ', '####'],
  '3': ['####', '   #', ' ###', '   #', '####'],
  '4': ['#  #', '#  #', '####', '   #', '   #'],
  '5': ['####', '#   ', '####', '   #', '####'],
  '6': ['####', '#   ', '####', '#  #', '####'],
  '7': ['####', '   #', '  # ', '  # ', '  # '],
  '8': ['####', '#  #', '####', '#  #', '####'],
  '9': ['####', '#  #', '####', '   #', '####'],
};

function renderAsciiNumber(n) {
  const digits = String(n).split('');
  const rows = [];
  for (let r = 0; r < 5; r++) {
    rows.push(digits.map(d => (ASCII_DIGITS[d] || ASCII_DIGITS['0'])[r]).join('  '));
  }
  return rows.join('\n');
}

const loader = {
  el: null,
  percentEl: null,
  threeScene: null,
  animFrame: null,
  progress: 0,

  init() {
    this.el         = document.getElementById('loader');
    this.percentEl  = document.getElementById('loader-percent');

    this.initThree();
    this.spawnHexPanels();
    this.spawnErrorFeed();
    this.spawnGlitchBlocks();
    this.animateProgress();
  },

  /* -- Bake the glyph ramp " .:-=+*#%@" into a 10-cell atlas texture -- */
  _bakeGlyphAtlas() {
    const RAMP = ' .:-=+*#%@';
    const GW = 20, GH = 32;                    // per-glyph cell, mono aspect
    const cv = document.createElement('canvas');
    cv.width = GW * RAMP.length;
    cv.height = GH;
    const ctx = cv.getContext('2d');

    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#fff';
      ctx.font = '26px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < RAMP.length; i++) {
        ctx.fillText(RAMP[i], i * GW + GW / 2, GH / 2 + 1);
      }
    };
    draw();

    const tex = new THREE.CanvasTexture(cv);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = false;

    // Re-bake once the webfont lands, in case it beat us by losing the race
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { draw(); tex.needsUpdate = true; });
    }
    return tex;
  },

  /* -- Two-pass shader scene: raymarched lattice → ASCII quantizer -- */
  initThree() {
    const canvas = document.getElementById('loader-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    } catch (err) {
      return;   // no WebGL — loader falls back to its DOM effects only
    }
    renderer.setPixelRatio(1);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const atlas  = this._bakeGlyphAtlas();

    // Pass 1 target — small; the ASCII pass only ever samples cell centers.
    // Width tracks the window aspect so circles stay circles after the
    // ASCII pass stretches this to fullscreen.
    const RT_H = 135;
    const rtW = () => Math.max(64, Math.round(RT_H * window.innerWidth / Math.max(window.innerHeight, 1)));
    const sceneRT = new THREE.WebGLRenderTarget(rtW(), RT_H, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });

    const sceneMat = new THREE.ShaderMaterial({
      vertexShader:   LOADER_VERT,
      fragmentShader: LOADER_SCENE_FRAG,
      depthTest: false, depthWrite: false,
      uniforms: {
        uRes:      { value: new THREE.Vector2(rtW(), RT_H) },
        uTime:     { value: 0 },
        uProgress: { value: 0 },
        uCollapse: { value: 0 },
      },
    });
    const sceneScene = new THREE.Scene();
    sceneScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), sceneMat));

    const asciiMat = new THREE.ShaderMaterial({
      vertexShader:   LOADER_VERT,
      fragmentShader: LOADER_ASCII_FRAG,
      depthTest: false, depthWrite: false,
      uniforms: {
        uRes:      { value: new THREE.Vector2(1, 1) },
        uTime:     { value: 0 },
        uProgress: { value: 0 },
        uCollapse: { value: 0 },
        uScene:    { value: sceneRT.texture },
        uAtlas:    { value: atlas },
      },
    });
    const asciiScene = new THREE.Scene();
    asciiScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), asciiMat));

    // ASCII pass runs at native resolution so glyphs stay razor sharp
    const setSize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);   // keep CSS size at 100%
      asciiMat.uniforms.uRes.value.set(w, h);
      const rw = rtW();
      sceneRT.setSize(rw, RT_H);
      sceneMat.uniforms.uRes.value.set(rw, RT_H);
    };
    setSize();
    this._onLoaderResize = setSize;
    window.addEventListener('resize', setSize);

    // collapse.value is tweened 0→1 by exit() to drive the implosion
    this.threeScene = {
      renderer, camera, sceneRT, atlas,
      sceneMat, asciiMat, sceneScene, asciiScene,
      collapse: { value: 0 },
    };

    const t0 = performance.now();
    const animate = () => {
      this.animFrame = requestAnimationFrame(animate);
      const t = (performance.now() - t0) / 1000;
      const p = this.progress / 100;
      const c = this.threeScene.collapse.value;
      sceneMat.uniforms.uTime.value     = t;
      sceneMat.uniforms.uProgress.value = p;
      sceneMat.uniforms.uCollapse.value = c;
      asciiMat.uniforms.uTime.value     = t;
      asciiMat.uniforms.uProgress.value = p;
      asciiMat.uniforms.uCollapse.value = c;

      renderer.setRenderTarget(sceneRT);
      renderer.render(sceneScene, camera);
      renderer.setRenderTarget(null);
      renderer.render(asciiScene, camera);
    };
    animate();
  },

  /* -- Spawn glitching number rain across the screen -- */
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

  /* ── Scrolling build-log feed at the bottom — the "compiler output"
     of the draft render happening above it ── */
  spawnErrorFeed() {
    const container = document.getElementById('error-feed');
    if (!container || typeof gsap === 'undefined') return;

    const messages = [
      { text: 'CC    shaders/geodesic.frag',             cls: 'info' },
      { text: 'CC    shaders/ascii_quantizer.frag',      cls: 'info' },
      { text: 'LINK  raymarch kernel [56 steps]',        cls: 'info' },
      { text: 'ALLOC framebuffer 240x135 R8',            cls: 'info' },
      { text: 'BAKE  glyph atlas " .:-=+*#%@"',          cls: 'info' },
      { text: 'CALC  photon sphere  b = 2.598',          cls: 'warn' },
      { text: 'INIT  doppler beaming  beta = 0.52',      cls: 'info' },
      { text: 'PASS  1/2 scene luminance ........ OK',   cls: 'info' },
      { text: 'PASS  2/2 glyph quantizer ........ OK',   cls: 'info' },
      { text: 'WARN  disk shear unbounded — clamped',    cls: 'warn' },
      { text: 'TRACE bending 32400 geodesics',           cls: 'info' },
      { text: 'TEST  event horizon: unreachable',        cls: 'crit' },
      { text: 'SYNC  vblank 16.6 ms',                    cls: 'info' },
      { text: 'WARN  singularity detected at r=0',       cls: 'crit' },
      { text: '>>>   converging draft render . . .',     cls: 'info' },
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

  /* -- Exit: one continuous move through the hole. The draft rushes in
     to the horizon, a hard cut lands at peak zoom (both sides are black
     there, so the seam is invisible), then the real render pulls back
     out — entering one side and exiting the other. -- */
  exit() {
    clearInterval(this._errorInterval);
    (this._hexIntervals || []).forEach(iv => clearInterval(iv));
    clearTimeout(this._glitchBlockTimer);

    if (typeof gsap === 'undefined') {
      document.getElementById('loader').style.display = 'none';
      const sw = document.getElementById('site-wrapper');
      sw.style.opacity = '1'; sw.style.visibility = 'visible';
      const hc = document.getElementById('hero-canvas');
      if (hc) hc.style.opacity = '1';
      heroAnimations.play();
      this.cleanup();
      return;
    }

    const tl = gsap.timeline({ onComplete: () => this.cleanup() });

    // ── Phase A (0–0.25s): HUD chrome strips away ──
    tl.to('#loader-label', { opacity: 0, duration: 0.18, ease: 'steps(3)' }, 0.0);
    tl.to('#hex-panels',   { opacity: 0, duration: 0.22, ease: 'steps(4)' }, 0.02);
    tl.to('#error-feed',   { opacity: 0, duration: 0.22, ease: 'steps(4)' }, 0.06);

    // ── Phase B (0.10–0.72s): ENTERING — rush into the horizon ──
    // Two motions compound: the shader flies the camera in (shadow
    // swallows the frame), and the canvas itself scales up, so the
    // glyph grid rushes past the edges as we fall in.
    //
    // expo.in ramps hard: the frame barely creeps for the first half,
    // then slams inward over the last ~150ms. That acceleration is what
    // sells being pulled in, where a linear ramp just reads as a zoom.
    if (this.threeScene) {
      tl.to(this.threeScene.collapse, {
        value: 1,
        duration: 0.62,
        ease: 'expo.in',
      }, 0.10);
    }
    tl.to('#loader-canvas', {
      scale: 6.0,
      filter: 'blur(14px)',
      duration: 0.62,
      ease: 'expo.in',
      transformOrigin: '50% 50%',
    }, 0.10);

    // ── Phase C (0.72s): hard cut at peak zoom ──
    // Both sides are black here — inside the draft's horizon, and the
    // hero over-zoomed into its own shadow — so the seam is invisible.
    tl.set('#site-wrapper', { opacity: 1, visibility: 'visible' }, 0.72);
    tl.set('#hero-canvas',  { scale: 6.0, filter: 'blur(14px)', opacity: 1 }, 0.72);
    tl.set('#loader',       { opacity: 0 }, 0.72);

    // ── Phase D (0.72–1.78s): EXITING — burst out the other side ──
    // expo.out mirrors the entry: most of the scale is shed in the first
    // ~200ms, so you're flung clear of the hole and then coast to rest.
    tl.to('#hero-canvas', {
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.06,
      ease: 'expo.out',
      transformOrigin: '50% 50%',
    }, 0.72);

    // Hero text starts as the scene settles out of the pull-back
    tl.call(() => heroAnimations.play(), null, 1.05);
  },

  /* -- Animate the % counter up to 100 then exit -- */
  animateProgress() {
    // Dev affordance: open the site with #loader-hold (or ?loader-hold)
    // to freeze the boot and inspect the draft render indefinitely.
    if (window.location.hash === '#loader-hold' ||
        window.location.search.includes('loader-hold')) return;
    const duration = 1500; // ms — long enough for the draft render to read
    const start    = performance.now();
    const labelEl  = document.getElementById('loader-label');

    // Boot phases — label tracks the render as it converges
    const phases = [
      [0,  'INITIALIZING RENDERER'],
      [26, 'RAYMARCHING LATTICE'],
      [56, 'SUBDIVIDING GEOMETRY'],
      [86, 'CONVERGENCE LOCKED'],
    ];

    const tick = (now) => {
      const elapsed = now - start;
      const rawT    = clamp(elapsed / duration, 0, 1);

      // Ease-out cubic for most of the range, then stall at 99 briefly
      const eased = rawT < 0.95
        ? 1 - Math.pow(1 - (rawT / 0.95), 3)
        : 1;

      const displayed = Math.floor(eased * 100);
      this.progress = displayed;

      if (labelEl) {
        let label = phases[0][1];
        for (const [th, txt] of phases) if (displayed >= th) label = txt;
        if (labelEl.textContent !== label) labelEl.textContent = label;
      }

      if (this.percentEl) {
        this.percentEl.textContent = renderAsciiNumber(displayed);
        // Occasional one-frame glitch on the number
        if (Math.random() < 0.05) {
          const fake = randInt(Math.max(0, displayed - 20), Math.min(100, displayed + 20));
          this.percentEl.textContent = renderAsciiNumber(fake);
          setTimeout(() => { this.percentEl.textContent = renderAsciiNumber(displayed); }, 60);
        }
      }

      if (rawT < 1) {
        requestAnimationFrame(tick);
      } else {
        // Counter has done its job — flick it out and let the label carry
        // the last beat. Fading opacity (not display) keeps the label put.
        if (labelEl) labelEl.textContent = 'CONVERGENCE LOCKED';
        if (this.percentEl) {
          if (typeof gsap !== 'undefined') {
            gsap.to(this.percentEl, { opacity: 0, duration: 0.14, ease: 'steps(3)' });
          } else {
            this.percentEl.style.opacity = '0';
          }
        }
        setTimeout(() => this.exit(), 240);
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
      if (this._onLoaderResize) window.removeEventListener('resize', this._onLoaderResize);
      this.threeScene.sceneMat.dispose();
      this.threeScene.asciiMat.dispose();
      this.threeScene.sceneRT.dispose();
      this.threeScene.atlas.dispose();
      this.threeScene.renderer.dispose();
    }
    if (this.el) this.el.remove();
  },
};

/* ============================================================
   4. HERO — Three.js raymarched black hole (gravitational lensing)
============================================================ */

/* Fullscreen-quad vertex shader — position is already in clip space */
const HERO_VERT = `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/* Fragment shader.
   Each pixel's ray is integrated through the Schwarzschild potential
   (Newtonian-limit geodesic, r_s = 1) so the background starfield bends
   around the hole and the far side of the accretion disk arcs over the top.
   Everything stays greyscale to match the site palette. */
const HERO_FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform vec2  uMouse2;   // slower-eased cursor — drives roll/dolly so motion feels layered
uniform int   uSteps;
uniform float uCamDist;
uniform float uFov;
uniform float uYShift;
uniform float uElev;

const int   MAX_STEPS = 64;
const float R_IN      = 2.70;   // inner disk edge (ISCO-ish)
const float R_OUT     = 8.20;   // outer disk edge
const float B_CRIT    = 2.598;  // critical impact parameter — photon ring

/* ── hashes & noise ── */
float hash13(vec3 p3) {
  p3  = fract(p3 * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash13(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p *= 2.04;
    a *= 0.5;
  }
  return s;
}

/* ── background starfield, sampled in the (bent) ray direction ── */
vec3 stars(vec3 dir) {
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    float sc = 80.0 + float(i) * 130.0;
    vec3  p  = dir * sc;
    vec3  id = floor(p);
    vec3  f  = fract(p) - 0.5;
    float h  = hash13(id + float(i) * 13.7);
    if (h > 0.945 - float(i) * 0.005) {
      vec3 off = (vec3(hash13(id + 1.7), hash13(id + 3.1), hash13(id + 5.3)) - 0.5) * 0.6;
      float d  = length(f - off);
      float tw = 0.72 + 0.28 * sin(uTime * 1.6 + h * 90.0);
      float s  = smoothstep(0.085, 0.0, d) * (0.30 + 0.70 * fract(h * 137.0)) * tw;
      // per-star temperature — some lean warm, some cool, like a real field
      vec3 tint = mix(vec3(1.00, 0.87, 0.74), vec3(0.76, 0.87, 1.06), fract(h * 61.0));
      vec3 sc   = mix(vec3(1.0), tint, 0.45);
      acc += s * sc;
      // occasional bright star gets a soft halo, so the field has depth
      if (h > 0.992) acc += sc * smoothstep(0.30, 0.0, d) * 0.35 * tw;
    }
  }
  return acc;
}

/* ── accretion disk emission at a point in the equatorial plane ── */
float diskEmission(vec3 p) {
  float r = length(p.xz);
  if (r < R_IN || r > R_OUT) return 0.0;

  float ang  = atan(p.z, p.x);
  // Rotation = rigid drift + a *bounded* oscillating differential term. Pure
  // Keplerian shear (t/r^1.5) winds the pattern unboundedly, degenerating into
  // ever-tighter rings that alias on the pixel grid after ~30s. Bounding the
  // differential keeps the filaments loose and coherent forever.
  float wind = uTime * 0.25
             + (11.0 + 9.0 * sin(uTime * 0.10)) * (inversesqrt(r * r * r) - 0.078);
  float a    = ang + wind;
  vec2  q    = vec2(cos(a), sin(a)) * r;

  // Radial inflow — all structure drifts toward the horizon, so the disk reads
  // as unstable accretion instead of stable rings (also breaks moiré: the fine
  // pattern never sits still on the pixel grid long enough to alias).
  float rIn = r + uTime * 0.35;

  // All noise is sampled in the Cartesian frame q, never from the raw angle:
  // atan jumps by 2π at ±π, and feeding that into a noise lookup puts a visible
  // seam down the disk where the pattern restarts.
  float n    = fbm(vec3(q * 0.80, rIn * 0.45));
  float band = fbm(vec3(q * 2.10, rIn * 2.2 + uTime * 0.14));
  // Fine filaments — finer scale, drifting inward with the flow
  float fil  = fbm(vec3(q * 4.60, rIn * 4.5 + uTime * 0.10));
  float dens = pow(clamp(n * 1.20 + band * 0.30 + fil * 0.26 - 0.30, 0.0, 1.0), 1.5);

  // Spiral arms. An *integer* angular harmonic is seam-free: when a jumps by 2π
  // the phase jumps by 4π, which sin() doesn't notice.
  dens *= 0.80 + 0.40 * (0.5 + 0.5 * sin(2.0 * a + rIn * 1.6));

  // Co-rotating hot spots: q is the shear-corrected frame, so a fixed point in q
  // orbits at its radius' Keplerian rate. Pinpoints — at true scale anything
  // bigger would be an implausibly enormous feature of the disk.
  float hs = exp(-14.0 * length(q - vec2(3.1, 1.2)))
           + 0.75 * exp(-12.0 * length(q + vec2(4.3, 2.1)));
  dens *= 1.0 + hs * (0.90 + 0.30 * sin(uTime * 0.5));

  // Gentle turbulent shimmer — the gas flickers instead of gliding
  dens *= 1.0 + 0.07 * sin(uTime * 3.5 + a * 4.0 + r * 3.0);

  float inner   = smoothstep(R_IN, R_IN + 1.0, r);
  float outer   = 1.0 - smoothstep(R_OUT * 0.58, R_OUT, r);
  float falloff = 1.0 / (0.55 + r * 0.30);

  float e = dens * inner * outer * falloff * 3.0;

  // Doomed embers — small star-like knots that spiral in from the rim and are
  // reborn at the outer edge. Slow, compact, and duty-cycled (dark stretches
  // between falls) so they stay in scale with the disk.
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    float ph  = fract(uTime * (0.022 + fk * 0.009) + fk * 0.41);  // full cycle 0→1
    float phA = ph / 0.62;                                        // fall happens in the
    float act = 1.0 - step(1.0, phA);                             // first 62%; then dark
    float rk = mix(R_OUT * 0.92, R_IN + 0.10, min(phA, 1.0) * min(phA, 1.0));
    float ak = fk * 2.6 + uTime * 1.5 / pow(rk, 1.5);             // sub-Keplerian drift
    vec2  pk = vec2(cos(ak), sin(ak)) * rk;
    vec2  dv = p.xz - pk;
    vec2  tg = vec2(-pk.y, pk.x) / rk;                            // unit tangent
    float dl  = dot(dv, tg);
    float dp2 = max(dot(dv, dv) - dl * dl, 0.0);
    float ember = exp(-(dl * dl * 120.0 + dp2 * 400.0)) * 2.6;    // pinpoint, faint motion streak
    e += ember * act
       * smoothstep(0.03, 0.12, phA) * smoothstep(1.0, 0.90, min(phA, 1.0))
       * (0.80 + 0.20 * sin(uTime * 2.2 + fk * 7.0));
  }

  return e;
}

/* ── relativistic beaming: the side rotating toward the camera is brighter ── */
float doppler(vec3 p, vec3 camPos) {
  float r = max(length(p.xz), R_IN);
  vec3  v = normalize(cross(vec3(0.0, 1.0, 0.0), vec3(p.x, 0.0, p.z)));
  float beta = clamp(0.52 / sqrt(r * 0.45), 0.0, 0.55);
  float d = 1.0 / max(1.0 - beta * dot(v, normalize(camPos - p)), 0.25);
  return clamp(pow(d, 2.4) * 0.42, 0.10, 2.6);
}

/* ── disk color: hot bluish-white gas near the ISCO cooling to warm amber at the
   rim, with a Doppler hue shift — approaching side blue, receding side warm ── */
vec3 diskTint(float r, float dop) {
  vec3 c = mix(vec3(0.94, 0.98, 1.10), vec3(1.16, 0.94, 0.66), smoothstep(R_IN, R_OUT * 0.85, r));
  c *= mix(vec3(1.08, 0.96, 0.80), vec3(0.90, 0.97, 1.14), clamp((dop - 0.5) / 1.6, 0.0, 1.0));
  return c;
}

void main() {
  vec2 suv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;   // screen-space, for the scrim
  vec2 uv  = suv;
  uv.y -= uYShift;   // small offset so the shadow centres on the hero copy

  // Cursor roll — eased slower than the tilt, so the frame lags with weight
  float rl = uMouse2.x * 0.06;
  uv = mat2(cos(rl), sin(rl), -sin(rl), cos(rl)) * uv;

  /* Camera: near-equatorial so the disk reads edge-on. Slow autonomous drift +
     breathing dolly keep it alive; the cursor adds tilt (fast ease) and a gentle
     pull-in (slow ease) on top. */
  float dist = uCamDist * (1.0 + 0.015 * sin(uTime * 0.07)) * (1.0 - 0.05 * length(uMouse2));
  float az = uTime * 0.032 + uMouse.x * 0.30;
  float el = uElev + 0.022 * sin(uTime * 0.11) + uMouse.y * 0.09;
  vec3  camPos = vec3(sin(az) * cos(el), sin(el), cos(az) * cos(el)) * dist;

  vec3 fwd   = normalize(-camPos);
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up    = cross(right, fwd);
  vec3 rd    = normalize(fwd + right * uv.x * uFov + up * uv.y * uFov);

  vec3  dir0 = rd;
  vec3  pos  = camPos;
  vec3  h    = cross(pos, rd);
  float h2   = dot(h, h);           // conserved angular momentum²

  // Impact parameter decides capture analytically (b < b_crit falls in) — the
  // integrator's step budget can't resolve near-critical spirals on its own.
  float b = length(cross(camPos, dir0));

  // Coarse tiers take proportionally bigger strides, so every tier's rays travel
  // about the same distance. Without this, a low step count simply runs out of
  // reach before the disk and the cutoff terraces along step boundaries.
  float budget = 44.0 / float(uSteps);

  // Start each ray a random fraction of a step along: turns whatever quantisation
  // remains into per-pixel noise instead of visible steps. Static, so it doesn't
  // shimmer frame to frame, and free — it's one hash.
  pos += rd * clamp(length(pos) * 0.10 * budget, 0.04, 1.5 * budget)
            * hash13(vec3(gl_FragCoord.xy, 7.0));

  vec3  col      = vec3(0.0);
  float alpha    = 0.0;
  bool  captured = false;

  for (int i = 0; i < MAX_STEPS; i++) {
    if (i >= uSteps) break;

    float r = length(pos);
    if (r < 1.02) { captured = true; break; }              // through the horizon
    if (r > 46.0 && dot(rd, pos) > 0.0) break;             // escaped to infinity

    float dt   = clamp(r * 0.10 * budget, 0.04, 1.5 * budget);   // finer near the hole, where deflection is strongest
    vec3  npos = pos + rd * dt;

    // Equatorial-plane crossing → sample the disk, composited front-to-back
    if (pos.y * npos.y < 0.0 && alpha < 0.99) {
      float t   = pos.y / (pos.y - npos.y);
      vec3  hit = mix(pos, npos, t);
      float e   = diskEmission(hit);
      if (e > 0.0) {
        float dop = doppler(hit, camPos);
        e *= dop;
        float a = clamp(e * 0.55, 0.0, 1.0);
        col   += (1.0 - alpha) * e * diskTint(length(hit.xz), dop);
        alpha += (1.0 - alpha) * a;
      }
    }

    rd  += (-1.5 * h2 * pos / pow(r, 5.0)) * dt;           // gravitational deflection
    pos  = npos;
  }

  captured = captured || b < B_CRIT;

  // Captured rays end on the horizon: drop any gas they grazed on the way in, so
  // the shadow stays a clean silhouette instead of arcs smearing across it.
  if (captured) col = vec3(0.0);

  /* Lensed background */
  vec3 bg = vec3(0.0);
  if (!captured) {
    vec3 d = normalize(rd);
    bg  = stars(d);
    // Nebula wisps — two big soft layers, one cool one warm, drifting slowly.
    // They ride the bent ray too, so they smear around the hole like the stars.
    float neb1 = fbm(d * 1.8 + vec3(0.0, 0.0, uTime * 0.004));
    float neb2 = fbm(d * 3.1 + vec3(5.2, 1.3, -uTime * 0.003));
    bg += vec3(0.55, 0.65, 1.00) * pow(max(neb1 - 0.42, 0.0), 1.6) * 0.55
        + vec3(1.00, 0.75, 0.55) * pow(max(neb2 - 0.48, 0.0), 1.6) * 0.35;
    bg += 0.018 * fbm(d * 2.6) * vec3(0.90, 0.95, 1.05);   // faint dust wash
  }
  bg *= (1.0 - alpha);

  /* Photon ring — rays grazing the critical impact parameter */
  float ring = exp(-pow((b - B_CRIT) / 0.050, 2.0)) * 0.80;
  ring *= smoothstep(B_CRIT - 0.03, B_CRIT + 0.04, b);

  vec3 c3 = col * 0.85 + bg + ring * vec3(1.0, 0.97, 0.90);
  c3 = c3 / (1.0 + c3 * 0.70);                             // soft tonemap
  c3 *= 1.0 - 0.34 * dot(uv, uv);                          // vignette

  // Soft elliptical scrim behind the hero copy — keeps the text legible where
  // the name overhangs the photon ring onto the disk.
  float scrim = 1.0 - smoothstep(0.30, 0.95, length(vec2(suv.x / 0.60, (suv.y + 0.02) / 0.26)));
  c3 *= 1.0 - 0.38 * scrim;

  c3 += (hash13(vec3(gl_FragCoord.xy, floor(uTime * 24.0))) - 0.5) * 0.014;  // grain

  gl_FragColor = vec4(max(c3, 0.0), 1.0);
}
`;

const heroScene = {
  renderer: null,
  scene:    null,
  camera:   null,
  material: null,
  mouse:       { x: 0, y: 0 },   // fast ease — camera tilt
  mouse2:      { x: 0, y: 0 },   // slow ease — roll + dolly lag behind the tilt
  targetMouse: { x: 0, y: 0 },

  // Quality tiers: [raymarch steps, render scale, max buffer width in px].
  // The width cap matters most: on a 2560px monitor even a 0.30 scale is a
  // 768px buffer, which a software rasteriser cannot shade in a frame.
  // Tier 0 is the software-renderer / emergency tier — it also caps DPR at 1
  // and renders every third frame, so unaccelerated browsers stay usable.
  TIERS: [[14, 0.30, 480], [24, 0.50, 900], [34, 0.65, 1500], [44, 0.78, 2400]],
  _tier: 3,
  _fpsFrames: 0,
  _fpsStart: 0,
  _badWindows: 0,
  _startedAt: 0,
  _static: false,   // prefers-reduced-motion → render one frame only

  init() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const w = window.innerWidth, h = window.innerHeight;
    const isMobile = w < 768;
    this._static = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    try {
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    } catch (err) {
      return;   // no WebGL — hero falls back to the plain black background
    }

    // Software rasterizers (no hardware acceleration) can't afford a raymarched
    // fullscreen shader at normal quality — start them on the emergency tier.
    let softwareGL = false;
    try {
      const glc = this.renderer.getContext();
      const dbg = glc.getExtension('WEBGL_debug_renderer_info');
      const rs  = dbg ? String(glc.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
      softwareGL = /swiftshader|llvmpipe|software|basic render/i.test(rs);
    } catch (err) { /* renderer string unavailable — assume hardware */ }
    this._tier = softwareGL ? 0 : (isMobile ? 1 : 3);

    this.scene  = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.material = new THREE.ShaderMaterial({
      vertexShader:   HERO_VERT,
      fragmentShader: HERO_FRAG,
      depthTest:  false,
      depthWrite: false,
      uniforms: {
        uRes:     { value: new THREE.Vector2(w, h) },
        uTime:    { value: 0 },
        uMouse:   { value: new THREE.Vector2(0, 0) },
        uMouse2:  { value: new THREE.Vector2(0, 0) },
        uSteps:   { value: this.TIERS[this._tier][0] },
        uCamDist: { value: 13.0 },
        uFov:     { value: 0.62 },
        uYShift:  { value: 0.02 },
        uElev:    { value: 0.10 },
      },
    });

    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));

    this.onResize();
    this._fpsStart  = performance.now();
    this._startedAt = this._fpsStart;
    this.animate();

    this._spawnFloatingNumbers();
    this._spawnStarCoordinates();

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      this.targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
  },

  /* Drop a quality tier when the frame budget is genuinely being missed.
     Samples are discarded while the loader is still running (the page is busiest
     then) and whenever the tab is backgrounded — rAF throttling there would
     otherwise degrade the scene permanently. Two bad windows in a row are
     required before stepping down. */
  _watchFps(now) {
    if (this._tier === 0 || now - this._startedAt < 5000) return;
    this._fpsFrames++;
    const elapsed = now - this._fpsStart;
    if (elapsed < 2000) return;

    const fps    = (this._fpsFrames * 1000) / elapsed;
    const usable = !document.hidden && elapsed < 4000 && this._fpsFrames > 40;
    this._fpsFrames = 0;
    this._fpsStart  = now;

    if (!usable) return;
    this._badWindows = fps < 45 ? this._badWindows + 1 : 0;
    if (this._badWindows >= 2) {
      this._badWindows = 0;
      this._tier--;
      this.material.uniforms.uSteps.value = this.TIERS[this._tier][0];
      this.onResize();
    }
  },

  /* Lowest top% a drifting label may use before it starts colliding with the
     fixed nav bar. The +26px covers the vertical drift they animate through. */
  _navSafeMinPct() {
    const heroEl = document.getElementById('hero');
    const navEl  = document.getElementById('nav');
    const heroH  = (heroEl && heroEl.getBoundingClientRect().height) || window.innerHeight;
    const navH   = (navEl  && navEl.getBoundingClientRect().height)  || 64;
    return Math.min(((navH + 26) / heroH) * 100, 87);
  },

  /* Remap a 0-100 top percentage into the band below the nav, so labels never
     sit behind the nav links and make them hard to read. Remapping (rather than
     clamping) keeps them spread out instead of stacking into a row along the
     exclusion line. */
  _safeTopPct(pct) {
    const minTop = this._navSafeMinPct();
    const BOTTOM = 92;   // leave room for the bottom HUD corner
    return minTop + (clamp(pct, 0, 100) / 100) * (BOTTOM - minTop);
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

    /* Keep fragments off the hole. The shadow's radius works out to
       ~0.329 * viewport height (b_crit 2.598 at camDist 13, fov 0.62),
       centred at 50% / 48% (uYShift nudges it up slightly). Rejection-
       sample around it, with a ring fallback on very tall viewports
       where the exclusion zone can swallow the safe area. */
    const pickOutsideShadow = () => {
      const W = window.innerWidth, H = window.innerHeight;
      const cx = 50, cy = 48;
      const rPx = 0.329 * H * 1.15;              // +15% margin off the rim
      const rx  = (rPx / W) * 100;
      const ry  = (rPx / H) * 100;
      // Candidates are pushed below the nav *before* the shadow test, so a
      // fragment can never satisfy one constraint by violating the other.
      const minTop = this._navSafeMinPct();
      for (let k = 0; k < 40; k++) {
        const l = randFloat(4, 88), t = this._safeTopPct(randFloat(8, 88));
        const dx = (l - cx) / rx, dy = (t - cy) / ry;
        if (dx * dx + dy * dy >= 1) return [l, t];
      }
      const a = randFloat(0, Math.PI * 2);
      return [
        clamp(cx + Math.cos(a) * rx * 1.2, 3, 92),
        clamp(cy + Math.sin(a) * ry * 1.2, minTop, 92),
      ];
    };

    const count = window.innerWidth < 768 ? 7 : 13;
    for (let i = 0; i < count; i++) {
      const span   = document.createElement('span');
      span.textContent = fragments[i % fragments.length];
      const baseOpacity = randFloat(0.07, 0.14);
      const [lPct, tPct] = pickOutsideShadow();
      span.style.cssText = [
        'position:absolute',
        `left:${lPct}%`,
        `top:${tPct}%`,
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

  /* Spawn faint telemetry labels (dot/cross + readout text) around the edges */
  _spawnStarCoordinates() {
    const heroEl = document.getElementById('hero');
    if (!heroEl || typeof gsap === 'undefined') return;

    const container = document.createElement('div');
    container.className = 'hero-fx-overlay';
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden;';
    heroEl.appendChild(container);

    const coords = [
      "RA 14h 29m  Dec +02°53'",  'EVENT HORIZON · STABLE',
      '[134.6, −08.1]',           'r_s 2.95e3 m',
      "RA 06h 12m  Dec −17°40'",  'M ≈ 4.1e6 M☉',
      'α 198.4° · δ +05.7°',  'LENSING · b_c 2.598',
      '[267.1, −33.8]',           'ACCRETION · NOMINAL',
      "RA 18h 36m  Dec −29°00'",  'z 1.62 · REDSHIFT',
    ];

    // Positions around the edges — avoid the centre where the hole lives
    const positions = [
      [6, 10],  [80, 8],  [12, 78], [82, 75],
      [38, 6],  [62, 88], [3, 42],  [90, 38],
      [48, 3],  [20, 90], [72, 12], [88, 62],
    ];

    const count = window.innerWidth < 768 ? 5 : positions.length;

    for (let i = 0; i < count; i++) {
      const [lPct, rawTop] = positions[i];
      const tPct     = this._safeTopPct(rawTop);   // keep clear of the nav bar
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
    const now = performance.now();

    // Self-heal: some embedded browsers report a zero-size viewport during the
    // first layout, which onResize ignores — re-sync as soon as it reads sane.
    if (this._lastW !== window.innerWidth || this._lastH !== window.innerHeight) {
      this.onResize();
    }

    // Smooth camera parallax — two easing rates so roll/dolly trail the tilt
    this.mouse.x  += (this.targetMouse.x - this.mouse.x)  * 0.04;
    this.mouse.y  += (this.targetMouse.y - this.mouse.y)  * 0.04;
    this.mouse2.x += (this.targetMouse.x - this.mouse2.x) * 0.012;
    this.mouse2.y += (this.targetMouse.y - this.mouse2.y) * 0.012;

    // Emergency tier renders every third frame (~20fps) — the scene drifts
    // slowly enough that it still reads as smooth, at a third of the cost
    this._flip = (this._flip || 0) + 1;
    if (!this._static && this._tier === 0 && (this._flip % 3) !== 0) {
      requestAnimationFrame(() => this.animate());
      return;
    }

    const u = this.material.uniforms;
    u.uTime.value = this._static ? 0 : now * 0.001;
    u.uMouse.value.set(this.mouse.x, this.mouse.y);
    u.uMouse2.value.set(this.mouse2.x, this.mouse2.y);

    this.renderer.render(this.scene, this.camera);

    if (this._static) return;   // reduced motion: one frame is enough
    this._watchFps(now);
    requestAnimationFrame(() => this.animate());
  },

  onResize() {
    if (!this.renderer) return;
    const w = window.innerWidth, h = window.innerHeight;
    if (w < 2 || h < 2) return;   // ignore transient zero-size reports
    this._lastW = w;
    this._lastH = h;
    const scale = this.TIERS[this._tier][1];

    // Low tiers also cap DPR at 1 — retina resolution is wasted on a soft effect
    const dprCap = this._tier <= 1 ? 1 : 2;
    const ratio  = Math.min(Math.min(window.devicePixelRatio, dprCap) * scale,
                            this.TIERS[this._tier][2] / w);
    this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(w, h);

    const buf = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    this.material.uniforms.uRes.value.set(buf.x, buf.y);

    // Narrow viewports widen the field of view rather than pulling the camera back:
    // distance is what keeps the ray march dense enough to resolve the disk, so
    // moving the camera out would leave the outer disk beyond the step budget.
    const aspect = w / h;
    this.material.uniforms.uFov.value = 0.62 * clamp(1.15 / aspect, 1.0, 1.9);

    if (this._paused || this._static) this.renderer.render(this.scene, this.camera);
  },

  pause()  { this._paused = true; },
  resume() { if (this._paused) { this._paused = false; this._fpsStart = performance.now(); this._fpsFrames = 0; this.animate(); } },
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
        <span class="skill-icon">
          <img src="${skill.icon}" alt="${skill.name}" />
          <span class="skill-icon-fb">⬡</span>
        </span>
        <span class="skill-name">${skill.name}</span>
        ${skill.desc ? `<div class="skill-tooltip">${skill.desc}</div>` : ''}
      `;
      const img = card.querySelector('.skill-icon img');
      const fb  = card.querySelector('.skill-icon-fb');
      img.addEventListener('load',  () => { fb.style.display = 'none'; });
      img.addEventListener('error', () => { img.style.display = 'none'; fb.style.display = 'block'; });
      grid.appendChild(card);
    });

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

    // Update result count
    const countEl = document.getElementById('project-result-count');
    if (countEl) {
      const total = this.all.length;
      countEl.textContent = list.length === total
        ? `${total} projects`
        : `${list.length} / ${total}`;
    }

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
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${project.title} project details`);

    // Thumbnail
    const thumbHtml = project.thumb
      ? `<img src="${project.thumb}" onerror="this.onerror=null;this.src='${placeholderSrc(project.thumb)}';" alt="${project.title} preview" loading="lazy" />`
      : `<div class="project-thumb-placeholder">${project.title.charAt(0)}</div>`;

    // Tech stack tags
    const stackHtml = project.stack
      .map(s => `<span class="stack-tag stack-tag--clickable" role="button" tabindex="0" data-tag="${s}">${s}</span>`)
      .join('');

    const dateLabel = formatProjectDate(project.date);

    // Action buttons
    const demoLabel = project.category === 'video' ? 'Watch on YouTube' : 'View Live';
    
    // Blender projects: add "View Fullscreen" to open the first image
    const blenderLink = (project.category === 'blender' && project.images && project.images.length > 0)
      ? `<a href="${project.images[0]}" class="project-link secondary" target="_blank" rel="noopener noreferrer" title="View/Download Image">View Fullscreen</a>`
      : '';

    const linksHtml = [
      project.demo   ? `<a href="${project.demo}"   class="project-link primary"    target="_blank" rel="noopener noreferrer">${demoLabel}</a>`   : '',
      project.github ? `<a href="${project.github}" class="project-link secondary"  target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
      blenderLink
    ].filter(Boolean).join('');

    const thumbAttrs = project.thumb
      ? ` class="project-thumb project-thumb--contain" style="background-image:url('${placeholderSrc(project.thumb)}')"`
      : ` class="project-thumb"`;

    card.innerHTML = `
      <div${thumbAttrs}>
        ${thumbHtml}
        <span class="card-expand-hint" aria-hidden="true"><svg viewBox="0 0 12 12" fill="none"><path d="M7.5 1.5H10.5V4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 10.5H1.5V7.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="10.5" y1="1.5" x2="7" y2="5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="1.5" y1="10.5" x2="5" y2="7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></span>
      </div>
      <div class="project-body">
        <p class="project-meta monospace">
          <span class="project-category">${project.category}</span>
          <span class="project-date">${dateLabel}</span>
        </p>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.desc}</p>
        <div class="project-stack">${stackHtml}</div>
        <div class="project-links">${linksHtml}</div>
      </div>
    `;

    // Open modal on card click (but not when clicking a link)
    card.addEventListener('click', (e) => {
      if (e.target.closest('.project-link')) return;
      if (e.target.closest('.stack-tag--clickable')) return;
      projectModal.open(project);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        projectModal.open(project);
      }
    });

    // Clickable stack tags — filter by tag without opening modal
    card.querySelectorAll('.stack-tag--clickable').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        projects.setTagSearch(tag.dataset.tag);
      });
      tag.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          projects.setTagSearch(tag.dataset.tag);
        }
      });
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

  setTagSearch(tag) {
    const input = document.getElementById('project-search');
    if (!input) return;
    // Reset category filter to 'all'
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    this.currentFilter = 'all';
    // Set search and re-render
    input.value = tag;
    this.searchQuery = tag;
    this.filter();
    // Scroll to projects section
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
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
    document.getElementById('modal-date').textContent     = formatProjectDate(project.date);
    document.getElementById('modal-title').textContent    = project.title;
    document.getElementById('modal-desc').textContent     = project.desc;

    // Stack tags — clickable to search by tag
    document.getElementById('modal-stack').innerHTML =
      project.stack.map(s => `<span class="stack-tag stack-tag--clickable" role="button" tabindex="0" data-tag="${s}">${s}</span>`).join('');
    document.getElementById('modal-stack').querySelectorAll('.stack-tag--clickable').forEach(tag => {
      tag.addEventListener('click', () => {
        this.close();
        projects.setTagSearch(tag.dataset.tag);
      });
    });

    // Links
    const demoLabel = project.category === 'video' ? 'Watch on YouTube' : 'View Live';
    const modalBlenderFullscreen = (project.category === 'blender' && project.images && project.images.length > 0)
      ? `<a href="${project.images[0]}" class="project-link secondary" target="_blank" rel="noopener noreferrer" title="View/Download Image">View Fullscreen</a>`
      : '';
    document.getElementById('modal-links').innerHTML = [
      project.demo   ? `<a href="${project.demo}"   class="project-link primary"  target="_blank" rel="noopener noreferrer">${demoLabel}</a>` : '',
      project.github ? `<a href="${project.github}" class="project-link secondary" target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
      modalBlenderFullscreen,
    ].filter(Boolean).join('');

    // Build slides: YouTube embed first (if any), then project media
    this._slides = [];
    if (project.youtube) this._slides.push({ type: 'youtube', src: project.youtube });
    if (project.media && project.media.length) {
      project.media.forEach(item => {
        if (!item || !item.type || !item.src) return;
        this._slides.push({ type: item.type, src: item.src, contain: !!project.contain });
      });
    } else {
      if (project.images) project.images.forEach(src => this._slides.push({ type: 'image', src, contain: !!project.contain }));
      if (project.videos) project.videos.forEach(src => this._slides.push({ type: 'video', src }));
    }
    this._idx = 0;
    this._renderMedia();

    this._el.classList.add('open');
    this._el.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    history.replaceState(null, '', `#project-${projectSlug(project.title)}`);
  },

  close() {
    if (this._cleanupZoom) { this._cleanupZoom(); this._cleanupZoom = null; }
    this._el.classList.remove('open');
    this._el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    history.replaceState(null, '', location.pathname + location.search);
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
    } else if (slide.type === 'video') {
      const navHtml = multi
        ? `<button class="gallery-nav prev" aria-label="Previous">&#8592;</button>
           <button class="gallery-nav next" aria-label="Next">&#8594;</button>
           <span class="gallery-counter">${this._idx + 1} / ${this._slides.length}</span>`
        : '';
      html = `<div class="video-gallery" style="position:relative;aspect-ratio:16/9;background:#000;overflow:hidden;">
        <video class="gallery-video" src="${slide.src}" controls playsinline preload="metadata"></video>
        ${navHtml}
      </div>`;
    } else {
      const svgSrc  = placeholderSrc(slide.src);
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

    if (slide.type === 'image') this._initZoom(mediaEl);

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

    // #hero is excluded: the flash block centres on the black hole's
    // shadow, and that void has to stay clean.
    document.querySelectorAll('section[id]:not(#hero)').forEach(section => {
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

    // #hero is excluded: a bright line crossing the hole reads as a
    // scanline over the shadow.
    document.querySelectorAll('section[id]:not(#hero)').forEach(section => {
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
   contact form, and all page content stay fully functional.
============================================================ */
const lowPerf = {
  active: false,

  init() {
    const btn = document.getElementById('low-perf-btn');
    if (!btn) return;
    btn.addEventListener('click', () => this.toggle());

    // Auto-show tooltip briefly after page loads so users notice the feature
    setTimeout(() => {
      btn.classList.add('lite-hint-visible');
      setTimeout(() => btn.classList.remove('lite-hint-visible'), 3500);
    }, 2200);
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
      cursor.ringPos.x = cursor.target.x;
      cursor.ringPos.y = cursor.target.y;
      cursor._enabled = true;
      glitchEffects.resume();
    }
  },
};

/* ============================================================
   21. TAB VISIBILITY HANDLER — Dynamic title & icon
============================================================ */
const pageIdle = {
  originalTitle: document.title,
  idleTitle: 'Bruce Lin | Idle',
  favicon: document.querySelector('link[rel="icon"]'),
  originalIcon: 'assets/favicon.svg',
  idleIcon: 'assets/moon.svg',

  init() {
    if (!this.favicon) return;
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.title = this.idleTitle;
        this.favicon.href = this.idleIcon;
      } else {
        document.title = this.originalTitle;
        this.favicon.href = this.originalIcon;
      }
    });
  }
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

  // Page idle — dynamic title and favicon on blur
  pageIdle.init();

  // Low performance mode toggle
  lowPerf.init();

  // Fire the loader last — its exit callback triggers hero animations
  loader.init();

  // Deep-link: open project modal from URL hash on load (e.g. #project-clipstack)
  (function checkDeepLink() {
    const hash = location.hash;
    if (!hash.startsWith('#project-')) return;
    const slug = hash.slice('#project-'.length);
    const match = DATA.projects.find(p => projectSlug(p.title) === slug);
    if (match) projectModal.open(match);
  })();
}

// Kick off when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => waitForLibraries(boot));
} else {
  waitForLibraries(boot);
}
