'use client';

import React, { useState, useEffect, useMemo } from 'react';
import LaunchSaleModal from './LaunchSaleModal';
import DeleteConfirmModal from '../AdminCommon/DeleteConfirmModal';
import './AdminLaunchSale.css';

/**
 * Format milliseconds into "DDd : HHh : MMm : SSs"
 */
const formatTimeRemaining = (ms) => {
  if (ms <= 0) return '00h : 00m : 00s';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, '0');

  if (days > 0) {
    return `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
  }
  return `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
};

/**
 * Format ISO datetime for table cell
 */
const formatScheduleDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminLaunchSale({
  launchSales = [],
  products = [],
  loading = false,
  onRefresh,
  onCreateSale,
  onUpdateSale,
  onToggleStatus,
  onDeleteSale,
  isSaving = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Real-time ticking interval every second for live countdown precision
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live status and countdown for each sale item
  const salesWithComputedStatus = useMemo(() => {
    return (launchSales || []).map((sale) => {
      const start = new Date(sale.startDateTime).getTime();
      const end = new Date(sale.endDateTime).getTime();
      let liveStatus = sale.status;

      if (liveStatus !== 'paused') {
        if (currentTime < start) {
          liveStatus = 'scheduled';
        } else if (currentTime > end) {
          liveStatus = 'expired';
        } else {
          liveStatus = 'active';
        }
      }

      let countdownText = '—';
      let countdownClass = '';

      if (liveStatus === 'paused') {
        countdownText = 'PAUSED';
        countdownClass = 'admin-sale-countdown--paused';
      } else if (liveStatus === 'scheduled') {
        const msUntilStart = Math.max(0, start - currentTime);
        countdownText = `Starts in ${formatTimeRemaining(msUntilStart)}`;
        countdownClass = 'admin-sale-countdown--scheduled';
      } else if (liveStatus === 'active') {
        const msUntilEnd = Math.max(0, end - currentTime);
        countdownText = formatTimeRemaining(msUntilEnd);
      } else {
        countdownText = 'EXPIRED';
        countdownClass = 'admin-sale-countdown--expired';
      }

      return {
        ...sale,
        liveStatus,
        countdownText,
        countdownClass,
      };
    });
  }, [launchSales, currentTime]);

  // Counts for filter pills
  const counts = useMemo(() => {
    const res = { all: 0, active: 0, scheduled: 0, paused: 0, expired: 0 };
    salesWithComputedStatus.forEach((s) => {
      res.all += 1;
      if (s.liveStatus === 'active') res.active += 1;
      else if (s.liveStatus === 'scheduled') res.scheduled += 1;
      else if (s.liveStatus === 'paused') res.paused += 1;
      else if (s.liveStatus === 'expired') res.expired += 1;
    });
    return res;
  }, [salesWithComputedStatus]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    return salesWithComputedStatus.filter((sale) => {
      if (filterStatus !== 'ALL' && sale.liveStatus !== filterStatus.toLowerCase()) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const title = (sale.product?.title || sale.productId?.title || '').toLowerCase();
      const cat = (sale.product?.subCategory || sale.product?.category || '').toLowerCase();
      return title.includes(q) || cat.includes(q);
    });
  }, [salesWithComputedStatus, filterStatus, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingSale(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (payload) => {
    if (editingSale) {
      await onUpdateSale(editingSale._id, payload);
    } else {
      await onCreateSale(payload);
    }
    setIsModalOpen(false);
    setEditingSale(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await onDeleteSale(deleteTarget._id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="admin-view">
      {/* Header */}
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">LAUNCH SALE MANAGEMENT</h1>
          <p className="admin-view__subtitle">
            Manage promotional products, discounts, and individual sale countdowns.
          </p>
        </div>
        <div className="admin-view__actions">
          {onRefresh && (
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh launch sales from database"
            >
              ↻ Refresh
            </button>
          )}
          <button
            type="button"
            className="admin-btn admin-btn--black"
            onClick={handleOpenAddModal}
          >
            + ADD LAUNCH SALE PRODUCT
          </button>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="admin-launch-sale-toolbar">
        {/* Filter Pills */}
        <div className="admin-filter-pills">
          <button
            type="button"
            className={`admin-filter-pill ${filterStatus === 'ALL' ? 'admin-filter-pill--active' : ''}`}
            onClick={() => setFilterStatus('ALL')}
          >
            ALL ({counts.all})
          </button>
          <button
            type="button"
            className={`admin-filter-pill ${filterStatus === 'ACTIVE' ? 'admin-filter-pill--active' : ''}`}
            onClick={() => setFilterStatus('ACTIVE')}
          >
            ACTIVE ({counts.active})
          </button>
          <button
            type="button"
            className={`admin-filter-pill ${filterStatus === 'SCHEDULED' ? 'admin-filter-pill--active' : ''}`}
            onClick={() => setFilterStatus('SCHEDULED')}
          >
            SCHEDULED ({counts.scheduled})
          </button>
          <button
            type="button"
            className={`admin-filter-pill ${filterStatus === 'PAUSED' ? 'admin-filter-pill--active' : ''}`}
            onClick={() => setFilterStatus('PAUSED')}
          >
            PAUSED ({counts.paused})
          </button>
          <button
            type="button"
            className={`admin-filter-pill ${filterStatus === 'EXPIRED' ? 'admin-filter-pill--active' : ''}`}
            onClick={() => setFilterStatus('EXPIRED')}
          >
            EXPIRED ({counts.expired})
          </button>
        </div>

        {/* Search Input */}
        <div className="admin-launch-sale-search">
          <svg
            className="admin-launch-sale-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search sale products by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Launch Sale Table */}
      <div className="admin-card">
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>ORIGINAL PRICE</th>
                <th>DISCOUNT %</th>
                <th>SALE PRICE</th>
                <th>SCHEDULE</th>
                <th>LIVE COUNTDOWN</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span className="admin-loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                      <span>Loading Launch Sale records from MongoDB Atlas...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSales.length > 0 ? (
                filteredSales.map((sale) => {
                  const product = sale.product || sale.productId || {};
                  const origPrice = Number(product.price || sale.originalPrice || 0);
                  const discountPct = Number(sale.discountPercentage || 0);
                  const discountedPrice = Math.round(origPrice * (1 - discountPct / 100));

                  return (
                    <tr key={sale._id}>
                      {/* Product details */}
                      <td>
                        <div className="admin-sale-product-cell">
                          <img
                            src={product.thumbnail || product.images?.[0] || '/images/products/artic-blue-wide.jpg'}
                            alt={product.title || 'Product'}
                            className="admin-sale-product-img"
                          />
                          <div className="admin-sale-product-details">
                            <span className="admin-sale-product-title" title={product.title}>
                              {product.title || 'Unnamed Product'}
                            </span>
                            <span className="admin-sale-product-category">
                              {product.subCategory || product.category || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Original Price */}
                      <td>
                        <span className="admin-sale-price-orig">₹{origPrice.toLocaleString('en-IN')}</span>
                      </td>

                      {/* Discount % */}
                      <td>
                        <span className="admin-sale-discount-badge">{discountPct}% OFF</span>
                      </td>

                      {/* Discounted Sale Price */}
                      <td>
                        <span className="admin-sale-price-bold">₹{discountedPrice.toLocaleString('en-IN')}</span>
                      </td>

                      {/* Schedule Start / End */}
                      <td>
                        <div className="admin-sale-schedule-cell">
                          <div>
                            <span className="admin-sale-schedule-label">FROM:</span>
                            {formatScheduleDate(sale.startDateTime)}
                          </div>
                          <div>
                            <span className="admin-sale-schedule-label">TO:</span>
                            {formatScheduleDate(sale.endDateTime)}
                          </div>
                        </div>
                      </td>

                      {/* Live Ticking Countdown */}
                      <td>
                        <span className={`admin-sale-countdown ${sale.countdownClass}`}>
                          {sale.countdownText}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`admin-badge admin-badge--${sale.liveStatus}`}>
                          {sale.liveStatus.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="admin-table__actions" style={{ justifyContent: 'flex-end' }}>
                          {/* Pause / Resume Button */}
                          <button
                            type="button"
                            className="admin-btn-icon"
                            onClick={() => onToggleStatus(sale._id)}
                            title={sale.liveStatus === 'paused' ? 'Resume Sale' : 'Pause Sale'}
                          >
                            {sale.liveStatus === 'paused' ? '▶' : '⏸'}
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            className="admin-btn-icon"
                            onClick={() => handleOpenEditModal(sale)}
                            title="Edit Launch Sale"
                          >
                            ✎
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            className="admin-btn-icon admin-btn-icon--danger"
                            onClick={() => setDeleteTarget(sale)}
                            title="Remove Launch Sale"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                        No Launch Sale products configured
                      </p>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                        {searchQuery
                          ? `No sale products match "${searchQuery}".`
                          : 'Add products with discounted prices and individual countdown timers to launch campaigns.'}
                      </p>
                      <button
                        type="button"
                        className="admin-btn admin-btn--black"
                        onClick={handleOpenAddModal}
                      >
                        + Create First Launch Sale Product
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <LaunchSaleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSale(null);
        }}
        isEdit={Boolean(editingSale)}
        saleData={editingSale}
        products={products}
        existingSales={launchSales}
        onSubmit={handleModalSubmit}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isSaving}
        title="Remove Product From Launch Sale"
        message={`Are you sure you want to remove "${
          deleteTarget?.product?.title || deleteTarget?.productId?.title || 'this product'
        }" from the Launch Sale?

STRICT SAFETY CONFIRMATION:
This will only remove the promotional sale entry and countdown timer. The original product will remain 100% intact and untouched in your Catalog Inventory.`}
      />
    </div>
  );
}
