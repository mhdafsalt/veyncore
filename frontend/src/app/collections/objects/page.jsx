import React from 'react';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import ObjectsAllDrops from '@/components/ObjectsAllDrops/ObjectsAllDrops';

export const metadata = {
  title: 'ALL OBJECTS | VEYN-OBJECTS - Tactical Artifacts & Hardware',
  description:
    'Complete catalog of utilitarian hardware, tactical bags, 316L solid steel chains, and distressed caps by VEYN-OBJECTS.'
};

export default function ObjectsPage() {
  return (
    <main className="objects-drops-page">
      {/* 1. Header with VEYN-OBJECTS pre-selected */}
      <StoreHeader initialCategory="VEYN-OBJECTS" />

      {/* 2. Collection View */}
      <ObjectsAllDrops />

      {/* 3. Footer */}
      <Footer />
    </main>
  );
}
