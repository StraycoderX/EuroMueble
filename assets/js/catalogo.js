/* =========================================================================
   Euromueble · Catálogo
   Filtrado, ordenación y sincronización con la URL.
   ========================================================================= */
(function (EM) {
  'use strict';

  const $ = EM.$, $$ = EM.$$;
  const RANGE = EM.data.priceRange();

  const state = {
    cats: [],
    subs: [],
    tags: [],
    min: RANGE.min,
    max: RANGE.max,
    stock: false,
    fav: false,
    q: '',
    sort: 'rel'
  };

  /* ---------------------------------------------------------------------
     URL → estado
     --------------------------------------------------------------------- */
  function fromURL() {
    const get = EM.qs;
    if (get('cat')) state.cats = get('cat').split(',');
    if (get('sub')) state.subs = get('sub').split(',');
    if (get('tag')) state.tags = get('tag').split(',');
    if (get('q')) state.q = get('q');
    if (get('fav')) state.fav = true;
    if (get('sort')) state.sort = get('sort');
  }

  function toURL() {
    const p = new URLSearchParams();
    if (state.cats.length) p.set('cat', state.cats.join(','));
    if (state.subs.length) p.set('sub', state.subs.join(','));
    if (state.tags.length) p.set('tag', state.tags.join(','));
    if (state.q) p.set('q', state.q);
    if (state.fav) p.set('fav', '1');
    if (state.sort !== 'rel') p.set('sort', state.sort);
    const qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  /* ---------------------------------------------------------------------
     Filtrado
     --------------------------------------------------------------------- */
  function apply() {
    let list = state.q ? EM.data.search(state.q) : EM.data.all();

    if (state.cats.length) list = list.filter(p => state.cats.indexOf(p.cat) > -1);
    if (state.subs.length) list = list.filter(p => state.subs.indexOf(p.sub) > -1);
    if (state.tags.length) list = list.filter(p => state.tags.every(t => p.tags.indexOf(t) > -1));
    if (state.stock) list = list.filter(p => p.stock);
    if (state.fav) list = list.filter(p => EM.wish.has(p.id));
    list = list.filter(p => p.price >= state.min && p.price <= state.max);

    const rank = p => (p.tags.indexOf('destacado') > -1 ? 0 : 1) +
                      (p.tags.indexOf('novedad') > -1 ? 0 : 1) +
                      (p.stock ? 0 : 3);
    const sorters = {
      rel: (a, b) => rank(a) - rank(b),
      asc: (a, b) => a.price - b.price,
      desc: (a, b) => b.price - a.price,
      new: (a, b) => (b.tags.indexOf('novedad') > -1) - (a.tags.indexOf('novedad') > -1),
      az: (a, b) => a.name.localeCompare(b.name, 'es')
    };
    if (!(state.q && state.sort === 'rel')) list = list.slice().sort(sorters[state.sort] || sorters.rel);

    return list;
  }

  /* ---------------------------------------------------------------------
     Pintado
     --------------------------------------------------------------------- */
  function renderChips() {
    const box = $('[data-chips]');
    const chips = [];
    const chip = (label, kind, value) =>
      '<span class="chip">' + EM.esc(label) +
        '<button data-chip-kind="' + kind + '" data-chip-value="' + EM.esc(value) + '" ' +
        'aria-label="Quitar filtro ' + EM.esc(label) + '">' + EM.icon('close') + '</button></span>';

    if (state.q) chips.push(chip('«' + state.q + '»', 'q', state.q));
    state.cats.forEach(c => chips.push(chip(EM.data.catName(c), 'cat', c)));
    state.subs.forEach(s => chips.push(chip(s, 'sub', s)));
    state.tags.forEach(t => chips.push(chip({
      oferta: 'Con descuento', novedad: 'Novedades',
      'primer-precio': 'Primer precio', 'entrega-inmediata': 'Entrega inmediata'
    }[t] || t, 'tag', t)));
    if (state.stock) chips.push(chip('En stock', 'stock', '1'));
    if (state.fav) chips.push(chip('Mis favoritos', 'fav', '1'));
    if (state.min > RANGE.min || state.max < RANGE.max) {
      chips.push(chip(EM.fmt(state.min) + ' – ' + EM.fmt(state.max), 'price', '1'));
    }
    box.innerHTML = chips.join('');
  }

  function renderHead() {
    const title = $('[data-title]');
    const sub = $('[data-subtitle]');
    const crumb = $('[data-crumb]');
    let name = 'Catálogo';
    let text = 'Todo nuestro surtido, con transporte y montaje incluidos según condiciones.';

    if (state.q) {
      name = 'Resultados para «' + state.q + '»';
      text = 'Buscando en todo el catálogo de Euromueble.';
    } else if (state.fav) {
      name = 'Mis favoritos';
      text = 'Los productos que has guardado en este navegador.';
    } else if (state.cats.length === 1) {
      const c = EM.data.category(state.cats[0]);
      if (c) { name = c.name; text = c.blurb + '. Transporte y montaje incluidos según condiciones.'; }
    } else if (state.tags.length === 1) {
      name = { oferta: 'Ofertas', novedad: 'Novedades', 'primer-precio': 'Primer precio',
               'entrega-inmediata': 'Entrega inmediata' }[state.tags[0]] || 'Catálogo';
    }
    title.textContent = name;
    sub.textContent = text;
    crumb.textContent = name;
    document.title = name + ' · Euromueble';
  }

  function renderSubGroup() {
    const group = $('[data-sub-group]');
    const box = $('[data-f-sub]');
    const subs = [];
    (state.cats.length ? state.cats : []).forEach(slug => {
      const c = EM.data.category(slug);
      if (c) c.children.forEach(s => { if (subs.indexOf(s) < 0) subs.push(s); });
    });
    const available = subs.filter(s => EM.products.some(p => p.sub === s));
    if (!available.length) { group.classList.add('hide'); return; }
    group.classList.remove('hide');
    box.innerHTML = available.map(s =>
      '<label class="check"><input type="checkbox" data-sub="' + EM.esc(s) + '"' +
      (state.subs.indexOf(s) > -1 ? ' checked' : '') + '> ' + EM.esc(s) + '</label>').join('');
  }

  function render() {
    const list = apply();
    EM.renderInto('[data-results]', list,
      state.fav ? 'Aún no has guardado ningún favorito.' : 'No hay productos con estos filtros. Prueba a quitar alguno.');
    $('[data-count]').textContent = list.length;
    renderChips();
    renderHead();
    toURL();
  }

  /* ---------------------------------------------------------------------
     Controles
     --------------------------------------------------------------------- */
  function buildCatFilter() {
    const box = $('[data-f-cat]');
    box.innerHTML = EM.categories
      .filter(c => EM.data.byCat(c.slug).length)
      .map(c =>
        '<label class="check"><input type="checkbox" data-cat="' + c.slug + '"' +
        (state.cats.indexOf(c.slug) > -1 ? ' checked' : '') + '> ' +
        EM.esc(c.name) + ' <span class="muted">(' + EM.data.byCat(c.slug).length + ')</span></label>')
      .join('');
  }

  function buildRange() {
    const rmin = $('[data-r-min]');
    const rmax = $('[data-r-max]');
    [rmin, rmax].forEach(r => { r.min = RANGE.min; r.max = RANGE.max; });
    rmin.value = state.min;
    rmax.value = state.max;
    const paint = () => {
      $('[data-price-min]').textContent = EM.fmt(state.min);
      $('[data-price-max]').textContent = EM.fmt(state.max);
    };
    paint();
    const onInput = () => {
      let a = Number(rmin.value), b = Number(rmax.value);
      if (a > b) { const t = a; a = b; b = t; }
      state.min = a; state.max = b;
      paint();
      render();
    };
    rmin.addEventListener('input', onInput);
    rmax.addEventListener('input', onInput);
  }

  function bind() {
    /* Familia */
    $('[data-f-cat]').addEventListener('change', e => {
      const cb = e.target.closest('[data-cat]');
      if (!cb) return;
      const slug = cb.getAttribute('data-cat');
      const i = state.cats.indexOf(slug);
      if (cb.checked && i < 0) state.cats.push(slug);
      if (!cb.checked && i > -1) state.cats.splice(i, 1);
      state.subs = [];
      renderSubGroup();
      render();
    });

    /* Tipo */
    $('[data-f-sub]').addEventListener('change', e => {
      const cb = e.target.closest('[data-sub]');
      if (!cb) return;
      const sub = cb.getAttribute('data-sub');
      const i = state.subs.indexOf(sub);
      if (cb.checked && i < 0) state.subs.push(sub);
      if (!cb.checked && i > -1) state.subs.splice(i, 1);
      render();
    });

    /* Etiquetas y disponibilidad */
    $$('[data-f-tag]').forEach(cb => {
      const tag = cb.getAttribute('data-f-tag');
      cb.checked = state.tags.indexOf(tag) > -1;
      cb.addEventListener('change', () => {
        const i = state.tags.indexOf(tag);
        if (cb.checked && i < 0) state.tags.push(tag);
        if (!cb.checked && i > -1) state.tags.splice(i, 1);
        render();
      });
    });
    const stock = $('[data-f-stock]');
    stock.checked = state.stock;
    stock.addEventListener('change', () => { state.stock = stock.checked; render(); });

    const fav = $('[data-f-fav]');
    fav.checked = state.fav;
    fav.addEventListener('change', () => { state.fav = fav.checked; render(); });

    /* Orden */
    const sort = $('[data-sort]');
    sort.value = state.sort;
    sort.addEventListener('change', () => { state.sort = sort.value; render(); });

    /* Chips */
    $('[data-chips]').addEventListener('click', e => {
      const btn = e.target.closest('[data-chip-kind]');
      if (!btn) return;
      const kind = btn.getAttribute('data-chip-kind');
      const value = btn.getAttribute('data-chip-value');
      if (kind === 'cat') state.cats = state.cats.filter(c => c !== value);
      if (kind === 'sub') state.subs = state.subs.filter(s => s !== value);
      if (kind === 'tag') state.tags = state.tags.filter(t => t !== value);
      if (kind === 'q') state.q = '';
      if (kind === 'stock') state.stock = false;
      if (kind === 'fav') state.fav = false;
      if (kind === 'price') { state.min = RANGE.min; state.max = RANGE.max; }
      syncInputs();
      renderSubGroup();
      render();
    });

    /* Limpiar */
    $('[data-clear]').addEventListener('click', () => {
      state.cats = []; state.subs = []; state.tags = [];
      state.stock = false; state.fav = false; state.q = '';
      state.min = RANGE.min; state.max = RANGE.max;
      syncInputs();
      renderSubGroup();
      render();
    });

    /* Panel de filtros en móvil */
    const panel = $('#filters');
    const open = $('[data-filters-open]');
    const close = $('[data-filters-close]');
    const mq = window.matchMedia('(max-width: 940px)');
    const sync = () => {
      open.style.display = mq.matches ? '' : 'none';
      close.style.display = mq.matches ? '' : 'none';
      close.classList.toggle('hide', !mq.matches);
      if (!mq.matches) { panel.classList.remove('is-open'); document.body.classList.remove('is-locked'); }
    };
    sync();
    mq.addEventListener('change', sync);
    open.addEventListener('click', () => { panel.classList.add('is-open'); document.body.classList.add('is-locked'); });
    close.addEventListener('click', () => { panel.classList.remove('is-open'); document.body.classList.remove('is-locked'); });

    /* Favoritos actualizados desde las tarjetas */
    document.addEventListener('em:wish', () => { if (state.fav) render(); });
  }

  function syncInputs() {
    $$('[data-cat]').forEach(cb => { cb.checked = state.cats.indexOf(cb.getAttribute('data-cat')) > -1; });
    $$('[data-f-tag]').forEach(cb => { cb.checked = state.tags.indexOf(cb.getAttribute('data-f-tag')) > -1; });
    $('[data-f-stock]').checked = state.stock;
    $('[data-f-fav]').checked = state.fav;
    $('[data-r-min]').value = state.min;
    $('[data-r-max]').value = state.max;
    $('[data-price-min]').textContent = EM.fmt(state.min);
    $('[data-price-max]').textContent = EM.fmt(state.max);
  }

  function init() {
    fromURL();
    buildCatFilter();
    buildRange();
    renderSubGroup();
    bind();
    render();
  }
  EM.definePage('catalogo', init);
})(window.EM);
