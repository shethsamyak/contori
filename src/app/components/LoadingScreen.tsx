'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  /** Whether the app content is ready */
  isReady?: boolean;
}

export default function LoadingScreen({ isReady = false }: LoadingScreenProps) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isReady) {
      // Small grace period so the logo is visible briefly, then fade out
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShow(false), 500);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  if (!show) return null;

  return (
    <div
      className={`loading-screen ${fadeOut ? 'loading-screen--fade-out' : ''}`}
      id="app-loading-screen"
    >
      {/* Background ambient glow */}
      <div className="loading-screen__bg">
        <div className="loading-screen__orb loading-screen__orb--1" />
        <div className="loading-screen__orb loading-screen__orb--2" />
      </div>

      {/* Logo + progress */}
      <div className="loading-screen__content">
        <div className="loading-screen__logo-wrapper">
          <Image
            src="/main-logo.png"
            alt="Contori — Where Every Digit Matters"
            width={360}
            height={200}
            priority
            className="loading-screen__logo"
          />
        </div>

        {/* Progress bar */}
        <div className="loading-screen__progress">
          <div className="loading-screen__progress-bar" />
        </div>

        <p className="loading-screen__text">Loading your workspace&hellip;</p>
      </div>
    </div>
  );
}
