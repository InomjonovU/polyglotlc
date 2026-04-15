'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const registered = searchParams.get('registered');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/cabinet');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, unknown>; status?: number }; message?: string };
      if (!axiosErr.response) {
        setError("Server bilan aloqa yo'q. Backend ishga tushganligini tekshiring.");
      } else if (axiosErr.response.status === 401) {
        setError("Email yoki parol noto'g'ri");
      } else {
        setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="card">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20"
        >
          <LogIn size={28} className="text-white" />
        </motion.div>
        <h1 className="text-2xl font-extrabold">Kirish</h1>
        <p className="text-text-secondary text-sm mt-1">PolyglotLC kabinetiga xush kelibsiz</p>
      </div>

      {registered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
        >
          <CheckCircle size={18} className="shrink-0" />
          Muvaffaqiyatli ro&apos;yxatdan o&apos;tdingiz! Endi kiring.
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Email</label>
          <input
            type="email"
            required
            className="input-field"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Parol</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="input-field pr-10"
              placeholder="Parolingizni kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-primary font-medium hover:underline">
            Parolni unutdingizmi?
          </Link>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Yuklanmoqda...
            </span>
          ) : (
            'Kirish'
          )}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-text-secondary">yoki</span></div>
      </div>

      <p className="text-center text-sm text-text-secondary">
        Hisobingiz yo&apos;qmi?{' '}
        <Link href="/register" className="text-primary font-semibold hover:underline">Ro&apos;yxatdan o&apos;tish</Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="pt-24 md:pt-28 pb-10 min-h-[80vh] flex items-center">
      <div className="container-custom max-w-lg">
        <Suspense fallback={<div className="text-center text-text-secondary">Yuklanmoqda...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
