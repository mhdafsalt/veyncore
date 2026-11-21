'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ImageBanner from '@/components/ImageBanner/ImageBanner';
import './Footer.css';

export default function Footer({ showBanner = false }) {
  const [openSections, setOpenSections] = useState({
    quickLinks: false,
    policies: false,
    channels: false
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <footer className="modern-footer" id="modern-footer">
      {/* 1. Image Banner Section (at the top of the footer on Homepage) */}
      {showBanner && <ImageBanner />}

      {/* 2. Collapsible Navigation Accordions (QUICK LINKS, POLICIES, CHANNELS) */}
      <div className="modern-footer__nav-wrapper">
        <div className="modern-footer__container">
          <div className="modern-footer__accordions">
            {/* QUICK LINKS */}
            <div className="modern-footer__accordion">
              <button
                type="button"
                className="modern-footer__accordion-trigger"
                onClick={() => toggleSection('quickLinks')}
                aria-expanded={openSections.quickLinks}
              >
                <span className="modern-footer__accordion-title">QUICK LINKS</span>
                <svg
                  className={`modern-footer__accordion-chevron ${
                    openSections.quickLinks ? 'modern-footer__accordion-chevron--rotated' : ''
                  }`}
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {openSections.quickLinks && (
                <div className="modern-footer__accordion-content">
                  <ul className="modern-footer__accordion-list">
                    <li>
                      <Link href="/" className="modern-footer__accordion-link">
                        HOME
                      </Link>
                    </li>
                    <li>
                      <Link href="/collections/all-drops" className="modern-footer__accordion-link">
                        ALL DROPS
                      </Link>
                    </li>
                    <li>
                      <Link href="/#flash-sale" className="modern-footer__accordion-link">
                        FLASH SALE
                      </Link>
                    </li>
                    <li>
                      <Link href="/collections/all-drops" className="modern-footer__accordion-link">
                        NEW DROPS
                      </Link>
                    </li>
                    <li>
                      <Link href="#track-order" className="modern-footer__accordion-link">
                        TRACK YOUR ORDER
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* POLICIES */}
            <div className="modern-footer__accordion">
              <button
                type="button"
                className="modern-footer__accordion-trigger"
                onClick={() => toggleSection('policies')}
                aria-expanded={openSections.policies}
              >
                <span className="modern-footer__accordion-title">POLICIES</span>
                <svg
                  className={`modern-footer__accordion-chevron ${
                    openSections.policies ? 'modern-footer__accordion-chevron--rotated' : ''
                  }`}
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {openSections.policies && (
                <div className="modern-footer__accordion-content">
                  <ul className="modern-footer__accordion-list">
                    <li>
                      <Link href="/pages/terms-of-service" className="modern-footer__accordion-link">
                        TERMS &amp; CONDITIONS
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/privacy-policy" className="modern-footer__accordion-link">
                        PRIVACY POLICY
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/refund-policy" className="modern-footer__accordion-link">
                        REFUND &amp; CANCELLATION
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/shipping-policy" className="modern-footer__accordion-link">
                        SHIPPING &amp; DELIVERY
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* CHANNELS */}
            <div className="modern-footer__accordion">
              <button
                type="button"
                className="modern-footer__accordion-trigger"
                onClick={() => toggleSection('channels')}
                aria-expanded={openSections.channels}
              >
                <span className="modern-footer__accordion-title">CHANNELS</span>
                <svg
                  className={`modern-footer__accordion-chevron ${
                    openSections.channels ? 'modern-footer__accordion-chevron--rotated' : ''
                  }`}
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {openSections.channels && (
                <div className="modern-footer__accordion-content">
                  <ul className="modern-footer__accordion-list">
                    <li>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modern-footer__accordion-link"
                      >
                        INSTAGRAM
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://wa.me/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modern-footer__accordion-link"
                      >
                        WHATSAPP SUPPORT
                      </a>
                    </li>
                    <li>
                      <a
                        href="mailto:support@veyncore.com"
                        className="modern-footer__accordion-link"
                      >
                        EMAIL: SUPPORT@VEYNCORE.COM
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Monumental Large Brand Banner */}
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

      {/* 4. Bottom Copyright Bar (Terms & Conditions Left | Copyright Center | Privacy Policy Right) */}
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
