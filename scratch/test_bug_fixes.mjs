import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const API_BASE = 'https://api.veyncore.in';
const FRONTEND_BASE = 'https://veyncore.in';

async function runBugFixVerification() {
  console.log('====================================================');
  console.log('   VEYNCORE CRITICAL PRODUCTION BUG FIX VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(cond, msg) {
    if (cond) {
      console.log(`  ✓ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  }

  // --- 1. LAUNCH PRODUCTS LOADING VERIFICATION ---
  console.log('[1/4] Verifying Launch Products API & Data Structure...');
  try {
    const res = await fetch(`${API_BASE}/api/launch-sales/active?t=${Date.now()}`);
    const json = await res.json();
    assert(res.status === 200, `Active Launch Sales returned status 200 (got ${res.status})`);
    assert(json.success === true, 'Response JSON success is true');
    assert(Array.isArray(json.data) && json.data.length > 0, `Active sales returned ${json.data?.length} products`);
    if (json.data && json.data.length > 0) {
      const item = json.data[0];
      assert(Boolean(item.title && item.handle), `Item has title "${item.title}" and handle "${item.handle}"`);
      assert(Number(item.price) > 0, `Discounted price calculated: ${item.price} (original: ${item.originalPrice})`);
      assert(Boolean(item.endDateTime && item.remainingMs > 0), `Remaining countdown valid: ${item.remainingMs}ms`);
    }
  } catch (e) {
    assert(false, `Launch Sales API failed: ${e.message}`);
  }

  // --- 2. MULTIPLE REPEATED LAUNCH SALE QUERIES (SIMULATING FAST FIRST-VISIT NAVIGATION) ---
  console.log('\n[2/4] Simulating 5 Rapid Sequential Requests to Launch Sale Endpoint...');
  let rapidSuccess = true;
  for (let i = 1; i <= 5; i++) {
    try {
      const r = await fetch(`${API_BASE}/api/launch-sales/active?t=${Date.now() + i}`);
      const d = await r.json();
      if (r.status !== 200 || !d.success || !Array.isArray(d.data)) {
        rapidSuccess = false;
        console.error(`  Rapid request ${i} failed with status ${r.status}`);
      }
    } catch (e) {
      rapidSuccess = false;
      console.error(`  Rapid request ${i} exception: ${e.message}`);
    }
  }
  assert(rapidSuccess, 'All 5 rapid sequential Launch Sale requests succeeded with 200 OK');

  // --- 3. PRODUCT DETAIL LOOKUP & 404 INTEGRITY ---
  console.log('\n[3/4] Verifying Product Detail Lookups across various handle formats...');
  
  // A. Product by lowercase handle
  try {
    const res = await fetch(`${API_BASE}/api/products/wide-efd`);
    const json = await res.json();
    assert(res.status === 200 && json.success === true && json.data?.handle === 'wide-efd', 'Product lookup by lowercase handle ("wide-efd") succeeded');
  } catch (e) {
    assert(false, `Lookup wide-efd failed: ${e.message}`);
  }

  // B. Product by mixed-case handle
  try {
    const res = await fetch(`${API_BASE}/api/products/Wide-Efd`);
    const json = await res.json();
    assert(res.status === 200 && json.success === true && json.data?.title === 'WIDE EFD', 'Product lookup by mixed-case handle ("Wide-Efd") succeeded');
  } catch (e) {
    assert(false, `Lookup Wide-Efd failed: ${e.message}`);
  }

  // C. Product by ObjectId
  try {
    const res = await fetch(`${API_BASE}/api/products/6b065978d650430872a511a0`);
    const json = await res.json();
    assert(res.status === 200 && json.success === true && json.data?.handle === 'wide-efd', 'Product lookup by MongoDB ObjectId succeeded');
  } catch (e) {
    assert(false, `Lookup by ObjectId failed: ${e.message}`);
  }

  // D. Catalog product: ashwave-baggy-denim
  try {
    const res = await fetch(`${API_BASE}/api/products/ashwave-baggy-denim`);
    const json = await res.json();
    assert(res.status === 200 && json.success === true && json.data?.title === 'ASHWAVE BAGGY DENIM', 'Product lookup for "ashwave-baggy-denim" succeeded');
  } catch (e) {
    assert(false, `Lookup ashwave-baggy-denim failed: ${e.message}`);
  }

  // E. Catalog product: frostline-baggy-jeans
  try {
    const res = await fetch(`${API_BASE}/api/products/frostline-baggy-jeans`);
    const json = await res.json();
    assert(res.status === 200 && json.success === true, 'Product lookup for "frostline-baggy-jeans" succeeded');
  } catch (e) {
    assert(false, `Lookup frostline-baggy-jeans failed: ${e.message}`);
  }

  // F. Genuine invalid product handle -> MUST return 404, not 500 or 503
  try {
    const res = await fetch(`${API_BASE}/api/products/completely-non-existent-handle-xyz-9999`);
    const json = await res.json();
    assert(res.status === 404 && json.success === false, 'Genuinely invalid product returned exact 404 Not Found (not 500 or 503)');
  } catch (e) {
    assert(false, `Invalid product check failed: ${e.message}`);
  }

  // --- 4. LIVE FRONTEND ENDPOINTS CHECK ---
  console.log('\n[4/4] Verifying Live Storefront Pages...');
  try {
    const res = await fetch(`${FRONTEND_BASE}/collections/launch-sale`);
    assert(res.status === 200, `Frontend Launch Sale page (${FRONTEND_BASE}/collections/launch-sale) returned 200 OK`);
  } catch (e) {
    assert(false, `Frontend Launch Sale page failed: ${e.message}`);
  }

  try {
    const res = await fetch(`${FRONTEND_BASE}/products/wide-efd`);
    assert(res.status === 200, `Frontend Product page (${FRONTEND_BASE}/products/wide-efd) returned 200 OK`);
  } catch (e) {
    assert(false, `Frontend Product page failed: ${e.message}`);
  }

  console.log('\n====================================================');
  console.log(`  SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');
}

runBugFixVerification();
