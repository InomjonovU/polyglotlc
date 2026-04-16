'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Award, ChevronLeft, Briefcase, BookOpen, X, Star,
} from 'lucide-react';
import api from '@/lib/api';
import { Teacher, TeacherCertImage } from '@/types';

export default function TeacherDetailPage() {
  const params = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [lightbox, setLightbox] = useState<TeacherCertImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`teachers/${params.id}/`)
      .then(r => setTeacher(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-24 md:pt-28 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="pt-24 md:pt-28 pb-16 min-h-screen flex flex-col items-center justify-center">
        <Users size={48} className="text-text-secondary/30 mb-4" />
        <p className="text-text-secondary text-lg">O&apos;qituvchi topilmadi</p>
        <Link href="/teachers" className="btn-outline mt-4 text-sm">
          <ChevronLeft size={16} /> Orqaga
        </Link>
      </div>
    );
  }

  const certImages = teacher.certificate_images || [];

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container-custom">
        {/* Back link */}
        <Link href="/teachers" className="inline-flex items-center gap-1 text-text-secondary hover:text-primary text-sm mb-6 transition-colors">
          <ChevronLeft size={16} /> Barcha o&apos;qituvchilar
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Photo & basic info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card sticky top-24">
              <div className="w-full aspect-[3/4] bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                {teacher.photo ? (
                  <img src={teacher.photo} alt={teacher.full_name} className="w-full h-full object-cover object-top" />
                ) : (
                  <Users size={80} className="text-primary/20" />
                )}
              </div>
              <h1 className="text-2xl font-extrabold">{teacher.full_name}</h1>
              <span className="badge badge-primary mt-2 inline-block">{teacher.direction_display}</span>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                {teacher.experience_years > 0 && (
                  <div className="bg-bg-secondary rounded-xl p-3 text-center">
                    <Briefcase size={18} className="text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold">{teacher.experience_years}+</p>
                    <p className="text-xs text-text-secondary">Yil tajriba</p>
                  </div>
                )}
                {certImages.length > 0 && (
                  <div className="bg-bg-secondary rounded-xl p-3 text-center">
                    <Award size={18} className="text-amber-500 mx-auto mb-1" />
                    <p className="text-lg font-bold">{certImages.length}</p>
                    <p className="text-xs text-text-secondary">Sertifikat</p>
                  </div>
                )}
              </div>

              {/* Certificates tags */}
              {teacher.certificates_list && teacher.certificates_list.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-text-secondary mb-2">Sertifikatlar</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.certificates_list.map((cert, i) => (
                      <span key={i} className="badge badge-accent text-xs">
                        <Star size={10} className="fill-accent text-accent" /> {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right — Bio, About, Certificate images */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-2"
          >
            {/* Bio */}
            <div className="card mb-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={20} className="text-primary" />
                <h2 className="text-lg font-bold">Haqida</h2>
              </div>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {teacher.about || teacher.bio || "Ma'lumot hali qo'shilmagan."}
              </p>
            </div>

            {/* Short bio if about exists */}
            {teacher.about && teacher.bio && (
              <div className="card mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={20} className="text-primary" />
                  <h2 className="text-lg font-bold">Qisqacha</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">{teacher.bio}</p>
              </div>
            )}

            {/* Certificate images */}
            {certImages.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={20} className="text-amber-500" />
                  <h2 className="text-lg font-bold">Sertifikatlar galereyasi</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {certImages.map((cert) => (
                    <motion.div
                      key={cert.id}
                      whileHover={{ y: -4 }}
                      className="cursor-pointer group"
                      onClick={() => setLightbox(cert)}
                    >
                      <div className="w-full aspect-[3/4] bg-bg-secondary rounded-xl overflow-hidden">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-sm font-medium mt-2 text-center group-hover:text-primary transition-colors">
                        {cert.title}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {certImages.length === 0 && (
              <div className="card text-center py-10">
                <Award size={48} className="text-text-secondary/20 mx-auto mb-3" />
                <p className="text-text-secondary">Sertifikat rasmlari hali qo&apos;shilmagan</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl">{lightbox.title}</h3>
                  <button onClick={() => setLightbox(null)} className="p-2 hover:bg-bg-secondary rounded-xl">
                    <X size={20} />
                  </button>
                </div>
                <img
                  src={lightbox.image}
                  alt={lightbox.title}
                  className="w-full max-h-[75vh] object-contain rounded-xl bg-bg-secondary"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
