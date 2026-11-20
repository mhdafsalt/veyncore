'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="modern-footer" id="modern-footer">
      {/* 1. Value Pillars / Trust Highlights */}
      <div className="modern-footer__features-wrapper">
        <div className="modern-footer__container">
          <div className="modern-footer__features-grid">
            <div className="modern-footer__feature-card">
              <div className="modern-footer__feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="modern-footer__feature-content">
                <h4 className="modern-footer__feature-title">FREE SHIPPING</h4>
                <p className="modern-footer__feature-desc">All India orders above ₹1,499</p>
              </div>
            </div>

            <div className="modern-footer__feature-card">
              <div className="modern-footer__feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </div>
              <div className="modern-footer__feature-content">
                <h4 className="modern-footer__feature-title">7-DAY EXCHANGES</h4>
                <p className="modern-footer__feature-desc">Hassle-free size & fit exchanges</p>
              </div>
            </div>

            <div className="modern-footer__feature-card">
              <div className="modern-footer__feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="modern-footer__feature-content">
                <h4 className="modern-footer__feature-title">SECURE CHECKOUT</h4>
                <p className="modern-footer__feature-desc">Encrypted UPI, Cards & COD</p>
              </div>
            </div>

            <div className="modern-footer__feature-card">
              <div className="modern-footer__feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="modern-footer__feature-content">
                <h4 className="modern-footer__feature-title">100% COTTON DENIM</h4>
                <p className="modern-footer__feature-desc">Heavyweight custom woven denim</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. VIP Drop Newsletter Section */}
      <div className="modern-footer__newsletter-wrapper">
        <div className="modern-footer__container">
          <div className="modern-footer__newsletter-box">
            <div className="modern-footer__newsletter-copy">
              <span className="modern-footer__newsletter-tag">EXCLUSIVE DROPS &amp; EARLY ACCESS</span>
              <h3 className="modern-footer__newsletter-heading">JOIN THE VEYNCORE VIP CLUB</h3>
              <p className="modern-footer__newsletter-subtext">
                Be the first to get access to limited edition denim cuts, secret sales, and private restocks.
              </p>
            </div>

            <div className="modern-footer__newsletter-form-container">
              {subscribed ? (
                <div className="modern-footer__newsletter-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>You are on the VIP drop list. Welcome to Veyncore.</span>
                </div>
              ) : (
                <form className="modern-footer__newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    className="modern-footer__newsletter-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email address for drop notifications"
                  />
                  <button type="submit" className="modern-footer__newsletter-button">
                    <span>SUBSCRIBE</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </form>
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

      {/* 5. Bottom Copyright Bar (Terms & Conditions Left | Copyright Center | Privacy Policy Right) */}
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
