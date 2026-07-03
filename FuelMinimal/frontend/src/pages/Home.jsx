import { Link } from "react-router-dom";
import { ArrowRight, Route, DollarSign, Zap, MapPin, BarChart3, Fuel } from "lucide-react";

const features = [
  { icon: Route,      title: "Smart Routing",       desc: "Real road directions via OpenRouteService API — one call, full path.",      color: "from-blue-500 to-cyan-400"    },
  { icon: DollarSign, title: "Cheapest Gas Finder",  desc: "Bounding-box + Haversine algorithm picks the lowest-price station in range.", color: "from-emerald-500 to-green-400" },
  { icon: MapPin,     title: "Interactive Map",      desc: "Beautiful Leaflet map with your route, stops, and full popup details.",      color: "from-violet-500 to-purple-400" },
  { icon: BarChart3,  title: "Cost Breakdown",       desc: "Gallons per segment, price per stop, and full trip spend in one table.",      color: "from-orange-500 to-amber-400"  },
  { icon: Zap,        title: "Instant Cache",        desc: "Repeat routes return in milliseconds — results cached for 1 hour.",          color: "from-yellow-500 to-orange-400" },
  { icon: Fuel,       title: "Range Logic",          desc: "Automatically plans stops every 450 miles within a 500-mile vehicle range.", color: "from-rose-500 to-pink-400"     },
];

const steps = [
  { n: "01", title: "Enter your route",       desc: "Type start and destination — any two US cities." },
  { n: "02", title: "We compute the path",    desc: "One API call to OpenRouteService returns the full driving path." },
  { n: "03", title: "Algorithm finds stops",  desc: "Every 450 miles, we pick the cheapest station within 75 miles." },
  { n: "04", title: "See results instantly",  desc: "Map, cost table, and total spend — all in one clean view." },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6 py-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0a0a1a] to-purple-950 dark:from-indigo-950 dark:via-[#0a0a1a] dark:to-purple-950" />
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.4) 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />

        <div className="relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-5 py-2 text-sm text-indigo-300 backdrop-blur mb-8 animate-fade-up">
            <Zap size={13} className="text-yellow-400" />
            Fuel cost optimisation for US road trips
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight animate-fade-up" style={{ animationDelay: "80ms" }}>
            Drive Smarter.<br />
            <span className="gradient-text">Spend Less.</span>
          </h1>

          <p className="text-lg sm:text-xl text-indigo-200/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "160ms" }}>
            Enter any two US cities. We plan your route, find the cheapest gas stations every
            450 miles, calculate your total fuel cost, and show everything on an interactive map.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "240ms" }}>
            <Link to="/planner"
              className="inline-flex items-center gap-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 font-semibold text-sm shadow-2xl shadow-indigo-500/40 transition-all hover:-translate-y-0.5 active:scale-95">
              <Route size={17} />
              Plan a Route
              <ArrowRight size={16} />
            </Link>
            <Link to="/about"
              className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 text-white/80 hover:text-white hover:bg-white/10 px-8 py-4 font-semibold text-sm backdrop-blur transition-all hover:-translate-y-0.5">
              How It Works
            </Link>
          </div>

          {/* Hero stats */}
          <div className="grid grid-cols-3 gap-4 mt-16 max-w-sm mx-auto animate-fade-up" style={{ animationDelay: "320ms" }}>
            {[["90+", "Stations"], ["500mi", "Max Range"], ["Free", "API Key"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-black text-white">{v}</p>
                <p className="text-xs text-indigo-300/60 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#f8f8fc] dark:bg-[#0d0d1f]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3">
              Everything In One Place
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Smart routing meets real fuel price data and a beautiful interface.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <div
                key={title}
                className="glass p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="px-6 py-20 bg-white dark:bg-[#080816]">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3">How It Works</h2>
          </div>

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent" />
            <div className="space-y-10">
              {steps.map(({ n, title, desc }, i) => (
                <div key={n} className="flex gap-6 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-xs font-black text-white shadow-lg shadow-indigo-500/30 z-10">
                    {n}
                  </div>
                  <div className="pt-1.5">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14">
            <Link to="/planner" className="btn-primary inline-flex text-base px-8 py-4 shadow-xl shadow-indigo-500/30">
              Try It Now <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
