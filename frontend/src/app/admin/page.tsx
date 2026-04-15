'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, ClipboardCheck, Gift, FileText, GraduationCap, BookOpen, MessageSquare, Award } from 'lucide-react';
import api from '@/lib/api';
import { AdminStats } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.get('admin/stats/').then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const cards = stats ? [
    { icon: <Users size={24} />, label: "Jami o'quvchilar", value: stats.total_students, color: 'bg-blue-50 text-blue-600', href: '/admin/students' },
    { icon: <FileText size={24} />, label: "Yangi arizalar", value: stats.new_applications_today, color: 'bg-green-50 text-green-600', href: '/admin/students' },
    { icon: <ClipboardCheck size={24} />, label: "Mock so'rovlar", value: stats.new_mock_requests, color: 'bg-amber-50 text-amber-600', href: '/admin/mocks' },
    { icon: <Gift size={24} />, label: "Bonus so'rovlar", value: stats.pending_bonus_requests, color: 'bg-purple-50 text-purple-600', href: '/admin/bonus' },
    { icon: <GraduationCap size={24} />, label: "O'qituvchilar", value: stats.total_teachers, color: 'bg-cyan-50 text-cyan-600', href: '/admin/teachers' },
    { icon: <BookOpen size={24} />, label: "Kurslar", value: stats.total_courses, color: 'bg-indigo-50 text-indigo-600', href: '/admin/courses' },
    { icon: <Award size={24} />, label: "Blog postlar", value: stats.total_blog_posts, color: 'bg-rose-50 text-rose-600', href: '/admin/blog' },
    { icon: <MessageSquare size={24} />, label: "Yangi xabarlar", value: stats.unread_messages, color: 'bg-teal-50 text-teal-600', href: '/admin/messages' },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={card.href} className="card flex items-center gap-4 hover:border-primary/20 transition-colors group block">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-text-secondary">{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {!stats && <p className="text-text-secondary mt-8 text-center">Yuklanmoqda...</p>}
    </div>
  );
}
