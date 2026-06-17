import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { applyDirection } from '@/i18n';
import { useThemeStore } from '@/store/themeStore';

interface Props {
  /** 'transparent' — on hero; 'solid' — on scrolled/mobile */
  variant?: 'transparent' | 'solid';
}

export default function LanguageSwitcher({ variant = 'solid' }: Props) {
  const { i18n } = useTranslation();
  const { theme } = useThemeStore();
  const isAr = i18n.language === 'ar';
  const isDark = theme === 'elegant-dark';
  const isTransparent = variant === 'transparent';

  const toggle = () => {
    const next = isAr ? 'en' : 'ar';
    i18n.changeLanguage(next);
    applyDirection(next);
  };

  /* pill bg: transparent→white/20, solid light→black, solid dark→warm-white */
  const pillBg = isTransparent
    ? 'rgba(255,255,255,0.18)'
    : isDark
      ? '#F2F4F3'
      : '#0A0908';

  /* border colour */
  const borderColor = isTransparent
    ? 'rgba(255,255,255,0.32)'
    : isDark
      ? 'rgba(169,146,125,0.28)'
      : 'rgba(94,80,63,0.28)';

  /* active text */
  const activeText = isDark && !isTransparent ? '#0A0908' : '#F2F4F3';
  /* inactive text */
  const inactiveText = isTransparent
    ? 'rgba(242,244,243,0.50)'
    : isDark
      ? 'rgba(94,80,63,0.65)'
      : 'rgba(94,80,63,0.55)';

  return (
    <button
      onClick={toggle}
      aria-label="Switch language"
      style={{ width: '64px', borderColor }}
      className="relative flex items-center h-7 overflow-hidden select-none border focus:outline-none focus-visible:ring-1 focus-visible:ring-arch-beige"
    >
      {/* Sliding active pill */}
      <motion.span
        className="absolute top-0 h-full w-1/2"
        style={{ backgroundColor: pillBg }}
        animate={{ left: isAr ? '50%' : '0%' }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      />

      {/* EN label */}
      <span
        className="relative z-10 flex-1 text-center text-[10px] tracking-[0.16em] uppercase font-medium transition-colors duration-200"
        style={{ color: !isAr ? activeText : inactiveText }}
      >
        EN
      </span>

      {/* AR label */}
      <span
        className="relative z-10 flex-1 text-center text-[10px] tracking-[0.08em] uppercase font-medium transition-colors duration-200"
        style={{ color: isAr ? activeText : inactiveText }}
      >
        AR
      </span>
    </button>
  );
}
