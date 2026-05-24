"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState, type KeyboardEvent } from "react";

type ArchiveMaterial = {
  name: string;
  href: string;
  type: string;
};

type ArchiveGroup = {
  category: string;
  items: ArchiveMaterial[];
};

const categoryCopy: Record<string, string> = {
  Problems: "Contest papers by round.",
  Solutions: "Official solutions.",
  Results: "Final standings.",
  Corrections: "Notices and updates.",
};

function panelId(category: string) {
  return `archive-material-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export default function ArchiveMaterialGrid({ groups }: { groups: ArchiveGroup[] }) {
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState(groups[0]?.category ?? "");
  const activeGroup = useMemo(
    () => groups.find((group) => group.category === activeCategory) ?? groups[0],
    [activeCategory, groups]
  );
  const totalItems = groups.reduce((total, group) => total + group.items.length, 0);

  if (!activeGroup) return null;

  const activeIndex = groups.findIndex((group) => group.category === activeGroup.category);
  const setAdjacentTab = (currentIndex: number, offset: number) => {
    const nextGroup = groups[(currentIndex + offset + groups.length) % groups.length];

    if (!nextGroup) return;
    setActiveCategory(nextGroup.category);
    window.requestAnimationFrame(() => document.getElementById(`${panelId(nextGroup.category)}-tab`)?.focus());
  };
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setAdjacentTab(index, 1);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setAdjacentTab(index, -1);
    }
  };

  return (
    <section className="archive-material-tabs" aria-label="LAMT archive materials">
      <div className="archive-material-tabs__top">
        <div>
          <span className="label-caps">Browse</span>
          <h3>Materials</h3>
        </div>
        <strong>{totalItems} files</strong>
      </div>

      <div className="archive-material-tab-list" role="tablist" aria-label="Material type">
        {groups.map((group, index) => {
          const isActive = group.category === activeGroup.category;
          const tabId = `${panelId(group.category)}-tab`;

          return (
            <button
              key={group.category}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId(group.category)}
              className="archive-material-tab"
              onClick={() => setActiveCategory(group.category)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {isActive ? (
                <motion.span
                  className="archive-material-tab__marker"
                  layoutId="archive-material-tab-marker"
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 430, damping: 36 }}
                />
              ) : null}
              <span>{group.category}</span>
              <strong>{group.items.length}</strong>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {groups.map((group, index) => (
          group.category === activeGroup.category ? (
            <motion.div
              key={group.category}
              id={panelId(group.category)}
              className="archive-material-panel"
              role="tabpanel"
              tabIndex={-1}
              aria-labelledby={`${panelId(group.category)}-tab`}
              aria-live="polite"
              initial={reduceMotion ? false : { opacity: 0, x: index >= activeIndex ? 14 : -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: index >= activeIndex ? -10 : 10 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="archive-material-panel__header">
                <div>
                  <span className="label-caps">{group.category}</span>
                  <p>{categoryCopy[group.category] ?? "Published materials."}</p>
                </div>
                <strong>{group.items.length}</strong>
              </div>

              <ul className="archive-material-links">
                {group.items.map((item, itemIndex) => (
                  <motion.li
                    key={item.name}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.18, delay: Math.min(itemIndex * 0.035, 0.14), ease: [0.16, 1, 0.3, 1] }
                    }
                  >
                    <motion.a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="archive-material-link"
                      whileHover={reduceMotion ? undefined : { x: 4 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                    >
                      <span>{item.name}</span>
                      <em>{item.type}</em>
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ) : null
        ))}
      </AnimatePresence>
    </section>
  );
}
