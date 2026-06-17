import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import ScrollToTop from '@/components/ScrollToTop';
import Preloader from '@/components/Preloader';

// Pages
import HomePage from '@/pages/HomePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import ServicesPage from '@/pages/ServicesPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import AwardsPage from '@/pages/AwardsPage';
import TestimonialsPage from '@/pages/TestimonialsPage';
import ResumePage from '@/pages/ResumePage';
import PackagesPage from '@/pages/PackagesPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsPage from '@/pages/TermsPage';

// Admin
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';

// Styles
import '@/styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

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
      </motion.div>
    </AnimatePresence>
  );
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

  const handlePreloaderDone = () => {
    sessionStorage.setItem('arqiva_preloaded', '1');
    setPreloaderDone(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {!preloaderDone && <Preloader onDone={handlePreloaderDone} />}
      <Router>
        <ScrollToTop />
        <AnimatedRoutes />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
