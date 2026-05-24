'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRightIcon, DiscordLogoIcon, FileTextIcon } from '@radix-ui/react-icons';

const homeButtonClass =
  'hero-button inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold uppercase text-white';

function useCountdown(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const [diff, setDiff] = useState(target - Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setDiff(target - Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return diff;
}

function TournamentCountdown({ diff }: { diff: number }) {
  if (diff <= 0) return null;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    <div className="flex select-none items-end justify-center gap-5 tabular-nums md:gap-7">
      {[
        { value: String(days), label: 'days' },
        { value: pad(hours), label: 'hrs' },
        { value: pad(minutes), label: 'min' },
        { value: pad(seconds), label: 'sec' },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="text-3xl font-light leading-none tracking-tight text-white md:text-5xl">{item.value}</span>
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function RegistrationCountdown({ diff }: { diff: number }) {
  if (diff <= 0) return null;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    <div className="flex select-none items-end justify-center gap-5 tabular-nums md:gap-7">
      {[
        { value: String(days), label: 'days' },
        { value: pad(hours), label: 'hrs' },
        { value: pad(minutes), label: 'min' },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="text-3xl font-light leading-none tracking-tight text-[#FFD100] md:text-5xl">{item.value}</span>
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function HomeClient({
  registerUrl,
  discordUrl,
}: {
  registerUrl: string;
  discordUrl: string;
}) {
  const tournamentDiff = useCountdown('2026-05-17T08:00:00-07:00');
  const regDiff = useCountdown('2026-05-10T23:59:59-07:00');
  const regClosed = regDiff <= 0;
  const tournamentComplete = tournamentDiff <= 0;
  const highlightStats = [
    { value: '250+', label: 'students' },
    { value: 'May 17', label: '2026' },
    { value: 'UCLA', label: 'campus' },
    { value: '$0', label: 'fee' },
  ];
  const programRows = [
    { title: 'Date', text: 'May 17, 2026 at UCLA.' },
    { title: 'Who', text: 'Middle and high school students; teams up to 6.' },
    { title: 'Contest', text: 'Individual rounds, Secret Team, and Guts.' },
    { title: 'After', text: 'Problems, solutions, and results stay in Archive.' },
  ];

  return (
    <>
      <section className="home-hero">
        <div aria-hidden className="home-hero__mesh" />
        <div className="home-hero__bear parallax-slow">
          <Image src="/LAMTBear.png" alt="" width={760} height={760} className="hero-bear-img" priority />
        </div>

        <div className="home-hero__content">
          <div className="hero-badge">
            <span>LAMT 2026</span>
            <strong>{tournamentComplete ? 'May 17 at UCLA' : 'Registration closed May 10'}</strong>
          </div>
          <h1 className="hero-animate-words">
            <span className="word">Los Angeles</span>
            {' '}
            <span className="word gold-shimmer-text">Math Tournament</span>
          </h1>
          <p className="cinema-lede">
            Free in-person math contest for middle and high school students.
          </p>

          {tournamentComplete ? (
            <div className="cinema-actions">
              <Link href="/archive" className={homeButtonClass}>
                <FileTextIcon /> View 2026 Archive
              </Link>
              <Link href="/tournament" className={homeButtonClass}>
                Tournament Info <ArrowRightIcon />
              </Link>
              <Link href={discordUrl} target="_blank" rel="noreferrer" className={`${homeButtonClass} hero-button--ghost`}>
                <DiscordLogoIcon /> Join Discord
              </Link>
            </div>
          ) : (
            <div className="home-hero__countdowns">
              <div>
                <p className="label-caps">Tournament - May 17</p>
                <TournamentCountdown diff={tournamentDiff} />
              </div>
              {!regClosed && (
                <div>
                  <p className="label-caps text-[#FFD100]">Registration Deadline</p>
                  <RegistrationCountdown diff={regDiff} />
                </div>
              )}
              <div className="cinema-actions">
                {!regClosed && (
                  <Link href={registerUrl} target="_blank" rel="noreferrer" className={homeButtonClass}>
                    Register on ContestDojo <ArrowRightIcon />
                  </Link>
                )}
                <Link href={discordUrl} target="_blank" rel="noreferrer" className={`${homeButtonClass} hero-button--ghost`}>
                  Join Discord
                </Link>
              </div>
            </div>
          )}

          <div className="home-hero__stats">
            {highlightStats.map((stat) => (
              <div key={stat.label} className="home-stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-bento site-pad">
        <div className="home-bento__intro">
          <p className="page-kicker">LAMT 2026</p>
          <h2>A Day at UCLA</h2>
          <p>
            What competitors and coaches need to know.
          </p>
        </div>
        <div className="lamt-line-list home-program-list">
          {programRows.map((row, index) => (
            <article key={row.title} className="lamt-line-item">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{row.title}</h3>
              <p>{row.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="register" className="registration-showcase site-pad">
        <div>
          <p className="page-kicker">Next</p>
          <h2>{regClosed ? 'Use the 2026 archive.' : 'Register for LAMT 2026.'}</h2>
          <p>
            Rules, results, and tournament materials are available.
          </p>
        </div>
        <div className="stagger-parent flex flex-wrap items-center gap-4">
          {!regClosed && (
            <Link href={registerUrl} target="_blank" rel="noreferrer" className="btn-filled">
              Register on ContestDojo
            </Link>
          )}
          <Link href="/archive" className="btn-filled">
            Browse Archive
          </Link>
          <Link href="/tournament" className="btn-outline">
            Tournament Info
          </Link>
          <Link href={discordUrl} target="_blank" rel="noreferrer" className="btn-outline">
            Join Discord
          </Link>
        </div>
      </section>
    </>
  );
}
