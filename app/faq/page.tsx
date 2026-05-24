'use client';

import { useEffect, useMemo, useState } from 'react';

const STAFF_EMAIL = 'uclamathtournament@gmail.com';

const faqs = [
  { id: 'eligibility', category: 'Eligibility', q: 'Who is eligible to compete at LAMT?', a: 'Any student enrolled in grade 12 or below as of May 2026 was eligible. LAMT did not have a geographic restriction.' },
  { id: 'fee', category: 'Registration', q: 'Was there a registration fee?', a: 'No. LAMT 2026 had no registration fee. Each participant was responsible for travel, housing, and related expenses.' },
  { id: 'team-size', category: 'Teams', q: 'How large could a team be?', a: 'Teams could include at most 6 students. Students on an eligible team had to come from the same school or organization.' },
  { id: 'individual', category: 'Teams', q: 'Could students compete individually?', a: 'Yes. Students who could not form an eligible team could apply as individual competitors, with their own accompanying chaperone.' },
  { id: 'multiple-teams', category: 'Teams', q: 'Could a school send more than one team?', a: 'Yes. A school or organization could apply to send multiple eligible teams, with each team requiring its own accompanying chaperone.' },
  { id: 'topics', category: 'Contest', q: 'What topics were covered on the individual rounds?', a: 'LAMT used individual rounds in algebra / number theory, combinatorics, and geometry. Team rounds could draw from the same general contest math areas.' },
  { id: 'guts', category: 'Contest', q: 'What was the format of the Guts Round?', a: 'The Guts Round used 8 sets of 3 problems plus 1 set of estimation problems, delivered to teams in sequential order.' },
  { id: 'calculators', category: 'Rules', q: 'Were calculators allowed?', a: 'No. Calculators and other computational aids were prohibited during all testing portions of the contest.' },
  { id: 'location', category: 'Logistics', q: 'Where did LAMT 2026 take place?', a: 'LAMT 2026 was held on the UCLA campus on May 17, 2026. Testing rooms were in the Mathematical Sciences Building, with lunch and disputes around the Court of Sciences.' },
  { id: 'registration-closed', category: 'Registration', q: 'Can I still register for LAMT 2026?', a: 'No. LAMT 2026 registration is closed because the tournament took place on May 17, 2026. Use the archive for 2026 materials and Discord for future announcements.' },
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
            Common answers about eligibility, teams, rules, and logistics.
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

          <div className="faq-accordion" aria-live="polite">
            {filtered.length === 0 ? (
              <article className="faq-empty">
                <h3>No matching answers</h3>
                <p className="section-copy">Try a broader search or email staff directly.</p>
              </article>
            ) : (
              filtered.map((item, index) => {
                const isOpen = openId === item.id;
                return (
                  <article key={item.id} className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenId(isOpen ? '' : item.id)}
                      className="faq-accordion-trigger"
                    >
                      <span className="faq-index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="faq-question">
                        <strong>{item.q}</strong>
                        <small>{item.category}</small>
                      </span>
                      <span className="faq-toggle" aria-hidden="true">{isOpen ? '-' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-accordion-content">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Contact</h2>
        <div className="contact-strip">
          <div>
            <p className="label-caps">Still Need Help?</p>
            <h3>Email the LAMT team.</h3>
          </div>
          <a href={`mailto:${STAFF_EMAIL}`} className="btn-outline btn-ripple">
            Email Staff
          </a>
        </div>
      </section>
    </div>
  );
}
