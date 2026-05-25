'use client';

import { useEffect } from 'react';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function initCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!els.length) return () => {};

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  const animate = (el: HTMLElement) => {
    const target = parseFloat(el.dataset.count ?? '0');
    const suffix = el.dataset.countSuffix ?? '';
    const prefix = el.dataset.countPrefix ?? '';
    const duration = 1100;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = target * easeOut(progress);
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(value).toString() : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  els.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

function initReveals() {
  const els = document.querySelectorAll<HTMLElement>(
    [
      '.reveal',
      '.stagger-parent > *',
      '.home-hero__content > *',
      '.hero-animate-words .word',
      '.page-title',
      '.lamt-line-item',
      '.archive-material-link',
      '.lamt-timeline-item',
      '.faq-accordion-item',
    ].join(', ')
  );
  if (!els.length) return () => {};

  els.forEach((el) => {
    if (el.dataset.revealed) return;
    el.style.opacity = '0.72';
    el.style.transform = 'translateY(6px)';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        if (el.dataset.revealed) return;

        const parent = el.parentElement;
        const index = parent?.classList.contains('stagger-parent') ? Array.from(parent.children).indexOf(el) : 0;

        el.dataset.revealed = '1';
        el.animate(
          [
            { opacity: 0.72, transform: 'translateY(6px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 320,
            delay: Math.min(index * 35, 140),
            easing: EASE,
            fill: 'forwards',
          }
        ).onfinish = () => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        };

        observer.unobserve(el);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );

  els.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

function initTimelineDraw() {
  const rails = document.querySelectorAll<HTMLElement>('.timeline-rail');
  if (!rails.length) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).classList.add('timeline-drawn');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  rails.forEach((rail) => observer.observe(rail));
  return () => observer.disconnect();
}

function initScrollProgress() {
  let createdTrack: HTMLElement | null = null;
  let bar = document.querySelector<HTMLElement>('.lamt-scroll-progress span');

  if (!bar) {
    createdTrack = document.createElement('div');
    createdTrack.className = 'lamt-scroll-progress';
    createdTrack.setAttribute('aria-hidden', 'true');
    bar = document.createElement('span');
    createdTrack.appendChild(bar);
    document.body.prepend(createdTrack);
  }

  let frame = 0;

  const update = () => {
    frame = 0;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
    bar.style.setProperty('transform', `scaleX(${progress})`, 'important');
  };

  const requestUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', requestUpdate);
    createdTrack?.remove();
  };
}

function initSectionFocus() {
  const sections = document.querySelectorAll<HTMLElement>('.section-row, .home-bento, .registration-showcase');
  if (!sections.length) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-section-active', entry.isIntersecting);
      });
    },
    { threshold: 0.18, rootMargin: '-24% 0px -58% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
}

export default function AnimationEngine() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const cleanups = [
      initCounters(),
      initReveals(),
      initTimelineDraw(),
      initScrollProgress(),
      initSectionFocus(),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
