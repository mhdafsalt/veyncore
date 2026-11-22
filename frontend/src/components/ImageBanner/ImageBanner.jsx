'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';
import './ImageBanner.css';

export default function ImageBanner({
  buttonLink: defaultButtonLink = '/collections/all-drops',
  imageDesktop: defaultImageDesktop = '/images/ImageBanner.png',
  imageMobile: defaultImageMobile = '/images/ImageBanner-Mob.png',
  altText: defaultAltText = 'VEYNCORE Denim Campaign',
}) {
  const [banner, setBanner] = useState({
    imageDesktop: defaultImageDesktop,
    imageMobile: defaultImageMobile,
    altText: defaultAltText,
    buttonLink: defaultButtonLink,
    active: true,
  });

  // Fetch dynamic bottom banner settings from backend
  useEffect(() => {
    let isMounted = true;
    const fetchBanner = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content/bottomBanner`);
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          if (isMounted) {
            setBanner({
              imageDesktop: data.data.imageDesktop || defaultImageDesktop,
              imageMobile: data.data.imageMobile || defaultImageMobile,
              altText: data.data.altText || defaultAltText,
              buttonLink: data.data.buttonLink || defaultButtonLink,
              active: data.data.active !== false,
            });
          }
        }
      } catch (err) {
        // Fallback to defaults
      }
    };

    fetchBanner();
    return () => {
      isMounted = false;
    };
  }, [defaultButtonLink, defaultImageDesktop, defaultImageMobile, defaultAltText]);

  if (!banner.active) {
    return null;
  }

  return (
    <section className="image-banner" aria-label="VEYNCORE Campaign Banner">
      <Link href={banner.buttonLink || '/collections/all-drops'} className="image-banner__link" aria-label="View campaign collection">
        <picture>
          <source media="(max-width: 768px)" srcSet={banner.imageMobile} />
          <img
            src={banner.imageDesktop}
            alt={banner.altText}
            className="image-banner__img"
            loading="lazy"
          />
        </picture>
      </Link>
    </section>
  );
}
