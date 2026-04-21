import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "PolyglotLC — O'quv Markazi",
  description:
    "Ingliz tili, IT va dasturlash kurslari. Professional o'qituvchilar, zamonaviy metodika.",
  verification: {
    google: 'Nq0HUQEoMUFDH-Q4VURz1u9V228dJouVCBejOyxiJgQ',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={poppins.className}>
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
