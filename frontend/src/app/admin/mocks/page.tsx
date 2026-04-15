'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { MockApplication } from '@/types';

export default function AdminMocksPage() {
  const [mocks, setMocks] = useState<MockApplication[]>([]);

  const load = () => api.get('mock/').then((r) => setMocks(r.data.results || r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`mock/${id}/`, { status });
      setMocks(mocks.map(m => m.id === id ? { ...m, status } : m));
    } catch { alert('Xatolik'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mock test arizalari</h1>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-2 font-medium">Ism</th>
              <th className="text-left py-3 px-2 font-medium">Telefon</th>
              <th className="text-left py-3 px-2 font-medium">Test turi</th>
              <th className="text-left py-3 px-2 font-medium">Izoh</th>
              <th className="text-left py-3 px-2 font-medium">Sana</th>
              <th className="text-left py-3 px-2 font-medium">Holat</th>
              <th className="text-right py-3 px-2 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {mocks.map((mock) => (
              <tr key={mock.id} className="border-b border-[var(--border)] last:border-0">
                <td className="py-3 px-2 font-medium">{mock.name}</td>
                <td className="py-3 px-2">{mock.phone}</td>
                <td className="py-3 px-2">{mock.test_type_display}</td>
                <td className="py-3 px-2 text-text-secondary max-w-[150px] truncate">{mock.note || '—'}</td>
                <td className="py-3 px-2 text-text-secondary">{new Date(mock.created_at).toLocaleDateString('uz')}</td>
                <td className="py-3 px-2">
                  <span className={`badge text-xs ${
                    mock.status === 'new' ? 'bg-red-100 text-red-700' :
                    mock.status === 'called' ? 'bg-yellow-100 text-yellow-700' :
                    mock.status === 'done' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {mock.status === 'new' ? 'Yangi' :
                     mock.status === 'viewed' ? "Ko'rilgan" :
                     mock.status === 'called' ? "Qo'ng'iroq" : 'Bajarildi'}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <select
                    className="input-field text-xs py-1 px-2 w-auto"
                    value={mock.status}
                    onChange={(e) => updateStatus(mock.id, e.target.value)}
                  >
                    <option value="new">Yangi</option>
                    <option value="viewed">Ko&apos;rilgan</option>
                    <option value="called">Qo&apos;ng&apos;iroq qilindi</option>
                    <option value="done">Bajarildi</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mocks.length === 0 && <p className="text-center text-text-secondary py-6">Arizalar yo&apos;q</p>}
      </div>
    </div>
  );
}
