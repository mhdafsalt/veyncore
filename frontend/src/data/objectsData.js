/**
 * VEYN-OBJECTS Catalog & Editorial Data
 * Static products data completely removed.
 * Real products are loaded dynamically from MongoDB via the backend API.
 */

export const OBJECTS_HERO_SLIDES = [];

export const OBJECTS_BRAND_STORY =
  'VEYN-OBJECTS is our dedicated research laboratory for utilitarian hardware, tactical bags, and raw architectural metal accessories. Rejecting delicate decorum, every piece is engineered from surgical-grade 316L stainless steel, high-density tactical canvas, and military-spec components to anchor and complete the brutalist streetwear silhouette.';

export const OBJECTS_DETAILS = [
  'Handpicked by VEYNCORE',
  'Not manufactured by VEYNCORE',
  'Carefully selected from trusted suppliers',
  'Premium quality standards',
  'Quality checked before dispatch',
  'Designed for everyday comfort and style',
  'Easy 7-day returns and exchanges on eligible products'
];

export const OBJECTS_SHIPPING = [
  'Orders are carefully packed and dispatched within 24–48 business hours.',
  'Standard delivery takes approximately 3–5 working days.',
  'Real-time order tracking available after dispatch.',
  'Easy 7-day returns and exchanges on eligible products.'
];

export const OBJECTS_MANIFESTO = {
  quote: '"FORM DICTATED BY TACTICAL NECESSITY."',
  subquote: 'REJECTING DECORATIVE FRIVOLITY IN PURSUIT OF PURE STRUCTURAL RESILIENCE.',
  body: 'VEYN-OBJECTS operates as our research lab for wearable utilitarian hardware. Every artifact is fabricated with solid 316L stainless steel, military cordura, and high-tensile modular strapping.',
  stats: [
    { value: '316L', label: 'SURGICAL STEEL' },
    { value: '1000D', label: 'BALLISTIC NYLON' },
    { value: '100%', label: 'WEATHERPROOF' },
  ]
};

export const OBJECTS_CATEGORIES = [
  { id: 'cat-bags', href: '/collections/objects-drops?category=bags', label: 'BAGS & UTILITY' },
  { id: 'cat-chains', href: '/collections/objects-drops?category=chains', label: 'CHAINS & HARDWARE' },
  { id: 'cat-caps', href: '/collections/objects-drops?category=caps', label: 'CAPS & HEADWEAR' },
];

/**
 * Static product objects completely removed.
 */
export const ALL_OBJECTS_PRODUCTS = [];
export const OBJECTS_PRODUCTS = [];
export const OBJECTS_DROP_CATEGORIES = [];
export const OBJECTS_CATEGORY_DATA = {};

/**
 * Dynamic resolution fallback
 */
export function getObjectByHandle(handle) {
  return null;
}

export function getAllObjectHandles() {
  return [];
}

export default ALL_OBJECTS_PRODUCTS;
