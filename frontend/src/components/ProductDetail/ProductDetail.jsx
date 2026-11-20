'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { getProductByHandle } from '@/data/productsData';
import './ProductDetail.css';

/**
 * High-performance Product Details Page (PDP) Component
 * Humanized BEM classnames, responsive media gallery, size chart modal,
 * pincode estimator, collapsible accordions, social sharing, and related denims.
 */
export default function ProductDetail({ product }) {
  const { addItem } = useCart();

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

  // Buy It Now
  const handleBuyItNow = () => {
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
                <span className="product-details__sale-price">{product.salePrice}</span>
                {product.comparePrice && (
                  <span className="product-details__compare-price">{product.regularPrice}</span>
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
                    <span>SIZE CHART</span>
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

                <button
                  type="button"
                  className="product-btn product-btn--buy-now"
                  onClick={handleBuyItNow}
                >
                  <span className="product-btn__shimmer" />
                  <span className="product-btn__text">BUY IT NOW</span>
                </button>
              </div>

              {/* Collapsible Accordion: What is VEYN-SELECTS? */}
              <div className="product-accordion">
                <button
                  type="button"
                  className="product-accordion__header"
                  onClick={() => setIsBrandStoryOpen((prev) => !prev)}
                  aria-expanded={isBrandStoryOpen}
                >
                  <span className="product-accordion__title">WHAT IS VEYN-SELECTS?</span>
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.49C8.91 7.49 8.65 7.55 8.43 7.79C8.21 8.03 7.6 8.6 7.6 9.76C7.6 10.92 8.45 12.04 8.57 12.2C8.69 12.36 10.22 14.72 12.57 15.73C14.52 16.57 14.92 16.41 15.34 16.37C15.76 16.33 16.7 15.81 16.9 15.25C17.1 14.69 17.1 14.21 17.04 14.11C16.98 14.01 16.82 13.95 16.58 13.83C16.34 13.71 15.16 13.13 14.94 13.05C14.72 12.97 14.56 12.93 14.4 13.17C14.24 13.41 13.78 13.95 13.64 14.11C13.5 14.27 13.36 14.29 13.12 14.17C12.88 14.05 11.87 13.72 10.67 12.65C9.74 11.82 9.11 10.79 8.99 10.59C8.87 10.39 8.98 10.28 9.1 10.16C9.21 10.05 9.35 9.87 9.47 9.73C9.59 9.59 9.63 9.49 9.71 9.33C9.79 9.17 9.75 9.03 9.69 8.91C9.63 8.79 9.17 7.65 8.98 7.19C8.79 6.75 8.6 6.81 8.45 6.81C8.31 6.81 8.15 6.81 7.99 6.81L9.07 7.49Z" />
                    </svg>
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
                      <span className="product-related-card__badge">{rel.badge}</span>
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
          SIZE CHART MODAL
          ========================================================= */}
      {isSizeModalOpen && (
        <div className="size-modal" role="dialog" aria-modal="true" aria-labelledby="size-modal-title">
          <div className="size-modal__backdrop" onClick={() => setIsSizeModalOpen(false)} />

          <div className="size-modal__container">
            {/* Modal Header */}
            <div className="size-modal__header">
              <div className="size-modal__title-group">
                <h3 className="size-modal__title" id="size-modal-title">SIZE GUIDE & MEASUREMENTS</h3>
                <p className="size-modal__subtitle">Pants & Jeans Fit Specification</p>
              </div>

              {/* Unit Toggle & Close Button */}
              <div className="size-modal__actions">
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

                <button
                  type="button"
                  className="size-modal__close-btn"
                  onClick={() => setIsSizeModalOpen(false)}
                  aria-label="Close size guide"
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
              {/* Measurement Table */}
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

              {/* How to Measure Section */}
              <div className="size-modal__guide">
                <div className="size-modal__guide-illustration">
                  <svg className="size-modal__pants-svg" viewBox="0 0 200 240" fill="none" stroke="currentColor" strokeWidth="2">
                    {/* Stylized Pants Silhouette */}
                    <path
                      d="M 50 20 L 150 20 L 155 70 L 170 220 L 120 220 L 100 95 L 80 220 L 30 220 L 45 70 Z"
                      fill="#f8f9fa"
                      stroke="#111"
                      strokeWidth="2.5"
                    />
                    {/* Waistband marker */}
                    <line x1="50" y1="32" x2="150" y2="32" stroke="#666" strokeDasharray="3 3" />
                    {/* Rise marker */}
                    <line x1="100" y1="20" x2="100" y2="95" stroke="#000" strokeWidth="2" />
                    {/* Thigh marker */}
                    <line x1="52" y1="105" x2="98" y2="105" stroke="#000" strokeDasharray="2 2" />
                    {/* Length marker */}
                    <line x1="175" y1="20" x2="175" y2="220" stroke="#000" strokeWidth="1.5" />
                    {/* Leg Opening marker */}
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
