export default function ArchivePage() {
    const pastFiles = [
        {
            title: '2026',
            files: {
                Problems: {
                    "Shopping": "/lamt2026/Shopping Round.pdf",
                    "Algebra & Number Theory": "/lamt2026/AlgNT.pdf",
                    "Combinatorics": "/lamt2026/Combo.pdf",
                    "Geometry": "/lamt2026/Geo.pdf",
                    "Guts": "/lamt2026/Guts.pdf"
                },
                Solutions: {
                    "Shopping": "/lamt2026/Shopping Round Solutions.pdf",
                    "Algebra & Number Theory": "/lamt2026/AlgNT Solutions.pdf",
                    "Combinatorics": "/lamt2026/Combo Solutions.pdf",
                    "Geometry": "/lamt2026/Geo Solutions.pdf",
                    "Guts": "/lamt2026/Guts Solutions.pdf"
                },
                Results: {
                    "Results": "/lamt2026/lamt2026results" // note: .html files cannot have file extension in url here. Alternatively, set cleanUrls in package.json. Info: https://vercel.com/docs/project-configuration/vercel-json#cleanurls
                },
                Other: {
                    "Apology Letter": "/lamt2026/Apology Letter.pdf"
                }
            },
            
        }
    ]

  const totalFiles = pastFiles.reduce(
    (sum, year) => sum + Object.values(year.files).reduce((yearSum, items) => yearSum + Object.keys(items).length, 0),
    0
  );

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Past Exams</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">Archive</h1>
          <p className="page-summary mt-5">
            Tournament papers, official solutions, and results from published LAMT seasons.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Archive Summary</h2>
        <div className="archive-command-bar">
          <div>
            <p className="label-caps">Published Archive</p>
            <h3>2026 materials are available.</h3>
          </div>
          <div className="archive-command-stat">
            <span>{pastFiles.length}</span>
            <strong>{pastFiles.length === 1 ? 'season' : 'seasons'}</strong>
          </div>
          <div className="archive-command-stat">
            <span>{totalFiles}</span>
            <strong>files</strong>
          </div>
        </div>
      </section>

      <div className="archive-years">
        {pastFiles.map((year) => (
            <section key={year.title} className="section-row">
            <h2 className="section-title">{year.title}</h2>
            <div className="archive-year-board">
              <div className="archive-year-meta">
                <span className="label-caps">Season Index</span>
                <strong>LAMT {year.title}</strong>
                <p className="section-copy">
                  Problems, solutions, results, and corrections for LAMT {year.title}.
                </p>
              </div>
              <div className="archive-grid">
              {Object.entries(year.files).map(([category, items]) => (
                  <div key={category} className="archive-card">
                    <div className="archive-card__header">
                      <span className="label-caps">{category}</span>
                      <strong>{Object.keys(items as Record<string, string>).length}</strong>
                    </div>
                    <ul>
                        {Object.entries(items as Record<string, string>).map(([name, value]) => (
                        <li key={name}>
                            <a href={value} target="_blank" rel="noreferrer" className="archive-link">
                                {name}
                            </a>
                        </li>
                        
                        
                        ))}
                    </ul>
                  </div>
                
              ))}
              </div>
            </div>
            </section>
        ))}
      </div>
      
    </div>
  );
}
