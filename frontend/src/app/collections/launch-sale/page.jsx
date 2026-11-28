import React, { Suspense } from 'react';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import LaunchSale from '@/components/LaunchSale/LaunchSale';
import ProductGridSkeleton from '@/components/ProductCardSkeleton/ProductCardSkeleton';
import '@/components/AllDrops/AllDrops.css';

export const metadata = {
  title: 'LAUNCH SALE | VEYNCORE - Promotional Drops & Limited-Time Sales',
  description:
    'Explore limited-time promotional streetwear denim drops with exclusive discounts and live countdowns by VEYNCORE.'
};

function LaunchSaleFallback() {
  return (
    <div className="all-drops">
      <div className="all-drops__container">
        <div className="all-drops__header launch-sale__header">
          <div className="all-drops__header-title-row">
            <h1 className="all-drops__title">LAUNCH SALE</h1>
          </div>
        </div>
        <ProductGridSkeleton count={4} desktopColumns="4" mobileColumns="2" />
      </div>
    </div>
  );
}

export default function LaunchSalePage() {
  return (
    <main className="all-drops-page">
      {/* 1. Header with AnnouncementBar, Navbar, MainCategories & SubCategories */}
      <StoreHeader initialCategory="VEYN-SELECTS" />

      {/* 2. Collection View */}
      <Suspense fallback={<LaunchSaleFallback />}>
        <LaunchSale />
      </Suspense>

      {/* 3. Footer */}
      <Footer />
    </main>
  );
}
