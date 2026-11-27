'use client';

import React from 'react';
import './AdminOverview.css';

export default function AdminOverview({
  metrics,
  products = [],
  siteContent,
  onAddProduct,
  onNavigateTab,
}) {
  const selectsCount = products.filter((p) => p.category === 'VEYN-SELECTS').length;
  const objectsCount = products.filter((p) => p.category === 'VEYN-OBJECTS').length;
  const activeAnnouncements = siteContent?.announcements?.filter((a) => a.active)?.length || 0;

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">COMMAND CENTER OVERVIEW</h1>
          <p className="admin-view__subtitle">
            Real-time database analytics and store configuration summary.
          </p>
        </div>
        <div className="admin-view__actions">
          <button
            type="button"
            className="admin-btn admin-btn--black"
            onClick={onAddProduct}
          >
            + ADD NEW PRODUCT
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card" onClick={() => onNavigateTab('products')} role="button" tabIndex={0}>
          <span className="admin-kpi-card__label">TOTAL PRODUCTS</span>
          <div className="admin-kpi-card__val">{products.length}</div>
          <span className="admin-kpi-card__sub">
            {selectsCount} Selects &bull; {objectsCount} Objects
          </span>
        </div>

        <div className="admin-kpi-card" onClick={() => onNavigateTab('users')} role="button" tabIndex={0}>
          <span className="admin-kpi-card__label">REGISTERED USERS</span>
          <div className="admin-kpi-card__val">{metrics?.totalUsers ?? 0}</div>
          <span className="admin-kpi-card__sub">Authenticated via MongoDB</span>
        </div>

        <div
          className="admin-kpi-card admin-kpi-card--whatsapp"
          onClick={() => onNavigateTab('whatsappOrders')}
          role="button"
          tabIndex={0}
        >
          <span className="admin-kpi-card__label">WHATSAPP ORDERS</span>
          <div className="admin-kpi-card__val">
            {metrics?.totalOrders !== undefined && metrics?.totalOrders > 0
              ? metrics.totalOrders
              : metrics?.whatsappClicks ?? 0}
          </div>
          <span className="admin-kpi-card__sub">
            {metrics?.totalOrders !== undefined && metrics?.totalOrders > 0
              ? `${metrics.pendingOrders || 0} Pending • ${metrics.confirmedOrders || 0} Confirmed`
              : 'Direct WhatsApp order button clicks'}
          </span>
        </div>

        <div className="admin-kpi-card" onClick={() => onNavigateTab('announcements')} role="button" tabIndex={0}>
          <span className="admin-kpi-card__label">ACTIVE ANNOUNCEMENTS</span>
          <div className="admin-kpi-card__val">{activeAnnouncements}</div>
          <span className="admin-kpi-card__sub">Streaming on top ticker</span>
        </div>
      </div>

      {/* Quick Jump Grid */}
      <div className="admin-shortcuts">
        <h3 className="admin-section-heading">QUICK MANAGEMENT SHORTCUTS</h3>
        <div className="admin-shortcuts__grid">
          <button
            type="button"
            className="admin-shortcut-card"
            onClick={() => onNavigateTab('products')}
          >
            <span className="admin-shortcut-card__icon">🛍️</span>
            <div>
              <h4>Manage Products</h4>
              <p>Add, edit price, images, sizes, and stock status.</p>
            </div>
          </button>

          <button
            type="button"
            className="admin-shortcut-card"
            onClick={() => onNavigateTab('hero')}
          >
            <span className="admin-shortcut-card__icon">🖼️</span>
            <div>
              <h4>Hero Carousel</h4>
              <p>Update homepage slides, hero text, and call-to-actions.</p>
            </div>
          </button>

          <button
            type="button"
            className="admin-shortcut-card"
            onClick={() => onNavigateTab('subcategories')}
          >
            <span className="admin-shortcut-card__icon">⚡️</span>
            <div>
              <h4>Subcategories Bar</h4>
              <p>Manage sticky navigation items and glowing tags.</p>
            </div>
          </button>

          <button
            type="button"
            className="admin-shortcut-card"
            onClick={() => onNavigateTab('bottomBanner')}
          >
            <span className="admin-shortcut-card__icon">📢</span>
            <div>
              <h4>Selects Bottom Banner</h4>
              <p>Customize the editorial denim campaign banner.</p>
            </div>
          </button>

          <button
            type="button"
            className="admin-shortcut-card"
            onClick={() => onNavigateTab('objectsBanner')}
          >
            <span className="admin-shortcut-card__icon">🏺</span>
            <div>
              <h4>Objects Image Banner</h4>
              <p>Customize the editorial artifacts campaign image banner.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Users preview */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">RECENT USER REGISTRATIONS</h3>
          <button
            type="button"
            className="admin-btn admin-btn--xs admin-btn--outline"
            onClick={() => onNavigateTab('users')}
          >
            VIEW ALL USERS
          </button>
        </div>
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>MOBILE</th>
                <th>ROLE</th>
                <th>VIP</th>
                <th>JOINED</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.recentUsers && metrics.recentUsers.length > 0 ? (
                metrics.recentUsers.slice(0, 5).map((u) => (
                  <tr key={u._id || u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.mobileNumber || '—'}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-badge admin-badge--${
                          u.vipNotifications ? 'vip' : 'standard'
                        }`}
                      >
                        {u.vipNotifications ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>
                    No users registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
