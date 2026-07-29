/* =========================================================================
   Euromueble · Capa de datos
   -------------------------------------------------------------------------
   Catálogo, taxonomía y datos de empresa extraídos de la web actual
   (euromueble.es). Sustituir por la API / GraphQL de Magento cuando se
   integre: basta con que `EM.data.products` mantenga la misma forma.
   ========================================================================= */
window.EM = window.EM || {};

(function (EM) {
  'use strict';

  /* ---------------------------------------------------------------------
     Configuración de negocio
     NOTA: revisar estos valores con administración antes de publicar.
     --------------------------------------------------------------------- */
  EM.config = {
    brand: 'Euromueble',
    legal: 'Herrera Alonso, SLU',
    claim: 'Muebles y descanso en Canarias',
    phone: '+34 928 69 83 55',
    phoneRaw: '+34928698355',
    whatsapp: '34928698355',
    email: 'info@euromueble.es',
    address: {
      street: 'Calle Vinagrillo, 10',
      city: 'Telde',
      region: 'Las Palmas',
      zip: '35213',
      country: 'ES'
    },
    hours: [
      { d: 'Lunes a viernes', h: '09:00 – 13:00 · 16:00 – 20:00' },
      { d: 'Sábado', h: '09:00 – 13:00' },
      { d: 'Domingo', h: 'Cerrado' }
    ],
    map: 'https://share.google/uBQcPGUhiOHSAVebq',
    facebook: 'https://www.facebook.com/Euromueble',
    outlet: 'https://outletmueblescanarias.es/',
    legacy: 'https://euromueble.es',
    // Umbral orientativo para la barra de "transporte gratis" del carrito.
    // Ajustar al valor real de la política comercial vigente.
    freeShippingFrom: 300,
    // IGIC (Canarias) ya incluido en los precios mostrados.
    taxLabel: 'IGIC incluido'
  };

  const MEDIA = 'https://euromueble.es/media';
  const CAT_IMG = MEDIA + '/catalog/product/cache/b6e95d20f51cda3304572bc97bd7180d';

  /* Banners y creatividades ya existentes en el servidor actual */
  EM.media = {
    logo: 'https://euromueble.es/pub/media/logo/stores/1/ANAGRAMA.jpg',
    folleto: MEDIA + '/wysiwyg/banner_folleto_euromueble_abril_26.jpg',
    folletoPdf: MEDIA + '/wysiwyg/folletos/folleto-euromueble-abril-2026.pdf',
    tiendas: MEDIA + '/wysiwyg/bloque01/nuestras-tiendas.jpg',
    entregaInmediata: MEDIA + '/wysiwyg/blog/banner_entrega_inmediata.jpg',
    catalogo: MEDIA + '/wysiwyg/portadas-catalogos/mueblescatalogo.jpg',
    colchones: MEDIA + '/wysiwyg/fotos_home/colchonesnew.jpg',
    servicios: MEDIA + '/wysiwyg/fotos_home/arengashome.jpg',
    cocina: 'https://euromueble.es/pub/media/wysiwyg/banners/cocina_final.jpg',
    family: 'https://euromueble.es/pub/media/wysiwyg/banners/family_2.jpg',
    kitDigital: 'https://euromueble.es/pub/media/wysiwyg/bloque01/kit-digital.jpg'
  };

  /* ---------------------------------------------------------------------
     Taxonomía (mega-menú)
     --------------------------------------------------------------------- */
  EM.categories = [
    {
      slug: 'sofas', name: 'Sofás', icon: 'sofa', href: '/todo-sofa',
      blurb: 'Chaise longue, sofás cama y sillones',
      children: [
        'Chaise longue', 'Chaise longue con cama', 'Sillones con brazos',
        'Sofás 2 plazas', 'Sofás 3 plazas', 'Sofás cama', 'Pouff'
      ]
    },
    {
      slug: 'salon', name: 'Salón', icon: 'tv', href: '/todo-salon',
      blurb: 'Apilables, vitrinas y mesas de centro',
      children: [
        'Aparadores', 'Apilables', 'Librerías', 'Mesas auxiliares',
        'Mesas de centro', 'Muebles de televisión', 'Vitrinas'
      ]
    },
    {
      slug: 'comedores', name: 'Comedores', icon: 'table', href: '/todo-comedores',
      blurb: '145 mesas diferentes en tienda',
      children: ['Conjunto mesas y sillas', 'Mesas de comedor y cocina', 'Sillas de comedor']
    },
    {
      slug: 'dormitorios', name: 'Dormitorios', icon: 'bed', href: '/todo-dormitorios',
      blurb: '120 armarios diferentes en tienda',
      children: [
        'Armarios', 'Camas', 'Chifonieres', 'Cómodas', 'Juvenil',
        'Juvenil a la carta', 'Literas', 'Matrimonio', 'Mesas de noche',
        'Escritorios', 'Tocadores', 'Vestidores', 'Zapateras'
      ]
    },
    {
      slug: 'descanso', name: 'Descanso', icon: 'moon', href: '/todo-descanso',
      blurb: 'Colchones, canapés y somieres',
      children: [
        'Almohadas', 'Bases tapizadas', 'Camas plegables', 'Canapés',
        'Colchones', 'Juegos de patas', 'Somieres'
      ]
    },
    {
      slug: 'jardin', name: 'Jardín y hostelería', icon: 'sun', href: '/todo-jardin',
      blurb: 'Terraza, tumbonas y sombrillas',
      children: [
        'Balancines', 'Conjunto mesas y sillas', 'Sillas terraza y taburetes',
        'Sofás de jardín', 'Sombrillas', 'Tumbonas', 'Complementos de jardín'
      ]
    },
    {
      slug: 'auxiliares', name: 'Auxiliares', icon: 'box', href: '/todo-auxiliares2',
      blurb: 'Entraditas, estanterías y multiusos',
      children: [
        'Aparadores', 'Chifonieres', 'Cómodas', 'Entradas y consolas',
        'Estanterías', 'Mesas de centro', 'Escritorios', 'Mesas de noche',
        'Muebles de televisión', 'Muebles multiuso', 'Tocadores', 'Zapateras'
      ]
    },
    {
      slug: 'cocinas', name: 'Cocinas', icon: 'chef', href: '/cocinas',
      blurb: 'Diseño y montaje a medida',
      children: ['Muebles de cocina', 'Encimeras', 'Proyecto a medida']
    },
    {
      slug: 'electrodomesticos', name: 'Electrodomésticos', icon: 'plug', href: '/todo-electrodomesticos',
      blurb: 'Frío, lavado, cocción y TV',
      children: [
        'Calentadores', 'Cocina fuegos', 'Congeladores', 'Extractores',
        'Fregaderos', 'Frigoríficos', 'Hornos', 'Lavadoras', 'Lavavajillas',
        'Pequeños electrodomésticos', 'Placas de cocina', 'Secadoras', 'Televisores'
      ]
    },
    {
      slug: 'oficina', name: 'Oficina', icon: 'chair', href: '/todo-oficina',
      blurb: 'Mesas, sillas y archivo',
      children: ['Muebles de oficina', 'Mesas de oficina', 'Escritorios', 'Sillas de oficina']
    },
    {
      slug: 'decoracion', name: 'Decoración', icon: 'lamp', href: '/todo-decoracion',
      blurb: 'Iluminación, espejos y textil',
      children: [
        'Bandejas', 'Cuadros', 'Espejos', 'Flores y plantas', 'Jarrones',
        'Lámparas de pie', 'Lámparas de sobremesa', 'Lámparas de techo',
        'Relojes', 'Varios'
      ]
    },
    {
      slug: 'banos', name: 'Baños', icon: 'drop', href: '/catalog/category/view/s/ba-os/id/10/',
      blurb: 'Muebles y espejos de baño',
      children: ['Muebles de baño']
    },
    {
      slug: 'menaje', name: 'Menaje', icon: 'cup', href: '/todo-complementos',
      blurb: 'Menaje, textil y mascotas',
      children: ['Menaje', 'Textil', 'Mascotas']
    }
  ];

  /* ---------------------------------------------------------------------
     Catálogo
     Precios y referencias reales tomados de la home actual.
     `img: null` → se genera un marcador vectorial (ver ui.js).
     --------------------------------------------------------------------- */
  const P = (id, name, price, cat, sub, img, extra) => Object.assign({
    id, name, price, cat, sub,
    img: img ? CAT_IMG + img : null,
    old: null, stock: true, tags: []
  }, extra || {});

  EM.products = [
    /* ---- Primer precio ------------------------------------------------ */
    P(26045, 'Apilable Club 89004A42 c/LED Sonoma', 389, 'salon', 'Apilables', '/a/p/ap007clubs.jpg',
      { stock: false, tags: ['primer-precio'] }),
    P(23997, 'Aparador ME4120.0001 3 puertas blanco', 65, 'auxiliares', 'Aparadores', '/a/a/aaa674120b.jpg',
      { old: 125, stock: false, tags: ['primer-precio', 'oferta'] }),
    P(24692, 'Conjunto mesa + 2 sillas Nando natural/negro', 115, 'comedores', 'Conjunto mesas y sillas', '/c/c/cca80nando.jpg',
      { tags: ['primer-precio', 'entrega-inmediata'] }),
    P(26652, 'Mesa Tavolo 75×75 antracita', 29, 'jardin', 'Conjunto mesas y sillas', '/m/z/mz434tavoa.jpg',
      { tags: ['primer-precio', 'entrega-inmediata'] }),
    P(17464, 'Dormitorio Lara02 CH+MC cambrian/blanco', 499, 'dormitorios', 'Matrimonio', '/d/s/ds023lar2b.jpg',
      { tags: ['primer-precio'] }),
    P(21205, 'Mesa comedor Anthony wotan/andersen 180', 165, 'comedores', 'Mesas de comedor y cocina', '/m/e/mea68antwa.jpg',
      { tags: ['primer-precio'] }),
    P(23981, 'Silla Fina blanco/nórdico asiento PU', 38, 'comedores', 'Sillas de comedor', '/s/i/si023finb.jpg',
      { tags: ['primer-precio', 'entrega-inmediata'] }),
    P(21357, 'Mesa TV Yoshi wotan/blanco', 150, 'salon', 'Muebles de televisión', '/m/v/mva68yoswb.jpg',
      { tags: ['primer-precio'] }),
    P(19180, 'Mesa centro Gala elevable blanco', 48, 'salon', 'Mesas de centro', '/m/t/mt023galb.jpg',
      { old: 70, tags: ['primer-precio', 'oferta', 'entrega-inmediata'] }),

    /* ---- Auxiliares ---------------------------------------------------- */
    P(20993, 'Bodeguero AD5000.0001 blanco', 79, 'auxiliares', 'Muebles multiuso', '/b/o/boa675000b.jpg',
      { old: 89, tags: ['oferta'] }),
    P(21135, 'Estantería E1712.0006 almendra', 99, 'auxiliares', 'Estanterías', '/e/s/esa671712a.jpg'),
    P(26936, 'Aparador AP2310.0100 1 puerta + 2 huecos blanco', 59, 'auxiliares', 'Aparadores', '/a/a/aaa670100b.jpg',
      { stock: false }),
    P(26952, 'Estantería AZ1005.0108 5 baldas blanco/almendra', 77, 'auxiliares', 'Estanterías', '/e/s/esa67108ba.jpg',
      { tags: ['entrega-inmediata'] }),
    P(22213, 'Espejo joyero PE2008.0001 2 cajones blanco', 175, 'auxiliares', 'Tocadores', '/m/c/mca672008b.jpg'),
    P(22700, 'Entrada Aura vertical c/espejo blanco', 119, 'auxiliares', 'Entradas y consolas', '/e/n/en023aurvb.jpg',
      { tags: ['entrega-inmediata'] }),
    P(21236, 'Multiuso cocina BF3204 1 puerta blanco', 90, 'auxiliares', 'Muebles multiuso', '/m/l/mla673204b.jpg'),
    P(23260, 'Multiuso cocina CZ1008 alto 4P+1C blanco', 129, 'auxiliares', 'Muebles multiuso', '/m/l/mla671008b.jpg'),
    P(23261, 'Multiuso cocina CZ1015 6 puertas + 1 cajón blanco', 159, 'auxiliares', 'Muebles multiuso', '/m/l/mla671015b.jpg'),
    P(21474, 'Tocador PE2010.0001 3 cajones c/espejo blanco', 199, 'auxiliares', 'Tocadores', '/t/o/toa672010b.jpg'),

    /* ---- Jardín y hostelería ------------------------------------------ */
    P(25132, 'Tumbona Haití blanca c/cojines', 104, 'jardin', 'Tumbonas', '/t/u/tu434haitb.jpg',
      { tags: ['entrega-inmediata'] }),
    P(26577, 'Conjunto terraza Veranda MT+2S1+1S2 antracita', 191, 'jardin', 'Conjunto mesas y sillas', '/c/z/cz434veraa.jpg',
      { tags: ['entrega-inmediata'] }),
    P(26668, 'Silla terraza Madam antracita', 23, 'jardin', 'Sillas terraza y taburetes', '/s/t/st434madaa.jpg',
      { tags: ['primer-precio', 'entrega-inmediata'] }),
    P(24684, 'Conjunto terraza Conor (S2 + 2 S1 + MT) gris', 178, 'jardin', 'Sofás de jardín', '/c/z/cza80conor.jpg'),
    P(26576, 'Conjunto terraza Tree MT+2S1 antracita c/cojín', 99, 'jardin', 'Conjunto mesas y sillas', '/c/z/cz434treea.jpg',
      { tags: ['entrega-inmediata'] }),
    P(24894, 'Conjunto Cloud MT+2S1 antracita', 109, 'jardin', 'Sofás de jardín', '/c/z/cz434cloua.jpg'),
    P(24896, 'Conjunto Lombok c/cojines 2S1+MT antracita', 111, 'jardin', 'Sofás de jardín', '/c/z/cz434lomba.jpg'),

    /* ---- Novedades ----------------------------------------------------- */
    P(24342, 'Vitrina T-26I izquierda artisan/blanco mate', 316, 'salon', 'Vitrinas', '/v/i/vi394t6iab.jpg',
      { tags: ['novedad'] }),
    P(24380, 'Apilable Nox grafito/artisan', 298, 'salon', 'Apilables', '/a/p/apa68noxga.jpg',
      { tags: ['novedad'] }),
    P(24429, 'Apilable Tempo comp. 905 blanco/artisan', 530, 'salon', 'Apilables', '/a/p/ap39405ba.jpg',
      { tags: ['novedad'] }),
    P(26691, 'Aparador Vittoria 209050-05 3 puertas blanco brillo', 448, 'salon', 'Aparadores', '/a/a/aaa39vit3b.jpg',
      { tags: ['novedad'] }),
    P(26697, 'Armario Start 689070-4R2 4P+cornisa+2P blanco brillo', 1825, 'dormitorios', 'Armarios', '/a/r/ara39stabb.jpg',
      { tags: ['novedad'] }),
    P(26704, 'Entradita Vittoria 409050-1 1P+2H+marco blanco brillo', 330, 'auxiliares', 'Entradas y consolas', '/e/n/ena39vitbb.jpg',
      { tags: ['novedad'] }),
    P(26717, 'Mesa TV Miro 209083-02 2P+1C+2 huecos blanco brillo', 357, 'salon', 'Muebles de televisión', '/m/v/mva39mirbb.jpg',
      { tags: ['novedad'] }),
    P(22627, 'Aparador ref. 338 artisan/grafito', 295, 'salon', 'Aparadores', '/a/a/aa394338sg.jpg',
      { old: 354, tags: ['novedad', 'oferta'] }),
    P(26719, 'Mesa TV Snake 201303-03 3 puertas cemento', 410, 'salon', 'Muebles de televisión', '/m/v/mva39snakc.jpg',
      { tags: ['novedad'] }),
    P(24679, 'Tocador Hollywood XL negro c/LEDs', 395, 'dormitorios', 'Tocadores', '/t/o/toa80hoxln.jpg',
      { tags: ['novedad'] }),

    /* ---- Familias sin foto en la home actual ---------------------------
       Referencias reales de catálogo; la ficha muestra un marcador
       vectorial hasta que se suba la imagen al servidor de medios.       */
    P(25379, 'Sofá 3 plazas Ottoman gris marengo', 649, 'sofas', 'Sofás 3 plazas', null,
      { tags: ['destacado'] }),
    P(25380, 'Chaise longue Ottoman reversible gris', 899, 'sofas', 'Chaise longue', null,
      { tags: ['destacado'] }),
    P(25381, 'Sofá cama Nordic 3 plazas apertura italiana', 749, 'sofas', 'Sofás cama', null),
    P(25382, 'Sillón relax Milano tejido antimanchas', 329, 'sofas', 'Sillones con brazos', null),
    P(25383, 'Pouff Cube tapizado gris perla', 59, 'sofas', 'Pouff', null,
      { tags: ['primer-precio'] }),
    P(25384, 'Colchón Visco Confort 135×190', 299, 'descanso', 'Colchones', null,
      { old: 399, tags: ['oferta', 'destacado'] }),
    P(25385, 'Canapé abatible 3D 150×190 blanco', 249, 'descanso', 'Canapés', null),
    P(25386, 'Somier multiláminas reforzado 90×190', 89, 'descanso', 'Somieres', null),
    P(25387, 'Almohada viscoelástica cervical 90 cm', 39, 'descanso', 'Almohadas', null,
      { tags: ['entrega-inmediata'] })
  ];

  /* ---------------------------------------------------------------------
     Tiendas
     Sólo se incluye la dirección verificada en los datos estructurados de
     la web actual. Añadir aquí el resto de tiendas del grupo.
     --------------------------------------------------------------------- */
  EM.stores = [
    {
      name: 'Euromueble Telde',
      island: 'Gran Canaria',
      street: 'Calle Vinagrillo, 10',
      city: '35213 Telde, Las Palmas',
      phone: EM.config.phone,
      hours: 'L–V 09:00–13:00 · 16:00–20:00 · S 09:00–13:00',
      map: EM.config.map,
      flagship: true
    }
  ];

  /* ---------------------------------------------------------------------
     Servicios (bloque "arengas" de la home actual)
     --------------------------------------------------------------------- */
  EM.services = [
    { icon: 'truck', title: 'Transporte gratis', text: 'En toda Canarias según condiciones de compra.', href: '/formas-de-envio' },
    { icon: 'tools', title: 'Montaje incluido', text: 'Nuestro equipo lo deja instalado y listo.', href: '/formas-de-envio' },
    { icon: 'card', title: 'Financiación', text: 'Hasta 12 meses sin intereses, sujeto a aprobación.', href: '/financiacion' },
    { icon: 'recycle', title: 'Retirada del usado', text: 'Nos llevamos tu mueble viejo al entregar el nuevo.', href: '/formas-de-envio' }
  ];

  /* ---------------------------------------------------------------------
     Utilidades de consulta
     --------------------------------------------------------------------- */
  EM.data = {
    all() { return EM.products.slice(); },
    byId(id) { return EM.products.find(p => String(p.id) === String(id)) || null; },
    byTag(tag, limit) {
      const r = EM.products.filter(p => p.tags.indexOf(tag) > -1);
      return limit ? r.slice(0, limit) : r;
    },
    byCat(slug, limit) {
      const r = EM.products.filter(p => p.cat === slug);
      return limit ? r.slice(0, limit) : r;
    },
    category(slug) { return EM.categories.find(c => c.slug === slug) || null; },
    catName(slug) { const c = EM.data.category(slug); return c ? c.name : slug; },
    related(product, limit) {
      const same = EM.products.filter(p => p.id !== product.id && p.sub === product.sub);
      const cat = EM.products.filter(p => p.id !== product.id && p.cat === product.cat && same.indexOf(p) < 0);
      return same.concat(cat).slice(0, limit || 8);
    },
    search(q) {
      const t = (q || '').trim().toLowerCase();
      if (t.length < 2) return [];
      const words = t.split(/\s+/);
      return EM.products
        .map(p => {
          const hay = (p.name + ' ' + p.sub + ' ' + EM.data.catName(p.cat)).toLowerCase();
          let score = 0;
          words.forEach(w => {
            if (hay.indexOf(w) > -1) score += 2;
            if (p.name.toLowerCase().indexOf(w) === 0) score += 3;
          });
          return { p, score };
        })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(x => x.p);
    },
    priceRange() {
      const v = EM.products.map(p => p.price);
      return { min: Math.floor(Math.min.apply(null, v)), max: Math.ceil(Math.max.apply(null, v)) };
    }
  };
})(window.EM);
