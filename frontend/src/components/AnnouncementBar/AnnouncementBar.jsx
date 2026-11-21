'use client';

import React from 'react';
import './AnnouncementBar.css';

const ANNOUNCEMENTS = [
  'LEAD WITH CONFIDENCE',
  'FREE SHIPPING ON ALL ORDERS',
  'NEW DENIM DROPS LIVE NOW',
  'CASH ON DELIVERY AVAILABLE',
  'EASY 7-DAY EXCHANGES'
];

export default function AnnouncementBar() {
  // Duplicate array so each group is wide enough to seamlessly loop on all screens
  const marqueeItems = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <aside className="announcement-bar" role="region" aria-label="Announcement Ticker">
      <div className="announcement-bar__track">
        {/* Track Group 1 */}
        <div className="announcement-bar__group" aria-hidden="false">
          {marqueeItems.map((text, idx) => (
            <span key={`group1-${idx}`} className="announcement-bar__item">
              <span className="announcement-bar__text">{text}</span>
              <span className="announcement-bar__separator" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>

        {/* Track Group 2 (Seamless loop copy) */}
        <div className="announcement-bar__group" aria-hidden="true">
          {marqueeItems.map((text, idx) => (
            <span key={`group2-${idx}`} className="announcement-bar__item">
              <span className="announcement-bar__text">{text}</span>
              <span className="announcement-bar__separator" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
