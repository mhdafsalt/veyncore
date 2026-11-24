/**
 * ALL DROPS Catalog Data for VEYNCORE
 * Static products data completely removed.
 * All products are fetched dynamically from MongoDB via the backend API.
 */

export const ALL_DROPS_PRODUCTS = [];

export const SORT_OPTIONS = [
  { label: 'Date, new to old', value: 'date-desc' },
  { label: 'Date, old to new', value: 'date-asc' },
  { label: 'Price, low to high', value: 'price-asc' },
  { label: 'Price, high to low', value: 'price-desc' },
  { label: 'Alphabetically, A-Z', value: 'title-asc' },
  { label: 'Alphabetically, Z-A', value: 'title-desc' },
  { label: 'Featured', value: 'featured' },
  { label: 'Best selling', value: 'best-selling' }
];

export const COLLECTION_PRICE_RANGE = {
  min: 0,
  max: 5000
};

export default ALL_DROPS_PRODUCTS;
