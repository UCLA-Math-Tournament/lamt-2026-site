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
    <section id="sponsors" className="page-shell sponsor-section">
      <section className="section-row sponsor-intro">
        <p className="section-title" aria-hidden="true">Sponsors</p>
        <div>
          <h2 className="sponsor-title">Sponsors</h2>
          <p className="section-copy">Sponsors keep LAMT free.</p>
        </div>
      </section>

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
          <h3 className="section-title">Sponsors</h3>
          <p className="section-copy">Pending.</p>
        </div>
      )}

      <div className="section-row">
        <h3 className="section-title">Sponsor LAMT</h3>
        <div>
          <p className="section-copy mb-6">Keep LAMT free.</p>
          <a href="mailto:uclamathtournament@gmail.com" className="btn-outline">
            Email LAMT
          </a>
        </div>
      </div>
    </section>
  );
}
