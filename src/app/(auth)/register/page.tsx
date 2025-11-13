"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAuth } from "src/context/authContext";
import { register } from "src/services/authService";

export default function RegisterForm() {
    const { setUser } = useAuth();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Simple client-side validations
        if (name.trim().length < 2) {
            alert("Please enter your full name.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }
        if (phone && !/^\+?[0-9\s-]{7,15}$/.test(phone)) {
            alert("Please enter a valid phone number.");
            return;
        }
        const payload = { name, email, password, phone, address };

        try {
            setLoading(true);
            const data = await register(payload);
            setUser(data.user);
            // ✅ Success alert
            await Swal.fire({
                icon: "success",
                title: "Registered Successfully!",
                text: "Welcome aboard 🎉",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Go to Dashboard",
            });

            router.push("/dashboard");
        } catch (err: any) {
            console.error("Registration failed:", err.response?.data || err.message);
            // Error alert
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text:
                    err.response?.data?.message ||
                    "Please check your details and try again.",
                confirmButtonColor: "#d33",
            });
        } finally {
            setLoading(false);
        }

    };


    return (
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Create your account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full name
                    </label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2.5"
                        placeholder="Jane Doe"
                        autoComplete="name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2.5"
                        placeholder="you@example.com"
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2.5"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        minLength={6}
                    />
                    <p className="mt-1 text-xs text-gray-500">Minimum 6 characters.</p>
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone (optional)
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2.5"
                        placeholder="+880 1XXX-XXXXXX"
                        autoComplete="tel"
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address (optional)
                    </label>
                    <textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2.5 min-h-[90px]"
                        placeholder="House, street, city, postal code"
                        autoComplete="street-address"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
