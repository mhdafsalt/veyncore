const fs = require('fs');
const content = fs.readFileSync('C:/Users/hp/.gemini/antigravity/brain/eac37cb9-0f0f-4185-be32-27c1bd882b1b/.user_uploaded/media_1795097618734_73af0c49.html', 'utf8');
const idx = content.indexOf('section__image-with-text-overlay');
if (idx !== -1) {
  console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 2500)));
}
