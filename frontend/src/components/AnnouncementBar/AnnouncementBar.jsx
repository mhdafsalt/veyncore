'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/constants';
import './AnnouncementBar.css';

const initialAnnouncements = [
  'IDENTITY RUNS DEEP',
  'CASH ON DELIVERY AVAILABLE',
  '7 DAY EASY RETURNS & EXCHANGES',
];

let cachedAnnouncements = initialAnnouncements;

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState(() => cachedAnnouncements || initialAnnouncements);

  // Fetch dynamic announcements from backend (purely dynamic from database)
  useEffect(() => {
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content/announcements?t=${Date.now()}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          const activeList = data.data
            .filter((a) => a.active !== false)
            .map((a) => a.text)
            .filter(Boolean);
          if (activeList.length > 0) {
            cachedAnnouncements = activeList;
            if (isMounted) {
              setAnnouncements(activeList);
            }
          }
        }
      } catch (err) {
        // Silently continue
      }
    };

    fetchAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

  // If no dynamic announcements exist in database, reserve layout space to prevent CLS
  if (!announcements || announcements.length === 0) {
    return <aside className="announcement-bar" role="region" aria-label="Announcement Ticker" />;
  }

  // Duplicate array so each group is wide enough to seamlessly loop on all screens
  const marqueeItems = [...announcements, ...announcements];

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

        {/* Track Group 2 (Exact duplicate for seamless looping) */}
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
