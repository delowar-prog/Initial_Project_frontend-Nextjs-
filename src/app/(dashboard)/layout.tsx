"use client";

import React, { useEffect, useRef, useState } from "react";
import "../globals.css";
import Sidebar from "./includes/sidebar";
import Icon from "./includes/iconComponent";
import Footer from "./includes/footer";
import Navbar from "./includes/navbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

type OpenState = {
  userMgmt: boolean;
  institutions: boolean;
  academics: boolean;
  documents: boolean;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false); // mobile drawer
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false); // desktop collapse
  const [sidebarWidth, setSidebarWidth] = useState<number>(260); // desktop resize
  const resizingRef = useRef<boolean>(false);

  const [open, setOpen] = useState<OpenState>({
    userMgmt: false,
    institutions: true,
    academics: false,
    documents: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("sidebar:width");
    if (saved) setSidebarWidth(Number(saved));
  }, []);

  // persist on change
  useEffect(() => {
    localStorage.setItem("sidebar:width", String(sidebarWidth));
  }, [sidebarWidth]);

  // collapse toggle: ছোট width + আইকন-অনলি মোড
  function toggleCollapse() {
    setIsCollapsed((v) => !v);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Drag-to-resize handlers (desktop)
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!resizingRef.current || isCollapsed) return;
      const min = 200;
      const max = 360;
      // Distance from left viewport edge to mouse gives desired width for the aside
      const next = Math.min(max, Math.max(min, e.clientX - 16 /* page padding approx */));
      setSidebarWidth(next);
    }
    function onUp() {
      resizingRef.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isCollapsed]);

  function startResize() {
    resizingRef.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  }

  const computedSidebar = isCollapsed ? 64 : sidebarWidth;

  return (
    <div className="min-h-screen bg-[#F7F8FB] text-slate-900 dark:bg-slate-900 dark:text-slate-200 antialiased">
      {/* NAVBAR */}
      <Navbar setSidebarOpen={setSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>

      {/* SHELL */}
      <div
        className="mx-auto grid max-w-full grid-cols-1 md:grid md:gap-0"
        style={{
          gridTemplateColumns: `1fr`,
        }}
      >
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: isCollapsed ? `${computedSidebar}px 1fr` : `${computedSidebar}px 6px 1fr`, // 3 columns expanded
            gap: "0px",
            width: "100%",
          }}
        >
          {/* SIDEBAR (desktop) */}
          <aside
            className="sticky top-[64px] h-[calc(100dvh-64px)] shrink-0"
            style={{
              width: computedSidebar,
              transition: "width 200ms ease",
            }}
          >
            <Sidebar open={open} setOpen={setOpen} isCollapsed={isCollapsed} />
          </aside>

          {!isCollapsed && (
            <div
              onMouseDown={startResize}
              onDoubleClick={toggleCollapse}
              className="sticky top-[64px] h-[calc(100dvh-64px)] w-[10px] cursor-col-resize md:block group"
              role="separator"
              aria-orientation="vertical"
              title="Drag to resize • Double-click to collapse"
            >
              <div className="mx-auto mt-[calc(50vh-40px)] h-20 w-[6px] rounded-full bg-slate-200/60 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                {/* three dots */}
                <div className="flex flex-col gap-1">
                  <span className="block h-1 w-1 rounded-full bg-slate-500/70" />
                  <span className="block h-1 w-1 rounded-full bg-slate-500/70" />
                  <span className="block h-1 w-1 rounded-full bg-slate-500/70" />
                </div>
              </div>
            </div>
          )}

          {/* MAIN (desktop) */}
          <main className="min-h-[calc(100dvh-64px)] p-2 md:p-6 rounded-2xl bg-white shadow-sm dark:bg-slate-900 dark:text-slate-100">
            {children}
          </main>
        </div>

        {/* MAIN (mobile fallback grid-cols-1) */}
        <main className="md:hidden min-h-[calc(100dvh-64px)] py-6 rounded-2xl bg-white shadow-sm dark:bg-slate-900 dark:text-slate-100">
          {children}
        </main>
      </div>

      {/* FOOTER */}
      <Footer></Footer>

      {/* MOBILE DRAWER */}
      <MobileDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Sidebar open={open} setOpen={setOpen} onNavigate={() => setSidebarOpen(false)} isCollapsed={isCollapsed} />
      </MobileDrawer>
    </div>
  );
}

/* ----------------------------- Components ----------------------------- */


type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function MobileDrawer({ open, onClose, children }: MobileDrawerProps) {
  return (
    <div className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div
        className={`absolute left-0 top-0 h-full w-72 -translate-x-full bg-white p-3 shadow-xl transition-transform dark:bg-slate-900 dark:text-slate-100 ${open ? "translate-x-0" : ""
          }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Menu</span>
          <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center hover:bg-slate-50">
            <Icon name="close" className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
