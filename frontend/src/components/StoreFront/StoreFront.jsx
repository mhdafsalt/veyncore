'use client';

import React, { useState, useCallback } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar/AnnouncementBar';
import Navbar from '@/components/Navbar/Navbar';
import MainCategories from '@/components/MainCategories/MainCategories';
import SubCategories from '@/components/SubCategories/SubCategories';
import HeroSection from '@/components/HeroSection/HeroSection';
import NewArrivals from '@/components/NewArrivals/NewArrivals';
import CategoryFits from '@/components/CategoryFits/CategoryFits';
import VeynObjects from '@/components/VeynObjects/VeynObjects';
import Footer from '@/components/Footer/Footer';
import VeyncoreLoader from '@/components/VeyncoreLoader/VeyncoreLoader';

// In-memory flag: prevents re-triggering loader during in-page tab switches,
// but runs cleanly on initial page entry and page refresh
let hasIntroPlayed = false;

/**
 * Unified StoreFront Component
 * Drives both VEYN-SELECTS and VEYN-OBJECTS with instant in-place tab switching (zero refresh)
 */
export default function StoreFront({ initialCategory = 'VEYN-SELECTS' }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(() => !hasIntroPlayed);

  const handleLoaderComplete = useCallback(() => {
    hasIntroPlayed = true;
    setIsLoading(false);
  }, []);

  // Seamless zero-refresh in-place tab switch
  const handleSelectCategory = useCallback((catId) => {
    setActiveCategory(catId);
    if (typeof window !== 'undefined') {
      const targetUrl = catId === 'VEYN-OBJECTS' ? '/veyn-objects' : '/';
      if (window.location.pathname !== targetUrl) {
        window.history.replaceState(null, '', targetUrl);
      }
    }
  }, []);

  return (
    <>
      {/* Veyncore Full-Screen Intro Loader - Snappy 1s luxury entrance on initial site entry */}
      {isLoading && (
        <VeyncoreLoader
          duration={1000}
          onComplete={handleLoaderComplete}
        />
      )}

      <main>
        {/* 1. Announcement Bar (normal flow, scrolls away cleanly) */}
        <AnnouncementBar />

        {/* 2. Navbar (Permanently Sticky at top: 0) */}
        <Navbar
          activeMainCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 3. Main Categories (normal flow, scrolls away cleanly under Navbar) */}
        <MainCategories
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 4. SubCategories (Permanently Sticky directly below Navbar) */}
        <SubCategories activeMainCategory={activeCategory} />

        {/* 5. Dynamic Content: VEYN-SELECTS vs VEYN-OBJECTS (Instant In-Place Zero-Refresh Switch) */}
        {activeCategory === 'VEYN-OBJECTS' ? (
          <VeynObjects />
        ) : (
          <>
            {/* Hero Section (3-box seamless auto/manual carousel) */}
            <HeroSection />

            {/* Shop New Arrivals (Responsive 4-col/2-col grid with veyncult styling) */}
            <NewArrivals />

            {/* Fit Categories Showcase (BAGGY, BOOTCUT, WIDE, STRAIGHT swipeable rows with 6 cards & View all) */}
            <CategoryFits />
          </>
        )}

        {/* 6. Modern VEYNCORE Footer with Editorial Image Banner on Homepage */}
        <Footer showBanner={true} activeMainCategory={activeCategory} />
      </main>
    </>
  );
}
