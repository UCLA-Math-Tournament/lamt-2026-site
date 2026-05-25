'use client';

import { useState } from 'react';

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

  const briefItems = [
    { title: 'Campus', text: 'In person at UCLA.' },
    { title: 'Rounds', text: 'Individual, team, and Guts.' },
    { title: 'Archive', text: '2026 papers, solutions, and results.' },
  ];
  const [activeGroup, setActiveGroup] = useState(staffGroups[0].title);
  const selectedGroup = staffGroups.find((group) => group.title === activeGroup) || staffGroups[0];

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
        <h2 className="section-title">LAMT</h2>
        <div className="lamt-line-list about-brief-list">
          {briefItems.map((item) => (
            <article key={item.title} className="lamt-line-item about-brief-item">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">LAMT Staff</h2>
        <div className="about-directory">
          <nav className="about-directory__nav" aria-label="Staff groups" role="tablist">
            {staffGroups.map((group) => {
              const isActive = group.title === selectedGroup.title;
              return (
                <button
                  key={group.title}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="staff-group-panel"
                  className="about-directory__tab"
                  onClick={() => setActiveGroup(group.title)}
                >
                  <span>{group.title}</span>
                  <strong>{group.people.length}</strong>
                </button>
              );
            })}
          </nav>

          <article className="about-directory__panel" id="staff-group-panel" role="tabpanel">
            <div className="about-directory__header">
              <div>
                <p className="label-caps">Staff Group</p>
                <h3>{selectedGroup.title}</h3>
              </div>
              <span>{selectedGroup.people.length}</span>
            </div>
            <div className="staff-people-list">
              {selectedGroup.people.map((person) => (
                <span key={person}>{person}</span>
              ))}
            </div>
          </article>
        </div>
      </section>

    </div>
  );
}
