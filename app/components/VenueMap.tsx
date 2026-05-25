"use client";

import { useState } from "react";
import { EnterFullScreenIcon, ExitFullScreenIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { motion, useReducedMotion } from "framer-motion";

const MAP_ZOOM = 16;
const MAP_TILE_X_START = 11203;
const MAP_TILE_Y_START = 26163;
const MAP_TILE_COLUMNS = 6;
const MAP_TILE_ROWS = 3;
const MAP_MARKER = {
  label: "Mathematical Sciences",
  left: "52.5%",
  top: "43%",
  href: "https://www.openstreetmap.org/?mlat=34.06954&mlon=-118.44278#map=16/34.06954/-118.44278",
};
const MAP_TILES = Array.from({ length: MAP_TILE_ROWS }, (_, row) =>
  Array.from({ length: MAP_TILE_COLUMNS }, (_, column) => ({
    key: `${row}-${column}`,
    src: `https://tile.openstreetmap.org/${MAP_ZOOM}/${MAP_TILE_X_START + column}/${MAP_TILE_Y_START + row}.png`,
  }))
).flat();

const VENUES = [
  {
    label: "Mathematical Sciences",
    meta: "MS 4000A / MS 5200",
    detail: "Contest rooms and opening ceremony.",
    href: MAP_MARKER.href,
  },
  {
    label: "Court of Sciences",
    meta: "Lunch / Disputes",
    detail: "Lunch, score checks, and dispute window.",
    href: "https://www.openstreetmap.org/search?query=Court%20of%20Sciences%20UCLA",
  },
  {
    label: "Parking Structure 2",
    meta: "Parking",
    detail: "Closest public parking reference.",
    href: "https://www.openstreetmap.org/search?query=UCLA%20Parking%20Structure%202",
  },
];

export default function VenueMap({ className = "" }: { className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const height = expanded ? 540 : 360;

  return (
    <motion.section
      className={["venue-real-map", expanded ? "is-expanded" : "", className].filter(Boolean).join(" ")}
      initial={false}
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
        <div className="venue-map-tile-grid" aria-hidden="true">
          {MAP_TILES.map((tile) => (
            <span key={tile.key} className="venue-map-tile" style={{ backgroundImage: `url(${tile.src})` }} />
          ))}
        </div>
        <a
          href={MAP_MARKER.href}
          target="_blank"
          rel="noopener noreferrer"
          className="venue-map-marker"
          style={{ left: MAP_MARKER.left, top: MAP_MARKER.top }}
          aria-label="Open Mathematical Sciences on OpenStreetMap"
        >
          <span>{MAP_MARKER.label}</span>
        </a>
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="venue-map-attribution"
        >
          OpenStreetMap
        </a>
      </motion.div>

      <div className="venue-real-map__details">
        {VENUES.map((venue, index) => (
          <motion.a
            key={venue.label}
            href={venue.href}
            target="_blank"
            rel="noopener noreferrer"
            className="lamt-line-item venue-real-map__venue"
            whileHover={reduceMotion ? undefined : { x: 2 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
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
