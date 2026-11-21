'use client';

import React from 'react';
import { OBJECTS_CATEGORIES } from '@/data/objectsData';
import './ObjectsCategories.css';

export default function ObjectsCategories() {
  return (
    <section className="objects-categories" id="objects-categories">
      <div className="objects-categories__container">
        {/* Section Header */}
        <div className="objects-categories__header">
          <div className="objects-categories__title-wrap">
            <span className="objects-categories__subtitle">TACTICAL ARTIFACTS</span>
            <h2 className="objects-categories__title">CURATED OBJECT ARCHIVES</h2>
          </div>
          <span className="objects-categories__count">6 ARCHIVES AVAILABLE</span>
        </div>

        {/* Categories Grid */}
        <div className="objects-categories__grid">
          {OBJECTS_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={cat.href}
              className="objects-cat-card"
              id={cat.id}
            >
              <div className="objects-cat-card__media">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="objects-cat-card__img"
                  loading="lazy"
                />
                <div className="objects-cat-card__overlay" />
                <span className="objects-cat-card__pill">{cat.count}</span>
              </div>

              <div className="objects-cat-card__content">
                <div className="objects-cat-card__heading-row">
                  <h3 className="objects-cat-card__title">{cat.title}</h3>
                  <span className="objects-cat-card__arrow">→</span>
                </div>
                <p className="objects-cat-card__desc">{cat.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
