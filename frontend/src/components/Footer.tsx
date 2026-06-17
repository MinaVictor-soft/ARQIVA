import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import ArqivaLogo from './ArqivaLogo';

export default function Footer() {
  const { t } = useTranslation();
  const { data: settingsRes } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data),
    staleTime: 60000,
  });
  const settings = settingsRes?.data;
  const year = new Date().getFullYear();

  const pages = [
    { to: '/projects', key: 'projects' },
    { to: '/services', key: 'services' },
    { to: '/packages', key: 'packages' },
    { to: '/about', key: 'about' },
    { to: '/awards', key: 'awards' },
    { to: '/resume', key: 'resume' },
    { to: '/contact', key: 'contact' },
  ];

  return (
    <>
    <footer className="bg-primary-black text-warm-white">
      {/* Main footer grid */}
      <div className="container-main py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-6">
              <ArqivaLogo variant="light" size="md" />
            </Link>
            <p className="text-warm-white/50 text-sm leading-relaxed max-w-sm mb-8">
              {settings?.footerText || settings?.description?.slice(0, 160) ||
                'A luxury architecture and interior design studio dedicated to creating spaces that inspire, endure, and elevate the human experience.'}
            </p>
            {/* Social */}
            <div className="flex items-center flex-wrap gap-5">
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                  className="text-warm-white/30 hover:text-arch-beige transition-colors text-xs tracking-widest uppercase">
                  Instagram
                </a>
              )}
              {settings?.linkedIn && (
                <a href={settings.linkedIn} target="_blank" rel="noopener noreferrer"
                  className="text-warm-white/30 hover:text-arch-beige transition-colors text-xs tracking-widest uppercase">
                  LinkedIn
                </a>
              )}
              {settings?.behance && (
                <a href={settings.behance} target="_blank" rel="noopener noreferrer"
                  className="text-warm-white/30 hover:text-arch-beige transition-colors text-xs tracking-widest uppercase">
                  Behance
                </a>
              )}
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                  className="text-warm-white/30 hover:text-arch-beige transition-colors text-xs tracking-widest uppercase">
                  Facebook
                </a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer"
                  className="text-warm-white/30 hover:text-arch-beige transition-colors text-xs tracking-widest uppercase">
                  YouTube
                </a>
              )}
              {settings?.pinterest && (
                <a href={settings.pinterest} target="_blank" rel="noopener noreferrer"
                  className="text-warm-white/30 hover:text-arch-beige transition-colors text-xs tracking-widest uppercase">
                  Pinterest
                </a>
              )}
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <p className="text-warm-white/30 text-xs tracking-[0.3em] uppercase mb-6">Studio</p>
            <ul className="space-y-3">
              {pages.map(({ to, key }) => (
                <li key={to}>
                  <Link to={to}
                    className="text-warm-white/50 hover:text-warm-white transition-colors text-sm">
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <p className="text-warm-white/30 text-xs tracking-[0.3em] uppercase mb-6">Contact</p>
            <div className="space-y-4">
              {settings?.email && (
                <div>
                  <p className="text-warm-white/25 text-xs tracking-widest uppercase mb-1">Email</p>
                  <a href={`mailto:${settings.email}`}
                    className="text-warm-white/60 hover:text-warm-white transition-colors text-sm">
                    {settings.email}
                  </a>
                </div>
              )}
              {settings?.phone && (
                <div>
                  <p className="text-warm-white/25 text-xs tracking-widest uppercase mb-1">Phone</p>
                  <a href={`tel:${settings.phone}`}
                    className="text-warm-white/60 hover:text-warm-white transition-colors text-sm">
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings?.address && (
                <div>
                  <p className="text-warm-white/25 text-xs tracking-widest uppercase mb-1">Studio</p>
                  <p className="text-warm-white/50 text-sm leading-relaxed">{settings.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* GradMind footer bar */}
      <div className="border-t border-warm-white/[0.06]">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-5">

          {/* Left: Powered by + logo + divider + socials */}
          <div className="flex items-center gap-4">
            {/* Label + logo */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-medium text-warm-white/35 tracking-[0.15em] uppercase">Powered by</span>
              <a href="https://gradmind.net/" target="_blank" rel="noopener noreferrer"
                className="opacity-85 hover:opacity-100 transition-opacity duration-200">
                <img
                  src="/gradmind-logo.png"
                  alt="GradMind AI Solutions"
                  style={{ height: 28, width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }}
                />
              </a>
            </div>

            {/* Vertical divider */}
            <span className="hidden sm:block w-px h-5 bg-warm-white/15" />

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { href: 'https://wa.me/201289855489', label: 'WhatsApp', hover: 'hover:text-green-400', icon: <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> },
                { href: 'https://www.facebook.com/GradMindAI', label: 'Facebook', hover: 'hover:text-blue-400', icon: <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="currentColor"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.673 3.667h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg> },
                { href: 'https://www.instagram.com/gradmind_ai', label: 'Instagram', hover: 'hover:text-pink-400', icon: <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
                { href: 'https://gradmind.net/', label: 'Website', hover: 'hover:text-purple-400', icon: <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> },
              ].map(({ href, label, hover, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
                  className={`text-warm-white/35 transition-colors duration-200 ${hover}`}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right: copyright */}
          <span className="text-[11px] text-warm-white/30 tracking-wide">© {year} GradMind. All rights reserved.</span>
        </div>
      </div>
    </footer>
    </>
  );
}

