"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
    Search, Plus, Edit2, Trash2,
    Armchair, QrCode, Loader2, Eye, Download, X, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Table {
    _id: string;
    name: string;
    seats: number;
    isOccupied: boolean;
    qrCodeImage: string;
}

interface Hall {
    _id: string;
    name: string;
}

export default function HallTablesPage() {
    const params = useParams();
    const hallId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [hall, setHall] = useState<Hall | null>(null);
    const [tables, setTables] = useState<Table[]>([]);
    const [filter, setFilter] = useState<"All" | "Free" | "Occupied">("All");
    const [searchTerm, setSearchTerm] = useState("");

    // Modals State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [viewQrTable, setViewQrTable] = useState<Table | null>(null);

    // 1. Fetch Data
    useEffect(() => {
        async function loadData() {
            try {
                // Fetch Hall Details
                const hallRes = await fetch(`/api/admin/halls/${hallId}`);
                const hallData = await hallRes.json();
                if (hallData.success) setHall(hallData.hall);

                // Fetch Tables
                const tablesRes = await fetch(`/api/admin/tables/${hallId}`);
                const tablesData = await tablesRes.json();
                if (tablesData.success) setTables(tablesData.tables);

            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [hallId]);

    // 2. Delete Handler
    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/tables/${hallId}/${deleteId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setTables(prev => prev.filter(t => t._id !== deleteId));
                setDeleteId(null);
            } else {
                alert("Failed to delete table");
            }
        } catch (error) {
            alert("Error deleting table");
        } finally {
            setIsDeleting(false);
        }
    };

    // 3. Download QR Handler
    const downloadQr = async (imageUrl: string, fileName: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    // 4. Filtering
    const filteredTables = tables.filter(table => {
        const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === "All" ? true :
                filter === "Free" ? !table.isOccupied :
                    filter === "Occupied" ? table.isOccupied : true;

        return matchesSearch && matchesFilter;
    });

    const freeCount = tables.filter(t => !t.isOccupied).length;
    const occupiedCount = tables.filter(t => t.isOccupied).length;

    if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

    return (
        <div className="max-w-6xl mx-auto pb-20 relative">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
                <div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                        <Link href="/admin/halls" className="hover:text-zinc-800">Halls</Link>
                        <span>›</span>
                        <span className="text-zinc-900 font-medium">{hall?.name || "Loading..."}</span>
                        <span>›</span>
                        <span className="text-orange-600 font-medium">Tables</span>
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900">{hall?.name || "Hall"}</h1>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search tables..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-primary"
                        />
                    </div>
                    <Link
                        href={`/admin/halls/${hallId}/tables/add`}
                        className="bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" /> Add Table
                    </Link>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-2 rounded-2xl border border-zinc-100 mb-6">
                <div className="flex p-1 bg-zinc-100/50 rounded-xl">
                    {["All", "Free", "Occupied"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                                filter === f ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-700"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex gap-4 px-4 py-2 text-sm font-medium">
                    <span className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 rounded-full bg-green-500" /> {freeCount} Free
                    </span>
                    <span className="flex items-center gap-2 text-red-600">
                        <div className="w-2 h-2 rounded-full bg-primary" /> {occupiedCount} Occupied
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {filteredTables.map(table => (
                    <div key={table._id} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden transition-all group">

                        {/* Card Header (Revised) */}
                        <div className="p-4 flex justify-between items-start border-b border-zinc-50 bg-zinc-50/30">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">{table.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                                        <Armchair className="w-3.5 h-3.5" /> {table.seats} Seats
                                    </div>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                        table.isOccupied
                                            ? "bg-red-50 text-red-600 border-red-100"
                                            : "bg-green-50 text-green-600 border-green-100"
                                    )}>
                                        {table.isOccupied ? "Occupied" : "Free"}
                                    </span>
                                </div>
                            </div>

                            {/* Action Icons */}
                            <div className="flex gap-1">
                                <Link
                                    href={`/admin/halls/${hallId}/tables/${table._id}/edit`}
                                    className="p-1.5 bg-white text-zinc-400 hover:text-primary rounded-lg border border-zinc-200 hover:border-orange-200 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => setDeleteId(table._id)}
                                    className="p-1.5 bg-white text-zinc-400 hover:text-primary rounded-lg border border-zinc-200 hover:border-red-200 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* QR Body */}
                        <div className="p-6 flex items-center justify-center relative">
                            <div className="w-36 h-36 relative mix-blend-multiply">
                                {table.qrCodeImage ? (
                                    <Image src={table.qrCodeImage} alt="QR" fill className="object-contain" />
                                ) : (
                                    <QrCode className="w-full h-full text-zinc-200" />
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-zinc-100">
                            <button
                                onClick={() => setViewQrTable(table)}
                                className="w-full py-2.5 rounded-xl border  cursor-pointer border-zinc-200 text-zinc-600 font-bold text-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center justify-center gap-2"
                            >
                                <Eye className="w-4 h-4" /> View QR
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Table Card */}
                <Link
                    href={`/admin/halls/${hallId}/tables/add`}
                    className="border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center py-5 sm:min-h-[300px] text-zinc-400 hover:border-orange-300 hover:bg-orange-50/30 hover:text-orange-600 transition-all group"
                >
                    <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-bold">Add New Table</span>
                </Link>

            </div>

            {/* --- QR Modal --- */}
            {viewQrTable && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95">
                        <div className="p-4 border-b border-zinc-100 flex justify-between items-center">
                            <h3 className="font-bold text-zinc-900">Table QR Code</h3>
                            <button onClick={() => setViewQrTable(null)} className="p-1 text-zinc-400 hover:text-zinc-900 bg-zinc-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 flex flex-col items-center justify-center bg-zinc-50">
                            <div className="bg-white p-4 rounded-2xl border border-zinc-100">
                                <div className="w-48 h-48 relative">
                                    <Image src={viewQrTable.qrCodeImage} alt="QR" fill className="object-contain" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 mt-4">{viewQrTable.name}</h2>
                            <p className="text-sm text-zinc-500">{hall?.name}</p>
                        </div>
                        <div className="p-4 border-t border-zinc-100">
                            <button
                                onClick={() => downloadQr(viewQrTable.qrCodeImage, `${hall?.name}-${viewQrTable.name}.png`)}
                                className="w-full py-3 cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <Download className="w-4 h-4" /> Download Image
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Delete Confirmation Modal --- */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center scale-100 animate-in zoom-in-95">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900">Delete Table?</h3>
                        <p className="text-sm text-zinc-500 mt-2 mb-6">
                            Are you sure you want to delete this table? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                disabled={isDeleting}
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-3 text-sm font-bold text-zinc-600 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isDeleting}
                                onClick={handleDelete}
                                className="flex-1 py-3 text-sm font-bold text-white bg-primary rounded-xl hover:bg-red-600 flex items-center justify-center gap-2 transition-colors"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}