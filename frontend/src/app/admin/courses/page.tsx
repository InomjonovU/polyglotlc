'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { Course } from '@/types';

const directionOptions = [
  { value: 'english', label: 'Ingliz tili' },
  { value: 'math', label: 'Matematika' },
  { value: 'history', label: 'Tarix' },
  { value: 'it', label: 'IT / Dasturlash' },
  { value: 'russian', label: 'Rus tili' },
  { value: 'other', label: 'Boshqa' },
];

const emptyForm = { name: '', direction: 'english', description: '', price: '', status: 'published', image: null as File | null };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('courses/').then((r) => setCourses(r.data.results || r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyForm); setEditing('new'); };
  const openEdit = (c: Course) => {
    setForm({ name: c.name, direction: c.direction, description: c.description, price: String(c.price), status: c.status, image: null });
    setEditing(c.id);
  };

  const save = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('direction', form.direction);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('status', form.status);
      if (form.image) formData.append('image', form.image);

      if (editing === 'new') {
        await api.post('courses/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.patch(`courses/${editing}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setEditing(null);
      load();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: unknown } };
      const data = axiosErr?.response?.data;
      const msg = data
        ? typeof data === 'string'
          ? data
          : JSON.stringify(data, null, 2)
        : "Noma'lum xatolik";
      alert('Xatolik:\n' + msg);
    }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`courses/${id}/`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kurslar boshqaruvi</h1>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={16} /> Yangi kurs</button>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">{editing === 'new' ? 'Yangi kurs' : "Kursni tahrirlash"}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-bg-secondary rounded-lg"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Fan nomi</label>
                <input className="input-field" placeholder="IELTS Preparation" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Yo&apos;nalish</label>
                <select className="input-field" value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}>
                  {directionOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Tavsif</label>
                <textarea className="input-field" rows={4} placeholder="Kurs haqida..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Narx (so&apos;m/oy)</label>
                <input className="input-field" type="number" placeholder="500000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Rasm</label>
                <input type="file" accept="image/*" className="input-field" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Holat</label>
                <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="published">Nashr qilingan</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <button onClick={save} disabled={saving} className="btn-primary w-full">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saqlanmoqda...</> : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium">Nomi</th>
              <th className="text-left py-3 px-2 font-medium">Yo&apos;nalish</th>
              <th className="text-left py-3 px-2 font-medium">Narx</th>
              <th className="text-left py-3 px-2 font-medium">Holat</th>
              <th className="text-right py-3 px-2 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-border last:border-0 hover:bg-bg-secondary transition-colors">
                <td className="py-3 px-2 font-medium">{course.name}</td>
                <td className="py-3 px-2">{course.direction_display}</td>
                <td className="py-3 px-2">{course.price.toLocaleString()} so&apos;m</td>
                <td className="py-3 px-2">
                  <span className={`badge text-xs ${course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {course.status === 'published' ? 'Nashr' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <button onClick={() => openEdit(course)} className="p-1.5 text-primary hover:bg-primary-light rounded-lg mr-1"><Pencil size={16} /></button>
                  <button onClick={() => remove(course.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && <p className="text-center text-text-secondary py-6">Kurslar yo&apos;q</p>}
      </div>
    </div>
  );
}
