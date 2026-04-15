'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Shield, Brain } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const mainLinks = [
  { href: '/', label: 'Bosh sahifa' },
  { href: '/courses', label: 'Kurslar' },
  { href: '/level-test', label: 'Darajani aniqlash', highlight: true },
  { href: '/mock', label: 'Mock test' },
];

const moreLinks = [
  { href: '/blog', label: 'Yangiliklar' },
  { href: '/teachers', label: "O'qituvchilar" },
  { href: '/branches', label: 'Filiallar' },
  { href: '/about', label: 'Biz haqimizda' },
  { href: '/contact', label: 'Aloqa' },
];

const allLinks = [...mainLinks, ...moreLinks];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Close more dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/[0.03]'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-primary">Polyglot</span>
          <span className="text-accent">LC</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                link.highlight
                  ? pathname === link.href
                    ? 'text-white bg-primary shadow-lg shadow-primary/20'
                    : 'text-primary bg-primary-light hover:bg-primary hover:text-white'
                  : pathname === link.href
                    ? 'text-primary bg-primary-light'
                    : 'text-text hover:text-primary hover:bg-primary-light/50'
              }`}
            >
              {link.highlight && <Brain size={14} className="inline mr-1 -mt-0.5" />}
              {link.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 ${
                moreLinks.some(l => pathname === l.href)
                  ? 'text-primary bg-primary-light'
                  : 'text-text hover:text-primary hover:bg-primary-light/50'
              }`}
            >
              Batafsil
              <ChevronDown size={14} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-border overflow-hidden"
                >
                  <div className="py-1">
                    {moreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                          pathname === link.href
                            ? 'text-primary bg-primary-light'
                            : 'text-text hover:bg-bg-secondary hover:text-primary'
                        }`}
                        onClick={() => setMoreOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium bg-primary-light text-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                  {(user.first_name || user.email)[0].toUpperCase()}
                </div>
                {user.first_name || user.email}
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-border overflow-hidden"
                  >
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium truncate">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-text-secondary truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/cabinet"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-bg-secondary transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} className="text-text-secondary" />
                        Kabinet
                      </Link>
                      {user.is_staff && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-bg-secondary transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Shield size={16} className="text-text-secondary" />
                          Admin panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-border py-1">
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Chiqish
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-text hover:text-primary px-3 py-2 rounded-lg transition-colors">
                Kirish
              </Link>
              <Link href="/register" className="btn-accent text-sm py-2 px-4">
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium py-2.5 px-3 rounded-lg transition-colors flex items-center gap-2 ${
                    pathname === link.href
                      ? 'text-primary bg-primary-light'
                      : (link as { highlight?: boolean }).highlight
                        ? 'text-primary bg-primary-light/50'
                        : 'text-text hover:bg-bg-secondary'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {(link as { highlight?: boolean }).highlight && <Brain size={14} />}
                  {link.label}
                </Link>
              ))}
              <hr className="border-border my-2" />
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      {(user.first_name || user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-text-secondary">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/cabinet"
                    className="text-sm font-medium text-primary py-2.5 px-3 rounded-lg hover:bg-primary-light transition-colors flex items-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard size={16} /> Kabinet
                  </Link>
                  {user.is_staff && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-primary py-2.5 px-3 rounded-lg hover:bg-primary-light transition-colors flex items-center gap-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Shield size={16} /> Admin panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="text-sm font-medium text-red-600 py-2.5 px-3 rounded-lg hover:bg-red-50 transition-colors text-left flex items-center gap-2"
                  >
                    <LogOut size={16} /> Chiqish
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-1">
                  <Link
                    href="/login"
                    className="btn-outline text-sm text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Kirish
                  </Link>
                  <Link
                    href="/register"
                    className="btn-accent text-sm text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Ro&apos;yxatdan o&apos;tish
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
