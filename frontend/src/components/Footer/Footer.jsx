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
                      <Link href="/pages/about" className="modern-footer__accordion-link">
                        ABOUT VEYNCORE
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
                        TERMS & CONDITIONS
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
                      href="https://www.instagram.com/veyncore.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modern-footer__channel-icon-btn"
                      aria-label="Instagram"
                      title="Instagram"
                    >
                      <FaInstagram size={18} aria-hidden="true" />
                    </a>
                    <a
                      href="https://pin.it/1bxJr9Grd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modern-footer__channel-icon-btn"
                      aria-label="Pinterest"
                      title="Pinterest"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.377-.291 1.199-.332 1.366-.053.225-.177.271-.409.165-1.523-.71-2.474-2.937-2.474-4.73 0-3.854 2.8-7.396 8.077-7.396 4.241 0 7.537 3.023 7.537 7.063 0 4.215-2.657 7.608-6.347 7.608-1.239 0-2.404-.645-2.803-1.408l-.763 2.909c-.275 1.058-1.02 2.384-1.522 3.193C9.914 23.86 10.938 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                      </svg>
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
