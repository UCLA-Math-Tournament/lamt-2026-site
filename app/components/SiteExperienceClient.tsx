'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

const REVEAL_SELECTOR = [
  '.page-hero__body',
  '.section-row',
  '.lamt-line-item',
  '.lamt-fact-row',
  '.tournament-format-row',
  '.lamt-agenda-item',
  '.live-schedule-item',
  '.rules-table-row',
  '.rules-key-row',
  '.answer-split',
  '.answer-example-line',
  '.answer-rewrite-row',
  '.faq-row',
  '.archive-round-row',
  '.archive-reference-row',
  '.archive-materials__root',
  '.archive-materials__round',
  '.archive-materials__reference',
  '.about-credit-row',
  '.about-river',
  '.sponsor-heading',
  '.sponsor-grid',
].join(',');

const TOC_SELECTOR = '.page-hero h1, .home-hero h1, .contest-flow h2, .section-row > .section-title, .sponsor-heading .sponsor-title';

type TocItem = {
  id: string;
  label: string;
};

export default function SiteExperienceClient() {
  const pathname = usePathname();
  const reduceMotion = Boolean(useReducedMotion());
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [compassOpen, setCompassOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  const bearTop = useTransform(progress, [0, 1], ['0%', '100%']);
  const bearRotate = useTransform(progress, [0, 0.5, 1], [-6, 4, 8]);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    const tocTargets = Array.from(document.querySelectorAll<HTMLElement>(TOC_SELECTOR));
    const nextToc = tocTargets.map((target, index) => {
      const label = target.getAttribute('aria-label') || target.textContent?.trim() || `Section ${index + 1}`;

      if (!target.id) {
        const slug = label
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        target.id = `section-${slug || index + 1}`;
      }

      return {
        id: target.id,
        label,
      };
    });

    setTocItems(nextToc);
    setActiveId(nextToc[0]?.id || '');

    targets.forEach((target, index) => {
      target.dataset.scrollReveal = 'true';
      target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 34}ms`);
    });

    const updateActive = () => {
      let current = nextToc[0]?.id || '';
      tocTargets.forEach((target) => {
        if (target.getBoundingClientRect().top <= 150) {
          current = target.id;
        }
      });
      setActiveId(current);
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();

    if (reduceMotion) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return () => window.removeEventListener('scroll', updateActive);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateActive);
    };
  }, [pathname, reduceMotion]);

  const activeLabel = useMemo(
    () => tocItems.find((item) => item.id === activeId)?.label || tocItems[0]?.label || 'LAMT',
    [activeId, tocItems],
  );
  const activeIndex = Math.max(0, tocItems.findIndex((item) => item.id === activeId));
  const showCompass = !pathname.startsWith('/admin') && tocItems.length > 1;

  const goToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    setCompassOpen(false);
  };

  return (
    <>
      <motion.div className="site-top-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="site-scroll-rail" aria-hidden="true">
        <div className="site-scroll-rail__track">
          <motion.span className="site-scroll-rail__fill" style={{ scaleY: progress }} />
          <motion.span className="site-scroll-rail__bear" style={{ top: bearTop, rotate: bearRotate }}>
            <Image src="/LAMTBear.png" alt="" width={44} height={44} />
          </motion.span>
        </div>
      </div>
      {showCompass ? (
        <motion.nav
          className="site-compass"
          data-open={compassOpen}
          aria-label="Page sections"
          layout
          initial={reduceMotion ? false : { y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            className="site-compass__button"
            aria-expanded={compassOpen}
            aria-label={`${compassOpen ? 'Close' : 'Open'} page sections`}
            onClick={() => setCompassOpen((open) => !open)}
          >
            <span className="site-compass__mark">
              <Image src="/LAMTBear.png" alt="" width={28} height={28} />
              <motion.span className="site-compass__mark-progress" style={{ scaleY: progress }} />
            </span>
            <span className="site-compass__label">{activeLabel}</span>
            <span className="site-compass__count">
              {String(activeIndex + 1).padStart(2, '0')} / {String(tocItems.length).padStart(2, '0')}
            </span>
            <span className="site-compass__meter" aria-hidden="true">
              {tocItems.map((item) => (
                <span key={item.id} data-active={item.id === activeId} />
              ))}
            </span>
          </button>
          <AnimatePresence>
            {compassOpen ? (
              <motion.div
                className="site-compass__panel"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="site-compass__item"
                    data-active={item.id === activeId}
                    onClick={() => goToSection(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.nav>
      ) : null}
    </>
  );
}
