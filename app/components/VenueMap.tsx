"use client";

import { useState } from "react";
import { EnterFullScreenIcon, ExitFullScreenIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { motion, useReducedMotion } from "framer-motion";

const MAP_SRC = "https://www.google.com/maps?q=UCLA%20Mathematical%20Sciences%20Building%2C%20Los%20Angeles%2C%20CA&output=embed";

const VENUES = [
  {
    label: "Mathematical Sciences",
    meta: "MS 4000A / MS 5200",
    detail: "Contest rooms and opening ceremony.",
    href: "https://www.google.com/maps/search/?api=1&query=UCLA+Mathematical+Sciences+Building",
  },
  {
    label: "Court of Sciences",
    meta: "Lunch / Disputes",
    detail: "Lunch, score checks, and dispute window.",
    href: "https://www.google.com/maps/search/?api=1&query=Court+of+Sciences+UCLA",
  },
  {
    label: "Parking Structure 2",
    meta: "Parking",
    detail: "Closest public parking reference.",
    href: "https://www.google.com/maps/search/?api=1&query=UCLA+Parking+Structure+2",
  },
];

export default function VenueMap({ className = "" }: { className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const height = expanded ? 540 : 360;

  return (
    <motion.section
      className={["venue-real-map", expanded ? "is-expanded" : "", className].filter(Boolean).join(" ")}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      aria-label="LAMT UCLA venue map"
    >
      <div className="venue-real-map__toolbar">
        <div>
          <p>UCLA Campus</p>
          <h3>Venue Map</h3>
        </div>
        <button
          type="button"
          className="venue-real-map__toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? <ExitFullScreenIcon aria-hidden="true" /> : <EnterFullScreenIcon aria-hidden="true" />}
          <span>{expanded ? "Collapse" : "Expand"}</span>
        </button>
      </div>

      <motion.div
        className="venue-real-map__frame"
        animate={reduceMotion ? undefined : { height }}
        style={reduceMotion ? { height } : undefined}
        transition={{ type: "spring", stiffness: 190, damping: 28, mass: 0.9 }}
      >
        <iframe
          className="venue-real-map__iframe"
          title="Google Map showing UCLA Mathematical Sciences Building"
          src={MAP_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </motion.div>

      <div className="venue-real-map__details">
        {VENUES.map((venue, index) => (
          <motion.a
            key={venue.label}
            href={venue.href}
            target="_blank"
            rel="noopener noreferrer"
            className="lamt-line-item venue-real-map__venue"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="venue-real-map__pin" aria-hidden="true">{index + 1}</span>
            <span>
              <strong>{venue.label}</strong>
              <em>{venue.meta}</em>
              <small>{venue.detail}</small>
            </span>
            <ExternalLinkIcon aria-hidden="true" />
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}
