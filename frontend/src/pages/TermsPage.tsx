import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-primary-black text-warm-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 md:px-10 pt-36 pb-20">
        <p className="text-arch-beige text-xs tracking-[0.4em] uppercase mb-6">Legal</p>
        <h1 className="font-display text-5xl text-warm-white mb-4">Terms of Service</h1>
        <p className="text-warm-white/40 text-sm mb-12">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8 text-warm-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the ARQIVA Studio & Design website, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our website.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">2. Use of Website</h2>
            <p>This website is provided for informational purposes and to facilitate contact with our studio. You agree to use the website only for lawful purposes and in a manner that does not infringe the rights of others.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">3. Intellectual Property</h2>
            <p>All content on this website, including project images, text, graphics, and design, is the intellectual property of ARQIVA Studio & Design and is protected by copyright law. Reproduction or distribution without prior written consent is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">4. Project Portfolio</h2>
            <p>Project images and descriptions are shared with client permission and are intended to showcase our capabilities. All client information is treated with strict confidentiality.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">5. Professional Services</h2>
            <p>The portfolio and information presented on this website does not constitute a contract or guarantee of services. All professional engagements are subject to separate written agreements.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">6. Limitation of Liability</h2>
            <p>ARQIVA Studio & Design shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">7. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-warm-white mb-3">8. Contact</h2>
            <p>For questions regarding these terms, please reach us through our <Link to="/contact" className="text-arch-beige hover:underline">contact page</Link>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
