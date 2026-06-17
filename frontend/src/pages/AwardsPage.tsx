import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function AwardsPage() {
  const { t } = useTranslation();
  const { data: awardsRes, isLoading } = useQuery({
    queryKey: ['awards-all'],
    queryFn: () => api.get('/awards?limit=100').then(r => r.data),
  });
  const { data: settingsRes } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data),
  });

  const awards = awardsRes?.data || [];
  const settings = settingsRes?.data;

  // Group by year
  const byYear = awards.reduce((acc: Record<number, any[]>, a: any) => {
    (acc[a.year] = acc[a.year] || []).push(a);
    return acc;
  }, {});
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-warm-white text-primary-black">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 border-b border-stone-brown/10 bg-white">
        <div className="container-main">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} className="section-label mb-4">{t('awards.label')}</motion.p>
            <motion.h1 variants={fadeUp} className="font-display text-4xl md:text-6xl font-light leading-tight mb-6">
              {t('awards.title')}
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-stone-brown/10 bg-white">
        <div className="container-main grid grid-cols-3 gap-8">
          {[
            { label: 'Total Awards', value: awards.length },
            { label: 'Years Active', value: years.length },
            { label: 'Categories', value: [...new Set(awards.map((a: any) => a.category).filter(Boolean))].length },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl md:text-5xl text-primary-black mb-2 font-light">{stat.value}</p>
              <p className="text-stone-brown/60 text-xs tracking-widest uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards by Year */}
      <section className="py-20 container-main">
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-stone-brown/8 animate-pulse" />)}</div>
          ) : awards.length === 0 ? (
            <p className="text-stone-brown/40 text-center py-20">No awards listed yet.</p>
          ) : (
            <div className="space-y-16">
              {years.map(year => (
                <div key={year}>
                  <div className="flex items-center gap-6 mb-8">
                    <p className="font-display text-5xl text-stone-brown/15 font-light">{year}</p>
                    <div className="flex-1 h-px bg-stone-brown/15" />
                  </div>
                  <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {byYear[year].map((award: any) => (
                      <motion.div key={award.id} variants={fadeUp}
                        className="border border-stone-brown/15 bg-white p-6 hover:border-luxury-burgundy/30 transition-all duration-300 group"
                      >
                        {award.featured && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-luxury-burgundy text-xs tracking-widest uppercase">★ Featured</span>
                          </div>
                        )}
                        <h3 className="font-display text-lg text-primary-black mb-2 group-hover:text-luxury-burgundy transition-colors">{award.title}</h3>
                        {award.issuer && <p className="text-arch-beige text-sm mb-2">{award.issuer}</p>}
                        {award.category && (
                          <span className="inline-block border border-stone-brown/20 text-stone-brown/60 text-xs tracking-widest uppercase px-3 py-1 mb-3">
                            {award.category}
                          </span>
                        )}
                        {award.description && <p className="text-stone-brown/70 text-sm leading-relaxed">{award.description}</p>}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          )}
      </section>

      {/* CTA */}
      <section className="section-padding bg-arch-beige/10 border-t border-stone-brown/10">
        <div className="container-main text-center">
          <h2 className="font-display text-4xl text-primary-black font-light mb-8">Start Your Award-Winning Project</h2>
          <a href="/contact" className="btn-primary">Begin the Conversation</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
