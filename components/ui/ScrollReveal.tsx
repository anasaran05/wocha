'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  initialY?: number;
}

export function ScrollReveal({
  children,
  className = '',
  delayMs = 0,
  initialY = 32,
}: ScrollRevealProps) {
  const [hasAppeared, setHasAppeared] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;

    // Check if element is already in the viewport upon mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      const timer = setTimeout(() => setHasAppeared(true), delayMs);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setHasAppeared(true), delayMs);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  // Before client mounting, render normally to preserve SSR and SEO without layout shifts
  const isRevealed = !mounted || hasAppeared;

  return (
    <div
      ref={ref}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0) scale(1)' : `translateY(${initialY}px) scale(0.985)`,
        transition: mounted
          ? 'opacity 0.95s cubic-bezier(0.16, 1, 0.3, 1), transform 0.95s cubic-bezier(0.16, 1, 0.3, 1)'
          : 'none',
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}
