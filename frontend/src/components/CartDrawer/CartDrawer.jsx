'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import { useCart, UPSELL_PRODUCTS } from '@/context/CartContext';
import { API_BASE_URL } from '@/lib/constants';
import { parseNumericPrice } from '@/lib/priceUtils';
import { optimizeImageUrl } from '@/lib/imageUtils';
import './CartDrawer.css';

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
    appliedDiscount,
    discountAmount,
    finalTotal,
    applyDiscount,
    removeDiscount,
    openCheckout,
  } = useCart();

  // Dynamic recommendations and collections state (purely loaded from database)
  const [recommendations, setRecommendations] = useState([]);
  const [trendingCollections, setTrendingCollections] = useState([]);
  const [featuredDrops, setFeaturedDrops] = useState([]);
  const [upsellIndex, setUpsellIndex] = useState(0);

  // Discount code form state
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');

  // Fetch real catalog products from MongoDB backend for dynamic upsells and empty cart state
  useEffect(() => {
    let isMounted = true;

    const fetchDynamicCatalog = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products?limit=24`);
        const json = await res.json();

        if (isMounted && res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const prods = json.data.map((p) => {
            const rawPrice = parseNumericPrice(p.price ?? p.salePrice, 1299);
            const rawCompare = p.comparePrice || p.regularPrice ? parseNumericPrice(p.comparePrice || p.regularPrice, null) : null;
            const mainImg = p.thumbnail || (p.images && p.images[0]) || '/images/products/artic-blue-wide.jpg';
            const availableSizes = p.availableSizes && p.availableSizes.length > 0 ? p.availableSizes : ['28', '30', '32', '34'];

            return {
              id: p._id || p.id,
              productId: p._id || p.id,
              handle: p.handle || String(p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              title: p.title,
              size: availableSizes[0] || '30',
              availableSizes,
              price: rawPrice,
              comparePrice: rawCompare,
              image: mainImg,
              subCategory: p.subCategory || p.fit || p.category || 'DENIMS',
            };
          });

          setRecommendations(prods);
          setFeaturedDrops(prods.slice(0, 3));

          // Derive dynamic collections from actual backend products
          const catMap = new Map();
          prods.forEach((p) => {
            const catKey = String(p.subCategory || 'DENIMS').toUpperCase().trim();
            if (catKey && !catMap.has(catKey)) {
              catMap.set(catKey, {
                id: catKey.toLowerCase(),
                title: catKey,
                image: p.image,
                href: `/collections/all-drops?category=${encodeURIComponent(catKey.toLowerCase())}`,
              });
            }
          });

          if (catMap.size > 0) {
            setTrendingCollections(Array.from(catMap.values()).slice(0, 3));
          }
        }
      } catch (err) {
        // Fallback to static initial products
      }
    };

    fetchDynamicCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter recommendations to exclude products already in the cart
  const availableUpsells = useMemo(() => {
    if (!recommendations || recommendations.length === 0) return [];
    const cartIdentifiers = new Set(
      cartItems.map((item) => String(item.handle || item.productId || item.id).toLowerCase())
    );
    const filtered = recommendations.filter(
      (p) => !cartIdentifiers.has(String(p.handle || p.id || p.productId).toLowerCase())
    );
    return filtered.length > 0 ? filtered : recommendations;
  }, [recommendations, cartItems]);

  const currentUpsell = availableUpsells.length > 0 ? availableUpsells[upsellIndex % availableUpsells.length] : null;

  const handleNextUpsell = () => {
    if (availableUpsells.length === 0) return;
    setUpsellIndex((prev) => (prev + 1) % availableUpsells.length);
  };

  const handlePrevUpsell = () => {
    if (availableUpsells.length === 0) return;
    setUpsellIndex((prev) => (prev - 1 + availableUpsells.length) % availableUpsells.length);
  };

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

  // Discount code application handler
  const handleApplyDiscount = (e) => {
    e.preventDefault();
    if (!discountInput.trim()) {
      setDiscountError('Please enter a coupon code.');
      return;
    }
    const result = applyDiscount(discountInput);
    if (!result.success) {
      setDiscountError(result.message);
    } else {
      setDiscountError('');
      setDiscountInput('');
    }
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
          handle: item.handle || item.productId || item.id,
          variant: item.variant || item.fit || item.color || 'Standard',
          size: item.size || 'ONE SIZE',
          quantity: item.quantity || 1,
          price: parseNumericPrice(item.price, 1299),
          image: item.image,
          url: `${origin}/products/${item.handle || item.productId || item.id}`,
        })),
        'cart_drawer'
      );
    }
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
               FILLED CART STATE (Dynamic & Real-time)
               ========================================= */
            <div className="cart-drawer__filled">
              {/* Items List */}
              <div className="cart-drawer__items-list">
                {cartItems.map((item) => {
                  const productHref = `/products/${item.handle || item.productId || item.id}`;

                  return (
                    <div key={item.id} className="cart-drawer__item">
                      {/* Item Thumbnail */}
                      <div className="cart-drawer__item-media">
                        <Link href={productHref} onClick={closeCart} className="cart-drawer__item-media-link">
                          <img
                            src={optimizeImageUrl(item.image, 240) || '/images/products/artic-blue-wide.jpg'}
                            alt={item.title}
                            className="cart-drawer__item-image"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/products/artic-blue-wide.jpg';
                            }}
                          />
                        </Link>
                      </div>

                      {/* Item Details */}
                      <div className="cart-drawer__item-info">
                        <div className="cart-drawer__item-top-row">
                          <Link href={productHref} onClick={closeCart} className="cart-drawer__item-title-link">
                            <h3 className="cart-drawer__item-title">{item.title}</h3>
                          </Link>
                          <button
                            type="button"
                            className="cart-drawer__item-remove"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.title} from cart`}
                          >
                            <FiTrash2 size={16} aria-hidden="true" />
                          </button>
                        </div>

                        <p className="cart-drawer__item-variant">Size: {item.size || '30'}</p>

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
                  );
                })}
              </div>

              {/* Dynamic Cross-Sell ("You may also like...") */}
              {currentUpsell && (
                <div className="cart-drawer__recommendations">
                  <div className="cart-drawer__recommendations-header">
                    <h4 className="cart-drawer__recommendations-title">
                      You may also like...
                    </h4>
                    {availableUpsells.length > 1 && (
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
                    )}
                  </div>

                  <div className="cart-drawer__recommendations-card">
                    <div className="cart-drawer__recommendations-media">
                      <img
                        src={optimizeImageUrl(currentUpsell.image, 240) || '/images/products/brick-dark-wide.jpg'}
                        alt={currentUpsell.title}
                        className="cart-drawer__recommendations-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/products/artic-blue-wide.jpg';
                        }}
                      />
                    </div>

                    <div className="cart-drawer__recommendations-info">
                      <h5 className="cart-drawer__recommendations-name">
                        {currentUpsell.title}
                      </h5>
                      <div className="cart-drawer__recommendations-price-wrap">
                        <span className="cart-drawer__recommendations-price">
                          Rs. {parseNumericPrice(currentUpsell.price).toLocaleString('en-IN')}.00
                        </span>
                        {currentUpsell.comparePrice && (
                          <s className="cart-drawer__recommendations-compare-price">
                            Rs. {parseNumericPrice(currentUpsell.comparePrice).toLocaleString('en-IN')}.00
                          </s>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cart-drawer__recommendations-add-btn"
                      onClick={() =>
                        addItem({
                          ...currentUpsell,
                          size: currentUpsell.size || '30',
                          quantity: 1,
                        })
                      }
                      aria-label={`Add ${currentUpsell.title} to cart`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Discount Code Collapsible */}
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
                  <div className="cart-drawer__discount-form-wrap">
                    {appliedDiscount ? (
                      <div className="cart-drawer__discount-applied-pill">
                        <div className="cart-drawer__discount-applied-info">
                          <span className="cart-drawer__discount-applied-icon">✓</span>
                          <span className="cart-drawer__discount-applied-code">{appliedDiscount.code}</span>
                          <span className="cart-drawer__discount-applied-desc">
                            ({appliedDiscount.label || 'Discount Applied'})
                          </span>
                        </div>
                        <button
                          type="button"
                          className="cart-drawer__discount-remove-btn"
                          onClick={removeDiscount}
                          title="Remove discount code"
                          aria-label="Remove discount code"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyDiscount} className="cart-drawer__discount-form">
                        <input
                          type="text"
                          className="cart-drawer__discount-input"
                          placeholder="e.g. VEYN10"
                          value={discountInput}
                          onChange={(e) => {
                            setDiscountInput(e.target.value);
                            setDiscountError('');
                          }}
                        />
                        <button
                          type="submit"
                          className="cart-drawer__discount-apply-btn"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {discountError && (
                      <p className="cart-drawer__discount-error">{discountError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* =========================================
               EMPTY CART STATE (Dynamic & Curated)
               ========================================= */
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-content">
                <h3 className="cart-drawer__empty-title">YOUR CART IS EMPTY</h3>
                <p className="cart-drawer__empty-subtitle">
                  Find trending collections and products right below
                </p>

                {/* Dynamic Trending Collections */}
                <div className="cart-drawer__empty-collections">
                  {trendingCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={col.href}
                      className="cart-drawer__empty-collection-card"
                      onClick={closeCart}
                    >
                      <div className="cart-drawer__empty-collection-media">
                        <img
                          src={optimizeImageUrl(col.image, 300) || '/images/hero/hero-card-1.jpg'}
                          alt={col.title}
                          className="cart-drawer__empty-collection-image"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/hero/hero-card-1.jpg';
                          }}
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

                {/* Quick Add Featured Drops in Empty State */}
                {featuredDrops.length > 0 && (
                  <div className="cart-drawer__empty-featured">
                    <h4 className="cart-drawer__empty-featured-title">FEATURED DROPS</h4>
                    <div className="cart-drawer__empty-featured-list">
                      {featuredDrops.map((prod) => (
                        <div key={prod.id} className="cart-drawer__empty-featured-item">
                          <div className="cart-drawer__empty-featured-media">
                            <img
                              src={optimizeImageUrl(prod.image, 240)}
                              alt={prod.title}
                              className="cart-drawer__empty-featured-img"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/products/artic-blue-wide.jpg';
                              }}
                            />
                          </div>
                          <div className="cart-drawer__empty-featured-info">
                            <h5 className="cart-drawer__empty-featured-name">{prod.title}</h5>
                            <span className="cart-drawer__empty-featured-price">
                              Rs. {prod.price.toLocaleString('en-IN')}.00
                            </span>
                          </div>
                          <button
                            type="button"
                            className="cart-drawer__empty-featured-add-btn"
                            onClick={() =>
                              addItem({
                                ...prod,
                                size: prod.size || '30',
                                quantity: 1,
                              })
                            }
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 ? (
          <div className="cart-drawer__footer">
            {appliedDiscount && discountAmount > 0 ? (
              <>
                <div className="cart-drawer__subtotal-row">
                  <span>Subtotal:</span>
                  <span>Rs. {subtotal.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="cart-drawer__discount-row">
                  <span>Discount ({appliedDiscount.code}):</span>
                  <span>- Rs. {discountAmount.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="cart-drawer__total-row">
                  <span className="cart-drawer__total-label">Total:</span>
                  <span className="cart-drawer__total-amount">
                    Rs. {finalTotal.toLocaleString('en-IN')}.00 INR
                  </span>
                </div>
              </>
            ) : (
              <div className="cart-drawer__total-row">
                <span className="cart-drawer__total-label">Total:</span>
                <span className="cart-drawer__total-amount">
                  Rs. {subtotal.toLocaleString('en-IN')}.00 INR
                </span>
              </div>
            )}

            <p className="cart-drawer__tax-note">
              Taxes included. <a href="#shipping-policy" className="cart-drawer__shipping-link">Shipping</a> calculated at checkout.
            </p>

            {/* DIRECT WHATSAPP ORDER BUTTON */}
            <div className="cart-drawer__whatsapp-action">
              <button
                type="button"
                className="cart-drawer__whatsapp-btn"
                aria-label="Direct WhatsApp Order"
                onClick={handleDirectWhatsAppClick}
              >
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
              Free Shipping in Select Locations
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
