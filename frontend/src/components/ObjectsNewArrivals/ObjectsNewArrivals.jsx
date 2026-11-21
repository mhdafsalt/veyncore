'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import MobileQuickBuyDrawer from '@/components/QuickBuy/MobileQuickBuyDrawer';
import { OBJECTS_PRODUCTS } from '@/data/objectsData';
import './ObjectsNewArrivals.css';

function ObjectCard({ product }) {
  const { addItem, openCart } = useCart();
  const [showSizes, setShowSizes] = useState(false);
  const [isMobileQuickBuyOpen, setIsMobileQuickBuyOpen] = useState(false);
  const [addedStatus, setAddedStatus] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/hero/hero-card-3.jpg'];

  const handleQuickAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setIsMobileQuickBuyOpen(true);
    } else {
      setShowSizes((prev) => !prev);
    }
  };

  const handleSelectSize = (e, size) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.handle || product.id}-${size}`,
      productId: product.handle || product.id,
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

  return (
    <article className="object-card">
      <div className="object-card__gallery">
        <Link href={`/collections/all-drops`} className="object-card__image-link">
          <img
            src={images[0]}
            alt={product.title}
            className="object-card__image"
            loading="lazy"
          />
        </Link>

        {product.badge && (
          <span className="object-card__badge">{product.badge}</span>
        )}

        {/* Quick Add Pill / In-Card Drawer on Laptop, Circular Trigger on Mobile */}
        <div className={`object-card__quick-add ${showSizes ? 'object-card__quick-add--open' : ''}`}>
          {showSizes ? (
            <div className="object-card__size-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="object-card__size-drawer-header">
                <span className="object-card__size-label">SELECT OPTION:</span>
                <button
                  type="button"
                  className="object-card__size-close"
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
              <div className="object-card__size-list">
                {(product.availableSizes || ['ONE SIZE']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="object-card__size-button"
                    onClick={(e) => handleSelectSize(e, size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={`object-card__choose-button ${
                addedStatus ? 'object-card__choose-button--added' : ''
              }`}
              onClick={handleQuickAddClick}
              aria-label={`Quick add ${product.title}`}
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
                    className="object-card__choose-icon"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <svg
                    className="object-card__choose-icon"
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
                      strokeWidth="1.3"
                      d="M16.608 9.421V6.906H3.392v8.016c0 .567.224 1.112.624 1.513.4.402.941.627 1.506.627H8.63M8.818 3h2.333c.618 0 1.212.247 1.649.686a2.35 2.35 0 0 1 .683 1.658v1.562H6.486V5.344c0-.622.246-1.218.683-1.658A2.33 2.33 0 0 1 8.82 3"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.3"
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

      {/* Details */}
      <div className="object-card__details">
        <Link href={`/collections/all-drops`} className="object-card__title-link">
          <h3 className="object-card__title">{product.title}</h3>
        </Link>
        <div className="object-card__pricing">
          <span className="object-card__sale-price">{product.salePrice}</span>
          {product.regularPrice && (
            <span className="object-card__regular-price">{product.regularPrice}</span>
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

export default function ObjectsNewArrivals() {
  return (
    <section className="objects-drops" id="object-drops">
      <div className="objects-drops__container">
        {/* Header */}
        <div className="objects-drops__header">
          <div className="objects-drops__header-left">
            <span className="objects-drops__tag">LATEST HARDWARE // DROP 01</span>
            <h2 className="objects-drops__title">OBJECT DROPS</h2>
          </div>
          <Link href="/collections/all-drops" className="objects-drops__view-all">
            VIEW ALL DROPS →
          </Link>
        </div>

        {/* 4-col desktop / 2-col mobile Grid */}
        <div className="objects-drops__grid">
          {OBJECTS_PRODUCTS.map((product) => (
            <ObjectCard key={product.id} product={product} />
          ))}
        </div>

        {/* Centered Minimalist "View all" Action */}
        <div className="objects-drops__footer">
          <Link href="/collections/all-drops" className="objects-drops__view-all-button">
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}
