'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';

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
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="site-header__inner site-pad">
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
              </Link>
            );
          })}
        </nav>

        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" className="site-menu-button">
          {menuOpen ? <Cross2Icon /> : <HamburgerMenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <nav className="site-mobile-nav site-pad" aria-label="Mobile navigation">
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
        </nav>
      )}
    </header>
  );
}
