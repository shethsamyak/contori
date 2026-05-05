'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Mark the app as ready once the window has fully loaded,
    // or immediately if it already has.
    if (document.readyState === 'complete') {
      setAppReady(true);
    } else {
      const onLoad = () => setAppReady(true);
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  return (
    <>
      <LoadingScreen isReady={appReady} />
      {children}
    </>
  );
}
