'use client';

import { useEffect, useState } from 'react';
import KaTeXLoader from '../components/KaTeXLoader';
import RulesSectionNav, { type RulesSectionLink } from '../components/RulesSectionNav';

const rulesSections: RulesSectionLink[] = [
  { id: 'key-rules', label: 'Key Rules' },
  { id: 'test-format', label: 'Test Format' },
  { id: 'allowed-not-allowed', label: 'Allowed / Not Allowed' },
  { id: 'answer-format', label: 'Answer Format' },
];

function InlineMath({ math }: { math: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    const tryRender = () => {
      const katex = (window as any).katex;
      if (!katex) return false;

      setHtml(
        katex.renderToString(math, {
          throwOnError: false,
          displayMode: false,
        })
      );
      return true;
    };

    if (!tryRender()) {
      const id = window.setInterval(() => {
        if (tryRender()) window.clearInterval(id);
      }, 50);
      return () => window.clearInterval(id);
    }
  }, [math]);

  if (!html) return <span>{math}</span>;

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
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
    { math: '\\binom{10^{100000}}{4}' },
    { math: '11 \\sqrt[11]{\\frac{27}{4}}' },
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
    { name: 'Individual Rounds', desc: '10 questions plus a tiebreaker problem. 50-minute time limit per round.' },
    { name: 'Secret Team Round', desc: 'A collaborative team round with the exact structure revealed on tournament day.' },
    { name: 'Guts Round', desc: '8 sets of 3 problems plus 1 set of estimation problems, delivered to teams in sequential order.' },
  ];

  const keyRules = [
    { label: 'Answers', text: 'Exact and simplified unless the problem states otherwise.' },
    { label: 'Individual Tests', text: 'No internet access and no communication with other people.' },
    { label: 'Team Tests', text: 'Teammates may communicate only during team-based tests.' },
  ];

  const ruleTable = [
    {
      category: 'Contest aids',
      allowed: 'Materials explicitly provided or approved by LAMT staff.',
      notAllowed: 'Calculators, slide rules, abaci, books, notes, graph paper, rulers, compasses, and protractors.',
    },
    {
      category: 'Communication',
      allowed: 'Team discussion during team-based tests.',
      notAllowed: 'Phones, computers, internet access, or communication outside the permitted team format.',
    },
    {
      category: 'Answer form',
      allowed: 'Correct mathematical notation, exact values, and simplified expressions.',
      notAllowed: 'Unsimplified expressions or unsupported approximations unless a problem requests them.',
    },
  ];

  return (
    <div className="page-shell">
      <KaTeXLoader />

      <header className="page-hero">
        <div>
          <p className="page-kicker">Competition Rules</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">Rules</h1>
          <p className="page-summary mt-5">
            Testing format, honor code expectations, and answer standards for LAMT competitors.
          </p>
        </div>
      </header>

      <RulesSectionNav sections={rulesSections} />

      <section id="key-rules" className="section-row">
        <h2 className="section-title">Key Rules</h2>
        <div className="rules-reference-grid">
          {keyRules.map((item) => (
            <article key={item.label} className="rules-mini-rule">
              <span>{item.label}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="test-format" className="section-row">
        <h2 className="section-title">Test Format</h2>
        <div className="format-grid">
          {testFormats.map(({ name, desc }, index) => (
            <div key={name} className="format-card">
              <span>0{index + 1}</span>
              <h3 className="font-extrabold text-[var(--color-text)]">{name}</h3>
              <p className="section-copy mt-2">{desc}</p>
            </div>
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
            Answers must be written in correct mathematical notation. Unless otherwise specified, all answers must be exact and simplified. Graders will take a reasonably lenient interpretation of &quot;simplified.&quot; The decisions of the LAMT coordinators are final.
          </p>

          <div className="answer-reference-board">
            <div className="answer-lab-panel">
              <div className="answer-panel-heading">
                <h3>Accepted Examples</h3>
                <span>{acceptableExamples.length}</span>
              </div>
              <div className="answer-chip-grid">
                {acceptableExamples.map((item) => (
                  <span key={item.math} className="answer-chip">
                    <InlineMath math={item.math} />
                  </span>
                ))}
              </div>
            </div>

            <div className="answer-lab-panel">
              <div className="answer-panel-heading">
                <h3>Rejected Examples</h3>
                <span>{unacceptableExamples.length}</span>
              </div>
              <div className="answer-correction-list" aria-label="Rejected answer examples with accepted rewrites">
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
