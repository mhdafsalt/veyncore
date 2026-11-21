const fs = require('fs');
const dir = 'C:/Users/hp/.gemini/antigravity/brain/eac37cb9-0f0f-4185-be32-27c1bd882b1b/.user_uploaded/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
console.log('Total user uploaded images:', files.length);
files.forEach(f => {
  const stat = fs.statSync(dir + f);
  console.log(f, (stat.size / 1024).toFixed(1) + ' KB');
});
