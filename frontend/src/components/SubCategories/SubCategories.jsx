'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './SubCategories.css';

const SELECTS_SUBCATEGORIES = [
  { id: 'home', label: 'HOME', href: '#home' },
  { id: 'flash-sale', label: 'FLASH SALE⚡️', href: '#flash-sale', isGlow: true },
  { id: 'new-drops', label: 'NEW DROPS', href: '/collections/all-drops', isGlow: true },
  { id: 'all-drops', label: 'ALL DROPS', href: '/collections/all-drops' },
  { id: 'denims', label: 'DENIMS', href: '#denims' },
  { id: 'cargo', label: 'CARGO', href: '#cargo' },
  { id: 'baggy', label: 'BAGGY', href: '#baggy' },
  { id: 'bootcut', label: 'BOOTCUT', href: '#bootcut' },
  { id: 'wide', label: 'WIDE', href: '#wide' },
  { id: 'straight', label: 'STRAIGHT', href: '#straight' },
  { id: 'tops', label: 'TOPS', href: '#tops' },
  { id: 'accessories', label: 'ACCESSORIES', href: '#accessories' }
];

const OBJECTS_SUBCATEGORIES = [
  { id: 'obj-all', label: 'ALL OBJECTS', href: '/collections/objects-drops' },
  { id: 'obj-drops', label: 'OBJECT DROPS ⚡️', href: '#object-drops', isGlow: true },
  { id: 'bags', label: 'BAGS', href: '#bags' },
  { id: 'chains', label: 'CHAINS', href: '#chains' },
  { id: 'headwear', label: 'CAPS & HEADWEAR', href: '#headwear' },
  { id: 'hardware', label: 'HARDWARE', href: '#hardware' },
  { id: 'all-drops', label: 'ALL DROPS', href: '/collections/objects-drops' }
];

export default function SubCategories({ activeMainCategory = 'VEYN-SELECTS' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSubId, setActiveSubId] = useState('home');
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

  const subcategories =
    activeMainCategory === 'VEYN-OBJECTS'
      ? OBJECTS_SUBCATEGORIES
      : SELECTS_SUBCATEGORIES;

  // Reset active tab when parent main category changes
  useEffect(() => {
    if (activeMainCategory === 'VEYN-OBJECTS') {
      setActiveSubId('obj-all');
    } else {
      setActiveSubId('home');
    }
  }, [activeMainCategory]);

  // Center active tab in scrollable container
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const tab = activeTabRef.current;
      const targetScroll =
        tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      } else {
        container.scrollLeft = Math.max(0, targetScroll);
      }
    }
  }, [activeSubId]);

  const handleTabClick = (e, item) => {
    setActiveSubId(item.id);

    if (item.href.startsWith('#')) {
      const hash = item.href.slice(1);
      const target = document.getElementById(hash);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        const isObjects = activeMainCategory === 'VEYN-OBJECTS';
        e.preventDefault();
        router.push(isObjects ? `/veyn-objects#${hash}` : `/#${hash}`);
      }
    }
  };

  return (
    <div className="subcategories" aria-label="Subcategory navigation">
      <div className="subcategories__wrap">
        <div
          ref={containerRef}
          className="subcategories__list"
          role="tablist"
        >
          {subcategories.map((item) => {
            const isActive = activeSubId === item.id;

            return (
              <div
                key={item.id}
                ref={isActive ? activeTabRef : null}
                className={`subcategories__item ${
                  isActive ? 'subcategories__item--active' : ''
                } ${item.isGlow ? 'subcategories__item--glow' : ''}`}
              >
                <a
                  href={item.href}
                  className={`subcategories__link ${
                    isActive ? 'subcategories__link--active' : ''
                  } ${item.isGlow ? 'subcategories__link--glow' : ''}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={(e) => handleTabClick(e, item)}
                >
                  <span className="subcategories__label">{item.label}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
