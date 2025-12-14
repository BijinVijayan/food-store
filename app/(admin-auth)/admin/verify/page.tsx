"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mail, RotateCw } from "lucide-react";

export default function VerifyOtpPage() {
    const router = useRouter();
    // 1. Updated to 5 digits
    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Handle Input Change (Type & Advance)
    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto-focus next input (Changed index check for 5 digits)
        if (value && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle Backspace (Delete & Retreat)
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push("/admin/dashboard");
        }, 1500);
    };

    return (
        // 2. Updated Container Classes to Match Login Page Exactly
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] via-[#FFF5EC] to-[#FFE8D6] sm:p-4 font-sans">

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
                    <span className="font-bold text-zinc-800">admin@restaurant.com</span>. Enter it below to confirm your account.
                </p>

                {/* 3. OTP Inputs (5 Boxes) */}
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
                            className="w-14 h-14 border border-zinc-200 rounded-xl text-center text-2xl font-bold text-zinc-800 focus:border-primary focus:ring-transparent outline-none transition-all  bg-neutral-50"
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={isLoading || otp.includes("")}
                    className="w-full bg-primary hover:bg-orange-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all mb-6"
                >
                    {isLoading ? "Verifying..." : "Verify & Proceed"}
                </button>

                {/* Resend Links */}
                <div className="flex flex-col gap-4">
                    <button className="flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
                        <RotateCw className="w-4 h-4 text-primary" /> Resend Code
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="text-xs text-zinc-400 hover:text-[#E51D29] transition-colors"
                    >
                        Entered wrong email?
                    </button>
                </div>

            </div>

            {/* Footer Copyright */}
            <p className="absolute bottom-6 text-xs text-zinc-400 font-medium opacity-60">
                © 2024 Restaurant Admin. All rights reserved.
            </p>
        </div>
    );
}