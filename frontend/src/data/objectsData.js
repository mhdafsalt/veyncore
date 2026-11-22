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
    href: '/collections/objects-drops?category=bags',
    description: 'Structured high-density canvas and raw hardware. Built for urban movement and extreme daily resilience.'
  },
  {
    id: 'hero-obj-2',
    title: 'Solid Hardware & Bags Archive',
    subtitle: 'ENGINEERED ARTIFACTS',
    tag: 'DROP 01 // OBJECTS',
    image: '/images/hero/ObjectHero02.png',
    href: '/collections/objects-drops',
    description: 'Heavyweight stainless steel chains, tactical carabiners, and industrial signet rings built to outlast trends.'
  }
];

export const OBJECTS_BRAND_STORY =
  'VEYN-OBJECTS is our dedicated research laboratory for utilitarian hardware, tactical bags, and raw architectural metal accessories. Rejecting delicate decorum, every piece is engineered from surgical-grade 316L stainless steel, high-density tactical canvas, and military-spec components to anchor and complete the brutalist streetwear silhouette.';

export const OBJECTS_DETAILS = [
  'Engineered exclusively by VEYNCORE Objects Lab',
  '316L Surgical-Grade Stainless Steel & 1000D Ballistic Canvas',
  'Hypoallergenic, water-proof, and corrosion-resistant',
  'Heavy industrial clasps & high-tensile modular webbing',
  'Tactical hardware built for extreme daily resilience',
  'Strict small-batch limited edition run',
  'Free insured express shipping across India'
];

export const OBJECTS_SHIPPING = [
  'Free express delivery across India on all prepaid orders.',
  'Standard delivery transit time: 3–5 working days nationwide.',
  'Dispatched within 24 to 48 hours in signature brutalist shockproof packaging.',
  '7-day hassle-free exchange & return portal for undamaged artifacts.',
  'Cash on Delivery (COD) supported with instant OTP order verification.'
];

/**
 * 18 Comprehensive VEYN-OBJECTS Products
 * 6 Bags & Utility, 6 Chains & Hardware, 6 Caps & Headwear
 */
