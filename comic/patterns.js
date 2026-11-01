/* patterns.js — design-pattern add-on for the comic kit.
   Load AFTER comic.js. Adds: new <comic-char> names + <comic-rel> UML arrows.

   <comic-rel kind="inherit|implement|assoc|depend|aggregate|compose"
              dir="up|down|left|right" label="uses" len="56">
   The arrow runs tail -> head and the head is the TARGET. Diamonds sit on the owner (tail). */
(() => {
  const K = window.ComicKit;
  if (!K) { console.warn('patterns.js: load comic.js first'); return; }

  // ---- characters (face offset in FY) ----
  Object.assign(K.BODY, {
    client: '<circle cx="50" cy="54" r="34" fill="var(--c1)"/><path d="M20 46a30 28 0 0 1 60 0z" fill="var(--c3)"/>',
    factory: '<rect x="70" y="8" width="10" height="22" fill="var(--c6)"/><rect x="14" y="38" width="72" height="50" rx="6" fill="var(--c2)"/><path d="M14 40V22l22 16V22l22 16V22l28 16v2z" fill="var(--c6)"/>',
    product: '<path d="M50 30c-16-20-30-4-14 0M50 30c16-20 30-4 14 0" fill="none"/><rect x="18" y="30" width="64" height="58" rx="6" fill="var(--c5)"/><rect x="18" y="36" width="64" height="10" fill="var(--c4)"/>',
    publisher: '<path d="M82 38q8 12 0 24M90 30q14 20 0 40" fill="none"/><rect x="12" y="22" width="62" height="62" rx="14" fill="var(--c2)"/>',
    subscriber: '<path d="M30 26l-6-14M70 26l6-14" fill="none"/><circle cx="24" cy="12" r="4" fill="var(--c4)"/><circle cx="76" cy="12" r="4" fill="var(--c4)"/><rect x="16" y="26" width="68" height="58" rx="16" fill="var(--c5)"/>',
    wrapper: '<rect x="8" y="12" width="84" height="78" rx="22" fill="var(--c3)"/><rect x="22" y="26" width="56" height="50" rx="12" fill="var(--c1)"/>',
    adapter: '<path d="M36 6v18M64 6v18" fill="none" stroke-width="6"/><rect x="16" y="24" width="68" height="62" rx="14" fill="var(--c6)"/>',
    king: '<path d="M24 30l8-16 18 14 18-14 8 16z" fill="var(--c4)"/><rect x="16" y="30" width="68" height="56" rx="14" fill="var(--c3)"/>',
  });
  Object.assign(K.FY, { client: 54, factory: 56, product: 58, publisher: 48, subscriber: 54, wrapper: 44, adapter: 52, king: 54 });

  // ---- UML relationship arrows ----
  const H = 28, M = 14;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const seg = (x1, x2, dash) =>
    `<path d="M${x1} ${M}H${x2}" fill="none"${dash ? ' stroke-dasharray="5 6" stroke-linecap="butt"' : ''}/>`;
  const tri = L => `<path d="M${L - 14} 6L${L} ${M}L${L - 14} 22Z" fill="var(--paper)"/>`;
  const open = L => `<path d="M${L - 10} 7L${L} ${M}L${L - 10} 21" fill="none"/>`;
  const dia = f => `<path d="M0 ${M}L7 8L14 ${M}L7 20Z" fill="${f}"/>`;
  const GLYPH = {
    inherit: L => seg(0, L - 14) + tri(L),
    implement: L => seg(0, L - 14, 1) + tri(L),
    assoc: L => seg(0, L) + open(L),
    depend: L => seg(0, L, 1) + open(L),
    aggregate: L => dia('var(--paper)') + seg(14, L),
    compose: L => dia('currentColor') + seg(14, L),
  };
  const XFORM = {
    right: () => '',
    left: L => `translate(${L} ${H}) rotate(180)`,
    down: () => `translate(${H} 0) rotate(90)`,
    up: L => `translate(0 ${L}) rotate(-90)`,
  };

  class ComicRel extends HTMLElement {
    static get observedAttributes() { return ['kind', 'dir', 'label', 'len']; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      const kind = GLYPH[this.getAttribute('kind')] ? this.getAttribute('kind') : 'assoc';
      const dir = XFORM[this.getAttribute('dir')] ? this.getAttribute('dir') : 'right';
      const L = Math.max(30, +this.getAttribute('len') || 56);
      const v = dir === 'up' || dir === 'down';
      const w = v ? H : L, h = v ? L : H;
      const lbl = this.getAttribute('label');
      this.innerHTML =
        `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${kind}">
           <g transform="${XFORM[dir](L)}" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${GLYPH[kind](L)}</g>
         </svg>` + (lbl ? `<span class="lbl">${esc(lbl)}</span>` : '');
    }
  }
  if (!customElements.get('comic-rel')) customElements.define('comic-rel', ComicRel);

  // characters that rendered before their bodies were registered fall back to "main": redraw them
  customElements.whenDefined('comic-char').then(() =>
    document.querySelectorAll('comic-char').forEach(e => e.render && e.render()));
})();
