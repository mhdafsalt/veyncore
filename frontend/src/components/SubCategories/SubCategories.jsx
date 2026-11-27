'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants';
import { matchProductCategory, toCategorySlug } from '@/lib/categoryFilterUtils';
import { fetchProductsWithRetry } from '@/lib/productsApi';
import './SubCategories.css';

const BASE_SELECTS_NAV = [
  { id: 'home', label: 'HOME', href: '/' },
  { id: 'all-drops', label: 'ALL DROPS', href: '/collections/all-drops' },
  { id: 'launch-sale', label: 'LAUNCH SALE ⚡️', href: '/collections/launch-sale', mainCategory: 'VEYN-SELECTS', active: true, isGlow: true },
];

const BASE_OBJECTS_NAV = [
  { id: 'home', label: 'HOME', href: '/veyn-objects' },
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

// Default baseline subcategories to reserve space and eliminate Frame-0 layout shift
const DEFAULT_DYNAMIC_SUBCATEGORIES = [
  { id: 'launch-sale', label: 'LAUNCH SALE ⚡️', href: '/collections/launch-sale', mainCategory: 'VEYN-SELECTS', active: true, isGlow: true },
  { id: 'denims', label: 'DENIMS', href: '/collections/all-drops?category=denims', mainCategory: 'VEYN-SELECTS', active: true },
  { id: 'cargo', label: 'CARGO', href: '/collections/all-drops?category=cargo', mainCategory: 'VEYN-SELECTS', active: true },
  { id: 'baggy', label: 'BAGGY', href: '/collections/all-drops?category=baggy', mainCategory: 'VEYN-SELECTS', active: true },
  { id: 'bootcut', label: 'BOOTCUT', href: '/collections/all-drops?category=bootcut', mainCategory: 'VEYN-SELECTS', active: true },
  { id: 'wide', label: 'WIDE', href: '/collections/all-drops?category=wide', mainCategory: 'VEYN-SELECTS', active: true },
  { id: 'straight', label: 'STRAIGHT', href: '/collections/all-drops?category=straight', mainCategory: 'VEYN-SELECTS', active: true },
  { id: 'tops', label: 'TOPS', href: '/collections/all-drops?category=tops', mainCategory: 'VEYN-SELECTS', active: true },
  { id: 'accessories', label: 'ACCESSORIES', href: '/collections/all-drops?category=accessories', mainCategory: 'VEYN-SELECTS', active: true },
  { id: 'bags', label: 'BAGS', href: '/collections/objects-drops?category=bags', mainCategory: 'VEYN-OBJECTS', active: true },
  { id: 'chains', label: 'CHAINS & HARDWARE', href: '/collections/objects-drops?category=chains', mainCategory: 'VEYN-OBJECTS', active: true },
  { id: 'caps', label: 'CAPS & HEADWEAR', href: '/collections/objects-drops?category=caps', mainCategory: 'VEYN-OBJECTS', active: true },
];

// In-memory module cache for instant Frame-0 painting
let cachedDynamicSubcategories = DEFAULT_DYNAMIC_SUBCATEGORIES;
let cachedSubcategoriesCatalog = null;

function SubCategoriesInner({ activeMainCategory = 'VEYN-SELECTS' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dynamicSubcategories, setDynamicSubcategories] = useState(() => cachedDynamicSubcategories);
  const [productCatalog, setProductCatalog] = useState(() => cachedSubcategoriesCatalog || []);

  const containerRef = useRef(null);
  const activeTabRef = useRef(null);
  const prevMainCategoryRef = useRef(activeMainCategory);

  // Prefetch collection drop destinations after initial paint is complete
  useEffect(() => {
    if (router && typeof router.prefetch === 'function') {
      const timer = setTimeout(() => {
        router.prefetch('/collections/all-drops');
        router.prefetch('/collections/objects-drops');
        router.prefetch('/');
        router.prefetch('/veyn-objects');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [router]);

  // Fetch dynamic subcategories from backend (deferred to prioritize initial paint)
  useEffect(() => {
    let isMounted = true;
    const fetchSubcategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content/subcategories?t=${Date.now()}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          cachedDynamicSubcategories = data.data;
          if (isMounted) {
            setDynamicSubcategories(data.data);
          }
        }
      } catch (err) {
        // Silently continue
      }
    };

    const timer = setTimeout(fetchSubcategories, 500);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Fetch real product catalog to extract dynamic categories (deduplicated via productsApi)
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchCatalog = async () => {
      try {
        const url = `${API_BASE_URL}/api/products?category=${activeMainCategory}&limit=100`;
        const data = await fetchProductsWithRetry(url, {
          signal: abortController.signal,
          fallbackUrl: `https://veyncorein.vercel.app/api/products?category=${activeMainCategory}&limit=100`,
        });
        if (isMounted && Array.isArray(data) && data.length > 0) {
          cachedSubcategoriesCatalog = data;
          setProductCatalog(data);
        }
      } catch (err) {
        // Silently continue
      }
    };

    const timer = setTimeout(fetchCatalog, 100);
    return () => {
      isMounted = false;
      clearTimeout(timer);
      abortController.abort();
    };
  }, [activeMainCategory]);

  const subcategories = useMemo(() => {
    const isObjects = activeMainCategory === 'VEYN-OBJECTS';
    const baseNav = isObjects ? BASE_OBJECTS_NAV : BASE_SELECTS_NAV;

    const result = [];
    const seenLabels = new Set();
    const seenIds = new Set();
    const seenSlugs = new Set();

    const addUnique = (item) => {
      if (!item) return;
      const labelNorm = norm(item.label);
      const idNorm = (item.id || toSlug(item.label)).toLowerCase().trim();
      const slugNorm = toCategorySlug(item.label || item.id);

      // Filter out any legacy or unwanted ALL OBJECTS
      if (labelNorm === 'ALL OBJECTS' || idNorm === 'obj-all') {
        return;
      }

      // Skip if already in list by normalized label, ID, or unified category slug
      if (
        seenLabels.has(labelNorm) ||
        seenIds.has(idNorm) ||
        (slugNorm && seenSlugs.has(slugNorm))
      ) {
        return;
      }

      seenLabels.add(labelNorm);
      seenIds.add(idNorm);
      if (slugNorm) seenSlugs.add(slugNorm);
      result.push(item);
    };

    // 1. Add base navigation links (HOME and ALL DROPS) first so tab ordering is perfectly stable
    baseNav.forEach((base) => {
      addUnique(base);
    });

    // 2. Dynamic subcategories configured in backend / admin
    const adminItems = (dynamicSubcategories || []).filter(
      (sub) => sub.mainCategory === activeMainCategory && sub.active !== false
    );

    if (adminItems && adminItems.length > 0) {
      adminItems.forEach((item) => addUnique(item));
    }

    // 3. Dynamically append any categories from real products if not already present
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
            const slugNorm = toCategorySlug(catName);
            if (!seenLabels.has(labelNorm) && !seenIds.has(key) && !seenSlugs.has(slugNorm)) {
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
    // 1. Dedicated Launch Sale route (/collections/launch-sale or /launch-sale)
    if (pathname && (pathname.includes('/launch-sale') || pathname === '/collections/launch-sale')) {
      const saleTab = subcategories.find(
        (s) => s.id === 'launch-sale' || s.href?.includes('launch-sale') || norm(s.label).includes('LAUNCH SALE')
      );
      if (saleTab) return saleTab.id;
    }

    // 2. Direct exact pathname match for any subcategory href
    if (pathname && pathname !== '/' && pathname !== '/veyn-objects') {
      const exactMatch = subcategories.find((s) => {
        if (!s.href) return false;
        const cleanHref = s.href.split('?')[0].replace(/#.*$/, '');
        return cleanHref === pathname;
      });
      if (exactMatch && !categoryParam && !badgeParam) {
        return exactMatch.id;
      }
    }

    // 3. If on collection drops page, inspect category or badge query param
    const isDropsPage = pathname && (pathname.startsWith('/collections/all') || pathname.startsWith('/collections/objects'));
    if (isDropsPage) {
      if (categoryParam) {
        const match = subcategories.find(
          (s) =>
            (s.id && s.id.toLowerCase() === categoryParam) ||
            (s.id && s.id.toLowerCase().replace(/^obj-/, '') === categoryParam) ||
            (s.label && s.label.toLowerCase().trim() === categoryParam) ||
            (s.href && s.href.toLowerCase().includes(`category=${categoryParam}`)) ||
            matchProductCategory({ subCategory: s.label, fit: s.id }, categoryParam)
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

    // 4. If URL has a specific hash (e.g. #launch-sale, #flash-sale, #object-drops, #fit-baggy)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash) {
        const match = subcategories.find(
          (s) =>
            (s.id && s.id.toLowerCase() === hash) ||
            (s.id && `fit-${s.id.toLowerCase()}` === hash) ||
            (s.href && s.href.toLowerCase() === `#${hash}`)
        );
        if (match) return match.id;
      }
    }

    return 'home';
  }, [pathname, categoryParam, badgeParam, subcategories, activeMainCategory]);

  const [activeSubId, setActiveSubId] = useState(getInitialSubId);

  // Keep active tab synced on route/param/hash navigation or real main category switch
  useEffect(() => {
    const isObjectsMain = activeMainCategory === 'VEYN-OBJECTS';

    // 1. Dedicated Launch Sale route (/collections/launch-sale or /launch-sale)
    if (pathname && (pathname.includes('/launch-sale') || pathname === '/collections/launch-sale')) {
      const saleTab = subcategories.find(
        (s) => s.id === 'launch-sale' || s.href?.includes('launch-sale') || norm(s.label).includes('LAUNCH SALE')
      );
      if (saleTab) {
        setActiveSubId(saleTab.id);
        return;
      }
    }

    // 2. Direct exact pathname match for any subcategory href
    if (pathname && pathname !== '/' && pathname !== '/veyn-objects') {
      const exactMatch = subcategories.find((s) => {
        if (!s.href) return false;
        const cleanHref = s.href.split('?')[0].replace(/#.*$/, '');
        return cleanHref === pathname;
      });
      if (exactMatch && !categoryParam && !badgeParam) {
        setActiveSubId(exactMatch.id);
        return;
      }
    }

    const isDropsPage = pathname && (pathname.startsWith('/collections/all') || pathname.startsWith('/collections/objects'));

    // 3. If on drops page with a category query parameter, highlight matching category
    if (isDropsPage) {
      if (categoryParam) {
        const match = subcategories.find(
          (s) =>
            (s.id && s.id.toLowerCase() === categoryParam) ||
            (s.id && s.id.toLowerCase().replace(/^obj-/, '') === categoryParam) ||
            (s.label && s.label.toLowerCase().trim() === categoryParam) ||
            (s.href && s.href.toLowerCase().includes(`category=${categoryParam}`)) ||
            matchProductCategory({ subCategory: s.label, fit: s.id }, categoryParam)
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

    // 4. If on storefront with a specific hash
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash) {
        const match = subcategories.find(
          (s) =>
            (s.id && s.id.toLowerCase() === hash) ||
            (s.id && `fit-${s.id.toLowerCase()}` === hash) ||
            (s.href && s.href.toLowerCase() === `#${hash}`)
        );
        if (match) {
          setActiveSubId(match.id);
          return;
        }
      }
    }

    // 5. Category switch between SELECTS and OBJECTS
    if (prevMainCategoryRef.current !== activeMainCategory) {
      prevMainCategoryRef.current = activeMainCategory;
      setActiveSubId('home');
      return;
    }

    // 6. Default home if on storefront and hash is empty
    if (pathname === '/' || pathname === '/veyn-objects') {
      if (typeof window !== 'undefined' && !window.location.hash) {
        setActiveSubId('home');
      }
    }
  }, [pathname, categoryParam, badgeParam, activeMainCategory, subcategories]);

  // Function to smoothly center the active tab inside the scrollable container
  const centerActiveTab = useCallback((tabEl) => {
    if (!tabEl || !containerRef.current) return;
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;
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
      });
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

    // 1. HOME tab -> Navigate home or scroll to top if already there
    if (subId === 'home' || subHref === '#home' || subHref === '/' || subLabel === 'HOME') {
      const homeUrl = activeMainCategory === 'VEYN-OBJECTS' ? '/veyn-objects' : '/';
      if (pathname === homeUrl) {
        if (typeof window !== 'undefined' && window.location.hash) {
          window.history.replaceState(null, '', homeUrl);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push(homeUrl);
      }
      return;
    }

    // 1b. LAUNCH SALE tab -> Dedicated separate page like ALL DROPS
    if (subId === 'launch-sale' || subLabel.includes('LAUNCH SALE')) {
      if (pathname === '/collections/launch-sale') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/collections/launch-sale');
      }
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

    // 3. OBJECT DROPS tab -> Scroll on veyn-objects or navigate to /veyn-objects#object-drops
    if (subId === 'obj-drops' || subLabel === 'OBJECT DROPS') {
      if (pathname === '/veyn-objects') {
        const element = document.getElementById('object-drops') || document.querySelector('.obj-drops') || document.querySelector('.obj-hero');
        if (element) {
          const yOffset = -90;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
          return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      router.push('/veyn-objects#object-drops');
      return;
    }

    // 4. ALL DROPS -> Navigate to All Drops without category filter
    if (
      subId === 'all-drops' ||
      subId === 'all-drops-obj' ||
      subLabel === 'ALL DROPS'
    ) {
      const dropsUrl = activeMainCategory === 'VEYN-OBJECTS' ? '/collections/objects-drops' : '/collections/all-drops';
      if (pathname === dropsUrl) {
        router.replace(dropsUrl, { scroll: false });
      } else {
        router.push(dropsUrl);
      }
      return;
    }

    // 5. NEW DROPS tab -> Navigate to All Drops with new drops filter
    if (subId === 'new-drops' || subLabel === 'NEW DROPS') {
      const dropsUrl = activeMainCategory === 'VEYN-OBJECTS' ? '/collections/objects-drops' : '/collections/all-drops';
      const targetUrl = `${dropsUrl}?badge=new`;
      if (pathname === dropsUrl) {
        router.replace(targetUrl, { scroll: false });
      } else {
        router.push(targetUrl);
      }
      return;
    }

    // 6. Configured direct route with query parameter (e.g. /collections/all-drops?category=xyz)
    if (subHref && (subHref.startsWith('/collections/') || subHref.startsWith('/products/'))) {
      if (pathname && subHref.startsWith(pathname)) {
        router.replace(subHref, { scroll: false });
      } else {
        router.push(subHref);
      }
      return;
    }

    // 7. General category filter (BAGGY, BOOTCUT, WIDE, STRAIGHT, CARGO, DENIMS, TOPS, BAGS, CHAINS, etc.)
    const categoryKey = subId.replace(/^obj-/, '') || subLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const isStorefront = pathname === '/' || pathname === '/veyn-objects';
    if (isStorefront) {
      const targetEl = document.getElementById(categoryKey) || document.getElementById(`fit-${categoryKey}`);
      if (targetEl) {
        const yOffset = -90;
        const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        return;
      }
    }
    const targetDropsPage = activeMainCategory === 'VEYN-OBJECTS' ? '/collections/objects-drops' : '/collections/all-drops';
    const targetUrl = `${targetDropsPage}?category=${encodeURIComponent(categoryKey)}`;
    if (pathname === targetDropsPage) {
      router.replace(targetUrl, { scroll: false });
    } else {
      router.push(targetUrl);
    }
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
