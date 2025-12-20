"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, RotateCw, AlertCircle, Loader2 } from "lucide-react";

// We separate the form logic to wrap it in Suspense for useSearchParams
function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

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

    // 1. Handle Verify API Call
    const handleVerify = async () => {
        if (otp.some((digit) => digit === "") || !email) return;

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp: otp.join("")
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Invalid verification code");
            }

            // 2. Redirect based on Store existence
            if (data.isNewUser) {
                // replace() erases the "Verify" page from history so you can't go back to it
                router.replace(`/create-store?email=${encodeURIComponent(email || "")}`);
            } else {
                router.replace("/admin/dashboard");
            }

        } catch (err: any) {
            setError(err.message || "Verification failed");
            setIsLoading(false);
            // Shake effect or clear inputs could go here
        }
    };

    // 3. Handle Input Change
    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto-verify if filling the last input
        if (value && index === 4) {
            // We need to wait for state update, or just pass the constructed string
            // But since handleVerify relies on state, we can use a small timeout
            // OR manually check validity.
            // For now, let's just focus. Auto-submit is tricky with React state batching.
            inputRefs.current[index]?.blur(); // Remove focus to hint completion
        }

        // Auto-focus next input
        if (value && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // 4. Handle Backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "Enter") {
            handleVerify();
        }
    };

    // 5. Handle Paste (Auto-Fill)
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 5).split("");

        // Only allow numbers
        if (pastedData.some((char) => isNaN(Number(char)))) return;

        const newOtp = [...otp];
        pastedData.forEach((char, i) => {
            if (i < 5) newOtp[i] = char;
        });
        setOtp(newOtp);

        // Focus the appropriate box
        const nextIndex = Math.min(pastedData.length, 4);
        inputRefs.current[nextIndex]?.focus();

        // If we pasted a full code, try to verify immediately
        if (pastedData.length === 5) {
            // We can't call handleVerify immediately because setOtp is async
            // But the user can just hit Verify
            inputRefs.current[4]?.focus();
        }
    };

    return (
        <div className="w-full max-sm:min-h-screen max-sm:flex flex-col justify-center max-w-[480px] bg-white sm:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-center border border-white relative z-10">

            {/* Icon Header */}
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#FFE5E7] rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                    <Mail className="w-7 h-7 text-[#E51D29]" />
                </div>
            </div>

            {/* Text Content */}
            <h1 className="text-2xl font-extrabold text-zinc-900 mb-3 tracking-tight">
                Verify your Email
            </h1>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed px-4">
                We sent a 5-digit code to <br/>
                <span className="font-bold text-zinc-800">{email || "your email"}</span>. Enter it below to confirm your account.
            </p>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 mb-8">
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste} // Paste listener
                        className={`w-14 h-14 border rounded-xl text-center text-2xl font-bold text-zinc-800 outline-none transition-all ${
                            error
                                ? "border-red-300 bg-red-50 focus:border-red-500"
                                : "border-zinc-200 bg-neutral-50 focus:border-red-500 focus:ring-1 focus:ring-red-500/10 focus:bg-white"
                        }`}
                    />
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center justify-center gap-2 text-red-600 mb-6 bg-red-50 p-2 rounded-lg text-sm animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            {/* Verify Button */}
            <button
                onClick={handleVerify}
                disabled={isLoading || otp.includes("")}
                className="w-full bg-primary cursor-pointer hover:bg-orange-600 disabled:bg-primary/80 disabled:cursor-not-allowed text-white font-bold py-4 rounded-sm shadow-[0_4px_14px_0_rgba(229,29,41,0.39)] hover:shadow-[0_6px_20px_rgba(229,29,41,0.23)] transition-all mb-6 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                    </>
                ) : (
                    "Verify & Proceed"
                )}
            </button>

            {/* Resend Links */}
            <div className="flex flex-col gap-4">
                <button className="flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
                    <RotateCw className="w-4 h-4 text-[#E51D29]" /> Resend Code
                </button>

                <button
                    onClick={() => router.push('/login')}
                    className="text-xs text-zinc-400 hover:text-[#E51D29] transition-colors"
                >
                    Entered wrong email?
                </button>
            </div>

            {/* Footer Copyright */}
            <p className="absolute bottom-6 left-0 right-0 text-xs text-zinc-400 font-medium opacity-60">
                © 2024 Restaurant Admin. All rights reserved.
            </p>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] via-[#FFF5EC] to-[#FFE8D6] sm:p-4 font-sans">
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyForm />
            </Suspense>
        </div>
    );
}