'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Award } from 'lucide-react';
import api from '@/lib/api';
import { Certificate } from '@/types';

const emptyForm = { student_name: '', certificate_name: '', score: '', image: null as File | null };

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('certificates/').then((r) => setCerts(r.data.results || r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyForm); setEditing('new'); };
  const openEdit = (c: Certificate) => {
    setForm({ student_name: c.student_name, certificate_name: c.certificate_name, score: String(c.score), image: null });
    setEditing(c.id);
  };

  const save = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('student_name', form.student_name);
      formData.append('certificate_name', form.certificate_name);
      formData.append('score', form.score);
      if (form.image) formData.append('image', form.image);

      if (editing === 'new') {
        await api.post('certificates/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.patch(`certificates/${editing}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setEditing(null);
      load();
    } catch { alert('Xatolik'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`certificates/${id}/`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sertifikatlar boshqaruvi</h1>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={16} /> Yangi sertifikat</button>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">{editing === 'new' ? 'Yangi sertifikat' : 'Sertifikatni tahrirlash'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-bg-secondary rounded-lg"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Talaba ismi</label>
                <input className="input-field" placeholder="Jasur Olimov" value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Sertifikat nomi</label>
                <input className="input-field" placeholder="IELTS Academic" value={form.certificate_name} onChange={(e) => setForm({ ...form, certificate_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Ball / Natija</label>
                <input className="input-field" placeholder="7.5" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Sertifikat rasmi</label>
                <input type="file" accept="image/*" className="input-field" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
              </div>
              <button onClick={save} disabled={saving} className="btn-primary w-full">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saqlanmoqda...</> : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((c) => (
          <div key={c.id} className="card group">
            <div className="w-full aspect-[3/4] bg-bg-secondary rounded-xl mb-3 flex items-center justify-center overflow-hidden">
              {c.image ? (
                <img src={c.image} alt={c.student_name} className="w-full h-full object-cover object-top" />
              ) : (
                <Award size={36} className="text-text-secondary/20" />
              )}
            </div>
            <h3 className="font-bold">{c.student_name}</h3>
            <p className="text-sm text-primary font-medium">{c.certificate_name}</p>
            <p className="text-lg font-bold text-accent mt-1">{c.score}</p>
            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
              <button onClick={() => openEdit(c)} className="flex-1 text-sm text-primary hover:bg-primary-light py-1.5 rounded-lg transition-colors font-medium">
                <Pencil size={14} className="inline mr-1" /> Tahrirlash
              </button>
              <button onClick={() => remove(c.id)} className="text-sm text-red-500 hover:bg-red-50 py-1.5 px-3 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {certs.length === 0 && <p className="text-center text-text-secondary py-10">Sertifikatlar yo&apos;q</p>}
    </div>
  );
}
