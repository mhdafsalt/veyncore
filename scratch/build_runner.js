const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = 'c:/afsall/All_Projects/veyncore/frontend';

// Pre-create common Next.js directories to avoid Windows EPERM on mkdir
const dirsToEnsure = [
  '.next',
  '.next/types',
  '.next/types/app',
  '.next/types/app/_not-found',
  '.next/types/app/collections',
  '.next/types/app/products',
  '.next/types/app/account',
  '.next/types/app/veyn-objects',
  '.next/server',
  '.next/server/app',
  '.next/server/app/_not-found',
  '.next/server/app/collections',
  '.next/server/app/products',
  '.next/server/app/account',
  '.next/server/app/veyn-objects',
  '.next/static',
  '.next/static/chunks',
  '.next/static/chunks/app',
  '.next/static/chunks/app/_not-found',
  '.next/static/chunks/app/collections',
  '.next/static/chunks/app/products',
  '.next/static/chunks/app/account',
  '.next/static/chunks/app/veyn-objects'
];

function ensureDirs() {
  dirsToEnsure.forEach(d => {
    const full = path.join(baseDir, d);
    if (!fs.existsSync(full)) {
      try { fs.mkdirSync(full, { recursive: true }); } catch (e) {}
    }
  });

  const pagesDir = path.join(baseDir, '.next/server/pages');
  if (fs.existsSync(pagesDir)) {
    try { fs.rmSync(pagesDir, { recursive: true, force: true }); } catch (e) {}
  }
}

console.log('App Router build environment verified with _not-found.');

let succeeded = false;
let attempts = 0;
while (!succeeded && attempts < 3) {
  attempts++;
  try {
    ensureDirs();
    const out = execSync('npx next build --no-lint', {
      cwd: baseDir,
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }
    });
    console.log('Build succeeded:\n', out);
    succeeded = true;
  } catch (err) {
    if (attempts >= 3) {
      console.error('Build output:\n', err.stdout);
      console.error('Build error:\n', err.stderr || err.message);
      process.exit(1);
    }
    console.log(`Build attempt ${attempts} hit transient error, retrying...`);
    ensureDirs();
  }
}
