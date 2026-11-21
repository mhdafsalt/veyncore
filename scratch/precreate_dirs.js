const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..', 'frontend', '.next');
const dirs = [
  'static/chunks/app/collections/all-drops',
  'static/chunks/app/collections/all',
  'static/chunks/app/products/[handle]',
  'static/chunks/app/account/login',
  'static/chunks/pages',
  'server/app/collections/all-drops',
  'server/app/collections/all',
  'server/app/products/[handle]',
  'server/app/account/login',
  'server/pages',
  'types/app/collections/all-drops',
  'types/app/collections/all',
  'types/app/products/[handle]',
  'types/app/account/login',
];

dirs.forEach(d => {
  const full = path.join(base, d);
  fs.mkdirSync(full, { recursive: true });
});
console.log('Precreated .next directories successfully');
