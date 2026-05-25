import TournamentScheduleTabs from '../components/TournamentScheduleTabs';
import VenueMap from '../components/VenueMap';

export default function TournamentPage() {
  const schedule = [
    { time: '8:00 AM', end: '8:45 AM', event: 'Contestant Check-In', location: 'Outside MS 4000A', note: 'Materials and chaperone check-in.' },
    { time: '8:45 AM', end: '9:15 AM', event: 'Opening Ceremony', location: 'MS 4000A', note: 'Rules and room logistics.' },
    { time: '9:15 AM', end: '10:30 AM', event: 'Secret Team Round', location: 'MS 4000A, MS 5200', note: 'Team round; format revealed on site.' },
    { time: '10:30 AM', end: '11:30 AM', event: 'Algebra / Number Theory', location: 'MS 4000A, MS 5200', note: 'Individual round.' },
    { time: '11:30 AM', end: '12:30 PM', event: 'Combinatorics', location: 'MS 4000A, MS 5200', note: 'Individual round.' },
    { time: '12:30 PM', end: '1:30 PM', event: 'Lunch & Disputes', location: 'Court of Sciences', note: 'Food break, score checks, and dispute window.' },
    { time: '1:30 PM', end: '2:45 PM', event: 'Geometry', location: 'MS 4000A, MS 5200', note: 'Individual round.' },
    { time: '2:45 PM', end: '4:15 PM', event: 'Guts Round', location: 'MS 4000A, MS 5200', note: '8 problem sets plus estimation.' },
    { time: '4:15 PM', end: '6:00 PM', event: 'Activities', location: 'MS 4000A, MS 5200', note: 'Activities while scores were finalized.' },
    { time: '6:00 PM', end: '7:30 PM', event: 'Awards Ceremony', location: 'MS 4000A', note: 'Final rankings and awards.' },
  ];

  const eligibility = [
    'Grade 12 or below as of May 2026.',
    'Teams of up to 6 students.',
    'Same school or organization; no geography restriction.',
    'Each team needs an accompanying chaperone.',
    'Individuals may apply with their own chaperone.',
  ];

  const format = [
    { name: 'Individual Rounds', desc: '10 questions plus tiebreaker. 50 minutes.' },
    { name: 'Secret Team Round', desc: 'Team round. Format revealed on site.' },
    { name: 'Guts Round', desc: '8 sets of 3 problems plus 1 estimation set. Sequential delivery.' },
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
          <p className="page-kicker">LAMT 2026</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title hero-animate-words">
            <span className="word">Tournament</span>
          </h1>
          <p className="page-summary reveal mt-5">
            May 17, 2026. UCLA. Free. Teams up to 6.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">At a Glance</h2>
        <div className="lamt-line-list tournament-fact-grid">
          {facts.map((fact) => (
            <article key={fact.label} className="lamt-line-item tournament-fact">
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Eligibility</h2>
        <ul className="lamt-line-list lamt-line-list--compact stagger-parent">
          {eligibility.map((item, index) => (
            <li key={item} className="lamt-line-item">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-row">
        <h2 className="section-title">Format</h2>
        <div className="lamt-line-list format-grid stagger-parent">
          {format.map(({ name, desc }, index) => (
            <article key={name} className="lamt-line-item format-card">
              <span>0{index + 1}</span>
              <h3>{name}</h3>
              <p className="section-copy mt-2">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Schedule</h2>
        <TournamentScheduleTabs schedule={schedule} />
      </section>

      <section className="section-row">
        <h2 className="section-title">Location</h2>
        <div>
          <p className="section-copy reveal mb-6">
            Mathematical Sciences and Court of Sciences.
          </p>
          <VenueMap />
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Links</h2>
        <div className="lamt-action-row stagger-parent">
          <a href="/archive" className="btn-filled">
            View 2026 Archive
          </a>
          <a href="/rules" className="btn-outline">
            Read Competition Rules
          </a>
        </div>
      </section>
    </div>
  );
}
