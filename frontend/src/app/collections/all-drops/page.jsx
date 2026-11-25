import React, { Suspense } from 'react';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import AllDrops from '@/components/AllDrops/AllDrops';
import '@/components/AllDrops/AllDrops.css';

export const metadata = {
  title: 'ALL DROPS | VEYNCORE - Contemporary Raw Denim & Streetwear',
  description:
    'Explore all exclusive denim drops by VEYNCORE. Structured silhouettes, baggy jeans, semi bootcut cuts, and premium streetwear denim craftsmanship.'
};

function AllDropsFallback() {
  return (
    <div className="all-drops">
      <div className="all-drops__container">
        <div className="all-drops__header">
          <div className="all-drops__header-title-row">
            <h1 className="all-drops__title">ALL DROPS</h1>
          </div>
        </div>
        <div className="all-drops__grid all-drops__grid--4col all-drops__grid--m2col">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((n) => (
            <div key={n} className="all-drops-card all-drops-card--skeleton">
              <div className="all-drops-card__media" />
              <div className="all-drops-card__info">
                <div className="all-drops-card__skeleton-title" />
                <div className="all-drops-card__skeleton-price" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AllDropsPage() {
  return (
    <main className="all-drops-page">
      {/* 1. Header with AnnouncementBar, Navbar, MainCategories & SubCategories */}
      <StoreHeader initialCategory="VEYN-SELECTS" />

      {/* 2. Collection View */}
      <Suspense fallback={<AllDropsFallback />}>
        <AllDrops />
      </Suspense>

      {/* 3. Footer */}
      <Footer />
    </main>
  );
}
