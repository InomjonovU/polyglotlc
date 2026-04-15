'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import api from '@/lib/api';
import { Teacher } from '@/types';

const filters = [
  { value: '', label: 'Barchasi' },
  { value: 'english', label: 'Ingliz tili' },
  { value: 'math', label: 'Matematika' },
  { value: 'history', label: 'Tarix' },
  { value: 'it', label: 'IT' },
  { value: 'russian', label: 'Rus tili' },
  { value: 'other', label: 'Boshqa' },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const params = filter ? `?direction=${filter}` : '';
    api.get(`teachers/${params}`).then((r) => setTeachers(r.data.results || r.data)).catch(() => {});
  }, [filter]);

  return (
    <div className="pt-24 md:pt-28 pb-10">
      <div className="container-custom">
        <h1 className="section-title text-center">O&apos;qituvchilarimiz</h1>
        <p className="section-subtitle text-center mb-8">Tajribali va sertifikatlangan mutaxassislar</p>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-[var(--bg-secondary)] text-text-secondary hover:bg-[var(--primary-light)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teachers.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card group hover:border-primary transition-all"
            >
              <div className="w-full aspect-[3/4] bg-[var(--primary-light)] rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                {teacher.photo ? (
                  <img
                    src={teacher.photo}
                    alt={teacher.full_name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Users size={56} className="text-primary/30" />
                )}
              </div>
              <h3 className="text-lg font-bold">{teacher.full_name}</h3>
              <p className="text-primary text-sm font-medium">{teacher.direction_display}</p>
              {teacher.experience_years > 0 && (
                <p className="text-text-secondary text-xs mt-1">{teacher.experience_years} yillik tajriba</p>
              )}
              <p className="text-text-secondary text-sm mt-2 line-clamp-2">{teacher.bio}</p>
              {teacher.certificates_list && teacher.certificates_list.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {teacher.certificates_list.map((cert, j) => (
                    <span key={j} className="badge badge-accent text-xs">{cert}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {teachers.length === 0 && (
          <p className="text-center text-text-secondary py-10">Ma&apos;lumotlar yuklanmoqda...</p>
        )}
      </div>
    </div>
  );
}
