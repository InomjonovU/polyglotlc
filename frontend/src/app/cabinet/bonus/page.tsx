'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gift, Lock, CheckCircle, Copy, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { BonusReward, BonusRequest, ReferralHistory } from '@/types';

export default function BonusPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rewards, setRewards] = useState<BonusReward[]>([]);
  const [requests, setRequests] = useState<BonusRequest[]>([]);
  const [referrals, setReferrals] = useState<ReferralHistory[]>([]);
  const [copied, setCopied] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api.get('bonus/rewards/').then((r) => setRewards(r.data.results || r.data)).catch(() => {});
      api.get('bonus/requests/').then((r) => setRequests(r.data.results || r.data)).catch(() => {});
      api.get('bonus/referrals/').then((r) => setReferrals(r.data.results || r.data)).catch(() => {});
    }
  }, [user]);

  const requestReward = async (rewardId: number) => {
    setRequesting(true);
    try {
      await api.post('bonus/requests/', { reward: rewardId });
      const res = await api.get('bonus/requests/');
      setRequests(res.data.results || res.data);
      alert("So'rov yuborildi! Admin tasdiqlashini kuting.");
    } catch {
      alert("Xatolik yuz berdi. Ballingiz yetarli emasligini tekshiring.");
    } finally {
      setRequesting(false);
    }
  };

  const copyRef = () => {
    if (!user) return;
    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user.referral_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !user) return <div className="py-20 text-center text-text-secondary">Yuklanmoqda...</div>;

  const nextReward = rewards.find((r) => r.points_required > user.bonus_points);
  const progressPercent = nextReward
    ? Math.min((user.bonus_points / nextReward.points_required) * 100, 100)
    : 100;

  return (
    <div className="pt-24 md:pt-28 pb-10">
      <div className="container-custom max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Bonus tizimi</h1>

          {/* Points display */}
          <div className="card mt-6 text-center">
            <p className="text-text-secondary text-sm">Joriy ballingiz</p>
            <p className="text-5xl font-bold text-primary mt-2">{user.bonus_points}</p>
            <p className="text-sm text-text-secondary mt-1">ball</p>

            {nextReward && (
              <div className="mt-4 max-w-md mx-auto">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>{user.bonus_points} ball</span>
                  <span>{nextReward.name} — {nextReward.points_required} ball</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Referral */}
          <div className="card mt-6">
            <h3 className="font-bold mb-2">Referral tizimi</h3>
            <p className="text-sm text-text-secondary mb-1">
              Do&apos;stingiz havola orqali ro&apos;yxatdan o&apos;tsa = <strong className="text-green-600">+100 ball</strong>
            </p>
            <p className="text-sm text-text-secondary mb-3">
              Do&apos;stingizga birinchi oyda <strong className="text-accent">5% chegirma</strong> beriladi
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                className="input-field flex-1 text-sm"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code}`}
              />
              <button onClick={copyRef} className="btn-primary text-sm flex items-center gap-1">
                {copied ? <><Check size={16} /> Nusxalandi</> : <><Copy size={16} /> Nusxa</>}
              </button>
            </div>
          </div>

          {/* Rewards */}
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-4">Sovg&apos;alar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewards.map((reward) => {
                const canAfford = user.bonus_points >= reward.points_required;
                return (
                  <div
                    key={reward.id}
                    className={`card flex items-center justify-between ${canAfford ? 'border-green-200' : 'opacity-60'}`}
                  >
                    <div className="flex items-center gap-3">
                      {canAfford ? (
                        <Gift size={24} className="text-green-600" />
                      ) : (
                        <Lock size={24} className="text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium">{reward.name}</p>
                        <p className="text-sm text-text-secondary">{reward.points_required} ball</p>
                      </div>
                    </div>
                    <button
                      onClick={() => requestReward(reward.id)}
                      disabled={!canAfford || requesting}
                      className={canAfford ? 'btn-primary text-sm' : 'btn-outline text-sm opacity-50 cursor-not-allowed'}
                    >
                      Olish
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Request history */}
          {requests.length > 0 && (
            <div className="card mt-6">
              <h3 className="font-bold mb-3">So&apos;rovlar tarixi</h3>
              <div className="space-y-2">
                {requests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm">{req.reward_name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`badge text-xs ${
                        req.status === 'approved' ? 'bg-green-100 text-green-700' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {req.status === 'approved' ? 'Tasdiqlangan' :
                         req.status === 'rejected' ? 'Rad etilgan' : 'Kutilmoqda'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referral history */}
          {referrals.length > 0 && (
            <div className="card mt-6">
              <h3 className="font-bold mb-3">Taklif qilganlar tarixi</h3>
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
        </motion.div>
      </div>
    </div>
  );
}
