'use client';

import React from 'react';
import Link from 'next/link';
import './AdminTopBar.css';

export default function AdminTopBar({
  user,
  mobileMenuOpen,
  setMobileMenuOpen,
  onSignOut,
}) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <button
          type="button"
          className="admin-mobile-menu-btn"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span className={`admin-mobile-burger ${mobileMenuOpen ? 'admin-mobile-burger--open' : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>

        <img
          src="/images/veyncoreLogo_black.svg"
          alt="VEYNCORE"
          className="admin-topbar__logo"
        />

        <div className="admin-topbar__badge">
          <span className="admin-topbar__dot" />
          <span className="admin-topbar__badge-text">LIVE ADMIN CONSOLE</span>
        </div>
      </div>

      <div className="admin-topbar__right">
        <div className="admin-topbar__user">
          <span className="admin-topbar__user-email">{user?.email || 'admin@veyncore.in'}</span>
          <span className="admin-topbar__user-role">ADMINISTRATOR</span>
        </div>

        <Link
          href="/"
          className="admin-topbar__btn admin-topbar__btn--outline admin-hide-mobile"
          target="_blank"
        >
          VIEW STORE ↗
        </Link>

        <button
          type="button"
          className="admin-topbar__btn admin-topbar__btn--black"
          onClick={onSignOut}
        >
          SIGN OUT
        </button>
      </div>
    </header>
  );
}
