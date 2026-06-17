import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Settings } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const { data: settingsRes } = useQuery({ queryKey: ['settings'], queryFn: () => api.get('/settings').then(r => r.data) });
  const settings: Settings = settingsRes?.data;

  const mutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/messages', data),
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); mutation.mutate(form); };

  return (
    <div className="min-h-screen bg-warm-white text-primary-black">
      <Navbar />

      <div className="pt-28 bg-white border-b border-stone-brown/10">
        <div className="container-main py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}>
              <span className="section-label mb-5">{t('contact.label')}</span>
              <h1 className="font-display text-4xl md:text-6xl font-light leading-tight">
                {t('contact.title')}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container-main py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">

          {/* Left: contact info */}
          <div className="lg:col-span-2">
            <p className="text-stone-brown leading-relaxed mb-12 text-lg font-light">
              Tell us about your project and vision. We'd love to hear how we can help create something extraordinary.
            </p>
            <div className="space-y-8">
              {settings?.email && (
                <div className="flex flex-col gap-1">
                  <span className="text-luxury-burgundy text-xs tracking-widest uppercase">Email</span>
                  <a href={`mailto:${settings.email}`} className="text-primary-black hover:text-luxury-burgundy transition-colors">{settings.email}</a>
                </div>
              )}
              {settings?.phone && (
                <div className="flex flex-col gap-1">
                  <span className="text-luxury-burgundy text-xs tracking-widest uppercase">Phone</span>
                  <a href={`tel:${settings.phone}`} className="text-primary-black hover:text-luxury-burgundy transition-colors">{settings.phone}</a>
                </div>
              )}
              {settings?.whatsapp && (
                <div className="flex flex-col gap-1">
                  <span className="text-luxury-burgundy text-xs tracking-widest uppercase">WhatsApp</span>
                  <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-primary-black hover:text-luxury-burgundy transition-colors">{settings.whatsapp}</a>
                </div>
              )}
              {settings?.address && (
                <div className="flex flex-col gap-1">
                  <span className="text-luxury-burgundy text-xs tracking-widest uppercase">Studio</span>
                  <span className="text-stone-brown leading-relaxed">{settings.address}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-10 pt-10 border-t border-stone-brown/15">
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer"
                  className="text-stone-brown text-xs tracking-widest uppercase border border-stone-brown/30 px-4 py-2 hover:border-luxury-burgundy hover:text-luxury-burgundy transition-all">
                  Instagram
                </a>
              )}
              {settings?.linkedIn && (
                <a href={settings.linkedIn} target="_blank" rel="noreferrer"
                  className="text-stone-brown text-xs tracking-widest uppercase border border-stone-brown/30 px-4 py-2 hover:border-luxury-burgundy hover:text-luxury-burgundy transition-all">
                  LinkedIn
                </a>
              )}
              {settings?.behance && (
                <a href={settings.behance} target="_blank" rel="noreferrer"
                  className="text-stone-brown text-xs tracking-widest uppercase border border-stone-brown/30 px-4 py-2 hover:border-luxury-burgundy hover:text-luxury-burgundy transition-all">
                  Behance
                </a>
              )}
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-stone-brown/15 p-12 text-center"
              >
                <div className="w-14 h-14 border border-luxury-burgundy/30 flex items-center justify-center mx-auto mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#49111C" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="font-display text-2xl text-primary-black mb-3">{t('contact.success')}</h3>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  className="btn-ghost mt-6"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-stone-brown/60 mb-2">{t('contact.name')} *</label>
                    <input
                      type="text" required value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="input-bordered" placeholder="Ahmed Al-Rashid"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-stone-brown/60 mb-2">{t('contact.phone')}</label>
                    <input
                      type="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="input-bordered" placeholder="+971 50 000 0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-brown/60 mb-2">{t('contact.email')} *</label>
                  <input
                    type="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-bordered" placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-brown/60 mb-2">{t('contact.subject')} *</label>
                  <input
                    type="text" required value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="input-bordered" placeholder="New residential project"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-brown/60 mb-2">{t('contact.message')} *</label>
                  <textarea
                    required rows={5} value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="textarea-bordered" placeholder="Tell us about your project, timeline, and vision…"
                  />
                </div>
                {mutation.isError && (
                  <p className="text-red-600 text-sm">{t('contact.error')}</p>
                )}
                <button type="submit" disabled={mutation.isPending} className="btn-primary w-full justify-center disabled:opacity-50">
                  {mutation.isPending ? t('contact.sending') : t('contact.send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
