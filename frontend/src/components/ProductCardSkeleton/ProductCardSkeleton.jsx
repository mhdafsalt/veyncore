'use client';

import React from 'react';
import './ProductCardSkeleton.css';

/**
 * Individual Product Card Skeleton Placeholder
 * Exact match to LAUNCH SALE page skeleton:
 * - .all-drops-card.all-drops-card--skeleton
 * - .all-drops-card__media (3:4 ratio with shimmer)
 * - .all-drops-card__info
 * - .all-drops-card__skeleton-title (75% bar)
 * - .all-drops-card__skeleton-price (40% bar)
 */
export function ProductCardSkeleton() {
  return (
    <article className="all-drops-card all-drops-card--skeleton" aria-hidden="true">
      <div className="all-drops-card__media" />
      <div className="all-drops-card__info">
        <div className="all-drops-card__skeleton-title" />
        <div className="all-drops-card__skeleton-price" />
      </div>
    </article>
  );
}

/**
 * Reusable Category Product Grid Skeleton
 * Matches exact LAUNCH SALE grid layout:
 * - Desktop: 4 columns or 2 columns
 * - Mobile: 2 columns
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
