/* =========================================================================
   Euromueble · UI
   Iconografía, helpers, tema, cabecera, mega-menú, buscador, carruseles,
   tarjetas de producto y avisos.
   ========================================================================= */
window.EM = window.EM || {};

(function (EM) {
  'use strict';

  /* ---------------------------------------------------------------------
     Helpers
     --------------------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  EM.$ = $; EM.$$ = $$;

  const euro = new Intl.NumberFormat('es-ES', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: 2
  });
  EM.fmt = n => euro.format(n || 0);

  EM.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  EM.discount = p => (p.old && p.old > p.price) ? Math.round((1 - p.price / p.old) * 100) : 0;
  EM.href = p => 'producto.html?id=' + p.id;
  EM.qs = key => new URLSearchParams(location.search).get(key);

  /* ---------------------------------------------------------------------
     Iconos
     --------------------------------------------------------------------- */
  const PATHS = {
    chevron: '<path d="M6 9l6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    arrowUR: '<path d="M7 17L17 7M9 7h8v8"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16.7 16.7"/>',
    cart: '<path d="M3 4h2l2.4 11.4h10L20 8H6.2"/><circle cx="10" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/>',
    heart: '<path d="M12 20s-7-4.5-7-9.3A3.9 3.9 0 0 1 12 8.2a3.9 3.9 0 0 1 7 2.5C19 15.5 12 20 12 20z"/>',
    user: '<circle cx="12" cy="8" r="3.4"/><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M10 7V5h4v2M6.5 7l1 13h9l1-13"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    truck: '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/>',
    tools: '<path d="M15.5 3a5 5 0 0 0-4.6 7l-7.3 7.3 2.1 2.1 7.3-7.3A5 5 0 1 0 15.5 3z"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10.5h18M6.5 14.5h3"/>',
    recycle: '<path d="M4.5 12a7.5 7.5 0 0 1 12.6-5.5M19.5 12a7.5 7.5 0 0 1-12.6 5.5"/><path d="M17.5 2.5v4.5h-4.5M6.5 21.5V17h4.5"/>',
    phone: '<path d="M5 4h4l2 5-2.4 1.5a12.5 12.5 0 0 0 4.9 4.9L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7.5l8.5 5.5 8.5-5.5"/>',
    pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>',
    sofa: '<path d="M4 12V9.5a2 2 0 0 1 4 0V12h8V9.5a2 2 0 0 1 4 0V12"/><path d="M3 12h18v5.5H3z"/><path d="M6 17.5v2.5M18 17.5v2.5"/>',
    tv: '<rect x="3" y="4.5" width="18" height="11.5" rx="2.5"/><path d="M8.5 20h7M12 16v4"/>',
    table: '<path d="M3 9.5h18M5.5 9.5v10M18.5 9.5v10M4 9.5L6 5h12l2 4.5"/>',
    bed: '<path d="M3 18.5v-7.5h18v7.5M3 18.5v2M21 18.5v2M3 11V6.5"/><circle cx="7.5" cy="9" r="1.8"/><path d="M11 11V9.4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2V11"/>',
    moon: '<path d="M20 14.3A8.4 8.4 0 0 1 9.7 4 8.5 8.5 0 1 0 20 14.3z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
    box: '<path d="M3 7.5l9-4 9 4-9 4-9-4z"/><path d="M3 7.5v9l9 4 9-4v-9"/><path d="M12 11.5v9.5"/>',
    chef: '<path d="M3.5 11h13v3.2a4 4 0 0 1-4 4H7.5a4 4 0 0 1-4-4V11z"/><path d="M16.5 12.5H21"/><path d="M7 8.5c0-1.5 1-2.5 2.5-2.5S12 7 12 8.5"/>',
    plug: '<path d="M9 3v5.5M15 3v5.5M6 8.5h12v3a6 6 0 0 1-12 0v-3z"/><path d="M12 17.5V21"/>',
    chair: '<path d="M6.5 4h11l-1 8h-9l-1-8z"/><path d="M5 12h14M8.5 12v8M15.5 12v8"/>',
    lamp: '<path d="M8 3.5h8l3.2 8H4.8l3.2-8z"/><path d="M12 11.5v9M8.5 20.5h7"/>',
    drop: '<path d="M12 3s6 6.6 6 10.2A6 6 0 0 1 6 13.2C6 9.6 12 3 12 3z"/>',
    cup: '<path d="M5 5h11v7.5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 12.5V5z"/><path d="M16 7.5h2a2.5 2.5 0 0 1 0 5h-2"/><path d="M4 20.5h13"/>',
    sparkle: '<path d="M12 3l1.7 4.6L18.3 9l-4.6 1.7L12 15.3l-1.7-4.6L5.7 9l4.6-1.4L12 3z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/>',
    shield: '<path d="M12 3l7.5 3v6c0 4.5-3.2 8.3-7.5 9.3C7.7 20.3 4.5 16.5 4.5 12V6L12 3z"/><path d="M9 12l2.2 2.2L15.2 10"/>',
    sliders: '<path d="M4 7h9M18 7h2M4 17h3M13 17h7"/><circle cx="15.5" cy="7" r="2.2"/><circle cx="9.5" cy="17" r="2.2"/>',
    bolt: '<path d="M13.5 3L5.5 14H11l-1 7 8-11h-5.5l1-7z"/>',
    map: '<path d="M9 4L3 6.5v13.5L9 17.5l6 3 6-2.5V4.5L15 7 9 4z"/><path d="M9 4v13.5M15 7v13.5"/>',
    tag: '<path d="M3 12.5V4.5A1.5 1.5 0 0 1 4.5 3h8l8.5 8.5-9.5 9.5L3 12.5z"/><circle cx="7.5" cy="7.5" r="1.4"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    store: '<path d="M4 9.5V20h16V9.5"/><path d="M3 9.5L5 4h14l2 5.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M10 20v-5.5h4V20"/>'
  };
  const FILLED = {
    whatsapp: '<path d="M12.04 2A9.9 9.9 0 0 0 3.6 17.1L2.05 22l5.05-1.5A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.1 15.1l-.3-.2-3 .9.9-2.9-.2-.3A8.1 8.1 0 0 1 12.04 3.8zm-3.2 4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1.1 2.6c.1.2 1.8 2.9 4.5 4 .6.2 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.2-.5s0-.4-.1-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.3z"/>',
    facebook: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/>',
    star: '<path d="M12 2.5l2.9 5.9 6.6 1-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-1L12 2.5z"/>'
  };

  EM.icon = function (name, cls) {
    const filled = FILLED[name];
    const body = filled || PATHS[name] || PATHS.sparkle;
    return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') +
      (filled
        ? ' fill="currentColor">'
        : ' fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">') +
      body + '</svg>';
  };

  /* ---------------------------------------------------------------------
     Marcador vectorial para productos sin fotografía
     --------------------------------------------------------------------- */
  EM.placeholder = function (product) {
    const cat = EM.data.category(product.cat);
    const glyph = (PATHS[cat && cat.icon] || PATHS.box);
    const label = EM.esc((cat && cat.name) || 'Euromueble').toUpperCase();
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#f6f2ec"/><stop offset="1" stop-color="#e6ded2"/>' +
      '</linearGradient></defs>' +
      '<rect width="400" height="400" fill="url(#g)"/>' +
      '<g transform="translate(140 128) scale(5)" fill="none" stroke="#b9ac99" stroke-width="1.4" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + glyph + '</g>' +
      '<text x="200" y="318" text-anchor="middle" font-family="Inter,sans-serif" font-size="15" ' +
      'letter-spacing="3" fill="#b0a390">' + label + '</text>' +
      '<text x="200" y="344" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" ' +
      'letter-spacing="2" fill="#c8bcab">FOTO PRÓXIMAMENTE</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  EM.imgOf = p => p.img || EM.placeholder(p);

  // Si una imagen del servidor de medios falla, se sustituye por el marcador.
  document.addEventListener('error', function (e) {
    const img = e.target;
    if (img && img.tagName === 'IMG' && img.dataset.pid && !img.dataset.fallback) {
      img.dataset.fallback = '1';
      const p = EM.data.byId(img.dataset.pid);
      if (p) img.src = EM.placeholder(p);
    }
  }, true);

  /* ---------------------------------------------------------------------
     Avisos
     --------------------------------------------------------------------- */
  let toastBox;
  EM.toast = function (msg, icon) {
    if (!toastBox) {
      toastBox = document.createElement('div');
      toastBox.className = 'toasts';
      toastBox.setAttribute('role', 'status');
      toastBox.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastBox);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = EM.icon(icon || 'check') + '<span>' + EM.esc(msg) + '</span>';
    toastBox.appendChild(t);
    setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => t.remove(), 320);
    }, 2600);
  };

  /* ---------------------------------------------------------------------
     Tarjeta de producto
     --------------------------------------------------------------------- */
  EM.card = function (p) {
    const off = EM.discount(p);
    const flags = [];
    if (off) flags.push('<span class="flag flag--off">−' + off + '%</span>');
    if (p.tags.indexOf('novedad') > -1) flags.push('<span class="flag flag--new">Novedad</span>');
    if (p.tags.indexOf('entrega-inmediata') > -1) flags.push('<span class="flag flag--fast">Entrega inmediata</span>');

    const wished = EM.wish && EM.wish.has(p.id);

    return '' +
      '<article class="pcard" data-id="' + p.id + '">' +
        '<a class="pcard__media" href="' + EM.href(p) + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + EM.imgOf(p) + '" alt="" loading="lazy" decoding="async" data-pid="' + p.id + '">' +
          (flags.length ? '<div class="pcard__flags">' + flags.join('') + '</div>' : '') +
        '</a>' +
        '<button class="pcard__wish' + (wished ? ' on' : '') + '" data-wish="' + p.id + '" ' +
          'aria-pressed="' + (wished ? 'true' : 'false') + '" ' +
          'aria-label="Guardar ' + EM.esc(p.name) + ' en favoritos">' + EM.icon('heart') + '</button>' +
        '<div class="pcard__body">' +
          '<p class="pcard__cat">' + EM.esc(p.sub || EM.data.catName(p.cat)) + '</p>' +
          '<h3 class="pcard__title"><a href="' + EM.href(p) + '">' + EM.esc(p.name) + '</a></h3>' +
          '<div class="pcard__foot">' +
            '<div class="price"><b>' + EM.fmt(p.price) + '</b>' +
              (p.old ? '<s>' + EM.fmt(p.old) + '</s>' : '') + '</div>' +
            (p.stock
              ? '<button class="pcard__add" data-add="' + p.id + '" aria-label="Añadir ' + EM.esc(p.name) + ' a la cesta">' + EM.icon('plus') + '</button>'
              : '<span class="pcard__out">Sin stock</span>') +
          '</div>' +
        '</div>' +
      '</article>';
  };

  EM.renderInto = function (target, list, emptyMsg) {
    const box = typeof target === 'string' ? $(target) : target;
    if (!box) return;
    if (!list.length) {
      box.innerHTML = '<div class="empty">' + EM.icon('search') +
        '<p>' + EM.esc(emptyMsg || 'No hay productos que coincidan.') + '</p></div>';
      return;
    }
    box.innerHTML = list.map(EM.card).join('');
  };

  /* Acciones delegadas de las tarjetas */
  document.addEventListener('click', function (e) {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      EM.cart.add(add.getAttribute('data-add'), 1);
      add.innerHTML = EM.icon('check');
      setTimeout(() => { add.innerHTML = EM.icon('plus'); }, 1200);
      return;
    }
    const wish = e.target.closest('[data-wish]');
    if (wish) {
      e.preventDefault();
      const on = EM.wish.toggle(wish.getAttribute('data-wish'));
      wish.classList.toggle('on', on);
      wish.setAttribute('aria-pressed', on ? 'true' : 'false');
      EM.toast(on ? 'Guardado en favoritos' : 'Quitado de favoritos', 'heart');
    }
  });

  /* ---------------------------------------------------------------------
     Tema
     --------------------------------------------------------------------- */
  const THEME_KEY = 'em.theme';
  EM.theme = {
    get() { return document.documentElement.getAttribute('data-theme') || 'dark'; },
    set(v) {
      document.documentElement.setAttribute('data-theme', v);
      try { localStorage.setItem(THEME_KEY, v); } catch (_) {}
      $$('[data-theme-toggle]').forEach(b => {
        b.innerHTML = EM.icon(v === 'dark' ? 'sun' : 'moon');
        b.setAttribute('aria-label', v === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro');
      });
    },
    init() {
      let saved;
      try { saved = localStorage.getItem(THEME_KEY); } catch (_) {}
      EM.theme.set(saved || 'dark');
    }
  };

  /* ---------------------------------------------------------------------
     Cabecera, navegación y buscador
     --------------------------------------------------------------------- */
  function initHeader() {
    const header = $('.header');
    if (header) {
      const onScroll = () => {
        header.classList.toggle('is-stuck', window.scrollY > 8);
        const top = $('.fab__top');
        if (top) top.classList.toggle('on', window.scrollY > 600);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* Mega-menú: apertura por hover y por teclado */
    $$('.nav__item').forEach(item => {
      let timer;
      const open = () => { clearTimeout(timer); closeAll(item); item.classList.add('is-open'); setExpanded(item, true); };
      const close = () => { timer = setTimeout(() => { item.classList.remove('is-open'); setExpanded(item, false); }, 130); };
      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      item.addEventListener('focusin', open);
      item.addEventListener('focusout', e => {
        if (!item.contains(e.relatedTarget)) { item.classList.remove('is-open'); setExpanded(item, false); }
      });
      const trigger = $('.nav__link', item);
      if (trigger && $('.mega', item)) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.addEventListener('click', e => {
          e.preventDefault();
          const isOpen = item.classList.contains('is-open');
          closeAll();
          if (!isOpen) { item.classList.add('is-open'); setExpanded(item, true); }
        });
      }
    });
    function setExpanded(item, v) {
      const t = $('.nav__link', item);
      if (t && $('.mega', item)) t.setAttribute('aria-expanded', v ? 'true' : 'false');
    }
    function closeAll(except) {
      $$('.nav__item.is-open').forEach(i => { if (i !== except) { i.classList.remove('is-open'); setExpanded(i, false); } });
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

    /* Menú móvil */
    const mnav = $('.mnav');
    if (mnav) {
      const openBtn = $('[data-mnav-open]');
      const close = () => { mnav.classList.remove('is-open'); document.body.classList.remove('is-locked'); if (openBtn) openBtn.focus(); };
      if (openBtn) openBtn.addEventListener('click', () => {
        mnav.classList.add('is-open');
        document.body.classList.add('is-locked');
        const first = $('.mnav__panel button, .mnav__panel a', mnav);
        if (first) first.focus();
      });
      $$('[data-mnav-close], .mnav__scrim', mnav).forEach(el => el.addEventListener('click', close));
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && mnav.classList.contains('is-open')) close(); });

      $$('.acc__head', mnav).forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        h.addEventListener('click', () => {
          const acc = h.closest('.acc');
          const open = acc.classList.toggle('is-open');
          h.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      });
    }

    /* Tema */
    $$('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => {
      EM.theme.set(EM.theme.get() === 'dark' ? 'light' : 'dark');
    }));

    /* Volver arriba */
    const top = $('.fab__top');
    if (top) top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function initSearch() {
    const box = $('.search');
    if (!box) return;
    const input = $('.search__input', box);
    const results = $('.search__results', box);
    const hint = $('.search__hint', box);
    let lastFocus;

    const open = () => {
      lastFocus = document.activeElement;
      box.classList.add('is-open');
      document.body.classList.add('is-locked');
      setTimeout(() => input.focus(), 60);
    };
    const close = () => {
      box.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    };
    EM.openSearch = open;

    $$('[data-search-open]').forEach(b => b.addEventListener('click', open));
    $$('[data-search-close], .search__scrim', box).forEach(el => el.addEventListener('click', close));

    document.addEventListener('keydown', e => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); open(); }
      else if (e.key === '/' && !typing && !box.classList.contains('is-open')) { e.preventDefault(); open(); }
      else if (e.key === 'Escape' && box.classList.contains('is-open')) close();
    });

    const render = q => {
      const list = EM.data.search(q).slice(0, 8);
      if (!q || q.trim().length < 2) {
        results.innerHTML = '';
        hint.classList.remove('hide');
        return;
      }
      hint.classList.add('hide');
      if (!list.length) {
        results.innerHTML = '<p class="search__hint">Sin resultados para «' + EM.esc(q) + '».</p>';
        return;
      }
      results.innerHTML = list.map(p =>
        '<a class="sres" href="' + EM.href(p) + '">' +
          '<img class="sres__img" src="' + EM.imgOf(p) + '" alt="" loading="lazy" data-pid="' + p.id + '">' +
          '<div><div class="sres__t">' + EM.esc(p.name) + '</div>' +
          '<div class="sres__m">' + EM.esc(EM.data.catName(p.cat)) + ' · ' + EM.esc(p.sub) + '</div></div>' +
          '<div class="sres__p">' + EM.fmt(p.price) + '</div>' +
        '</a>').join('');
    };

    let t;
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => render(input.value), 120); });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const first = $('.sres', results);
        if (first) location.href = first.getAttribute('href');
        else if (input.value.trim()) location.href = 'catalogo.html?q=' + encodeURIComponent(input.value.trim());
      }
      if (e.key === 'ArrowDown') { const f = $('.sres', results); if (f) { e.preventDefault(); f.focus(); } }
    });
    $$('[data-search-term]').forEach(b => b.addEventListener('click', () => {
      input.value = b.getAttribute('data-search-term');
      render(input.value);
      input.focus();
    }));
  }

  /* ---------------------------------------------------------------------
     Carruseles horizontales
     --------------------------------------------------------------------- */
  function initRails() {
    $$('[data-rail-prev], [data-rail-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-rail-prev') || btn.getAttribute('data-rail-next');
        const rail = document.getElementById(id);
        if (!rail) return;
        const step = rail.clientWidth * 0.85;
        rail.scrollBy({ left: btn.hasAttribute('data-rail-next') ? step : -step, behavior: 'smooth' });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Revelado al hacer scroll
     --------------------------------------------------------------------- */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     Acordeones genéricos
     --------------------------------------------------------------------- */
  EM.initAccordions = function (root) {
    $$('.accordion__head', root || document).forEach(h => {
      if (h.dataset.bound) return;
      h.dataset.bound = '1';
      h.setAttribute('aria-expanded', h.closest('.accordion__item').classList.contains('is-open') ? 'true' : 'false');
      h.addEventListener('click', () => {
        const item = h.closest('.accordion__item');
        const open = item.classList.toggle('is-open');
        h.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  };

  /* ---------------------------------------------------------------------
     Relleno de plantilla (año, teléfono, etc.)
     --------------------------------------------------------------------- */
  function initTemplating() {
    $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
    $$('[data-icon]').forEach(el => {
      if (!el.innerHTML.trim()) el.innerHTML = EM.icon(el.getAttribute('data-icon'));
    });
    const nl = $('[data-newsletter]');
    if (nl) {
      nl.addEventListener('submit', e => {
        e.preventDefault();
        const email = $('input[type=email]', nl);
        if (!email.value || !email.checkValidity()) { email.focus(); return; }
        EM.toast('¡Gracias! Te hemos suscrito a las ofertas.', 'mail');
        nl.reset();
      });
    }
  }

  /* ---------------------------------------------------------------------
     Arranque
     --------------------------------------------------------------------- */
  EM.initUI = function () {
    EM.theme.init();
    initHeader();
    initSearch();
    initRails();
    initReveal();
    initTemplating();
    EM.initAccordions();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => EM.initUI());
  } else {
    EM.initUI();
  }
})(window.EM);
