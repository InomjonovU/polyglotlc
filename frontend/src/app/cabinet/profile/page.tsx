'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '' });
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' });
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setForm({ first_name: user.first_name, last_name: user.last_name, phone: user.phone });
    }
  }, [user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('auth/profile/', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Xatolik yuz berdi");
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('auth/change-password/', pwForm);
      setPwSaved(true);
      setPwForm({ old_password: '', new_password: '' });
      setTimeout(() => setPwSaved(false), 2000);
    } catch {
      setError("Joriy parol noto'g'ri");
    }
  };

  if (loading || !user) return <div className="py-20 text-center text-text-secondary">Yuklanmoqda...</div>;

  return (
    <div className="pt-24 md:pt-28 pb-10">
      <div className="container-custom max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Profil</h1>
          <p className="text-text-secondary mt-1">Shaxsiy ma&apos;lumotlarni tahrirlash</p>

          {/* Profile form */}
          <form onSubmit={saveProfile} className="card mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <User size={20} className="text-primary" />
              <h3 className="font-bold">Shaxsiy ma&apos;lumotlar</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ism</label>
                <input type="text" className="input-field" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Familiya</label>
                <input type="text" className="input-field" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" disabled className="input-field opacity-60" value={user.email} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefon</label>
              <input type="tel" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              {saved ? <><CheckCircle size={18} /> Saqlandi!</> : 'Saqlash'}
            </button>
          </form>

          {/* Password change */}
          <form onSubmit={changePassword} className="card mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <Lock size={20} className="text-primary" />
              <h3 className="font-bold">Parolni o&apos;zgartirish</h3>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
            {pwSaved && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-lg text-sm">Parol o&apos;zgartirildi!</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Joriy parol</label>
              <input type="password" required className="input-field" value={pwForm.old_password} onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Yangi parol</label>
              <input type="password" required minLength={6} className="input-field" value={pwForm.new_password} onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full">
              Parolni o&apos;zgartirish
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
