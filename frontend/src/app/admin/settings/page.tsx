'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2, Phone, Mail, Globe, Clock, BarChart3, Type, Image } from 'lucide-react';
import api from '@/lib/api';
import { SiteSettings } from '@/types';

type Tab = 'general' | 'contact' | 'social' | 'hours' | 'hero' | 'stats';

const tabs: { value: Tab; label: string; icon: React.ReactNode }[] = [
  { value: 'general', label: 'Umumiy', icon: <Type size={16} /> },
  { value: 'contact', label: 'Aloqa', icon: <Phone size={16} /> },
  { value: 'social', label: 'Ijtimoiy tarmoqlar', icon: <Globe size={16} /> },
  { value: 'hours', label: 'Ish vaqti', icon: <Clock size={16} /> },
  { value: 'hero', label: 'Bosh sahifa', icon: <Image size={16} /> },
  { value: 'stats', label: 'Statistika', icon: <BarChart3 size={16} /> },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<Tab>('general');

  useEffect(() => {
    api.get('settings/').then((r) => {
      setSettings(r.data);
      const { id, logo, hero_image, ...rest } = r.data;
      const stringified: Record<string, string> = {};
      for (const [key, val] of Object.entries(rest)) {
        stringified[key] = val != null ? String(val) : '';
      }
      setForm(stringified);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      for (const [key, val] of Object.entries(form)) {
        formData.append(key, val);
      }
      if (logoFile) formData.append('logo', logoFile);
      if (heroImageFile) formData.append('hero_image', heroImageFile);

      const res = await api.patch('settings/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSettings(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  const renderField = (label: string, key: string, type: 'text' | 'email' | 'url' | 'textarea' = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea
          className="input-field"
          rows={3}
          placeholder={placeholder}
          value={form[key] || ''}
          onChange={(e) => updateField(key, e.target.value)}
        />
      ) : (
        <input
          type={type}
          className="input-field"
          placeholder={placeholder}
          value={form[key] || ''}
          onChange={(e) => updateField(key, e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sayt sozlamalari</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
          {saving ? (
            <><Loader2 size={16} className="animate-spin" /> Saqlanmoqda...</>
          ) : saved ? (
            <><Save size={16} /> Saqlandi ✓</>
          ) : (
            <><Save size={16} /> Saqlash</>
          )}
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
          ✓ Sozlamalar muvaffaqiyatli saqlandi!
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              tab === t.value
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white text-text-secondary hover:bg-bg-secondary'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === 'general' && (
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-lg border-b border-border pb-3">Umumiy sozlamalar</h3>
            {renderField('Sayt nomi', 'site_name', 'text', 'PolyglotLC')}
            {renderField('Sayt tavsifi', 'site_description', 'textarea', "Professional o'quv markazi")}
            <div>
              <label className="block text-sm font-semibold mb-1.5">Logo</label>
              {settings.logo && (
                <img src={settings.logo} alt="Logo" className="w-20 h-20 object-contain rounded-xl bg-bg-secondary mb-2" />
              )}
              <input type="file" accept="image/*" className="input-field" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            </div>
            {renderField('Meta sarlavha (SEO)', 'meta_title', 'text', 'PolyglotLC - Professional o\'quv markazi')}
            {renderField('Meta tavsif (SEO)', 'meta_description', 'textarea', 'Sayt haqida qisqacha...')}
          </div>
        )}

        {tab === 'contact' && (
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-lg border-b border-border pb-3">Aloqa ma&apos;lumotlari</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Telefon 1 (asosiy)', 'phone_1', 'text', '+998 90 123 45 67')}
              {renderField('Telefon 2 (qo\'shimcha)', 'phone_2', 'text', '+998 90 123 45 68')}
            </div>
            {renderField('Email', 'email', 'email', 'info@polyglotlc.uz')}
            {renderField('Manzil', 'address', 'textarea', 'Toshkent shahri, Chilonzor tumani')}
          </div>
        )}

        {tab === 'social' && (
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-lg border-b border-border pb-3">Ijtimoiy tarmoqlar</h3>
            {renderField('Telegram', 'telegram', 'url', 'https://t.me/polyglotlc')}
            {renderField('Instagram', 'instagram', 'url', 'https://instagram.com/polyglotlc')}
            {renderField('YouTube', 'youtube', 'url', 'https://youtube.com/@polyglotlc')}
            {renderField('Facebook', 'facebook', 'url', 'https://facebook.com/polyglotlc')}
            {renderField('TikTok', 'tiktok', 'url', 'https://tiktok.com/@polyglotlc')}
          </div>
        )}

        {tab === 'hours' && (
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-lg border-b border-border pb-3">Ish vaqti</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Ish kunlari nomi', 'weekday_label', 'text', 'Dushanba - Shanba')}
              {renderField('Ish kunlari soati', 'weekday_hours', 'text', '09:00 - 21:00')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Dam olish kuni nomi', 'weekend_label', 'text', 'Yakshanba')}
              {renderField('Dam olish kuni soati', 'weekend_hours', 'text', '10:00 - 18:00')}
            </div>
          </div>
        )}

        {tab === 'hero' && (
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-lg border-b border-border pb-3">Bosh sahifa (Hero)</h3>
            {renderField('Sarlavha', 'hero_title', 'text', 'Kelajagingizni biz bilan boshlang!')}
            {renderField('Qo\'shimcha matn', 'hero_subtitle', 'textarea', "Ingliz tili, IT va boshqa yo'nalishlar...")}
            <div>
              <label className="block text-sm font-semibold mb-1.5">Hero rasmi</label>
              {settings.hero_image && (
                <img src={settings.hero_image} alt="Hero" className="w-full max-w-sm h-40 object-cover rounded-xl bg-bg-secondary mb-2" />
              )}
              <input type="file" accept="image/*" className="input-field" onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)} />
            </div>
          </div>
        )}

        {tab === 'stats' && (
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-lg border-b border-border pb-3">Statistika raqamlari</h3>
            <p className="text-sm text-text-secondary">Bu raqamlar bosh sahifada va boshqa joylarda ko&apos;rsatiladi</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderField("O'quvchilar soni", 'stats_students', 'text', '300+')}
              {renderField('Tajriba (yil)', 'stats_experience', 'text', '5+')}
              {renderField("O'qituvchilar soni", 'stats_teachers', 'text', '30+')}
              {renderField('Filiallar soni', 'stats_branches', 'text', '2')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
