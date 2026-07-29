/* =========================================================================
   Euromueble · Layout compartido
   Genera cabecera, mega-menú, menú móvil, buscador, carrito lateral y pie
   a partir de la taxonomía (EM.categories) para no duplicar marcado.
   En la integración con Magento cada bloque pasa a ser un .phtml.
   ========================================================================= */
(function (EM) {
  'use strict';

  const C = EM.config;
  const cat = slug => EM.categories.find(c => c.slug === slug);
  const catalogo = (params) => 'catalogo.html' + (params ? '?' + params : '');

  /* ---------------------------------------------------------------------
     Mega-menú de una categoría
     --------------------------------------------------------------------- */
  function megaFor(c) {
    return '' +
      '<div class="mega" role="group" aria-label="' + EM.esc(c.name) + '">' +
        '<div class="mega__aside">' +
          '<div>' +
            '<span class="eyebrow">' + EM.esc(c.name) + '</span>' +
            '<h3>' + EM.esc(c.blurb) + '</h3>' +
            '<p>Transporte y montaje incluidos según condiciones. Entrega en toda Canarias.</p>' +
          '</div>' +
          '<a class="btn btn--primary btn--sm" href="' + catalogo('cat=' + c.slug) + '">' +
            'Ver todo ' + EM.esc(c.name.toLowerCase()) + EM.icon('arrow') + '</a>' +
        '</div>' +
        '<div class="mega__cols">' +
          c.children.map(sub =>
            '<a class="mega__link" href="' + catalogo('cat=' + c.slug + '&sub=' + encodeURIComponent(sub)) + '">' +
              EM.esc(sub) + EM.icon('arrowUR') + '</a>').join('') +
        '</div>' +
      '</div>';
  }

  /* Mega-menú "Catálogo": todas las familias */
  function megaAll() {
    return '' +
      '<div class="mega" role="group" aria-label="Todas las categorías">' +
        '<div class="mega__aside">' +
          '<div>' +
            '<span class="eyebrow">Catálogo completo</span>' +
            '<h3>Todo para tu hogar, en una sola tienda</h3>' +
            '<p>Más de 145 mesas y 120 armarios diferentes expuestos. Ven a verlos o compra online.</p>' +
          '</div>' +
          '<a class="btn btn--primary btn--sm" href="' + catalogo() + '">Explorar catálogo' + EM.icon('arrow') + '</a>' +
        '</div>' +
        '<div class="mega__cols">' +
          EM.categories.map(c =>
            '<a class="mega__link" href="' + catalogo('cat=' + c.slug) + '">' +
              EM.esc(c.name) + '<span>' + c.children.length + '</span></a>').join('') +
        '</div>' +
      '</div>';
  }

  /* ---------------------------------------------------------------------
     Cabecera
     --------------------------------------------------------------------- */
  const NAV = ['sofas', 'dormitorios', 'descanso', 'jardin'];

  function header(active) {
    const item = (label, content, href) =>
      '<li class="nav__item">' +
        '<a class="nav__link" href="' + href + '"' + (active === label ? ' aria-current="page"' : '') + '>' +
          EM.esc(label) + (content ? EM.icon('chevron') : '') + '</a>' +
        (content || '') +
      '</li>';

    return '' +
    '<div class="topbar">' +
      '<div class="wrap topbar__in">' +
        '<span class="center">' + EM.icon('truck') +
          '<span>Transporte y montaje gratis en Canarias <b>según condiciones</b></span></span>' +
        '<ul class="topbar__list hide-md">' +
          '<li><a href="tiendas.html">Nuestras tiendas</a></li>' +
          '<li><a href="' + C.legacy + '/nuestros-folletos">Folletos</a></li>' +
          '<li><a href="' + C.legacy + '/financiacion">Financiación</a></li>' +
          '<li><a href="tel:' + C.phoneRaw + '"><b>' + C.phone + '</b></a></li>' +
        '</ul>' +
      '</div>' +
    '</div>' +

    '<header class="header">' +
      '<div class="wrap header__in">' +
        '<a class="brand" href="index.html" aria-label="' + C.brand + ', inicio">' +
          '<span class="brand__mark" aria-hidden="true">E</span>' +
          '<span><span class="brand__name">' + C.brand + '</span>' +
          '<span class="brand__sub">Canarias</span></span>' +
        '</a>' +

        '<nav class="nav" aria-label="Principal">' +
          '<ul class="nav__list">' +
            item('Catálogo', megaAll(), catalogo()) +
            NAV.map(s => { const c = cat(s); return item(c.name, megaFor(c), catalogo('cat=' + s)); }).join('') +
            item('Cocinas', '', C.legacy + '/cocinas') +
            item('Ofertas', '', catalogo('tag=oferta')) +
          '</ul>' +
        '</nav>' +

        '<div class="header__actions">' +
          '<button class="iconbtn" data-search-open aria-label="Buscar productos">' + EM.icon('search') + '</button>' +
          '<button class="iconbtn" data-theme-toggle aria-label="Cambiar tema"></button>' +
          '<a class="iconbtn hide-sm" href="' + catalogo('fav=1') + '" aria-label="Favoritos">' + EM.icon('heart') +
            '<span class="iconbtn__count" data-wish-count>0</span></a>' +
          '<a class="iconbtn hide-sm" href="' + C.legacy + '/customer/account/" aria-label="Mi cuenta">' + EM.icon('user') + '</a>' +
          '<button class="iconbtn" data-cart-open aria-label="Abrir cesta">' + EM.icon('cart') +
            '<span class="iconbtn__count" data-cart-count>0</span></button>' +
          '<button class="iconbtn burger" data-mnav-open aria-label="Abrir menú">' + EM.icon('menu') + '</button>' +
        '</div>' +
      '</div>' +
    '</header>' +

    /* ---- Menú móvil ---- */
    '<div class="mnav" role="dialog" aria-modal="true" aria-label="Menú">' +
      '<div class="mnav__scrim"></div>' +
      '<div class="mnav__panel">' +
        '<div class="mnav__head">' +
          '<span class="brand"><span class="brand__mark" aria-hidden="true">E</span>' +
          '<span class="brand__name">' + C.brand + '</span></span>' +
          '<button class="iconbtn" data-mnav-close aria-label="Cerrar menú">' + EM.icon('close') + '</button>' +
        '</div>' +
        '<div class="mnav__body">' +
          EM.categories.map(c =>
            '<div class="acc">' +
              '<button class="acc__head">' + EM.esc(c.name) + EM.icon('plus') + '</button>' +
              '<div class="acc__body"><div class="acc__inner">' +
                '<a href="' + catalogo('cat=' + c.slug) + '"><b>Ver todo</b></a>' +
                c.children.map(s =>
                  '<a href="' + catalogo('cat=' + c.slug + '&sub=' + encodeURIComponent(s)) + '">' +
                    EM.esc(s) + '</a>').join('') +
              '</div></div>' +
            '</div>').join('') +
          '<div class="acc"><button class="acc__head" onclick="location.href=\'tiendas.html\'">Nuestras tiendas</button></div>' +
          '<div class="acc"><button class="acc__head" onclick="location.href=\'' + C.outlet + '\'">Outlet</button></div>' +
        '</div>' +
        '<div class="mnav__foot">' +
          '<a class="btn btn--primary btn--block" href="tel:' + C.phoneRaw + '">' + EM.icon('phone') + C.phone + '</a>' +
          '<a class="btn btn--block" href="' + C.legacy + '/customer/account/">' + EM.icon('user') + 'Mi cuenta</a>' +
        '</div>' +
      '</div>' +
    '</div>' +

    /* ---- Buscador ---- */
    '<div class="search" role="dialog" aria-modal="true" aria-label="Buscar">' +
      '<div class="search__scrim"></div>' +
      '<div class="search__panel">' +
        '<div class="search__bar">' + EM.icon('search') +
          '<input class="search__input" type="search" placeholder="Busca sofás, colchones, mesas…" ' +
            'aria-label="Buscar productos" autocomplete="off">' +
          '<kbd class="search__kbd">ESC</kbd>' +
          '<button class="iconbtn" data-search-close aria-label="Cerrar buscador">' + EM.icon('close') + '</button>' +
        '</div>' +
        '<div class="search__results"></div>' +
        '<div class="search__hint">Escribe para buscar en todo el catálogo' +
          '<div class="search__tags">' +
            ['colchón', 'sofá', 'mesa de centro', 'armario', 'terraza']
              .map(t => '<button class="pill" data-search-term="' + t + '">' + t + '</button>').join('') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    /* ---- Carrito lateral ---- */
    '<div class="drawer" role="dialog" aria-modal="true" aria-label="Cesta de la compra">' +
      '<div class="drawer__scrim"></div>' +
      '<div class="drawer__panel">' +
        '<div class="drawer__head">' +
          '<h2>Tu cesta</h2>' +
          '<button class="iconbtn" data-drawer-close aria-label="Cerrar cesta">' + EM.icon('close') + '</button>' +
        '</div>' +
        '<div class="drawer__body" data-cart-items></div>' +
        '<div class="drawer__foot hide" data-cart-foot>' +
          '<div class="ship">' +
            '<span data-ship-msg></span>' +
            '<div class="ship__bar"><div class="ship__fill" data-ship-fill></div></div>' +
          '</div>' +
          '<div class="totals">' +
            '<div class="totals__row"><span>Subtotal</span><span data-cart-subtotal>0,00 €</span></div>' +
            '<div class="totals__row"><span>Transporte</span><span>Según condiciones</span></div>' +
            '<div class="totals__row"><span>' + C.taxLabel + '</span><span>—</span></div>' +
          '</div>' +
          '<a class="btn btn--primary btn--block btn--lg" href="carrito.html">Tramitar pedido' + EM.icon('arrow') + '</a>' +
          '<button class="iconlink" data-drawer-close style="justify-self:center">Seguir comprando</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ---------------------------------------------------------------------
     Pie
     --------------------------------------------------------------------- */
  const GUIA = [
    ['Cómo comprar y plazos de entrega', '/como-comprar'],
    ['Entrega de mercancía', '/entrega-de-mercancia'],
    ['Compras a pedir a fábrica', '/compras-a-pedir-a-fabrica'],
    ['Financiación', '/financiacion'],
    ['Tarifas de transporte y montaje', '/formas-de-envio'],
    ['Devoluciones y cambios', '/devoluciones'],
    ['Preguntas frecuentes', '/preguntas-frecuentes']
  ];
  const ATENCION = [
    ['Reclamaciones', '/reclamaciones'],
    ['Contacto', '/contacto'],
    ['Aviso legal', '/aviso-legal'],
    ['Política de privacidad', '/politica-de-privacidad'],
    ['Política de cookies', '/politica-de-cookies']
  ];

  function footer() {
    return '' +
    '<footer class="footer">' +
      '<div class="wrap footer__grid">' +
        '<div>' +
          '<a class="brand" href="index.html">' +
            '<span class="brand__mark" aria-hidden="true">E</span>' +
            '<span><span class="brand__name">' + C.brand + '</span>' +
            '<span class="brand__sub">' + EM.esc(C.claim) + '</span></span>' +
          '</a>' +
          '<div class="dl" style="margin-top:22px">' +
            '<a class="dl__row" href="' + C.map + '" target="_blank" rel="noopener">' + EM.icon('pin') +
              '<span>' + C.address.street + '<br>' + C.address.zip + ' ' + C.address.city + ', ' + C.address.region + '</span></a>' +
            '<a class="dl__row" href="tel:' + C.phoneRaw + '">' + EM.icon('phone') + '<b>' + C.phone + '</b></a>' +
            '<a class="dl__row" href="mailto:' + C.email + '">' + EM.icon('mail') + '<span>' + C.email + '</span></a>' +
          '</div>' +
          '<div class="social" style="margin-top:22px">' +
            '<a href="' + C.facebook + '" target="_blank" rel="noopener" aria-label="Facebook">' + EM.icon('facebook') + '</a>' +
            '<a href="https://wa.me/' + C.whatsapp + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + EM.icon('whatsapp') + '</a>' +
            '<a href="mailto:' + C.email + '" aria-label="Email">' + EM.icon('mail') + '</a>' +
          '</div>' +
        '</div>' +

        '<div>' +
          '<h4>Categorías</h4>' +
          '<div class="footer__links">' +
            EM.categories.slice(0, 8).map(c =>
              '<a href="' + catalogo('cat=' + c.slug) + '">' + EM.esc(c.name) + '</a>').join('') +
            '<a href="' + C.outlet + '" target="_blank" rel="noopener">Centro de oportunidades</a>' +
          '</div>' +
        '</div>' +

        '<div>' +
          '<h4>Guía de compra</h4>' +
          '<div class="footer__links">' +
            GUIA.map(l => '<a href="' + C.legacy + l[1] + '">' + l[0] + '</a>').join('') +
          '</div>' +
        '</div>' +

        '<div>' +
          '<h4>Atención al cliente</h4>' +
          '<div class="footer__links">' +
            ATENCION.map(l => '<a href="' + C.legacy + l[1] + '">' + l[0] + '</a>').join('') +
            '<a href="https://herreraalonso.trusty.report/" target="_blank" rel="noopener">Canal de denuncias</a>' +
            '<a href="' + C.legacy + '/portal-empleo">Ofertas de empleo</a>' +
          '</div>' +
          '<img src="' + EM.media.kitDigital + '" alt="Kit Digital" loading="lazy" ' +
            'style="margin-top:22px;border-radius:10px;max-width:200px">' +
        '</div>' +
      '</div>' +

      '<div class="wrap"><p class="eu-note">Financiado por la Unión Europea – NextGenerationEU. Los puntos de ' +
        'vista y opiniones expresados son únicamente los del autor y no reflejan necesariamente los de la Unión ' +
        'Europea o la Comisión Europea.</p></div>' +

      '<div class="wrap footer__bottom">' +
        '<span>© <span data-year></span> ' + C.brand + ' · ' + C.legal + '. Todos los derechos reservados.</span>' +
        '<span class="center">' + EM.icon('shield') + '<span>Pago seguro · ' + C.taxLabel + '</span></span>' +
      '</div>' +
    '</footer>' +

    '<div class="fab">' +
      '<button class="fab__top" aria-label="Volver arriba">' + EM.icon('arrowUp') + '</button>' +
      '<a class="wa" href="https://wa.me/' + C.whatsapp + '" target="_blank" rel="noopener" ' +
        'aria-label="Escríbenos por WhatsApp">' + EM.icon('whatsapp') + '</a>' +
    '</div>';
  }

  /* ---------------------------------------------------------------------
     Montaje
     --------------------------------------------------------------------- */
  const h = document.querySelector('[data-layout="header"]');
  if (h) h.outerHTML = header(h.getAttribute('data-active'));
  const f = document.querySelector('[data-layout="footer"]');
  if (f) f.outerHTML = footer();
})(window.EM);
