import { Ruler, Fuel, DollarSign, MapPin, Zap } from "lucide-react";

const stats = (d) => [
  { icon: Ruler,      label: "Total Distance",  value: `${d.total_distance_miles.toLocaleString()} mi`, color: "from-blue-500 to-cyan-500",    bg: "bg-blue-50 dark:bg-blue-500/10",   text: "text-blue-600 dark:text-blue-400" },
  { icon: Fuel,       label: "Gallons Used",    value: `${d.total_gallons_used} gal`,                   color: "from-orange-500 to-amber-500",  bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
  { icon: DollarSign, label: "Total Fuel Cost", value: `$${d.total_fuel_cost_usd.toFixed(2)}`,          color: "from-emerald-500 to-green-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  { icon: MapPin,     label: "Fuel Stops",      value: d.fuel_stops.length,                             color: "from-violet-500 to-purple-500", bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
];

export default function CostSummary({ data }) {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* Route header */}
      <div className="glass px-5 py-3.5 flex flex-wrap items-center gap-2">
        <span className="badge bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 text-[11px]">
          <span className="mr-1">●</span>{data.start}
        </span>
        <span className="text-gray-300 dark:text-gray-600 text-xs">────</span>
        <span className="badge bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 text-[11px]">
          <span className="mr-1">●</span>{data.finish}
        </span>
        {data.cached && (
          <span className="ml-auto badge bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400 text-[11px]">
            <Zap size={11} />Cached
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats(data).map(({ icon: Icon, label, value, color, bg, text }, i) => (
          <div
            key={label}
            className={`stat-card delay-${i * 100}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-2`}>
              <Icon size={17} className="text-white" />
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className={`text-xl font-bold ${text} mt-0.5`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
