import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const proficiencyWidth: Record<string, string> = {
  beginner: 'w-1/4', intermediate: 'w-1/2', advanced: 'w-3/4', expert: 'w-full',
};

export default function ResumePage() {
  const { t } = useTranslation();
  const { data: eduRes } = useQuery({ queryKey: ['education'], queryFn: () => api.get('/education').then(r => r.data) });
  const { data: expRes } = useQuery({ queryKey: ['experience'], queryFn: () => api.get('/experience').then(r => r.data) });
  const { data: skillsRes } = useQuery({ queryKey: ['skills'], queryFn: () => api.get('/skills').then(r => r.data) });
  const { data: certRes } = useQuery({ queryKey: ['certifications'], queryFn: () => api.get('/certifications').then(r => r.data) });
  const { data: settingsRes } = useQuery({ queryKey: ['settings'], queryFn: () => api.get('/settings').then(r => r.data) });
  const { data: awardsRes } = useQuery({ queryKey: ['awards-resume'], queryFn: () => api.get('/awards?limit=20').then(r => r.data) });

  const education = eduRes?.data || [];
  const experience = expRes?.data || [];
  const skills = skillsRes?.data || [];
  const certs = certRes?.data || [];
  const settings = settingsRes?.data;
  const awards = awardsRes?.data || [];

  const grouped: Record<string, any[]> = skills.reduce((acc: any, s: any) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-warm-white text-primary-black">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-white border-b border-stone-brown/10">
        <div className="container-main flex items-end justify-between gap-8 flex-wrap">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} className="section-label mb-4">{t('resume.label')}</motion.p>
            <motion.h1 variants={fadeUp} className="font-display text-4xl md:text-6xl font-light leading-tight mb-4">
              {t('resume.title')}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-stone-brown max-w-xl leading-relaxed">
              {settings?.description || 'A decade of award-winning architecture and interior design. Creating spaces that transcend the ordinary.'}
            </motion.p>
          </motion.div>
          {settings?.resumePdf && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <a
                href={settings.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary whitespace-nowrap"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5 5 5-5M12 15V3"/></svg>
                Download CV
              </a>
            </motion.div>
          )}
        </div>
      </section>

      <div className="container-main py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-16">
            {/* Experience */}
            {experience.length > 0 && (
              <section>
                <p className="section-label mb-6 pb-3 border-b border-stone-brown/15">Work Experience</p>
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="space-y-8">
                  {experience.map((exp: any) => (
                    <motion.div key={exp.id} variants={fadeUp} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-luxury-burgundy mt-2 shrink-0" />
                        <div className="w-px flex-1 bg-stone-brown/15 mt-2" />
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-primary-black font-medium">{exp.position}</h3>
                            <p className="text-arch-beige text-sm">{exp.company}</p>
                          </div>
                          <p className="text-stone-brown/50 text-xs tracking-widest uppercase whitespace-nowrap">
                            {new Date(exp.startDate).getFullYear()} – {exp.isCurrentRole ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : '—'}
                          </p>
                        </div>
                        {exp.description && <p className="text-stone-brown text-sm leading-relaxed mt-2">{exp.description}</p>}
                        {exp.achievements && (
                          <div className="mt-3">
                            <p className="text-stone-brown/50 text-xs tracking-widest uppercase mb-2">Key Achievements</p>
                            <p className="text-stone-brown text-sm leading-relaxed">{exp.achievements}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <p className="section-label mb-6 pb-3 border-b border-stone-brown/15">Education</p>
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="space-y-4">
                  {education.map((edu: any) => (
                    <motion.div key={edu.id} variants={fadeUp} className="border border-stone-brown/15 bg-white p-6 hover:border-luxury-burgundy/25 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-primary-black font-medium">{edu.degree}</h3>
                          <p className="text-arch-beige text-sm">{edu.field}</p>
                          <p className="text-stone-brown text-sm">{edu.institution}</p>
                        </div>
                        <p className="text-stone-brown/40 text-xs tracking-widest uppercase whitespace-nowrap">
                          {edu.startYear} – {edu.endYear || 'Present'}
                        </p>
                      </div>
                      {edu.description && <p className="text-stone-brown/70 text-sm leading-relaxed mt-2">{edu.description}</p>}
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Certifications */}
            {certs.length > 0 && (
              <section>
                <p className="section-label mb-6 pb-3 border-b border-stone-brown/15">Certifications</p>
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certs.map((cert: any) => (
                    <motion.div key={cert.id} variants={fadeUp} className="border border-stone-brown/15 bg-white p-5 hover:border-luxury-burgundy/25 transition-colors">
                      <p className="text-primary-black text-sm font-medium">{cert.name}</p>
                      <p className="text-arch-beige text-xs mt-1">{cert.issuer}</p>
                      <p className="text-stone-brown/50 text-xs mt-1">{new Date(cert.issuedDate).getFullYear()}</p>
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-luxury-burgundy text-xs hover:underline mt-2 block">View Credential →</a>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Skills */}
            {Object.keys(grouped).length > 0 && (
              <section>
                <p className="section-label mb-5 pb-3 border-b border-stone-brown/15">Skills</p>
                {Object.entries(grouped).map(([cat, catSkills]) => (
                  <div key={cat} className="mb-6">
                    <p className="text-stone-brown/50 text-xs tracking-widest uppercase mb-3 capitalize">{cat}</p>
                    <div className="space-y-3">
                      {catSkills.map((skill: any) => (
                        <div key={skill.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-primary-black text-sm">{skill.name}</span>
                            <span className="text-stone-brown/50 text-xs capitalize">{skill.proficiency}</span>
                          </div>
                          <div className="h-0.5 bg-stone-brown/10">
                            <div className={`h-0.5 bg-arch-beige ${proficiencyWidth[skill.proficiency] || 'w-3/4'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Awards summary */}
            {awards.length > 0 && (
              <section>
                <p className="section-label mb-5 pb-3 border-b border-stone-brown/15">Awards</p>
                <div className="space-y-3">
                  {awards.slice(0, 6).map((a: any) => (
                    <div key={a.id} className="border-l-2 border-luxury-burgundy/30 pl-4">
                      <p className="text-primary-black text-sm">{a.title}</p>
                      {a.issuer && <p className="text-stone-brown/50 text-xs">{a.issuer} · {a.year}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Contact */}
            {settings && (
              <section className="border border-stone-brown/15 bg-white p-6">
                <p className="section-label mb-5">Contact</p>
                <div className="space-y-3">
                  {settings.email && <a href={`mailto:${settings.email}`} className="block text-stone-brown text-sm hover:text-luxury-burgundy transition-colors">{settings.email}</a>}
                  {settings.phone && <a href={`tel:${settings.phone}`} className="block text-stone-brown text-sm hover:text-luxury-burgundy transition-colors">{settings.phone}</a>}
                  {settings.linkedIn && <a href={settings.linkedIn} target="_blank" rel="noopener noreferrer" className="block text-luxury-burgundy text-sm hover:underline">LinkedIn Profile →</a>}
                  {settings.behance && <a href={settings.behance} target="_blank" rel="noopener noreferrer" className="block text-luxury-burgundy text-sm hover:underline">Behance Portfolio →</a>}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
