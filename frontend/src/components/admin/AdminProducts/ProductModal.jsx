'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminImageUploader from '../AdminImageUploader/AdminImageUploader';
import {
  parseSizes,
  isTopCategory,
  generateDynamicMeasurements,
  buildCompleteMeasurements,
} from '@/lib/sizeChartUtils';
import './ProductModal.css';

export default function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  formData,
  setFormData,
  onSubmit,
  isSaving = false,
  siteContent = null,
  products = [],
}) {
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [sizeChartUnit, setSizeChartUnit] = useState('inches'); // 'inches' | 'cm'
  const [isCustomizingSizeChart, setIsCustomizingSizeChart] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsCustomSlug(Boolean(editingProduct && editingProduct.handle));
      setIsCustomizingSizeChart(false);
    }
  }, [isOpen, editingProduct]);

  // Derive active sizes
  const activeSizes = useMemo(() => {
    return parseSizes(formData.availableSizes);
  }, [formData.availableSizes]);

  const isTop = useMemo(() => {
    return isTopCategory(formData.subCategory);
  }, [formData.subCategory]);

  // If formData.measurements exists, use it; otherwise compute dynamically
  const activeMeasurements = useMemo(() => {
    if (
      formData.measurements?.[sizeChartUnit] &&
      Array.isArray(formData.measurements[sizeChartUnit]) &&
      formData.measurements[sizeChartUnit].length > 0
    ) {
      return formData.measurements[sizeChartUnit];
    }
    return generateDynamicMeasurements(
      activeSizes,
      sizeChartUnit,
      formData.subCategory,
      formData.category
    );
  }, [
    formData.measurements,
    sizeChartUnit,
    activeSizes,
    formData.subCategory,
    formData.category,
  ]);

  const handleAutoGenerateSizeChart = (presetType = 'auto') => {
    let sizes = activeSizes;
    let subCat = formData.subCategory;
    if (presetType === 'denim') {
      sizes = ['28', '30', '32', '34', '36'];
      subCat = 'BAGGY';
      setFormData((prev) => ({ ...prev, availableSizes: '28, 30, 32, 34, 36', subCategory: 'BAGGY' }));
    } else if (presetType === 'tops') {
      sizes = ['S', 'M', 'L', 'XL', 'XXL'];
      subCat = 'TOPS';
      setFormData((prev) => ({ ...prev, availableSizes: 'S, M, L, XL, XXL', subCategory: 'TOPS' }));
    }
    const full = buildCompleteMeasurements(sizes, subCat, formData.category);
    setFormData((prev) => ({
      ...prev,
      measurements: full,
    }));
  };

  const handleResetSizeChart = () => {
    setFormData((prev) => ({
      ...prev,
      measurements: null,
    }));
    setIsCustomizingSizeChart(false);
  };

  const handleUpdateMeasurementCell = (idx, field, value) => {
    setFormData((prev) => {
      const currentUnitRows = [
        ...(prev.measurements?.[sizeChartUnit] ||
          generateDynamicMeasurements(activeSizes, sizeChartUnit, prev.subCategory, prev.category)),
      ];
      currentUnitRows[idx] = {
        ...currentUnitRows[idx],
        [field]: value,
      };

      const otherUnit = sizeChartUnit === 'inches' ? 'cm' : 'inches';
      const factor = sizeChartUnit === 'inches' ? 2.54 : 1 / 2.54;
      const otherUnitRows = [
        ...(prev.measurements?.[otherUnit] ||
          generateDynamicMeasurements(activeSizes, otherUnit, prev.subCategory, prev.category)),
      ];
      if (otherUnitRows[idx]) {
        const numVal = parseFloat(value);
        if (!isNaN(numVal) && field !== 'size') {
          otherUnitRows[idx] = {
            ...otherUnitRows[idx],
            [field]: (numVal * factor).toFixed(1),
          };
        } else if (field === 'size') {
          otherUnitRows[idx] = {
            ...otherUnitRows[idx],
            size: value,
          };
        }
      }

      return {
        ...prev,
        measurements: {
          [sizeChartUnit]: currentUnitRows,
          [otherUnit]: otherUnitRows,
        },
      };
    });
  };

  const handleAddSizeRow = () => {
    setFormData((prev) => {
      const current = [
        ...(prev.measurements?.[sizeChartUnit] ||
          generateDynamicMeasurements(activeSizes, sizeChartUnit, prev.subCategory, prev.category)),
      ];
      const otherUnit = sizeChartUnit === 'inches' ? 'cm' : 'inches';
      const other = [
        ...(prev.measurements?.[otherUnit] ||
          generateDynamicMeasurements(activeSizes, otherUnit, prev.subCategory, prev.category)),
      ];

      const lastSize = current.length > 0 ? parseInt(current[current.length - 1].size, 10) : 0;
      const newSizeName = String(lastSize ? lastSize + 2 : '36');
      const newRow = isTop
        ? { size: newSizeName, chest: '44', length: '30', shoulder: '21', sleeve: '10' }
        : { size: newSizeName, waist: newSizeName, rise: '13.5', thighs: '28', length: '43', legOpening: '23.5' };
      const newOtherRow = isTop
        ? { size: newSizeName, chest: '111.8', length: '76.2', shoulder: '53.3', sleeve: '25.4' }
        : { size: newSizeName, waist: (parseInt(newSizeName, 10) * 2.54).toFixed(1), rise: '34.3', thighs: '71.1', length: '109.2', legOpening: '59.7' };

      return {
        ...prev,
        measurements: {
          [sizeChartUnit]: [...current, newRow],
          [otherUnit]: [...other, newOtherRow],
        },
      };
    });
  };

  const handleRemoveSizeRow = (idx) => {
    setFormData((prev) => {
      const current = [
        ...(prev.measurements?.[sizeChartUnit] ||
          generateDynamicMeasurements(activeSizes, sizeChartUnit, prev.subCategory, prev.category)),
      ];
      const otherUnit = sizeChartUnit === 'inches' ? 'cm' : 'inches';
      const other = [
        ...(prev.measurements?.[otherUnit] ||
          generateDynamicMeasurements(activeSizes, otherUnit, prev.subCategory, prev.category)),
      ];
      current.splice(idx, 1);
      other.splice(idx, 1);
      return {
        ...prev,
        measurements: {
          [sizeChartUnit]: current,
          [otherUnit]: other,
        },
      };
    });
  };

  // Helper to generate clean URL slug
  const generateSlug = (val) =>
    String(val || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    const newSlug = generateSlug(titleVal);
    setFormData((prev) => {
      // Auto-sync handle if handle is empty, or if it matched previous title slug, or not customized
      const prevTitleSlug = generateSlug(prev.title);
      const shouldSync = !isCustomSlug || !prev.handle || prev.handle === prevTitleSlug;
      return {
        ...prev,
        title: titleVal,
        handle: shouldSync ? newSlug : prev.handle,
      };
    });
  };

  const handleSlugChange = (e) => {
    const customVal = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setIsCustomSlug(Boolean(customVal && customVal !== generateSlug(formData.title)));
    setFormData((prev) => ({
      ...prev,
      handle: customVal,
    }));
  };

  const handleAutoGenerateSlug = () => {
    setIsCustomSlug(false);
    const newSlug = generateSlug(formData.title);
    setFormData((prev) => ({
      ...prev,
      handle: newSlug,
    }));
  };

  const currentCategory = formData.category || 'VEYN-SELECTS';

  // Dynamically extract available subcategories for the selected main category
  const availableSubcategories = useMemo(() => {
    const list = [];
    const seen = new Set();

    // 1. From dynamic subcategories configured in backend
    if (siteContent?.subcategories && Array.isArray(siteContent.subcategories)) {
      siteContent.subcategories
        .filter(
          (s) =>
            (s.mainCategory || 'VEYN-SELECTS') === currentCategory &&
            s.active !== false
        )
        .forEach((s) => {
          const raw = String(s.label || '').replace(/⚡|⚡️/g, '').trim().toUpperCase();
          if (
            raw &&
            !seen.has(raw) &&
            !['HOME', 'FLASH SALE', 'NEW DROPS', 'ALL DROPS', 'ALL OBJECTS'].includes(raw)
          ) {
            seen.add(raw);
            list.push(raw);
          }
        });
    }

    // 2. From real products in catalog
    if (products && Array.isArray(products)) {
      products
        .filter((p) => (p.category || 'VEYN-SELECTS') === currentCategory)
        .forEach((p) => {
          const cat = String(p.subCategory || p.fit || p.swipeCategory || '').trim().toUpperCase();
          if (cat && !seen.has(cat)) {
            seen.add(cat);
            list.push(cat);
          }
        });
    }

    // Standard defaults if none exists
    if (list.length === 0) {
      if (currentCategory === 'VEYN-OBJECTS') {
        ['BAGS', 'CHAINS', 'CAPS', 'SHADES', 'BRACELETS', 'WATCHES', 'BELTS'].forEach(c => list.push(c));
      } else {
        ['WIDE LEG', 'BAGGY', 'BOOTCUT', 'STRAIGHT', 'CARGO', 'DENIMS', 'TOPS'].forEach(c => list.push(c));
      }
    }

    return list;
  }, [siteContent, products, currentCategory]);

  const handleSelectSubCategory = (catName) => {
    const upper = String(catName || '').toUpperCase().trim();
    setFormData((prev) => ({
      ...prev,
      subCategory: upper,
      fit: upper.toLowerCase(),
      swipeCategory: upper.toLowerCase(),
    }));
  };

  if (!isOpen) return null;

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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <label className="admin-form-label" style={{ marginBottom: 0 }}>
                  URL HANDLE / SLUG *
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateSlug}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284c7',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                  title="Auto-generate slug from current title"
                >
                  ⚡ Dynamic Auto-Generate
                </button>
              </div>
              <input
                type="text"
                className="admin-form-input"
                value={formData.handle || ''}
                onChange={handleSlugChange}
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
              <label className="admin-form-label">SUBCATEGORY / FIT *</label>
              <select
                className="admin-form-select"
                value={(formData.subCategory || '').toUpperCase()}
                onChange={(e) => handleSelectSubCategory(e.target.value)}
                required
              >
                <option value="">SELECT SUBCATEGORY / FIT</option>
                {formData.subCategory &&
                  !availableSubcategories.includes((formData.subCategory || '').toUpperCase()) && (
                    <option value={(formData.subCategory || '').toUpperCase()}>
                      {(formData.subCategory || '').toUpperCase()}
                    </option>
                  )}
                {availableSubcategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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

          {/* Dynamic Size Chart & Measurements */}
          <div className="admin-sizechart-box">
            <div className="admin-sizechart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="admin-form-label" style={{ marginBottom: 0, fontWeight: 700 }}>
                  DYNAMIC SIZE CHART &amp; MEASUREMENTS
                </label>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: formData.measurements ? '#fef3c7' : '#e0f2fe',
                    color: formData.measurements ? '#b45309' : '#0369a1',
                  }}
                >
                  {formData.measurements
                    ? 'CUSTOMIZED CHART'
                    : `⚡ AUTO-SYNCED (${activeSizes.length || 5} SIZES)`}
                </span>
              </div>

              {/* Unit Switcher & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="size-modal__unit-toggle" style={{ margin: 0 }}>
                  <button
                    type="button"
                    className={`size-modal__unit-btn ${sizeChartUnit === 'inches' ? 'size-modal__unit-btn--active' : ''}`}
                    onClick={() => setSizeChartUnit('inches')}
                    style={{ padding: '3px 8px', fontSize: '11px' }}
                  >
                    IN
                  </button>
                  <button
                    type="button"
                    className={`size-modal__unit-btn ${sizeChartUnit === 'cm' ? 'size-modal__unit-btn--active' : ''}`}
                    onClick={() => setSizeChartUnit('cm')}
                    style={{ padding: '3px 8px', fontSize: '11px' }}
                  >
                    CM
                  </button>
                </div>

                <button
                  type="button"
                  className="admin-btn admin-btn--xs admin-btn--outline"
                  onClick={() => setIsCustomizingSizeChart((prev) => !prev)}
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  {isCustomizingSizeChart ? '✓ Done Customizing' : '✏️ Edit Measurements'}
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                type="button"
                className="admin-route-pill"
                onClick={() => handleAutoGenerateSizeChart('auto')}
                title="Auto-generate complete chart based on current available sizes"
              >
                ⚡ Sync with Sizes
              </button>
              <button
                type="button"
                className="admin-route-pill"
                onClick={() => handleAutoGenerateSizeChart('denim')}
                title="Fill with standard 28, 30, 32, 34, 36 denim chart"
              >
                👖 Standard Denim (28-36)
              </button>
              <button
                type="button"
                className="admin-route-pill"
                onClick={() => handleAutoGenerateSizeChart('tops')}
                title="Fill with standard S, M, L, XL, XXL tops chart"
              >
                👕 Tops / T-Shirts (S-XXL)
              </button>
              {formData.measurements && (
                <button
                  type="button"
                  className="admin-route-pill"
                  onClick={handleResetSizeChart}
                  style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                  title="Reset to dynamic auto-generated sizing"
                >
                  ↺ Reset to Auto
                </button>
              )}
            </div>

            {/* Dynamic Table Preview / Editor */}
            <div className="admin-sizechart-table-wrap">
              <table className="admin-sizechart-table">
                <thead>
                  {isTop ? (
                    <tr>
                      <th style={{ width: '80px' }}>SIZE</th>
                      <th>CHEST ({sizeChartUnit})</th>
                      <th>LENGTH ({sizeChartUnit})</th>
                      <th>SHOULDER ({sizeChartUnit})</th>
                      <th>SLEEVE ({sizeChartUnit})</th>
                      {isCustomizingSizeChart && <th style={{ width: '40px', textAlign: 'center' }}>ACTION</th>}
                    </tr>
                  ) : (
                    <tr>
                      <th style={{ width: '80px' }}>SIZE</th>
                      <th>WAIST ({sizeChartUnit})</th>
                      <th>RISE ({sizeChartUnit})</th>
                      <th>THIGHS ({sizeChartUnit})</th>
                      <th>LENGTH ({sizeChartUnit})</th>
                      <th>LEG OPENING ({sizeChartUnit})</th>
                      {isCustomizingSizeChart && <th style={{ width: '40px', textAlign: 'center' }}>ACTION</th>}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {activeMeasurements.map((row, idx) => (
                    <tr key={`${row.size}-${idx}`}>
                      <td style={{ fontWeight: 700 }}>
                        {isCustomizingSizeChart ? (
                          <input
                            type="text"
                            className="admin-sizechart-input"
                            value={row.size}
                            onChange={(e) => handleUpdateMeasurementCell(idx, 'size', e.target.value)}
                          />
                        ) : (
                          row.size
                        )}
                      </td>
                      {isTop ? (
                        <>
                          <td>
                            {isCustomizingSizeChart ? (
                              <input
                                type="text"
                                className="admin-sizechart-input"
                                value={row.chest || ''}
                                onChange={(e) => handleUpdateMeasurementCell(idx, 'chest', e.target.value)}
                              />
                            ) : (
                              row.chest
                            )}
                          </td>
                          <td>
                            {isCustomizingSizeChart ? (
                              <input
                                type="text"
                                className="admin-sizechart-input"
                                value={row.length || ''}
                                onChange={(e) => handleUpdateMeasurementCell(idx, 'length', e.target.value)}
                              />
                            ) : (
                              row.length
                            )}
                          </td>
                          <td>
                            {isCustomizingSizeChart ? (
                              <input
                                type="text"
                                className="admin-sizechart-input"
                                value={row.shoulder || ''}
                                onChange={(e) => handleUpdateMeasurementCell(idx, 'shoulder', e.target.value)}
                              />
                            ) : (
                              row.shoulder
                            )}
                          </td>
                          <td>
                            {isCustomizingSizeChart ? (
                              <input
                                type="text"
                                className="admin-sizechart-input"
                                value={row.sleeve || ''}
                                onChange={(e) => handleUpdateMeasurementCell(idx, 'sleeve', e.target.value)}
                              />
                            ) : (
                              row.sleeve
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            {isCustomizingSizeChart ? (
                              <input
                                type="text"
                                className="admin-sizechart-input"
                                value={row.waist || ''}
                                onChange={(e) => handleUpdateMeasurementCell(idx, 'waist', e.target.value)}
                              />
                            ) : (
                              row.waist
                            )}
                          </td>
                          <td>
                            {isCustomizingSizeChart ? (
                              <input
                                type="text"
                                className="admin-sizechart-input"
                                value={row.rise || ''}
                                onChange={(e) => handleUpdateMeasurementCell(idx, 'rise', e.target.value)}
                              />
                            ) : (
                              row.rise
                            )}
                          </td>
                          <td>
                            {isCustomizingSizeChart ? (
                              <input
                                type="text"
                                className="admin-sizechart-input"
                                value={row.thighs || ''}
                                onChange={(e) => handleUpdateMeasurementCell(idx, 'thighs', e.target.value)}
                              />
                            ) : (
                              row.thighs
                            )}
                          </td>
                          <td>
                            {isCustomizingSizeChart ? (
                              <input
                                type="text"
                                className="admin-sizechart-input"
                                value={row.length || ''}
                                onChange={(e) => handleUpdateMeasurementCell(idx, 'length', e.target.value)}
                              />
                            ) : (
                              row.length
                            )}
                          </td>
                          <td>
                            {isCustomizingSizeChart ? (
                              <input
                                type="text"
                                className="admin-sizechart-input"
                                value={row.legOpening || ''}
                                onChange={(e) => handleUpdateMeasurementCell(idx, 'legOpening', e.target.value)}
                              />
                            ) : (
                              row.legOpening
                            )}
                          </td>
                        </>
                      )}
                      {isCustomizingSizeChart && (
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveSizeRow(idx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '14px',
                            }}
                            title="Delete row"
                          >
                            ✕
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isCustomizingSizeChart && (
              <div>
                <button
                  type="button"
                  className="admin-btn admin-btn--xs admin-btn--outline"
                  onClick={handleAddSizeRow}
                  style={{ fontSize: '11px' }}
                >
                  + Add Custom Size Row
                </button>
              </div>
            )}

            {/* Optional Custom Size Chart Image */}
            <div style={{ marginTop: '4px' }}>
              <label className="admin-form-label" style={{ fontSize: '11px', color: '#64748b' }}>
                CUSTOM SIZE CHART IMAGE (OPTIONAL DIAGRAM OR INFOGRAPHIC)
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.sizeChartImage || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, sizeChartImage: e.target.value }))}
                placeholder="e.g. /images/size-guides/denim-fit-chart.jpg or paste image URL"
                style={{ fontSize: '12px' }}
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

          {/* Checkbox Toggles & Stock Inventory */}
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

            {/* Dedicated Stock Input Box */}
            <div
              style={{
                marginTop: '6px',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <label
                  className="admin-form-label"
                  style={{
                    marginBottom: 0,
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    color: '#0f172a',
                  }}
                >
                  STOCK QUANTITY / INVENTORY *
                </label>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor:
                      Number(
                        formData.stock !== undefined
                          ? formData.stock
                          : formData.inStock !== false
                          ? 50
                          : 0
                      ) > 0
                        ? '#dcfce7'
                        : '#fee2e2',
                    color:
                      Number(
                        formData.stock !== undefined
                          ? formData.stock
                          : formData.inStock !== false
                          ? 50
                          : 0
                      ) > 0
                        ? '#15803d'
                        : '#b91c1c',
                  }}
                >
                  {Number(
                    formData.stock !== undefined
                      ? formData.stock
                      : formData.inStock !== false
                      ? 50
                      : 0
                  ) > 0
                    ? `✓ IN STOCK (${
                        formData.stock !== undefined
                          ? formData.stock
                          : formData.inStock !== false
                          ? 50
                          : 0
                      } UNITS)`
                    : '✕ OUT OF STOCK (0 UNITS)'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  className="admin-form-input"
                  min="0"
                  step="1"
                  value={
                    formData.stock !== undefined
                      ? formData.stock
                      : formData.inStock !== false
                      ? 50
                      : 0
                  }
                  onChange={(e) => {
                    const rawVal = e.target.value;
                    const val =
                      rawVal === '' ? '' : Math.max(0, parseInt(rawVal, 10) || 0);
                    setFormData((prev) => ({
                      ...prev,
                      stock: val,
                      inStock: val === '' || Number(val) > 0,
                    }));
                  }}
                  placeholder="e.g. 50"
                  required
                  style={{
                    height: '38px',
                    fontWeight: 600,
                    fontSize: '13px',
                    flex: '1',
                  }}
                />

                <div style={{ display: 'flex', gap: '4px' }}>
                  {[
                    { label: 'Out of Stock', val: 0 },
                    { label: '10', val: 10 },
                    { label: '50', val: 50 },
                    { label: '100', val: 100 },
                  ].map((preset) => {
                    const currentStock = Number(
                      formData.stock !== undefined
                        ? formData.stock
                        : formData.inStock !== false
                        ? 50
                        : 0
                    );
                    const isSelected = currentStock === preset.val;
                    return (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            stock: preset.val,
                            inStock: preset.val > 0,
                          }))
                        }
                        style={{
                          padding: '6px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: isSelected
                            ? '1px solid #0f172a'
                            : '1px solid #cbd5e1',
                          borderRadius: '6px',
                          background: isSelected ? '#0f172a' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  lineHeight: '1.4',
                }}
              >
                Set available product inventory. When stock is 0, product is marked as SOLD OUT on catalog and WhatsApp ordering.
              </span>
            </div>
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
