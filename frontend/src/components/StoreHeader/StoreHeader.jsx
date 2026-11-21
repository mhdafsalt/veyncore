'use client';

import React, { useState } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar/AnnouncementBar';
import Navbar from '@/components/Navbar/Navbar';
import MainCategories from '@/components/MainCategories/MainCategories';
import SubCategories from '@/components/SubCategories/SubCategories';

/**
 * Reusable Store Header Component
 * Encapsulates AnnouncementBar, Navbar, MainCategories bar, and SubCategories bar
 * with interactive synchronized category state across PDP and Collection pages.
 */
export default function StoreHeader({ initialCategory = 'VEYN-SELECTS' }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  return (
    <>
      {/* 1. Announcement Bar (normal document flow, scrolls away) */}
      <AnnouncementBar />

      {/* 2. Primary Navbar (Sticky at top: 0, z-index: 100) */}
      <Navbar
        activeMainCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 3. Main Category Bar (normal document flow, scrolls away under Navbar) */}
      <MainCategories
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 4. Subcategory Bar (Sticky directly below Navbar at top: 56px/50px, z-index: 90) */}
      <SubCategories activeMainCategory={activeCategory} />
    </>
  );
}
