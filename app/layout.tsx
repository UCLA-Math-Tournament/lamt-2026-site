import { type ReactNode } from 'react';
import { Inter, Inter_Tight } from 'next/font/google';
import NavbarClient from './components/NavbarClient';
import FooterClient from './components/FooterClient';
import DarkModeToggle from './components/DarkModeToggle';
import 'katex/dist/katex.min.css';
import './globals.css';

export const metadata = {
  title: 'LAMT 2026',
  description: 'Los Angeles Math Tournament 2026',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`} suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300">
        <NavbarClient />
        <main>{children}</main>
        <FooterClient />
        <DarkModeToggle />
      </body>
    </html>
  );
}
