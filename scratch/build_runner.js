const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = 'c:/afsall/All_Projects/veyncore/frontend';

const dirs = [
  '.next/static/chunks/app/collections/all-drops',
  '.next/static/chunks/app/collections/all',
  '.next/static/chunks/app/products/[handle]',
  '.next/static/chunks/app/account/login',
  '.next/static/chunks/pages',
  '.next/static/css',
  '.next/static/media',
  '.next/server/app/collections/all-drops',
  '.next/server/app/collections/all',
  '.next/server/app/products/[handle]',
  '.next/server/app/account/login',
  '.next/server/chunks',
  '.next/server/vendor-chunks',
  '.next/server/pages',
  '.next/types/app/collections/all-drops',
  '.next/types/app/collections/all',
  '.next/types/app/products/[handle]',
  '.next/types/app/account/login',
];

dirs.forEach(d => {
  const full = path.join(baseDir, d);
  fs.mkdirSync(full, { recursive: true });
});

console.log('Skeleton directories ready.');

try {
  const out = execSync('npx next build --no-lint', {
    cwd: baseDir,
    encoding: 'utf8',
    stdio: 'pipe',
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }
  });
  console.log('Build succeeded:\n', out);
} catch (err) {
  console.error('Build output:\n', err.stdout);
  console.error('Build error:\n', err.stderr || err.message);
  process.exit(1);
}
