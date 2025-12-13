"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, RotateCw, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Static Data matching your screenshot (Single Restaurant Context)
const MOCK_ORDERS = [
    {
        id: "ord-1",
        title: "Margherita Pizza...", // Main item as title
        subtitle: "1x Margherita Pizza + 2 other items",
        price: "AED 25.50",
        date: "Oct 26, 2023 • 12:45 PM",
        status: "Delivered",
        image: "/images/products/MargheritaPizza.webp",
    },
    {
        id: "ord-2",
        title: "Classic Cheeseburger...",
        subtitle: "1x Classic Cheeseburger + 2 other items",
        price: "AED 15.75",
        date: "Oct 24, 2023 • 08:30 PM",
        status: "Cancelled",
        image: "/images/products/cheeseburger.jpg",
    },
    {
        id: "ord-3",
        title: "California Roll (6 pcs)...",
        subtitle: "1x California Roll (6 pcs) + 1 other item",
        price: "AED 18.00",
        date: "Oct 22, 2023 • 01:15 PM",
        status: "Delivered",
        image: "/images/products/supreme pizza cake.jpg",
    }
];

export default function OrdersPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // Simulate Network Delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-zinc-100 dark:bg-zinc-950 pb-20">
            {/* HEADER */}
            <header className="sticky top-0 z-20 bg-zinc-100 dark:bg-zinc-950 px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-zinc-900 dark:text-white" />
                </button>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Order History</h1>
            </header>

            <div className="px-4 py-6 flex flex-col gap-4">

                {isLoading ? (
                    // --- SKELETON LOADER ---
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 animate-pulse">
                            <div className="flex gap-4 mb-4">
                                <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="flex justify-between">
                                        <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                    </div>
                                    <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                    <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                        <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                    </div>
                                </div>
                            </div>
                            <div className="h-11 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                        </div>
                    ))
                ) : (
                    // --- REAL CONTENT ---
                    MOCK_ORDERS.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                        >
                            {/* Top Section: Info */}
                            <div className="flex gap-4 mb-4">
                                {/* Image */}
                                <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                    <Image
                                        src={order.image}
                                        alt={order.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                    {/* Row 1: Title + Price */}
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-zinc-900 dark:text-white truncate text-base">
                                            {order.title}
                                        </h3>
                                    </div>
                                    <span className="font-bold text-zinc-600 dark:text-white text-sm whitespace-nowrap my-0.5">
                                        {order.price}
                                    </span>

                                    {/* Row 2: Subtitle Items */}
                                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 truncate">
                                        {order.subtitle}
                                    </p>

                                    {/* Row 3: Date + Status */}
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-zinc-400 dark:text-zinc-500 text-[12px]">
                                            {order.date}
                                        </p>

                                        {/* Status Badge */}
                                        <div className={cn(
                                            "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                                            order.status === "Delivered"
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                        )}>
                                            {order.status === "Delivered" ? (
                                                <CheckCircle2 className="w-3 h-3" />
                                            ) : (
                                                <XCircle className="w-3 h-3" />
                                            )}
                                            <span>{order.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Separator Line (Dashed) */}
                            <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 mb-4" />

                            {/* Reorder Button */}
                            <button className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                <RotateCw className="w-4 h-4" />
                                Reorder
                            </button>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
}