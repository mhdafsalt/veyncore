'use client';

import React from 'react';
import './AdminUsers.css';

export default function AdminUsers({
  users = [],
  loading = false,
  onRefresh,
}) {
  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">REGISTERED USERS &amp; VIP MEMBERS</h1>
          <p className="admin-view__subtitle">
            Authenticated customer accounts with phone numbers and VIP drop alert opt-in status.
          </p>
        </div>
        <div className="admin-view__actions">
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={onRefresh}
          >
            ↻ Refresh Users
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>MOBILE NUMBER</th>
                <th>ROLE</th>
                <th>VIP NOTIFICATIONS</th>
                <th>REGISTERED</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id || u.id}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{u.name}</td>
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
                        {u.vipNotifications ? '✓ OPTED-IN' : 'NO'}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    {loading ? 'Loading user records...' : 'No users registered yet.'}
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
