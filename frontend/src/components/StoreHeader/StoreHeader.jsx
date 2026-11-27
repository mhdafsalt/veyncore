'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar/AnnouncementBar';
import Navbar from '@/components/Navbar/Navbar';
import MainCategories from '@/components/MainCategories/MainCategories';
import SubCategories from '@/components/SubCategories/SubCategories';

/**
 * Reusable Store Header Component
 * Encapsulates AnnouncementBar, Navbar, MainCategories bar, and SubCategories bar
 * with interactive synchronized category state across PDP and Collection pages.
 */
export default function StoreHeader({
  initialCategory = 'VEYN-SELECTS',
  showMainCategories = true,
  showSubCategories = true,
}) {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState(() => {
    if (pathname && (pathname.includes('objects') || pathname.includes('veyn-objects'))) {
      return 'VEYN-OBJECTS';
    }
    if (pathname && pathname.startsWith('/pages/')) {
      return null;
    }
    return initialCategory;
  });

  useEffect(() => {
    if (pathname && (pathname.includes('objects') || pathname.includes('veyn-objects'))) {
      setActiveCategory('VEYN-OBJECTS');
    } else if (pathname && pathname.startsWith('/pages/')) {
      setActiveCategory(null);
    } else if (initialCategory !== undefined) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory, pathname]);

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
      {showMainCategories && (
        <MainCategories
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      )}

      {/* 4. Subcategory Bar (Sticky directly below Navbar at top: 56px/50px, z-index: 90) */}
      {showSubCategories && (
        <SubCategories activeMainCategory={activeCategory} />
      )}
    </>
  );
}
