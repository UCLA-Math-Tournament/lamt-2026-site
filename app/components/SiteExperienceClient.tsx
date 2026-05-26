'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

const REVEAL_SELECTOR = [
  '.page-title',
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
  '.venue-map__tag',
  '.venue-map__details',
  '.sponsor-heading',
  '.sponsor-grid',
  '.site-footer__socials',
  '.site-footer__note',
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
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  const bearTop = useTransform(progress, [0, 1], ['0%', '100%']);
  const bearRotate = useTransform(progress, [0, 0.5, 1], [-6, 4, 8]);
  const fieldBlueX = useTransform(progress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-8%', '6%']);
  const fieldGoldX = useTransform(progress, [0, 1], reduceMotion ? ['0%', '0%'] : ['7%', '-5%']);
  const fieldBearY = useTransform(progress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-8%', '9%']);
  const fieldBearRotate = useTransform(progress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [-4, 2, 5]);
  const auroraBlueY = useTransform(progress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-6%', '10%']);
  const auroraGoldY = useTransform(progress, [0, 1], reduceMotion ? ['0%', '0%'] : ['9%', '-7%']);
  const auroraScale = useTransform(progress, [0, 0.5, 1], reduceMotion ? [1, 1, 1] : [1, 1.04, 1.01]);

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

  const showJumpRail = !pathname.startsWith('/admin') && tocItems.length > 1;

  const goToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <>
      <div className="site-atmosphere" data-home={pathname === '/' ? 'true' : undefined} aria-hidden="true">
        <motion.span className="site-atmosphere__aurora site-atmosphere__aurora--blue" style={{ scale: auroraScale, y: auroraBlueY }} />
        <motion.span className="site-atmosphere__aurora site-atmosphere__aurora--gold" style={{ scale: auroraScale, y: auroraGoldY }} />
        <motion.span className="site-atmosphere__path site-atmosphere__path--blue" style={{ x: fieldBlueX }} />
        <motion.span className="site-atmosphere__path site-atmosphere__path--gold" style={{ x: fieldGoldX }} />
        <motion.span className="site-atmosphere__bear" style={{ y: fieldBearY, rotate: fieldBearRotate }}>
          <Image src="/LAMTBear.png" alt="" width={260} height={260} />
        </motion.span>
      </div>
      <div className="site-edge-blur site-edge-blur--top" aria-hidden="true" />
      <div className="site-edge-blur site-edge-blur--bottom" aria-hidden="true" />
      <motion.div className="site-top-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="site-scroll-rail" aria-hidden="true">
        <div className="site-scroll-rail__track">
          <motion.span className="site-scroll-rail__fill" style={{ scaleY: progress }} />
          <motion.span className="site-scroll-rail__bear" style={{ top: bearTop, rotate: bearRotate }}>
            <Image src="/LAMTBear.png" alt="" width={44} height={44} />
          </motion.span>
        </div>
      </div>
      {showJumpRail ? (
        <motion.nav
          className="site-jumprail"
          aria-label="Page sections"
          initial={reduceMotion ? false : { y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="site-jumprail__track" aria-hidden="true">
            <motion.span className="site-jumprail__fill" style={{ scaleY: progress }} />
            <motion.span className="site-jumprail__bear" style={{ top: bearTop, rotate: bearRotate }}>
              <Image src="/LAMTBear.png" alt="" width={30} height={30} />
            </motion.span>
          </span>
          <div className="site-jumprail__items">
            {tocItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="site-jumprail__item"
                data-active={item.id === activeId}
                aria-label={`Jump to ${item.label}`}
                onClick={() => goToSection(item.id)}
              >
                <span className="site-jumprail__tick" aria-hidden="true" />
                <span className="site-jumprail__label">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.nav>
      ) : null}
    </>
  );
}
