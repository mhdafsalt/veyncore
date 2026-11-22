'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';
import './HeroSection.css';

const BASE_SLIDES = [
  {
    id: 'wide-leg',
    title: 'Wide Leg Fit',
    subtitle: 'Best Choice',
    image: '/images/hero/heroimg01.jpg',
    href: '/collections/wide-leg',
  },
  {
    id: 'veyn-selects',
    title: 'Veyn Selects',
    subtitle: 'Curated Denims',
    image: '/images/hero/heroimg02.jpg',
    href: '/collections/veyn-selects',
  },
  {
    id: 'baggy-fit',
    title: 'Baggy Fit',
    subtitle: 'Most Selling',
    image: '/images/hero/heroimg03.jpg',
    href: '/collections/baggy',
  },
];

export default function HeroSection({
  slides: propSlides = null,
  autoPlayInterval = 3500,
}) {
  const [slides, setSlides] = useState(propSlides || BASE_SLIDES);

  // Fetch dynamic hero slides from backend
  useEffect(() => {
    let isMounted = true;
    const fetchHeroSlides = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content/heroSlides`);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const selectsSlides = data.data.filter(
            (s) => s.targetSection === 'VEYN-SELECTS' && s.active !== false
          );
          if (isMounted && selectsSlides.length > 0) {
            setSlides(selectsSlides);
          }
        }
      } catch (err) {
        // Fallback to BASE_SLIDES
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
      if (window.innerWidth < 768) {
        setItemsPerView(1); // Mobile: 1 box
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2); // Tablet: 2 boxes
      } else {
        setItemsPerView(3); // Desktop/Laptop: 3 boxes
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

  // Previous slide
  const handlePrev = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Auto-play timer (advances forward only)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isHovered, autoPlayInterval, handleNext]);

  // Infinite Teleport Reset (seamless jump with transition disabled)
  const handleTransitionEnd = () => {
    isTransitioningRef.current = false;

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

  // Track transform calculation: shift by (100% / itemsPerView) per index
  const translatePercent = -(currentIndex * (100 / itemsPerView));

  return (
    <section
      className="hero-section"
      aria-label="Featured Collections Carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-section__viewport">
        <div
          className="hero-section__track"
          style={{
            transform: `translate3d(${translatePercent}%, 0, 0)`,
            transition: enableTransition
              ? 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, idx) => (
            <div
              key={`${slide.id}-${idx}`}
              className="hero-section__slide"
              style={{ flex: `0 0 ${100 / itemsPerView}%` }}
            >
              <Link
                href={slide.href || '/collections/all-drops'}
                className="hero-card"
                aria-label={slide.title}
              >
                <div className="hero-card__image-container">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="hero-card__image"
                    loading={idx < itemsPerView ? 'eager' : 'lazy'}
                  />
                  <div className="hero-card__overlay">
                    <span className="hero-card__subtitle">{slide.subtitle}</span>
                    <h3 className="hero-card__title">{slide.title}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Circular Left Arrow */}
        <button
          type="button"
          className="hero-section__arrow hero-section__arrow--prev"
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Circular Right Arrow */}
        <button
          type="button"
          className="hero-section__arrow hero-section__arrow--next"
          onClick={handleNext}
          aria-label="Next slide"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
