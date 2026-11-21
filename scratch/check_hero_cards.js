const fs = require('fs');
['hero-card-1.jpg', 'hero-card-2.jpg', 'hero-card-3.jpg'].forEach(f => {
  const p = 'frontend/public/images/hero/' + f;
  if (fs.existsSync(p)) {
    console.log(f, fs.statSync(p).size);
  }
});
