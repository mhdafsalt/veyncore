'use client';

import React from 'react';
import { OBJECTS_MANIFESTO } from '@/data/objectsData';
import './ObjectsManifesto.css';

export default function ObjectsManifesto() {
  return (
    <section className="objects-manifesto" id="objects-manifesto">
      <div className="objects-manifesto__container">
        <div className="objects-manifesto__inner">
          <span className="objects-manifesto__tag">ARCHITECTURAL MANIFESTO</span>
          <h2 className="objects-manifesto__quote">{OBJECTS_MANIFESTO.quote}</h2>
          <p className="objects-manifesto__subquote">{OBJECTS_MANIFESTO.subquote}</p>
          <p className="objects-manifesto__body">{OBJECTS_MANIFESTO.body}</p>

          <div className="objects-manifesto__stats-grid">
            {OBJECTS_MANIFESTO.stats.map((stat, idx) => (
              <div key={idx} className="objects-manifesto__stat-card">
                <span className="objects-manifesto__stat-value">{stat.value}</span>
                <span className="objects-manifesto__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
