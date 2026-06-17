/**
 * Shared Framer Motion variants — GPU-accelerated, performance-first
 * All transforms use translate/opacity only (compositor-friendly)
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

// ── Core variants ────────────────────────────────────────────────────────────

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: EASE_OUT },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay, ease: EASE_OUT },
  }),
};

export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay, ease: EASE_OUT },
  }),
};

export const slideLeft = {
  hidden: { opacity: 0, x: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, delay, ease: EASE_OUT },
  }),
};

// ── Container variant (stagger children) ─────────────────────────────────────

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

// ── Viewport config ──────────────────────────────────────────────────────────

export const viewport = { once: true, margin: '-60px' } as const;
export const viewportEarly = { once: true, margin: '-20px' } as const;
