'use client';

import React from 'react';
import './AdminOverview.css';

export default function AdminOverview({
  metrics,
  onNavigateTab,
  onOpenProductModal,
  onOpenOrderModal,
  onSeedCatalog,
  onUpdateOrderStatus,
  onDeleteOrder,
}) {
  return (
    <div className="admin-overview">
      {/* 1. Stat Cards Grid */}
      <div className="admin-overview__stats-grid">
        <div className="admin-overview__stat-card">
          <span className="admin-overview__stat-label">TOTAL REVENUE</span>
          <span className="admin-overview__stat-value">
            Rs. {(metrics?.totalRevenue || 0).toLocaleString('en-IN')}.00
          </span>
          <span className="admin-overview__stat-sub">Across all non-cancelled orders</span>
        </div>

        <div className="admin-overview__stat-card">
          <span className="admin-overview__stat-label">ORDERS IN QUEUE</span>
          <span className="admin-overview__stat-value">
            {metrics?.pendingOrders || 0} / {metrics?.totalOrders || 0}
          </span>
          <span className="admin-overview__stat-sub">
            {metrics?.shippedOrders || 0} shipped, {metrics?.deliveredOrders || 0} delivered
          </span>
        </div>

        <div className="admin-overview__stat-card">
          <span className="admin-overview__stat-label">CATALOG PRODUCTS</span>
          <span className="admin-overview__stat-value">{metrics?.totalProducts || 0}</span>
          <span className="admin-overview__stat-sub">
            {metrics?.inStockProducts || 0} in stock, {metrics?.outOfStockProducts || 0} out of stock
          </span>
        </div>

        <div className="admin-overview__stat-card">
          <span className="admin-overview__stat-label">USERS &amp; SYNDICATE</span>
          <span className="admin-overview__stat-value">{metrics?.totalUsers || 0}</span>
          <span className="admin-overview__stat-sub">
            {metrics?.vipUsers || 0} VIP subscribers, {metrics?.adminCount || 0} admins
          </span>
        </div>
      </div>

      {/* 2. Quick Actions Bar */}
      <div className="admin-overview__quick-bar">
        <span className="admin-overview__quick-title">QUICK ACTIONS:</span>
        <button
          type="button"
          className="admin-overview__btn admin-overview__btn--primary"
          onClick={() => {
            onNavigateTab('products');
            onOpenProductModal();
          }}
        >
          + ADD PRODUCT
        </button>
        <button
          type="button"
          className="admin-overview__btn admin-overview__btn--outline"
          onClick={() => {
            onNavigateTab('orders');
            onOpenOrderModal();
          }}
        >
          + RECORD ORDER
        </button>
        {(metrics?.totalProducts || 0) === 0 && (
          <button
            type="button"
            className="admin-overview__btn admin-overview__btn--outline"
            onClick={onSeedCatalog}
          >
            INITIALIZE DEMO CATALOG
          </button>
        )}
      </div>

      {/* 3. Recent Orders Section */}
      <section className="admin-overview__section">
        <div className="admin-overview__section-header">
          <h3 className="admin-overview__section-title">RECENT ORDERS</h3>
          <button
            type="button"
            className="admin-overview__link-btn"
            onClick={() => onNavigateTab('orders')}
          >
            VIEW ALL ORDERS ({metrics?.totalOrders || 0}) &rarr;
          </button>
        </div>

        <div className="admin-overview__table-wrap">
          <table className="admin-overview__table">
            <thead>
              <tr>
                <th>ORDER #</th>
                <th>CUSTOMER</th>
                <th>PHONE</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.recentOrders && metrics.recentOrders.length > 0 ? (
                metrics.recentOrders.map((ord) => (
                  <tr key={ord._id}>
                    <td style={{ fontWeight: 700 }}>{ord.orderNumber}</td>
                    <td>{ord.customerName}</td>
                    <td>
                      <a
                        href={`https://wa.me/${(ord.customerPhone || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-overview__phone-link"
                        title="Chat with customer on WhatsApp"
                      >
                        {ord.customerPhone} 💬
                      </a>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      Rs. {(ord.totalAmount || 0).toLocaleString('en-IN')}.00
                    </td>
                    <td>
                      <select
                        className={`admin-overview__status-select admin-overview__status--${(
                          ord.status || 'pending'
                        ).toLowerCase()}`}
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ color: '#71717a' }}>
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-overview__delete-btn"
                        onClick={() => onDeleteOrder(ord._id, ord.orderNumber)}
                        title="Delete Order"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#71717a', padding: '24px' }}>
                    No orders recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Recent User Registrations */}
      <section className="admin-overview__section">
        <div className="admin-overview__section-header">
          <h3 className="admin-overview__section-title">RECENT USER REGISTRATIONS</h3>
          <button
            type="button"
            className="admin-overview__link-btn"
            onClick={() => onNavigateTab('users')}
          >
            VIEW ALL USERS ({metrics?.totalUsers || 0}) &rarr;
          </button>
        </div>

        <div className="admin-overview__table-wrap">
          <table className="admin-overview__table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>MOBILE</th>
                <th>ROLE</th>
                <th>VIP NOTIFICATIONS</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.recentUsers && metrics.recentUsers.length > 0 ? (
                metrics.recentUsers.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.mobileNumber || '—'}</td>
                    <td>
                      <span
                        className={`admin-overview__badge ${
                          u.role === 'admin'
                            ? 'admin-overview__badge--admin'
                            : 'admin-overview__badge--user'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-overview__badge ${
                          u.vipNotifications
                            ? 'admin-overview__badge--vip'
                            : 'admin-overview__badge--standard'
                        }`}
                      >
                        {u.vipNotifications ? 'VIP SUBSCRIBER' : 'STANDARD'}
                      </span>
                    </td>
                    <td style={{ color: '#71717a' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#71717a', padding: '24px' }}>
                    No registered users in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
