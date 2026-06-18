import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider, QueryClient, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import ScrollToTop from '@/components/ScrollToTop';
import Preloader, { PrefetchedData } from '@/components/Preloader';
import api from '@/lib/api';

// ── Lazy-loaded pages (code-split per route) ──────────────────────────────
const HomePage          = lazy(() => import('@/pages/HomePage'));
const ProjectsPage      = lazy(() => import('@/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'));
const ServicesPage      = lazy(() => import('@/pages/ServicesPage'));
const AboutPage         = lazy(() => import('@/pages/AboutPage'));
const ContactPage       = lazy(() => import('@/pages/ContactPage'));
const AwardsPage        = lazy(() => import('@/pages/AwardsPage'));
const TestimonialsPage  = lazy(() => import('@/pages/TestimonialsPage'));
const ResumePage        = lazy(() => import('@/pages/ResumePage'));
const PackagesPage      = lazy(() => import('@/pages/PackagesPage'));
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsPage         = lazy(() => import('@/pages/TermsPage'));
const AdminLogin        = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard    = lazy(() => import('@/pages/admin/AdminDashboard'));

// Styles
import '@/styles/globals.css';

// ── QueryClient — aggressive caching so navigation feels instant ──────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // data stays fresh 5 min — no re-fetch on back-nav
      gcTime: 30 * 60 * 1000,        // keep in memory 30 min after unmount
      retry: 1,
      refetchOnWindowFocus: false,    // don't re-fetch when switching browser tabs
      refetchOnReconnect: false,      // don't re-fetch on network reconnect
    },
  },
});

// ── Skeleton page fallback shown during lazy-chunk download ──────────────
function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-7 h-7 border border-arch-beige border-t-transparent rounded-full animate-spin" />
        <span className="text-[9px] tracking-[0.4em] text-stone-brown/40 uppercase">Loading</span>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuthStore();
  if (!user || !accessToken) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/awards" element={<AwardsPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

// ── SiteHead — applies dynamic favicon/title from settings ───────────────
function SiteHead() {
  const { data: settingsRes } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });
  const favicon = settingsRes?.data?.favicon;
  useEffect(() => {
    if (!favicon) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = favicon;
  }, [favicon]);
  return null;
}

function App() {
  const initFromStorage = useAuthStore((state) => state.initFromStorage);
  // Show preloader only once per session (not on admin pages or back-navigation)
  const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const [preloaderDone, setPreloaderDone] = useState(
    isAdmin || sessionStorage.getItem('arqiva_preloaded') === '1'
  );

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  const handlePreloaderDone = (data: PrefetchedData) => {
    // Seed QueryClient cache with prefetched data so HomePage renders instantly
    if (data.settings) queryClient.setQueryData(['settings'], data.settings);
    if (data.projects) queryClient.setQueryData(['projects', 'featured'], data.projects);
    sessionStorage.setItem('arqiva_preloaded', '1');
    setPreloaderDone(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHead />
      {!preloaderDone && <Preloader onDone={handlePreloaderDone} />}
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <AnimatedRoutes />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
