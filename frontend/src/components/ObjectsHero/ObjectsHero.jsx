'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { API_BASE_URL } from '@/lib/constants';
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
  images: propImages = null,
  autoPlayInterval = 3500
}) {
  const [images, setImages] = useState(propImages || DEFAULT_HERO_IMAGES);

  // Fetch dynamic hero slides from backend
  useEffect(() => {
    let isMounted = true;
    const fetchHeroSlides = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content/heroSlides`);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const objectsSlides = data.data.filter(
            (s) => s.targetSection === 'VEYN-OBJECTS' && s.active !== false
          );
          if (isMounted && objectsSlides.length > 0) {
            setImages(objectsSlides);
          }
        }
      } catch (err) {
        // Fallback to defaults
      }
    };

    if (!propImages) {
      fetchHeroSlides();
    }
    return () => {
      isMounted = false;
    };
  }, [propImages]);

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
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    setCurrentIndex(baseCount);
  }, [baseCount]);

  // Advance forward continuously
  const handleNext = useCallback(() => {
    if (baseCount <= 1 || isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, [baseCount]);

  // Go backward
  const handlePrev = useCallback(() => {
    if (baseCount <= 1 || isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, [baseCount]);

  // Auto-play timer
  useEffect(() => {
    if (isHovered || baseCount <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isHovered, baseCount, autoPlayInterval, handleNext]);

  // Seamless jump reset
  const handleTransitionEnd = () => {
    isTransitioningRef.current = false;
    if (baseCount <= 1) return;

    if (currentIndex >= baseCount * 2) {
      setEnableTransition(false);
      setCurrentIndex(currentIndex - baseCount);
    } else if (currentIndex < baseCount) {
      setEnableTransition(false);
      setCurrentIndex(currentIndex + baseCount);
    }
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
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
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  const translatePercent = baseCount <= 1 ? 0 : -(currentIndex * (100 / itemsPerView));

  return (
    <section
      className="objects-hero"
      aria-label="VEYN-OBJECTS Editorial Visuals"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="objects-hero__container">
        <div className="objects-hero__viewport">
          <div
            className="objects-hero__track"
            style={{
              transform: `translate3d(${translatePercent}%, 0, 0)`,
              transition: enableTransition
                ? 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
                : 'none'
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((slide, idx) => (
              <div
                key={`${slide.id}-${idx}`}
                className="objects-hero__slide"
                style={{ flex: `0 0 ${100 / itemsPerView}%` }}
              >
                <div className="objects-hero__card">
                  <img
                    src={slide.image}
                    alt={slide.alt || slide.title || 'VEYN-OBJECTS'}
                    className="objects-hero__image"
                    loading={idx < itemsPerView ? 'eager' : 'lazy'}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows for Mobile (when itemsPerView === 1) or manual navigation */}
          {baseCount > 1 && (
            <>
              <button
                type="button"
                className="objects-hero__arrow objects-hero__arrow--prev"
                onClick={handlePrev}
                aria-label="Previous slide"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                className="objects-hero__arrow objects-hero__arrow--next"
                onClick={handleNext}
                aria-label="Next slide"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
