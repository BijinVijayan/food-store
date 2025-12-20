"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Plus, Search, Filter, ArrowUpDown, Edit2, ChevronDown, MoreVertical,
    Loader2, Ungroup, Trash2, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SubCategory {
    id: string;
    name: string;
    count: string;
    image: string;
}

interface Category {
    id: string;
    name: string;
    count: string;
    updated: string;
    image: string;
    subCategories: SubCategory[];
}

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteType, setDeleteType] = useState<'category' | 'sub-category' | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 1. Fetch Real Data
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/admin/categories");
                const data = await res.json();
                if (data.success) {
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error("Failed to load categories");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const toggleExpand = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };

    const handleEdit = (catId: string) => {
        router.push(`/admin/categories/${catId}`);
    };

    // --- Delete Logic ---
    const confirmDelete = (e: React.MouseEvent, id: string, type: 'category' | 'sub-category') => {
        e.stopPropagation(); // Prevent toggling accordion
        setDeleteId(id);
        setDeleteType(type);
    };

    const executeDelete = async () => {
        if (!deleteId || !deleteType) return;
        setIsDeleting(true);

        // Determine API Endpoint based on type
        const endpoint = deleteType === 'category'
            ? `/api/admin/categories/${deleteId}`
            : `/api/admin/subcategories/${deleteId}`;

        try {
            const res = await fetch(endpoint, {
                method: "DELETE",
            });

            if (res.ok) {
                if (deleteType === 'category') {
                    // Remove Category from State
                    setCategories((prev) => prev.filter((cat) => cat.id !== deleteId));
                } else {
                    // Remove Sub-Category from Nested State
                    setCategories((prev) => prev.map((cat) => ({
                        ...cat,
                        subCategories: cat.subCategories.filter((sub) => sub.id !== deleteId)
                    })));
                }
                setDeleteId(null);
                setDeleteType(null);
            } else {
                alert("Failed to delete item");
            }
        } catch (error) {
            console.error("Delete error", error);
            alert("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter categories based on search term
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center h-[80vh] items-center p-10"><Loader2 width={30} height={30} className="animate-spin text-orange-500" /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 relative">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Menu Categories</h1>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                        <span>Dashboard</span>
                        <span>›</span>
                        <span className="text-zinc-900 font-medium">Categories</span>
                    </div>
                </div>

                <Link href={"/admin/categories/add"} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm text-sm shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all w-full md:w-auto">
                    <Plus className="w-5 h-5" />
                    <span>Add Category</span>
                </Link>
            </div>

            {/* Controls Bar */}
            <div className="bg-transparent p-2 rounded-2xl flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-3 w-5 h-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 md:bg-white rounded-xl outline-none text-sm focus:bg-zinc-50 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-3 cursor-pointer bg-white border border-zinc-100 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors flex items-center gap-2 text-sm flex-1 md:flex-none justify-center">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="px-4 py-3 cursor-pointer bg-white border border-zinc-100 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors flex items-center gap-2 text-sm flex-1 md:flex-none justify-center">
                        <ArrowUpDown className="w-4 h-4" /> Sort
                    </button>
                </div>
            </div>

            {/* Category List */}
            <div className="space-y-4">
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 h-60 flex flex-col gap-4 items-center justify-center">
                        <Ungroup width={36} height={36} />No categories found.
                    </div>
                ) : (
                    filteredCategories.map((cat) => {
                        const isExpanded = expanded === cat.id;
                        return (
                            <div
                                key={cat.id}
                                className={cn(
                                    "bg-white rounded-3xl border border-zinc-100 overflow-hidden transition-all duration-300",
                                    isExpanded ? "ring-1 ring-orange-100" : ""
                                )}
                            >
                                {/* Category Header Row */}
                                <div className="p-4 flex items-center gap-4 md:gap-6">
                                    <div className="hidden md:flex gap-0 text-zinc-300 cursor-grab hover:text-zinc-400">
                                        <MoreVertical className="w-5 h-5" />
                                        <MoreVertical className="w-5 h-5 -ml-3.5" />
                                    </div>

                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-50 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-100 overflow-hidden relative">
                                        {cat.image ? (
                                            <Image src={cat.image} fill className="object-cover" alt={cat.name} />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-100" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-zinc-900">{cat.name}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-xs md:text-sm">
                                            <span className="font-medium text-xs bg-zinc-100 px-3 py-1 rounded-md text-zinc-600">
                                                {cat.count}
                                            </span>
                                            <span className="text-zinc-400 hidden sm:inline-block">
                                                • {cat.updated}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 md:gap-4">
                                        {/* DELETE BUTTON (CATEGORY) */}
                                        <button
                                            onClick={(e) => confirmDelete(e, cat.id, 'category')}
                                            className="p-2 cursor-pointer text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors hidden sm:block"
                                            title="Delete Category"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>

                                        {/* EDIT BUTTON (CATEGORY) */}
                                        <button
                                            onClick={() => handleEdit(cat.id)}
                                            className="p-2 cursor-pointer text-zinc-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors hidden sm:block"
                                            title="Edit Category"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>

                                        <button
                                            onClick={() => toggleExpand(cat.id)}
                                            className={cn(
                                                "w-8 h-8 md:w-10 cursor-pointer md:h-10 rounded-full flex items-center justify-center transition-all",
                                                isExpanded
                                                    ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20 rotate-180"
                                                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                                            )}
                                        >
                                            <ChevronDown className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Sub-Categories Section */}
                                <div
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden bg-zinc-50/50 border-t border-zinc-100">
                                        <div className="p-4 md:p-6">
                                            <div className="flex justify-between items-center mb-4 px-1">
                                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                                    Sub-Categories ({cat.subCategories.length})
                                                </span>
                                                <button onClick={() => handleEdit(cat.id)} className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                                                    <Plus className="w-3 h-3" /> Add
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {/* Sub Category Items */}
                                                {cat.subCategories.map((sub) => (
                                                    <div
                                                        key={sub.id}
                                                        className="bg-white p-3 rounded-xl border border-zinc-100 flex items-center justify-between group hover:border-red-200 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {sub.image ? (
                                                                <Image src={sub.image} alt={sub.name} width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-zinc-200" />
                                                            )}
                                                            <div>
                                                                <p className="font-bold text-sm text-zinc-800">{sub.name}</p>
                                                                <p className="text-xs text-zinc-400">{sub.count}</p>
                                                            </div>
                                                        </div>

                                                        {/* DELETE BUTTON (SUB-CATEGORY) */}
                                                        <button
                                                            onClick={(e) => confirmDelete(e, sub.id, 'sub-category')}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                            title="Delete Sub-category"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}

                                                <button onClick={() => handleEdit(cat.id)} className="border-2 border-dashed border-zinc-200 rounded-xl p-3 flex items-center justify-center gap-2 text-zinc-400 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all group">
                                                    <div className="w-6 h-6 rounded-full bg-zinc-100 group-hover:bg-orange-100 flex items-center justify-center">
                                                        <Plus className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium">Add Sub-category</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* --- CONFIRMATION MODAL --- */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900">
                                Delete {deleteType === 'category' ? 'Category' : 'Sub-Category'}?
                            </h3>
                            <p className="text-sm text-zinc-500 mt-2">
                                {deleteType === 'category'
                                    ? "Are you sure? This will delete the category AND all associated sub-categories/products."
                                    : "Are you sure? This will delete the sub-category AND all associated products."
                                }
                                <br/>This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex border-t border-zinc-100">
                            <button
                                disabled={isDeleting}
                                onClick={() => {
                                    setDeleteId(null);
                                    setDeleteType(null);
                                }}
                                className="flex-1 py-4 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors border-r border-zinc-100"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isDeleting}
                                onClick={executeDelete}
                                className="flex-1 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                                    </>
                                ) : (
                                    "Yes, Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}