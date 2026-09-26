# Page Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the page below the hero speak the hero's language (glass, cracks and split light) by removing the terminal/HUD layer from `js/main.js` and adding three small accents — focus-in titles, crack seams between sections, and a glint on project cards — per `docs/superpowers/specs/2026-09-26-page-glass-design.md`.

**Architecture:** Mostly deletion: nine decorative modules, the custom cursor, `.glitch-text` and dead CSS go. What's added is CSS plus two small modules in `main.js`. `reveal` gives elements marked `data-reveal` an `.is-in` class once, from one `ScrollTrigger.batch`, and CSS animations do the moving. `seams` injects one seeded SVG crack per section and runs it once with the Web Animations API. The card glint is CSS only. Every accent has a rest state that LITE mode, reduced motion and a page without JavaScript fall back to.

**Tech Stack:** Plain HTML/CSS/JS (no build), GSAP 3.12 + ScrollTrigger (already loaded from cdnjs), the Web Animations API, inline SVG. For verification: Node 24 and headless Chrome driven over CDP (a dev-only script in the scratchpad, not shipped).

**Repo conventions:** No package.json, no test runner, no build step. Dev-only tools and checks live in the session scratchpad (`$SP`), as the hero plan's did. Commit only when the user asks (their standing instruction), so no task has a commit step.

**`$SP`** is your session's scratchpad directory, written with forward slashes. Each Bash call starts a fresh shell, so begin every command with `export SP="<your scratchpad>";`. All commands run from the repo root.

**Apply markers.** Each code block that changes a file has an HTML comment above it:
- `TAG write: PATH` replaces the whole file.
- `TAG splice: PATH | from: A | to: B` replaces the lines from the line starting with `A` up to, but not including, the next line starting with `B`. `EOF` as `B` means the end of the file.
- `TAG insert: PATH | before: B` inserts the block before the line starting with `B`.

An anchor matches the start of a line. `\n` inside an anchor separates consecutive lines, so `/* ===\n   7. CURSOR` is a line starting `/* ===` followed by a line starting `   7. CURSOR`. `A` (and an insert's `B`) must match exactly once. `node "$SP/apply-plan.js" docs/superpowers/plans/2026-09-26-page-glass.md T3` applies every block tagged `T3`, in order, and stops with an error if an anchor is missing or ambiguous. Applying the blocks by hand with an editor gives the same result.

---

## Before you start

- **The hero work should be committed first** (spec header), so this work's diff stands alone. Run `git status --short -- index.html css/styles.css js/main.js js/hero`. If it lists anything, ask the user to commit the hero Fracture work, and don't commit it yourself. If they'd rather go ahead uncommitted, snapshot the four files this plan changes (`mkdir -p "$SP/baseline/css" "$SP/baseline/js" && cp index.html README.md "$SP/baseline/" && cp css/styles.css "$SP/baseline/css/" && cp js/main.js "$SP/baseline/js/"`) and diff against the snapshot instead of `HEAD`. For example, Task 8 Step 10 becomes `git diff --no-index --numstat "$SP/baseline/js/main.js" js/main.js`, and likewise for each file.
- **Serve the site** on port 8901. With the preview tools, use `preview_start` with name `static-site-2`, which is in `.claude/launch.json`. Otherwise run `python -m http.server 8901` in the background. `URL` below means `http://localhost:8901/`.
- **Chrome** must be at `C:/Program Files/Google/Chrome/Application/chrome.exe`, which `page-check.mjs` launches.
- **Run page checks one at a time.** Each run starts a Chrome that loads GSAP and Three.js from cdnjs. If they take more than 5 s, the page boots without them (`[warning] Portfolio: GSAP, Three.js or the hero scripts did not load. Running in fallback mode.` in `"console"`), everything is shown at once, and the checks report odd numbers (for instance `"triggers":0`). Three runs at once were enough to cause this once. Re-run any such run on its own.

## File structure

| File | Change | Responsibility |
|---|---|---|
| `js/main.js` | Modify | Loses `cursor`, `scrollAnimations`, `glitchEffects`, `sideLabels`, `sectionFlash`, `scanSweep`, `hackScroll`, `clickRipple`, `hoverGlitch`. Gains `scrollTriggerReady`, `mulberry32`, `reveal` (§11) and `seams` (§12). `heroAnimations`, `skills`, `projects`, `lowPerf` and `boot()` get simpler. |
| `css/styles.css` | Modify | Light tokens and accent tunables in `:root`. New blocks: Focus-in and Reveals (Utilities), Seams (replaces the hairline block), Glint (Projects). Deletes the glitch, cursor, side-label, flash, sweep and ripple CSS, plus dead selectors. |
| `index.html` | Modify | Drops the cursor elements and `glitch-text`/`data-text`. Marks static reveal targets with `data-reveal`. Adds a `<noscript>` style so the hero copy shows without JavaScript. |
| `README.md` | Modify | One Site Features line for the glass accents. |
| `$SP/apply-plan.js` | Create (dev only) | Applies this plan's marked blocks. |
| `$SP/page-check.mjs` | Create (dev only) | Headless Chrome over CDP: load, run actions in order, report exceptions, console errors and results. |
| `$SP/checks/*.js` | Create (dev only) | In-page checks for spec §11, each returning JSON with `pass`. |
| `$SP/tests/seams.test.js` | Create (dev only) | Invariants of the seam geometry, run under Node against the real `main.js`. |

**Decisions the spec leaves open.** The first two are needed to meet §11. The rest came out of a dry run of this plan on a copy of the site.
1. The page loads hidden hero copy (`opacity: 0` in CSS), so it can't pass §11.9 ("No script: the content is visible") without help. Task 7 adds a `<noscript>` style that shows it. That's the smallest fix, and the page with JavaScript is unchanged.
2. A re-render of the project grid moves everything below it, and ScrollTrigger doesn't notice DOM changes. Without a refresh, the Contact reveal could wait for a scroll position that no longer exists. So `projects.renderAll` calls `reveal.refresh()` after every re-render (not the first). That drops the triggers of cards that are gone and re-measures the rest, which also keeps §11.2's trigger count flat.
3. **The stagger counts only what's on screen.** A nav link scrolls past whole sections, and their elements arrive in the same batch as the section you land on. Counting them would hold that section back by up to 350 ms, so elements already scrolled past get `--i` 0 and don't count (`reveal.when`, Task 4 Step 4).
4. **The glint sweeps at a steady rate** (`linear`), as the hero's streaks do (`fract(… - uTime * rate)` in `js/hero/shaders.js`). With the page's ease-out curve the band would cross the card in about 0.2 s of the 0.7 s and then idle off its edge.
5. **A seam's SVG is as tall as its crack**, not the spec's 32 px: a 120 px branch at 55° drops about 100 px. That's more than a phone's 80 px of section padding. Left alone, About's branch would cross its `// MODULE_01` rule at viewport widths of about 800–880 px. So a branch is shortened, keeping its angles, to end at least 16 px above the section's content (`maxDrop` in `seams.build`). The SVG takes no pointer events.

---

### Task 0: Dev tools and a baseline

**Files:**
- Create: `$SP/apply-plan.js`, `$SP/page-check.mjs`, `$SP/checks/scroll.js`, `$SP/checks/leak.js`, `$SP/checks/stillness.js`, `$SP/checks/text.js`, `$SP/checks/modes.js`, `$SP/checks/focus.js`, `$SP/checks/nojs.js`

- [ ] **Step 1: Create `$SP/apply-plan.js` by hand** (it can't apply itself)

<!-- tool write: $SP/apply-plan.js -->
```js
// node apply-plan.js PLAN.md TAG — apply the plan's code blocks marked TAG, in order (dev only)
//   <!-- TAG write: PATH -->                       replace the whole file
//   <!-- TAG splice: PATH | from: A | to: B -->    replace the lines from A up to (not including) B
//   <!-- TAG insert: PATH | before: B -->          insert the block before B
// An anchor matches the start of a line. "\n" inside it separates consecutive
// lines: "/* ===\n   7. CURSOR" is a line starting "/* ===" followed by one
// starting "   7. CURSOR". A (and an insert's B) must match exactly once; a
// splice's B is the first match after A, or EOF for the end of the file.
// PATH is relative to the current directory, or starts with $SP (env SP).
const fs = require('fs');
const path = require('path');

const [, , planPath, tag] = process.argv;
if (!planPath || !tag) throw new Error('usage: node apply-plan.js PLAN.md TAG');
const plan = fs.readFileSync(planPath, 'utf8').split(/\r?\n/);
const resolve = (p) => (p.startsWith('$SP') ? (process.env.SP || '') + p.slice(3) : p);

function find(lines, anchor, from, unique) {
  const parts = anchor.split('\\n');
  const hits = [];
  for (let i = from; i < lines.length; i++) {
    if (parts.every((p, k) => i + k < lines.length && lines[i + k].startsWith(p))) hits.push(i);
  }
  if (!hits.length) throw new Error('anchor not found: ' + anchor);
  if (unique && hits.length > 1) throw new Error('anchor matches ' + hits.length + ' times: ' + anchor);
  return hits[0];
}

let n = 0;
for (let i = 0; i < plan.length; i++) {
  const m = plan[i].match(/^<!-- (\S+) (write|splice|insert): (.+?) -->$/);
  if (!m || m[1] !== tag) continue;
  const [, , kind, spec] = m;
  const fields = spec.split(' | ');
  const target = resolve(fields[0].trim());
  const opt = (k) => {
    const f = fields.find((x) => x.startsWith(k + ': '));
    if (!f) throw new Error(`${kind} ${target}: missing "${k}:"`);
    return f.slice(k.length + 2);
  };
  let j = i + 1;
  while (!plan[j].startsWith('```')) j++;
  let k = j + 1;
  while (!plan[k].startsWith('```')) k++;
  const body = plan.slice(j + 1, k);
  i = k;
  if (kind === 'write') {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, body.join('\n') + '\n');
    console.log(`write   ${target} (${body.length} lines)`);
  } else {
    const src = fs.readFileSync(target, 'utf8');
    const eol = src.includes('\r\n') ? '\r\n' : '\n';
    const lines = src.split(/\r?\n/);
    let a, b;
    if (kind === 'insert') {
      a = b = find(lines, opt('before'), 0, true);
    } else {
      a = find(lines, opt('from'), 0, true);
      const to = opt('to');
      b = to === 'EOF' ? lines.length - (lines[lines.length - 1] === '' ? 1 : 0) : find(lines, to, a + 1, false);
    }
    lines.splice(a, b - a, ...body);
    fs.writeFileSync(target, lines.join(eol));
    const where = kind === 'insert' ? `before line ${a + 1}` : `lines ${a + 1}–${b}`;
    console.log(`${kind.padEnd(7)} ${target}: ${where} → ${body.length} lines`);
  }
  n++;
}
if (!n) throw new Error('no blocks tagged ' + tag);
console.log(n + ' block(s) applied');
```

- [ ] **Step 2: Write the page driver and the checks**

The blocks below are all tagged `T0`. Apply them with:

Run: `node "$SP/apply-plan.js" docs/superpowers/plans/2026-09-26-page-glass.md T0`
Expected: `write` lines for `page-check.mjs` and the seven checks, then `8 block(s) applied`.

<!-- T0 write: $SP/page-check.mjs -->
```js
// page-check.mjs — drive headless Chrome over CDP (dev only, not shipped)
//   node page-check.mjs [--w 1280] [--h 720] [--mobile] [--reduced] [--nojs] --url URL [ACTION ...]
// Once the page has loaded, the actions run in the order given:
//   --wait EXPR       poll until EXPR is truthy (20 s at most)
//   --sleep MS
//   --eval EXPR       evaluate in the page; a promise is awaited; its value is reported
//   --evalfile FILE   the same, with the expression read from FILE
//   --hover SEL       move the mouse to the centre of the first match (it doesn't scroll)
//   --tab SEL         press Tab until document.activeElement matches SEL (80 presses at most)
//   --key KEY         press Enter, Escape or Tab
//   --tap SEL         touch-tap the centre of the first match (use with --mobile)
//   --shot FILE       PNG screenshot of the viewport
// Prints one JSON object: uncaught exceptions, console errors and warnings,
// and each action with its result.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const KEYS = {
  Enter: { key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' },
  Escape: { key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 },
  Tab: { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 },
};

const opts = { w: 1280, h: 720 };
const actions = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const k = argv[i].replace(/^--/, '');
  if (['mobile', 'reduced', 'nojs'].includes(k)) opts[k] = true;
  else if (k === 'url') opts.url = argv[++i];
  else if (k === 'w' || k === 'h') opts[k] = +argv[++i];
  else actions.push([k, argv[++i]]);
}
if (!opts.url) throw new Error('--url is required');

