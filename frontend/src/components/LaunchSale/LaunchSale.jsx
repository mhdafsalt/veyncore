'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import MobileQuickBuyDrawer from '@/components/QuickBuy/MobileQuickBuyDrawer';
import { API_BASE_URL } from '@/lib/constants';
import { optimizeImageUrl } from '@/lib/imageUtils';
import '@/components/AllDrops/AllDrops.css';
import './LaunchSale.css';

/**
 * Format price to ensure Rs. and amount stay joined by non-breaking space
 */
const formatPrice = (str) => (!str ? '' : str.replace(/Rs\.\s*/g, 'Rs.\u00A0'));

/**
 * Individual Product Countdown Component
 * Formats time compactly on a single line with zero wrap
 */
function ProductCountdown({ endDateTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    return Math.max(0, new Date(endDateTime).getTime() - Date.now());
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, new Date(endDateTime).getTime() - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDateTime, onExpire]);

  if (timeLeft <= 0) {
    return <span className="launch-card__timer-text">SALE ENDED</span>;
  }

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <span className="launch-card__timer-text">
      {days > 0 ? `${days}d : ` : ''}
      {pad(hours)}h : {pad(minutes)}m : {pad(seconds)}s
    </span>
  );
}

/**
 * Individual Launch Sale Product Card
 * Strict 100% visual, layout & functional parity with DropsProductCard in AllDrops
 */
function LaunchSaleCard({ saleItem, onExpire }) {
  const { addItem, openCart } = useCart();
  const [showSizes, setShowSizes] = useState(false);
  const [isMobileQuickBuyOpen, setIsMobileQuickBuyOpen] = useState(false);
  const [addedStatus, setAddedStatus] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const images = saleItem.images && saleItem.images.length > 0
    ? saleItem.images
    : [saleItem.thumbnail || '/images/products/artic-blue-wide.jpg'];
  const mainImage = saleItem.thumbnail || images[0];

  const availableSizes = saleItem.availableSizes && saleItem.availableSizes.length > 0
    ? saleItem.availableSizes
    : ['28', '30', '32', '34', '36'];

  const originalPriceNum = Number(saleItem.originalPrice) || Number(saleItem.price) || 0;
  const salePriceNum = Number(saleItem.price) || 0;

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
      id: `${saleItem.handle || saleItem._id || saleItem.productId}-${size}`,
      productId: saleItem.handle,
      title: saleItem.title,
      size: size,
      price: salePriceNum,
      comparePrice: originalPriceNum,
      image: mainImage,
      quantity: 1,
    });

    setAddedStatus(true);
    setShowSizes(false);
    openCart();
    setTimeout(() => setAddedStatus(false), 2200);
  };

  // Mobile adapter for drawer
  const mobileProductAdapter = {
    id: saleItem.handle || saleItem._id || saleItem.productId,
    title: saleItem.title,
    handle: saleItem.handle,
    price: salePriceNum,
    comparePrice: originalPriceNum,
    thumbnail: mainImage,
    images: images,
    availableSizes: availableSizes,
  };

  const displayImageIndex = isHovered && images.length > 1 ? 1 : currentImageIdx;

  return (
    <article
      className="all-drops-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Zone */}
      <div className="all-drops-card__media">
        <Link
          href={`/products/${saleItem.handle}`}
          className="all-drops-card__image-link"
          aria-label={saleItem.title}
        >
          <div className="all-drops-card__image-wrapper">
            <img
              src={optimizeImageUrl(images[displayImageIndex], 500)}
              alt={saleItem.title}
              width={300}
              height={400}
              className="all-drops-card__image"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/products/artic-blue-wide.jpg';
              }}
            />
          </div>
        </Link>

        {/* Promotional Sale Discount Badge (Red Background, White Text) */}
        {saleItem.discountPercentage && (
          <span className="all-drops-card__badge all-drops-card__badge--launch-sale">
            {saleItem.discountPercentage}% OFF
          </span>
        )}

        {/* Individual Countdown Timer Pill (Strict single line, non-wrapping) */}
        {saleItem.endDateTime && (
          <div className="launch-card__timer-bar" aria-label="Sale Countdown">
            <svg
              className="launch-card__timer-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <ProductCountdown
              endDateTime={saleItem.endDateTime}
              onExpire={() => onExpire(saleItem._id)}
            />
          </div>
        )}

        {/* Quick Actions / Choose Button Overlay matching AllDrops */}
        <div className={`all-drops-card__quick-actions ${showSizes ? 'all-drops-card__quick-actions--open' : ''}`}>
          {!showSizes ? (
            <button
              type="button"
              className={`all-drops-card__choose-btn ${addedStatus ? 'all-drops-card__choose-btn--added' : ''}`}
              onClick={handleQuickAddClick}
              aria-label="Choose size"
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
                    className="all-drops-card__choose-icon"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <svg
                    className="all-drops-card__choose-icon"
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
          ) : (
            <div className="all-drops-card__sizes-overlay">
              <div className="all-drops-card__sizes-header">
                <span className="all-drops-card__sizes-label">SELECT SIZE</span>
                <button
                  type="button"
                  className="all-drops-card__sizes-close"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSizes(false);
                  }}
                  aria-label="Close size selector"
                >
                  ✕
                </button>
              </div>
              <div className="all-drops-card__sizes-list">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="all-drops-card__size-btn"
                    onClick={(e) => handleSelectSize(e, size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Meta Info (Title & Pricing matching AllDrops) */}
      <div className="all-drops-card__info">
        <Link href={`/products/${saleItem.handle}`} className="all-drops-card__title-link">
          <h2 className="all-drops-card__title">{saleItem.title}</h2>
        </Link>
        <div className="all-drops-card__price-row">
          <span className="all-drops-card__sale-price">
            {formatPrice(`Rs. ${salePriceNum.toLocaleString('en-IN')}.00`)}
          </span>
          {originalPriceNum > salePriceNum && (
            <span className="all-drops-card__compare-price">
              {formatPrice(`Rs. ${originalPriceNum.toLocaleString('en-IN')}.00`)}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Quick Buy Bottom Sheet Modal */}
      <MobileQuickBuyDrawer
        isOpen={isMobileQuickBuyOpen}
        onClose={() => setIsMobileQuickBuyOpen(false)}
        product={mobileProductAdapter}
      />
    </article>
  );
}

