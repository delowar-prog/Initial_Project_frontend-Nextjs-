"use client";
import { useEffect, useRef, useState } from "react";
import IconComponent from "src/app/(dashboard)/includes/iconComponent";

export default function DarkModeToggle() {
  const [dark, setDark] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const spinTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);

  const toggle = (): void => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setSpinning(true);
    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
    }
    spinTimeoutRef.current = window.setTimeout(() => {
      setSpinning(false);
    }, 450);
  };

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        window.clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      onClick={toggle}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
      aria-label={label}
      title={label}
    >
      <IconComponent
        name={dark ? "sun" : "moon"}
        className={`h-5 w-5 ${spinning ? "theme-spin" : ""}`}
      />
    </button>
  );
}
