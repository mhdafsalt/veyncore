const fs = require('fs');
const content = fs.readFileSync('C:/Users/hp/.gemini/antigravity/brain/eac37cb9-0f0f-4185-be32-27c1bd882b1b/.user_uploaded/media_1795195387628_1d710506.html', 'utf8');
['IMG_5790.png', 'ChatGPT_Image'].forEach(term => {
  let idx = 0;
  while ((idx = content.indexOf(term, idx)) !== -1) {
    console.log('TERM:', term);
    console.log(content.substring(Math.max(0, idx - 200), Math.min(content.length, idx + 200)));
    console.log('---');
    idx += term.length;
  }
});
