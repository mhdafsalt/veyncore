import React, { Suspense } from 'react';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import AllDrops from '@/components/AllDrops/AllDrops';

export const metadata = {
  title: 'ALL DROPS | VEYNCORE - Contemporary Raw Denim & Streetwear',
  description:
    'Explore all exclusive denim drops by VEYNCORE. Structured silhouettes, baggy jeans, semi bootcut cuts, and premium streetwear denim craftsmanship.'
};

export default function AllDropsPage() {
  return (
    <main className="all-drops-page">
      {/* 1. Header with AnnouncementBar, Navbar, MainCategories & SubCategories */}
      <StoreHeader initialCategory="VEYN-SELECTS" />

      {/* 2. Collection View */}
      <Suspense fallback={<div className="all-drops-loading" style={{ minHeight: '60vh' }} />}>
        <AllDrops />
      </Suspense>

      {/* 3. Footer */}
      <Footer />
    </main>
  );
}
