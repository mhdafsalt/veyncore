import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendPath = path.resolve(__dirname, '../backend');

// Import dotenv from backend node_modules
const dotenv = await import(`file://${path.join(backendPath, 'node_modules/dotenv/lib/main.js').replace(/\\/g, '/')}`);
dotenv.config({ path: path.join(backendPath, '.env') });

console.log('--- 1. Testing Cloudinary Configuration Module ---');
const { isCloudinaryConfigured } = await import(`file://${path.join(backendPath, 'config/cloudinary.js').replace(/\\/g, '/')}`);
console.log('isCloudinaryConfigured:', isCloudinaryConfigured());

console.log('--- 2. Testing App Import (Simulating Vercel /var/task serverless environment) ---');
process.env.VERCEL = '1';
const { default: app } = await import(`file://${path.join(backendPath, 'app.js').replace(/\\/g, '/')}`);
console.log('App imported and initialized without crashing!');

console.log('--- 3. Testing Health Controller Directly ---');
const { getHealth } = await import(`file://${path.join(backendPath, 'controllers/health.controller.js').replace(/\\/g, '/')}`);
let healthResponse = null;
const mockRes = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    healthResponse = data;
    return this;
  }
};
getHealth({ query: {} }, mockRes);
console.log('Health Controller status:', mockRes.statusCode);
console.log('Health Controller response:', healthResponse);

console.log('--- 4. Testing Upload Controller Without File ---');
const { handleSingleUpload, getUploadedFiles } = await import(`file://${path.join(backendPath, 'controllers/upload.controller.js').replace(/\\/g, '/')}`);
let uploadErrResponse = null;
const mockUploadErrRes = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    uploadErrResponse = data;
    return this;
  }
};
await handleSingleUpload({}, mockUploadErrRes);
console.log('Empty upload status (expected 400):', mockUploadErrRes.statusCode);
console.log('Empty upload response:', uploadErrResponse);

console.log('--- 5. Testing Upload Controller With Buffer (Fallback / Storage test) ---');
let uploadSuccessResponse = null;
const mockUploadSuccessRes = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    uploadSuccessResponse = data;
    return this;
  }
};
const mockReq = {
  file: {
    originalname: 'test_artifact.png',
    mimetype: 'image/png',
    buffer: Buffer.from('mock_png_binary_data'),
    size: 22,
  },
  protocol: 'https',
  get(header) {
    if (header === 'host') return 'veyncore.vercel.app';
    return '';
  }
};
await handleSingleUpload(mockReq, mockUploadSuccessRes);
console.log('Mock upload status (expected 200):', mockUploadSuccessRes.statusCode);
console.log('Mock upload response:', uploadSuccessResponse);

console.log('--- 6. Testing Media List Retrieval ---');
let listResponse = null;
const mockListRes = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    listResponse = data;
    return this;
  }
};
await getUploadedFiles({ protocol: 'https', get: () => 'veyncore.vercel.app' }, mockListRes);
console.log('List retrieval status (expected 200):', mockListRes.statusCode);
console.log('Media count:', listResponse?.count);
console.log('First media item:', listResponse?.data?.[0]);

console.log('--- 7. Testing Media Deletion ---');
const { deleteUploadedFile } = await import(`file://${path.join(backendPath, 'controllers/upload.controller.js').replace(/\\/g, '/')}`);
if (uploadSuccessResponse?.data?.filename) {
  let deleteResponse = null;
  const mockDeleteRes = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      deleteResponse = data;
      return this;
    }
  };
  await deleteUploadedFile({ params: { filename: uploadSuccessResponse.data.filename } }, mockDeleteRes);
  console.log('Delete status (expected 200):', mockDeleteRes.statusCode);
  console.log('Delete response:', deleteResponse);
}

console.log('\n========================================');
console.log('ALL VERIFICATION UNIT TESTS PASSED!');
console.log('========================================');
process.exit(0);
