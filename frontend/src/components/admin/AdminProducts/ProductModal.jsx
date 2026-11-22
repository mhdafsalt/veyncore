'use client';

import React from 'react';
import './ProductModal.css';

export default function ProductModal({
  isOpen,
  editingProduct,
  form,
  onFormChange,
  onSave,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-prod-modal__backdrop" onClick={onClose}>
      <div className="admin-prod-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-prod-modal__header">
          <h3 className="admin-prod-modal__title">
            {editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
          </h3>
          <button type="button" className="admin-prod-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="admin-prod-modal__form">
          <div className="admin-prod-modal__row">
            <div className="admin-prod-modal__group">
              <label className="admin-prod-modal__label">PRODUCT TITLE *</label>
              <input
                type="text"
                className="admin-prod-modal__input"
                value={form.title}
                onChange={(e) => onFormChange({ ...form, title: e.target.value })}
                placeholder="e.g. VEXO RAW INDIGO BAGGY"
                required
              />
            </div>
            <div className="admin-prod-modal__group">
              <label className="admin-prod-modal__label">CATEGORY</label>
              <select
                className="admin-prod-modal__select"
                value={form.category}
                onChange={(e) => onFormChange({ ...form, category: e.target.value })}
              >
                <option value="VEYN-SELECTS">VEYN-SELECTS (Streetwear Denim)</option>
                <option value="VEYN-OBJECTS">VEYN-OBJECTS (Hardware &amp; Utility)</option>
              </select>
            </div>
          </div>

          <div className="admin-prod-modal__row">
            <div className="admin-prod-modal__group">
              <label className="admin-prod-modal__label">PRICE (RS) *</label>
              <input
                type="number"
                className="admin-prod-modal__input"
                value={form.price}
                onChange={(e) => onFormChange({ ...form, price: e.target.value })}
                placeholder="1499"
                required
              />
            </div>
            <div className="admin-prod-modal__group">
              <label className="admin-prod-modal__label">COMPARE PRICE (RS)</label>
              <input
                type="number"
                className="admin-prod-modal__input"
                value={form.comparePrice}
                onChange={(e) => onFormChange({ ...form, comparePrice: e.target.value })}
                placeholder="1700"
              />
            </div>
          </div>

          <div className="admin-prod-modal__row">
            <div className="admin-prod-modal__group">
              <label className="admin-prod-modal__label">FIT / SUBCATEGORY</label>
              <input
                type="text"
                className="admin-prod-modal__input"
                value={form.subCategory}
                onChange={(e) => onFormChange({ ...form, subCategory: e.target.value })}
                placeholder="e.g. BAGGY, WIDE, BOOTCUT, BAGS"
              />
            </div>
            <div className="admin-prod-modal__group">
              <label className="admin-prod-modal__label">BADGE</label>
              <input
                type="text"
                className="admin-prod-modal__input"
                value={form.badge}
                onChange={(e) => onFormChange({ ...form, badge: e.target.value })}
                placeholder="e.g. NEW, SALE, BESTSELLER"
              />
            </div>
          </div>

          <div className="admin-prod-modal__group">
            <label className="admin-prod-modal__label">IMAGE URLS (COMMA-SEPARATED)</label>
            <input
              type="text"
              className="admin-prod-modal__input"
              value={form.images}
              onChange={(e) => onFormChange({ ...form, images: e.target.value })}
              placeholder="/images/products/artic-blue-wide.jpg"
            />
          </div>

          <div className="admin-prod-modal__group">
            <label className="admin-prod-modal__label">AVAILABLE SIZES (COMMA-SEPARATED)</label>
            <input
              type="text"
              className="admin-prod-modal__input"
              value={form.availableSizes}
              onChange={(e) => onFormChange({ ...form, availableSizes: e.target.value })}
              placeholder="28, 30, 32, 34, 36"
            />
          </div>

          <div className="admin-prod-modal__group">
            <label className="admin-prod-modal__label">DESCRIPTION</label>
            <textarea
              className="admin-prod-modal__input"
              rows={3}
              value={form.description}
              onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              placeholder="Detailed product specifications..."
            />
          </div>

          <div className="admin-prod-modal__checkbox-wrap">
            <input
              type="checkbox"
              id="productInStockCheck"
              checked={form.inStock}
              onChange={(e) => onFormChange({ ...form, inStock: e.target.checked })}
            />
            <label htmlFor="productInStockCheck" className="admin-prod-modal__checkbox-label">
              Product is currently in stock and available for purchase
            </label>
          </div>

          <div className="admin-prod-modal__footer">
            <button
              type="button"
              className="admin-prod-modal__btn admin-prod-modal__btn--cancel"
              onClick={onClose}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="admin-prod-modal__btn admin-prod-modal__btn--submit"
            >
              {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