/**
 * Main Storefront Launch Sale Collection Component
 * Strict layout and architecture parity with AllDrops
 */
export default function LaunchSale() {
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveSales = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/launch-sales/active?t=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setSaleProducts(data.data);
      }
    } catch (err) {
      console.warn('[LaunchSale] Failed to load active sales:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveSales();
  }, [fetchActiveSales]);

  const handleProductExpire = useCallback((saleId) => {
    setSaleProducts((prev) => prev.filter((item) => String(item._id) !== String(saleId)));
  }, []);

  return (
    <section className="all-drops">
      <div className="all-drops__container">
        {/* Collection Header matching All Drops with bottom divider line */}
        <header className="all-drops__header launch-sale__header">
          <div className="all-drops__header-title-row">
            <h1 className="all-drops__title">LAUNCH SALE</h1>
            {!loading && (
              <span className="all-drops__count-badge">
                {saleProducts.length} {saleProducts.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
              </span>
            )}
          </div>
        </header>

        {loading ? (
          <div className="all-drops__grid all-drops__grid--4col all-drops__grid--m2col">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="all-drops-card all-drops-card--skeleton">
                <div className="all-drops-card__media" />
                <div className="all-drops-card__info">
                  <div className="all-drops-card__skeleton-title" />
                  <div className="all-drops-card__skeleton-price" />
                </div>
              </div>
            ))}
          </div>
        ) : saleProducts.length > 0 ? (
          <div className="all-drops__grid all-drops__grid--4col all-drops__grid--m2col">
            {saleProducts.map((saleItem) => (
              <LaunchSaleCard
                key={saleItem._id || saleItem.productId}
                saleItem={saleItem}
                onExpire={handleProductExpire}
              />
            ))}
          </div>
        ) : (
          <div className="all-drops__empty">
            <h2 className="all-drops__empty-title">NO ACTIVE LAUNCH SALES RIGHT NOW</h2>
            <p className="all-drops__empty-text">
              All promotional drops have ended. Check back soon or explore our latest catalog drops.
            </p>
            <Link href="/collections/all-drops" className="all-drops__empty-btn">
              EXPLORE ALL DROPS
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
