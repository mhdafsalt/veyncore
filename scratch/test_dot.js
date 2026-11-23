const parseNumericPrice = (val, fallback = 0) => {
  if (typeof val === 'number') {
    return isNaN(val) ? fallback : val;
  }
  if (!val) return fallback;

  const str = String(val);
  const stripped = str
    .replace(/Rs\./gi, '')
    .replace(/Rs/gi, '')
    .replace(/INR/gi, '')
    .replace(/[₹$,]/g, '')
    .trim();

  const match = stripped.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    const parsed = parseFloat(match[1]);
    return isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
};

const testCases = [
  1199,
  "1199",
  "Rs. 1,199.00",
  "Rs. 1,199",
  "Rs. 1,499.00 INR",
  "₹1,599",
  "₹ 1,599.00",
  "Rs.1,199.00",
  "1,199.00",
  "Rs. 0.12",
  null,
  undefined
];

testCases.forEach(tc => {
  console.log(`Input: ${JSON.stringify(tc)} -> Parsed: ${parseNumericPrice(tc)}`);
});
