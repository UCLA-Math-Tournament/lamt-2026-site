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
  const els = document.querySelectorAll<HTMLElement>('.reveal, .stagger-parent > *');
  if (!els.length) return () => {};

  els.forEach((el) => {
    if (el.dataset.revealed) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
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
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 420,
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

export default function AnimationEngine() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const cleanups = [
      initCounters(),
      initReveals(),
      initTimelineDraw(),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
