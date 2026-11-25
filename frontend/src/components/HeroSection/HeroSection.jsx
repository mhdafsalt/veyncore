'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';
import { optimizeImageUrl } from '@/lib/imageUtils';
import './HeroSection.css';

// Default initial slides for instant Frame-0 painting without layout shifts
const defaultSelectsSlides = [
  {
    id: 'item-1795506189161-voni',
    targetSection: 'VEYN-SELECTS',
    image: 'https://res.cloudinary.com/sod0mks1/image/upload/v1795542507/veyncore_uploads/heroimg01-1795542507039-6510.jpg',
    href: '/collections/all-drops?category=tops',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'item-1795506297445-r59l',
    targetSection: 'VEYN-SELECTS',
    image: 'https://res.cloudinary.com/sod0mks1/image/upload/v1795506294/veyncore_uploads/c9041be861aafae7dd6f84bbb2c01821-1795506291741-6512.jpg',
    href: '/collections/all-drops?category=baggy',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'item-1795506325430-4mk0',
    targetSection: 'VEYN-SELECTS',
    image: 'https://res.cloudinary.com/sod0mks1/image/upload/v1795542536/veyncore_uploads/heroimg02-1795542536769-8926.jpg',
    href: '/collections/all-drops',
    sortOrder: 3,
    active: true,
  },
];

let cachedSelectsSlides = defaultSelectsSlides;

export default function HeroSection({
  slides: propSlides = null,
  autoPlayInterval = 3500,
}) {
  const [slides, setSlides] = useState(() => propSlides || cachedSelectsSlides || defaultSelectsSlides);

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
          const selectsSlides = data.data.filter(
            (s) => s.targetSection === 'VEYN-SELECTS' && s.active !== false
          );
          if (selectsSlides.length > 0) {
            cachedSelectsSlides = selectsSlides;
            if (isMounted) {
              setSlides(selectsSlides);
            }
          }
        }
      } catch (err) {
        // Silently preserve current slides
      }
    };

    if (!propSlides) {
      const timer = setTimeout(fetchHeroSlides, 700);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
    return () => {
      isMounted = false;
    };
  }, [propSlides]);

  const baseCount = slides.length;

  // Triplicate the slides [copy1, copy2, copy3] for an infinite continuous loop
  const extendedSlides = useMemo(() => {
    if (!slides || slides.length === 0) return [];
    if (slides.length < 3) {
      return [...slides, ...slides, ...slides, ...slides, ...slides, ...slides];
    }
    return [...slides, ...slides, ...slides];
  }, [slides]);

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

  // Infinite Teleport Reset (seamless jump with transition disabled)
  const handleTransitionEnd = () => {
    isTransitioningRef.current = false;
    if (baseCount === 0) return;

    // Scrolled past the end of the middle set into the right copy
    if (currentIndex >= baseCount * 2) {
      setEnableTransition(false);
      setCurrentIndex(currentIndex - baseCount);
    }
    // Scrolled behind the beginning of the middle set into the left copy
    else if (currentIndex < baseCount) {
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
        handleNext(); // Swiped left -> next
      } else {
        handlePrev(); // Swiped right -> prev
      }
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  if (!slides || slides.length === 0) {
    return (
      <section className="hero-carousel-section" aria-label="Featured Collection Carousel">
        <div className="hero-carousel__container">
          <div className="hero-carousel__viewport">
            <div className="hero-carousel__card-link" style={{ aspectRatio: '341 / 405', backgroundColor: '#f3f3f5' }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="hero-carousel-section"
      id="home"
      aria-label="Featured Collections Infinite Carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hero-carousel__container">
        {/* Slider Viewport Window */}
        <div
          className="hero-carousel__viewport"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`hero-carousel__track ${
              enableTransition ? 'hero-carousel__track--animated' : ''
            }`}
            style={{
              transform: `translate3d(calc(-1 * ${currentIndex} * (100% / var(--hero-items-per-view, ${itemsPerView}))), 0, 0)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((slide, idx) => {
              const isLCP = idx === 0;
              return (
                <div
                  key={`${slide.id}-${idx}`}
                  className="hero-carousel__slide"
                >
                  <Link
                    href={slide.href || '/collections/all-drops'}
                    className="hero-carousel__card-link"
                    aria-label={`${slide.title || 'Collection'} - ${slide.subtitle || ''}`}
                  >
                    <img
                      src={optimizeImageUrl(slide.image, 650)}
                      alt={`${slide.title || 'Collection'} - ${slide.subtitle || ''}`}
                      className="hero-carousel__card-image"
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
