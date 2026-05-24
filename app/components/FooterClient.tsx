'use client';

import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { DiscordLogoIcon, EnvelopeClosedIcon, InstagramLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';
import { motion, useReducedMotion } from 'framer-motion';

const DISCORD_URL = 'https://discord.gg/tqR3bGjVke';

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" fill="currentColor" />
    <path
      d="M14.5 8.4h2V5.2c-.36-.05-1.6-.15-3.04-.15-3 0-5.05 1.83-5.05 5.19v2.92H5v3.57h3.41V22h4.14v-5.27h3.24l.52-3.57h-3.76v-2.57c0-1.04.29-2.19 1.95-2.19Z"
      fill="#fff"
    />
  </svg>
);

export default function FooterClient() {
  const [activeSocial, setActiveSocial] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const socialLinks: {
    title: string;
    href: string;
    icon: ReactNode;
    accent: string;
  }[] = [
    { title: 'Email', href: 'mailto:uclamathtournament@gmail.com', icon: <EnvelopeClosedIcon width={22} height={22} />, accent: '#FFD100' },
    { title: 'Instagram', href: 'https://www.instagram.com/lamathtournament/', icon: <InstagramLogoIcon width={22} height={22} />, accent: '#E4405F' },
    { title: 'Facebook', href: 'https://www.facebook.com/groups/1429462591976204/', icon: <FacebookIcon />, accent: '#1877F2' },
    { title: 'LinkedIn', href: 'https://www.linkedin.com/company/la-math-tournament/', icon: <LinkedInLogoIcon width={22} height={22} />, accent: '#0A66C2' },
    { title: 'Discord', href: DISCORD_URL, icon: <DiscordLogoIcon width={22} height={22} />, accent: '#5865F2' },
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
                aria-label={`LAMT ${item.title}`}
                title={`LAMT ${item.title}`}
                className="site-social-link"
                data-platform={item.title.toLowerCase()}
                data-state={activeSocial === item.title ? 'active' : undefined}
                style={{
                  '--social-accent': item.accent,
                  '--social-delay': `${index * 36}ms`,
                } as CSSProperties}
                initial={false}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                layout
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                onBlur={() => setActiveSocial(null)}
                onFocus={() => setActiveSocial(item.title)}
                onMouseEnter={() => setActiveSocial(item.title)}
                onMouseLeave={() => setActiveSocial(null)}
              >
                <span className="site-social-link__sweep" aria-hidden="true" />
                <span className="site-social-link__icon" aria-hidden="true">{item.icon}</span>
                <span className="site-social-link__copy">
                  <strong>{item.title}</strong>
                </span>
                <span className="site-social-link__status" aria-hidden="true" />
              </motion.a>
            ))}
          </div>
        </div>

        <p className="site-footer__note">
          Student-run. Not an official UC site.
        </p>
      </div>
    </footer>
  );
}
