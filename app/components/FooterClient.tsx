'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DiscordLogoIcon, EnvelopeClosedIcon, InstagramLogoIcon } from '@radix-ui/react-icons';
import DarkModeToggle from './DarkModeToggle';

const DISCORD_URL = 'https://discord.gg/tqR3bGjVke';

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M14.18 8.58h2.16V5.12c-.37-.05-1.63-.16-3.1-.16-3.08 0-5.18 1.88-5.18 5.33v2.99H4.6v3.66h3.46V22h4.24v-5.06h3.28l.53-3.66H12.3v-2.62c0-1.06.29-2.08 1.88-2.08Z"
      fill="currentColor"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M5.35 7.72H1.62V22h3.73V7.72ZM3.48 2A2.17 2.17 0 0 0 1.3 4.18a2.17 2.17 0 0 0 2.14 2.18h.03a2.18 2.18 0 0 0 .01-4.36Zm19.22 11.8c0-4.18-2.23-6.12-5.21-6.12a4.49 4.49 0 0 0-4.06 2.23h-.06l-.18-2.19H9.52c.05 1.03 0 14.28 0 14.28h3.73v-7.98c0-.42.03-.84.15-1.14a2.04 2.04 0 0 1 1.91-1.36c1.35 0 1.89 1.03 1.89 2.54V22h3.73l.01-8.2Z"
      fill="currentColor"
    />
  </svg>
);

export default function FooterClient() {
  const socialLinks: {
    title: string;
    href: string;
    icon: ReactNode;
  }[] = [
    { title: 'Email', href: 'mailto:uclamathtournament@gmail.com', icon: <EnvelopeClosedIcon width={22} height={22} /> },
    { title: 'Instagram', href: 'https://www.instagram.com/lamathtournament/', icon: <InstagramLogoIcon width={22} height={22} /> },
    { title: 'Facebook', href: 'https://www.facebook.com/groups/1429462591976204/', icon: <FacebookIcon /> },
    { title: 'LinkedIn', href: 'https://www.linkedin.com/company/la-math-tournament/', icon: <LinkedInIcon /> },
    { title: 'Discord', href: DISCORD_URL, icon: <DiscordLogoIcon width={22} height={22} /> },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__inner site-pad">
        <Link href="/" className="site-footer__brand-link" aria-label="LAMT home">
          <Image src="/LAMTBear.png" alt="LAMT Bear Logo" width={150} height={150} className="site-footer__mark" />
        </Link>

        <nav className="site-footer__socials" aria-label="LAMT contact links">
          {socialLinks.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
              aria-label={`LAMT ${item.title}`}
              title={`LAMT ${item.title}`}
              className="site-social-link"
              data-platform={item.title.toLowerCase()}
            >
              <span className="site-social-link__icon" aria-hidden="true">{item.icon}</span>
            </a>
          ))}
        </nav>

        <div className="site-footer__theme">
          <DarkModeToggle />
        </div>

        <p className="site-footer__note">
          We are a student group acting independently of the University of California; we take full responsibility for our organization and this website.
        </p>
      </div>
    </footer>
  );
}
