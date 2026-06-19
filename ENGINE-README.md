# The Engine — copy verbatim, never edit

This folder is the **reusable, identity-free engine** for the cinematic scroll-film
site. It is the only thing you copy between projects. It contains **zero** brand,
color, font, or company-specific code — so copying it can never produce a clone.

```
engine.js            scroll-scrubbed frame-sequence player (data-driven; no hardcoded ids)
page.js              content-page script (smooth scroll, reveal, count-up, transitions)
serve.py             range-capable static server  →  python3 serve.py 8911
engine.css           invisible mechanics + neutral fallbacks ONLY (see header in file)
index.template.html  neutral home skeleton wired to the engine (fill placeholders)
page.template.html   neutral content-page skeleton (+ Staff & Reviews reference markup)
```

## How to use it
1. Copy this whole folder into the new site dir.
2. Author **`skin.css`** from scratch (loaded after `engine.css`) — this is the entire look.
3. Fill the templates with real, fact-checked content; rename/duplicate pages as needed.
4. Drop frame folders into `assets/frames/<seq>/0001.jpg…` and set each chapter's `data-count`.
5. **Never edit `engine.js`, `page.js`, `serve.py`, or `engine.css`.** If you're tempted to,
   you're putting identity in the wrong place — it goes in `skin.css`/markup.

## Markup contract the engine expects
- **Chapter:** `<section class="act" data-act data-seq="<frames-folder>" data-count="<N>" style="--len:5">`
  containing `.act__stage > canvas.act__canvas` (+ optional `.act__scrim`, `.act__label`).
- **Caption:** `<div class="cap cap--center" data-from="0.1" data-to="0.4">` — engine cross-fades
  it across that scroll window. Never set its base opacity in CSS.
- **Chapter rail:** `.chapters__dot[href="#section-id"][data-label="…"]`. The engine derives both
  the chapter order **and** active-state detection from these hrefs — there is **no hardcoded id
  array** to maintain (the old builds had one; this engine removed it).
- **Count-up:** put `data-counts` on a scope and `.count[data-to][data-dec]` on the numbers.
  In a data section it fires on scroll-into-view. To fire it *during* a film scrub, put
  `data-counts` on a scope **inside** the `.act` and (optionally) `data-counts-at="0.5"` on the act.
- **Reveal:** add `data-fade` to anything that should rise/fade in on scroll.
- **Bars:** `.phasebar` / `[data-bar]` with `data-p="70"` fill to that % on reveal.

Libraries (home page) via CDN, pinned: GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.20.
Content pages need only Lenis + `page.js`.
