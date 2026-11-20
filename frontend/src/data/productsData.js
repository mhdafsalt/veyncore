/**
 * Product Data Catalog for VEYNCORE
 * Includes complete PDP specifications, gallery images, size chart measurements (inches & cm),
 * product descriptions, shipping policies, and related recommendations.
 */

import { CATEGORY_FITS_DATA } from './categoryFitsData';
import { NEW_ARRIVALS_PRODUCTS } from './newArrivalsData';

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
  'VEYN-SELECTS is a carefully curated collection of rare denim and fashion pieces, handpicked to reflect VEYNCORE’s unique vision and aesthetic. Every piece is thoughtfully sourced and quality-checked, with a focus on style, individuality, and attention to detail.';

export const DEFAULT_DETAILS = [
  'Handpicked by VEYNCORE',
  'Not manufactured by VEYNCORE',
  'Selected from trusted partners',
  'Premium quality standards',
  'Quality checked before dispatch',
  'Comfortable & stylish',
  'Free shipping across India'
];

export const DEFAULT_SHIPPING = [
  'Free shipping across India on all prepaid orders.',
  'Standard delivery transit time: 3–5 working days nationwide.',
  'Orders dispatched within 24 to 48 hours via premium express couriers.',
  '7-day hassle-free exchange & return portal for unworn merchandise with tags.',
  'Cash on Delivery (COD) supported with instant OTP order verification.'
];

export const PRODUCTS_DATA = {
  'vexo-blue-baggy': {
    id: 'vexo-blue-baggy',
    title: 'VEXO BLUE BAGGY',
    handle: 'vexo-blue-baggy',
    fit: 'Baggy Fit',
    category: 'VEYN-SELECTS',
    badge: 'NEW',
    price: 1499,
    comparePrice: 1700,
    salePrice: 'Rs. 1,499.00',
    regularPrice: 'Rs. 1,700.00',
    discount: 'Save 12%',
    defaultSize: '32',
    availableSizes: ['28', '30', '32', '34'],
    images: [
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6930.webp?v=1795179025&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6933.webp?v=1795179029&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6931.webp?v=1795179025&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6934.webp?v=1795179027&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6932.webp?v=1795179027&width=1200'
    ],
    measurements: DEFAULT_MEASUREMENTS,
    details: DEFAULT_DETAILS,
    shipping: DEFAULT_SHIPPING,
    selectStory: DEFAULT_SELECT_STORY,
    relatedHandles: ['tinted-blue-wide', 'nid-blue-wide', 'after-blue-wide', 'coal-blue-baggy']
  },

  'tinted-blue-wide': {
    id: 'tinted-blue-wide',
    title: 'TINTED BLUE WIDE',
    handle: 'tinted-blue-wide',
    fit: 'Wide Fit',
    category: 'VEYN-SELECTS',
    badge: 'NEW',
    price: 1499,
    comparePrice: 1700,
    salePrice: 'Rs. 1,499.00',
    regularPrice: 'Rs. 1,700.00',
    discount: 'Save 12%',
    defaultSize: '30',
    availableSizes: ['28', '30', '32', '34'],
    images: [
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6880.webp?v=1795179025&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6930.webp?v=1795179025&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6933.webp?v=1795179029&width=1200'
    ],
    measurements: DEFAULT_MEASUREMENTS,
    details: DEFAULT_DETAILS,
    shipping: DEFAULT_SHIPPING,
    selectStory: DEFAULT_SELECT_STORY,
    relatedHandles: ['vexo-blue-baggy', 'nid-blue-wide', 'after-blue-wide', 'coal-blue-baggy']
  },

  'nid-blue-wide': {
    id: 'nid-blue-wide',
    title: 'NID BLUE WIDE',
    handle: 'nid-blue-wide',
    fit: 'Wide Fit',
    category: 'VEYN-SELECTS',
    badge: 'NEW',
    price: 1499,
    comparePrice: 1700,
    salePrice: 'Rs. 1,499.00',
    regularPrice: 'Rs. 1,700.00',
    discount: 'Save 12%',
    defaultSize: '32',
    availableSizes: ['28', '30', '32', '34'],
    images: [
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6780.webp?v=1795179025&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6880.webp?v=1795179025&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6934.webp?v=1795179027&width=1200'
    ],
    measurements: DEFAULT_MEASUREMENTS,
    details: DEFAULT_DETAILS,
    shipping: DEFAULT_SHIPPING,
    selectStory: DEFAULT_SELECT_STORY,
    relatedHandles: ['vexo-blue-baggy', 'tinted-blue-wide', 'after-blue-wide', 'coal-blue-baggy']
  },

  'after-blue-wide': {
    id: 'after-blue-wide',
    title: 'AFTER BLUE WIDE',
    handle: 'after-blue-wide',
    fit: 'Wide Fit',
    category: 'VEYN-SELECTS',
    badge: 'NEW',
    price: 1499,
    comparePrice: 1700,
    salePrice: 'Rs. 1,499.00',
    regularPrice: 'Rs. 1,700.00',
    discount: 'Save 12%',
    defaultSize: '32',
    availableSizes: ['28', '30', '32', '34'],
    images: [
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6811.webp?v=1795179025&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6915.webp?v=1795179025&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6932.webp?v=1795179027&width=1200'
    ],
    measurements: DEFAULT_MEASUREMENTS,
    details: DEFAULT_DETAILS,
    shipping: DEFAULT_SHIPPING,
    selectStory: DEFAULT_SELECT_STORY,
    relatedHandles: ['vexo-blue-baggy', 'tinted-blue-wide', 'nid-blue-wide', 'coal-blue-baggy']
  },

  'coal-blue-baggy': {
    id: 'coal-blue-baggy',
    title: 'COAL BLUE BAGGY',
    handle: 'coal-blue-baggy',
    fit: 'Baggy Fit',
    category: 'VEYN-SELECTS',
    badge: 'NEW',
    price: 1499,
    comparePrice: 1700,
    salePrice: 'Rs. 1,499.00',
    regularPrice: 'Rs. 1,700.00',
    discount: 'Save 12%',
    defaultSize: '30',
    availableSizes: ['28', '30', '32', '34'],
    images: [
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6915.webp?v=1795179025&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6811.webp?v=1795179025&width=1200',
      'https://blurgvillage.com/cdn/shop/files/WEBP_File_6930.webp?v=1795179025&width=1200'
    ],
    measurements: DEFAULT_MEASUREMENTS,
    details: DEFAULT_DETAILS,
    shipping: DEFAULT_SHIPPING,
    selectStory: DEFAULT_SELECT_STORY,
    relatedHandles: ['vexo-blue-baggy', 'tinted-blue-wide', 'nid-blue-wide', 'after-blue-wide']
  }
};

