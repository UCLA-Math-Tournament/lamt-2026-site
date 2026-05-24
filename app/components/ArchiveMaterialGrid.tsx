"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ArchiveMaterial = {
  name: string;
  href: string;
  type: string;
};

type ArchiveGroup = {
  category: string;
  items: ArchiveMaterial[];
};

function ArchiveMaterialCard({ group, index }: { group: ArchiveGroup; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 92%", "end 18%"],
  });

  const y = useTransform(scrollYProgress, [0, 0.45, 1], [24, 0, -8]);
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], [4, 0, -1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.22, 1], [0.72, 1, 1]);
  return (
    <motion.article
      ref={cardRef}
      className="archive-card archive-card--motion"
      style={
        reduceMotion
          ? undefined
          : {
              opacity,
              y,
              rotateX,
              transformPerspective: 900,
            }
      }
      transition={{ duration: 0.28, delay: index * 0.035, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="archive-card__header">
        <span className="label-caps">{group.category}</span>
        <strong>{group.items.length}</strong>
      </div>
      <ul>
        {group.items.map((item) => (
          <li key={item.name}>
            <motion.a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="archive-link"
              whileHover={reduceMotion ? undefined : { x: 4 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            >
              <span className="archive-link__title">{item.name}</span>
              <span className="archive-link__meta">
                <em>{item.type}</em>
              </span>
            </motion.a>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export default function ArchiveMaterialGrid({ groups }: { groups: ArchiveGroup[] }) {
  return (
    <div className="archive-grid archive-grid--motion">
      {groups.map((group, index) => (
        <ArchiveMaterialCard key={group.category} group={group} index={index} />
      ))}
    </div>
  );
}
