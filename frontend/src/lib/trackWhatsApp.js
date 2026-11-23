import { API_BASE_URL } from './constants';

/**
 * Tracks when a user clicks any "Direct WhatsApp Order" button.
 * Uses navigator.sendBeacon or fetch with keepalive to ensure the request
 * completes even as the browser leaves or opens the WhatsApp URL.
 *
 * @param {Object} options
 * @param {string} options.productHandle
 * @param {string} options.productTitle
 * @param {string} options.size
 * @param {number|string} options.price
 * @param {number} options.quantity
 * @param {string} options.source - 'product_detail' | 'cart_drawer' | 'quick_buy'
 */
export function trackWhatsAppClick({
  productHandle = '',
  productTitle = 'Product',
  size = '',
  price = 0,
  quantity = 1,
  source = 'product_detail',
} = {}) {
  try {
    if (typeof window === 'undefined') return;

    const numPrice =
      typeof price === 'number'
        ? price
        : parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;

    const payload = JSON.stringify({
      productHandle,
      productTitle,
      size,
      price: numPrice,
      quantity: Number(quantity) || 1,
      source,
      timestamp: new Date().toISOString(),
    });

    const url = `${API_BASE_URL}/api/analytics/whatsapp-click`;

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return;
    }

    // Fallback if sendBeacon is unsupported or fails
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Non-blocking fail-safe
    });
  } catch (err) {
    console.warn('[Analytics] WhatsApp click track error:', err);
  }
}
