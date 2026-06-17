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
const HERO_FALLBACK = 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=80&auto=format';

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

function HeroStatCounter({ value, suffix, prefix, label }: { value: number; suffix?: string; prefix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1800; const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return (
    <div ref={ref} className="flex-1 px-6 md:px-10 first:pl-0 last:pr-0">
      <p className="font-display text-2xl md:text-3xl font-light text-warm-white">{prefix}{count}{suffix}</p>
      <p className="text-warm-white/50 text-xs tracking-widest uppercase mt-1">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const { data: settingsRes } = useQuery({ queryKey: ['settings'], queryFn: () => api.get('/settings').then(r => r.data) });
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
    <div className="min-h-screen bg-warm-white text-primary-black">
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex flex-col bg-primary-black">
        {/* Background — overflow-hidden here contains the scale animation */}
        <motion.div className="absolute inset-0 overflow-hidden" initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: 'easeOut' }}>
          <img src={heroImage} alt="Architecture" loading="eager" className="w-full h-full object-cover" />
          {/* Directional overlay — strong on text side, open on photo side */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-black via-primary-black/60 to-primary-black/10" />
        </motion.div>

        {/* Main content — flex-1 fills all available space between navbar and bottom bar */}
        <div className="relative z-10 flex-1 flex items-center pt-20 pb-6">
          <div className="container-main">
            <div className="max-w-3xl">
              <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }}
                className="text-arch-beige text-xs tracking-[0.5em] uppercase font-medium mb-5">
                {settings?.heroLabel || t('home.hero_label')}
              </motion.p>
              <h1 className="font-display text-[clamp(2.4rem,5.5vw,6rem)] font-light leading-[1.02] text-warm-white mb-6 hero-text-shadow">
                <span className="block"><WordReveal text={settings?.heroTitle || t('home.hero_title_1')} delay={0.25} /></span>
                <em className="not-italic text-arch-beige block"><WordReveal text={settings?.heroAccent || t('home.hero_title_2')} delay={0.5} /></em>
              </h1>
              <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.45 }}
                className="text-warm-white/80 text-base md:text-lg leading-relaxed max-w-xl mb-8 font-light hero-text-shadow">
                {settings?.heroSubtitle || settings?.description || 'We create architectural experiences that transcend the ordinary — from luxury residences to landmark commercial projects across the globe.'}
              </motion.p>
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.55 }} className="flex flex-wrap items-center gap-4">
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
        </div>

        {/* Scroll indicator — sits above the stats bar, naturally in flow */}
        <motion.div
          className="relative z-10 hidden md:flex flex-col items-center gap-1.5 pb-3 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <span className="text-[9px] tracking-[0.35em] uppercase text-warm-white/40">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-warm-white/40">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* Stats bar — anchored at the very bottom, in normal flow */}
        <div className="relative z-10 border-t border-warm-white/15 bg-primary-black/60 backdrop-blur-sm">
          <div className="container-main py-5 md:py-7">
            <div className="flex items-center justify-between w-full divide-x divide-warm-white/15">
              <HeroStatCounter value={settings?.statProjects ?? 60} suffix="+" label={t('home.stat_projects')} />
              <HeroStatCounter value={settings?.statCountries ?? 20} suffix="+" label={t('home.stat_countries')} />
              {settings?.statValue
                ? <div className="flex-1 px-6 md:px-10 last:pr-0">
                    <p className="font-display text-2xl md:text-3xl font-light text-warm-white">{settings.statValue}</p>
                    <p className="text-warm-white/50 text-xs tracking-widest uppercase mt-1">{t('home.stat_value')}</p>
                  </div>
                : <HeroStatCounter value={2} prefix="$" suffix="B+" label={t('home.stat_value')} />}
            </div>
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
                    <p className="font-display text-xl md:text-2xl font-light text-primary-black leading-relaxed italic mb-0">
                      &ldquo;{testimonials[tIdx]?.testimonial}&rdquo;
                    </p>
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
