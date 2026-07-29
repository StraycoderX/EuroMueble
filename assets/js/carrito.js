/* =========================================================================
   Euromueble · Página de cesta
   ========================================================================= */
(function (EM) {
  'use strict';

  const $ = EM.$;

  function lines() {
    const box = $('[data-lines]');
    const items = EM.cart.items();
    const actions = $('[data-actions]');

    if (!items.length) {
      box.innerHTML =
        '<div class="empty">' + EM.icon('cart') +
        '<h2 style="font-size:1.4rem">Tu cesta está vacía</h2>' +
        '<p>Guarda aquí lo que te guste del catálogo y lo tramitamos cuando quieras.</p>' +
        '<a class="btn btn--primary" href="catalogo.html">Explorar catálogo</a></div>';
      if (actions) actions.classList.add('hide');
      return;
    }
    if (actions) actions.classList.remove('hide');

    box.innerHTML = items.map(l =>
      '<div class="lineitem">' +
        '<a href="' + EM.href(l.p) + '"><img class="lineitem__img" src="' + EM.imgOf(l.p) +
          '" alt="" loading="lazy" data-pid="' + l.p.id + '"></a>' +
        '<div>' +
          '<p class="pcard__cat">' + EM.esc(l.p.sub) + '</p>' +
          '<a href="' + EM.href(l.p) + '" style="font-weight:500;display:block;margin:4px 0 8px">' +
            EM.esc(l.p.name) + '</a>' +
          '<p class="muted" style="font-size:.8rem">' + EM.fmt(l.p.price) + ' / unidad · Ref. ' + l.p.id + '</p>' +
        '</div>' +
        '<div class="lineitem__right">' +
          '<div class="price"><b>' + EM.fmt(l.p.price * l.qty) + '</b></div>' +
          '<div class="qty">' +
            '<button data-qty-dec="' + l.p.id + '" aria-label="Quitar una unidad">' + EM.icon('minus') + '</button>' +
            '<span class="tnum">' + l.qty + '</span>' +
            '<button data-qty-inc="' + l.p.id + '" aria-label="Añadir una unidad">' + EM.icon('plus') + '</button>' +
          '</div>' +
          '<button class="iconlink" data-remove="' + l.p.id + '">' + EM.icon('trash') + 'Quitar</button>' +
        '</div>' +
      '</div>').join('');
  }

  function totals() {
    const sub = EM.cart.subtotal();
    const threshold = EM.config.freeShippingFrom;
    const free = sub >= threshold && sub > 0;

    $('[data-sub]').textContent = EM.fmt(sub);
    $('[data-total]').textContent = EM.fmt(sub);
    $('[data-ship]').textContent = free ? 'Gratis*' : 'Según condiciones';

    const left = Math.max(0, threshold - sub);
    const msg = $('[data-ship-msg2]');
    const fill = $('[data-ship-fill2]');
    if (msg) {
      msg.innerHTML = sub === 0
        ? 'Transporte y montaje gratis a partir de <b>' + EM.fmt(threshold) + '</b>.'
        : (left > 0
            ? 'Te faltan <b>' + EM.fmt(left) + '</b> para el transporte gratis.'
            : '<b>¡Transporte gratis conseguido!</b> Según condiciones de compra.');
    }
    if (fill) fill.style.width = Math.min(100, (sub / threshold) * 100) + '%';
  }

  function cross() {
    const inCart = EM.cart.raw().map(l => String(l.id));
    let list = EM.data.byTag('entrega-inmediata').filter(p => inCart.indexOf(String(p.id)) < 0);
    if (list.length < 4) {
      list = list.concat(EM.data.all().filter(p =>
        p.stock && inCart.indexOf(String(p.id)) < 0 && list.indexOf(p) < 0));
    }
    EM.renderInto('[data-cross]', list.slice(0, 8));
  }

  function render() { lines(); totals(); cross(); }

  function init() {
    render();
    document.addEventListener('em:cart', render);

    const empty = $('[data-empty]');
    if (empty) empty.addEventListener('click', () => {
      if (!EM.cart.count()) return;
      EM.cart.clear();
      EM.toast('Cesta vaciada', 'trash');
    });

    const tel = $('[data-phone-txt]');
    if (tel) tel.textContent = EM.config.phone;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.EM);
