'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Users, BookOpen, Building2,
  ChevronLeft, ChevronRight,
  ChevronDown, Award, Star,
  ArrowRight, Sparkles, TrendingUp, Target, X,
  Calendar, Clock
} from 'lucide-react';
import api from '@/lib/api';
import { Course, Teacher, Certificate, BlogPost } from '@/types';

/* ───── Animated counter ───── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ───── Fade-in wrapper ───── */
function FadeIn({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' }) {
  const dirMap = { up: { y: 40 }, down: { y: -40 }, left: { x: 40 }, right: { x: -40 } };
  return (
    <motion.div initial={{ opacity: 0, ...dirMap[direction] }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function StaggerContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }} className={className}>
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }} className={className}>
      {children}
    </motion.div>
  );
}

/* ───── Hero slides with images ───── */
const heroSlides = [
  {
    title: "Kelajakka qadam qo'ying!",
    subtitle: "PolyglotLC bilan til va IT sohasida professional bilim oling.",
    cta: "Kurslarni ko'rish",
    href: '/courses',
    icon: <GraduationCap size={24} />,
    emoji: '🎓',
  },
  {
    title: 'IELTS, CEFR va IT kurslari',
    subtitle: "Tajribali o'qituvchilar nazoratida o'z sohangizdagi eng yaxshi natijaga erishing.",
    cta: "Ro'yxatdan o'tish",
    href: '/register',
    icon: <TrendingUp size={24} />,
    emoji: '📚',
  },
  {
    title: "O'z darajangizni tekshiring!",
    subtitle: "IELTS Mock yoki CEFR Test topshirib, real natijangizni bilib oling.",
    cta: 'Mock testga yozilish',
    href: '/mock',
    icon: <Target size={24} />,
    emoji: '🎯',
  },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [news, setNews] = useState<BlogPost[]>([]);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<Certificate | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get('courses/?status=published').then((r) => setCourses(r.data.results || r.data)).catch(() => {});
    api.get('teachers/').then((r) => setTeachers(r.data.results || r.data)).catch(() => {});
    api.get('certificates/').then((r) => setCertificates(r.data.results || r.data)).catch(() => {});
    api.get('blog/posts/?status=published').then((r) => setNews(r.data.results || r.data)).catch(() => {});
  }, []);

  const faqs = [
    { q: "Qanday qilib ro'yxatdan o'taman?", a: "Saytimizda 'Ro'yxatdan o'tish' tugmasini bosib, kerakli ma'lumotlarni to'ldirasiz. Keyin admin siz bilan bog'lanadi." },
    { q: "Kurslar narxi qancha?", a: "Har bir kurs narxi alohida belgilangan. Kurslar sahifamizda to'liq ma'lumot bor." },
    { q: "Online darslar bormi?", a: "Ha, ba'zi kurslarimiz online formatda ham o'tiladi. Batafsil ma'lumot uchun aloqaga chiqing." },
    { q: "IELTS Mock test qanday o'tkaziladi?", a: "Mock test real IELTS formatida o'tkaziladi. Natijalaringiz 2-3 kun ichida tayyor bo'ladi." },
    { q: "Bonus tizimi qanday ishlaydi?", a: "Do'stingizni taklif qilsangiz +100 ball olasiz. Balllarni sovg'alarga almashtirish mumkin." },
  ];

  const prevSlide = () => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setSlide((s) => (s + 1) % heroSlides.length);

  return (
    <>
      {/* ═══ HERO CAROUSEL ═══ */}
      <section className="relative gradient-hero text-white overflow-hidden mt-16 md:mt-20">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }} className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-white/[0.03] rounded-full" />
        </div>

        <div className="container-custom py-20 md:py-28 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left - Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
                  <Sparkles size={16} className="text-amber-400" />
                  <span className="text-blue-100">Professional o&apos;quv markazi</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                  {heroSlides[slide].title}
                </h1>
                <p className="mt-4 text-base md:text-lg text-blue-100/90 max-w-lg">
                  {heroSlides[slide].subtitle}
                </p>
                <Link href={heroSlides[slide].href} className="btn-accent mt-8 inline-flex items-center gap-2 text-lg animate-pulse-glow">
                  {heroSlides[slide].icon}
                  {heroSlides[slide].cta}
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Right - Animated illustration */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:flex items-center justify-center"
              >
                <div className="relative">
                  {/* Main circle */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-72 h-72 lg:w-80 lg:h-80 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl"
                  >
                    <span className="text-[120px]">{heroSlides[slide].emoji}</span>
                  </motion.div>
                  {/* Floating badges */}
                  <motion.div animate={{ y: [0, -8, 0], x: [0, 5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-3 text-sm font-bold shadow-lg">
                    300+ o&apos;quvchi
                  </motion.div>
                  <motion.div animate={{ y: [0, 10, 0], x: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-3 text-sm font-bold shadow-lg">
                    5+ yil tajriba
                  </motion.div>
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="absolute top-1/2 -right-8 glass rounded-full w-12 h-12 flex items-center justify-center">
                    <Star size={20} className="text-amber-400 fill-amber-400" />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 glass hover:bg-white/20 rounded-full p-3 transition">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 glass hover:bg-white/20 rounded-full p-3 transition">
          <ChevronRight size={24} />
        </button>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`h-2 rounded-full transition-all duration-300 ${i === slide ? 'bg-white w-8' : 'bg-white/40 w-2'}`} />
          ))}
        </div>
      </section>

      {/* ═══ STATISTIKA ═══ */}
      <section className="py-16 bg-bg-secondary">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Users size={28} />, num: 300, suffix: '+', label: "O'quvchilar", color: 'from-blue-500 to-blue-600' },
              { icon: <BookOpen size={28} />, num: 5, suffix: '+', label: "Yillik tajriba", color: 'from-emerald-500 to-emerald-600' },
              { icon: <GraduationCap size={28} />, num: 30, suffix: '+', label: "O'qituvchilar", color: 'from-purple-500 to-purple-600' },
              { icon: <Building2 size={28} />, num: 2, suffix: '', label: 'Filiallar', color: 'from-amber-500 to-amber-600' },
            ].map((s, i) => (
              <StaggerItem key={i}>
                <div className="card card-glow text-center py-6 group">
                  <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {s.icon}
                  </div>
                  <div className="text-3xl font-extrabold text-text"><AnimatedNumber target={s.num} suffix={s.suffix} /></div>
                  <p className="text-text-secondary mt-1 text-sm font-medium">{s.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ KURSLAR PREVIEW ═══ */}
      <section className="py-20">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="badge badge-primary mb-3 inline-flex items-center gap-1"><BookOpen size={14} /> Kurslar</span>
              <h2 className="section-title">Bizning kurslar</h2>
              <p className="section-subtitle">Eng mashhur yo&apos;nalishlar</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(courses.length > 0 ? courses.slice(0, 3) : [
              { id: 1, name: 'IELTS Preparation', direction_display: 'IELTS', description: "IELTS imtihoniga professional tayyorgarlik kursi.", price: 500000, image: null },
              { id: 2, name: 'Python dasturlash', direction_display: 'IT / Dasturlash', description: "Noldan Python dasturlash tilini o'rganing.", price: 400000, image: null },
              { id: 3, name: 'General English', direction_display: 'English', description: "Umumiy ingliz tili kursi, A1 dan C1 gacha.", price: 350000, image: null },
            ] as (Course | { id: number; name: string; direction_display: string; description: string; price: number; image: null })[]).map((course) => (
              <StaggerItem key={course.id}>
                <div className="card card-glow group hover:-translate-y-2 transition-all duration-300">
                  <div className="w-full h-44 bg-gradient-to-br from-primary-light to-bg-secondary rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    {course.image ? <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <BookOpen size={48} className="text-primary/20" />}
                  </div>
                  <span className="badge badge-primary mb-3">{course.direction_display}</span>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{course.name}</h3>
                  <p className="text-text-secondary text-sm mt-2 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                    <span className="text-primary font-bold text-lg">{course.price.toLocaleString()} <span className="text-sm font-normal text-text-secondary">so&apos;m/oy</span></span>
                    <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn delay={0.3}><div className="text-center mt-10"><Link href="/courses" className="btn-outline">Barcha kurslar <ArrowRight size={18} /></Link></div></FadeIn>
        </div>
      </section>

      {/* ═══ YANGILIKLAR (was "Nima uchun biz") ═══ */}
      <section className="py-20 bg-bg-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container-custom relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="badge badge-accent mb-3 inline-flex items-center gap-1"><Calendar size={14} /> Yangiliklar</span>
              <h2 className="section-title">So&apos;nggi yangiliklar</h2>
              <p className="section-subtitle">O&apos;quv markazimiz hayotidan</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(news.length > 0 ? news.slice(0, 3) : [
              { id: 1, title: "IELTS imtihonida 8.0 ball olgan talabamiz", slug: '#', category_display: 'IELTS', content: '', image: null, created_at: new Date().toISOString(), reading_time: 3 },
              { id: 2, title: "Yangi IT kurslar boshlandi", slug: '#', category_display: 'IT', content: '', image: null, created_at: new Date().toISOString(), reading_time: 2 },
              { id: 3, title: "Ochiq eshiklar kuni e'lon qilindi", slug: '#', category_display: 'Yangiliklar', content: '', image: null, created_at: new Date().toISOString(), reading_time: 4 },
            ] as Pick<BlogPost, 'id' | 'title' | 'slug' | 'category_display' | 'content' | 'image' | 'created_at' | 'reading_time'>[]).map((post) => (
              <StaggerItem key={post.id}>
                <Link href={post.slug !== '#' ? `/blog/${post.slug}` : '/blog'} className="card card-glow group hover:-translate-y-2 transition-all duration-300 block">
                  <div className="w-full h-44 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    {post.image ? <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <Calendar size={48} className="text-primary/20" />}
                  </div>
                  <span className="badge badge-primary text-xs mb-2">{post.category_display}</span>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('uz')}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.reading_time} daqiqa</span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn delay={0.3}><div className="text-center mt-10"><Link href="/blog" className="btn-outline">Barcha yangiliklar <ArrowRight size={18} /></Link></div></FadeIn>
        </div>
      </section>

      {/* ═══ O'QITUVCHILAR ═══ */}
      <section className="py-20">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="badge badge-primary mb-3 inline-flex items-center gap-1"><Users size={14} /> Jamoamiz</span>
              <h2 className="section-title">O&apos;qituvchilarimiz</h2>
              <p className="section-subtitle">Tajribali va sertifikatlangan mutaxassislar</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(teachers.length > 0 ? teachers.slice(0, 4) : [
              { id: 1, full_name: "Alisher Karimov", direction_display: "IELTS", bio: "IELTS 8.5, 5 yillik tajriba", photo: null },
              { id: 2, full_name: "Dilnoza Rashidova", direction_display: "English", bio: "CELTA sertifikati, 4 yillik tajriba", photo: null },
              { id: 3, full_name: "Sardor Toshmatov", direction_display: "IT", bio: "Senior dasturchi, 6 yillik tajriba", photo: null },
              { id: 4, full_name: "Nodira Umarova", direction_display: "Matematika", bio: "Oliy toifali, 8 yillik tajriba", photo: null },
            ] as (Teacher | { id: number; full_name: string; direction_display: string; bio: string; photo: null })[]).map((t) => (
              <StaggerItem key={t.id}>
                <div className="card card-glow group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                  <div className="w-full aspect-[3/4] bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl mb-4 overflow-hidden flex items-center justify-center relative">
                    {t.photo ? <img src={t.photo} alt={t.full_name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" /> : <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"><Users size={36} className="text-primary/40" /></div>}
                    <div className="absolute top-3 right-3"><span className="badge badge-primary text-xs">{t.direction_display}</span></div>
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{t.full_name}</h3>
                  <p className="text-text-secondary text-sm mt-1">{t.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn delay={0.3}><div className="text-center mt-10"><Link href="/teachers" className="btn-outline">Barcha o&apos;qituvchilar <ArrowRight size={18} /></Link></div></FadeIn>
        </div>
      </section>

      {/* ═══ SERTIFIKATLAR (with lightbox) ═══ */}
      <section className="py-20 bg-bg-secondary">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="badge badge-accent mb-3 inline-flex items-center gap-1"><Award size={14} /> Natijalar</span>
              <h2 className="section-title">Talabalar sertifikatlari</h2>
              <p className="section-subtitle">O&apos;quvchilarimizning yutuqlari</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(certificates.length > 0 ? certificates.slice(0, 4) : [
              { id: 1, student_name: "Jasur Olimov", certificate_name: "IELTS Academic", score: "7.5", image: null },
              { id: 2, student_name: "Madina Karimova", certificate_name: "IELTS General", score: "7.0", image: null },
              { id: 3, student_name: "Bobur Rahimov", certificate_name: "CEFR B2", score: "B2", image: null },
              { id: 4, student_name: "Sarvinoz Tursunova", certificate_name: "Python Certificate", score: "95%", image: null },
            ] as (Certificate | { id: number; student_name: string; certificate_name: string; score: string; image: null })[]).map((c) => (
              <StaggerItem key={c.id}>
                <div onClick={() => setLightbox(c as Certificate)} className="card card-glow text-center group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="w-full aspect-[3/4] bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    {c.image ? <img src={c.image} alt={c.student_name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" /> : <Award size={48} className="text-primary/20" />}
                  </div>
                  <h3 className="font-bold">{c.student_name}</h3>
                  <p className="text-primary text-sm font-medium">{c.certificate_name}</p>
                  <div className="mt-2 inline-flex items-center gap-1 bg-accent/10 text-accent-dark font-bold text-lg px-3 py-1 rounded-lg">
                    <Star size={16} className="fill-accent text-accent" />{c.score}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ CERTIFICATE LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl">{lightbox.student_name}</h3>
                  <button onClick={() => setLightbox(null)} className="p-2 hover:bg-bg-secondary rounded-xl"><X size={20} /></button>
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
                  <div className="mt-2 inline-flex items-center gap-2 bg-accent/10 text-accent-dark font-bold text-2xl px-5 py-2 rounded-xl">
                    <Star size={24} className="fill-accent text-accent" />{lightbox.score}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ CTA BANNER ═══ */}
      <section className="py-20 gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full" />
          <motion.div animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full" />
        </div>
        <div className="container-custom text-center relative z-10">
          <FadeIn>
            <Sparkles size={40} className="text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">O&apos;z kelajagingiz uchun hozir qadam tashlang!</h2>
            <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">PolyglotLC da o&apos;qishni boshlang va o&apos;z sohangizdagi professional bo&apos;ling</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-accent text-lg">Hozir ro&apos;yxatdan o&apos;ting <ArrowRight size={20} /></Link>
              <Link href="/contact" className="glass rounded-xl px-6 py-3 font-semibold hover:bg-white/20 transition inline-flex items-center gap-2">Bog&apos;lanish</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 bg-bg-secondary">
        <div className="container-custom max-w-3xl">
          <FadeIn><div className="text-center mb-12"><span className="badge badge-primary mb-3">FAQ</span><h2 className="section-title">Ko&apos;p beriladigan savollar</h2></div></FadeIn>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className={`card transition-all duration-300 ${faqOpen === i ? 'border-primary/20 shadow-lg shadow-primary/5' : ''}`}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between text-left font-medium gap-4">
                    <span className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${faqOpen === i ? 'bg-primary text-white' : 'bg-primary-light text-primary'}`}>{i + 1}</span>
                      {faq.q}
                    </span>
                    <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${faqOpen === i ? 'rotate-180 text-primary' : 'text-text-secondary'}`} />
                  </button>
                  <AnimatePresence>
                    {faqOpen === i && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="text-text-secondary text-sm mt-3 pl-11 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
