import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT, viewport } from '@/lib/motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  as?: keyof typeof motion;
}

/**
 * Scroll-triggered reveal wrapper.
 * - Fades up when entering viewport
 * - Animates once only
 * - Disabled automatically when user prefers reduced motion
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 0.55,
  y = 18,
  as = 'div',
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  // If user prefers reduced motion, render static (no layout shift, no jank)
  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const Tag = motion[as as 'div'] as React.ElementType;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  );
}