const port = 9300 + Math.floor(Math.random() * 600);
const userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-'));
const proc = spawn(CHROME, [
  `--remote-debugging-port=${port}`, `--user-data-dir=${userDir}`, '--headless=new',
  '--no-first-run', '--no-default-browser-check', `--window-size=${opts.w},${opts.h}`,
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows', '--hide-scrollbars', '--force-color-profile=srgb',
  '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', 'about:blank',
], { stdio: 'ignore' });

async function pageSocket() {
  for (let i = 0; i < 120; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(150);
  }
  throw new Error('Chrome did not start');
}

const out = { url: opts.url, size: `${opts.w}x${opts.h}`, mobile: !!opts.mobile, reduced: !!opts.reduced, nojs: !!opts.nojs,
  exceptions: [], console: [], steps: [] };
let ws;
try {
  ws = new WebSocket(await pageSocket());
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0;
  const pending = new Map();
  let loaded = false;
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    if (m.method === 'Page.loadEventFired') loaded = true;
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      out.exceptions.push(((d.exception && d.exception.description) || d.text).slice(0, 500));
    }
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning', 'assert'].includes(m.params.type)) {
      out.console.push(`[${m.params.type}] ` + m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300));
    }
    if (m.method === 'Log.entryAdded' && ['error', 'warning'].includes(m.params.entry.level)) {
      out.console.push(`[log:${m.params.entry.level}] ${m.params.entry.text} ${m.params.entry.url || ''}`.slice(0, 300));
    }
  });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.error) return { __error: r.error.message };
    if (r.result.exceptionDetails) return { __error: r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text };
    return r.result.result.value;
  };
  const centre = (sel) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)});
    if (!el) return null; const b = el.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; })()`);
  const press = async (name) => {
    const k = KEYS[name];
    if (!k) throw new Error('unknown key ' + name);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', ...k });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k.key, code: k.code, windowsVirtualKeyCode: k.windowsVirtualKeyCode });
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Log.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: opts.w, height: opts.h, deviceScaleFactor: 1, mobile: !!opts.mobile });
  if (opts.mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  if (opts.reduced) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  if (opts.nojs) await send('Emulation.setScriptExecutionDisabled', { value: true });
  await send('Page.navigate', { url: opts.url });
  for (let t = 0; t < 300 && !loaded; t++) await sleep(100);
  out.loaded = loaded;

  for (const [act, arg] of actions) {
    let result = null;
    if (act === 'wait') {
      const t0 = Date.now();
      while (Date.now() - t0 < 20000 && !(await evaluate(arg))) await sleep(100);
      result = Date.now() - t0 < 20000 ? 'ok' : 'TIMED OUT';
    } else if (act === 'sleep') {
      await sleep(+arg);
    } else if (act === 'eval') {
      result = await evaluate(arg);
    } else if (act === 'evalfile') {
      result = await evaluate(fs.readFileSync(arg, 'utf8'));
    } else if (act === 'hover') {
      const c = await centre(arg);
      if (c) await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c[0], y: c[1] });
      result = c ? 'at ' + c.map(Math.round).join(',') : 'NOT FOUND';
    } else if (act === 'tab') {
      let n = 0;
      while (n < 80 && !(await evaluate(`!!document.activeElement && document.activeElement.matches(${JSON.stringify(arg)})`))) { await press('Tab'); n++; }
      result = n < 80 ? `focused after ${n} tabs` : 'NOT REACHED';
    } else if (act === 'key') {
      await press(arg);
      result = 'pressed';
    } else if (act === 'tap') {
      const c = await centre(arg);
      if (c) {
        await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: c[0], y: c[1] }] });
        await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      }
      result = c ? 'at ' + c.map(Math.round).join(',') : 'NOT FOUND';
    } else if (act === 'shot') {
      const r = await send('Page.captureScreenshot', { format: 'png' });
      fs.mkdirSync(path.dirname(path.resolve(arg)), { recursive: true });
      fs.writeFileSync(arg, Buffer.from(r.result.data, 'base64'));
      result = arg;
    } else {
      throw new Error('unknown action --' + act);
    }
    out.steps.push(act === 'sleep' ? `sleep ${arg}` : { [act]: String(arg).slice(0, 80), result });
  }
} catch (e) {
  out.harnessError = String((e && e.stack) || e);
} finally {
  try { ws && ws.close(); } catch {}
  proc.kill();
}
console.log(JSON.stringify(out, null, 1));
setTimeout(() => { try { fs.rmSync(userDir, { recursive: true, force: true }); } catch {} process.exit(0); }, 400);
```

<!-- T0 write: $SP/checks/scroll.js -->
```js
// §11.1 + the state after a full scroll: everything revealed, every seam run,
// each seam's edge in the colour of the panel above, no triggers left
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const H = () => document.documentElement.scrollHeight;
  for (let y = 0; y < H(); y += innerHeight / 3) { scrollTo({ top: y, behavior: 'instant' }); await wait(200); }
  scrollTo({ top: H(), behavior: 'instant' });
  await wait(2500);
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const out = {
    reveals: reveals.length,
    notIn: reveals.filter((el) => !el.classList.contains('is-in')).length,
    hidden: reveals.filter((el) => getComputedStyle(el).opacity !== '1').length,
    seams: document.querySelectorAll('svg.seam').length,
    armed: document.querySelectorAll('svg.seam.is-armed').length,
    sectionsWithSeam: document.querySelectorAll('section.has-seam').length,
    // Above each crack, the border row and the cover must match the panel above
    // (the hero is transparent over the body), or a straight edge shows
    edgeGaps: [...document.querySelectorAll('section.has-seam')].filter((s) => {
      const bg = getComputedStyle(s.previousElementSibling).backgroundColor;
      const above = bg === 'rgba(0, 0, 0, 0)' ? getComputedStyle(document.body).backgroundColor : bg;
      const cover = s.querySelector('.seam-cover');
      return getComputedStyle(s).borderTopColor !== above || !cover || getComputedStyle(cover).fill !== above;
    }).length,
    triggers: typeof ScrollTrigger === 'undefined' ? null : ScrollTrigger.getAll().length,
    stillRunning: document.getAnimations().filter((a) => a.playState === 'running' && a.animationName !== 'navSunSpin').length,
  };
  out.pass = out.reveals > 0 && out.notIn === 0 && out.hidden === 0 && out.seams === 4 && out.armed === 0
    && out.sectionsWithSeam === 4 && out.edgeGaps === 0 && out.triggers === 0 && out.stillRunning === 0;
  return JSON.stringify(out);
})()
```

<!-- T0 write: $SP/checks/leak.js -->
```js
// §11.2: typing, filtering and sorting add no ScrollTriggers and replay nothing
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const count = () => ScrollTrigger.getAll().length;
  const out = { atLoad: count() };
  scrollTo({ top: document.getElementById('projects').offsetTop, behavior: 'instant' });
  await wait(1200);
  // One re-render first: it drops the triggers of any first-render cards it replaces
  document.querySelector('.filter-btn[data-filter="all"]').click();
  await wait(300);
  out.before = count();
  const input = document.getElementById('project-search');
  let replays = 0;
  for (const ch of 'blenderxyz') {
    input.value += ch;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(40);
    document.querySelectorAll('.project-card').forEach((c) => { replays += c.getAnimations({ subtree: true }).length; });
  }
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  for (const b of document.querySelectorAll('.filter-btn, .sort-btn')) { b.click(); await wait(40); }
  document.querySelector('.filter-btn[data-filter="all"]').click();
  document.querySelector('.sort-btn[data-sort="date-desc"]').click();
  await wait(300);
  out.after = count();
  out.cardAnimationsWhileTyping = replays;
  out.cards = document.querySelectorAll('.project-card').length;
  out.cardsHidden = [...document.querySelectorAll('.project-card')].filter((c) => getComputedStyle(c).opacity !== '1').length;
  out.pass = out.after === out.before && out.before <= out.atLoad && replays === 0 && out.cards === 18 && out.cardsHidden === 0;
  return JSON.stringify(out);
})()
```

<!-- T0 write: $SP/checks/stillness.js -->
```js
// §11.3: run 8 s after load with LITE off: 10 s of idling changes nothing outside the hero canvas
(async () => {
  const canvas = document.getElementById('hero-canvas');
  const seen = [];
  const name = (t) => `<${t.nodeName.toLowerCase()}${t.id ? '#' + t.id : ''}${typeof t.className === 'string' && t.className.trim() ? '.' + t.className.trim().replace(/\s+/g, '.') : ''}>`;
  const mo = new MutationObserver((recs) => {
    for (const r of recs) {
      if (r.target === canvas) continue;
      const t = r.target.nodeType === 1 ? r.target : r.target.parentNode;
      seen.push(`${r.type} ${name(t)}${r.attributeName ? ' @' + r.attributeName : ''}`);
    }
  });
  mo.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
  await new Promise((r) => setTimeout(r, 10000));
  mo.disconnect();
  return JSON.stringify({ lite: document.body.classList.contains('low-perf'), mutations: seen.length, first: seen.slice(0, 8), pass: seen.length === 0 });
})()
```

<!-- T0 write: $SP/checks/text.js -->
```js
// §11.4: from a fresh load at the top, a full scroll changes no text anywhere
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const changes = [];
  const hasText = (n) => (n.nodeType === 3 ? n.data : n.textContent || '').trim() !== '';
  const where = (n) => {
    const e = n.nodeType === 1 ? n : n.parentNode;
    return e ? e.nodeName.toLowerCase() + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/)[0] : '') : '?';
  };
  const mo = new MutationObserver((recs) => {
    for (const r of recs) {
      if (r.type === 'characterData') changes.push('text in ' + where(r.target));
      else for (const n of [...r.addedNodes, ...r.removedNodes]) if (hasText(n)) changes.push('node ' + where(n) + ' in ' + where(r.target));
    }
  });
  mo.observe(document.body, { subtree: true, childList: true, characterData: true });
  const H = () => document.documentElement.scrollHeight;
  for (let y = 0; y < H(); y += innerHeight / 3) { scrollTo({ top: y, behavior: 'instant' }); await wait(250); }
  await wait(1500);
  mo.disconnect();
  return JSON.stringify({ changes: changes.length, first: changes.slice(0, 8), pass: changes.length === 0 });
})()
```

<!-- T0 write: $SP/checks/modes.js -->
```js
// §11.6: with reduced motion (page-check --reduced) or LITE (--eval "window.__lite = true" first),
// a full scroll plays no reveal, split or sweep, runs no seam, and shows everything. In LITE it
// then switches LITE off, and nothing it showed in place may play again.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  if (window.__lite) { document.getElementById('low-perf-btn').click(); await wait(300); }
  // LITE zeroes the accents' timing rather than removing them, and an animation that takes no
  // time moves nothing, so in LITE only one that takes time counts. With reduced motion the
  // accents have no animation at all, so any that starts counts: the global 0.01 ms cut doesn't
  // cut delays, so an accent without its rule would still pop in late.
  let started = new Set();
  document.addEventListener('animationstart', (e) => {
    const s = getComputedStyle(e.target, e.pseudoElement || null);
    const names = s.animationName.split(', '), durs = s.animationDuration.split(', ');
    const d = parseFloat(durs[names.indexOf(e.animationName) % durs.length]);
    if (!window.__lite || d > 0.001) started.add(e.animationName);
  });
  let seamAnimations = 0;
  const H = () => document.documentElement.scrollHeight;
  for (let y = 0; y < H(); y += innerHeight / 3) {
    scrollTo({ top: y, behavior: 'instant' });
    await wait(200);
    document.querySelectorAll('svg.seam').forEach((s) => { seamAnimations += s.getAnimations({ subtree: true }).length; });
  }
  await wait(1000);
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const rests = [...document.querySelectorAll('svg.seam .seam-rest')];
  const atRest = rests.filter((g) => getComputedStyle(g).visibility === 'visible').length;
  const out = {
    lite: document.body.classList.contains('low-perf'),
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    animationsStarted: [...started],
    seamAnimations,
    hidden: reveals.filter((el) => getComputedStyle(el).opacity !== '1').length,
    seamsAtRest: atRest + '/' + rests.length,
  };
  const moving = ['reveal-up', 'focus-in', 'glint-sweep'];
  out.pass = (out.lite || out.reduced) && !out.animationsStarted.some((n) => moving.includes(n))
    && seamAnimations === 0 && out.hidden === 0 && rests.length > 0 && atRest === rests.length;
  if (out.lite) {
    await wait(1000);   // past the last reveal's delay, had it run
    started = new Set();
    document.getElementById('low-perf-btn').click();
    await wait(1000);
    out.afterLiteOff = { started: [...started], hidden: reveals.filter((el) => getComputedStyle(el).opacity !== '1').length };
    out.pass = out.pass && !out.afterLiteOff.started.some((n) => moving.includes(n)) && out.afterLiteOff.hidden === 0;
  }
  return JSON.stringify(out);
})()
```

