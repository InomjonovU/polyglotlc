'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { KeyRound, Mail, ArrowLeft, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="pt-24 md:pt-28 pb-10 min-h-[80vh] flex items-center">
      <div className="container-custom max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="card">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20"
            >
              <KeyRound size={28} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-extrabold">Parolni tiklash</h1>
            <p className="text-text-secondary text-sm mt-1">Email manzilingizga tiklash havolasi yuboramiz</p>
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                <Mail size={36} className="text-white" />
              </div>
              <p className="text-text-secondary">
                <strong className="text-text">{email}</strong> manziliga parolni tiklash havolasi yuborildi.
              </p>
              <p className="text-text-secondary text-sm mt-2">Emailingizni tekshiring.</p>
              <Link href="/login" className="btn-primary mt-6 inline-flex items-center gap-2">
                <ArrowLeft size={18} />
                Kirish sahifasiga qaytish
              </Link>
            </motion.div>
          ) : (
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
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Yuborilmoqda...</span>
                ) : (
                  'Havola yuborish'
                )}
              </button>
              <Link href="/login" className="text-center text-sm text-primary font-medium hover:underline flex items-center justify-center gap-1">
                <ArrowLeft size={14} />
                Kirish sahifasiga qaytish
              </Link>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
