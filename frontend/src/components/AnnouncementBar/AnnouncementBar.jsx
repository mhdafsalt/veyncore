'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/constants';
import './AnnouncementBar.css';

const DEFAULT_ANNOUNCEMENTS = [
  'LEAD WITH CONFIDENCE',
  'FREE SHIPPING ON ALL ORDERS',
  'NEW DENIM DROPS LIVE NOW',
  'CASH ON DELIVERY AVAILABLE',
  'EASY 7-DAY EXCHANGES'
];

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState(DEFAULT_ANNOUNCEMENTS);

  // Fetch dynamic announcements from backend
  useEffect(() => {
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content/announcements`);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const activeList = data.data
            .filter((a) => a.active !== false)
            .map((a) => a.text)
            .filter(Boolean);
          if (isMounted && activeList.length > 0) {
            setAnnouncements(activeList);
          }
        }
      } catch (err) {
        // Fallback to defaults
      }
    };

    fetchAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

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
