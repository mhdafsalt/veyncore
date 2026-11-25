'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import MobileQuickBuyDrawer from '@/components/QuickBuy/MobileQuickBuyDrawer';
import { API_BASE_URL } from '@/lib/constants';
import './ObjectsNewArrivals.css';

/**
 * Format price to ensure Rs. and amount stay joined by non-breaking space
 */
const formatPrice = (str) => (!str ? '' : str.replace(/Rs\.\s*/g, 'Rs.\u00A0'));

/**
 * Individual Object Product Card with exact VEYN SELECTS styling & typography
 */
function ObjectCard({ product }) {
  const { addItem, openCart } = useCart();
  const [showSizes, setShowSizes] = useState(false);
  const [isMobileQuickBuyOpen, setIsMobileQuickBuyOpen] = useState(false);
  const [addedStatus, setAddedStatus] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/hero/hero-card-3.jpg'];
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
      id: `${product.handle || product.id}-${size}`,
      productId: product.handle || product.id,
      title: product.title,
      size: size,
      price: product.price,
      comparePrice: product.comparePrice,
      image: mainImage,
      quantity: 1
    });

    setAddedStatus(true);
    setShowSizes(false);
    openCart();
    setTimeout(() => setAddedStatus(false), 2200);
  };

  return (
    <article className="product-card">
      {/* Product Image Zone (Only View Main Thumbnail) */}
      <div className="product-card__gallery">
        <Link
          href={`/products/${product.handle || product.id}`}
          className="product-card__link"
          aria-label={product.title}
        >
          <div className="product-card__image-container">
            <img
              src={mainImage}
              alt={product.title}
              className={`product-card__image ${imageLoaded ? 'product-card__image--loaded' : ''}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/hero/hero-card-3.jpg';
              }}
            />
          </div>
        </Link>

        {/* Badge matching exact VEYN SELECTS style */}
        {product.badge && (
          <span className="product-card__badge product-card__badge--sale">
            {product.badge}
          </span>
        )}

        {/* Quick Add "Choose" Pill Button */}
        <div className={`product-card__quick-add ${showSizes ? 'product-card__quick-add--open' : ''}`}>
          {showSizes ? (
            <div className="product-card__size-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="product-card__size-drawer-header">
                <span className="product-card__size-label">SELECT OPTION:</span>
                <button
                  type="button"
                  className="product-card__size-close"
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
              <div className="product-card__size-list">
                {(product.availableSizes || ['ONE SIZE']).map((size) => (
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
              className={`product-card__choose-button ${addedStatus ? 'product-card__choose-button--added' : ''
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

      {/* Product Details (Title & Price) exact like VEYN SELECTS */}
      <div className="product-card__details">
        <Link href={`/products/${product.handle || product.id}`} className="product-card__title-link">
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

export default function ObjectsNewArrivals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchObjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products?category=VEYN-OBJECTS&limit=100`);
        const json = await res.json();
        const dbItems = res.ok && json.success && Array.isArray(json.data) ? json.data : [];

        // Sort newest added products first
        const sorted = [...dbItems].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        // Priority condition: explicit new arrivals first, then other latest products
        const markedArrivals = sorted.filter((p) => p.newArrival === true);
        const otherLatest = sorted.filter((p) => !p.newArrival);
        const dbList = [...markedArrivals, ...otherLatest];

        // Ensure exactly latest 12 products
        const combined = dbList.slice(0, 12);

        const mapped = combined.map((p) => ({
          id: p._id || p.id,
          title: p.title,
          handle: p.handle,
          salePrice: p.salePrice || (p.price ? `Rs. ${p.price.toLocaleString('en-IN')}.00` : ''),
          regularPrice: p.regularPrice || (p.comparePrice ? `Rs. ${p.comparePrice.toLocaleString('en-IN')}.00` : ''),
          price: p.price,
          comparePrice: p.comparePrice,
          images: p.images && p.images.length > 0 ? p.images : ['/images/hero/hero-card-3.jpg'],
          thumbnail: p.thumbnail || (p.images && p.images[0]) || '/images/hero/hero-card-3.jpg',
          badge: p.badge || (p.newArrival ? 'New' : ''),
          availableSizes: p.availableSizes && p.availableSizes.length > 0 ? p.availableSizes : ['ONE SIZE'],
        }));
        if (isMounted) {
          setProducts(mapped);
        }
      } catch (err) {
        // Silently catch network errors
      }
    };

    fetchObjects();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="new-arrivals" id="object-drops">
      <div className="new-arrivals__container">
        {/* Section Header (Exact like SHOP NEW ARRIVALS) */}
        <header className="new-arrivals__header">
          <h2 className="new-arrivals__heading">OBJECT DROPS</h2>
        </header>

        {/* 4-col desktop / 2-col mobile Grid */}
        <div className="new-arrivals__grid">
          {products.map((product) => (
            <div key={product.id || product.handle} className="new-arrivals__grid-item">
              <ObjectCard product={product} />
            </div>
          ))}
        </div>

        {/* Centered Minimalist "View All" Action matching reference design */}
        <div className="new-arrivals__footer">
          <Link href="/collections/objects-drops" className="new-arrivals__view-all-button" aria-label="View all">
            <span className="new-arrivals__view-all-text">VIEW ALL</span>
            <svg
              className="new-arrivals__view-all-arrow"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <polyline points="14 5 21 12 14 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
