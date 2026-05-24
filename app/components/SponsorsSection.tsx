'use client';

import Image from 'next/image';
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

export default function SponsorsSection({
  sponsorsByTier,
}: {
  sponsorsByTier: Record<Tier, string[]>;
}) {
  const activeTiers = TIER_ORDER.filter((tier) => sponsorsByTier[tier].length > 0);

  return (
    <section id="sponsors" className="page-shell border-t-4 border-[var(--ucla-gold)] bg-[var(--color-surface)]">
      <div className="page-hero">
        <div>
          <p className="page-kicker">Sponsors</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h2 className="page-title">Our Sponsors</h2>
          <p className="page-summary mt-5">
            Sponsor support keeps LAMT free for students.
          </p>
        </div>
      </div>

      {activeTiers.length > 0 ? (
        <div className="sponsor-tier-stack">
          {activeTiers.map((tier) => {
            const { label, imgHeight } = TIER_CONFIG[tier];
            return (
              <section key={tier} className="section-row">
                <div className="sponsor-tier-heading">
                  <h3 className="section-title">{label}</h3>
                </div>
                <div className={`sponsor-grid sponsor-matrix sponsor-matrix--${tier}`}>
                  {sponsorsByTier[tier].map((src, index) => (
                    <div key={src} className="sponsor-card sponsor-logo-frame">
                      <Image
                        src={src}
                        alt={`${label} sponsor ${index + 1}`}
                        width={420}
                        height={imgHeight}
                        loading="eager"
                        unoptimized
                        style={{ height: imgHeight, width: 'auto', maxWidth: '100%' }}
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="section-row sponsor-empty-state">
          <h3 className="section-title">Sponsor Announcements</h3>
          <p className="section-copy">No sponsor announcements yet.</p>
        </div>
      )}

      <div className="section-row">
        <h3 className="section-title">Sponsor LAMT</h3>
        <div>
          <p className="section-copy mb-6">Support a free student math tournament.</p>
          <a href="mailto:uclamathtournament@gmail.com" className="btn-outline">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