<!-- T0 write: $SP/checks/focus.js -->
```js
// §11.7: the focused project card shows the outline and the fringe
(() => {
  const c = document.activeElement;
  const s = getComputedStyle(c);
  const out = {
    card: c.classList.contains('project-card'),
    focusVisible: c.matches(':focus-visible'),
    outline: `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`,
    offset: s.outlineOffset,
    shadow: s.boxShadow,
  };
  out.pass = out.card && out.focusVisible && s.outlineStyle === 'solid' && s.outlineWidth === '1px'
    && s.outlineOffset === '3px' && (s.boxShadow.match(/rgba?\(/g) || []).length === 2;
  return JSON.stringify(out);
})()
```

<!-- T0 write: $SP/checks/nojs.js -->
```js
// §11.9: with scripts off (page-check --nojs), everything shows and the seams are plain hairlines
(() => {
  const vis = (sel) => [...document.querySelectorAll(sel)].every((el) => getComputedStyle(el).opacity === '1');
  const out = {
    seamSvgs: document.querySelectorAll('svg.seam').length,
    hairlines: ['about', 'skills', 'projects', 'contact'].map((id) => getComputedStyle(document.getElementById(id)).borderTopColor),
    heroCopyVisible: vis('.hero-eyebrow, .hero-name, .hero-tagline, .hero-cta'),
    revealTargets: document.querySelectorAll('[data-reveal]').length,
    revealTargetsVisible: vis('[data-reveal]'),
  };
  out.pass = out.seamSvgs === 0 && out.hairlines.every((c) => c === 'rgba(255, 255, 255, 0.07)')
    && out.heroCopyVisible && out.revealTargets > 0 && out.revealTargetsVisible;
  return JSON.stringify(out);
})()
```

- [ ] **Step 3: Run the baseline and watch it fail**

Run each command, one after another (`$URL` = `http://localhost:8901/`).

```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --evalfile "$SP/checks/text.js" --evalfile "$SP/checks/scroll.js"
```
```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --evalfile "$SP/checks/leak.js"
```
```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 8000 --evalfile "$SP/checks/stillness.js"
```

Expected (measured on the pre-change page):
- `text.js`: `"changes"` ≈ 1000, from `ascii-flash-overlay`, `section-title` and `scroll-side-label`. `"pass": false`.
- `scroll.js`: `"reveals":0`, `"seams":0`, `"triggers"` ≈ 53. `"pass": false`.
- `leak.js`: `"before"` ≈ 72 and `"after"` ≈ 225 (the leak), `"cardAnimationsWhileTyping"` > 0. `"pass": false`.
- `stillness.js`: `"mutations"` > 0 (`childList <body>` from the timer effects). `"pass": false`.
- `"console"` has `GSAP target .timeline::before not found`, `Element not found: #history`, 404s for `tempo-1.svg` and `deflect-1.svg`, and a `cloudflareinsights` CORS error. Note these down. The two GSAP warnings go away in Task 1. The 404s (missing blur-up placeholders for two projects) and the beacon error are pre-existing and out of scope.

---

### Task 1: Take the terminal layer out of `main.js`

Removes `cursor`, `scrollAnimations`, `glitchEffects`, `sideLabels`, `sectionFlash`, `scanSweep`, `hackScroll`, `clickRipple` and `hoverGlitch`, and their boot calls. `lowPerf.toggle` keeps only the hero pause/resume and the body class. Section headers are renumbered. Sections 11 and 12 (Reveal, Seams) arrive in Tasks 4 and 5. Skill and project cards keep their old GSAP entrances until Task 4, so the page works after every task.

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Apply the blocks**

Run: `node "$SP/apply-plan.js" docs/superpowers/plans/2026-09-26-page-glass.md T1`
Expected: `10 block(s) applied`.

The file header:

<!-- T1 splice: js/main.js | from: /**\n * main.js | to: 'use strict'; -->
```js
/**
 * main.js — Portfolio
 * Sections: Data · Utilities · Loader (disabled) · Hero adapter · Hero copy ·
 *           Nav · Skills · Projects · Project modal · Contact · Reveal ·
 *           Seams · Low performance · Page idle · Boot
 *
 * Dependencies (loaded via CDN in index.html, injected before this script):
 *   - Three.js r128
 *   - GSAP 3.x + ScrollTrigger
 *   - js/hero/*.js — the hero renderer (window.Hero)
 */

```

The cursor module goes. Skills becomes section 7:

<!-- T1 splice: js/main.js | from: /* ===\n   7. CURSOR | to: const skills = { -->
```js
/* ============================================================
   7. SKILLS SECTION
============================================================ */
```

The empty History header goes. Projects becomes section 8:

<!-- T1 splice: js/main.js | from: /* ===\n   9. HISTORY / TIMELINE | to: const projects = { -->
```js
/* ============================================================
   8. PROJECTS — render, filter, search
============================================================ */
```

<!-- T1 splice: js/main.js | from:    11. PROJECT MODAL | to: ============================================================ */ -->
```js
   9. PROJECT MODAL — click a card to view details inline
```

<!-- T1 splice: js/main.js | from:    12. CONTACT FORM | to: ============================================================ */ -->
```js
   10. CONTACT FORM
```

Everything from `scrollAnimations` through `hoverGlitch` goes. Only Low performance's header is left:

<!-- T1 splice: js/main.js | from: /* ===\n   12. SCROLL ANIMATIONS | to: const lowPerf = { -->
```js
/* ============================================================
   13. LOW PERFORMANCE MODE
   Pauses the hero and hides decoration (CSS: body.low-perf).
   Every accent below the hero goes to rest. Content, nav,
   projects and the contact form stay fully functional.
============================================================ */
```

<!-- T1 splice: js/main.js | from:   toggle() { | to: const pageIdle = { -->
```js
  toggle() {
    this.active = !this.active;
    document.body.classList.toggle('low-perf', this.active);
    const btn = document.getElementById('low-perf-btn');
    if (btn) btn.setAttribute('aria-pressed', String(this.active));
    if (this.active) hero.pause();
    else hero.resume();
  },
};

/* ============================================================
   14. TAB VISIBILITY HANDLER — Dynamic title & icon
============================================================ */
```

<!-- T1 splice: js/main.js | from:    14. BOOT SEQUENCE | to: ============================================================ */ -->
```js
   15. BOOT SEQUENCE — wait for GSAP, Three.js and the hero, then start
```

In `boot()`, the cursor call goes:

<!-- T1 splice: js/main.js | from:   // Custom cursor (dot + ring) | to:   // Navigation -->
```js
```

The same goes for the scroll animations and all seven effects:

<!-- T1 splice: js/main.js | from:   // Scroll animations (ScrollTrigger) | to:   // Page idle — dynamic title and favicon on blur -->
```js
```

- [ ] **Step 2: Syntax check and leftovers**

Run: `node --check js/main.js && grep -nE "cursor\.|cursor =|glitchEffects|sideLabels|sectionFlash|scanSweep|hackScroll|clickRipple|hoverGlitch|scrollAnimations|#history|timeline-title" js/main.js`
Expected: no output. `grep` exits with 1 because nothing matched, and that's the pass.

Run: `grep -n "^   [0-9]*\. " js/main.js`
Expected, in order: `1. SITE DATA`, `2. UTILITY HELPERS`, `3. LOADER`, `4. HERO`, `5. HERO ANIMATIONS`, `6. NAVIGATION`, `7. SKILLS SECTION`, `8. PROJECTS`, `9. PROJECT MODAL`, `10. CONTACT FORM`, `13. LOW PERFORMANCE MODE`, `14. TAB VISIBILITY HANDLER`, `15. BOOT SEQUENCE`.

- [ ] **Step 3: Check the page**

Run: `node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 8000 --evalfile "$SP/checks/stillness.js"`
Expected: `"exceptions": []`. The console no longer shows the `.timeline::before` or `#history` warnings. `stillness.js` gives `"mutations":0,"pass":true` (the timer effects are gone).

---

### Task 2: Remove the cursor and glitch markup and the dead CSS

**Files:**
- Modify: `index.html`, `css/styles.css`

- [ ] **Step 1: Apply the blocks**

Run: `node "$SP/apply-plan.js" docs/superpowers/plans/2026-09-26-page-glass.md T2`
Expected: `13 block(s) applied`.

`index.html`: the hero copy loses `glitch-text` and `data-text`:

<!-- T2 splice: index.html | from:         <p class="hero-eyebrow glitch-text" | to:         <p class="hero-tagline"> -->
```html
        <p class="hero-eyebrow">// brucelsprouts.com</p>
        <h1 class="hero-name">Bruce Lin</h1>
```

This is the one visible change in the hero. `.glitch-text` also made the eyebrow and the name `inline-block`, so above about 470 px they shared a line: the eyebrow sat to the left of the name, on its baseline, and pushed the name about 95 px right of centre. Without the class they stack, as they already did on phones. The eyebrow sits 20 px (its `margin-bottom`) above the name, and the name is centred on the black hole. The name, tagline and CTA move 20 px lower. The box the hero's cracks keep clear of changes to match, since `measureText()` in `js/hero/renderer.js` measures the copy (678×258 → 489×298 px at 1280×720). To bring back the old line, add `.hero-eyebrow, .hero-name { display: inline-block; }`.

<!-- T2 splice: index.html | from:       <!-- Cursor glow follower --> | to:       <div class="hero-content"> -->
```html
```

<!-- T2 splice: index.html | from:   <!-- Custom cursor: dot | to:   <!-- Hero renderer, then the main script -->
```html
```

`css/styles.css`: the header comment:

<!-- T2 splice: css/styles.css | from: /* ===\n   PORTFOLIO — styles.css | to: /* ── 1. RESET & BASE ── */ -->
```css
/* ============================================================
   PORTFOLIO — styles.css
   Monochrome. Below the hero the only decorative colour is light
   from its glass: thin red/blue fringes and warm glints (see :root).
   Sections: Reset · Tokens · Utilities · Loader · Nav · Hero ·
             Skills · About · Projects · Contact · Footer ·
             Responsive · Low performance · Scrollbar · Selection ·
             Reduced motion
============================================================ */

```

`body { cursor: none }` and its touch-screen override go:

