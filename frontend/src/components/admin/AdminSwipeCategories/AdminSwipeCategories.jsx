'use client';

import React from 'react';
import './AdminSwipeCategories.css';

export default function AdminSwipeCategories({
  swipeCategories = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleItem,
}) {
  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">HOMEPAGE SWIPE CATEGORIES</h1>
          <p className="admin-view__subtitle">
            Configure horizontal swipeable product collection rows on the homepage (e.g. BAGGY, BOOTCUT, WIDE, STRAIGHT).
          </p>
        </div>
        <div className="admin-view__actions">
          <button
            type="button"
            className="admin-btn admin-btn--black"
            onClick={onAddItem}
          >
            + ADD SWIPE CATEGORY
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>CATEGORY LABEL</th>
                <th>KEY IDENTIFIER</th>
                <th>TARGET SECTION</th>
                <th>COLLECTION ROUTE</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {swipeCategories && swipeCategories.length > 0 ? (
                swipeCategories.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.label}
                          style={{
                            width: '38px',
                            height: '48px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{item.label}</td>
                    <td>
                      <span className="admin-swipe-categories__code-key">
                        {item.key || item.id}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-badge admin-badge--${
                          item.targetSection === 'VEYN-OBJECTS' ? 'objects' : 'selects'
                        }`}
                      >
                        {item.targetSection || 'VEYN-SELECTS'}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#64748b' }}>
                      {item.collectionPath || `/collections/${item.key || item.id}`}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onToggleItem(idx, 'active')}
                        className={`admin-badge admin-badge--${
                          item.active !== false ? 'active' : 'inactive'
                        } admin-swipe-categories__toggle-btn`}
                      >
                        {item.active !== false ? 'ACTIVE ROW' : 'HIDDEN'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Edit Category"
                          onClick={() => onEditItem(idx)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          title="Delete Category"
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
                    No swipe categories configured. Default 4 rows (BAGGY, BOOTCUT, WIDE, STRAIGHT) will be shown.
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
