import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-primary-black text-warm-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 md:px-10 pt-36 pb-20">
        <p className="text-arch-beige text-xs tracking-[0.4em] uppercase mb-6">Legal</p>
        <h1 className="font-display text-5xl text-warm-white mb-4">Privacy Policy</h1>
        <p className="text-warm-white/40 text-sm mb-12">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-invert max-w-none space-y-8 text-warm-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you submit our contact form. This may include your name, email address, phone number, and any messages you send us.</p>
            <p className="mt-3">We also automatically collect certain information when you visit our website, including IP addresses, browser type, pages visited, and time spent on pages. This is used solely for analytics and improving your experience.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-warm-white/60">
              <li>Respond to your inquiries and contact form submissions</li>
              <li>Send you updates about our services (only with your consent)</li>
              <li>Improve our website and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">3. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, subject to confidentiality agreements.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. All data is stored securely and access is restricted to authorized personnel only.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">5. Cookies</h2>
            <p>Our website uses cookies to enhance your browsing experience. You can disable cookies through your browser settings, though this may affect certain functionality.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at the address below.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through our <Link to="/contact" className="text-arch-beige hover:underline">contact page</Link>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