<!-- T2 splice: css/styles.css | from: body { | to: a { -->
```css
body {
  background: #000;
  color: #e8e8e8;
  font-family: 'Space Grotesk', sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
  -ms-overflow-style: none; /* IE 11 — hide scrollbar */
}

```

<!-- T2 splice: css/styles.css | from: /* Glitch text animation */ | to: /* Section shared styles */ -->
```css
```

<!-- T2 splice: css/styles.css | from: /* Cursor glow */ | to: /* ── 7. SKILLS ── */ -->
```css
```

Dead selectors. Each was checked for use in `index.html` and `main.js` (spec §7), and nothing renders them:

<!-- T2 splice: css/styles.css | from: .skill-level { | to: /* ── 8. ABOUT ── */ -->
```css
```

<!-- T2 splice: css/styles.css | from: /* Thumb overlay icon */ | to: .project-thumb img { -->
```css
.project-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #111;
  overflow: hidden;
  position: relative;
}

```

<!-- T2 splice: css/styles.css | from: /* Open hint */ | to: /* Expand / click hint icon at top-right of card thumbnail */ -->
```css
```

<!-- T2 splice: css/styles.css | from:   .hud-corner { display: none; } | to: } -->
```css
  .hud-corner { display: none; }
```

LITE loses its cursor, side-label and glitch rules:

<!-- T2 splice: css/styles.css | from: /* ── body.low-perf: hide all purely decorative elements ── */ | to: /* Hero solid background when 3D canvas is hidden */ -->
```css
/* ── body.low-perf: hide all purely decorative elements ── */
body.low-perf #hero-canvas,
body.low-perf .hud-corner,
body.low-perf #hero.hero-fallback::before,
body.low-perf #hero.hero-fallback::after { display: none !important; }

/* Dot-matrix motif behind every section below the hero */
body.low-perf #about::before,
body.low-perf #skills::before,
body.low-perf #projects::before,
body.low-perf #contact::before { display: none !important; }

```

Sections 16–21 (custom cursor, side labels, ASCII flash, scan sweep, label glitch, click ripple) go. Reduced motion is kept as it is, and now ends the file:

<!-- T2 splice: css/styles.css | from: /* ── 15. REDUCED MOTION ── */ | to: EOF -->
```css
/* ── 15. REDUCED MOTION ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Leftovers**

Run: `grep -nE "cursor-(dot|ring|glow)|glitch-text|glitch-(before|after)|data-text|scroll-side-label|ascii-flash|scan-sweep|click-ripple|label-glitch|\.timeline|symbol-block|skill-level|project-thumb-overlay|project-type-icon|project-open-hint|cursor: ?none" index.html css/styles.css`
Expected: no output. The disabled loader's `#glitch-overlay` and `.glitch-block` stay, as spec §7 keeps the loader, so the pattern skips them.

- [ ] **Step 3: Check the page**

Run: `node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 2500 --eval "JSON.stringify({ cursor: getComputedStyle(document.body).cursor, name: document.querySelector('.hero-name').textContent, nameOpacity: getComputedStyle(document.querySelector('.hero-name')).opacity })"`
Expected: `"exceptions": []`, then `{"cursor":"auto","name":"Bruce Lin","nameOpacity":"1"}`.

---

### Task 3: Light tokens and the hero name's focus-in

The name no longer scrambles. At 0.5 s the hero timeline gives it `.is-in`, and a red copy to its left and a blue copy to its right close onto crisp white as it fades up (0.9 s). The eyebrow, tagline, CTA and HUD timings don't change.

**Files:**
- Modify: `css/styles.css`, `js/main.js`

- [ ] **Step 1: Apply the blocks**

Run: `node "$SP/apply-plan.js" docs/superpowers/plans/2026-09-26-page-glass.md T3`
Expected: `3 block(s) applied`.

The tokens go in `:root`, before the easing curve:

<!-- T3 insert: css/styles.css | before:   /* One easing curve for every non-hero transition. */ -->
```css
  /* Light, from the hero's cracks (js/hero: colors.riftCore and the split in
     CRACK_FRAG). Below the hero, decorative colour is only ever light: thin
     fringes and glints on lines and edges, never a fill, a text colour or a
     background (the contact form's status colours are the one exception),
     and a fringe at rest is never brighter than alpha .35. One light
     direction for the whole page: red toward the top and left, blue toward
     the bottom and right. RGB triplets, so each use sets its own alpha:
     rgb(var(--glint) / .16). */
  --glint:         255 250 242;   /* the crack's white-hot core */
  --fringe-r:      255 64 48;     /* the red side of split light */
  --fringe-b:      48 128 255;    /* the blue side */

  /* Accent tuning: the spec's starting values, to adjust by eye */
  --focus-t:       0.6s;          /* focus-in; the hero name takes 0.9s */
  --focus-split:   0.04em;        /* how far apart the red and blue copies start */
  --focus-alpha:   .6;            /* how bright the copies start */

```

The keyframes take the place of the glitch-text block in Utilities:

<!-- T3 insert: css/styles.css | before: /* Section shared styles */ -->
```css
/* ── Focus-in ──
   Text arrives out of focus, split the way the hero's glass splits light: a
   red copy to the left and a blue copy to the right close onto crisp white
   as it fades up. The fade is done at 40% of the run and the split closes
   over all of it, so the colour is seen: at 40% the text is opaque and still
   split by half, at full strength. .is-in starts it: on the hero name from
   the hero copy timeline (js/main.js heroAnimations), and on section titles
   from their header's reveal (below). */
@keyframes focus-in {
  0% {
    opacity: 0;
    transform: translateY(12px);
    text-shadow: calc(-1 * var(--focus-split)) 0 rgb(var(--fringe-r) / var(--focus-alpha)),
                 var(--focus-split) 0 rgb(var(--fringe-b) / var(--focus-alpha));
  }
  40% {
    opacity: 1;
    text-shadow: calc(-.55 * var(--focus-split)) 0 rgb(var(--fringe-r) / var(--focus-alpha)),
                 calc(.55 * var(--focus-split)) 0 rgb(var(--fringe-b) / var(--focus-alpha));
  }
  100% {
    opacity: 1;
    transform: none;
    text-shadow: 0 0 rgb(var(--fringe-r) / 0), 0 0 rgb(var(--fringe-b) / 0);
  }
}

.hero-name.is-in {
  --focus-t: 0.9s;
  opacity: 1;
  animation: focus-in var(--focus-t) var(--ease) backwards;
}

/* Reduced motion and LITE: the name appears in place. LITE zeroes the
   timing rather than removing the animation: an animation that's put back
   plays again, and LITE can be switched off. */
@media (prefers-reduced-motion: reduce) {
  .hero-name.is-in { animation: none; }
}
body.low-perf .hero-name.is-in { animation-duration: 0s; animation-delay: 0s; }

```

The hero copy timeline. The name leaves the GSAP tweens, since CSS animates it now, and an inline `transform` from GSAP would outlive the animation:

<!-- T3 splice: js/main.js | from: /* ===\n   5. HERO ANIMATIONS | to: /* ===\n   6. NAVIGATION -->
```js
/* ============================================================
   5. HERO COPY — GSAP timeline, played at boot
   The name focuses in (styles.css "Focus-in") when the timeline
   gives it .is-in. The rest of the copy fades up.
============================================================ */
const heroAnimations = {
  play() {
    const nameEl = document.querySelector('.hero-name');

    // Without GSAP the rest of the copy (opacity 0 in CSS) just appears.
    // The name still focuses in, since CSS runs that.
    if (typeof gsap === 'undefined') {
      document.querySelectorAll('.hero-eyebrow, .hero-tagline, .hero-cta, .hud-corner')
        .forEach(el => { el.style.opacity = '1'; });
      if (nameEl) nameEl.classList.add('is-in');
      return;
    }

    // Set initial states BEFORE the timeline runs
    gsap.set(['.hero-eyebrow', '.hero-tagline', '.hero-cta'], { opacity: 0, y: 24 });
    gsap.set('.hud-corner', { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0.15);
    tl.add(() => { if (nameEl) nameEl.classList.add('is-in'); }, 0.5);
    tl.to('.hero-tagline', { opacity: 1, y: 0, duration: 0.65 }, 1.0);
    tl.to('.hero-cta',     { opacity: 1, y: 0, duration: 0.55 }, 1.45);
    tl.to('.hud-corner',   { opacity: 1, duration: 0.5  },        1.75);
  },
};

```

- [ ] **Step 2: Syntax check**

Run: `node --check js/main.js`
Expected: no output.

- [ ] **Step 3: Check the page**

This pauses the name at 40% of its focus-in (360 ms of 900), takes a screenshot, and then lets it finish:

```bash
node "$SP/page-check.mjs" --url "$URL" --wait "document.querySelector('.hero-name.is-in')" --eval "(() => { const n = document.querySelector('.hero-name'); const a = n.getAnimations()[0]; a.pause(); a.currentTime = 360; const s = getComputedStyle(n); return JSON.stringify({ animation: a.animationName, opacity: s.opacity, shadow: s.textShadow }); })()" --shot "$SP/shots/t3-name-mid.png" --eval "(async () => { const n = document.querySelector('.hero-name'); n.getAnimations().forEach(a => a.play()); await new Promise(r => setTimeout(r, 1500)); const s = getComputedStyle(n); return JSON.stringify({ text: n.textContent, opacity: s.opacity, shadow: s.textShadow, transform: s.transform }); })()" --shot "$SP/shots/t3-name-end.png"
```

Expected, at 1280×720:
- The first eval gives `{"animation":"focus-in","opacity":"1","shadow":"rgba(255, 64, 48, 0.6) -2.5344px 0px 0px, rgba(48, 128, 255, 0.6) 2.5344px 0px 0px"}`. That's 0.55 × 0.04 em of a 115.2 px name.
- The second gives `{"text":"Bruce Lin","opacity":"1","shadow":"none","transform":"none"}`.

Open both PNGs with the Read tool. Mid: a red fringe on the left edges of the letters and a blue one on the right. End: crisp white.

---

### Task 4: Reveals

One mechanism replaces three. Elements marked `data-reveal` get `.is-in` once, when their top reaches 88% of the viewport, and CSS moves them (0.45 s, `--ease`, delayed `--i × 70 ms`). The targets are the section headers (whose titles focus in), skill cards, project cards on the first render only, the contact layout, and the social links. The hidden state exists only under `html.reveal-on`, which the script sets. Without ScrollTrigger everything gets `.is-in` at boot.

Two details make this work. The reveal is a CSS **animation** with `backwards` fill, not a transition. A transition would replace the cards' own hover transitions and delay them. And once it finishes, the animation leaves nothing behind, so hover transforms (the card lift, the social link nudge) work as before. Second, elements already on screen at boot, say after a `#contact` link, are shown as they are instead of being hidden for a frame.

**Files:**
- Modify: `css/styles.css`, `js/main.js`, `index.html`

- [ ] **Step 1: Apply the blocks**

Run: `node "$SP/apply-plan.js" docs/superpowers/plans/2026-09-26-page-glass.md T4`
Expected: `16 block(s) applied`.

The tunables:

<!-- T4 insert: css/styles.css | before:   /* One easing curve for every non-hero transition. */ -->
```css
  --reveal-t:      0.45s;         /* reveals: one fade up */
  --reveal-step:   70ms;          /* reveals: stagger per --i */

```

The rules, after Focus-in:

<!-- T4 insert: css/styles.css | before: /* Section shared styles */ -->
```css
/* ── Reveals ──
   Content marked data-reveal rises into place once, as it scrolls into view:
   js/main.js `reveal` gives it .is-in. The hidden state only exists under
   html.reveal-on, which that script sets, so a script that fails never hides
   anything. --i, set as elements arrive together, staggers them. It's an
   animation with backwards fill rather than a transition, so it leaves the
   elements' own hover transitions and transforms alone. */
html.reveal-on [data-reveal]:not(.is-in) {
  opacity: 0;
  transform: translateY(16px);
}
html.reveal-on [data-reveal].is-in {
  animation: reveal-up var(--reveal-t) var(--ease) backwards;
  animation-delay: calc(var(--i, 0) * var(--reveal-step));
}
@keyframes reveal-up {
  from { opacity: 0; transform: translateY(16px); }
}

/* A header rises as one, and its title focuses in as it does */
.section-header.is-in .section-title {
  animation: focus-in var(--focus-t) var(--ease) backwards;
  animation-delay: calc(var(--i, 0) * var(--reveal-step));
}

/* Reduced motion and LITE: things appear in place. LITE zeroes the timing,
   as for the hero name (Focus-in). These have to come after the rules
   above: they only match their specificity. */
@media (prefers-reduced-motion: reduce) {
  html.reveal-on [data-reveal].is-in,
  .section-header.is-in .section-title { animation: none; }
}
body.low-perf [data-reveal].is-in,
body.low-perf .section-header.is-in .section-title { animation-duration: 0s; animation-delay: 0s; }

```

The cards lose their old "animated in" start states:

<!-- T4 splice: css/styles.css | from: .skill-card { | to: /* Skills are inert, so they step up only one rung and don't lift — the -->
```css
.skill-card {
  padding: 20px 16px;
  border: 1px solid var(--bd-1);
  border-radius: var(--radius-sm);
  background: var(--sf-1);
  text-align: center;
  transition: border-color var(--t-fast), background var(--t-fast), transform var(--t-fast);
  cursor: default;
  position: relative;
  overflow: visible;
}

```

<!-- T4 splice: css/styles.css | from: .project-card { | to: .project-card:hover { -->
```css
.project-card {
  background: var(--sf-2);
  border: 1px solid var(--bd-2);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform var(--t-mid), border-color var(--t-mid), background var(--t-mid);
  position: relative;
  cursor: pointer;
}

```

`main.js` gets a helper, next to the other utilities:

<!-- T4 insert: js/main.js | before: /** Format YYYY-MM-DD project date for display */ -->
```js
/** True once GSAP and its ScrollTrigger plugin have both loaded */
const scrollTriggerReady = () => typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

```

Skills only mark their cards now:

<!-- T4 splice: js/main.js | from: const skills = { | to: /* ===\n   8. PROJECTS -->
```js
const skills = {
  init() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    // Populate skill cards; they rise in with the page (reveal)
    DATA.skills.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.setAttribute('data-reveal', '');
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
  },
};

```

Projects mark their cards on the first render only, then refresh the triggers after each later render. This is the leak fix from spec §2:

<!-- T4 splice: js/main.js | from:   searchQuery: '', | to:   buildCard(project) { -->
```js
  searchQuery: '',
  _rendered: false,

  init() {
    this.all = DATA.projects;
    this.bindFilter();
    this.bindSort();
    this.bindSearch();
    this.filter();
  },

  renderAll(list) {
    const grid = document.getElementById('projects-grid');
    const noResults = document.getElementById('no-results');
    if (!grid) return;

    // Only the first render rises in with the page (reveal). Filtering,
    // sorting and searching render cards that are already in: no triggers
    // per render, and nothing replays while you type.
    const first = !this._rendered;
    this._rendered = true;

    // Update result count
    const countEl = document.getElementById('project-result-count');
    if (countEl) {
      const total = this.all.length;
      countEl.textContent = list.length === total
        ? `${total} projects`
        : `${list.length} / ${total}`;
    }

    grid.innerHTML = '';
    noResults.style.display = list.length ? 'none' : 'block';
    list.forEach(project => {
      const card = this.buildCard(project);
      if (first) card.setAttribute('data-reveal', '');
      grid.appendChild(card);
    });

    // Everything below the grid may have moved
    if (!first) reveal.refresh();
  },

```

<!-- T4 splice: js/main.js | from:   bindScrollAnimations() { | to:   setTagSearch(tag) { -->
```js
```

The reveal module becomes section 11:

<!-- T4 insert: js/main.js | before: /* ===\n   13. LOW PERFORMANCE MODE -->
```js
/* ============================================================
   11. REVEAL — content rises into place once, as it scrolls in
   Elements marked data-reveal (static ones in index.html, cards
   as they're built) get .is-in once, when their top reaches 88%
   of the viewport's height, and CSS does the move (styles.css
   "Reveals"). One ScrollTrigger.batch does the triggering, and
   each trigger is killed once it has fired, so nothing reverses.
   The hidden state only exists under html.reveal-on, set here,
   so a script that fails never hides content.
============================================================ */
const reveal = {
  /* Calls fn(el, i) once for each element, when its top reaches `start`
     (a ScrollTrigger start such as 'top 88%'). i counts the elements that
     arrived on screen together, for staggers. After a jump (a nav link),
     everything scrolled past arrives too; those get 0 and don't count, so
     they don't hold up what's in view. Without ScrollTrigger it calls fn
     for every element now. The seams use this too. */
  when(els, start, fn) {
    if (!els.length) return;
    if (!scrollTriggerReady()) {
      els.forEach((el) => fn(el, 0));
      return;
    }
    ScrollTrigger.batch(els, {
      start,
      onEnter: (batch, triggers) => {
        let i = 0;
        batch.forEach((el) => fn(el, el.getBoundingClientRect().bottom > 0 ? i++ : 0));
        triggers.forEach((st) => st.kill());
      },
    });
  },

  init() {
    const line = window.innerHeight * 0.88;
    const waiting = [...document.querySelectorAll('[data-reveal]')].filter((el) => {
      if (el.getBoundingClientRect().top >= line) return true;
      el.removeAttribute('data-reveal');     // already on screen (a #contact link): leave it be
      return false;
    });
    this.when(waiting, 'top 88%', (el, i) => {
      el.style.setProperty('--i', Math.min(i, 5));
      el.classList.add('is-in');
    });
    document.documentElement.classList.add('reveal-on');
  },

  /* After the layout changes under the triggers (the project grid
     re-renders): drop the triggers of elements that are gone, and
     re-measure the rest, which may have moved */
  refresh() {
    if (!scrollTriggerReady()) return;
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger && !st.trigger.isConnected) st.kill();
    });
    ScrollTrigger.refresh();
  },
};

```

`reveal.init()` runs in `boot()` once the cards exist:

<!-- T4 insert: js/main.js | before:   // Page idle — dynamic title and favicon on blur -->
```js
  // Reveals: everything marked data-reveal rises in once, as it scrolls
  // into view (after the cards above exist)
  reveal.init();

```

`index.html`: the static targets. Headers, one line each:

<!-- T4 splice: index.html | from:         <div class="section-header">\n          <span class="section-tag">// MODULE_01</span> | to:           <span class="section-tag">// MODULE_01</span> -->
```html
        <div class="section-header" data-reveal>
```

<!-- T4 splice: index.html | from:         <div class="section-header">\n          <span class="section-tag">// MODULE_02</span> | to:           <span class="section-tag">// MODULE_02</span> -->
```html
        <div class="section-header" data-reveal>
```

<!-- T4 splice: index.html | from:         <div class="section-header">\n          <span class="section-tag">// MODULE_03</span> | to:           <span class="section-tag">// MODULE_03</span> -->
```html
        <div class="section-header" data-reveal>
```

<!-- T4 splice: index.html | from:         <div class="section-header">\n          <span class="section-tag">// MODULE_04</span> | to:           <span class="section-tag">// MODULE_04</span> -->
```html
        <div class="section-header" data-reveal>
```

<!-- T4 splice: index.html | from:         <div class="contact-layout"> | to:           <!-- Contact form --> -->
```html
        <div class="contact-layout" data-reveal>
```

The social links reveal on their list items, so the links' own hover transform is untouched:

<!-- T4 splice: index.html | from:             <ul class="social-list"> | to:           </div> -->
```html
            <ul class="social-list">
              <li data-reveal>
                <a href="https://github.com/brucelsprouts" target="_blank" rel="noopener noreferrer" class="social-link">
                  <span class="social-icon">&#60;/&#62;</span>
                  <span>GitHub</span>
                </a>
              </li>
              <li data-reveal>
                <a href="https://www.linkedin.com/in/bruce-lin-6284b323b/" target="_blank" rel="noopener noreferrer" class="social-link">
                  <span class="social-icon">in</span>
                  <span>LinkedIn</span>
                </a>
              </li>
              <li data-reveal>
                <a href="mailto:email@brucelsprouts.com" class="social-link">
                  <span class="social-icon">&#9993;</span>
                  <span>Email</span>
                </a>
              </li>
            </ul>
```

- [ ] **Step 2: Syntax check and leftovers**

Run: `node --check js/main.js && grep -nE "randInt\(0, CHARS|filter = 'brightness|bindScrollAnimations|toggleActions" js/main.js; grep -c "data-reveal" index.html`
Expected: no lines from the first `grep`, then `8` (4 headers, the contact layout, 3 social links).

- [ ] **Step 3: Check the page (1280×720 and 375×812)**

```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --evalfile "$SP/checks/text.js" --evalfile "$SP/checks/scroll.js"
```
```bash
node "$SP/page-check.mjs" --w 375 --h 812 --mobile --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --evalfile "$SP/checks/scroll.js"
```
```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --evalfile "$SP/checks/leak.js"
```

Expected: `"exceptions": []`. `text.js` passes with `"changes":0`. `scroll.js` gives `"reveals":37` (4 headers, 11 skills, 18 projects, the contact layout, 3 social links), `"notIn":0`, `"hidden":0` and `"triggers":0`. It still shows `"seams":0` and `"pass":false` until Task 5. `leak.js` passes: `{"atLoad":37,"before":5,"after":5,"cardAnimationsWhileTyping":0,"cards":18,"cardsHidden":0,"pass":true}`. The 5 left are the Contact header, the contact layout and the 3 social links, still below the fold.

- [ ] **Step 4: A nav link doesn't hold up the section it lands on**

Clicking "Projects" in the nav scrolls past About and Skills, and their elements arrive in the same batches. They don't count toward the stagger, so the Projects header starts at once and the first row of cards staggers from 0:

```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1000 --eval "document.querySelector('.nav-links a[href=\"#projects\"]').click()" --sleep 2500 --eval "JSON.stringify({ header: document.querySelector('#projects .section-header').style.getPropertyValue('--i'), firstRow: [...document.querySelectorAll('#projects-grid .project-card')].slice(0, 3).map(e => e.style.getPropertyValue('--i')).join() })"
```

Expected at 1280×720 (three columns): `{"header":"0","firstRow":"0,1,2"}`. Counting everything in the batch instead would give the header `5`, a 350 ms wait.

---

### Task 5: Seams

A `seams` module injects one inline `<svg class="seam">` into the top of `#about`, `#skills`, `#projects` and `#contact`. Each seam is a crack drawn as light: a warm-white core, red 1 px above and blue 1 px below, at rest about as quiet as today's hairline. Once, when it reaches 85% of the viewport, a bright 60 px tip runs it across in 0.55 s (up to speed over the first 30%, then racing), and the line behind settles to rest over 0.8 s. A branch starts as the front passes its root, at 0.8× the speed. Direction alternates from seam to seam.

**The crack is the edge between the panels.** The panels alternate between black (`--clr-bg`: the hero, Skills, Contact) and `--clr-surface` (About, Projects). Above each crack, a cover path in the upper panel's colour (`--seam-above`) fills the gap from the section's straight top edge down to the main line, so the panels meet along the zigzag. The section's 1 px `border-top` row is out of the SVG's reach (sections clip to their padding box), so `.has-seam` paints it the same colour, only once the SVG is in. Without the script, the hairline stays.

**The main line's shape.** Runs of 80–200 px that turn 4–10° at every joint can't stay within ±5 px if they wander at random. A run that ends mid-band on a shallow heading leaves no room for the next 4° turn: from the centre line, an 80 px run can climb at most atan(5/80) = 3.6°. So each run ends 30–100% of the way to the far side of the band, and a candidate is kept only if its turn is 4–10°. Over 18,000 test lines at nine widths, every joint and every run was in range, with no fallbacks. A branch leaves a kink 20–80% of the way across. It runs 40–120 px, heads 25–55° below the line in the direction the crack runs, and has one small kink of its own. Where the section's top padding is too shallow for it (phones have 80 px), it's shortened, keeping its angles, so it stops 16 px above the content.

**Files:**
- Modify: `js/main.js`, `css/styles.css`
- Test: `$SP/tests/seams.test.js`

- [ ] **Step 1: Write the failing test**

<!-- T5test write: $SP/tests/seams.test.js -->
```js
// node seams.test.js — the seam geometry and timing in js/main.js (dev only, not shipped)
// Loads the real main.js in a sandbox (boot never runs: readyState stays 'loading').
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const MAIN = process.env.MAIN || path.resolve('js/main.js');
const document = { readyState: 'loading', title: '', addEventListener() {}, querySelector: () => null };
const ctx = vm.createContext({ document, window: {}, console });
vm.runInContext(fs.readFileSync(MAIN, 'utf8') + '\n;globalThis.__t = { seams, mulberry32 };', ctx);
const { seams, mulberry32 } = ctx.__t;
const deg = 180 / Math.PI;
const heading = (p, q) => Math.atan2(q.y - p.y, q.x - p.x);

// 1. mulberry32: same seed, same sequence, all in [0, 1)
{
  const a = mulberry32(42), b = mulberry32(42), c = mulberry32(43);
  const sa = Array.from({ length: 5 }, a), sb = Array.from({ length: 5 }, b), sc = Array.from({ length: 5 }, c);
  assert.deepStrictEqual(sa, sb, 'mulberry32 is not deterministic');
  assert.notDeepStrictEqual(sa, sc, 'different seeds give the same sequence');
  sa.forEach((v) => assert(v >= 0 && v < 1, 'out of range: ' + v));
}

// 2. The main line: edge to edge, within the band, runs 80–200 px, joints 4–10°
let joints = 0;
for (const W of [320, 375, 414, 768, 1024, 1280, 1920, 2560]) {
  for (let seed = 1; seed <= 400; seed++) {
    const p = seams.mainLine(W, mulberry32(seed));
    const tag = `W=${W} seed=${seed}`;
    assert.strictEqual(p[0].x, 0, tag + ': starts at x = 0');
    assert(Math.abs(p[p.length - 1].x - W) < 1e-9, tag + ': ends at x = W');
    p.forEach((q) => assert(Math.abs(q.y) <= seams.BAND + 1e-9, `${tag}: y = ${q.y} outside ±${seams.BAND}`));
    for (let i = 1; i < p.length; i++) {
      const run = p[i].x - p[i - 1].x;
      assert(run > 0, tag + ': runs go forward');
      if (i < p.length - 1) assert(run >= 80 - 1e-9 && run <= 200 + 1e-9, `${tag}: run ${run.toFixed(1)} px`);
    }
    for (let i = 1; i < p.length - 1; i++) {
      const turn = Math.abs(heading(p[i], p[i + 1]) - heading(p[i - 1], p[i])) * deg;
      assert(turn >= 4 - 1e-6 && turn <= 10 + 1e-6, `${tag}: joint ${i} turns ${turn.toFixed(2)}°`);
      joints++;
    }
  }
}
assert(joints > 10000, 'too few joints tested: ' + joints);

// 3. Same seed and width, same crack
assert.deepStrictEqual(seams.mainLine(1280, mulberry32(7)), seams.mainLine(1280, mulberry32(7)));

// 4. Branches: off a kink 20–80% across, 40–120 px, leaving 25–55° below the line, going
//    forward and down, and no deeper than maxDrop (56 px is what 80 px of padding leaves)
let branches = 0, shortened = 0;
for (const maxDrop of [Infinity, 56]) {
  for (const W of [320, 375, 768, 1280, 1920]) {
    for (let seed = 1; seed <= 400; seed++) {
      const rnd = mulberry32(seed);
      const main = seams.mainLine(W, rnd);
      const b = seams.branchLine(main, W, rnd, maxDrop);
      if (!b) continue;
      branches++;
      const tag = `W=${W} seed=${seed} maxDrop=${maxDrop}`;
      assert(b.root > 0 && b.root < main.length - 1, tag + ': root is a kink');
      assert.strictEqual(b.pts[0], main[b.root], tag + ': starts on the main line');
      assert(main[b.root].x >= 0.2 * W && main[b.root].x <= 0.8 * W, tag + ': root 20–80% across');
      const len = seams.length(b.pts);
      assert(len >= 40 - 1e-9 && len <= 120 + 1e-9, `${tag}: branch ${len.toFixed(1)} px`);
      const a1 = heading(b.pts[0], b.pts[1]) * deg;
      assert(a1 >= 25 - 1e-9 && a1 <= 55 + 1e-9, `${tag}: leaves at ${a1.toFixed(1)}°`);
      for (let i = 1; i < b.pts.length; i++) {
        assert(b.pts[i].x > b.pts[i - 1].x && b.pts[i].y > b.pts[i - 1].y, tag + ': goes forward and down');
      }
      const deepest = b.pts[b.pts.length - 1].y;
      assert(deepest <= maxDrop + 1e-9, `${tag}: ends ${deepest.toFixed(1)} px down`);
      if (maxDrop < Infinity && Math.abs(deepest - maxDrop) < 1e-9) shortened++;
    }
  }
}
assert(branches > 3000, 'branches were mostly missing: ' + branches);
assert(shortened > 0, 'maxDrop never shortened a branch, so this test proves nothing about it');

// 5. The front: up to speed over the first ACCEL of the run, then steady; frontAt inverts it
{
  const a = seams.ACCEL;
  const covered = (u) => (u <= a ? (u * u) / (a * (2 - a)) : (2 * u - a) / (2 - a));
  assert.strictEqual(seams.frontAt(0), 0);
  assert(Math.abs(seams.frontAt(1) - 1) < 1e-12);
  for (let u = 0; u <= 1.0001; u += 0.05) {
    assert(Math.abs(seams.frontAt(covered(u)) - u) < 1e-9, 'frontAt at u = ' + u.toFixed(2));
  }
}

// 6. The list: four panels, directions alternating, two or three branches
{
  // Array.from makes the array in this realm: arrays made inside the sandbox
  // have its Array.prototype, and deepStrictEqual compares prototypes
  const ids = Array.from(seams.LIST, (s) => s.id);
  assert.deepStrictEqual(ids, ['about', 'skills', 'projects', 'contact']);
  seams.LIST.forEach((s, i) => { if (i) assert.strictEqual(s.dir, -seams.LIST[i - 1].dir, 'directions alternate'); });
  const n = seams.LIST.filter((s) => s.branch).length;
  assert(n === 2 || n === 3, 'two or three seams branch');
}

console.log(`seams: all checks passed (${joints} joints, ${branches} branches, ${shortened} shortened)`);
```

Run: `node "$SP/apply-plan.js" docs/superpowers/plans/2026-09-26-page-glass.md T5test`
Expected: `write   <your scratchpad>/tests/seams.test.js (104 lines)`, then `1 block(s) applied`.

- [ ] **Step 2: Run it to see it fail**

Run: `node "$SP/tests/seams.test.js"`
Expected: FAIL with `ReferenceError: seams is not defined`.

- [ ] **Step 3: Apply the implementation**

Run: `node "$SP/apply-plan.js" docs/superpowers/plans/2026-09-26-page-glass.md T5`
Expected: `5 block(s) applied`.

The seeded random helper, next to `scrollTriggerReady`:

<!-- T5 insert: js/main.js | before: /** Format YYYY-MM-DD project date for display */ -->
```js
/** Seeded random numbers in [0, 1): the same seed gives the same sequence.
 *  Local to this file, so it doesn't depend on the hero having loaded. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

```

The module, section 12, after Reveal:

<!-- T5 insert: js/main.js | before: /* ===\n   13. LOW PERFORMANCE MODE -->
```js
/* ============================================================
   12. SEAMS — cracks of light between the sections
   Each panel's top hairline becomes a crack, and the crack is
   the panel's edge: above it, a cover in the colour of the panel
   above fills down from the straight edge, so the two panels meet
   along the zigzag. The crack is drawn as light: a warm-white
   core with red 1 px above and blue 1 px below (styles.css
   "Seams"). Each seam has its own seed, so it's the
   same crack on every visit, and it's laid out in CSS px, so its
   kinks keep their angles at any width (it's rebuilt with the
   same seed when the width changes). Once, as it scrolls into
   view, a bright tip runs it across. Reduced motion and LITE
   leave it at rest, and without this script the hairline stays.
============================================================ */
const seams = {
  // One per panel. Directions alternate, and three of the four branch.
  LIST: [
    { id: 'about',    seed: 0x51a3, dir:  1, branch: true  },
    { id: 'skills',   seed: 0x7c21, dir: -1, branch: false },
    { id: 'projects', seed: 0x2e8f, dir:  1, branch: true  },
    { id: 'contact',  seed: 0x9b46, dir: -1, branch: true  },
  ],
  Y0: 8,              // the centre line, px below the section's top edge
  BAND: 5,            // the main line stays within ±BAND px of it
  RUN: 0.55,          // s for the front to cross
  ACCEL: 0.3,         // the share of the run spent getting up to speed
  TIP: 60,            // px of bright front
  SETTLE: 0.8,        // s for the line behind the front to settle to rest
  FADE: 0.15,         // s for the tip to go out at the end
  BRANCH_PACE: 0.8,   // a branch runs at this share of the front's top speed
  _list: [],

  init() {
    const still = !scrollTriggerReady() || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const line = window.innerHeight * 0.85;
    const waiting = [];
    this.LIST.forEach((cfg) => {
      const section = document.getElementById(cfg.id);
      if (!section) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'seam');
      svg.setAttribute('aria-hidden', 'true');
      section.prepend(svg);
      const seam = { cfg, section, svg, width: 0, lines: [] };
      this._list.push(seam);
      this.build(seam);
      section.classList.add('has-seam');
      // Reduced motion, no ScrollTrigger, or already on screen: at rest from the start
      if (still || svg.getBoundingClientRect().top < line) return;
      svg.classList.add('is-armed');
      waiting.push(svg);
    });
    reveal.when(waiting, 'top 85%', (svg) => this.run(this._list.find((s) => s.svg === svg)));

    // Same seed, new width: rebuild. Heights change all the time (the project
    // grid); build() ignores anything but the width.
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver((entries) => entries.forEach((e) => {
        const seam = this._list.find((s) => s.section === e.target);
        if (seam) this.build(seam);
      }));
      this._list.forEach((s) => ro.observe(s.section));
    }
  },

  /* Lays the crack out for the section's current width */
  build(seam) {
    const W = Math.round(seam.section.clientWidth);
    if (!W || W === seam.width) return;
    seam.width = W;
    const rnd = mulberry32(seam.cfg.seed);
    const lines = [{ pts: this.mainLine(W, rnd) }];
    // A branch ends at least 16 px above the section's content. The top
    // padding is clamp(80px, 10vw, 140px), so this mostly bites on narrow
    // screens.
    const maxDrop = parseFloat(getComputedStyle(seam.section).paddingTop) - this.Y0 - 16;
    const branch = seam.cfg.branch && this.branchLine(lines[0].pts, W, rnd, maxDrop);
    if (branch) lines.push(branch);
    lines.forEach((l) => {
      // Right-to-left seams are mirrored, so their path (and front) starts at the right
      l.pts = l.pts.map((p) => ({
        x: +(seam.cfg.dir < 0 ? W - p.x : p.x).toFixed(1),
        y: +(this.Y0 + p.y).toFixed(1),
      }));
      l.len = this.length(l.pts);
    });
    if (branch) branch.rootAt = this.length(lines[0].pts.slice(0, branch.root + 1)) / lines[0].len;
    const H = Math.ceil(Math.max(...lines.flatMap((l) => l.pts.map((p) => p.y))) + 4);

    const d = (pts) => 'M' + pts.map((p) => `${p.x} ${p.y}`).join('L');
    const layers = (l) =>
      `<path class="seam-fr" d="${d(l.pts)}" transform="translate(0 -1)"/>` +
      `<path class="seam-fb" d="${d(l.pts)}" transform="translate(0 1)"/>` +
      `<path class="seam-core" d="${d(l.pts)}"/>`;
    // The cover: the panel above, from the straight top edge down to the main line
    const main = lines[0].pts, end = main[main.length - 1];
    const cover = `<path class="seam-cover" d="${d(main)}L${end.x} 0L${main[0].x} 0Z"/>`;
    if (seam.svg.getAnimations) seam.svg.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    seam.svg.setAttribute('width', W);
    seam.svg.setAttribute('height', H);
    seam.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    // Under the lines, the cover. Then each line: the part at rest, and its
    // tip, a TIP px dash parked at the far end.
    seam.svg.innerHTML = cover + lines.map((l) =>
      `<g class="seam-rest">${layers(l)}</g>` +
      `<g class="seam-tip" style="stroke-dasharray:${this.TIP} ${l.len + this.TIP};stroke-dashoffset:${this.TIP - l.len}">${layers(l)}</g>`
    ).join('');
    const rests = seam.svg.querySelectorAll('.seam-rest'), tips = seam.svg.querySelectorAll('.seam-tip');
    lines.forEach((l, i) => { l.rest = rests[i]; l.tip = tips[i]; });
    seam.lines = lines;
  },

  /* The main line: straight runs of 80–200 px that kink 4–10° at every
     joint, zigzagging within ±BAND px of the centre line. Each run ends
     30–100% of the way to the far side of the band, which always leaves
     room for the next kink (a run ending mid-band on a shallow heading
     wouldn't). Left to right, x from 0 to W, y from the centre line. */
  mainLine(W, rnd) {
    const deg = Math.PI / 180, B = this.BAND;
    const side = () => B * (0.3 + rnd() * 0.7);
    const pts = [{ x: 0, y: (rnd() < 0.5 ? -1 : 1) * side() }];
    let h = null;                                   // heading of the last run
    while (pts[pts.length - 1].x < W) {
      const { x, y } = pts[pts.length - 1];
      let L = 80, y2 = y > 0 ? -B : B;              // (never needed in testing)
      for (let t = 0; t < 40; t++) {
        const l = 80 + rnd() * 120, e = (y > 0 ? -1 : 1) * side();
        const turn = h === null ? 5 * deg : Math.abs(Math.atan2(e - y, l) - h);
        if (turn >= 4 * deg && turn <= 10 * deg) { L = l; y2 = e; break; }
      }
      const run = Math.min(L, W - x);               // the last run stops at the edge
      h = Math.atan2(y2 - y, L);
      pts.push({ x: x + run, y: y + (y2 - y) * run / L });
    }
    return pts;
  },

  /* A branch off a kink 20–80% of the way across: 40–120 px long, leaving
     25–55° below the line in the direction the crack runs, with a small
     kink of its own. It's shortened, keeping its angles, so it ends no more
     than maxDrop px below the centre line. Null if no kink is in range, or
     if that would leave it shorter than 40 px. */
  branchLine(main, W, rnd, maxDrop = Infinity) {
    const deg = Math.PI / 180;
    const roots = [];
    for (let i = 1; i < main.length - 1; i++) {
      if (main[i].x >= 0.2 * W && main[i].x <= 0.8 * W) roots.push(i);
    }
    if (!roots.length) return null;
    const root = roots[Math.floor(rnd() * roots.length)];
    let len = 40 + rnd() * 80;
    const a1 = (25 + rnd() * 30) * deg;
    const a2 = a1 + (rnd() < 0.5 ? -1 : 1) * (4 + rnd() * 6) * deg;
    const f = 0.4 + rnd() * 0.2;                    // where it kinks, as a share of its length
    const p0 = main[root];
    len = Math.min(len, (maxDrop - p0.y) / (f * Math.sin(a1) + (1 - f) * Math.sin(a2)));
    if (len < 40) return null;
    const p1 = { x: p0.x + f * len * Math.cos(a1), y: p0.y + f * len * Math.sin(a1) };
    const p2 = { x: p1.x + (1 - f) * len * Math.cos(a2), y: p1.y + (1 - f) * len * Math.sin(a2) };
    return { pts: [p0, p1, p2], root };
  },

  length(pts) {
    let s = 0;
    for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    return s;
  },

  /* The front gets up to speed at a steady rate over the first ACCEL of
     the run, then holds its top speed, as the hero's cracks do. Returns
     the share of the run at which it has covered share f of the line. */
  frontAt(f) {
    const a = this.ACCEL;
    return f <= a / (2 - a) ? Math.sqrt(f * a * (2 - a)) : (f * (2 - a) + a) / 2;
  },

  /* Runs a seam once: the front crosses in RUN s with a bright tip riding
     it, and the line behind settles to rest over SETTLE s. A branch starts
     as the front passes its root. In LITE it goes straight to rest. */
  run(seam) {
    if (!seam) return;
    seam.svg.classList.remove('is-armed');
    if (document.body.classList.contains('low-perf')) return;
    const [main, branch] = seam.lines;
    const a = this.ACCEL;
    // Speeding up, the share drawn is (share of run / a)² × a / (2 − a):
    // exactly this bezier over the first keyframe. Then top speed, linear.
    this.draw(main, 0, this.RUN, [
      { at: 0, f: 0, easing: 'cubic-bezier(0.333, 0, 0.667, 0.333)' },
      { at: a, f: a / (2 - a) },
      { at: 1, f: 1 },
    ]);
    if (branch) {
      const top = main.len / (this.RUN * (1 - a / 2));        // px/s
      this.draw(branch, this.frontAt(branch.rootAt) * this.RUN, branch.len / (this.BRANCH_PACE * top), [
        { at: 0, f: 0 },
        { at: 1, f: 1 },
      ]);
    }
  },

  /* One line's run, starting `delay` s in and lasting `dur` s. `curve`
     gives the share of the line drawn (f) at shares of the run (at). Every
     animation has backwards fill only, so when they're done the line is
     back to its styles at rest and nothing is left running. */
  draw(line, delay, dur, curve) {
    const L = line.len, T = this.TIP, ms = (s) => s * 1000;
    const frames = (value) => curve.map((k) => ({ offset: k.at, easing: k.easing || 'linear', ...value(k.f) }));
    const timing = { delay: ms(delay), duration: ms(dur), fill: 'backwards' };
    // Drawn up to the front
    line.rest.animate(frames((f) => ({ strokeDasharray: `${L} ${L}`, strokeDashoffset: `${L * (1 - f)}` })), timing);
    // The tip ends at the front
    line.tip.animate(frames((f) => ({ strokeDashoffset: `${T - L * f}` })), timing);
    // Lit as it's drawn, then settling to rest
    const rest = getComputedStyle(line.rest).opacity;
    const ease = getComputedStyle(document.documentElement).getPropertyValue('--ease').trim() || 'ease-out';
    line.rest.animate([{ opacity: 1 }, { opacity: rest }],
      { delay: ms(delay), duration: ms(dur + this.SETTLE), easing: ease, fill: 'backwards' });
    // The tip goes out once the front is home
    line.tip.animate([{ opacity: 1 }, { opacity: 1, offset: dur / (dur + this.FADE) }, { opacity: 0 }],
      { delay: ms(delay), duration: ms(dur + this.FADE), fill: 'backwards' });
  },
};

```

`boot()` runs it after the reveals:

<!-- T5 insert: js/main.js | before:   // Page idle — dynamic title and favicon on blur -->
```js
  // Seams: cracks of light between the sections, run once as they come in
  seams.init();

```

The tunables:

<!-- T5 insert: css/styles.css | before:   /* One easing curve for every non-hero transition. */ -->
```css
  --seam-rest:     .26;           /* seams at rest, × the lit alphas below */
  --seam-core:     .5;            /* lit core; × .26 ≈ .13, the --bd-2 rung */
  --seam-fringe:   .6;            /* lit fringes; × .26 ≈ .16 */
  --seam-tip:      .95;           /* the running front's core */
  --seam-tip-fringe: .6;          /* and its fringes */

```

The rules replace the hairline block:

<!-- T5 splice: css/styles.css | from: /* Hairline seam between panels | to: /* Buttons */ -->
```css
/* ── Seams between the panels ──
   Each panel starts with a hairline. js/main.js `seams` replaces it with a
   crack (svg.seam), and the crack is the panel's top edge: a cover in the
   colour of the panel above (--seam-above) fills the gap from the straight
   edge down to the crack, so the two panels meet along the zigzag. .has-seam,
   set once the SVG is in, paints the section's 1 px top border that colour
   too, since the SVG can't reach it (sections clip to their padding box).
   Without the script the hairline stays. The footer keeps its hairline.
   The crack itself is light: a 1 px warm-white core with red 1 px above and
   blue 1 px below. At rest it sits at --seam-rest of its lit strength, about
   as quiet as the hairline. While it runs, a short bright tip rides the front
   and the line behind it settles to rest. The animation is in main.js. */
#about,
#skills,
#projects,
#contact {
  border-top: 1px solid var(--bd-1);
}
/* The panel above each one: the panels alternate */
#about    { --seam-above: var(--clr-bg); }        /* the hero */
#skills   { --seam-above: var(--clr-surface); }   /* About */
#projects { --seam-above: var(--clr-bg); }        /* Skills */
#contact  { --seam-above: var(--clr-surface); }   /* Projects */
/* IDs again: `section.has-seam` alone would lose to the IDs above */
#about.has-seam,
#skills.has-seam,
#projects.has-seam,
#contact.has-seam { border-top-color: var(--seam-above); }

