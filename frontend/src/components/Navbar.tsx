import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { applyDirection } from '@/i18n';
import ArqivaLogo from './ArqivaLogo';
import ThemeSwitcher from './ThemeSwitcher';

const NAV_LINKS = [
  { key: 'projects', to: '/projects' },
  { key: 'services', to: '/services' },
  { key: 'packages', to: '/packages' },
  { key: 'about', to: '/about' },
  { key: 'awards', to: '/awards' },
  { key: 'testimonials', to: '/testimonials' },
  { key: 'resume', to: '/resume' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHeroPage = location.pathname === '/';

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const toggleLang = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
    applyDirection(next);
  };

  const isTransparent = isHeroPage && !scrolled && !mobileOpen;

  /** True when the given path is the current page */
  const isActive = (to: string) =>
    location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isTransparent
        ? 'bg-transparent border-b border-transparent'
        : scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-stone-brown/12 shadow-[0_4px_32px_rgba(10,9,8,0.10)]'
          : 'bg-white border-b border-stone-brown/12 shadow-[0_1px_8px_rgba(10,9,8,0.04)]'
    }`}>
      <div className="w-full max-w-[1600px] mx-auto px-1 sm:px-2 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            aria-label="ARQIVA Home"
            className="flex-shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArqivaLogo
              variant="color"
              size="sm"
              className={`transition-all duration-500 ${isTransparent ? '[filter:brightness(0)_invert(1)]' : ''}`}
            />
          </Link>

          {/* Desktop nav — animated underline via layoutId */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ key, to }) => {
              const active = isActive(to);
              return (
                <Link
                  key={key}
                  to={to}
                  className={`relative py-2 text-xs tracking-[0.2em] uppercase transition-colors duration-300 group ${
                    active
                      ? `font-semibold ${isTransparent ? 'text-warm-white' : 'text-primary-black'}`
                      : `font-medium ${isTransparent ? 'text-warm-white/75 hover:text-warm-white' : 'text-stone-brown/70 hover:text-primary-black'}`
                  }`}
                >
                  {t(`nav.${key}`)}

                  {/* Animated active underline */}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className={`absolute bottom-0 left-0 right-0 h-px ${
                        isTransparent ? 'bg-arch-beige' : 'bg-luxury-burgundy'
                      }`}
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}

                  {/* Hover underline for inactive links */}
                  {!active && (
                    <span className={`absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out ${
                      isTransparent ? 'bg-warm-white/35' : 'bg-stone-brown/25'
                    }`} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop right controls */}
          <div className="hidden lg:flex items-center gap-5">
            <button
              onClick={toggleLang}
              aria-label="Switch language"
              className={`text-xs tracking-widest uppercase font-medium transition-all duration-300 border px-3 py-1.5 flex items-center gap-1.5 ${
                isTransparent
                  ? 'text-warm-white/85 border-warm-white/40 hover:text-arch-beige hover:border-arch-beige'
                  : 'text-primary-black border-stone-brown/40 hover:text-luxury-burgundy hover:border-luxury-burgundy'
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {i18n.language === 'ar' ? 'EN' : 'عربي'}
            </button>
            <ThemeSwitcher />
            <Link
              to="/contact"
              className={`text-xs tracking-widest uppercase font-medium px-6 py-2.5 transition-all duration-300 ${
                isActive('/contact')
                  ? isTransparent
                    ? 'bg-warm-white text-primary-black'
                    : 'bg-primary-black text-warm-white'
                  : isTransparent
                    ? 'border border-warm-white/60 text-warm-white hover:bg-warm-white hover:text-primary-black'
                    : 'bg-luxury-burgundy text-warm-white hover:bg-primary-black'
              }`}
            >
              {t('nav.contact')}
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-4">
            <button
              onClick={toggleLang}
              aria-label="Switch language"
              className={`text-xs tracking-widest uppercase font-medium border px-2.5 py-1 transition-colors ${
                isTransparent
                  ? 'text-warm-white/85 border-warm-white/40 hover:text-arch-beige'
                  : 'text-primary-black border-stone-brown/40 hover:text-luxury-burgundy'
              }`}
            >
              {i18n.language === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="flex flex-col gap-1.5 p-1"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className={`block h-px w-6 transition-all duration-300 origin-center ${
                isTransparent && !mobileOpen ? 'bg-warm-white' : 'bg-primary-black'
              } ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-px w-6 transition-all duration-300 ${
                isTransparent && !mobileOpen ? 'bg-warm-white' : 'bg-primary-black'
              } ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-px w-6 transition-all duration-300 origin-center ${
                isTransparent && !mobileOpen ? 'bg-warm-white' : 'bg-primary-black'
              } ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile accordion menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:hidden overflow-hidden bg-[#FAF8F5] border-t border-stone-brown/15"
          >
            <nav className="container-main py-6 flex flex-col">
              {NAV_LINKS.map(({ key, to }, i) => {
                const active = isActive(to);
                return (
                  <motion.div
                    key={key}
                    initial={{ x: i18n.dir() === 'rtl' ? 10 : -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={to}
                      className={`flex items-center justify-between py-4 text-sm tracking-widest uppercase font-medium border-b border-stone-brown/10 transition-colors ${
                        active
                          ? 'text-luxury-burgundy font-semibold'
                          : 'text-primary-black hover:text-luxury-burgundy'
                      }`}
                    >
                      <span>{t(`nav.${key}`)}</span>
                      {active && (
                        <motion.span
                          layoutId="mobile-nav-indicator"
                          className="block w-5 h-px bg-luxury-burgundy"
                          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ x: i18n.dir() === 'rtl' ? 10 : -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: NAV_LINKS.length * 0.04 }}
                className="pt-5"
              >
                <Link to="/contact" className="btn-primary w-full justify-center text-xs py-3.5">
                  {t('nav.contact')}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

