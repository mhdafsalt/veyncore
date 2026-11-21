/**
 * VEYN-OBJECTS Catalog & Editorial Data
 * Hardware, utilitarian bags, heavyweight chains, distressed caps, and tactical artifacts.
 */

export const OBJECTS_HERO_SLIDES = [
  {
    id: 'hero-obj-1',
    title: 'Tactical Utility Bags',
    subtitle: 'FUNCTION OVER ADORNMENT',
    tag: 'NEW RELEASE',
    image: '/images/hero/ObjectHero01.png',
    href: '#object-drops',
    description: 'Structured high-density canvas and raw hardware. Built for urban movement and extreme daily resilience.'
  },
  {
    id: 'hero-obj-2',
    title: 'Solid Hardware & Bags Archive',
    subtitle: 'ENGINEERED ARTIFACTS',
    tag: 'DROP 01 // OBJECTS',
    image: '/images/hero/ObjectHero02.png',
    href: '#object-drops',
    description: 'Heavyweight stainless steel chains, tactical carabiners, and industrial signet rings built to outlast trends.'
  }
];

export const OBJECTS_PRODUCTS = [
  {
    id: 'obj-heavy-link-chain',
    handle: 'obj-heavy-link-chain',
    title: '316L SOLID STEEL CHAIN',
    category: 'CHAINS',
    badge: 'BESTSELLER',
    price: 1499,
    comparePrice: 1999,
    salePrice: 'Rs. 1,499.00',
    regularPrice: 'Rs. 1,999.00',
    discount: 'Save 25%',
    availableSizes: ['50CM', '55CM', '60CM'],
    images: ['/images/hero/hero-card-3.jpg', '/images/products/obg02.jpg'],
    description: 'Solid surgical-grade 316L stainless steel curb link chain with custom industrial clasp. Scratch-resistant, hypoallergenic, water-proof.'
  },
  {
    id: 'obj-distressed-utility-cap',
    handle: 'obj-distressed-utility-cap',
    title: 'DISTRESSED UTILITY LOGO CAP',
    category: 'CAPS',
    badge: 'MUST HAVE',
    price: 999,
    comparePrice: 1399,
    salePrice: 'Rs. 999.00',
    regularPrice: 'Rs. 1,399.00',
    discount: 'Save 29%',
    availableSizes: ['ADJUSTABLE'],
    images: ['/images/products/obg01.jpg', '/images/products/distressed-utility-cap.jpg'],
    description: 'Heavy vintage-washed cotton twill with raw distressed edge details, metallic eyelets, and brutalist tonal 3D embroidery.'
  },
  {
    id: 'obj-tactical-modular-backpack',
    handle: 'obj-tactical-modular-backpack',
    title: 'TACTICAL CARGO MODULAR BACKPACK',
    category: 'BAGS',
    badge: 'DROP 01',
    price: 2499,
    comparePrice: 3199,
    salePrice: 'Rs. 2,499.00',
    regularPrice: 'Rs. 3,199.00',
    discount: 'Save 22%',
    availableSizes: ['ONE SIZE'],
    images: ['/images/hero/ObjectHero01.png'],
    description: 'Constructed from heavy military-spec olive canvas with reinforced padded harness, quick-release hardware buckle, and dedicated multi-compartment cargo utility pockets.'
  },
  {
    id: 'obj-trackbase-utility-tote',
    handle: 'obj-trackbase-utility-tote',
    title: 'TRACKBASE HEAVYWEIGHT CANVAS TOTE',
    category: 'BAGS',
    badge: 'NEW DROP',
    price: 1899,
    comparePrice: 2499,
    salePrice: 'Rs. 1,899.00',
    regularPrice: 'Rs. 2,499.00',
    discount: 'Save 24%',
    availableSizes: ['ONE SIZE'],
    images: ['/images/hero/ObjectHero02.png'],
    description: 'Durable heavyweight black cotton canvas tote with dual high-tensile contrast webbing straps, oversized main vessel, and industrial brutalist screenprint typography.'
  },
  {
    id: 'obj-brutalist-curb-chain',
    handle: 'obj-brutalist-curb-chain',
    title: 'BRUTALIST HARDWARE CURB CHAIN',
    category: 'CHAINS',
    badge: 'SOLID STEEL',
    price: 1299,
    comparePrice: 1699,
    salePrice: 'Rs. 1,299.00',
    regularPrice: 'Rs. 1,699.00',
    discount: 'Save 24%',
    availableSizes: ['50CM', '55CM'],
    images: ['/images/products/obg02.jpg', '/images/hero/hero-card-3.jpg'],
    description: 'Cast 316L solid stainless steel heavy hardware link choker with dual locking carabiner mechanism and brushed industrial chrome finish.'
  },
  {
    id: 'obj-tactical-crossbody-bag',
    handle: 'obj-tactical-crossbody-bag',
    title: 'TACTICAL CROSSBODY CARGO BAG',
    category: 'BAGS',
    badge: 'LIMITED RUN',
    price: 2199,
    comparePrice: 2799,
    salePrice: 'Rs. 2,199.00',
    regularPrice: 'Rs. 2,799.00',
    discount: 'Save 21%',
    availableSizes: ['ONE SIZE'],
    images: ['/images/hero/hero-card-2.jpg'],
    description: 'Constructed from 1000D ballistic nylon with matte black zinc alloy carabiners, multi-pocket modular compartments, and adjustable seatbelt webbing strap.'
  }
];

