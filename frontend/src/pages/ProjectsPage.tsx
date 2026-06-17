import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Project } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [categorySlug, setCategorySlug] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: catsRes } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['projects', categorySlug, search, page],
    queryFn: () =>
      api.get(`/projects?limit=12&page=${page}${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`).then(r => r.data),
  });

  const projects: Project[] = (data as any)?.data || [];
  const pagination = (data as any)?.pagination;
  const categories = catsRes?.data || [];

  return (
    <div className="min-h-screen bg-warm-white text-primary-black">
      <Navbar />

      {/* Page header */}
      <div className="pt-28 pb-12 bg-white border-b border-stone-brown/10">
        <div className="container-main">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <span className="section-label mb-3">{t('projects.label')}</span>
              <h1 className="font-display text-4xl md:text-6xl font-light">{t('projects.title')}</h1>
            </div>
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder={t('projects.search_placeholder')}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full md:w-72 pl-4 pr-10 py-2.5 border border-stone-brown/30 bg-white text-sm text-primary-black placeholder-stone-brown/50 focus:outline-none focus:border-luxury-burgundy transition-colors"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-brown/40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
          </motion.div>

          {/* Category filter chips — responsive wrap, no horizontal scroll */}
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => { setCategorySlug(''); setPage(1); }}
              className={`filter-chip ${categorySlug === '' ? 'filter-chip-active' : 'filter-chip-inactive'}`}
            >
              {t('projects.all')}
              {(data as any)?.pagination?.total != null && categorySlug === '' && (
                <span className="ml-1.5 text-[10px] opacity-60">({(data as any).pagination.total})</span>
              )}
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.slug}
                onClick={() => { setCategorySlug(cat.slug); setPage(1); }}
                className={`filter-chip ${categorySlug === cat.slug ? 'filter-chip-active' : 'filter-chip-inactive'}`}
              >
                {cat.name}
                {cat._count?.projects != null && (
                  <span className="ml-1.5 text-[10px] opacity-60">({cat._count.projects})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container-main py-14">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-stone-brown/10 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div className="py-32 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-stone-brown/40 font-display text-2xl">{t('projects.no_results')}</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${categorySlug}-${search}-${page}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 6) * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/projects/${project.slug}`}
                  className="group block relative overflow-hidden bg-stone-brown/8 shadow-sm hover:shadow-luxury transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] img-zoom relative overflow-hidden bg-arch-beige/15">
                    {project.coverImage ? (
                      <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-6xl text-stone-brown/20">{project.title[0]}</span>
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-primary-black/0 group-hover:bg-primary-black/30 transition-colors duration-400" />
                    {/* Category badge */}
                    {project.category && (
                      <div className="absolute top-3 left-3 bg-warm-white/90 px-2.5 py-1 text-[10px] tracking-widest uppercase text-stone-brown">
                        {project.category.name}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-lg text-primary-black leading-tight group-hover:text-luxury-burgundy transition-colors truncate">
                          {project.title}
                        </h3>
                        <p className="text-stone-brown text-xs mt-1 tracking-wide">
                          {[project.city, project.year].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#49111C" strokeWidth="1.5">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 mt-3 pt-3 border-t border-stone-brown/10">
                      <span className="stat-chip">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        {project.views || 0}
                      </span>
                      <span className="stat-chip">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        {project.likes || 0}
                      </span>
                      {project.status && (
                        <span className={`ml-auto text-[10px] tracking-widest uppercase px-2 py-0.5 ${
                          project.status === 'completed'
                            ? 'bg-green-50 text-green-700'
                            : project.status === 'in-progress'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-stone-brown/10 text-stone-brown'
                        }`}>
                          {project.status.replace('-', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-16 pt-8 border-t border-stone-brown/10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Prev
            </button>
            <span className="text-stone-brown text-sm">
              {page} / {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="btn-ghost disabled:opacity-30"
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
