'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';
import './HeroSection.css';

// In-memory module cache for instant Frame-0 painting
let cachedSelectsSlides = null;

/**
 * Optimizes Cloudinary URLs on-the-fly with auto-format (WebP/AVIF),
 * perceptual quality compression, and size capping for ultra-fast loading.
 */
function optimizeImageUrl(url, width = 900) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (url.includes('/f_auto,q_auto')) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }
  return url;
}

export default function HeroSection({
  slides: propSlides = null,
  autoPlayInterval = 3500,
}) {
  const [slides, setSlides] = useState(() => propSlides || cachedSelectsSlides || []);

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
          cachedSelectsSlides = selectsSlides;
          if (isMounted) {
            setSlides(selectsSlides);
          }
        }
      } catch (err) {
        // Silently preserve current slides
      }
    };

    if (!propSlides) {
      fetchHeroSlides();
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

  // Start at the beginning of the middle set so we can loop infinitely in both directions
  const [currentIndex, setCurrentIndex] = useState(baseCount);
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

  // Update currentIndex when slides count changes
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

  // Auto-play timer (advances forward only)
  useEffect(() => {
    if (isHovered || baseCount === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
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
    return null;
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
              transform: `translate3d(-${currentIndex * (100 / itemsPerView)}%, 0, 0)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((slide, idx) => {
              const isPrimaryVisible = idx >= baseCount && idx < baseCount + itemsPerView;
              return (
                <div
                  key={`${slide.id}-${idx}`}
                  className="hero-carousel__slide"
                  style={{
                    flex: `0 0 ${100 / itemsPerView}%`,
                    maxWidth: `${100 / itemsPerView}%`,
                  }}
                >
                  <Link
                    href={slide.href || '/collections/all-drops'}
                    className="hero-carousel__card-link"
                    aria-label={`${slide.title || 'Collection'} - ${slide.subtitle || ''}`}
                  >
                    <img
                      src={optimizeImageUrl(slide.image, 900)}
                      alt={`${slide.title || 'Collection'} - ${slide.subtitle || ''}`}
                      className="hero-carousel__card-image"
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
