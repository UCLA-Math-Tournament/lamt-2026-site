export default function ArchivePage() {
  const rounds = [
    {
      name: 'Shopping',
      problem: '/lamt2026/Shopping Round.pdf',
      solution: '/lamt2026/Shopping Round Solutions.pdf',
    },
    {
      name: 'Algebra / Number Theory',
      problem: '/lamt2026/AlgNT.pdf',
      solution: '/lamt2026/AlgNT Solutions.pdf',
    },
    {
      name: 'Combinatorics',
      problem: '/lamt2026/Combo.pdf',
      solution: '/lamt2026/Combo Solutions.pdf',
    },
    {
      name: 'Geometry',
      problem: '/lamt2026/Geo.pdf',
      solution: '/lamt2026/Geo Solutions.pdf',
    },
    {
      name: 'Guts',
      problem: '/lamt2026/Guts.pdf',
      solution: '/lamt2026/Guts Solutions.pdf',
    },
  ];

  const reference = [
    {
      label: 'Results',
      href: '/lamt2026/lamt2026results',
      type: 'HTML',
    },
    {
      label: 'Correction Notice',
      href: '/lamt2026/Apology Letter.pdf',
      type: 'PDF',
    },
    {
      label: 'Schedule',
      href: '/tournament',
      type: 'Page',
    },
    {
      label: 'Rules',
      href: '/rules',
      type: 'Page',
    },
  ];

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">Archive</h1>
          <p className="page-summary mt-5">
            2026 papers, solutions, results.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Rounds</h2>
        <div className="archive-round-table" role="table" aria-label="LAMT 2026 archive rounds">
          <div className="archive-round-row archive-round-head" role="row">
            <span role="columnheader">Round</span>
            <span role="columnheader">Problems</span>
            <span role="columnheader">Solutions</span>
          </div>

          {rounds.map((round) => (
            <div key={round.name} className="archive-round-row" role="row">
              <strong role="cell">{round.name}</strong>
              <a href={round.problem} target="_blank" rel="noreferrer" role="cell" className="archive-file-link">
                Problems <em>PDF</em>
              </a>
              <a href={round.solution} target="_blank" rel="noreferrer" role="cell" className="archive-file-link">
                Solutions <em>PDF</em>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Reference</h2>
        <div className="archive-reference-list">
          {reference.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.type === 'PDF' ? '_blank' : undefined}
              rel={item.type === 'PDF' ? 'noreferrer' : undefined}
              className="archive-reference-row"
            >
              <span>{item.label}</span>
              <em>{item.type}</em>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
