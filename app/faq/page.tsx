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
  { id: 'registration-closed', category: 'Registration', q: 'Can I still register for LAMT 2026?', a: 'No. LAMT 2026 is complete. Use Archive for materials.' },
];

const categories = Array.from(new Set(faqs.map((item) => item.category)));

export default function FAQPage() {
  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
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

      {categories.map((category) => (
        <section key={category} className="section-row">
          <h2 className="section-title">{category}</h2>
          <div className="faq-list">
            {faqs
              .filter((item) => item.category === category)
              .map((item, index) => (
                <details key={item.id} className="faq-row" open={category === 'Eligibility' && index === 0}>
                  <summary>
                    <span>{item.q}</span>
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
          </div>
        </section>
      ))}

      <section className="section-row">
        <h2 className="section-title">Contact</h2>
        <div className="contact-strip">
          <div>
            <p className="label-caps">Email</p>
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
