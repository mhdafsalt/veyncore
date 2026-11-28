'use client';

import React from 'react';
import './ProductCardSkeleton.css';

/**
 * Individual Product Card Skeleton Placeholder
 * Follows exact VEYNCORE product card layout:
 * - 3:4 aspect-ratio media box
 * - title line (72%)
 * - price line (42%)
 * - secondary fit/badge indicator (26%)
 */
export function ProductCardSkeleton() {
  return (
    <article className="veyn-product-skeleton-card" aria-hidden="true">
      <div className="veyn-product-skeleton-card__media" />
      <div className="veyn-product-skeleton-card__info">
        <div className="veyn-product-skeleton-card__title" />
        <div className="veyn-product-skeleton-card__price" />
        <div className="veyn-product-skeleton-card__sub" />
      </div>
    </article>
  );
}

/**
 * Reusable Category Product Grid Skeleton
 * Matches the responsive layout:
 * - 4 columns or 2 columns on desktop
 * - 2 columns or 1 column on mobile (defaults to 2 columns on mobile as requested)
 */
export default function ProductGridSkeleton({
  count = 12,
  desktopColumns = '4',
  mobileColumns = '2',
  className = '',
}) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      className={`all-drops__grid all-drops__grid--${desktopColumns}col all-drops__grid--m${mobileColumns}col ${className}`}
      aria-busy="true"
      aria-label="Loading category products..."
    >
      {items.map((key) => (
        <ProductCardSkeleton key={key} />
      ))}
    </div>
  );
}
