'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState, type KeyboardEvent } from 'react';
import katex from 'katex';
import RulesSectionNav, { type RulesSectionLink } from '../components/RulesSectionNav';

const rulesSections: RulesSectionLink[] = [
  { id: 'key-rules', label: 'Key Rules' },
  { id: 'test-format', label: 'Format' },
  { id: 'allowed-not-allowed', label: 'Allowed' },
  { id: 'answer-format', label: 'Answers' },
];

function InlineMath({ math }: { math: string }) {
  const html = useMemo(
    () =>
      katex.renderToString(math, {
        throwOnError: false,
        displayMode: false,
      }),
    [math]
  );

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

type AcceptableExample = { math: string };
type UnacceptableExample = { unsimplified: string; acceptable: string };
type AnswerTabId = 'accepted' | 'rejected';

function AnswerFormatTabs({
  acceptableExamples,
  unacceptableExamples,
}: {
  acceptableExamples: AcceptableExample[];
  unacceptableExamples: UnacceptableExample[];
}) {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<AnswerTabId>('accepted');
  const tabs: Array<{ id: AnswerTabId; label: string; count: number }> = [
    { id: 'accepted', label: 'Accepted', count: acceptableExamples.length },
    { id: 'rejected', label: 'Rejected', count: unacceptableExamples.length },
  ];

  const focusTab = (id: AnswerTabId) => {
    setActiveTab(id);
    window.requestAnimationFrame(() => document.getElementById(`answer-${id}-tab`)?.focus());
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusTab(tabs[(index + 1) % tabs.length].id);
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusTab(tabs[(index - 1 + tabs.length) % tabs.length].id);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      focusTab(tabs[0].id);
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusTab(tabs[tabs.length - 1].id);
    }
  };

  return (
    <div className="answer-format-tabs">
      <div className="answer-format-tab-list" role="tablist" aria-label="Answer format examples">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              id={`answer-${tab.id}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`answer-${tab.id}-panel`}
              className="answer-format-tab"
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {isActive ? (
                <motion.span
                  className="answer-format-tab__marker"
                  layoutId="answer-format-tab-marker"
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 430, damping: 36 }}
                />
              ) : null}
              <span>{tab.label}</span>
              <strong>{tab.count}</strong>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          id={`answer-${activeTab}-panel`}
          className="answer-format-panel"
          role="tabpanel"
          tabIndex={-1}
          aria-labelledby={`answer-${activeTab}-tab`}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === 'accepted' ? (
            <>
              <div className="answer-panel-heading">
                <h3>Accepted Examples</h3>
                <span>{acceptableExamples.length}</span>
              </div>
              <div className="answer-chip-grid">
                {acceptableExamples.map((item, index) => (
                  <motion.span
                    key={item.math}
                    className="answer-chip"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.18, delay: Math.min(index * 0.025, 0.14), ease: [0.16, 1, 0.3, 1] }
                    }
                  >
                    <InlineMath math={item.math} />
                  </motion.span>
                ))}
              </div>
            </>
          ) : (
            <>
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
                {unacceptableExamples.map((item, index) => (
                  <motion.article
                    key={item.unsimplified}
                    className="answer-correction"
                    initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.18, delay: Math.min(index * 0.025, 0.14), ease: [0.16, 1, 0.3, 1] }
                    }
                  >
                    <div className="answer-correction__cell answer-correction__cell--rejected">
                      <span className="answer-correction__label">Rejected</span>
                      <p className="line-through"><InlineMath math={item.unsimplified} /></p>
                    </div>
                    <div className="answer-correction__arrow" aria-hidden="true">→</div>
                    <div className="answer-correction__cell answer-correction__cell--accepted">
                      <span className="answer-correction__label">Accepted</span>
                      <p><InlineMath math={item.acceptable} /></p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
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

      <RulesSectionNav sections={rulesSections} />

      <section id="key-rules" className="section-row">
        <h2 className="section-title">Key Rules</h2>
        <div className="lamt-line-list rules-reference-grid">
          {keyRules.map((item, index) => (
            <article key={item.label} className="lamt-line-item rules-mini-rule">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{item.label}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="test-format" className="section-row">
        <h2 className="section-title">Test Format</h2>
        <div className="lamt-line-list format-grid">
          {testFormats.map(({ name, desc }, index) => (
            <article key={name} className="lamt-line-item format-card">
              <span>0{index + 1}</span>
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

          <AnswerFormatTabs
            acceptableExamples={acceptableExamples}
            unacceptableExamples={unacceptableExamples}
          />
        </div>
      </section>
    </div>
  );
}
