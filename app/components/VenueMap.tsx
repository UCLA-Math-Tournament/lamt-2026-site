import { ExternalLinkIcon } from "@radix-ui/react-icons";

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
    href: MAP_MARKER.href,
  },
  {
    label: "Court of Sciences",
    meta: "Lunch / Disputes",
    href: "https://www.openstreetmap.org/search?query=Court%20of%20Sciences%20UCLA",
  },
  {
    label: "Parking Structure 2",
    meta: "Parking",
    href: "https://www.openstreetmap.org/search?query=UCLA%20Parking%20Structure%202",
  },
];

export default function VenueMap({ className = "" }: { className?: string }) {
  return (
    <section
      className={["venue-map", className].filter(Boolean).join(" ")}
      aria-label="LAMT UCLA venue map"
    >
      <a
        href={MAP_MARKER.href}
        target="_blank"
        rel="noopener noreferrer"
        className="venue-map__frame"
        aria-label="Open Mathematical Sciences on OpenStreetMap"
      >
        <div className="venue-map-tile-grid" aria-hidden="true">
          {MAP_TILES.map((tile) => (
            <span key={tile.key} className="venue-map-tile" style={{ backgroundImage: `url(${tile.src})` }} />
          ))}
        </div>
        <span
          className="venue-map-marker"
          style={{ left: MAP_MARKER.left, top: MAP_MARKER.top }}
        >
          <span>{MAP_MARKER.label}</span>
        </span>
        <span className="venue-map-attribution">
          OpenStreetMap
        </span>
      </a>

      <div className="venue-map__details">
        {VENUES.map((venue) => (
          <a
            key={venue.label}
            href={venue.href}
            target="_blank"
            rel="noopener noreferrer"
            className="venue-map__venue"
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
