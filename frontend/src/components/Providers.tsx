'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/lib/auth';
import { SiteSettingsProvider } from '@/lib/site-settings';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <SiteSettingsProvider>
        {!isAdmin && <Navbar />}
        <main className="flex-1">{children}</main>
        {!isAdmin && <Footer />}
      </SiteSettingsProvider>
    </AuthProvider>
  );
}
