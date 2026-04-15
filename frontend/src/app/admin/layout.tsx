'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard, BookOpen, FileText, Users,
  ClipboardCheck, Gift, LogOut, ArrowLeft,
  GraduationCap, Award, MessageSquare, MapPin, Settings
} from 'lucide-react';

const sidebarLinks = [
  { href: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/admin/courses', icon: <BookOpen size={18} />, label: 'Kurslar' },
  { href: '/admin/teachers', icon: <GraduationCap size={18} />, label: "O'qituvchilar" },
  { href: '/admin/certificates', icon: <Award size={18} />, label: 'Sertifikatlar' },
  { href: '/admin/blog', icon: <FileText size={18} />, label: 'Blog' },
  { href: '/admin/students', icon: <Users size={18} />, label: "O'quvchilar" },
  { href: '/admin/mocks', icon: <ClipboardCheck size={18} />, label: 'Mock arizalar' },
  { href: '/admin/messages', icon: <MessageSquare size={18} />, label: 'Xabarlar' },
  { href: '/admin/branches', icon: <MapPin size={18} />, label: 'Filiallar' },
  { href: '/admin/bonus', icon: <Gift size={18} />, label: 'Bonus tizimi' },
  { href: '/admin/settings', icon: <Settings size={18} />, label: 'Sozlamalar' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !user.is_staff)) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user?.is_staff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <div className="text-text-secondary">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-bg-secondary">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-primary">Polyglot</span>
            <span className="text-accent">LC</span>
          </Link>
          <p className="text-xs text-text-secondary mt-1">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-bg-secondary transition-colors"
          >
            <ArrowLeft size={18} />
            Saytga qaytish
          </Link>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={18} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Mobile header + bottom nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-border z-40 px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-lg font-extrabold text-primary">Polyglot</span>
          <span className="text-lg font-extrabold text-accent">LC</span>
          <span className="text-xs text-text-secondary ml-2">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="p-2 rounded-lg hover:bg-bg-secondary">
            <ArrowLeft size={18} />
          </Link>
          <button onClick={() => { logout(); router.push('/login'); }} className="p-2 rounded-lg hover:bg-red-50 text-red-600">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 flex justify-around py-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 text-xs py-1 px-2 rounded-lg transition-colors ${
                isActive ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              {link.icon}
              <span>{link.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 pt-16 md:pt-8 pb-24 md:pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
