"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "lutar_theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<string>("dark");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(THEME_KEY) : null;
    const initial = saved || "dark";
    setTheme(initial);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initial);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
  }

  return (
    <button
      className="px-3 py-2 rounded border border-white/10 hover:bg-white/10 text-sm"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