export const ALL_OBJECTS_PRODUCTS = [
  // ==========================================
  // BAGS & UTILITY (6 Products)
  // ==========================================
  {
    id: 'obj-tactical-modular-backpack',
    handle: 'tactical-cargo-modular-backpack',
    aliases: ['obj-tactical-modular-backpack'],
    title: 'TACTICAL CARGO MODULAR BACKPACK',
    category: 'VEYN-OBJECTS',
    subCategory: 'BAGS',
    badge: 'DROP 01',
    price: 2499,
    comparePrice: 3199,
    salePrice: 'Rs. 2,499.00',
    regularPrice: 'Rs. 3,199.00',
    discount: 'Save 22%',
    defaultSize: 'ONE SIZE',
    availableSizes: ['ONE SIZE'],
    images: [
      '/images/hero/ObjectHero01.png',
      '/images/hero/ObjectHero02.png',
      '/images/hero/ObjectHero03.jpg'
    ],
    description:
      'Constructed from heavy military-spec olive canvas with reinforced padded harness, quick-release hardware buckle, and dedicated multi-compartment cargo utility pockets. Designed to anchor oversized streetwear silhouettes with raw utilitarian utility.',
    materials: 'Heavyweight 16oz Olive Canvas / 1000D Ballistic Cordura / Zinc Alloy Buckles',
    dimensions: '48cm (H) x 32cm (W) x 16cm (D) | Capacity: 25 Litres',
    specs: [
      { label: 'Capacity', value: '25 Litres' },
      { label: 'Dimensions', value: '48 x 32 x 16 cm' },
      { label: 'Laptop Sleeve', value: 'Fits up to 16" MacBook Pro' },
      { label: 'Hardware', value: 'Matte black zinc alloy quick-release buckle' },
      { label: 'Straps', value: 'Ergonomic high-density padded harness' }
    ],
    details: [
      'Multi-compartment cargo utility vessel with internal organizer pockets',
      'Padded shock-absorbent sleeve fits up to 16" laptops',
      'Tactical quick-release zinc alloy chest strap clasp',
      'Water-repellent coated heavyweight military canvas exterior',
      'Engineered for long-haul durability and daily street wear'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'trackbase-heavyweight-tote',
      'tactical-crossbody-cargo-bag',
      '316l-solid-steel-chain',
      'distressed-utility-logo-cap'
    ]
  },
  {
    id: 'obj-trackbase-utility-tote',
    handle: 'trackbase-heavyweight-tote',
    aliases: ['obj-trackbase-utility-tote'],
    title: 'TRACKBASE HEAVYWEIGHT CANVAS TOTE',
    category: 'VEYN-OBJECTS',
    subCategory: 'BAGS',
    badge: 'NEW DROP',
    price: 1899,
    comparePrice: 2499,
    salePrice: 'Rs. 1,899.00',
    regularPrice: 'Rs. 2,499.00',
    discount: 'Save 24%',
    defaultSize: 'ONE SIZE',
    availableSizes: ['ONE SIZE'],
    images: [
      '/images/hero/ObjectHero02.png',
      '/images/hero/ObjectHero01.png',
      '/images/hero/ObjectHero03.jpg'
    ],
    description:
      'Durable heavyweight black cotton canvas tote with dual high-tensile contrast webbing straps, oversized main vessel, and industrial brutalist screenprint typography. Clean architectural lines tailored for everyday city transit.',
    materials: '18oz Heavyweight Cotton Duck Canvas / Seatbelt Grade Webbing',
    dimensions: '42cm (H) x 38cm (W) x 14cm (D) | Strap Drop: 28cm',
    specs: [
      { label: 'Capacity', value: '22 Litres' },
      { label: 'Dimensions', value: '42 x 38 x 14 cm' },
      { label: 'Handle Drop', value: '28 cm (shoulder or handheld)' },
      { label: 'Closure', value: 'Industrial magnetic snap lock' },
      { label: 'Interior', value: 'Concealed zip pocket + key lanyard ring' }
    ],
    details: [
      'Heavy 18oz brutalist canvas construction holds structured boxy shape',
      'High-tensile nylon webbing straps reinforced with box-X bartack stitching',
      'Internal zippered security pocket for smartphone, cards, and daily essentials',
      'Tactical matte carabiner loop on exterior for keychains and accessories',
      'Distressed archival screenprinted graphics front and back'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'tactical-cargo-modular-backpack',
      'modular-cargo-utility-pouch',
      'brutalist-hardware-curb-chain',
      'vintage-washed-brutalist-cap'
    ]
  },
  {
    id: 'obj-tactical-crossbody-bag',
    handle: 'tactical-crossbody-cargo-bag',
    aliases: ['obj-tactical-crossbody-bag'],
    title: 'TACTICAL CROSSBODY CARGO BAG',
    category: 'VEYN-OBJECTS',
    subCategory: 'BAGS',
    badge: 'BESTSELLER',
    price: 2199,
    comparePrice: 2799,
    salePrice: 'Rs. 2,199.00',
    regularPrice: 'Rs. 2,799.00',
    discount: 'Save 21%',
    defaultSize: 'ONE SIZE',
    availableSizes: ['ONE SIZE'],
    images: [
      '/images/hero/ObjectHero03.jpg',
      '/images/hero/ObjectHero01.png',
      '/images/hero/ObjectHero02.png'
    ],
    description:
      'Constructed from 1000D ballistic nylon with matte black zinc alloy carabiners, multi-pocket modular compartments, and adjustable seatbelt webbing strap. Sits ergonomically across the chest or over the shoulder.',
    materials: '1000D Cordura Ballistic Nylon / Matte Black Zinc Hardware / YKK Zippers',
    dimensions: '26cm (H) x 34cm (W) x 10cm (D) | Strap: 70cm - 130cm',
    specs: [
      { label: 'Capacity', value: '9 Litres' },
      { label: 'Dimensions', value: '26 x 34 x 10 cm' },
      { label: 'Strap', value: 'Seatbelt nylon adjustable from 70cm to 130cm' },
      { label: 'Hardware', value: 'Dual matte alloy modular carabiners' },
      { label: 'Zippers', value: 'Weather-sealed reverse coil industrial zips' }
    ],
    details: [
      'High-tenacity ballistic nylon resistant to tears, abrasions, and torrential rain',
      'Quick-cinch seatbelt webbing strap with brutalist heavy release buckle',
      'Front dual flap pockets with magnetic fidlock-style closures',
      'Concealed rear passport / travel document zip compartment',
      'Reinforced modular D-rings for clip-on pouches and keychains'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'modular-cargo-utility-pouch',
      'ballistic-tactical-sling-vessel',
      '316l-solid-steel-chain',
      'raw-edge-tactical-cargo-cap'
    ]
  },
  {
    id: 'obj-modular-cargo-utility-pouch',
    handle: 'modular-cargo-utility-pouch',
    aliases: ['modular-cargo-utility-pouch'],
    title: 'MODULAR CARGO UTILITY POUCH',
    category: 'VEYN-OBJECTS',
    subCategory: 'BAGS',
    badge: 'MUST HAVE',
    price: 1399,
    comparePrice: 1799,
    salePrice: 'Rs. 1,399.00',
    regularPrice: 'Rs. 1,799.00',
    discount: 'Save 22%',
    defaultSize: 'ONE SIZE',
    availableSizes: ['ONE SIZE'],
    images: [
      '/images/hero/hero-card-3.jpg',
      '/images/hero/ObjectHero01.png',
      '/images/hero/ObjectHero03.jpg'
    ],
    description:
      'Compact modular accessory vessel designed to clip onto backpacks, belt loops, or crossbody straps. Built from weather-resistant ballistic nylon with dual snap-button tactical webbing clips.',
    materials: '1000D Ballistic Nylon / Heavy Metal Swivel Snap Clasp',
    dimensions: '18cm (H) x 14cm (W) x 6cm (D) | Capacity: 1.5 Litres',
    specs: [
      { label: 'Capacity', value: '1.5 Litres' },
      { label: 'Dimensions', value: '18 x 14 x 6 cm' },
      { label: 'Attachment', value: 'Modular MOLLE snap webbing + swivel carabiner' },
      { label: 'Weight', value: '210 grams' }
    ],
    details: [
      'Dual attachment points: snap belt loop straps and 360-degree swivel carabiner',
      'Main zippered compartment with internal mesh divider',
      'Exterior front quick-access slip pocket with storm flap',
      'Water-repellent PU coating on back canvas'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'tactical-crossbody-cargo-bag',
      'tactical-cargo-modular-backpack',
      'carabiner-hardware-link-necklace',
      'distressed-utility-logo-cap'
    ]
  },
  {
    id: 'obj-industrial-overnight-duffle-tote',
    handle: 'industrial-overnight-duffle-tote',
    aliases: ['industrial-overnight-duffle-tote'],
    title: 'INDUSTRIAL CANVAS OVERNIGHT TOTE',
    category: 'VEYN-OBJECTS',
    subCategory: 'BAGS',
    badge: 'TRAVEL VESSEL',
    price: 2699,
    comparePrice: 3399,
    salePrice: 'Rs. 2,699.00',
    regularPrice: 'Rs. 3,399.00',
    discount: 'Save 21%',
    defaultSize: 'ONE SIZE',
    availableSizes: ['ONE SIZE'],
    images: [
      '/images/hero/ObjectHero02.png',
      '/images/hero/ObjectHero03.jpg'
    ],
    description:
      'High-volume weekend travel vessel constructed from military olive duck canvas. Features full wraparound webbing handles, detachable heavy shoulder strap, and industrial metal hardware.',
    materials: '20oz Heavyweight Olive Canvas / Reinforced Dual Webbing / Steel Hardware',
    dimensions: '50cm (H) x 30cm (W) x 25cm (D) | Capacity: 38 Litres',
    specs: [
      { label: 'Capacity', value: '38 Litres' },
      { label: 'Dimensions', value: '50 x 30 x 25 cm' },
      { label: 'Shoulder Strap', value: 'Detachable padded strap (80-140cm)' },
      { label: 'Handles', value: 'Continuous wraparound bottom support webbing' }
    ],
    details: [
      '38L high-volume interior with structured base for overnight transit',
      'Wraparound base webbing distributes heavy loads evenly',
      'Dual exterior quick-stash slide pockets and heavy double-pull zip closure',
      'Reinforced rivet points on stress corners'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'trackbase-heavyweight-tote',
      'tactical-cargo-modular-backpack',
      'heavy-industrial-link-choker',
      'stealth-black-curved-cap'
    ]
  },
  {
    id: 'obj-ballistic-tactical-sling-vessel',
    handle: 'ballistic-tactical-sling-vessel',
    aliases: ['ballistic-tactical-sling-vessel'],
    title: 'BALLISTIC TACTICAL SLING VESSEL',
    category: 'VEYN-OBJECTS',
    subCategory: 'BAGS',
    badge: 'STREET TACTICAL',
    price: 1999,
    comparePrice: 2599,
    salePrice: 'Rs. 1,999.00',
    regularPrice: 'Rs. 2,599.00',
    discount: 'Save 23%',
    defaultSize: 'ONE SIZE',
    availableSizes: ['ONE SIZE'],
    images: [
      '/images/hero/ObjectHero03.jpg',
      '/images/hero/ObjectHero02.png'
    ],
    description:
      'Streamlined ergonomic single-strap sling bag engineered for fast access on the move. Features dual-direction zipper, padded breathable back panel, and modular front webbing.',
    materials: '1000D Matte Black Ballistic Fabric / Air-mesh Backing / Metal Clasps',
    dimensions: '30cm (H) x 20cm (W) x 8cm (D) | Capacity: 5 Litres',
    specs: [
      { label: 'Capacity', value: '5 Litres' },
      { label: 'Dimensions', value: '30 x 20 x 8 cm' },
      { label: 'Strap', value: 'Ambidextrous left/right reversible clip' },
      { label: 'Weight', value: '380 grams' }
    ],
    details: [
      'Reversible shoulder clip allows left or right shoulder orientation',
      'High-breathability 3D spacer mesh rear panel cushions against torso',
      'Interior padded pouch fits mini tablets and compact cameras',
      'Matte black water-resistant hardware throughout'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'tactical-crossbody-cargo-bag',
      '316l-solid-steel-chain',
      'cuban-stealth-chrome-chain',
      'industrial-metal-eyelet-cap'
    ]
  },

  // ==========================================
  // CHAINS & HARDWARE (6 Products)
  // ==========================================
  {
    id: 'obj-heavy-link-chain',
    handle: '316l-solid-steel-chain',
    aliases: ['obj-heavy-link-chain', '316l-solid-steel-chain'],
    title: '316L SOLID STEEL CHAIN',
    category: 'VEYN-OBJECTS',
    subCategory: 'CHAINS',
    badge: 'BESTSELLER',
    price: 1499,
    comparePrice: 1999,
    salePrice: 'Rs. 1,499.00',
    regularPrice: 'Rs. 1,999.00',
    discount: 'Save 25%',
    defaultSize: '55CM',
    availableSizes: ['50CM', '55CM', '60CM'],
    images: [
      '/images/hero/ObjectHero03.jpg',
      '/images/products/obg02.jpg',
      '/images/hero/hero-card-3.jpg'
    ],
    description:
      'Solid surgical-grade 316L stainless steel curb link chain with custom industrial clasp. Scratch-resistant, hypoallergenic, water-proof, and sweat-proof. Heavy brutalist drape designed to be worn standalone or layered.',
    materials: 'Surgical Grade 316L Solid Stainless Steel / High-Polish Finish',
    dimensions: 'Width: 10mm curb link | Thickness: 4.5mm | Weight: 110g - 135g',
    specs: [
      { label: 'Material', value: '100% Solid 316L Surgical Stainless Steel' },
      { label: 'Profile Width', value: '10mm Curb Link Profile' },
      { label: 'Lengths Available', value: '50cm (20"), 55cm (22"), 60cm (24")' },
      { label: 'Weight', value: '120g (Heavy architectural drape)' },
      { label: 'Clasp', value: 'Custom engineered brutalist push-lock carabiner' },
      { label: 'Waterproof', value: '100% Water, sweat, and corrosion proof' }
    ],
    details: [
      'Crafted from solid 316L surgical stainless steel — zero tarnishing or green skin',
      'Precision bevelled edge links create architectural light reflections',
      'Custom industrial trigger snap clasp with embossed VEYNCORE insignia',
      'Hypoallergenic composition safe for sensitive daily wear',
      'Delivered in custom brutalist presentation jewelry canister'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'brutalist-hardware-curb-chain',
      'carabiner-hardware-link-necklace',
      'tactical-cargo-modular-backpack',
      'distressed-utility-logo-cap'
    ]
  },
  {
    id: 'obj-brutalist-curb-chain',
    handle: 'brutalist-hardware-curb-chain',
    aliases: ['obj-brutalist-curb-chain'],
    title: 'BRUTALIST HARDWARE CURB CHAIN',
    category: 'VEYN-OBJECTS',
    subCategory: 'CHAINS',
    badge: 'SOLID STEEL',
    price: 1299,
    comparePrice: 1699,
    salePrice: 'Rs. 1,299.00',
    regularPrice: 'Rs. 1,699.00',
    discount: 'Save 24%',
    defaultSize: '50CM',
    availableSizes: ['50CM', '55CM'],
    images: [
      '/images/products/obg02.jpg',
      '/images/hero/ObjectHero03.jpg',
      '/images/hero/hero-card-3.jpg'
    ],
    description:
      'Cast 316L solid stainless steel heavy hardware link choker with dual locking carabiner mechanism and brushed industrial chrome finish. Sits high along the collarbone to anchor oversized streetwear silhouettes.',
    materials: 'Cast 316L Solid Stainless Steel / Brushed Industrial Chrome',
    dimensions: 'Width: 12mm flat curb profile | Weight: 135g',
    specs: [
      { label: 'Material', value: '316L Stainless Steel' },
      { label: 'Width', value: '12mm wide flat curb' },
      { label: 'Lengths', value: '50cm (choker collarbone), 55cm (standard)' },
      { label: 'Finish', value: 'Brushed industrial matte chrome' },
      { label: 'Durability', value: 'Permanent finish, will not fade or corrode' }
    ],
    details: [
      'Extra-wide 12mm solid steel links engineered with brutalist angular facets',
      'Dual locking carabiner mechanism engineered for secure heavyweight closure',
      'Brushed satin finish resists scratches and fingerprints',
      'Completely hypoallergenic and nickel-free'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      '316l-solid-steel-chain',
      'dual-tactical-locking-chain',
      'tactical-crossbody-cargo-bag',
      'vintage-washed-brutalist-cap'
    ]
  },
  {
    id: 'obj-carabiner-hardware-link-necklace',
    handle: 'carabiner-hardware-link-necklace',
    aliases: ['carabiner-hardware-link-necklace'],
    title: 'CARABINER HARDWARE LINK NECKLACE',
    category: 'VEYN-OBJECTS',
    subCategory: 'CHAINS',
    badge: 'NEW HARDWARE',
    price: 1599,
    comparePrice: 2099,
    salePrice: 'Rs. 1,599.00',
    regularPrice: 'Rs. 2,099.00',
    discount: 'Save 24%',
    defaultSize: '55CM',
    availableSizes: ['50CM', '55CM', '60CM'],
    images: [
      '/images/hero/ObjectHero03.jpg',
      '/images/products/obg02.jpg'
    ],
    description:
      'Raw industrial chain featuring functioning miniature steel carabiner link pendants. Made from forged 316L stainless steel with laser-etched brutalist coordinates.',
    materials: 'Forged 316L Stainless Steel / Polished Chrome Carabiners',
    dimensions: 'Width: 8mm cable link | Carabiner: 24mm length | Weight: 105g',
    specs: [
      { label: 'Material', value: '316L Stainless Steel' },
      { label: 'Link Type', value: 'Heavy Cable Chain with Carabiner Accents' },
      { label: 'Length', value: '50cm, 55cm, 60cm' },
      { label: 'Weight', value: '105 grams' }
    ],
    details: [
      'Functional spring-loaded miniature carabiner serves as clasp or modular hanger',
      'Laser-engraved tactical coordinates on carabiner barrel',
      'Tarnish-proof, waterproof, and gym/swim safe'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      '316l-solid-steel-chain',
      'heavy-industrial-link-choker',
      'trackbase-heavyweight-tote',
      'raw-edge-tactical-cargo-cap'
    ]
  },
  {
    id: 'obj-dual-tactical-locking-chain',
    handle: 'dual-tactical-locking-chain',
    aliases: ['dual-tactical-locking-chain'],
    title: 'DUAL TACTICAL LOCKING CHAIN',
    category: 'VEYN-OBJECTS',
    subCategory: 'CHAINS',
    badge: 'LIMITED ARCHIVE',
    price: 1799,
    comparePrice: 2299,
    salePrice: 'Rs. 1,799.00',
    regularPrice: 'Rs. 2,299.00',
    discount: 'Save 22%',
    defaultSize: '55CM',
    availableSizes: ['55CM', '60CM'],
    images: [
      '/images/products/obg02.jpg',
      '/images/hero/ObjectHero03.jpg'
    ],
    description:
      'Double-strand architectural chain featuring a heavy curb layer intertwined with a box-link strand, unified by an industrial double-locking utility mechanism.',
    materials: '316L Surgical Stainless Steel / Dual Strand Integration',
    dimensions: 'Dual width (9mm curb + 5mm box) | Weight: 145g',
    specs: [
      { label: 'Strands', value: 'Dual linked staggered drape' },
      { label: 'Lengths', value: '55cm inner / 60cm outer' },
      { label: 'Weight', value: '145 grams (Extra Heavyweight)' },
      { label: 'Clasp', value: 'Industrial dual-cylinder twist lock' }
    ],
    details: [
      'Dual strands pre-balanced to hang with perfect layered tension',
      'Engineered with industrial dual-cylinder twist lock mechanism',
      'Heavyweight brutalist aesthetic anchors graphic tees and hoodies'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'brutalist-hardware-curb-chain',
      'cuban-stealth-chrome-chain',
      'tactical-cargo-modular-backpack',
      'stealth-black-curved-cap'
    ]
  },
  {
    id: 'obj-heavy-industrial-link-choker',
    handle: 'heavy-industrial-link-choker',
    aliases: ['heavy-industrial-link-choker'],
    title: 'HEAVY INDUSTRIAL LINK CHOKER',
    category: 'VEYN-OBJECTS',
    subCategory: 'CHAINS',
    badge: 'RUNWAY ARTIFACT',
    price: 1399,
    comparePrice: 1799,
    salePrice: 'Rs. 1,399.00',
    regularPrice: 'Rs. 1,799.00',
    discount: 'Save 22%',
    defaultSize: '45CM',
    availableSizes: ['45CM', '50CM'],
    images: [
      '/images/hero/ObjectHero03.jpg',
      '/images/products/obg02.jpg'
    ],
    description:
      'Short-profile 45cm industrial link choker forged from raw geometric steel bars. Designed to fit high and close to the neck with a high-impact brutalist silhouette.',
    materials: 'Solid 316L Surgical Grade Steel / Angular Geometric Bar Links',
    dimensions: 'Length: 45cm - 50cm | Link Width: 11mm | Weight: 125g',
    specs: [
      { label: 'Profile', value: 'High collarbone choker' },
      { label: 'Lengths', value: '45cm, 50cm' },
      { label: 'Link Design', value: 'Squared architectural bar link' },
      { label: 'Finish', value: 'High-polish chrome mirror finish' }
    ],
    details: [
      'Squared architectural bar links inspired by brutalist steel rebar',
      'Flush seamless safety clasp with internal spring-assist',
      'Sweat-proof, shower-safe, and corrosion-resistant'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      '316l-solid-steel-chain',
      'carabiner-hardware-link-necklace',
      'industrial-overnight-duffle-tote',
      'debossed-monogram-utility-cap'
    ]
  },
  {
    id: 'obj-cuban-stealth-chrome-chain',
    handle: 'cuban-stealth-chrome-chain',
    aliases: ['cuban-stealth-chrome-chain'],
    title: 'CUBAN STEALTH CHROME CHAIN',
    category: 'VEYN-OBJECTS',
    subCategory: 'CHAINS',
    badge: 'CORE ESSENTIAL',
    price: 1649,
    comparePrice: 2199,
    salePrice: 'Rs. 1,649.00',
    regularPrice: 'Rs. 2,199.00',
    discount: 'Save 25%',
    defaultSize: '55CM',
    availableSizes: ['50CM', '55CM', '60CM'],
    images: [
      '/images/products/obg02.jpg',
      '/images/hero/ObjectHero03.jpg'
    ],
    description:
      'Tight-weave diamond-cut Cuban chain crafted with intense precision. Solid 316L steel links lay flat across the chest, reflecting light in high contrast.',
    materials: 'Diamond-Cut 316L Solid Stainless Steel / High-Gloss Chrome',
    dimensions: 'Width: 10mm flat Cuban link | Weight: 115g',
    specs: [
      { label: 'Cut', value: 'Four-sided precision diamond cut' },
      { label: 'Lengths', value: '50cm (20"), 55cm (22"), 60cm (24")' },
      { label: 'Width', value: '10mm flat curb link' },
      { label: 'Clasp', value: 'Double safety side-lock box clasp' }
    ],
    details: [
      'Diamond-cut beveled edges catch light from every angle',
      'Engineered box clasp with dual exterior security levers',
      'Will not fade, rust, discolour or turn skin green'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      '316l-solid-steel-chain',
      'dual-tactical-locking-chain',
      'ballistic-tactical-sling-vessel',
      'vintage-washed-brutalist-cap'
    ]
  },

  // ==========================================
  // CAPS & HEADWEAR (6 Products)
  // ==========================================
  {
    id: 'obj-distressed-utility-cap',
    handle: 'distressed-utility-logo-cap',
    aliases: ['obj-distressed-utility-cap'],
    title: 'DISTRESSED UTILITY LOGO CAP',
    category: 'VEYN-OBJECTS',
    subCategory: 'CAPS',
    badge: 'MUST HAVE',
    price: 999,
    comparePrice: 1399,
    salePrice: 'Rs. 999.00',
    regularPrice: 'Rs. 1,399.00',
    discount: 'Save 29%',
    defaultSize: 'ADJUSTABLE',
    availableSizes: ['ADJUSTABLE'],
    images: [
      '/images/products/obg01.jpg',
      '/images/products/distressed-utility-cap.jpg'
    ],
    description:
      'Heavy vintage-washed cotton twill with raw distressed edge details, metallic eyelets, and brutalist tonal 3D embroidery. Finished with an antique silver buckle strapback for an authentic worn streetwear drape.',
    materials: '100% Heavy Vintage-Washed Cotton Twill / Antique Silver Metal Hardware',
    dimensions: 'Circumference: 54cm - 60cm (Adjustable) | Brim: 7.2cm | Crown: 12cm',
    specs: [
      { label: 'Material', value: '100% Heavyweight Cotton Twill (360 GSM)' },
      { label: 'Crown Profile', value: 'Low/Mid unstructured 6-panel design' },
      { label: 'Visor', value: '7.2cm pre-curved brim with raw edge abrading' },
      { label: 'Adjustment', value: 'Self-fabric strap with antique silver slide buckle' },
      { label: 'Embroidery', value: 'High-density 3D tonal brutalist typography' }
    ],
    details: [
      'Vintage enzyme wash gives each individual piece unique distressed character',
      'Raw edge distressing on brim and crown panels',
      'Embossed antique silver metal slide buckle with tuck-in strap cavity',
      'Embroidered ventilation eyelets for thermal breathability',
      'Interior sweatband with anti-chafe herringbone tape reinforcement'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'vintage-washed-brutalist-cap',
      'raw-edge-tactical-cargo-cap',
      '316l-solid-steel-chain',
      'tactical-cargo-modular-backpack'
    ]
  },
  {
    id: 'obj-vintage-washed-brutalist-cap',
    handle: 'vintage-washed-brutalist-cap',
    aliases: ['vintage-washed-brutalist-cap'],
    title: 'VINTAGE WASHED BRUTALIST CAP',
    category: 'VEYN-OBJECTS',
    subCategory: 'CAPS',
    badge: 'HOT DROP',
    price: 1099,
    comparePrice: 1499,
    salePrice: 'Rs. 1,099.00',
    regularPrice: 'Rs. 1,499.00',
    discount: 'Save 27%',
    defaultSize: 'ADJUSTABLE',
    availableSizes: ['ADJUSTABLE'],
    images: [
      '/images/products/distressed-utility-cap.jpg',
      '/images/products/obg01.jpg'
    ],
    description:
      'Mineral-washed faded charcoal silhouette with raw stitch seams and brutalist architectural patch on center crown. Unstructured relaxed fit tailored to complement baggy denim looks.',
    materials: '100% Mineral Washed Heavy Cotton / Metal Buckle',
    dimensions: 'Circumference: 54cm - 60cm (Adjustable) | Brim: 7.2cm',
    specs: [
      { label: 'Wash', value: 'Mineral acid fade wash' },
      { label: 'Crown', value: 'Unstructured vintage low crown' },
      { label: 'Size', value: 'One size fits all (adjustable strapback)' },
      { label: 'Closure', value: 'Heavyweight matte metal slider' }
    ],
    details: [
      'Mineral acid fade creates an archival grunge patina',
      'Architectural patch appliqué with frayed perimeter edges',
      'Contoured curved visor shields sun with streetwear stance'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'distressed-utility-logo-cap',
      'brutalist-hardware-curb-chain',
      'trackbase-heavyweight-tote',
      'stealth-black-curved-cap'
    ]
  },
  {
    id: 'obj-raw-edge-tactical-cargo-cap',
    handle: 'raw-edge-tactical-cargo-cap',
    aliases: ['raw-edge-tactical-cargo-cap'],
    title: 'RAW EDGE TACTICAL CARGO CAP',
    category: 'VEYN-OBJECTS',
    subCategory: 'CAPS',
    badge: 'MILITARY TWILL',
    price: 1199,
    comparePrice: 1599,
    salePrice: 'Rs. 1,199.00',
    regularPrice: 'Rs. 1,599.00',
    discount: 'Save 25%',
    defaultSize: 'ADJUSTABLE',
    availableSizes: ['ADJUSTABLE'],
    images: [
      '/images/products/obg01.jpg',
      '/images/products/distressed-utility-cap.jpg'
    ],
    description:
      'Tactical headwear featuring modular side utility loop webbing for pen/accessory carry. Finished with raw abraded brim tears and tonal high-density stitching.',
    materials: 'High-Density Olive Cotton Twill / Nylon Webbing Accent',
    dimensions: 'Circumference: 54cm - 60cm | Brim: 7.2cm',
    specs: [
      { label: 'Side Accents', value: 'MOLLE-spec nylon webbing strap' },
      { label: 'Distressing', value: 'Hand-applied raw edge cuts' },
      { label: 'Strap', value: 'Nylon webbing with quick-cam buckle' }
    ],
    details: [
      'Side tactical webbing loop detail anchors sunglasses or pens',
      'Dual reinforced brass eyelets on lateral panels',
      'Pre-curved brim holds shape over extensive daily wear'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'distressed-utility-logo-cap',
      'carabiner-hardware-link-necklace',
      'tactical-crossbody-cargo-bag',
      'industrial-metal-eyelet-cap'
    ]
  },
  {
    id: 'obj-stealth-black-curved-cap',
    handle: 'stealth-black-curved-cap',
    aliases: ['stealth-black-curved-cap'],
    title: 'STEALTH BLACK EMBROIDERED CAP',
    category: 'VEYN-OBJECTS',
    subCategory: 'CAPS',
    badge: 'ESSENTIAL',
    price: 999,
    comparePrice: 1399,
    salePrice: 'Rs. 999.00',
    regularPrice: 'Rs. 1,399.00',
    discount: 'Save 29%',
    defaultSize: 'ADJUSTABLE',
    availableSizes: ['ADJUSTABLE'],
    images: [
      '/images/products/distressed-utility-cap.jpg',
      '/images/products/obg01.jpg'
    ],
    description:
      'Minimalist jet black brutalist baseball cap with pitch-black matte 3D tonal embroidery. Clean, understated silhouette engineered to match monochrome outfits.',
    materials: '100% Chino Cotton Twill / Matte Black Metal Hardware',
    dimensions: 'Circumference: 54cm - 60cm | Brim: 7.2cm',
    specs: [
      { label: 'Color', value: 'Triple Pitch Black' },
      { label: 'Crown', value: 'Structured 6-panel profile' },
      { label: 'Closure', value: 'Black metal tuck-in slider' }
    ],
    details: [
      'Pitch black tonal 3D embroidery on front and back arch',
      'Structured front panels maintain crisp silhouette',
      'Moisture-wicking inner sweatband'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'distressed-utility-logo-cap',
      'dual-tactical-locking-chain',
      'tactical-cargo-modular-backpack',
      'debossed-monogram-utility-cap'
    ]
  },
  {
    id: 'obj-industrial-metal-eyelet-cap',
    handle: 'industrial-metal-eyelet-cap',
    aliases: ['industrial-metal-eyelet-cap'],
    title: 'METAL EYELET UTILITY HAT',
    category: 'VEYN-OBJECTS',
    subCategory: 'CAPS',
    badge: 'HARDWARE EDIT',
    price: 1149,
    comparePrice: 1499,
    salePrice: 'Rs. 1,149.00',
    regularPrice: 'Rs. 1,499.00',
    discount: 'Save 23%',
    defaultSize: 'ADJUSTABLE',
    availableSizes: ['ADJUSTABLE'],
    images: [
      '/images/products/obg01.jpg',
      '/images/products/distressed-utility-cap.jpg'
    ],
    description:
      'Heavy industrial headwear featuring oversized chrome metal eyelet grommets and raw contrast seam stitching. Infused with brutalist hardware accents throughout.',
    materials: 'Heavy Washed Cotton / 6x Oversized Metal Eyelets',
    dimensions: 'Circumference: 54cm - 60cm | Brim: 7.2cm',
    specs: [
      { label: 'Hardware', value: 'Oversized solid steel grommets' },
      { label: 'Stitching', value: 'Heavy gauge contrast needlework' },
      { label: 'Visor', value: 'Double-row raw distressed stitching' }
    ],
    details: [
      'Oversized solid steel ventilation grommets add tactile weight',
      'Raw frayed peak detailing for authentic worn texture',
      'Heavy-gauge contrasting bartack stitching on stress points'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'distressed-utility-logo-cap',
      'brutalist-hardware-curb-chain',
      'ballistic-tactical-sling-vessel',
      'vintage-washed-brutalist-cap'
    ]
  },
  {
    id: 'obj-debossed-monogram-utility-cap',
    handle: 'debossed-monogram-utility-cap',
    aliases: ['debossed-monogram-utility-cap'],
    title: 'DEBOSSED MONOGRAM UTILITY CAP',
    category: 'VEYN-OBJECTS',
    subCategory: 'CAPS',
    badge: 'ARCHIVE',
    price: 1049,
    comparePrice: 1399,
    salePrice: 'Rs. 1,049.00',
    regularPrice: 'Rs. 1,399.00',
    discount: 'Save 25%',
    defaultSize: 'ADJUSTABLE',
    availableSizes: ['ADJUSTABLE'],
    images: [
      '/images/products/distressed-utility-cap.jpg',
      '/images/products/obg01.jpg'
    ],
    description:
      'Debossed brutalist typography pressed into an industrial rubberized crest on front crown. Built from premium vintage charcoal twill with contrast edge distress.',
    materials: 'Charcoal Cotton Twill / Molded Rubberized Emblem',
    dimensions: 'Circumference: 54cm - 60cm | Brim: 7.2cm',
    specs: [
      { label: 'Patch', value: 'High-density debossed rubber badge' },
      { label: 'Fit', value: 'Relaxed low crown unconstructed' },
      { label: 'Strap', value: 'Self-cloth strap with steel slider' }
    ],
    details: [
      'Molded architectural badge permanently heat-bonded to crown',
      'Enzyme stone wash creates soft hand feel and faded coal hue',
      'Heavyweight brass closure slide with hidden strap recess'
    ],
    shipping: OBJECTS_SHIPPING,
    selectStory: OBJECTS_BRAND_STORY,
    isObject: true,
    inStock: true,
    relatedHandles: [
      'distressed-utility-logo-cap',
      'heavy-industrial-link-choker',
      'trackbase-heavyweight-tote',
      'stealth-black-curved-cap'
    ]
  }
];

