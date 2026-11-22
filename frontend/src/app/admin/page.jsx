'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/constants';
import './admin.css';

export default function AdminPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, logout, openAuthModal } = useAuth();

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    vipUsers: 0,
    adminCount: 0,
    recentUsers: [],
  });
  const [loadingData, setLoadingData] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);

  // Fetch admin overview metrics if authenticated as admin
  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== 'admin') {
      setLoadingData(false);
      return;
    }

    const fetchOverview = async () => {
      try {
        const storedToken = token || localStorage.getItem('veyncore_token');
        const res = await fetch(`${API_BASE_URL}/api/admin/overview`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMetrics(data.data);
          setApiStatus({ ok: true, message: 'Admin API Verified (200 OK)' });
        } else {
          setApiStatus({
            ok: false,
            message: data.message || `Error status ${res.status}`,
          });
        }
      } catch (err) {
        setApiStatus({ ok: false, message: 'Could not connect to Admin API' });
      } finally {
        setLoadingData(false);
      }
    };

    fetchOverview();
  }, [user, token, isLoading]);

  // Loading state
  if (isLoading || loadingData) {
    return (
      <div className="admin-page">
        <div className="admin-denied">
          <p>VERIFYING AUTHORIZATION CREDENTIALS...</p>
        </div>
      </div>
    );
  }

  // Unauthorized or Non-Admin state (Strict Access Denial per Requirement 5)
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="admin-denied">
          <span className="admin-denied__badge">403 FORBIDDEN</span>
          <h1 className="admin-denied__title">ACCESS RESTRICTED</h1>
          <p className="admin-denied__desc">
            The Veyncore Administrator Control Panel requires verified administrator
            privileges. Normal customer accounts are not permitted to access this sector.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/" className="admin-btn admin-btn--primary">
              RETURN TO STORE
            </Link>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={() => openAuthModal('login')}
            >
              SIGN IN AS ADMIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verified Admin View
  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header__brand">
            <img
              src="/images/veyncoreLogo_black.svg"
              alt="VEYNCORE"
              className="admin-header__logo"
            />
            <span className="admin-header__tagline">
              CONTROL PANEL // ADMINISTRATOR SYNDICATE
            </span>
          </div>

          <div className="admin-header__actions">
            <Link href="/" className="admin-btn admin-btn--outline">
              STOREFRONT
            </Link>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => {
                logout();
                router.push('/');
              }}
            >
              SIGN OUT
            </button>
          </div>
        </header>

        {/* API Verification Status */}
        {apiStatus && (
          <div className="admin-verify-box">
            <div className="admin-verify-box__info">
              <h4 className="admin-verify-box__title">BACKEND API AUTHORIZATION STATUS</h4>
              <p className="admin-verify-box__desc">
                Authenticated as: <strong>{user.email}</strong> (Role: <strong>{user.role}</strong>)
              </p>
            </div>
            <span
              className={`admin-verify-box__status ${
                apiStatus.ok
                  ? 'admin-verify-box__status--ok'
                  : 'admin-verify-box__status--err'
              }`}
            >
              {apiStatus.message}
            </span>
          </div>
        )}

        {/* Overview Stats */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-card__label">TOTAL REGISTERED USERS</span>
            <span className="admin-stat-card__value">{metrics.totalUsers}</span>
            <span className="admin-stat-card__sub">Stored in MongoDB User Collection</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-card__label">VIP SYNDICATE SUBSCRIBERS</span>
            <span className="admin-stat-card__value">{metrics.vipUsers}</span>
            <span className="admin-stat-card__sub">Opted-in for raw denim archives</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-card__label">ACTIVE ADMINISTRATORS</span>
            <span className="admin-stat-card__value">{metrics.adminCount}</span>
            <span className="admin-stat-card__sub">Role: 'admin' verified</span>
          </div>
        </div>

        {/* User Directory Table */}
        <section className="admin-section">
          <div className="admin-section__header">
            <h3 className="admin-section__title">RECENT USER REGISTRATIONS</h3>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL ADDRESS</th>
                  <th>MOBILE</th>
                  <th>ROLE</th>
                  <th>VIP STATUS</th>
                  <th>REGISTERED DATE</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentUsers && metrics.recentUsers.length > 0 ? (
                  metrics.recentUsers.map((u) => (
                    <tr key={u._id || u.id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.mobileNumber || '—'}</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            u.role === 'admin'
                              ? 'admin-badge--admin'
                              : 'admin-badge--user'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-badge ${
                            u.vipNotifications
                              ? 'admin-badge--vip'
                              : 'admin-badge--standard'
                          }`}
                        >
                          {u.vipNotifications ? 'VIP NOTIFICATIONS' : 'STANDARD'}
                        </span>
                      </td>
                      <td style={{ color: '#71717a' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#71717a' }}>
                      No registered users found in database yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
