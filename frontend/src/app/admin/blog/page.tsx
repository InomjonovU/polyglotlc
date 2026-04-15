'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, ImagePlus } from 'lucide-react';
import api from '@/lib/api';
import { BlogPost } from '@/types';
import RichTextEditor from '@/components/RichTextEditor';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState({ title: '', category: 'news', content: '', status: 'draft' });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [extraImages, setExtraImages] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('blog/posts/').then((r) => setPosts(r.data.results || r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ title: '', category: 'news', content: '', status: 'draft' });
    setCoverImage(null);
    setExtraImages([]);
    setEditing('new');
  };

  const openEdit = (p: BlogPost) => {
    setForm({ title: p.title, category: p.category, content: p.content, status: p.status });
    setCoverImage(null);
    setExtraImages([]);
    setEditing(p.id);
  };

  const save = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('category', form.category);
      formData.append('content', form.content);
      formData.append('status', form.status);
      if (coverImage) formData.append('image', coverImage);

      let savedPost: BlogPost;
      if (editing === 'new') {
        const res = await api.post('blog/posts/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        savedPost = res.data;
      } else {
        const slug = posts.find(p => p.id === editing)?.slug;
        const res = await api.patch(`blog/posts/${slug}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        savedPost = res.data;
      }

      // Upload extra images
      if (extraImages.length > 0 && savedPost.slug) {
        for (let i = 0; i < extraImages.length; i++) {
          const imgData = new FormData();
          imgData.append('image', extraImages[i]);
          imgData.append('order', String(i));
          await api.post(`blog/posts/${savedPost.slug}/images/`, imgData, { headers: { 'Content-Type': 'multipart/form-data' } }).catch(() => {});
        }
      }

      setEditing(null);
      load();
    } catch { alert('Xatolik'); }
    finally { setSaving(false); }
  };

  const remove = async (slug: string) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`blog/posts/${slug}/`);
    load();
  };

  const addExtraImages = (files: FileList | null) => {
    if (files) setExtraImages([...extraImages, ...Array.from(files)]);
  };

  const removeExtraImage = (index: number) => {
    setExtraImages(extraImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog boshqaruvi</h1>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={16} /> Yangi maqola</button>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[95vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">{editing === 'new' ? 'Yangi maqola' : 'Maqolani tahrirlash'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-bg-secondary rounded-lg"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Sarlavha</label>
                  <input className="input-field" placeholder="Maqola sarlavhasi" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Kategoriya</label>
                    <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      <option value="news">Markaz yangiliklari</option>
                      <option value="english">Ingliz tili</option>
                      <option value="it">IT</option>
                      <option value="math">Matematika</option>
                      <option value="other">Boshqa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Holat</label>
                    <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="draft">Draft</option>
                      <option value="published">Nashr qilish</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Asosiy rasm</label>
                <input type="file" accept="image/*" className="input-field" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Matn</label>
                <RichTextEditor value={form.content} onChange={(val) => setForm({ ...form, content: val })} placeholder="Maqola matni..." />
              </div>

              {/* Extra images */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Qo&apos;shimcha rasmlar</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {extraImages.map((file, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-bg-secondary group">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeExtraImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center text-text-secondary hover:text-primary transition-colors">
                    <ImagePlus size={20} />
                    <span className="text-xs mt-1">Qo&apos;shish</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addExtraImages(e.target.files)} />
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

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium">Sarlavha</th>
              <th className="text-left py-3 px-2 font-medium">Kategoriya</th>
              <th className="text-left py-3 px-2 font-medium">Holat</th>
              <th className="text-left py-3 px-2 font-medium">Sana</th>
              <th className="text-right py-3 px-2 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border last:border-0 hover:bg-bg-secondary transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    {post.image && (
                      <img src={post.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <span className="font-medium">{post.title}</span>
                  </div>
                </td>
                <td className="py-3 px-2">{post.category_display}</td>
                <td className="py-3 px-2">
                  <span className={`badge text-xs ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {post.status === 'published' ? 'Nashr' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 px-2 text-text-secondary">{new Date(post.created_at).toLocaleDateString('uz')}</td>
                <td className="py-3 px-2 text-right">
                  <button onClick={() => openEdit(post)} className="p-1.5 text-primary hover:bg-primary-light rounded-lg mr-1"><Pencil size={16} /></button>
                  <button onClick={() => remove(post.slug)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="text-center text-text-secondary py-6">Maqolalar yo&apos;q</p>}
      </div>
    </div>
  );
}
