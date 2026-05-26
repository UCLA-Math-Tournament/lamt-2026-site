'use client';

import { useEffect } from 'react';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function initReveals() {
  const els = document.querySelectorAll<HTMLElement>(
    [
      '.reveal',
      '.stagger-parent > *',
      '.home-hero__content > *',
      '.hero-animate-words .word',
      '.page-title',
      '.lamt-line-item',
      '.lamt-fact-row',
      '.tournament-format-row',
      '.archive-index-group',
      '.faq-accordion-item',
    ].join(', ')
  );
  if (!els.length) return () => {};

  els.forEach((el) => {
    if (el.dataset.revealed) return;
    el.style.opacity = '0.88';
    el.style.transform = 'translateY(4px)';
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
            { opacity: 0.88, transform: 'translateY(4px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 220,
            delay: Math.min(index * 24, 72),
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

function initHeaderState() {
  let frame = 0;

  const update = () => {
    frame = 0;
    document.body.classList.toggle('is-scrolled', window.scrollY > 18);
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
    document.body.classList.remove('is-scrolled');
  };
}

export default function AnimationEngine() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const cleanups = [
      initReveals(),
      initHeaderState(),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
