'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Users } from 'lucide-react';
import api from '@/lib/api';
import { Teacher } from '@/types';

const directionOptions = [
  { value: 'english', label: 'Ingliz tili' },
  { value: 'math', label: 'Matematika' },
  { value: 'history', label: 'Tarix' },
  { value: 'it', label: 'IT / Dasturlash' },
  { value: 'russian', label: 'Rus tili' },
  { value: 'other', label: 'Boshqa' },
];

const emptyForm = {
  full_name: '', direction: 'english', bio: '',
  experience_years: '', certificates: '', photo: null as File | null,
};

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('teachers/').then((r) => setTeachers(r.data.results || r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyForm); setEditing('new'); };
  const openEdit = (t: Teacher) => {
    setForm({
      full_name: t.full_name, direction: t.direction, bio: t.bio,
      experience_years: String(t.experience_years), certificates: t.certificates, photo: null,
    });
    setEditing(t.id);
  };

  const save = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('full_name', form.full_name);
      formData.append('direction', form.direction);
      formData.append('bio', form.bio);
      formData.append('experience_years', form.experience_years);
      formData.append('certificates', form.certificates);
      if (form.photo) formData.append('photo', form.photo);

      if (editing === 'new') {
        await api.post('teachers/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.patch(`teachers/${editing}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setEditing(null);
      load();
    } catch { alert('Xatolik'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`teachers/${id}/`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">O&apos;qituvchilar boshqaruvi</h1>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={16} /> Yangi o&apos;qituvchi</button>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">{editing === 'new' ? "Yangi o'qituvchi" : "O'qituvchini tahrirlash"}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-bg-secondary rounded-lg"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">To&apos;liq ism</label>
                <input className="input-field" placeholder="Alisher Karimov" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Yo&apos;nalish</label>
                <select className="input-field" value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}>
                  {directionOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Biografiya</label>
                <textarea className="input-field" rows={4} placeholder="O'qituvchi haqida ma'lumot..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Tajriba (yil)</label>
                <input className="input-field" type="number" placeholder="5" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Sertifikatlar <span className="font-normal text-text-secondary">(vergul bilan)</span></label>
                <input className="input-field" placeholder="IELTS 8.5, CELTA, TKT" value={form.certificates} onChange={(e) => setForm({ ...form, certificates: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Rasm</label>
                <input type="file" accept="image/*" className="input-field" onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })} />
                {editing !== 'new' && !form.photo && (
                  <p className="text-xs text-text-secondary mt-1">Mavjud rasmni saqlab qolish uchun yangi rasm tanlamang</p>
                )}
              </div>
              <button onClick={save} disabled={saving} className="btn-primary w-full">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saqlanmoqda...</> : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <div key={t.id} className="card group">
            <div className="w-full aspect-[3/4] rounded-xl bg-bg-secondary flex items-center justify-center overflow-hidden mb-3">
              {t.photo ? (
                <img src={t.photo} alt={t.full_name} className="w-full h-full object-cover object-top" />
              ) : (
                <Users size={40} className="text-text-secondary/20" />
              )}
            </div>
            <h3 className="font-bold truncate">{t.full_name}</h3>
            <span className="badge badge-primary text-xs mt-1">{t.direction_display}</span>
            <p className="text-text-secondary text-xs mt-1 line-clamp-2">{t.bio}</p>
            {t.experience_years > 0 && (
              <p className="text-xs text-text-secondary mt-1">{t.experience_years} yillik tajriba</p>
            )}
            <div className="flex gap-2 mt-4 pt-3 border-t border-border">
              <button onClick={() => openEdit(t)} className="flex-1 text-sm text-primary hover:bg-primary-light py-1.5 rounded-lg transition-colors font-medium">
                <Pencil size={14} className="inline mr-1" /> Tahrirlash
              </button>
              <button onClick={() => remove(t.id)} className="text-sm text-red-500 hover:bg-red-50 py-1.5 px-3 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {teachers.length === 0 && <p className="text-center text-text-secondary py-10">O&apos;qituvchilar yo&apos;q</p>}
    </div>
  );
}
