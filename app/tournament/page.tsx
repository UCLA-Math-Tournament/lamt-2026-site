export default function TournamentPage() {
  const schedule = [
    { time: '8:00 AM', end: '8:45 AM', event: 'Contestant Check-In', location: 'Outside MS 4000A', note: 'Teams arrived, received materials, and checked in with chaperones.' },
    { time: '8:45 AM', end: '9:15 AM', event: 'Opening Ceremony', location: 'MS 4000A', note: 'Contest rules, staff introductions, and UCLA logistics.' },
    { time: '9:15 AM', end: '10:30 AM', event: 'Secret Team Round', location: 'MS 4000A, MS 5200', note: 'Collaborative opening round with a format revealed on site.' },
    { time: '10:30 AM', end: '11:30 AM', event: 'Algebra / Number Theory', location: 'MS 4000A, MS 5200', note: 'Individual exact-answer round.' },
    { time: '11:30 AM', end: '12:30 PM', event: 'Combinatorics', location: 'MS 4000A, MS 5200', note: 'Individual exact-answer round.' },
    { time: '12:30 PM', end: '1:30 PM', event: 'Lunch & Disputes', location: 'Court of Sciences', note: 'Food break, score checks, and dispute window.' },
    { time: '1:30 PM', end: '2:45 PM', event: 'Geometry', location: 'MS 4000A, MS 5200', note: 'Individual exact-answer round.' },
    { time: '2:45 PM', end: '4:15 PM', event: 'Guts Round', location: 'MS 4000A, MS 5200', note: 'Sequential team sets with fast submission strategy.' },
    { time: '4:15 PM', end: '6:00 PM', event: 'Activities', location: 'MS 4000A, MS 5200', note: 'Post-contest programming while scores were finalized.' },
    { time: '6:00 PM', end: '7:30 PM', event: 'Awards Ceremony', location: 'MS 4000A', note: 'Final rankings, recognition, and closing.' },
  ];

  const eligibility = [
    'Students must be in grade 12 or below at the time of participation (May 2026).',
    'Teams may consist of at most 6 students.',
    'Students on eligible teams must come from the same school or organization, but there are no geographical restrictions.',
    'One school or organization may apply to send multiple eligible teams to compete. However, we require each team to have their own accompanying chaperone throughout the event.',
    'Students who are not able to form an eligible team are also able to apply to compete as an individual. Please note that each individual must have their own accompanying chaperone.',
  ];

  const format = [
    { name: 'Individual Rounds', desc: 'Each individual round consisted of 10 questions plus a tiebreaker problem, with a 50-minute time limit.' },
    { name: 'Secret Team Round', desc: 'A collaborative team round with the exact format revealed on tournament day.' },
    { name: 'Guts Round', desc: 'A standard guts round consisting of 8 sets of 3 problems plus 1 set of estimation problems, delivered to teams in order. Any topics from the individual rounds may also appear on team exams.' },
  ];

  const facts = [
    { label: 'Date', value: 'May 17, 2026' },
    { label: 'Campus', value: 'UCLA' },
    { label: 'Capacity', value: '250 students' },
    { label: 'Fee', value: '$0' },
  ];

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Tournament</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title hero-animate-words">
            <span className="word">LAMT 2026</span>{' '}
            <span className="word">Tournament Brief</span>
          </h1>
          <p className="page-summary reveal mt-5">
            LAMT 2026 took place on <strong>May 17, 2026</strong> on the UCLA campus. This page covers eligibility, format, location, and schedule.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">At a Glance</h2>
        <div className="tournament-fact-grid">
          {facts.map((fact) => (
            <article key={fact.label} className="tournament-fact">
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Eligibility</h2>
        <ul className="rule-chip-grid stagger-parent">
          {eligibility.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section-row">
        <h2 className="section-title">Format</h2>
        <div className="format-grid stagger-parent">
          {format.map(({ name, desc }, index) => (
            <div key={name} className="format-card">
              <span>0{index + 1}</span>
              <h3>{name}</h3>
              <p className="section-copy mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Schedule</h2>
        <div className="lamt-timeline" aria-label="LAMT 2026 tournament day timeline">
          {schedule.map(({ time, end, event, location, note }, index) => (
            <article key={`${time}-${event}`} className="lamt-timeline-item">
              <div className="lamt-timeline-node" aria-hidden="true">
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="lamt-timeline-card">
                <div>
                  <span className="lamt-timeline-time">{time}-{end}</span>
                  <h3>{event}</h3>
                </div>
                <p>{note}</p>
                <strong>{location}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Location</h2>
        <div>
          <p className="section-copy reveal mb-6">
            Testing took place in the <strong>Mathematical Sciences Building</strong>, with lunch and disputes centered around the <strong>Court of Sciences</strong>.
          </p>
          <div className="reveal h-[360px] border-2 border-[var(--color-border)]">
            <iframe
              title="Court of Sciences UCLA map"
              className="map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7!2d-118.4417!3d34.0683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc85b3b3b3b3%3A0x0!2sCourt+of+Sciences%2C+UCLA!5e0!3m2!1sen!2sus!4v1617000000000!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">More Information</h2>
        <div className="stagger-parent flex flex-wrap gap-3">
          <a href="/archive" className="btn-filled btn-ripple">
            View 2026 Archive
          </a>
          <a href="/rules" className="btn-outline btn-ripple">
            Read Competition Rules
          </a>
        </div>
      </section>
    </div>
  );
}
