'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import './AdminProducts.css';

export default function AdminProducts({
  products = [],
  loading = false,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleStock,
}) {
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'VEYN-SELECTS' | 'VEYN-OBJECTS'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        categoryFilter === 'ALL' || p.category === categoryFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        p.title?.toLowerCase().includes(query) ||
        p.handle?.toLowerCase().includes(query) ||
        p.subCategory?.toLowerCase().includes(query) ||
        p.fit?.toLowerCase().includes(query);

      return matchCat && matchSearch;
    });
  }, [products, categoryFilter, searchQuery]);

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">PRODUCTS INVENTORY</h1>
          <p className="admin-view__subtitle">
            Dynamic management for VEYN-SELECTS denims &amp; VEYN-OBJECTS utilitarian hardware.
          </p>
        </div>
        <div className="admin-view__actions">
          <button
            type="button"
            className="admin-btn admin-btn--black"
            onClick={onAddProduct}
          >
            + ADD PRODUCT
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filters-bar">
        <div className="admin-filter-pills">
          <button
            type="button"
            className={`admin-filter-pill ${
              categoryFilter === 'ALL' ? 'admin-filter-pill--active' : ''
            }`}
            onClick={() => setCategoryFilter('ALL')}
          >
            ALL PRODUCTS ({products.length})
          </button>
          <button
            type="button"
            className={`admin-filter-pill ${
              categoryFilter === 'VEYN-SELECTS' ? 'admin-filter-pill--active' : ''
            }`}
            onClick={() => setCategoryFilter('VEYN-SELECTS')}
          >
            VEYN-SELECTS ({products.filter((p) => p.category === 'VEYN-SELECTS').length})
          </button>
          <button
            type="button"
            className={`admin-filter-pill ${
              categoryFilter === 'VEYN-OBJECTS' ? 'admin-filter-pill--active' : ''
            }`}
            onClick={() => setCategoryFilter('VEYN-OBJECTS')}
          >
            VEYN-OBJECTS ({products.filter((p) => p.category === 'VEYN-OBJECTS').length})
          </button>
        </div>

        <div className="admin-search-wrap">
          <input
            type="text"
            placeholder="Search by title, handle, fit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Products Table Card */}
      <div className="admin-card">
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>TITLE &amp; HANDLE</th>
                <th>CATEGORY</th>
                <th>SUBCATEGORY</th>
                <th>PRICE</th>
                <th>BADGE</th>
                <th>STOCK</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p._id || p.handle}>
                    <td style={{ width: '64px' }}>
                      <img
                        src={p.thumbnail || p.images?.[0] || '/images/products/artic-blue-wide.jpg'}
                        alt={p.title}
                        className="admin-product-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/products/artic-blue-wide.jpg';
                        }}
                      />
                    </td>
                    <td>
                      <div className="admin-products__title">{p.title}</div>
                      <div className="admin-products__handle">
                        /products/{p.handle}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`admin-badge admin-badge--${
                          p.category === 'VEYN-OBJECTS' ? 'objects' : 'selects'
                        }`}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>
                        {p.subCategory || p.fit || '—'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>
                        Rs. {Number(p.price || 0).toLocaleString('en-IN')}.00
                      </div>
                      {p.comparePrice && (
                        <div style={{ fontSize: '11px', color: '#64748b', textDecoration: 'line-through' }}>
                          Rs. {Number(p.comparePrice).toLocaleString('en-IN')}.00
                        </div>
                      )}
                    </td>
                    <td>
                      {p.badge ? (
                        <span className="admin-badge admin-badge--badge">
                          {p.badge}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onToggleStock(p)}
                        className={`admin-badge admin-badge--${
                          p.inStock !== false && (p.stock === undefined || p.stock > 0) ? 'in-stock' : 'out-stock'
                        } admin-products__stock-btn`}
                        title="Click to toggle stock status"
                      >
                        {p.inStock !== false && (p.stock === undefined || p.stock > 0)
                          ? `✓ IN STOCK${p.stock !== undefined ? ` (${p.stock})` : ''}`
                          : '✕ SOLD OUT'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-row-actions">
                        <Link
                          href={`/products/${p.handle}`}
                          target="_blank"
                          className="admin-icon-btn"
                          title="View Live Product"
                        >
                          ↗
                        </Link>
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Edit Product"
                          onClick={() => onEditProduct(p)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          title="Delete Product"
                          onClick={() => onDeleteProduct(p)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#64748b', marginBottom: '12px' }}>
                      {loading ? 'Loading catalog items...' : 'No products found matching filters.'}
                    </p>
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm admin-btn--black"
                      onClick={onAddProduct}
                    >
                      + Create First Product
                    </button>
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
