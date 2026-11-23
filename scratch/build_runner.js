const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = path.resolve(__dirname, '..', 'frontend');

const routes = [
  '',
  '_not-found',
  'admin',
  'account',
  'account/login',
  'collections',
  'collections/all',
  'collections/all-drops',
  'collections/objects',
  'collections/objects-drops',
  'products',
  'products/[handle]',
  'veyn-objects'
];

function ensureDirs() {
  const prefixes = [
    '.next',
    '.next/types',
    '.next/types/app',
    '.next/server',
    '.next/server/app',
    '.next/static',
    '.next/static/chunks',
    '.next/static/chunks/app'
  ];

  prefixes.forEach(p => {
    const full = path.join(baseDir, p);
    if (!fs.existsSync(full)) {
      try { fs.mkdirSync(full, { recursive: true }); } catch (e) {}
    }
  });

  routes.forEach(r => {
    ['.next/types/app', '.next/server/app', '.next/static/chunks/app'].forEach(prefix => {
      const full = path.join(baseDir, prefix, r);
      if (!fs.existsSync(full)) {
        try { fs.mkdirSync(full, { recursive: true }); } catch (e) {}
      }
    });
  });

  const pagesDir = path.join(baseDir, '.next/server/pages');
  if (fs.existsSync(pagesDir)) {
    try { fs.rmSync(pagesDir, { recursive: true, force: true }); } catch (e) {}
  }
}

console.log('Precreating .next directories for sandboxed build...');
ensureDirs();

let succeeded = false;
let attempts = 0;
while (!succeeded && attempts < 3) {
  attempts++;
  ensureDirs();
  const interval = setInterval(ensureDirs, 100);
  try {
    const out = execSync('npx next build --no-lint', {
      cwd: baseDir,
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }
    });
    clearInterval(interval);
    console.log('Build succeeded:\n', out);
    succeeded = true;
  } catch (err) {
    clearInterval(interval);
    if (attempts >= 3) {
      console.error('Build output:\n', err.stdout);
      console.error('Build error:\n', err.stderr || err.message);
      process.exit(1);
    }
    console.log(`Build attempt ${attempts} hit transient error, retrying...`);
    ensureDirs();
  }
}
