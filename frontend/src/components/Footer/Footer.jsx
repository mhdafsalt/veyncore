'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import ImageBanner from '@/components/ImageBanner/ImageBanner';
import './Footer.css';

export default function Footer({ showBanner = false, activeMainCategory = 'VEYN-SELECTS' }) {
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
      {showBanner && <ImageBanner targetSection={activeMainCategory} />}

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
                      <Link href="/collections/launch-sale" className="modern-footer__accordion-link">
                        LAUNCH SALE
                      </Link>
                    </li>
                    <li>
                      <Link href="/collections/all-drops" className="modern-footer__accordion-link">
                        NEW DROPS
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/contact" className="modern-footer__accordion-link">
                        CONTACT US
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
                        REFUND POLICY
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/shipping-policy" className="modern-footer__accordion-link">
                        SHIPPING POLICY
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
                  <div className="modern-footer__channels-icons" role="list">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modern-footer__channel-icon-btn"
                      aria-label="Instagram"
                      title="Instagram"
                    >
                      <FaInstagram size={18} aria-hidden="true" />
                    </a>
                    <a
                      href="https://wa.me/919446391166"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modern-footer__channel-icon-btn"
                      aria-label="WhatsApp Support"
                      title="WhatsApp Support"
                    >
                      <FaWhatsapp size={19} aria-hidden="true" />
                    </a>
                    <a
                      href="mailto:veyncore.in@gmail.com"
                      className="modern-footer__channel-icon-btn"
                      aria-label="Email Support"
                      title="veyncore.in@gmail.com"
                    >
                      <FaEnvelope size={17} aria-hidden="true" />
                    </a>
                  </div>
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
              width={2798}
              height={369}
              className="modern-footer__monogram-img"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* 4. Bottom Copyright Bar */}
      <div className="modern-footer__bottom-wrapper">
        <div className="modern-footer__container">
          <div className="modern-footer__bottom-inner">
            <p className="modern-footer__copyright">
              &copy; {new Date().getFullYear()} VEYNCORE. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
