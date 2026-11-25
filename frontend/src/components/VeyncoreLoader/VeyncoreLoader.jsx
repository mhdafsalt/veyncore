'use client';

import React, { useState, useEffect, useCallback } from "react";
import "./VeyncoreLoader.css";

/**
 * Full-screen Veyncore intro loader.
 * Usage: <VeyncoreLoader onComplete={() => setIsLoading(false)} duration={1800} />
 */
export default function VeyncoreLoader({ onComplete, duration = 1800 }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Lock body scroll while loader is visible
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleFinish = useCallback(() => {
    setIsFadingOut(true);
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 280);
    return () => clearTimeout(completeTimer);
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(handleFinish, duration);
    return () => clearTimeout(timer);
  }, [duration, handleFinish]);

  return (
    <div
      className={`veyn-loader ${isFadingOut ? "veyn-loader--fade-out" : ""}`}
      role="status"
      aria-label="Loading Veyncore"
      onClick={handleFinish}
    >
      <div className="veyn-loader__content">
        <div className="veyn-loader__logo-wrap">
          <img
            className="veyn-loader__logo"
            src="/images/veyncoreLogo_black.svg"
            alt="Veyncore"
            width={350}
            height={70}
          />
        </div>
       
      </div>
    </div>
  );
}
