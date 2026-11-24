const path = require('path');
const mongoose = require(path.resolve(__dirname, '../backend/node_modules/mongoose'));
require(path.resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../backend/.env') });

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const content = await mongoose.connection.collection('sitecontents').findOne({ key: 'main_site_content' });
    if (content && content.subcategories) {
      console.log('Total subcategories:', content.subcategories.length);
      console.log(content.subcategories.map(s => ({
        id: s.id,
        label: s.label,
        mainCategory: s.mainCategory,
        isGlow: s.isGlow
      })));
    } else {
      console.log('No subcategories in DB');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}
check();