.seam {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;                 /* over the dot matrix, under the content */
  display: block;
  pointer-events: none;
  fill: none;
  stroke-width: 1px;
  stroke-linejoin: round;
}
.seam-cover { fill: var(--seam-above); }
.seam-rest { opacity: var(--seam-rest); }
.seam-tip  { opacity: 0; }
.seam-core { stroke: rgb(var(--glint) / var(--seam-core)); }
.seam-fr   { stroke: rgb(var(--fringe-r) / var(--seam-fringe)); }
.seam-fb   { stroke: rgb(var(--fringe-b) / var(--seam-fringe)); }
.seam-tip .seam-core { stroke: rgb(var(--glint) / var(--seam-tip)); stroke-width: 1.25px; }
.seam-tip .seam-fr   { stroke: rgb(var(--fringe-r) / var(--seam-tip-fringe)); }
.seam-tip .seam-fb   { stroke: rgb(var(--fringe-b) / var(--seam-tip-fringe)); }

/* Waiting to run, it isn't drawn yet. LITE shows it at rest instead. */
.seam.is-armed .seam-rest { visibility: hidden; }
body.low-perf .seam.is-armed .seam-rest { visibility: visible; }

```

- [ ] **Step 4: Run the test to see it pass**

Run: `node --check js/main.js && node "$SP/tests/seams.test.js"`
Expected: `seams: all checks passed (23806 joints, 4000 branches, 728 shortened)`.

- [ ] **Step 5: Check the page**

```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --evalfile "$SP/checks/scroll.js"
```
```bash
node "$SP/page-check.mjs" --w 375 --h 812 --mobile --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --evalfile "$SP/checks/scroll.js"
```
```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 8000 --evalfile "$SP/checks/stillness.js"
```

Expected: `"exceptions": []`. `scroll.js` passes at both sizes: `{"reveals":37,"notIn":0,"hidden":0,"seams":4,"armed":0,"sectionsWithSeam":4,"edgeGaps":0,"triggers":0,"stillRunning":0,"pass":true}`. `stillness.js` still passes, so the ResizeObserver's first callback doesn't rebuild anything.

Then look at one seam at rest and one mid-run:

```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1000 --eval "scrollTo({ top: document.getElementById('about').offsetTop - innerHeight * 0.5, behavior: 'instant' })" --sleep 2500 --shot "$SP/shots/t5-about-rest.png" --eval "(async () => { const s = document.getElementById('skills'); scrollTo({ top: s.offsetTop - innerHeight * 0.6, behavior: 'instant' }); const svg = s.querySelector('svg.seam'); for (let i = 0; i < 150 && !svg.getAnimations({ subtree: true }).length; i++) await new Promise(r => setTimeout(r, 20)); const a = svg.getAnimations({ subtree: true }); a.forEach(x => { x.pause(); x.currentTime = 300; }); return a.length; })()" --shot "$SP/shots/t5-skills-run.png"
```

Expected: the second eval returns `4` (the skills seam has no branch: two animations each on its rest group and its tip). Open both PNGs with the Read tool. At rest: the section's top edge is the crack. The hero's black comes down to a thin, faintly red-over-white-over-blue kinked line, no brighter than the old hairline, and About's grey starts below it. No straight edge, and no strip of grey, shows above the line. Mid-run: Skills runs right to left, so a bright tip is about 45% of the way in from the right, with the lit line behind it (to its right) and nothing ahead. The "Low Performance Mode" tooltip at the top right is the LITE button's own first-visit hint (2.2–5.7 s after load), not part of this work.

---

### Task 6: The card glint

On hover (pointer devices only) and on `:focus-visible`, one sweep of the hero's streak pair crosses a project card once in 0.7 s: a broad soft band and a thin bright line beside it, at the hero's −30° sweep. A split-light fringe also sits outside the border: red on the top and left, blue on the bottom and right. Keyboard focus adds a 1 px `--glint` outline at a 3 px offset. The lift, ladder step and thumbnail saturation stay. Reduced motion and LITE keep the fringe but not the sweep.

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Apply the blocks**

Run: `node "$SP/apply-plan.js" docs/superpowers/plans/2026-09-26-page-glass.md T6`
Expected: `2 block(s) applied`.

<!-- T6 insert: css/styles.css | before:   /* One easing curve for every non-hero transition. */ -->
```css
  --glint-t:       0.7s;          /* card glint: one sweep */
  --glint-band:    .08;           /* its broad soft band */
  --glint-line:    .16;           /* its thin bright line */
  --card-fringe:   .35;           /* the split-light fringe round a lit card */

