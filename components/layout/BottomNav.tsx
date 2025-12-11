"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {Heart, ShoppingBag, ClipboardList, User, House} from "lucide-react";
import { cn } from "@/lib/utils";

// Helper for conditional classes if you don't have cn()
// function cn(...classes: string[]) { return classes.filter(Boolean).join(" "); }

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/home", icon: House },
        { name: "Wishlist", href: "/wishlist", icon: Heart },
        { name: "Cart", href: "/cart", icon: ShoppingBag, isFloating: true },
        { name: "Orders", href: "/orders", icon: ClipboardList },
        { name: "Profile", href: "/profile", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pb-safe">
            <div className="flex justify-around items-center h-[70px] px-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                                isActive
                                    ? "text-orange-500"
                                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            )}
                        >
                            <div className="relative">
                                <Icon
                                    // fill={isActive ? "currentColor" : "none"}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={cn("w-6 h-6 transition-transform", isActive && "scale-110")}
                                />

                                {/* Cart Badge Example */}
                                {item.name === "Cart" && (
                                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950">
                                        2
                                      </span>
                                )}
                            </div>

                            <span className={cn(
                                        "text-[10px] font-medium",
                                        isActive ? "text-orange-500 font-semibold" : "text-zinc-500"
                                    )}>
                            {item.name}
                          </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}