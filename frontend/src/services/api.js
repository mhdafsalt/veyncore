import { API_BASE_URL } from '../lib/constants.js';

/**
 * Normalizes and resolves full API URL
 */
export function resolveApiUrl(endpoint) {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  const base = (API_BASE_URL || 'https://api.veyncore.in').replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If requesting the root endpoint
  if (cleanEndpoint === '/' || cleanEndpoint === '') {
    return `${base}/`;
  }

  // Prepend /api if neither base nor endpoint includes it
  let path = cleanEndpoint;
  if (!base.endsWith('/api') && !cleanEndpoint.startsWith('/api')) {
    path = `/api${cleanEndpoint}`;
  }

  return `${base}${path}`;
}

/**
 * Base HTTP API client for communication with backend services
 */
export async function apiClient(endpoint, options = {}) {
  const url = resolveApiUrl(endpoint);

  // Auto-resolve JWT token for protected API requests
  let token = options.token;
  if (!token && typeof window !== 'undefined') {
    token =
      localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      localStorage.getItem('veyncore_token') ||
      localStorage.getItem('jwt') ||
      sessionStorage.getItem('token');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Auto-serialize JSON bodies if passed as plain objects
  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) {
    body = JSON.stringify(body);
  }

  const config = {
    ...options,
    body,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Client Error] Request failed for ${url}:`, error.message);
    throw error;
  }
}

// REST helper methods for CRUD operations
apiClient.get = (endpoint, options = {}) =>
  apiClient(endpoint, { ...options, method: 'GET' });

apiClient.post = (endpoint, body, options = {}) =>
  apiClient(endpoint, { ...options, method: 'POST', body });

apiClient.put = (endpoint, body, options = {}) =>
  apiClient(endpoint, { ...options, method: 'PUT', body });

apiClient.patch = (endpoint, body, options = {}) =>
  apiClient(endpoint, { ...options, method: 'PATCH', body });

apiClient.delete = (endpoint, options = {}) =>
  apiClient(endpoint, { ...options, method: 'DELETE' });

export default apiClient;
