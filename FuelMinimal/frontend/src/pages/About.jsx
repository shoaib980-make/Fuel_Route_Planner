import { ExternalLink, Code2, Database, Cpu, Globe } from "lucide-react";

const stack = [
  { icon: Code2,    title: "Backend",         color: "from-blue-500 to-cyan-400",    items: ["Django 5 + DRF", "PostgreSQL", "Clean architecture", "REST API + caching"] },
  { icon: Globe,    title: "Frontend",        color: "from-violet-500 to-purple-400", items: ["React 18 + Vite", "Tailwind CSS", "Leaflet.js maps", "React Router"] },
  { icon: Cpu,      title: "Algorithm",       color: "from-orange-500 to-amber-400", items: ["Haversine formula", "Bounding-box query", "Price optimisation", "Result caching"] },
  { icon: Database, title: "Data",            color: "from-emerald-500 to-green-400", items: ["CSV fuel prices", "90+ US stations", "Spatial indexing", "Bulk import"] },
];

const links = [
  { label: "OpenRouteService (free routing API)", url: "https://openrouteservice.org" },
  { label: "OpenStreetMap (map tiles)",            url: "https://www.openstreetmap.org" },
  { label: "Leaflet.js (interactive maps)",        url: "https://leafletjs.com" },
];

const algo = [
  { n: "1", text: "Both locations are geocoded to lat/lon via ORS API." },
  { n: "2", text: "One ORS call returns the full driving path as GPS coordinates." },
  { n: "3", text: "We walk the path using Haversine distances, accumulating miles." },
  { n: "4", text: "At 450 miles, a bounding-box SQL query narrows nearby station candidates." },
  { n: "5", text: "Precise Haversine check selects the cheapest station within 75 miles." },
  { n: "6", text: "Cost = (miles ÷ 10 MPG) × price/gal. Result cached for 1 hour." },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 animate-fade-up">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">About This Project</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          A full-stack fuel optimisation app built with Django + React, demonstrating clean
          architecture, geospatial algorithms, REST API design, and modern UI/UX.
        </p>
      </div>

      {/* Tech stack grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stack.map(({ icon: Icon, title, color, items }, i) => (
          <div key={title} className="glass p-5 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-4`}>
              <Icon size={18} className="text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">{title}</h3>
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Algorithm */}
      <div className="glass p-6 sm:p-8 mb-6 animate-fade-up" style={{ animationDelay: "320ms" }}>
        <h2 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Cpu size={18} className="text-indigo-500" />
          Optimizer Algorithm
        </h2>
        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 to-transparent" />
          <div className="space-y-5">
            {algo.map(({ n, text }, i) => (
              <div key={n} className="flex gap-5" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-xs font-black text-white shadow-md z-10">
                  {n}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API endpoints */}
      <div className="glass p-6 sm:p-8 mb-6 animate-fade-up" style={{ animationDelay: "380ms" }}>
        <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <Code2 size={18} className="text-indigo-500" />
          API Endpoints
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="text-left py-2 pr-6 text-xs font-semibold uppercase tracking-wider text-gray-400">Method</th>
                <th className="text-left py-2 pr-6 text-xs font-semibold uppercase tracking-wider text-gray-400">Endpoint</th>
                <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {[
                ["POST", "/api/route/",    "Plan optimised fuel route"],
                ["GET",  "/api/stations/", "List all fuel stations"],
                ["GET",  "/api/health/",   "API health check"],
              ].map(([m, ep, desc]) => (
                <tr key={ep}>
                  <td className="py-3 pr-6">
                    <span className={`badge text-[11px] ${m === "POST" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"}`}>
                      {m}
                    </span>
                  </td>
                  <td className="py-3 pr-6 font-mono text-xs text-gray-700 dark:text-gray-300">{ep}</td>
                  <td className="py-3 text-gray-500 dark:text-gray-400 text-sm">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* External links */}
      <div className="glass p-6 animate-fade-up" style={{ animationDelay: "440ms" }}>
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">External Resources</h2>
        <div className="space-y-2.5">
          {links.map(({ label, url }) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              <ExternalLink size={13} className="shrink-0" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
