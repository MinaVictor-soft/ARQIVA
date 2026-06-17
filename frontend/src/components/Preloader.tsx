import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArqivaLogo from '@/components/ArqivaLogo';

const HERO_FALLBACK = 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=80&auto=format';
const MIN_MS = 1800;   // minimum display time for branding
const MAX_MS = 5000;   // hard timeout — never block longer than this

interface PreloaderProps {
  onDone: () => void;
}

export default function Preloader({ onDone }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setVisible(false);
    // give the exit animation time to complete before unmounting
    setTimeout(onDone, 750);
  };

  useEffect(() => {
    const startedAt = Date.now();

    const proceed = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_MS - elapsed);
      setTimeout(finish, remaining);
    };

    // hard timeout — always bail out
    const maxTimer = setTimeout(finish, MAX_MS);

    // fetch settings to get the real hero image URL
    fetch('/api/settings')
      .then((r) => r.json())
      .then((res) => {
        const heroUrl: string = res?.data?.heroImage || HERO_FALLBACK;
        const img = new Image();
        img.onload = () => { clearTimeout(maxTimer); proceed(); };
        img.onerror = () => { clearTimeout(maxTimer); proceed(); };
        img.src = heroUrl;
      })
      .catch(() => { clearTimeout(maxTimer); proceed(); });

    return () => clearTimeout(maxTimer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
        >
          {/* Decorative architectural corner brackets */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Top-left corner */}
            <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
              <div className="w-8 h-px bg-arch-beige" />
              <div className="w-px h-8 bg-arch-beige" />
            </div>
            {/* Top-right corner */}
            <div className="absolute top-8 right-8 sm:top-12 sm:right-12 flex flex-col items-end">
              <div className="w-8 h-px bg-arch-beige" />
              <div className="w-px h-8 bg-arch-beige self-end" />
            </div>
            {/* Bottom-left corner */}
            <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 flex flex-col justify-end">
              <div className="w-px h-8 bg-arch-beige" />
              <div className="w-8 h-px bg-arch-beige" />
            </div>
            {/* Bottom-right corner */}
            <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 flex flex-col items-end justify-end">
              <div className="w-px h-8 bg-arch-beige self-end" />
              <div className="w-8 h-px bg-arch-beige" />
            </div>
          </motion.div>

          {/* Centre panel — logo + tagline */}
          <div className="flex flex-col items-center gap-6 px-8">
            {/* Thin top line that extends in */}
            <motion.div
              className="h-px bg-stone-brown/20"
              initial={{ width: 0 }}
              animate={{ width: '80px' }}
              transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Logo — natural colours on light background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <ArqivaLogo size="lg" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-[9px] tracking-[0.5em] uppercase text-stone-brown/50 font-light"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease: 'easeOut' }}
            >
              Architecture &amp; Design
            </motion.p>

            {/* Thin bottom line that extends out */}
            <motion.div
              className="h-px bg-stone-brown/20"
              initial={{ width: 0 }}
              animate={{ width: '80px' }}
              transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Progress bar at bottom */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[120px] h-px bg-stone-brown/12 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-arch-beige"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: MIN_MS / 1000 - 0.3, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
