'use client';

import { useEffect, useRef, useState } from 'react';

function renderCount(value: string, count: number) {
  const match = value.match(/^(\$?)(\d+)(\+?)$/);
  if (!match) return value;

  return `${match[1]}${count}${match[3]}`;
}

export default function AnimatedStatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const [visible, setVisible] = useState(false);
  const numericText = value.match(/^(\$?)(\d+)(\+?)$/)?.[2] ?? null;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !numericText) {
      if (visible) setDisplayValue(value);
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }

    const target = Number(numericText);
    const duration = 640;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(renderCount(value, Math.round(target * eased)));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [numericText, value, visible]);

  return (
    <span
      ref={ref}
      className="stat-value-animated"
      data-visible={visible ? 'true' : undefined}
      aria-label={value}
    >
      {displayValue}
    </span>
  );
}
