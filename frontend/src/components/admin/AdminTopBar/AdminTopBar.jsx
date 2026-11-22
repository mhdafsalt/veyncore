'use client';

import React from 'react';
import Link from 'next/link';
import './AdminTopBar.css';

export default function AdminTopBar({ user, onLogout }) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__brand">
        <Link href="/" className="admin-topbar__logo-link">
          <img
            src="/images/veyncoreLogo_black.svg"
            alt="VEYNCORE"
            className="admin-topbar__logo"
          />
        </Link>
        <span className="admin-topbar__tagline">
          ADMIN CONTROL PANEL // VERIFIED SYNDICATE
        </span>
      </div>

      <div className="admin-topbar__user-info">
        <div className="admin-topbar__user-pill">
          <span className="admin-topbar__dot" />
          <span className="admin-topbar__name">{user?.name || user?.email}</span>
          <span className="admin-topbar__badge">ADMIN</span>
        </div>

        <Link href="/" className="admin-topbar__btn admin-topbar__btn--outline">
          STOREFRONT &rarr;
        </Link>
        <button
          type="button"
          className="admin-topbar__btn admin-topbar__btn--primary"
          onClick={onLogout}
        >
          LOGOUT
        </button>
      </div>
    </header>
  );
}
