import React, { useState } from 'react';
import { useThemeStore, type Theme } from '@/store/themeStore';

const themes: { id: Theme; label: string; dot: string }[] = [
  { id: 'light-luxury', label: 'Light Luxury', dot: 'bg-warm-white border border-stone-brown/30' },
  { id: 'warm-arch', label: 'Warm Architectural', dot: 'bg-[#F5EFE6] border border-[#C4956A]/40' },
  { id: 'elegant-dark', label: 'Elegant Dark', dot: 'bg-[#0A0908] border border-[#A9927D]/40' },
];

export default function ThemeSwitcher({ compact = false, transparent = false }: { compact?: boolean; transparent?: boolean }) {
  const { theme, setTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const current = themes.find(t => t.id === theme) || themes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Switch theme"
        title={`Theme: ${current.label}`}
        className={`flex items-center gap-1.5 transition-colors ${
          compact
            ? 'p-1'
            : transparent
              ? 'border border-warm-white/40 px-3 py-1.5 hover:border-arch-beige'
              : 'border border-stone-brown/30 px-3 py-1.5 hover:border-luxury-burgundy'
        }`}
      >
        <span className={`w-3 h-3 rounded-full inline-block ${current.dot}`} />
        {!compact && <span className={`text-xs tracking-widest uppercase ${
          transparent ? 'text-warm-white/80 hover:text-arch-beige' : 'text-stone-brown hover:text-luxury-burgundy'
        }`}>Theme</span>}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-white border border-stone-brown/15 shadow-lg z-50 min-w-[180px] py-1 dark-dropdown">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs tracking-wide hover:bg-arch-beige/10 transition-colors text-left ${theme === t.id ? 'text-luxury-burgundy' : 'text-stone-brown'}`}
              >
                <span className={`w-3.5 h-3.5 rounded-full inline-block shrink-0 ${t.dot}`} />
                {t.label}
                {theme === t.id && <svg className="ml-auto" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
