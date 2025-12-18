"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ChefHat } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/verify"); // Go to OTP page
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] via-[#FFF5EC] to-[#FFE8D6] sm:p-4 font-sans">
            <div className="w-full max-sm:min-h-screen max-sm:flex flex-col justify-center max-w-[480px] bg-white sm:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-center border border-white">

                {/* 1. Logo Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                        <ChefHat className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                {/* 2. Header Text */}
                <h1 className="text-3xl font-bold text-zinc-900 mb-2 tracking-tight">Welcome Back</h1>
                <p className="text-zinc-500 text-sm mb-10 leading-relaxed">
                    Manage your restaurant effortlessly.<br/>
                    Enter your email to access the dashboard.
                </p>

                {/* 3. Login Form */}
                <form onSubmit={handleLogin} className="space-y-5 text-left">
                    <div>
                        <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@restaurant.com"
                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#E51D29] hover:bg-[#d61924] disabled:bg-red-300 text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(229,29,41,0.39)] hover:shadow-[0_6px_20px_rgba(229,29,41,0.23)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                {/* 4. Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-100"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-zinc-400 font-medium tracking-wide">Or continue with</span>
                    </div>
                </div>

                {/* 5. Google Button */}
                <button
                    className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 group"
                >
                    {/* Simple Google G Icon placeholder */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span className="group-hover:text-zinc-900 transition-colors">Google</span>
                </button>

                {/* 6. Footer Links */}
                <div className="mt-8 flex flex-col gap-3">
                    <p className="text-xs text-zinc-400">Need help? <button className="text-red-500 hover:text-red-600 font-medium">Contact Support</button></p>
                    <div className="flex justify-center gap-4 text-[10px] text-zinc-300 font-medium">
                        <button className="hover:text-zinc-400 transition-colors">Terms of Service</button>
                        <span>•</span>
                        <button className="hover:text-zinc-400 transition-colors">Privacy Policy</button>
                    </div>
                </div>

            </div>
        </div>
    );
}