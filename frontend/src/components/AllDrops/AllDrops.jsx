'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ALL_DROPS_PRODUCTS, SORT_OPTIONS, COLLECTION_PRICE_RANGE } from '@/data/allDropsData';
import './AllDrops.css';

/**
 * Individual Product Card for ALL DROPS Collection
 */
function DropsProductCard({ product }) {
  const { addItem, openCart } = useCart();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [showSizes, setShowSizes] = useState(false);
  const [addedStatus, setAddedStatus] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/products/artic-blue-wide.jpg'];

  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

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
        setCurrentImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        setCurrentImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
  };

  const handleQuickAdd = (e, size) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.handle}-${size}`,
      productId: product.handle,
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

  // On hover desktop: show second image if available
  const displayImageIndex = isHovered && images.length > 1 ? 1 : currentImageIdx;

  return (
    <article
      className="all-drops-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="all-drops-card__media"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Link
          href={`/products/${product.handle}`}
          className="all-drops-card__image-link"
          aria-label={product.title}
        >
          <div className="all-drops-card__image-wrapper">
            <img
              src={images[displayImageIndex]}
              alt={product.title}
              className="all-drops-card__image"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/products/artic-blue-wide.jpg';
              }}
            />
          </div>
        </Link>

        {/* Badges */}
        {product.badge && (
          <span
            className={`all-drops-card__badge ${
              product.badge === 'SALE'
                ? 'all-drops-card__badge--sale'
                : 'all-drops-card__badge--new'
            }`}
          >
            {product.badge === 'SALE' && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
            {product.badge}
          </span>
        )}

        {/* Multi-image indicators if multiple images */}
        {images.length > 1 && (
          <div className="all-drops-card__dots">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`all-drops-card__dot ${
                  idx === displayImageIndex ? 'all-drops-card__dot--active' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIdx(idx);
                }}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Quick Add Button / Trigger */}
        <div className="all-drops-card__quick-actions">
          {showSizes ? (
            <div className="all-drops-card__sizes-overlay" onClick={(e) => e.stopPropagation()}>
              <span className="all-drops-card__sizes-label">SELECT SIZE:</span>
              <div className="all-drops-card__sizes-list">
                {product.availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className="all-drops-card__size-btn"
                    onClick={(e) => handleQuickAdd(e, sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="all-drops-card__sizes-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizes(false);
                }}
                aria-label="Close size chooser"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={`all-drops-card__choose-btn ${
                addedStatus ? 'all-drops-card__choose-btn--added' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSizes(true);
              }}
            >
              {addedStatus ? 'ADDED ✓' : 'CHOOSE SIZE'}
            </button>
          )}
        </div>
      </div>

      {/* Product Meta */}
      <div className="all-drops-card__info">
        <h3 className="all-drops-card__title">
          <Link href={`/products/${product.handle}`} className="all-drops-card__title-link">
            {product.title}
          </Link>
        </h3>

        <div className="all-drops-card__price-row">
          <span className="all-drops-card__sale-price">{product.salePrice}</span>
          {product.comparePrice > product.price && (
            <span className="all-drops-card__compare-price">{product.regularPrice}</span>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Main ALL DROPS Collection View
 */
export default function AllDrops() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [desktopColumns, setDesktopColumns] = useState('4'); // '4' or '2' for desktop
  const [mobileColumns, setMobileColumns] = useState('2'); // '2' or '1' for mobile
  const [displayCount, setDisplayCount] = useState(16);

  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  // Toggle filter dropdowns
  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Toggle Availability filter
  const handleAvailabilityToggle = (value, shouldClose = false) => {
    setSelectedAvailability((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    if (shouldClose) {
      setActiveDropdown(null);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedAvailability([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('date-desc');
  };

  const hasActiveFilters =
    selectedAvailability.length > 0 || minPrice !== '' || maxPrice !== '' || sortBy !== 'date-desc';

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...ALL_DROPS_PRODUCTS];

    // Filter by availability
    if (selectedAvailability.length > 0) {
      if (selectedAvailability.includes('in-stock') && !selectedAvailability.includes('out-of-stock')) {
        result = result.filter((p) => p.inStock);
      } else if (selectedAvailability.includes('out-of-stock') && !selectedAvailability.includes('in-stock')) {
        result = result.filter((p) => !p.inStock);
      }
    }

    // Filter by price
    const minVal = parseFloat(minPrice);
    if (!isNaN(minVal)) {
      result = result.filter((p) => p.price >= minVal);
    }
    const maxVal = parseFloat(maxPrice);
    if (!isNaN(maxVal)) {
      result = result.filter((p) => p.price <= maxVal);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date-asc':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'date-desc':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [selectedAvailability, minPrice, maxPrice, sortBy]);

  const visibleProducts = filteredProducts.slice(0, displayCount);
  const remainingCount = filteredProducts.length - visibleProducts.length;

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Date, new to old';

  return (
    <section className="all-drops">
      <div className="all-drops__container">
        {/* Collection Header */}
        <header className="all-drops__header">
          <h1 className="all-drops__title">ALL DROPS</h1>
          <span className="all-drops__count-badge">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </span>
        </header>

        {/* Filter and Control Bar */}
        <div className="all-drops__controls" ref={dropdownRef}>
          {/* Desktop Filter Pills */}
          <div className="all-drops__desktop-filters">
            {/* Availability Filter */}
            <div className="all-drops__filter-dropdown">
              <button
                type="button"
                className={`all-drops__filter-trigger ${
                  selectedAvailability.length > 0 ? 'all-drops__filter-trigger--active' : ''
                }`}
                onClick={() => toggleDropdown('availability')}
                aria-expanded={activeDropdown === 'availability'}
              >
                <span>Availability</span>
                {selectedAvailability.length > 0 && (
                  <span className="all-drops__filter-count">({selectedAvailability.length})</span>
                )}
                <svg
                  className={`all-drops__chevron ${
                    activeDropdown === 'availability' ? 'all-drops__chevron--open' : ''
                  }`}
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {activeDropdown === 'availability' && (
                <div className="all-drops__popover">
                  <div className="all-drops__popover-header">
                    <span>Availability</span>
                    {selectedAvailability.length > 0 && (
                      <button
                        type="button"
                        className="all-drops__popover-reset"
                        onClick={() => {
                          setSelectedAvailability([]);
                          setActiveDropdown(null);
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="all-drops__popover-body">
                    <label className="all-drops__checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes('in-stock')}
                        onChange={() => handleAvailabilityToggle('in-stock', true)}
                        className="all-drops__checkbox-input"
                      />
                      <span className="all-drops__checkbox-custom" />
                      <span>In stock ({ALL_DROPS_PRODUCTS.filter((p) => p.inStock).length})</span>
                    </label>
                    <label className="all-drops__checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes('out-of-stock')}
                        onChange={() => handleAvailabilityToggle('out-of-stock', true)}
                        className="all-drops__checkbox-input"
                      />
                      <span className="all-drops__checkbox-custom" />
                      <span>Out of stock (0)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="all-drops__filter-dropdown">
              <button
                type="button"
                className={`all-drops__filter-trigger ${
                  minPrice !== '' || maxPrice !== '' ? 'all-drops__filter-trigger--active' : ''
                }`}
                onClick={() => toggleDropdown('price')}
                aria-expanded={activeDropdown === 'price'}
              >
                <span>Price</span>
                {(minPrice !== '' || maxPrice !== '') && (
                  <span className="all-drops__filter-count">(1)</span>
                )}
                <svg
                  className={`all-drops__chevron ${
                    activeDropdown === 'price' ? 'all-drops__chevron--open' : ''
                  }`}
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {activeDropdown === 'price' && (
                <div className="all-drops__popover all-drops__popover--price">
                  <div className="all-drops__popover-header">
                    <span>The highest price is Rs. 1,800.00</span>
                    {(minPrice !== '' || maxPrice !== '') && (
                      <button
                        type="button"
                        className="all-drops__popover-reset"
                        onClick={() => {
                          setMinPrice('');
                          setMaxPrice('');
                          setActiveDropdown(null);
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="all-drops__price-inputs">
                    <div className="all-drops__price-field">
                      <span className="all-drops__price-prefix">₹</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setActiveDropdown(null);
                        }}
                        className="all-drops__input"
                        aria-label="Minimum price"
                      />
                    </div>
                    <span className="all-drops__price-separator">to</span>
                    <div className="all-drops__price-field">
                      <span className="all-drops__price-prefix">₹</span>
                      <input
                        type="number"
                        placeholder="1,800"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setActiveDropdown(null);
                        }}
                        className="all-drops__input"
                        aria-label="Maximum price"
                      />
                    </div>
                  </div>
                  <div className="all-drops__popover-actions">
                    <button
                      type="button"
                      className="all-drops__popover-apply-btn"
                      onClick={() => setActiveDropdown(null)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Clear All Link when filters active */}
            {hasActiveFilters && (
              <button
                type="button"
                className="all-drops__clear-all-btn"
                onClick={handleResetFilters}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <div className="all-drops__mobile-trigger-wrapper">
            <button
              type="button"
              className="all-drops__mobile-trigger"
              onClick={() => setIsMobileDrawerOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>Filters & Sort</span>
              {hasActiveFilters && <span className="all-drops__active-dot" />}
            </button>
          </div>

          {/* Right Controls: Sort & Grid Switcher */}
          <div className="all-drops__right-controls">
            {/* Desktop Sort Dropdown */}
            <div className="all-drops__sort-dropdown">
              <span className="all-drops__sort-label">Sort:</span>
              <button
                type="button"
                className="all-drops__sort-trigger"
                onClick={() => toggleDropdown('sort')}
                aria-expanded={activeDropdown === 'sort'}
              >
                <span>{currentSortLabel}</span>
                <svg
                  className={`all-drops__chevron ${
                    activeDropdown === 'sort' ? 'all-drops__chevron--open' : ''
                  }`}
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {activeDropdown === 'sort' && (
                <div className="all-drops__popover all-drops__popover--sort">
                  <div className="all-drops__popover-body">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`all-drops__sort-option ${
                          sortBy === opt.value ? 'all-drops__sort-option--active' : ''
                        }`}
                        onClick={() => {
                          setSortBy(opt.value);
                          setActiveDropdown(null);
                        }}
                      >
                        {opt.label}
                        {sortBy === opt.value && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Grid Switcher (2 & 4 columns) */}
            <div className="all-drops__grid-switch all-drops__grid-switch--desktop">
              <button
                type="button"
                className={`all-drops__grid-btn ${
                  desktopColumns === '2' ? 'all-drops__grid-btn--active' : ''
                }`}
                onClick={() => setDesktopColumns('2')}
                aria-label="2 Columns View"
                title="2 Columns"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="14" rx="1" />
                  <rect x="9" y="1" width="6" height="14" rx="1" />
                </svg>
              </button>

              <button
                type="button"
                className={`all-drops__grid-btn ${
                  desktopColumns === '4' ? 'all-drops__grid-btn--active' : ''
                }`}
                onClick={() => setDesktopColumns('4')}
                aria-label="4 Columns View"
                title="4 Columns"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="2.5" height="14" rx="0.5" />
                  <rect x="4.8" y="1" width="2.5" height="14" rx="0.5" />
                  <rect x="8.6" y="1" width="2.5" height="14" rx="0.5" />
                  <rect x="12.5" y="1" width="2.5" height="14" rx="0.5" />
                </svg>
              </button>
            </div>

            {/* Mobile Grid Switcher (1 & 2 cards) */}
            <div className="all-drops__grid-switch all-drops__grid-switch--mobile">
              <button
                type="button"
                className={`all-drops__grid-btn ${
                  mobileColumns === '1' ? 'all-drops__grid-btn--active' : ''
                }`}
                onClick={() => setMobileColumns('1')}
                aria-label="1 Card View"
                title="1 Card"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="2" y="1" width="12" height="14" rx="1" />
                </svg>
              </button>

              <button
                type="button"
                className={`all-drops__grid-btn ${
                  mobileColumns === '2' ? 'all-drops__grid-btn--active' : ''
                }`}
                onClick={() => setMobileColumns('2')}
                aria-label="2 Cards View"
                title="2 Cards"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="14" rx="1" />
                  <rect x="9" y="1" width="6" height="14" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="all-drops__empty">
            <h2 className="all-drops__empty-title">No products found</h2>
            <p className="all-drops__empty-text">
              Try adjusting your price range or availability filters.
            </p>
            <button
              type="button"
              className="all-drops__empty-btn"
              onClick={handleResetFilters}
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div
            className={`all-drops__grid all-drops__grid--${desktopColumns}col all-drops__grid--m${mobileColumns}col`}
          >
            {visibleProducts.map((product) => (
              <DropsProductCard key={product.handle} product={product} />
            ))}
          </div>
        )}

        {/* Load More Pagination */}
        {remainingCount > 0 && (
          <div className="all-drops__pagination">
            <button
              type="button"
              className="all-drops__load-more-btn"
              onClick={() => setDisplayCount((prev) => prev + 16)}
            >
              LOAD MORE ({remainingCount} REMAINING)
            </button>
            <span className="all-drops__pagination-progress">
              Showing {visibleProducts.length} of {filteredProducts.length} products
            </span>
          </div>
        )}
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {isMobileDrawerOpen && (
        <div className="all-drops-drawer">
          <div
            className="all-drops-drawer__backdrop"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="all-drops-drawer__panel">
            <div className="all-drops-drawer__header">
              <h2 className="all-drops-drawer__title">FILTERS &amp; SORT</h2>
              <button
                type="button"
                className="all-drops-drawer__close"
                onClick={() => setIsMobileDrawerOpen(false)}
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            <div className="all-drops-drawer__body">
              {/* Availability */}
              <div className="all-drops-drawer__section">
                <h3 className="all-drops-drawer__section-title">Availability</h3>
                <div className="all-drops-drawer__options">
                  <label className="all-drops__checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes('in-stock')}
                      onChange={() => handleAvailabilityToggle('in-stock')}
                      className="all-drops__checkbox-input"
                    />
                    <span className="all-drops__checkbox-custom" />
                    <span>In stock ({ALL_DROPS_PRODUCTS.filter((p) => p.inStock).length})</span>
                  </label>
                  <label className="all-drops__checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes('out-of-stock')}
                      onChange={() => handleAvailabilityToggle('out-of-stock')}
                      className="all-drops__checkbox-input"
                    />
                    <span className="all-drops__checkbox-custom" />
                    <span>Out of stock (0)</span>
                  </label>
                </div>
              </div>

              {/* Price */}
              <div className="all-drops-drawer__section">
                <h3 className="all-drops-drawer__section-title">Price</h3>
                <div className="all-drops__price-inputs">
                  <div className="all-drops__price-field">
                    <span className="all-drops__price-prefix">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="all-drops__input"
                    />
                  </div>
                  <span className="all-drops__price-separator">to</span>
                  <div className="all-drops__price-field">
                    <span className="all-drops__price-prefix">₹</span>
                    <input
                      type="number"
                      placeholder="1,800"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="all-drops__input"
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="all-drops-drawer__section">
                <h3 className="all-drops-drawer__section-title">Sort By</h3>
                <div className="all-drops-drawer__sort-list">
                  {SORT_OPTIONS.map((opt) => (
                    <label key={opt.value} className="all-drops-drawer__radio-label">
                      <input
                        type="radio"
                        name="mobile_sort"
                        value={opt.value}
                        checked={sortBy === opt.value}
                        onChange={() => setSortBy(opt.value)}
                        className="all-drops-drawer__radio-input"
                      />
                      <span className="all-drops-drawer__radio-custom" />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="all-drops-drawer__footer">
              <button
                type="button"
                className="all-drops-drawer__reset-btn"
                onClick={handleResetFilters}
              >
                Clear all
              </button>
              <button
                type="button"
                className="all-drops-drawer__apply-btn"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                See {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
