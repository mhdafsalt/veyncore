'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './MainCategories.css';

const CATEGORIES = [
  { id: 'VEYN-SELECTS', label: 'VEYN-SELECTS', path: '/' },
  { id: 'VEYN-OBJECTS', label: 'VEYN-OBJECTS', path: '/veyn-objects' }
];

export default function MainCategories({ activeCategory = null, onSelectCategory }) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCat, setSelectedCat] = useState(activeCategory);

  // Prefetch storefront and drops routes for 0ms latency transitions
  useEffect(() => {
    if (router && typeof router.prefetch === 'function') {
      router.prefetch('/');
      router.prefetch('/veyn-objects');
      router.prefetch('/collections/all-drops');
      router.prefetch('/collections/objects-drops');
    }
  }, [router]);

  // Keep selectedCat synchronized with incoming activeCategory prop
  useEffect(() => {
    setSelectedCat(activeCategory || null);
  }, [activeCategory]);

  const handleClick = (e, cat) => {
    e.preventDefault();

    // 1. Instantly move the active indicator on click
    setSelectedCat(cat.id);

    // 2. Notify parent state handler immediately
    if (onSelectCategory) {
      onSelectCategory(cat.id);
    }

    const isStorefront = pathname === '/' || pathname === '/veyn-objects';

    if (isStorefront) {
      // Instant in-place state switch without page reload or remount
      const newPath = cat.id === 'VEYN-OBJECTS' ? '/veyn-objects' : '/';
      if (typeof window !== 'undefined' && window.location.pathname !== newPath) {
        window.history.replaceState(null, '', newPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // From PDP or collection catalog, navigate to destination
      if (cat.id === 'VEYN-OBJECTS') {
        const target = pathname && pathname.includes('drops') ? '/collections/objects-drops' : '/veyn-objects';
        router.push(target);
      } else {
        const target = pathname && pathname.includes('drops') ? '/collections/all-drops' : '/';
        router.push(target);
      }
    }
  };

  return (
    <nav className="main-categories" aria-label="Main category navigation">
      <div className="main-categories__list" role="tablist">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCat === cat.id;
          return (
            <div
              key={cat.id}
              className={`main-categories__item ${
                isActive ? 'main-categories__item--active' : ''
              }`}
              role="presentation"
            >
              <button
                type="button"
                className={`main-categories__link ${
                  isActive ? 'main-categories__link--active' : ''
                }`}
                role="tab"
                aria-selected={isActive}
                onClick={(e) => handleClick(e, cat)}
              >
                <span className="main-categories__text">{cat.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
