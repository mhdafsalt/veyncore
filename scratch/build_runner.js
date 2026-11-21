const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = 'c:/afsall/All_Projects/veyncore/frontend';

// Clean out any stale .next/server/pages and pages chunks
const pagesDir = path.join(baseDir, '.next/server/pages');
if (fs.existsSync(pagesDir)) {
  fs.rmSync(pagesDir, { recursive: true, force: true });
}
const pagesChunksDir = path.join(baseDir, '.next/static/chunks/pages');
if (fs.existsSync(pagesChunksDir)) {
  fs.rmSync(pagesChunksDir, { recursive: true, force: true });
}

const routes = [
  'account/login',
  'collections',
  'collections/all',
  'collections/all-drops',
  'products',
  'products/[handle]'
];

const prefixes = [
  '.next/static/chunks/app',
  '.next/server/app',
  '.next/types/app'
];

prefixes.forEach(prefix => {
  routes.forEach(r => {
    const full = path.join(baseDir, prefix, r);
    fs.mkdirSync(full, { recursive: true });
  });
});

['.next/static/css', '.next/static/media', '.next/server/chunks', '.next/server/vendor-chunks'].forEach(extra => {
  fs.mkdirSync(path.join(baseDir, extra), { recursive: true });
});

console.log('All route skeletons ready.');

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
