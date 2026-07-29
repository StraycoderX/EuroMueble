# Euromueble · Rediseño moderno

Lavado de cara completo del front de [euromueble.es](https://euromueble.es): una tienda de
muebles con estética actual (oscura por defecto, con tema claro), navegación real por
familias, buscador instantáneo, filtros de catálogo, ficha de producto y cesta persistente.

Todo el contenido —categorías, subcategorías, productos, precios, banners, teléfono,
dirección y enlaces del pie— está tomado de la web actual, así que lo que se ve es el
catálogo real, no un relleno de ejemplo.

## Cómo verlo

No hay build ni dependencias. Basta con abrir `index.html`, aunque es preferible servirlo:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Páginas

| Archivo | Qué es |
|---|---|
| `index.html` | Home: hero, familias, novedades, primer precio, jardín, servicios, tienda, newsletter |
| `catalogo.html` | Listado con filtros, orden y URL compartible (`?cat=`, `?sub=`, `?tag=`, `?q=`, `?fav=1`) |
| `producto.html` | Ficha: galería, precio, cuota de financiación, disponibilidad, detalle y relacionados |
| `carrito.html` | Cesta completa con resumen, progreso de transporte gratis y venta cruzada |
| `tiendas.html` | Tienda física con dirección, horarios y accesos directos a llamar / cómo llegar |

## Qué incluye

- **Cabecera fija** con mega-menú generado desde la taxonomía (13 familias, ~90 subcategorías).
- **Buscador tipo command-palette**: se abre con el icono, con `⌘/Ctrl + K` o con `/`.
- **Cesta lateral** persistente en `localStorage`, con cantidades y barra de transporte gratis.
- **Favoritos** persistentes, filtrables desde el catálogo (`?fav=1`).
- **Tema oscuro/claro** con conmutador y preferencia recordada.
- **Movimiento**: transición nativa entre páginas (`@view-transition`), revelado atado al
  scroll (`animation-timeline: view()`), foco que sigue al cursor, inclinación 3D en el bento
  y cinta cinética de doble carril. Todo es mejora progresiva: sin soporte, la página se ve
  igual pero quieta.
- **Accesibilidad**: navegación por teclado en menús y overlays, `aria-*`, foco visible,
  enlace de salto al contenido y respeto a `prefers-reduced-motion`.
- **SEO**: datos estructurados de `Organization`/`Store` en la home y de `Product` en la ficha,
  Open Graph y metadatos por página.
- **Sin dependencias**: HTML, CSS y JavaScript propios. Sólo se cargan fuentes de Google.

## Estructura

```
assets/
  css/base.css      Tokens de diseño, reset, tipografía, botones y formularios
  css/app.css       Componentes y páginas
  css/motion.css    Transiciones de vista, revelado por scroll, foco e inclinación
  js/data.js        Catálogo, taxonomía, tiendas y configuración de negocio
  js/ui.js          Iconos, helpers, tema, cabecera, buscador, carruseles, tarjetas
  js/store.js       Cesta y favoritos (localStorage) + carrito lateral
  js/layout.js      Cabecera, mega-menú, menú móvil y pie compartidos
  js/{home,catalogo,producto,carrito,tiendas}.js
```

El orden de carga importa: `data.js` → `ui.js` → `store.js` → `layout.js` → script de página.

## Cómo editarlo

Casi todo se toca en **`assets/js/data.js`**:

- `EM.config` — teléfono, email, dirección, horarios, redes y umbral de transporte gratis.
- `EM.categories` — familias y subcategorías del menú.
- `EM.products` — catálogo. Cada producto: `id`, `name`, `price`, `old`, `cat`, `sub`,
  `img`, `stock` y `tags` (`novedad`, `oferta`, `primer-precio`, `entrega-inmediata`, `destacado`).
- `EM.stores` — tiendas físicas.

## Antes de publicar

Tres cosas que conviene revisar con administración, marcadas también como comentarios en el código:

1. **`EM.config.freeShippingFrom`** (`data.js`) está en `300 €` como valor orientativo para la
   barra de progreso del carrito. Ajustar al umbral real de la política de transporte.
2. **Financiación**: la ficha muestra la cuota como `precio / 12` con la nota «sujeta a
   aprobación». Sustituir por el cálculo de la financiera con su TIN/TAE reales.
3. **Tiendas**: `EM.stores` sólo contiene la dirección de Telde, que es la única verificable en
   los datos estructurados de la web actual. Añadir el resto de puntos de venta.

Además:

- **Imágenes**: se enlazan las de `euromueble.es` (banners, folleto, fotos de producto). Los
  artículos que aún no tienen foto en el servidor muestran un marcador vectorial generado con
  el icono de su familia; si una imagen falla al cargar, se sustituye por ese mismo marcador.
- **Checkout**: el botón «Tramitar pedido» es una demo. Al integrar, apuntarlo al checkout de
  Magento y reemplazar `read`/`write` de `store.js` por las llamadas al carrito real.
- **Cookies**: falta el banner de consentimiento; el actual es un módulo de Magento y debe
  reinstalarse sobre esta capa.

## Integración con Magento

El front está pensado para portarse por partes, sin rehacer la tienda entera:

- `layout.js` genera cabecera, mega-menú y pie desde datos → pasan a plantillas `.phtml`
  alimentadas por la estructura de categorías de Magento.
- `EM.card()` es la plantilla de tarjeta de producto → equivale al `list.phtml` del tema.
- `catalogo.js` replica la lógica de capa de filtros → sustituible por el layered navigation
  nativo manteniendo el mismo marcado y CSS.
- `base.css` y `app.css` se pueden cargar tal cual desde el tema, ya que no dependen de nada
  del framework.
