import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Service } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(r => r.data),
  });

  const services: Service[] = data?.data || [];

  return (
    <div className="min-h-screen bg-warm-white text-primary-black">
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-16 bg-white border-b border-stone-brown/10">
        <div className="container-main">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}>
            <span className="section-label mb-4">{t('services.label')}</span>
            <h1 className="font-display text-4xl md:text-6xl font-light max-w-3xl">{t('services.title')}</h1>
          </motion.div>
        </div>
      </div>

      {/* Services accordion list */}
      <div className="container-main py-16 md:py-20">
        {isLoading ? (
          <div className="space-y-px">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-stone-brown/8 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="border-t border-stone-brown/15">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border-b border-stone-brown/15"
              >
                <button
                  onClick={() => setExpanded(expanded === service.id ? null : service.id)}
                  className="group w-full text-left py-8 grid grid-cols-12 gap-6 items-center hover:bg-arch-beige/5 transition-colors px-2"
                >
                  <span className="col-span-1 text-luxury-burgundy/50 text-xs font-mono tracking-widest">0{i + 1}</span>
                  <h2 className="col-span-8 md:col-span-9 font-display text-2xl md:text-3xl font-light group-hover:text-luxury-burgundy transition-colors">
                    {isAr && (service as any).nameAr ? (service as any).nameAr : service.name}
                  </h2>
                  <div className="col-span-3 md:col-span-2 flex justify-end">
                    <span className={`text-stone-brown/50 transition-transform duration-300 ${expanded === service.id ? 'rotate-45' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14"/></svg>
                    </span>
                  </div>
                </button>

                {/* Expanded content */}
                {expanded === service.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-2 pb-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 ml-[8.333%]">
                      <div className="md:col-span-5">
                        <p className="text-stone-brown leading-relaxed">
                          {isAr && (service as any).descriptionAr ? (service as any).descriptionAr : service.description}
                        </p>
                      </div>
                      <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {service.benefits && (
                          <div>
                            <h4 className="text-xs tracking-widest uppercase text-luxury-burgundy mb-3">Benefits</h4>
                            <p className="text-stone-brown/70 text-sm leading-relaxed whitespace-pre-line">{service.benefits}</p>
                          </div>
                        )}
                        {service.process && (
                          <div>
                            <h4 className="text-xs tracking-widest uppercase text-luxury-burgundy mb-3">Our Process</h4>
                            <p className="text-stone-brown/70 text-sm leading-relaxed">{service.process}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-8 ml-[8.333%]">
                      <Link to="/contact" className="btn-secondary text-xs py-2.5">
                        {t('services.cta')}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="bg-primary-black section-padding">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-luxury-burgundy text-xs tracking-[0.4em] uppercase font-medium mb-3 block">Ready to Start?</span>
            <h2 className="font-display text-3xl md:text-4xl text-warm-white font-light">Let's discuss your project</h2>
          </div>
          <Link to="/contact" className="btn-primary shrink-0">{t('services.cta')}</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
