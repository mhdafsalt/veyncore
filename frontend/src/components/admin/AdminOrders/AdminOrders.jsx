'use client';

import React from 'react';
import './AdminOrders.css';

export default function AdminOrders({
  orders,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenModal,
  onUpdateOrderStatus,
  onDeleteOrder,
}) {
  return (
    <div className="admin-orders">
      {/* 1. Orders Toolbar */}
      <div className="admin-orders__toolbar">
        <div className="admin-orders__filters">
          <input
            type="text"
            placeholder="Search by order #, customer, phone..."
            className="admin-orders__input admin-orders__input--search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <select
            className="admin-orders__select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="admin-orders__actions">
          <button
            type="button"
            className="admin-orders__btn admin-orders__btn--primary"
            onClick={onOpenModal}
          >
            + RECORD ORDER
          </button>
        </div>
      </div>

      {/* 2. Orders Table */}
      <div className="admin-orders__table-wrap">
        <table className="admin-orders__table">
          <thead>
            <tr>
              <th>ORDER NUMBER</th>
              <th>CUSTOMER DETAILS</th>
              <th>ITEMS ORDERED</th>
              <th>TOTAL</th>
              <th>STATUS (CLICK TO CHANGE)</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((ord) => (
                <tr key={ord._id}>
                  <td>
                    <span className="admin-orders__number">{ord.orderNumber}</span>
                    <div className="admin-orders__payment">{ord.paymentMethod}</div>
                  </td>
                  <td>
                    <div className="admin-orders__customer-name">{ord.customerName}</div>
                    <div className="admin-orders__phone-wrap">
                      <a
                        href={`https://wa.me/${(ord.customerPhone || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-orders__phone-link"
                      >
                        {ord.customerPhone} 💬 WhatsApp
                      </a>
                    </div>
                    {ord.customerEmail && (
                      <div className="admin-orders__email">{ord.customerEmail}</div>
                    )}
                  </td>
                  <td>
                    {ord.items && ord.items.length > 0 ? (
                      ord.items.map((it, idx) => (
                        <div key={idx} className="admin-orders__item-row">
                          • <strong>{it.title}</strong> (Sz: {it.size}, Qty: {it.quantity})
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#aaa' }}>{ord.notes || 'Direct Order'}</span>
                    )}
                  </td>
                  <td>
                    <strong style={{ fontSize: '13px' }}>
                      Rs. {ord.totalAmount?.toLocaleString('en-IN')}.00
                    </strong>
                  </td>
                  <td>
                    <select
                      className={`admin-orders__status-select admin-orders__status--${(
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
                      className="admin-orders__icon-btn admin-orders__icon-btn--delete"
                      onClick={() => onDeleteOrder(ord._id, ord.orderNumber)}
                      title="Delete Order Record"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#71717a' }}>
                  No orders found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
