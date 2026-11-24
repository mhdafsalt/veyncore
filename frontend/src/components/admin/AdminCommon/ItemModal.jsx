'use client';

import React, { useState, useEffect } from 'react';
import AdminImageUploader from '../AdminImageUploader/AdminImageUploader';
import './ItemModal.css';

export default function ItemModal({
  isOpen,
  onClose,
  config, // { type, isEdit, title }
  formData,
  setFormData,
  onSubmit,
  isSaving = false,
}) {
  const [autoSyncRoute, setAutoSyncRoute] = useState(true);

  // Initialize autoSyncRoute based on whether item is being edited or new
  useEffect(() => {
    if (isOpen) {
      if (config.type === 'subcategories') {
        const isDynamic =
          !formData.href ||
          formData.href.includes('?category=') ||
          formData.href.startsWith('#');
        setAutoSyncRoute(Boolean(!config.isEdit || isDynamic));
      }
    }
  }, [isOpen, config.type, config.isEdit]);

  if (!isOpen) return null;

  const currentMainCategory = formData.mainCategory || 'VEYN-SELECTS';
  const dropsPath =
    currentMainCategory === 'VEYN-OBJECTS'
      ? '/collections/objects-drops'
      : '/collections/all-drops';
  const homePath =
    currentMainCategory === 'VEYN-OBJECTS' ? '/veyn-objects' : '/';
  const newDropsPath = `${dropsPath}?badge=new`;

  // Helper to generate slug from label
  const getSlugFromLabel = (label = '') =>
    label
      .toLowerCase()
      .replace(/⚡|⚡️/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const currentSlug = getSlugFromLabel(formData.label);
  const expectedDynamicRoute = currentSlug
    ? `${dropsPath}?category=${currentSlug}`
    : `${dropsPath}?category=category-name`;

  const isDynamicCategoryActive =
    autoSyncRoute ||
    (formData.href && formData.href.includes('?category='));

  // Handle Label Change with dynamic route auto-sync (Enforce UPPERCASE)
  const handleLabelChange = (val) => {
    const upperVal = (val || '').toUpperCase();
    const slug = getSlugFromLabel(upperVal);
    const newHref = slug ? `${dropsPath}?category=${slug}` : dropsPath;

    setFormData((prev) => ({
      ...prev,
      label: upperVal,
      ...(autoSyncRoute
        ? {
            href: newHref,
            id: prev.id && config.isEdit ? prev.id : slug || prev.id,
          }
        : {}),
    }));
  };

  // Handle Main Category Change
  const handleMainCategoryChange = (newMain) => {
    const newDropsPath =
      newMain === 'VEYN-OBJECTS'
        ? '/collections/objects-drops'
        : '/collections/all-drops';
    const newHomePath = newMain === 'VEYN-OBJECTS' ? '/veyn-objects' : '/';

    setFormData((prev) => {
      let updatedHref = prev.href;
      if (autoSyncRoute) {
        const slug = getSlugFromLabel(prev.label);
        updatedHref = slug ? `${newDropsPath}?category=${slug}` : newDropsPath;
      } else if (
        prev.href === '/collections/all-drops' ||
        prev.href === '/collections/objects-drops'
      ) {
        updatedHref = newDropsPath;
      } else if (prev.href === '/' || prev.href === '/veyn-objects') {
        updatedHref = newHomePath;
      }

      return {
        ...prev,
        mainCategory: newMain,
        href: updatedHref,
      };
    });
  };

  // Preset click handler
  const handlePresetSelect = (presetKey) => {
    const slug = currentSlug;

    if (presetKey === 'dynamic') {
      setAutoSyncRoute(true);
      const dynamicHref = slug
        ? `${dropsPath}?category=${slug}`
        : `${dropsPath}?category=category-name`;
      setFormData((prev) => ({
        ...prev,
        href: dynamicHref,
        id: prev.id && config.isEdit ? prev.id : slug || prev.id,
      }));
    } else {
      setAutoSyncRoute(false);
      let newHref = '';
      if (presetKey === 'all-drops') newHref = dropsPath;
      else if (presetKey === 'new-drops') newHref = newDropsPath;
      else if (presetKey === 'flash-sale') newHref = '#flash-sale';
      else if (presetKey === 'home') newHref = homePath;

      setFormData((prev) => ({
        ...prev,
        href: newHref,
      }));
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3 className="admin-modal__title">{config.title || 'MANAGE ITEM'}</h3>
          <button
            type="button"
            className="admin-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="admin-modal__form">
          {/* Subcategories Form */}
          {config.type === 'subcategories' && (
            <>
              <div className="admin-form-group">
                <label className="admin-form-label">SUBCATEGORY LABEL *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  style={{ textTransform: 'uppercase' }}
                  value={formData.label || ''}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="e.g. BOOTCUT, CARGO, FLASH SALE⚡️"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">MAIN CATEGORY *</label>
                <select
                  className="admin-form-select"
                  value={formData.mainCategory || 'VEYN-SELECTS'}
                  onChange={(e) => handleMainCategoryChange(e.target.value)}
                >
                  <option value="VEYN-SELECTS">VEYN-SELECTS</option>
                  <option value="VEYN-OBJECTS">VEYN-OBJECTS</option>
                </select>
              </div>

              {/* Dynamic Target Link / Route Section */}
              <div className="admin-form-group">
                <div className="admin-route-header-row">
                  <label className="admin-form-label" style={{ marginBottom: 0 }}>
                    TARGET LINK / ROUTE *
                  </label>
                  <span className="admin-route-helper-tag">
                    {autoSyncRoute ? '⚡ Auto-Sync Active' : 'Custom Route Mode'}
                  </span>
                </div>

                {/* Quick Presets Strip */}
                <div className="admin-route-presets" role="group" aria-label="Quick route presets">
                  <button
                    type="button"
                    className={`admin-route-pill ${
                      isDynamicCategoryActive ? 'admin-route-pill--active' : ''
                    }`}
                    onClick={() => handlePresetSelect('dynamic')}
                    title="Automatically filter collection by subcategory name"
                  >
                    ⚡ Dynamic Category (Auto)
                  </button>
                  <button
                    type="button"
                    className={`admin-route-pill ${
                      formData.href === dropsPath && !autoSyncRoute
                        ? 'admin-route-pill--active'
                        : ''
                    }`}
                    onClick={() => handlePresetSelect('all-drops')}
                    title="Navigate to full collection without category filter"
                  >
                    All Drops
                  </button>
                  <button
                    type="button"
                    className={`admin-route-pill ${
                      formData.href === newDropsPath ? 'admin-route-pill--active' : ''
                    }`}
                    onClick={() => handlePresetSelect('new-drops')}
                    title="Filter by New Drops badge"
                  >
                    New Drops
                  </button>
                  <button
                    type="button"
                    className={`admin-route-pill ${
                      formData.href === '#flash-sale' ? 'admin-route-pill--active' : ''
                    }`}
                    onClick={() => handlePresetSelect('flash-sale')}
                    title="Scroll to Flash Sale on storefront"
                  >
                    ⚡ Flash Sale
                  </button>
                  <button
                    type="button"
                    className={`admin-route-pill ${
                      formData.href === homePath ? 'admin-route-pill--active' : ''
                    }`}
                    onClick={() => handlePresetSelect('home')}
                    title="Navigate to storefront home"
                  >
                    Home
                  </button>
                </div>

                {/* Route Input */}
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.href || ''}
                  onChange={(e) => {
                    setAutoSyncRoute(false);
                    setFormData((prev) => ({ ...prev, href: e.target.value }));
                  }}
                  placeholder="e.g. /collections/all-drops?category=baggy or #flash-sale"
                  required
                />

                {/* Dynamic Route Info */}
                <div className="admin-route-hint">
                  {autoSyncRoute ? (
                    <span className="admin-route-hint--dynamic">
                      ✓ <strong>Dynamic Routing Active:</strong> Automatically generates{' '}
                      <code>{expectedDynamicRoute}</code> based on the label.
                    </span>
                  ) : (
                    <span>
                      Type any custom path or click a preset above to auto-generate.
                    </span>
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isGlow)}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isGlow: e.target.checked }))
                    }
                  />
                  <span>Enable Glow Animation Accent (⚡️)</span>
                </label>
              </div>
            </>
          )}

          {/* Hero Slide Form */}
          {config.type === 'heroSlides' && (
            <>
              <div className="admin-form-group">
                <label className="admin-form-label">TARGET SECTION *</label>
                <select
                  className="admin-form-select"
                  value={formData.targetSection || 'VEYN-SELECTS'}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, targetSection: e.target.value }))
                  }
                >
                  <option value="VEYN-SELECTS">VEYN-SELECTS</option>
                  <option value="VEYN-OBJECTS">VEYN-OBJECTS</option>
                </select>
              </div>

              <AdminImageUploader
                label="HERO SLIDE IMAGE *"
                value={formData.image || ''}
                onChange={(newUrl) =>
                  setFormData((prev) => ({ ...prev, image: newUrl }))
                }
                aspectRatio="16/9"
                placeholder="/images/hero/heroimg01.jpg"
                required
                helpText="Choose an image file from your device or paste a web/local image URL."
              />

              <div className="admin-form-group">
                <label className="admin-form-label">TARGET LINK *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.href || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, href: e.target.value }))
                  }
                  placeholder="/collections/all-drops"
                  required
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Destination URL when slide is clicked
                </span>
              </div>
            </>
          )}

          {/* Swipe Categories Form */}
          {config.type === 'swipeCategories' && (
            <>
              <div className="admin-form-group">
                <label className="admin-form-label">TARGET SECTION *</label>
                <select
                  className="admin-form-select"
                  value={formData.targetSection || 'VEYN-SELECTS'}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, targetSection: e.target.value }))
                  }
                >
                  <option value="VEYN-SELECTS">VEYN-SELECTS</option>
                  <option value="VEYN-OBJECTS">VEYN-OBJECTS</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">CATEGORY LABEL *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.label || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, label: e.target.value }))
                  }
                  placeholder="e.g. BAGGY"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">KEY IDENTIFIER *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.key || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      key: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''),
                    }))
                  }
                  placeholder="e.g. baggy (matches product fit/swipeCategory)"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">TARGET COLLECTION ROUTE</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.collectionPath || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, collectionPath: e.target.value }))
                  }
                  placeholder="e.g. /collections/baggy"
                />
              </div>
            </>
          )}

          {/* Announcements Form */}
          {config.type === 'announcements' && (
            <>
              <div className="admin-form-group">
                <label className="admin-form-label">ANNOUNCEMENT TEXT *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.text || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, text: e.target.value }))
                  }
                  placeholder="e.g. FREE SHIPPING ON ALL ORDERS"
                  required
                />
              </div>
            </>
          )}

          <div className="admin-modal__footer">
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--black"
              disabled={isSaving}
            >
              {isSaving ? 'Saving Changes...' : config.isEdit ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
