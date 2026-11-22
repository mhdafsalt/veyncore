'use client';

import React from 'react';
import './OrderModal.css';

export default function OrderModal({
  isOpen,
  form,
  onFormChange,
  onSave,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-order-modal__backdrop" onClick={onClose}>
      <div className="admin-order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-order-modal__header">
          <h3 className="admin-order-modal__title">RECORD MANUAL ORDER</h3>
          <button type="button" className="admin-order-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="admin-order-modal__form">
          <div className="admin-order-modal__group">
            <label className="admin-order-modal__label">CUSTOMER NAME *</label>
            <input
              type="text"
              className="admin-order-modal__input"
              value={form.customerName}
              onChange={(e) => onFormChange({ ...form, customerName: e.target.value })}
              placeholder="Customer Full Name"
              required
            />
          </div>

          <div className="admin-order-modal__row">
            <div className="admin-order-modal__group">
              <label className="admin-order-modal__label">WHATSAPP / PHONE NUMBER *</label>
              <input
                type="text"
                className="admin-order-modal__input"
                value={form.customerPhone}
                onChange={(e) => onFormChange({ ...form, customerPhone: e.target.value })}
                placeholder="9995917332"
                required
              />
            </div>
            <div className="admin-order-modal__group">
              <label className="admin-order-modal__label">CUSTOMER EMAIL (OPTIONAL)</label>
              <input
                type="email"
                className="admin-order-modal__input"
                value={form.customerEmail}
                onChange={(e) => onFormChange({ ...form, customerEmail: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>
          </div>

          <div className="admin-order-modal__row">
            <div className="admin-order-modal__group">
              <label className="admin-order-modal__label">ITEM TITLE</label>
              <input
                type="text"
                className="admin-order-modal__input"
                value={form.itemTitle}
                onChange={(e) => onFormChange({ ...form, itemTitle: e.target.value })}
                placeholder="e.g. VEXO BLUE BAGGY"
              />
            </div>
            <div className="admin-order-modal__group">
              <label className="admin-order-modal__label">SIZE</label>
              <input
                type="text"
                className="admin-order-modal__input"
                value={form.itemSize}
                onChange={(e) => onFormChange({ ...form, itemSize: e.target.value })}
                placeholder="32"
              />
            </div>
          </div>

          <div className="admin-order-modal__group">
            <label className="admin-order-modal__label">TOTAL AMOUNT (RS) *</label>
            <input
              type="number"
              className="admin-order-modal__input"
              value={form.totalAmount}
              onChange={(e) => onFormChange({ ...form, totalAmount: e.target.value })}
              placeholder="1499"
              required
            />
          </div>

          <div className="admin-order-modal__group">
            <label className="admin-order-modal__label">NOTES / ADDRESS</label>
            <textarea
              className="admin-order-modal__input"
              rows={2}
              value={form.notes}
              onChange={(e) => onFormChange({ ...form, notes: e.target.value })}
              placeholder="Shipping address, special customer instructions..."
            />
          </div>

          <div className="admin-order-modal__footer">
            <button
              type="button"
              className="admin-order-modal__btn admin-order-modal__btn--cancel"
              onClick={onClose}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="admin-order-modal__btn admin-order-modal__btn--submit"
            >
              SAVE ORDER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
