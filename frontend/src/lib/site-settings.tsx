'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import { SiteSettings } from '@/types';

const defaultSettings: SiteSettings = {
  id: 1,
  site_name: 'PolyglotLC',
  site_description: "Professional o'quv markazi",
  logo: null,
  phone_1: '+998 90 123 45 67',
  phone_2: '',
  email: 'info@polyglotlc.uz',
  address: 'Toshkent shahri',
  telegram: 'https://t.me/polyglotlc',
  instagram: 'https://instagram.com/polyglotlc',
  youtube: 'https://youtube.com/@polyglotlc',
  facebook: '',
  tiktok: '',
  weekday_hours: '09:00 - 21:00',
  weekend_hours: '10:00 - 18:00',
  weekday_label: 'Dushanba - Shanba',
  weekend_label: 'Yakshanba',
  hero_title: 'Kelajagingizni biz bilan boshlang!',
  hero_subtitle: "Ingliz tili, IT, matematika va boshqa yo'nalishlar bo'yicha professional ta'lim",
  hero_image: null,
  stats_students: '300+',
  stats_experience: '5+',
  stats_teachers: '30+',
  stats_branches: '2',
  meta_title: "PolyglotLC - Professional o'quv markazi",
  meta_description: '',
};

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    api.get('settings/')
      .then((r) => setSettings(r.data))
      .catch(() => {});
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
