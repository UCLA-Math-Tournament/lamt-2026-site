export default function AboutPage() {
  const staffGroups = [
    {
      title: 'Leadership',
      people: ['Kenneth Ren', 'Muztaba Syed', 'Arpit Uppal', 'Brooks Wang', 'Thomas Wu', 'Vicky Zhang'],
    },
    {
      title: 'Problem Writing',
      people: [
        'Arahat Chikkatur',
        'Kyle Hess',
        'Ricky Hu',
        'Bhargava Kanakapura',
        'Jian Kweon',
        'Andrew Li',
        'Aliya Ling',
        'Anthony Mui',
        'Kenneth Ren',
        'Gautham Subramanian',
        'Muztaba Syed',
        'Albert Tran',
        'Arpit Uppal',
        'Brooks Wang',
        'Thomas Wu',
        'Vicky Zhang',
      ],
    },
    {
      title: 'Technology',
      people: ['Aryan Dalal', 'Nish Tharakan', 'Arpit Uppal'],
    },
    {
      title: 'Design and Outreach',
      people: ['Patrick Bian', 'Eva Chung-Yoon', 'Betty Chang', 'Arpit Uppal', 'Vicky Zhang'],
    },
    {
      title: 'Tournament Development',
      people: ['Patrick Bian', 'Kenneth Ren', 'Muztaba Syed', 'Arpit Uppal', 'Brooks Wang', 'Vicky Zhang'],
    },
    {
      title: 'General Members',
      people: [
        'Patrick Bian',
        'Richard Cai',
        'Betty Chang',
        'Allan Chen',
        'Arahat Chikkatur',
        'Eva Chung-Yoon',
        'Aryan Dalal',
        'Sean He',
        'Kyle Hess',
        'Ricky Hu',
        'Nathan Jiang',
        'Luke Jones',
        'Bhargava Kanakapura',
        'Jian Kweon',
        'Andrew Li',
        'William Li',
        'Aliya Ling',
        'Anthony Mui',
        'Pierre Nguyen',
        'Gautham Subramanian',
        'Nish Tharakan',
        'Albert Tran',
      ],
    },
    {
      title: 'Advising / Friends',
      people: [
        'Richard Chen (SCMC)',
        'Aedan Hui (BMT)',
        'Vivian Loh (CMM)',
        'Oliver Ni (BMT, ICMT)',
        'Arpit Ranasaria (ICMT, SMT)',
        'Taman Truong (ICMT, SCMC)',
        'Nathan Wong (BMT)',
        'Grace Yang (BrUMO)',
        'Yibo Zhang (SCMC)',
      ],
    },
  ];

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Organization</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title hero-animate-words">
            <span className="word">About</span>
          </h1>
          <p className="page-summary reveal mt-5">
            UCLA students. Free contest. In person.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">LAMT Staff</h2>
        <div className="about-staff-list">
          {staffGroups.map((group) => (
            <section key={group.title} className="about-staff-row">
              <h3>{group.title}</h3>
              <p>{group.people.join(', ')}</p>
            </section>
          ))}
        </div>
      </section>

    </div>
  );
}
