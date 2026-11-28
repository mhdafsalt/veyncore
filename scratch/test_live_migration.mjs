import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const API_BASE = 'https://api.veyncore.in';
const FRONTEND_BASE = 'https://veyncore.in';

async function testSuite() {
  console.log('====================================================');
  console.log('   VEYNCORE PRODUCTION DOMAIN MIGRATION VERIFICATION');
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

  // 1. Health check
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    const data = await res.json();
    assert(res.status === 200 && data.success === true, 'Backend /api/health returned 200 OK with success=true');
  } catch (e) {
    assert(false, `Backend /api/health check failed: ${e.message}`);
  }

  // 2. Root API check
  try {
    const res = await fetch(`${API_BASE}/`);
    const data = await res.json();
    assert(res.status === 200 && data.name === 'Veyncore Backend API', 'Backend root API / returned 200 OK');
  } catch (e) {
    assert(false, `Backend root / check failed: ${e.message}`);
  }

  // 3. Products catalog check
  try {
    const res = await fetch(`${API_BASE}/api/products?limit=5`);
    const data = await res.json();
    assert(res.status === 200 && data.success === true && Array.isArray(data.data) && data.data.length > 0, `Products loaded: ${data.data?.length} products found in MongoDB`);
    if (data.data && data.data[0]) {
      const p = data.data[0];
      const hasCloudinaryImg = p.images?.some(img => img.includes('cloudinary.com')) || p.thumbnail?.includes('cloudinary.com');
      assert(hasCloudinaryImg, `Product images point to Cloudinary CDN: ${p.thumbnail?.slice(0, 60)}...`);
    }
  } catch (e) {
    assert(false, `Products check failed: ${e.message}`);
  }

  // 4. Content / Subcategories check
  try {
    const res = await fetch(`${API_BASE}/api/content/subcategories`);
    const data = await res.json();
    assert(res.status === 200 && (data.success === true || Array.isArray(data.data)), 'Subcategories API loaded successfully');
  } catch (e) {
    assert(false, `Subcategories check failed: ${e.message}`);
  }

  // 5. Active Launch Sale check
  try {
    const res = await fetch(`${API_BASE}/api/launch-sales/active`);
    assert(res.status === 200 || res.status === 404, `Launch sale check returned status ${res.status}`);
  } catch (e) {
    assert(false, `Launch sale check failed: ${e.message}`);
  }

  // 6. CORS Check for Apex (https://veyncore.in)
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://veyncore.in',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'authorization,content-type'
      }
    });
    const allowOrigin = res.headers.get('access-control-allow-origin');
    const allowCreds = res.headers.get('access-control-allow-credentials');
    assert(res.status === 200 && allowOrigin === 'https://veyncore.in', `CORS Origin allow for https://veyncore.in: ${allowOrigin}`);
    assert(allowCreds === 'true', 'CORS Credentials allow=true');
  } catch (e) {
    assert(false, `CORS check for https://veyncore.in failed: ${e.message}`);
  }

  // 7. CORS Check for WWW (https://www.veyncore.in)
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://www.veyncore.in',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'authorization,content-type'
      }
    });
    const allowOrigin = res.headers.get('access-control-allow-origin');
    assert(res.status === 200 && allowOrigin === 'https://www.veyncore.in', `CORS Origin allow for https://www.veyncore.in: ${allowOrigin}`);
  } catch (e) {
    assert(false, `CORS check for https://www.veyncore.in failed: ${e.message}`);
  }

  // 8. Admin route protection (without token)
  try {
    const res = await fetch(`${API_BASE}/api/admin/overview`);
    assert(res.status === 401, `Protected /api/admin/overview without token returned 401 Unauthorized (got ${res.status})`);
  } catch (e) {
    assert(false, `Admin route protection check failed: ${e.message}`);
  }

  // 9. Frontend Apex check
  try {
    const res = await fetch(`${FRONTEND_BASE}/`);
    assert(res.status === 200, `Frontend Apex (${FRONTEND_BASE}/) returned 200 OK`);
  } catch (e) {
    assert(false, `Frontend Apex check failed: ${e.message}`);
  }

  // 10. Frontend WWW check
  try {
    const res = await fetch('https://www.veyncore.in/');
    assert(res.status === 200, 'Frontend WWW (https://www.veyncore.in/) returned 200 OK');
  } catch (e) {
    assert(false, `Frontend WWW check failed: ${e.message}`);
  }

  console.log('\n====================================================');
  console.log(`  SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');
}

testSuite();
