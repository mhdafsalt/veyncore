'use client';

import React, { useState, useEffect, useMemo } from 'react';
import './LaunchSaleModal.css';

/**
 * Format datetime for datetime-local input (YYYY-MM-DDTHH:MM)
 */
const toDateTimeLocalString = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function LaunchSaleModal({
  isOpen,
  onClose,
  isEdit = false,
  saleData = null,
  products = [],
  existingSales = [],
  onSubmit,
  isSaving = false,
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(20);
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [status, setStatus] = useState('active');
  const [displayPriority, setDisplayPriority] = useState(0);
  const [validationError, setValidationError] = useState('');

  // Set initial form state when opened
  useEffect(() => {
    if (isOpen) {
      setValidationError('');
      if (isEdit && saleData) {
        const prod = saleData.productId && typeof saleData.productId === 'object'
          ? saleData.productId
          : products.find((p) => String(p._id) === String(saleData.productId));
        setSelectedProduct(prod || null);
        setProductSearch(prod ? prod.title : '');
        setDiscountPercentage(saleData.discountPercentage || 20);
        setStartDateTime(toDateTimeLocalString(saleData.startDateTime));
        setEndDateTime(toDateTimeLocalString(saleData.endDateTime));
        setStatus(saleData.status === 'paused' ? 'paused' : 'active');
        setDisplayPriority(saleData.displayPriority || 0);
      } else {
        setSelectedProduct(null);
        setProductSearch('');
        setDiscountPercentage(20);
        const now = new Date();
        const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        setStartDateTime(toDateTimeLocalString(now));
        setEndDateTime(toDateTimeLocalString(inThreeDays));
        setStatus('active');
        setDisplayPriority(0);
      }
    }
  }, [isOpen, isEdit, saleData, products]);

  // Set of product IDs already in active/scheduled campaigns (excluding current one when editing)
  const occupiedProductIds = useMemo(() => {
    const set = new Set();
    const now = new Date();
    (existingSales || []).forEach((s) => {
      if (isEdit && saleData && String(s._id) === String(saleData._id)) return;
      if (s.status !== 'expired' && new Date(s.endDateTime) > now) {
        const pId = s.productId?._id || s.productId;
        if (pId) set.add(String(pId));
      }
    });
    return set;
  }, [existingSales, isEdit, saleData]);

  // Filtered products for dropdown search
  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase().trim();
    return (products || []).filter((p) => {
      if (!q) return true;
      const titleMatch = (p.title || '').toLowerCase().includes(q);
      const handleMatch = (p.handle || '').toLowerCase().includes(q);
      const catMatch = (p.subCategory || p.category || '').toLowerCase().includes(q);
      return titleMatch || handleMatch || catMatch;
    });
  }, [products, productSearch]);

  // Real-time calculations
  const originalPrice = selectedProduct ? Number(selectedProduct.price) || 0 : 0;
  const discountAmount = Math.round(originalPrice * (Number(discountPercentage) / 100));
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  // Quick duration helper
  const handleSetDuration = (days) => {
    const start = startDateTime ? new Date(startDateTime) : new Date();
    const newEnd = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    setEndDateTime(toDateTimeLocalString(newEnd));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!selectedProduct) {
      setValidationError('Please select a product from the catalog.');
      return;
    }

    if (!discountPercentage || discountPercentage < 1 || discountPercentage > 99) {
      setValidationError('Discount percentage must be between 1% and 99%.');
      return;
    }

    if (!startDateTime || !endDateTime) {
      setValidationError('Both start date/time and end date/time are required.');
      return;
    }

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setValidationError('Invalid date format.');
      return;
    }

    if (endDate <= startDate) {
      setValidationError('End date/time must be strictly after the start date/time.');
      return;
    }

    const payload = {
      productId: selectedProduct._id,
      discountPercentage: Number(discountPercentage),
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString(),
      status: status,
      displayPriority: Number(displayPriority) || 0,
    };

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal admin-modal--lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Fixed Header */}
        <div className="admin-modal__header">
          <div>
            <h3 className="admin-modal__title">
              {isEdit ? 'EDIT LAUNCH SALE PRODUCT' : 'ADD LAUNCH SALE PRODUCT'}
            </h3>
            <p className="admin-modal__subtitle">
              Configure product promotional discount percentage and individual countdown schedule.
            </p>
          </div>
          <button
            type="button"
            className="admin-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form Container with Scrollable Body and Fixed Sticky Footer */}
        <form onSubmit={handleSubmit} className="launch-sale-modal-form">
          <div className="launch-sale-modal-body">
            {validationError && (
              <div className="launch-sale-error-banner">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{validationError}</span>
              </div>
            )}

            {/* 1. SELECT CATALOG PRODUCT */}
            <div className="launch-sale-group">
              <label className="launch-sale-label">
                <span>1. Select Catalog Product *</span>
                {selectedProduct && (
                  <span className="launch-sale-label-hint">
                    Stock: {selectedProduct.stock ?? 50} &bull; {selectedProduct.category}
                  </span>
                )}
              </label>

              {selectedProduct ? (
                <div className="launch-sale-selected-card">
                  <div className="launch-sale-selected-left">
                    <img
                      src={selectedProduct.thumbnail || selectedProduct.images?.[0] || '/images/products/artic-blue-wide.jpg'}
                      alt={selectedProduct.title}
                      className="launch-sale-thumb"
                    />
                    <div className="launch-sale-meta">
                      <div className="launch-sale-item-title">{selectedProduct.title}</div>
                      <div className="launch-sale-item-sub">
                        <span>Regular Price: ₹{Number(selectedProduct.price).toLocaleString('en-IN')}</span>
                        <span>&bull;</span>
                        <span>{selectedProduct.subCategory || selectedProduct.fit || selectedProduct.category}</span>
                      </div>
                    </div>
                  </div>
                  {!isEdit && (
                    <button
                      type="button"
                      className="launch-sale-change-btn"
                      onClick={() => {
                        setSelectedProduct(null);
                        setProductSearch('');
                        setIsDropdownOpen(true);
                      }}
                    >
                      Change Product
                    </button>
                  )}
                </div>
              ) : (
                <div className="launch-sale-picker">
                  <div className="launch-sale-search-wrap">
                    <svg
                      className="launch-sale-search-icon"
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
                      placeholder="Search products by title or category..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      className="launch-sale-search-input"
                    />
                  </div>

                  {isDropdownOpen && (
                    <ul className="launch-sale-dropdown">
                      {filteredProducts.length === 0 ? (
                        <li style={{ padding: '14px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                          No products found matching &quot;{productSearch}&quot;
                        </li>
                      ) : (
                        filteredProducts.map((p) => {
                          const isOccupied = occupiedProductIds.has(String(p._id));
                          return (
                            <li
                              key={p._id}
                              className={`launch-sale-option ${
                                isOccupied ? 'launch-sale-option--disabled' : ''
                              }`}
                              onClick={() => {
                                if (isOccupied) return;
                                setSelectedProduct(p);
                                setIsDropdownOpen(false);
                                setValidationError('');
                              }}
                            >
                              <img
                                src={p.thumbnail || p.images?.[0] || '/images/products/artic-blue-wide.jpg'}
                                alt={p.title}
                                className="launch-sale-thumb"
                              />
                              <div className="launch-sale-meta">
                                <div className="launch-sale-item-title">{p.title}</div>
                                <div className="launch-sale-item-sub">
                                  <span>₹{Number(p.price).toLocaleString('en-IN')}</span>
                                  <span>&bull;</span>
                                  <span>{p.subCategory || p.category}</span>
                                  {isOccupied && (
                                    <span className="launch-sale-item-conflict">
                                      (Already in Active Sale)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* 2. DISCOUNT PERCENTAGE */}
            <div className="launch-sale-group">
              <label className="launch-sale-label">
                <span>2. Discount Percentage (1% – 99%) *</span>
                <span className="launch-sale-label-hint">Preset buttons or manual entry</span>
              </label>

              <div className="launch-sale-discount-row">
                <div className="launch-sale-number-wrap">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                    className="admin-form-input"
                    required
                  />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>% OFF</span>
                </div>

                <div className="launch-sale-presets">
                  {[10, 15, 20, 25, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`launch-sale-preset-pill ${
                        discountPercentage === pct ? 'launch-sale-preset-pill--active' : ''
                      }`}
                      onClick={() => setDiscountPercentage(pct)}
                    >
                      {pct}% OFF
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculation Preview Box */}
              <div className="launch-sale-calc-box">
                <div className="launch-sale-calc-item">
                  <span className="launch-sale-calc-label">Original Price</span>
                  <span className="launch-sale-calc-val">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="launch-sale-calc-item">
                  <span className="launch-sale-calc-label">Discount Amount</span>
                  <span className="launch-sale-calc-val launch-sale-calc-val--discount">
                    -₹{discountAmount.toLocaleString('en-IN')} ({discountPercentage}%)
                  </span>
                </div>
                <div className="launch-sale-calc-item">
                  <span className="launch-sale-calc-label">Promotional Sale Price</span>
                  <span className="launch-sale-calc-val launch-sale-calc-val--final">
                    ₹{finalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. SALE SCHEDULE */}
            <div className="launch-sale-group">
              <label className="launch-sale-label">
                <span>3. Sale Schedule (Individual Countdown Period) *</span>
                <span className="launch-sale-label-hint">Individual start &amp; end timers</span>
              </label>

              <div className="launch-sale-grid-2">
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '5px', fontWeight: 600 }}>
                    START DATE &amp; TIME
                  </span>
                  <input
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    className="admin-form-input"
                    required
                  />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '5px', fontWeight: 600 }}>
                    END DATE &amp; TIME
                  </span>
                  <input
                    type="datetime-local"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                    className="admin-form-input"
                    required
                  />
                </div>
              </div>

              <div className="launch-sale-duration-presets">
                <span className="launch-sale-duration-label">Quick End Duration:</span>
                <button type="button" className="launch-sale-duration-pill" onClick={() => handleSetDuration(1)}>
                  +24 Hours
                </button>
                <button type="button" className="launch-sale-duration-pill" onClick={() => handleSetDuration(3)}>
                  +3 Days
                </button>
                <button type="button" className="launch-sale-duration-pill" onClick={() => handleSetDuration(7)}>
                  +7 Days
                </button>
                <button type="button" className="launch-sale-duration-pill" onClick={() => handleSetDuration(14)}>
                  +14 Days
                </button>
              </div>
            </div>

            {/* 4. PRIORITY & STATUS */}
            <div className="launch-sale-grid-2">
              <div className="launch-sale-group">
                <label className="launch-sale-label">
                  <span>4. Display Priority</span>
                </label>
                <input
                  type="number"
                  value={displayPriority}
                  onChange={(e) => setDisplayPriority(Number(e.target.value))}
                  placeholder="0 (higher numbers appear first)"
                  className="admin-form-input"
                />
                <p className="launch-sale-field-hint">
                  Order priority on storefront (0, 1, 2...).
                </p>
              </div>

              <div className="launch-sale-group">
                <label className="launch-sale-label">
                  <span>5. Campaign Status</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="admin-form-select"
                >
                  <option value="active">Active / Scheduled (Based on Dates)</option>
                  <option value="paused">Paused (Temporarily Suspended)</option>
                </select>
                <p className="launch-sale-field-hint">
                  Paused campaigns will not apply discounts.
                </p>
              </div>
            </div>
          </div>

          {/* Fixed Sticky Footer - Always visible */}
          <div className="admin-modal__footer">
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--black"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isEdit ? 'Update Launch Sale' : 'Save Launch Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
