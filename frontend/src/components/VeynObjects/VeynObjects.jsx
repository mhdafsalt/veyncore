'use client';

import React from 'react';
import ObjectsHero from '@/components/ObjectsHero/ObjectsHero';
import ObjectsNewArrivals from '@/components/ObjectsNewArrivals/ObjectsNewArrivals';
import ObjectsCategoryDrops from '@/components/ObjectsCategoryDrops/ObjectsCategoryDrops';
import './VeynObjects.css';

export default function VeynObjects() {
  return (
    <div className="veyn-objects-home">
      {/* 1. Hero Section for VEYN-OBJECTS */}
      <ObjectsHero />

      {/* 2. Curated Object Drops Showcase Grid */}
      <ObjectsNewArrivals />

      {/* 3. Category-Based Swipeable Drops (BAGS, CHAINS, CAPS) */}
      <ObjectsCategoryDrops />
    </div>
  );
}
