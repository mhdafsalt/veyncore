'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { API_BASE_URL } from '@/lib/constants';
import './AdminWhatsAppOrders.css';

export default function AdminWhatsAppOrders({ metrics, getAuthHeaders }) {
  const [clicks, setClicks] = useState(metrics?.recentWhatsAppClicks || []);
  const [totalCount, setTotalCount] = useState(metrics?.whatsappClicks || 0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');

  const fetchClicks = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders ? getAuthHeaders() : { 'Content-Type': 'application/json' };
      const res = await fetch(`${API_BASE_URL}/api/analytics/whatsapp-clicks?limit=100`, {
        headers,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setClicks(json.data.clicks || []);
          setTotalCount(json.data.totalClicks ?? json.data.clicks?.length ?? 0);
        }
      }
    } catch (err) {
      console.warn('Failed to load WhatsApp clicks log:', err);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchClicks();
  }, [fetchClicks]);

  // Keep synced if metrics updates
  useEffect(() => {
    if (metrics?.whatsappClicks !== undefined) {
      setTotalCount(metrics.whatsappClicks);
    }
    if (metrics?.recentWhatsAppClicks && metrics.recentWhatsAppClicks.length > 0 && clicks.length === 0) {
      setClicks(metrics.recentWhatsAppClicks);
    }
  }, [metrics]);

  const filteredClicks = useMemo(() => {
    return clicks.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        (item.productTitle && item.productTitle.toLowerCase().includes(q)) ||
        (item.productHandle && item.productHandle.toLowerCase().includes(q)) ||
        (item.size && item.size.toLowerCase().includes(q)) ||
        (item.source && item.source.toLowerCase().includes(q));

      const matchSource =
        sourceFilter === 'ALL' || item.source === sourceFilter;

      return matchQuery && matchSource;
    });
  }, [clicks, searchQuery, sourceFilter]);

  // Calculate metrics
  const todayCount = useMemo(() => {
    const todayStr = new Date().toDateString();
    return clicks.filter((c) => new Date(c.createdAt).toDateString() === todayStr).length;
  }, [clicks]);

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">WHATSAPP ORDER CLICKS</h1>
          <p className="admin-view__subtitle">
            Real-time tracking of customers who initiated a Direct WhatsApp Order.
          </p>
        </div>
        <div className="admin-view__actions">
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={fetchClicks}
            disabled={loading}
          >
            {loading ? 'REFRESHING...' : '🔄 REFRESH CLICKS'}
          </button>
        </div>
      </div>

      {/* Mini KPI Cards */}
      <div className="admin-whatsapp-kpi-grid">
        <div className="admin-whatsapp-kpi-card">
          <span className="admin-whatsapp-kpi-card__label">TOTAL CLICKED PERSONS</span>
          <div className="admin-whatsapp-kpi-card__val">{totalCount}</div>
          <span className="admin-whatsapp-kpi-card__sub">All-time WhatsApp button interactions</span>
        </div>

        <div className="admin-whatsapp-kpi-card">
          <span className="admin-whatsapp-kpi-card__label">TODAY'S CLICKS</span>
          <div className="admin-whatsapp-kpi-card__val">{todayCount}</div>
          <span className="admin-whatsapp-kpi-card__sub">Initiated in the past 24 hours</span>
        </div>

        <div className="admin-whatsapp-kpi-card">
          <span className="admin-whatsapp-kpi-card__label">PRIMARY CONVERSION SOURCE</span>
          <div className="admin-whatsapp-kpi-card__val admin-whatsapp-kpi-card__val--source">
            Product Detail
          </div>
          <span className="admin-whatsapp-kpi-card__sub">PDP &bull; Quick-Buy &bull; Cart</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-whatsapp-toolbar">
        <div className="admin-search-wrap">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by product, size, or handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <div className="admin-whatsapp-filter-buttons">
          {['ALL', 'product_detail', 'cart_drawer', 'quick_buy'].map((src) => (
            <button
              key={src}
              type="button"
              className={`admin-whatsapp-filter-btn ${
                sourceFilter === src ? 'admin-whatsapp-filter-btn--active' : ''
              }`}
              onClick={() => setSourceFilter(src)}
            >
              {src === 'ALL'
                ? 'All Sources'
                : src === 'product_detail'
                ? 'PDP'
                : src === 'cart_drawer'
                ? 'Cart Drawer'
                : 'Quick Buy'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">
            LOGGED INTERACTIONS ({filteredClicks.length})
          </h3>
        </div>

        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>PRODUCT</th>
                <th>SIZE</th>
                <th>PRICE</th>
                <th>SOURCE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredClicks.length > 0 ? (
                filteredClicks.map((click, idx) => (
                  <tr key={click._id || click.id || idx}>
                    <td style={{ color: '#64748b', whiteSpace: 'nowrap' }}>
                      {click.createdAt
                        ? new Date(click.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })
                        : 'Just now'}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>
                        {click.productTitle || 'Product'}
                      </div>
                      {click.productHandle && (
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          /{click.productHandle}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="admin-badge admin-badge--standard">
                        {click.size || '—'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {click.price
                        ? `Rs. ${Number(click.price).toLocaleString('en-IN')}`
                        : '—'}
                    </td>
                    <td>
                      <span className="admin-whatsapp-badge-source">
                        {click.source === 'cart_drawer'
                          ? 'Cart Drawer'
                          : click.source === 'quick_buy'
                          ? 'Quick Buy'
                          : 'Product Page'}
                      </span>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge--vip">
                        DIRECT WHATSAPP
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: 'center', color: '#64748b', padding: '36px' }}
                  >
                    {searchQuery || sourceFilter !== 'ALL'
                      ? 'No WhatsApp clicks match your current filter.'
                      : 'No WhatsApp order button clicks recorded yet. Clicks will appear here automatically when shoppers click "Direct WhatsApp Order".'}
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
