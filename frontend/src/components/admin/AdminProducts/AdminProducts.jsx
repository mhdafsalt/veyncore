'use client';

import React, { useState } from 'react';
import './AdminProducts.css';

export default function AdminProducts({
  products,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  stockFilter,
  onStockFilterChange,
  onOpenModal,
  onToggleStock,
  onDeleteProduct,
}) {
  return (
    <div className="admin-products">
      {/* 1. Products Toolbar */}
      <div className="admin-products__toolbar">
        <div className="admin-products__filters">
          <input
            type="text"
            placeholder="Search products by title or handle..."
            className="admin-products__input admin-products__input--search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <select
            className="admin-products__select"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="VEYN-SELECTS">VEYN-SELECTS (Streetwear Denim)</option>
            <option value="VEYN-OBJECTS">VEYN-OBJECTS (Hardware &amp; Gear)</option>
          </select>

          <select
            className="admin-products__select"
            value={stockFilter}
            onChange={(e) => onStockFilterChange(e.target.value)}
          >
            <option value="all">All Stock Status</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>

        <div className="admin-products__actions">
          <button
            type="button"
            className="admin-products__btn admin-products__btn--primary"
            onClick={() => onOpenModal()}
          >
            + NEW PRODUCT
          </button>
        </div>
      </div>

      {/* 2. Products Table */}
      <div className="admin-products__table-wrap">
        <table className="admin-products__table">
          <thead>
            <tr>
              <th>PREVIEW</th>
              <th>PRODUCT TITLE &amp; HANDLE</th>
              <th>CATEGORY</th>
              <th>FIT / SUBCAT</th>
              <th>BADGE</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((prod) => (
                <tr key={prod._id}>
                  <td>
                    <img
                      src={prod.thumbnail || prod.images?.[0] || '/images/products/artic-blue-wide.jpg'}
                      alt={prod.title}
                      className="admin-products__thumb"
                      onError={(e) => {
                        e.target.src = '/images/products/artic-blue-wide.jpg';
                      }}
                    />
                  </td>
                  <td>
                    <div className="admin-products__title">{prod.title}</div>
                    <div className="admin-products__handle">/products/{prod.handle}</div>
                  </td>
                  <td>
                    <span className="admin-products__badge admin-products__badge--category">
                      {prod.category}
                    </span>
                  </td>
                  <td>{prod.subCategory || prod.fit || '—'}</td>
                  <td>
                    {prod.badge ? (
                      <span className="admin-products__badge admin-products__badge--tag">
                        {prod.badge}
                      </span>
                    ) : (
                      <span style={{ color: '#aaa' }}>—</span>
                    )}
                  </td>
                  <td>
                    <strong style={{ color: '#000' }}>
                      Rs. {prod.price?.toLocaleString('en-IN')}
                    </strong>
                    {prod.comparePrice && (
                      <span className="admin-products__compare-price">
                        Rs. {prod.comparePrice?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`admin-products__stock-toggle ${
                        prod.inStock
                          ? 'admin-products__stock-toggle--in'
                          : 'admin-products__stock-toggle--out'
                      }`}
                      onClick={() => onToggleStock(prod)}
                      title="Click to toggle stock availability"
                    >
                      {prod.inStock ? '● IN STOCK' : '○ OUT OF STOCK'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-products__actions-cell">
                      <button
                        type="button"
                        className="admin-products__btn admin-products__btn--outline admin-products__btn--sm"
                        onClick={() => onOpenModal(prod)}
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        className="admin-products__icon-btn admin-products__icon-btn--delete"
                        onClick={() => onDeleteProduct(prod._id, prod.title)}
                        title="Delete Product"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#71717a' }}>
                  No products found. Click &ldquo;+ NEW PRODUCT&rdquo; to add your first item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
