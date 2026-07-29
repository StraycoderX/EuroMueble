/* =========================================================================
   Euromueble · Home
   ========================================================================= */
(function (EM) {
  'use strict';

  const $ = EM.$;

  /* ---------------------------------------------------------------------
     Cinta de ventajas
     --------------------------------------------------------------------- */
  const TICKER = [
    ['truck', 'Transporte gratis en Canarias'],
    ['tools', 'Montaje incluido'],
    ['card', 'Financiación hasta 12 meses'],
    ['recycle', 'Retirada del mueble usado'],
    ['store', '145 mesas expuestas en tienda'],
    ['bolt', 'Entrega inmediata en stock'],
    ['shield', 'IGIC incluido en el precio']
  ];

  function ticker() {
    const box = $('[data-ticker]');
    if (!box) return;
    const one = TICKER.map(t =>
      '<span class="ticker__item">' + EM.icon(t[0]) + t[1] + '</span>').join('');
    box.innerHTML = one + one; // duplicado para bucle continuo
  }

  /* ---------------------------------------------------------------------
     Bento de categorías
     --------------------------------------------------------------------- */
  const BENTO = [
    { slug: 'sofas', size: 'tile--xl', img: EM.media.family, title: 'Sofás y salón' },
    { slug: 'dormitorios' },
    { slug: 'descanso', img: EM.media.colchones },
    { slug: 'comedores' },
    { slug: 'jardin' },
    { slug: 'cocinas', size: 'tile--w', img: EM.media.cocina, href: EM.config.legacy + '/cocinas' },
    { slug: 'electrodomesticos' },
    { slug: 'decoracion' }
  ];

  function bento() {
    const box = $('[data-bento]');
    if (!box) return;
    box.innerHTML = BENTO.map(t => {
      const c = EM.data.category(t.slug);
      if (!c) return '';
      const href = t.href || ('catalogo.html?cat=' + c.slug);
      const withImg = !!t.img;
      return '' +
        '<a class="tile ' + (t.size || '') + (withImg ? ' tile--img' : '') + '" href="' + href + '">' +
          (withImg ? '<img class="tile__img" src="' + t.img + '" alt="" loading="lazy">' : '') +
          '<span class="tile__icon">' + EM.icon(c.icon) + '</span>' +
          '<span class="tile__go">' + EM.icon('arrowUR') + '</span>' +
          '<h3>' + EM.esc(t.title || c.name) + '</h3>' +
          '<p>' + EM.esc(c.blurb) + '</p>' +
        '</a>';
    }).join('');
  }

  /* ---------------------------------------------------------------------
     Carruseles de producto
     --------------------------------------------------------------------- */
  function rails() {
    EM.$$('[data-rail]').forEach(el => {
      EM.renderInto(el, EM.data.byTag(el.getAttribute('data-rail'), 8));
    });
    EM.$$('[data-rail-cat]').forEach(el => {
      EM.renderInto(el, EM.data.byCat(el.getAttribute('data-rail-cat'), 8));
    });
  }

  /* ---------------------------------------------------------------------
     Servicios
     --------------------------------------------------------------------- */
  function services() {
    const box = $('[data-services]');
    if (!box) return;
    box.innerHTML = EM.services.map(s =>
      '<a class="service" href="' + EM.config.legacy + s.href + '">' +
        '<span class="service__icon">' + EM.icon(s.icon) + '</span>' +
        '<h3>' + EM.esc(s.title) + '</h3>' +
        '<p>' + EM.esc(s.text) + '</p>' +
      '</a>').join('');
  }

  /* ---------------------------------------------------------------------
     Datos de tienda
     --------------------------------------------------------------------- */
  function store() {
    const box = $('[data-store-info]');
    const s = EM.stores[0];
    if (box && s) {
      box.innerHTML =
        '<a class="dl__row" href="' + s.map + '" target="_blank" rel="noopener">' + EM.icon('pin') +
          '<span><b>' + EM.esc(s.street) + '</b><br>' + EM.esc(s.city) + '</span></a>' +
        '<div class="dl__row">' + EM.icon('clock') + '<span>' +
          EM.config.hours.map(h => '<b>' + h.d + ':</b> ' + h.h).join('<br>') + '</span></div>' +
        '<a class="dl__row" href="tel:' + EM.config.phoneRaw + '">' + EM.icon('phone') +
          '<span><b>' + EM.config.phone + '</b></span></a>';
    }
    const tel = $('[data-phone]');
    if (tel) {
      tel.setAttribute('href', 'tel:' + EM.config.phoneRaw);
      tel.innerHTML = EM.icon('phone') + EM.config.phone;
    }
  }

  function init() {
    ticker();
    bento();
    rails();
    services();
    store();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.EM);
