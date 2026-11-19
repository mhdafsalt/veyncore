'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import './Navbar.css';

const POPULAR_SEARCHES = ['Baggy', 'Bootcut', 'Bracelet', 'Cargo', 'Denims', 'Raw Wide', 'Tops'];

const SEARCH_PRODUCTS = [
  {
    id: 'artic-blue-wide',
    title: 'ARTIC BLUE WIDE',
    originalPrice: 'Rs. 1,599.00',
    salePrice: 'Rs. 1,199.00',
    image: '/images/products/artic-blue-wide.jpg',
    href: '#artic-blue-wide'
  },
  {
    id: 'brick-dark-wide',
    title: 'BRICK DARK WIDE',
    originalPrice: 'Rs. 1,499.00',
    salePrice: 'Rs. 1,099.00',
    image: '/images/products/brick-dark-wide.jpg',
    href: '#brick-dark-wide'
  },
  {
    id: 'cloud-blue-wide',
    title: 'CLOUD BLUE WIDE',
    originalPrice: 'Rs. 1,699.00',
    salePrice: 'Rs. 1,149.00',
    image: '/images/products/cloud-blue-wide.jpg',
    href: '#cloud-blue-wide'
  },
  {
    id: 'core-blue-wide',
    title: 'CORE BLUE WIDE',
    originalPrice: 'Rs. 1,399.00',
    salePrice: 'Rs. 1,049.00',
    image: '/images/products/core-blue-wide.jpg',
    href: '#core-blue-wide'
  }
];

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

  const filteredProducts = searchQuery.trim()
    ? SEARCH_PRODUCTS.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_PRODUCTS;

  return (
    <header className={`navbar ${isMenuOpen || isSearchOpen ? 'navbar--drawer-open' : ''}`}>
      <div className="navbar__container">
        {/* Left: Hamburger menu toggle & Search button */}
        <div className="navbar__left-actions">
          <button
            type="button"
            className="navbar__toggle-button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="navbar__icon navbar__icon--menu"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="8" x2="21" y2="8" />
              <line x1="3" y1="16" x2="21" y2="16" />
            </svg>
          </button>

          <button
            type="button"
            className="navbar__action-button navbar__action-button--search"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search store"
          >
            <svg
              className="navbar__icon navbar__icon--search"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7.2" />
              <line x1="21" y1="21" x2="16.3" y2="16.3" />
            </svg>
          </button>
        </div>

        {/* Center: Brand Logo */}
        <div className="navbar__logo-wrapper">
          <Link href="/" className="navbar__logo" aria-label="veyncore Home">
            <img
              src="/images/veyncoreLogo_black.svg"
              alt="veyncore"
              className="navbar__logo-img"
              width="180"
              height="24"
            />
          </Link>
        </div>

        {/* Right: Actions (Account & Cart) */}
        <div className="navbar__actions">
          {/* Account Button */}
          <Link
            href="#account"
            className="navbar__action-button navbar__action-button--account"
            aria-label="My Account"
          >
            <svg
              className="navbar__icon navbar__icon--account"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="7" r="4.2" />
              <path d="M5 21a7 7 0 0 1 14 0" />
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
                className="navbar__icon navbar__icon--cart"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9h12l1.2 11.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 9z" />
                <path d="M9 9V6.5a3 3 0 0 1 6 0V9" />
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

      {/* Search Modal Panel - Exact Reference Replication */}
      <div
        className={`navbar__search-backdrop ${
          isSearchOpen ? 'navbar__search-backdrop--active' : ''
        }`}
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`navbar__search-modal ${
          isSearchOpen ? 'navbar__search-modal--open' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Search Store"
      >
        {/* Top Search Input Row */}
        <div className="navbar__search-input-row">
          <span className="navbar__search-input-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7.5" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
          </span>

          <input
            ref={searchInputRef}
            type="search"
            className="navbar__search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxLength={128}
            autoComplete="off"
          />

          <button
            type="button"
            className="navbar__search-close-btn"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="1" y1="13" x2="13" y2="1" />
            </svg>
          </button>
        </div>

        {/* Search Results / Products Section */}
        <div className="navbar__search-products-section">
          <p className="navbar__search-section-title">Products</p>

          {filteredProducts.length > 0 ? (
            <div className="navbar__search-products-grid">
              {filteredProducts.map((product) => (
                <a
                  key={product.id}
                  href={product.href}
                  className="navbar__search-product-card"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <div className="navbar__search-product-image-wrap">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="navbar__search-product-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="navbar__search-product-info">
                    <h4 className="navbar__search-product-name">
                      {product.title}
                    </h4>
                    <div className="navbar__search-product-prices">
                      <span className="navbar__search-product-original-price">
                        {product.originalPrice}
                      </span>
                      <span className="navbar__search-product-sale-price">
                        {product.salePrice}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="navbar__search-no-results">
              <p>No products found matching &ldquo;{searchQuery}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
