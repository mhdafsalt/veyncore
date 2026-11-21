const fs = require('fs');
const content = fs.readFileSync('C:/Users/hp/.gemini/antigravity/brain/eac37cb9-0f0f-4185-be32-27c1bd882b1b/.user_uploaded/media_1795195387628_1d710506.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('.quick-add') || l.includes('quick_add')) {
    console.log(`L${idx+1}:`, l);
  }
});
