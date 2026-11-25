'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';
import { optimizeImageUrl } from '@/lib/imageUtils';
import './ImageBanner.css';

const cachedBanners = {};

export default function ImageBanner({
  targetSection = 'VEYN-SELECTS',
  buttonLink: customButtonLink,
  imageDesktop: customImageDesktop,
  imageMobile: customImageMobile,
  altText: customAltText,
}) {
  const isObjects = targetSection === 'VEYN-OBJECTS';

  const [banner, setBanner] = useState(() => {
    if (customImageDesktop || customImageMobile) {
      return {
        imageDesktop: customImageDesktop || '',
        imageMobile: customImageMobile || customImageDesktop || '',
        altText: customAltText || 'Campaign Banner',
        buttonLink: customButtonLink || (isObjects ? '/collections/objects-drops' : '/collections/all-drops'),
        active: true,
      };
    }
    return cachedBanners[targetSection] || null;
  });

  // Fetch dynamic bottom banner settings from backend for the active section
  useEffect(() => {
    let isMounted = true;
    const fetchBanner = async () => {
      try {
        const endpoint = isObjects
          ? `${API_BASE_URL}/api/content/bottomBannerObjects?t=${Date.now()}`
          : `${API_BASE_URL}/api/content/bottomBanner?t=${Date.now()}`;

        const res = await fetch(endpoint, { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          const b = data.data;
          const imgDesk = b.imageDesktop || customImageDesktop || '';
          const imgMob = b.imageMobile || customImageMobile || imgDesk;
          const hasImage = Boolean(imgDesk || imgMob);

          const bannerObj = {
            imageDesktop: imgDesk,
            imageMobile: imgMob,
            altText: b.altText || customAltText || (isObjects ? 'VEYN-OBJECTS Campaign' : 'VEYNCORE Campaign'),
            buttonLink: b.buttonLink || customButtonLink || (isObjects ? '/collections/objects-drops' : '/collections/all-drops'),
            active: b.active !== false && hasImage,
          };

          if (isMounted) {
            cachedBanners[targetSection] = bannerObj;
            setBanner(bannerObj);
          }
        }
      } catch (err) {
        // Silently preserve current state
      }
    };

    fetchBanner();
    return () => {
      isMounted = false;
    };
  }, [targetSection, isObjects, customButtonLink, customImageDesktop, customImageMobile, customAltText]);

  // If no dynamic banner image is configured or banner is disabled, do not render
  if (!banner || !banner.active || (!banner.imageDesktop && !banner.imageMobile)) {
    return null;
  }

  return (
    <section className="image-banner" aria-label={banner.altText || 'VEYNCORE Campaign Banner'}>
      <Link
        href={banner.buttonLink || (isObjects ? '/collections/objects-drops' : '/collections/all-drops')}
        className="image-banner__link"
        aria-label={banner.altText || 'View campaign collection'}
      >
        <picture className="image-banner__picture">
          {banner.imageMobile && (
            <source media="(max-width: 768px)" srcSet={optimizeImageUrl(banner.imageMobile, 800)} />
          )}
          <img
            src={optimizeImageUrl(banner.imageDesktop || banner.imageMobile, 1600)}
            alt={banner.altText || 'Campaign Banner'}
            className="image-banner__img"
            loading="lazy"
          />
        </picture>
      </Link>
    </section>
  );
}
