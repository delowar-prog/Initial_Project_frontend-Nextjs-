"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User } from "lucide-react";
import { useAuth } from "src/context/authContext";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, handleLogout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoutAndRedirect = async () => {
    await handleLogout();
    router.push("/login");
  };

  if (!mounted) return null;
  if (!user) return null; // render করার আগে নিশ্চিত হও যে user লোড হয়েছে

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold">
          {user.name.charAt(0)}
        </div>
        <span className="text-sm font-medium text-gray-700">{user.name}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <ul className="py-2 text-sm text-gray-700">
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                <User size={16} /> Edit profile
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                Account settings
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                Support
              </button>
            </li>
          </ul>

          <div className="border-t border-gray-100">
            <button
              onClick={logoutAndRedirect}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
