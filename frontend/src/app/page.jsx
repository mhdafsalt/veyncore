'use client';

import React, { useState } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar/AnnouncementBar';
import Navbar from '@/components/Navbar/Navbar';
import MainCategories from '@/components/MainCategories/MainCategories';
import SubCategories from '@/components/SubCategories/SubCategories';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('BLURG-SELECTS');

  return (
    <main>
      <AnnouncementBar />
      <Navbar
        activeMainCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      <MainCategories
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      <SubCategories activeMainCategory={activeCategory} />
    </main>
  );
}
