'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const spring = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 360, damping: 28, mass: 0.7 };

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
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      className="theme-toggle"
      data-mode={dark ? 'dark' : 'light'}
    >
      <span className="theme-toggle__orb" aria-hidden="true">
        <motion.span
          className="theme-toggle__sun"
          animate={{
            opacity: dark ? 0 : 1,
            rotate: dark ? 90 : 0,
            scale: dark ? 0.42 : 1,
          }}
          transition={spring}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} className="theme-toggle__ray" />
          ))}
          <span className="theme-toggle__core" />
        </motion.span>

        <motion.span
          className="theme-toggle__moon"
          animate={{
            opacity: dark ? 1 : 0,
            x: dark ? 0 : 7,
            rotate: dark ? 0 : -24,
            scale: dark ? 1 : 0.48,
          }}
          transition={spring}
        >
          <span className="theme-toggle__moon-cut" />
        </motion.span>

        <motion.span
          key={dark ? 'dark' : 'light'}
          className="theme-toggle__pulse"
          initial={reduceMotion ? false : { opacity: 0.18, scale: 0.7 }}
          animate={{ opacity: 0, scale: 1.65 }}
          transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
        />
      </span>
    </button>
  );
}
