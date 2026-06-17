import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Settings, Award } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const { t } = useTranslation();

  const { data: settingsRes } = useQuery({ queryKey: ['settings'], queryFn: () => api.get('/settings').then(r => r.data), staleTime: 5 * 60 * 1000 });
  const { data: awardsRes } = useQuery({ queryKey: ['awards', 'featured'], queryFn: () => api.get('/awards?featured=true&limit=6').then(r => r.data), staleTime: 5 * 60 * 1000 });

  const settings: Settings = settingsRes?.data;
  const awards: Award[] = awardsRes?.data || [];

  return (
    <div className="min-h-screen bg-warm-white text-primary-black">
      <Navbar />

      {/* Hero */}
      <div className="pt-28 pb-0 bg-white border-b border-stone-brown/10">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20 pt-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}>
              <span className="section-label mb-5">{t('about.label')}</span>
              <h1 className="font-display text-4xl md:text-6xl font-light leading-tight mb-0">
                {t('about.title')}
              </h1>
            </motion.div>
            <motion.div className="pt-2 flex items-end" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12, ease: [0.22,1,0.36,1] }}>
              <p className="text-stone-brown text-xl leading-relaxed font-light">
                {settings?.description || 'We are an architecture and interior design studio dedicated to creating spaces that inspire, endure, and elevate the human experience.'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Hero image */}
        {settings?.profileImage && (
          <motion.div className="aspect-[21/8] overflow-hidden" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22,1,0.36,1] }}>
            <img src={settings.profileImage} alt="ARQIVA Studio" className="w-full h-full object-cover" />
          </motion.div>
        )}
      </div>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-brown/10">
            {settings?.mission && (
              <motion.div className="bg-warm-white p-10 md:p-16" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}>
                <span className="section-label mb-6">{t('about.mission')}</span>
                <p className="font-display text-2xl text-primary-black font-light leading-relaxed">{settings.mission}</p>
              </motion.div>
            )}
            {settings?.vision && (
              <motion.div className="bg-white p-10 md:p-16" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1, ease: [0.22,1,0.36,1] }}>
                <span className="section-label mb-6">{t('about.vision')}</span>
                <p className="font-display text-2xl text-primary-black font-light leading-relaxed">{settings.vision}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Design Philosophy */}
      {settings?.designPhilosophy && (
        <section className="bg-primary-black section-padding">
          <div className="container-main">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}>
              <span className="text-luxury-burgundy text-xs tracking-[0.4em] uppercase font-medium block mb-8">{t('about.philosophy')}</span>
              <blockquote className="font-display text-3xl md:text-4xl text-warm-white font-light leading-relaxed max-w-4xl">
                "{settings.designPhilosophy}"
              </blockquote>
            </motion.div>
          </div>
        </section>
      )}

      {/* Values */}
      {settings?.values && (
        <section className="section-padding border-t border-stone-brown/10">
          <div className="container-main">
            <span className="section-label mb-8">{t('about.values')}</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.values.split('\n').filter(Boolean).map((val, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-white border border-stone-brown/15">
                  <span className="text-luxury-burgundy font-display text-2xl font-light mt-[-2px]">{i + 1}.</span>
                  <p className="text-stone-brown leading-relaxed">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <section className="section-padding bg-white border-t border-stone-brown/10">
          <div className="container-main">
            <span className="section-label mb-10">Recognition</span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.map((award, i) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="p-7 border border-stone-brown/15 hover:border-luxury-burgundy/30 transition-colors"
                >
                  <p className="text-luxury-burgundy/70 text-xs tracking-widest uppercase mb-3">{award.year}</p>
                  <h3 className="font-display text-lg text-primary-black mb-2 leading-snug">{award.title}</h3>
                  {award.issuer && <p className="text-stone-brown text-sm">{award.issuer}</p>}
                  {award.category && <p className="text-stone-brown/50 text-xs mt-1 uppercase tracking-wider">{award.category}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-arch-beige/12 border-t border-stone-brown/10 text-center">
        <div className="container-main">
          <h2 className="font-display text-4xl text-primary-black font-light mb-8">Let's work together</h2>
          <Link to="/contact" className="btn-primary">Get in Touch</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
