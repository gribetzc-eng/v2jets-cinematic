/* ============================================================
   CONTENT-PAGE SCRIPT  —  do NOT edit per project.
   Smooth scroll + reveal-on-scroll + page-transition overlay
   for the non-film pages (team/staff, reviews, portfolio, news, contact…).
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  let lenis = null;
  if (window.Lenis && !reduce){
    lenis = new Lenis({ duration:1.1, smoothWheel:true, wheelMultiplier:1 });
    (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })();
    window.__lenis = lenis;
  }
  $$('a[href^="#"]').forEach(a => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    a.addEventListener('click', e => {
      const el = document.querySelector(id); if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset:-80, duration:1.2 });
      else el.scrollIntoView({ behavior:'smooth' });
    });
  });

  // page transition — fade through an overlay on internal navigation
  const ov = document.createElement('div'); ov.className = 'tr-overlay'; document.body.appendChild(ov);
  $$('a[href]').forEach(a => {
    const href = a.getAttribute('href'); if (!href) return;
    if (href.startsWith('#') || /^(https?:|mailto:|tel:)/.test(href) || a.target === '_blank') return;
    a.addEventListener('click', e => { e.preventDefault(); ov.classList.add('show'); setTimeout(() => { location.href = href; }, 340); });
  });

  // count-up for any [data-counts] scope (rating headers, stat bands)
  function runCounters(scope){
    if (!scope || scope.dataset.counted) return; scope.dataset.counted = '1';
    scope.querySelectorAll('.count').forEach(el => {
      const to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec||'0');
      const dur = 1500, t0 = performance.now();
      const fmt = v => dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
      const step = now => { const k = Math.min((now-t0)/dur,1), e = 1-Math.pow(1-k,3);
        el.textContent = fmt(to*e); if (k<1) requestAnimationFrame(step); else el.textContent = fmt(to); };
      requestAnimationFrame(step);
    });
  }

  // reveal on scroll
  if (reduce){ $$('[data-fade]').forEach(el => el.classList.add('in')); $$('[data-counts]').forEach(runCounters); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){
      e.target.classList.add('in');
      if (e.target.hasAttribute('data-counts')) runCounters(e.target);
      io.unobserve(e.target);
    } });
  }, { threshold:0.12, rootMargin:'0px 0px -8% 0px' });
  $$('[data-fade],[data-counts]').forEach(el => io.observe(el));
});
