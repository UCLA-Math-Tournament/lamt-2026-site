'use client';

import { ChevronRightIcon } from '@radix-ui/react-icons';
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

  return (
    <div className="archive-materials" aria-label="LAMT 2026 archive materials">
      <div className="archive-materials__root">
        <span>2026</span>
        <strong>LAMT 2026</strong>
      </div>

      <div className="archive-materials__branch">
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

              <div id={contentId} className="archive-materials__files" aria-hidden={!open}>
                <div className="archive-materials__file-list">
                  <a href={round.problem} target="_blank" rel="noreferrer" className="archive-materials__file" tabIndex={open ? undefined : -1}>
                    <span>Problems</span>
                    <em>PDF</em>
                  </a>
                  <a href={round.solution} target="_blank" rel="noreferrer" className="archive-materials__file" tabIndex={open ? undefined : -1}>
                    <span>Solutions</span>
                    <em>PDF</em>
                  </a>
                </div>
              </div>
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
