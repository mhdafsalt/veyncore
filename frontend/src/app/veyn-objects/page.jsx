'use client';

import React, { useState } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar/AnnouncementBar';
import Navbar from '@/components/Navbar/Navbar';
import MainCategories from '@/components/MainCategories/MainCategories';
import SubCategories from '@/components/SubCategories/SubCategories';
import VeynObjects from '@/components/VeynObjects/VeynObjects';
import Footer from '@/components/Footer/Footer';

export default function VeynObjectsPage() {
  const [activeCategory, setActiveCategory] = useState('VEYN-OBJECTS');

  return (
    <main>
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Navbar (Sticky at top: 0) */}
      <Navbar
        activeMainCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 3. Main Categories (VEYN-SELECTS / VEYN-OBJECTS) */}
      <MainCategories
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 4. SubCategories (Sticky directly below Navbar) */}
      <SubCategories activeMainCategory={activeCategory} />

      {/* 5. Dedicated VEYN-OBJECTS View */}
      <VeynObjects />

      {/* 6. Modern Footer with Image Banner */}
      <Footer showBanner={true} />
    </main>
  );
}
