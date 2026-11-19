'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import './Navbar.css';

const POPULAR_SEARCHES = ['Baggy', 'Bootcut', 'Bracelet', 'Cargo', 'Denims', 'Raw Wide', 'Tops'];

export default function Navbar({ activeMainCategory = 'BLURG-SELECTS', onSelectCategory }) {
  const { openCart, totalCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const searchInputRef = useRef(null);

  // Close drawers on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isSearchOpen]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 150);
    }
  }, [isSearchOpen]);

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleCategoryClick = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`navbar ${isMenuOpen || isSearchOpen ? 'navbar--drawer-open' : ''}`}>
      <div className="navbar__container">
        {/* Left: Hamburger menu toggle */}
        <div className="navbar__menu-toggle-wrapper">
          <button
            type="button"
            className="navbar__toggle-button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="navbar__toggle-icon"
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M13 14.5H31"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 19.5H22.47"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 24.5H31"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 29.5H22.47"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Center: Brand Logo */}
        <div className="navbar__logo-wrapper">
          <Link href="/" className="navbar__logo" aria-label="BLURGVILLAGE Home">
            <span className="navbar__logo-text">BLURGVILLAGE</span>
          </Link>
        </div>

        {/* Right: Actions (Search, Account, Cart) */}
        <div className="navbar__actions">
          {/* Search Button */}
          <button
            type="button"
            className="navbar__action-button navbar__action-button--search"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search store"
          >
            <svg
              className="navbar__icon"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M10.546 19.167a8.62 8.62 0 1 0 0-17.241 8.62 8.62 0 0 0 0 17.241ZM20.073 20.074l-1.815-1.815"
              />
            </svg>
          </button>

          {/* Account Button (hidden on tablet/mobile) */}
          <Link
            href="#account"
            className="navbar__action-button navbar__action-button--account"
            aria-label="My Account"
          >
            <svg
              className="navbar__icon"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20.7234 20.0751C19.6588 18.2845 18.2153 16.8151 16.5209 15.7975C14.8265 14.7798 12.9335 14.2452 11.0099 14.2412C9.08637 14.2372 7.19164 14.7639 5.49382 15.7744C3.79601 16.785 2.29912 18.2968 1.22855 20.083"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle
                cx="10.9992"
                cy="6.24623"
                r="4.32143"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </Link>

          {/* Cart Button with Count Badge */}
          <button
            type="button"
            className="navbar__action-button navbar__action-button--cart"
            onClick={openCart}
            aria-label={`Cart with ${totalCount} items`}
          >
            <div className="navbar__cart-icon-wrapper">
              <svg
                className="navbar__icon"
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M17.8565 12.925H26.1362C30.046 12.925 30.437 14.7868 30.7015 17.0585L31.7365 25.8407C32.0699 28.7213 31.196 31.0749 27.1711 31.0749H16.833C12.7967 31.0749 11.9227 28.7213 12.2677 25.8407L13.3027 17.0585C13.5557 14.7868 13.9466 12.925 17.8565 12.925Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.7002 17.2585C18.7002 19.4587 20.5393 20.35 22.0002 20.35C23.4611 20.35 25.3002 19.4587 25.3002 17.2585"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {totalCount > 0 && (
                <span className="navbar__badge" aria-hidden="true">
                  {totalCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Drawer (Mobile & Desktop Slide Drawer) */}
      <div
        className={`navbar__drawer-backdrop ${
          isMenuOpen ? 'navbar__drawer-backdrop--active' : ''
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <nav
        className={`navbar__drawer ${
          isMenuOpen ? 'navbar__drawer--open' : ''
        }`}
        aria-label="Side menu"
      >
        <div className="navbar__drawer-header">
          <span className="navbar__drawer-title">MENU</span>
          <button
            type="button"
            className="navbar__drawer-close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="navbar__drawer-body">
          <ul className="navbar__drawer-menu">
            <li className="navbar__drawer-item">
              <Link
                href="/"
                className="navbar__drawer-link"
                onClick={() => setIsMenuOpen(false)}
              >
                HOME
              </Link>
            </li>

            <li className="navbar__drawer-item">
              <button
                type="button"
                className={`navbar__drawer-link navbar__drawer-link--button ${
                  activeMainCategory === 'BLURG-ORIGINALS'
                    ? 'navbar__drawer-link--active'
                    : ''
                }`}
                onClick={() => handleCategoryClick('BLURG-ORIGINALS')}
              >
                BLURG-ORIGINALS
              </button>
            </li>

            <li className="navbar__drawer-item">
              <button
                type="button"
                className={`navbar__drawer-link navbar__drawer-link--button ${
                  activeMainCategory === 'BLURG-SELECTS'
                    ? 'navbar__drawer-link--active'
                    : ''
                }`}
                onClick={() => handleCategoryClick('BLURG-SELECTS')}
              >
                BLURG-SELECTS
              </button>
            </li>

            {/* Accordion: COLLECTIONS */}
            <li className="navbar__drawer-item navbar__drawer-item--accordion">
              <button
                type="button"
                className="navbar__drawer-accordion-header"
                onClick={() => toggleSubmenu('collections')}
                aria-expanded={openSubmenu === 'collections'}
              >
                <span>COLLECTIONS</span>
                <svg
                  className={`navbar__drawer-chevron ${
                    openSubmenu === 'collections'
                      ? 'navbar__drawer-chevron--rotated'
                      : ''
                  }`}
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <ul
                className={`navbar__drawer-submenu ${
                  openSubmenu === 'collections'
                    ? 'navbar__drawer-submenu--open'
                    : ''
                }`}
              >
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#denims"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    DENIMS
                  </Link>
                </li>
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#cargo"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    CARGO
                  </Link>
                </li>
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#baggy"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    BAGGY
                  </Link>
                </li>
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#bootcut"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    BOOTCUT
                  </Link>
                </li>
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#wide"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    WIDE
                  </Link>
                </li>
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#straight"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    STRAIGHT
                  </Link>
                </li>
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#tops"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    TOPS
                  </Link>
                </li>
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#accessories"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ACCESSORIES
                  </Link>
                </li>
              </ul>
            </li>

            <li className="navbar__drawer-item">
              <Link
                href="#flash-sale"
                className="navbar__drawer-link navbar__drawer-link--highlight"
                onClick={() => setIsMenuOpen(false)}
              >
                FLASH SALE ⚡️
              </Link>
            </li>

            <li className="navbar__drawer-item">
              <Link
                href="#new-drops"
                className="navbar__drawer-link navbar__drawer-link--highlight"
                onClick={() => setIsMenuOpen(false)}
              >
                NEW DROPS
              </Link>
            </li>

            <li className="navbar__drawer-item">
              <Link
                href="#track-order"
                className="navbar__drawer-link"
                onClick={() => setIsMenuOpen(false)}
              >
                TRACK ORDER
              </Link>
            </li>

            {/* Accordion: POLICIES */}
            <li className="navbar__drawer-item navbar__drawer-item--accordion">
              <button
                type="button"
                className="navbar__drawer-accordion-header"
                onClick={() => toggleSubmenu('policies')}
                aria-expanded={openSubmenu === 'policies'}
              >
                <span>POLICIES</span>
                <svg
                  className={`navbar__drawer-chevron ${
                    openSubmenu === 'policies'
                      ? 'navbar__drawer-chevron--rotated'
                      : ''
                  }`}
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <ul
                className={`navbar__drawer-submenu ${
                  openSubmenu === 'policies'
                    ? 'navbar__drawer-submenu--open'
                    : ''
                }`}
              >
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#privacy"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#refund"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Refund Policy
                  </Link>
                </li>
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#shipping"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li className="navbar__drawer-subitem">
                  <Link
                    href="#terms"
                    className="navbar__drawer-sublink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </li>

            <li className="navbar__drawer-item">
              <Link
                href="#contact"
                className="navbar__drawer-link"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT US
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar__drawer-footer">
          <Link
            href="#account"
            className="navbar__drawer-account-link"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20.7234 20.0751C19.6588 18.2845 18.2153 16.8151 16.5209 15.7975C14.8265 14.7798 12.9335 14.2452 11.0099 14.2412C9.08637 14.2372 7.19164 14.7639 5.49382 15.7744C3.79601 16.785 2.29912 18.2968 1.22855 20.083"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle
                cx="10.9992"
                cy="6.24623"
                r="4.32143"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
            <span>Log in / Sign up</span>
          </Link>
        </div>
      </nav>

      {/* Search Drawer Panel */}
      <div
        className={`navbar__search-backdrop ${
          isSearchOpen ? 'navbar__search-backdrop--active' : ''
        }`}
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`navbar__search-drawer ${
          isSearchOpen ? 'navbar__search-drawer--open' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="navbar__search-header">
          <span className="navbar__search-title">Search</span>
          <button
            type="button"
            className="navbar__search-close"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="navbar__search-body">
          <form
            className="navbar__search-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert(`Searching for: ${searchQuery}`);
            }}
          >
            <div className="navbar__search-input-wrap">
              <button
                type="submit"
                className="navbar__search-submit"
                aria-label="Submit search"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 21 21">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M10.546 19.167a8.62 8.62 0 1 0 0-17.241 8.62 8.62 0 0 0 0 17.241ZM20.075 20.074 18.26 18.26"
                  />
                </svg>
              </button>

              <input
                ref={searchInputRef}
                type="search"
                className="navbar__search-input"
                placeholder="Search products, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                maxLength={128}
                autoComplete="off"
              />

              {searchQuery && (
                <button
                  type="button"
                  className="navbar__search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear query"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 2L12 12M2 12L12 2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </form>

          <div className="navbar__search-popular">
            <p className="navbar__search-popular-title">POPULAR SEARCHES</p>
            <div className="navbar__search-tags">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="navbar__search-tag"
                  onClick={() => setSearchQuery(tag)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 1v14M1 8h14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
