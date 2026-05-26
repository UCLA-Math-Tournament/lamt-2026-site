'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

type FAQItem = {
  id: string;
  q: string;
  a: string;
};

export default function FAQAccordionClient({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState(items[0]?.id || '');

  return (
    <div className="faq-list">
      {items.map((item) => {
        const open = item.id === openId;
        const contentId = `faq-answer-${item.id}`;

        return (
          <div key={item.id} className="faq-row" data-open={open}>
            <button
              type="button"
              className="faq-row__trigger"
              aria-expanded={open}
              aria-controls={contentId}
              onClick={() => setOpenId(open ? '' : item.id)}
            >
              <span>{item.q}</span>
              <ChevronDownIcon aria-hidden="true" />
            </button>

            <div id={contentId} className="faq-row__content">
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
