async function checkEndpoint(name, url, options = {}) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    console.log(`\n=== ${name} (${url}) ===`);
    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log(`Headers:`, Object.fromEntries(res.headers.entries()));
    try {
      const json = JSON.parse(text);
      console.log(`Body (JSON):`, json);
    } catch {
      console.log(`Body (Text):`, text.slice(0, 300));
    }
    return { status: res.status, headers: res.headers, text };
  } catch (err) {
    console.log(`\n=== ${name} (${url}) ===`);
    console.log(`ERROR: ${err.message}`);
    return { error: err.message };
  }
}

async function run() {
  // 1. Health endpoint
  await checkEndpoint('Backend Health', 'https://api.veyncore.in/api/health');

  // 2. Root API info
  await checkEndpoint('Backend Root API', 'https://api.veyncore.in/');

  // 3. Products API
  await checkEndpoint('Backend Products API', 'https://api.veyncore.in/api/products?limit=2');

  // 4. CORS Preflight for https://veyncore.in
  await checkEndpoint('CORS Preflight (https://veyncore.in)', 'https://api.veyncore.in/api/products', {
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://veyncore.in',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'authorization,content-type'
    }
  });

  // 5. CORS Preflight for https://www.veyncore.in
  await checkEndpoint('CORS Preflight (https://www.veyncore.in)', 'https://api.veyncore.in/api/products', {
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://www.veyncore.in',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'authorization,content-type'
    }
  });

  // 6. Frontend Apex
  await checkEndpoint('Frontend Apex', 'https://veyncore.in/', { method: 'HEAD' });

  // 7. Frontend WWW
  await checkEndpoint('Frontend WWW', 'https://www.veyncore.in/', { method: 'HEAD' });
}

run();
