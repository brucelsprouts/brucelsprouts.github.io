# Portfolio UX Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 6 UX improvements to the portfolio: minigame tooltip, shorter loader, card keyboard nav, URL deep linking, project result count, and clickable stack tags.

**Architecture:** All changes live in `js/main.js` and `css/styles.css` (with one small HTML addition for the result count element). No new files. Each feature is self-contained and touches isolated sections of code.

**Tech Stack:** Vanilla JS, CSS custom properties, GSAP (already loaded), no new dependencies.

---

## File Map

- **Modify:** `js/main.js`
  - `loader.animateProgress()` — reduce duration (Task 1)
  - `projects.buildCard()` — add tabindex + keydown handler + clickable stack tags (Tasks 3, 6)
  - `projects.renderAll()` — update result count display (Task 4)
  - `projects.filter()` — call hash updater (Task 5)
  - `projectModal.open()` — set URL hash (Task 5)
  - `projectModal.close()` — clear URL hash (Task 5)
  - init block at bottom — read hash on load (Task 5)
- **Modify:** `css/styles.css`
  - Add `.naq-tooltip` styles (Task 2)
  - Add `.project-result-count` styles (Task 4)
  - Add `.stack-tag--clickable` hover styles (Task 6)
- **Modify:** `index.html`
  - Add tooltip span inside `#node-acq-trigger` (Task 2)
  - Add `<span id="project-result-count">` to `.projects-controls` (Task 4)

---

## Task 1 — Shorten the loader

**Files:**
- Modify: `js/main.js` — `loader.animateProgress()` at line ~692

- [ ] **Step 1: Change the loader duration from 2800ms to 1600ms**

In `loader.animateProgress()`, change:
```js
const duration = 2800; // ms — feel of a real boot
```
to:
```js
const duration = 1600; // ms — snappy boot feel
```

- [ ] **Step 2: Verify visually** — open the site in browser, confirm loader exits faster without breaking the exit animation sequence.

---

## Task 2 — Minigame tooltip

The `#node-acq-trigger` button sits in the hero bottom-left. It already has `⌖ NODE ACQ` text. We add a CSS tooltip above it — same pattern as `.skill-tooltip` in the existing CSS.

**Files:**
- Modify: `index.html` — inside `#node-acq-trigger`, after the existing spans
- Modify: `css/styles.css` — add tooltip styles after `#node-acq-trigger:hover` block (~line 823)

- [ ] **Step 1: Add tooltip span to the button in index.html**

Find:
```html
<button id="node-acq-trigger" aria-label="Launch NODE ACQUIRE minigame">
  <span class="trigger-icon">⌖</span>
  <span class="trigger-label">NODE&nbsp;ACQ</span>
</button>
```
Replace with:
```html
<button id="node-acq-trigger" aria-label="Launch NODE ACQUIRE minigame">
  <span class="trigger-icon">⌖</span>
  <span class="trigger-label">NODE&nbsp;ACQ</span>
  <span class="naq-tooltip">Hidden minigame — click to play</span>
</button>
```

- [ ] **Step 2: Add tooltip CSS after the `#node-acq-trigger:hover` block**

```css
/* NODE ACQUIRE trigger tooltip */
.naq-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: rgba(10,10,10,0.92);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.6);
  font-family: var(--ff-mono);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  white-space: nowrap;
  padding: 5px 10px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 10;
}
#node-acq-trigger:hover .naq-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
```

- [ ] **Step 3: Verify** — hover the NODE ACQ button in browser, tooltip appears above it.

---

## Task 3 — Project result count

Show "X / N projects" in the controls bar, updated on every filter/search render.

**Files:**
- Modify: `index.html` — add span after `.sort-btns` closing div inside `.projects-controls`
- Modify: `css/styles.css` — add count styles
- Modify: `js/main.js` — update count in `renderAll()`

- [ ] **Step 1: Add the count element to index.html**

Find (after the sort-btns div):
```html
          </div>
        </div>

        <div id="projects-grid"
```
Replace the closing `</div>` of `.projects-controls` with:
```html
          </div>
          <span id="project-result-count" class="project-result-count monospace"></span>
        </div>

        <div id="projects-grid"
```

- [ ] **Step 2: Add CSS for the count**

Add after the `.controls-divider` block in styles.css:
```css
.project-result-count {
  font-size: 0.62rem;
  color: var(--c-text-muted, rgba(255,255,255,0.25));
  letter-spacing: 0.06em;
  margin-left: auto;
  white-space: nowrap;
}
```

- [ ] **Step 3: Update `renderAll()` in main.js to write the count**

Find the start of `renderAll(list)` — after `if (!grid) return;`, add:

```js
// Update result count
const countEl = document.getElementById('project-result-count');
if (countEl) {
  const total = this.all.length;
  countEl.textContent = list.length === total
    ? `${total} projects`
    : `${list.length} / ${total}`;
}
```

- [ ] **Step 4: Verify** — filter by "Blender", count updates to e.g. "4 / 10". Clear filter, shows "10 projects".

---

## Task 4 — Card keyboard navigation

Cards should be Tab-focusable and open the modal on Enter or Space.

**Files:**
- Modify: `js/main.js` — `projects.buildCard()`

- [ ] **Step 1: Add tabindex and role to the card element**

