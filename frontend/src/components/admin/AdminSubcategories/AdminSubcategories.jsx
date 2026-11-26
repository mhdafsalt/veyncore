'use client';

import React from 'react';
import './AdminSubcategories.css';

export default function AdminSubcategories({
  subcategories = [],
  loading = false,
  onRefresh,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleItem,
}) {
  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">SUBCATEGORIES NAVIGATION BAR</h1>
          <p className="admin-view__subtitle">
            Manage the sticky top horizontal secondary subcategories navigation tabs for both VEYN-SELECTS &amp; VEYN-OBJECTS.
          </p>
        </div>
        <div className="admin-view__actions">
          {onRefresh && (
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh subcategories from database"
            >
              ↻ Refresh
            </button>
          )}
          <button
            type="button"
            className="admin-btn admin-btn--black"
            onClick={onAddItem}
          >
            + ADD SUBCATEGORY TAB
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>LABEL</th>
                <th>MAIN CATEGORY</th>
                <th>TARGET ROUTE</th>
                <th>GLOW EFFECT</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span className="admin-loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                      <span>Loading subcategories from database...</span>
                    </div>
                  </td>
                </tr>
              ) : subcategories && subcategories.length > 0 ? (
                subcategories.map((sub, idx) => (
                  <tr key={sub.id || idx}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      {sub.label}
                      {sub.isGlow && (
                        <span style={{ marginLeft: '6px', fontSize: '11px', color: '#f59e0b' }}>
                          ⚡️ Glow
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`admin-badge admin-badge--${
                          sub.mainCategory === 'VEYN-OBJECTS' ? 'objects' : 'selects'
                        }`}
                      >
                        {sub.mainCategory || 'VEYN-SELECTS'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'Inter, monospace', fontSize: '11.5px', color: '#64748b' }}>
                      {sub.href}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onToggleItem(idx, 'isGlow')}
                        className={`admin-badge admin-badge--${
                          sub.isGlow ? 'vip' : 'standard'
                        } admin-subcategories__toggle-btn`}
                      >
                        {sub.isGlow ? 'GLOW ACTIVE' : 'NO GLOW'}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onToggleItem(idx, 'active')}
                        className={`admin-badge admin-badge--${
                          sub.active !== false ? 'active' : 'inactive'
                        } admin-subcategories__toggle-btn`}
                      >
                        {sub.active !== false ? 'ACTIVE' : 'HIDDEN'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Edit Subcategory"
                          onClick={() => onEditItem(idx)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          title="Delete Subcategory"
                          onClick={() => onDeleteItem(idx)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No custom subcategories configured. Site will use default tabs.
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
