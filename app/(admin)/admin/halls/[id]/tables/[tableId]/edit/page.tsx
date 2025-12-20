"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Armchair,
    Loader2,
    ArrowRight,
    Users,
    ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils"; // Ensure this is imported for the toggle styling

export default function EditTablePage() {
    const router = useRouter();
    const params = useParams();
    const hallId = params.id as string;
    const tableId = params.tableId as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Form State
    const [name, setName] = useState("");
    const [seats, setSeats] = useState(2);
    const [isAvailable, setIsAvailable] = useState(true); // New State

    // 1. Fetch Existing Data
    useEffect(() => {
        if (!hallId) return;

        async function fetchTable() {
            try {
                // Fetch all tables for the hall to find the specific one
                const res = await fetch(`/api/admin/tables/${hallId}`);
                const data = await res.json();

                if (data.success) {
                    const table = data.tables.find((t: any) => t._id === tableId);
                    if (table) {
                        setName(table.name);
                        setSeats(table.seats);
                        // Map isAvailable (default to true if undefined)
                        setIsAvailable(table.isAvailable ?? true);
                    } else {
                        // alert("Table not found");
                        router.push(`/admin/halls/${hallId}/tables`);
                    }
                }
            } catch (error) {
                console.error("Failed to load table", error);
            } finally {
                setIsFetching(false);
            }
        }
        fetchTable();
    }, [hallId, tableId, router]);

    const handleSubmit = async () => {
        if (!name.trim()) return alert("Please enter a table name");
        if (seats < 1) return alert("Seats must be at least 1");

        setIsLoading(true);

        try {
            const res = await fetch(`/api/admin/tables/${hallId}/${tableId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    seats,
                    isAvailable
                }),
            });

            if (!res.ok) throw new Error("Failed to update table");

            router.push(`/admin/halls/tables/${hallId}`);
            router.refresh();

        } catch (error) {
            console.error(error);
            // alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return (
        <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="max-w-3xl pb-20">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Edit Table</h1>
                    <p className="text-sm text-zinc-500">Update table details</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden relative">
                <div className="p-8 md:p-10 space-y-8">
                    {/* Field: Table Name */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
                            Table Name / Number
                        </label>
                        <div className="relative group">
                            <Armchair className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. T-01"
                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 focus:border-primary transition-all text-zinc-700 placeholder:text-zinc-400 font-medium"
                            />
                        </div>
                    </div>

                    {/* Field: Seats */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
                            Seating Capacity
                        </label>
                        <div className="relative group">
                            <Users className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="number"
                                min="1"
                                value={seats}
                                onChange={(e) => setSeats(parseInt(e.target.value))}
                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 focus:border-primary transition-all text-zinc-700 placeholder:text-zinc-400 font-medium"
                            />
                        </div>
                    </div>

                    {/* Field: Is Available Toggle */}
                    <div className="pt-4 border-t border-zinc-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase block mb-1">
                                    Table Availability
                                </label>
                                <p className="text-sm text-zinc-400">
                                    Enable or disable this table for seating.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsAvailable(!isAvailable)}
                                className={cn(
                                    "relative inline-flex h-6 sm:h-8 w-12 sm:w-14 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent focus:ring-orange-200",
                                    isAvailable ? "bg-green-500" : "bg-zinc-300"
                                )}
                            >
                                <span className={cn(
                                    "inline-block h-4 sm:h-6 w-4 sm:w-6 transform rounded-full bg-white transition-transform shadow-md",
                                    isAvailable ? "translate-x-6 sm:translate-x-7" : "translate-x-1"
                                )} />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex items-center justify-end gap-4">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 text-zinc-500 font-bold hover:bg-zinc-50 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-8 py-3 bg-primary hover:bg-orange-600 text-white text-nowrap rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" />  Updating...</>
                            ) : (
                                <>
                                    Update Table
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}