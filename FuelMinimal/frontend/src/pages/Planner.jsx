import { useRoute }    from "../hooks";
import RouteForm       from "../components/RouteForm";
import CostSummary     from "../components/CostSummary";
import FuelTable       from "../components/FuelTable";
import RouteMap        from "../components/RouteMap";
import { AlertCircle, Map } from "lucide-react";

export default function Planner() {
  const { data, loading, error, fetch, clear } = useRoute();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 animate-fade-in">
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Route Planner</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Find the cheapest fuel stops between any two US cities.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr] items-start">
        {/* ── Left: Form ── */}
        <div className="lg:sticky lg:top-24">
          <RouteForm onSubmit={fetch} onClear={clear} loading={loading} hasResult={!!data} />
        </div>

        {/* ── Right: Results ── */}
        <div className="flex flex-col gap-5 min-w-0">

          {/* Loading skeleton */}
          {loading && (
            <div className="flex flex-col gap-5 animate-pulse-slow">
              <div className="glass p-5 h-16 rounded-2xl bg-gray-100/50 dark:bg-white/3" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass h-24 rounded-2xl bg-gray-100/50 dark:bg-white/3" />
                ))}
              </div>
              <div className="glass h-[420px] rounded-2xl bg-gray-100/50 dark:bg-white/3" />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="glass border-l-4 border-rose-500 p-5 flex items-start gap-3 animate-fade-up">
              <AlertCircle size={18} className="shrink-0 text-rose-500 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-700 dark:text-rose-400 text-sm">Route planning failed</p>
                <p className="text-sm text-rose-600/80 dark:text-rose-300/70 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!data && !loading && !error && (
            <div className="glass flex flex-col items-center justify-center py-20 text-center animate-fade-up">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center mb-4 border border-indigo-100 dark:border-indigo-500/20">
                <Map size={32} className="text-indigo-400" />
              </div>
              <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">No route planned yet</p>
              <p className="text-sm text-gray-400 max-w-xs">
                Enter your start and destination on the left, then hit <strong>Plan Route</strong>.
              </p>
            </div>
          )}

          {/* Results */}
          {data && !loading && (
            <>
              <CostSummary data={data} />
              <RouteMap    routeData={data} />
              <FuelTable   stops={data.fuel_stops} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
