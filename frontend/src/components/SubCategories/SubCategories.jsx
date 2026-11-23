'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  const [activeSubId, setActiveSubId] = useState('home');
  const [dynamicSubcategories, setDynamicSubcategories] = useState(null);

  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

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

  // Reset active tab when parent main category changes
  useEffect(() => {
    if (activeMainCategory === 'VEYN-OBJECTS') {
      setActiveSubId('obj-all');
    } else {
      setActiveSubId('home');
    }
  }, [activeMainCategory]);

  // Center active tab in scrollable container
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const tab = activeTabRef.current;
      const targetScroll =
        tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      } else {
        container.scrollLeft = Math.max(0, targetScroll);
      }
    }
  }, [activeSubId]);

  const handleSubClick = (sub) => {
    setActiveSubId(sub.id);

    if (sub.href && sub.href.startsWith('/')) {
      router.push(sub.href);
      return;
    }

    if (sub.href && sub.href.startsWith('#')) {
      const sectionId = sub.href.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -90;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
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
                  onClick={() => handleSubClick(sub)}
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
