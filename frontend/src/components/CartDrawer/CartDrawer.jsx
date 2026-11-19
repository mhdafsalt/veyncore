'use client';

import React, { useState, useEffect } from 'react';
import { useCart, UPSELL_PRODUCTS, DEFAULT_INITIAL_ITEM } from '@/context/CartContext';
import './CartDrawer.css';

const TRENDING_COLLECTIONS = [
  {
    id: 'denims',
    title: 'DENIMS',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    href: '#denims'
  },
  {
    id: 'tops',
    title: 'TOPS',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    href: '#tops'
  },
  {
    id: 'accessories',
    title: 'ACCESSORIES',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    href: '#accessories'
  }
];

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    totalCount,
    subtotal,
    whatsappNumber
  } = useCart();

  const [upsellIndex, setUpsellIndex] = useState(0);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isCartOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isCartOpen]);

  const currentUpsell = UPSELL_PRODUCTS[upsellIndex % UPSELL_PRODUCTS.length];

  const handleNextUpsell = () => {
    setUpsellIndex((prev) => (prev + 1) % UPSELL_PRODUCTS.length);
  };

  const handlePrevUpsell = () => {
    setUpsellIndex((prev) => (prev - 1 + UPSELL_PRODUCTS.length) % UPSELL_PRODUCTS.length);
  };

  // Build WhatsApp order link
  const buildWhatsAppLink = () => {
    const lines = [
      '*New Order Request - BLURGVILLAGE*',
      '--------------------------------',
      '*Items Ordered:*'
    ];

    cartItems.forEach((item, idx) => {
      lines.push(`${idx + 1}. *${item.title}*`);
      lines.push(`   Size: ${item.size} | Qty: ${item.quantity} | Rs. ${(item.price * item.quantity).toLocaleString()}.00`);
    });

    lines.push('--------------------------------');
    lines.push(`*Total Amount:* Rs. ${subtotal.toLocaleString()}.00 INR`);
    lines.push('*Shipping:* Free Shipping All Over India');
    lines.push('--------------------------------');
    lines.push('Please confirm my order and share payment instructions!');

    const message = lines.join('\n');
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div
      className={`cart-drawer ${isCartOpen ? 'cart-drawer--open' : ''}`}
      aria-hidden={!isCartOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      {/* Backdrop */}
      <div
        className="cart-drawer__backdrop"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="cart-drawer__content">
        {/* Header */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title-wrap">
            <h2 className="cart-drawer__title">Your Cart</h2>
            <span className="cart-drawer__count-badge">{totalCount}</span>
          </div>

          <button
            type="button"
            className="cart-drawer__close-btn"
            onClick={closeCart}
            aria-label="Close cart drawer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body Content */}
        <div className="cart-drawer__body">
          {cartItems.length > 0 ? (
            /* =========================================
               FILLED CART STATE (Matches Image 2)
               ========================================= */
            <div className="cart-drawer__filled">
              {/* Free Shipping Announcement Bar */}
              <div className="cart-drawer__shipping-bar">
                <p className="cart-drawer__shipping-text">
                  Your order gets free shipping!
                </p>
                <div className="cart-drawer__shipping-track">
                  <div className="cart-drawer__shipping-fill" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Items List */}
              <div className="cart-drawer__items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-drawer__item">
                    {/* Item Thumbnail */}
                    <div className="cart-drawer__item-media">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="cart-drawer__item-image"
                        loading="lazy"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="cart-drawer__item-info">
                      <div className="cart-drawer__item-top-row">
                        <h3 className="cart-drawer__item-title">{item.title}</h3>
                        <button
                          type="button"
                          className="cart-drawer__item-remove"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path
                              d="M3 5h14M8 5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m3 0v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5h10Z"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9 9v6M11 9v6"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>

                      <p className="cart-drawer__item-variant">Size: {item.size}</p>

                      <div className="cart-drawer__item-price-wrap">
                        <span className="cart-drawer__item-price">
                          Rs. {item.price.toLocaleString()}.00
                        </span>
                        {item.comparePrice && (
                          <s className="cart-drawer__item-compare-price">
                            Rs. {item.comparePrice.toLocaleString()}.00
                          </s>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="cart-drawer__quantity">
                        <button
                          type="button"
                          className="cart-drawer__quantity-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="cart-drawer__quantity-value">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="cart-drawer__quantity-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* "You may also like..." Cross-Sell Section */}
              <div className="cart-drawer__recommendations">
                <div className="cart-drawer__recommendations-header">
                  <h4 className="cart-drawer__recommendations-title">
                    You may also like...
                  </h4>
                  <div className="cart-drawer__recommendations-nav">
                    <button
                      type="button"
                      className="cart-drawer__recommendations-nav-btn"
                      onClick={handlePrevUpsell}
                      aria-label="Previous recommendation"
                    >
                      <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                        <path
                          d="M5 9L1 5L5 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="cart-drawer__recommendations-nav-btn"
                      onClick={handleNextUpsell}
                      aria-label="Next recommendation"
                    >
                      <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                        <path
                          d="M1 9L5 5L1 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="cart-drawer__recommendations-card">
                  <div className="cart-drawer__recommendations-media">
                    <img
                      src={currentUpsell.image}
                      alt={currentUpsell.title}
                      className="cart-drawer__recommendations-image"
                      loading="lazy"
                    />
                  </div>

                  <div className="cart-drawer__recommendations-info">
                    <h5 className="cart-drawer__recommendations-name">
                      {currentUpsell.title}
                    </h5>
                    <div className="cart-drawer__recommendations-price-wrap">
                      <span className="cart-drawer__recommendations-price">
                        Rs. {currentUpsell.price.toLocaleString()}.00
                      </span>
                      <s className="cart-drawer__recommendations-compare-price">
                        Rs. {currentUpsell.comparePrice.toLocaleString()}.00
                      </s>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="cart-drawer__recommendations-add-btn"
                    onClick={() => addItem(currentUpsell)}
                    aria-label={`Add ${currentUpsell.title} to cart`}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Discount Code Collapsible */}
              <div className="cart-drawer__discount">
                <button
                  type="button"
                  className="cart-drawer__discount-toggle"
                  onClick={() => setIsDiscountOpen((prev) => !prev)}
                  aria-expanded={isDiscountOpen}
                >
                  <div className="cart-drawer__discount-label">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M2.5 10.5V4a1.5 1.5 0 0 1 1.5-1.5h6.5l7 7-7 7-8-6Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" />
                    </svg>
                    <span>Discount Code</span>
                  </div>
                  <span className={`cart-drawer__discount-plus ${isDiscountOpen ? 'cart-drawer__discount-plus--open' : ''}`}>
                    +
                  </span>
                </button>

                {isDiscountOpen && (
                  <div className="cart-drawer__discount-form">
                    <input
                      type="text"
                      className="cart-drawer__discount-input"
                      placeholder="Add discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button
                      type="button"
                      className="cart-drawer__discount-apply-btn"
                      onClick={() => {
                        if (discountCode.trim()) {
                          setDiscountApplied(true);
                          alert(`Discount code "${discountCode.trim()}" applied!`);
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* =========================================
               EMPTY CART STATE (Matches Image 1)
               ========================================= */
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-content">
                <h3 className="cart-drawer__empty-title">Your cart is empty.</h3>
                <p className="cart-drawer__empty-subtitle">
                  Find trending collection, products right below!
                </p>

                {/* Trending Collections */}
                <div className="cart-drawer__empty-collections">
                  {TRENDING_COLLECTIONS.map((col) => (
                    <a
                      key={col.id}
                      href={col.href}
                      className="cart-drawer__empty-collection-card"
                      onClick={closeCart}
                    >
                      <div className="cart-drawer__empty-collection-media">
                        <img
                          src={col.image}
                          alt={col.title}
                          className="cart-drawer__empty-collection-image"
                          loading="lazy"
                        />
                        <div className="cart-drawer__empty-collection-overlay">
                          <span className="cart-drawer__empty-collection-title">
                            {col.title}
                          </span>
                          <span className="cart-drawer__empty-collection-arrow" aria-hidden="true">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                              <path
                                d="M1.5 1L6.5 6L1.5 11"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Show All Products Button (also allows re-adding item for quick demo) */}
                <button
                  type="button"
                  className="cart-drawer__empty-show-all-btn"
                  onClick={() => {
                    addItem(DEFAULT_INITIAL_ITEM);
                  }}
                >
                  Show All Products
                </button>

                {/* Policy Notice */}
                <p className="cart-drawer__empty-policy">
                  • DELIVERY IN 7-9 WORKING DAYS • FREE SHIPPING ALL OVER INDIA • RETURN & EXCHANGES AVAILABLE • CHECK & CONFORM THE SIZE & SIZE CHART BEFORE PURCHASING.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer (Only rendered when cart has items) */}
        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total-row">
              <span className="cart-drawer__total-label">Total:</span>
              <span className="cart-drawer__total-amount">
                Rs. {subtotal.toLocaleString()}.00 INR
              </span>
            </div>

            <p className="cart-drawer__tax-note">
              Taxes included. <a href="#shipping-policy" className="cart-drawer__shipping-link">Shipping</a> calculated at checkout.
            </p>

            {/* ONLY DIRECT WHATSAPP ORDER BUTTON */}
            <div className="cart-drawer__whatsapp-action">
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="cart-drawer__whatsapp-btn"
                aria-label="Direct WhatsApp Order"
              >
                {/* Official WhatsApp SVG Icon */}
                <svg
                  className="cart-drawer__whatsapp-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.17L2.05 21.46a.75.75 0 0 0 .918.918l4.35-1.39A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm-1.07 5.75c.23-.52.54-.53.79-.54h.67c.23 0 .54.08.77.62.27.63.89 2.18.97 2.34.08.16.13.35.03.55-.1.2-.15.32-.3.5-.15.17-.32.39-.46.52-.15.15-.31.32-.13.63.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.31.16.49.14.67-.07.19-.21.78-.91.99-1.22.21-.31.42-.26.7-.16.29.11 1.83.86 2.14 1.02.31.16.52.23.6.35.08.12.08.69-.19 1.46-.27.76-1.57 1.49-2.17 1.54-.58.05-1.32.08-4.22-1.07-3.48-1.38-5.71-4.9-5.88-5.13-.17-.23-1.42-1.89-1.42-3.6 0-1.72.9-2.56 1.22-2.91Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="cart-drawer__whatsapp-btn-text">
                  Direct WhatsApp Order
                </span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
