'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './HeroSection.css';

// Default images from blurgvillage reference
const BLURG_DESKTOP_IMG =
  './images/hero.jpg';
const BLURG_MOBILE_IMG =
  'https://blurgvillage.com/cdn/shop/files/IMG_8502.jpg?v=1793365621&width=1080';

const LOCAL_FALLBACK_DESKTOP = '/images/hero-desktop.svg';
const LOCAL_FALLBACK_MOBILE = '/images/hero-mobile.svg';

export default function HeroSection({
  desktopImage = BLURG_DESKTOP_IMG,
  mobileImage = BLURG_MOBILE_IMG,
  ctaText = 'EDGE',
  ctaLink = '/collections/originals-edge',
  alt = 'Veyncore Campaign Hero',
}) {
  const [desktopSrc, setDesktopSrc] = useState(desktopImage);
  const [mobileSrc, setMobileSrc] = useState(mobileImage);

  const handleDesktopError = () => {
    if (desktopSrc !== LOCAL_FALLBACK_DESKTOP) {
      setDesktopSrc(LOCAL_FALLBACK_DESKTOP);
    }
  };

  const handleMobileError = () => {
    if (mobileSrc !== LOCAL_FALLBACK_MOBILE) {
      setMobileSrc(LOCAL_FALLBACK_MOBILE);
    }
  };

  return (
    <section className="hero-section" aria-label="Hero Banner">
      <div className="hero-section__container">
        {/* Desktop / Laptop Banner (Widescreen) */}
        <img
          className="hero-section__image hero-section__image--desktop"
          src={desktopSrc}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          onError={handleDesktopError}
        />

        {/* Mobile Banner (Vertical / Portrait) */}
        <img
          className="hero-section__image hero-section__image--mobile"
          src={mobileSrc}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          onError={handleMobileError}
        />

        {/* Hero Overlay with Glassmorphic CTA Button */}
        <div className="hero-section__overlay">
          <div className="hero-section__button-group">
            <Link
              href={ctaLink}
              className="hero-section__cta"
              aria-label={ctaText}
            >
              <span className="hero-section__cta-text">{ctaText}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
