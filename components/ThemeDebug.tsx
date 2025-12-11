"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeDebug() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Don't render anything on the server to avoid mismatch errors
    }

    return (
        <div className="fixed top-4 right-4 z-50 p-4 bg-red-500 text-white rounded-lg shadow-xl flex flex-col gap-2">
            <p className="text-xs font-bold">Debug Panel</p>
            <p className="text-sm">Active Theme: <span className="font-mono bg-black/20 px-1 rounded">{theme}</span></p>
            <p className="text-sm">Resolved: <span className="font-mono bg-black/20 px-1 rounded">{resolvedTheme}</span></p>

            <div className="flex gap-2 mt-2">
                <button
                    onClick={() => setTheme("light")}
                    className="px-3 py-1 bg-white text-red-600 text-xs font-bold rounded"
                >
                    Force Light
                </button>
                <button
                    onClick={() => setTheme("dark")}
                    className="px-3 py-1 bg-black text-white text-xs font-bold rounded"
                >
                    Force Dark
                </button>
            </div>
            <button
                onClick={() => {
                    localStorage.removeItem("theme");
                    window.location.reload();
                }}
                className="mt-2 text-xs underline"
            >
                Clear Storage (Reset)
            </button>
        </div>
    );
}