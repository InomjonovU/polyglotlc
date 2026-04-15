'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Users, BookOpen, GraduationCap, Building2, Award, Target, Heart, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function AnimatedNum({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 120;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero text-white pt-28 md:pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }} className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/[0.03] rounded-full" />
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <Sparkles size={16} className="text-amber-400" />
            <span className="text-blue-100">2019-yildan beri</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Biz haqimizda
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-blue-100/90 mt-4 max-w-2xl mx-auto text-lg">
            PolyglotLC — zamonaviy ta&apos;lim markazi. Biz o&apos;quvchilarga sifatli bilim berib, ularning kelajagini yorqinlashtirishga intilamiz.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Target size={32} />, title: 'Missiyamiz', desc: "Har bir o'quvchiga jahon standartlariga mos bilim berish va ularni kelajakka tayyorlash.", gradient: 'from-blue-500 to-cyan-500' },
              { icon: <Heart size={32} />, title: 'Qadriyatlarimiz', desc: "Sifat, innovatsiya, individual yondashuv va har bir o'quvchining muvaffaqiyatiga ishonch.", gradient: 'from-rose-500 to-pink-500' },
              { icon: <Award size={32} />, title: 'Maqsadimiz', desc: "O'zbekistondagi eng yaxshi ta'lim markazlaridan biriga aylanish va xalqaro darajaga chiqish.", gradient: 'from-amber-500 to-orange-500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="card card-glow text-center py-10 group hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-text-secondary mt-3 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-bg-secondary">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <BookOpen size={28} />, num: 5, suffix: '+', label: 'Yillik tajriba', color: 'from-blue-500 to-blue-600' },
            { icon: <Users size={28} />, num: 300, suffix: '+', label: "O'quvchilar", color: 'from-emerald-500 to-emerald-600' },
            { icon: <GraduationCap size={28} />, num: 30, suffix: '+', label: "O'qituvchilar", color: 'from-purple-500 to-purple-600' },
            { icon: <Building2 size={28} />, num: 2, suffix: '', label: 'Filiallar', color: 'from-amber-500 to-amber-600' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card card-glow py-8 group"
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {s.icon}
              </div>
              <div className="text-3xl font-extrabold text-text">
                <AnimatedNum target={s.num} suffix={s.suffix} />
              </div>
              <p className="text-text-secondary text-sm mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="py-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title mb-3">Hamkorlarimiz</h2>
            <p className="section-subtitle mb-10">Xalqaro tashkilotlar bilan hamkorlik qilamiz</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-6">
            {['British Council', 'Cambridge', 'IELTS', 'ETS', 'Pearson'].map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="px-8 py-5 bg-bg-secondary rounded-2xl font-bold text-lg text-text-secondary/50 hover:text-primary hover:bg-primary-light transition-all duration-300 cursor-default"
              >
                {name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-bg-secondary">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title mb-4">Biz bilan birga o&apos;qishni boshlang!</h2>
            <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto">
              Professional o&apos;qituvchilar bilan o&apos;z sohangizdagi eng yaxshi natijaga erishing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg">
                Ro&apos;yxatdan o&apos;tish <ArrowRight size={20} />
              </Link>
              <Link href="/contact" className="btn-outline text-lg">
                Bog&apos;lanish
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
