/* comic.js — <comic-char> component, wobble filter, panel progress. Pair with comic.css */
(() => {
  const F = '#1f2430';

  // hand-drawn wobble filter, referenced by comic.css as url(#wob)
  const FILTER = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <filter id="wob" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3"/>
    </filter></svg>`;
  const addFilter = () => document.body.insertAdjacentHTML('afterbegin', FILTER);

  // ---- characters ----
  // name -> body svg. Colors come from CSS vars (--c1..--c6).
  const BODY = {
    main: '<rect x="16" y="20" width="68" height="64" rx="16" fill="var(--c1)"/>',
    worker: '<rect x="16" y="30" width="68" height="54" rx="16" fill="var(--c2)"/><path d="M24 32a26 20 0 0 1 52 0z" fill="var(--c4)"/>',
    sched: '<rect x="16" y="20" width="68" height="64" rx="10" fill="var(--c3)"/><circle cx="76" cy="24" r="12" fill="#fff"/><path d="M76 17v7l5 3" fill="none"/>',
    mutex: '<path d="M34 40V28a16 16 0 0 1 32 0v12" fill="none" stroke-width="7"/><rect x="16" y="38" width="68" height="48" rx="12" fill="var(--c4)"/>',
    cpu: '<path d="M30 8v12M50 8v12M70 8v12M30 84v12M50 84v12M70 84v12M8 34h12M8 66h12M80 34h12M80 66h12" fill="none"/><rect x="18" y="20" width="64" height="64" rx="8" fill="var(--c5)"/>',
    os: '<circle cx="50" cy="52" r="36" fill="var(--c6)"/>',
  };
  // face y-offset per character (eyes baseline)
  const FY = { main: 48, worker: 54, sched: 50, mutex: 62, cpu: 48, os: 50 };

  const dot = x => `<circle cx="${x}" cy="48" r="4" fill="${F}" stroke="none"/>`;
  const EYES = {
    happy: dot(38) + dot(62),
    sad: dot(38) + dot(62),
    think: dot(38) + dot(62) + `<path d="M50 34l16-4" fill="none" stroke-width="3"/>`,
    shock: [38, 62].map(x =>
      `<circle cx="${x}" cy="48" r="7" fill="#fff" stroke-width="3"/><circle cx="${x}" cy="48" r="2.5" fill="${F}" stroke="none"/>`
    ).join(''),
  };
  const MOUTH = {
    happy: '<path d="M38 62q12 12 24 0" fill="none"/>',
    sad: '<path d="M38 72q12-12 24 0" fill="none"/>',
    think: '<path d="M42 68h16" fill="none"/>',
    shock: `<ellipse cx="50" cy="68" rx="6" ry="8" fill="${F}"/>`,
  };

  class ComicChar extends HTMLElement {
    static get observedAttributes() { return ['name', 'mood', 'label']; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      const n = BODY[this.getAttribute('name')] ? this.getAttribute('name') : 'main';
      const m = EYES[this.getAttribute('mood')] ? this.getAttribute('mood') : 'happy';
      const dy = (FY[n] ?? 48) - 48;
      const l = this.getAttribute('label');
      this.innerHTML =
        `<svg viewBox="0 0 100 100" role="img" aria-label="${n}">
           <g stroke="${F}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
             ${BODY[n]}
             <g transform="translate(0 ${dy})">${EYES[m]}${MOUTH[m]}</g>
           </g></svg>` +
        (l === null ? '' : `<span class="lbl">${l || n}</span>`);
    }
  }
  if (!customElements.get('comic-char')) customElements.define('comic-char', ComicChar);

  // ---- panel progress (opt-in: .learn button inside .panel, [data-progress] anywhere) ----
  const initProgress = () => {
    const key = 'comic-learned:' + location.pathname;
    let done = new Set();
    try { done = new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch (e) {}
    const panels = [...document.querySelectorAll('.panel')].filter(p => p.querySelector('.learn'));
    const out = document.querySelectorAll('[data-progress]');
    const save = () => { try { localStorage.setItem(key, JSON.stringify([...done])); } catch (e) {} };
    const paint = () => out.forEach(o => (o.textContent = `${done.size} / ${panels.length} panels`));
    panels.forEach((p, i) => {
      const id = p.dataset.id || String(i);
      const b = p.querySelector('.learn');
      const set = on => {
        p.classList.toggle('done', on);
        b.setAttribute('aria-pressed', on);
        b.textContent = on ? 'Learned ✓' : 'Mark panel learned';
      };
      set(done.has(id));
      b.addEventListener('click', () => {
        done.has(id) ? done.delete(id) : done.add(id);
        set(done.has(id)); save(); paint();
      });
    });
    paint();
  };

  const init = () => { addFilter(); initProgress(); };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
