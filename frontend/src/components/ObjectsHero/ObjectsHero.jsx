'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';
import './ObjectsHero.css';

let cachedObjectsSlides = null;

// Initial fallback slides so VEYN-OBJECTS hero renders instantly on frame 0
const INITIAL_OBJECTS_SLIDES = [
  {
    id: 'obj-slide-3',
    targetSection: 'VEYN-OBJECTS',
    title: 'Tactical Artifacts & Caps',
    image: '/images/hero/ObjectHero03.jpg', // 110 KB optimized JPG instead of 2.06 MB PNG
    href: '/collections/objects-drops',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'item-1795506485735-7nf5',
    targetSection: 'VEYN-OBJECTS',
    title: 'Shades',
    image: 'https://res.cloudinary.com/sod0mks1/image/upload/v1795506476/veyncore_uploads/24bc592b40ca58fc89ae4dc630b3b10f-1795506472410-1309.jpg',
    href: '/collections/objects-drops?category=shades',
    active: true,
    sortOrder: 4,
  },
  {
    id: 'item-1795506542135-1l3n',
    targetSection: 'VEYN-OBJECTS',
    title: 'Objects',
    image: 'https://res.cloudinary.com/sod0mks1/image/upload/v1795506537/veyncore_uploads/unnamed__1_-1795506535210-5755.jpg',
    href: '/collections/objects-drops?category=baggy',
    active: true,
    sortOrder: 5,
  },
];

/**
 * Optimizes image URLs with next-gen formats and compression
 */
function optimizeImageUrl(url, width = 900) {
  if (!url || typeof url !== 'string') return url;
  if (url === '/images/hero/ObjectHero03.png') {
    return '/images/hero/ObjectHero03.jpg';
  }
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (url.includes('/f_auto,q_auto')) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }
  return url;
}

export default function ObjectsHero({
  images: propImages = null,
  autoPlayInterval = 3500,
}) {
  const [images, setImages] = useState(() => propImages || cachedObjectsSlides || INITIAL_OBJECTS_SLIDES);

  // Fetch dynamic hero slides from backend (keeps state synced in background)
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
          if (objectsSlides.length > 0) {
            cachedObjectsSlides = objectsSlides;
            if (isMounted) {
              setImages(objectsSlides);
            }
          }
        }
      } catch (err) {
        // Silently preserve current slides
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

  // Triplicate the slides for continuous infinite looping (identical to HeroSection)
  const extendedSlides = useMemo(() => {
    if (!images || images.length === 0) return [];
    if (images.length < 3) {
      return [...images, ...images, ...images, ...images, ...images, ...images];
    }
    return [...images, ...images, ...images];
  }, [images]);

  const [currentIndex, setCurrentIndex] = useState(baseCount);
  const [enableTransition, setEnableTransition] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  const isTransitioningRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Responsive items-per-view matching VEYN-SELECTS (3 on desktop, 2 on tablet, 1 on mobile)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          setItemsPerView(1); // Mobile: 1 image per view
        } else if (window.innerWidth < 1024) {
          setItemsPerView(2); // Tablet: 2 images side-by-side
        } else {
          setItemsPerView(3); // Desktop/Laptop: 3 images side-by-side like VEYN-SELECTS
        }
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

  useEffect(() => {
    setCurrentIndex(baseCount);
  }, [baseCount]);

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
    if (baseCount === 0) return;

    if (currentIndex >= baseCount * 2) {
      setEnableTransition(false);
      setCurrentIndex(currentIndex - baseCount);
    } else if (currentIndex < baseCount) {
      setEnableTransition(false);
      setCurrentIndex(currentIndex + baseCount);
    }
  };

  // Auto-play timer: continuous forward sliding
  useEffect(() => {
    if (isHovered || baseCount === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isHovered, autoPlayInterval, handleNext, baseCount]);

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

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section
      className="objects-hero"
      id="all-objects"
      aria-label="VEYN-OBJECTS Hero Showcase"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        id="home"
        style={{
          position: 'relative',
          top: '-90px',
          display: 'block',
          height: 0,
          visibility: 'hidden',
        }}
      />
      <div className="objects-hero__container">
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
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((item, idx) => {
              const isPrimaryVisible = idx >= baseCount && idx < baseCount + itemsPerView;
              return (
                <div
                  key={`${item.id || 'slide'}-${idx}`}
                  className="objects-hero__item"
                  style={{
                    flex: `0 0 ${100 / itemsPerView}%`,
                    maxWidth: `${100 / itemsPerView}%`,
                  }}
                >
                  <Link
                    href={item.href || '/collections/objects-drops'}
                    className="objects-hero__link"
                    aria-label={item.alt || item.title || 'VEYN-OBJECTS'}
                  >
                    <img
                      src={optimizeImageUrl(item.image, 900)}
                      alt={item.alt || item.title || 'VEYN-OBJECTS'}
                      className="objects-hero__image"
                      loading={isPrimaryVisible ? 'eager' : 'lazy'}
                      fetchPriority={isPrimaryVisible ? 'high' : 'auto'}
                      decoding={isPrimaryVisible ? 'sync' : 'async'}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
