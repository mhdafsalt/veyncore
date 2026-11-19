'use client';

import React, { useState, useEffect, useRef } from 'react';
import './AnnouncementBar.css';

const ANNOUNCEMENTS = [
  'LEAD WITH CONFIDENCE',
  'FREE SHIPPING ON EVERY ORDERS'
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const total = ANNOUNCEMENTS.length;

  const goToPrev = () => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goToNext = () => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      goToNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <aside className="announcement-bar" role="region" aria-label="Announcement">
      <div className="announcement-bar__container">
        <button
          type="button"
          className="announcement-bar__button announcement-bar__button--prev"
          onClick={goToPrev}
          aria-label="Previous announcement"
        >
          <svg
            className="announcement-bar__icon"
            width="6"
            height="11"
            viewBox="0 0 6 11"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4.7193 10.7605C4.85965 10.9202 5.03509 11 5.24561 11C5.45614 11 5.63158 10.9202 5.77193 10.7605C5.92398 10.6131 6 10.435 6 10.2261C6 10.005 5.92398 9.81463 5.77193 9.65494L1.80702 5.49079L5.77193 1.32663C5.92398 1.17923 6 1.00112 6 0.792295C6 0.571189 5.92398 0.380793 5.77193 0.221106C5.63158 0.0737018 5.45614 0 5.24561 0C5.03509 0 4.85965 0.0737018 4.7193 0.221106L0.22807 4.93802C0.0760236 5.09771 0 5.28811 0 5.50921C0 5.71803 0.0760236 5.89615 0.22807 6.04355L4.7193 10.7605Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <div className="announcement-bar__slider">
          <div
            className={`announcement-bar__message-track ${
              isAnimating ? 'announcement-bar__message-track--animating' : ''
            }`}
          >
            <p className="announcement-bar__message">
              {ANNOUNCEMENTS[currentIndex]}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="announcement-bar__button announcement-bar__button--next"
          onClick={goToNext}
          aria-label="Next announcement"
        >
          <svg
            className="announcement-bar__icon"
            width="6"
            height="11"
            viewBox="0 0 6 11"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1.278 10.721a.688.688 0 0 1-.528.229.688.688 0 0 1-.527-.229.669.669 0 0 1-.229-.51c0-.21.077-.392.229-.544l3.973-3.973L.223 1.721a.669.669 0 0 1-.229-.51c0-.21.077-.392.229-.544C.363.527.539.456.75.456c.211 0 .387.07.528.21l4.5 4.5a.744.744 0 0 1 .228.546c0 .199-.076.369-.228.51l-4.5 4.5Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}
