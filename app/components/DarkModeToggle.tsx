'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const rawId = useId();
  const maskId = `lamt-theme-mask-${rawId.replace(/:/g, '')}`;
  const shouldReduceMotion = useReducedMotion();
  const spring = shouldReduceMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 30 };

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('lamt-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = savedTheme ? savedTheme === 'dark' : prefersDark;

    document.documentElement.classList.toggle('dark', next);
    setDark(next);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('lamt-theme', next ? 'dark' : 'light');
  };

  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle dark mode"
      aria-pressed={dark}
      className="theme-toggle"
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
      transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 28 }}
    >
      <motion.svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="square"
        initial={false}
        animate={{ rotate: dark ? 270 : 0 }}
        transition={spring}
      >
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <motion.circle
            initial={false}
            animate={{ cx: dark ? 17 : 33, cy: dark ? 8 : 0 }}
            transition={spring}
            r="9"
            fill="black"
          />
        </mask>

        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          stroke="none"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{ r: dark ? 9 : 5 }}
          transition={spring}
        />

        <motion.g
          initial={false}
          animate={{
            opacity: dark ? 0 : 1,
            scale: dark ? 0 : 1,
            rotate: dark ? -30 : 0,
          }}
          transition={spring}
          style={{ transformOrigin: '12px 12px' }}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="5.64" y1="5.64" x2="4.22" y2="4.22" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          <line x1="5.64" y1="18.36" x2="4.22" y2="19.78" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        </motion.g>
      </motion.svg>
    </motion.button>
  );
}
