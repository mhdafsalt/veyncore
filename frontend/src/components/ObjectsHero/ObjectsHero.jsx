'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';
import { optimizeImageUrl } from '@/lib/imageUtils';
import './ObjectsHero.css';

const defaultObjectsSlides = [
  {
    id: 'obj-slide-3',
    targetSection: 'VEYN-OBJECTS',
    title: 'Tactical Artifacts & Caps',
    subtitle: 'DISTRESSED UTILITY',
    tag: 'ESSENTIALS',
    image: '/images/hero/ObjectHero03.png',
    href: '/collections/objects-drops',
    description: '',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'item-1795506485735-7nf5',
    targetSection: 'VEYN-OBJECTS',
    image: 'https://res.cloudinary.com/sod0mks1/image/upload/v1795506476/veyncore_uploads/24bc592b40ca58fc89ae4dc630b3b10f-1795506472410-1309.jpg',
    href: '/collections/objects-drops?category=shades',
    sortOrder: 4,
    active: true,
  },
  {
    id: 'item-1795506542135-1l3n',
    targetSection: 'VEYN-OBJECTS',
    image: 'https://res.cloudinary.com/sod0mks1/image/upload/v1795506537/veyncore_uploads/unnamed__1_-1795506535210-5755.jpg',
    href: '/collections/objects-drops?category=baggy',
    sortOrder: 5,
    active: true,
  },
];

let cachedObjectsSlides = defaultObjectsSlides;

export default function ObjectsHero({
  images: propImages = null,
  autoPlayInterval = 3500,
}) {
  const [images, setImages] = useState(() => propImages || cachedObjectsSlides || defaultObjectsSlides);

  // Fetch dynamic hero slides from backend (keeps state synced in background)
  useEffect(() => {
    let isMounted = true;
    const fetchHeroSlides = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content/heroSlides?t=${Date.now()}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
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
      const timer = setTimeout(fetchHeroSlides, 700);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
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

  // Start at index 0 so slide 0 paints immediately at x: 0 without negative offscreen shifts
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  const isTransitioningRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Responsive items-per-view
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          setItemsPerView(1); // Mobile: 1 box
        } else if (window.innerWidth < 1024) {
          setItemsPerView(2); // Tablet: 2 boxes
        } else {
          setItemsPerView(3); // Desktop/Laptop: 3 boxes
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Advance forward continuously
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
    setCurrentIndex((prev) => (prev <= 0 ? baseCount - 1 : prev - 1));
  }, [baseCount]);

  // Auto-play timer with generous initial delay to lock and stabilize LCP
  useEffect(() => {
    if (isHovered || baseCount === 0) return;
    let interval = null;
    const initialTimer = setTimeout(() => {
      interval = setInterval(() => {
        handleNext();
      }, autoPlayInterval);
    }, 12000);

    return () => {
      clearTimeout(initialTimer);
      if (interval) clearInterval(interval);
    };
  }, [isHovered, autoPlayInterval, handleNext, baseCount]);

  // Infinite Teleport Reset
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
    return (
      <section className="objects-hero" aria-label="Loading VEYN-OBJECTS">
        <div className="objects-hero__container">
          <div className="objects-hero__viewport">
            <div className="objects-hero__link" style={{ aspectRatio: '341 / 405', backgroundColor: '#f3f3f5' }} />
          </div>
        </div>
      </section>
    );
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
              transform: `translate3d(calc(-1 * ${currentIndex} * (100% / var(--objects-items-per-view, ${itemsPerView}))), 0, 0)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((item, idx) => {
              const isLCP = idx === 0;
              return (
                <div
                  key={`${item.id || 'slide'}-${idx}`}
                  className="objects-hero__item"
                >
                  <Link
                    href={item.href || '/collections/objects-drops'}
                    className="objects-hero__link"
                    aria-label={item.alt || item.title || 'VEYN-OBJECTS'}
                  >
                    <img
                      src={optimizeImageUrl(item.image, 650)}
                      alt={item.alt || item.title || 'VEYN-OBJECTS'}
                      className="objects-hero__image"
                      width={341}
                      height={405}
                      loading="eager"
                      fetchPriority={isLCP ? 'high' : 'auto'}
                      decoding="sync"
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
