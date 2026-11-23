import { getProductByHandle } from '../frontend/src/data/productsData.js';
import { ALL_DROPS_PRODUCTS } from '../frontend/src/data/allDropsData.js';
import { CATEGORY_FITS_DATA } from '../frontend/src/data/categoryFitsData.js';
import { NEW_ARRIVALS_PRODUCTS } from '../frontend/src/data/newArrivalsData.js';

console.log('--- getProductByHandle("ice-blue-wide") ---');
const p = getProductByHandle('ice-blue-wide');
console.log('Product:', {
  id: p?.id,
  title: p?.title,
  price: p?.price,
  salePrice: p?.salePrice,
  regularPrice: p?.regularPrice,
  comparePrice: p?.comparePrice,
  type_of_price: typeof p?.price,
  type_of_salePrice: typeof p?.salePrice
});

const rawPrice = p?.salePrice ?? p?.price ?? 1299;
const numPrice = typeof rawPrice === 'number'
  ? rawPrice
  : (parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0);
console.log('PDP Calculation: rawPrice =', rawPrice, '| numPrice =', numPrice);