In `buildCard()`, after `card.className = 'project-card';` add:
```js
card.setAttribute('tabindex', '0');
card.setAttribute('role', 'button');
card.setAttribute('aria-label', `View ${project.title} project details`);
```

- [ ] **Step 2: Add keydown listener on the card**

After the existing `card.addEventListener('click', ...)` block, add:
```js
card.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    projectModal.open(project);
  }
});
```

- [ ] **Step 3: Verify** — Tab to a project card, press Enter → modal opens. Press Space → modal opens.

---

## Task 5 — URL deep linking

- On modal open: set `location.hash` to `#project-<slug>` where slug is the title lowercased with spaces replaced by hyphens.
- On modal close: clear the hash.
- On page load: if hash matches a project slug, open that project's modal.

**Files:**
- Modify: `js/main.js` — `projectModal.open()`, `projectModal.close()`, init block at bottom

- [ ] **Step 1: Add a slug helper near the top of `projectModal` or as a standalone util**

After the existing `formatProjectDate` utility function (search for `function formatProjectDate`), add:
```js
function projectSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
```

- [ ] **Step 2: Set hash when modal opens**

In `projectModal.open(project)`, after `document.body.style.overflow = 'hidden';` add:
```js
history.replaceState(null, '', `#project-${projectSlug(project.title)}`);
```

- [ ] **Step 3: Clear hash when modal closes**

In `projectModal.close()`, after `document.body.style.overflow = '';` add:
```js
history.replaceState(null, '', location.pathname + location.search);
```

- [ ] **Step 4: Read hash on page load**

In the main init block at the bottom (after `projects.init()` and `projectModal.init()` calls), add:
```js
// Deep-link: open project modal from URL hash on load
(function checkDeepLink() {
  const hash = location.hash; // e.g. "#project-clipstack"
  if (!hash.startsWith('#project-')) return;
  const slug = hash.slice('#project-'.length);
  const match = DATA.projects.find(p => projectSlug(p.title) === slug);
  if (match) projectModal.open(match);
})();
```

- [ ] **Step 5: Verify** — open modal for ClipStack, URL becomes `#project-clipstack`. Copy URL, reload page → ClipStack modal opens automatically. Close modal → hash clears.

---

## Task 6 — Clickable stack tags

Clicking a stack tag (on a card or in the modal) sets it as the search query and scrolls to the projects section.

**Files:**
- Modify: `js/main.js` — `projects.buildCard()` stackHtml, `projectModal.open()` modal-stack innerHTML
- Modify: `css/styles.css` — add clickable tag hover style

- [ ] **Step 1: Extract a shared `setTagSearch(tag)` helper on the `projects` object**

Add as a method on the `projects` object (after `bindSearch()`):
```js
setTagSearch(tag) {
  const input = document.getElementById('project-search');
  if (!input) return;
  // Reset category filter to 'all'
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
  this.currentFilter = 'all';
  // Set search
  input.value = tag;
  this.searchQuery = tag;
  this.filter();
  // Scroll to projects section
  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
},
```

- [ ] **Step 2: Make card stack tags clickable**

In `buildCard()`, change:
```js
const stackHtml = project.stack
  .map(s => `<span class="stack-tag">${s}</span>`)
  .join('');
```
to:
```js
const stackHtml = project.stack
  .map(s => `<span class="stack-tag stack-tag--clickable" role="button" tabindex="0" data-tag="${s}">${s}</span>`)
  .join('');
```

Then after `card.innerHTML = ...` and before the click listener, add:
```js
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
```

- [ ] **Step 3: Make modal stack tags clickable**

In `projectModal.open()`, change:
```js
document.getElementById('modal-stack').innerHTML =
  project.stack.map(s => `<span class="stack-tag">${s}</span>`).join('');
```
to:
```js
document.getElementById('modal-stack').innerHTML =
  project.stack.map(s => `<span class="stack-tag stack-tag--clickable" role="button" tabindex="0" data-tag="${s}">${s}</span>`).join('');
document.getElementById('modal-stack').querySelectorAll('.stack-tag--clickable').forEach(tag => {
  tag.addEventListener('click', () => {
    projectModal.close();
    projects.setTagSearch(tag.dataset.tag);
  });
});
```

- [ ] **Step 4: Add hover CSS for clickable tags**

After the existing `.stack-tag` styles in `styles.css`, add:
```css
.stack-tag--clickable {
  cursor: pointer;
}
.stack-tag--clickable:hover {
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.9);
  border-color: rgba(255,255,255,0.3);
}
.stack-tag--clickable:focus-visible {
  outline: 1px solid rgba(255,255,255,0.4);
  outline-offset: 2px;
}
```

- [ ] **Step 5: Verify** — click "Tauri" tag on ClipStack card → search fills with "Tauri", only ClipStack and XPWaste show. Click a modal tag → modal closes, search applies.

---

## Self-Review

**Spec coverage:**
- Minigame tooltip ✓ Task 2
- Shorter loader ✓ Task 1
- Card keyboard nav ✓ Task 3
- URL deep linking ✓ Task 5
- Project result count ✓ Task 3 (renumbered above as Task 3)
- Clickable stack tags ✓ Task 6

**Placeholder scan:** No TBDs, all code is complete.

**Type consistency:** `projectSlug()` defined in Task 5 Step 1, used in Steps 2, 3, 4 — consistent. `projects.setTagSearch()` defined in Task 6 Step 1, called in Steps 2 and 3 — consistent.
