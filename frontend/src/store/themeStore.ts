import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light-luxury' | 'warm-arch' | 'elegant-dark';

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light-luxury',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
    }),
    { name: 'arqiva_theme' }
  )
);

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
}

// Apply on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('arqiva_theme');
  const theme: Theme = stored ? (JSON.parse(stored)?.state?.theme ?? 'light-luxury') : 'light-luxury';
  applyTheme(theme);
}