/**
 * Retrieve product by handle with intelligent fallback
 */
export function getProductByHandle(handle) {
  if (!handle) return PRODUCTS_DATA['vexo-blue-baggy'];

  const normalizedHandle = handle.toLowerCase().trim();

  // 1. Direct hit in primary catalog
  if (PRODUCTS_DATA[normalizedHandle]) {
    return PRODUCTS_DATA[normalizedHandle];
  }

  // 2. Check in Category Fits data
  for (const fitKey of Object.keys(CATEGORY_FITS_DATA)) {
    const list = CATEGORY_FITS_DATA[fitKey] || [];
    const found = list.find((item) => item.handle === normalizedHandle || item.id === normalizedHandle);
    if (found) {
      return {
        id: found.id,
        title: found.title,
        handle: found.handle || found.id,
        fit: `${found.fit ? found.fit.toUpperCase() : 'CORE'} FIT`,
        category: 'VEYN-SELECTS',
        badge: found.badge || 'NEW',
        price: found.price || 1199,
        comparePrice: found.comparePrice || 1699,
        salePrice: found.salePrice || `Rs. ${found.price || 1199}.00`,
        regularPrice: found.regularPrice || `Rs. ${found.comparePrice || 1699}.00`,
        discount: 'Save 29%',
        defaultSize: found.availableSizes?.[0] || '30',
        availableSizes: found.availableSizes || ['28', '30', '32', '34', '36'],
        images: found.images && found.images.length > 0 ? found.images : ['/images/products/artic-blue-wide.jpg'],
        measurements: DEFAULT_MEASUREMENTS,
        details: DEFAULT_DETAILS,
        shipping: DEFAULT_SHIPPING,
        selectStory: DEFAULT_SELECT_STORY,
        relatedHandles: ['vexo-blue-baggy', 'tinted-blue-wide', 'nid-blue-wide', 'coal-blue-baggy']
      };
    }
  }

  // 3. Check in New Arrivals data
  const newArrival = NEW_ARRIVALS_PRODUCTS.find(
    (item) => item.handle === normalizedHandle || item.id === normalizedHandle
  );
  if (newArrival) {
    return {
      id: newArrival.id,
      title: newArrival.title,
      handle: newArrival.handle || newArrival.id,
      fit: 'WIDE FIT',
      category: 'VEYN-SELECTS',
      badge: newArrival.badge || 'NEW',
      price: newArrival.price || 1199,
      comparePrice: newArrival.comparePrice || 1599,
      salePrice: newArrival.salePrice || `Rs. ${newArrival.price || 1199}.00`,
      regularPrice: newArrival.regularPrice || `Rs. ${newArrival.comparePrice || 1599}.00`,
      discount: 'Save 25%',
      defaultSize: newArrival.availableSizes?.[0] || '30',
      availableSizes: newArrival.availableSizes || ['28', '30', '32', '34', '36'],
      images: newArrival.images && newArrival.images.length > 0 ? newArrival.images : ['/images/products/artic-blue-wide.jpg'],
      measurements: DEFAULT_MEASUREMENTS,
      details: DEFAULT_DETAILS,
      shipping: DEFAULT_SHIPPING,
      selectStory: DEFAULT_SELECT_STORY,
      relatedHandles: ['vexo-blue-baggy', 'tinted-blue-wide', 'nid-blue-wide', 'coal-blue-baggy']
    };
  }

  // 4. Fallback to vexo-blue-baggy
  return PRODUCTS_DATA['vexo-blue-baggy'];
}

/**
 * Return all static handles for Next.js getStaticPaths / generateStaticParams
 */
export function getAllProductHandles() {
  const handles = new Set(Object.keys(PRODUCTS_DATA));

  for (const fitKey of Object.keys(CATEGORY_FITS_DATA)) {
    (CATEGORY_FITS_DATA[fitKey] || []).forEach((item) => {
      if (item.handle) handles.add(item.handle);
    });
  }

  NEW_ARRIVALS_PRODUCTS.forEach((item) => {
    if (item.handle) handles.add(item.handle);
  });

  return Array.from(handles);
}
