'use client';

import React from 'react';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import './LegalPage.css';

export default function LegalPage({
  title,
  subtitle,
  lastUpdated = 'November 2026',
  sections = [],
  initialCategory = null,
  showSubCategories = false,
  showMainCategories = true,
}) {
  return (
    <div className="legal-page">
      {/* 1. Standard Store Header without subcategory bar */}
      <StoreHeader
        initialCategory={initialCategory}
        showMainCategories={showMainCategories}
        showSubCategories={showSubCategories}
      />

      {/* 2. Main Policy Content */}
      <main className="legal-page__container">
        {/* Page Header */}
        <header className="legal-page__header">
          <h1 className="legal-page__title">{title}</h1>
          {subtitle && <p className="legal-page__subtitle">{subtitle}</p>}
        </header>

        {/* Content Layout */}
        <div className="legal-page__layout">
          {/* Quick Table of Contents Sidebar */}
          {sections.length > 0 && (
            <aside className="legal-page__sidebar" aria-label="Table of contents">
              <h2 className="legal-page__sidebar-title">QUICK SECTIONS</h2>
              <ul className="legal-page__nav-list">
                {sections.map((sec, idx) => {
                  const numberPrefix =
                    sec.number !== undefined
                      ? sec.number === false || sec.number === ''
                        ? ''
                        : `${sec.number}. `
                      : `${idx + 1}. `;
                  return (
                    <li key={sec.id || idx} className="legal-page__nav-item">
                      <a href={`#${sec.id || `section-${idx}`}`}>
                        {numberPrefix}{sec.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </aside>
          )}

          {/* Policy Text Sections */}
          <div className="legal-page__content">
            {sections.map((sec, idx) => (
              <section
                key={sec.id || idx}
                id={sec.id || `section-${idx}`}
                className="legal-section"
              >
                <div className="legal-section__header">
                  {sec.number !== false && (
                    <span className="legal-section__number">
                      {sec.number !== undefined
                        ? String(sec.number).padStart(2, '0') + '.'
                        : String(idx + 1).padStart(2, '0') + '.'}
                    </span>
                  )}
                  <h2 className="legal-section__heading">{sec.title}</h2>
                </div>
                <div className="legal-section__body">{sec.content}</div>
              </section>
            ))}

            {/* Bottom Support Callout Card */}
            <div className="legal-support-card">
              <div className="legal-support-card__info">
                <h3>NEED CLARIFICATION OR SUPPORT?</h3>
                <p>
                  Our legal concierge and dedicated customer care team are available to assist with any policy inquiries or order questions.
                </p>
              </div>
              <div className="legal-support-card__actions">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hello VEYNCORE Support, I have a query regarding your ${title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-support-card__btn legal-support-card__btn--white"
                >
                  WhatsApp Concierge
                </a>
                <a
                  href={`mailto:veyncore.in@gmail.com?subject=${encodeURIComponent(
                    `Inquiry Regarding VEYNCORE ${title}`
                  )}`}
                  className="legal-support-card__btn legal-support-card__btn--outline"
                >
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Standard Footer */}
      <Footer />
    </div>
  );
}
