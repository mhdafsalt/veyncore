'use client';

import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import MobileQuickBuyDrawer from '@/components/QuickBuy/MobileQuickBuyDrawer';
import { SORT_OPTIONS, COLLECTION_PRICE_RANGE } from '@/data/allDropsData';
import { API_BASE_URL } from '@/lib/constants';
import { matchProductCategory } from '@/lib/categoryFilterUtils';
import { optimizeImageUrl } from '@/lib/imageUtils';
import './AllDrops.css';

/**
 * Format price to ensure Rs. and amount stay joined by non-breaking space
 */
const formatPrice = (str) => (!str ? '' : str.replace(/Rs\.\s*/g, 'Rs.\u00A0'));

/**
 * Individual Product Card for ALL DROPS Collection
 */
function DropsProductCard({ product }) {
  const { addItem, openCart } = useCart();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [showSizes, setShowSizes] = useState(false);
  const [isMobileQuickBuyOpen, setIsMobileQuickBuyOpen] = useState(false);
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
              src={optimizeImageUrl(images[displayImageIndex], 500)}
              alt={product.title}
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
        <div className={`all-drops-card__quick-actions ${showSizes ? 'all-drops-card__quick-actions--open' : ''}`}>
          {showSizes ? (
            <div className="all-drops-card__sizes-overlay" onClick={(e) => e.stopPropagation()}>
              <div className="all-drops-card__sizes-header">
                <span className="all-drops-card__sizes-label">SELECT SIZE:</span>
                <button
                  type="button"
                  className="all-drops-card__sizes-close"
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
              <div className="all-drops-card__sizes-list">
                {(product.availableSizes || ['28', '30', '32', '34', '36']).map((sz) => (
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
          <span className="all-drops-card__sale-price">{formatPrice(product.salePrice)}</span>
          {product.comparePrice > product.price && (
            <span className="all-drops-card__compare-price">{formatPrice(product.regularPrice)}</span>
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
let cachedAllDropsProducts = null;
let cachedAllDropsSubcategories = null;

/**
 * Main ALL DROPS Collection View
 */
function AllDropsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [productsList, setProductsList] = useState(() => cachedAllDropsProducts || []);
  const [dynamicSubcategories, setDynamicSubcategories] = useState(() => cachedAllDropsSubcategories);

  // Category filter state synced with URL ?category=...
  const categoryParam = searchParams ? searchParams.get('category')?.toLowerCase().trim() || '' : '';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  useEffect(() => {
    const cat = searchParams ? searchParams.get('category')?.toLowerCase().trim() || '' : '';
    setSelectedCategory(cat);
  }, [searchParams]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [desktopColumns, setDesktopColumns] = useState('4'); // '4' or '2' for desktop
  const [mobileColumns, setMobileColumns] = useState('2'); // '2' or '1' for mobile
  const [displayCount, setDisplayCount] = useState(16);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const dropdownRef = useRef(null);
  const sentinelRef = useRef(null);

  // Fetch dynamic products from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products?category=VEYN-SELECTS&limit=100`);
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((p) => ({
            id: p._id || p.id,
            title: p.title,
            handle: p.handle,
            category: 'VEYN-SELECTS',
            subCategory: p.subCategory || 'BAGGY',
            fit: p.fit || 'baggy',
            swipeCategory: p.swipeCategory || '',
            price: p.price,
            comparePrice: p.comparePrice,
            salePrice: p.salePrice || `Rs. ${p.price.toLocaleString('en-IN')}.00`,
            regularPrice: p.regularPrice || (p.comparePrice ? `Rs. ${p.comparePrice.toLocaleString('en-IN')}.00` : ''),
            badge: p.badge || '',
            images: p.images && p.images.length > 0 ? p.images : ['/images/products/artic-blue-wide.jpg'],
            thumbnail: p.thumbnail || (p.images && p.images[0]) || '/images/products/artic-blue-wide.jpg',
            availableSizes: p.availableSizes && p.availableSizes.length > 0 ? p.availableSizes : ['28', '30', '32', '34', '36'],
            inStock: p.inStock !== false,
            newArrival: Boolean(p.newArrival),
            createdAt: p.createdAt || new Date().toISOString(),
          }));
          cachedAllDropsProducts = mapped;
          if (isMounted) {
            setProductsList(mapped);
          }
        }
      } catch (e) {
        // Silently fallback to static products
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch dynamic subcategories from backend API to discover any newly configured categories
  useEffect(() => {
    let isMounted = true;
    const fetchSubcategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content/subcategories`);
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data)) {
          cachedAllDropsSubcategories = json.data;
          if (isMounted) {
            setDynamicSubcategories(json.data);
          }
        }
      } catch (e) {
        // Silently fallback
      }
    };
    fetchSubcategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic Category Extraction from defaults, products & backend subcategories
  const dynamicCategories = useMemo(() => {
    const map = new Map();

    // 1. Seed with ALL
    map.set('all', {
      id: 'all',
      label: 'ALL DROPS',
      count: productsList.length,
    });

    // 2. Extract dynamically from products
    productsList.forEach((p) => {
      const candidates = [p.subCategory, p.fit, p.swipeCategory].filter(Boolean);
      candidates.forEach((cand) => {
        const key = cand.toLowerCase().trim();
        if (key && key !== 'all' && !map.has(key)) {
          map.set(key, {
            id: key,
            label: cand.toUpperCase(),
            count: 0,
          });
        }
      });
    });

    // 3. Extract dynamically from subcategories (if configured in Admin)
    if (dynamicSubcategories && Array.isArray(dynamicSubcategories)) {
      dynamicSubcategories
        .filter((s) => s.mainCategory === 'VEYN-SELECTS' && s.active !== false)
        .forEach((s) => {
          const key = (s.id || s.label || '').toLowerCase().trim();
          if (key && !['home', 'flash-sale', 'new-drops', 'all-drops'].includes(key) && !map.has(key)) {
            map.set(key, {
              id: key,
              label: s.label.toUpperCase(),
              count: 0,
            });
          }
        });
    }

    // 4. Calculate exact matching counts for each category using robust helper
    const entries = Array.from(map.values());
    entries.forEach((cat) => {
      if (cat.id === 'all') {
        cat.count = productsList.length;
        return;
      }
      cat.count = productsList.filter((p) => matchProductCategory(p, cat.id)).length;
    });

    // 5. Only include categories with products (or currently selected in URL), "all" first, then alphabetically
    return entries
      .filter((cat) => cat.id === 'all' || cat.count > 0 || (selectedCategory && selectedCategory === cat.id))
      .sort((a, b) => {
        if (a.id === 'all') return -1;
        if (b.id === 'all') return 1;
        return a.label.localeCompare(b.label);
      });
  }, [productsList, dynamicSubcategories, selectedCategory]);

  // Handle category change and reflect in URL query params
  const handleCategoryChange = (catId) => {
    const cleanId = (catId || '').toLowerCase().trim();
    if (!cleanId || cleanId === 'all') {
      setSelectedCategory('all');
      router.replace('/collections/all-drops', { scroll: false });
    } else {
      setSelectedCategory(cleanId);
      router.replace(`/collections/all-drops?category=${encodeURIComponent(cleanId)}`, { scroll: false });
    }
  };

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
    setSelectedCategory('all');
    setSelectedAvailability([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('date-desc');
    router.push('/collections/all-drops', { scroll: false });
  };

  const hasActiveFilters =
    (selectedCategory !== '' && selectedCategory !== 'all') ||
    selectedAvailability.length > 0 ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortBy !== 'date-desc';

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // Filter by Category using unified matching utility
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => matchProductCategory(p, selectedCategory));
    }

    // Filter by search query if specified (e.g. ?search=... or ?q=...)
    const searchParam = searchParams ? (searchParams.get('search') || searchParams.get('q'))?.toLowerCase().trim() : null;
    if (searchParam) {
      result = result.filter((p) => {
        const titleMatch = (p.title || '').toLowerCase().includes(searchParam);
        const subCatMatch = (p.subCategory || '').toLowerCase().includes(searchParam);
        const fitMatch = (p.fit || '').toLowerCase().includes(searchParam);
        const swipeMatch = (p.swipeCategory || '').toLowerCase().includes(searchParam);
        return titleMatch || subCatMatch || fitMatch || swipeMatch;
      });
    }

    // Filter by badge if specified (e.g. ?badge=new)
    const badgeParam = searchParams ? searchParams.get('badge')?.toLowerCase() : null;
    if (badgeParam === 'new') {
      result = result.filter((p) => p.badge === 'NEW' || p.newArrival);
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
      case 'date-asc':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'date-desc':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [productsList, selectedCategory, searchParams, selectedAvailability, minPrice, maxPrice, sortBy]);

  const visibleProducts = filteredProducts.slice(0, displayCount);
  const remainingCount = filteredProducts.length - visibleProducts.length;

  // Reset display count when any filter changes
  useEffect(() => {
    setDisplayCount(16);
  }, [selectedCategory, selectedAvailability, minPrice, maxPrice, sortBy]);

  const badgeParam = searchParams ? searchParams.get('badge')?.toLowerCase() : null;
  const isNewDrops = badgeParam === 'new';

  const activeCategoryLabel =
    selectedCategory && selectedCategory !== 'all'
      ? dynamicCategories.find((c) => c.id === selectedCategory)?.label ||
        selectedCategory.toUpperCase()
      : isNewDrops
      ? 'NEW DROPS'
      : null;

  // Automated Infinite Scroll / Lazy Loading via IntersectionObserver
  useEffect(() => {
    if (displayCount >= filteredProducts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry && firstEntry.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + 8, filteredProducts.length));
            setIsLoadingMore(false);
          }, 250);
        }
      },
      {
        root: null,
        rootMargin: '250px',
        threshold: 0.05
      }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [displayCount, filteredProducts.length, isLoadingMore]);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Date, new to old';

  return (
    <section className="all-drops">
      <div className="all-drops__container">
        {/* Collection Header */}
        <header className="all-drops__header">
          <div className="all-drops__header-title-row">
            <h1 className="all-drops__title">
              {activeCategoryLabel || 'ALL DROPS'}
            </h1>
            <span className="all-drops__count-badge">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </header>

        {/* Filter and Control Bar */}
        <div className="all-drops__controls" ref={dropdownRef}>
          {/* Desktop Filter Pills */}
          <div className="all-drops__desktop-filters">
            {/* Category Filter Dropdown */}
            <div className="all-drops__filter-dropdown">
              <button
                type="button"
                className={`all-drops__filter-trigger ${
                  selectedCategory && selectedCategory !== 'all'
                    ? 'all-drops__filter-trigger--active'
                    : ''
                }`}
                onClick={() => toggleDropdown('category')}
                aria-expanded={activeDropdown === 'category'}
              >
                <span>Category</span>
                {selectedCategory && selectedCategory !== 'all' && (
                  <span className="all-drops__filter-count">
                    ({activeCategoryLabel})
                  </span>
                )}
                <svg
                  className={`all-drops__chevron ${
                    activeDropdown === 'category' ? 'all-drops__chevron--open' : ''
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
                <div className="all-drops__popover all-drops__popover--category">
                  <div className="all-drops__popover-header">
                    <span>Category</span>
                    {selectedCategory && selectedCategory !== 'all' && (
                      <button
                        type="button"
                        className="all-drops__popover-reset"
                        onClick={() => {
                          handleCategoryChange('all');
                          setActiveDropdown(null);
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="all-drops__popover-body">
                    {dynamicCategories.map((cat) => {
                      const isCatActive =
                        cat.id === 'all'
                          ? !selectedCategory || selectedCategory === 'all'
                          : selectedCategory === cat.id;

                      return (
                        <label key={cat.id} className="all-drops__checkbox-label">
                          <input
                            type="radio"
                            name="desktop-category"
                            checked={isCatActive}
                            onChange={() => {
                              handleCategoryChange(cat.id);
                              setActiveDropdown(null);
                            }}
                            className="all-drops__checkbox-input"
                          />
                          <span className="all-drops__checkbox-custom" />
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
                      <span>In stock ({productsList.filter((p) => p.inStock).length})</span>
                    </label>
                    <label className="all-drops__checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes('out-of-stock')}
                        onChange={() => handleAvailabilityToggle('out-of-stock', true)}
                        className="all-drops__checkbox-input"
                      />
                      <span className="all-drops__checkbox-custom" />
                      <span>Out of stock ({productsList.filter((p) => !p.inStock).length})</span>
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

        {/* Automated Lazy Loading Sentinel (Infinite Scroll) */}
        {displayCount < filteredProducts.length && (
          <div ref={sentinelRef} className="all-drops__lazy-loader" aria-live="polite">
            <div className="all-drops__lazy-dots">
              <span className="all-drops__lazy-dot" />
              <span className="all-drops__lazy-dot" />
              <span className="all-drops__lazy-dot" />
            </div>
            <span className="all-drops__lazy-text">Loading more drops...</span>
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
              {/* Category Filter in Drawer */}
              <div className="all-drops-drawer__section">
                <h3 className="all-drops-drawer__section-title">Category</h3>
                <div className="all-drops-drawer__pill-group">
                  {dynamicCategories.map((cat) => {
                    const isCatActive =
                      cat.id === 'all'
                        ? !selectedCategory || selectedCategory === 'all'
                        : selectedCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`all-drops-drawer__pill ${
                          isCatActive ? 'all-drops-drawer__pill--active' : ''
                        }`}
                        onClick={() => {
                          handleCategoryChange(cat.id);
                          setIsMobileDrawerOpen(false);
                        }}
                      >
                        {cat.label} ({cat.count})
                      </button>
                    );
                  })}
                </div>
              </div>

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
                    <span>In stock ({productsList.filter((p) => p.inStock).length})</span>
                  </label>
                  <label className="all-drops__checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes('out-of-stock')}
                      onChange={() => handleAvailabilityToggle('out-of-stock')}
                      className="all-drops__checkbox-input"
                    />
                    <span className="all-drops__checkbox-custom" />
                    <span>Out of stock ({productsList.filter((p) => !p.inStock).length})</span>
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

export default function AllDrops() {
  return (
    <Suspense fallback={<div className="all-drops" style={{ minHeight: '60vh' }} />}>
      <AllDropsContent />
    </Suspense>
  );
}
