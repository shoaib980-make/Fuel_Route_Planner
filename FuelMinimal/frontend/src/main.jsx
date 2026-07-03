import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar   from "./components/Navbar";
import Home     from "./pages/Home";
import Planner  from "./pages/Planner";
import About    from "./pages/About";
import { useTheme } from "./hooks";
import "./index.css";

function App() {
  const { dark, toggle } = useTheme();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar dark={dark} toggleDark={toggle} />
      <main className="flex-1">
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/about"   element={<About />} />
          <Route path="*"        element={
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
              <p className="text-7xl font-black gradient-text">404</p>
              <p className="text-gray-500">Page not found.</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!font-sans !text-sm !rounded-xl !shadow-xl",
          duration: 4000,
          success: { iconTheme: { primary: "#6366f1", secondary: "#fff" } },
        }}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
