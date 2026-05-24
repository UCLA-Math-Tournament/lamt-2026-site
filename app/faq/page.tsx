'use client';

import { useEffect, useMemo, useState } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';

const STAFF_EMAIL = 'uclamathtournament@gmail.com';

const faqs = [
  { id: 'eligibility', category: 'Eligibility', q: 'Who is eligible to compete at LAMT?', a: 'Grade 12 or below as of May 2026. No geographic restriction.' },
  { id: 'fee', category: 'Registration', q: 'Was there a registration fee?', a: 'No. LAMT 2026 was free. Participants covered travel and housing.' },
  { id: 'team-size', category: 'Teams', q: 'How large could a team be?', a: 'Up to 6 students from the same school or organization.' },
  { id: 'individual', category: 'Teams', q: 'Could students compete individually?', a: 'Yes. Individuals needed their own accompanying chaperone.' },
  { id: 'multiple-teams', category: 'Teams', q: 'Could a school send more than one team?', a: 'Yes. Each team needed its own chaperone.' },
  { id: 'topics', category: 'Contest', q: 'What topics were covered on the individual rounds?', a: 'Algebra / number theory, combinatorics, and geometry.' },
  { id: 'guts', category: 'Contest', q: 'What was the format of the Guts Round?', a: '8 sets of 3 problems plus 1 estimation set, delivered in order.' },
  { id: 'calculators', category: 'Rules', q: 'Were calculators allowed?', a: 'No calculators or computational aids during testing.' },
  { id: 'location', category: 'Logistics', q: 'Where did LAMT 2026 take place?', a: 'UCLA, May 17, 2026. Mathematical Sciences for testing; Court of Sciences for lunch and disputes.' },
  { id: 'registration-closed', category: 'Registration', q: 'Can I still register for LAMT 2026?', a: 'No. LAMT 2026 is complete. Use Archive for materials and Discord for future announcements.' },
];

const categories = ['All', ...Array.from(new Set(faqs.map((item) => item.category)))];

export default function FAQPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [openId, setOpenId] = useState(faqs[0].id);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return faqs.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesQuery = !normalized || `${item.q} ${item.a} ${item.category}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  useEffect(() => {
    if (filtered.length > 0 && !filtered.some((item) => item.id === openId)) {
      setOpenId(filtered[0].id);
    }
  }, [filtered, openId]);

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Questions</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">
            FAQ
          </h1>
          <p className="page-summary mt-5">
            Eligibility, teams, rules, logistics.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Common Questions</h2>
        <div className="faq-console">
          <div className="faq-control-panel" aria-label="FAQ filters">
            <label className="grid gap-2">
              <span className="label-caps">Search FAQ</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="lamt-input"
                placeholder="teams, calculators, location..."
              />
            </label>

            <div className="faq-category-grid" role="list" aria-label="FAQ categories">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className="lamt-button"
                  data-state={category === item ? 'selected' : undefined}
                  aria-pressed={category === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <article className="faq-empty">
              <h3>No matching answers</h3>
              <p className="section-copy">Try search or email staff.</p>
            </article>
          ) : (
            <AccordionPrimitive.Root
              type="single"
              value={openId}
              onValueChange={setOpenId}
              className="faq-accordion"
              aria-live="polite"
            >
              {filtered.map((item, index) => {
                const isOpen = openId === item.id;
                return (
                  <AccordionPrimitive.Item key={item.id} value={item.id} asChild>
                    <article className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}>
                      <AccordionPrimitive.Header className="faq-accordion-heading">
                        <AccordionPrimitive.Trigger className="faq-accordion-trigger">
                          <span className="faq-index">{String(index + 1).padStart(2, '0')}</span>
                          <span className="faq-question">
                            <strong>{item.q}</strong>
                            <small>{item.category}</small>
                          </span>
                          <span className="faq-toggle" aria-hidden="true">
                            <PlusIcon className="faq-toggle__plus" />
                            <MinusIcon className="faq-toggle__minus" />
                          </span>
                        </AccordionPrimitive.Trigger>
                      </AccordionPrimitive.Header>
                      <AccordionPrimitive.Content className="faq-accordion-content">
                        <div className="faq-accordion-content__inner">
                          <p>{item.a}</p>
                        </div>
                      </AccordionPrimitive.Content>
                    </article>
                  </AccordionPrimitive.Item>
                );
              })}
            </AccordionPrimitive.Root>
          )}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Contact</h2>
        <div className="contact-strip">
          <div>
            <p className="label-caps">Contact</p>
            <h3>{STAFF_EMAIL}</h3>
          </div>
          <a href={`mailto:${STAFF_EMAIL}`} className="btn-outline">
            Email Staff
          </a>
        </div>
      </section>
    </div>
  );
}