```

<!-- T6 splice: css/styles.css | from: .project-card { | to: .project-thumb { -->
```css
.project-card {
  background: var(--sf-2);
  border: 1px solid var(--bd-2);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform var(--t-mid), border-color var(--t-mid), background var(--t-mid), box-shadow var(--t-mid);
  position: relative;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--bd-3);
  background: var(--sf-3);
}

/* ── Glint ──
   The card is the page's one clickable surface in a grid, so on hover and
   keyboard focus it catches the light the way the hero's shards do. One sweep
   of the hero's streak pair (a broad soft band and a thin bright line, at
   its -30° sweep) crosses it once, and a split-light fringe sits outside the
   border: red on the top and left, blue on the bottom and right. The sweep
   moves by transform only, at a steady rate as the hero's streaks do (so it
   is mid-card halfway through), and never plays backwards: leaving the card
   drops it. Touch screens get none of this, since a tap would leave it stuck
   on. */
.project-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(120deg,
    transparent 30%,
    rgb(var(--glint) / var(--glint-band)) 42%,
    transparent 54%,
    transparent calc(58% - 2px),
    rgb(var(--glint) / var(--glint-line)) 58%,
    transparent calc(58% + 2px));
  transform: translateX(-100%);   /* parked off the card's left edge */
}
@keyframes glint-sweep {
  to { transform: translateX(100%); }
}
@media (hover: hover) {
  .project-card:hover {
    box-shadow: -1px -1px 0 rgb(var(--fringe-r) / var(--card-fringe)),
                1px 1px 0 rgb(var(--fringe-b) / var(--card-fringe));
  }
  .project-card:hover::after { animation: glint-sweep var(--glint-t) linear; }
}
.project-card:focus-visible {
  outline: 1px solid rgb(var(--glint));
  outline-offset: 3px;
  box-shadow: -1px -1px 0 rgb(var(--fringe-r) / var(--card-fringe)),
              1px 1px 0 rgb(var(--fringe-b) / var(--card-fringe));
}
.project-card:focus-visible::after { animation: glint-sweep var(--glint-t) linear; }

