'use client';

import { useEffect, useState } from 'react';
import { Search, Users, ClipboardList } from 'lucide-react';
import api from '@/lib/api';
import { CourseApplication } from '@/types';

interface UserItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bonus_points: number;
  is_staff: boolean;
  date_joined: string;
}

export default function AdminStudentsPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'users' | 'applications'>('users');

  useEffect(() => {
    api.get('auth/users/').then((r) => setUsers(r.data.results || r.data)).catch(() => {});
    api.get('applications/').then((r) => setApplications(r.data.results || r.data)).catch(() => {});
  }, []);

  const updateAppStatus = async (id: number, status: string) => {
    try {
      await api.patch(`applications/${id}/`, { status });
      setApplications(applications.map(a => a.id === id ? { ...a, status } : a));
    } catch { alert('Xatolik'); }
  };

  const filteredUsers = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email} ${u.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredApps = applications.filter(a =>
    `${a.name} ${a.phone} ${a.course_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">O&apos;quvchilar va arizalar</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            tab === 'users' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-text-secondary hover:bg-bg-secondary'
          }`}
        >
          <Users size={16} /> Foydalanuvchilar ({users.length})
        </button>
        <button
          onClick={() => setTab('applications')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            tab === 'applications' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-text-secondary hover:bg-bg-secondary'
          }`}
        >
          <ClipboardList size={16} /> Kurs arizalari ({applications.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          className="input-field pl-10"
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {tab === 'users' ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-2 font-medium">#</th>
                <th className="text-left py-3 px-2 font-medium">Ism</th>
                <th className="text-left py-3 px-2 font-medium">Email</th>
                <th className="text-left py-3 px-2 font-medium">Telefon</th>
                <th className="text-left py-3 px-2 font-medium">Bonus</th>
                <th className="text-left py-3 px-2 font-medium">Ro&apos;yxatdan</th>
                <th className="text-left py-3 px-2 font-medium">Rol</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr key={u.id} className="border-b border-[var(--border)] last:border-0 hover:bg-bg-secondary transition-colors">
                  <td className="py-3 px-2 text-text-secondary">{i + 1}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {u.first_name?.[0] || u.email?.[0] || '?'}
                      </div>
                      <span className="font-medium">{u.first_name} {u.last_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-text-secondary">{u.email}</td>
                  <td className="py-3 px-2">{u.phone || '-'}</td>
                  <td className="py-3 px-2">
                    <span className="badge bg-amber-100 text-amber-700 text-xs">{u.bonus_points}</span>
                  </td>
                  <td className="py-3 px-2 text-text-secondary">
                    {new Date(u.date_joined).toLocaleDateString('uz')}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`badge text-xs ${u.is_staff ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                      {u.is_staff ? 'Admin' : "O'quvchi"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <p className="text-center text-text-secondary py-6">Foydalanuvchilar topilmadi</p>
          )}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-2 font-medium">Ism</th>
                <th className="text-left py-3 px-2 font-medium">Telefon</th>
                <th className="text-left py-3 px-2 font-medium">Kurs</th>
                <th className="text-left py-3 px-2 font-medium">Sana</th>
                <th className="text-left py-3 px-2 font-medium">Holat</th>
                <th className="text-right py-3 px-2 font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} className="border-b border-[var(--border)] last:border-0 hover:bg-bg-secondary transition-colors">
                  <td className="py-3 px-2 font-medium">{app.name}</td>
                  <td className="py-3 px-2">{app.phone}</td>
                  <td className="py-3 px-2">{app.course_name}</td>
                  <td className="py-3 px-2 text-text-secondary">{new Date(app.created_at).toLocaleDateString('uz')}</td>
                  <td className="py-3 px-2">
                    <span className={`badge text-xs ${
                      app.status === 'new' ? 'bg-red-100 text-red-700' :
                      app.status === 'viewed' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {app.status === 'new' ? 'Yangi' : app.status === 'viewed' ? "Ko'rilgan" : 'Qabul'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <select
                      className="input-field text-xs py-1 px-2 w-auto"
                      value={app.status}
                      onChange={(e) => updateAppStatus(app.id, e.target.value)}
                    >
                      <option value="new">Yangi</option>
                      <option value="viewed">Ko&apos;rilgan</option>
                      <option value="accepted">Qabul qilindi</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApps.length === 0 && (
            <p className="text-center text-text-secondary py-6">Arizalar yo&apos;q</p>
          )}
        </div>
      )}
    </div>
  );
}
