'use client';

import React from 'react';
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
  if (!isOpen) return null;

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
                  value={formData.label || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, label: e.target.value }))
                  }
                  placeholder="e.g. FLASH SALE⚡️"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">MAIN CATEGORY *</label>
                <select
                  className="admin-form-select"
                  value={formData.mainCategory || 'VEYN-SELECTS'}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mainCategory: e.target.value }))
                  }
                >
                  <option value="VEYN-SELECTS">VEYN-SELECTS</option>
                  <option value="VEYN-OBJECTS">VEYN-OBJECTS</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">TARGET LINK / ROUTE *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.href || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, href: e.target.value }))
                  }
                  placeholder="e.g. #baggy or /collections/all-drops"
                  required
                />
              </div>

              <AdminImageUploader
                label="SUBCATEGORY ICON / IMAGE (OPTIONAL)"
                value={formData.image || ''}
                onChange={(newUrl) =>
                  setFormData((prev) => ({ ...prev, image: newUrl }))
                }
                aspectRatio="1/1"
                placeholder="/images/icons/..."
                helpText="Optional icon or thumbnail preview for this subcategory item."
              />

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

              <div className="admin-form-grid">
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

                <div className="admin-form-group">
                  <label className="admin-form-label">CORNER TAG BADGE (OPTIONAL)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={formData.tag || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tag: e.target.value }))
                    }
                    placeholder="e.g. DROP 01"
                  />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Optional promotional badge overlay
                  </span>
                </div>
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
