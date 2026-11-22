'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
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
  slides: initialSlides = BASE_SLIDES,
  autoPlayInterval = 3500,
}) {
  const baseCount = initialSlides.length;

  // Triplicate the slides [copy1, copy2, copy3] for an infinite continuous loop
  const extendedSlides = useMemo(() => {
    return [...initialSlides, ...initialSlides, ...initialSlides];
  }, [initialSlides]);

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

  // Handle transition end: invisible teleport back into the middle set
  const handleTransitionEnd = () => {
    isTransitioningRef.current = false;

    // If we passed the end of the middle set, teleport back to the equivalent position
    if (currentIndex >= baseCount * 2) {
      setEnableTransition(false);
      setCurrentIndex((prev) => prev - baseCount);
    } else if (currentIndex < baseCount) {
      setEnableTransition(false);
      setCurrentIndex((prev) => prev + baseCount);
    }
  };

  // Auto-play timer: always moves forward
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isHovered, autoPlayInterval, handleNext]);

  // Touch Swipe for mobile devices
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

  return (
    <section
      className="hero-carousel-section"
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
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((slide, idx) => (
              <div
                key={`${slide.id}-${idx}`}
                className="hero-carousel__slide"
                style={{
                  flex: `0 0 ${100 / itemsPerView}%`,
                  maxWidth: `${100 / itemsPerView}%`,
                }}
              >
                <Link
                  href={slide.href}
                  className="hero-carousel__card-link"
                  aria-label={`${slide.title} - ${slide.subtitle}`}
                >
                  <img
                    src={slide.image}
                    alt={`${slide.title} - ${slide.subtitle}`}
                    className="hero-carousel__card-image"
                    loading={
                      idx >= baseCount && idx < baseCount + itemsPerView
                        ? 'eager'
                        : 'lazy'
                    }
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
