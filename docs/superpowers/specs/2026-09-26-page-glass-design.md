# Page "Glass" — Design Spec

**Date:** 2026-09-26
**Builds on:** the hero Fracture work on `hero-fracture`
(`docs/superpowers/specs/2026-09-25-hero-fracture-design.md`). This touches the
same `index.html`, `css/styles.css` and `js/main.js`, so it starts once that
work is committed.
**Status:** Decisions made in brainstorming (§3). Awaiting review.

## 1. Goal

Make the page below the hero speak the hero's language (glass, cracks and split
light) instead of a hacker terminal's. Do it mostly by removing things: the
ASCII scrambles, glitches and HUD chatter go, and three small glass accents
take the place of the few moments that earned one.

Priority, per the user: **practical to use** first. The page stays simple, calm
and fast. The hero stays the only showpiece.

Done means:
- No text on the page ever shows characters other than its own.
- Outside the hero, nothing moves unless you scroll something new into view,
  hover it or focus it. The nav logo's slow spin and the LITE button's
  one-time hint are the only exceptions.
- Colour appears only as light (§4). Otherwise the page is as monochrome as it
  is today.
- The accents are CSS plus two small modules in `main.js` (`reveal`, `seams`).
  No WebGL outside the hero, no new `backdrop-filter`, no `filter` animations.
- LITE mode and `prefers-reduced-motion` both get a still page, with every
  accent at rest.

## 2. Context

The hero draws cracks as light: a white-hot core whose red channel sits to one
side and blue to the other (`CRACK_FRAG` in `js/hero/shaders.js`), a bright
streak at the running front, and shards crossed by pairs of diagonal light
streaks (a broad one and a thin one, at `rifts.streakAngle`, −30°).

Below the hero, the base design is sound and stays: the surface/border ladder
(`--sf-1…3`, `--bd-1…3`), one easing curve (`--ease`), the dot-matrix motif,
hairline seams between sections, and the mono labels.

On top of that base, `js/main.js` runs a terminal/HUD layer:

| Module | What it does |
|---|---|
| `heroAnimations` | scrambles the hero name through random characters |
| `.glitch-text` (CSS) | slices and offsets the hero eyebrow and name every 4 s |
| `scrollAnimations` | scrambles section titles, skill names and (dead) timeline titles in; slides section tags in; draws a timeline line |
| `skills`, `projects` | flash each card with `filter: brightness(2)` on entry; projects also scramble their titles |
| `glitchEffects` | scanline flashes, VHS lines and pixel shifts on timers |
| `sideLabels` | vertical HUD labels that type themselves out and glitch on a loop |
| `sectionFlash` | an ASCII block flashes over each section on first entry |
| `scanSweep` | a light line sweeps down each section on first entry |
| `hackScroll` | `> ACCESS_GRANTED`-style phrases pop up while scrolling |
| `clickRipple` | a burst of ASCII characters on every click |
| `hoverGlitch` | scrambles skill names, project titles and nav links on hover |
| `cursor` | a dot plus a lagging ring with corner brackets, over `body { cursor: none }` |

Problems found along the way:
- `projects.renderAll` creates a ScrollTrigger per card on every filter, sort
  and search keystroke, and never kills the old ones. They pile up, and each
  re-render flashes and re-scrambles the cards while you type.
- The timeline code targets `#history` and `.timeline`, which no longer exist.
  (`gsap.from('.timeline::before')` could never have worked: GSAP can't tween a
  pseudo-element.)
- `body { cursor: none }` hides the system cursor, but `cursor: pointer` on
  links, buttons and cards brings it back, so those show two cursors at once.
- The cursor's `requestAnimationFrame` loop runs every frame, even in LITE.

## 3. Decisions (from brainstorming)

| Topic | Decision |
|---|---|
| Direction | **Subtract + glass accents.** Not "subtract only" (the page would stop echoing the hero). Not "full glass panels": backdrop blur is slow under software compositing (the hero spec measured this), and it's the least simple option. |
| Page load | No intro. The hero's ignition is the intro (hero spec §4.1, §5). |
| Custom cursor | **Removed.** The system cursor everywhere. The hero still reacts to the mouse. |
| Terminal copy | **Kept as text:** `// MODULE_0N`, `// EOF`, `// NAV`, `[00]`, form messages, the hero's LAT/LON and STATUS/BUILD corners. Only the animation goes. |
| Colour | Monochrome stays. Colour appears only as light: thin red/blue fringes and warm-white glints, taken from the hero's crack palette. |
| Tech | CSS, plus the already-loaded GSAP/ScrollTrigger to trigger reveals. No new libraries. |

