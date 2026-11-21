const fs = require('fs');
const content = fs.readFileSync('C:/Users/hp/.gemini/antigravity/brain/eac37cb9-0f0f-4185-be32-27c1bd882b1b/.user_uploaded/media_1795097618734_73af0c49.html', 'utf8');
const urls = content.match(/https?:\/\/[^\s\"'<>]+?\.(?:jpg|jpeg|png|webp)/gi) || [];
console.log('unique urls in 73af0c49:', [...new Set(urls)].slice(0, 20));