/**
 * Filter Categories for Drop Navigation & All Drops Page
 */
export const OBJECTS_DROP_CATEGORIES = [
  {
    id: 'bags',
    label: 'BAGS & UTILITY',
    anchorId: 'bags',
    collectionPath: '/collections/objects-drops?category=bags'
  },
  {
    id: 'chains',
    label: 'CHAINS & HARDWARE',
    anchorId: 'chains',
    collectionPath: '/collections/objects-drops?category=chains'
  },
  {
    id: 'caps',
    label: 'CAPS & HEADWEAR',
    anchorId: 'headwear',
    collectionPath: '/collections/objects-drops?category=caps'
  }
];

/**
 * 6 Primary Featured Objects for Home Grid (Chains, Caps, and Bags)
 */
export const OBJECTS_PRODUCTS = [
  ALL_OBJECTS_PRODUCTS.find((p) => p.handle === 'tactical-crossbody-cargo-bag'),
  ALL_OBJECTS_PRODUCTS.find((p) => p.handle === 'modular-cargo-utility-pouch'),
  ALL_OBJECTS_PRODUCTS.find((p) => p.handle === 'tactical-cargo-modular-backpack'),
  ALL_OBJECTS_PRODUCTS.find((p) => p.handle === 'trackbase-heavyweight-tote'),
  ALL_OBJECTS_PRODUCTS.find((p) => p.handle === '316l-solid-steel-chain'),
  ALL_OBJECTS_PRODUCTS.find((p) => p.handle === 'distressed-utility-logo-cap')
].filter(Boolean);

