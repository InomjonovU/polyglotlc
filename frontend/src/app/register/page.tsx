'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import PhoneInput, { getCleanPhone } from '@/components/PhoneInput';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '+998 ',
    password: '',
    password_confirm: '',
    referral_code_input: searchParams.get('ref') || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password_confirm) {
      setError('Parollar mos kelmadi');
      return;
    }

    if (form.password.length < 6) {
      setError("Parol kamida 6 belgidan iborat bo'lishi kerak");
      return;
    }

    setLoading(true);
    try {
      await register({ ...form, phone: getCleanPhone(form.phone) });
      router.push('/login?registered=1');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, unknown> }; message?: string };
      const data = axiosErr.response?.data;
      if (data) {
        const messages: string[] = [];
        Object.entries(data).forEach(([, val]) => {
          if (Array.isArray(val)) messages.push(...val.map(String));
          else if (typeof val === 'string') messages.push(val);
          else if (typeof val === 'object' && val) messages.push(JSON.stringify(val));
        });
        setError(messages.length > 0 ? messages.join('. ') : "Xatolik yuz berdi");
      } else if (axiosErr.message) {
        setError("Server bilan aloqa yo'q. Backend ishga tushganligini tekshiring.");
      } else {
        setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20"
        >
          <UserPlus size={28} className="text-white" />
        </motion.div>
        <h1 className="text-2xl font-extrabold">Ro&apos;yxatdan o&apos;tish</h1>
        <p className="text-text-secondary text-sm mt-1">PolyglotLC ga xush kelibsiz!</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="card flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Ism</label>
            <input type="text" required className="input-field" placeholder="Umidjon" value={form.first_name} onChange={(e) => update('first_name', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Familiya</label>
            <input type="text" required className="input-field" placeholder="Karimov" value={form.last_name} onChange={(e) => update('last_name', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Email</label>
          <input type="email" required className="input-field" placeholder="email@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Telefon raqam</label>
          <PhoneInput
            value={form.phone}
            onChange={(v) => update('phone', v)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Parol</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              className="input-field pr-10"
              placeholder="Kamida 6 ta belgi"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Parolni tasdiqlash</label>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            className="input-field"
            placeholder="Parolni qayta kiriting"
            value={form.password_confirm}
            onChange={(e) => update('password_confirm', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Taklif kodi <span className="text-text-secondary font-normal">(ixtiyoriy)</span></label>
          <input type="text" className="input-field" placeholder="Referral kod" value={form.referral_code_input} onChange={(e) => update('referral_code_input', e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Yuklanmoqda...
            </span>
          ) : (
            "Ro'yxatdan o'tish"
          )}
        </button>
        <p className="text-center text-sm text-text-secondary">
          Akkauntingiz bormi?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">Kirish</Link>
        </p>
      </form>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="pt-24 md:pt-28 pb-10 min-h-[80vh] flex items-center">
      <div className="container-custom max-w-md">
        <Suspense fallback={<div className="text-center text-text-secondary">Yuklanmoqda...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
