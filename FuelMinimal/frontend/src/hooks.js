import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { planRoute } from "./api";

/* ── useTheme ─────────────────────────────────────────── */
export function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

/* ── useRoute ─────────────────────────────────────────── */
export function useRoute() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(async (start, finish) => {
    setLoading(true);
    setError(null);
    setData(null);
    const tid = toast.loading("Planning your route…");
    try {
      const result = await planRoute(start, finish);
      setData(result);
      toast.success(
        result.cached
          ? "Loaded from cache ⚡"
          : `Found ${result.fuel_stops.length} fuel stop(s)!`,
        { id: tid }
      );
    } catch (e) {
      setError(e.message);
      toast.error(e.message, { id: tid });
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => { setData(null); setError(null); }, []);

  return { data, loading, error, fetch, clear };
}
