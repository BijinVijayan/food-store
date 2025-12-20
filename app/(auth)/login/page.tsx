"use client";

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { Mail, ChefHat, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // We check if the session cookie exists in the browser
        // (This is a quick client-side check)
        const hasSession = document.cookie.includes("session=");

        if (hasSession) {
            // Force a hard refresh to let Middleware decide where to send them
            router.refresh();
            // Or manually redirect if you prefer speed:
            // router.replace("/admin/dashboard");
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(""); // Clear previous errors

        try {
            // 1. Call the Send OTP API
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send verification code");
            }

            // 2. On Success, redirect to Verify Page with email in URL
            router.push(`/verify?email=${encodeURIComponent(email)}`);

        } catch (err: any) {
            // 3. Handle Errors
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] via-[#FFF5EC] to-[#FFE8D6] sm:p-4 font-sans">
            <div className="w-full max-sm:min-h-screen max-sm:flex flex-col justify-center max-w-[480px] bg-white sm:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-center border border-white">

                {/* 1. Logo Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                        <ChefHat className="w-8 h-8 text-primary" />
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
                            <Mail className="absolute left-4 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-700 transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError(""); // Clear error when user types
                                }}
                                placeholder="admin@restaurant.com"
                                className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:bg-zinc-100 outline-none focus:ring-3 transition-all font-medium ${
                                    error
                                        ? "border-red-300 focus:border-primary focus:ring-primary/10"
                                        : "border-zinc-200 focus:border-primary focus:ring-primary/10"
                                }`}
                            />
                        </div>
                    </div>

                    {/* Error Message Display */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-[#d61924] disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-md cursor-pointer shadow-[0_4px_14px_0_rgba(229,29,41,0.39)] hover:shadow-[0_6px_20px_rgba(229,29,41,0.23)] flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                <span>Sending code...</span>
                            </>
                        ) : (
                            "Send OTP"
                        )}
                    </button>
                </form>

                {/* 4. Divider */}
                {/*<div className="relative my-8">*/}
                {/*    <div className="absolute inset-0 flex items-center">*/}
                {/*        <span className="w-full border-t border-zinc-100"></span>*/}
                {/*    </div>*/}
                {/*    <div className="relative flex justify-center text-xs uppercase">*/}
                {/*        <span className="bg-white px-3 text-zinc-400 font-medium tracking-wide">Or continue with</span>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* 5. Google Button */}
                {/*<button*/}
                {/*    className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 group"*/}
                {/*>*/}
                {/*    <svg className="w-5 h-5" viewBox="0 0 24 24">*/}
                {/*        <path*/}
                {/*            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"*/}
                {/*            fill="#4285F4"*/}
                {/*        />*/}
                {/*        <path*/}
                {/*            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"*/}
                {/*            fill="#34A853"*/}
                {/*        />*/}
                {/*        <path*/}
                {/*            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"*/}
                {/*            fill="#FBBC05"*/}
                {/*        />*/}
                {/*        <path*/}
                {/*            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"*/}
                {/*            fill="#EA4335"*/}
                {/*        />*/}
                {/*    </svg>*/}
                {/*    <span className="group-hover:text-zinc-900 transition-colors">Google</span>*/}
                {/*</button>*/}

                {/* 6. Footer Links */}
                <div className="mt-8 flex flex-col gap-3">
                    <p className="text-xs text-zinc-400">Need help? <button className="text-primary hover:text-red-600 font-medium cursor-pointer">Contact Support</button></p>
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