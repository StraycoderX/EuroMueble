/* =========================================================================
   Euromueble · Estado de compra
   Cesta y favoritos persistidos en localStorage + carrito lateral.
   Sustituir `read`/`write` por llamadas al carrito de Magento al integrar.
   ========================================================================= */
window.EM = window.EM || {};

(function (EM) {
  'use strict';

  const KEY_CART = 'em.cart.v1';
  const KEY_WISH = 'em.wish.v1';

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (_) { return []; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  /* =====================================================================
     Cesta
     ===================================================================== */
  let cart = read(KEY_CART);

  function persist() {
    write(KEY_CART, cart);
    EM.cart.render();
    document.dispatchEvent(new CustomEvent('em:cart', { detail: { items: EM.cart.items() } }));
  }

  EM.cart = {
    raw() { return cart.slice(); },

    items() {
      return cart
        .map(l => ({ p: EM.data.byId(l.id), qty: l.qty }))
        .filter(l => l.p);
    },

    count() { return cart.reduce((n, l) => n + l.qty, 0); },

    subtotal() {
      return EM.cart.items().reduce((s, l) => s + l.p.price * l.qty, 0);
    },

    has(id) { return cart.some(l => String(l.id) === String(id)); },

    add(id, qty) {
      const product = EM.data.byId(id);
      if (!product) return;
      if (!product.stock) { EM.toast('Producto sin stock disponible', 'clock'); return; }
      const line = cart.find(l => String(l.id) === String(id));
      if (line) line.qty += (qty || 1);
      else cart.push({ id: String(id), qty: qty || 1 });
      persist();
      EM.toast(product.name + ' · añadido a la cesta', 'cart');
      EM.cart.open();
    },

    setQty(id, qty) {
      const line = cart.find(l => String(l.id) === String(id));
      if (!line) return;
      line.qty = Math.max(1, Math.min(99, qty));
      persist();
    },

    remove(id) {
      cart = cart.filter(l => String(l.id) !== String(id));
      persist();
    },

    clear() { cart = []; persist(); },

    /* ---- Carrito lateral --------------------------------------------- */
    open() {
      const d = EM.$('.drawer');
      if (!d) return;
      d.classList.add('is-open');
      document.body.classList.add('is-locked');
      const btn = EM.$('[data-drawer-close]', d);
      if (btn) btn.focus();
    },
    close() {
      const d = EM.$('.drawer');
      if (!d) return;
      d.classList.remove('is-open');
      document.body.classList.remove('is-locked');
    },

    render() {
      const n = EM.cart.count();

      /* Contadores de cabecera */
      EM.$$('[data-cart-count]').forEach(el => {
        el.textContent = n;
        el.classList.toggle('on', n > 0);
      });
      EM.$$('[data-wish-count]').forEach(el => {
        const w = EM.wish.count();
        el.textContent = w;
        el.classList.toggle('on', w > 0);
      });

      const body = EM.$('[data-cart-items]');
      if (!body) return;
      const items = EM.cart.items();
      const foot = EM.$('[data-cart-foot]');

      if (!items.length) {
        body.innerHTML =
          '<div class="empty">' + EM.icon('cart') +
          '<p>Tu cesta está vacía.</p>' +
          '<a class="btn btn--primary" href="catalogo.html">Ver catálogo</a>' +
          '</div>';
        if (foot) foot.classList.add('hide');
        return;
      }
      if (foot) foot.classList.remove('hide');

      body.innerHTML = items.map(l =>
        '<div class="citem">' +
          '<img class="citem__img" src="' + EM.imgOf(l.p) + '" alt="" loading="lazy" data-pid="' + l.p.id + '">' +
          '<div class="citem__body">' +
            '<a class="citem__t" href="' + EM.href(l.p) + '">' + EM.esc(l.p.name) + '</a>' +
            '<div class="citem__p">' + EM.fmt(l.p.price * l.qty) + '</div>' +
            '<div class="citem__foot">' +
              '<div class="qty">' +
                '<button data-qty-dec="' + l.p.id + '" aria-label="Quitar una unidad">' + EM.icon('minus') + '</button>' +
                '<span class="tnum">' + l.qty + '</span>' +
                '<button data-qty-inc="' + l.p.id + '" aria-label="Añadir una unidad">' + EM.icon('plus') + '</button>' +
              '</div>' +
              '<button class="iconlink" data-remove="' + l.p.id + '">' + EM.icon('trash') + 'Quitar</button>' +
            '</div>' +
          '</div>' +
        '</div>').join('');

      /* Totales */
      const sub = EM.cart.subtotal();
      const sumEl = EM.$('[data-cart-subtotal]');
      if (sumEl) sumEl.textContent = EM.fmt(sub);

      /* Progreso hacia transporte gratis */
      const threshold = EM.config.freeShippingFrom;
      const left = Math.max(0, threshold - sub);
      const msg = EM.$('[data-ship-msg]');
      const fill = EM.$('[data-ship-fill]');
      if (msg) {
        msg.innerHTML = left > 0
          ? 'Te faltan <b>' + EM.fmt(left) + '</b> para el transporte gratis.'
          : '<b>¡Transporte gratis conseguido!</b> Según condiciones de compra.';
      }
      if (fill) fill.style.width = Math.min(100, (sub / threshold) * 100) + '%';
    }
  };

  /* =====================================================================
     Favoritos
     ===================================================================== */
  let wish = read(KEY_WISH);

  EM.wish = {
    list() { return wish.map(id => EM.data.byId(id)).filter(Boolean); },
    count() { return wish.length; },
    has(id) { return wish.indexOf(String(id)) > -1; },
    toggle(id) {
      id = String(id);
      const i = wish.indexOf(id);
      if (i > -1) wish.splice(i, 1); else wish.push(id);
      write(KEY_WISH, wish);
      EM.cart.render();
      document.dispatchEvent(new CustomEvent('em:wish'));
      return i === -1;
    }
  };

  /* =====================================================================
     Eventos delegados
     ===================================================================== */
  document.addEventListener('click', function (e) {
    const inc = e.target.closest('[data-qty-inc]');
    if (inc) {
      const id = inc.getAttribute('data-qty-inc');
      const line = cart.find(l => String(l.id) === String(id));
      EM.cart.setQty(id, (line ? line.qty : 0) + 1);
      return;
    }
    const dec = e.target.closest('[data-qty-dec]');
    if (dec) {
      const id = dec.getAttribute('data-qty-dec');
      const line = cart.find(l => String(l.id) === String(id));
      if (line && line.qty === 1) EM.cart.remove(id);
      else EM.cart.setQty(id, (line ? line.qty : 1) - 1);
      return;
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) { EM.cart.remove(rm.getAttribute('data-remove')); return; }

    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); EM.cart.open(); return; }
    if (e.target.closest('[data-drawer-close]') || e.target.closest('.drawer__scrim')) { EM.cart.close(); return; }

    const checkout = e.target.closest('[data-checkout]');
    if (checkout) {
      e.preventDefault();
      EM.toast('Demo: aquí conectaría el checkout de Magento.', 'card');
    }
  });

  document.addEventListener('keydown', e => {
    const d = EM.$('.drawer');
    if (e.key === 'Escape' && d && d.classList.contains('is-open')) EM.cart.close();
  });

  /* Sincroniza entre pestañas */
  window.addEventListener('storage', e => {
    if (e.key === KEY_CART) { cart = read(KEY_CART); EM.cart.render(); }
    if (e.key === KEY_WISH) { wish = read(KEY_WISH); EM.cart.render(); }
  });

  document.addEventListener('DOMContentLoaded', () => EM.cart.render());
})(window.EM);
