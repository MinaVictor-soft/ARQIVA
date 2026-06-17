import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function PackagesPage() {
  const { t } = useTranslation();

  const { data: packagesRes, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: () => api.get('/packages').then(r => r.data),
  });

  const packages: any[] = packagesRes?.data || [];

  return (
    <div className="min-h-screen bg-warm-white text-primary-black">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-16 bg-white border-b border-stone-brown/10">
        <div className="container-main">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} className="section-label mb-4">{t('packages.label')}</motion.p>
            <motion.h1 variants={fadeUp} className="font-display text-4xl md:text-6xl font-light leading-tight">
              {t('packages.title')}
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* Packages grid */}
      <section className="container-main py-16 md:py-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 bg-stone-brown/8 animate-pulse" />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <p className="text-center text-stone-brown/50 py-20">No packages available yet.</p>
        ) : (
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {packages.map((pkg: any) => {
              const features: string[] = Array.isArray(pkg.features) ? pkg.features : [];
              const includedServices: string[] = Array.isArray(pkg.includedServices) ? pkg.includedServices : [];

              return (
                <motion.div
                  key={pkg.id}
                  variants={fadeUp}
                  className={`flex flex-col border transition-all duration-300 ${
                    pkg.featured
                      ? 'border-luxury-burgundy bg-white shadow-lg relative'
                      : 'border-stone-brown/15 bg-white hover:border-luxury-burgundy/30'
                  }`}
                >
                  {pkg.featured && (
                    <div className="bg-luxury-burgundy text-warm-white text-xs tracking-widest uppercase text-center py-2 px-4">
                      {t('packages.featured')}
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1">
                    {/* Title + price */}
                    <h2 className="font-display text-2xl text-primary-black font-light mb-2">{pkg.title}</h2>
                    {pkg.description && (
                      <p className="text-stone-brown text-sm leading-relaxed mb-6">{pkg.description}</p>
                    )}

                    <div className="flex items-end gap-1 mb-6">
                      {pkg.price != null ? (
                        <>
                          <span className="font-display text-4xl text-primary-black font-light">
                            {Number(pkg.price).toLocaleString()}
                          </span>
                          <span className="text-stone-brown/60 text-sm mb-1">{pkg.currency || 'USD'}</span>
                        </>
                      ) : (
                        <span className="font-display text-2xl text-stone-brown/50 font-light">Custom</span>
                      )}
                    </div>

                    {pkg.duration && (
                      <div className="flex items-center gap-2 mb-6 text-stone-brown text-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {pkg.duration}
                      </div>
                    )}

                    <div className="h-px bg-stone-brown/10 mb-6" />

                    {/* Features */}
                    {features.length > 0 && (
                      <ul className="space-y-3 mb-6">
                        {features.map((f, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-stone-brown">
                            <svg className="shrink-0 mt-0.5 text-luxury-burgundy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Included services */}
                    {includedServices.length > 0 && (
                      <div className="mb-6">
                        <p className="text-xs tracking-widest uppercase text-stone-brown/50 mb-3">Includes</p>
                        <div className="flex flex-wrap gap-2">
                          {includedServices.map((s, i) => (
                            <span key={i} className="border border-stone-brown/20 text-stone-brown text-xs px-3 py-1">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto">
                      <Link
                        to="/contact"
                        className={`block text-center py-3 px-6 text-sm tracking-widest uppercase transition-all duration-300 ${
                          pkg.featured
                            ? 'bg-luxury-burgundy text-warm-white hover:bg-primary-black'
                            : 'border border-primary-black text-primary-black hover:bg-primary-black hover:text-warm-white'
                        }`}
                      >
                        {t('packages.get_started')}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* Custom CTA */}
      <section className="section-padding bg-primary-black text-warm-white">
        <div className="container-main text-center">
          <p className="section-label text-warm-white/40 mb-4">Custom Solutions</p>
          <h2 className="font-display text-3xl md:text-5xl font-light mb-6">
            Need a Tailored Package?
          </h2>
          <p className="text-warm-white/60 mb-10 max-w-lg mx-auto">
            Every project is unique. Let's discuss your specific requirements and create a solution designed around your vision.
          </p>
          <Link to="/contact" className="btn-secondary border-warm-white/30 text-warm-white hover:bg-warm-white hover:text-primary-black">
            {t('packages.contact_us')}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
