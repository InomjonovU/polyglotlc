'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Phone, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

export default function MockTestPage() {
  const [form, setForm] = useState({ name: '', phone: '', test_type: 'ielts', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testOptions = [
    { value: 'ielts', label: 'IELTS Mock', price: "150 000 so'm", desc: "IELTS formatida to'liq mock test", color: 'from-blue-500 to-blue-600' },
    { value: 'cefr', label: 'CEFR Test', price: "100 000 so'm", desc: "CEFR darajangizni aniqlash testi", color: 'from-emerald-500 to-emerald-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('mock/', form);
      setSubmitted(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, unknown> }; message?: string };
      if (!axiosErr.response) {
        setError("Server bilan aloqa yo'q. Backend ishga tushganligini tekshiring.");
      } else {
        setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-28 md:pt-32 pb-20 min-h-[70vh] flex items-center">
        <div className="container-custom max-w-lg text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
              <ClipboardCheck size={44} className="text-white" />
            </div>
            <h1 className="section-title">Arizangiz qabul qilindi!</h1>
            <p className="text-text-secondary mt-4 text-lg">
              Admin siz bilan tez orada bog&apos;lanadi va test sanasini belgilaydi.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 text-primary bg-primary-light rounded-xl px-5 py-3 mx-auto w-fit">
              <Phone size={18} />
              <span className="font-medium">Siz bilan telefon orqali bog&apos;lanamiz</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const selectedTest = testOptions.find(t => t.value === form.test_type)!;

  return (
    <div className="pt-24 md:pt-28 pb-10 min-h-[70vh]">
      <div className="container-custom max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20"
            >
              <ClipboardCheck size={28} className="text-white" />
            </motion.div>
            <h1 className="section-title">Mock Test</h1>
            <p className="section-subtitle">
              IELTS Mock yoki CEFR Test topshirish uchun ariza qoldiring
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="card flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Ism va familiya</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Umidjon Karimov"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Telefon raqam</label>
              <input
                type="tel"
                required
                placeholder="+998 90 123 45 67"
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Test turi</label>
              <div className="grid grid-cols-2 gap-3">
                {testOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setForm({ ...form, test_type: opt.value })}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      form.test_type === opt.value
                        ? 'border-primary bg-primary-light'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={16} className={form.test_type === opt.value ? 'text-primary' : 'text-text-secondary/30'} />
                      <span className="font-bold text-sm">{opt.label}</span>
                    </div>
                    <p className="text-xs text-text-secondary">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className={`bg-gradient-to-r ${selectedTest.color} text-white px-5 py-4 rounded-xl flex items-center justify-between`}>
              <span className="text-sm opacity-90">Narx:</span>
              <span className="font-bold text-lg">{selectedTest.price}</span>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Qo&apos;shimcha izoh <span className="text-text-secondary font-normal">(ixtiyoriy)</span></label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Qo'shimcha ma'lumot..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Yuborilmoqda...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  So&apos;rov yuborish
                  <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
