'use client';

import React, { useState } from 'react';
import './AdminHeroSlides.css';

export default function AdminHeroSlides({
  heroSlides = [],
  loading = false,
  onRefresh,
  onAddSlide,
  onEditSlide,
  onDeleteSlide,
  onToggleSlide,
}) {
  const [filterSection, setFilterSection] = useState('ALL');

  const filteredSlides = (heroSlides || []).filter((s) => {
    if (filterSection === 'ALL') return true;
    return (s.targetSection || 'VEYN-SELECTS') === filterSection;
  });

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1 className="admin-view__title">HOMEPAGE HERO CAROUSEL</h1>
          <p className="admin-view__subtitle">
            Manage the edge-to-edge 3-box infinite carousel visual banners for VEYN-SELECTS &amp; VEYN-OBJECTS.
          </p>
        </div>
        <div className="admin-view__actions">
          {onRefresh && (
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh hero slides from database"
            >
              ↻ Refresh
            </button>
          )}
          <button
            type="button"
            className="admin-btn admin-btn--black"
            onClick={onAddSlide}
          >
            + ADD HERO SLIDE
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-filters-bar">
        <div className="admin-filter-pills">
          <button
            type="button"
            className={`admin-filter-pill ${
              filterSection === 'ALL' ? 'admin-filter-pill--active' : ''
            }`}
            onClick={() => setFilterSection('ALL')}
          >
            ALL HERO SLIDES ({heroSlides.length})
          </button>
          <button
            type="button"
            className={`admin-filter-pill ${
              filterSection === 'VEYN-SELECTS' ? 'admin-filter-pill--active' : ''
            }`}
            onClick={() => setFilterSection('VEYN-SELECTS')}
          >
            VEYN-SELECTS ({heroSlides.filter((s) => (s.targetSection || 'VEYN-SELECTS') === 'VEYN-SELECTS').length})
          </button>
          <button
            type="button"
            className={`admin-filter-pill ${
              filterSection === 'VEYN-OBJECTS' ? 'admin-filter-pill--active' : ''
            }`}
            onClick={() => setFilterSection('VEYN-OBJECTS')}
          >
            VEYN-OBJECTS ({heroSlides.filter((s) => s.targetSection === 'VEYN-OBJECTS').length})
          </button>
        </div>
      </div>

      {/* Hero Visual Cards Grid */}
      <div className="admin-hero-cards-grid">
        {loading ? (
          <div className="admin-hero-slides__empty" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span className="admin-loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
              <span>Loading hero slides from database...</span>
            </div>
          </div>
        ) : filteredSlides.length > 0 ? (
          filteredSlides.map((slide, idx) => (
            <div key={slide.id || idx} className="admin-hero-card">
              <div className="admin-hero-card__media">
                <img
                  src={slide.image}
                  alt={slide.title || 'Hero Slide'}
                  className="admin-hero-card__img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/hero/heroimg01.jpg';
                  }}
                />
                <span className="admin-hero-card__section-badge">
                  {slide.targetSection || 'VEYN-SELECTS'}
                </span>
                {slide.tag && (
                  <span className="admin-hero-card__tag-badge">{slide.tag}</span>
                )}
              </div>

              <div className="admin-hero-card__body">
                {slide.title && (
                  <h3 className="admin-hero-card__title">{slide.title}</h3>
                )}
                {slide.subtitle && (
                  <p className="admin-hero-card__sub">{slide.subtitle}</p>
                )}
                <div className="admin-hero-card__href">
                  <span style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>Link: </span>
                  {slide.href || '/collections/all-drops'}
                </div>
              </div>

              <div className="admin-hero-card__footer">
                <button
                  type="button"
                  onClick={() => onToggleSlide(idx, 'active')}
                  className={`admin-badge admin-badge--${
                    slide.active !== false ? 'active' : 'inactive'
                  } admin-hero-slides__toggle-btn`}
                >
                  {slide.active !== false ? 'ACTIVE ON SITE' : 'INACTIVE'}
                </button>

                <div className="admin-row-actions">
                  <button
                    type="button"
                    className="admin-icon-btn"
                    title="Edit Slide"
                    onClick={() => onEditSlide(idx)}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn admin-icon-btn--danger"
                    title="Delete Slide"
                    onClick={() => onDeleteSlide(idx)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-hero-slides__empty">
            <p>No hero slides added yet.</p>
            <button
              type="button"
              className="admin-btn admin-btn--sm admin-btn--black"
              onClick={onAddSlide}
            >
              + Create First Slide
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
