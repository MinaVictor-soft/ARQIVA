import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

    // fetch settings to get the real hero image URL
    fetch('/api/settings')
      .then((r) => r.json())
      .then((res) => {
        const heroUrl: string =
          res?.data?.heroImage || HERO_FALLBACK;

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0908]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <svg width="52" height="52" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simple architectural A mark */}
              <path d="M30 6L54 48H6L30 6Z" stroke="#A9927D" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
              <path d="M18 36H42" stroke="#A9927D" strokeWidth="1.5" />
              <path d="M30 6V48" stroke="#49111C" strokeWidth="1" strokeDasharray="2 3" />
            </svg>

            <div className="text-center">
              <p className="font-display text-warm-white text-xl tracking-[0.35em] uppercase font-light">
                ARQIVA
              </p>
              <p className="text-[9px] tracking-[0.5em] text-arch-beige/60 uppercase mt-0.5">
                Studio &amp; Design
              </p>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-px bg-warm-white/10 overflow-hidden"
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