## 4. Light and colour

Three tokens join `:root`. They're RGB triplets so each use sets its own alpha:

```css
--glint:    255 250 242;   /* the hero's crack core (colors.riftCore) */
--fringe-r: 255  64  48;   /* the red side of split light */
--fringe-b:  48 128 255;   /* the blue side */
```

Rules:
- Colour is light, never material. Fringes and glints only: no fills, text
  colours or backgrounds.
- Fringes are thin: 1 px on lines and borders, 0.04 em on text. At rest they
  are never brighter than alpha 0.35.
- The whole page has one light direction: red toward the top and left, blue
  toward the bottom and right.
- The existing ladder decides everything else. The accents sit on top of it
  and don't replace a rung.

The alphas and durations in this spec are starting points. They live in custom
properties and get tuned by eye in the browser.

## 5. The accents

### 5.1 Focus-in (replaces the text scrambles)

Where: the hero name (at load) and the four section titles (on first reveal).
Nothing else. Skill names, project titles and nav links stay plain.

The text arrives out of focus, split the way the hero's glass splits light: a
red copy offset to the left and a blue copy to the right. The copies close onto
crisp white as the text fades up.

- **From:** `opacity: 0`, `translateY(12px)`,
  `text-shadow: -0.04em 0 rgb(var(--fringe-r) / .6), 0.04em 0 rgb(var(--fringe-b) / .6)`
- **To:** opacity 1, no offset, no shadow.
- The fade finishes at 40% of the run and the split closes over the whole run,
  so the colour is actually seen.
- 0.6 s for titles. 0.9 s for the hero name, which replaces the scramble at
  0.5 s in the hero timeline. The eyebrow, tagline, CTA and HUD timings don't
  change.
- One `@keyframes focus-in`, started by the reveal class (§6) or, for the hero
  name, by the hero timeline.

### 5.2 Crack seams (replace the hairline seams and the scan sweep)

Where: the top edge of `#about`, `#skills`, `#projects` and `#contact`, where
the 1 px `border-top` is today. The footer keeps its plain hairline. The first
seam, just under the hero, reads as a crack that ran out of the hero into the
page.

Shape (each seam has its own fixed seed, so it looks the same on every visit):
- The main line spans the full width: straight runs of 80–200 px with kinks of
  4–10°, staying within ±5 px of the centre line.
- Two or three of the four seams get one branch: 40–120 px long, at 25–55°,
  pointing down into the section, from a kink 20–80% of the way across.
- It's built in CSS px from the section's width, so kinks keep their angles on
  phones. When the width changes, it's rebuilt with the same seed.

At rest: a 1 px warm-white core no brighter than `--bd-2`, with a red fringe
1 px above and a blue fringe 1 px below at about the same strength. It's about
as quiet as today's hairline, but it reads as a crack.

