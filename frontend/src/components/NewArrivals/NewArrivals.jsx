'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import MobileQuickBuyDrawer from '@/components/QuickBuy/MobileQuickBuyDrawer';
import { NEW_ARRIVALS_PRODUCTS } from '@/data/newArrivalsData';
import { API_BASE_URL } from '@/lib/constants';
import './NewArrivals.css';

/**
 * Format price to ensure Rs. and amount stay joined by non-breaking space
 */
const formatPrice = (str) => (!str ? '' : str.replace(/Rs\.\s*/g, 'Rs.\u00A0'));

/**
 * Individual Product Card displaying main thumbnail, size selection, and quick-add
 */
function ProductCard({ product }) {
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
      price: product.price || 1099,
      comparePrice: product.comparePrice || 1499,
      image: mainImage,
      quantity: 1,
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
          href={`/products/${product.handle}`}
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
  const [products, setProducts] = useState(NEW_ARRIVALS_PRODUCTS);

  useEffect(() => {
    let isMounted = true;
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products?category=VEYN-SELECTS&limit=20`);
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const arrivals = json.data.filter((p) => p.newArrival === true);
          const list = arrivals.length > 0 ? arrivals : json.data.slice(0, 8);
          const mapped = list.map((p) => ({
            id: p._id || p.id,
            title: p.title,
            handle: p.handle,
            salePrice: p.salePrice || (p.price ? `Rs. ${p.price.toLocaleString('en-IN')}.00` : ''),
            regularPrice: p.regularPrice || (p.comparePrice ? `Rs. ${p.comparePrice.toLocaleString('en-IN')}.00` : ''),
            price: p.price,
            comparePrice: p.comparePrice,
            images: p.images && p.images.length > 0 ? p.images : ['/images/products/artic-blue-wide.jpg'],
            thumbnail: p.thumbnail || (p.images && p.images[0]) || '/images/products/artic-blue-wide.jpg',
            badge: p.badge || (p.newArrival ? 'New' : ''),
            availableSizes: p.availableSizes && p.availableSizes.length > 0 ? p.availableSizes : ['28', '30', '32', '34', '36'],
          }));
          if (isMounted && mapped.length > 0) {
            setProducts(mapped);
          }
        }
      } catch (err) {
        // Fallback to static
      }
    };

    fetchNewArrivals();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="new-arrivals" id="new-arrivals">
      <div className="new-arrivals__container">
        {/* Section Header */}
        <header className="new-arrivals__header">
          <h2 className="new-arrivals__heading">SHOP NEW ARRIVALS</h2>
        </header>

        {/* 4-Column (Desktop) / 2-Column (Mobile) Product Grid */}
        <div className="new-arrivals__grid">
          {products.map((product) => (
            <div key={product.id || product.handle} className="new-arrivals__grid-item">
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
