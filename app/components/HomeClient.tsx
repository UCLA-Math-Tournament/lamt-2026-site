import Link from 'next/link';
import { ArrowRightIcon, FileTextIcon } from '@radix-ui/react-icons';

const homeButtonClass =
  'hero-button inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold uppercase text-white';

const homeLinks = [
  { href: '/tournament', label: 'Tournament', detail: 'Schedule, eligibility, venue.' },
  { href: '/rules', label: 'Rules', detail: 'Allowed materials and answer format.' },
  { href: '/archive', label: 'Archive', detail: '2026 papers, solutions, results.' },
];

export default function HomeClient() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__meta">May 17, 2026. UCLA.</p>
          <h1 className="hero-animate-words">
            <span className="word">Los Angeles</span>
            {' '}
            <span className="word gold-shimmer-text">Math Tournament</span>
          </h1>
          <p className="cinema-lede">
            Free in-person math contest for middle and high school students.
          </p>

          <div className="cinema-actions">
            <Link href="/tournament" className={homeButtonClass}>
              Tournament <ArrowRightIcon />
            </Link>
            <Link href="/archive" className={`${homeButtonClass} hero-button--ghost`}>
              <FileTextIcon /> 2026 Archive
            </Link>
          </div>
        </div>
      </section>

      <section className="home-index page-shell" aria-label="LAMT links">
        <div className="home-index__list">
          {homeLinks.map((item) => (
            <Link key={item.href} href={item.href} className="home-index__link">
              <span>{item.label}</span>
              <strong>{item.detail}</strong>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
