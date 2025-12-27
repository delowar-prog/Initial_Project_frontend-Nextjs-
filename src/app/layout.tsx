// src/app/layout.tsx
import { AuthProvider } from "src/context/authContext";
import "./globals.css";

export const metadata = {
  title: "App Seba",
  description: "University Suite",
};

const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  } catch {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* body-তে dark-aware ক্লাস */}
      <body className="antialiased bg-[#F7F8FB] text-slate-900 dark:bg-slate-900 dark:text-slate-200">
          <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
