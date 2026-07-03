import { useState } from "react";
import { MapPin, Flag, Search, X, ArrowRight } from "lucide-react";

const EXAMPLES = [
  ["New York, NY",  "Los Angeles, CA"],
  ["Chicago, IL",   "Houston, TX"    ],
  ["Seattle, WA",   "Miami, FL"      ],
  ["Denver, CO",    "Atlanta, GA"    ],
];

export default function RouteForm({ onSubmit, onClear, loading, hasResult }) {
  const [start,  setStart]  = useState("");
  const [finish, setFinish] = useState("");
  const [errs,   setErrs]   = useState({});

  const validate = () => {
    const e = {};
    if (!start.trim())  e.start  = "Enter a starting location.";
    if (!finish.trim()) e.finish = "Enter a destination.";
    if (start.trim().toLowerCase() === finish.trim().toLowerCase())
      e.finish = "Must be different from start.";
    setErrs(e);
    return !Object.keys(e).length;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(start.trim(), finish.trim());
  };

  const use = ([s, f]) => { setStart(s); setFinish(f); setErrs({}); };

  const clear = () => { setStart(""); setFinish(""); setErrs({}); onClear(); };

  return (
    <div className="glass p-6 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Plan Your Route</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Enter two US cities to find the cheapest fuel stops.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4">
        {/* Start */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Starting Location
          </label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
            <input
              value={start}
              onChange={(e) => { setStart(e.target.value); setErrs((x) => ({ ...x, start: "" })); }}
              placeholder="e.g. New York, NY"
              disabled={loading}
              className={`field pl-10 ${errs.start ? "border-rose-400 focus:ring-rose-400/20" : ""}`}
            />
          </div>
          {errs.start && <p className="mt-1 text-xs text-rose-500">{errs.start}</p>}
        </div>

        {/* Arrow connector */}
        <div className="flex items-center gap-3 px-1">
          <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-rose-200 dark:from-emerald-800/50 dark:to-rose-800/50" />
          <ArrowRight size={14} className="text-gray-400 shrink-0" />
          <div className="h-px flex-1 bg-gradient-to-r from-rose-200 to-purple-200 dark:from-rose-800/50 dark:to-purple-800/50" />
        </div>

        {/* Finish */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Destination
          </label>
          <div className="relative">
            <Flag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500" />
            <input
              value={finish}
              onChange={(e) => { setFinish(e.target.value); setErrs((x) => ({ ...x, finish: "" })); }}
              placeholder="e.g. Los Angeles, CA"
              disabled={loading}
              className={`field pl-10 ${errs.finish ? "border-rose-400 focus:ring-rose-400/20" : ""}`}
            />
          </div>
          {errs.finish && <p className="mt-1 text-xs text-rose-500">{errs.finish}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading
              ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white spinner" />Planning…</>
              : <><Search size={15} />Plan Route</>
            }
          </button>
          {hasResult && (
            <button type="button" onClick={clear} className="btn-ghost px-3">
              <X size={15} />
            </button>
          )}
        </div>
      </form>

      {/* Quick examples */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
          Quick Examples
        </p>
        <div className="grid grid-cols-2 gap-2">
          {EXAMPLES.map(([s, f], i) => (
            <button
              key={i}
              onClick={() => use([s, f])}
              disabled={loading}
              className="text-left rounded-xl border border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-white/3 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 p-3 transition-all duration-150 group"
            >
              <span className="text-[11px] text-gray-500 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 leading-relaxed">
                <span className="text-emerald-500">●</span> {s}<br />
                <span className="text-rose-500">●</span> {f}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle info */}
      <div className="rounded-xl bg-indigo-50 dark:bg-indigo-500/8 border border-indigo-100 dark:border-indigo-500/20 p-4">
        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Vehicle Assumptions</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-indigo-600/80 dark:text-indigo-300/70">
          <span>⛽ 10 MPG</span>
          <span>📏 500 mi max range</span>
          <span>🔍 Refuel at 450 mi</span>
          <span>📡 OpenRouteService</span>
        </div>
      </div>
    </div>
  );
}
