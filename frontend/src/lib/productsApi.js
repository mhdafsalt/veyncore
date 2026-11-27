/**
 * Shared Products API Client for VEYNCORE
 *
 * Implements:
 * 1. In-flight request deduplication by URL (prevents redundant cold-start requests)
 * 2. In-memory response caching for Frame-0 painting
 * 3. 12-second AbortController timeout per attempt
 * 4. Exponential backoff retry (up to 4 attempts total: initial + 3 retries with 1s, 2s, 3s backoff)
 * 5. Does NOT retry on valid successful responses (res.ok && json.success === true) even if data is []
 * 6. Immediate abort without retries when caller unmounts
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
 * Fetch products with 12s timeout, 4 attempts total, deduplication, and caching.
 *
 * @param {string} url - Target API URL
 * @param {object} [options]
 * @param {number} [options.timeoutMs=12000] - Timeout per attempt
 * @param {number} [options.maxAttempts=4] - Total attempts (1 initial + up to 3 retries)
 * @param {number[]} [options.backoffDelays=[1000, 2000, 3000]] - Delays in ms between retries
 * @param {boolean} [options.forceRefresh=false] - Bypass cache and in-flight deduplication
 * @param {AbortSignal} [options.signal] - Caller abort signal (e.g. component unmount)
 * @param {string} [options.fallbackUrl] - Secondary URL if local server fails
 * @returns {Promise<Array>} Products array
 */
export async function fetchProductsWithRetry(url, options = {}) {
  const {
    timeoutMs = 12000,
    maxAttempts = 4,
    backoffDelays = [1000, 2000, 3000],
    forceRefresh = false,
    signal: callerSignal,
    fallbackUrl,
  } = options;

  if (!url) {
    throw new Error('fetchProductsWithRetry: url is required');
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

      try {
        // Use requested URL, or fallbackUrl if local endpoint failed and fallbackUrl provided
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

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();

        // If backend explicitly returned success: false, treat as error to retry
        if (!json || json.success === false) {
          throw new Error(json?.message || 'Server returned unsuccessful response');
        }

        // Response is successful (res.ok && json.success === true)
        // Note: Do NOT retry even if productsData is legitimately []
        const productsData = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        // Save to cache
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
        lastError = isTimeout
          ? new Error(`Request timed out after ${timeoutMs / 1000}s on attempt ${attempt}/${maxAttempts}`)
          : err;

        console.warn(
          `[productsApi] Attempt ${attempt}/${maxAttempts} failed for ${url}: ${lastError.message}`
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
