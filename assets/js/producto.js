/* =========================================================================
   Euromueble · Ficha de producto
   ========================================================================= */
(function (EM) {
  'use strict';

  const $ = EM.$;

  function notFound() {
    $('[data-pdp]').innerHTML =
      '<div class="empty" style="grid-column:1/-1">' + EM.icon('search') +
      '<h2>No encontramos ese producto</h2>' +
      '<p>Puede que ya no esté disponible o que el enlace sea antiguo.</p>' +
      '<a class="btn btn--primary" href="catalogo.html">Volver al catálogo</a></div>';
  }

  function crumbs(p) {
    const c = EM.data.category(p.cat);
    $('[data-crumbs]').innerHTML =
      '<a href="index.html">Inicio</a>' + EM.icon('right') +
      '<a href="catalogo.html">Catálogo</a>' + EM.icon('right') +
      '<a href="catalogo.html?cat=' + p.cat + '">' + EM.esc(c ? c.name : p.cat) + '</a>' +
      EM.icon('right') + '<span>' + EM.esc(p.sub) + '</span>';
  }

  /* Cuota orientativa de financiación a 12 meses */
  function monthly(price) { return price / 12; }

  function render(p) {
    document.title = p.name + ' · Euromueble';
    const meta = document.querySelector('meta[name=description]');
    if (meta) meta.setAttribute('content', p.name + ' — ' + EM.fmt(p.price) + '. Entrega y montaje en toda Canarias.');

    const off = EM.discount(p);
    const wished = EM.wish.has(p.id);
    const img = EM.imgOf(p);

    $('[data-pdp]').innerHTML = '' +
      /* ---------------- Galería ---------------- */
      '<div class="gallery">' +
        '<div class="gallery__main">' +
          '<img src="' + img + '" alt="' + EM.esc(p.name) + '" data-pid="' + p.id + '" data-main>' +
          (off ? '<span class="flag flag--off" style="position:absolute;top:18px;left:18px">−' + off + '%</span>' : '') +
        '</div>' +
        (p.img
          ? '<div class="gallery__thumbs">' +
              '<button class="gallery__thumb on"><img src="' + img + '" alt="Vista 1" data-pid="' + p.id + '"></button>' +
            '</div>'
          : '') +
      '</div>' +

      /* ---------------- Información ---------------- */
      '<div class="pdp__info">' +
        '<div>' +
          '<span class="eyebrow">' + EM.esc(p.sub) + '</span>' +
          '<h1 class="pdp__title" style="margin-top:12px">' + EM.esc(p.name) + '</h1>' +
          '<p class="muted" style="margin-top:10px;font-size:.85rem">Ref. ' + p.id + ' · ' + EM.config.taxLabel + '</p>' +
        '</div>' +

        '<div class="price price--lg">' +
          '<b>' + EM.fmt(p.price) + '</b>' +
          (p.old ? '<s>' + EM.fmt(p.old) + '</s>' : '') +
          (off ? '<span class="pill pill--brand">Ahorras ' + EM.fmt(p.old - p.price) + '</span>' : '') +
        '</div>' +

        '<div class="finance">' + EM.icon('card') +
          '<div><b>' + EM.fmt(monthly(p.price)) + '/mes</b>' +
          '<p>En 12 meses sin intereses. Financiación sujeta a aprobación.</p></div>' +
        '</div>' +

        '<div class="pdp__buy">' +
          (p.stock
            ? '<button class="btn btn--primary btn--lg" data-buy="' + p.id + '">' +
                EM.icon('cart') + 'Añadir a la cesta</button>'
            : '<button class="btn btn--lg" disabled>Sin stock ahora mismo</button>') +
          '<button class="btn btn--lg btn--ghost' + (wished ? ' is-on' : '') + '" data-wish="' + p.id + '" ' +
            'aria-pressed="' + (wished ? 'true' : 'false') + '">' +
            EM.icon('heart') + '<span>' + (wished ? 'Guardado' : 'Guardar') + '</span></button>' +
        '</div>' +

        (p.stock
          ? '<p class="center" style="font-size:.85rem;color:var(--ok)">' + EM.icon('check') +
            'Disponible · te lo llevamos y montamos en toda Canarias</p>'
          : '<p class="center muted" style="font-size:.85rem">' + EM.icon('clock') +
            'Consulta disponibilidad y plazo en tienda o por teléfono</p>') +

        /* ---------------- Confianza ---------------- */
        '<div class="trust">' +
          '<div class="trust__i">' + EM.icon('truck') +
            '<div><b>Transporte gratis</b><span>Según condiciones de compra</span></div></div>' +
          '<div class="trust__i">' + EM.icon('tools') +
            '<div><b>Montaje incluido</b><span>Lo dejamos instalado</span></div></div>' +
          '<div class="trust__i">' + EM.icon('recycle') +
            '<div><b>Retirada del usado</b><span>Nos llevamos el viejo</span></div></div>' +
          '<div class="trust__i">' + EM.icon('store') +
            '<div><b>Recogida en tienda</b><span>Telde, Gran Canaria</span></div></div>' +
        '</div>' +

        /* ---------------- Detalle ---------------- */
        '<div class="accordion">' +
          item('Descripción', '<p>' + EM.esc(p.name) + '. Pieza de la familia <b>' + EM.esc(p.sub) +
            '</b> dentro de nuestra colección de <b>' + EM.esc(EM.data.catName(p.cat)) + '</b>. ' +
            'Consulta acabados y medidas disponibles en tienda: trabajamos también fabricación a medida.</p>', true) +
          item('Características', '<div class="spec">' +
            '<div><span>Referencia</span><b>' + p.id + '</b></div>' +
            '<div><span>Familia</span><b>' + EM.esc(EM.data.catName(p.cat)) + '</b></div>' +
            '<div><span>Tipo</span><b>' + EM.esc(p.sub) + '</b></div>' +
            '<div><span>Disponibilidad</span><b>' + (p.stock ? 'En stock' : 'Bajo pedido') + '</b></div>' +
            '<div><span>Impuestos</span><b>' + EM.config.taxLabel + '</b></div>' +
            '</div>') +
          item('Entrega y montaje', '<p>Servimos en toda Canarias. El transporte y el montaje son ' +
            'gratuitos según las condiciones de compra vigentes; consúltalas en ' +
            '<a href="' + EM.config.legacy + '/formas-de-envio" style="text-decoration:underline">tarifas de transporte y montaje</a>. ' +
            'Los artículos bajo pedido a fábrica tienen un plazo estimado que te confirmamos al tramitar el pedido.</p>') +
          item('Devoluciones', '<p>Dispones de 14 días naturales para desistir de la compra según la normativa ' +
            'vigente. Consulta el detalle en <a href="' + EM.config.legacy + '/devoluciones" ' +
            'style="text-decoration:underline">devoluciones y cambios</a>.</p>') +
        '</div>' +

        '<div class="center wrapx" style="font-size:.85rem">' +
          '<a class="iconlink" href="tel:' + EM.config.phoneRaw + '">' + EM.icon('phone') + 'Consultar por teléfono</a>' +
          '<a class="iconlink" href="https://wa.me/' + EM.config.whatsapp + '?text=' +
            encodeURIComponent('Hola, me interesa: ' + p.name + ' (ref. ' + p.id + ')') +
            '" target="_blank" rel="noopener">' + EM.icon('whatsapp') + 'Preguntar por WhatsApp</a>' +
        '</div>' +
      '</div>';

    function item(title, body, open) {
      return '<div class="accordion__item' + (open ? ' is-open' : '') + '">' +
        '<button class="accordion__head">' + title + EM.icon('plus') + '</button>' +
        '<div class="accordion__body"><div class="accordion__inner">' + body + '</div></div>' +
      '</div>';
    }

    EM.initAccordions();

    /* Añadir a la cesta */
    const buy = $('[data-buy]');
    if (buy) buy.addEventListener('click', () => EM.cart.add(p.id, 1));

    /* Datos estructurados del producto */
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      sku: String(p.id),
      category: EM.data.catName(p.cat) + ' > ' + p.sub,
      image: p.img || undefined,
      brand: { '@type': 'Brand', name: 'Euromueble' },
      offers: {
        '@type': 'Offer',
        price: p.price.toFixed(2),
        priceCurrency: 'EUR',
        availability: p.stock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: location.href
      }
    });
    document.head.appendChild(ld);
  }

  /* Estado del botón de favoritos en la ficha */
  document.addEventListener('em:wish', () => {
    const btn = document.querySelector('.pdp__buy [data-wish]');
    if (!btn) return;
    const on = EM.wish.has(btn.getAttribute('data-wish'));
    const label = btn.querySelector('span');
    if (label) label.textContent = on ? 'Guardado' : 'Guardar';
  });

  function services() {
    const box = $('[data-services]');
    if (!box) return;
    box.innerHTML = EM.services.map(s =>
      '<a class="service" href="' + EM.config.legacy + s.href + '">' +
        '<span class="service__icon">' + EM.icon(s.icon) + '</span>' +
        '<h3>' + EM.esc(s.title) + '</h3>' +
        '<p>' + EM.esc(s.text) + '</p></a>').join('');
  }

  function init() {
    const p = EM.data.byId(EM.qs('id'));
    if (!p) { notFound(); services(); return; }
    crumbs(p);
    render(p);
    EM.renderInto('[data-related]', EM.data.related(p, 8));
    services();

    /* Vistos recientemente (para futuras recomendaciones) */
    try {
      const key = 'em.seen.v1';
      const seen = JSON.parse(localStorage.getItem(key) || '[]').filter(x => x !== String(p.id));
      seen.unshift(String(p.id));
      localStorage.setItem(key, JSON.stringify(seen.slice(0, 12)));
    } catch (_) {}
  }
  EM.definePage('producto', init);
})(window.EM);
