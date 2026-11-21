'use client';

import React from 'react';
import Link from 'next/link';
import './ImageBanner.css';

export default function ImageBanner({
  tag = 'RAW DENIM ARCHIVE',
  title = 'ENGINEERED FOR CONTEMPORARY STREETWEAR',
  subtitle = 'Heavyweight denim silhouettes, tailored wide cuts, and authentic raw craftsmanship.',
  buttonText = 'EXPLORE ALL DROPS',
  buttonLink = '/collections/all-drops',
  imageDesktop = '/images/hero.jpg',
  imageMobile = '/images/hero/heroimg01.jpg',
  altText = 'VEYNCORE Denim Campaign',
}) {
  return (
    <section className="image-banner" aria-label="VEYNCORE Campaign Banner">
      <div className="image-banner__media-wrapper">
        <picture>
          <source media="(max-width: 768px)" srcSet={imageMobile} />
          <img
            src={imageDesktop}
            alt={altText}
            className="image-banner__img"
            loading="lazy"
          />
        </picture>
        <div className="image-banner__overlay" />
      </div>

      <div className="image-banner__content-container">
        <div className="image-banner__content">
          {tag && <span className="image-banner__tag">{tag}</span>}
          {title && <h2 className="image-banner__title">{title}</h2>}
          {subtitle && <p className="image-banner__subtitle">{subtitle}</p>}
          {buttonText && buttonLink && (
            <Link href={buttonLink} className="image-banner__cta-btn">
              <span>{buttonText}</span>
              <svg
                className="image-banner__cta-arrow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
