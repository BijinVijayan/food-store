"use client";

import {Search, Bell, Mail, Menu} from "lucide-react";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="h-16 md:h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">

            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-50 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Search Bar - Hidden on small mobile, visible on tablet+ */}
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 rounded-xl outline-none text-sm text-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <button className="p-2 cursor-pointer md:p-3 rounded-xl hover:bg-zinc-50 border border-zinc-100 text-zinc-500 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button className="p-2 cursor-pointer md:p-3 rounded-xl hover:bg-zinc-50 border border-zinc-100 text-zinc-500 transition-colors">
                    <Mail className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}