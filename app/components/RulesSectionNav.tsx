'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type RulesSectionLink = {
  id: string;
  label: string;
};

function clamp(value: number) {
  return Math.min(100, Math.max(0, value));
}

export default function RulesSectionNav({ sections }: { sections: RulesSectionLink[] }) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionIds = useMemo(() => sections.map((section) => section.id).join('|'), [sections]);

  const scrollToSection = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      const headerOffset = window.innerWidth < 760 ? 116 : 136;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      setActiveId(id);
      window.scrollTo({
        top,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    },
    [reduceMotion]
  );

  useEffect(() => {
    const ids = sectionIds.split('|').filter(Boolean);
    if (!ids.length) return undefined;

    const updateState = () => {
      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => Boolean(element));

      if (!elements.length) return;

      const activationOffset = window.innerWidth < 760 ? 132 : 156;
      const nextActive =
        elements.reduce((current, element) => {
          const top = element.getBoundingClientRect().top;
          return top - activationOffset <= 0 ? element.id : current;
        }, elements[0].id) ?? elements[0].id;

      setActiveId((current) => (current === nextActive ? current : nextActive));

      const documentElement = document.documentElement;
      const maxScroll = Math.max(1, documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(clamp((window.scrollY / maxScroll) * 100));
    };

    updateState();
    window.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);

    return () => {
      window.removeEventListener('scroll', updateState);
      window.removeEventListener('resize', updateState);
    };
  }, [sectionIds]);

  return (
    <nav className="rules-section-nav" aria-label="Rules sections">
      <div className="rules-section-nav__progress-track" aria-hidden="true">
        <motion.div
          className="rules-section-nav__progress"
          animate={{ width: `${scrollProgress}%` }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="rules-section-nav__items">
        {sections.map((section) => {
          const active = section.id === activeId;

          return (
            <button
              key={section.id}
              type="button"
              className="rules-section-nav__button"
              data-active={active}
              aria-current={active ? 'location' : undefined}
              onClick={() => scrollToSection(section.id)}
            >
              <span className="rules-section-nav__label">{section.label}</span>
              {active ? (
                <motion.span
                  className="rules-section-nav__marker"
                  layoutId="rules-section-nav-marker"
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
