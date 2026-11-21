'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './ObjectsHero.css';

const DEFAULT_HERO_IMAGES = [
  {
    id: 'hero-obj-1',
    image: '/images/hero/ObjectHero01.png',
    href: '#bags',
    alt: 'VEYN-OBJECTS Tactical Bags'
  },
  {
    id: 'hero-obj-2',
    image: '/images/hero/ObjectHero02.png',
    href: '#chains',
    alt: 'VEYN-OBJECTS Chains & Hardware'
  }
];

export default function ObjectsHero({
  images = DEFAULT_HERO_IMAGES,
  autoPlayInterval = 3500
}) {
  const baseCount = images.length;

  // Triplicate the slides for continuous infinite looping
  const extendedSlides = useMemo(() => {
    if (baseCount <= 1) return images;
    return [...images, ...images, ...images];
  }, [images, baseCount]);

  const [currentIndex, setCurrentIndex] = useState(baseCount);
  const [enableTransition, setEnableTransition] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  const isTransitioningRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Responsive items-per-view
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setItemsPerView(1); // Mobile: 1 image per view (auto-swiping)
      } else {
        setItemsPerView(2); // Desktop & Tablet: 2 images side-by-side
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Safety unlock: ensure isTransitioningRef never hangs
  useEffect(() => {
    if (!enableTransition) return;
    const safetyTimer = setTimeout(() => {
      isTransitioningRef.current = false;
    }, 600);
    return () => clearTimeout(safetyTimer);
  }, [currentIndex, enableTransition]);

  // Advance forward continuously (never rewind backwards)
  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Move backward
  const handlePrev = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Seamless invisible teleport on transition end
  const handleTransitionEnd = () => {
    isTransitioningRef.current = false;
    if (currentIndex >= baseCount * 2) {
      setEnableTransition(false);
      setCurrentIndex((prev) => prev - baseCount);
    } else if (currentIndex < baseCount) {
      setEnableTransition(false);
      setCurrentIndex((prev) => prev + baseCount);
    }
  };

  // Auto-play timer: auto-swipes when on mobile (itemsPerView < baseCount)
  useEffect(() => {
    if (isHovered || baseCount <= 1 || itemsPerView >= baseCount) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isHovered, autoPlayInterval, handleNext, itemsPerView, baseCount]);

  // Touch Swipe for mobile devices
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // On desktop with 2 items, show the middle set flush
  const isCarouselActive = itemsPerView < baseCount;
  const slideOffset = isCarouselActive ? currentIndex : baseCount;

  return (
    <section
      className="objects-hero"
      id="all-objects"
      aria-label="VEYN-OBJECTS Hero Showcase"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="objects-hero__viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`objects-hero__track ${
            enableTransition ? 'objects-hero__track--animated' : ''
          }`}
          style={{
            transform: `translateX(-${slideOffset * (100 / itemsPerView)}%)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((item, idx) => (
            <div
              key={`${item.id || 'slide'}-${idx}`}
              className="objects-hero__item"
              style={{
                flex: `0 0 ${100 / itemsPerView}%`,
                maxWidth: `${100 / itemsPerView}%`,
              }}
            >
              <a
                href={item.href || '#object-drops'}
                className="objects-hero__link"
                aria-label={item.alt}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="objects-hero__image"
                  loading={idx < baseCount + 2 ? 'eager' : 'lazy'}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
