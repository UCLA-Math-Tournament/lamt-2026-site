'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRightIcon, DiscordLogoIcon, FileTextIcon } from '@radix-ui/react-icons';

const homeButtonClass =
  'btn-ripple hero-button inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold uppercase text-white';

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
    { value: '250+', label: 'students invited' },
    { value: 'May 17', label: '2026 tournament' },
    { value: 'UCLA', label: 'campus host' },
    { value: '$0', label: 'registration fee' },
  ];
  const roundCards = [
    { title: 'Individual Rounds', text: 'Algebra / number theory, combinatorics, and geometry.' },
    { title: 'Team Rounds', text: 'Secret Team Round and Guts Round.' },
    { title: 'Eligibility', text: 'Students in grade 12 or below; teams of up to 6.' },
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
            <span className="word gold-shimmer-text">Math Tournament</span>
          </h1>
          <p className="cinema-lede">
            A free high school math tournament at UCLA.
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
        </div>

        <div className="home-hero__stats">
          {highlightStats.map((stat) => (
            <div key={stat.label} className="home-stat-card">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-bento site-pad">
        <div className="home-bento__intro">
          <p className="page-kicker">Contest</p>
          <h2>Format</h2>
          <p>
            The 2026 tournament included individual and team rounds.
          </p>
        </div>
        <div className="home-bento__grid stagger-parent">
          {roundCards.map((card, index) => (
            <article key={card.title} className={`bento-card ${index === 0 ? 'bento-card--wide' : ''}`}>
              <span>0{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
          <article className="bento-card bento-card--accent">
            <span>Archive</span>
            <h3>2026 papers, solutions, and results are published.</h3>
            <Link href="/archive" className="bento-link">
              Open Archive <ArrowRightIcon />
            </Link>
          </article>
        </div>
      </section>

      <section id="register" className="registration-showcase site-pad">
        <div>
          <p className="page-kicker">Status</p>
          <h2>{regClosed ? 'Registration is closed.' : 'Registration is open.'}</h2>
          <p>
            LAMT 2026 took place on May 17 at UCLA.
          </p>
        </div>
        <div className="stagger-parent flex flex-wrap items-center gap-4">
          {!regClosed && (
            <Link href={registerUrl} target="_blank" rel="noreferrer" className="btn-filled btn-ripple">
              Register on ContestDojo
            </Link>
          )}
          <Link href="/archive" className="btn-filled btn-ripple">
            Browse Archive
          </Link>
          <Link href={discordUrl} target="_blank" rel="noreferrer" className="btn-outline btn-ripple">
            Join Discord
          </Link>
        </div>
      </section>
    </>
  );
}
