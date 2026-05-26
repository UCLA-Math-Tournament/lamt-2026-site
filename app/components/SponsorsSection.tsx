'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { Tier } from '../page';

const TIER_CONFIG: Record<Tier, {
  label: string;
  imgHeight: number;
}> = {
  gold: { label: 'Gold', imgHeight: 220 },
  silver: { label: 'Silver', imgHeight: 168 },
  bronze: { label: 'Bronze', imgHeight: 132 },
  friends: { label: 'Friends of LAMT', imgHeight: 96 },
};

const TIER_ORDER: Tier[] = ['gold', 'silver', 'bronze', 'friends'];

function getSponsorName(src: string) {
  if (src.includes('SUSQUEHANNA')) return 'Susquehanna';
  if (src.includes('AoPS')) return 'Art of Problem Solving';
  if (src.includes('LOGO_stacked')) return 'Jane Street';
  if (src.includes('imageedit')) return 'GEOGRA';
  if (src.includes('SCMCLOGO')) return 'Southern California Math Circle';
  if (src.includes('bmt')) return 'Berkeley Math Tournament';
  if (src.includes('cmm')) return 'Cincinnati Math Meet';
  return 'LAMT sponsor';
}

function getLogoScale(src: string) {
  if (src.includes('AoPS')) return 'wide';
  return src.includes('imageedit') || src.includes('SCMCLOGO') ? 'mark' : undefined;
}

function getLogoTone(src: string) {
  return src.includes('SUSQUEHANNA') || src.includes('LOGO_stacked') || src.includes('imageedit') || src.includes('bmt') ? 'mono' : 'color';
}

function SponsorLogo({
  src,
  imgHeight,
}: {
  src: string;
  imgHeight: number;
}) {
  return (
    <div
      className="sponsor-logo-frame"
      data-logo-scale={getLogoScale(src)}
      data-logo-tone={getLogoTone(src)}
    >
      <Image
        src={src}
        alt={getSponsorName(src)}
        width={420}
        height={imgHeight}
        loading="eager"
        unoptimized
        style={{ height: imgHeight, width: 'auto', maxWidth: '100%' }}
        className="object-contain"
      />
    </div>
  );
}

function SponsorTierRow({
  tier,
  label,
  imgHeight,
  sources,
}: {
  tier: Tier;
  label: string;
  imgHeight: number;
  sources: string[];
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 0.36, 0.72, 1], reduceMotion ? [0, 0, 0, 0] : [54, 0, 0, -24]);
  const rotateX = useTransform(scrollYProgress, [0, 0.38, 0.72, 1], reduceMotion ? [0, 0, 0, 0] : [7, 0, 0, -3]);
  const opacity = useTransform(scrollYProgress, [0, 0.24, 0.82, 1], reduceMotion ? [1, 1, 1, 1] : [0.3, 1, 1, 0.84]);
  const ruleScale = useTransform(scrollYProgress, [0.12, 0.42], reduceMotion ? [1, 1] : [0.16, 1]);

  return (
    <motion.section
      ref={ref}
      className="section-row sponsor-tier-row"
      data-tier={tier}
      style={{ y, rotateX, opacity }}
    >
      <div className="sponsor-tier-heading">
        <h3 className="section-title">{label}</h3>
      </div>
      <div className={`sponsor-grid sponsor-matrix sponsor-matrix--${tier}`}>
        <motion.span className="sponsor-grid__rule" style={{ scaleX: ruleScale }} aria-hidden="true" />
        {sources.map((src) => (
          <SponsorLogo key={src} src={src} imgHeight={imgHeight} />
        ))}
      </div>
    </motion.section>
  );
}

export default function SponsorsSection({
  sponsorsByTier,
}: {
  sponsorsByTier: Record<Tier, string[]>;
}) {
  const activeTiers = TIER_ORDER.filter((tier) => sponsorsByTier[tier].length > 0);

  return (
    <section id="sponsors" className="page-shell sponsor-section">
      <header className="sponsor-heading">
        <h2 className="sponsor-title">Sponsors</h2>
      </header>

      {activeTiers.length > 0 ? (
        <div className="sponsor-tier-stack">
          {activeTiers.map((tier) => {
            const { label, imgHeight } = TIER_CONFIG[tier];
            return (
              <SponsorTierRow
                key={tier}
                tier={tier}
                label={label}
                imgHeight={imgHeight}
                sources={sponsorsByTier[tier]}
              />
            );
          })}
        </div>
      ) : (
        <div className="section-row sponsor-empty-state">
          <h3 className="section-title">Sponsors</h3>
          <p className="section-copy">Pending.</p>
        </div>
      )}
    </section>
  );
}
