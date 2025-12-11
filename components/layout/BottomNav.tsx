"use client";

import { useEffect, useState } from "react"; // 1. Import hooks
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag, ClipboardList, User, House } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore"; // 2. Import Store

export default function BottomNav() {
    const pathname = usePathname();

    // 3. Get Cart from Store
    const cart = useAppStore((state) => state.cart);

    // 4. Handle Hydration (Prevents "Text content does not match" error)
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // 5. Calculate Total Quantity
    // We use .reduce() so if you have 2 Burgers and 1 Pizza, it shows "3" (not "2" unique items)
    const cartCount = mounted
        ? cart.reduce((acc, item) => acc + item.quantity, 0)
        : 0;

    const navItems = [
        { name: "Home", href: "/home", icon: House },
        { name: "Wishlist", href: "/wishlist", icon: Heart },
        { name: "Cart", href: "/cart", icon: ShoppingBag },
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
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={cn("w-6 h-6 transition-transform", isActive && "scale-110")}
                                />

                                {/* 6. Conditional Badge Rendering */}
                                {item.name === "Cart" && cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 animate-in zoom-in duration-300">
                                        {cartCount > 99 ? "99+" : cartCount}
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