export const OBJECTS_DROP_CATEGORIES = [
  {
    id: 'bags',
    label: 'BAGS & UTILITY',
    anchorId: 'bags',
    collectionPath: '/collections/all-drops'
  },
  {
    id: 'chains',
    label: 'CHAINS & HARDWARE',
    anchorId: 'chains',
    collectionPath: '/collections/all-drops'
  },
  {
    id: 'caps',
    label: 'CAPS & HEADWEAR',
    anchorId: 'headwear',
    collectionPath: '/collections/all-drops'
  }
];

export const OBJECTS_CATEGORY_DATA = {
  bags: [
    {
      id: 'cat-bag-1',
      handle: 'tactical-cargo-modular-backpack',
      title: 'TACTICAL CARGO MODULAR BACKPACK',
      price: 2499,
      comparePrice: 3199,
      salePrice: 'Rs. 2,499.00',
      regularPrice: 'Rs. 3,199.00',
      availableSizes: ['ONE SIZE'],
      images: ['/images/hero/ObjectHero01.png']
    },
    {
      id: 'cat-bag-2',
      handle: 'trackbase-heavyweight-tote',
      title: 'TRACKBASE HEAVYWEIGHT CANVAS TOTE',
      price: 1899,
      comparePrice: 2499,
      salePrice: 'Rs. 1,899.00',
      regularPrice: 'Rs. 2,499.00',
      availableSizes: ['ONE SIZE'],
      images: ['/images/hero/ObjectHero02.png']
    },
    {
      id: 'cat-bag-3',
      handle: 'tactical-crossbody-cargo-bag',
      title: 'TACTICAL CROSSBODY CARGO BAG',
      price: 2199,
      comparePrice: 2799,
      salePrice: 'Rs. 2,199.00',
      regularPrice: 'Rs. 2,799.00',
      availableSizes: ['ONE SIZE'],
      images: ['/images/hero/hero-card-2.jpg']
    },
    {
      id: 'cat-bag-4',
      handle: 'modular-cargo-utility-pouch',
      title: 'MODULAR CARGO UTILITY POUCH',
      price: 1399,
      comparePrice: 1799,
      salePrice: 'Rs. 1,399.00',
      regularPrice: 'Rs. 1,799.00',
      availableSizes: ['ONE SIZE'],
      images: ['/images/hero/ObjectHero01.png']
    },
    {
      id: 'cat-bag-5',
      handle: 'industrial-overnight-duffle-tote',
      title: 'INDUSTRIAL CANVAS OVERNIGHT TOTE',
      price: 2699,
      comparePrice: 3399,
      salePrice: 'Rs. 2,699.00',
      regularPrice: 'Rs. 3,399.00',
      availableSizes: ['ONE SIZE'],
      images: ['/images/hero/ObjectHero02.png']
    },
    {
      id: 'cat-bag-6',
      handle: 'ballistic-tactical-sling-vessel',
      title: 'BALLISTIC TACTICAL SLING VESSEL',
      price: 1999,
      comparePrice: 2599,
      salePrice: 'Rs. 1,999.00',
      regularPrice: 'Rs. 2,599.00',
      availableSizes: ['ONE SIZE'],
      images: ['/images/hero/hero-card-2.jpg']
    }
  ],
  chains: [
    {
      id: 'cat-chain-1',
      handle: '316l-solid-steel-chain',
      title: '316L SOLID STEEL CHAIN',
      price: 1499,
      comparePrice: 1999,
      salePrice: 'Rs. 1,499.00',
      regularPrice: 'Rs. 1,999.00',
      availableSizes: ['50CM', '55CM', '60CM'],
      images: ['/images/hero/hero-card-3.jpg']
    },
    {
      id: 'cat-chain-2',
      handle: 'brutalist-hardware-curb-chain',
      title: 'BRUTALIST HARDWARE CURB CHAIN',
      price: 1299,
      comparePrice: 1699,
      salePrice: 'Rs. 1,299.00',
      regularPrice: 'Rs. 1,699.00',
      availableSizes: ['50CM', '55CM'],
      images: ['/images/products/obg02.jpg']
    },
    {
      id: 'cat-chain-3',
      handle: 'carabiner-hardware-link-necklace',
      title: 'CARABINER HARDWARE LINK NECKLACE',
      price: 1599,
      comparePrice: 2099,
      salePrice: 'Rs. 1,599.00',
      regularPrice: 'Rs. 2,099.00',
      availableSizes: ['50CM', '55CM', '60CM'],
      images: ['/images/hero/hero-card-3.jpg']
    },
    {
      id: 'cat-chain-4',
      handle: 'dual-tactical-locking-chain',
      title: 'DUAL TACTICAL LOCKING CHAIN',
      price: 1799,
      comparePrice: 2299,
      salePrice: 'Rs. 1,799.00',
      regularPrice: 'Rs. 2,299.00',
      availableSizes: ['55CM', '60CM'],
      images: ['/images/products/obg02.jpg']
    },
    {
      id: 'cat-chain-5',
      handle: 'heavy-industrial-link-choker',
      title: 'HEAVY INDUSTRIAL LINK CHOKER',
      price: 1399,
      comparePrice: 1799,
      salePrice: 'Rs. 1,399.00',
      regularPrice: 'Rs. 1,799.00',
      availableSizes: ['45CM', '50CM'],
      images: ['/images/hero/hero-card-3.jpg']
    },
    {
      id: 'cat-chain-6',
      handle: 'cuban-stealth-chrome-chain',
      title: 'CUBAN STEALTH CHROME CHAIN',
      price: 1649,
      comparePrice: 2199,
      salePrice: 'Rs. 1,649.00',
      regularPrice: 'Rs. 2,199.00',
      availableSizes: ['50CM', '55CM', '60CM'],
      images: ['/images/products/obg02.jpg']
    }
  ],
  caps: [
    {
      id: 'cat-cap-1',
      handle: 'distressed-utility-logo-cap',
      title: 'DISTRESSED UTILITY LOGO CAP',
      price: 999,
      comparePrice: 1399,
      salePrice: 'Rs. 999.00',
      regularPrice: 'Rs. 1,399.00',
      availableSizes: ['ADJUSTABLE'],
      images: ['/images/products/obg01.jpg']
    },
    {
      id: 'cat-cap-2',
      handle: 'vintage-washed-brutalist-cap',
      title: 'VINTAGE WASHED BRUTALIST CAP',
      price: 1099,
      comparePrice: 1499,
      salePrice: 'Rs. 1,099.00',
      regularPrice: 'Rs. 1,499.00',
      availableSizes: ['ADJUSTABLE'],
      images: ['/images/products/distressed-utility-cap.jpg']
    },
    {
      id: 'cat-cap-3',
      handle: 'raw-edge-tactical-cargo-cap',
      title: 'RAW EDGE TACTICAL CARGO CAP',
      price: 1199,
      comparePrice: 1599,
      salePrice: 'Rs. 1,199.00',
      regularPrice: 'Rs. 1,599.00',
      availableSizes: ['ADJUSTABLE'],
      images: ['/images/products/obg01.jpg']
    },
    {
      id: 'cat-cap-4',
      handle: 'stealth-black-curved-cap',
      title: 'STEALTH BLACK EMBROIDERED CAP',
      price: 999,
      comparePrice: 1399,
      salePrice: 'Rs. 999.00',
      regularPrice: 'Rs. 1,399.00',
      availableSizes: ['ADJUSTABLE'],
      images: ['/images/products/distressed-utility-cap.jpg']
    },
    {
      id: 'cat-cap-5',
      handle: 'industrial-metal-eyelet-cap',
      title: 'METAL EYELET UTILITY HAT',
      price: 1149,
      comparePrice: 1499,
      salePrice: 'Rs. 1,149.00',
      regularPrice: 'Rs. 1,499.00',
      availableSizes: ['ADJUSTABLE'],
      images: ['/images/products/obg01.jpg']
    },
    {
      id: 'cat-cap-6',
      handle: 'debossed-monogram-utility-cap',
      title: 'DEBOSSED MONOGRAM UTILITY CAP',
      price: 1049,
      comparePrice: 1399,
      salePrice: 'Rs. 1,049.00',
      regularPrice: 'Rs. 1,399.00',
      availableSizes: ['ADJUSTABLE'],
      images: ['/images/products/distressed-utility-cap.jpg']
    }
  ]
};
