'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, MapPin, Phone, Clock } from 'lucide-react';
import api from '@/lib/api';
import { Branch } from '@/types';

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', working_hours: '' });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('branches/').then((r) => setBranches(r.data.results || r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ name: '', address: '', phone: '', working_hours: 'Dush-Shan: 09:00-21:00' });
    setEditing('new');
  };

  const openEdit = (b: Branch) => {
    setForm({ name: b.name, address: b.address, phone: b.phone, working_hours: b.working_hours });
    setEditing(b.id);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing === 'new') {
        await api.post('branches/', form);
      } else {
        await api.patch(`branches/${editing}/`, form);
      }
      setEditing(null);
      load();
    } catch { alert('Xatolik'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`branches/${id}/`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Filiallar</h1>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={16} /> Yangi filial</button>
      </div>

      {/* Modal */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">{editing === 'new' ? 'Yangi filial' : 'Filialni tahrirlash'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-bg-secondary rounded-lg"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Nomi</label>
                <input className="input-field" placeholder="Filial nomi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Manzil</label>
                <textarea className="input-field" rows={2} placeholder="To'liq manzil" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Telefon</label>
                  <input className="input-field" placeholder="+998 90 123 45 67" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Ish vaqti</label>
                  <input className="input-field" placeholder="Dush-Shan: 09:00-21:00" value={form.working_hours} onChange={(e) => setForm({ ...form, working_hours: e.target.value })} />
                </div>
              </div>
              <button onClick={save} disabled={saving} className="btn-primary w-full">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saqlanmoqda...</> : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branch cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <div key={branch.id} className="card hover:border-primary/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">{branch.name}</h3>
              <div className="flex gap-1">
                <button onClick={() => openEdit(branch)} className="p-1.5 text-primary hover:bg-primary-light rounded-lg"><Pencil size={16} /></button>
                <button onClick={() => remove(branch.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-start gap-2 text-text-secondary">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <span>{branch.address}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Phone size={16} className="shrink-0" />
                <span>{branch.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Clock size={16} className="shrink-0" />
                <span>{branch.working_hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {branches.length === 0 && (
        <div className="card text-center py-10 text-text-secondary">
          <MapPin size={48} className="mx-auto mb-4 opacity-20" />
          <p>Filiallar yo&apos;q</p>
          <p className="text-sm mt-1">Yangi filial qo&apos;shish uchun yuqoridagi tugmani bosing</p>
        </div>
      )}
    </div>
  );
}
