'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import MobileQuickBuyDrawer from '@/components/QuickBuy/MobileQuickBuyDrawer';
import { FIT_CATEGORIES, CATEGORY_FITS_DATA } from '@/data/categoryFitsData';
import { API_BASE_URL } from '@/lib/constants';
import './CategoryFits.css';

/**
 * Format price to ensure Rs. and amount stay joined by non-breaking space
 */
const formatPrice = (str) => (!str ? '' : str.replace(/Rs\.\s*/g, 'Rs.\u00A0'));

/**
 * Individual Fit Product Card with image slideshow, touch gestures,
 * size selection drawer, and cart drawer integration.
 */
function FitProductCard({ product }) {
  const { addItem, openCart } = useCart();
  const [showSizes, setShowSizes] = useState(false);
  const [isMobileQuickBuyOpen, setIsMobileQuickBuyOpen] = useState(false);
  const [addedStatus, setAddedStatus] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/products/artic-blue-wide.jpg'];
  const mainImage = product.thumbnail || images[0];

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
      price: product.price || 1199,
      comparePrice: product.comparePrice || 1699,
      image: mainImage,
      quantity: 1,
    });

    setAddedStatus(true);
    setShowSizes(false);
    openCart();
    setTimeout(() => setAddedStatus(false), 2200);
  };

  return (
    <article className="fit-card">
      {/* Product Image Zone (Only View Main Thumbnail) */}
      <div className="fit-card__gallery">
        <Link
          href={`/products/${product.handle}`}
          className="fit-card__link"
          aria-label={product.title}
        >
          <div className="fit-card__image-container">
            <img
              src={mainImage}
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
            {product.badge === 'SALE' && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
            {product.badge}
          </span>
        )}

        {/* Quick Add "Choose" Pill Button */}
        <div className={`fit-card__quick-add ${showSizes ? 'fit-card__quick-add--open' : ''}`}>
          {showSizes ? (
            <div className="fit-card__size-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="fit-card__size-drawer-header">
                <span className="fit-card__size-label">SELECT SIZE:</span>
                <button
                  type="button"
                  className="fit-card__size-close"
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
          <span className="fit-card__sale-price">{formatPrice(product.salePrice)}</span>
          {product.regularPrice && (
            <span className="fit-card__regular-price">{formatPrice(product.regularPrice)}</span>
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
 * End-of-row "View" card that sits directly after the 6th card in the swipe row
 */
function ViewAllEndCard({ fitLabel, collectionPath }) {
  return (
    <article className="fit-card fit-card--view-all">
      <Link href={collectionPath} className="fit-card__view-all-link" aria-label={`View all ${fitLabel}`}>
        <div className="fit-card__view-all-box">
          <span className="fit-card__view-all-text">View</span>
          <svg
            className="fit-card__view-all-arrow"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="4" y1="12" x2="20" y2="12" />
            <polyline points="13 5 20 12 13 19" />
          </svg>
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
      {/* Anchor alias for direct subcategory jumping */}
      <span id={fitId} style={{ position: 'relative', top: '-90px', display: 'block', height: 0, visibility: 'hidden' }} />
      {/* Row Header with Fit Name and Link */}
      <header className="category-fits__row-header">
        <h2 className="category-fits__row-heading">{fitLabel}</h2>
        <Link href={collectionPath} className="category-fits__row-header-link" aria-label={`View ${fitLabel}`}>
          <span>View</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="4" y1="12" x2="20" y2="12" />
            <polyline points="13 5 20 12 13 19" />
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
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({});

  // Fetch dynamic categories and products from backend
  useEffect(() => {
    let isMounted = true;

    const loadDynamicData = async () => {
      try {
        // 1. Fetch swipe categories
        const catRes = await fetch(`${API_BASE_URL}/api/content/swipeCategories`);
        const catJson = await catRes.json();
        let dynamicCats = null;
        if (catRes.ok && catJson.success && Array.isArray(catJson.data)) {
          const filtered = catJson.data.filter(
            (c) => c.targetSection === 'VEYN-SELECTS' && c.active !== false
          );
          if (filtered.length > 0) {
            dynamicCats = filtered.map((c) => ({
              id: (c.key || c.id).toLowerCase(),
              label: c.label,
              collectionPath: c.collectionPath || `/collections/${(c.key || c.id).toLowerCase()}`,
            }));
          }
        }

        // 2. Fetch products
        const prodRes = await fetch(`${API_BASE_URL}/api/products?category=VEYN-SELECTS&limit=100`);
        const prodJson = await prodRes.json();

        if (isMounted) {
          let activeCats = dynamicCats;

          if (prodRes.ok && prodJson.success && Array.isArray(prodJson.data) && prodJson.data.length > 0) {
            const grouped = {};
            prodJson.data.forEach((p) => {
              const key = (p.swipeCategory || p.fit || p.subCategory || '').toLowerCase().trim();
              if (!key) return;
              if (!grouped[key]) grouped[key] = [];
              grouped[key].push({
                id: p._id || p.id,
                title: p.title,
                handle: p.handle,
                fit: p.fit || key,
                salePrice: p.salePrice || (p.price ? `Rs. ${p.price.toLocaleString('en-IN')}.00` : ''),
                regularPrice: p.regularPrice || (p.comparePrice ? `Rs. ${p.comparePrice.toLocaleString('en-IN')}.00` : ''),
                price: p.price,
                comparePrice: p.comparePrice,
                badge: p.badge || '',
                images: p.images && p.images.length > 0 ? p.images : ['/images/products/artic-blue-wide.jpg'],
                thumbnail: p.thumbnail || (p.images && p.images[0]) || '/images/products/artic-blue-wide.jpg',
                availableSizes: p.availableSizes && p.availableSizes.length > 0 ? p.availableSizes : ['28', '30', '32', '34', '36'],
              });
            });

            // If no custom swipeCategories configured, dynamically generate from real products
            if (!activeCats || activeCats.length === 0) {
              activeCats = Object.keys(grouped).map((k) => ({
                id: k,
                label: k.toUpperCase(),
                collectionPath: `/collections/all-drops?category=${encodeURIComponent(k)}`,
              }));
            }

            setCategoryData(grouped);
          }

          if (activeCats && activeCats.length > 0) {
            setCategories(activeCats);
          }
        }
      } catch (err) {
        // Dynamic fetch failed
      }
    };

    loadDynamicData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="category-fits" id="category-fits-showcase">
      {/* Anchor aliases for subcategory sections */}
      <span id="denims" style={{ position: 'relative', top: '-90px', display: 'block', height: 0, visibility: 'hidden' }} />
      <span id="cargo" style={{ position: 'relative', top: '-90px', display: 'block', height: 0, visibility: 'hidden' }} />
      <span id="tops" style={{ position: 'relative', top: '-90px', display: 'block', height: 0, visibility: 'hidden' }} />
      <span id="accessories" style={{ position: 'relative', top: '-90px', display: 'block', height: 0, visibility: 'hidden' }} />
      <div className="category-fits__container">
        {categories.map((cat) => {
          const products = categoryData[cat.id] || [];
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
