'use client';

import { motion, useInView, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

type Token =
  | { kind: 'digit'; value: number }
  | { kind: 'literal'; value: string };

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function tokenize(value: string): Token[] {
  const tokens: Token[] = [];
  let literal = '';

  for (const character of value) {
    if (character >= '0' && character <= '9') {
      if (literal) {
        tokens.push({ kind: 'literal', value: literal });
        literal = '';
      }
      tokens.push({ kind: 'digit', value: Number(character) });
    } else {
      literal += character;
    }
  }

  if (literal) tokens.push({ kind: 'literal', value: literal });
  return tokens;
}

function DigitColumn({
  digit,
  triggered,
  reducedMotion,
  delay,
}: {
  digit: number;
  triggered: boolean;
  reducedMotion: boolean;
  delay: number;
}) {
  const spring = useSpring(reducedMotion ? digit : 0, {
    stiffness: 160,
    damping: 28,
    mass: 1,
  });
  const y = useTransform(spring, (value) => `${-value}em`);

  useEffect(() => {
    if (!triggered) return;

    if (reducedMotion) {
      spring.set(digit);
      return;
    }

    const timeout = window.setTimeout(() => spring.set(digit), delay * 1000);
    return () => window.clearTimeout(timeout);
  }, [delay, digit, reducedMotion, spring, triggered]);

  if (reducedMotion) {
    return (
      <span className="stat-value-animated__slot" aria-hidden="true">
        <span className="stat-value-animated__static-digit">{digit}</span>
      </span>
    );
  }

  return (
    <span className="stat-value-animated__slot" aria-hidden="true">
      <motion.span className="stat-value-animated__column" style={{ y }}>
        {DIGITS.map((item) => (
          <span key={item} className="stat-value-animated__column-digit">
            {item}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function LiteralToken({
  value,
  triggered,
  reducedMotion,
  delay,
}: {
  value: string;
  triggered: boolean;
  reducedMotion: boolean;
  delay: number;
}) {
  if (reducedMotion) {
    return <span className="stat-value-animated__literal">{value}</span>;
  }

  return (
    <motion.span
      className="stat-value-animated__literal"
      initial={{ opacity: 0, y: '0.18em' }}
      animate={triggered ? { opacity: 1, y: '0em' } : { opacity: 0, y: '0.18em' }}
      transition={{ duration: 0.42, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {value}
    </motion.span>
  );
}

export default function AnimatedStatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const inView = useInView(ref, { once: true, margin: '0px 0px 35% 0px' });
  const tokens = useMemo(() => tokenize(value), [value]);
  const triggered = inView || reducedMotion;

  return (
    <span ref={ref} className="stat-value-animated" aria-label={value}>
      {tokens.map((token, index) => {
        const delay = index * 0.045;

        if (token.kind === 'digit') {
          return (
            <DigitColumn
              key={`${index}-${token.value}`}
              digit={token.value}
              triggered={triggered}
              reducedMotion={reducedMotion}
              delay={delay}
            />
          );
        }

        return (
          <LiteralToken
            key={`${index}-${token.value}`}
            value={token.value}
            triggered={triggered}
            reducedMotion={reducedMotion}
            delay={delay}
          />
        );
      })}
    </span>
  );
}
