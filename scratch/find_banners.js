const fs = require('fs');
const content = fs.readFileSync('C:/Users/hp/.gemini/antigravity/brain/eac37cb9-0f0f-4185-be32-27c1bd882b1b/.user_uploaded/media_1795195387628_1d710506.html', 'utf8');
const bannerMatches = content.match(/<[^>]*banner[^>]*>/gi);
console.log('banner tag matches:', bannerMatches ? bannerMatches.slice(0, 10) : 'none');
const imgMatches = content.match(/https?:\/\/[^\s\"'<>]+?\.(?:jpg|jpeg|png|webp)/gi);
const uniqueImgs = [...new Set(imgMatches || [])];
console.log('unique images count:', uniqueImgs.length);
console.log('sample images:', uniqueImgs.slice(0, 10));
