'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle, Clock, Loader2, AlertCircle, MessageSquare, Building2 } from 'lucide-react';
import api from '@/lib/api';
import { Branch } from '@/types';
import { useSiteSettings } from '@/lib/site-settings';

export default function ContactPage() {
  const s = useSiteSettings();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    api.get('branches/').then((r) => setBranches(r.data.results || r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('contact/', form);
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

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="badge badge-primary mb-3 inline-flex items-center gap-1">
            <MessageSquare size={14} /> Aloqa
          </span>
          <h1 className="section-title">Biz bilan bog&apos;laning</h1>
          <p className="section-subtitle">Savollaringiz bormi? Biz yordam berishga tayyormiz!</p>
        </motion.div>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          {[
            { icon: <Phone size={22} />, title: 'Telefon', value: s.phone_1, href: `tel:${s.phone_1.replace(/\s/g, '')}`, color: 'from-blue-500 to-blue-600' },
            { icon: <Mail size={22} />, title: 'Email', value: s.email, href: `mailto:${s.email}`, color: 'from-emerald-500 to-emerald-600' },
            { icon: <Clock size={22} />, title: 'Ish vaqti', value: `${s.weekday_label}: ${s.weekday_hours}`, href: null, color: 'from-amber-500 to-amber-600' },
            { icon: <Building2 size={22} />, title: 'Filiallar', value: `${branches.length} ta filial`, href: null, color: 'from-purple-500 to-purple-600' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card card-glow text-center py-6 group hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <p className="text-sm text-text-secondary">{item.title}</p>
              {item.href ? (
                <a href={item.href} className="font-semibold mt-0.5 hover:text-primary transition-colors">{item.value}</a>
              ) : (
                <p className="font-semibold mt-0.5">{item.value}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Branches */}
        {branches.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-5xl mx-auto mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary" /> Filiallarimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((branch, i) => (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="card card-glow hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="font-bold text-lg mb-3">{branch.name}</h3>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-start gap-2 text-text-secondary">
                      <MapPin size={16} className="shrink-0 mt-0.5 text-primary" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Phone size={16} className="shrink-0 text-primary" />
                      <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">{branch.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Clock size={16} className="shrink-0 text-primary" />
                      <span>{branch.working_hours}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Left side - social & info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex flex-col gap-6">
            <div className="card card-glow">
              <h3 className="font-bold text-lg mb-4">Ijtimoiy tarmoqlar</h3>
              <div className="flex flex-col gap-3">
                {s.telegram && (
                  <a href={s.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary hover:bg-primary-light transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-[#229ED9] text-white flex items-center justify-center font-bold text-sm">TG</div>
                    <div>
                      <span className="font-medium group-hover:text-primary transition-colors block">Telegram</span>
                    </div>
                  </a>
                )}
                {s.instagram && (
                  <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary hover:bg-primary-light transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white flex items-center justify-center font-bold text-sm">IG</div>
                    <div>
                      <span className="font-medium group-hover:text-primary transition-colors block">Instagram</span>
                    </div>
                  </a>
                )}
                {s.youtube && (
                  <a href={s.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary hover:bg-primary-light transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm">YT</div>
                    <div>
                      <span className="font-medium group-hover:text-primary transition-colors block">YouTube</span>
                    </div>
                  </a>
                )}
                {s.facebook && (
                  <a href={s.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary hover:bg-primary-light transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">FB</div>
                    <div>
                      <span className="font-medium group-hover:text-primary transition-colors block">Facebook</span>
                    </div>
                  </a>
                )}
                {s.tiktok && (
                  <a href={s.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary hover:bg-primary-light transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm">TT</div>
                    <div>
                      <span className="font-medium group-hover:text-primary transition-colors block">TikTok</span>
                    </div>
                  </a>
                )}
              </div>
            </div>

            <div className="card card-glow">
              <h3 className="font-bold text-lg mb-2">Qo&apos;shimcha ma&apos;lumot</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                PolyglotLC — professional o&apos;quv markazi. Biz ingliz tili, IT, matematika va boshqa yo&apos;nalishlar bo&apos;yicha sifatli ta&apos;lim beramiz.
                Bepul sinov darsiga yozilish uchun bizga qo&apos;ng&apos;iroq qiling yoki xabar yuboring!
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            {submitted ? (
              <div className="card text-center py-20">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                    <CheckCircle size={36} className="text-white" />
                  </div>
                  <h3 className="font-bold text-xl">Xabaringiz yuborildi!</h3>
                  <p className="text-text-secondary mt-2">Tez orada javob beramiz.</p>
                </motion.div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card card-glow flex flex-col gap-5">
                <h3 className="font-bold text-lg">Xabar yuborish</h3>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
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
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Telefon raqam</label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    placeholder="+998 90 123 45 67"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Xabar</label>
                  <textarea
                    required
                    rows={4}
                    className="input-field"
                    placeholder="Xabaringizni yozing..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Yuborilmoqda...</span>
                  ) : (
                    <span className="flex items-center gap-2">Yuborish <Send size={18} /></span>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
