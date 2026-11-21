'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './MainCategories.css';

const CATEGORIES = [
  { id: 'VEYN-SELECTS', label: 'VEYN-SELECTS', path: '/' },
  { id: 'VEYN-OBJECTS', label: 'VEYN-OBJECTS', path: '/veyn-objects' }
];

export default function MainCategories({ activeCategory, onSelectCategory }) {
  const router = useRouter();
  const pathname = usePathname();

  // Active category determination:
  // If activeCategory prop is passed, use it; otherwise detect from URL pathname
  const currentCategory = activeCategory || (
    pathname && pathname.startsWith('/veyn-objects')
      ? 'VEYN-OBJECTS'
      : 'VEYN-SELECTS'
  );

  const handleClick = (e, cat) => {
    e.preventDefault();

    if (onSelectCategory) {
      onSelectCategory(cat.id);
    }

    if (cat.id === 'VEYN-OBJECTS') {
      if (pathname !== '/veyn-objects') {
        router.push('/veyn-objects');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (cat.id === 'VEYN-SELECTS') {
      if (pathname !== '/') {
        router.push('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="main-categories" aria-label="Main category navigation">
      <div className="main-categories__list" role="tablist">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <div
              key={cat.id}
              className={`main-categories__item ${
                isActive ? 'main-categories__item--active' : ''
              }`}
              role="presentation"
            >
              <a
                href={cat.path}
                className={`main-categories__link ${
                  isActive ? 'main-categories__link--active' : ''
                }`}
                role="tab"
                aria-selected={isActive}
                onClick={(e) => handleClick(e, cat)}
              >
                {cat.label}
              </a>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
