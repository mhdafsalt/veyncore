'use client';

import React, { useState, useEffect, useCallback } from "react";
import "./VeyncoreLoader.css";

/**
 * Full-screen Veyncore intro loader.
 * Usage: <VeyncoreLoader onComplete={() => setIsLoading(false)} duration={3000} />
 */
export default function VeyncoreLoader({ onComplete, duration = 3000 }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleFinish = useCallback(() => {
    setIsFadingOut(true);
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 420);
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
          />
        </div>
      </div>

    </div>
  );
}
