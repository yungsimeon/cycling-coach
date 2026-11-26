"use client";

import { useEffect, useRef } from "react";
import type { LatLng } from "@/lib/rides/route";
import { label } from "@/components/ui/styles";
import "leaflet/dist/leaflet.css";

// Map styles, all keyless (attribution is required). Fine for dev; before deploying
// publicly, check the providers' terms or switch to a keyed provider (see BACKLOG).
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const TILES = {
  darkBase: `${ESRI}/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
  darkLabels: `${ESRI}/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
  hillshade: `${ESRI}/Elevation/World_Hillshade_Dark/MapServer/tile/{z}/{y}/{x}`,
  satellite: `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
  topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
};
const ESRI_CREDIT = "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors";
const SATELLITE_CREDIT = "Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics";
const TOPO_CREDIT =
  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM &mdash; Style &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)';

// You can zoom to 18 everywhere; past a provider's last real zoom level
// ("native" zoom), Leaflet just enlarges its sharpest tiles.
const MAX_ZOOM = 18;

type Style = "Dark" | "Topo" | "Satellite";
const STYLE_KEY = "ride-map-style";

// The chosen map style is remembered per browser. Storage can be blocked
// (private mode etc.), so every access is wrapped and falls back to "Dark".
function savedStyle(): Style {
  try {
    const value = localStorage.getItem(STYLE_KEY);
    if (value === "Topo" || value === "Satellite") return value;
  } catch {}
  return "Dark";
}
function saveStyle(style: string) {
  try {
    localStorage.setItem(STYLE_KEY, style);
  } catch {}
}

// Reads a color token from globals.css, so the map uses the same palette as the rest of the app.
function token(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

// The ride's GPS track on a map, with start and finish markers.
// Leaflet touches `window`, so it's loaded inside useEffect, which only runs in the browser.
export default function RideMap({ route }: { route: LatLng[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    // In dev, React runs effects twice; this stops the first (cancelled) run
    // from creating a map after its cleanup already happened.
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        // Scrolling over the map zooms it (instead of scrolling the page).
        scrollWheelZoom: true,
        maxZoom: MAX_ZOOM,
      });

      // "Dark" is three stacked layers: streets, terrain shading blended on top
      // (so hills show as relief), then place names above both.
      const styles: Record<Style, import("leaflet").Layer> = {
        Dark: L.layerGroup([
          L.tileLayer(TILES.darkBase, { attribution: ESRI_CREDIT, maxNativeZoom: 16, maxZoom: MAX_ZOOM, zIndex: 1, className: "dark-base" }),
          L.tileLayer(TILES.hillshade, { maxNativeZoom: 16, maxZoom: MAX_ZOOM, zIndex: 2, opacity: 0.9, className: "hillshade" }),
          L.tileLayer(TILES.darkLabels, { maxNativeZoom: 16, maxZoom: MAX_ZOOM, zIndex: 3 }),
        ]),
        Topo: L.tileLayer(TILES.topo, { attribution: TOPO_CREDIT, subdomains: "abc", maxNativeZoom: 17, maxZoom: MAX_ZOOM }),
        Satellite: L.tileLayer(TILES.satellite, { attribution: SATELLITE_CREDIT, maxNativeZoom: 19, maxZoom: MAX_ZOOM }),
      };
      styles[savedStyle()].addTo(map);
      L.control.layers(styles, undefined, { position: "topright" }).addTo(map);
      map.on("baselayerchange", (event) => saveStyle(event.name));

      // A dark "casing" under the lime line keeps it readable on every style,
      // including the bright yellow-green Topo map.
      const ring = token("--color-canvas");
      L.polyline(route, { color: ring, weight: 6, opacity: 0.85, lineJoin: "round" }).addTo(map);
      const line = L.polyline(route, {
        color: token("--color-accent"),
        weight: 3,
        opacity: 1,
        lineJoin: "round",
      }).addTo(map);

      const endpoint = (point: LatLng, fill: string, title: string) =>
        L.circleMarker(point, {
          radius: 6,
          color: ring,
          weight: 2,
          fillColor: fill,
          fillOpacity: 1,
        })
          .bindTooltip(title, { direction: "top", offset: [0, -6] })
          .addTo(map!);

      endpoint(route[0], token("--color-accent"), "Start");
      endpoint(route[route.length - 1], token("--color-fg"), "Finish");

      map.fitBounds(line.getBounds(), { padding: [24, 24] });
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [route]);

  return (
    <section>
      <h2 className={`${label} mb-2`}>Route</h2>
      <div
        ref={containerRef}
        className="ride-map h-72 overflow-hidden rounded-card border border-line bg-canvas sm:h-96"
        role="region"
        aria-label="Map of the ride route"
      />
    </section>
  );
}
