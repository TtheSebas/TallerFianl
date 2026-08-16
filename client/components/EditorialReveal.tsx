'use client';

import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface EditorialRevealProps {
  children: React.ReactNode;
  delay?: number;      // Delay in ms (e.g. 150)
  duration?: number;   // Duration in ms (e.g. 850)
  yOffset?: number;    // Y offset in px (e.g. 24)
  className?: string;
  style?: React.CSSProperties;
}

export default function EditorialReveal({
  children,
  delay = 0,
  duration = 850,
  yOffset = 24,
  className = '',
  style = {},
}: EditorialRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${yOffset}px)`,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: isVisible ? 'auto' : 'opacity, transform',
        transitionProperty: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
