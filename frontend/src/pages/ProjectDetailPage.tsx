import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Project } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Lightbox from '@/components/Lightbox';

const SHARE_STORAGE_KEY = 'arqiva_shared';
const LIKE_STORAGE_KEY = 'arqiva_liked';

function ShareMenu({ title, slug, onClose }: { title: string; slug: string; onClose: () => void }) {
  const url = `${window.location.origin}/projects/${slug}`;
  const [copied, setCopied] = useState(false);
  const text = encodeURIComponent(`${title} — ARQIVA Studio & Design`);
  const enc = encodeURIComponent(url);

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const shareOptions = [
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      ),
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${text}%20${enc}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      ),
    },
    {
      label: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${text}&url=${enc}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      ),
    },
  ];

  return (
    <>
      {/* Click-outside backdrop */}
      <div className="fixed inset-0 z-[45]" onClick={onClose} />
      {/* Dropdown panel */}
      <div className="absolute bottom-full mb-3 right-0 bg-white border border-stone-brown/15 shadow-[0_8px_40px_rgba(10,9,8,0.14)] z-[46] w-[240px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-brown/10">
          <span className="text-[10px] tracking-[0.35em] uppercase text-stone-brown/60 font-medium">Share Project</span>
          <button onClick={onClose} className="text-stone-brown/40 hover:text-stone-brown transition-colors p-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        {/* Share options */}
        <div className="py-1.5">
          {shareOptions.map(opt => (
            <a
              key={opt.label}
              href={opt.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#FAF8F5] transition-colors group"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-[#F7F4F0] group-hover:bg-white transition-colors rounded-sm shrink-0">
                {opt.icon}
              </span>
              <span className="text-sm text-primary-black font-medium">{opt.label}</span>
              <svg className="ml-auto text-stone-brown/30 group-hover:text-stone-brown/60 transition-colors" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
          ))}
        </div>
        {/* Copy link */}
        <div className="border-t border-stone-brown/10 p-2">
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-stone-brown hover:bg-[#FAF8F5] transition-colors rounded-sm"
          >
            <span className="w-8 h-8 flex items-center justify-center bg-[#F7F4F0] rounded-sm shrink-0">
              {copied
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#49111C" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              }
            </span>
            <span className={copied ? 'text-luxury-burgundy font-medium' : ''}>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default function ProjectDetailPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { slug } = useParams<{ slug: string }>();
  const qc = useQueryClient();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);

  const storedLiked = () => {
    try { return JSON.parse(localStorage.getItem(LIKE_STORAGE_KEY) || '[]'); } catch { return []; }
  };
  const [liked, setLiked] = useState<boolean>(() => slug ? storedLiked().includes(slug) : false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.get(`/projects/${slug}`).then(r => r.data),
    enabled: !!slug,
  });

  // Track view once per browser per project, expires after 24h
  useEffect(() => {
    if (!data?.data?.id) return;
    const key = `arqiva_view_${data.data.id}`;
    const stored = localStorage.getItem(key);
    const now = Date.now();
    if (stored && now - parseInt(stored) < 24 * 60 * 60 * 1000) return; // already counted within 24h
    localStorage.setItem(key, String(now));
    api.post(`/projects/${data.data.id}/view`).catch(() => {/* silent */});
  }, [data?.data?.id]);

  const { data: galleryRes } = useQuery({
    queryKey: ['gallery', data?.data?.id],
    queryFn: () => api.get(`/projects/${data.data.id}/gallery`).then(r => r.data),
    enabled: !!data?.data?.id,
  });

  const { data: feedbackRes } = useQuery({
    queryKey: ['feedback', data?.data?.id],
    queryFn: () => api.get(`/feedback/project/${data.data.id}`).then(r => r.data),
    enabled: !!data?.data?.id,
  });

  const likeMutation = useMutation({
    mutationFn: (action: 'like' | 'unlike') =>
      api.post(`/projects/${data?.data?.id}/${action}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['project', slug] }),
  });

  const shareMutation = useMutation({
    mutationFn: () => api.post(`/projects/${data?.data?.id}/share`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['project', slug] }),
  });

  const feedbackMutation = useMutation({
    mutationFn: (body: any) => api.post('/feedback', body).then(r => r.data),
    onSuccess: () => {
      setFeedbackSent(true);
      qc.invalidateQueries({ queryKey: ['feedback', data?.data?.id] });
    },
  });

  const project: Project = data?.data;
  const gallery = galleryRes?.data || [];
  const feedbackList = feedbackRes?.data || [];

  // Merge project.images with gallery endpoint (use gallery if available)
  const allImages = gallery.length > 0 ? gallery : (project?.images || []);

  const handleLike = () => {
    const arr: string[] = storedLiked();
    if (!slug) return;
    if (liked) {
      localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(arr.filter(s => s !== slug)));
      setLiked(false);
      likeMutation.mutate('unlike');
    } else {
      localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify([...arr, slug]));
      setLiked(true);
      likeMutation.mutate('like');
    }
  };

  const handleShare = () => {
    shareMutation.mutate();
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    feedbackMutation.mutate({ ...feedbackForm, projectId: project.id });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-px h-20 bg-stone-brown/20 mx-auto animate-pulse" />
          <p className="text-stone-brown/40 text-xs tracking-widest uppercase mt-4">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-brown font-display text-2xl mb-6">Project not found</p>
          <Link to="/projects" className="btn-primary">{t('common.back')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white text-primary-black">
      <Navbar />

      {/* Hero */}
      <div className="pt-20">
        <div className="aspect-[16/7] md:aspect-[21/7] relative overflow-hidden bg-stone-brown/10">
          {project.coverImage ? (
            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-arch-beige/20 to-stone-brown/10 flex items-center justify-center">
              <span className="font-display text-9xl text-stone-brown/10">{project.title[0]}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-black/50 to-transparent" />
          {/* Breadcrumb */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container-main">
              <Link to="/projects" className="text-warm-white/60 text-xs tracking-widest uppercase hover:text-warm-white transition-colors">
                ← {t('common.back')} / {t('projects.label')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-main py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left: main content */}
          <div className="lg:col-span-8">

            {/* Title block */}
            <div className="mb-10 pb-10 border-b border-stone-brown/12">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                {project.category && (
                  <span className="text-[10px] tracking-[0.3em] uppercase text-luxury-burgundy border border-luxury-burgundy/30 px-3 py-1.5">
                    {project.category.name}
                  </span>
                )}
                {project.year && (
                  <span className="text-xs text-stone-brown/40 tracking-widest">{project.year}</span>
                )}
                {project.city && (
                  <span className="text-xs text-stone-brown/40 tracking-widest">· {project.city}{project.country ? `, ${project.country}` : ''}</span>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-light leading-tight mb-8">
                {isAr && project.titleAr ? project.titleAr : project.title}
              </h1>

              {/* Actions row */}
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 text-sm tracking-wide transition-colors ${
                    liked ? 'text-luxury-burgundy' : 'text-stone-brown hover:text-luxury-burgundy'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#49111C' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>{liked ? t('project_detail.liked') : t('project_detail.like')}</span>
                  <span className="text-stone-brown/40">{project.likes || 0}</span>
                </button>

                <div className="w-px h-4 bg-stone-brown/20" />

                <div className="relative">
                  <button
                    onClick={() => setShowShare(s => !s)}
                    className="flex items-center gap-2 text-sm tracking-wide text-stone-brown hover:text-luxury-burgundy transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    <span>{t('project_detail.share')}</span>
                    <span className="text-stone-brown/40">{project.shares || 0}</span>
                  </button>
                  {showShare && (
                    <ShareMenu
                      title={project.title}
                      slug={project.slug}
                      onClose={() => setShowShare(false)}
                    />
                  )}
                </div>

                <div className="w-px h-4 bg-stone-brown/20" />

                <span className="flex items-center gap-1.5 text-xs text-stone-brown/40">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  {project.views || 0} {t('projects.views')}
                </span>
              </div>
            </div>

            {/* Lead description */}
            {project.description && (
              <motion.p
                className="text-stone-brown text-lg leading-relaxed mb-14 font-light"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {isAr && project.descriptionAr ? project.descriptionAr : project.description}
              </motion.p>
            )}

            {/* Numbered editorial sections */}
            {(project.projectStory || project.designConcept) && (
              <motion.div
                className="mb-12 space-y-0 divide-y divide-stone-brown/10"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {project.projectStory && (
                  <div className="py-10 first:pt-0">
                    <div className="flex items-start gap-8">
                      <div className="shrink-0 pt-1">
                        <span className="text-[10px] font-mono tracking-widest text-stone-brown/25">01</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-display text-xl text-primary-black mb-4">{t('project_detail.overview')}</h2>
                        <p className="text-stone-brown leading-relaxed">{project.projectStory}</p>
                      </div>
                    </div>
                  </div>
                )}
                {project.designConcept && (
                  <div className="py-10">
                    <div className="flex items-start gap-8">
                      <div className="shrink-0 pt-1">
                        <span className="text-[10px] font-mono tracking-widest text-stone-brown/25">02</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-display text-xl text-primary-black mb-4">{t('project_detail.concept')}</h2>
                        <p className="text-stone-brown leading-relaxed">{project.designConcept}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Challenges + Solutions — side by side */}
            {(project.challenges || project.solutions) && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-12 border border-stone-brown/12 divide-y md:divide-y-0 md:divide-x divide-stone-brown/12"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                {project.challenges && (
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[10px] font-mono tracking-widest text-stone-brown/25">{project.projectStory || project.designConcept ? '03' : '01'}</span>
                      <span className="flex-1 h-px bg-stone-brown/10" />
                    </div>
                    <h2 className="font-display text-lg text-primary-black mb-3">{t('project_detail.challenges')}</h2>
                    <p className="text-stone-brown leading-relaxed text-sm">{project.challenges}</p>
                  </div>
                )}
                {project.solutions && (
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[10px] font-mono tracking-widest text-luxury-burgundy/40">{project.projectStory || project.designConcept ? '04' : '02'}</span>
                      <span className="flex-1 h-px bg-luxury-burgundy/15" />
                    </div>
                    <h2 className="font-display text-lg text-primary-black mb-3">{t('project_detail.solutions')}</h2>
                    <p className="text-stone-brown leading-relaxed text-sm">{project.solutions}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Gallery */}
            {allImages.length > 0 && (
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="font-display text-2xl text-primary-black mb-8">{t('project_detail.gallery')}</h2>

                {/* Featured + side thumbnails */}
                <div className="flex gap-2 h-[400px] mb-2">
                  {/* Featured image */}
                  <button
                    onClick={() => setLightboxIndex(0)}
                    className="group relative flex-[2] overflow-hidden cursor-pointer focus:outline-none bg-stone-brown/10"
                  >
                    <img
                      src={allImages[0].imageUrl}
                      alt={allImages[0].altText || allImages[0].caption || project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary-black/0 group-hover:bg-primary-black/20 transition-colors duration-300 flex items-center justify-center">
                      <svg className="text-warm-white opacity-0 group-hover:opacity-100 transition-opacity" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                      </svg>
                    </div>
                    {allImages[0].caption && (
                      <p className="absolute bottom-3 left-4 text-warm-white/80 text-xs tracking-wide bg-primary-black/30 px-2 py-1">{allImages[0].caption}</p>
                    )}
                  </button>

                  {/* Side thumbnails (images 1 & 2) */}
                  {allImages.length > 1 && (
                    <div className="flex flex-col gap-2 flex-1">
                      {allImages.slice(1, 3).map((img: any, i: number) => {
                        const idx = i + 1;
                        const isLast = idx === 2 && allImages.length > 3;
                        return (
                          <button
                            key={img.id}
                            onClick={() => setLightboxIndex(idx)}
                            className="group relative flex-1 overflow-hidden cursor-pointer focus:outline-none bg-stone-brown/10"
                          >
                            <img
                              src={img.imageUrl}
                              alt={img.altText || img.caption || project.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            {isLast ? (
                              <div className="absolute inset-0 bg-primary-black/55 flex items-center justify-center">
                                <span className="text-warm-white font-display text-2xl">+{allImages.length - 3}</span>
                              </div>
                            ) : (
                              <div className="absolute inset-0 bg-primary-black/0 group-hover:bg-primary-black/25 transition-colors duration-300 flex items-center justify-center">
                                <svg className="text-warm-white opacity-0 group-hover:opacity-100 transition-opacity" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Additional images */}
                {allImages.length > 3 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {allImages.slice(3).map((img: any, i: number) => (
                      <button
                        key={img.id}
                        onClick={() => setLightboxIndex(i + 3)}
                        className="group relative aspect-square overflow-hidden cursor-pointer focus:outline-none bg-stone-brown/10"
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.altText || img.caption || project.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-primary-black/0 group-hover:bg-primary-black/25 transition-colors duration-300 flex items-center justify-center">
                          <svg className="text-warm-white opacity-0 group-hover:opacity-100 transition-opacity" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:self-start">
            {/* Project details card */}
            <div className="bg-white border border-stone-brown/15 p-7 sticky top-24">
              <h3 className="text-[10px] tracking-[0.35em] uppercase text-luxury-burgundy mb-6 pb-5 border-b border-stone-brown/10">
                Project Details
              </h3>

              <dl className="space-y-0 divide-y divide-stone-brown/8">
                {[
                  { label: 'Client', value: project.clientName || project.clientCompany },
                  { label: 'Location', value: [project.city, project.country].filter(Boolean).join(', ') },
                  { label: 'Area', value: project.projectArea ? `${project.projectArea} sqm` : null },
                  { label: 'Year', value: project.year ? String(project.year) : null },
                  { label: 'Duration', value: project.duration },
                  { label: 'Budget', value: project.budget },
                  { label: 'Status', value: project.status?.replace(/-/g, ' ') },
                  { label: 'Category', value: project.category?.name },
                ].filter(item => item.value).map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between py-4 gap-4">
                    <dt className="text-stone-brown/45 text-[10px] tracking-widest uppercase shrink-0">{label}</dt>
                    <dd className="text-primary-black text-sm font-medium text-right capitalize leading-snug">{value as string}</dd>
                  </div>
                ))}
              </dl>

              <div className="pt-6 mt-2 border-t border-stone-brown/10">
                <Link to="/contact" className="btn-primary w-full justify-center">
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Leave Feedback */}
            <div className="bg-white border border-stone-brown/15 p-6">
              <h3 className="text-[10px] tracking-[0.35em] uppercase text-luxury-burgundy mb-6 pb-5 border-b border-stone-brown/10">
                {t('project_detail.feedback_title')}
              </h3>
              {feedbackSent ? (
                <div className="text-center py-6">
                  <svg className="text-luxury-burgundy mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <p className="text-primary-black font-display text-lg">{t('project_detail.feedback_success')}</p>
                </div>
              ) : (
                <form onSubmit={submitFeedback} className="space-y-4">
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-stone-brown/50 mb-1.5">{t('project_detail.feedback_name')} *</label>
                    <input required value={feedbackForm.name} onChange={e => setFeedbackForm(f => ({ ...f, name: e.target.value }))} className="input-bordered" />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-stone-brown/50 mb-1.5">{t('project_detail.feedback_email')} *</label>
                    <input type="email" required value={feedbackForm.email} onChange={e => setFeedbackForm(f => ({ ...f, email: e.target.value }))} className="input-bordered" />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-stone-brown/50 mb-2">{t('project_detail.feedback_rating')}</label>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onClick={() => setFeedbackForm(f => ({ ...f, rating: n }))} className="transition-transform hover:scale-110">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill={n <= feedbackForm.rating ? '#A9927D' : 'none'} stroke="#A9927D" strokeWidth="1.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-stone-brown/50 mb-1.5">{t('project_detail.feedback_comment')} *</label>
                    <textarea required rows={3} value={feedbackForm.comment} onChange={e => setFeedbackForm(f => ({ ...f, comment: e.target.value }))} className="textarea-bordered" />
                  </div>
                  <button type="submit" disabled={feedbackMutation.isPending} className="btn-primary w-full justify-center disabled:opacity-50">
                    {feedbackMutation.isPending ? t('common.loading') : t('project_detail.feedback_submit')}
                  </button>
                </form>
              )}
            </div>

            {/* Client Feedback — after project info */}
            {feedbackList.length > 0 && (
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-luxury-burgundy mb-5">Client Feedback</h3>
                <div className="space-y-4">
                  {feedbackList.map((fb: any) => (
                    <div key={fb.id} className="bg-white border border-stone-brown/15 p-5">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-primary-black text-sm">{fb.name}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < fb.rating ? '#A9927D' : '#E8E2DB'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-brown/60 text-[10px] tracking-wide mb-2">
                        {new Date(fb.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                      </p>
                      <p className="text-stone-brown text-xs leading-relaxed">{fb.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="border-t border-stone-brown/10 py-10 text-center">
        <Link to="/projects" className="btn-ghost">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="rtl-flip"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {t('common.back')} to Projects
        </Link>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex(i => Math.min(allImages.length - 1, (i ?? 0) + 1))}
          onPrev={() => setLightboxIndex(i => Math.max(0, (i ?? 0) - 1))}
        />
      )}

      <Footer />
    </div>
  );
}
