'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Users, ImagePlus, Award } from 'lucide-react';
import api from '@/lib/api';
import { Teacher, TeacherCertImage } from '@/types';

const directionOptions = [
  { value: 'english', label: 'Ingliz tili' },
  { value: 'math', label: 'Matematika' },
  { value: 'history', label: 'Tarix' },
  { value: 'it', label: 'IT / Dasturlash' },
  { value: 'russian', label: 'Rus tili' },
  { value: 'other', label: 'Boshqa' },
];

const emptyForm = {
  full_name: '', direction: 'english', bio: '', about: '',
  experience_years: '', certificates: '', photo: null as File | null,
};

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null);
  const [certImages, setCertImages] = useState<TeacherCertImage[]>([]);
  const [newCertFiles, setNewCertFiles] = useState<{ file: File; title: string }[]>([]);
  const [removedCertIds, setRemovedCertIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('teachers/').then((r) => setTeachers(r.data.results || r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(emptyForm);
    setExistingPhoto(null);
    setCertImages([]);
    setNewCertFiles([]);
    setRemovedCertIds([]);
    setEditing('new');
  };

  const openEdit = async (t: Teacher) => {
    setForm({
      full_name: t.full_name, direction: t.direction, bio: t.bio, about: t.about || '',
      experience_years: String(t.experience_years), certificates: t.certificates, photo: null,
    });
    setExistingPhoto(t.photo);
    setNewCertFiles([]);
    setRemovedCertIds([]);
    // Load certificate images
    try {
      const r = await api.get(`teachers/${t.id}/certificates/`);
      setCertImages(r.data.results || r.data);
    } catch { setCertImages([]); }
    setEditing(t.id);
  };

  const save = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('full_name', form.full_name);
      formData.append('direction', form.direction);
      formData.append('bio', form.bio);
      formData.append('about', form.about);
      formData.append('experience_years', form.experience_years);
      formData.append('certificates', form.certificates);
      if (form.photo) formData.append('photo', form.photo);

      let teacherId: number;
      if (editing === 'new') {
        const res = await api.post('teachers/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        teacherId = res.data.id;
      } else {
        await api.patch(`teachers/${editing}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        teacherId = editing as number;
      }

      // Delete removed certs
      for (const id of removedCertIds) {
        await api.delete(`teachers/${teacherId}/certificates/${id}/`).catch(() => {});
      }

      // Upload new cert images
      for (let i = 0; i < newCertFiles.length; i++) {
        const certData = new FormData();
        certData.append('image', newCertFiles[i].file);
        certData.append('title', newCertFiles[i].title || `Sertifikat ${i + 1}`);
        certData.append('order', String(certImages.length + i));
        await api.post(`teachers/${teacherId}/certificates/`, certData, { headers: { 'Content-Type': 'multipart/form-data' } }).catch(() => {});
      }

      setEditing(null);
      load();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: unknown } };
      const data = axiosErr?.response?.data;
      alert('Xatolik:\n' + (data ? JSON.stringify(data, null, 2) : "Noma'lum xatolik"));
    } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`teachers/${id}/`);
    load();
  };

  const addCertFile = (files: FileList | null) => {
    if (!files) return;
    const newOnes = Array.from(files).map(f => ({ file: f, title: f.name.replace(/\.[^/.]+$/, '') }));
    setNewCertFiles([...newCertFiles, ...newOnes]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">O&apos;qituvchilar boshqaruvi</h1>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={16} /> Yangi o&apos;qituvchi</button>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[95vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">{editing === 'new' ? "Yangi o'qituvchi" : "O'qituvchini tahrirlash"}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-bg-secondary rounded-lg"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">To&apos;liq ism</label>
                  <input className="input-field" placeholder="Alisher Karimov" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Yo&apos;nalish</label>
                    <select className="input-field" value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}>
                      {directionOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Tajriba (yil)</label>
                    <input className="input-field" type="number" placeholder="5" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Qisqacha bio</label>
                <textarea className="input-field" rows={2} placeholder="Qisqacha ma'lumot..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Batafsil ma&apos;lumot <span className="font-normal text-text-secondary">(inner sahifa uchun)</span></label>
                <textarea className="input-field" rows={5} placeholder="O'qituvchi haqida to'liq ma'lumot..." value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Sertifikatlar <span className="font-normal text-text-secondary">(vergul bilan)</span></label>
                <input className="input-field" placeholder="IELTS 8.5, CELTA, TKT" value={form.certificates} onChange={(e) => setForm({ ...form, certificates: e.target.value })} />
              </div>

              {/* Photo */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Profil rasmi</label>
                {existingPhoto && !form.photo && (
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-bg-secondary group">
                      <img src={existingPhoto} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setExistingPhoto(null)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                    <span className="text-xs text-text-secondary">Mavjud rasm</span>
                  </div>
                )}
                {form.photo && (
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-bg-secondary group">
                      <img src={URL.createObjectURL(form.photo)} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setForm({ ...form, photo: null })}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                    <span className="text-xs text-text-secondary">Yangi rasm</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="input-field" onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })} />
              </div>

              {/* Certificate images */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award size={18} className="text-amber-500" />
                  <label className="text-sm font-semibold">Sertifikat rasmlari</label>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  {/* Existing images */}
                  {certImages.filter(c => !removedCertIds.includes(c.id)).map(cert => (
                    <div key={`e-${cert.id}`} className="relative w-28 h-28 rounded-xl overflow-hidden bg-bg-secondary group">
                      <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                      <button onClick={() => setRemovedCertIds([...removedCertIds, cert.id])}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                      <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1 py-0.5 truncate">{cert.title}</p>
                    </div>
                  ))}
                  {/* New files */}
                  {newCertFiles.map((item, i) => (
                    <div key={`n-${i}`} className="relative group">
                      <div className="w-28 h-28 rounded-xl overflow-hidden bg-bg-secondary">
                        <img src={URL.createObjectURL(item.file)} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => setNewCertFiles(newCertFiles.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={e => { const u = [...newCertFiles]; u[i] = { ...u[i], title: e.target.value }; setNewCertFiles(u); }}
                        className="w-28 text-[10px] mt-1 px-1 py-0.5 border border-border rounded-md"
                        placeholder="Nomi"
                      />
                    </div>
                  ))}
                  {/* Add button */}
                  <label className="w-28 h-28 rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center text-text-secondary hover:text-primary transition-colors">
                    <ImagePlus size={20} />
                    <span className="text-xs mt-1">Qo&apos;shish</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={e => addCertFile(e.target.files)} />
                  </label>
                </div>
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
