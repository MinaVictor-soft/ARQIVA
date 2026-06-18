import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Project, Service, Testimonial, Settings } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
const EASE = [0.22, 1, 0.36, 1] as const;
const HERO_FALLBACK = 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=80&auto=format&fit=crop';

function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <motion.span key={i} className="inline-block"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: delay + i * 0.08, ease: EASE }}>
          {word}{'\u00A0'}
        </motion.span>
      ))}
    </>
  );
}
function LetterReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.28, delay: delay + i * 0.022, ease: EASE }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </>
  );
}
// ── Premium Stat Card ────────────────────────────────────────────────────────
const STAT_ICONS = {
  building: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M6 21V7l6-4 6 4v14M10 21v-6h4v6"/>
    </svg>
  ),
  globe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2c-3 5-3 15 0 20M12 2c3 5 3 15 0 20"/>
    </svg>
  ),
  diamond: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z"/>
      <path d="M2 9h20M12 22L6 9h12"/>
    </svg>
  ),
  compass: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
  award: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
};

function PremiumStatCard({
  icon, value, prefix = '', suffix = '', customDisplay, label, delay,
}: {
  icon: keyof typeof STAT_ICONS;
  value: number;
  prefix?: string;
  suffix?: string;
  customDisplay?: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || customDisplay) return;
    const dur = 2200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, customDisplay]);

  return (
    <motion.div
      ref={ref}
      className="group relative flex flex-col justify-between p-3 md:p-5 cursor-default select-none overflow-hidden"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
    >
      {/* Architectural corner bracket — top-left */}
      <span className="absolute top-0 left-0 block pointer-events-none">
        <span className="absolute top-0 left-0 h-px w-6 bg-arch-beige/70 group-hover:bg-arch-beige group-hover:w-9 transition-all duration-300" />
        <span className="absolute top-0 left-0 w-px h-6 bg-arch-beige/70 group-hover:bg-arch-beige group-hover:h-9 transition-all duration-300" />
      </span>
      {/* Architectural corner bracket — bottom-right */}
      <span className="absolute bottom-0 right-0 block pointer-events-none">
        <span className="absolute bottom-0 right-0 h-px w-6 bg-arch-beige/50 group-hover:bg-arch-beige/80 group-hover:w-9 transition-all duration-300" />
        <span className="absolute bottom-0 right-0 w-px h-6 bg-arch-beige/50 group-hover:bg-arch-beige/80 group-hover:h-9 transition-all duration-300" />
      </span>

      {/* Icon */}
      <div className="block mb-2 md:mb-3 text-arch-beige transition-colors duration-300">
        {STAT_ICONS[icon]}
      </div>

      {/* Animated number */}
      <p className="font-display text-[1.4rem] md:text-[clamp(1.4rem,2.8vw,2.4rem)] font-light leading-none text-arch-beige transition-colors duration-300 tabular-nums">
        {customDisplay ?? `${prefix}${count}${suffix}`}
      </p>

      {/* Label */}
      <p className="mt-1 md:mt-2 text-warm-white/75 group-hover:text-warm-white text-[9px] md:text-[11px] tracking-[0.12em] md:tracking-[0.35em] uppercase font-medium leading-tight transition-colors duration-300">
        {label}
      </p>

      {/* Bottom glow line on hover */}
      <span className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-arch-beige/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const { data: settingsRes, isLoading: settingsLoading } = useQuery({ queryKey: ['settings'], queryFn: () => api.get('/settings').then(r => r.data), staleTime: 5 * 60 * 1000 });
  const { data: projectsRes, isLoading: projectsLoading } = useQuery({ queryKey: ['projects', 'featured'], queryFn: () => api.get('/projects?featured=true&limit=6').then(r => r.data) });
  const { data: servicesRes } = useQuery({ queryKey: ['services'], queryFn: () => api.get('/services').then(r => r.data) });
  const { data: testimonialsRes } = useQuery({ queryKey: ['testimonials', 'featured'], queryFn: () => api.get('/testimonials?featured=true').then(r => r.data) });

  const settings: Settings = settingsRes?.data;
  const projects: Project[] = projectsRes?.data || [];
  const services: Service[] = servicesRes?.data?.slice(0, 6) || [];
  const testimonials: Testimonial[] = testimonialsRes?.data || [];

  const [tIdx, setTIdx] = useState(0);
  const tCount = Math.min(testimonials.length, 6);
  useEffect(() => {
    if (tCount <= 1) return;
    const timer = setInterval(() => setTIdx(i => (i + 1) % tCount), 6000);
    return () => clearInterval(timer);
  }, [tCount]);

  const heroImage = settings?.heroImage || projects[0]?.coverImage || HERO_FALLBACK;

  return (
    <div className="min-h-screen bg-primary-black text-primary-black">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE HERO — absolute image bg, continuous gradient, no edge
      ══════════════════════════════════════════════════════════════════ */}
      <section className="md:hidden relative flex flex-col h-[100dvh] bg-[#0A0908]">

        {/* ── Image — absolute, top portion only ── */}
        <div className="absolute inset-x-0 top-0 h-[45dvh] overflow-hidden">
          <motion.img
            src={heroImage}
            alt="Architecture"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-primary-black/20" />
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-y-0 w-2/5 pointer-events-none"
            style={{ background: 'linear-gradient(105deg, transparent 0%, rgba(242,244,243,0.07) 50%, transparent 100%)' }}
            initial={{ x: '-150%' }}
            animate={{ x: '350%' }}
            transition={{ duration: 1.1, delay: 2.0, ease: [0.4, 0, 0.2, 1] }}
          />
          {/* Top gradient — navbar blend */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0A0908]/60 to-transparent pointer-events-none" />
        </div>

        {/* ── Full-section gradient — spans image AND content area seamlessly ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(10,9,8,0.3) 0%, transparent 20%, transparent 35%, rgba(10,9,8,0.5) 55%, rgba(10,9,8,0.88) 72%, #0A0908 85%)' }}
        />
        {/* Warm ambient radial glow in content zone */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 40% at 50% 58%, rgba(169,146,125,0.09) 0%, transparent 70%)' }}
        />

        {/* ── Content — z-10, pinned to bottom ── */}
        <div className="relative z-10 flex flex-col h-full px-5 pb-4 justify-end">

          {/* Label */}
          <motion.div
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
          >
            <motion.span
              className="block h-px bg-arch-beige/65 shrink-0"
              initial={{ width: 0 }}
              animate={{ width: '14px' }}
              transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
            />
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-arch-beige/50"
                animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}
              />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-arch-beige/80" />
            </span>
            <p className="text-arch-beige text-[13px] tracking-[0.35em] uppercase font-bold hero-text-shadow">
              <LetterReveal text={settings?.heroLabel || t('home.hero_label')} delay={0.35} />
            </p>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display text-[2.5rem] font-light leading-[1.05] text-white mb-2 hero-text-shadow">
            <span className="block">
              <WordReveal text={settings?.heroTitle || t('home.hero_title_1')} delay={0.18} />
            </span>
            <em className="not-italic text-arch-beige block">
              <WordReveal text={settings?.heroAccent || t('home.hero_title_2')} delay={0.35} />
            </em>
          </h1>

          {/* Animated architectural accent line */}
          <motion.div
            className="h-px bg-gradient-to-r from-arch-beige/55 via-arch-beige/20 to-transparent mb-2"
            style={{ width: '65%', originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.85, delay: 0.58, ease: EASE }}
          />

          {/* Description */}
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/90 text-[15px] leading-[1.6] mb-3 line-clamp-2 font-light hero-text-shadow"
          >
            {settings?.heroSubtitle || settings?.description || 'Award-winning architecture and interior design studio crafting timeless environments across the UAE and GCC.'}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="flex gap-2 mb-3"
          >
            {/* Primary CTA with pulse ring */}
            <div className="relative flex-1">
              <motion.span
                className="absolute inset-0 border border-luxury-burgundy/55 pointer-events-none"
                initial={{ opacity: 0.7, scale: 1 }}
                animate={{ opacity: 0, scale: 1.09 }}
                transition={{ duration: 1.6, delay: 1.3, repeat: Infinity, repeatDelay: 2.8, ease: 'easeOut' }}
              />
              <Link
                to={settings?.heroCta1Url || '/projects'}
                className="block text-center py-3.5 bg-luxury-burgundy text-warm-white text-[12px] tracking-[0.14em] uppercase font-semibold hover:bg-warm-white hover:text-primary-black transition-colors duration-200"
              >
                {settings?.heroCta1Text || t('home.hero_cta_primary')}
              </Link>
            </div>
            <Link
              to={settings?.heroCta2Url || '/services'}
              className="flex-1 flex items-center justify-center gap-1.5 border border-warm-white/28 text-warm-white/80 hover:text-warm-white hover:border-warm-white/55 text-[12px] tracking-[0.14em] uppercase transition-colors duration-200 py-3.5"
            >
              {settings?.heroCta2Text || t('home.hero_cta_secondary')}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </motion.div>

          {/* Stats — 2×2 PremiumStatCard grid */}
          <div className="border-t border-warm-white/10 mt-1">
            <div className="grid grid-cols-2 gap-px bg-warm-white/10">
              <div className="bg-[#0A0908]"><PremiumStatCard icon="building" value={settings?.statProjects ?? 47} suffix="+" label={t('home.stat_projects')} delay={0.85} /></div>
              <div className="bg-[#0A0908]"><PremiumStatCard icon="globe" value={settings?.statCountries ?? 6} suffix="+" label={t('home.stat_countries')} delay={0.95} /></div>
              <div className="bg-[#0A0908]"><PremiumStatCard icon="diamond" value={0} customDisplay={settings?.statValue || '$2.4B+'} label={t('home.stat_value')} delay={1.05} /></div>
              <div className="bg-[#0A0908]"><PremiumStatCard icon="compass" value={15} suffix="+" label="Years Experience" delay={1.15} /></div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP HERO — full-bleed image layout (hidden on mobile)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="hidden md:flex relative h-screen flex-col bg-primary-black">

        {/* Background image */}
        <motion.div
          className="absolute inset-0 overflow-hidden will-change-transform"
          initial={{ scale: 1.03 }}
          animate={{ scale: 1 }}
          transition={{ duration: 5, ease: 'easeOut' }}
        >
          <motion.img src={heroImage} alt="Architecture" loading="eager" className="w-full h-full object-cover scale-105" initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} transition={{ duration: 3, ease: 'easeOut' }} />
          <div className="absolute inset-0 bg-primary-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-black/85 via-primary-black/50 to-primary-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary-black/90 to-transparent" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center pt-20 container-main">
          <div className="max-w-3xl">
            <motion.div className="flex items-center gap-3 mb-5" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: EASE }}>
              <span className="block h-px w-5 bg-arch-beige/70 shrink-0" />
              <p className="text-arch-beige text-xs tracking-[0.45em] uppercase font-semibold hero-text-shadow">
                <LetterReveal text={settings?.heroLabel || t('home.hero_label')} delay={0.2} />
              </p>
            </motion.div>
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,6rem)] font-light leading-[1.04] text-white mb-6 hero-text-shadow">
              <span className="block"><WordReveal text={settings?.heroTitle || t('home.hero_title_1')} delay={0.25} /></span>
              <em className="not-italic text-arch-beige block"><WordReveal text={settings?.heroAccent || t('home.hero_title_2')} delay={0.5} /></em>
            </h1>
            <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.45 }} className="text-white/85 text-lg leading-relaxed max-w-xl mb-8 font-light hero-text-shadow">
              {settings?.heroSubtitle || settings?.description || 'We create architectural experiences that transcend the ordinary — from luxury residences to landmark commercial projects across the globe.'}
            </motion.p>
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.55 }} className="flex items-center gap-4">
              <Link to={settings?.heroCta1Url || '/projects'} className="px-8 py-3.5 bg-luxury-burgundy text-warm-white text-xs tracking-widest uppercase font-medium hover:bg-warm-white hover:text-primary-black transition-colors duration-200">
                {settings?.heroCta1Text || t('home.hero_cta_primary')}
              </Link>
              <Link to={settings?.heroCta2Url || '/services'} className="flex items-center gap-2 text-warm-white/80 hover:text-warm-white text-xs tracking-widest uppercase transition-colors border border-warm-white/30 px-6 py-3.5 hover:border-warm-white/70">
                {settings?.heroCta2Text || t('home.hero_cta_secondary')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Desktop stats */}
        <div className="relative z-10 w-full">
          <div className="container-main">
            <div className="h-px bg-gradient-to-r from-transparent via-warm-white/20 to-transparent" />
          </div>
          <div className="container-main grid grid-cols-4 gap-0 divide-x divide-warm-white/10 py-3">
            <PremiumStatCard icon="building" value={settings?.statProjects ?? 47} suffix="+" label={t('home.stat_projects')} delay={0.85} />
            <PremiumStatCard icon="globe" value={settings?.statCountries ?? 6} suffix="+" label={t('home.stat_countries')} delay={0.95} />
            <PremiumStatCard icon="diamond" value={0} customDisplay={settings?.statValue || '$2.4B+'} label={t('home.stat_value')} delay={1.05} />
            <PremiumStatCard icon="compass" value={15} suffix="+" label="Years Experience" delay={1.15} />
          </div>
        </div>

      </section>

      {/* Featured Projects skeleton */}
      {projectsLoading && (
        <section className="bg-[#FAF8F5] section-padding">
          <div className="container-main">
            <div className="h-3 w-24 bg-stone-brown/15 animate-pulse mb-3 rounded" />
            <div className="h-10 w-72 bg-stone-brown/10 animate-pulse mb-14 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3" style={{ minHeight: 400 }}>
              <div className="md:col-span-7 bg-stone-brown/10 animate-pulse min-h-[320px]" />
              <div className="md:col-span-5 flex flex-col gap-3">
                <div className="flex-1 bg-stone-brown/8 animate-pulse" style={{ minHeight: 155 }} />
                <div className="flex-1 bg-stone-brown/8 animate-pulse" style={{ minHeight: 155 }} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects — Primary bg #FAF8F5 */}
      {projects.length > 0 && (
        <section className="bg-[#FAF8F5] section-padding">
          <div className="container-main">
            <motion.div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}>
              <div>
                <span className="section-label mb-3">{t('home.featured_label')}</span>
                <h2 className="section-title">{t('home.featured_title')}</h2>
              </div>
              <Link to="/projects" className="btn-ghost shrink-0">
                {t('common.view_all')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:min-h-[520px]">
              {projects[0] && (
                <motion.div className="md:col-span-7 md:h-full" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                  <Link to={`/projects/${projects[0].slug}`} className="group relative overflow-hidden bg-stone-brown/10 block h-full min-h-[320px]">
                    <div className="absolute inset-0 img-zoom">
                      {projects[0].coverImage
                        ? <img src={projects[0].coverImage} alt={projects[0].title} loading="lazy" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-br from-arch-beige/20 to-stone-brown/20 flex items-center justify-center"><span className="font-display text-7xl text-stone-brown/20">{projects[0].title[0]}</span></div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-black/70 via-primary-black/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-arch-beige text-xs tracking-widest uppercase mb-1.5">{projects[0].year} · {projects[0].city}</p>
                      <h3 className="text-warm-white font-display text-2xl font-light">{projects[0].title}</h3>
                    </div>
                    {projects[0].category && (
                      <div className="absolute top-4 left-4 bg-warm-white/90 backdrop-blur-sm px-3 py-1 text-xs tracking-widest uppercase text-stone-brown">
                        {projects[0].category.name}
                      </div>
                    )}
                  </Link>
                </motion.div>
              )}
              <div className="md:col-span-5 flex flex-col gap-3">
                {[projects[1], projects[2]].filter(Boolean).map((project, i) => (
                  <motion.div key={project.id} className="flex-1" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: (i + 1) * 0.1 }}>
                    <Link to={`/projects/${project.slug}`} className="group relative overflow-hidden bg-stone-brown/10 block h-full min-h-[200px]">
                      <div className="absolute inset-0 img-zoom">
                        {project.coverImage
                          ? <img src={project.coverImage} alt={project.title} loading="lazy" className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-gradient-to-br from-arch-beige/15 to-stone-brown/15 flex items-center justify-center"><span className="font-display text-5xl text-stone-brown/20">{project.title[0]}</span></div>
                        }
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-black/70 via-primary-black/10 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-arch-beige text-xs tracking-widest uppercase mb-1">{project.year} · {project.city}</p>
                        <h3 className="text-warm-white font-display text-lg font-light">{project.title}</h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              {projects.slice(3, 6).map((project, i) => (
                <motion.div key={project.id} className="md:col-span-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                  <Link to={`/projects/${project.slug}`} className="group relative overflow-hidden bg-stone-brown/10 block">
                    <div className="aspect-[4/3] img-zoom">
                      {project.coverImage
                        ? <img src={project.coverImage} alt={project.title} loading="lazy" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-br from-arch-beige/15 to-stone-brown/15 flex items-center justify-center"><span className="font-display text-4xl text-stone-brown/20">{project.title[0]}</span></div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-black/70 via-transparent to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-arch-beige text-xs tracking-widest uppercase mb-1">{project.year}</p>
                      <h3 className="text-warm-white font-display text-base font-light">{project.title}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services — White bg for clean alternation */}
      {services.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}>
              <span className="section-label mb-3">{t('home.services_label')}</span>
              <h2 className="section-title mb-5">{t('home.services_title')}</h2>
              <p className="text-stone-brown leading-relaxed max-w-xl mx-auto">{settings?.mission || 'From architectural concept to finished interior — comprehensive design services for projects of every scale.'}</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                  <Link to="/services" className="group bg-white border border-stone-brown/12 p-8 hover:border-luxury-burgundy/30 hover:shadow-card transition-all duration-300 block h-full">
                    <div className="flex items-center justify-end mb-6">
                      <div className="w-8 h-px bg-stone-brown/20 group-hover:bg-luxury-burgundy/40 group-hover:w-12 transition-all duration-300" />
                    </div>
                    <h3 className="font-display text-xl text-primary-black mb-3 group-hover:text-luxury-burgundy transition-colors leading-snug">{service.name}</h3>
                    <p className="text-stone-brown text-sm leading-relaxed line-clamp-3">{service.description}</p>
                    <div className="mt-6 flex items-center gap-1.5 text-luxury-burgundy/60 text-xs tracking-widest uppercase group-hover:gap-3 transition-all duration-300">
                      <span>Learn more</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/services" className="btn-secondary">{t('common.view_all')}</Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials — Light alternate bg, NOT dark */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-[#F7F4F0]">
          <div className="container-main">
            <motion.div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}>
              <div>
                <span className="section-label mb-3">{t('home.testimonials_label')}</span>
                <h2 className="section-title">{t('home.testimonials_title')}</h2>
              </div>
              <Link to="/testimonials" className="btn-ghost shrink-0">{t('common.view_all')} →</Link>
            </motion.div>

            {/* Carousel */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tIdx}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-end"
                >
                  <div className="md:col-span-8">
                    <svg width="32" height="26" viewBox="0 0 28 22" fill="none" className="text-arch-beige/40 mb-6" aria-hidden>
                      <path d="M0 22V13.6C0 9.87 1.04 6.8 3.12 4.38 5.2 1.96 8.27.493 12.33 0L13.44 2.31C11.1 2.91 9.29 3.97 8 5.49 6.71 7.01 6.07 8.76 6.07 10.74H11.2V22H0zm15.87 0V13.6c0-3.73 1.04-6.8 3.12-9.22C21.07 1.96 24.14.493 28.2 0l1.11 2.31c-2.34.6-4.15 1.66-5.44 3.18-1.29 1.52-1.93 3.27-1.93 5.25h5.13V22h-11.2z" fill="currentColor"/>
                    </svg>
                    <div className="min-h-[9rem] flex items-start">
                      <p className="font-display text-xl md:text-2xl font-light text-primary-black leading-relaxed italic line-clamp-5">
                        &ldquo;{testimonials[tIdx]?.testimonial}&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-4">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: testimonials[tIdx]?.rating || 5 }).map((_, j) => (
                        <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill="#A9927D"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      ))}
                    </div>
                    <p className="font-medium text-primary-black text-sm">{testimonials[tIdx]?.clientName}</p>
                    <p className="text-stone-brown/70 text-xs mt-1 tracking-wide">
                      {testimonials[tIdx]?.clientPosition}{testimonials[tIdx]?.companyName && `, ${testimonials[tIdx]?.companyName}`}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center gap-5 mt-10 border-t border-stone-brown/10 pt-6">
                <button
                  onClick={() => setTIdx(i => (i - 1 + tCount) % tCount)}
                  className="w-9 h-9 flex items-center justify-center border border-stone-brown/25 text-stone-brown hover:border-luxury-burgundy hover:text-luxury-burgundy transition-colors"
                  aria-label="Previous testimonial"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: tCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTIdx(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={`transition-all duration-300 h-px ${i === tIdx ? 'w-8 bg-luxury-burgundy' : 'w-4 bg-stone-brown/30 hover:bg-stone-brown/60'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setTIdx(i => (i + 1) % tCount)}
                  className="w-9 h-9 flex items-center justify-center border border-stone-brown/25 text-stone-brown hover:border-luxury-burgundy hover:text-luxury-burgundy transition-colors"
                  aria-label="Next testimonial"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <span className="ml-auto text-stone-brown/40 text-xs font-mono tracking-widest">{String(tIdx + 1).padStart(2,'0')} / {String(tCount).padStart(2,'0')}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA — Burgundy accent, the ONE bold section */}
      <section className="section-padding bg-luxury-burgundy">
        <div className="container-main text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="text-arch-beige text-xs tracking-[0.45em] uppercase font-medium mb-5 block">Begin Your Journey</span>
            <h2 className="font-display text-4xl md:text-6xl font-light text-warm-white mb-6 leading-tight max-w-3xl mx-auto">{t('home.cta_title')}</h2>
            <p className="text-warm-white/70 text-lg mb-10 max-w-xl mx-auto">{t('home.cta_body')}</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-warm-white text-luxury-burgundy text-xs tracking-widest uppercase font-medium hover:bg-arch-beige hover:text-primary-black transition-colors duration-200">{t('home.cta_btn')}</Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
