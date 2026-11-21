'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import MobileQuickBuyDrawer from '@/components/QuickBuy/MobileQuickBuyDrawer';
import { NEW_ARRIVALS_PRODUCTS } from '@/data/newArrivalsData';
import './NewArrivals.css';

/**
 * Format price to ensure Rs. and amount stay joined by non-breaking space
 */
const formatPrice = (str) => (!str ? '' : str.replace(/Rs\.\s*/g, 'Rs.\u00A0'));

/**
 * Individual Product Card with image slideshow, size selection, and quick-add
 */
function ProductCard({ product }) {
  const { addItem, openCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizes, setShowSizes] = useState(false);
  const [isMobileQuickBuyOpen, setIsMobileQuickBuyOpen] = useState(false);
  const [addedStatus, setAddedStatus] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);

  const controlsTimeoutRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['/images/products/artic-blue-wide.jpg'];

  // Clean up auto-hide timer on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Show mobile controls temporarily on click / tap
  const triggerMobileControls = () => {
    setShowMobileControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowMobileControls(false);
    }, 3500);
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    triggerMobileControls();
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    triggerMobileControls();
  };

  const handleDotClick = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(idx);
    triggerMobileControls();
  };

  // Gallery click on mobile: reveal arrows if hidden, or allow link if already visible
  const handleGalleryClick = (e) => {
    // Check if on touch/mobile device
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      if (!showMobileControls && images.length > 1) {
        e.preventDefault();
        triggerMobileControls();
      }
    }
  };

  // Touch Swipe gestures for mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Detect horizontal swipe with minimal vertical movement
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swipe left -> next image
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        // Swipe right -> previous image
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      triggerMobileControls();
    }
  };

  const handleQuickAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setIsMobileQuickBuyOpen(true);
    } else {
      setShowSizes((prev) => !prev);
    }
  };

  const handleSelectSize = (e, size) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}-${size}`,
      title: product.title,
      size: size,
      price: product.price || 1099,
      comparePrice: product.comparePrice || 1499,
      image: images[0],
      quantity: 1,
    });

    setAddedStatus(true);
    setShowSizes(false);
    openCart();
    setTimeout(() => setAddedStatus(false), 2200);
  };

  return (
    <article
      className={`product-card ${
        showMobileControls ? 'product-card--controls-active' : ''
      }`}
    >
      {/* Product Image Gallery & Interaction Zone */}
      <div
        className="product-card__gallery"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Link
          href={`/products/${product.handle}`}
          className="product-card__link"
          aria-label={product.title}
          onClick={handleGalleryClick}
        >
          <div className="product-card__image-container">
            <img
              src={images[currentImageIndex]}
              alt={product.title}
              className={`product-card__image ${imageLoaded ? 'product-card__image--loaded' : ''}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/products/artic-blue-wide.jpg';
              }}
            />
          </div>
        </Link>

        {/* Sale Badge */}
        {product.badge && (
          <span className="product-card__badge product-card__badge--sale">
            {product.badge === 'SALE' && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
            {product.badge}
          </span>
        )}

        {/* Carousel Navigation Arrows:
            - Desktop: visible on hover
            - Mobile: only visible when user clicks/taps that card */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="product-card__nav-button product-card__nav-button--prev"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="product-card__nav-button product-card__nav-button--next"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Pagination Dots */}
            <div className="product-card__dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`product-card__dot ${
                    idx === currentImageIndex ? 'product-card__dot--active' : ''
                  }`}
                  onClick={(e) => handleDotClick(e, idx)}
                  aria-label={`Jump to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Quick Add "Choose" Pill Button */}
        <div className={`product-card__quick-add ${showSizes ? 'product-card__quick-add--open' : ''}`}>
          {showSizes ? (
            <div className="product-card__size-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="product-card__size-drawer-header">
                <span className="product-card__size-label">SELECT SIZE:</span>
                <button
                  type="button"
                  className="product-card__size-close"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSizes(false);
                  }}
                  aria-label="Close size chooser"
                >
                  ✕
                </button>
              </div>
              <div className="product-card__size-list">
                {(product.availableSizes || ['28', '30', '32', '34', '36']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="product-card__size-button"
                    onClick={(e) => handleSelectSize(e, size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={`product-card__choose-button ${
                addedStatus ? 'product-card__choose-button--added' : ''
              }`}
              onClick={handleQuickAddClick}
            >
              {addedStatus ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="product-card__choose-icon"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <svg
                    className="product-card__choose-icon"
                    width="15"
                    height="15"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.2"
                      d="M16.608 9.421V6.906H3.392v8.016c0 .567.224 1.112.624 1.513.4.402.941.627 1.506.627H8.63M8.818 3h2.333c.618 0 1.212.247 1.649.686a2.35 2.35 0 0 1 .683 1.658v1.562H6.486V5.344c0-.622.246-1.218.683-1.658A2.33 2.33 0 0 1 8.82 3"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.2"
                      d="M14.608 12.563v5m2.5-2.5h-5"
                    />
                  </svg>
                  <span>Choose</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Product Details (Title & Price) */}
      <div className="product-card__details">
        <Link href={`/products/${product.handle}`} className="product-card__title-link">
          <h3 className="product-card__title">{product.title}</h3>
        </Link>
        <div className="product-card__pricing">
          <span className="product-card__sale-price">{formatPrice(product.salePrice)}</span>
          {product.regularPrice && (
            <span className="product-card__regular-price">{formatPrice(product.regularPrice)}</span>
          )}
        </div>
      </div>

      {/* Mobile Quick Buy Bottom Sheet Modal */}
      <MobileQuickBuyDrawer
        isOpen={isMobileQuickBuyOpen}
        onClose={() => setIsMobileQuickBuyOpen(false)}
        product={product}
      />
    </article>
  );
}

/**
 * Main Shop New Arrivals Section
 */
export default function NewArrivals() {
  return (
    <section className="new-arrivals" id="new-arrivals">
      <div className="new-arrivals__container">
        {/* Section Header */}
        <header className="new-arrivals__header">
          <h2 className="new-arrivals__heading">SHOP NEW ARRIVALS</h2>
        </header>

        {/* 4-Column (Desktop) / 2-Column (Mobile) Product Grid */}
        <div className="new-arrivals__grid">
          {NEW_ARRIVALS_PRODUCTS.map((product) => (
            <div key={product.id} className="new-arrivals__grid-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Centered Minimalist "View all" Action */}
        <div className="new-arrivals__footer">
          <Link href="/collections/all-drops" className="new-arrivals__view-all-button">
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}
