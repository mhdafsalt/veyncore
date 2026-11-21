'use client';

import React, { useState } from 'react';
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

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('VEYN-SELECTS');
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Veyncore Full-Screen Intro Loader */}
      {isLoading && (
        <VeyncoreLoader
          duration={2200}
          onComplete={() => setIsLoading(false)}
        />
      )}

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

        {/* 5. Dynamic Content: VEYN-SELECTS vs VEYN-OBJECTS */}
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

        {/* 8. Modern VEYNCORE Footer with Editorial Image Banner on Homepage */}
        <Footer showBanner={true} />
      </main>
    </>
  );
}
