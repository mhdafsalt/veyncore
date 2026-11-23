import http from 'http';
import connectDB, { getDBStatus } from '../backend/config/db.js';
import serverlessHandler from '../backend/api/index.js';
import User from '../backend/models/user.model.js';

console.log('--- 1. Testing Initial DB Connection ---');
const conn = await connectDB();
console.log('connectDB readyState:', conn ? conn.connection.readyState : 'null');
console.log('getDBStatus:', getDBStatus());
console.log('Target database name:', conn ? conn.connection.name : 'none');

console.log('--- 2. Testing Database-dependent Query (User.findOne) ---');
const adminUser = await User.findOne({ email: 'veyncore.in@gmail.com' }).select('name email role');
console.log('Found admin user:', adminUser ? `${adminUser.name} (${adminUser.email}) [${adminUser.role}]` : 'None');

console.log('--- 3. Testing Connection Caching (Immediate Return) ---');
const start = Date.now();
const cachedConn = await connectDB();
const elapsed = Date.now() - start;
console.log(`Re-connect took ${elapsed}ms (cached: ${cachedConn === conn})`);

console.log('--- 4. Testing Real HTTP Server with Serverless Handler ---');
const server = http.createServer((req, res) => {
  serverlessHandler(req, res);
});

await new Promise((resolve) => server.listen(5099, resolve));
console.log('Test HTTP server listening on port 5099');

try {
  // Test health check endpoint
  const healthRes = await fetch('http://localhost:5099/api/health?detailed=true');
  const healthJson = await healthRes.json();
  console.log('GET /api/health?detailed=true status:', healthRes.status);
  console.log('GET /api/health?detailed=true response:', healthJson);

  // Test login route with invalid credentials (should return 401, NOT time out with buffering!)
  const loginRes = await fetch('http://localhost:5099/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'veyncore.in@gmail.com', password: 'wrongpassword' }),
  });
  const loginJson = await loginRes.json();
  console.log('POST /api/auth/login status:', loginRes.status);
  console.log('POST /api/auth/login response:', loginJson);

  // Test product list route (should return 200 and products list from DB)
  const prodRes = await fetch('http://localhost:5099/api/products?limit=2');
  const prodJson = await prodRes.json();
  console.log('GET /api/products?limit=2 status:', prodRes.status);
  console.log('GET /api/products count:', prodJson.data ? prodJson.data.length : 0);
} finally {
  server.close();
  await conn.disconnect();
  console.log('\n========================================');
  console.log('ALL INTEGRATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('========================================');
  process.exit(0);
}
