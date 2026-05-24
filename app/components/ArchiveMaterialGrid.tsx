"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

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
  Problems: "Contest papers.",
  Solutions: "Answer keys.",
  Results: "Placements.",
  "Schedule / Rules": "Logistics.",
};

function panelId(category: string) {
  return `archive-material-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export default function ArchiveMaterialGrid({ groups }: { groups: ArchiveGroup[] }) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const previousIndex = useRef(0);
  const activeGroup = groups[activeIndex] ?? groups[0];
  const totalItems = groups.reduce((total, group) => total + group.items.length, 0);

  const activateTab = (nextIndex: number, shouldFocus = false) => {
    const nextGroup = groups[nextIndex];

    if (!nextGroup) return;
    previousIndex.current = activeIndex;
    setActiveIndex(nextIndex);

    if (shouldFocus) {
      window.requestAnimationFrame(() => document.getElementById(`${panelId(nextGroup.category)}-tab`)?.focus());
    }
  };

  useEffect(() => {
    if (activeIndex > groups.length - 1) {
      previousIndex.current = 0;
      setActiveIndex(0);
    }
  }, [activeIndex, groups.length]);

  if (!activeGroup) return null;

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      activateTab((index + 1) % groups.length, true);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      activateTab((index - 1 + groups.length) % groups.length, true);
    }

    if (event.key === "Home") {
      event.preventDefault();
      activateTab(0, true);
    }

    if (event.key === "End") {
      event.preventDefault();
      activateTab(groups.length - 1, true);
    }
  };

  return (
    <section className="archive-material-tabs" aria-label="LAMT archive materials">
      <div className="archive-material-tabs__top">
        <div>
          <span className="label-caps">LAMT 2026</span>
          <h3>Archive Files</h3>
        </div>
        <strong>{totalItems} links</strong>
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
              tabIndex={isActive ? 0 : -1}
              className="archive-material-tab"
              onClick={() => activateTab(index)}
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
              initial={reduceMotion ? false : { opacity: 0, x: index >= previousIndex.current ? 14 : -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: index >= previousIndex.current ? -10 : 10 }}
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
                {group.items.map((item, itemIndex) => {
                  const opensNewTab = item.type === "PDF" || item.href.startsWith("http");

                  return (
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
                        target={opensNewTab ? "_blank" : undefined}
                        rel={opensNewTab ? "noreferrer" : undefined}
                        className="archive-material-link"
                        whileHover={reduceMotion ? undefined : { x: 4 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                      >
                        <span>{item.name}</span>
                        <em>{item.type}</em>
                      </motion.a>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ) : null
        ))}
      </AnimatePresence>
    </section>
  );
}
