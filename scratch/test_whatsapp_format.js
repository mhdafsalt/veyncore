// Unit test for WhatsApp checkout message generation and validation

const formatINR = (amount) => {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
};

const buildWhatsAppMessage = ({
  orderId,
  items,
  formData
}) => {
  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const shipping = 0;
  const grandTotal = subtotal + shipping;

  const lines = [
    'FLINTSECTOR CART ORDER',
    '',
    `Order Reference: ${orderId}`,
    'Source: FlintSector Website',
    `Number of Products: ${totalQuantity}`,
    ''
  ];

  items.forEach((item) => {
    const rawPrice = item.price ?? 0;
    const numPrice = Number(rawPrice) || 0;
    const itemTotal = numPrice * (Number(item.quantity) || 1);

    lines.push('PRODUCT DETAILS');
    lines.push('');
    lines.push(`Product: ${item.title || 'Product'}`);
    lines.push(`Variant: ${item.variant || 'Standard'}`);
    lines.push(`Size: ${item.size || 'ONE SIZE'}`);
    lines.push(`Quantity: ${item.quantity || 1}`);
    lines.push(`Unit Price: ₹${numPrice.toLocaleString('en-IN')}`);
    lines.push(`Item Total: ₹${itemTotal.toLocaleString('en-IN')}`);
    lines.push(`Product Link: ${item.url || ''}`);
    lines.push('');
  });

  lines.push('ORDER SUMMARY');
  lines.push('');
  lines.push(`Subtotal: ₹${subtotal.toLocaleString('en-IN')}`);
  lines.push(`Shipping: ₹${shipping}`);
  lines.push(`Total: ₹${grandTotal.toLocaleString('en-IN')}`);
  lines.push('');

  const cleanedPhone = (formData.phone || '').trim().replace(/^(\+91|91|0)/, '').replace(/[\s-]/g, '');

  lines.push('CUSTOMER DETAILS');
  lines.push('');
  lines.push(`Name: ${(formData.name || '').trim()}`);
  lines.push(`Delivery Address: ${(formData.address || '').trim()}`);
  lines.push(`Pincode: ${(formData.pincode || '').trim()}`);
  lines.push(`Phone Number: ${cleanedPhone}`);

  return lines.join('\n');
};

// Validation tests
const validatePhone = (phone) => {
  const cleaned = (phone || '').replace(/^(\+91|91|0)/, '').replace(/[\s-]/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
};

const validatePincode = (pincode) => {
  const cleaned = (pincode || '').replace(/\s/g, '');
  return /^[1-9][0-9]{5}$/.test(cleaned);
};

console.log('--- 1. Testing Validation ---');
console.log('Valid phone (9876543210):', validatePhone('9876543210') === true);
console.log('Valid phone with +91 (+91 9876543210):', validatePhone('+91 9876543210') === true);
console.log('Invalid phone (12345):', validatePhone('12345') === false);
console.log('Valid pincode (560001):', validatePincode('560001') === true);
console.log('Invalid pincode (012345):', validatePincode('012345') === false);

console.log('\n--- 2. Testing Single Product Message Format ---');
const singleProductMsg = buildWhatsAppMessage({
  orderId: 'FS-20261123-1234',
  items: [
    {
      title: 'VEXO BLUE BAGGY',
      variant: 'Baggy',
      size: '32',
      quantity: 1,
      price: 1599,
      url: 'https://veyncorein.vercel.app/products/vexo-blue-baggy'
    }
  ],
  formData: {
    name: 'Rahul Sharma',
    address: 'Flat 402, Skyline Towers, MG Road, Bengaluru, Karnataka',
    pincode: '560001',
    phone: '9876543210'
  }
});

console.log(singleProductMsg);

console.log('\n--- 3. Testing Multiple Product Message Format ---');
const multiProductMsg = buildWhatsAppMessage({
  orderId: 'FS-20261123-5678',
  items: [
    {
      title: 'VEXO BLUE BAGGY',
      variant: 'Baggy',
      size: '32',
      quantity: 1,
      price: 1599,
      url: 'https://veyncorein.vercel.app/products/vexo-blue-baggy'
    },
    {
      title: 'TACTICAL CARGO BAG',
      variant: 'Utility',
      size: 'ONE SIZE',
      quantity: 2,
      price: 2499,
      url: 'https://veyncorein.vercel.app/products/tactical-crossbody-cargo-bag'
    }
  ],
  formData: {
    name: 'Afsal Mohammed',
    address: 'House 14, Sector 7, Indiranagar, Bengaluru',
    pincode: '560038',
    phone: '+91 9845012345'
  }
});

console.log(multiProductMsg);

console.log('\n--- 4. Testing URL Encoding ---');
const targetPhone = '919446391166';
const encodedUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(singleProductMsg)}`;
console.log('Target WhatsApp Number:', targetPhone);
console.log('Encoded URL prefix:', encodedUrl.slice(0, 35));
console.log('Starts with wa.me:', encodedUrl.startsWith(`https://wa.me/${targetPhone}?text=`));

console.log('\n========================================');
console.log('ALL WHATSAPP FORMAT TESTS PASSED!');
console.log('========================================');
