'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import api from '@/lib/api';
import { BonusRequest, ReferralHistory } from '@/types';

export default function AdminBonusPage() {
  const [requests, setRequests] = useState<BonusRequest[]>([]);
  const [referrals, setReferrals] = useState<ReferralHistory[]>([]);
  const [tab, setTab] = useState<'requests' | 'referrals'>('requests');

  const load = () => {
    api.get('bonus/requests/').then((r) => setRequests(r.data.results || r.data)).catch(() => {});
    api.get('bonus/referrals/').then((r) => setReferrals(r.data.results || r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const approve = async (id: number) => {
    try {
      await api.post(`bonus/requests/${id}/approve/`);
      load();
    } catch { alert('Xatolik — ballar yetarli emasmi?'); }
  };

  const reject = async (id: number) => {
    try {
      await api.post(`bonus/requests/${id}/reject/`);
      load();
    } catch { alert('Xatolik'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bonus tizimi boshqaruvi</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('requests')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'requests' ? 'bg-primary text-white' : 'bg-white text-text-secondary'}`}
        >
          Sovg&apos;a so&apos;rovlari
        </button>
        <button
          onClick={() => setTab('referrals')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'referrals' ? 'bg-primary text-white' : 'bg-white text-text-secondary'}`}
        >
          Referral tarix
        </button>
      </div>

      {tab === 'requests' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-2 font-medium">O&apos;quvchi</th>
                <th className="text-left py-3 px-2 font-medium">Sovg&apos;a</th>
                <th className="text-left py-3 px-2 font-medium">Ball</th>
                <th className="text-left py-3 px-2 font-medium">Sana</th>
                <th className="text-left py-3 px-2 font-medium">Holat</th>
                <th className="text-right py-3 px-2 font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-3 px-2 font-medium">{req.user_name}</td>
                  <td className="py-3 px-2">{req.reward_name}</td>
                  <td className="py-3 px-2">{req.points_required}</td>
                  <td className="py-3 px-2 text-text-secondary">{new Date(req.created_at).toLocaleDateString('uz')}</td>
                  <td className="py-3 px-2">
                    <span className={`badge text-xs ${
                      req.status === 'approved' ? 'bg-green-100 text-green-700' :
                      req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status === 'approved' ? 'Tasdiqlangan' : req.status === 'rejected' ? 'Rad etilgan' : 'Kutilmoqda'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    {req.status === 'pending' && (
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => approve(req.id)} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                          <Check size={16} />
                        </button>
                        <button onClick={() => reject(req.id)} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && <p className="text-center text-text-secondary py-6">So&apos;rovlar yo&apos;q</p>}
        </div>
      )}

      {tab === 'referrals' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-2 font-medium">Taklif qilgan</th>
                <th className="text-left py-3 px-2 font-medium">Taklif qilingan</th>
                <th className="text-left py-3 px-2 font-medium">Ball</th>
                <th className="text-left py-3 px-2 font-medium">Sana</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref) => (
                <tr key={ref.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-3 px-2 font-medium">{ref.referrer_name}</td>
                  <td className="py-3 px-2">{ref.referred_name}</td>
                  <td className="py-3 px-2 text-green-600 font-medium">+{ref.points_earned}</td>
                  <td className="py-3 px-2 text-text-secondary">{new Date(ref.created_at).toLocaleDateString('uz')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {referrals.length === 0 && <p className="text-center text-text-secondary py-6">Tarix yo&apos;q</p>}
        </div>
      )}
    </div>
  );
}
