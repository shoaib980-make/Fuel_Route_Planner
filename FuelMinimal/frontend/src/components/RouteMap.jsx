import { useEffect, useRef } from "react";
import L from "leaflet";

// Fix broken default icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const icon = (color) => new L.Icon({
  iconUrl:     `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
  shadowUrl:   "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize:    [25, 41], iconAnchor:  [12, 41],
  popupAnchor: [1, -34], shadowSize:  [41, 41],
});

const GREEN  = icon("green");
const RED    = icon("red");
const ORANGE = icon("orange");

export default function RouteMap({ routeData }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const layersRef    = useRef([]);

  // Init map once
  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = L.map(containerRef.current, {
      center: [39.5, -98.35], zoom: 4,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 18,
    }).addTo(mapRef.current);
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  // Update layers when data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    layersRef.current.forEach((l) => map.removeLayer(l));
    layersRef.current = [];
    const add = (l) => { map.addLayer(l); layersRef.current.push(l); return l; };

    if (!routeData) return;

    // Route line
    const routeLayer = add(L.geoJSON(routeData.route_geojson, {
      style: { color: "#6366f1", weight: 4, opacity: 0.85 },
    }));

    // Fuel stop markers
    routeData.fuel_stops.forEach((s) => {
      add(L.marker([s.lat, s.lon], { icon: ORANGE }).bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:170px;padding:4px">
          <p style="margin:0 0 4px;font-weight:700;color:#1f2937">
            ⛽ Stop #${s.stop_number}: ${s.station_name}
          </p>
          <p style="margin:0 0 2px;color:#6b7280;font-size:12px">${s.city}, ${s.state}</p>
          <p style="margin:4px 0 0;color:#4f46e5;font-weight:700">$${s.price_per_gallon.toFixed(3)}/gal</p>
          <p style="margin:2px 0 0;color:#6b7280;font-size:12px">
            Mile ${s.miles_from_start} · ${s.gallons_needed} gal · <strong>$${s.cost_at_this_stop.toFixed(2)}</strong>
          </p>
        </div>
      `));
    });

    // Start / end markers
    const coords  = routeData.route_geojson.features[0].geometry.coordinates;
    const [sLon, sLat] = coords[0];
    const [eLon, eLat] = coords[coords.length - 1];

    add(L.marker([sLat, sLon], { icon: GREEN })
      .bindPopup(`<b style="font-family:Inter">🟢 START</b><br/>${routeData.start}`)
      .openPopup());
    add(L.marker([eLat, eLon], { icon: RED })
      .bindPopup(`<b style="font-family:Inter">🏁 FINISH</b><br/>${routeData.finish}`));

    map.fitBounds(routeLayer.getBounds(), { padding: [30, 30] });
  }, [routeData]);

  return (
    <div className="glass overflow-hidden animate-fade-up" style={{ animationDelay: "120ms" }}>
      <div className="px-5 py-3.5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Interactive Route Map</h3>
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span><span className="text-emerald-500">●</span> Start</span>
          <span><span className="text-orange-400">●</span> Fuel Stop</span>
          <span><span className="text-rose-500">●</span> Finish</span>
        </div>
      </div>
      <div ref={containerRef} style={{ height: "420px", width: "100%" }} />
    </div>
  );
}
