'use client';

import { ChevronRightIcon } from '@radix-ui/react-icons';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

type ArchiveRound = {
  name: string;
  problem: string;
  solution: string;
};

type ArchiveReference = {
  label: string;
  href: string;
  type: string;
};

type ArchiveMaterialsClientProps = {
  rounds: ArchiveRound[];
  reference: ArchiveReference[];
};

export default function ArchiveMaterialsClient({ rounds, reference }: ArchiveMaterialsClientProps) {
  const [openRound, setOpenRound] = useState(rounds[0]?.name || '');
  const reduceMotion = Boolean(useReducedMotion());
  const selectedIndex = rounds.findIndex((round) => round.name === openRound);
  const openIndex = Math.max(selectedIndex, 0);
  const branchProgress = selectedIndex >= 0 && rounds.length > 0 ? (openIndex + 1) / rounds.length : 0;
  const motionDuration = reduceMotion ? 0 : 0.2;

  return (
    <div className="archive-materials" aria-label="LAMT 2026 archive materials">
      <div className="archive-materials__root">
        <span>2026</span>
        <strong>LAMT 2026</strong>
      </div>

      <div className="archive-materials__branch">
        <motion.span
          className="archive-materials__branch-fill"
          aria-hidden="true"
          initial={false}
          animate={{ scaleY: branchProgress }}
          transition={{ duration: motionDuration, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          className="archive-materials__active-node"
          aria-hidden="true"
          initial={false}
          animate={{ opacity: selectedIndex >= 0 ? 1 : 0, y: reduceMotion ? 0 : openIndex * 56 }}
          transition={{ duration: motionDuration, ease: [0.16, 1, 0.3, 1] }}
        />

        {rounds.map((round) => {
          const open = openRound === round.name;
          const contentId = `archive-${round.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

          return (
            <div key={round.name} className="archive-materials__round" data-open={open}>
              <button
                type="button"
                className="archive-materials__trigger"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => setOpenRound(open ? '' : round.name)}
              >
                <ChevronRightIcon aria-hidden="true" />
                <span>{round.name}</span>
              </button>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    id={contentId}
                    className="archive-materials__files"
                    key={contentId}
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: motionDuration, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="archive-materials__file-list">
                      {[
                        { href: round.problem, label: 'Problems' },
                        { href: round.solution, label: 'Solutions' },
                      ].map((file, index) => (
                        <motion.a
                          key={file.label}
                          href={file.href}
                          target="_blank"
                          rel="noreferrer"
                          className="archive-materials__file"
                          initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: motionDuration, delay: reduceMotion ? 0 : index * 0.035 }}
                        >
                          <span>{file.label}</span>
                          <em>PDF</em>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}

        {reference.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.type === 'PDF' ? '_blank' : undefined}
            rel={item.type === 'PDF' ? 'noreferrer' : undefined}
            className="archive-materials__reference"
          >
            <span>{item.label}</span>
            <em>{item.type}</em>
          </a>
        ))}
      </div>
    </div>
  );
}
