const mongoose = require('mongoose');

const uri = 'mongodb+srv://veyncore:719688@cluster0.xcr8hqb.mongodb.net/veyncore';

async function check() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const productsColl = db.collection('products');
    const allProducts = await productsColl.find({}).toArray();
    console.log(`Found ${allProducts.length} products in MongoDB:`);
    allProducts.forEach(p => {
      console.log(`- ${p.title} (${p.handle}): price=${p.price}, salePrice=${p.salePrice}, regularPrice=${p.regularPrice}, comparePrice=${p.comparePrice}`);
    });
    
    const iceBlue = await productsColl.findOne({ $or: [{ handle: 'ice-blue-wide' }, { title: /ice blue/i }] });
    if (iceBlue) {
      console.log('Found Ice Blue:', iceBlue);
    } else {
      console.log('Ice Blue not found in MongoDB');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

check();
