'use client';

import { useState } from 'react';

export default function AboutPage() {
  const staffGroups = [
    {
      title: 'Admin',
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
      title: 'Website & Tech',
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

  const operatingPrinciples = [
    { label: 'Organizers', value: 'UCLA students' },
    { label: 'Audience', value: 'Middle and high school students' },
    { label: 'Cost', value: 'Free registration' },
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
            <span className="word">About</span>{' '}
            <span className="word">Us</span>
          </h1>
          <p className="page-summary reveal mt-5">
            The Los Angeles Math Tournament Group runs a free in-person math contest for middle and high school students.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Mission</h2>
        <div className="mission-board">
          <div className="mission-stack stagger-parent">
            <p className="section-copy">
              LAMT gives students a full contest day at UCLA with individual rounds, team rounds, lunch, disputes, and awards.
            </p>
            <p className="section-copy">
              The tournament is built around clear logistics, strong problem writing, and a collaborative team experience.
            </p>
          </div>
          <div className="mission-principles">
            {operatingPrinciples.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
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
