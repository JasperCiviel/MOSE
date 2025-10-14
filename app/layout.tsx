import './globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MOSE Interactive ODL',
  description:
    'A glass-box, preference-based engineering design studio exploring the MOSE flood barrier in Venice.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-lagoon-50 min-h-screen`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="bg-white border-t border-slate-100 py-10">
            <div className="mx-auto max-w-6xl px-6 text-sm text-slate-500">
              <p>Built for the MOSE Open Design Lab — explore, compare, and export insight-rich design narratives.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