/* Reduced motion and LITE: the fringe only */
@media (prefers-reduced-motion: reduce) {
  .project-card::after { display: none; }
}
body.low-perf .project-card::after { display: none; }

```

- [ ] **Step 2: Hover: one sweep plus the fringe, and neither left behind**

```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1000 --eval "document.querySelector('#projects-grid .project-card').scrollIntoView({ block: 'center', behavior: 'instant' })" --sleep 1500 --hover "#projects-grid .project-card" --sleep 400 --eval "(() => { const c = document.querySelector('#projects-grid .project-card'); const a = c.getAnimations({ subtree: true }).find(x => x.animationName === 'glint-sweep'); if (a) { a.pause(); a.currentTime = 350; } return JSON.stringify({ sweep: !!a, shadow: getComputedStyle(c).boxShadow }); })()" --shot "$SP/shots/t6-glint.png" --eval "document.querySelector('#projects-grid .project-card').getAnimations({ subtree: true }).forEach(a => a.play())" --sleep 800 --eval "document.querySelector('#projects-grid .project-card').getAnimations({ subtree: true }).length" --hover ".nav-logo" --sleep 400 --eval "getComputedStyle(document.querySelector('#projects-grid .project-card')).boxShadow"
```

Expected: `{"sweep":true,"shadow":"rgba(255, 64, 48, 0.35) -1px -1px 0px 0px, rgba(48, 128, 255, 0.35) 1px 1px 0px 0px"}`. Then `0`, since the sweep ran once and stopped. Then `none` once the pointer has left. `t6-glint.png` shows the first card lifted, with a faint diagonal band and a thin line crossing it and a red/blue edge round it.

- [ ] **Step 3: Keyboard focus**

```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1000 --tab "#projects-grid .project-card" --sleep 900 --evalfile "$SP/checks/focus.js" --shot "$SP/shots/t6-focus.png" --key Enter --sleep 400 --eval "document.getElementById('project-modal').classList.contains('open')"
```

Expected: `--tab` reports `focused after 19 tabs` (the nav, the hero buttons, then the search box and the filter and sort buttons). `focus.js` passes: `{"card":true,"focusVisible":true,"outline":"solid 1px rgb(255, 250, 242)","offset":"3px","shadow":"rgba(255, 64, 48, 0.35) -1px -1px 0px 0px, rgba(48, 128, 255, 0.35) 1px 1px 0px 0px","pass":true}`. The modal check returns `true`.

---

### Task 7: The hero copy without JavaScript, and the README

**Files:**
- Modify: `index.html`, `README.md`

- [ ] **Step 1: Apply the blocks**

Run: `node "$SP/apply-plan.js" docs/superpowers/plans/2026-09-26-page-glass.md T7`
Expected: `2 block(s) applied`.

The hero copy starts at `opacity: 0` for its timeline. Without JavaScript nothing would ever show it. The `html` prefix outranks the stylesheet's own rules, so the order doesn't matter.

<!-- T7 insert: index.html | before: </head> -->
```html
  <!-- Without JavaScript, show the hero copy the script would fade in -->
  <noscript>
    <style>
      html .hero-eyebrow, html .hero-name, html .hero-tagline, html .hero-cta { opacity: 1; }
    </style>
  </noscript>
