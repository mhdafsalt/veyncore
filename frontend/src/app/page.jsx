'use client';

import React, { useState } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar/AnnouncementBar';
import Navbar from '@/components/Navbar/Navbar';
import MainCategories from '@/components/MainCategories/MainCategories';
import SubCategories from '@/components/SubCategories/SubCategories';
import HeroSection from '@/components/HeroSection/HeroSection';
import NewArrivals from '@/components/NewArrivals/NewArrivals';

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

      {/* 5. Hero Section (3-box seamless auto/manual carousel) */}
      <HeroSection />

      {/* 6. Shop New Arrivals (Responsive 4-col/2-col grid with veyncult styling) */}
      <NewArrivals />
    </main>
  );
}
