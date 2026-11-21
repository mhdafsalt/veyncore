const fs = require('fs');
const content = fs.readFileSync('C:/Users/hp/.gemini/antigravity/brain/eac37cb9-0f0f-4185-be32-27c1bd882b1b/.user_uploaded/media_1795097618734_73af0c49.html', 'utf8');
const footerIdx = content.indexOf('<footer');
console.log('Footer index:', footerIdx);
if (footerIdx !== -1) {
  const beforeFooter = content.substring(footerIdx - 4000, footerIdx);
  console.log(beforeFooter);
}
