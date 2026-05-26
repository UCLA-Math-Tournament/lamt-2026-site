import ArchiveMaterialsClient from '../components/ArchiveMaterialsClient';

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
  ];

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div className="page-hero__body">
          <h1 className="page-title">Archive</h1>
          <p className="page-summary mt-5">
            2026 papers, solutions, results.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Materials</h2>
        <ArchiveMaterialsClient rounds={rounds} reference={reference} />
      </section>
    </div>
  );
}
