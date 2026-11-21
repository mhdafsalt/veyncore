const fs = require('fs');
const dir = 'C:/Users/hp/.gemini/antigravity/brain/eac37cb9-0f0f-4185-be32-27c1bd882b1b/.user_uploaded/';
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
htmlFiles.forEach(f => {
  const content = fs.readFileSync(dir + f, 'utf8');
  const banners = content.match(/class="[^"]*(?:banner|image-with-text|hero|featured-image)[^"]*"/gi);
  if (banners) {
    console.log(f, 'has banner classes:', banners.slice(0, 5));
  }
});
