'use client';

import React, { useState } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar/AnnouncementBar';
import Navbar from '@/components/Navbar/Navbar';
import MainCategories from '@/components/MainCategories/MainCategories';
import SubCategories from '@/components/SubCategories/SubCategories';
import HeroSection from '@/components/HeroSection/HeroSection';
import Link from 'next/link';

const FEATURED_PRODUCTS = [
  {
    id: 'artic-blue-wide',
    title: 'ARTIC BLUE WIDE',
    originalPrice: 'Rs. 1,599.00',
    salePrice: 'Rs. 1,199.00',
    image: '/images/products/artic-blue-wide.jpg',
  },
  {
    id: 'brick-dark-wide',
    title: 'BRICK DARK WIDE',
    originalPrice: 'Rs. 1,499.00',
    salePrice: 'Rs. 1,099.00',
    image: '/images/products/brick-dark-wide.jpg',
  },
  {
    id: 'cloud-blue-wide',
    title: 'CLOUD BLUE WIDE',
    originalPrice: 'Rs. 1,699.00',
    salePrice: 'Rs. 1,149.00',
    image: '/images/products/cloud-blue-wide.jpg',
  },
  {
    id: 'core-blue-wide',
    title: 'CORE BLUE WIDE',
    originalPrice: 'Rs. 1,399.00',
    salePrice: 'Rs. 1,049.00',
    image: '/images/products/core-blue-wide.jpg',
  },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('BLURG-SELECTS');

  return (
    <main>
      {/* 1. Announcement Bar (normal flow, scrolls away cleanly) */}
      <AnnouncementBar />

      {/* 2. Navbar (Permanently Sticky at top: 0) */}
      <Navbar
        activeMainCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 3. Main Categories (normal flow, scrolls away cleanly under Navbar) */}
      <MainCategories
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 4. SubCategories (Permanently Sticky directly below Navbar) */}
      <SubCategories activeMainCategory={activeCategory} />

      {/* Hero Section with Laptop & Mobile responsive images */}
      <HeroSection />

      {/* Featured Products Grid */}
      <section
        id="products"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '60px 16px 120px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            LATEST DROPS
          </h2>
          <span
            style={{
              fontSize: '13px',
              color: '#6b7280',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            4 PRODUCTS
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {FEATURED_PRODUCTS.map((prod) => (
            <article
              key={prod.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '3 / 4',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '12px',
                }}
              >
                <img
                  src={prod.image}
                  alt={prod.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  margin: '0 0 6px',
                  textTransform: 'uppercase',
                }}
              >
                {prod.title}
              </h3>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                }}
              >
                <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>
                  {prod.originalPrice}
                </span>
                <span style={{ fontWeight: 600, color: '#000000' }}>
                  {prod.salePrice}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
