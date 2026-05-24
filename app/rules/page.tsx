'use client';

import { useEffect, useState } from 'react';
import KaTeXLoader from '../components/KaTeXLoader';

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

  const prohibited = [
    'Calculators',
    'Other computational aids, such as slide rulers and abaci',
    'Reference materials, such as books and notes',
    'Communication devices, such as cell phones and computers',
    'Any drawing aids (rulers, compasses, protractors)',
    'Graph paper',
  ];

  const ruleSignals = [
    { label: 'Exact', text: 'Answers should be exact unless a problem states otherwise.' },
    { label: 'Simplified', text: 'Equivalent expressions may still be rejected if left unsimplified.' },
    { label: 'No Devices', text: 'Calculators, computers, phones, and communication devices are not contest aids.' },
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

      <section className="section-row">
        <h2 className="section-title">Rule Signals</h2>
        <div className="rules-signal-grid">
          {ruleSignals.map((item) => (
            <article key={item.label} className="rules-signal-card">
              <span>{item.label}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-row">
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

      <section className="section-row">
        <h2 className="section-title">Honor Code</h2>
        <div className="rules-callout">
          <p className="section-copy mb-6">
            We expect that when taking their individual tests, the only aid or resource students will use are those explicitly specified below. Students may not access the internet or communicate with other people. For team-based tests, students may communicate with their teammates, but otherwise the same expectations hold.
          </p>
          <p className="mb-4 font-extrabold text-[var(--color-text)]">
            The following may not be used during any testing portion of the contest:
          </p>
          <ul className="rule-chip-grid">
            {prohibited.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Acceptable Answers</h2>
        <div>
          <p className="section-copy mb-8">
            Answers must be written in correct mathematical notation. Unless otherwise specified, all answers must be exact and simplified. Graders will take a reasonably lenient interpretation of &quot;simplified.&quot; The decisions of the LAMT coordinators are final.
          </p>

          <div className="answer-lab">
            <div className="answer-lab-panel">
              <h3 className="mb-4 font-extrabold text-[var(--color-text)]">Examples of Acceptable Answers</h3>
              <div className="answer-chip-grid">
                {acceptableExamples.map((item) => (
                  <span key={item.math} className="answer-chip">
                    <InlineMath math={item.math} />
                  </span>
                ))}
              </div>
            </div>

            <div className="answer-lab-panel">
              <h3 className="mb-4 font-extrabold text-[var(--color-text)]">Examples of Unacceptable Answers</h3>
              <div className="answer-correction-grid">
                {unacceptableExamples.map((item) => (
                  <article key={item.unsimplified} className="answer-correction">
                    <div>
                      <span className="label-caps">Rejected</span>
                      <p className="line-through"><InlineMath math={item.unsimplified} /></p>
                    </div>
                    <div>
                      <span className="label-caps">Accepted</span>
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
