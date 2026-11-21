'use client';

import React from 'react';
import Link from 'next/link';
import ImageBanner from '@/components/ImageBanner/ImageBanner';
import './Footer.css';

export default function Footer({ showBanner = false }) {
  return (
    <footer className="modern-footer" id="modern-footer">
      {/* 1. Image Banner Section (at the top of the footer) */}
      {showBanner && <ImageBanner />}

      {/* 2. Monumental Large Brand Banner */}
      <div className="modern-footer__banner-wrapper">
        <div className="modern-footer__container">
          <div className="modern-footer__monogram">
            <img
              src="/images/veyncoreLogo_f3f3f5.svg"
              alt="VEYNCORE"
              className="modern-footer__monogram-img"
            />
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright Bar (Terms & Conditions Left | Copyright Center | Privacy Policy Right) */}
      <div className="modern-footer__bottom-wrapper">
        <div className="modern-footer__container">
          <div className="modern-footer__bottom-inner">
            <div className="modern-footer__bottom-left">
              <Link href="/pages/terms-of-service" className="modern-footer__bottom-link">
                Terms &amp; Conditions
              </Link>
            </div>

            <div className="modern-footer__bottom-center">
              <p className="modern-footer__copyright">
                &copy; {new Date().getFullYear()} VEYNCORE. ALL RIGHTS RESERVED.
              </p>
            </div>

            <div className="modern-footer__bottom-right">
              <Link href="/pages/privacy-policy" className="modern-footer__bottom-link">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
