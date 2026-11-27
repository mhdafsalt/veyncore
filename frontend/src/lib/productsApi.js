/**
 * Shared Products API Client for VEYNCORE
 *
 * Implements:
 * 1. In-flight request deduplication by URL (prevents redundant cold-start requests)
 * 2. In-memory response caching for Frame-0 painting
 * 3. 12-second AbortController timeout per attempt
 * 4. Exponential backoff retry (up to 4 attempts total: 1 initial + 3 retries with 1s, 2s, 3s backoff)
 * 5. Retry on suspicious empty array responses (success: true but 0 products)
 * 6. Detailed debug console.warn logs on each failed attempt (attempt #, status, body length, reason)
 * 7. Clean abort signal propagation when caller unmounts
 */

const memoryCache = new Map();
const inFlightRequests = new Map();

/**
 * Synchronous cache lookup for initial component state
 */
export function getCachedProducts(url) {
  if (!url) return null;
  return memoryCache.get(url) || null;
}

/**
 * Invalidate in-memory cache for a URL or clear all
 */
export function invalidateProductsCache(url = null) {
  if (url) {
    memoryCache.delete(url);
    inFlightRequests.delete(url);
  } else {
    memoryCache.clear();
    inFlightRequests.clear();
  }
}

/**
 * Helper to pause execution with abort signal support
 */
function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}

/**
 * Fetch products with 12s timeout, 4 attempts total, deduplication, retry on empty, and caching.
 *
 * @param {string} url - Target API URL
 * @param {object} [options]
 * @param {number} [options.timeoutMs=12000] - Timeout per attempt
 * @param {number} [options.maxAttempts=4] - Total attempts (1 initial + up to 3 retries)
 * @param {number[]} [options.backoffDelays=[1000, 2000, 3000]] - Delays in ms between retries
 * @param {boolean} [options.forceRefresh=false] - Bypass cache and in-flight deduplication
 * @param {boolean} [options.retryOnEmpty=true] - Retry if response contains an empty products array
 * @param {AbortSignal} [options.signal] - Caller abort signal (e.g. component unmount)
 * @param {string} [options.fallbackUrl] - Secondary URL if local server fails
 * @returns {Promise<Array>} Products array
 */
export async function fetchProducts(url, options = {}) {
  const {
    timeoutMs = 12000,
    maxAttempts = 4,
    backoffDelays = [1000, 2000, 3000],
    forceRefresh = false,
    retryOnEmpty = true,
    signal: callerSignal,
    fallbackUrl,
  } = options;

  if (!url) {
    throw new Error('fetchProducts: url is required');
  }

  // 1. Return cached data immediately if available and refresh is not forced
  if (!forceRefresh && memoryCache.has(url)) {
    return memoryCache.get(url);
  }

  // 2. Deduplicate in-flight requests for the exact same URL
  if (!forceRefresh && inFlightRequests.has(url)) {
    return inFlightRequests.get(url);
  }

  // 3. Initiate request with retry loop
  const requestPromise = (async () => {
    let lastError = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      // Check if caller already aborted before starting attempt
      if (callerSignal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }

      const attemptController = new AbortController();
      let timeoutFired = false;
      const timeoutId = setTimeout(() => {
        timeoutFired = true;
        attemptController.abort();
      }, timeoutMs);

      const handleCallerAbort = () => attemptController.abort();
      callerSignal?.addEventListener('abort', handleCallerAbort, { once: true });

      let statusCode = 0;
      let bodyLength = 0;

      try {
        // Use requested URL, or fallbackUrl if local endpoint failed on final attempt
        let targetUrl = url;
        if (attempt === maxAttempts && fallbackUrl && url.includes('localhost')) {
          targetUrl = fallbackUrl;
        }

        const res = await fetch(targetUrl, {
          signal: attemptController.signal,
          headers: {
            Accept: 'application/json',
          },
        });

        clearTimeout(timeoutId);
        callerSignal?.removeEventListener('abort', handleCallerAbort);

        statusCode = res.status;

        if (!res.ok) {
          const rawText = await res.text().catch(() => '');
          bodyLength = rawText.length;
          throw new Error(`HTTP error ${res.status}: ${res.statusText || 'Failed'}`);
        }

        const rawText = await res.text();
        bodyLength = rawText.length;

        let json = null;
        try {
          json = JSON.parse(rawText);
        } catch (jsonErr) {
          throw new Error(`Failed to parse JSON response (${bodyLength} bytes)`);
        }

        // If backend explicitly returned success: false, treat as error to retry
        if (!json || json.success === false) {
          throw new Error(json?.message || 'Server returned success: false');
        }

        const productsData = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        // Suspicious empty response check: a store that has products should not return empty array
        if (retryOnEmpty && productsData.length === 0 && attempt < maxAttempts) {
          throw new Error('API returned success: true with empty array (suspicious cold-start state)');
        }

        // Response is successful and valid
        memoryCache.set(url, productsData);
        if (targetUrl !== url) {
          memoryCache.set(targetUrl, productsData);
        }

        return productsData;
      } catch (err) {
        clearTimeout(timeoutId);
        callerSignal?.removeEventListener('abort', handleCallerAbort);

        // If caller unmounted/aborted, do not retry; throw AbortError immediately
        if (callerSignal?.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }

        const isTimeout = timeoutFired || (err.name === 'AbortError' && timeoutFired);
        const reason = isTimeout
          ? `Request timed out after ${timeoutMs / 1000}s`
          : err.message || 'Unknown error';

        lastError = isTimeout ? new Error(reason) : err;

        // Requirement C: Debug logging for failed attempt
        console.warn(
          `[productsApi] Attempt ${attempt}/${maxAttempts} failed for ${url} | Status: ${statusCode || 'NetworkError'} | BodyLength: ${bodyLength} | Reason: ${reason}`
        );

        // If more attempts remain, wait backoff delay before retrying
        if (attempt < maxAttempts) {
          const delay = backoffDelays[attempt - 1] || 3000;
          await wait(delay, callerSignal);
        }
      }
    }

    // All attempts failed
    throw lastError || new Error(`Failed to fetch products after ${maxAttempts} attempts`);
  })();

  inFlightRequests.set(url, requestPromise);

  try {
    const result = await requestPromise;
    return result;
  } finally {
    inFlightRequests.delete(url);
  }
}

// Backward-compatible alias
export const fetchProductsWithRetry = fetchProducts;
export default fetchProducts;
