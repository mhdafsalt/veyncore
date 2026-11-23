'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import { useCart, UPSELL_PRODUCTS, DEFAULT_INITIAL_ITEM } from '@/context/CartContext';
import { trackWhatsAppClick } from '@/lib/trackWhatsApp';
import { parseNumericPrice } from '@/lib/priceUtils';
import './CartDrawer.css';

const TRENDING_COLLECTIONS = [
  {
    id: 'denims',
    title: 'DENIMS',
    image: '/images/hero/hero-card-1.jpg',
    href: '/collections/all-drops'
  },
  {
    id: 'tops',
    title: 'TOPS',
    image: '/images/hero/hero-card-2.jpg',
    href: '/collections/all-drops'
  },
  {
    id: 'accessories',
    title: 'ACCESSORIES',
    image: '/images/hero/hero-card-3.jpg',
    href: '/collections/all-drops'
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
    whatsappNumber,
    openCheckout
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

  // Direct WhatsApp Order - Opens modern Delivery Details checkout modal
  const handleDirectWhatsAppClick = (e) => {
    e.preventDefault();
    closeCart();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (openCheckout) {
      openCheckout(
        cartItems.map((item) => ({
          title: item.title,
          handle: item.handle || item.id,
          variant: item.variant || item.fit || item.color || 'Standard',
          size: item.size || 'ONE SIZE',
          quantity: item.quantity || 1,
          price: parseNumericPrice(item.price, 1299),
          image: item.image,
          url: `${origin}/products/${item.handle || item.id}`,
        })),
        'cart_drawer'
      );
    }
  };

  // Build WhatsApp order link (legacy fallback)
  const buildWhatsAppLink = () => {
    const lines = [
      '*New Order Request - VEYNCORE*',
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
    const WHATSAPP_NUMBER = '919446391166';
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
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
            <h2 className="cart-drawer__title">CART</h2>
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
                          <FiTrash2 size={16} aria-hidden="true" />
                        </button>
                      </div>

                      <p className="cart-drawer__item-variant">Size: {item.size}</p>

                      <div className="cart-drawer__item-price-wrap">
                        <span className="cart-drawer__item-price">
                          Rs. {parseNumericPrice(item.price).toLocaleString('en-IN')}.00
                        </span>
                        {item.comparePrice && (
                          <s className="cart-drawer__item-compare-price">
                            Rs. {parseNumericPrice(item.comparePrice).toLocaleString('en-IN')}.00
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
                <h3 className="cart-drawer__empty-title">YOUR CART IS EMPTY</h3>
                <p className="cart-drawer__empty-subtitle">
                  Find trending collections and products right below
                </p>

                {/* Trending Collections */}
                <div className="cart-drawer__empty-collections">
                  {TRENDING_COLLECTIONS.map((col) => (
                    <Link
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
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 ? (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total-row">
              <span className="cart-drawer__total-label">Total:</span>
              <span className="cart-drawer__total-amount">
                Rs. {parseNumericPrice(subtotal).toLocaleString('en-IN')}.00 INR
              </span>
            </div>

            <p className="cart-drawer__tax-note">
              Taxes included. <a href="#shipping-policy" className="cart-drawer__shipping-link">Shipping</a> calculated at checkout.
            </p>

            {/* ONLY DIRECT WHATSAPP ORDER BUTTON */}
            <div className="cart-drawer__whatsapp-action">
              <button
                type="button"
                className="cart-drawer__whatsapp-btn"
                aria-label="Direct WhatsApp Order"
                onClick={handleDirectWhatsAppClick}
              >
                {/* Official WhatsApp React Icon */}
                <FaWhatsapp className="cart-drawer__whatsapp-icon" size={24} aria-hidden="true" />
                <span className="cart-drawer__whatsapp-btn-text">
                  Direct WhatsApp Order
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-drawer__empty-footer">
            <span className="cart-drawer__empty-shipping-note">
              FREE SHIPPING ALL OVER INDIA
            </span>
            <Link
              href="/collections/all-drops"
              className="cart-drawer__empty-show-all-btn"
              onClick={closeCart}
            >
              EXPLORE ALL DROPS
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
