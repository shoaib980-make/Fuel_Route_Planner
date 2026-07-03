import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Fuel, Sun, Moon, Menu, X } from "lucide-react";

const links = [
  { to: "/",        label: "Home"    },
  { to: "/planner", label: "Planner" },
  { to: "/about",   label: "About"   },
];

export default function Navbar({ dark, toggleDark }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 dark:border-white/5 bg-white/80 dark:bg-[#0a0a1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 font-bold text-gray-900 dark:text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <Fuel size={15} />
          </div>
          <span className="text-[15px] tracking-tight">
            Fuel<span className="gradient-text">Route</span>
          </span>
        </NavLink>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map(({ to, label }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggleDark}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 sm:hidden transition-colors"
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 dark:border-white/5 px-4 pb-3 sm:hidden animate-fade-in">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
