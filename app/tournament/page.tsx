import VenueMap from '../components/VenueMap';

export default function TournamentPage() {
  const schedule = [
    { time: '8:00 AM', end: '8:45 AM', event: 'Contestant Check-In', location: 'Outside MS 4000A' },
    { time: '8:45 AM', end: '9:15 AM', event: 'Opening Ceremony', location: 'MS 4000A' },
    { time: '9:15 AM', end: '10:30 AM', event: 'Secret Team Round', location: 'MS 4000A, MS 5200' },
    { time: '10:30 AM', end: '11:30 AM', event: 'Algebra / Number Theory', location: 'MS 4000A, MS 5200' },
    { time: '11:30 AM', end: '12:30 PM', event: 'Combinatorics', location: 'MS 4000A, MS 5200' },
    { time: '12:30 PM', end: '1:30 PM', event: 'Lunch & Disputes', location: 'Court of Sciences' },
    { time: '1:30 PM', end: '2:45 PM', event: 'Geometry', location: 'MS 4000A, MS 5200' },
    { time: '2:45 PM', end: '4:15 PM', event: 'Guts Round', location: 'MS 4000A, MS 5200' },
    { time: '4:15 PM', end: '6:00 PM', event: 'Activities', location: 'MS 4000A, MS 5200' },
    { time: '6:00 PM', end: '7:30 PM', event: 'Awards Ceremony', location: 'MS 4000A' },
  ];

  const basics = [
    { label: 'Eligibility', value: 'Grade 12 or below' },
    { label: 'Teams', value: 'Up to 6 students' },
    { label: 'School', value: 'Same school or organization' },
    { label: 'Chaperone', value: 'Required' },
    { label: 'Cost', value: 'Free' },
  ];

  const format = [
    { name: 'Individual Rounds', desc: '10 questions plus tiebreaker. 50 minutes.' },
    { name: 'Secret Team Round', desc: 'Team round. Format revealed on site.' },
    { name: 'Guts Round', desc: '8 sets of 3 problems plus 1 estimation set. Sequential delivery.' },
  ];

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">Tournament</h1>
          <p className="page-summary mt-5">
            May 17, 2026. UCLA. Teams up to 6.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Basics</h2>
        <div className="lamt-fact-list">
          {basics.map((item) => (
            <div key={item.label} className="lamt-fact-row">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Format</h2>
        <div className="tournament-format-list">
          {format.map(({ name, desc }) => (
            <article key={name} className="tournament-format-row">
              <h3>{name}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Schedule</h2>
        <div className="lamt-agenda" aria-label="LAMT 2026 schedule">
          {schedule.map(({ time, end, event, location }) => (
            <article key={`${time}-${event}`} className="lamt-agenda-item">
              <div className="lamt-agenda-time">
                <strong>{time} - {end}</strong>
              </div>
              <div className="lamt-agenda-main">
                <h3>{event}</h3>
              </div>
              <strong className="lamt-agenda-place">{location}</strong>
            </article>
          ))}
        </div>
      </section>

      <section id="venue" className="section-row">
        <h2 className="section-title">Location</h2>
        <VenueMap />
      </section>
    </div>
  );
}
