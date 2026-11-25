import React, { Suspense } from 'react';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import ObjectsAllDrops from '@/components/ObjectsAllDrops/ObjectsAllDrops';
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
        <div className="obj-all__grid obj-all__grid--4col obj-all__grid--m2col">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((n) => (
            <div key={n} className="obj-drop-card obj-drop-card--skeleton">
              <div className="obj-drop-card__gallery" style={{ aspectRatio: '3 / 4' }} />
              <div className="obj-drop-card__details" style={{ padding: '12px 2px' }}>
                <div style={{ width: '70%', height: '14px', background: '#f3f3f3', borderRadius: '2px', marginBottom: '6px' }} />
                <div style={{ width: '40%', height: '12px', background: '#f3f3f3', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
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