/**
 * Category-based lookup for homepage swipe rows
 */
export const OBJECTS_CATEGORY_DATA = {
  bags: ALL_OBJECTS_PRODUCTS.filter((p) => p.subCategory === 'BAGS'),
  chains: ALL_OBJECTS_PRODUCTS.filter((p) => p.subCategory === 'CHAINS'),
  caps: ALL_OBJECTS_PRODUCTS.filter((p) => p.subCategory === 'CAPS')
};

/**
 * Helper to retrieve an object product by handle or alias
 */
export function getObjectByHandle(handle) {
  if (!handle) return null;
  const normalized = handle.toLowerCase().trim();

  return (
    ALL_OBJECTS_PRODUCTS.find(
      (p) =>
        p.handle === normalized ||
        p.id === normalized ||
        (p.aliases && p.aliases.includes(normalized))
    ) || null
  );
}

/**
 * Return all object product handles for Next.js getStaticPaths / generateStaticParams
 */
export function getAllObjectHandles() {
  const handles = new Set();
  ALL_OBJECTS_PRODUCTS.forEach((p) => {
    if (p.handle) handles.add(p.handle);
    if (p.id) handles.add(p.id);
    if (p.aliases) p.aliases.forEach((a) => handles.add(a));
  });
  return Array.from(handles);
}
