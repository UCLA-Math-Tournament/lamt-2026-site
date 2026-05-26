import katex from 'katex';

function InlineMath({ math }: { math: string }) {
  const html = katex.renderToString(math, {
    throwOnError: false,
    displayMode: false,
  });

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

type RewriteExample = { rejected: string; accepted: string };

function AnswerFormatExamples({
  acceptableExamples,
  rewriteExamples,
}: {
  acceptableExamples: string[];
  rewriteExamples: RewriteExample[];
}) {
  return (
    <div className="answer-format">
      <div className="answer-example-line" aria-label="Accepted answer examples">
        <strong>Accepted examples</strong>
        <p>
          {acceptableExamples.map((math) => (
            <span key={math}>
              <InlineMath math={math} />
            </span>
          ))}
        </p>
      </div>

      <div className="answer-rewrite-list" aria-label="Rejected and accepted answer rewrites">
        <div className="answer-rewrite-head" aria-hidden="true">
          <span>Rejected</span>
          <span>Accepted</span>
        </div>
        {rewriteExamples.map((item) => (
          <div key={item.rejected} className="answer-rewrite-row">
            <p className="line-through"><InlineMath math={item.rejected} /></p>
            <p><InlineMath math={item.accepted} /></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RulesPage() {
  const acceptableExamples = [
    '879',
    '2^{57} + 1',
    '\\frac{2}{7}',
    '\\sqrt{\\pi}',
    '\\frac{11}{3}',
    '\\frac{\\sqrt{2}}{2}',
    '420!',
    '\\cos(1)',
    '\\binom{10}{4}',
    '\\frac{3\\pi}{2}',
  ];

  const rewriteExamples = [
    { rejected: '61 \\times 17', accepted: '1037' },
    { rejected: '\\sin(\\frac{\\pi}{7}) - \\sin(\\frac{6\\pi}{7})', accepted: '0' },
    { rejected: '\\frac{61}{31415}', accepted: '\\frac{1}{515}' },
    { rejected: '\\sqrt{3 + 2\\sqrt{2}}', accepted: '1 + \\sqrt{2}' },
    { rejected: '\\sqrt{\\frac{7}{9}}', accepted: '\\frac{\\sqrt{7}}{3}' },
    { rejected: '\\sin(\\frac{\\pi}{10})', accepted: '\\frac{\\sqrt{5}-1}{4}' },
    { rejected: '1 / \\sqrt{3}', accepted: '\\frac{\\sqrt{3}}{3}' },
  ];

  const keyRules = [
    { label: 'Answers', text: 'Exact and simplified unless the problem states otherwise.' },
    { label: 'Individual Tests', text: 'No internet access and no communication with other people.' },
    { label: 'Team Tests', text: 'Teammates may communicate only during team-based tests.' },
  ];

  const ruleTable = [
    {
      category: 'Contest aids',
      allowed: 'Materials provided or approved by LAMT staff.',
      notAllowed: 'Calculators, slide rules, abaci, books, notes, graph paper, rulers, compasses, and protractors.',
    },
    {
      category: 'Communication',
      allowed: 'Team discussion during team-based tests.',
      notAllowed: 'Phones, computers, internet, or outside communication.',
    },
    {
      category: 'Answer form',
      allowed: 'Exact values and simplified expressions.',
      notAllowed: 'Unsimplified expressions or unrequested approximations.',
    },
  ];

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div className="page-hero__body">
          <h1 className="page-title">Rules</h1>
          <p className="page-summary mt-5">
            Exact answers. No calculators. Team communication only during team rounds.
          </p>
        </div>
      </header>

      <section id="key-rules" className="section-row">
        <h2 className="section-title">Key Rules</h2>
        <div className="rules-key-list">
          {keyRules.map((item) => (
            <div key={item.label} className="rules-key-row">
              <strong>{item.label}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="allowed-not-allowed" className="section-row">
        <h2 className="section-title">Materials</h2>
        <div className="rules-comparison-table" role="table" aria-label="LAMT rules reference">
          <div className="rules-table-row rules-table-head" role="row">
            <span role="columnheader">Area</span>
            <span role="columnheader">Allowed</span>
            <span role="columnheader">Not Allowed</span>
          </div>
          {ruleTable.map((row) => (
            <div key={row.category} className="rules-table-row" role="row">
              <strong role="cell">{row.category}</strong>
              <p role="cell">
                <span className="rules-cell-label">Allowed</span>
                {row.allowed}
              </p>
              <p role="cell">
                <span className="rules-cell-label">Not Allowed</span>
                {row.notAllowed}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="answer-format" className="section-row">
        <h2 className="section-title">Answer Format</h2>
        <div>
          <p className="section-copy mb-8">
            Unless stated otherwise: exact, simplified, correct notation. LAMT coordinators make final grading decisions.
          </p>

          <AnswerFormatExamples
            acceptableExamples={acceptableExamples}
            rewriteExamples={rewriteExamples}
          />
        </div>
      </section>
    </div>
  );
}
