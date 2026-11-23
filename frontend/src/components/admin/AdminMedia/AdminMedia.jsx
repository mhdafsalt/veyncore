'use client';

import React, { useState } from 'react';
import AdminImageUploader from '../AdminImageUploader/AdminImageUploader';
import './AdminMedia.css';

export default function AdminMedia({
  mediaFiles = [],
  loading = false,
  onUploadSuccess,
  onDeleteMedia,
}) {
  const [search, setSearch] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(null);

  const filteredMedia = (mediaFiles || []).filter((m) =>
    (m.filename || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (url) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2400);
    }
  };

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">MEDIA STORAGE VAULT</h1>
          <p className="admin-view__subtitle">
            Upload and manage server-hosted media assets. Direct image URLs can be copied and linked across products, hero slides, and banners.
          </p>
        </div>
      </div>

      {/* Upload Zone Card */}
      <div className="admin-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 className="admin-card__title" style={{ marginBottom: '14px' }}>
          UPLOAD NEW MEDIA ASSET
        </h3>
        <AdminImageUploader
          label="CHOOSE OR DRAG IMAGE"
          value=""
          onChange={(newUrl) => {
            if (newUrl && onUploadSuccess) onUploadSuccess(newUrl);
          }}
          aspectRatio="16/9"
          helpText="Images are stored directly on the Express server under /uploads."
        />
      </div>

      {/* Media Search & Count */}
      <div className="admin-filters-bar">
        <div className="admin-search-wrap">
          <input
            type="text"
            placeholder="Search by file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
          {search && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() => setSearch('')}
            >
              ✕
            </button>
          )}
        </div>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
          {filteredMedia.length} assets found
        </span>
      </div>

      {/* Media Grid */}
      <div className="admin-media-grid">
        {filteredMedia.length > 0 ? (
          filteredMedia.map((m) => (
            <div key={m.filename} className="admin-media-card">
              <div className="admin-media-card__thumb-wrap">
                <img
                  src={m.url}
                  alt={m.filename}
                  className="admin-media-card__thumb"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/hero/heroimg01.jpg';
                  }}
                />
              </div>
              <div className="admin-media-card__body">
                <div className="admin-media-card__name" title={m.filename}>
                  {m.filename}
                </div>
                <div className="admin-media-card__meta">
                  <span>{(m.size / 1024).toFixed(1)} KB</span>
                  <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={m.url}
                  className="admin-media-card__url-input"
                  onClick={(e) => e.target.select()}
                />
                <div className="admin-media-card__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--xs admin-btn--outline"
                    onClick={() => handleCopy(m.url)}
                  >
                    {copiedUrl === m.url ? '✓ Copied' : 'Copy URL'}
                  </button>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-btn admin-btn--xs admin-btn--outline"
                  >
                    View ↗
                  </a>
                  <button
                    type="button"
                    className="admin-btn admin-btn--xs admin-btn--danger"
                    onClick={() => onDeleteMedia(m.filename)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-media__empty">
            <p>{loading ? 'Loading media storage...' : 'No media assets found in storage.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
