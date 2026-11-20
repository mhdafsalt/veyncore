'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { FIT_CATEGORIES, CATEGORY_FITS_DATA } from '@/data/categoryFitsData';
import './CategoryFits.css';

/**
 * Individual Fit Product Card with image slideshow, touch gestures,
 * size selection drawer, and cart drawer integration.
 */
function FitProductCard({ product }) {
  const { addItem } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizes, setShowSizes] = useState(false);
  const [addedStatus, setAddedStatus] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);

  const controlsTimeoutRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/products/artic-blue-wide.jpg'];

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

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

  const handleGalleryClick = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      if (!showMobileControls && images.length > 1) {
        e.preventDefault();
        triggerMobileControls();
      }
    }
  };

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

    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      triggerMobileControls();
    }
  };

  const handleQuickAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSizes((prev) => !prev);
  };

  const handleSelectSize = (e, size) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}-${size}`,
      title: product.title,
      size: size,
      price: product.price || 1199,
      comparePrice: product.comparePrice || 1699,
      image: images[0],
      quantity: 1,
    });

    setAddedStatus(true);
    setShowSizes(false);
    setTimeout(() => setAddedStatus(false), 2200);
  };

  return (
    <article
      className={`fit-card ${
        showMobileControls ? 'fit-card--controls-active' : ''
      }`}
    >
      {/* Product Image Gallery & Interaction Zone */}
      <div
        className="fit-card__gallery"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Link
          href={`/products/${product.handle}`}
          className="fit-card__link"
          aria-label={product.title}
          onClick={handleGalleryClick}
        >
          <div className="fit-card__image-container">
            <img
              src={images[currentImageIndex]}
              alt={product.title}
              className={`fit-card__image ${imageLoaded ? 'fit-card__image--loaded' : ''}`}
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
          <span className="fit-card__badge fit-card__badge--sale">
            {product.badge}
          </span>
        )}

        {/* Carousel Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="fit-card__nav-button fit-card__nav-button--prev"
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
              className="fit-card__nav-button fit-card__nav-button--next"
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
            <div className="fit-card__dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`fit-card__dot ${
                    idx === currentImageIndex ? 'fit-card__dot--active' : ''
                  }`}
                  onClick={(e) => handleDotClick(e, idx)}
                  aria-label={`Jump to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Quick Add "Choose" Pill Button */}
        <div className="fit-card__quick-add">
          {showSizes ? (
            <div className="fit-card__size-drawer">
              <span className="fit-card__size-label">Select Size:</span>
              <div className="fit-card__size-list">
                {(product.availableSizes || ['28', '30', '32', '34', '36']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="fit-card__size-button"
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
              className={`fit-card__choose-button ${
                addedStatus ? 'fit-card__choose-button--added' : ''
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
                    className="fit-card__choose-icon"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <svg
                    className="fit-card__choose-icon"
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
      <div className="fit-card__details">
        <Link href={`/products/${product.handle}`} className="fit-card__title-link">
          <h3 className="fit-card__title">{product.title}</h3>
        </Link>
        <div className="fit-card__pricing">
          <span className="fit-card__sale-price">{product.salePrice}</span>
          {product.regularPrice && (
            <span className="fit-card__regular-price">{product.regularPrice}</span>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * End-of-row "View All" card that sits directly after the 6th card in the swipe row
 */
function ViewAllEndCard({ fitLabel, collectionPath }) {
  return (
    <article className="fit-card fit-card--view-all">
      <Link href={collectionPath} className="fit-card__view-all-link" aria-label={`View all ${fitLabel}`}>
        <div className="fit-card__view-all-box">
          <div className="fit-card__view-all-circle">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <span className="fit-card__view-all-action">View all</span>
          <span className="fit-card__view-all-label">{fitLabel}</span>
        </div>
      </Link>
    </article>
  );
}

/**
 * Swipeable Fit Row Component containing:
 * 1. Row Header (Fit Title + View all link)
 * 2. Swipeable track with 6 cards + 1 "View all" end card
 * 3. Centered bottom "View all" action button
 */
function FitSwipeRow({ products, fitId, fitLabel, collectionPath }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  const checkScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const track = trackRef.current;
    if (track) {
      track.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (track) {
        track.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, products]);

  const scrollByAmount = (direction) => {
    if (!trackRef.current) return;
    const containerWidth = trackRef.current.clientWidth;
    const scrollAmount = direction === 'left' ? -containerWidth * 0.75 : containerWidth * 0.75;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Mouse drag support for desktop
  const handleMouseDown = (e) => {
    if (!trackRef.current) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftStartRef.current = trackRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <section className="category-fits__row" id={`fit-${fitId}`}>
      {/* Row Header with Fit Name and Link */}
      <header className="category-fits__row-header">
        <h2 className="category-fits__row-heading">{fitLabel}</h2>
        <Link href={collectionPath} className="category-fits__row-header-link">
          <span>View all</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </header>

      {/* Swipeable Track Container */}
      <div className="category-fits__slider-container">
        {/* Left Floating Nav Button */}
        <button
          type="button"
          className={`category-fits__nav-button category-fits__nav-button--prev ${
            !canScrollLeft ? 'category-fits__nav-button--disabled' : ''
          }`}
          onClick={() => scrollByAmount('left')}
          aria-label={`Scroll ${fitLabel} left`}
          disabled={!canScrollLeft}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Horizontal Swipeable Track: 6 Cards + "View all" card at the end */}
        <div
          ref={trackRef}
          className="category-fits__slider-track"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Exactly 6 product cards */}
          {products.slice(0, 6).map((product) => (
            <div key={product.id} className="category-fits__slider-item">
              <FitProductCard product={product} />
            </div>
          ))}

          {/* "View all" End Card right after the 6th card */}
          <div className="category-fits__slider-item category-fits__slider-item--view-all">
            <ViewAllEndCard fitLabel={fitLabel} collectionPath={collectionPath} />
          </div>
        </div>

        {/* Right Floating Nav Button */}
        <button
          type="button"
          className={`category-fits__nav-button category-fits__nav-button--next ${
            !canScrollRight ? 'category-fits__nav-button--disabled' : ''
          }`}
          onClick={() => scrollByAmount('right')}
          aria-label={`Scroll ${fitLabel} right`}
          disabled={!canScrollRight}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

/**
 * Main Category Fits Showcase Component
 * Renders distinct sequential swipe rows for:
 * 1. BAGGY
 * 2. BOOTCUT
 * 3. WIDE
 * 4. STRAIGHT
 * Each row has 6 cards with horizontal swipe, an end "View all" card,
 * and a centered bottom "View all" button.
 */
export default function CategoryFits() {
  return (
    <div className="category-fits" id="category-fits-showcase">
      <div className="category-fits__container">
        {FIT_CATEGORIES.map((cat) => {
          const products = CATEGORY_FITS_DATA[cat.id] || [];
          return (
            <FitSwipeRow
              key={cat.id}
              products={products}
              fitId={cat.id}
              fitLabel={cat.label}
              collectionPath={cat.collectionPath}
            />
          );
        })}
      </div>
    </div>
  );
}
