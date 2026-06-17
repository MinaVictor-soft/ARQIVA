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
    setTimeout(onDone, 700);
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

    // fetch settings to get the real hero image URL (skip external fallback)
    fetch('/api/settings')
      .then((r) => r.json())
      .then((res) => {
        const heroUrl: string | undefined = res?.data?.heroImage;

        // If no hero image configured, just use the timer
        if (!heroUrl) {
          clearTimeout(maxTimer);
          proceed();
          return;
        }

        const img = new Image();
        img.onload = () => {
          clearTimeout(maxTimer);
          proceed();
        };
        img.onerror = () => {
          clearTimeout(maxTimer);
          proceed();
        };
        img.src = heroUrl;
      })
      .catch(() => {
        clearTimeout(maxTimer);
        proceed();
      });

    return () => clearTimeout(maxTimer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5]"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }}
        >
          {/* Architectural corner brackets */}
          {[['top-6 left-6', 'border-t border-l'], ['top-6 right-6', 'border-t border-r'], ['bottom-6 left-6', 'border-b border-l'], ['bottom-6 right-6', 'border-b border-r']].map(([pos, border]) => (
            <span key={pos} className={`absolute ${pos} w-7 h-7 ${border} border-arch-beige/50`} />
          ))}

          {/* Top divider line */}
          <motion.div
            className="w-px h-8 bg-stone-brown/20 mb-8"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />

          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <ArqivaLogo size="lg" />
            <p className="text-[9px] tracking-[0.45em] uppercase text-stone-brown/50 mt-1">
              Architecture &amp; Design
            </p>
          </motion.div>

          {/* Bottom divider line */}
          <motion.div
            className="w-px h-8 bg-stone-brown/20 mt-8"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
          />

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-px bg-stone-brown/12 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="h-full bg-arch-beige"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: MIN_MS / 1000 - 0.2, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
