import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? '#A9927D' : 'none'} stroke="#A9927D" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const { t } = useTranslation();
  const { data: testimonialsRes, isLoading } = useQuery({
    queryKey: ['testimonials-all'],
    queryFn: () => api.get('/testimonials?limit=100').then(r => r.data),
  });

  const testimonials = testimonialsRes?.data || [];
  const featured = testimonials.filter((t: any) => t.featured);
  const rest = testimonials.filter((t: any) => !t.featured);

  return (
    <div className="min-h-screen bg-warm-white text-primary-black">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-white border-b border-stone-brown/10">
        <div className="container-main">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} className="section-label mb-4">{t('testimonials.label')}</motion.p>
            <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-none mb-6">
              What Our<br /><span className="text-arch-beige/60">Clients Say</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-warm-white/50 text-lg max-w-xl leading-relaxed">
              Real stories from clients who trusted us with their most important spaces.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-stone-brown/10 bg-white">
        <div className="container-main flex items-center gap-12 flex-wrap">
          <div>
            <p className="font-display text-4xl text-primary-black font-light">{testimonials.length}</p>
            <p className="text-stone-brown/60 text-xs tracking-widest uppercase mt-1">Client Reviews</p>
          </div>
          <div>
            <p className="font-display text-4xl text-primary-black font-light">
              {testimonials.length > 0 ? (testimonials.reduce((s: number, t: any) => s + t.rating, 0) / testimonials.length).toFixed(1) : '5.0'}
            </p>
            <p className="text-stone-brown/60 text-xs tracking-widest uppercase mt-1">Average Rating</p>
          </div>
          <div>
            <p className="font-display text-4xl text-primary-black font-light">100%</p>
            <p className="text-stone-brown/60 text-xs tracking-widest uppercase mt-1">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Featured testimonials */}
      {featured.length > 0 && (
        <section className="py-20 border-b border-stone-brown/10">
          <div className="container-main">
            <p className="section-label mb-10">Featured Reviews</p>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((t: any) => (
                <motion.div key={t.id} variants={fadeUp} className="border border-luxury-burgundy/20 p-8 bg-luxury-burgundy/3 relative">
                  <div className="absolute top-6 right-6 text-6xl text-stone-brown/8 font-display leading-none">"</div>
                  <StarRating rating={t.rating} />
                  <p className="text-stone-brown text-base leading-relaxed mt-4 mb-6 italic">"{t.testimonial}"</p>
                  <div>
                    <p className="text-primary-black font-medium text-sm">{t.clientName}</p>
                    {(t.clientPosition || t.companyName) && (
                      <p className="text-stone-brown/60 text-xs mt-0.5">{t.clientPosition}{t.clientPosition && t.companyName ? ' · ' : ''}{t.companyName}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* All testimonials */}
      <section className="py-20">
        <div className="container-main">
          {rest.length > 0 && <p className="section-label mb-10">All Reviews</p>}
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-36 bg-stone-brown/8 animate-pulse" />)}</div>
          ) : testimonials.length === 0 ? (
            <p className="text-stone-brown/40 text-center py-20">No testimonials yet.</p>
          ) : (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((t: any) => (
                <motion.div key={t.id} variants={fadeUp} className="border border-stone-brown/15 bg-white p-6 hover:border-luxury-burgundy/30 transition-all duration-300">
                  <StarRating rating={t.rating} />
                  <p className="text-stone-brown text-sm leading-relaxed mt-4 mb-5">"{t.testimonial}"</p>
                  <div className="border-t border-stone-brown/10 pt-4">
                    <p className="text-primary-black text-sm font-medium">{t.clientName}</p>
                    {(t.clientPosition || t.companyName) && (
                      <p className="text-stone-brown/50 text-xs mt-0.5">{t.clientPosition}{t.clientPosition && t.companyName ? ', ' : ''}{t.companyName}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-arch-beige/10 border-t border-stone-brown/10">
        <div className="container-main text-center">
          <h2 className="font-display text-4xl text-primary-black font-light mb-8">Ready to Write Your Story?</h2>
          <a href="/contact" className="btn-primary">Start a Project</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
