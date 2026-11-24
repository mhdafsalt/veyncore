'use client';

import React from 'react';
import AdminImageUploader from '../AdminImageUploader/AdminImageUploader';
import './ProductModal.css';

export default function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  formData,
  setFormData,
  onSubmit,
  isSaving = false,
}) {
  if (!isOpen) return null;

  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: titleVal,
      handle: !editingProduct
        ? titleVal
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : prev.handle,
    }));
  };

  const handleMainImageChange = (url) => {
    setFormData((prev) => {
      const updated = [...(prev.images || [''])];
      updated[0] = url;
      return { ...prev, images: updated };
    });
  };

  const handleAddImageSlot = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ''],
    }));
  };

  const handleUpdateImageSlot = (idx, url) => {
    setFormData((prev) => {
      const updated = [...(prev.images || [])];
      updated[idx] = url;
      return { ...prev, images: updated };
    });
  };

  const handleRemoveImageSlot = (idx) => {
    setFormData((prev) => {
      const updated = (prev.images || []).filter((_, i) => i !== idx);
      return { ...prev, images: updated.length > 0 ? updated : [''] };
    });
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3 className="admin-modal__title">
            {editingProduct ? 'EDIT PRODUCT' : 'CREATE NEW PRODUCT'}
          </h3>
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
          {/* Main Info */}
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">PRODUCT TITLE *</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. VEXO BLUE BAGGY"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">URL HANDLE / SLUG *</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.handle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, handle: e.target.value }))
                }
                placeholder="e.g. vexo-blue-baggy"
                required
              />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">MAIN CATEGORY *</label>
              <select
                className="admin-form-select"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                <option value="VEYN-SELECTS">VEYN-SELECTS (Denims &amp; Apparel)</option>
                <option value="VEYN-OBJECTS">VEYN-OBJECTS (Utilitarian Hardware &amp; Chains)</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">SUBCATEGORY / FIT</label>
              <input
                type="text"
                className="admin-form-input"
                style={{ textTransform: 'uppercase' }}
                value={formData.subCategory || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subCategory: e.target.value.toUpperCase(),
                    fit: e.target.value.toLowerCase(),
                    swipeCategory: e.target.value.toLowerCase(),
                  }))
                }
                placeholder="Enter category name"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">SALE PRICE (INR ₹) *</label>
              <input
                type="number"
                className="admin-form-input"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="1499"
                required
                min="0"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">REGULAR / COMPARE PRICE (INR ₹)</label>
              <input
                type="number"
                className="admin-form-input"
                value={formData.comparePrice}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, comparePrice: e.target.value }))
                }
                placeholder="1799"
                min="0"
              />
            </div>
          </div>

          {/* Badge & Sizes */}
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">BADGE (OPTIONAL)</label>
              <select
                className="admin-form-select"
                value={formData.badge}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, badge: e.target.value }))
                }
              >
                <option value="">None</option>
                <option value="NEW">NEW</option>
                <option value="SALE">SALE</option>
                <option value="BESTSELLER">BESTSELLER</option>
                <option value="HOT">HOT</option>
                <option value="RESTOCKED">RESTOCKED</option>
                <option value="OBJECT">OBJECT</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">AVAILABLE SIZES (COMMA SEPARATED)</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.availableSizes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, availableSizes: e.target.value }))
                }
                placeholder="28, 30, 32, 34, 36 or ONE SIZE"
              />
            </div>
          </div>

          {/* Main Thumbnail Upload */}
          <AdminImageUploader
            label="MAIN PRODUCT THUMBNAIL *"
            value={formData.images?.[0] || ''}
            onChange={handleMainImageChange}
            aspectRatio="3/4"
            placeholder="/images/products/artic-blue-wide.jpg"
            required
            helpText="Main display image for catalog grids and product detail card."
          />

          {/* Additional Images */}
          <div className="admin-form-group">
            <label className="admin-form-label">ADDITIONAL GALLERY IMAGES</label>
            <div className="product-modal__additional-images">
              {(formData.images || []).slice(1).map((imgUrl, idx) => (
                <div key={idx} className="product-modal__extra-image-box">
                  <AdminImageUploader
                    label={`Gallery Angle ${idx + 2}`}
                    value={imgUrl}
                    onChange={(newUrl) => handleUpdateImageSlot(idx + 1, newUrl)}
                    aspectRatio="3/4"
                    placeholder="/images/products/..."
                    onRemove={() => handleRemoveImageSlot(idx + 1)}
                  />
                </div>
              ))}
              <button
                type="button"
                className="admin-btn admin-btn--xs admin-btn--outline"
                onClick={handleAddImageSlot}
              >
                + Add Another Gallery Angle
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="admin-form-group">
            <label className="admin-form-label">EDITORIAL DESCRIPTION</label>
            <textarea
              className="admin-form-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Crafted from 100% heavy raw twill denim. Relaxed ergonomic drape..."
              rows={3}
            />
          </div>

          {/* Checkbox Toggles */}
          <div className="product-modal__checkboxes">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={Boolean(formData.newArrival)}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newArrival: e.target.checked }))
                }
              />
              <span>Display in &quot;Shop New Arrivals&quot; Section</span>
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={Boolean(formData.featured)}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                }
              />
              <span>Highlight as Featured Product</span>
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={formData.inStock !== false}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, inStock: e.target.checked }))
                }
              />
              <span>In Stock (Available for Direct WhatsApp Order)</span>
            </label>
          </div>

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
              {isSaving
                ? 'Saving...'
                : editingProduct
                ? 'Update Product'
                : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
