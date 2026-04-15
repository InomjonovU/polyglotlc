'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, ExternalLink, Clock, Send } from 'lucide-react';
import { useSiteSettings } from '@/lib/site-settings';

const footerLinks = [
  { href: '/courses', label: 'Kurslar' },
  { href: '/teachers', label: "O'qituvchilar" },
  { href: '/mock', label: 'Mock test' },
  { href: '/blog', label: 'Yangiliklar' },
  { href: '/about', label: 'Biz haqimizda' },
  { href: '/contact', label: 'Aloqa' },
];

export default function Footer() {
  const s = useSiteSettings();

  return (
    <footer className="gradient-hero text-white relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.02] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container-custom py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-extrabold tracking-tight">
              Polyglot<span className="text-amber-400">LC</span>
            </Link>
            <p className="mt-4 text-sm text-blue-100/80 leading-relaxed">
              {s.site_description || "Professional o'quv markazi. Ingliz tili, IT va boshqa yo'nalishlar bo'yicha sifatli ta'lim."}
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {s.telegram && (
                <a href={s.telegram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#229ED9] flex items-center justify-center transition-all duration-200 hover:scale-110" title="Telegram">
                  <Send size={16} />
                </a>
              )}
              {s.instagram && (
                <a href={s.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 flex items-center justify-center transition-all duration-200 hover:scale-110 text-sm font-bold" title="Instagram">
                  IG
                </a>
              )}
              {s.youtube && (
                <a href={s.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all duration-200 hover:scale-110 text-sm font-bold" title="YouTube">
                  YT
                </a>
              )}
              {s.facebook && (
                <a href={s.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all duration-200 hover:scale-110 text-sm font-bold" title="Facebook">
                  FB
                </a>
              )}
              {s.tiktok && (
                <a href={s.tiktok} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-black flex items-center justify-center transition-all duration-200 hover:scale-110 text-sm font-bold" title="TikTok">
                  TT
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-blue-200">Sahifalar</h4>
            <div className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-sm text-blue-100/70 hover:text-white transition-colors flex items-center gap-1 group">
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-blue-200">Aloqa</h4>
            <div className="flex flex-col gap-3">
              <a href={`tel:${s.phone_1.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-blue-100/70 hover:text-white transition-colors">
                <Phone size={16} className="shrink-0" />
                <span>{s.phone_1}</span>
              </a>
              {s.phone_2 && (
                <a href={`tel:${s.phone_2.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-blue-100/70 hover:text-white transition-colors">
                  <Phone size={16} className="shrink-0" />
                  <span>{s.phone_2}</span>
                </a>
              )}
              <a href={`mailto:${s.email}`} className="flex items-center gap-3 text-sm text-blue-100/70 hover:text-white transition-colors">
                <Mail size={16} className="shrink-0" />
                <span>{s.email}</span>
              </a>
              {s.address && (
                <div className="flex items-start gap-3 text-sm text-blue-100/70 mt-1">
                  <MapPin size={16} className="shrink-0 mt-0.5" />
                  <span>{s.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Working hours */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-blue-200">Ish vaqti</h4>
            <div className="flex flex-col gap-2.5 text-sm text-blue-100/70">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="shrink-0" />
                <span className="font-medium text-blue-200">Kunlik jadval</span>
              </div>
              <div className="flex justify-between">
                <span>{s.weekday_label}</span>
                <span className="text-white font-medium">{s.weekday_hours}</span>
              </div>
              <div className="flex justify-between">
                <span>{s.weekend_label}</span>
                <span className="text-white font-medium">{s.weekend_hours}</span>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                <p className="text-xs text-blue-100/60">
                  Bepul sinov darsiga yozilish uchun qo&apos;ng&apos;iroq qiling!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-blue-200/60">
          <span>&copy; {new Date().getFullYear()} {s.site_name}. Barcha huquqlar himoyalangan.</span>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-white transition-colors">Biz haqimizda</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Aloqa</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
