/* =========================================================================
   Euromueble · Tiendas
   ========================================================================= */
(function (EM) {
  'use strict';

  const $ = EM.$;

  function stores() {
    const box = $('[data-stores]');
    if (!box) return;

    box.innerHTML = EM.stores.map(s =>
      '<article class="store">' +
        (s.flagship ? '<span class="pill pill--brand store__badge">Tienda principal</span>' : '') +
        '<h3>' + EM.esc(s.name) + '</h3>' +
        '<div class="dl">' +
          '<div class="dl__row">' + EM.icon('pin') +
            '<span><b>' + EM.esc(s.street) + '</b><br>' + EM.esc(s.city) + '</span></div>' +
          '<div class="dl__row">' + EM.icon('clock') + '<span>' + EM.esc(s.hours) + '</span></div>' +
          '<a class="dl__row" href="tel:' + EM.config.phoneRaw + '">' + EM.icon('phone') +
            '<span><b>' + EM.esc(s.phone) + '</b></span></a>' +
          '<div class="dl__row">' + EM.icon('map') + '<span>' + EM.esc(s.island) + '</span></div>' +
        '</div>' +
        '<div class="center wrapx">' +
          '<a class="btn btn--primary btn--sm" href="' + s.map + '" target="_blank" rel="noopener">' +
            'Cómo llegar' + EM.icon('arrowUR') + '</a>' +
          '<a class="btn btn--sm btn--ghost" href="tel:' + EM.config.phoneRaw + '">' +
            EM.icon('phone') + 'Llamar</a>' +
        '</div>' +
      '</article>').join('') +

      /* Recordatorio de mantenimiento: aquí se listan el resto de tiendas
         del grupo en cuanto se aporten sus direcciones. */
      '<article class="store" style="border-style:dashed;justify-content:center;text-align:center">' +
        '<span class="service__icon" style="margin:0 auto">' + EM.icon('store') + '</span>' +
        '<h3 style="font-size:1.05rem">Más tiendas del grupo</h3>' +
        '<p class="muted" style="font-size:.88rem">Consulta el resto de puntos de venta y el centro de ' +
          'oportunidades con todas las liquidaciones.</p>' +
        '<div class="center wrapx" style="justify-content:center">' +
          '<a class="btn btn--sm" href="' + EM.config.legacy + '/nuestras-tiendas">Ver listado</a>' +
          '<a class="btn btn--sm btn--ghost" href="' + EM.config.outlet + '" target="_blank" rel="noopener">Outlet</a>' +
        '</div>' +
      '</article>';
  }

  function contact() {
    const tel = $('[data-phone]');
    if (tel) {
      tel.setAttribute('href', 'tel:' + EM.config.phoneRaw);
      tel.innerHTML = EM.icon('phone') + EM.config.phone;
    }
    const wa = $('[data-wa]');
    if (wa) wa.setAttribute('href', 'https://wa.me/' + EM.config.whatsapp);
  }

  function services() {
    const box = $('[data-services]');
    if (!box) return;
    box.innerHTML = EM.services.map(s =>
      '<a class="service" href="' + EM.config.legacy + s.href + '">' +
        '<span class="service__icon">' + EM.icon(s.icon) + '</span>' +
        '<h3>' + EM.esc(s.title) + '</h3>' +
        '<p>' + EM.esc(s.text) + '</p></a>').join('');
  }

  function init() { stores(); contact(); services(); }
  EM.definePage('tiendas', init);
})(window.EM);
