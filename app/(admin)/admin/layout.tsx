"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { useAdminStore } from "@/store/useAdminStore"; // Import store
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { fetchAdminData, isLoading, user, store } = useAdminStore();

    // Fetch data on mount
    useEffect(() => {
        fetchAdminData();
    }, []);
    // console.log("store",store);
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-50">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                storeLogo={store?.logo || ""}
                user={user}
            />

            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:ml-64">

                {/* We can now pass user/store data to Header if needed */}
                <Header
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                />

                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}