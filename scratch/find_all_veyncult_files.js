const fs = require('fs');
const content = fs.readFileSync('C:/Users/hp/.gemini/antigravity/brain/eac37cb9-0f0f-4185-be32-27c1bd882b1b/.user_uploaded/media_1795195387628_1d710506.html', 'utf8');
const matches = content.match(/\/\/veyncult\.com\/cdn\/shop\/files\/[^\s\"'&?]+/gi) || [];
const unique = [...new Set(matches)];
console.log('unique veyncult cdn files:', unique.length);
unique.forEach(u => console.log(u));
