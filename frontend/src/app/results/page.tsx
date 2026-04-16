'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, X, Trophy, Search } from 'lucide-react';
import api from '@/lib/api';
import { Certificate } from '@/types';

export default function ResultsPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [lightbox, setLightbox] = useState<Certificate | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('certificates/').then(r => setCertificates(r.data.results || r.data)).catch(() => {});
  }, []);

  const filtered = search.trim()
    ? certificates.filter(c =>
        c.student_name.toLowerCase().includes(search.toLowerCase()) ||
        c.certificate_name.toLowerCase().includes(search.toLowerCase())
      )
    : certificates;

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="badge badge-accent mb-3 inline-flex items-center gap-1">
            <Trophy size={14} /> Natijalar
          </span>
          <h1 className="section-title">O&apos;quvchilarimiz natijalari</h1>
          <p className="section-subtitle">IELTS, CEFR va boshqa imtihonlarda erishilgan natijalar</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="O'quvchi yoki sertifikat nomi..."
              className="input-field pl-11"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="card text-center py-4">
            <Trophy size={24} className="text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-extrabold">{certificates.length}</p>
            <p className="text-xs text-text-secondary">Jami sertifikatlar</p>
          </div>
          <div className="card text-center py-4">
            <Award size={24} className="text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-extrabold">
              {certificates.filter(c => c.certificate_name.toLowerCase().includes('ielts')).length}
            </p>
            <p className="text-xs text-text-secondary">IELTS natijalari</p>
          </div>
          <div className="card text-center py-4">
            <Star size={24} className="text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-extrabold">
              {certificates.filter(c => c.certificate_name.toLowerCase().includes('cefr') || c.certificate_name.toLowerCase().includes('b2') || c.certificate_name.toLowerCase().includes('c1')).length}
            </p>
            <p className="text-xs text-text-secondary">CEFR natijalari</p>
          </div>
          <div className="card text-center py-4">
            <Award size={24} className="text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-extrabold">
              {certificates.filter(c => !c.certificate_name.toLowerCase().includes('ielts') && !c.certificate_name.toLowerCase().includes('cefr')).length}
            </p>
            <p className="text-xs text-text-secondary">Boshqa sertifikatlar</p>
          </div>
        </motion.div>

        {/* Certificates grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              onClick={() => setLightbox(cert)}
              className="card card-glow text-center group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="w-full aspect-[3/4] bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                {cert.image ? (
                  <img src={cert.image} alt={cert.student_name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <Award size={48} className="text-primary/20" />
                )}
              </div>
              <h3 className="font-bold text-lg">{cert.student_name}</h3>
              <p className="text-primary text-sm font-medium">{cert.certificate_name}</p>
              {cert.score && (
                <div className="mt-2 inline-flex items-center gap-1 bg-accent/10 text-accent-dark font-bold text-lg px-3 py-1 rounded-lg">
                  <Star size={16} className="fill-accent text-accent" />{cert.score}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Award size={48} className="text-text-secondary/30 mx-auto mb-4" />
            <p className="text-text-secondary text-lg">
              {search ? "Natija topilmadi" : "Hozircha natijalar yo'q"}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl">{lightbox.student_name}</h3>
                  <button onClick={() => setLightbox(null)} className="p-2 hover:bg-bg-secondary rounded-xl">
                    <X size={20} />
                  </button>
                </div>
                {lightbox.image ? (
                  <img src={lightbox.image} alt={lightbox.student_name} className="w-full max-h-[70vh] object-contain rounded-xl mb-4 bg-bg-secondary" />
                ) : (
                  <div className="w-full aspect-[3/4] max-h-[60vh] bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl mb-4 flex items-center justify-center">
                    <Award size={80} className="text-primary/20" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-primary font-semibold text-lg">{lightbox.certificate_name}</p>
                  {lightbox.score && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-accent/10 text-accent-dark font-bold text-2xl px-5 py-2 rounded-xl">
                      <Star size={24} className="fill-accent text-accent" />{lightbox.score}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
