'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/constants';
import './AnnouncementBar.css';

let cachedAnnouncements = null;

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState(() => cachedAnnouncements || []);

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
          cachedAnnouncements = activeList;
          if (isMounted) {
            setAnnouncements(activeList);
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

  // If no dynamic announcements exist in database, do not render any mock announcement
  if (!announcements || announcements.length === 0) {
    return null;
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
