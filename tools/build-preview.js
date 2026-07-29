/* =========================================================================
   Euromueble · Empaquetado para vista previa
   -------------------------------------------------------------------------
   Une las cinco páginas, el CSS y el JS en un único archivo autocontenido
   que funciona sin servidor ni recursos externos. Se usa para publicar la
   demo; la web real sigue siendo multipágina.

     node tools/build-preview.js [destino.html]

   Diferencias con la web real, obligadas por el aislamiento del visor:
   · Tipografías del sistema en lugar de Inter/Sora (bloquea CDN de fuentes).
   · Las fotos alojadas en euromueble.es no se pueden cargar: las de producto
     usan el marcador de familia y el resto, un degradado generado.
   · La navegación entre páginas se resuelve en cliente.
   ========================================================================= */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'preview.html');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* --- Páginas -------------------------------------------------------------- */
const PAGES = [
  ['home', 'index.html'],
  ['catalogo', 'catalogo.html'],
  ['producto', 'producto.html'],
  ['carrito', 'carrito.html'],
  ['tiendas', 'tiendas.html']
];

const routes = {};
PAGES.forEach(([name, file]) => {
  const html = read(file);
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/);
  const title = html.match(/<title>([\s\S]*?)<\/title>/);
  if (!main) throw new Error('No se encontró <main> en ' + file);
  routes[file] = { name: name, title: title ? title[1].trim() : 'Euromueble', main: main[0] };
});

/* --- Estilos y scripts ---------------------------------------------------- */
const css = [read('assets/css/base.css'), read('assets/css/app.css')].join('\n');
const js = [
  'assets/js/data.js',
  'assets/js/ui.js',
  'assets/js/store.js',
  'assets/js/layout.js',
  'assets/js/home.js',
  'assets/js/catalogo.js',
  'assets/js/producto.js',
  'assets/js/carrito.js',
  'assets/js/tiendas.js'
].map(read).join('\n');

/* Sustituye las familias tipográficas por una pila del sistema que conserva
   el carácter del diseño (grotesca ancha para titulares, interfaz para texto). */
const FONTS = `
:root{
  --font: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --display: "Avenir Next", "Segoe UI Variable Display", "Helvetica Neue", system-ui, sans-serif;
}
.preview-note{
  position: fixed; left: 50%; bottom: 16px; transform: translateX(-50%);
  z-index: 150; display: flex; align-items: center; gap: 10px;
  padding: 9px 14px; border-radius: var(--r-full);
  border: 1px solid var(--line); background: color-mix(in srgb, var(--bg-2) 92%, transparent);
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  box-shadow: var(--shadow-sm); font-size: .74rem; color: var(--muted);
  max-width: calc(100vw - 32px);
}
.preview-note b{ color: var(--ink); font-weight: 600; }
.preview-note button{ color: var(--muted); display: grid; place-content: center; }
.preview-note button:hover{ color: var(--ink); }
@media (max-width: 620px){ .preview-note{ display: none; } }
`;