```

<!-- T7 insert: README.md | before: - GSAP-powered scroll animations and section reveals -->
```markdown
- Glass accents below the hero: cracks of light between the sections, titles that focus in through split light, and a glint across project cards
```

- [ ] **Step 2: Check it without scripts**

Run: `node "$SP/page-check.mjs" --nojs --url "$URL" --sleep 1500 --evalfile "$SP/checks/nojs.js" --shot "$SP/shots/t7-nojs.png"`
Expected: `nojs.js` passes: `"seamSvgs":0`, four `rgba(255, 255, 255, 0.07)` hairlines, `"heroCopyVisible":true`, `"revealTargets":8`, `"revealTargetsVisible":true`. The screenshot shows the hero name and tagline over black.

---

### Task 8: Verify against spec §11

Run everything at 1280×720. Where a step says so, also run it at 375×812 with `--w 375 --h 812 --mobile`. `$URL` is `http://localhost:8901/`. For every run, `"exceptions"` must be `[]` and `"console"` must contain only the pre-existing noise noted in Task 0 (the `tempo-1.svg`/`deflect-1.svg` 404s and the `cloudflareinsights` error).

- [ ] **Step 1: Console, clean at load and through a full scroll (both sizes)**

Run: `node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --evalfile "$SP/checks/scroll.js"`
Expected: `"pass":true`. Repeat at 375×812.

- [ ] **Step 2: No leak**

Run: `node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --evalfile "$SP/checks/leak.js"`
Expected: `{"atLoad":41,"before":6,"after":6,"cardAnimationsWhileTyping":0,"cards":18,"cardsHidden":0,"pass":true}`. That's Task 4's numbers plus the seams: 4 more triggers at load, and Contact's seam still waiting with the five Contact reveals.

- [ ] **Step 3: Stillness**

Run: `node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 8000 --evalfile "$SP/checks/stillness.js"`
Expected: `"lite":false,"mutations":0,"pass":true`.

- [ ] **Step 4: Text**

Run: `node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --evalfile "$SP/checks/text.js"`
Expected: `"changes":0,"pass":true`.

- [ ] **Step 5: Look**

At 1280×720 and again at 375×812, capture each seam at rest, then the skills seam mid-run, the Projects title mid focus-in, and a card mid-glint (the last only at 1280×720, since touch has no hover):

```bash
for S in about skills projects contact; do node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1000 --eval "scrollTo({ top: document.getElementById('$S').offsetTop - innerHeight * 0.4, behavior: 'instant' })" --sleep 2500 --shot "$SP/shots/rest-$S-1280.png" | grep -E '"exceptions"|harnessError'; done
```
```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1000 --eval "(async () => { const s = document.getElementById('skills'); scrollTo({ top: s.offsetTop - innerHeight * 0.6, behavior: 'instant' }); const svg = s.querySelector('svg.seam'); for (let i = 0; i < 150 && !svg.getAnimations({ subtree: true }).length; i++) await new Promise(r => setTimeout(r, 20)); const a = svg.getAnimations({ subtree: true }); a.forEach(x => { x.pause(); x.currentTime = 300; }); return a.length; })()" --shot "$SP/shots/run-skills-1280.png"
```
```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1000 --eval "(async () => { const h = document.querySelector('#projects .section-header'); scrollTo({ top: h.getBoundingClientRect().top + scrollY - innerHeight * 0.6, behavior: 'instant' }); const t = h.querySelector('.section-title'); for (let i = 0; i < 150 && !t.getAnimations().length; i++) await new Promise(r => setTimeout(r, 20)); const a = t.getAnimations(); a.forEach(x => { x.pause(); x.currentTime = x.effect.getTiming().delay + 200; }); h.getAnimations().forEach(x => { x.pause(); x.currentTime = x.effect.getTiming().delay + 400; }); return a.map(x => x.animationName).join() + ' i=' + h.style.getPropertyValue('--i'); })()" --shot "$SP/shots/focus-projects-1280.png"
```
```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1000 --eval "document.querySelector('#projects-grid .project-card').scrollIntoView({ block: 'center', behavior: 'instant' })" --sleep 1500 --hover "#projects-grid .project-card" --sleep 400 --eval "document.querySelector('#projects-grid .project-card').getAnimations({ subtree: true }).forEach(a => { a.pause(); a.currentTime = 350; })" --shot "$SP/shots/glint-1280.png"
```

Repeat the first three commands with `--w 375 --h 812 --mobile` and `-375` in the file names. The mid-run command returns `4` at both sizes. The focus-in command returns `focus-in i=5`: at this scroll position the last row of skill cards is still on screen, so the header is sixth in line, and the pause is measured from its delay. Open every PNG with the Read tool. The "Low Performance Mode" tooltip at the top right of some shots is the LITE button's own first-visit hint. Expected:
- **At rest:** each seam is a thin kinked line at its section's top edge, as quiet as a hairline. Red is on top and blue below, and the white core is no brighter than a card border. Branches drop into About, Projects and Contact. Each crack is the edge between its panels: the colour of the panel above reaches all the way down to the line (the hero's black over About, About's grey over Skills), and no straight edge shows.
- **Mid-run:** a bright tip partway across, the lit line behind it, nothing ahead. Skills runs right to left, so its tip comes from the right.
- **Mid focus-in:** "Projects" shows a red copy offset left and a blue copy offset right, already mostly opaque.
- **Mid-glint:** a faint broad diagonal band and a thin bright line crossing the lifted card, with a red/blue fringe round its edge.
- **Everywhere:** no colour except those fringes and glints. On phones the seams keep their shallow kinks rather than looking squashed.

- [ ] **Step 6: Reduced motion and LITE**

```bash
node "$SP/page-check.mjs" --reduced --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --evalfile "$SP/checks/modes.js"
```
```bash
node "$SP/page-check.mjs" --url "$URL" --wait "window.__bootAt > 0" --sleep 1500 --eval "window.__lite = true" --evalfile "$SP/checks/modes.js"
```

Expected: both give `"pass":true`: no `reveal-up`, `focus-in` or `glint-sweep` in `animationsStarted`, `"seamAnimations":0`, `"hidden":0`, and every seam at rest (`"seamsAtRest":"7/7"`, which counts 4 main lines and 3 branches). The LITE run then switches LITE off and gives `"afterLiteOff":{"started":["navSunSpin"],"hidden":0}`: the nav sun spins again, and nothing that LITE showed in place plays again.

- [ ] **Step 7: Keyboard**

Run the command from Task 6 Step 3.
Expected: the same results. The `--tab` count shows Tab reaches the first card after the search box and the filter and sort buttons.

- [ ] **Step 8: Touch**

```bash
node "$SP/page-check.mjs" --w 375 --h 812 --mobile --url "$URL" --wait "window.__bootAt > 0" --sleep 1000 --eval "document.querySelector('#projects-grid .project-card').scrollIntoView({ block: 'center', behavior: 'instant' })" --sleep 1500 --tap "#projects-grid .project-card" --sleep 500 --eval "document.getElementById('project-modal').classList.contains('open')" --eval "document.getElementById('modal-close').click()" --sleep 500 --eval "(() => { const c = document.querySelector('#projects-grid .project-card'); return JSON.stringify({ hoverMedia: matchMedia('(hover: hover)').matches, shadow: getComputedStyle(c).boxShadow, sweeps: c.getAnimations({ subtree: true }).length }); })()"
```

Expected: `true` (the tap opened the modal), then `{"hoverMedia":false,"shadow":"none","sweeps":0}`.

- [ ] **Step 9: No script**

Run the command from Task 7 Step 2.
Expected: `"pass":true`.

- [ ] **Step 10: Size**

Run: `git diff --numstat -- js/main.js css/styles.css index.html README.md`
Expected, as measured in a dry run (added, then deleted): `1 0 README.md`, `199 312 css/styles.css`, `16 17 index.html`, `303 861 js/main.js`. Spec §9 estimated +120/−700 for `main.js` and +100/−300 for `styles.css`. The removals match; the additions run over because the seam geometry, the fallbacks and the comments need more room than the estimate allowed.

---

### Task 9: Tune by eye, and write down what changed

- [ ] **Step 1:** Look at the page in the browser pane (`preview_start` `static-site-2`) at desktop and phone sizes. Tune the `:root` accent values (`--seam-*`, `--focus-*`, `--glint-*`, `--card-fringe`, `--reveal-*`) and the `seams` constants (`RUN`, `TIP`, `SETTLE`, `Y0`) until the seams read as cracks but stay as quiet as hairlines at rest, and the split is visible without looking like a glitch. Keep within spec §4: fringes at rest ≤ alpha .35, core at rest ≤ `--bd-2`. One thing to watch: `--ease` applies to each keyframe interval of `focus-in` separately. So the split eases into its 40% value, holds near half for about 150 ms, then closes most of the rest in about 180 ms. If that reads as a hitch, give the 40% keyframe `animation-timing-function: linear`. The split then closes steadily, and the rise and the fade don't change. Don't put it on the 0% keyframe: `transform` has no 40% stop, so the whole rise and the fade would turn linear too.
- [ ] **Step 2:** After any change, re-run Task 8 Steps 1–6 and `node "$SP/tests/seams.test.js"`.
- [ ] **Step 3:** Record any numbers changed by tuning in the spec (§4–§5), and add an "Execution notes" section at the end of this plan for anything that differs from the code above (as the hero plan did).
- [ ] **Step 4:** Ask the user whether to commit. Don't commit unasked.
