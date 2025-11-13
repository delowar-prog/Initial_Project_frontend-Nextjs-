// src/app/layout.tsx
import { AuthProvider } from "src/context/authContext";
import "./globals.css";

export const metadata = {
  title: "App Seba",
  description: "University Suite",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* body-তে dark-aware ক্লাস */}
      <body className="antialiased bg-[#F7F8FB] text-slate-900 dark:bg-slate-900 dark:text-slate-200">
          <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
