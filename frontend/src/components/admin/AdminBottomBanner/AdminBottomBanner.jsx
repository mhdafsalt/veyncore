'use client';

import React, { useState, useEffect } from 'react';
import AdminImageUploader from '../AdminImageUploader/AdminImageUploader';
import './AdminBottomBanner.css';

export default function AdminBottomBanner({
  bannerData,
  onSaveBanner,
  isSaving = false,
}) {
  const [formData, setFormData] = useState({
    imageDesktop: '/images/ImageBanner.png',
    imageMobile: '/images/ImageBanner-Mob.png',
    altText: 'VEYNCORE Denim Campaign',
    buttonLink: '/collections/all-drops',
    active: true,
  });

  useEffect(() => {
    if (bannerData) {
      setFormData({
        imageDesktop: bannerData.imageDesktop || '/images/ImageBanner.png',
        imageMobile: bannerData.imageMobile || '/images/ImageBanner-Mob.png',
        altText: bannerData.altText || 'VEYNCORE Denim Campaign',
        buttonLink: bannerData.buttonLink || '/collections/all-drops',
        active: bannerData.active !== false,
      });
    }
  }, [bannerData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveBanner(formData);
  };

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">HOMEPAGE BOTTOM CAMPAIGN BANNER</h1>
          <p className="admin-view__subtitle">
            Configure the wide editorial campaign banner displayed directly above the footer on the homepage.
          </p>
        </div>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-banner-editor">
          <div className="admin-form-group">
            <label className="admin-toggle-label">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, active: e.target.checked }))
                }
                style={{ display: 'none' }}
              />
              <span className="admin-toggle-switch__thumb" />
              <span>Display Campaign Banner on Storefront Homepage</span>
            </label>
          </div>

          <div className="admin-form-grid">
            <AdminImageUploader
              label="DESKTOP HERO BANNER IMAGE *"
              value={formData.imageDesktop}
              onChange={(newUrl) =>
                setFormData((prev) => ({ ...prev, imageDesktop: newUrl }))
              }
              aspectRatio="16/7"
              placeholder="/images/ImageBanner.png"
              required
              helpText="High-res horizontal banner for desktop viewports (1920x800 recommended)."
            />

            <AdminImageUploader
              label="MOBILE BANNER IMAGE (PORTRAIT/SQUARE) *"
              value={formData.imageMobile}
              onChange={(newUrl) =>
                setFormData((prev) => ({ ...prev, imageMobile: newUrl }))
              }
              aspectRatio="4/3"
              placeholder="/images/ImageBanner-Mob.png"
              required
              helpText="Vertical optimized image for smartphones and tablets."
            />
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">ACCESSIBILITY ALT TEXT</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.altText}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, altText: e.target.value }))
                }
                placeholder="VEYNCORE Denim Campaign"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">TARGET CLICK LINK / ROUTE</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.buttonLink}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, buttonLink: e.target.value }))
                }
                placeholder="/collections/all-drops"
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="admin-form-group">
            <label className="admin-form-label">LIVE PREVIEW</label>
            <div className="admin-banner-preview">
              <img
                src={formData.imageDesktop || '/images/ImageBanner.png'}
                alt="Banner Preview"
                className="admin-banner-preview__img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/ImageBanner.png';
                }}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="admin-btn admin-btn--black"
              disabled={isSaving}
            >
              {isSaving ? 'Saving Changes...' : 'Save Banner Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
