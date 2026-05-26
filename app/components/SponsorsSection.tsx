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
  return src.includes('imageedit') || src.includes('SCMCLOGO') ? 'mark' : undefined;
}

function getLogoTone(src: string) {
  return src.includes('SUSQUEHANNA') || src.includes('LOGO_stacked') || src.includes('imageedit') ? 'mono' : 'color';
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
              <section key={tier} className="section-row">
                <div className="sponsor-tier-heading">
                  <h3 className="section-title">{label}</h3>
                </div>
                <div className={`sponsor-grid sponsor-matrix sponsor-matrix--${tier}`}>
                  {sponsorsByTier[tier].map((src) => (
                    <div
                      key={src}
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
    </section>
  );
}
