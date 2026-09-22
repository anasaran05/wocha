'use client';

import React, { useState, useEffect } from 'react';
import StackLoader, { WOCHA_PRODUCT_1_IMAGES } from '@/components/ui/stack-loader';

interface AppEntryLoaderProps {
  children: React.ReactNode;
}

export function AppEntryLoader({ children }: AppEntryLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem('wocha_intro_played');
    if (seen === 'true') {
      setHasSeenIntro(true);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem('wocha_intro_played', 'true');
    setHasSeenIntro(true);
  };

  // During SSR or if already seen in current session, render children directly
  if (mounted && hasSeenIntro) {
    return <>{children}</>;
  }

  return (
    <StackLoader
      images={WOCHA_PRODUCT_1_IMAGES}
      imageSize={1.1}
      duration={1}
      fadeOutDuration={0.8}
      backgroundColor="#FAFAF8"
      textLeft="WOCHA ATELIER"
      textRight="ARCHITECTURAL APPAREL"
      textDescription="HEAVYWEIGHT ARCHIVE — EST. 2026"
      onComplete={handleComplete}
    >
      {children}
    </StackLoader>
  );
}
