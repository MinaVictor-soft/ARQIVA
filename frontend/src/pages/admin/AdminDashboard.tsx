import React, { useState } from 'react';
import { Link, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// ─── Shared helpers ──────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 text-sm text-warm-white shadow-xl ${type === 'success' ? 'bg-stone-brown' : 'bg-luxury-burgundy'}`}>
      {msg}
    </div>
  );
}
function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  return { toast, show: (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type }), clear: () => setToast(null) };
}
function Confirm({ msg, onConfirm, onCancel }: { msg: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-primary-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-primary-black border border-warm-white/20 p-8 max-w-sm w-full">
        <p className="text-warm-white text-sm mb-6">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-luxury-burgundy text-warm-white py-2 text-xs tracking-widest uppercase hover:bg-luxury-burgundy/80 transition-colors">Confirm</button>
          <button onClick={onCancel} className="flex-1 border border-warm-white/20 text-warm-white/60 py-2 text-xs tracking-widest uppercase hover:border-warm-white/40 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}
function SkeletonRows({ n = 5 }: { n?: number }) {
  return <div className="space-y-1">{Array.from({ length: n }).map((_, i) => <div key={i} className="h-14 bg-warm-white/5 animate-pulse" />)}</div>;
}
function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="font-display text-3xl text-warm-white">{title}</h1>
      {action}
    </div>
  );
}
function Btn({ children, onClick, variant = 'primary', type = 'button', disabled }: any) {
  const s: any = { primary: 'bg-warm-white text-primary-black hover:bg-arch-beige', secondary: 'border border-warm-white/20 text-warm-white/60 hover:border-warm-white/50 hover:text-warm-white', danger: 'bg-luxury-burgundy/20 border border-luxury-burgundy/40 text-luxury-burgundy hover:bg-luxury-burgundy hover:text-warm-white' };
  return <button type={type} disabled={disabled} onClick={onClick} className={`px-5 py-2 text-xs tracking-widest uppercase transition-colors font-medium disabled:opacity-40 ${s[variant]}`}>{children}</button>;
}
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-warm-white/50 text-xs tracking-widest uppercase mb-2">
        {label}
        {hint === 'ar' && <span className="text-arch-beige/70 text-[10px] tracking-normal normal-case font-sans border border-arch-beige/30 px-1.5 py-0.5 rounded">AR</span>}
      </label>
      {children}
    </div>
  );
}
const inputCls = "w-full bg-warm-white/5 border border-warm-white/10 text-warm-white px-4 py-2.5 text-sm focus:outline-none focus:border-warm-white/30 placeholder-warm-white/20";
const textareaCls = `${inputCls} resize-y min-h-[100px]`;

