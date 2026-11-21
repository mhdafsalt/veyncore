const fs = require('fs');
const dir = 'C:/Users/hp/.gemini/antigravity/brain/eac37cb9-0f0f-4185-be32-27c1bd882b1b/.user_uploaded/';
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const cdnBanners = [];
htmlFiles.forEach(f => {
  const content = fs.readFileSync(dir + f, 'utf8');
  const urls = content.match(/https?:\/\/[^\s\"'<>]+?\.(?:jpg|jpeg|png|webp)/gi) || [];
  urls.forEach(u => {
    if (u.toLowerCase().includes('banner') || u.toLowerCase().includes('hero') || u.toLowerCase().includes('campaign') || u.toLowerCase().includes('lookbook')) {
      cdnBanners.push(u);
    }
  });
});
console.log('Banner images in HTML:', [...new Set(cdnBanners)]);
