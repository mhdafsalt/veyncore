'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { API_BASE_URL } from '@/lib/constants';
import './AdminWhatsAppOrders.css';

const ALLOWED_ORDER_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  whatsapp_opened: ['confirmed', 'cancelled'],
  contacted: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'shipped', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: ['cancelled'],
  cancelled: [],
};

const STATUS_LABELS = {
  pending: 'Pending',
  whatsapp_opened: 'WhatsApp Opened',
  contacted: 'Contacted',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function AdminWhatsAppOrders({ metrics, getAuthHeaders }) {
  // Mode: 'orders' (real customer orders) | 'clicks' (raw button interaction analytics)
  const [activeMode, setActiveMode] = useState('orders');

  // Real Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Click Logs State
  const [clicks, setClicks] = useState(metrics?.recentWhatsAppClicks || []);
  const [totalClicks, setTotalClicks] = useState(metrics?.whatsappClicks || 0);
  const [loadingClicks, setLoadingClicks] = useState(false);
  const [clickSearchQuery, setClickSearchQuery] = useState('');
  const [clickSourceFilter, setClickSourceFilter] = useState('ALL');

  // Fetch Real Customer Orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const headers = getAuthHeaders ? getAuthHeaders() : { 'Content-Type': 'application/json' };
      const res = await fetch(`${API_BASE_URL}/api/orders?limit=100`, {
        headers,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setOrders(json.data);
        }
      }
    } catch (err) {
      console.warn('Failed to load customer orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, [getAuthHeaders]);

  // Fetch Click Logs
  const fetchClicks = useCallback(async () => {
    try {
      setLoadingClicks(true);
      const headers = getAuthHeaders ? getAuthHeaders() : { 'Content-Type': 'application/json' };
      const res = await fetch(`${API_BASE_URL}/api/analytics/whatsapp-clicks?limit=100`, {
        headers,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setClicks(json.data.clicks || []);
          setTotalClicks(json.data.totalClicks ?? json.data.clicks?.length ?? 0);
        }
      }
    } catch (err) {
      console.warn('Failed to load WhatsApp clicks log:', err);
    } finally {
      setLoadingClicks(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchOrders();
    fetchClicks();
  }, [fetchOrders, fetchClicks]);

  // Update Order Status Handler with Backend State Transition Enforcement
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const headers = getAuthHeaders ? getAuthHeaders() : { 'Content-Type': 'application/json' };
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        alert(data.message || 'Status transition rejected.');
      }
    } catch (err) {
      alert('Error updating order status. Please check network connection.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const q = orderSearchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        ord.orderNumber?.toLowerCase().includes(q) ||
        ord.customer?.name?.toLowerCase().includes(q) ||
        ord.customer?.phone?.includes(q) ||
        ord.shippingAddress?.pincode?.includes(q) ||
        ord.shippingAddress?.city?.toLowerCase().includes(q) ||
        ord.items?.some((it) => it.title?.toLowerCase().includes(q));

      const matchStatus =
        orderStatusFilter === 'ALL' || ord.status === orderStatusFilter;

      return matchQuery && matchStatus;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Filtered Clicks
  const filteredClicks = useMemo(() => {
    return clicks.filter((item) => {
      const q = clickSearchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        (item.productTitle && item.productTitle.toLowerCase().includes(q)) ||
        (item.productHandle && item.productHandle.toLowerCase().includes(q)) ||
        (item.size && item.size.toLowerCase().includes(q)) ||
        (item.source && item.source.toLowerCase().includes(q));

      const matchSource =
        clickSourceFilter === 'ALL' || item.source === clickSourceFilter;

      return matchQuery && matchSource;
    });
  }, [clicks, clickSearchQuery, clickSourceFilter]);

  // Order Metrics
  const orderMetrics = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => ['pending', 'whatsapp_opened'].includes(o.status)).length;
    const active = orders.filter((o) => ['confirmed', 'processing', 'shipped'].includes(o.status)).length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const revenue = orders
      .filter((o) => ['confirmed', 'processing', 'shipped', 'delivered'].includes(o.status))
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    return { total, pending, active, delivered, revenue };
  }, [orders]);

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">ORDER COMMAND CENTER</h1>
          <p className="admin-view__subtitle">
            Manage real customer orders, verify delivery details, and inspect direct WhatsApp checkout interactions.
          </p>
        </div>
        <div className="admin-view__actions">
          {/* Mode Switcher */}
          <div className="admin-whatsapp-mode-switch">
            <button
              type="button"
              className={`admin-mode-pill ${activeMode === 'orders' ? 'admin-mode-pill--active' : ''}`}
              onClick={() => setActiveMode('orders')}
            >
              📦 Customer Orders ({orders.length})
            </button>
            <button
              type="button"
              className={`admin-mode-pill ${activeMode === 'clicks' ? 'admin-mode-pill--active' : ''}`}
              onClick={() => setActiveMode('clicks')}
            >
              ⚡ Click Logs ({clicks.length})
            </button>
          </div>

          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={activeMode === 'orders' ? fetchOrders : fetchClicks}
            disabled={loadingOrders || loadingClicks}
          >
            {loadingOrders || loadingClicks ? 'REFRESHING...' : '🔄 REFRESH'}
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: REAL CUSTOMER ORDERS
          ========================================================================= */}
      {activeMode === 'orders' && (
        <>
          {/* KPI Cards Grid */}
          <div className="admin-whatsapp-kpi-grid">
            <div className="admin-whatsapp-kpi-card">
              <span className="admin-whatsapp-kpi-card__label">TOTAL ORDERS</span>
              <div className="admin-whatsapp-kpi-card__val">{orderMetrics.total}</div>
              <span className="admin-whatsapp-kpi-card__sub">Saved in MongoDB Atlas</span>
            </div>

            <div className="admin-whatsapp-kpi-card">
              <span className="admin-whatsapp-kpi-card__label">PENDING ACTION</span>
              <div className="admin-whatsapp-kpi-card__val" style={{ color: '#d97706' }}>
                {orderMetrics.pending}
              </div>
              <span className="admin-whatsapp-kpi-card__sub">Awaiting confirmation</span>
            </div>

            <div className="admin-whatsapp-kpi-card">
              <span className="admin-whatsapp-kpi-card__label">ACTIVE IN DISPATCH</span>
              <div className="admin-whatsapp-kpi-card__val" style={{ color: '#2563eb' }}>
                {orderMetrics.active}
              </div>
              <span className="admin-whatsapp-kpi-card__sub">Confirmed, processing, or shipped</span>
            </div>

            <div className="admin-whatsapp-kpi-card">
              <span className="admin-whatsapp-kpi-card__label">CONFIRMED REVENUE</span>
              <div className="admin-whatsapp-kpi-card__val" style={{ color: '#059669' }}>
                Rs. {orderMetrics.revenue.toLocaleString('en-IN')}
              </div>
              <span className="admin-whatsapp-kpi-card__sub">From active & delivered orders</span>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="admin-whatsapp-toolbar">
            <div className="admin-search-wrap">
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search order #, customer name, phone, city..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
              />
              {orderSearchQuery && (
                <button
                  type="button"
                  className="admin-search-clear"
                  onClick={() => setOrderSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="admin-whatsapp-filter-buttons">
              {['ALL', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`admin-whatsapp-filter-btn ${
                    orderStatusFilter === st ? 'admin-whatsapp-filter-btn--active' : ''
                  }`}
                  onClick={() => setOrderStatusFilter(st)}
                >
                  {st === 'ALL' ? 'All Orders' : STATUS_LABELS[st] || st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h3 className="admin-card__title">
                CUSTOMER ORDERS ({filteredOrders.length})
              </h3>
            </div>

            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ORDER REF & DATE</th>
                    <th>CUSTOMER & DESTINATION</th>
                    <th>ITEMS SUMMARY</th>
                    <th>FINANCIALS</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingOrders ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        Loading customer orders from database...
                      </td>
                    </tr>
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((ord) => {
                      const cleanPhone = ord.customer?.phone ? String(ord.customer.phone).replace(/\D/g, '') : '';
                      const isKerala = ord.shippingAddress?.isKerala;
                      const allowedNext = ALLOWED_ORDER_TRANSITIONS[ord.status] || [];
                      const isUpdating = updatingOrderId === ord._id;

                      return (
                        <tr key={ord._id || ord.orderNumber}>
                          {/* Order Reference & Date */}
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--admin-text-main)' }}>
                              {ord.orderNumber}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              {ord.createdAt
                                ? new Date(ord.createdAt).toLocaleString('en-IN', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                  })
                                : 'Recent'}
                            </div>
                            <span className="admin-badge admin-badge--standard" style={{ marginTop: '4px' }}>
                              {ord.source === 'whatsapp_checkout' ? 'WhatsApp Direct' : ord.source || 'Online'}
                            </span>
                          </td>

                          {/* Customer & Shipping */}
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>
                              {ord.customer?.name || 'Customer'}
                            </div>
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                                  `Hello ${ord.customer?.name || ''}, regarding your VEYNCORE order #${ord.orderNumber}:`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-order-wa-link"
                                title="Open chat on WhatsApp"
                              >
                                💬 +91 {cleanPhone}
                              </a>
                            )}
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', maxWidth: '240px' }}>
                              {ord.shippingAddress?.addressLine || ord.shippingAddress?.address || '—'}
                              {ord.shippingAddress?.city && `, ${ord.shippingAddress.city}`}
                              {ord.shippingAddress?.pincode && ` - ${ord.shippingAddress.pincode}`}
                            </div>
                            <div style={{ marginTop: '4px' }}>
                              <span
                                className={`admin-order-geo-badge ${
                                  isKerala ? 'admin-order-geo-badge--kerala' : 'admin-order-geo-badge--national'
                                }`}
                              >
                                {isKerala ? '🌴 Kerala (Free Ship)' : '📦 Non-Kerala (+Rs. 50)'}
                              </span>
                            </div>
                          </td>

                          {/* Items Summary */}
                          <td>
                            <div className="admin-order-items-preview">
                              {ord.items && ord.items.length > 0 ? (
                                ord.items.map((it, i) => (
                                  <div key={i} className="admin-order-item-chip">
                                    <span style={{ fontWeight: 600 }}>{it.title || 'Product'}</span>
                                    <span style={{ color: '#64748b' }}>
                                      {' '}
                                      &bull; Size: {it.size || 'STD'} &bull; Qty: {it.quantity || 1}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <span style={{ color: '#94a3b8' }}>1 Item</span>
                              )}
                            </div>
                          </td>

                          {/* Financials */}
                          <td>
                            <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                              Rs. {Number(ord.totalAmount || 0).toLocaleString('en-IN')}.00
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              Sub: Rs. {Number(ord.subtotal || ord.totalAmount || 0).toLocaleString('en-IN')}
                            </div>
                            {ord.shippingFee !== undefined && (
                              <div style={{ fontSize: '11px', color: ord.shippingFee === 0 ? '#059669' : '#64748b' }}>
                                Shipping: {ord.shippingFee === 0 ? 'FREE' : `Rs. ${ord.shippingFee}`}
                              </div>
                            )}
                            {ord.discountAmount > 0 && (
                              <div style={{ fontSize: '11px', color: '#059669' }}>
                                Discount: -Rs. {ord.discountAmount}
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td>
                            <span className={`admin-order-status-badge admin-order-status-badge--${ord.status || 'pending'}`}>
                              {STATUS_LABELS[ord.status] || ord.status}
                            </span>
                            <div style={{ marginTop: '4px' }}>
                              <span
                                className={`admin-badge admin-badge--${
                                  ord.paymentStatus === 'paid' ? 'vip' : 'standard'
                                }`}
                                style={{ fontSize: '10px' }}
                              >
                                {ord.paymentStatus === 'paid' ? 'PAID' : 'PAYMENT PENDING'}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-order-actions-cell">
                              <button
                                type="button"
                                className="admin-btn admin-btn--xs admin-btn--outline"
                                onClick={() => setSelectedOrder(ord)}
                                title="View full order details"
                              >
                                Details
                              </button>

                              {/* Allowed Transitions Menu */}
                              {allowedNext.length > 0 && (
                                <select
                                  className="admin-order-status-select"
                                  value=""
                                  disabled={isUpdating}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleUpdateStatus(ord._id, e.target.value);
                                    }
                                  }}
                                  aria-label="Update order status"
                                >
                                  <option value="">Update Status...</option>
                                  {allowedNext.map((st) => (
                                    <option key={st} value={st}>
                                      &rarr; Mark as {STATUS_LABELS[st] || st}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        {orderSearchQuery || orderStatusFilter !== 'ALL'
                          ? 'No orders match your filter criteria.'
                          : 'No customer orders recorded in MongoDB yet. Orders placed via WhatsApp checkout will appear here in real-time.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: CLICK INTERACTIONS LOG
          ========================================================================= */}
      {activeMode === 'clicks' && (
        <>
          {/* Mini KPI Cards */}
          <div className="admin-whatsapp-kpi-grid">
            <div className="admin-whatsapp-kpi-card">
              <span className="admin-whatsapp-kpi-card__label">TOTAL BUTTON CLICKS</span>
              <div className="admin-whatsapp-kpi-card__val">{totalClicks}</div>
              <span className="admin-whatsapp-kpi-card__sub">All-time WhatsApp button interactions</span>
            </div>

            <div className="admin-whatsapp-kpi-card">
              <span className="admin-whatsapp-kpi-card__label">PAST 24 HOURS</span>
              <div className="admin-whatsapp-kpi-card__val">
                {clicks.filter((c) => new Date(c.createdAt).toDateString() === new Date().toDateString()).length}
              </div>
              <span className="admin-whatsapp-kpi-card__sub">Recent interaction attempts</span>
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
                value={clickSearchQuery}
                onChange={(e) => setClickSearchQuery(e.target.value)}
              />
              {clickSearchQuery && (
                <button
                  type="button"
                  className="admin-search-clear"
                  onClick={() => setClickSearchQuery('')}
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
                    clickSourceFilter === src ? 'admin-whatsapp-filter-btn--active' : ''
                  }`}
                  onClick={() => setClickSourceFilter(src)}
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

          {/* Clicks Table */}
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
                        {clickSearchQuery || clickSourceFilter !== 'ALL'
                          ? 'No WhatsApp clicks match your current filter.'
                          : 'No WhatsApp order button clicks recorded yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          ORDER DETAILS SLIDE-OVER MODAL
          ========================================================================= */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal admin-modal--order-detail" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div>
                <h3 className="admin-modal__title">ORDER #{selectedOrder.orderNumber}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="admin-modal__body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Customer Info Card */}
              <div className="admin-order-detail-card">
                <h4 className="admin-order-detail-card__heading">CUSTOMER & DELIVERY ADDRESS</h4>
                <div className="admin-order-detail-grid">
                  <div>
                    <span className="admin-order-detail-label">Name</span>
                    <span className="admin-order-detail-val">{selectedOrder.customer?.name}</span>
                  </div>
                  <div>
                    <span className="admin-order-detail-label">Mobile</span>
                    <span className="admin-order-detail-val">+91 {selectedOrder.customer?.phone}</span>
                  </div>
                  <div>
                    <span className="admin-order-detail-label">Email</span>
                    <span className="admin-order-detail-val">{selectedOrder.customer?.email || 'None'}</span>
                  </div>
                  <div>
                    <span className="admin-order-detail-label">Pincode / Destination</span>
                    <span className="admin-order-detail-val">
                      {selectedOrder.shippingAddress?.pincode} ({selectedOrder.shippingAddress?.isKerala ? 'Kerala' : 'Outside Kerala'})
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <span className="admin-order-detail-label">Address</span>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', marginTop: '2px' }}>
                    {selectedOrder.shippingAddress?.addressLine || selectedOrder.shippingAddress?.address}
                    {selectedOrder.shippingAddress?.landmark && ` (Landmark: ${selectedOrder.shippingAddress.landmark})`}
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="admin-order-detail-card">
                <h4 className="admin-order-detail-card__heading">ORDER ITEMS ({selectedOrder.items?.length || 0})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="admin-order-detail-item-row">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="admin-product-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/products/artic-blue-wide.jpg';
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '13px' }}>{item.title}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                          Size: {item.size || 'STD'} | Color: {item.color || 'Standard'} | Qty: {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>
                        Rs. {(Number(item.price) * (item.quantity || 1)).toLocaleString('en-IN')}.00
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financials & Status Card */}
              <div className="admin-order-detail-card">
                <h4 className="admin-order-detail-card__heading">FINANCIAL BREAKDOWN & STATUS</h4>
                <div className="admin-order-detail-grid">
                  <div>
                    <span className="admin-order-detail-label">Subtotal</span>
                    <span className="admin-order-detail-val">Rs. {Number(selectedOrder.subtotal || 0).toLocaleString('en-IN')}.00</span>
                  </div>
                  <div>
                    <span className="admin-order-detail-label">Shipping Fee</span>
                    <span className="admin-order-detail-val">
                      {selectedOrder.shippingFee === 0 ? 'FREE (Kerala)' : `Rs. ${selectedOrder.shippingFee}.00`}
                    </span>
                  </div>
                  <div>
                    <span className="admin-order-detail-label">Discount Applied</span>
                    <span className="admin-order-detail-val" style={{ color: selectedOrder.discountAmount > 0 ? '#059669' : '#64748b' }}>
                      {selectedOrder.discountAmount > 0
                        ? `-Rs. ${selectedOrder.discountAmount}.00 (${selectedOrder.discountCode})`
                        : 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="admin-order-detail-label">Total Amount</span>
                    <span className="admin-order-detail-val" style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                      Rs. {Number(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}.00
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span className="admin-order-detail-label">Current Status</span>
                    <span className={`admin-order-status-badge admin-order-status-badge--${selectedOrder.status}`}>
                      {STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
                    </span>
                  </div>

                  {/* Status transition buttons */}
                  {ALLOWED_ORDER_TRANSITIONS[selectedOrder.status]?.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Transition to:</span>
                      {ALLOWED_ORDER_TRANSITIONS[selectedOrder.status].map((nextSt) => (
                        <button
                          key={nextSt}
                          type="button"
                          className={`admin-btn admin-btn--xs ${
                            nextSt === 'cancelled' ? 'admin-btn--danger' : 'admin-btn--black'
                          }`}
                          disabled={updatingOrderId === selectedOrder._id}
                          onClick={() => handleUpdateStatus(selectedOrder._id, nextSt)}
                        >
                          Mark as {STATUS_LABELS[nextSt] || nextSt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="admin-modal__footer">
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
