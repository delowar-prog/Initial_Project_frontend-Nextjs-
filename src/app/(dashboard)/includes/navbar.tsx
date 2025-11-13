import React from 'react';
import IconComponent from './iconComponent';
import Link from 'next/link';
import IconButton from './iconBtn';
import UserDropdown from 'src/app/components/userDropdown';
import DarkModeToggle from 'src/app/darkModeToggle';

type OpenState = boolean; // define this if not already defined elsewhere

type NavbarProps = {
  setSidebarOpen: React.Dispatch<React.SetStateAction<OpenState>>;
  isCollapsed: boolean;
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ setSidebarOpen, isCollapsed, setIsCollapsed }: NavbarProps) => {
  // Define toggleCollapse
  const toggleCollapse = () => {
    if (setIsCollapsed) setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-700 dark:bg-slate-900/80 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between gap-3 px-3 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 md:hidden"
            aria-label="Open menu"
          >
            <IconComponent name="menu" className="h-5 w-5" />
          </button>

          {/* Collapse/Expand (desktop) */}
          <button
            onClick={toggleCollapse}
            className="hidden md:inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Toggle sidebar width"
            title="Toggle sidebar"
          >
            <IconComponent name={isCollapsed ? 'panel-right-open' : 'panel-left-close'} className="h-5 w-5" />
            <span className="hidden lg:inline">{isCollapsed ? 'Expand' : 'Collapse'}</span>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              DU
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-200">Dhaka University</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">ঢাকা বিশ্ববিদ্যালয়</p>
            </div>
          </Link>
        </div>

        {/* Center search */}
        <div className="hidden w-full max-w-xl md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search or type command..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-slate-600"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <IconButton label="Recent">
            <IconComponent name="clock" className="h-5 w-5" />
          </IconButton>
          <IconButton label="Inbox">
            <IconComponent name="mail" className="h-5 w-5" />
          </IconButton>
          <UserDropdown />
          <DarkModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
