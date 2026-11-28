import React, { Suspense } from 'react';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import AllDrops from '@/components/AllDrops/AllDrops';
import ProductGridSkeleton from '@/components/ProductCardSkeleton/ProductCardSkeleton';

export const metadata = {
  title: 'ALL COLLECTIONS | VEYNCORE - Contemporary Raw Denim & Streetwear',
  description:
    'Explore all exclusive denim drops by VEYNCORE. Structured silhouettes, baggy jeans, semi bootcut cuts, and premium streetwear denim craftsmanship.'
};

function AllCollectionsFallback() {
  return (
    <div className="all-drops">
      <div className="all-drops__container">
        <ProductGridSkeleton count={12} desktopColumns="4" mobileColumns="2" />
      </div>
    </div>
  );
}

export default function AllCollectionsPage() {
  return (
    <main className="all-drops-page">
      {/* 1. Header with AnnouncementBar, Navbar, MainCategories & SubCategories */}
      <StoreHeader initialCategory="VEYN-SELECTS" />

      {/* 2. Collection View */}
      <Suspense fallback={<AllCollectionsFallback />}>
        <AllDrops />
      </Suspense>

      {/* 3. Footer */}
      <Footer />
    </main>
  );
}
