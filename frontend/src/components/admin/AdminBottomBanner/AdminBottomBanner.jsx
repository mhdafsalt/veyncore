'use client';

import React, { useState, useEffect } from 'react';
import AdminImageUploader from '../AdminImageUploader/AdminImageUploader';
import './AdminBottomBanner.css';

export default function AdminBottomBanner({
  bannerData,
  bannerDataObjects,
  onSaveBanner,
  isSaving = false,
}) {
  const [activeSection, setActiveSection] = useState('VEYN-SELECTS'); // 'VEYN-SELECTS' | 'VEYN-OBJECTS'

  const [selectsForm, setSelectsForm] = useState({
    imageDesktop: '/images/ImageBanner.png',
    imageMobile: '/images/ImageBanner-Mob.png',
    altText: 'VEYNCORE Denim Campaign',
    buttonLink: '/collections/all-drops',
    active: true,
  });

  const [objectsForm, setObjectsForm] = useState({
    imageDesktop: '/images/hero/ObjectHero03.jpg',
    imageMobile: '/images/hero/ObjectHero03.jpg',
    altText: 'VEYN-OBJECTS Artifacts Campaign',
    buttonLink: '/collections/objects-drops',
    active: true,
  });

  // Sync VEYN-SELECTS data
  useEffect(() => {
    if (bannerData) {
      setSelectsForm({
        imageDesktop: bannerData.imageDesktop || '/images/ImageBanner.png',
        imageMobile: bannerData.imageMobile || '/images/ImageBanner-Mob.png',
        altText: bannerData.altText || 'VEYNCORE Denim Campaign',
        buttonLink: bannerData.buttonLink || '/collections/all-drops',
        active: bannerData.active !== false,
      });
    }
  }, [bannerData]);

  // Sync VEYN-OBJECTS data
  useEffect(() => {
    if (bannerDataObjects) {
      setObjectsForm({
        imageDesktop: bannerDataObjects.imageDesktop || '/images/hero/ObjectHero03.jpg',
        imageMobile: bannerDataObjects.imageMobile || '/images/hero/ObjectHero03.jpg',
        altText: bannerDataObjects.altText || 'VEYN-OBJECTS Artifacts Campaign',
        buttonLink: bannerDataObjects.buttonLink || '/collections/objects-drops',
        active: bannerDataObjects.active !== false,
      });
    }
  }, [bannerDataObjects]);

  const currentForm = activeSection === 'VEYN-OBJECTS' ? objectsForm : selectsForm;
  const setCurrentForm = activeSection === 'VEYN-OBJECTS' ? setObjectsForm : setSelectsForm;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveBanner) {
      onSaveBanner(currentForm, activeSection);
    }
  };

  const isObjects = activeSection === 'VEYN-OBJECTS';

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">HOMEPAGE BOTTOM CAMPAIGN BANNER</h1>
          <p className="admin-view__subtitle">
            Configure independent editorial campaign banners for VEYN-SELECTS and VEYN-OBJECTS.
          </p>
        </div>
      </div>

      {/* Category Tabs Switcher */}
      <div className="admin-filters-bar" style={{ marginBottom: '20px' }}>
        <div className="admin-filter-pills">
          <button
            type="button"
            className={`admin-filter-pill ${
              !isObjects ? 'admin-filter-pill--active' : ''
            }`}
            onClick={() => setActiveSection('VEYN-SELECTS')}
          >
            VEYN-SELECTS (DENIMS)
          </button>
          <button
            type="button"
            className={`admin-filter-pill ${
              isObjects ? 'admin-filter-pill--active' : ''
            }`}
            onClick={() => setActiveSection('VEYN-OBJECTS')}
          >
            VEYN-OBJECTS (ARTIFACTS)
          </button>
        </div>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-banner-editor">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
              {isObjects ? 'VEYN-OBJECTS Bottom Banner' : 'VEYN-SELECTS Bottom Banner'}
            </h3>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
              Target: {isObjects ? 'veyncore.in/veyn-objects' : 'veyncore.in/'}
            </span>
          </div>

          <div className="admin-form-group">
            <label className="admin-toggle-label">
              <input
                type="checkbox"
                checked={currentForm.active}
                onChange={(e) =>
                  setCurrentForm((prev) => ({ ...prev, active: e.target.checked }))
                }
                style={{ display: 'none' }}
              />
              <span className="admin-toggle-switch__thumb" />
              <span>
                Display Campaign Banner on {isObjects ? 'VEYN-OBJECTS' : 'VEYN-SELECTS'} Homepage
              </span>
            </label>
          </div>

          <div className="admin-form-grid">
            <AdminImageUploader
              label="DESKTOP HERO BANNER IMAGE *"
              value={currentForm.imageDesktop}
              onChange={(newUrl) =>
                setCurrentForm((prev) => ({ ...prev, imageDesktop: newUrl }))
              }
              aspectRatio="1898/550"
              placeholder={isObjects ? '/images/hero/ObjectHero03.jpg' : '/images/ImageBanner.png'}
              required
              helpText="High-res horizontal banner matching VEYN-SELECTS size (1898x550 or 16:9 ratio recommended)."
            />

            <AdminImageUploader
              label="MOBILE BANNER IMAGE (PORTRAIT/SQUARE) *"
              value={currentForm.imageMobile}
              onChange={(newUrl) =>
                setCurrentForm((prev) => ({ ...prev, imageMobile: newUrl }))
              }
              aspectRatio="447/372"
              placeholder={isObjects ? '/images/hero/ObjectHero03.jpg' : '/images/ImageBanner-Mob.png'}
              required
              helpText="Vertical optimized image for smartphones and tablets (447x372 ratio recommended)."
            />
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">ACCESSIBILITY ALT TEXT</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentForm.altText}
                onChange={(e) =>
                  setCurrentForm((prev) => ({ ...prev, altText: e.target.value }))
                }
                placeholder={
                  isObjects
                    ? 'VEYN-OBJECTS Artifacts Campaign'
                    : 'VEYNCORE Denim Campaign'
                }
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">TARGET CLICK LINK / ROUTE</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentForm.buttonLink}
                onChange={(e) =>
                  setCurrentForm((prev) => ({ ...prev, buttonLink: e.target.value }))
                }
                placeholder={isObjects ? '/collections/objects-drops' : '/collections/all-drops'}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              LIVE PREVIEW ({isObjects ? 'VEYN-OBJECTS' : 'VEYN-SELECTS'})
            </label>
            <div className="admin-banner-preview">
              <img
                src={
                  currentForm.imageDesktop ||
                  (isObjects ? '/images/hero/ObjectHero03.jpg' : '/images/ImageBanner.png')
                }
                alt="Banner Preview"
                className="admin-banner-preview__img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = isObjects ? '/images/hero/ObjectHero03.jpg' : '/images/ImageBanner.png';
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
              {isSaving
                ? 'Saving Changes...'
                : `Save ${isObjects ? 'VEYN-OBJECTS' : 'VEYN-SELECTS'} Banner`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