The crack is the edge between the two panels, not a line drawn just under a
straight edge. From the section's straight top edge down to the crack, the
panel above shows in its own background colour (the hero's black over About,
About's surface over Skills, and so on), so the panels meet along the zigzag.
(Added after a dry run showed a strip of the lower panel's colour between the
straight edge and the crack.)

The run happens once, when the seam reaches 85% of the viewport's height:
- The front crosses in 0.55 s. It gets up to speed over the first 30%, then
  races, as the hero's cracks do.
- A short bright tip (about 60 px) rides the front: the core near full
  brightness, the fringes stronger. Behind it, the line settles to rest over
  0.8 s.
- The branch starts as the front passes its root, at about 0.8× the speed.
- Direction alternates from seam to seam: left to right, then right to left.

Build:
- A `seams` module in `main.js` injects one inline
  `<svg class="seam" aria-hidden="true">` per section into the section's top
  32 px (sections clip their overflow).
- The SVG has paths for the core, each fringe and the tip. The run animates
  `stroke-dashoffset`.
- It uses a local seeded RNG, because the hero's may not have loaded.
- The SVG also has a cover path in the upper panel's colour, from the top edge
  down to the main line.
- The section gets `.has-seam`, which paints its `border-top` in the upper
  panel's colour (hiding the hairline), only once the SVG is in. Without the
  script, the hairline stays.

### 5.3 Glint (project cards, on hover and focus)

Where: `.project-card` only. It's the page's one clickable surface in a grid,
and the glint means "this opens". Skill cards, filters, buttons, social links
and inputs keep their current hover states.

On hover (pointer devices only, `@media (hover: hover)`) and on
`:focus-visible`:
- **One sweep** of the hero's streak pair crosses the card once in 0.7 s: a
  broad soft band and a thin bright line beside it, in `--glint`, at the
  hero's streak angle. Peak alpha is about 0.08 for the band and 0.16 for the
  line. It runs once per hover, and moving the pointer off doesn't play it
  backwards.
- **A border fringe** shows while hovered: 1 px of `--fringe-r` outside the top
  and left edges and 1 px of `--fringe-b` outside the bottom and right, at
  alpha about 0.35. It's drawn as `box-shadow` over the existing `--bd-3`
  border.
- The existing lift, ladder step and thumbnail saturation stay.
- `:focus-visible` also gets a 1 px `--glint` outline at a 3 px offset, so
  keyboard focus is unmistakable.

Build: `.project-card::after` with a gradient, moved by `transform` only. The
card already clips its overflow.

## 6. Reveals: one mechanism

Today three modules (`scrollAnimations`, `skills`, `projects`) each build their
own reveal tweens. They become one `reveal` module:
- Elements marked `data-reveal` start at `opacity: 0; translateY(16px)` and get
  `.is-in` once, when they reach 88% of the viewport. CSS does the move:
  0.45 s, `--ease`, delayed by `--i × 70 ms` for staggers.
- One `ScrollTrigger.batch` does the triggering. The seams use the same trigger
  with their own start point.
- The hidden state applies only under a class that the script puts on
  `<html>`, so a script that fails never hides content. If ScrollTrigger is
  missing, everything gets `.is-in` at boot.
- Targets:
  - section headers: the tag, title and subtitle move as one, and the title
    adds its focus-in
  - skill cards, staggered by column
  - project cards, on the first render only
  - the contact layout
  - the social links, staggered
- Filtering, sorting and searching render the cards already in: no triggers
  per render, and no flash while you type. That fixes the leak in §2.
- Everything plays once. Nothing reverses when you scroll back up (today, skill
  cards and section headers do).

## 7. What goes

| Remove | Where |
|---|---|
| Hero name scramble | `heroAnimations` (the GSAP timeline stays) |
| `.glitch-text`: the class, its `data-text` attributes, keyframes and LITE rules | `index.html`, `styles.css` |
| Title, skill-name and timeline scrambles; the section-tag slide; the timeline line | `scrollAnimations`, replaced by `reveal` |
| Card entry flashes and the project-title scramble | `skills`, `projects` |
| `glitchEffects`, `sideLabels`, `sectionFlash`, `scanSweep`, `hackScroll`, `clickRipple`, `hoverGlitch` | `main.js`, plus their CSS: `.scroll-side-label`, `.ascii-flash-overlay`, `.scan-sweep-line`, `.click-ripple-ring`, the `label-glitch` keyframes |
| Custom cursor | the `cursor` module; the `#cursor-dot`, `#cursor-ring` and `#cursor-glow` markup; `body { cursor: none }`; the cursor rules in LITE and `@media (hover: none)` |
| Dead selectors | `.timeline*`, `#history`, `.symbol-block`, `.skill-level`, `.project-thumb-overlay`, `.project-type-icon`, `.project-open-hint`, each checked for use before it's deleted |

`lowPerf.toggle` keeps only the hero pause/resume and the body class.

Removing `.glitch-text` changes the hero's layout, which is the one exception to
§12. The class made the eyebrow and the name `inline-block`, so above about 470 px
the eyebrow sat on the name's line, to its left, and pushed the name off-centre.
Without the class they stack, as they already did on phones. The name is then
centred on the black hole, and the copy sits 20 px lower.

These stay as they are: the nav (logo spin included), the mobile drawer, the
dot-matrix motif, the surface/border ladder, the LITE toggle and its hint,
`pageIdle`, the project modal, the contact form, filters/search/sort, the hero
HUD corners, and the disabled loader code (hero spec §3).

## 8. Motion and fallbacks

| | Default | Reduced motion | LITE | No script |
|---|---|---|---|---|
| Reveal | fades up once, 0.45 s | appears in place | appears in place | visible |
| Focus-in | split closes, 0.6 s / 0.9 s | appears in place | appears in place | visible |
| Seams | run once, then rest | at rest | at rest | plain hairline |
| Card glint | sweep + fringe | fringe only | fringe only | n/a (the cards need the script) |

- The global reduced-motion rule clamps durations but not delays, so the seams
  check `prefers-reduced-motion` themselves and go straight to rest.
- In LITE the dot matrix is hidden, as today. The seams stay: at rest they cost
  no more than a border.

## 9. Performance

- Removed:
  - seven decorative effects, driven by timers, scrolling, clicks and hovers,
    that add and remove DOM nodes
  - a `mousemove` handler plus a `requestAnimationFrame` loop that ran every
    frame for the cursor
  - the per-card `filter` flashes
- Added:
  - transform/opacity animations for the reveals and the glint, which are
    compositor-only
  - two short repaints: `text-shadow` on one heading for 0.6 s, and
    `stroke-dashoffset` on one small SVG for about 1.4 s
- Estimated size: `main.js` loses roughly 700 lines and gains about 120.
  `styles.css` loses about 300 and gains about 100.

## 10. Files

| File | Change |
|---|---|
| `js/main.js` | Remove the modules in §7. Add `reveal` and `seams`. Simplify `heroAnimations`, `skills`, `projects`, `lowPerf` and `boot()`. Update the header comment ("Cyber-tech Portfolio"). |
| `css/styles.css` | Add the tokens (§4), the `focus-in` keyframes, and the seam, glint and reveal rules. Delete the CSS listed in §7. Update the header comment ("Cyber-tech / Marathon aesthetic"). |
| `index.html` | Drop the cursor elements, and `glitch-text`/`data-text` from the hero copy. Mark the static reveal targets with `data-reveal`. |
| `README.md` | Site Features: add one line for the glass accents. |

## 11. Verification

There's no test runner, so this is checked in a browser, the way the hero was:
1. **Console:** clean at load and through a full scroll.
2. **No leak:** `ScrollTrigger.getAll().length` is the same before and after
   typing ten characters into search and clicking every filter and sort button.
3. **Stillness:** starting 8 s after load, with LITE off, a `MutationObserver`
   on `<body>` (subtree, child list, attributes, character data) records
   nothing outside the hero canvas over 10 s of idling. This catches any
   leftover timer effect.
4. **Text:** through a full scroll from top to bottom, a `MutationObserver`
   records no text changes.
5. **Look:** screenshots at 1280×720 and 375×812 of each seam at rest, one seam
   mid-run, a title mid focus-in, and a card mid-glint.
6. **Reduced motion** (emulated) **and LITE:** the seams are at rest, there are
   no sweeps or splits, and all content is visible.
7. **Keyboard:** Tab reaches the project cards, focus shows the fringe and the
   outline, and Enter opens the modal.
8. **Touch** (mobile emulation): a tap opens the modal, and no glint is left
   stuck on afterwards.
9. **No script:** the content is visible and the seams are plain hairlines.

## 12. Out of scope

- The hero itself (it has its own spec), and the disabled loader.
- Dropping GSAP. After this work it only drives the hero copy timeline, the
  reveal trigger and the disabled loader. Replacing it with CSS and an
  IntersectionObserver would save two CDN scripts. That's a separate decision.
- The hidden scrollbar (`styles.css` §13). It's worth a separate look for
  practicality.
- The Portfolio v2 project text, which still describes the ASCII loader and
  the ray-marched hero. That's better updated along with the hero work.
- Layout, fonts, content, and the designs of the modal, nav, form and footer.
