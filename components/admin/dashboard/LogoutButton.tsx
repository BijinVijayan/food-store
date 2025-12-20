"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2, AlertTriangle } from "lucide-react";

export default function LogoutButton() {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });

            router.push("/login");
            router.refresh();

        } catch (error) {
            console.error("Logout failed:", error);
            setIsLoggingOut(false); // Reset if error
            setShowConfirm(false);
        }
    };

    return (
        <>
            {/* 1. Trigger Button */}
            <button
                onClick={() => setShowConfirm(true)}
                className="p-2 cursor-pointer md:p-3 rounded-xl hover:bg-zinc-50 border border-zinc-100 text-zinc-500 transition-colors"
                title="Sign out"
            >
                <LogOut className="w-5 h-5" />
            </button>

            {/* 2. Custom Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center scale-100 animate-in zoom-in-95">

                        {/* Icon */}
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut className="w-6 h-6 text-red-600 pl-1" />
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-bold text-zinc-900">Sign Out?</h3>
                        <p className="text-sm text-zinc-500 mt-2 mb-6">
                            Are you sure you want to end your current session? You will be redirected to the login page.
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isLoggingOut}
                                className="flex-1 py-3 text-sm font-bold text-zinc-600 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                            >
                                {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Out"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}