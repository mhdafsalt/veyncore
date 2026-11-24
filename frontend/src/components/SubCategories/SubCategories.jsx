'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants';
import './SubCategories.css';

const DEFAULT_SELECTS_SUBCATEGORIES = [
  { id: 'home', label: 'HOME', href: '#home' },
  { id: 'flash-sale', label: 'FLASH SALE', href: '#flash-sale', isGlow: true },
  { id: 'new-drops', label: 'NEW DROPS', href: '/collections/all-drops', isGlow: true },
  { id: 'all-drops', label: 'ALL DROPS', href: '/collections/all-drops' },
];

const DEFAULT_OBJECTS_SUBCATEGORIES = [
  { id: 'obj-drops', label: 'OBJECT DROPS', href: '#object-drops', isGlow: true },
  { id: 'all-drops', label: 'ALL DROPS', href: '/collections/objects-drops' },
];

const LEGACY_STATIC_CATEGORIES = new Set([
  'denims', 'cargo', 'baggy', 'bootcut', 'wide', 'straight', 'tops', 'accessories',
  'bags', 'chains', 'headwear', 'hardware'
]);

// Normalization helper for labels (accessible everywhere)
const norm = (str = '') =>
  String(str)
    .toUpperCase()
    .replace(/⚡|⚡️/g, '')
    .trim();

