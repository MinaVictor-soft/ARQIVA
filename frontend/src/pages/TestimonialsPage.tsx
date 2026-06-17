import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

/* ── Shared helpers ── */
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < rating ? '#A9927D' : 'none'} stroke="#A9927D" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function Avatar({ src, name, size = 10 }: { src?: string; name?: string; size?: number }) {
  const cls = `rounded-full object-cover shrink-0 border border-stone-brown/15`;
  const dim = `w-${size} h-${size}`;
  if (src) return <img src={src} alt={name} className={`${cls} ${dim}`} />;
  return (
    <div className={`${dim} rounded-full bg-arch-beige/12 border border-stone-brown/12 flex items-center justify-center shrink-0`}>
      <span className="text-arch-beige font-medium" style={{ fontSize: size * 1.4 + 'px' }}>
        {name?.[0]?.toUpperCase()}
      </span>
    </div>
  );
}

/* ── Equal-height card with read-more ── */
function TestimonialCard({ item }: { item: any }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (item.testimonial?.length ?? 0) > 200;

  return (
    <article className="flex flex-col h-full border border-stone-brown/14 bg-white group hover:border-luxury-burgundy/22 hover:shadow-[0_10px_48px_rgba(73,17,28,0.07)] transition-all duration-400">
      {/* Top hover accent */}
      <div className="h-px w-0 group-hover:w-full bg-luxury-burgundy/35 transition-all duration-500" />

      <div className="flex flex-col flex-1 p-6 md:p-8">
        {/* Quote icon + rating row */}
        <div className="flex items-start justify-between mb-5">
          <svg width="26" height="20" viewBox="0 0 28 22" className="text-arch-beige/28 shrink-0" aria-hidden="true">
            <path d="M0 22V13.6C0 9.87 1.04 6.8 3.12 4.38 5.2 1.96 8.27.49 12.33 0L13.44 2.31C11.1 2.91 9.29 3.97 8 5.49 6.71 7.01 6.07 8.76 6.07 10.74H11.2V22H0zm15.87 0V13.6c0-3.73 1.04-6.8 3.12-9.22C21.07 1.96 24.14.49 28.2 0l1.11 2.31c-2.34.6-4.15 1.66-5.44 3.18-1.29 1.52-1.93 3.27-1.93 5.25h5.13V22h-11.2z" fill="currentColor"/>
          </svg>
          <Stars rating={item.rating || 5} />
        </div>

        {/* Quote — clamped to 4 lines, expandable */}
        <div className="flex-1 mb-6">
          <p className={`text-stone-brown text-[15px] leading-relaxed italic ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
            &ldquo;{item.testimonial}&rdquo;
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="mt-2.5 text-[10px] tracking-[0.3em] uppercase text-luxury-burgundy/65 hover:text-luxury-burgundy transition-colors"
            >
              {expanded ? 'Show less ↑' : 'Read more ↓'}
            </button>
          )}
        </div>

        {/* Client — pinned to bottom */}
        <div className="flex items-center gap-3 pt-5 border-t border-stone-brown/10 mt-auto">
          <Avatar src={item.clientImage} name={item.clientName} size={10} />
          <div className="min-w-0">
            <p className="text-primary-black text-sm font-semibold truncate">{item.clientName}</p>
            <p className="text-stone-brown/55 text-xs mt-0.5 truncate">
              {item.clientPosition}
              {item.clientPosition && item.companyName ? ' · ' : ''}
              {item.companyName}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Featured dark-bg slider ── */
function FeaturedSlider({ items }: { items: any[] }) {
  const [idx, setIdx] = useState(0);
  if (!items.length) return null;
  const cur = items[idx];
  const n = items.length;

  return (
    <section className="py-20 bg-[#F5EFE6] overflow-hidden">
      <div className="container-main">
        {/* Divider label */}
        <div className="flex items-center gap-5 mb-14">
          <div className="h-px flex-1 bg-stone-brown/15" />
          <p className="text-[10px] tracking-[0.45em] uppercase text-arch-beige">Featured Reviews</p>
          <div className="h-px flex-1 bg-stone-brown/15" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.48, ease: EASE }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 min-h-[220px] lg:min-h-[240px] items-start"
          >
            {/* Large quote */}
            <div className="lg:col-span-8">
              <svg width="36" height="28" viewBox="0 0 28 22" className="text-stone-brown/20 mb-8" aria-hidden="true">
                <path d="M0 22V13.6C0 9.87 1.04 6.8 3.12 4.38 5.2 1.96 8.27.49 12.33 0L13.44 2.31C11.1 2.91 9.29 3.97 8 5.49 6.71 7.01 6.07 8.76 6.07 10.74H11.2V22H0zm15.87 0V13.6c0-3.73 1.04-6.8 3.12-9.22C21.07 1.96 24.14.49 28.2 0l1.11 2.31c-2.34.6-4.15 1.66-5.44 3.18-1.29 1.52-1.93 3.27-1.93 5.25h5.13V22h-11.2z" fill="currentColor"/>
              </svg>
              <p className="font-display text-2xl md:text-3xl lg:text-[2.1rem] font-light leading-relaxed text-primary-black/85 italic line-clamp-5">
                &ldquo;{cur.testimonial}&rdquo;
              </p>
            </div>

            {/* Client */}
            <div className="lg:col-span-4 flex flex-col justify-end gap-6">
              <Stars rating={cur.rating || 5} size={15} />
              <div className="flex items-center gap-4">
                <Avatar src={cur.clientImage} name={cur.clientName} size={14} />
                <div>
                  <p className="text-primary-black font-medium">{cur.clientName}</p>
                  <p className="text-stone-brown/65 text-sm mt-1">
                    {cur.clientPosition}
                    {cur.clientPosition && cur.companyName ? ' · ' : ''}
                    {cur.companyName}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav controls */}
        {n > 1 && (
          <div className="flex items-center gap-5 mt-12 pt-8 border-t border-stone-brown/12">
            <button onClick={() => setIdx(i => (i - 1 + n) % n)}
              className="w-9 h-9 flex items-center justify-center border border-stone-brown/25 text-stone-brown/60 hover:border-luxury-burgundy hover:text-luxury-burgundy transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`h-px transition-all duration-300 ${i === idx ? 'w-8 bg-luxury-burgundy' : 'w-4 bg-stone-brown/25 hover:bg-stone-brown/50'}`} />
              ))}
            </div>
            <button onClick={() => setIdx(i => (i + 1) % n)}
              className="w-9 h-9 flex items-center justify-center border border-stone-brown/25 text-stone-brown/60 hover:border-luxury-burgundy hover:text-luxury-burgundy transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <span className="ml-auto text-stone-brown/35 text-xs font-mono tracking-widest">
              {String(idx + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Page ── */
export default function TestimonialsPage() {
  const { t } = useTranslation();
  const { data: testimonialsRes, isLoading } = useQuery({
    queryKey: ['testimonials-all'],
    queryFn: () => api.get('/testimonials?limit=100').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const testimonials: any[] = testimonialsRes?.data || [];
  const featured = testimonials.filter(t => t.featured);
  const avgRating = testimonials.length
    ? (testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-warm-white text-primary-black">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 bg-white border-b border-stone-brown/10">
        <div className="container-main">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: EASE }}>
            <p className="section-label mb-5">{t('testimonials.label') || 'Client Words'}</p>
            <h1 className="font-display text-5xl md:text-7xl font-light leading-[1.05] mb-6">
              {t('testimonials.title') || 'What Our'}<br />
              <span className="text-arch-beige italic opacity-75">Clients Say</span>
            </h1>
            <p className="text-stone-brown/65 text-base md:text-lg max-w-lg leading-relaxed">
              Real stories from clients who trusted us with their most important spaces.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="py-10 bg-white border-b border-stone-brown/10">
        <div className="container-main flex items-center gap-10 md:gap-16 flex-wrap">
          {[
            { val: testimonials.length || '—', label: 'Client Reviews' },
            { val: avgRating, label: 'Average Rating' },
            { val: '100%', label: 'Satisfaction Rate' },
          ].map(({ val, label }, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="h-8 w-px bg-stone-brown/12 hidden md:block" />}
              <div>
                <p className="font-display text-4xl text-primary-black font-light">{val}</p>
                <p className="text-stone-brown/55 text-[11px] tracking-[0.3em] uppercase mt-1">{label}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── Featured slider ── */}
      {featured.length > 0 && <FeaturedSlider items={featured} />}

      {/* ── All testimonials grid ── */}
      <section className="py-20">
        <div className="container-main">
          <motion.div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div>
              <p className="section-label mb-2">All Reviews</p>
              <h2 className="font-display text-3xl md:text-4xl font-light text-primary-black">Every Voice Matters</h2>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-stone-brown/6 animate-pulse" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-stone-brown/40 text-center py-20">No testimonials yet.</p>
          ) : (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {testimonials.map((item: any) => (
                <motion.div key={item.id} variants={fadeUp} className="flex">
                  <TestimonialCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-arch-beige/7 border-t border-stone-brown/10">
        <div className="container-main text-center">
          <p className="section-label mb-5">Start Your Project</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary-black font-light mb-10">
            Ready to Write<br /><span className="italic text-arch-beige">Your Story?</span>
          </h2>
          <Link to="/contact" className="btn-primary">Begin Your Journey</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
