/**
 * Product Data Catalog for VEYNCORE
 * Static products data completely removed.
 * Real products are loaded dynamically from MongoDB via the backend API.
 */

export const DEFAULT_MEASUREMENTS = {
  inches: [
    { size: '28', waist: '28', rise: '12', thighs: '24', length: '41', legOpening: '21' },
    { size: '30', waist: '30', rise: '12', thighs: '25', length: '42', legOpening: '22' },
    { size: '32', waist: '32', rise: '12', thighs: '25', length: '42', legOpening: '22' },
    { size: '34', waist: '34', rise: '12', thighs: '27', length: '42', legOpening: '23' }
  ],
  cm: [
    { size: '28', waist: '71.1', rise: '30.5', thighs: '61.0', length: '104.1', legOpening: '53.3' },
    { size: '30', waist: '76.2', rise: '30.5', thighs: '63.5', length: '106.7', legOpening: '55.9' },
    { size: '32', waist: '81.3', rise: '30.5', thighs: '63.5', length: '106.7', legOpening: '55.9' },
    { size: '34', waist: '86.4', rise: '30.5', thighs: '68.6', length: '106.7', legOpening: '58.4' }
  ]
};

export const DEFAULT_SELECT_STORY =
  'VEYN SELECTS is an exclusive collection of carefully curated fashion pieces, handpicked to match VEYNCORE’s distinctive style and vision. Each piece is thoughtfully sourced and quality-checked, bringing together unique designs, premium appeal, and everyday comfort. A collection made for those who value individuality, detail, and effortless style.';

export const DEFAULT_DETAILS = [
  'Handpicked by VEYNCORE',
  'Not manufactured by VEYNCORE',
  'Carefully selected from trusted suppliers',
  'Premium quality standards',
  'Quality checked before dispatch',
  'Designed for everyday comfort and style',
  'Easy 7-day returns and exchanges on eligible products'
];

export const DEFAULT_SHIPPING = [
  'Orders are carefully packed and dispatched within 24–48 business hours.',
  'Standard delivery takes approximately 3–5 working days.',
  'Real-time order tracking available after dispatch.',
  'Easy 7-day returns and exchanges on eligible products.'
];

/**
 * Static product objects completely removed.
 */
export const PRODUCTS_DATA = {};
export const POPULAR_PRODUCTS = [];

/**
 * Retrieve product by handle (static dataset is empty; resolved dynamically via API)
 */
export function getProductByHandle(handle) {
  return null;
}

/**
 * Return static handles (empty; routes are rendered dynamically)
 */
export function getAllProductHandles() {
  return [];
}

export default PRODUCTS_DATA;