// Normalization helper for slugs / IDs (accessible everywhere)
const toSlug = (str = '') =>
  norm(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

function SubCategoriesInner({ activeMainCategory = 'VEYN-SELECTS' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dynamicSubcategories, setDynamicSubcategories] = useState(null);

  const containerRef = useRef(null);
  const activeTabRef = useRef(null);
  const prevMainCategoryRef = useRef(activeMainCategory);

  // Fetch dynamic subcategories from backend
  useEffect(() => {
    let isMounted = true;
    const fetchSubcategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content/subcategories`);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
          if (isMounted) {
            setDynamicSubcategories(data.data);
          }
        }
      } catch (err) {
        // Fallback to static defaults
      }
    };

    fetchSubcategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch real product catalog to extract dynamic categories
  const [productCatalog, setProductCatalog] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products?limit=100`);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
          if (isMounted) {
            setProductCatalog(data.data);
          }
        }
      } catch (err) {
        // Silently continue
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const subcategories = useMemo(() => {
    const isObjects = activeMainCategory === 'VEYN-OBJECTS';
    const baseDefaults = isObjects
      ? DEFAULT_OBJECTS_SUBCATEGORIES
      : DEFAULT_SELECTS_SUBCATEGORIES;

    const result = [];
    const seenLabels = new Set();
    const seenIds = new Set();

    const addUnique = (item) => {
      if (!item) return;
      const labelNorm = norm(item.label);
      const idNorm = (item.id || toSlug(item.label)).toLowerCase().trim();

      // Filter out any legacy or unwanted ALL OBJECTS
      if (labelNorm === 'ALL OBJECTS' || idNorm === 'obj-all') {
        return;
      }

      // Skip if already in list by normalized label or ID
      if (seenLabels.has(labelNorm) || seenIds.has(idNorm)) {
        return;
      }

      seenLabels.add(labelNorm);
      seenIds.add(idNorm);
      result.push(item);
    };

    // 1. Dynamic subcategories configured in backend / admin
    const adminItems = (dynamicSubcategories || []).filter(
      (sub) => sub.mainCategory === activeMainCategory && sub.active !== false
    );

    // If HOME is not in adminItems for VEYN-SELECTS, ensure HOME is added first
    if (!isObjects) {
      const hasHome = adminItems.some((s) => norm(s.label) === 'HOME' || s.id === 'home');
      if (!hasHome && adminItems.length === 0) {
        addUnique(baseDefaults[0]); // HOME
      }
    }

    // 2. Add admin-managed items (they take priority and define custom routes/labels)
    if (adminItems.length > 0) {
      adminItems.forEach((item) => addUnique(item));
    } else {
      // 3. Fallback to base navigation tabs only if no admin items exist
      baseDefaults.forEach((base) => {
        addUnique(base);
      });
    }

    // 4. Dynamically append any categories from real products if not already present
    const dropsPage = isObjects ? '/collections/objects-drops' : '/collections/all-drops';
    const counts = {};

    productCatalog.forEach((p) => {
      const pCat = p.category || 'VEYN-SELECTS';
      if (pCat === activeMainCategory) {
        const candidates = [p.subCategory, p.fit, p.swipeCategory].filter(Boolean);
        candidates.forEach((cand) => {
          const catName = String(cand).trim();
          if (catName) {
            const key = toSlug(catName);
            const labelNorm = norm(catName);
            if (!seenLabels.has(labelNorm) && !seenIds.has(key)) {
              counts[key] = counts[key] || { count: 0, label: labelNorm };
              counts[key].count += 1;
            }
          }
        });
      }
    });

    Object.keys(counts)
      .sort((a, b) => counts[b].count - counts[a].count)
      .forEach((key) => {
        addUnique({
          id: key,
          label: counts[key].label,
          href: `${dropsPage}?category=${encodeURIComponent(key)}`,
          mainCategory: activeMainCategory,
        });
      });

    return result;
  }, [dynamicSubcategories, activeMainCategory, productCatalog]);

  const categoryParam = searchParams ? searchParams.get('category')?.toLowerCase().trim() : '';
  const badgeParam = searchParams ? searchParams.get('badge')?.toLowerCase().trim() : '';

  // Resolve initial active tab based on path, query params, hash, or saved state
  const getInitialSubId = useCallback(() => {
    // 1. If on collection drops page, inspect category or badge query param
    const isDropsPage = pathname && (pathname.startsWith('/collections/all') || pathname.startsWith('/collections/objects'));
    if (isDropsPage) {
      if (categoryParam) {
        const match = subcategories.find(
          (s) =>
            (s.id && s.id.toLowerCase() === categoryParam) ||
            (s.id && s.id.toLowerCase().replace(/^obj-/, '') === categoryParam) ||
            (s.label && s.label.toLowerCase().trim() === categoryParam) ||
            (s.href && s.href.toLowerCase().includes(`category=${categoryParam}`))
        );
        if (match) return match.id;
      } else if (badgeParam === 'new') {
        const newMatch = subcategories.find((s) => s.id === 'new-drops');
        if (newMatch) return newMatch.id;
      } else {
        const allMatch = subcategories.find(
          (s) =>
            s.id === 'all-drops' ||
            norm(s.label) === 'ALL DROPS' ||
            (s.href && (s.href.includes('/collections/objects-drops') || s.href.includes('/collections/all-drops')))
        );
        if (allMatch) return allMatch.id;
      }
    }

    // 2. If URL has a specific hash (e.g. #flash-sale, #object-drops)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const match = subcategories.find((s) => s.id === hash || s.href === `#${hash}`);
        if (match) return match.id;
      }
    }

    const isObjectsMain = activeMainCategory === 'VEYN-OBJECTS';
    return isObjectsMain
      ? (subcategories[0]?.id || 'obj-drops')
      : 'home';
  }, [pathname, categoryParam, badgeParam, subcategories, activeMainCategory]);

  const [activeSubId, setActiveSubId] = useState(getInitialSubId);

  // Keep active tab synced on route/param/hash navigation or real main category switch
  useEffect(() => {
    const isObjectsMain = activeMainCategory === 'VEYN-OBJECTS';
    const isDropsPage = pathname && (pathname.startsWith('/collections/all') || pathname.startsWith('/collections/objects'));

    // 1. If on drops page with a category query parameter, highlight matching category
    if (isDropsPage) {
      if (categoryParam) {
        const match = subcategories.find(
          (s) =>
            (s.id && s.id.toLowerCase() === categoryParam) ||
            (s.id && s.id.toLowerCase().replace(/^obj-/, '') === categoryParam) ||
            (s.label && s.label.toLowerCase().trim() === categoryParam) ||
            (s.href && s.href.toLowerCase().includes(`category=${categoryParam}`))
        );
        if (match) {
          setActiveSubId(match.id);
          return;
        }
      } else if (badgeParam === 'new') {
        const newMatch = subcategories.find((s) => s.id === 'new-drops');
        if (newMatch) {
          setActiveSubId(newMatch.id);
          return;
        }
      } else {
        const allMatch = subcategories.find(
          (s) =>
            s.id === 'all-drops' ||
            norm(s.label) === 'ALL DROPS' ||
            (s.href && (s.href.includes('/collections/objects-drops') || s.href.includes('/collections/all-drops')))
        );
        if (allMatch) {
          setActiveSubId(allMatch.id);
          return;
        }
      }
    }

    // 2. If on storefront with a specific hash
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const match = subcategories.find((s) => s.id === hash || s.href === `#${hash}`);
        if (match) {
          setActiveSubId(match.id);
          return;
        }
      }
    }

    // 3. Category switch between SELECTS and OBJECTS
    if (prevMainCategoryRef.current !== activeMainCategory) {
      prevMainCategoryRef.current = activeMainCategory;
      const defaultId = isObjectsMain ? (subcategories[0]?.id || 'obj-drops') : 'home';
      setActiveSubId(defaultId);
      return;
    }

    // 4. Default home
    if (pathname === '/' || pathname === '/veyn-objects') {
      const defaultId = isObjectsMain ? (subcategories[0]?.id || 'obj-drops') : 'home';
      setActiveSubId(defaultId);
    }
  }, [pathname, categoryParam, badgeParam, activeMainCategory, subcategories]);

  // Function to smoothly center the active tab inside the scrollable container
  const centerActiveTab = useCallback((tabEl) => {
    if (!tabEl || !containerRef.current) return;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const tabRect = tabEl.getBoundingClientRect();

    const relativeLeft = tabRect.left - containerRect.left + container.scrollLeft;
    const targetScroll = relativeLeft - container.clientWidth / 2 + tabRect.width / 2;
    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
    const clampedScroll = Math.max(0, Math.min(targetScroll, maxScroll));

    if (typeof container.scrollTo === 'function') {
      container.scrollTo({
        left: clampedScroll,
        behavior: 'smooth'
      });
    } else {
      container.scrollLeft = clampedScroll;
    }
  }, []);

  // Center active tab whenever activeSubId changes or subcategories load
  useEffect(() => {
    if (activeTabRef.current) {
      centerActiveTab(activeTabRef.current);
    }
  }, [activeSubId, subcategories, centerActiveTab]);

  // Unified Dynamic Click Handler for any category tab
  const handleSubClick = (sub, e) => {
    setActiveSubId(sub.id);
    if (e && e.currentTarget) {
      centerActiveTab(e.currentTarget);
    }

    const subId = (sub.id || '').toLowerCase().trim();
    const subLabel = (sub.label || '').toUpperCase().trim();
    const subHref = (sub.href || '').trim();

    // 1. HOME tab -> Navigate home
    if (subId === 'home' || subHref === '#home' || subLabel === 'HOME') {
      const homeUrl = activeMainCategory === 'VEYN-OBJECTS' ? '/veyn-objects' : '/';
      router.push(homeUrl);
      return;
    }

    // 2. FLASH SALE tab -> Scroll on storefront or navigate to /#flash-sale
    if (subId === 'flash-sale' || subLabel.includes('FLASH SALE')) {
      const isStorefront = pathname === '/' || pathname === '/veyn-objects';
      if (!isStorefront) {
        const targetHome = activeMainCategory === 'VEYN-OBJECTS' ? '/veyn-objects' : '/';
        router.push(`${targetHome}#flash-sale`);
        return;
      }
      const element = document.getElementById('flash-sale') || document.getElementById('new-arrivals');
      if (element) {
        const yOffset = -90;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
      return;
    }

    // 3. ALL DROPS -> Navigate to All Drops without category filter
    if (
      subId === 'all-drops' ||
      subId === 'all-drops-obj' ||
      subLabel === 'ALL DROPS'
    ) {
      const dropsUrl = activeMainCategory === 'VEYN-OBJECTS' ? '/collections/objects-drops' : '/collections/all-drops';
      router.push(dropsUrl);
      return;
    }

    // 4. NEW DROPS tab -> Navigate to All Drops with new drops filter
    if (subId === 'new-drops' || subLabel === 'NEW DROPS') {
      const dropsUrl = activeMainCategory === 'VEYN-OBJECTS' ? '/collections/objects-drops' : '/collections/all-drops';
      router.push(`${dropsUrl}?badge=new`);
      return;
    }

    // 5. Configured direct route with query parameter (e.g. /collections/all-drops?category=xyz)
    if (subHref && (subHref.startsWith('/collections/') || subHref.startsWith('/products/') || subHref.startsWith('/'))) {
      router.push(subHref);
      return;
    }

    // 6. ANY CATEGORY (BAGGY, BOOTCUT, WIDE, STRAIGHT, CARGO, DENIMS, TOPS, ACCESSORIES, or any newly added category)
    // Dynamically identify category key from sub.id or sub.label
    const categoryKey = subId.replace(/^obj-/, '') || subLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const targetDropsPage = activeMainCategory === 'VEYN-OBJECTS' ? '/collections/objects-drops' : '/collections/all-drops';
    router.push(`${targetDropsPage}?category=${encodeURIComponent(categoryKey)}`);
  };

  return (
    <div className="subcategories" aria-label="Subcategory navigation">
      <div className="subcategories__wrap">
        <div
          ref={containerRef}
          className="subcategories__list"
          role="tablist"
        >
          {subcategories.map((sub) => {
            const isActive = activeSubId === sub.id;
            const isGlow = Boolean(sub.isGlow);
            const cleanLabel = isGlow
              ? (sub.label || '').replace(/⚡|⚡️/g, '').trim()
              : sub.label;

            return (
              <div
                key={sub.id}
                className={`subcategories__item ${
                  isActive ? 'subcategories__item--active' : ''
                } ${isGlow ? 'subcategories__item--glow' : ''}`}
              >
                <button
                  type="button"
                  ref={isActive ? activeTabRef : null}
                  className={`subcategories__link ${
                    isActive ? 'subcategories__link--active' : ''
                  } ${isGlow ? 'subcategories__link--glow' : ''}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={(e) => handleSubClick(sub, e)}
                >
                  <span className="subcategories__label">
                    {cleanLabel}
                    {isGlow && (
                      <span className="subcategories__glow-icon" aria-hidden="true">
                        ⚡
                      </span>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SubCategories(props) {
  return (
    <Suspense fallback={<div className="subcategories" style={{ minHeight: '44px' }} />}>
      <SubCategoriesInner {...props} />
    </Suspense>
  );
}
