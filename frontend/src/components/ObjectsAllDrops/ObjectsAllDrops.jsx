'use client';

import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import MobileQuickBuyDrawer from '@/components/QuickBuy/MobileQuickBuyDrawer';
import { API_BASE_URL } from '@/lib/constants';
import { matchProductCategory } from '@/lib/categoryFilterUtils';
import { optimizeImageUrl } from '@/lib/imageUtils';
import { fetchProductsWithRetry, getCachedProducts, invalidateProductsCache } from '@/lib/productsApi';
import './ObjectsAllDrops.css';

/**
 * Format price to ensure Rs. and amount stay joined by non-breaking space
 */
const formatPrice = (str) => (!str ? '' : str.replace(/Rs\.\s*/g, 'Rs.\u00A0'));

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
              src={optimizeImageUrl(images[displayImageIndex], 500)}
              alt={product.title}
              width={300}
              height={400}
              className="obj-all-card__image"
              loading="lazy"
              decoding="async"
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

// In-memory module cache for instant Frame-0 painting
let cachedObjectsAllDropsProducts = null;

/**
 * Inner Collection Component that consumes URL Search Params
 */
function ObjectsAllDropsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const objectsApiUrl = `${API_BASE_URL}/api/products?category=VEYN-OBJECTS&limit=100`;

  const [productsList, setProductsList] = useState(
    () => getCachedProducts(objectsApiUrl) || cachedObjectsAllDropsProducts || []
  );
  const [fetchError, setFetchError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(
    () => !getCachedProducts(objectsApiUrl) && (!cachedObjectsAllDropsProducts || cachedObjectsAllDropsProducts.length === 0)
  );

  // Read initial category filter from URL search params (e.g. ?category=bags)
  const initialCategoryParam = searchParams.get('category')?.toLowerCase().trim() || 'all';

  const [activeCategoryTab, setActiveCategoryTab] = useState(
    initialCategoryParam && initialCategoryParam !== 'all' ? initialCategoryParam : 'all'
  );

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [desktopColumns, setDesktopColumns] = useState('4');
  const [mobileColumns, setMobileColumns] = useState('2');

  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch dynamic products from backend API with timeout, retry, and deduplication
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const loadProducts = async () => {
      if (reloadKey > 0 || productsList.length === 0) {
        setIsLoading(true);
      }
      setFetchError(null);

      try {
        const data = await fetchProductsWithRetry(objectsApiUrl, {
          timeoutMs: 12000,
          maxAttempts: 4,
          backoffDelays: [1000, 2000, 3000],
          forceRefresh: reloadKey > 0,
          signal: abortController.signal,
          fallbackUrl: `https://veyncorein.vercel.app/api/products?category=VEYN-OBJECTS&limit=100`,
        });

        if (isMounted) {
          if (Array.isArray(data)) {
            const mapped = data.map((p) => ({
              id: p._id || p.id,
              title: p.title,
              handle: p.handle,
              category: 'VEYN-OBJECTS',
              subCategory: p.subCategory || 'BAGS',
              price: p.price,
              comparePrice: p.comparePrice,
              salePrice: p.salePrice || `Rs. ${p.price.toLocaleString('en-IN')}.00`,
              regularPrice: p.regularPrice || (p.comparePrice ? `Rs. ${p.comparePrice.toLocaleString('en-IN')}.00` : ''),
              badge: p.badge || '',
              images: p.images && p.images.length > 0 ? p.images : ['/images/hero/hero-card-3.jpg'],
              thumbnail: p.thumbnail || (p.images && p.images[0]) || '/images/hero/hero-card-3.jpg',
              availableSizes: p.availableSizes && p.availableSizes.length > 0 ? p.availableSizes : ['ONE SIZE'],
              inStock: p.inStock !== false,
              createdAt: p.createdAt || new Date().toISOString(),
            }));
            cachedObjectsAllDropsProducts = mapped;
            setProductsList(mapped);
          }
          setFetchError(null);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          console.error('[ObjectsAllDrops] Failed to load products after retries:', err);
          setFetchError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [reloadKey, objectsApiUrl]);

  // Sync category state when URL param changes
  useEffect(() => {
    const cat = searchParams.get('category')?.toLowerCase().trim();
    if (cat && cat !== 'all') {
      setActiveCategoryTab(cat);
    } else {
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
      router.replace('/collections/objects-drops', { scroll: false });
    } else {
      router.replace(`/collections/objects-drops?category=${catId}`, { scroll: false });
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

  // Available stock counts within current category context
  const categoryProducts = useMemo(() => {
    if (activeCategoryTab && activeCategoryTab !== 'all') {
      return productsList.filter((p) => matchProductCategory(p, activeCategoryTab));
    }
    return productsList;
  }, [productsList, activeCategoryTab]);

  const inStockCount = useMemo(() => {
    return categoryProducts.filter((p) => p.inStock).length;
  }, [categoryProducts]);

  const outOfStockCount = useMemo(() => {
    return categoryProducts.filter((p) => !p.inStock).length;
  }, [categoryProducts]);

  // Filtered & Sorted Objects
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // Filter by category tab using unified matching utility
    if (activeCategoryTab && activeCategoryTab !== 'all') {
      result = result.filter((p) => matchProductCategory(p, activeCategoryTab));
    }

    // Filter by availability
    if (selectedAvailability.length > 0) {
      if (selectedAvailability.includes('in-stock') && !selectedAvailability.includes('out-of-stock')) {
        result = result.filter((p) => p.inStock);
      } else if (selectedAvailability.includes('out-of-stock') && !selectedAvailability.includes('in-stock')) {
        result = result.filter((p) => !p.inStock);
      }
    }

    // Filter by search query if specified (e.g. ?search=... or ?q=...)
    const searchParam = searchParams ? (searchParams.get('search') || searchParams.get('q'))?.toLowerCase().trim() : null;
    if (searchParam) {
      result = result.filter((p) => {
        const titleMatch = (p.title || '').toLowerCase().includes(searchParam);
        const subCatMatch = (p.subCategory || '').toLowerCase().includes(searchParam);
        return titleMatch || subCatMatch;
      });
    }

    // Filter by badge if specified (e.g. ?badge=new)
    const badgeParam = searchParams ? searchParams.get('badge')?.toLowerCase() : null;
    if (badgeParam === 'new') {
      result = result.filter((p) => p.badge === 'NEW' || p.newArrival);
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
  }, [productsList, activeCategoryTab, selectedAvailability, minPrice, maxPrice, sortBy]);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Featured';

  // Dynamic Category Extraction from real products for Objects
  const dynamicObjectCategories = useMemo(() => {
    const map = new Map();

    // 1. Seed with ALL
    map.set('all', {
      id: 'all',
      label: 'ALL',
      count: productsList.length,
    });

    // 2. Add dynamic categories directly from real products
    productsList.forEach((p) => {
      const candidates = [p.subCategory, p.swipeCategory, p.fit].filter(Boolean);
      candidates.forEach((cand) => {
        const sub = String(cand).trim();
        if (sub) {
          const key = sub.toLowerCase();
          if (key !== 'all' && !map.has(key)) {
            map.set(key, {
              id: key,
              label: sub.toUpperCase(),
              count: 0,
            });
          }
        }
      });
    });

    // 3. Exact matching counts using robust matching utility
    const entries = Array.from(map.values());
    entries.forEach((cat) => {
      if (cat.id === 'all') {
        cat.count = productsList.length;
        return;
      }
      cat.count = productsList.filter((p) => matchProductCategory(p, cat.id)).length;
    });

    // Only return categories that actually have products (or currently active)
    return entries.filter(
      (cat) => cat.id === 'all' || cat.count > 0 || (activeCategoryTab && activeCategoryTab === cat.id)
    );
  }, [productsList, activeCategoryTab]);

  const badgeParam = searchParams ? searchParams.get('badge')?.toLowerCase() : null;
  const isNewDrops = badgeParam === 'new';

  const activeCategoryLabel = useMemo(() => {
    if (activeCategoryTab && activeCategoryTab !== 'all') {
      const match = dynamicObjectCategories.find(
        (c) =>
          c.id === activeCategoryTab ||
          matchProductCategory({ subCategory: c.label, fit: c.id }, activeCategoryTab)
      );
      return match ? match.label : activeCategoryTab.toUpperCase();
    }
    if (isNewDrops) return 'NEW DROPS';
    return '';
  }, [activeCategoryTab, dynamicObjectCategories, isNewDrops]);

  return (
    <section className="obj-all">
      <div className="obj-all__container">
        {/* Collection Header */}
        <header className="obj-all__header">
          <h1 className="obj-all__title">
            {activeCategoryLabel || 'OBJECT DROPS'}
          </h1>
          <span className="obj-all__count-badge">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </span>
        </header>

        {/* Filter and Control Bar */}
        <div className="obj-all__controls" ref={dropdownRef}>
          {/* Desktop Filter Dropdowns */}
          <div className="obj-all__desktop-filters">
            {/* Category Filter Dropdown */}
            <div className="obj-all__filter-dropdown">
              <button
                type="button"
                className={`obj-all__filter-trigger ${
                  activeCategoryTab && activeCategoryTab !== 'all'
                    ? 'obj-all__filter-trigger--active'
                    : ''
                }`}
                onClick={() => toggleDropdown('category')}
                aria-expanded={activeDropdown === 'category'}
              >
                <span>Category</span>
                {activeCategoryTab && activeCategoryTab !== 'all' && (
                  <span className="obj-all__filter-count">
                    ({activeCategoryLabel})
                  </span>
                )}
                <svg
                  className={`obj-all__chevron ${
                    activeDropdown === 'category' ? 'obj-all__chevron--open' : ''
                  }`}
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {activeDropdown === 'category' && (
                <div className="obj-all__popover">
                  <div className="obj-all__popover-header">
                    <span>Category</span>
                    {activeCategoryTab && activeCategoryTab !== 'all' && (
                      <button
                        type="button"
                        className="obj-all__popover-reset"
                        onClick={() => {
                          handleTabChange('all');
                          setActiveDropdown(null);
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="obj-all__popover-body">
                    {dynamicObjectCategories.map((cat) => {
                      const isCatActive =
                        cat.id === 'all'
                          ? !activeCategoryTab || activeCategoryTab === 'all'
                          : activeCategoryTab === cat.id;

                      return (
                        <label key={cat.id} className="obj-all__checkbox-label">
                          <input
                            type="radio"
                            name="desktop-obj-category"
                            checked={isCatActive}
                            onChange={() => {
                              handleTabChange(cat.id);
                              setActiveDropdown(null);
                            }}
                            className="obj-all__checkbox-input"
                          />
                          <span className="obj-all__checkbox-custom" />
                          <span>
                            {cat.label} ({cat.count})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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
                      <span>In stock ({inStockCount})</span>
                    </label>
                    <label className="obj-all__checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes('out-of-stock')}
                        onChange={() => handleAvailabilityToggle('out-of-stock')}
                        className="obj-all__checkbox-input"
                      />
                      <span className="obj-all__checkbox-custom" />
                      <span>Out of stock ({outOfStockCount})</span>
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
        {isLoading && productsList.length === 0 ? (
          <div
            className={`obj-all__grid obj-all__grid--${desktopColumns}col obj-all__grid--m${mobileColumns}col`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((n) => (
              <div key={n} className="obj-drop-card obj-drop-card--skeleton">
                <div className="obj-drop-card__gallery" style={{ aspectRatio: '3 / 4' }} />
                <div className="obj-drop-card__details" style={{ padding: '12px 2px' }}>
                  <div style={{ width: '70%', height: '14px', background: '#f3f3f3', borderRadius: '2px', marginBottom: '6px' }} />
                  <div style={{ width: '40%', height: '12px', background: '#f3f3f3', borderRadius: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : fetchError && productsList.length === 0 ? (
          <div className="obj-all__empty">
            <h2 className="obj-all__empty-title">Couldn&apos;t load objects</h2>
            <p className="obj-all__empty-text">
              We had trouble connecting to the server. Please check your connection and try again.
            </p>
            <button
              type="button"
              className="obj-all__empty-btn"
              onClick={() => {
                invalidateProductsCache(objectsApiUrl);
                setFetchError(null);
                setReloadKey((prev) => prev + 1);
              }}
            >
              Try again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
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
      {isMobileDrawerOpen && mounted && createPortal(
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
                    <span>In stock ({inStockCount})</span>
                  </label>
                  <label className="obj-all-drawer__checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes('out-of-stock')}
                      onChange={() => handleAvailabilityToggle('out-of-stock')}
                      className="obj-all-drawer__checkbox-input"
                    />
                    <span className="obj-all-drawer__checkbox-custom" />
                    <span>Out of stock ({outOfStockCount})</span>
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
                Clear all
              </button>
              <button
                type="button"
                className="obj-all-drawer__apply-btn"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                See {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

export function ObjectsAllDropsSkeleton() {
  return (
    <section className="obj-all">
      <div className="obj-all__container">
        <div className="obj-all__header">
          <div className="obj-all__header-title-row">
            <h1 className="obj-all__title">OBJECT DROPS</h1>
          </div>
        </div>
        <div className="obj-all__grid obj-all__grid--4col obj-all__grid--m2col">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((n) => (
            <div key={n} className="obj-drop-card obj-drop-card--skeleton">
              <div className="obj-drop-card__gallery" style={{ aspectRatio: '3 / 4' }} />
              <div className="obj-drop-card__details" style={{ padding: '12px 2px' }}>
                <div style={{ width: '70%', height: '14px', background: '#f3f3f3', borderRadius: '2px', marginBottom: '6px' }} />
                <div style={{ width: '40%', height: '12px', background: '#f3f3f3', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ObjectsAllDrops() {
  return (
    <Suspense fallback={<ObjectsAllDropsSkeleton />}>
      <ObjectsAllDropsContent />
    </Suspense>
  );
}
