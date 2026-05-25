import ArchiveMaterialGrid from '../components/ArchiveMaterialGrid';

export default function ArchivePage() {
  const pastFiles = [
    {
      title: '2026',
      files: {
        Problems: {
          Shopping: '/lamt2026/Shopping Round.pdf',
          'Algebra & Number Theory': '/lamt2026/AlgNT.pdf',
          Combinatorics: '/lamt2026/Combo.pdf',
          Geometry: '/lamt2026/Geo.pdf',
          Guts: '/lamt2026/Guts.pdf',
        },
        Solutions: {
          Shopping: '/lamt2026/Shopping Round Solutions.pdf',
          'Algebra & Number Theory': '/lamt2026/AlgNT Solutions.pdf',
          Combinatorics: '/lamt2026/Combo Solutions.pdf',
          Geometry: '/lamt2026/Geo Solutions.pdf',
          Guts: '/lamt2026/Guts Solutions.pdf',
        },
        Results: {
          Results: '/lamt2026/lamt2026results',
        },
        Info: {
          Schedule: '/tournament',
          Rules: '/rules',
          'Correction Notice': '/lamt2026/Apology Letter.pdf',
        },
      },
    },
  ];

  const fileType = (href: string) => (href.endsWith('.pdf') ? 'PDF' : 'HTML');

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">2026 Files</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">Archive</h1>
          <p className="page-summary mt-5">
            2026 papers, solutions, results.
          </p>
        </div>
      </header>

      <div className="archive-years">
        {pastFiles.map((year) => (
          <section key={year.title} className="section-row">
            <h2 className="section-title">{year.title}</h2>
            <div className="archive-year-board">
              <div className="archive-year-meta">
                <span className="label-caps">Files</span>
                <strong>LAMT {year.title}</strong>
                <p className="section-copy">
                  Problems, solutions, results.
                </p>
              </div>
              <ArchiveMaterialGrid
                groups={Object.entries(year.files).map(([category, items]) => ({
                  category,
                  items: Object.entries(items as Record<string, string>).map(([name, value]) => ({
                    name,
                    href: value,
                    type: fileType(value),
                  })),
                }))}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
