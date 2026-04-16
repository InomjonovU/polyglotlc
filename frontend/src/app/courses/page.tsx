'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, CheckCircle, Loader2, AlertCircle, X } from 'lucide-react';
import api from '@/lib/api';
import { Course } from '@/types';
import PhoneInput, { getCleanPhone, isPhoneComplete } from '@/components/PhoneInput';

const filters = [
  { value: '', label: 'Barchasi' },
  { value: 'english', label: 'Ingliz tili' },
  { value: 'math', label: 'Matematika' },
  { value: 'history', label: 'Tarix' },
  { value: 'it', label: 'IT' },
  { value: 'russian', label: 'Rus tili' },
  { value: 'other', label: 'Boshqa' },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState('');
  const [applying, setApplying] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', phone: '+998 ' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = filter ? `?direction=${filter}` : '';
    api.get(`courses/${params}`).then((r) => setCourses(r.data.results || r.data)).catch(() => {});
  }, [filter]);

  const handleApply = async (courseId: number) => {
    setLoading(true);
    try {
      await api.post('applications/', { ...form, phone: getCleanPhone(form.phone), course: courseId });
      setSuccess(true);
      setApplying(null);
      setForm({ name: '', phone: '+998 ' });
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="badge badge-primary mb-3 inline-flex items-center gap-1">
            <BookOpen size={14} /> Kurslar
          </span>
          <h1 className="section-title">Bizning kurslar</h1>
          <p className="section-subtitle">O&apos;zingizga mos yo&apos;nalishni tanlang</p>
        </motion.div>

        {/* Filter */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 justify-center mb-10">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                filter === f.value
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-bg-secondary text-text-secondary hover:bg-primary-light hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl mb-8 text-center flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Arizangiz qabul qilindi! Admin siz bilan bog&apos;lanadi.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="card card-glow hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-full h-44 bg-gradient-to-br from-primary-light to-bg-secondary rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                {course.image ? (
                  <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <BookOpen size={48} className="text-primary/20 group-hover:scale-110 transition-transform" />
                )}
              </div>
              <span className="badge badge-primary mb-3">{course.direction_display}</span>
              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{course.name}</h3>
              <p className="text-text-secondary text-sm mt-2 line-clamp-3">{course.description}</p>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                <span className="text-primary font-bold text-lg">{course.price.toLocaleString()} <span className="text-sm font-normal text-text-secondary">so&apos;m/oy</span></span>
              </div>

              <AnimatePresence>
                {applying === course.id ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 flex flex-col gap-3 overflow-hidden"
                  >
                    <input
                      type="text"
                      placeholder="Ism va familiya"
                      className="input-field"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <PhoneInput
                      value={form.phone}
                      onChange={(v) => setForm({ ...form, phone: v })}
                      className="input-field"
                      required
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleApply(course.id)} disabled={loading} className="btn-primary text-sm flex-1">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Yuborish'}
                      </button>
                      <button onClick={() => setApplying(null)} className="p-2.5 rounded-xl border border-border hover:bg-bg-secondary transition-colors">
                        <X size={18} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button onClick={() => setApplying(course.id)} className="btn-primary w-full mt-4 text-sm">
                    Yozilish <ArrowRight size={16} />
                  </button>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {courses.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <AlertCircle size={48} className="text-text-secondary/30 mx-auto mb-4" />
            <p className="text-text-secondary text-lg">Hozircha kurslar yo&apos;q</p>
            <p className="text-text-secondary/60 text-sm mt-1">Tez orada yangi kurslar qo&apos;shiladi</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
