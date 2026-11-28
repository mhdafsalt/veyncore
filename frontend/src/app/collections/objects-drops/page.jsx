import React, { Suspense } from 'react';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import ObjectsAllDrops from '@/components/ObjectsAllDrops/ObjectsAllDrops';
import ProductGridSkeleton from '@/components/ProductCardSkeleton/ProductCardSkeleton';
import '@/components/ObjectsAllDrops/ObjectsAllDrops.css';

export const metadata = {
  title: 'OBJECT DROPS | VEYN-OBJECTS - Utilitarian Hardware & Streetwear Artifacts',
  description:
    'Explore all utilitarian hardware, tactical bags, heavyweight 316L chains, and distressed caps by VEYN-OBJECTS. Small-batch edition policy & engineered street resilience.'
};

function ObjectsDropsFallback() {
  return (
    <section className="obj-all">
      <div className="obj-all__container">
        <div className="obj-all__header">
          <div className="obj-all__header-title-row">
            <h1 className="obj-all__title">OBJECT DROPS</h1>
          </div>
        </div>
        <ProductGridSkeleton count={12} desktopColumns="4" mobileColumns="2" />
      </div>
    </section>
  );
}

export default function ObjectsDropsPage() {
  return (
    <main className="objects-drops-page">
      {/* 1. Header with VEYN-OBJECTS pre-selected */}
      <StoreHeader initialCategory="VEYN-OBJECTS" />

      {/* 2. Collection View */}
      <Suspense fallback={<ObjectsDropsFallback />}>
        <ObjectsAllDrops />
      </Suspense>

      {/* 3. Footer */}
      <Footer />
    </main>
  );
}
