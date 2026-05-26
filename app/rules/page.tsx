import katex from 'katex';

function InlineMath({ math }: { math: string }) {
  const html = katex.renderToString(math, {
    throwOnError: false,
    displayMode: false,
  });

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

type AcceptableExample = { math: string };
type UnacceptableExample = { unsimplified: string; acceptable: string };

function AnswerFormatExamples({
  acceptableExamples,
  unacceptableExamples,
}: {
  acceptableExamples: AcceptableExample[];
  unacceptableExamples: UnacceptableExample[];
}) {
  return (
    <div className="answer-format-examples">
      <section className="answer-format-panel" aria-label="Accepted answer examples">
        <div className="answer-panel-heading">
          <h3>Accepted</h3>
        </div>
        <div className="answer-chip-grid">
          {acceptableExamples.map((item) => (
            <span key={item.math} className="answer-chip">
              <InlineMath math={item.math} />
            </span>
          ))}
        </div>
      </section>

      <section className="answer-format-panel" aria-label="Rejected answer examples">
        <div className="answer-panel-heading">
          <h3>Rejected</h3>
        </div>
        <div className="answer-correction-list">
          <div className="answer-correction-head" aria-hidden="true">
            <span>Rejected</span>
            <span>Rewrite</span>
            <span>Accepted</span>
          </div>
          {unacceptableExamples.map((item) => (
            <article key={item.unsimplified} className="answer-correction">
              <div className="answer-correction__cell answer-correction__cell--rejected">
                <span className="answer-correction__label">Rejected</span>
                <p className="line-through"><InlineMath math={item.unsimplified} /></p>
              </div>
              <div className="answer-correction__arrow" aria-hidden="true">→</div>
              <div className="answer-correction__cell answer-correction__cell--accepted">
                <span className="answer-correction__label">Accepted</span>
                <p><InlineMath math={item.acceptable} /></p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function RulesPage() {
  const acceptableExamples = [
    { math: '879' },
    { math: '2^{57} + 1' },
    { math: '\\frac{2}{7}' },
    { math: '\\sqrt{\\pi}' },
    { math: '\\frac{11}{3}' },
    { math: '\\frac{\\sqrt{2}}{2}' },
    { math: '420!' },
    { math: '\\cos(1)' },
    { math: '\\binom{10}{4}' },
    { math: '\\frac{3\\pi}{2}' },
  ];

  const unacceptableExamples = [
    { unsimplified: '61 \\times 17', acceptable: '1037' },
    { unsimplified: '\\sin(\\frac{\\pi}{7}) - \\sin(\\frac{6\\pi}{7})', acceptable: '0' },
    { unsimplified: '\\frac{61}{31415}', acceptable: '\\frac{1}{515}' },
    { unsimplified: '\\sqrt{3 + 2\\sqrt{2}}', acceptable: '1 + \\sqrt{2}' },
    { unsimplified: '\\sqrt{\\frac{7}{9}}', acceptable: '\\frac{\\sqrt{7}}{3}' },
    { unsimplified: '\\sin(\\frac{\\pi}{10})', acceptable: '\\frac{\\sqrt{5}-1}{4}' },
    { unsimplified: '1 / \\sqrt{3}', acceptable: '\\frac{\\sqrt{3}}{3}' },
  ];

  const testFormats = [
    { name: 'Individual Rounds', desc: '10 questions plus tiebreaker. 50 minutes.' },
    { name: 'Secret Team Round', desc: 'Team round. Structure revealed on tournament day.' },
    { name: 'Guts Round', desc: '8 sets of 3 problems plus 1 estimation set. Sequential delivery.' },
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
        <div>
          <p className="page-kicker">Competition</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">Rules</h1>
          <p className="page-summary mt-5">
            Exact answers. No calculators. Team communication only during team rounds.
          </p>
        </div>
      </header>

      <section id="key-rules" className="section-row">
        <h2 className="section-title">Key Rules</h2>
        <div className="lamt-line-list rules-reference-grid">
          {keyRules.map((item) => (
            <article key={item.label} className="lamt-line-item rules-mini-rule">
              <span>{item.label}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="test-format" className="section-row">
        <h2 className="section-title">Test Format</h2>
        <div className="lamt-line-list format-grid">
          {testFormats.map(({ name, desc }) => (
            <article key={name} className="lamt-line-item format-card">
              <h3 className="font-extrabold text-[var(--color-text)]">{name}</h3>
              <p className="section-copy mt-2">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="allowed-not-allowed" className="section-row">
        <h2 className="section-title">Allowed / Not Allowed</h2>
        <div className="rules-comparison-board">
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
            unacceptableExamples={unacceptableExamples}
          />
        </div>
      </section>
    </div>
  );
}
