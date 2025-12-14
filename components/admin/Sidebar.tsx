"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, ShoppingBag, UtensilsCrossed, Users,
    BarChart2, Settings, HelpCircle, ChefHat, X, Boxes
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: 3 },
    { label: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
    { label: "Categories", href: "/admin/categories", icon: Boxes },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
];

const SYSTEM_ITEMS = [
    { label: "Settings", href: "/admin/settings", icon: Settings },
    { label: "Support", href: "/admin/support", icon: HelpCircle },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay (Backdrop) */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-zinc-100 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full" // Slide in/out on mobile
                )}
            >
                {/* Brand Header */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <ChefHat className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl text-zinc-900">RestoAdmin</span>
                    </div>
                    {/* Close Button (Mobile Only) */}
                    <button onClick={onClose} className="md:hidden p-2 text-zinc-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Menu */}
                <div className="flex-1 px-4 py-2 overflow-y-auto no-scrollbar">
                    <p className="text-xs font-bold text-zinc-400 uppercase mb-4 px-4">Main Menu</p>
                    <div className="space-y-1">
                        {MENU_ITEMS.map((item) => (
                            <MenuItem key={item.href} item={item} pathname={pathname} onClick={onClose} />
                        ))}
                    </div>

                    <p className="text-xs font-bold text-zinc-400 uppercase mt-8 mb-4 px-4">System</p>
                    <div className="space-y-1">
                        {SYSTEM_ITEMS.map((item) => (
                            <MenuItem key={item.href} item={item} pathname={pathname} onClick={onClose} />
                        ))}
                    </div>
                </div>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-zinc-50">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                            <span className="font-bold text-orange-600">AU</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-zinc-900 truncate">Admin User</p>
                            <p className="text-xs text-zinc-500 truncate">Manager</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

// Helper: Close menu on link click (mobile UX)
function MenuItem({ item, pathname, onClick }: { item: any, pathname: string, onClick: () => void }) {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm",
                isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            )}
        >
            <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5", isActive ? "text-orange-500" : "text-zinc-400")} />
                {item.label}
            </div>
            {item.badge && (
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
            )}
        </Link>
    );
}