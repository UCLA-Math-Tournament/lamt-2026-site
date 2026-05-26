import Link from 'next/link';

export default function NotFound() {
  const routes = [
    { href: '/', label: 'Home', detail: 'LAMT front page.' },
    { href: '/archive', label: 'Archive', detail: '2026 papers and results.' },
    { href: '/tournament', label: 'Tournament', detail: 'Date, format, eligibility.' },
    { href: '/faq', label: 'FAQ', detail: 'Common logistics answers.' },
  ];

  return (
    <div className="page-shell not-found-page">
      <header className="page-hero">
        <div>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title" id="not-found-title">Page Not Found</h1>
          <p className="page-summary mt-5">
            Use a published LAMT page.
          </p>
        </div>
      </header>

      <section className="section-row" aria-labelledby="not-found-title">
        <h2 className="section-title">Routes</h2>
        <div className="lamt-line-list">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="lamt-line-item not-found-link">
              <strong>{route.label}</strong>
              <p>{route.detail}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
