'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { getProductByHandle } from '@/data/productsData';
import { trackWhatsAppClick } from '@/lib/trackWhatsApp';
import './ProductDetail.css';

/**
 * Format price to ensure Rs. and amount stay joined by non-breaking space
 */
const formatPrice = (str) => (!str ? '' : str.replace(/Rs\.\s*/g, 'Rs.\u00A0'));

/**
 * High-performance Product Details Page (PDP) Component
 * Humanized BEM classnames, responsive media gallery, size chart modal,
 * pincode estimator, collapsible accordions, social sharing, and related denims.
 */
export default function ProductDetail({ product }) {
  const { addItem, whatsappNumber } = useCart();
  const isObject = Boolean(product?.isObject || product?.category === 'VEYN-OBJECTS');

  // State Management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.defaultSize || product?.availableSizes?.[0] || '32');
  const [quantity, setQuantity] = useState(1);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [sizeUnit, setSizeUnit] = useState('inches'); // 'inches' | 'cm'
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Accordions state
  const [isBrandStoryOpen, setIsBrandStoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'shipping'
  const [isDescExpanded, setIsDescExpanded] = useState(true);

  // Toast notification for clipboard copy
  const [copyToast, setCopyToast] = useState(false);

  // Touch Swipe for Mobile Gallery
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const images = product?.images && product.images.length > 0
    ? product.images
    : ['/images/products/artic-blue-wide.jpg'];

  const sizes = product?.availableSizes || ['28', '30', '32', '34'];
  const measurements = product?.measurements?.[sizeUnit] || [];

  // Get Related Products
  const relatedProducts = (product?.relatedHandles || [])
    .map((handle) => getProductByHandle(handle))
    .filter(Boolean)
    .slice(0, 4);

  // Keyboard navigation & modal escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSizeModalOpen(false);
        setIsLightboxOpen(false);
      } else if (isLightboxOpen || document.activeElement.tagName !== 'INPUT') {
        if (e.key === 'ArrowLeft') {
          handlePrevImage();
        } else if (e.key === 'ArrowRight') {
          handleNextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  // Lock body scroll when modals open
  useEffect(() => {
    if (isSizeModalOpen || isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSizeModalOpen, isLightboxOpen]);

  // Gallery Navigation Handlers
  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Touch handlers for fluid swipe on mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Quantity Stepper Handlers
  const handleQuantityDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantityIncrease = () => {
    setQuantity((prev) => (prev < 10 ? prev + 1 : prev));
  };

  // Add to Cart
  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      title: product.title,
      size: selectedSize,
      price: product.price,
      comparePrice: product.comparePrice,
      image: images[0],
      quantity: quantity
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  // Build Direct WhatsApp Order Link
  const buildDirectWhatsAppLink = () => {
    const rawPrice = product?.salePrice ?? product?.price ?? 1299;
    const numPrice = typeof rawPrice === 'number'
      ? rawPrice
      : (parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0);
    const itemTotal = numPrice * quantity;
    const productUrl = typeof window !== 'undefined' ? window.location.href : '';

    const lines = [
      '*New Order Request - VEYNCORE*',
      '--------------------------------',
      '*Item Details:*',
      `• *${product?.title || 'Product'}*`,
      `  Size: ${selectedSize}`,
      `  Quantity: ${quantity}`,
      `  Price: Rs. ${numPrice.toLocaleString('en-IN')}.00 INR`,
      productUrl ? `  Product Link: ${productUrl}` : '',
      '--------------------------------',
      `*Total Amount:* Rs. ${itemTotal.toLocaleString('en-IN')}.00 INR`,
      '*Shipping:* Free Shipping All Over India',
      '--------------------------------',
      'Please confirm my order and share payment instructions. Thank you!'
    ].filter(Boolean);

    const message = lines.join('\n');
    const targetNumber = whatsappNumber || '919876543210';
    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
  };

  // Social Sharing
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2500);
    }
  };

  // Mobile Native Share
  const handleMobileShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on VEYNCORE`,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // user dismissed
      }
    }
    handleCopyLink();
  };

  const currentUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareText = encodeURIComponent(`Check out ${product.title} on VEYNCORE`);

  return (
    <div className="product-page">
      {/* Toast Notification */}
      {copyToast && (
        <div className="product-page__toast" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Link copied to clipboard!
        </div>
      )}

      <div className="product-page__container">
        {/* Main Product Layout (2 Columns) */}
        <div className="product-layout">
          {/* =========================================================
              LEFT COLUMN: RESPONSIVE MEDIA GALLERY
              ========================================================= */}
          <div className="product-layout__media">
            <div className="product-gallery">
              {/* Main Viewer */}
              <div
                className="product-gallery__viewer"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Product Badge */}
                {product.badge && (
                  <div className="product-gallery__badge">
                    <svg className="product-gallery__badge-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>{product.badge}</span>
                  </div>
                )}

                {/* Mobile Floating Share Button */}
                <button
                  type="button"
                  className="product-gallery__mobile-share-btn"
                  onClick={handleMobileShare}
                  aria-label="Share this product"
                  title="Share"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>

                {/* Counter Pill */}
                <div className="product-gallery__counter">
                  {currentImageIndex + 1}/{images.length}
                </div>

                {/* Main Image */}
                <div
                  className="product-gallery__image-wrap"
                  onClick={() => setIsLightboxOpen(true)}
                  title="Click to zoom in"
                >
                  <img
                    src={images[currentImageIndex]}
                    alt={`${product.title} - View ${currentImageIndex + 1}`}
                    className="product-gallery__main-image"
                    loading="eager"
                  />
                </div>

                {/* Prev / Next Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="product-gallery__arrow product-gallery__arrow--prev"
                      onClick={handlePrevImage}
                      aria-label="Previous product image"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="product-gallery__arrow product-gallery__arrow--next"
                      onClick={handleNextImage}
                      aria-label="Next product image"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Lightbox Trigger Button */}
                <button
                  type="button"
                  className="product-gallery__zoom-btn"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Enlarge image"
                  title="Zoom In"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>
              </div>

              {/* Thumbnails Strip */}
              {images.length > 1 && (
                <div className="product-gallery__thumbnails" role="tablist" aria-label="Product thumbnails">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={idx === currentImageIndex}
                      className={`product-gallery__thumb ${
                        idx === currentImageIndex ? 'product-gallery__thumb--active' : ''
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                      aria-label={`Select photo ${idx + 1}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="product-gallery__thumb-image"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: PRODUCT DETAILS & ACTIONS
              ========================================================= */}
          <div className="product-layout__info">
            <div className="product-details">
              {/* Collection Tag */}
              <div className="product-details__vendor">
                {product.category || 'VEYN-SELECTS'}
              </div>

              {/* Product Title */}
              <h1 className="product-details__title">{product.title}</h1>

              {/* Pricing Row */}
              <div className="product-details__pricing">
                <span className="product-details__sale-price">{formatPrice(product.salePrice)}</span>
                {product.comparePrice && (
                  <span className="product-details__compare-price">{formatPrice(product.regularPrice)}</span>
                )}
                {product.discount && (
                  <span className="product-details__discount-badge">{product.discount}</span>
                )}
              </div>

              {/* Taxes & Shipping Note */}
              <p className="product-details__tax-note">
                Tax included. Free shipping across India.
              </p>

              <hr className="product-details__divider" />

              {/* Size Selector & Size Chart Trigger */}
              <div className="product-size-selector">
                <div className="product-size-selector__header">
                  <div className="product-size-selector__label">
                    <span>Size:</span>
                    <strong className="product-size-selector__selected-value">{selectedSize}</strong>
                  </div>

                  <button
                    type="button"
                    className="product-size-chart-btn"
                    onClick={() => setIsSizeModalOpen(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="10" rx="2" />
                      <line x1="6" y1="7" x2="6" y2="11" />
                      <line x1="10" y1="7" x2="10" y2="13" />
                      <line x1="14" y1="7" x2="14" y2="11" />
                      <line x1="18" y1="7" x2="18" y2="13" />
                    </svg>
                    <span>{isObject ? 'SPECIFICATIONS' : 'SIZE CHART'}</span>
                  </button>
                </div>

                {/* Size Swatches */}
                <div className="product-size-options" role="radiogroup" aria-label="Select Size">
                  {sizes.map((size) => {
                    const isSelected = size === selectedSize;
                    return (
                      <button
                        key={size}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`product-size-swatch ${
                          isSelected ? 'product-size-swatch--active' : ''
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="product-quantity-selector">
                <label className="product-quantity-selector__label" htmlFor="pdp-quantity">
                  Quantity
                </label>
                <div className="product-quantity-stepper">
                  <button
                    type="button"
                    className="product-quantity-stepper__btn"
                    onClick={handleQuantityDecrease}
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="product-quantity-stepper__value" id="pdp-quantity">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="product-quantity-stepper__btn"
                    onClick={handleQuantityIncrease}
                    aria-label="Increase quantity"
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="product-actions">
                <button
                  type="button"
                  className={`product-btn product-btn--add ${
                    addedAnimation ? 'product-btn--added' : ''
                  }`}
                  onClick={handleAddToCart}
                >
                  {addedAnimation ? (
                    <span className="product-btn__content">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Added to Cart!
                    </span>
                  ) : (
                    <span>Add to Cart &bull; {product.salePrice}</span>
                  )}
                </button>

                <a
                  href={buildDirectWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-btn product-btn--whatsapp"
                  aria-label="Direct WhatsApp Order"
                  onClick={() => {
                    const rawPrice = product?.salePrice ?? product?.price ?? 1299;
                    trackWhatsAppClick({
                      productHandle: product?.handle || '',
                      productTitle: product?.title || 'Product',
                      size: selectedSize || '',
                      price: rawPrice,
                      quantity: quantity || 1,
                      source: 'product_detail',
                    });
                  }}
                >
                  <FaWhatsapp className="product-btn__whatsapp-icon" size={22} aria-hidden="true" />
                  <span className="product-btn__text">Direct WhatsApp Order</span>
                </a>
              </div>

              {/* Collapsible Accordion: What is VEYN-SELECTS / VEYN-OBJECTS? */}
              <div className="product-accordion">
                <button
                  type="button"
                  className="product-accordion__header"
                  onClick={() => setIsBrandStoryOpen((prev) => !prev)}
                  aria-expanded={isBrandStoryOpen}
                >
                  <span className="product-accordion__title">
                    {isObject ? 'WHAT IS VEYN-OBJECTS?' : 'WHAT IS VEYN-SELECTS?'}
                  </span>
                  <span className={`product-accordion__icon ${isBrandStoryOpen ? 'product-accordion__icon--open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                {isBrandStoryOpen && (
                  <div className="product-accordion__content">
                    <p className="product-accordion__text">
                      {product.selectStory}
                    </p>
                  </div>
                )}
              </div>

              {/* Product Tabs: Description & Shipping */}
              <div className="product-tabs">
                <div className="product-tabs__nav" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'description'}
                    className={`product-tabs__btn ${activeTab === 'description' ? 'product-tabs__btn--active' : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    DESCRIPTION
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'shipping'}
                    className={`product-tabs__btn ${activeTab === 'shipping' ? 'product-tabs__btn--active' : ''}`}
                    onClick={() => setActiveTab('shipping')}
                  >
                    SHIPPING & RETURN
                  </button>
                </div>

                <div className="product-tabs__body">
                  {activeTab === 'description' && (
                    <div className="product-tabs__pane">
                      {product.description && (
                        <p className="product-tabs__description-text">
                          {product.description}
                        </p>
                      )}
                      {product.specs && product.specs.length > 0 && (
                        <div className="product-tabs__specs-grid">
                          {product.specs.map((item, idx) => (
                            <div key={idx} className="product-tabs__spec-row">
                              <span className="product-tabs__spec-key">{item.label}:</span>
                              <span className="product-tabs__spec-val">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <ul className="product-tabs__list">
                        {(product.details || []).map((item, idx) => (
                          <li key={idx} className="product-tabs__list-item">
                            <span className="product-tabs__bullet">&bull;</span>
                            <span>{item.replace(/•\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="product-tabs__pane">
                      <ul className="product-tabs__list">
                        {(product.shipping || []).map((item, idx) => (
                          <li key={idx} className="product-tabs__list-item">
                            <span className="product-tabs__bullet">&bull;</span>
                            <span>{item.replace(/•\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Share Strip */}
              <div className="product-share">
                <span className="product-share__label">Share this piece:</span>
                <div className="product-share__links">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-share__btn"
                    title="Share on WhatsApp"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp size={18} />
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-share__btn"
                    title="Share on X"
                    aria-label="Share on X"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* Pinterest */}
                  <a
                    href={`https://pinterest.com/pin/create/button/?url=${currentUrl}&media=${encodeURIComponent(images[0])}&description=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-share__btn"
                    title="Pin on Pinterest"
                    aria-label="Pin on Pinterest"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12C24.017 5.367 18.644 0 12.017 0z" />
                    </svg>
                  </a>

                  {/* Copy Link */}
                  <button
                    type="button"
                    className="product-share__btn product-share__btn--copy"
                    onClick={handleCopyLink}
                    title="Copy Link to Clipboard"
                    aria-label="Copy Link"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            FEATURE HIGHLIGHTS BAR
            ========================================================= */}
        <div className="product-highlights">
          <div className="product-highlights__item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <div>
              <h4 className="product-highlights__title">FREE SHIPPING</h4>
              <p className="product-highlights__desc">Complimentary shipping across India</p>
            </div>
          </div>

          <div className="product-highlights__item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div>
              <h4 className="product-highlights__title">GUARANTEED CHECKOUT</h4>
              <p className="product-highlights__desc">100% Encrypted & Safe payments</p>
            </div>
          </div>

          <div className="product-highlights__item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <div>
              <h4 className="product-highlights__title">SUPPORT ONLINE</h4>
              <p className="product-highlights__desc">Quick help on WhatsApp & Email</p>
            </div>
          </div>
        </div>

        {/* =========================================================
            YOU MAY ALSO LIKE: RELATED DENIM GRID
            ========================================================= */}
        {relatedProducts.length > 0 && (
          <section className="product-related">
            <div className="product-related__header">
              <h2 className="product-related__heading">YOU MAY ALSO LIKE</h2>
              <div className="product-related__bar" />
            </div>

            <div className="product-related__grid">
              {relatedProducts.map((rel) => (
                <article key={rel.handle} className="product-related-card">
                  <Link href={`/products/${rel.handle}`} className="product-related-card__media">
                    <img
                      src={rel.images[0]}
                      alt={rel.title}
                      className="product-related-card__image"
                      loading="lazy"
                    />
                    {rel.badge && (
                      <span className="product-related-card__badge">
                        {rel.badge === 'SALE' && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        )}
                        {rel.badge}
                      </span>
                    )}
                  </Link>

                  <div className="product-related-card__content">
                    <h3 className="product-related-card__title">
                      <Link href={`/products/${rel.handle}`} className="product-related-card__title-link">
                        {rel.title}
                      </Link>
                    </h3>
                    <div className="product-related-card__prices">
                      <span className="product-related-card__price">{rel.salePrice}</span>
                      {rel.comparePrice && (
                        <span className="product-related-card__compare">{rel.regularPrice}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* =========================================================
          SIZE CHART / SPECIFICATIONS MODAL
          ========================================================= */}
      {isSizeModalOpen && (
        <div className="size-modal" role="dialog" aria-modal="true" aria-labelledby="size-modal-title">
          <div className="size-modal__backdrop" onClick={() => setIsSizeModalOpen(false)} />

          <div className="size-modal__container">
            {/* Modal Header */}
            <div className="size-modal__header">
              <div className="size-modal__title-group">
                <h3 className="size-modal__title" id="size-modal-title">
                  {isObject ? 'ARTIFACT SPECIFICATIONS & FIT' : 'SIZE GUIDE & MEASUREMENTS'}
                </h3>
                <p className="size-modal__subtitle">
                  {isObject
                    ? `${product.subCategory || 'HARDWARE'} DIMENSION & ENGINEERING GUIDE`
                    : 'Pants & Jeans Fit Specification'}
                </p>
              </div>

              {/* Unit Toggle & Close Button (for jeans) or Close Button (for objects) */}
              <div className="size-modal__actions">
                {!isObject && (
                  <div className="size-modal__unit-toggle" role="radiogroup" aria-label="Measurement Units">
                    <button
                      type="button"
                      className={`size-modal__unit-btn ${sizeUnit === 'inches' ? 'size-modal__unit-btn--active' : ''}`}
                      onClick={() => setSizeUnit('inches')}
                    >
                      IN
                    </button>
                    <button
                      type="button"
                      className={`size-modal__unit-btn ${sizeUnit === 'cm' ? 'size-modal__unit-btn--active' : ''}`}
                      onClick={() => setSizeUnit('cm')}
                    >
                      CM
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className="size-modal__close-btn"
                  onClick={() => setIsSizeModalOpen(false)}
                  aria-label="Close modal"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="size-modal__body">
              {isObject ? (
                /* Object Specifications & Sizing */
                <div className="size-modal__object-body">
                  {product.subCategory === 'CHAINS' && (
                    <div className="size-modal__table-wrap">
                      <table className="size-modal__table">
                        <thead>
                          <tr>
                            <th>Size</th>
                            <th>Length (IN)</th>
                            <th>Length (CM)</th>
                            <th>Drape / Resting Position</th>
                            <th>Link Profile</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className={selectedSize === '50CM' ? 'size-modal__row--selected' : ''}>
                            <td className="size-modal__cell-size">50CM</td>
                            <td>20 in</td>
                            <td>50.8 cm</td>
                            <td>High Collarbone / Choker Stance</td>
                            <td>10-12mm Flat Curb</td>
                          </tr>
                          <tr className={selectedSize === '55CM' ? 'size-modal__row--selected' : ''}>
                            <td className="size-modal__cell-size">55CM</td>
                            <td>22 in</td>
                            <td>55.9 cm</td>
                            <td>Mid-Chest Classic Streetwear Drape</td>
                            <td>10-12mm Flat Curb</td>
                          </tr>
                          <tr className={selectedSize === '60CM' ? 'size-modal__row--selected' : ''}>
                            <td className="size-modal__cell-size">60CM</td>
                            <td>24 in</td>
                            <td>61.0 cm</td>
                            <td>Longline Drop (Over Hoodies / Sweaters)</td>
                            <td>10-12mm Flat Curb</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {product.subCategory === 'BAGS' && (
                    <div className="size-modal__table-wrap">
                      <table className="size-modal__table">
                        <thead>
                          <tr>
                            <th>Specification</th>
                            <th>Technical Detail</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="size-modal__cell-size">Dimensions</td>
                            <td>{product.dimensions || 'Structured Streetwear Utility Volume'}</td>
                          </tr>
                          <tr>
                            <td className="size-modal__cell-size">Materials</td>
                            <td>{product.materials || '1000D Ballistic Cordura / Heavy Canvas'}</td>
                          </tr>
                          <tr>
                            <td className="size-modal__cell-size">Hardware</td>
                            <td>Matte Black Zinc Alloy Buckles &amp; YKK Reverse Zips</td>
                          </tr>
                          <tr>
                            <td className="size-modal__cell-size">Water Resistance</td>
                            <td>Water-Repellent DWR Finish / Weather-Proof</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {product.subCategory === 'CAPS' && (
                    <div className="size-modal__table-wrap">
                      <table className="size-modal__table">
                        <thead>
                          <tr>
                            <th>Specification</th>
                            <th>Measurement</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="size-modal__row--selected">
                            <td className="size-modal__cell-size">Head Circumference</td>
                            <td>54cm - 60cm (Fully Adjustable Strapback)</td>
                          </tr>
                          <tr>
                            <td className="size-modal__cell-size">Visor Length</td>
                            <td>7.2 cm Pre-curved with raw distressed edging</td>
                          </tr>
                          <tr>
                            <td className="size-modal__cell-size">Crown Depth</td>
                            <td>12 cm Relaxed Low-Profile Unstructured Fit</td>
                          </tr>
                          <tr>
                            <td className="size-modal__cell-size">Closure</td>
                            <td>Antique Silver Solid Metal Buckle + Strap Recess</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="size-modal__tip" style={{ marginTop: '20px' }}>
                    <span>
                      🛡️ <strong>VEYN-OBJECTS Material Guarantee:</strong> Solid surgical-grade 316L stainless steel &amp; high-tenacity canvas. 100% waterproof, rust-proof, and hypoallergenic.
                    </span>
                  </div>
                </div>
              ) : (
                /* Denim Pants Size Chart */
                <>
                  <div className="size-modal__table-wrap">
                    <table className="size-modal__table">
                      <thead>
                        <tr>
                          <th>Size</th>
                          <th>Waist ({sizeUnit === 'inches' ? 'in' : 'cm'})</th>
                          <th>Rise ({sizeUnit === 'inches' ? 'in' : 'cm'})</th>
                          <th>Thighs ({sizeUnit === 'inches' ? 'in' : 'cm'})</th>
                          <th>Length ({sizeUnit === 'inches' ? 'in' : 'cm'})</th>
                          <th>Leg Opening ({sizeUnit === 'inches' ? 'in' : 'cm'})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {measurements.map((row) => (
                          <tr
                            key={row.size}
                            className={row.size === selectedSize ? 'size-modal__row--selected' : ''}
                          >
                            <td className="size-modal__cell-size">{row.size}</td>
                            <td>{row.waist}</td>
                            <td>{row.rise}</td>
                            <td>{row.thighs}</td>
                            <td>{row.length}</td>
                            <td>{row.legOpening}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="size-modal__guide">
                    <div className="size-modal__guide-illustration">
                      <svg className="size-modal__pants-svg" viewBox="0 0 200 240" fill="none" stroke="currentColor" strokeWidth="2">
                        <path
                          d="M 50 20 L 150 20 L 155 70 L 170 220 L 120 220 L 100 95 L 80 220 L 30 220 L 45 70 Z"
                          fill="#f8f9fa"
                          stroke="#111"
                          strokeWidth="2.5"
                        />
                        <line x1="50" y1="32" x2="150" y2="32" stroke="#666" strokeDasharray="3 3" />
                        <line x1="100" y1="20" x2="100" y2="95" stroke="#000" strokeWidth="2" />
                        <line x1="52" y1="105" x2="98" y2="105" stroke="#000" strokeDasharray="2 2" />
                        <line x1="175" y1="20" x2="175" y2="220" stroke="#000" strokeWidth="1.5" />
                        <line x1="30" y1="228" x2="80" y2="228" stroke="#000" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="size-modal__guide-text">
                      <h4 className="size-modal__guide-title">How to Measure Pants &amp; Jeans</h4>
                      <ul className="size-modal__guide-list">
                        <li>
                          <strong>Waist:</strong> Measure straight across the top of the waistband and double the measurement.
                        </li>
                        <li>
                          <strong>Rise:</strong> Measure vertically from the bottom of the crotch seam up to the top waistband.
                        </li>
                        <li>
                          <strong>Thighs:</strong> Measure straight across the leg 1 inch below the crotch seam.
                        </li>
                        <li>
                          <strong>Length:</strong> Measure from the top waistband along the outer seam down to the bottom hem.
                        </li>
                        <li>
                          <strong>Leg Opening:</strong> Measure straight across the bottom hem of one leg.
                        </li>
                      </ul>

                      <div className="size-modal__tip">
                        <span>💡 <strong>Streetwear Fit Tip:</strong> For our signature relaxed baggy silhouette, select your standard waist size. For an extreme oversized drop, choose one size up.</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          LIGHTBOX / FULLSCREEN IMAGE MODAL
          ========================================================= */}
      {isLightboxOpen && (
        <div className="lightbox-modal" role="dialog" aria-modal="true">
          <div className="lightbox-modal__backdrop" onClick={() => setIsLightboxOpen(false)} />

          <button
            type="button"
            className="lightbox-modal__close-btn"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close zoom modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="lightbox-modal__content">
            <img
              src={images[currentImageIndex]}
              alt={`${product.title} zoomed view`}
              className="lightbox-modal__image"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox-modal__nav lightbox-modal__nav--prev"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                className="lightbox-modal__nav lightbox-modal__nav--next"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          <div className="lightbox-modal__counter">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
