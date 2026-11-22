'use client';

import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import MobileQuickBuyDrawer from '@/components/QuickBuy/MobileQuickBuyDrawer';
import { ALL_OBJECTS_PRODUCTS } from '@/data/objectsData';
import './ObjectsAllDrops.css';

/**
 * Format price to ensure Rs. and amount stay joined by non-breaking space
 */
const formatPrice = (str) => (!str ? '' : str.replace(/Rs\.\s*/g, 'Rs.\u00A0'));

const OBJECT_CATEGORIES = [
  { id: 'all', label: 'ALL', subCategory: null },
  { id: 'bags', label: 'BAGS & UTILITY', subCategory: 'BAGS' },
  { id: 'chains', label: 'CHAINS & HARDWARE', subCategory: 'CHAINS' },
  { id: 'caps', label: 'CAPS & HEADWEAR', subCategory: 'CAPS' }
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'title-asc', label: 'Alphabetically, A-Z' },
  { value: 'title-desc', label: 'Alphabetically, Z-A' }
];

/**
 * Individual Object Product Card in the All Drops Collection Grid
 */
function ObjectCardItem({ product }) {
  const { addItem, openCart } = useCart();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [showSizes, setShowSizes] = useState(false);
  const [isMobileQuickBuyOpen, setIsMobileQuickBuyOpen] = useState(false);
  const [addedStatus, setAddedStatus] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/hero/hero-card-3.jpg'];

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

  const displayImageIndex = isHovered && images.length > 1 ? 1 : currentImageIdx;

  return (
    <article
      className="obj-all-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="obj-all-card__media">
        <Link
          href={`/products/${product.handle}`}
          className="obj-all-card__image-link"
          aria-label={product.title}
        >
          <div className="obj-all-card__image-wrapper">
            <img
              src={images[displayImageIndex]}
              alt={product.title}
              className="obj-all-card__image"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Product Badges */}
        {product.badge && (
          <span className="obj-all-card__badge">
            {product.badge}
          </span>
        )}

        {/* Image dots for multiple images */}
        {images.length > 1 && (
          <div className="obj-all-card__dots">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`obj-all-card__dot ${
                  idx === displayImageIndex ? 'obj-all-card__dot--active' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIdx(idx);
                }}
                aria-label={`View photo ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* In-Card Quick Size Selector (Desktop) */}
        <div className={`obj-all-card__quick-actions ${showSizes ? 'obj-all-card__quick-actions--open' : ''}`}>
          {showSizes ? (
            <div className="obj-all-card__sizes-overlay" onClick={(e) => e.stopPropagation()}>
              <div className="obj-all-card__sizes-header">
                <span className="obj-all-card__sizes-label">SELECT OPTION:</span>
                <button
                  type="button"
                  className="obj-all-card__sizes-close"
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
              <div className="obj-all-card__sizes-list">
                {(product.availableSizes || ['ONE SIZE']).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className="obj-all-card__size-btn"
                    onClick={(e) => handleQuickAdd(e, sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={`obj-all-card__choose-btn ${
                addedStatus ? 'obj-all-card__choose-btn--added' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                  setIsMobileQuickBuyOpen(true);
                } else {
                  setShowSizes(true);
                }
              }}
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
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <svg
                    className="obj-all-card__choose-icon"
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

      {/* Product Meta */}
      <div className="obj-all-card__info">
        <h3 className="obj-all-card__title">
          <Link href={`/products/${product.handle}`} className="obj-all-card__title-link">
            {product.title}
          </Link>
        </h3>

        <div className="obj-all-card__price-row">
          <span className="obj-all-card__sale-price">{formatPrice(product.salePrice)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="obj-all-card__compare-price">{formatPrice(product.regularPrice)}</span>
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
 * Inner Collection Component that consumes URL Search Params
 */
function ObjectsAllDropsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial category filter from URL search params (e.g. ?category=bags)
  const initialCategoryParam = searchParams.get('category')?.toLowerCase() || 'all';

  const [activeCategoryTab, setActiveCategoryTab] = useState(
    ['bags', 'chains', 'caps'].includes(initialCategoryParam)
      ? initialCategoryParam
      : 'all'
  );

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [desktopColumns, setDesktopColumns] = useState('4');
  const [mobileColumns, setMobileColumns] = useState('2');

  const dropdownRef = useRef(null);

  // Sync category state when URL param changes
  useEffect(() => {
    const cat = searchParams.get('category')?.toLowerCase();
    if (cat && ['bags', 'chains', 'caps'].includes(cat)) {
      setActiveCategoryTab(cat);
    } else if (!cat) {
      setActiveCategoryTab('all');
    }
  }, [searchParams]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Body scroll lock on mobile drawer
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

  const handleTabChange = (catId) => {
    setActiveCategoryTab(catId);
    if (catId === 'all') {
      router.push('/collections/objects-drops', { scroll: false });
    } else {
      router.push(`/collections/objects-drops?category=${catId}`, { scroll: false });
    }
  };

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleAvailabilityToggle = (value) => {
    setSelectedAvailability((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setActiveDropdown(null);
  };

  const handleResetFilters = () => {
    setSelectedAvailability([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('featured');
    setActiveCategoryTab('all');
    router.push('/collections/objects-drops', { scroll: false });
  };

  const hasActiveFilters =
    selectedAvailability.length > 0 ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortBy !== 'featured' ||
    activeCategoryTab !== 'all';

  // Filtered & Sorted Objects
  const filteredProducts = useMemo(() => {
    let result = [...ALL_OBJECTS_PRODUCTS];

    // Filter by category tab
    if (activeCategoryTab !== 'all') {
      const targetSub = activeCategoryTab.toUpperCase();
      result = result.filter(
        (p) => p.subCategory === targetSub || p.subCategory?.startsWith(targetSub)
      );
    }

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
      case 'featured':
      default:
        // Keep original curated drop order
        break;
    }

    return result;
  }, [activeCategoryTab, selectedAvailability, minPrice, maxPrice, sortBy]);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Featured';

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: ALL_OBJECTS_PRODUCTS.length,
      bags: ALL_OBJECTS_PRODUCTS.filter((p) => p.subCategory === 'BAGS').length,
      chains: ALL_OBJECTS_PRODUCTS.filter((p) => p.subCategory === 'CHAINS').length,
      caps: ALL_OBJECTS_PRODUCTS.filter((p) => p.subCategory === 'CAPS').length
    };
  }, []);

  return (
    <section className="obj-all">
      <div className="obj-all__container">
        {/* Collection Header */}
        <header className="obj-all__header">
          <div className="obj-all__header-top">
            <span className="obj-all__kicker">VEYN-OBJECTS // HARDWARE ARCHIVE</span>
            <span className="obj-all__count-badge">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'artifact' : 'artifacts'}
            </span>
          </div>
          <h1 className="obj-all__title">OBJECT DROPS</h1>
        </header>

        {/* Category Pill Tabs */}
        <div className="obj-all__tabs" role="tablist" aria-label="Object Category Tabs">
          {OBJECT_CATEGORIES.map((cat) => {
            const isActive = activeCategoryTab === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`obj-all__tab ${isActive ? 'obj-all__tab--active' : ''}`}
                onClick={() => handleTabChange(cat.id)}
              >
                <span>{cat.label}</span>
                <span className="obj-all__tab-count">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Filter and Control Bar */}
        <div className="obj-all__controls" ref={dropdownRef}>
          {/* Desktop Filter Dropdowns */}
          <div className="obj-all__desktop-filters">
            {/* Availability Filter */}
            <div className="obj-all__filter-dropdown">
              <button
                type="button"
                className={`obj-all__filter-trigger ${
                  selectedAvailability.length > 0 ? 'obj-all__filter-trigger--active' : ''
                }`}
                onClick={() => toggleDropdown('availability')}
                aria-expanded={activeDropdown === 'availability'}
              >
                <span>Availability</span>
                {selectedAvailability.length > 0 && (
                  <span className="obj-all__filter-count">({selectedAvailability.length})</span>
                )}
                <svg
                  className={`obj-all__chevron ${
                    activeDropdown === 'availability' ? 'obj-all__chevron--open' : ''
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
                <div className="obj-all__popover">
                  <div className="obj-all__popover-header">
                    <span>Availability</span>
                    {selectedAvailability.length > 0 && (
                      <button
                        type="button"
                        className="obj-all__popover-reset"
                        onClick={() => {
                          setSelectedAvailability([]);
                          setActiveDropdown(null);
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="obj-all__popover-body">
                    <label className="obj-all__checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes('in-stock')}
                        onChange={() => handleAvailabilityToggle('in-stock')}
                        className="obj-all__checkbox-input"
                      />
                      <span className="obj-all__checkbox-custom" />
                      <span>In stock (18)</span>
                    </label>
                    <label className="obj-all__checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes('out-of-stock')}
                        onChange={() => handleAvailabilityToggle('out-of-stock')}
                        className="obj-all__checkbox-input"
                      />
                      <span className="obj-all__checkbox-custom" />
                      <span>Out of stock (0)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="obj-all__filter-dropdown">
              <button
                type="button"
                className={`obj-all__filter-trigger ${
                  minPrice !== '' || maxPrice !== '' ? 'obj-all__filter-trigger--active' : ''
                }`}
                onClick={() => toggleDropdown('price')}
                aria-expanded={activeDropdown === 'price'}
              >
                <span>Price</span>
                {(minPrice !== '' || maxPrice !== '') && (
                  <span className="obj-all__filter-count">(1)</span>
                )}
                <svg
                  className={`obj-all__chevron ${
                    activeDropdown === 'price' ? 'obj-all__chevron--open' : ''
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
                <div className="obj-all__popover obj-all__popover--price">
                  <div className="obj-all__popover-header">
                    <span>Highest price: Rs. 2,699.00</span>
                    {(minPrice !== '' || maxPrice !== '') && (
                      <button
                        type="button"
                        className="obj-all__popover-reset"
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
                  <div className="obj-all__price-inputs">
                    <div className="obj-all__price-field">
                      <span className="obj-all__price-prefix">₹</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="obj-all__input"
                        aria-label="Minimum price"
                      />
                    </div>
                    <span className="obj-all__price-separator">to</span>
                    <div className="obj-all__price-field">
                      <span className="obj-all__price-prefix">₹</span>
                      <input
                        type="number"
                        placeholder="2,700"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="obj-all__input"
                        aria-label="Maximum price"
                      />
                    </div>
                  </div>
                  <div className="obj-all__popover-actions">
                    <button
                      type="button"
                      className="obj-all__popover-apply-btn"
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
                className="obj-all__clear-all-btn"
                onClick={handleResetFilters}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <div className="obj-all__mobile-trigger-wrapper">
            <button
              type="button"
              className="obj-all__mobile-trigger"
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
              {hasActiveFilters && <span className="obj-all__active-dot" />}
            </button>
          </div>

          {/* Right Controls: Sort & Grid Switcher */}
          <div className="obj-all__right-controls">
            {/* Desktop Sort Dropdown */}
            <div className="obj-all__sort-dropdown">
              <span className="obj-all__sort-label">Sort:</span>
              <button
                type="button"
                className="obj-all__sort-trigger"
                onClick={() => toggleDropdown('sort')}
                aria-expanded={activeDropdown === 'sort'}
              >
                <span>{currentSortLabel}</span>
                <svg
                  className={`obj-all__chevron ${
                    activeDropdown === 'sort' ? 'obj-all__chevron--open' : ''
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
                <div className="obj-all__popover obj-all__popover--sort">
                  <div className="obj-all__popover-body">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`obj-all__sort-option ${
                          sortBy === opt.value ? 'obj-all__sort-option--active' : ''
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
            <div className="obj-all__grid-switch obj-all__grid-switch--desktop">
              <button
                type="button"
                className={`obj-all__grid-btn ${
                  desktopColumns === '2' ? 'obj-all__grid-btn--active' : ''
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
                className={`obj-all__grid-btn ${
                  desktopColumns === '4' ? 'obj-all__grid-btn--active' : ''
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
            <div className="obj-all__grid-switch obj-all__grid-switch--mobile">
              <button
                type="button"
                className={`obj-all__grid-btn ${
                  mobileColumns === '1' ? 'obj-all__grid-btn--active' : ''
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
                className={`obj-all__grid-btn ${
                  mobileColumns === '2' ? 'obj-all__grid-btn--active' : ''
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
          <div className="obj-all__empty">
            <h2 className="obj-all__empty-title">No artifacts found</h2>
            <p className="obj-all__empty-text">
              Try adjusting your category selection, price range, or availability filters.
            </p>
            <button
              type="button"
              className="obj-all__empty-btn"
              onClick={handleResetFilters}
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div
            className={`obj-all__grid obj-all__grid--${desktopColumns}col obj-all__grid--m${mobileColumns}col`}
          >
            {filteredProducts.map((product) => (
              <ObjectCardItem key={product.handle} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {isMobileDrawerOpen && (
        <div className="obj-all-drawer">
          <div
            className="obj-all-drawer__backdrop"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="obj-all-drawer__content">
            <div className="obj-all-drawer__header">
              <h2 className="obj-all-drawer__title">Filters &amp; Sort</h2>
              <button
                type="button"
                className="obj-all-drawer__close"
                onClick={() => setIsMobileDrawerOpen(false)}
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            <div className="obj-all-drawer__body">
              {/* Category Filter in Drawer */}
              <div className="obj-all-drawer__section">
                <h3 className="obj-all-drawer__section-title">Category</h3>
                <div className="obj-all-drawer__pill-group">
                  {OBJECT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`obj-all-drawer__pill ${
                        activeCategoryTab === cat.id ? 'obj-all-drawer__pill--active' : ''
                      }`}
                      onClick={() => handleTabChange(cat.id)}
                    >
                      {cat.label} ({categoryCounts[cat.id] || 0})
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options in Drawer */}
              <div className="obj-all-drawer__section">
                <h3 className="obj-all-drawer__section-title">Sort By</h3>
                <div className="obj-all-drawer__radio-group">
                  {SORT_OPTIONS.map((opt) => (
                    <label key={opt.value} className="obj-all-drawer__radio-label">
                      <input
                        type="radio"
                        name="sort-mobile"
                        value={opt.value}
                        checked={sortBy === opt.value}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="obj-all-drawer__radio-input"
                      />
                      <span className="obj-all-drawer__radio-custom" />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter in Drawer */}
              <div className="obj-all-drawer__section">
                <h3 className="obj-all-drawer__section-title">Availability</h3>
                <div className="obj-all-drawer__checkbox-group">
                  <label className="obj-all-drawer__checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes('in-stock')}
                      onChange={() => handleAvailabilityToggle('in-stock')}
                      className="obj-all-drawer__checkbox-input"
                    />
                    <span className="obj-all-drawer__checkbox-custom" />
                    <span>In stock (18)</span>
                  </label>
                  <label className="obj-all-drawer__checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes('out-of-stock')}
                      onChange={() => handleAvailabilityToggle('out-of-stock')}
                      className="obj-all-drawer__checkbox-input"
                    />
                    <span className="obj-all-drawer__checkbox-custom" />
                    <span>Out of stock (0)</span>
                  </label>
                </div>
              </div>

              {/* Price Filter in Drawer */}
              <div className="obj-all-drawer__section">
                <h3 className="obj-all-drawer__section-title">Price Range</h3>
                <div className="obj-all__price-inputs">
                  <div className="obj-all__price-field">
                    <span className="obj-all__price-prefix">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="obj-all__input"
                    />
                  </div>
                  <span className="obj-all__price-separator">to</span>
                  <div className="obj-all__price-field">
                    <span className="obj-all__price-prefix">₹</span>
                    <input
                      type="number"
                      placeholder="2,700"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="obj-all__input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="obj-all-drawer__footer">
              <button
                type="button"
                className="obj-all-drawer__reset-btn"
                onClick={handleResetFilters}
              >
                Reset
              </button>
              <button
                type="button"
                className="obj-all-drawer__apply-btn"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function ObjectsAllDrops() {
  return (
    <Suspense fallback={<div className="obj-all__loading">Loading VEYN-OBJECTS Archive...</div>}>
      <ObjectsAllDropsContent />
    </Suspense>
  );
}
