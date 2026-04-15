'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, User, Copy, Check, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ReferralHistory } from '@/types';

export default function CabinetPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<ReferralHistory[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api.get('bonus/referrals/').then((r) => setReferrals(r.data.results || r.data)).catch(() => {});
    }
  }, [user]);

  const copyReferral = () => {
    if (!user) return;
    const url = `${window.location.origin}/register?ref=${user.referral_code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !user) return <div className="py-20 text-center text-text-secondary">Yuklanmoqda...</div>;

  return (
    <div className="pt-24 md:pt-28 pb-10">
      <div className="container-custom max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Salom, {user.first_name}! 👋</h1>
          <p className="text-text-secondary mt-1">Shaxsiy kabinetingizga xush kelibsiz</p>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--primary-light)] rounded-lg flex items-center justify-center">
                <Gift size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{user.bonus_points}</p>
                <p className="text-sm text-text-secondary">Bonus ball</p>
              </div>
            </div>

            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{referrals.length}</p>
                <p className="text-sm text-text-secondary">Taklif qilganlar</p>
              </div>
            </div>

            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <User size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold">{user.first_name} {user.last_name}</p>
                <p className="text-sm text-text-secondary">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Referral link */}
          <div className="card mt-6">
            <h3 className="font-bold mb-2">Referral havola</h3>
            <p className="text-sm text-text-secondary mb-3">
              Do&apos;stlaringizga yuboring — ular ro&apos;yxatdan o&apos;tsa siz +100 ball olasiz!
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                className="input-field flex-1 text-sm"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code}`}
              />
              <button onClick={copyReferral} className="btn-primary text-sm flex items-center gap-1">
                {copied ? <><Check size={16} /> Nusxalandi</> : <><Copy size={16} /> Nusxa</>}
              </button>
            </div>
          </div>

          {/* Referral history */}
          {referrals.length > 0 && (
            <div className="card mt-6">
              <h3 className="font-bold mb-3">Taklif qilganlar</h3>
              <div className="space-y-2">
                {referrals.map((ref) => (
                  <div key={ref.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm">{ref.referred_name}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-green-600 font-medium">+{ref.points_earned} ball</span>
                      <span className="text-text-secondary">{new Date(ref.created_at).toLocaleDateString('uz')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Link href="/cabinet/bonus" className="card hover:border-primary transition-colors flex items-center gap-3">
              <Gift size={20} className="text-primary" />
              <div>
                <p className="font-bold">Bonus tizimi</p>
                <p className="text-sm text-text-secondary">Balllarni sovg&apos;alarga almashtiring</p>
              </div>
            </Link>
            <Link href="/cabinet/profile" className="card hover:border-primary transition-colors flex items-center gap-3">
              <User size={20} className="text-primary" />
              <div>
                <p className="font-bold">Profil</p>
                <p className="text-sm text-text-secondary">Ma&apos;lumotlarni tahrirlash</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
