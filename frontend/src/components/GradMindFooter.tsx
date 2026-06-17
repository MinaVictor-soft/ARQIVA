import React from 'react';
import { Globe } from 'lucide-react';
import { SiWhatsapp, SiFacebook, SiInstagram } from 'react-icons/si';

const socials = [
  {
    href: 'https://wa.me/201289855489',
    icon: SiWhatsapp,
    label: 'WhatsApp',
    hoverClass: 'hover:text-green-500 hover:border-green-500/40 hover:bg-green-500/5',
  },
  {
    href: 'https://www.facebook.com/GradMindAI',
    icon: SiFacebook,
    label: 'Facebook',
    hoverClass: 'hover:text-blue-400 hover:border-blue-400/40 hover:bg-blue-400/5',
  },
  {
    href: 'https://www.instagram.com/gradmind_ai',
    icon: SiInstagram,
    label: 'Instagram',
    hoverClass: 'hover:text-pink-400 hover:border-pink-400/40 hover:bg-pink-400/5',
  },
  {
    href: 'https://gradmind.net/',
    icon: Globe,
    label: 'Website',
    hoverClass: 'hover:text-arch-beige hover:border-arch-beige/40 hover:bg-arch-beige/5',
  },
];

export default function GradMindFooter() {
  return (
    <div className="border-t border-warm-white/6 py-4">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand + socials */}
        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-warm-white/30 tracking-wide">Powered by</span>
            <a
              href="https://gradmind.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex flex-col items-center"
            >
              <span className="font-extrabold tracking-tight text-sm leading-none">
                <span className="text-warm-white/90">Grad</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Mind</span>
              </span>
              <span className="flex items-center gap-1 mt-0.5 opacity-50 w-full">
                <span className="h-px bg-warm-white/30 flex-grow" />
                <span className="text-[8px] text-warm-white/40 font-medium tracking-[0.18em]">AI SOLUTIONS</span>
                <span className="h-px bg-warm-white/30 flex-grow" />
              </span>
            </a>
          </div>

          <span className="hidden sm:block text-warm-white/15">|</span>

          <div className="flex items-center gap-1.5">
            {socials.map(({ href, icon: Icon, label, hoverClass }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className={`w-7 h-7 rounded-full border border-warm-white/15 bg-warm-white/5 flex items-center justify-center text-warm-white/40 transition-all duration-200 ${hoverClass}`}
              >
                <Icon className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-warm-white/25 tracking-wide whitespace-nowrap">
          &copy; 2026 GradMind. All rights reserved.
        </p>
      </div>
    </div>
  );
}
