import Link from 'next/link';

export default function NotFound() {
  const routes = [
    { href: '/', label: 'Home' },
    { href: '/archive', label: 'Archive' },
    { href: '/tournament', label: 'Tournament' },
    { href: '/faq', label: 'FAQ' },
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
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
