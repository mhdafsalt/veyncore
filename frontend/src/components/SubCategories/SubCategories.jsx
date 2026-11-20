'use client';

import React, { useState, useRef, useEffect } from 'react';
import './SubCategories.css';

const SELECTS_SUBCATEGORIES = [
  { id: 'home', label: 'HOME', href: '#home', hasDropdown: false },
  { id: 'flash-sale', label: 'FLASH SALE⚡️', href: '#flash-sale', isGlow: true, hasDropdown: false },
  { id: 'new-drops', label: 'NEW DROPS', href: '#new-drops', isGlow: true, hasDropdown: false },
  { id: 'all-drops', label: 'ALL DROPS', href: '#all-drops', hasDropdown: false },
  {
    id: 'denims',
    label: 'DENIMS',
    href: '#denims',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Baggy Jeans', href: '#denims-baggy' },
      { label: 'Bootcut Denims', href: '#denims-bootcut' },
      { label: 'Wide Leg Denims', href: '#denims-wide' },
      { label: 'Straight Fit', href: '#denims-straight' },
      { label: 'Raw & Selvedge', href: '#denims-raw' }
    ]
  },
  {
    id: 'cargo',
    label: 'CARGO',
    href: '#cargo',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Parachute Pants', href: '#cargo-parachute' },
      { label: 'Multi-Pocket Cargos', href: '#cargo-multi' },
      { label: 'Utility Wide Pants', href: '#cargo-utility' }
    ]
  },
  { id: 'baggy', label: 'BAGGY', href: '#baggy', hasDropdown: false },
  { id: 'bootcut', label: 'BOOTCUT', href: '#bootcut', hasDropdown: false },
  { id: 'wide', label: 'WIDE', href: '#wide', hasDropdown: false },
  { id: 'straight', label: 'STRAIGHT', href: '#straight', hasDropdown: false },
  {
    id: 'tops',
    label: 'TOPS',
    href: '#tops',
    hasDropdown: true,
    dropdownItems: [
      { label: 'T-Shirts & Tees', href: '#tops-tees' },
      { label: 'Shirts & Overshirts', href: '#tops-shirts' },
      { label: 'Hoodies & Sweats', href: '#tops-hoodies' },
      { label: 'Jackets & Outerwear', href: '#tops-jackets' }
    ]
  },
  {
    id: 'accessories',
    label: 'ACCESSORIES',
    href: '#accessories',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Belts & Buckles', href: '#accessories-belts' },
      { label: 'Caps & Headwear', href: '#accessories-caps' },
      { label: 'Jewelry & Chains', href: '#accessories-jewelry' },
      { label: 'Wallets & Pouches', href: '#accessories-wallets' }
    ]
  }
];

const ORIGINALS_SUBCATEGORIES = [
  { id: 'orig-home', label: 'SELECTS HOME', href: '#orig-home', hasDropdown: false },
  { id: 'orig-vault', label: 'ARCHIVE VAULT ⚡️', href: '#orig-vault', isGlow: true, hasDropdown: false },
  { id: 'orig-signature', label: 'SIGNATURE DROP', href: '#orig-signature', isGlow: true, hasDropdown: false },
  {
    id: 'orig-tees',
    label: 'GRAPHIC TEES',
    href: '#orig-tees',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Vintage Boxy Tees', href: '#orig-boxy' },
      { label: 'Oversized Graphics', href: '#orig-oversized' },
      { label: 'Acid Wash Tees', href: '#orig-acid' }
    ]
  },
  {
    id: 'orig-hoodies',
    label: 'HEAVY FLEECE',
    href: '#orig-hoodies',
    hasDropdown: true,
    dropdownItems: [
      { label: '450 GSM Hoodies', href: '#orig-hoodies-450' },
      { label: 'Zip-Up Sweats', href: '#orig-zipup' },
      { label: 'Raw Edge Crews', href: '#orig-raw-crews' }
    ]
  },
  { id: 'orig-caps', label: 'HEADWEAR', href: '#orig-caps', hasDropdown: false },
  { id: 'orig-lookbook', label: 'LOOKBOOK', href: '#orig-lookbook', hasDropdown: false }
];

