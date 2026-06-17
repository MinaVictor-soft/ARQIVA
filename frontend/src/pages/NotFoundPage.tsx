import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-primary-black text-warm-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-display text-[20vw] leading-none text-warm-white/5 select-none mb-0">404</p>
          <div className="-mt-8">
            <p className="text-arch-beige text-xs tracking-[0.4em] uppercase mb-4">Page Not Found</p>
            <h1 className="font-display text-4xl md:text-6xl text-warm-white mb-6">This page doesn't exist</h1>
            <p className="text-warm-white/50 text-base max-w-md mx-auto mb-10">
              The page you're looking for may have been moved, deleted, or never existed.
            </p>
            <div className="flex items-center justify-center gap-6">
              <Link to="/" className="bg-warm-white text-primary-black px-8 py-3 text-sm tracking-widest uppercase hover:bg-arch-beige transition-colors">
                Back Home
              </Link>
              <Link to="/projects" className="text-warm-white/60 text-sm tracking-widest uppercase border-b border-warm-white/30 pb-0.5 hover:text-warm-white hover:border-warm-white transition-colors">
                View Projects
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
