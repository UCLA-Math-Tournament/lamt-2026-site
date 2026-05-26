import Link from 'next/link';
import { ArrowRightIcon, FileTextIcon } from '@radix-ui/react-icons';

const homeButtonClass =
  'hero-button inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold uppercase text-white';

export default function HomeClient() {
  return (
    <section className="home-hero">
      <div className="home-hero__motion" aria-hidden="true">
        <svg viewBox="0 0 640 460" role="presentation" focusable="false">
          <path className="motion-route motion-route--blue" d="M18 370 C138 296 156 188 274 166 C390 144 428 54 618 34" />
          <path className="motion-route motion-route--gold" d="M24 284 C132 220 232 236 326 156 C414 80 496 88 620 118" />
          <path className="motion-route motion-route--deep" d="M80 426 C168 332 268 328 376 250 C478 176 520 190 616 152" />
          <circle className="motion-node motion-node--one" cx="274" cy="166" r="7" />
          <circle className="motion-node motion-node--two" cx="326" cy="156" r="6" />
          <circle className="motion-node motion-node--three" cx="494" cy="88" r="5" />
        </svg>
      </div>

      <div className="home-hero__content">
        <p className="home-hero__meta">May 17, 2026. UCLA.</p>
        <h1>Los Angeles Math Tournament</h1>
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
  );
}
