'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants';
import './SubCategories.css';

const DEFAULT_SELECTS_SUBCATEGORIES = [
  { id: 'home', label: 'HOME', href: '#home' },
  { id: 'flash-sale', label: 'FLASH SALE⚡️', href: '#flash-sale', isGlow: true },
  { id: 'new-drops', label: 'NEW DROPS', href: '/collections/all-drops', isGlow: true },
  { id: 'all-drops', label: 'ALL DROPS', href: '/collections/all-drops' },
  { id: 'denims', label: 'DENIMS', href: '#denims' },
  { id: 'cargo', label: 'CARGO', href: '#cargo' },
  { id: 'baggy', label: 'BAGGY', href: '#baggy' },
  { id: 'bootcut', label: 'BOOTCUT', href: '#bootcut' },
  { id: 'wide', label: 'WIDE', href: '#wide' },
  { id: 'straight', label: 'STRAIGHT', href: '#straight' },
  { id: 'tops', label: 'TOPS', href: '#tops' },
  { id: 'accessories', label: 'ACCESSORIES', href: '#accessories' }
];

const DEFAULT_OBJECTS_SUBCATEGORIES = [
  { id: 'obj-all', label: 'ALL OBJECTS', href: '/collections/objects-drops' },
  { id: 'obj-drops', label: 'OBJECT DROPS ⚡️', href: '#object-drops', isGlow: true },
  { id: 'bags', label: 'BAGS', href: '#bags' },
  { id: 'chains', label: 'CHAINS', href: '#chains' },
  { id: 'headwear', label: 'CAPS & HEADWEAR', href: '#headwear' },
  { id: 'hardware', label: 'HARDWARE', href: '#hardware' },
  { id: 'all-drops', label: 'ALL DROPS', href: '/collections/objects-drops' }
];

export default function SubCategories({ activeMainCategory = 'VEYN-SELECTS' }) {
  const router = useRouter();
  const pathname = usePathname();
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

  const subcategories = useMemo(() => {
    if (dynamicSubcategories && dynamicSubcategories.length > 0) {
      const filtered = dynamicSubcategories.filter(
        (sub) =>
          sub.mainCategory === activeMainCategory && sub.active !== false
      );
      if (filtered.length > 0) return filtered;
    }

    return activeMainCategory === 'VEYN-OBJECTS'
      ? DEFAULT_OBJECTS_SUBCATEGORIES
      : DEFAULT_SELECTS_SUBCATEGORIES;
  }, [dynamicSubcategories, activeMainCategory]);

  // Resolve initial active tab based on path, hash, or saved state
  const getInitialSubId = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const match = subcategories.find((s) => s.id === hash || s.href === `#${hash}`);
        if (match) return match.id;
      }
      const saved = sessionStorage.getItem(`veyn_active_sub_${activeMainCategory}`);
      if (saved && subcategories.some((s) => s.id === saved)) {
        return saved;
      }
    }

    if (pathname && pathname.startsWith('/collections/')) {
      const match = subcategories.find((s) => s.href && s.href === pathname);
      if (match) return match.id;
    }

    return activeMainCategory === 'VEYN-OBJECTS' ? 'obj-all' : 'home';
  };

  const [activeSubId, setActiveSubId] = useState(getInitialSubId);

  // Keep active tab synced on route/hash navigation or real main category switch
  useEffect(() => {
    // 1. If URL has a specific hash, sync active tab to that hash
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

    // 2. If pathname is a collection route, sync to matching subcategory
    if (pathname && pathname.startsWith('/collections/')) {
      const match = subcategories.find((s) => s.href && s.href === pathname);
      if (match) {
        setActiveSubId(match.id);
        return;
      }
    }

    // 3. Only reset if activeMainCategory genuinely switched between SELECTS and OBJECTS
    if (prevMainCategoryRef.current !== activeMainCategory) {
      prevMainCategoryRef.current = activeMainCategory;
      const savedForCat = typeof window !== 'undefined' ? sessionStorage.getItem(`veyn_active_sub_${activeMainCategory}`) : null;
      const defaultId = (savedForCat && subcategories.some((s) => s.id === savedForCat))
        ? savedForCat
        : (activeMainCategory === 'VEYN-OBJECTS' ? 'obj-all' : 'home');
      setActiveSubId(defaultId);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`veyn_active_sub_${activeMainCategory}`, defaultId);
      }
      return;
    }

    // 4. If on storefront and user previously selected a tab, maintain that selection
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`veyn_active_sub_${activeMainCategory}`);
      if (saved && subcategories.some((s) => s.id === saved)) {
        setActiveSubId(saved);
      }
    }
  }, [pathname, activeMainCategory, subcategories]);

  // Function to smoothly center the active tab inside the scrollable container
  const centerActiveTab = useCallback((tabEl) => {
    if (!tabEl || !containerRef.current) return;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const tabRect = tabEl.getBoundingClientRect();

    // Calculate position of tab relative to container's scroll content
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

  const handleSubClick = (sub, e) => {
    setActiveSubId(sub.id);
    if (e && e.currentTarget) {
      centerActiveTab(e.currentTarget);
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`veyn_active_sub_${activeMainCategory}`, sub.id);
    }

    if (sub.href && sub.href.startsWith('/')) {
      router.push(sub.href);
      return;
    }

    if (sub.href && sub.href.startsWith('#')) {
      const sectionId = sub.href.replace('#', '');
      const isStorefront = pathname === '/' || pathname === '/veyn-objects';

      if (!isStorefront) {
        const targetBase = activeMainCategory === 'VEYN-OBJECTS' ? '/veyn-objects' : '/';
        router.push(`${targetBase}${sub.href}`);
        return;
      }

      // Always update URL hash
      if (typeof window !== 'undefined' && window.history.replaceState) {
        window.history.replaceState(null, '', sub.href);
      }

      const element =
        document.getElementById(sectionId) ||
        document.getElementById(`fit-${sectionId}`) ||
        (sectionId === 'flash-sale' ? document.getElementById('new-arrivals') : null) ||
        (sectionId === 'denims' ? document.getElementById('category-fits-showcase') : null) ||
        (sectionId === 'home' ? (document.getElementById('home') || document.body) : null) ||
        document.getElementById('category-fits-showcase');

      if (element) {
        const yOffset = -90;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
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
                  <span className="subcategories__label">{sub.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
