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
  const totalSponsors = activeTiers.reduce((sum, tier) => sum + sponsorsByTier[tier].length, 0);
  const tierSummaries = TIER_ORDER.map((tier) => ({
    tier,
    label: TIER_CONFIG[tier].label,
    count: sponsorsByTier[tier].length,
  }));

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
            LAMT 2026 is made possible by the generous support of our sponsors.
          </p>
        </div>
      </div>

      {activeTiers.length > 0 ? (
        <div className="sponsor-tier-stack">
          <section className="sponsor-support-board" aria-label="LAMT sponsor support summary">
            <div className="sponsor-support-board__copy">
              <p className="label-caps">LAMT 2026</p>
              <h3>Sponsors</h3>
              <p>
                Thank you to the organizations supporting LAMT 2026.
              </p>
            </div>
            <div className="sponsor-support-board__stats">
              <div className="sponsor-count-tile">
                <span>{totalSponsors}</span>
                <strong>active sponsors</strong>
              </div>
              <div className="sponsor-tier-rail">
                {tierSummaries.map(({ tier, label, count }) => (
                  <div key={tier} className={`sponsor-tier-card sponsor-tier-card--${tier}`} data-active={count > 0}>
                    <span>{label}</span>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {activeTiers.map((tier) => {
            const { label, imgHeight } = TIER_CONFIG[tier];
            return (
              <section key={tier} className="section-row">
                <div className="sponsor-tier-heading">
                  <h3 className="section-title">{label}</h3>
                  <span>{sponsorsByTier[tier].length} listed</span>
                </div>
                <div className={`sponsor-grid sponsor-matrix sponsor-matrix--${tier}`}>
                  {sponsorsByTier[tier].map((src, index) => (
                    <div key={src} className="sponsor-card sponsor-logo-frame">
                      <span className="sponsor-card__index">{String(index + 1).padStart(2, '0')}</span>
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
          <p className="section-copy">Sponsor announcements are coming soon. This section is prepared as a logo matrix once sponsor files are added.</p>
        </div>
      )}

      <div className="section-row">
        <h3 className="section-title">Sponsor LAMT</h3>
        <div>
          <p className="section-copy mb-6">Interested in sponsoring LAMT?</p>
          <a href="mailto:uclamathtournament@gmail.com" className="btn-outline">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
