'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';
import { optimizeImageUrl } from '@/lib/imageUtils';
import './ImageBanner.css';

export default function ImageBanner({
  targetSection = 'VEYN-SELECTS',
  buttonLink: customButtonLink,
  imageDesktop: customImageDesktop,
  imageMobile: customImageMobile,
  altText: customAltText,
}) {
  const isObjects = targetSection === 'VEYN-OBJECTS';

  const defaultImageDesktop = isObjects
    ? '/images/hero/ObjectHero03.jpg'
    : '/images/ImageBanner.png';

  const defaultImageMobile = isObjects
    ? '/images/hero/ObjectHero03.jpg'
    : '/images/ImageBanner-Mob.png';

  const defaultButtonLink = isObjects
    ? '/collections/objects-drops'
    : '/collections/all-drops';

  const defaultAltText = isObjects
    ? 'VEYN-OBJECTS Artifacts Campaign'
    : 'VEYNCORE Denim Campaign';

  const [banner, setBanner] = useState({
    imageDesktop: customImageDesktop || defaultImageDesktop,
    imageMobile: customImageMobile || defaultImageMobile,
    altText: customAltText || defaultAltText,
    buttonLink: customButtonLink || defaultButtonLink,
    active: true,
  });

  // Fetch dynamic bottom banner settings from backend for the active section
  useEffect(() => {
    let isMounted = true;
    const fetchBanner = async () => {
      try {
        const endpoint = isObjects
          ? `${API_BASE_URL}/api/content/bottomBannerObjects`
          : `${API_BASE_URL}/api/content/bottomBanner`;

        const res = await fetch(endpoint);
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          if (isMounted) {
            setBanner({
              imageDesktop: data.data.imageDesktop || customImageDesktop || defaultImageDesktop,
              imageMobile: data.data.imageMobile || customImageMobile || defaultImageMobile,
              altText: data.data.altText || customAltText || defaultAltText,
              buttonLink: data.data.buttonLink || customButtonLink || defaultButtonLink,
              active: data.data.active !== false,
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setBanner({
            imageDesktop: customImageDesktop || defaultImageDesktop,
            imageMobile: customImageMobile || defaultImageMobile,
            altText: customAltText || defaultAltText,
            buttonLink: customButtonLink || defaultButtonLink,
            active: true,
          });
        }
      }
    };

    fetchBanner();
    return () => {
      isMounted = false;
    };
  }, [
    targetSection,
    isObjects,
    defaultButtonLink,
    defaultImageDesktop,
    defaultImageMobile,
    defaultAltText,
    customButtonLink,
    customImageDesktop,
    customImageMobile,
    customAltText,
  ]);

  if (!banner.active) {
    return null;
  }

  return (
    <section className="image-banner" aria-label={banner.altText || 'VEYNCORE Campaign Banner'}>
      <Link
        href={banner.buttonLink || defaultButtonLink}
        className="image-banner__link"
        aria-label={banner.altText || 'View campaign collection'}
      >
        <picture className="image-banner__picture">
          <source media="(max-width: 768px)" srcSet={optimizeImageUrl(banner.imageMobile, 800)} />
          <img
            src={optimizeImageUrl(banner.imageDesktop, 1600)}
            alt={banner.altText}
            className="image-banner__img"
            loading="lazy"
          />
        </picture>
      </Link>
    </section>
  );
}
