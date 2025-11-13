// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center px-4 bg-gray-100">
      {/* চাইলে ব্র্যান্ডিং লোগো/টাইমড কার্ড ব্যাকগ্রাউন্ড রাখতে পারেন */}
      {children}
    </div>
  );
}
