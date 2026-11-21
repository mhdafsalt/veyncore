'use client';

import React from 'react';
import Link from 'next/link';
import './ImageBanner.css';

export default function ImageBanner({
  buttonLink = '/collections/all-drops',
  imageDesktop = '/images/ImageBanner.png',
  imageMobile = '/images/ImageBanner-Mob.png',
  altText = 'VEYNCORE Denim Campaign',
}) {
  return (
    <section className="image-banner" aria-label="VEYNCORE Campaign Banner">
      <Link href={buttonLink} className="image-banner__link" aria-label="View campaign collection">
        <picture>
          <source media="(max-width: 768px)" srcSet={imageMobile} />
          <img
            src={imageDesktop}
            alt={altText}
            className="image-banner__img"
            loading="lazy"
          />
        </picture>
      </Link>
    </section>
  );
}
