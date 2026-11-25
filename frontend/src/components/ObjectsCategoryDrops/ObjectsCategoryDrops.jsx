'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import MobileQuickBuyDrawer from '@/components/QuickBuy/MobileQuickBuyDrawer';
import { OBJECTS_DROP_CATEGORIES, OBJECTS_CATEGORY_DATA } from '@/data/objectsData';
import { API_BASE_URL } from '@/lib/constants';
import { optimizeImageUrl } from '@/lib/imageUtils';
import './ObjectsCategoryDrops.css';

// In-memory module cache for instant Frame-0 painting
let cachedObjectsCategories = null;
let cachedObjectsCategoryData = null;

/**
 * Format price to ensure Rs. and amount stay joined by non-breaking space
 */
const formatPrice = (str) => (!str ? '' : str.replace(/Rs\.\s*/g, 'Rs.\u00A0'));

/**
 * Individual Object Product Card with image, quick size selector,
 * circular mobile trigger, and cart drawer integration.
 */
function ObjectProductCard({ product }) {
  const { addItem, openCart } = useCart();
  const [showSizes, setShowSizes] = useState(false);
  const [isMobileQuickBuyOpen, setIsMobileQuickBuyOpen] = useState(false);
  const [addedStatus, setAddedStatus] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/hero/hero-card-3.jpg'];

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
      id: `${product.handle || product.id}-${size}`,
      productId: product.handle || product.id,
      title: product.title,
      size: size,
      price: product.price,
      comparePrice: product.comparePrice,
      image: images[0],
      quantity: 1
    });

    setAddedStatus(true);
    setShowSizes(false);
    openCart();
    setTimeout(() => setAddedStatus(false), 2000);
  };

  return (
    <article className="obj-drop-card">
      <div className="obj-drop-card__gallery">
        <Link href={`/products/${product.handle || product.id}`} className="obj-drop-card__link">
          <div className="obj-drop-card__image-container">
            <img
              src={optimizeImageUrl(images[0], 700)}
              alt={product.title}
              className="obj-drop-card__image"
              loading="lazy"
            />
          </div>
        </Link>

        {product.badge && (
          <span className="obj-drop-card__badge">{product.badge}</span>
        )}

        {/* Quick Add Pill on Laptop, Circular Trigger on Mobile */}
        <div className={`obj-drop-card__quick-add ${showSizes ? 'obj-drop-card__quick-add--open' : ''}`}>
          {showSizes ? (
            <div className="obj-drop-card__size-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="obj-drop-card__size-drawer-header">
                <span className="obj-drop-card__size-label">SELECT OPTION:</span>
                <button
                  type="button"
                  className="obj-drop-card__size-close"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSizes(false);
                  }}
                  aria-label="Close option chooser"
                >
                  ✕
                </button>
              </div>
              <div className="obj-drop-card__size-list">
                {(product.availableSizes || ['ONE SIZE']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="obj-drop-card__size-button"
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
              className={`obj-drop-card__choose-button ${
                addedStatus ? 'obj-drop-card__choose-button--added' : ''
              }`}
              onClick={handleQuickAddClick}
              aria-label={`Choose options for ${product.title}`}
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
                    className="obj-drop-card__choose-icon"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <svg
                    className="obj-drop-card__choose-icon"
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
      <div className="obj-drop-card__details">
        <Link href={`/products/${product.handle || product.id}`} className="obj-drop-card__title-link">
          <h3 className="obj-drop-card__title">{product.title}</h3>
        </Link>
        <div className="obj-drop-card__pricing">
          <span className="obj-drop-card__sale-price">{formatPrice(product.salePrice)}</span>
          {product.regularPrice && (
            <span className="obj-drop-card__regular-price">{formatPrice(product.regularPrice)}</span>
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
function ViewAllEndCard({ categoryLabel, collectionPath, image }) {
  return (
    <article className="obj-drop-card obj-drop-card--view-all">
      <Link href={collectionPath} className="obj-drop-card__view-all-link" aria-label={`View all ${categoryLabel}`}>
        <div className={`obj-drop-card__view-all-box ${image ? 'obj-drop-card__view-all-box--has-image' : ''}`}>
          {image && (
            <img
              src={optimizeImageUrl(image, 700)}
              alt={`View all ${categoryLabel}`}
              className="obj-drop-card__view-all-image"
              loading="lazy"
            />
          )}
          <div className="obj-drop-card__view-all-content">
            <span className="obj-drop-card__view-all-text">View all</span>
            <svg
              className="obj-drop-card__view-all-arrow"
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
        </div>
      </Link>
    </article>
  );
}

/**
 * Swipeable Category Row Component:
 * 1. Row Header (Category Name + View link)
 * 2. Swipeable track with 6 cards + 1 "View" end card
 * 3. Left/Right floating navigation buttons
 */
function CategorySwipeRow({ categoryId, categoryLabel, anchorId, products, collectionPath, viewAllImage }) {
  if (!products || products.length === 0) return null;

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
    <section className="objects-cat-drops__row" id={anchorId || categoryId}>
      {/* Anchor aliases for subcategory jumping */}
      {(categoryId === 'caps' || categoryId === 'headwear') && (
        <>
          <span id="caps" style={{ position: 'relative', top: '-70px' }} />
          <span id="headwear" style={{ position: 'relative', top: '-70px' }} />
        </>
      )}
      {categoryId === 'chains' && <span id="hardware" style={{ position: 'relative', top: '-70px' }} />}
      {/* Row Header with Category Name and Link */}
      <header className="objects-cat-drops__row-header">
        <h2 className="objects-cat-drops__row-heading">{categoryLabel}</h2>
        {products.length >= 8 && (
          <Link href={collectionPath} className="objects-cat-drops__row-header-link" aria-label={`View ${categoryLabel}`}>
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
        )}
      </header>

      {/* Swipeable Track Container */}
      <div className="objects-cat-drops__slider-container">
        {/* Left Floating Nav Button */}
        <button
          type="button"
          className={`objects-cat-drops__nav-button objects-cat-drops__nav-button--prev ${
            !canScrollLeft ? 'objects-cat-drops__nav-button--disabled' : ''
          }`}
          onClick={() => scrollByAmount('left')}
          aria-label={`Scroll ${categoryLabel} left`}
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

        {/* Horizontal Swipeable Track: Up to 8 Cards + "View" end card only after 8 cards */}
        <div
          ref={trackRef}
          className="objects-cat-drops__slider-track"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="objects-cat-drops__slider-item">
              <ObjectProductCard product={product} />
            </div>
          ))}

          {/* "View" End Card - only after latest added 8 cards */}
          {products.length >= 8 && (
            <div className="objects-cat-drops__slider-item objects-cat-drops__slider-item--view-all">
              <ViewAllEndCard categoryLabel={categoryLabel} collectionPath={collectionPath} image={viewAllImage} />
            </div>
          )}
        </div>

        {/* Right Floating Nav Button */}
        <button
          type="button"
          className={`objects-cat-drops__nav-button objects-cat-drops__nav-button--next ${
            !canScrollRight ? 'objects-cat-drops__nav-button--disabled' : ''
          }`}
          onClick={() => scrollByAmount('right')}
          aria-label={`Scroll ${categoryLabel} right`}
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
 * Main Category Based Drops with Swipe Showcase for VEYN-OBJECTS
 * Renders sequential swipe rows for:
 * 1. BAGS & UTILITY (#bags)
 * 2. CHAINS & HARDWARE (#chains)
 * 3. CAPS & HEADWEAR (#headwear)
 */
export default function ObjectsCategoryDrops() {
  const [categories, setCategories] = useState(() => cachedObjectsCategories || []);
  const [categoryData, setCategoryData] = useState(() => cachedObjectsCategoryData || {});

  // Fetch dynamic categories and products for VEYN-OBJECTS
  useEffect(() => {
    let isMounted = true;

    const loadDynamicData = async () => {
      try {
        // 1. Fetch dynamic swipe categories (fresh from backend with no stale cache)
        const catRes = await fetch(`${API_BASE_URL}/api/content/swipeCategories?t=${Date.now()}`, {
          cache: 'no-store',
        });
        const catJson = await catRes.json();
        let dynamicCats = null;
        if (catRes.ok && catJson.success && Array.isArray(catJson.data)) {
          const filtered = catJson.data.filter(
            (c) => c.targetSection === 'VEYN-OBJECTS' && c.active !== false
          );
          if (filtered.length > 0) {
            dynamicCats = filtered.map((c) => {
              const rawKey = (c.key || c.id || '').toLowerCase();
              const normId = (rawKey === 'headwear' || rawKey === 'caps' || rawKey.includes('cap')) ? 'caps' : rawKey;
              return {
                id: normId,
                rawKey: rawKey,
                label: c.label || (normId === 'caps' ? 'CAPS & HEADWEAR' : c.label),
                anchorId: rawKey || normId,
                collectionPath: c.collectionPath || `/collections/objects-drops?category=${normId}`,
                image: c.image || null,
              };
            });
          }
        }

        // 2. Fetch dynamic products
        const prodRes = await fetch(`${API_BASE_URL}/api/products?category=VEYN-OBJECTS&limit=100`);
        const prodJson = await prodRes.json();

        if (isMounted) {
          let activeCats = dynamicCats;

          if (prodRes.ok && prodJson.success && Array.isArray(prodJson.data) && prodJson.data.length > 0) {
            // Sort products newest first by createdAt / _id so latest added 8 cards are displayed
            const sortedProds = [...prodJson.data].sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            });

            const grouped = {};
            sortedProds.forEach((p) => {
              const rawKey = (p.swipeCategory || p.subCategory || p.fit || '').toLowerCase().trim();
              if (!rawKey) return;
              const key = (rawKey === 'headwear' || rawKey === 'caps' || rawKey.includes('cap')) ? 'caps' : rawKey;
              if (!grouped[key]) grouped[key] = [];
              grouped[key].push({
                id: p._id || p.id,
                title: p.title,
                handle: p.handle,
                category: 'VEYN-OBJECTS',
                subCategory: p.subCategory || key.toUpperCase(),
                salePrice: p.salePrice || (p.price ? `Rs. ${p.price.toLocaleString('en-IN')}.00` : ''),
                regularPrice: p.regularPrice || (p.comparePrice ? `Rs. ${p.comparePrice.toLocaleString('en-IN')}.00` : ''),
                price: p.price,
                comparePrice: p.comparePrice,
                badge: p.badge || '',
                images: p.images && p.images.length > 0 ? p.images : ['/images/hero/hero-card-3.jpg'],
                thumbnail: p.thumbnail || (p.images && p.images[0]) || '/images/hero/hero-card-3.jpg',
                availableSizes: p.availableSizes && p.availableSizes.length > 0 ? p.availableSizes : ['ONE SIZE'],
              });
            });

            // If no custom swipeCategories configured, dynamically generate from real products
            if (!activeCats || activeCats.length === 0) {
              activeCats = Object.keys(grouped).map((k) => ({
                id: k,
                rawKey: k,
                label: k.toUpperCase(),
                anchorId: k,
                collectionPath: `/collections/objects-drops?category=${encodeURIComponent(k)}`,
              }));
            }

            cachedObjectsCategoryData = grouped;
            setCategoryData(grouped);
          }

          if (activeCats && activeCats.length > 0) {
            cachedObjectsCategories = activeCats;
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
    <div className="objects-cat-drops" id="objects-category-drops">
      <div className="objects-cat-drops__container">
        {categories.map((cat) => {
          const catId = (cat.id || '').toLowerCase();
          const products =
            categoryData[catId] ||
            (catId === 'headwear' ? categoryData.caps : null) ||
            (catId === 'caps' ? categoryData.headwear : null) ||
            [];

          if (!products || products.length === 0) return null;

          return (
            <CategorySwipeRow
              key={cat.id}
              categoryId={cat.id}
              categoryLabel={cat.label}
              anchorId={cat.anchorId}
              products={products}
              collectionPath={cat.collectionPath}
              viewAllImage={cat.image}
            />
          );
        })}
      </div>
    </div>
  );
}