export default function SubCategories({ activeMainCategory = 'VEYN-OBJECTS' }) {
  const [activeSubId, setActiveSubId] = useState('home');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

  const subcategories =
    activeMainCategory === 'VEYN-SELECTS'
      ? ORIGINALS_SUBCATEGORIES
      : SELECTS_SUBCATEGORIES;

  // Reset active tab when parent main category changes
  useEffect(() => {
    if (activeMainCategory === 'VEYN-SELECTS') {
      setActiveSubId('orig-home');
    } else {
      setActiveSubId('home');
    }
    setOpenDropdownId(null);
  }, [activeMainCategory]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, []);

  // Center active tab in scrollable container on mobile/tablet
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const tab = activeTabRef.current;
      const targetScroll =
        tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      } else {
        container.scrollLeft = Math.max(0, targetScroll);
      }
    }
  }, [activeSubId]);

  const handleTabClick = (e, item) => {
    if (item.hasDropdown) {
      e.preventDefault();
      setOpenDropdownId((prev) => (prev === item.id ? null : item.id));
    } else {
      setActiveSubId(item.id);
      setOpenDropdownId(null);
    }
  };

  const handleDropdownItemClick = (e, parentId) => {
    setActiveSubId(parentId);
    setOpenDropdownId(null);
  };

  const activeDropdownItem = subcategories.find((c) => c.id === openDropdownId);

  return (
    <div
      className={`subcategories ${openDropdownId ? 'subcategories--open' : ''}`}
      aria-label="Subcategory navigation"
    >
      <div className="subcategories__wrap">
        <div
          ref={containerRef}
          className="subcategories__list"
          role="tablist"
        >
          {subcategories.map((item, index) => {
            const isActive = activeSubId === item.id;
            const isDropdownOpen = openDropdownId === item.id;
            const isNearRightEdge = index >= subcategories.length - 2;

            return (
              <div
                key={item.id}
                ref={isActive ? activeTabRef : null}
                className={`subcategories__item ${
                  isActive ? 'subcategories__item--active' : ''
                } ${item.isGlow ? 'subcategories__item--glow' : ''} ${
                  item.hasDropdown ? 'subcategories__item--has-dropdown' : ''
                } ${isDropdownOpen ? 'subcategories__item--open' : ''}`}
                onMouseEnter={() => {
                  if (item.hasDropdown && typeof window !== 'undefined' && window.innerWidth > 1024) {
                    setOpenDropdownId(item.id);
                  }
                }}
                onMouseLeave={() => {
                  if (item.hasDropdown && typeof window !== 'undefined' && window.innerWidth > 1024) {
                    setOpenDropdownId(null);
                  }
                }}
              >
                <a
                  href={item.href}
                  className={`subcategories__link ${
                    isActive ? 'subcategories__link--active' : ''
                  } ${item.isGlow ? 'subcategories__link--glow' : ''}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-haspopup={item.hasDropdown ? 'true' : 'false'}
                  aria-expanded={item.hasDropdown ? isDropdownOpen : undefined}
                  onClick={(e) => handleTabClick(e, item)}
                >
                  <span className="subcategories__label">{item.label}</span>
                  {item.hasDropdown && (
                    <svg
                      className={`subcategories__chevron ${
                        isDropdownOpen ? 'subcategories__chevron--rotated' : ''
                      }`}
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 1L4 4L7 1"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </a>

                {/* Dropdown Menu (Desktop) */}
                {item.hasDropdown && (
                  <div
                    className={`subcategories__dropdown ${
                      isDropdownOpen ? 'subcategories__dropdown--open' : ''
                    } ${isNearRightEdge ? 'subcategories__dropdown--align-right' : ''}`}
                    role="menu"
                  >
                    <ul className="subcategories__dropdown-list">
                      {item.dropdownItems.map((sub) => (
                        <li
                          key={sub.label}
                          className="subcategories__dropdown-item"
                          role="none"
                        >
                          <a
                            href={sub.href}
                            className="subcategories__dropdown-link"
                            role="menuitem"
                            onClick={(e) => handleDropdownItemClick(e, item.id)}
                          >
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Panel (Unclipped by horizontal scroll) */}
      {activeDropdownItem && (
        <div className="subcategories__mobile-panel" role="region" aria-label="Subcategory options">
          <div className="subcategories__mobile-panel-inner">
            <div className="subcategories__mobile-panel-header">
              <span className="subcategories__mobile-panel-title">
                {activeDropdownItem.label} Categories
              </span>
              <button
                type="button"
                className="subcategories__mobile-panel-close"
                onClick={() => setOpenDropdownId(null)}
                aria-label="Close categories"
              >
                ✕
              </button>
            </div>
            <div className="subcategories__mobile-panel-tags">
              {activeDropdownItem.dropdownItems.map((sub) => (
                <a
                  key={sub.label}
                  href={sub.href}
                  className="subcategories__mobile-panel-chip"
                  onClick={(e) => handleDropdownItemClick(e, activeDropdownItem.id)}
                >
                  {sub.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
