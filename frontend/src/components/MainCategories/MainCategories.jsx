'use client';

import React from 'react';
import './MainCategories.css';

const CATEGORIES = [
  { id: 'BLURG-ORIGINALS', label: 'VEYN-SELECTS', href: '#VEYN-SELECTS' },
  { id: 'BLURG-SELECTS', label: 'VEYN-OBJECTS', href: '#VEYN-SELECTS' }
];

export default function MainCategories({ activeCategory = 'BLURG-SELECTS', onSelectCategory }) {
  const handleClick = (e, catId) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  return (
    <nav className="main-categories" aria-label="Main category navigation">
      <div className="main-categories__list" role="tablist">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <div
              key={cat.id}
              className={`main-categories__item ${
                isActive ? 'main-categories__item--active' : ''
              }`}
              role="presentation"
            >
              <a
                href={cat.href}
                className={`main-categories__link ${
                  isActive ? 'main-categories__link--active' : ''
                }`}
                role="tab"
                aria-selected={isActive}
                onClick={(e) => handleClick(e, cat.id)}
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
