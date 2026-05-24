import Link from 'next/link';

export default function NotFound() {
  const routes = [
    { href: '/', label: 'Home', detail: 'LAMT front page' },
    { href: '/archive', label: 'Archive', detail: '2026 papers and results' },
    { href: '/tournament', label: 'Tournament', detail: 'Date, format, eligibility' },
    { href: '/faq', label: 'FAQ', detail: 'Common logistics answers' },
  ];

  return (
    <div className="not-found-shell">
      <section className="not-found-card" aria-labelledby="not-found-title">
        <div className="not-found-code" aria-hidden="true">
          <span>404</span>
          <strong>Problem not found</strong>
        </div>
        <div className="not-found-copy">
          <p className="page-kicker">LAMT Route Check</p>
          <h1 id="not-found-title">This page is not in the problem set.</h1>
          <span className="gold-rule" />
          <p>
            The URL did not match a published LAMT page. Use one of the official routes below to return to the tournament site.
          </p>
        </div>
        <div className="not-found-route-grid">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="not-found-route">
              <strong>{route.label}</strong>
              <span>{route.detail}</span>
            </Link>
          ))}
        </div>
        <Link href="/" className="btn-filled btn-ripple not-found-home">
          Return to lamt.net
        </Link>
      </section>
    </div>
  );
}
