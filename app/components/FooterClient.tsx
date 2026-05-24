'use client';

import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { DiscordLogoIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { motion, useReducedMotion } from 'framer-motion';

const DISCORD_URL = 'https://discord.gg/tqR3bGjVke';

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.94 8.95H3.56V20h3.38V8.95ZM5.25 4a1.96 1.96 0 1 0 0 3.92A1.96 1.96 0 0 0 5.25 4Zm15.19 9.85c0-3.08-1.64-5.06-4.31-5.06-1.7 0-2.76.9-3.2 1.74V8.95H9.7V20h3.37v-5.75c0-1.52.29-2.98 2.16-2.98 1.85 0 1.87 1.73 1.87 3.08V20h3.34v-6.15Z" />
  </svg>
);

export default function FooterClient() {
  const [activeSocial, setActiveSocial] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const socialLinks: {
    title: string;
    detail: string;
    href: string;
    icon: ReactNode;
    accent: string;
  }[] = [
    { title: 'Email', detail: 'uclamathtournament@gmail.com', href: 'mailto:uclamathtournament@gmail.com', icon: <EnvelopeClosedIcon width={22} height={22} />, accent: '#FFD100' },
    { title: 'Instagram', detail: '@lamathtournament', href: 'https://www.instagram.com/lamathtournament/', icon: <InstagramIcon />, accent: '#E4405F' },
    { title: 'Facebook', detail: 'LAMT group', href: 'https://www.facebook.com/groups/1429462591976204/', icon: <FacebookIcon />, accent: '#1877F2' },
    { title: 'LinkedIn', detail: 'LAMT page', href: 'https://www.linkedin.com/company/la-math-tournament/', icon: <LinkedInIcon />, accent: '#0A66C2' },
    { title: 'Discord', detail: 'Community', href: DISCORD_URL, icon: <DiscordLogoIcon width={22} height={22} />, accent: '#5865F2' },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__inner site-pad">
        <Link href="/" className="site-footer__brand-link" aria-label="LAMT home">
          <Image src="/LAMTBear.png" alt="LAMT Bear Logo" width={150} height={150} className="site-footer__mark" />
        </Link>

        <div className="site-footer__contact">
          <p className="site-footer__eyebrow">Contact</p>
          <div className="site-footer__socials" aria-label="LAMT contact links">
            {socialLinks.map((item, index) => (
              <motion.a
                key={item.title}
                href={item.href}
                target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                aria-label={item.title}
                title={item.title}
                className="site-social-link"
                data-platform={item.title.toLowerCase()}
                data-state={activeSocial === item.title ? 'active' : undefined}
                style={{ '--social-accent': item.accent } as CSSProperties}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-24px' }}
                transition={{ duration: 0.22, delay: index * 0.025, ease: [0.16, 1, 0.3, 1] }}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                onBlur={() => setActiveSocial(null)}
                onFocus={() => setActiveSocial(item.title)}
                onMouseEnter={() => setActiveSocial(item.title)}
                onMouseLeave={() => setActiveSocial(null)}
              >
                <span className="site-social-link__sweep" aria-hidden="true" />
                <span className="site-social-link__icon" aria-hidden="true">{item.icon}</span>
                <span className="site-social-link__copy">
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
                <span className="site-social-link__status" aria-hidden="true" />
              </motion.a>
            ))}
          </div>
        </div>

        <p className="site-footer__note">
          Student group acting independently of the University of California.
          Full responsibility for this website belongs to LAMT.
        </p>
      </div>
    </footer>
  );
}
