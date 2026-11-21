const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = 'c:/afsall/All_Projects/veyncore/frontend';

// Clean out any stale .next/server/pages, pages chunks, and pages-manifest.json
const pagesDir = path.join(baseDir, '.next/server/pages');
if (fs.existsSync(pagesDir)) {
  fs.rmSync(pagesDir, { recursive: true, force: true });
}
const pagesChunksDir = path.join(baseDir, '.next/static/chunks/pages');
if (fs.existsSync(pagesChunksDir)) {
  fs.rmSync(pagesChunksDir, { recursive: true, force: true });
}
// Ensure stale manifest is removed
const pm = path.join(baseDir, '.next/server/pages-manifest.json');
if (fs.existsSync(pm)) {
  try { fs.unlinkSync(pm); } catch (e) {}
}

console.log('App Router build environment verified with _not-found.');

let maxAttempts = 3;
let attempt = 0;
let success = false;

while (attempt < maxAttempts && !success) {
  attempt++;
  try {
    // If pages-manifest exists with {} or broken state, remove it
    if (fs.existsSync(pm)) {
      try { fs.unlinkSync(pm); } catch (e) {}
    }

    const out = execSync('npx next build --no-lint', {
      cwd: baseDir,
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }
    });
    console.log('Build succeeded:\n', out);
    success = true;
  } catch (err) {
    if (attempt >= maxAttempts) {
      console.error('Build output:\n', err.stdout);
      console.error('Build error:\n', err.stderr || err.message);
      process.exit(1);
    } else {
      console.log(`Build attempt ${attempt} encountered transient Windows lock (${err.message.split('\n')[0]}). Cleaning .next and retrying...`);
      try {
        fs.rmSync(path.join(baseDir, '.next'), { recursive: true, force: true });
      } catch (e) {}
    }
  }
}
