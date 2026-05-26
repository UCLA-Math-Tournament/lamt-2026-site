"use client";

import { useState } from "react";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

const MAP_ZOOM = 16;
const MAP_TILE_X_START = 11203;
const MAP_TILE_Y_START = 26163;
const MAP_TILE_COLUMNS = 6;
const MAP_TILE_ROWS = 3;
const MAP_MARKER_HREF = "https://www.openstreetmap.org/?mlat=34.06954&mlon=-118.44278#map=16/34.06954/-118.44278";
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
    href: MAP_MARKER_HREF,
    left: 52.5,
    top: 43,
  },
  {
    label: "Court of Sciences",
    meta: "Lunch / Disputes",
    href: "https://www.openstreetmap.org/search?query=Court%20of%20Sciences%20UCLA",
    left: 54.3,
    top: 52.1,
  },
  {
    label: "Parking Structure 2",
    meta: "Parking",
    href: "https://www.openstreetmap.org/search?query=UCLA%20Parking%20Structure%202",
    left: 46,
    top: 46,
  },
];

export default function VenueMap({ className = "" }: { className?: string }) {
  const [activeVenue, setActiveVenue] = useState(0);
  const active = VENUES[activeVenue] || VENUES[0];
  const routePoints = VENUES.map((venue) => `${venue.left},${venue.top}`).join(" ");

  return (
    <section
      className={["venue-map", className].filter(Boolean).join(" ")}
      aria-label="LAMT UCLA venue map"
    >
      <div className="venue-map__frame">
        <a
          href={active.href}
          target="_blank"
          rel="noopener noreferrer"
          className="venue-map__open"
          aria-label={`Open ${active.label} on OpenStreetMap`}
        />
        <div className="venue-map-tile-grid" aria-hidden="true">
          {MAP_TILES.map((tile) => (
            <span key={tile.key} className="venue-map-tile" style={{ backgroundImage: `url(${tile.src})` }} />
          ))}
        </div>
        <svg className="venue-map-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={routePoints} />
        </svg>

        {VENUES.map((venue, index) => (
          <a
            key={venue.label}
            href={venue.href}
            target="_blank"
            rel="noopener noreferrer"
            className="venue-map-marker"
            style={{ left: `${venue.left}%`, top: `${venue.top}%` }}
            data-active={index === activeVenue}
            aria-label={`Open ${venue.label} on OpenStreetMap`}
            onMouseEnter={() => setActiveVenue(index)}
            onFocus={() => setActiveVenue(index)}
          >
            <span>{venue.label}</span>
          </a>
        ))}

        <span className="venue-map-attribution">
          OpenStreetMap
        </span>
      </div>

      <div className="venue-map__details">
        {VENUES.map((venue, index) => (
          <a
            key={venue.label}
            href={venue.href}
            target="_blank"
            rel="noopener noreferrer"
            className="venue-map__venue"
            data-active={index === activeVenue}
            aria-current={index === activeVenue ? "location" : undefined}
            onMouseEnter={() => setActiveVenue(index)}
            onFocus={() => setActiveVenue(index)}
          >
            <span>
              <strong>{venue.label}</strong>
              <em>{venue.meta}</em>
            </span>
            <ExternalLinkIcon aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
