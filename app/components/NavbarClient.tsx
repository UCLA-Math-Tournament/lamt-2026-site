'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tournament', label: 'Tournament' },
  { href: '/rules', label: 'Rules' },
  { href: '/archive', label: 'Archive' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About' },
];

export default function NavbarClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 18);
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header" data-scrolled={scrolled ? 'true' : undefined}>
      <motion.div
        className="site-header__inner site-pad"
        animate={reducedMotion ? undefined : { y: scrolled ? -1 : 0 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href="/" className="site-brand" aria-label="LAMT home">
          <Image src="/LAMTBear.png" alt="" width={58} height={58} className="site-brand__mark" priority />
          <span>
            <strong>LAMT</strong>
            <small>Los Angeles Math Tournament</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`site-nav-link ${active ? 'is-active' : ''}`}>
                {label}
                {active ? (
                  <motion.span
                    className="site-nav-link__active"
                    layoutId="site-nav-active"
                    transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" className="site-menu-button">
          {menuOpen ? <Cross2Icon /> : <HamburgerMenuIcon />}
        </button>
      </motion.div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            className="site-mobile-nav site-pad"
            aria-label="Mobile navigation"
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {navLinks.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`site-nav-link site-nav-link--mobile ${active ? 'is-active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                );
              })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
