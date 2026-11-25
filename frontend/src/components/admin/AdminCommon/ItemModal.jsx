'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  siteContent = null,
  products = [],
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

  // Helper to generate slug from label
  const getSlugFromLabel = (label = '') =>
    label
      .toLowerCase()
      .replace(/⚡|⚡️/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const currentMainCategory = formData.mainCategory || 'VEYN-SELECTS';
  const dropsPath =
    currentMainCategory === 'VEYN-OBJECTS'
      ? '/collections/objects-drops'
      : '/collections/all-drops';
  const homePath =
    currentMainCategory === 'VEYN-OBJECTS' ? '/veyn-objects' : '/';
  const newDropsPath = `${dropsPath}?badge=new`;

  // Hero Section Dynamic Route Helpers
  const currentHeroSection = formData.targetSection || 'VEYN-SELECTS';
  const heroDropsPath =
    currentHeroSection === 'VEYN-OBJECTS'
      ? '/collections/objects-drops'
      : '/collections/all-drops';
  const heroHomePath =
    currentHeroSection === 'VEYN-OBJECTS' ? '/veyn-objects' : '/';
  const heroNewDropsPath = `${heroDropsPath}?badge=new`;
  const heroHashPath =
    currentHeroSection === 'VEYN-OBJECTS' ? '#object-drops' : '#flash-sale';

  // Dynamic Categories available for the current Hero Section
  const availableHeroCategories = useMemo(() => {
    const list = [];
    const seen = new Set();

    // 1. From siteContent.subcategories
    if (siteContent?.subcategories && Array.isArray(siteContent.subcategories)) {
      siteContent.subcategories
        .filter(
          (s) =>
            (s.mainCategory || 'VEYN-SELECTS') === currentHeroSection &&
            s.active !== false
        )
        .forEach((s) => {
          const raw = (s.label || '').replace(/⚡|⚡️/g, '').trim();
          const slug = getSlugFromLabel(raw);
          if (
            slug &&
            !seen.has(slug) &&
            !['home', 'flash-sale', 'new-drops', 'all-drops', 'all-objects'].includes(slug)
          ) {
            seen.add(slug);
            list.push({
              label: raw.toUpperCase(),
              href: `${heroDropsPath}?category=${slug}`,
            });
          }
        });
    }

    // 2. From products
    if (products && Array.isArray(products)) {
      products
        .filter((p) => (p.category || 'VEYN-SELECTS') === currentHeroSection)
        .forEach((p) => {
          const cat = (p.subCategory || p.fit || '').trim();
          const slug = getSlugFromLabel(cat);
          if (slug && !seen.has(slug)) {
            seen.add(slug);
            list.push({
              label: cat.toUpperCase(),
              href: `${heroDropsPath}?category=${slug}`,
            });
          }
        });
    }

    // Standard default categories if list is empty
    if (list.length === 0) {
      if (currentHeroSection === 'VEYN-OBJECTS') {
        list.push(
          { label: 'BAGS', href: '/collections/objects-drops?category=bags' },
          { label: 'CHAINS', href: '/collections/objects-drops?category=chains' },
          { label: 'CAPS', href: '/collections/objects-drops?category=caps' }
        );
      } else {
        list.push(
          { label: 'WIDE LEG', href: '/collections/all-drops?category=wide-fit' },
          { label: 'BAGGY', href: '/collections/all-drops?category=baggy' },
          { label: 'BOOTCUT', href: '/collections/all-drops?category=bootcut' }
        );
      }
    }

    return list;
  }, [siteContent, products, currentHeroSection, heroDropsPath]);

  // Products available for direct linking in current Hero Section
  const availableHeroProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return products
      .filter((p) => (p.category || 'VEYN-SELECTS') === currentHeroSection && p.handle)
      .slice(0, 30);
  }, [products, currentHeroSection]);

  // Dynamic Categories available for SwipeCategories based on targetSection
  const currentSwipeSection = formData.targetSection || 'VEYN-SELECTS';
  const availableSwipeCategories = useMemo(() => {
    const list = [];
    const seen = new Set();
    const isObjects = currentSwipeSection === 'VEYN-OBJECTS';

    // 1. From real products catalog
    if (products && Array.isArray(products)) {
      products
        .filter((p) => (p.category || 'VEYN-SELECTS') === currentSwipeSection)
        .forEach((p) => {
          const candidates = [p.subCategory, p.fit, p.swipeCategory].filter(Boolean);
          candidates.forEach((cand) => {
            const raw = String(cand).trim();
            const slug = getSlugFromLabel(raw);
            if (slug && !seen.has(slug)) {
              seen.add(slug);
              list.push({
                label: raw.toUpperCase(),
                slug: slug,
                count: products.filter(
                  (item) =>
                    (item.category || 'VEYN-SELECTS') === currentSwipeSection &&
                    [item.subCategory, item.fit, item.swipeCategory]
                      .filter(Boolean)
                      .some((c) => getSlugFromLabel(c) === slug)
                ).length,
              });
            }
          });
        });
    }

    // 2. From siteContent.subcategories
    if (siteContent?.subcategories && Array.isArray(siteContent.subcategories)) {
      siteContent.subcategories
        .filter(
          (s) =>
            (s.mainCategory || 'VEYN-SELECTS') === currentSwipeSection &&
            s.active !== false
        )
        .forEach((s) => {
          const raw = (s.label || '').replace(/⚡|⚡️/g, '').trim();
          const slug = getSlugFromLabel(raw);
          if (
            slug &&
            !seen.has(slug) &&
            !['home', 'flash-sale', 'new-drops', 'all-drops', 'all-objects'].includes(slug)
          ) {
            seen.add(slug);
            list.push({
              label: raw.toUpperCase(),
              slug: slug,
              count: 0,
            });
          }
        });
    }

    // 3. Fallback standard core fits / categories if not already present
    const defaultList = isObjects
      ? [
          { label: 'BAGS', slug: 'bags' },
          { label: 'CHAINS', slug: 'chains' },
          { label: 'CAPS', slug: 'caps' },
          { label: 'SHADES', slug: 'shades' },
          { label: 'BRACELETS', slug: 'bracelets' },
          { label: 'WATCHES', slug: 'watches' },
          { label: 'BELTS', slug: 'belts' },
        ]
      : [
          { label: 'BAGGY', slug: 'baggy' },
          { label: 'BOOTCUT', slug: 'bootcut' },
          { label: 'WIDE', slug: 'wide' },
          { label: 'STRAIGHT', slug: 'straight' },
          { label: 'CARGO', slug: 'cargo' },
          { label: 'DENIMS', slug: 'denims' },
          { label: 'TOPS', slug: 'tops' },
        ];

    defaultList.forEach((def) => {
      if (!seen.has(def.slug)) {
        seen.add(def.slug);
        list.push({
          label: def.label,
          slug: def.slug,
          count: 0,
        });
      }
    });

    return list;
  }, [products, siteContent, currentSwipeSection]);

  // Dynamic Categories available for Subcategories based on mainCategory
  const availableSubcategoriesList = useMemo(() => {
    const list = [];
    const seen = new Set();
    const isObjects = currentMainCategory === 'VEYN-OBJECTS';

    // 1. From real products catalog
    if (products && Array.isArray(products)) {
      products
        .filter((p) => (p.category || 'VEYN-SELECTS') === currentMainCategory)
        .forEach((p) => {
          const candidates = [p.subCategory, p.fit, p.swipeCategory].filter(Boolean);
          candidates.forEach((cand) => {
            const raw = String(cand).trim();
            const slug = getSlugFromLabel(raw);
            if (slug && !seen.has(slug)) {
              seen.add(slug);
              list.push({
                label: raw.toUpperCase(),
                slug: slug,
                count: products.filter(
                  (item) =>
                    (item.category || 'VEYN-SELECTS') === currentMainCategory &&
                    [item.subCategory, item.fit, item.swipeCategory]
                      .filter(Boolean)
                      .some((c) => getSlugFromLabel(c) === slug)
                ).length,
              });
            }
          });
        });
    }

    // 2. Standard defaults
    const defaultList = isObjects
      ? [
          { label: 'OBJECT DROPS', slug: 'obj-drops' },
          { label: 'ALL DROPS', slug: 'all-drops' },
          { label: 'BAGS', slug: 'bags' },
          { label: 'CHAINS', slug: 'chains' },
          { label: 'CAPS', slug: 'caps' },
          { label: 'SHADES', slug: 'shades' },
          { label: 'BRACELETS', slug: 'bracelets' },
          { label: 'WATCHES', slug: 'watches' },
          { label: 'BELTS', slug: 'belts' },
        ]
      : [
          { label: 'HOME', slug: 'home' },
          { label: 'FLASH SALE ⚡️', slug: 'flash-sale' },
          { label: 'NEW DROPS ⚡️', slug: 'new-drops' },
          { label: 'ALL DROPS', slug: 'all-drops' },
          { label: 'BAGGY', slug: 'baggy' },
          { label: 'BOOTCUT', slug: 'bootcut' },
          { label: 'WIDE', slug: 'wide' },
          { label: 'STRAIGHT', slug: 'straight' },
          { label: 'CARGO', slug: 'cargo' },
          { label: 'DENIMS', slug: 'denims' },
          { label: 'TOPS', slug: 'tops' },
        ];

    defaultList.forEach((def) => {
      if (!seen.has(def.slug)) {
        seen.add(def.slug);
        list.push({
          label: def.label,
          slug: def.slug,
          count: 0,
        });
      }
    });

    return list;
  }, [products, currentMainCategory]);

  if (!isOpen) return null;

  const currentSlug = getSlugFromLabel(formData.label);
  const expectedDynamicRoute = currentSlug
    ? `${dropsPath}?category=${currentSlug}`
    : `${dropsPath}?category=category-name`;

  const isDynamicCategoryActive =
    autoSyncRoute ||
    (formData.href && formData.href.includes('?category='));

  // Handle Category Select for Swipe Categories from dynamic dropdown
  const handleSwipeCategorySelect = (selectedLabel) => {
    if (!selectedLabel || selectedLabel === 'CUSTOM') return;
    const matched = availableSwipeCategories.find((c) => c.label === selectedLabel);
    const slug = matched ? matched.slug : getSlugFromLabel(selectedLabel);
    const isObj = (formData.targetSection || 'VEYN-SELECTS') === 'VEYN-OBJECTS';
    const baseDrops = isObj ? '/collections/objects-drops' : '/collections/all-drops';

    setFormData((prev) => ({
      ...prev,
      label: selectedLabel,
      key: slug,
      collectionPath: `${baseDrops}?category=${slug}`,
    }));
  };

  const handleSwipeLabelInputChange = (val) => {
    const upperVal = (val || '').toUpperCase();
    const slug = getSlugFromLabel(upperVal);
    const isObj = (formData.targetSection || 'VEYN-SELECTS') === 'VEYN-OBJECTS';
    const baseDrops = isObj ? '/collections/objects-drops' : '/collections/all-drops';

    setFormData((prev) => ({
      ...prev,
      label: upperVal,
      key: prev.key && config.isEdit ? prev.key : slug,
      collectionPath:
        prev.collectionPath && config.isEdit
          ? prev.collectionPath
          : slug
          ? `${baseDrops}?category=${slug}`
          : baseDrops,
    }));
  };

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

  // Handle Hero Section Change
  const handleHeroSectionChange = (newSection) => {
    const newDrops =
      newSection === 'VEYN-OBJECTS'
        ? '/collections/objects-drops'
        : '/collections/all-drops';
    const newHome = newSection === 'VEYN-OBJECTS' ? '/veyn-objects' : '/';

    setFormData((prev) => {
      let updatedHref = prev.href;
      if (
        prev.href === '/collections/all-drops' ||
        prev.href === '/collections/objects-drops'
      ) {
        updatedHref = newDrops;
      } else if (prev.href === '/' || prev.href === '/veyn-objects') {
        updatedHref = newHome;
      } else if (prev.href && prev.href.includes('?category=')) {
        const cat = prev.href.split('?category=')[1];
        updatedHref = `${newDrops}?category=${cat}`;
      } else if (prev.href === '#flash-sale' || prev.href === '#object-drops') {
        updatedHref = newSection === 'VEYN-OBJECTS' ? '#object-drops' : '#flash-sale';
      }

      return {
        ...prev,
        targetSection: newSection,
        href: updatedHref || newDrops,
      };
    });
  };

  // Preset click handler for Subcategories
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
                <select
                  className="admin-form-select"
                  style={{ marginBottom: '8px' }}
                  value={
                    availableSubcategoriesList.some((c) => c.label === (formData.label || '').replace(/⚡|⚡️/g, '').trim())
                      ? (formData.label || '').replace(/⚡|⚡️/g, '').trim()
                      : formData.label
                      ? 'CUSTOM'
                      : ''
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && val !== 'CUSTOM') {
                      handleLabelChange(val);
                    }
                  }}
                >
                  <option value="">⚡ Select Dynamic Subcategory / Fit...</option>
                  <optgroup label={`📂 Available ${currentMainCategory} Categories`}>
                    {availableSubcategoriesList.map((cat) => (
                      <option key={cat.slug} value={cat.label}>
                        {cat.label} {cat.count > 0 ? `(${cat.count} products)` : ''}
                      </option>
                    ))}
                  </optgroup>
                  <option value="CUSTOM">✏️ + Custom Subcategory Name (Type Below)</option>
                </select>

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
                  onChange={(e) => handleHeroSectionChange(e.target.value)}
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
                placeholder={
                  formData.targetSection === 'VEYN-OBJECTS'
                    ? '/images/hero/ObjectHero01.png'
                    : '/images/hero/heroimg01.jpg'
                }
                required
                helpText="Choose an image file from your device or paste a web/local image URL."
              />

              {/* Dynamic Target Link / Route Section */}
              <div className="admin-form-group">
                <div className="admin-route-header-row">
                  <label className="admin-form-label" style={{ marginBottom: 0 }}>
                    TARGET LINK *
                  </label>
                  <span className="admin-route-helper-tag">
                    ⚡ Dynamic Route Selector
                  </span>
                </div>

                {/* Quick Presets Strip */}
                <div className="admin-route-presets" role="group" aria-label="Quick route presets for hero slide">
                  <button
                    type="button"
                    className={`admin-route-pill ${
                      formData.href === heroDropsPath ? 'admin-route-pill--active' : ''
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, href: heroDropsPath }))}
                    title="Navigate to full collection"
                  >
                    All Drops
                  </button>

                  <button
                    type="button"
                    className={`admin-route-pill ${
                      formData.href === heroNewDropsPath ? 'admin-route-pill--active' : ''
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, href: heroNewDropsPath }))}
                    title="Filter by New Drops badge"
                  >
                    New Drops
                  </button>

                  <button
                    type="button"
                    className={`admin-route-pill ${
                      formData.href === heroHashPath ? 'admin-route-pill--active' : ''
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, href: heroHashPath }))}
                    title="Scroll to section"
                  >
                    {currentHeroSection === 'VEYN-OBJECTS' ? 'Object Drops' : '⚡ Flash Sale'}
                  </button>

                  <button
                    type="button"
                    className={`admin-route-pill ${
                      formData.href === heroHomePath ? 'admin-route-pill--active' : ''
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, href: heroHomePath }))}
                    title="Navigate to storefront home"
                  >
                    Home
                  </button>

                  {/* Dynamic Category Pills */}
                  {availableHeroCategories.slice(0, 4).map((cat) => (
                    <button
                      key={cat.href}
                      type="button"
                      className={`admin-route-pill ${
                        formData.href === cat.href ? 'admin-route-pill--active' : ''
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, href: cat.href }))}
                      title={`Filter by category ${cat.label}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Dynamic Category & Product Dropdown Picker */}
                <select
                  className="admin-form-select"
                  style={{ marginBottom: '8px' }}
                  value={
                    availableHeroCategories.some((c) => c.href === formData.href) ||
                    availableHeroProducts.some((p) => `/products/${p.handle}` === formData.href)
                      ? formData.href
                      : ''
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData((prev) => ({ ...prev, href: e.target.value }));
                    }
                  }}
                >
                  <option value="">⚡ Select Dynamic Category or Product Link...</option>
                  <optgroup label="📂 Dynamic Categories & Fits">
                    {availableHeroCategories.map((cat) => (
                      <option key={cat.href} value={cat.href}>
                        {cat.label} ({cat.href})
                      </option>
                    ))}
                  </optgroup>
                  {availableHeroProducts.length > 0 && (
                    <optgroup label="🏷️ Direct Products">
                      {availableHeroProducts.map((p) => (
                        <option key={p.handle} value={`/products/${p.handle}`}>
                          {p.title} (/products/{p.handle})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>

                {/* Direct Custom Route Input */}
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.href || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, href: e.target.value }))
                  }
                  placeholder={heroDropsPath}
                  required
                />

                <div className="admin-route-hint">
                  <span>
                    Destination URL when slide is clicked. Choose a quick preset pill, select from dynamic categories/products, or enter any custom URL.
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
                  onChange={(e) => {
                    const newSection = e.target.value;
                    const slug = getSlugFromLabel(formData.label || '');
                    const baseDrops =
                      newSection === 'VEYN-OBJECTS'
                        ? '/collections/objects-drops'
                        : '/collections/all-drops';
                    setFormData((prev) => ({
                      ...prev,
                      targetSection: newSection,
                      collectionPath: slug ? `${baseDrops}?category=${slug}` : baseDrops,
                    }));
                  }}
                >
                  <option value="VEYN-SELECTS">VEYN-SELECTS</option>
                  <option value="VEYN-OBJECTS">VEYN-OBJECTS</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">CATEGORY LABEL *</label>

                {/* Dynamic Category Dropdown */}
                <select
                  className="admin-form-select"
                  style={{ marginBottom: '8px' }}
                  value={
                    availableSwipeCategories.some((c) => c.label === (formData.label || '').trim())
                      ? (formData.label || '').trim()
                      : formData.label
                      ? 'CUSTOM'
                      : ''
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && val !== 'CUSTOM') {
                      handleSwipeCategorySelect(val);
                    }
                  }}
                >
                  <option value="">⚡ Select Dynamic Category / Fit...</option>
                  <optgroup label={`📂 Available ${formData.targetSection || 'VEYN-SELECTS'} Categories`}>
                    {availableSwipeCategories.map((cat) => (
                      <option key={cat.slug} value={cat.label}>
                        {cat.label} {cat.count > 0 ? `(${cat.count} products)` : ''}
                      </option>
                    ))}
                  </optgroup>
                  <option value="CUSTOM">✏️ + Custom Category Name (Type Below)</option>
                </select>

                <input
                  type="text"
                  className="admin-form-input"
                  style={{ textTransform: 'uppercase' }}
                  value={formData.label || ''}
                  onChange={(e) => handleSwipeLabelInputChange(e.target.value)}
                  placeholder="E.G. YOUR CATEGORY NAME"
                  required
                />
                <span className="admin-route-hint" style={{ marginTop: '4px', display: 'block' }}>
                  Select from dynamic categories above to auto-populate Key Identifier and Collection Route, or type a custom category name.
                </span>
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
                  placeholder="e.g. category-key (matches product category)"
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
                  placeholder="e.g. /collections/all-drops?category=your-category"
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