/* --- Router de la vista previa -------------------------------------------- */
const ROUTER = `
/* =========================================================================
   Vista previa: navegación en cliente + arte generado para las fotos
   ========================================================================= */
(function (EM) {
  'use strict';
  var ROUTES = __ROUTES__;
  var params = new URLSearchParams();

  /* Una única fuente para los parámetros de consulta */
  EM.qs = function (key) { return params.get(key); };

  /* catalogo.js sincroniza filtros con la URL: lo mantenemos en memoria
     para no tocar la barra de direcciones del visor. */
  var replaceState = history.replaceState.bind(history);
  history.replaceState = function (state, title, url) {
    if (typeof url === 'string' && (url.charAt(0) === '?' || url === location.pathname)) {
      params = new URLSearchParams(url.charAt(0) === '?' ? url.slice(1) : '');
      return;
    }
    return replaceState(state, title, url);
  };

  /* --- Arte generado para las fotos que no se pueden cargar ---------------
     Base cálida de marca siempre; sólo varía el segundo foco de luz y su
     posición, para que los bloques se distingan sin salirse de la paleta. */
  var SECOND = ['#9a7cf5', '#5fe3dc', '#ffb169', '#d9481c'];
  function hash(s) { var h = 0, i; for (i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

  EM.art = function (label) {
    var h = hash(label || 'euromueble');
    var second = SECOND[h % SECOND.length];
    var x = 62 + (h % 5) * 8;
    var y = 70 + ((h >> 4) % 4) * 7;
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">' +
        '<defs>' +
          '<linearGradient id="b" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#181310"/><stop offset="1" stop-color="#2a1e17"/></linearGradient>' +
          '<radialGradient id="g1" cx="22%" cy="18%" r="70%">' +
            '<stop offset="0" stop-color="#ff7645" stop-opacity=".7"/>' +
            '<stop offset="1" stop-color="#ff7645" stop-opacity="0"/></radialGradient>' +
          '<radialGradient id="g2" cx="' + x + '%" cy="' + y + '%" r="55%">' +
            '<stop offset="0" stop-color="' + second + '" stop-opacity=".38"/>' +
            '<stop offset="1" stop-color="' + second + '" stop-opacity="0"/></radialGradient>' +
        '</defs>' +
        '<rect width="1200" height="800" fill="url(#b)"/>' +
        '<rect width="1200" height="800" fill="url(#g1)"/>' +
        '<rect width="1200" height="800" fill="url(#g2)"/>' +
        '<g stroke="rgba(255,255,255,.06)" stroke-width="1">' +
          '<path d="M0 200h1200M0 400h1200M0 600h1200M300 0v800M600 0v800M900 0v800"/></g>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG' || img.dataset.pid || img.dataset.art) return;
    img.dataset.art = '1';
    img.src = EM.art(img.getAttribute('alt') || 'Euromueble');
  }, true);

  /* --- Navegación --------------------------------------------------------- */
  var app;

  function go(href) {
    var parts = String(href).split('?');
    var route = ROUTES[parts[0]] || ROUTES['index.html'];
    params = new URLSearchParams(parts[1] || '');

    app.innerHTML = route.main;
    document.title = route.title;

    EM.$$('.nav__link').forEach(function (a) {
      var target = (a.getAttribute('href') || '').split('?')[0];
      if (target === parts[0]) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    EM.refresh();
    if (EM.pages[route.name]) EM.pages[route.name]();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  EM.go = go;

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('.html') === -1) return;
    if (/^(https?:|tel:|mailto:)/.test(href)) return;
    e.preventDefault();
    EM.cart.close();
    var mnav = EM.$('.mnav');
    if (mnav) { mnav.classList.remove('is-open'); }
    var search = EM.$('.search');
    if (search) { search.classList.remove('is-open'); }
    document.body.classList.remove('is-locked');
    go(href);
  });

  document.addEventListener('DOMContentLoaded', function () {
    app = document.getElementById('app');
    var note = document.querySelector('.preview-note button');
    if (note) note.addEventListener('click', function () { note.parentNode.remove(); });
  });
})(window.EM);
`;

/* --- Documento ------------------------------------------------------------ */
const doc = `<title>Euromueble · Muebles y descanso en Canarias</title>

<style>
${css}
${FONTS}
</style>

<script>
try {
  var t = localStorage.getItem('em.theme');
  if (!t) t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
} catch (e) { document.documentElement.dataset.theme = 'dark'; }
</script>

<a class="skip" href="#main">Saltar al contenido</a>

<div class="ambient" aria-hidden="true">
  <div class="ambient__grid"></div>
  <div class="ambient__orb ambient__orb--1"></div>
  <div class="ambient__orb ambient__orb--2"></div>
  <div class="ambient__orb ambient__orb--3"></div>
  <div class="ambient__noise"></div>
</div>

<div data-layout="header" data-active="Inicio"></div>

<div id="app">
${routes['index.html'].main}
</div>

<div data-layout="footer"></div>

<div class="preview-note">
  <span><b>Vista previa</b> · fotos y tipografías reales sólo en el sitio publicado</span>
  <button type="button" aria-label="Cerrar aviso">&times;</button>
</div>

<script>
${js}
</script>

<script>
${ROUTER.replace('__ROUTES__', JSON.stringify(routes))}
</script>
`;

fs.writeFileSync(OUT, doc);
console.log('Escrito ' + OUT + ' (' + (doc.length / 1024).toFixed(0) + ' KB)');
