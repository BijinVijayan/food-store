"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Plus, Search, Filter, Edit2, Trash2, MapPin,
    Armchair, Layers, AlertTriangle, Loader2, ArrowRight, Building
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Hall {
    _id: string;
    name: string;
    image: string;
    isActive: boolean;
    tableCount?: number;
    totaSeats?: number;
}

export default function HallsPage() {
    // --- State ---
    const [halls, setHalls] = useState<Hall[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Delete Hall State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // --- 1. Fetch Halls & Table Counts ---
    useEffect(() => {
        async function fetchHalls() {
            try {
                const res = await fetch("/api/admin/halls");
                const data = await res.json();

                if (data.success) {
                    // Fetch table data for each hall
                    const hallsWithCounts = await Promise.all(data.halls.map(async (hall: Hall) => {
                        try {
                            const tablesRes = await fetch(`/api/admin/tables/${hall._id}`);
                            const tablesData = await tablesRes.json();
                            const tables = tablesData.tables || [];

                            const totalSeats = tables.reduce((sum: number, table: any) => sum + (table.seats || 0), 0);

                            return {
                                ...hall,
                                tableCount: tables.length,
                                totaSeats: totalSeats // <--- Fixed Calculation
                            };
                        } catch (e) {
                            return { ...hall, tableCount: 0, totaSeats: 0 };
                        }
                    }));
                    setHalls(hallsWithCounts);
                }
            } catch (error) {
                console.error("Failed to load halls", error);
            } finally {
                setLoading(false);
            }
        }
        fetchHalls();
    }, []);

    // --- Handlers for Hall ---
    const handleDeleteHall = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/halls/${deleteId}`, { method: "DELETE" });
            if (res.ok) {
                setHalls(prev => prev.filter(h => h._id !== deleteId));
                setDeleteId(null);
            } else {
                alert("Delete Failed");
            }
        } catch (error) {
            alert("Delete Failed");
        } finally {
            setIsDeleting(false);
        }
    };

    // --- Filtering ---
    const filteredHalls = halls.filter(hall =>
        hall.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center h-[50vh] items-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 md:pb-0 relative">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Restaurant Zones</h1>
                    <p className="text-zinc-500 text-sm">Manage your dining areas and capacity</p>
                </div>
                <Link href={"/admin/halls/add"} className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2.5 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" /> Add New Hall
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-3 rounded-2xl border border-zinc-100 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search halls..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 rounded-xl outline-none text-sm"
                    />
                </div>
                <button className="px-4 py-3 bg-white border border-zinc-100 rounded-xl text-zinc-600 font-medium flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filter
                </button>
            </div>

            {/* Hall Grid */}
            {filteredHalls.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 h-60 flex flex-col gap-4 items-center justify-center">
                    <Building width={36} height={36} /> <p>No halls found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHalls.map((hall) => (
                        <div key={hall._id} className="bg-white shadow-xs rounded-3xl border border-zinc-100 overflow-hidden flex flex-col group transition-all duration-300">
                            <div className="p-6 flex-1">
                                {/* Header with Image, Name, Status, Actions */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-zinc-100 rounded-2xl relative overflow-hidden border border-zinc-100 shrink-0">
                                            {hall.image ? (
                                                <Image src={hall.image} alt={hall.name} fill className="object-cover" />
                                            ) : (
                                                <Armchair className="w-8 h-8 text-zinc-400 m-auto mt-4" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-zinc-900 leading-tight">{hall.name}</h3>
                                            {/*<div className="flex items-center gap-1 text-sm text-zinc-500 mt-1">*/}
                                            {/*    <MapPin className="w-4 h-4" /> Zone {hall._id.slice(-2)}*/}
                                            {/*</div>*/}
                                            <div className="mt-3">
                                                <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", hall.isActive ? "bg-green-50 text-green-700 border-green-100" : "bg-zinc-100 text-zinc-500 border-zinc-200")}>
                                                    {hall.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/halls/edit/${hall._id}`} className="p-2 text-zinc-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                                            <Edit2 className="w-5 h-5" />
                                        </Link>
                                        <button onClick={() => setDeleteId(hall._id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <div className="bg-zinc-50 p-4 rounded-2xl text-center">
                                        <span className="block text-xs text-zinc-500 mb-1 font-bold uppercase tracking-wider">Total Tables</span>
                                        <div className="flex items-center justify-center gap-2 text-zinc-900">
                                            <Armchair className="w-5 h-5 text-orange-500" />
                                            <span className="text-2xl font-bold">{hall.tableCount || 0}</span>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-50 p-4 rounded-2xl text-center">
                                        <span className="block text-xs text-zinc-500 mb-1 font-bold uppercase tracking-wider">Capacity</span>
                                        <div className="flex items-center justify-center gap-2 text-zinc-900">
                                            <Layers className="w-5 h-5 text-primary" />
                                            <span className="text-2xl font-bold text-zinc-800">{hall.totaSeats || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Button - Conditionally Rendered */}
                            <div className="p-4 pt-2">
                                {(hall.tableCount || 0) > 0 ? (
                                    <Link
                                        href={`/admin/halls/tables/${hall._id}`}
                                        className="w-full py-3.5 bg-primary text-white hover:bg-orange-600 font-bold rounded-xl flex items-center justify-center gap-2"
                                    >
                                        Manage Tables <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    // NO TABLES -> Go to Create Page
                                    <Link
                                        href={`/admin/halls/${hall._id}/tables/add`}
                                        className="w-full py-3.5 bg-orange-50 hover:bg-orange-100 text-primary font-bold rounded-xl flex items-center justify-center gap-2 border border-dashed transition-all shadow-sm shadow-primary/10"
                                    >
                                        <Plus className="w-4 h-4" /> Create First Table
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* "Add New Hall" Card */}
                    <Link href="/admin/halls/add" className="border-2 border-dashed border-zinc-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-zinc-400 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/50 transition-all group sm:min-h-[300px]">
                        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                            <Plus className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-zinc-900 group-hover:text-orange-700">Create New Hall</h3>
                            <p className="text-sm mt-1">Define a new dining zone</p>
                        </div>
                    </Link>
                </div>
            )}

            {/* --- Delete Hall Modal --- */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center scale-100 animate-in zoom-in-95">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900">Delete Hall?</h3>
                        <p className="text-sm text-zinc-500 mt-2 mb-6">
                            This will also delete all <span className="font-bold text-red-600">tables</span> associated with this hall. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 text-sm font-bold text-zinc-600 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors">Cancel</button>
                            <button onClick={handleDeleteHall} disabled={isDeleting} className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 flex items-center justify-center gap-2 transition-colors">
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}