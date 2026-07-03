import { Fuel, TrendingDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function FuelTable({ stops }) {
  const [expanded, setExpanded] = useState(null);
  if (!stops?.length) return null;

  const cheapestPrice = Math.min(...stops.map((s) => s.price_per_gallon));

  return (
    <div className="glass overflow-hidden animate-fade-up" style={{ animationDelay: "200ms" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
            <Fuel size={15} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Fuel Stops</h3>
            <p className="text-[11px] text-gray-400">{stops.length} optimised stop{stops.length > 1 ? "s" : ""}</p>
          </div>
        </div>
        <span className="badge bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 text-[11px]">
          <TrendingDown size={11} />Cost optimised
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 dark:border-white/5">
              {["#", "Station", "Location", "Price", "Mile", "Gallons", "Cost"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stops.map((s, i) => {
              const isCheapest = s.price_per_gallon === cheapestPrice;
              return (
                <tr
                  key={s.stop_number}
                  className="border-b border-gray-50 dark:border-white/5 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5 transition-colors"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <td className="px-5 py-3.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {s.stop_number}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white text-sm">{s.station_name}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{s.city}, {s.state}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-bold ${isCheapest ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}>
                      ${s.price_per_gallon.toFixed(3)}
                      {isCheapest && <span className="ml-1 text-[10px] bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded px-1 py-0.5 font-semibold">BEST</span>}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{s.miles_from_start} mi</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{s.gallons_needed} gal</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-white text-sm">${s.cost_at_this_stop.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50/50 dark:bg-white/2">
              <td colSpan={6} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</td>
              <td className="px-5 py-3 font-black text-indigo-600 dark:text-indigo-400">
                ${stops.reduce((a, s) => a + s.cost_at_this_stop, 0).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile accordion */}
      <div className="md:hidden divide-y divide-gray-50 dark:divide-white/5">
        {stops.map((s) => {
          const isCheapest = s.price_per_gallon === cheapestPrice;
          const isOpen = expanded === s.stop_number;
          return (
            <div key={s.stop_number}>
              <button
                onClick={() => setExpanded(isOpen ? null : s.stop_number)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {s.stop_number}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{s.station_name}</p>
                  <p className="text-xs text-gray-500">{s.city}, {s.state}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${isCheapest ? "text-emerald-600" : "text-gray-700 dark:text-gray-300"}`}>
                    ${s.price_per_gallon.toFixed(3)}
                  </p>
                  <p className="text-xs text-gray-500">${s.cost_at_this_stop.toFixed(2)}</p>
                </div>
                <ChevronRight size={14} className={`text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 bg-gray-50/50 dark:bg-white/2 grid grid-cols-3 gap-3 text-xs">
                  <div><p className="text-gray-400 mb-0.5">At mile</p><p className="font-semibold text-gray-700 dark:text-gray-300">{s.miles_from_start}</p></div>
                  <div><p className="text-gray-400 mb-0.5">Gallons</p><p className="font-semibold text-gray-700 dark:text-gray-300">{s.gallons_needed}</p></div>
                  <div><p className="text-gray-400 mb-0.5">Cost</p><p className="font-semibold text-gray-700 dark:text-gray-300">${s.cost_at_this_stop.toFixed(2)}</p></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
