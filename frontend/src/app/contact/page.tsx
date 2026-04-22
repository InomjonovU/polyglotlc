'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, Mail, Send, CheckCircle, Clock, Loader2, AlertCircle,
  MessageSquare, Sparkles, ArrowUpRight,
} from 'lucide-react';
import api from '@/lib/api';
import { useSiteSettings } from '@/lib/site-settings';
import PhoneInput, { getCleanPhone, isPhoneComplete } from '@/components/PhoneInput';

type SocialLink = {
  key: string;
  label: string;
  href: string;
  initials: string;
  gradient: string;
  shadow: string;
  description: string;
};

export default function ContactPage() {
  const s = useSiteSettings();
  const [form, setForm] = useState({ name: '', phone: '+998 ', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('contact/', { ...form, phone: getCleanPhone(form.phone) });
      setSubmitted(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: unknown; message?: string };
      if (!axiosErr.response) {
        setError("Server bilan aloqa yo'q. Backend ishga tushganligini tekshiring.");
      } else {
        setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  };

  const socials: SocialLink[] = [
    { key: 'telegram',  label: 'Telegram',  href: s.telegram,  initials: 'TG', gradient: 'from-[#229ED9] to-[#1a8bc7]',                shadow: 'shadow-[#229ED9]/30', description: "Yangiliklar va e'lonlar" },
    { key: 'instagram', label: 'Instagram', href: s.instagram, initials: 'IG', gradient: 'from-[#f09433] via-[#e6683c] to-[#bc1888]', shadow: 'shadow-[#e6683c]/30', description: 'Fotolar va lavhalar' },
    { key: 'youtube',   label: 'YouTube',   href: s.youtube,   initials: 'YT', gradient: 'from-[#FF0000] to-[#cc0000]',                shadow: 'shadow-red-500/30',   description: 'Video darslar' },
    { key: 'facebook',  label: 'Facebook',  href: s.facebook,  initials: 'FB', gradient: 'from-[#1877F2] to-[#0d5dc7]',                shadow: 'shadow-blue-500/30',  description: 'Hamjamiyat' },
    { key: 'tiktok',    label: 'TikTok',    href: s.tiktok,    initials: 'TT', gradient: 'from-[#25F4EE] via-black to-[#FE2C55]',      shadow: 'shadow-pink-500/30',  description: 'Qisqa videolar' },
  ].filter((x) => !!x.href) as SocialLink[];

  return (
    <div className="relative min-h-screen pt-24 md:pt-28 pb-20 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent/25 to-primary/20 blur-3xl"
          animate={{ x: [0, -60, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-primary/20 to-accent/30 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container-custom max-w-6xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 14 }}
            className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-6"
          >
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary opacity-70 blur-xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-2xl shadow-primary/30">
              {s.logo ? (
                <img src={s.logo} alt={s.site_name} className="w-3/5 h-3/5 object-contain" />
              ) : (
                <Sparkles size={42} className="text-white" />
              )}
            </div>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-primary/20 text-primary text-xs font-semibold mb-4 shadow-sm"
          >
            <MessageSquare size={13} /> Aloqa markazi
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          >
            {s.site_name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-text-secondary text-base md:text-lg mt-3 max-w-xl mx-auto"
          >
            {s.site_description || "Biz bilan bog'lanish — bir bosish masofasida"}
          </motion.p>
        </motion.div>

        {/* Quick contact pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-14 md:mb-16"
        >
          {[
            { icon: <Phone size={15} />, label: s.phone_1, href: `tel:${(s.phone_1 || '').replace(/\s/g, '')}` },
            { icon: <Mail size={15} />,  label: s.email,   href: `mailto:${s.email}` },
            { icon: <Clock size={15} />, label: `${s.weekday_label}: ${s.weekday_hours}`, href: null as string | null },
          ].map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {c.href ? (
                <a
                  href={c.href}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-border hover:border-primary/40 hover:bg-white transition-all text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <span className="text-primary">{c.icon}</span>
                  {c.label}
                </a>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-border text-sm font-medium shadow-sm">
                  <span className="text-primary">{c.icon}</span>
                  {c.label}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Linktree-style social stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-3"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2">
              <Sparkles size={20} className="text-primary" /> Bizni kuzating
            </h2>

            {socials.length === 0 && (
              <div className="card text-center py-10 text-text-secondary text-sm">
                Hozircha ijtimoiy tarmoq havolalari qo&apos;shilmagan.
              </div>
            )}

            {socials.map((soc, i) => (
              <motion.a
                key={soc.key}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08, type: 'spring', stiffness: 180 }}
                whileHover={{ x: 6, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl bg-white border border-border hover:border-transparent shadow-sm hover:shadow-xl ${soc.shadow} transition-all duration-300`}
              >
                {/* Gradient sweep on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${soc.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300`} />

                <div className={`relative shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${soc.gradient} text-white flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  {soc.initials}
                </div>

                <div className="flex-1 min-w-0 relative">
                  <p className="font-bold text-base group-hover:text-primary transition-colors">{soc.label}</p>
                  <p className="text-xs text-text-secondary truncate">{soc.description}</p>
                </div>

                <motion.div
                  className="relative shrink-0 w-9 h-9 rounded-full bg-bg-secondary group-hover:bg-primary text-text-secondary group-hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  <ArrowUpRight size={18} className="group-hover:rotate-12 transition-transform" />
                </motion.div>
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + socials.length * 0.08 + 0.1 }}
              className="mt-3 p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
            >
              <p className="text-sm text-text-secondary leading-relaxed">
                <span className="font-semibold text-text">{s.site_name}</span> — professional ta&apos;lim markazi.
                Savollaringiz bo&apos;lsa biz bilan bog&apos;laning. Bepul sinov darsiga yozilishingiz mumkin!
              </p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:sticky lg:top-28"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-3xl bg-white border border-border shadow-2xl shadow-primary/10 p-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30"
                >
                  <CheckCircle size={40} className="text-white" />
                </motion.div>
                <h3 className="font-extrabold text-2xl">Xabaringiz yuborildi!</h3>
                <p className="text-text-secondary mt-2">Tez orada siz bilan bog&apos;lanamiz.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', phone: '+998 ', message: '' }); }}
                  className="mt-6 text-sm text-primary font-semibold hover:underline"
                >
                  Yana xabar yuborish
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative overflow-hidden rounded-3xl bg-white border border-border shadow-xl shadow-primary/5 p-7 md:p-8 flex flex-col gap-5"
              >
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                  <h3 className="font-extrabold text-2xl">Xabar yuborish</h3>
                  <p className="text-sm text-text-secondary mt-1">Formani to&apos;ldiring — biz tezda javob beramiz</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
                  >
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="relative">
                  <label className="block text-sm font-semibold mb-1.5">Ism</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Ismingizni kiriting"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold mb-1.5">Telefon raqam</label>
                  <PhoneInput
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold mb-1.5">Xabar</label>
                  <textarea
                    required
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Xabaringizni yozing..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !isPhoneComplete(form.phone)}
                  className="relative btn-primary w-full text-base py-3.5 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Yuborilmoqda...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">Yuborish <Send size={18} /></span>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