// ─── Dashboard Home ──────────────────────────────────────────────────────────
function DashboardHome() {
  const { data } = useQuery({ queryKey: ['admin-stats'], queryFn: () => api.get('/admin/stats').then(r => r.data) });
  const s = data?.data;
  const cards = [
    { label: 'Total Projects', value: s?.totalProjects ?? '—', accent: 'text-arch-beige' },
    { label: 'Total Views', value: s?.totalViews ?? '—', accent: 'text-warm-white' },
    { label: 'Total Likes', value: s?.totalLikes ?? '—', accent: 'text-warm-white' },
    { label: 'Messages', value: s?.totalMessages ?? '—', accent: 'text-luxury-burgundy' },
    { label: 'Testimonials', value: s?.totalTestimonials ?? '—', accent: 'text-warm-white' },
    { label: 'Awards', value: s?.totalAwards ?? '—', accent: 'text-arch-beige' },
  ];
  return (
    <div>
      <h1 className="font-display text-4xl text-warm-white mb-10">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {cards.map(c => (
          <div key={c.label} className="border border-warm-white/10 p-6 hover:border-warm-white/20 transition-colors">
            <p className="text-warm-white/30 text-xs tracking-widest uppercase mb-3">{c.label}</p>
            <p className={`font-display text-4xl ${c.accent}`}>{c.value}</p>
          </div>
        ))}
      </div>
      {s?.recentProjects?.length > 0 && (
        <div className="mb-10">
          <h2 className="text-warm-white/40 text-xs tracking-widest uppercase mb-4">Recent Projects</h2>
          <div className="space-y-px">{s.recentProjects.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between border border-warm-white/5 px-4 py-3">
              <span className="text-warm-white text-sm">{p.title}</span>
              <span className="text-warm-white/30 text-xs">{p.views} views</span>
            </div>
          ))}</div>
        </div>
      )}
      {s?.topProjects?.length > 0 && (
        <div>
          <h2 className="text-warm-white/40 text-xs tracking-widest uppercase mb-4">Top by Views</h2>
          <div className="space-y-px">{s.topProjects.map((p: any, i: number) => (
            <div key={p.id} className="flex items-center gap-4 border border-warm-white/5 px-4 py-3">
              <span className="text-warm-white/20 text-xs w-5">0{i + 1}</span>
              <span className="text-warm-white text-sm flex-1">{p.title}</span>
              <span className="text-arch-beige text-sm">{p.views}</span>
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );
}

// ─── Projects ────────────────────────────────────────────────────────────────
function ProjectForm({ project, categories, onSave, onCancel }: any) {
  const [f, setF] = useState({
    title: project?.title || '', titleAr: project?.titleAr || '',
    slug: project?.slug || '', description: project?.description || '', descriptionAr: project?.descriptionAr || '',
    projectStory: project?.projectStory || '', designConcept: project?.designConcept || '',
    challenges: project?.challenges || '', solutions: project?.solutions || '',
    clientName: project?.clientName || '', clientCompany: project?.clientCompany || '',
    categoryId: project?.categoryId || '', country: project?.country || '', city: project?.city || '',
    location: project?.location || '', projectArea: project?.projectArea || '',
    status: project?.status || 'completed', budget: project?.budget || '', duration: project?.duration || '',
    year: project?.year || new Date().getFullYear(), featured: project?.featured || false, published: project?.published ?? true,
    coverImage: project?.coverImage || '',
  });
  const set = (k: string, v: any) => setF(prev => ({ ...prev, [k]: v }));
  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title *"><input className={inputCls} value={f.title} onChange={e => { set('title', e.target.value); if (!project) set('slug', autoSlug(e.target.value)); }} /></Field>
        <Field label="Slug *"><input className={inputCls} value={f.slug} onChange={e => set('slug', e.target.value)} /></Field>
      </div>
      <Field label="Title (Arabic) — اختياري" hint="ar"><input className={inputCls} dir="rtl" placeholder="العنوان بالعربية" value={f.titleAr} onChange={e => set('titleAr', e.target.value)} /></Field>
      {/* Cover Image */}
      <Field label="Cover Image URL">
        <div className="flex gap-3">
          <input className={`${inputCls} flex-1`} placeholder="https://..." value={f.coverImage} onChange={e => set('coverImage', e.target.value)} />
          {f.coverImage && (
            <button type="button" onClick={() => set('coverImage', '')} className="text-warm-white/30 hover:text-warm-white/70 text-xs px-2 border border-warm-white/10 hover:border-warm-white/30 transition-colors">Clear</button>
          )}
        </div>
        {f.coverImage && (
          <div className="mt-2 relative h-36 overflow-hidden border border-warm-white/10">
            <img src={f.coverImage} alt="Cover preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
            <div className="absolute inset-0 flex items-end p-2"><span className="text-[10px] text-warm-white/40 tracking-widest uppercase bg-primary-black/60 px-1.5 py-0.5">Preview</span></div>
          </div>
        )}
      </Field>
      <Field label="Short Description"><textarea className={textareaCls} value={f.description} onChange={e => set('description', e.target.value)} /></Field>
      <Field label="Description (Arabic) — اختياري" hint="ar"><textarea className={textareaCls} dir="rtl" placeholder="الوصف بالعربية" value={f.descriptionAr} onChange={e => set('descriptionAr', e.target.value)} /></Field>
      <Field label="Project Story"><textarea className={`${textareaCls}`} style={{ minHeight: 120 }} value={f.projectStory} onChange={e => set('projectStory', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Design Concept"><textarea className={textareaCls} value={f.designConcept} onChange={e => set('designConcept', e.target.value)} /></Field>
        <Field label="Challenges"><textarea className={textareaCls} value={f.challenges} onChange={e => set('challenges', e.target.value)} /></Field>
      </div>
      <Field label="Solutions"><textarea className={textareaCls} value={f.solutions} onChange={e => set('solutions', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Client Name"><input className={inputCls} value={f.clientName} onChange={e => set('clientName', e.target.value)} /></Field>
        <Field label="Client Company"><input className={inputCls} value={f.clientCompany} onChange={e => set('clientCompany', e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Category"><select className={inputCls} value={f.categoryId} onChange={e => set('categoryId', e.target.value)}><option value="">— None —</option>{categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="Year"><input type="number" className={inputCls} value={f.year} onChange={e => set('year', parseInt(e.target.value))} /></Field>
        <Field label="Status"><select className={inputCls} value={f.status} onChange={e => set('status', e.target.value)}>{['completed', 'in-progress', 'concept', 'paused'].map(s => <option key={s} value={s}>{s}</option>)}</select></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Country"><input className={inputCls} value={f.country} onChange={e => set('country', e.target.value)} /></Field>
        <Field label="City"><input className={inputCls} value={f.city} onChange={e => set('city', e.target.value)} /></Field>
        <Field label="Area (m²)"><input className={inputCls} value={f.projectArea} onChange={e => set('projectArea', e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Budget"><input className={inputCls} value={f.budget} onChange={e => set('budget', e.target.value)} /></Field>
        <Field label="Duration"><input className={inputCls} value={f.duration} onChange={e => set('duration', e.target.value)} /></Field>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={f.featured} onChange={e => set('featured', e.target.checked)} className="accent-arch-beige" /><span className="text-warm-white/60 text-sm">Featured</span></label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={f.published} onChange={e => set('published', e.target.checked)} className="accent-arch-beige" /><span className="text-warm-white/60 text-sm">Published</span></label>
      </div>
      <div className="flex gap-3 pt-4 border-t border-warm-white/10">
        <Btn onClick={() => onSave(f)}>Save Project</Btn>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  );
}
function ProjectsAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<any>(null);
  const [confirm, setConfirm] = useState<number | null>(null);
  const { data: pr, isLoading } = useQuery({ queryKey: ['admin-projects'], queryFn: () => api.get('/projects?limit=100').then(r => r.data) });
  const { data: cr } = useQuery({ queryKey: ['categories'], queryFn: () => api.get('/categories').then(r => r.data) });
  const projects = pr?.data || []; const categories = cr?.data || [];
  const createMut = useMutation({ mutationFn: (d: any) => api.post('/projects', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); show('Created'); setView('list'); setEditing(null); }, onError: () => show('Failed', 'error') });
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => api.put(`/projects/${id}`, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); show('Updated'); setView('list'); setEditing(null); }, onError: () => show('Failed', 'error') });
  const deleteMut = useMutation({ mutationFn: (id: number) => api.delete(`/projects/${id}`), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); show('Deleted'); }, onError: () => show('Failed', 'error') });
  if (view === 'form') return (
    <div>
      <SectionHeader title={editing ? 'Edit Project' : 'New Project'} />
      <ProjectForm project={editing} categories={categories} onSave={(d: any) => editing ? updateMut.mutate({ id: editing.id, data: d }) : createMut.mutate(d)} onCancel={() => { setView('list'); setEditing(null); }} />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
  return (
    <div>
      <SectionHeader title="Projects" action={<Btn onClick={() => { setEditing(null); setView('form'); }}>+ New Project</Btn>} />
      {isLoading ? <SkeletonRows /> : <div className="space-y-px">{projects.map((p: any) => (
        <div key={p.id} className="flex items-center justify-between border border-warm-white/5 px-4 py-3 hover:border-warm-white/15 group">
          <div><p className="text-warm-white text-sm">{p.title}</p><p className="text-warm-white/30 text-xs mt-0.5">{p.year} · {p.category?.name || 'Uncategorized'} · {p.city || '—'}</p></div>
          <div className="flex items-center gap-3">
            <span className={`text-xs uppercase tracking-widest ${p.published ? 'text-green-400/60' : 'text-warm-white/20'}`}>{p.published ? 'Live' : 'Draft'}</span>
            {p.featured && <span className="text-arch-beige text-xs uppercase tracking-widest">★</span>}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Btn variant="secondary" onClick={() => { setEditing(p); setView('form'); }}>Edit</Btn>
              <Btn variant="danger" onClick={() => setConfirm(p.id)}>Del</Btn>
            </div>
          </div>
        </div>
      ))}</div>}
      {confirm !== null && <Confirm msg="Delete this project? This cannot be undone." onConfirm={() => { deleteMut.mutate(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Gallery Manager ─────────────────────────────────────────────────────────
function GalleryAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [confirm, setConfirm] = useState<number | null>(null);

  const { data: pr } = useQuery({ queryKey: ['admin-projects'], queryFn: () => api.get('/projects?limit=100').then(r => r.data) });
  const projects = pr?.data || [];

  const { data: galleryData, isLoading: galleryLoading } = useQuery({
    queryKey: ['admin-gallery', selectedProject?.id],
    queryFn: () => api.get(`/projects/${selectedProject.id}/images`).then(r => r.data),
    enabled: !!selectedProject?.id,
  });
  const images: any[] = galleryData?.data || [];

  const addMut = useMutation({
    mutationFn: () => api.post(`/projects/${selectedProject.id}/images`, { imageUrl: newUrl, caption: newCaption, order: images.length }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-gallery', selectedProject.id] }); show('Image added'); setNewUrl(''); setNewCaption(''); },
    onError: () => show('Failed to add image', 'error'),
  });
  const deleteMut = useMutation({
    mutationFn: (imgId: number) => api.delete(`/projects/${selectedProject.id}/images/${imgId}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-gallery', selectedProject.id] }); show('Deleted'); },
    onError: () => show('Failed', 'error'),
  });
  const moveUp = async (img: any, idx: number) => {
    if (idx === 0) return;
    const prev = images[idx - 1];
    await api.patch(`/projects/${selectedProject.id}/images/${img.id}`, { order: prev.order });
    await api.patch(`/projects/${selectedProject.id}/images/${prev.id}`, { order: img.order });
    qc.invalidateQueries({ queryKey: ['admin-gallery', selectedProject.id] });
  };

  return (
    <div>
      <SectionHeader title="Gallery Manager" />
      {/* Project selector */}
      <div className="mb-8 max-w-sm">
        <Field label="Select Project">
          <select className={inputCls} value={selectedProject?.id || ''} onChange={e => setSelectedProject(projects.find((p: any) => p.id === parseInt(e.target.value)) || null)}>
            <option value="">— Choose a project —</option>
            {projects.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </Field>
      </div>

      {selectedProject && (
        <div>
          <p className="text-warm-white/40 text-xs tracking-widest uppercase mb-6 pb-2 border-b border-warm-white/10">
            {selectedProject.title} — {images.length} image{images.length !== 1 ? 's' : ''}
          </p>

          {/* Add new image */}
          <div className="mb-8 p-5 border border-warm-white/10 space-y-3 max-w-2xl">
            <p className="text-warm-white/30 text-xs tracking-widest uppercase">Add Image</p>
            <Field label="Image URL">
              <input className={inputCls} placeholder="https://images.unsplash.com/..." value={newUrl} onChange={e => setNewUrl(e.target.value)} />
            </Field>
            {newUrl && <div className="h-32 overflow-hidden border border-warm-white/10"><img src={newUrl} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} /></div>}
            <Field label="Caption (optional)">
              <input className={inputCls} placeholder="Optional caption..." value={newCaption} onChange={e => setNewCaption(e.target.value)} />
            </Field>
            <Btn onClick={() => { if (newUrl.trim()) addMut.mutate(); }} disabled={!newUrl.trim() || addMut.isPending}>
              {addMut.isPending ? 'Adding...' : '+ Add Image'}
            </Btn>
          </div>

          {/* Gallery grid */}
          {galleryLoading ? <SkeletonRows n={3} /> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.sort((a, b) => a.order - b.order).map((img: any, idx: number) => (
                <div key={img.id} className="group relative border border-warm-white/10 hover:border-warm-white/25 transition-colors">
                  <div className="aspect-[4/3] overflow-hidden bg-warm-white/5">
                    <img src={img.imageUrl} alt={img.caption || ''} className="w-full h-full object-cover" onError={e => { (e.currentTarget.parentElement as any).style.background = '#222'; e.currentTarget.style.display = 'none'; }} />
                  </div>
                  <div className="p-2">
                    <p className="text-warm-white/40 text-[10px] truncate">{img.caption || 'No caption'}</p>
                    <p className="text-warm-white/20 text-[10px]">#{idx + 1}</p>
                  </div>
                  <div className="absolute inset-0 bg-primary-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {idx > 0 && <button onClick={() => moveUp(img, idx)} className="text-warm-white/70 text-xs border border-warm-white/20 px-2 py-1 hover:border-warm-white/50 transition-colors">↑</button>}
                    <button onClick={() => setConfirm(img.id)} className="text-luxury-burgundy text-xs border border-luxury-burgundy/40 px-2 py-1 hover:bg-luxury-burgundy hover:text-warm-white transition-colors">Del</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {confirm !== null && <Confirm msg="Remove this image?" onConfirm={() => { deleteMut.mutate(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Categories ──────────────────────────────────────────────────────────────
function CategoriesAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', nameAr: '', slug: '', description: '', icon: '' });
  const [confirm, setConfirm] = useState<number | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: () => api.get('/categories').then(r => r.data) });
  const items = data?.data || [];
  const autoSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const saveMut = useMutation({ mutationFn: (d: any) => editing ? api.put(`/categories/${editing.id}`, d) : api.post('/categories', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); show(editing ? 'Updated' : 'Created'); setForm({ name: '', nameAr: '', slug: '', description: '', icon: '' }); setEditing(null); }, onError: () => show('Failed', 'error') });
  const deleteMut = useMutation({ mutationFn: (id: number) => api.delete(`/categories/${id}`), onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); show('Deleted'); }, onError: () => show('Failed', 'error') });
  return (
    <div>
      <SectionHeader title="Categories" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Field label="Name *"><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editing ? f.slug : autoSlug(e.target.value) }))} /></Field>
          <Field label="Name (Arabic) — اختياري" hint="ar"><input className={inputCls} dir="rtl" placeholder="الاسم بالعربية" value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} /></Field>
          <Field label="Slug *"><input className={inputCls} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} /></Field>
          <Field label="Description"><input className={inputCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
          <Field label="Icon"><input className={inputCls} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} /></Field>
          <div className="flex gap-3">
            <Btn onClick={() => saveMut.mutate(form)}>{editing ? 'Update' : 'Create'}</Btn>
            {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm({ name: '', nameAr: '', slug: '', description: '', icon: '' }); }}>Cancel</Btn>}
          </div>
        </div>
        <div>
          {isLoading ? <SkeletonRows n={3} /> : <div className="space-y-px">{items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between border border-warm-white/5 px-4 py-3 hover:border-warm-white/15 group">
              <div><p className="text-warm-white text-sm">{item.name}</p><p className="text-warm-white/30 text-xs">{item._count?.projects || 0} projects</p></div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Btn variant="secondary" onClick={() => { setEditing(item); setForm({ name: item.name, nameAr: item.nameAr || '', slug: item.slug, description: item.description || '', icon: item.icon || '' }); }}>Edit</Btn>
                <Btn variant="danger" onClick={() => setConfirm(item.id)}>Del</Btn>
              </div>
            </div>
          ))}</div>}
        </div>
      </div>
      {confirm !== null && <Confirm msg="Delete category?" onConfirm={() => { deleteMut.mutate(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────
function ServicesAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', nameAr: '', slug: '', description: '', descriptionAr: '', benefits: '', process: '', icon: '' });
  const [confirm, setConfirm] = useState<number | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['services-admin'], queryFn: () => api.get('/services').then(r => r.data) });
  const items = data?.data || [];
  const autoSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const saveMut = useMutation({ mutationFn: (d: any) => editing ? api.put(`/services/${editing.id}`, d) : api.post('/services', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['services-admin'] }); show(editing ? 'Updated' : 'Created'); setForm({ name: '', nameAr: '', slug: '', description: '', descriptionAr: '', benefits: '', process: '', icon: '' }); setEditing(null); }, onError: () => show('Failed', 'error') });
  const deleteMut = useMutation({ mutationFn: (id: number) => api.delete(`/services/${id}`), onSuccess: () => { qc.invalidateQueries({ queryKey: ['services-admin'] }); show('Deleted'); }, onError: () => show('Failed', 'error') });
  return (
    <div>
      <SectionHeader title="Services" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Field label="Name *"><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editing ? f.slug : autoSlug(e.target.value) }))} /></Field>
          <Field label="Name (Arabic) — اختياري" hint="ar"><input className={inputCls} dir="rtl" placeholder="الاسم بالعربية" value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} /></Field>
          <Field label="Slug"><input className={inputCls} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} /></Field>
          <Field label="Description"><textarea className={textareaCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
          <Field label="Description (Arabic) — اختياري" hint="ar"><textarea className={textareaCls} dir="rtl" placeholder="الوصف بالعربية" value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} /></Field>
          <Field label="Benefits"><textarea className={textareaCls} value={form.benefits} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))} /></Field>
          <Field label="Process"><textarea className={textareaCls} value={form.process} onChange={e => setForm(f => ({ ...f, process: e.target.value }))} /></Field>
          <Field label="Icon"><input className={inputCls} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} /></Field>
          <div className="flex gap-3">
            <Btn onClick={() => saveMut.mutate(form)}>{editing ? 'Update' : 'Create'}</Btn>
            {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm({ name: '', nameAr: '', slug: '', description: '', descriptionAr: '', benefits: '', process: '', icon: '' }); }}>Cancel</Btn>}
          </div>
        </div>
        <div>{isLoading ? <SkeletonRows /> : <div className="space-y-px">{items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between border border-warm-white/5 px-4 py-3 hover:border-warm-white/15 group">
            <p className="text-warm-white text-sm">{item.name}</p>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Btn variant="secondary" onClick={() => { setEditing(item); setForm({ name: item.name, nameAr: item.nameAr || '', slug: item.slug, description: item.description || '', descriptionAr: item.descriptionAr || '', benefits: item.benefits || '', process: item.process || '', icon: item.icon || '' }); }}>Edit</Btn>
              <Btn variant="danger" onClick={() => setConfirm(item.id)}>Del</Btn>
            </div>
          </div>
        ))}</div>}</div>
      </div>
      {confirm !== null && <Confirm msg="Delete service?" onConfirm={() => { deleteMut.mutate(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Awards ──────────────────────────────────────────────────────────────────
function AwardsAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', issuer: '', year: new Date().getFullYear(), category: '', featured: false });
  const [confirm, setConfirm] = useState<number | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['awards-admin'], queryFn: () => api.get('/awards?limit=100').then(r => r.data) });
  const items = data?.data || [];
  const saveMut = useMutation({ mutationFn: (d: any) => editing ? api.put(`/awards/${editing.id}`, d) : api.post('/awards', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['awards-admin'] }); show(editing ? 'Updated' : 'Created'); setForm({ title: '', description: '', issuer: '', year: new Date().getFullYear(), category: '', featured: false }); setEditing(null); }, onError: () => show('Failed', 'error') });
  const deleteMut = useMutation({ mutationFn: (id: number) => api.delete(`/awards/${id}`), onSuccess: () => { qc.invalidateQueries({ queryKey: ['awards-admin'] }); show('Deleted'); }, onError: () => show('Failed', 'error') });
  return (
    <div>
      <SectionHeader title="Awards" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Field label="Title *"><input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></Field>
          <Field label="Issuer"><input className={inputCls} value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category"><input className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></Field>
            <Field label="Year"><input type="number" className={inputCls} value={form.year} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) }))} /></Field>
          </div>
          <Field label="Description"><textarea className={textareaCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-arch-beige" /><span className="text-warm-white/60 text-sm">Featured</span></label>
          <div className="flex gap-3">
            <Btn onClick={() => saveMut.mutate(form)}>{editing ? 'Update' : 'Create'}</Btn>
            {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm({ title: '', description: '', issuer: '', year: new Date().getFullYear(), category: '', featured: false }); }}>Cancel</Btn>}
          </div>
        </div>
        <div>{isLoading ? <SkeletonRows /> : <div className="space-y-px">{items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between border border-warm-white/5 px-4 py-3 hover:border-warm-white/15 group">
            <div><p className="text-warm-white text-sm">{item.title}</p><p className="text-warm-white/30 text-xs">{item.year} · {item.issuer}</p></div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Btn variant="secondary" onClick={() => { setEditing(item); setForm({ title: item.title, description: item.description || '', issuer: item.issuer || '', year: item.year, category: item.category || '', featured: item.featured }); }}>Edit</Btn>
              <Btn variant="danger" onClick={() => setConfirm(item.id)}>Del</Btn>
            </div>
          </div>
        ))}</div>}</div>
      </div>
      {confirm !== null && <Confirm msg="Delete award?" onConfirm={() => { deleteMut.mutate(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
function TestimonialsAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ clientName: '', clientPosition: '', companyName: '', rating: 5, testimonial: '', featured: false });
  const [confirm, setConfirm] = useState<number | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['testimonials-admin'], queryFn: () => api.get('/testimonials?limit=100').then(r => r.data) });
  const items = data?.data || [];
  const saveMut = useMutation({ mutationFn: (d: any) => editing ? api.put(`/testimonials/${editing.id}`, d) : api.post('/testimonials', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['testimonials-admin'] }); show(editing ? 'Updated' : 'Created'); setForm({ clientName: '', clientPosition: '', companyName: '', rating: 5, testimonial: '', featured: false }); setEditing(null); }, onError: () => show('Failed', 'error') });
  const deleteMut = useMutation({ mutationFn: (id: number) => api.delete(`/testimonials/${id}`), onSuccess: () => { qc.invalidateQueries({ queryKey: ['testimonials-admin'] }); show('Deleted'); }, onError: () => show('Failed', 'error') });
  return (
    <div>
      <SectionHeader title="Testimonials" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Field label="Client Name *"><input className={inputCls} value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Position"><input className={inputCls} value={form.clientPosition} onChange={e => setForm(f => ({ ...f, clientPosition: e.target.value }))} /></Field>
            <Field label="Company"><input className={inputCls} value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} /></Field>
          </div>
          <Field label="Rating (1-5)"><input type="number" min={1} max={5} className={inputCls} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) }))} /></Field>
          <Field label="Testimonial *"><textarea className={textareaCls} style={{ minHeight: 120 }} value={form.testimonial} onChange={e => setForm(f => ({ ...f, testimonial: e.target.value }))} /></Field>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-arch-beige" /><span className="text-warm-white/60 text-sm">Featured on homepage</span></label>
          <div className="flex gap-3">
            <Btn onClick={() => saveMut.mutate(form)}>{editing ? 'Update' : 'Create'}</Btn>
            {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm({ clientName: '', clientPosition: '', companyName: '', rating: 5, testimonial: '', featured: false }); }}>Cancel</Btn>}
          </div>
        </div>
        <div>{isLoading ? <SkeletonRows /> : <div className="space-y-px">{items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between border border-warm-white/5 px-4 py-3 hover:border-warm-white/15 group">
            <div><p className="text-warm-white text-sm">{item.clientName}</p><p className="text-warm-white/30 text-xs">{item.companyName} · {'★'.repeat(item.rating)}</p></div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Btn variant="secondary" onClick={() => { setEditing(item); setForm({ clientName: item.clientName, clientPosition: item.clientPosition || '', companyName: item.companyName || '', rating: item.rating, testimonial: item.testimonial, featured: item.featured }); }}>Edit</Btn>
              <Btn variant="danger" onClick={() => setConfirm(item.id)}>Del</Btn>
            </div>
          </div>
        ))}</div>}</div>
      </div>
      {confirm !== null && <Confirm msg="Delete testimonial?" onConfirm={() => { deleteMut.mutate(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Messages ────────────────────────────────────────────────────────────────
function MessagesAdmin() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<any>(null);
  const { data, isLoading } = useQuery({ queryKey: ['admin-messages'], queryFn: () => api.get('/messages?limit=100').then(r => r.data) });
  const messages = data?.data || [];
  const markReadMut = useMutation({ mutationFn: (id: number) => api.put(`/messages/${id}`, { read: true }), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-messages'] }) });
  const openMessage = (m: any) => { setSelected(m); if (!m.read) markReadMut.mutate(m.id); };
  return (
    <div>
      <SectionHeader title="Messages" />
      <div className={`grid gap-6 ${selected ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <div>
          {isLoading ? <SkeletonRows /> : messages.length === 0 ? <p className="text-warm-white/30 text-sm">No messages yet</p> : (
            <div className="space-y-px">{messages.map((m: any) => (
              <div key={m.id} onClick={() => openMessage(m)} className={`cursor-pointer border px-4 py-4 transition-colors ${selected?.id === m.id ? 'border-arch-beige/30 bg-arch-beige/5' : m.read ? 'border-warm-white/5 hover:border-warm-white/15' : 'border-arch-beige/20 bg-arch-beige/5 hover:border-arch-beige/40'}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-warm-white text-sm font-medium">{m.name}{!m.read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-arch-beige align-middle" />}</p>
                  <p className="text-warm-white/30 text-xs">{new Date(m.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-warm-white/50 text-sm">{m.subject}</p>
                <p className="text-warm-white/30 text-xs mt-1 truncate">{m.message}</p>
              </div>
            ))}</div>
          )}
        </div>
        {selected && (
          <div className="border border-warm-white/10 p-6 h-fit">
            <div className="flex items-start justify-between mb-6">
              <div><p className="text-warm-white font-medium">{selected.name}</p><a href={`mailto:${selected.email}`} className="text-arch-beige text-sm hover:underline">{selected.email}</a>{selected.phone && <p className="text-warm-white/40 text-xs mt-1">{selected.phone}</p>}</div>
              <button onClick={() => setSelected(null)} className="text-warm-white/30 hover:text-warm-white text-2xl leading-none">×</button>
            </div>
            <p className="text-warm-white/50 text-xs tracking-widest uppercase mb-2">{selected.subject}</p>
            <p className="text-warm-white/80 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            <div className="mt-6 pt-4 border-t border-warm-white/10 flex gap-3 flex-wrap">
              <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`} className="text-xs tracking-widest uppercase border border-warm-white/20 px-4 py-2 text-warm-white/60 hover:text-warm-white hover:border-warm-white/40 transition-colors">Reply via Email</a>
              {selected.phone && <a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs tracking-widest uppercase border border-warm-white/20 px-4 py-2 text-warm-white/60 hover:text-warm-white hover:border-warm-white/40 transition-colors">WhatsApp</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skills ──────────────────────────────────────────────────────────────────
function SkillsAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', category: 'software', proficiency: 'advanced' });
  const [confirm, setConfirm] = useState<number | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['skills-admin'], queryFn: () => api.get('/skills').then(r => r.data) });
  const items = data?.data || [];
  const grouped: Record<string, any[]> = items.reduce((acc: any, s: any) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {});
  const saveMut = useMutation({ mutationFn: (d: any) => editing ? api.put(`/skills/${editing.id}`, d) : api.post('/skills', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['skills-admin'] }); show(editing ? 'Updated' : 'Created'); setForm({ name: '', category: 'software', proficiency: 'advanced' }); setEditing(null); }, onError: () => show('Failed', 'error') });
  const deleteMut = useMutation({ mutationFn: (id: number) => api.delete(`/skills/${id}`), onSuccess: () => { qc.invalidateQueries({ queryKey: ['skills-admin'] }); show('Deleted'); }, onError: () => show('Failed', 'error') });
  return (
    <div>
      <SectionHeader title="Skills" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Field label="Name *"><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="Category"><select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>{['software', 'design', 'technical', 'soft', 'language'].map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
          <Field label="Proficiency"><select className={inputCls} value={form.proficiency} onChange={e => setForm(f => ({ ...f, proficiency: e.target.value }))}>{['beginner', 'intermediate', 'advanced', 'expert'].map(p => <option key={p} value={p}>{p}</option>)}</select></Field>
          <div className="flex gap-3">
            <Btn onClick={() => saveMut.mutate(form)}>{editing ? 'Update' : 'Add Skill'}</Btn>
            {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm({ name: '', category: 'software', proficiency: 'advanced' }); }}>Cancel</Btn>}
          </div>
        </div>
        <div>
          {isLoading ? <SkeletonRows n={6} /> : Object.entries(grouped).map(([cat, skills]) => (
            <div key={cat} className="mb-5">
              <p className="text-warm-white/30 text-xs tracking-widest uppercase mb-2 capitalize">{cat}</p>
              <div className="space-y-px">{skills.map((skill: any) => (
                <div key={skill.id} className="flex items-center justify-between border border-warm-white/5 px-4 py-2 hover:border-warm-white/15 group">
                  <div><span className="text-warm-white text-sm">{skill.name}</span><span className="text-warm-white/30 text-xs ml-3 capitalize">{skill.proficiency}</span></div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Btn variant="secondary" onClick={() => { setEditing(skill); setForm({ name: skill.name, category: skill.category, proficiency: skill.proficiency }); }}>Edit</Btn>
                    <Btn variant="danger" onClick={() => setConfirm(skill.id)}>Del</Btn>
                  </div>
                </div>
              ))}</div>
            </div>
          ))}
        </div>
      </div>
      {confirm !== null && <Confirm msg="Delete skill?" onConfirm={() => { deleteMut.mutate(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Education ───────────────────────────────────────────────────────────────
function EducationAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ degree: '', field: '', institution: '', startYear: '', endYear: '', description: '' });
  const [confirm, setConfirm] = useState<number | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['education-admin'], queryFn: () => api.get('/education').then(r => r.data) });
  const items = data?.data || [];
  const saveMut = useMutation({ mutationFn: (d: any) => editing ? api.put(`/education/${editing.id}`, d) : api.post('/education', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['education-admin'] }); show(editing ? 'Updated' : 'Created'); setForm({ degree: '', field: '', institution: '', startYear: '', endYear: '', description: '' }); setEditing(null); }, onError: () => show('Failed', 'error') });
  const deleteMut = useMutation({ mutationFn: (id: number) => api.delete(`/education/${id}`), onSuccess: () => { qc.invalidateQueries({ queryKey: ['education-admin'] }); show('Deleted'); }, onError: () => show('Failed', 'error') });
  return (
    <div>
      <SectionHeader title="Education" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Field label="Degree *"><input className={inputCls} value={form.degree} onChange={e => setForm(f => ({ ...f, degree: e.target.value }))} /></Field>
          <Field label="Field of Study *"><input className={inputCls} value={form.field} onChange={e => setForm(f => ({ ...f, field: e.target.value }))} /></Field>
          <Field label="Institution *"><input className={inputCls} value={form.institution} onChange={e => setForm(f => ({ ...f, institution: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Year *"><input type="number" className={inputCls} value={form.startYear} onChange={e => setForm(f => ({ ...f, startYear: e.target.value }))} /></Field>
            <Field label="End Year"><input type="number" className={inputCls} value={form.endYear} onChange={e => setForm(f => ({ ...f, endYear: e.target.value }))} /></Field>
          </div>
          <Field label="Description"><textarea className={textareaCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
          <div className="flex gap-3">
            <Btn onClick={() => saveMut.mutate(form)}>{editing ? 'Update' : 'Create'}</Btn>
            {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm({ degree: '', field: '', institution: '', startYear: '', endYear: '', description: '' }); }}>Cancel</Btn>}
          </div>
        </div>
        <div>{isLoading ? <SkeletonRows n={3} /> : <div className="space-y-px">{items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between border border-warm-white/5 px-4 py-3 hover:border-warm-white/15 group">
            <div><p className="text-warm-white text-sm">{item.degree} in {item.field}</p><p className="text-warm-white/30 text-xs">{item.institution} · {item.startYear}–{item.endYear || 'Present'}</p></div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Btn variant="secondary" onClick={() => { setEditing(item); setForm({ degree: item.degree, field: item.field, institution: item.institution, startYear: String(item.startYear), endYear: item.endYear ? String(item.endYear) : '', description: item.description || '' }); }}>Edit</Btn>
              <Btn variant="danger" onClick={() => setConfirm(item.id)}>Del</Btn>
            </div>
          </div>
        ))}</div>}</div>
      </div>
      {confirm !== null && <Confirm msg="Delete education?" onConfirm={() => { deleteMut.mutate(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Experience ──────────────────────────────────────────────────────────────
function ExperienceAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ position: '', company: '', startDate: '', endDate: '', isCurrentRole: false, description: '', achievements: '' });
  const [confirm, setConfirm] = useState<number | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['experience-admin'], queryFn: () => api.get('/experience').then(r => r.data) });
  const items = data?.data || [];
  const saveMut = useMutation({ mutationFn: (d: any) => editing ? api.put(`/experience/${editing.id}`, d) : api.post('/experience', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['experience-admin'] }); show(editing ? 'Updated' : 'Created'); setForm({ position: '', company: '', startDate: '', endDate: '', isCurrentRole: false, description: '', achievements: '' }); setEditing(null); }, onError: () => show('Failed', 'error') });
  const deleteMut = useMutation({ mutationFn: (id: number) => api.delete(`/experience/${id}`), onSuccess: () => { qc.invalidateQueries({ queryKey: ['experience-admin'] }); show('Deleted'); }, onError: () => show('Failed', 'error') });
  return (
    <div>
      <SectionHeader title="Experience" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Field label="Position *"><input className={inputCls} value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} /></Field>
          <Field label="Company *"><input className={inputCls} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date *"><input type="date" className={inputCls} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></Field>
            <Field label="End Date"><input type="date" className={inputCls} value={form.endDate} disabled={form.isCurrentRole} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isCurrentRole} onChange={e => setForm(f => ({ ...f, isCurrentRole: e.target.checked, endDate: e.target.checked ? '' : f.endDate }))} className="accent-arch-beige" /><span className="text-warm-white/60 text-sm">Current Role</span></label>
          <Field label="Description"><textarea className={textareaCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
          <Field label="Key Achievements"><textarea className={textareaCls} value={form.achievements} onChange={e => setForm(f => ({ ...f, achievements: e.target.value }))} /></Field>
          <div className="flex gap-3">
            <Btn onClick={() => saveMut.mutate(form)}>{editing ? 'Update' : 'Create'}</Btn>
            {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm({ position: '', company: '', startDate: '', endDate: '', isCurrentRole: false, description: '', achievements: '' }); }}>Cancel</Btn>}
          </div>
        </div>
        <div>{isLoading ? <SkeletonRows n={3} /> : <div className="space-y-px">{items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between border border-warm-white/5 px-4 py-3 hover:border-warm-white/15 group">
            <div><p className="text-warm-white text-sm">{item.position}</p><p className="text-warm-white/30 text-xs">{item.company} · {new Date(item.startDate).getFullYear()}–{item.isCurrentRole ? 'Present' : item.endDate ? new Date(item.endDate).getFullYear() : '—'}</p></div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Btn variant="secondary" onClick={() => { setEditing(item); setForm({ position: item.position, company: item.company, startDate: item.startDate?.slice(0, 10) || '', endDate: item.endDate?.slice(0, 10) || '', isCurrentRole: item.isCurrentRole, description: item.description || '', achievements: item.achievements || '' }); }}>Edit</Btn>
              <Btn variant="danger" onClick={() => setConfirm(item.id)}>Del</Btn>
            </div>
          </div>
        ))}</div>}</div>
      </div>
      {confirm !== null && <Confirm msg="Delete experience?" onConfirm={() => { deleteMut.mutate(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Packages ────────────────────────────────────────────────────────────────
function PackagesAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [confirm, setConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', titleAr: '', description: '', descriptionAr: '', price: '', currency: 'USD', duration: '', features: '', includedServices: '', featured: false, published: true, order: 0 });

  const { data, isLoading } = useQuery({ queryKey: ['packages-admin'], queryFn: () => api.get('/packages/all').then(r => r.data) });
  const items = data?.data || [];

  const toForm = (pkg: any) => ({
    title: pkg.title || '', titleAr: pkg.titleAr || '',
    description: pkg.description || '', descriptionAr: pkg.descriptionAr || '',
    price: pkg.price != null ? String(pkg.price) : '',
    currency: pkg.currency || 'USD', duration: pkg.duration || '',
    features: Array.isArray(pkg.features) ? pkg.features.join('\n') : '',
    includedServices: Array.isArray(pkg.includedServices) ? pkg.includedServices.join('\n') : '',
    featured: pkg.featured || false, published: pkg.published ?? true, order: pkg.order || 0,
  });

  const toPayload = (f: typeof form) => ({
    ...f,
    price: f.price ? parseFloat(f.price) : null,
    order: Number(f.order),
    features: f.features.split('\n').map(s => s.trim()).filter(Boolean),
    includedServices: f.includedServices.split('\n').map(s => s.trim()).filter(Boolean),
  });

  const saveMut = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/packages/${editing.id}`, d) : api.post('/packages', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['packages-admin'] }); qc.invalidateQueries({ queryKey: ['packages'] }); show(editing ? 'Updated' : 'Created'); setView('list'); setEditing(null); },
    onError: () => show('Failed', 'error'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/packages/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['packages-admin'] }); qc.invalidateQueries({ queryKey: ['packages'] }); show('Deleted'); },
    onError: () => show('Failed', 'error'),
  });

  const resetForm = () => setForm({ title: '', titleAr: '', description: '', descriptionAr: '', price: '', currency: 'USD', duration: '', features: '', includedServices: '', featured: false, published: true, order: 0 });

  if (view === 'form') return (
    <div>
      <SectionHeader title={editing ? 'Edit Package' : 'New Package'} />
      <div className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title *"><input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></Field>
          <Field label="Currency"><input className={inputCls} value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} placeholder="USD" /></Field>
        </div>
        <Field label="Title (Arabic) — اختياري" hint="ar"><input className={inputCls} dir="rtl" placeholder="العنوان بالعربية" value={form.titleAr} onChange={e => setForm(f => ({ ...f, titleAr: e.target.value }))} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (leave empty for custom)"><input type="number" className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="15000" /></Field>
          <Field label="Duration"><input className={inputCls} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="8–12 weeks" /></Field>
        </div>
        <Field label="Description"><textarea className={textareaCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
        <Field label="Description (Arabic) — اختياري" hint="ar"><textarea className={textareaCls} dir="rtl" placeholder="الوصف بالعربية" value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} /></Field>
        <Field label="Features (one per line)"><textarea className={`${textareaCls}`} style={{ minHeight: 120 }} value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" /></Field>
        <Field label="Included Services (one per line)"><textarea className={textareaCls} value={form.includedServices} onChange={e => setForm(f => ({ ...f, includedServices: e.target.value }))} placeholder="Architecture&#10;Interior Design" /></Field>
        <Field label="Display Order"><input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} /></Field>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-arch-beige" /><span className="text-warm-white/60 text-sm">Featured / Most Popular</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="accent-arch-beige" /><span className="text-warm-white/60 text-sm">Published</span></label>
        </div>
        <div className="flex gap-3 pt-4 border-t border-warm-white/10">
          <Btn onClick={() => saveMut.mutate(toPayload(form))} disabled={saveMut.isPending}>{saveMut.isPending ? 'Saving…' : 'Save Package'}</Btn>
          <Btn variant="secondary" onClick={() => { setView('list'); setEditing(null); resetForm(); }}>Cancel</Btn>
        </div>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );

  return (
    <div>
      <SectionHeader title="Packages" action={<Btn onClick={() => { resetForm(); setEditing(null); setView('form'); }}>+ New Package</Btn>} />
      {isLoading ? <SkeletonRows n={3} /> : items.length === 0 ? <p className="text-warm-white/30 text-sm">No packages yet.</p> : (
        <div className="space-y-px">
          {items.map((pkg: any) => (
            <div key={pkg.id} className="flex items-center justify-between border border-warm-white/5 px-4 py-4 hover:border-warm-white/15 group">
              <div>
                <p className="text-warm-white text-sm flex items-center gap-2">
                  {pkg.title}
                  {pkg.featured && <span className="text-arch-beige text-xs">★ Featured</span>}
                </p>
                <p className="text-warm-white/30 text-xs mt-0.5">
                  {pkg.price != null ? `${Number(pkg.price).toLocaleString()} ${pkg.currency}` : 'Custom'} · {pkg.duration || '—'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs uppercase tracking-widest ${pkg.published ? 'text-green-400/60' : 'text-warm-white/20'}`}>{pkg.published ? 'Live' : 'Draft'}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Btn variant="secondary" onClick={() => { setEditing(pkg); setForm(toForm(pkg)); setView('form'); }}>Edit</Btn>
                  <Btn variant="danger" onClick={() => setConfirm(pkg.id)}>Del</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {confirm !== null && <Confirm msg="Delete this package?" onConfirm={() => { deleteMut.mutate(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Feedback ────────────────────────────────────────────────────────────────
function FeedbackAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [confirm, setConfirm] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['feedback-admin', statusFilter],
    queryFn: () => api.get(`/feedback${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`).then(r => r.data),
  });
  const items = data?.data || [];

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.put(`/feedback/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['feedback-admin'] }); show('Status updated'); },
    onError: () => show('Failed', 'error'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/feedback/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['feedback-admin'] }); show('Deleted'); },
    onError: () => show('Failed', 'error'),
  });

  const statusColor: Record<string, string> = {
    pending: 'text-yellow-400/70', approved: 'text-green-400/70', rejected: 'text-red-400/50',
  };

  return (
    <div>
      <SectionHeader title="Project Feedback" />
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 text-xs tracking-widest uppercase transition-colors border ${statusFilter === s ? 'border-arch-beige text-arch-beige' : 'border-warm-white/10 text-warm-white/30 hover:text-warm-white hover:border-warm-white/30'}`}>
            {s}
          </button>
        ))}
      </div>
      {isLoading ? <SkeletonRows n={5} /> : items.length === 0 ? <p className="text-warm-white/30 text-sm">No feedback found.</p> : (
        <div className="space-y-px">
          {items.map((fb: any) => (
            <div key={fb.id} className="border border-warm-white/5 px-4 py-4 hover:border-warm-white/10 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="text-warm-white text-sm font-medium">{fb.name}</p>
                    <span className={`text-xs uppercase tracking-widest ${statusColor[fb.status] || ''}`}>{fb.status}</span>
                    <span className="text-warm-white/30 text-xs">{'★'.repeat(fb.rating)}</span>
                  </div>
                  {fb.project && <p className="text-arch-beige text-xs mb-1">On: {fb.project.title}</p>}
                  <p className="text-warm-white/60 text-sm leading-relaxed truncate">{fb.comment}</p>
                  <p className="text-warm-white/20 text-xs mt-1">{fb.email} · {new Date(fb.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {fb.status !== 'approved' && <Btn variant="secondary" onClick={() => statusMut.mutate({ id: fb.id, status: 'approved' })}>Approve</Btn>}
                  {fb.status !== 'rejected' && <Btn variant="secondary" onClick={() => statusMut.mutate({ id: fb.id, status: 'rejected' })}>Reject</Btn>}
                  <Btn variant="danger" onClick={() => setConfirm(fb.id)}>Delete</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {confirm !== null && <Confirm msg="Delete this feedback?" onConfirm={() => { deleteMut.mutate(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────
function SettingsAdmin() {
  const qc = useQueryClient();
  const { toast, show, clear } = useToast();
  const { data } = useQuery({ queryKey: ['settings'], queryFn: () => api.get('/settings').then(r => r.data) });
  const [form, setForm] = useState<any>(null);
  React.useEffect(() => { if (data?.data && !form) setForm(data.data); }, [data]);
  const saveMut = useMutation({ mutationFn: (d: any) => api.put('/settings', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['settings'] }); show('Settings saved'); }, onError: () => show('Failed', 'error') });
  if (!form) return <SkeletonRows n={8} />;
  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));
  const sections = [
    {
      title: 'Hero Content',
      fields: [
        { key: 'heroLabel', label: 'Hero Label (small text above title)' },
        { key: 'heroTitle', label: 'Hero Title Line 1 (EN)' },
        { key: 'heroTitleAr', label: 'Hero Title Line 1 (AR)', hint: 'ar' },
        { key: 'heroAccent', label: 'Hero Title Line 2 — Accent (EN)' },
        { key: 'heroAccentAr', label: 'Hero Title Line 2 — Accent (AR)', hint: 'ar' },
        { key: 'heroSubtitle', label: 'Hero Subtitle Paragraph (EN)', multi: true },
        { key: 'heroSubtitleAr', label: 'Hero Subtitle Paragraph (AR)', multi: true, hint: 'ar' },
        { key: 'heroImage', label: 'Hero Background Image URL' },
        { key: 'heroCta1Text', label: 'CTA Button 1 Text' },
        { key: 'heroCta1Url', label: 'CTA Button 1 URL' },
        { key: 'heroCta2Text', label: 'CTA Button 2 Text' },
        { key: 'heroCta2Url', label: 'CTA Button 2 URL' },
      ]
    },
    {
      title: 'Stats Bar',
      fields: [
        { key: 'statProjects', label: 'Stat: Projects Count', type: 'number' },
        { key: 'statCountries', label: 'Stat: Countries Count', type: 'number' },
        { key: 'statValue', label: 'Stat: Portfolio Value (e.g. 2.4B+)' },
      ]
    },
    { title: 'Company', fields: [
        { key: 'companyName', label: 'Company Name' },
        { key: 'tagline', label: 'Tagline' },
        { key: 'description', label: 'Description (EN)', multi: true },
        { key: 'descriptionAr', label: 'Description (AR)', multi: true, hint: 'ar' },
        { key: 'mission', label: 'Mission (EN)', multi: true },
        { key: 'missionAr', label: 'Mission (AR)', multi: true, hint: 'ar' },
        { key: 'vision', label: 'Vision (EN)', multi: true },
        { key: 'visionAr', label: 'Vision (AR)', multi: true, hint: 'ar' },
        { key: 'values', label: 'Values' },
        { key: 'valuesAr', label: 'Values (AR)', hint: 'ar' },
        { key: 'designPhilosophy', label: 'Design Philosophy Quote (EN)', multi: true },
        { key: 'designPhilosophyAr', label: 'Design Philosophy Quote (AR)', multi: true, hint: 'ar' },
    ]},
    { title: 'Contact', fields: [
        { key: 'phone', label: 'Phone' },
        { key: 'whatsapp', label: 'WhatsApp' },
        { key: 'email', label: 'Email' },
        { key: 'address', label: 'Address (EN)' },
        { key: 'addressAr', label: 'Address (AR)', hint: 'ar' },
        { key: 'location', label: 'Location' },
        { key: 'workingHours', label: 'Working Hours' },
        { key: 'googleMapUrl', label: 'Google Map URL' },
    ]},
    { title: 'Social Media', fields: [
        { key: 'instagram', label: 'Instagram URL' },
        { key: 'linkedIn', label: 'LinkedIn URL' },
        { key: 'facebook', label: 'Facebook URL' },
        { key: 'twitter', label: 'Twitter / X URL' },
        { key: 'tiktok', label: 'TikTok URL' },
        { key: 'behance', label: 'Behance URL' },
        { key: 'pinterest', label: 'Pinterest URL' },
        { key: 'youtube', label: 'YouTube URL' },
    ]},
    { title: 'SEO', fields: [
        { key: 'seoTitle', label: 'SEO Title' },
        { key: 'seoDescription', label: 'SEO Description', multi: true },
        { key: 'seoKeywords', label: 'SEO Keywords (comma-separated)' },
        { key: 'ogImage', label: 'OG Image URL (for social sharing)' },
    ]},
    { title: 'Footer', fields: [
        { key: 'footerText', label: 'Footer Tagline (EN)' },
        { key: 'footerTextAr', label: 'Footer Tagline (AR)', hint: 'ar' },
        { key: 'copyrightText', label: 'Copyright Text' },
    ]},
    { title: 'Assets', fields: [
        { key: 'logo', label: 'Logo URL (light bg)' },
        { key: 'darkLogo', label: 'Logo URL (dark bg)' },
        { key: 'favicon', label: 'Favicon URL' },
        { key: 'profileImage', label: 'Profile / About Image URL' },
        { key: 'resumePdf', label: 'Resume PDF URL' },
    ]},
  ];
  return (
    <div>
      <SectionHeader title="Settings" action={<Btn onClick={() => saveMut.mutate(form)}>Save All Changes</Btn>} />
      <div className="space-y-10 max-w-2xl">
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-warm-white/30 text-xs tracking-widest uppercase mb-4 pb-2 border-b border-warm-white/10">{section.title}</p>
            <div className="space-y-4">
              {section.fields.map(({ key, label, multi, hint, type }: any) => (
                <Field key={key} label={label} hint={hint}>
                  {multi
                    ? <textarea className={`${textareaCls} ${hint === 'ar' ? 'text-right' : ''}`} dir={hint === 'ar' ? 'rtl' : undefined} value={form[key] || ''} onChange={e => set(key, e.target.value)} />
                    : <input type={type || 'text'} className={`${inputCls} ${hint === 'ar' ? 'text-right' : ''}`} dir={hint === 'ar' ? 'rtl' : undefined} value={form[key] || ''} onChange={e => set(key, e.target.value)} />}
                </Field>
              ))}
            </div>
          </div>
        ))}
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}
    </div>
  );
}

// ─── Layout ──────────────────────────────────────────────────────────────────
const navGroups = [
  { label: 'Overview', items: [{ to: '/admin/dashboard', label: 'Dashboard' }, { to: '/admin/messages', label: 'Messages' }, { to: '/admin/feedback', label: 'Feedback' }] },
  { label: 'Content', items: [{ to: '/admin/projects', label: 'Projects' }, { to: '/admin/gallery', label: 'Gallery' }, { to: '/admin/categories', label: 'Categories' }, { to: '/admin/services', label: 'Services' }, { to: '/admin/packages', label: 'Packages' }, { to: '/admin/awards', label: 'Awards' }, { to: '/admin/testimonials', label: 'Testimonials' }] },
  { label: 'Resume', items: [{ to: '/admin/skills', label: 'Skills' }, { to: '/admin/education', label: 'Education' }, { to: '/admin/experience', label: 'Experience' }] },
  { label: 'System', items: [{ to: '/admin/settings', label: 'Settings' }] },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const handleLogout = () => { logout(); navigate('/admin/login'); };
  return (
    <div className="min-h-screen bg-primary-black text-warm-white flex">
      <aside className="w-60 border-r border-warm-white/10 flex flex-col p-6 shrink-0 overflow-y-auto sticky top-0 h-screen">
        <Link to="/" className="font-display text-lg tracking-widest uppercase text-warm-white mb-1 block hover:text-arch-beige transition-colors">ARQIVA</Link>
        <p className="text-warm-white/20 text-xs tracking-widest uppercase mb-8">Studio Admin</p>
        <nav className="flex-1 space-y-6 overflow-y-auto">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="text-warm-white/20 text-xs tracking-widest uppercase mb-1">{group.label}</p>
              {group.items.map(({ to, label }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `flex items-center text-xs tracking-widest uppercase py-2 px-3 mb-0.5 transition-colors ${isActive ? 'bg-warm-white/8 text-warm-white' : 'text-warm-white/40 hover:text-warm-white hover:bg-warm-white/5'}`}>{label}</NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-warm-white/10 pt-4 mt-4">
          <p className="text-warm-white/30 text-xs mb-2 truncate">{user?.email}</p>
          <button onClick={handleLogout} className="text-warm-white/30 text-xs tracking-widest uppercase hover:text-warm-white transition-colors">Sign Out</button>
        </div>
      </aside>
      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        <Routes>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="awards" element={<AwardsAdmin />} />
          <Route path="testimonials" element={<TestimonialsAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="packages" element={<PackagesAdmin />} />
          <Route path="feedback" element={<FeedbackAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="education" element={<EducationAdmin />} />
          <Route path="experience" element={<ExperienceAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="*" element={<DashboardHome />} />
        </Routes>
      </main>
    </div>
  );
}
