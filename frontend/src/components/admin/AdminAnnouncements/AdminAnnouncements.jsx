'use client';

import React from 'react';
import './AdminAnnouncements.css';

export default function AdminAnnouncements({
  announcements = [],
  onAddAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  onToggleAnnouncement,
}) {
  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">ANNOUNCEMENT TOP BAR TICKER</h1>
          <p className="admin-view__subtitle">
            Configure the infinite animated announcements streaming across the top header banner.
          </p>
        </div>
        <div className="admin-view__actions">
          <button
            type="button"
            className="admin-btn admin-btn--black"
            onClick={onAddAnnouncement}
          >
            + ADD TICKER MESSAGE
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>INDEX</th>
                <th>ANNOUNCEMENT TEXT</th>
                <th>STREAM STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {announcements && announcements.length > 0 ? (
                announcements.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td style={{ fontWeight: 700, color: '#94a3b8' }}>#{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{item.text}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onToggleAnnouncement(idx, 'active')}
                        className={`admin-badge admin-badge--${
                          item.active !== false ? 'active' : 'inactive'
                        } admin-announcements__toggle-btn`}
                      >
                        {item.active !== false ? 'STREAMING LIVE' : 'PAUSED'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Edit Message"
                          onClick={() => onEditAnnouncement(idx)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          title="Delete Message"
                          onClick={() => onDeleteAnnouncement(idx)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No announcements configured. Default ticker will run.
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
