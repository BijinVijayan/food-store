"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Plus, Search, Edit2, Trash2, Filter, ChevronDown, Loader2, AlertTriangle, Ungroup
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MenuPage() {
    const router = useRouter();

    // Data State
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 1. Fetch Products & Categories
    useEffect(() => {
        async function loadData() {
            try {
                // Parallel fetching
                const [prodRes, catRes] = await Promise.all([
                    fetch("/api/admin/products"),
                    fetch("/api/admin/categories")
                ]);

                const prodData = await prodRes.json();
                const catData = await catRes.json();

                if (prodData.success) setProducts(prodData.products);
                if (catData.success) setCategories(catData.categories);

            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // 2. Filter Logic
    const filteredProducts = products.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || item.categoryId?.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // 3. Delete Logic
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p._id !== deleteId));
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

    if (loading) return <div className="flex justify-center h-[50vh] items-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 md:pb-0 relative">

            {/* 1. Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Menu Items</h1>
                    <p className="text-zinc-500 text-sm">Manage your food inventory and prices</p>
                </div>

                <Link href={"/admin/menu/add"} className="bg-primary hover:bg-orange-600 text-white text-sm px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all w-full md:w-auto">
                    <Plus className="w-5 h-5" />
                    <span>Add New Product</span>
                </Link>
            </div>

            {/* 2. Filters & Search Bar */}
            <div className="bg-white p-3 rounded-2xl border border-zinc-100 flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 rounded-xl outline-none text-sm focus:ring-2 focus:ring-neutral-50 border border-transparent focus:border-transparent transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
                    {/* Category Dropdown */}
                    <div className="relative flex-shrink-0">
                        <select
                            className="bg-zinc-50 px-4 appearance-none pr-8 py-3 rounded-xl
                             outline-none text-sm text-zinc-600 font-medium
                             border border-zinc-100 focus:border-orange-200
                             min-w-[140px] cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option>All Categories</option>
                            {categories.map((cat: any) => (
                                <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                          <ChevronDown className="w-4 h-4" />
                        </span>
                    </div>

                    <button className="bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-100
                     text-zinc-600 hover:bg-zinc-100 transition-colors
                     flex items-center gap-2 flex-shrink-0 whitespace-nowrap max-sm:flex-1 justify-center">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">Filter</span>
                    </button>
                </div>
            </div>

            {/* 3. Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-10 text-zinc-500 h-60 flex flex-col gap-4 items-center justify-center">
                    <Ungroup width={36} height={36} />
                    <p>No products found matching your search.</p>
                </div>
            )}

            {/* 4. VIEW: MOBILE CARDS */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredProducts.map((item) => (
                    <div key={item._id} className="bg-white p-4 rounded-2xl border border-zinc-100 flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-20 h-20 bg-zinc-100 rounded-xl relative overflow-hidden shrink-0 border border-zinc-100">
                                {item.images?.[0] ? (
                                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-200" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-zinc-900 text-base line-clamp-1">{item.name}</h3>
                                </div>
                                <span className="font-bold text-zinc-500 text-nowrap">AED {item.sellingPrice}</span>
                                <div className="mt-1">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-primary border border-orange-100 uppercase tracking-wide">
                                        {item.categoryId?.name || 'General'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-zinc-50" />

                        <div className="flex items-center justify-between">
                            <button className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                item.inStock
                                    ? "bg-green-50 text-green-700 border-green-100"
                                    : "bg-red-50 text-red-700 border-red-100"
                            )}>
                                <div className={cn("w-2 h-2 rounded-full", item.inStock ? "bg-green-600" : "bg-red-600")} />
                                {item.inStock ? "In Stock" : "Out of Stock"}
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.push(`/admin/menu/edit/${item._id}`)}
                                    className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-500 hover:text-orange-500 hover:border-orange-200"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDeleteId(item._id)}
                                    className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-500 hover:text-red-500 hover:border-red-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 5. VIEW: DESKTOP TABLE */}
            {filteredProducts.length !== 0 && (
            <div className="hidden md:block bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-neutral-100 border-b border-zinc-100 text-xs uppercase text-zinc-500 font-semibold tracking-wider">
                    <tr>
                        <th className="p-5">Product Name</th>
                        <th className="p-5">Category</th>
                        <th className="p-5">Price</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                    {filteredProducts.map((item) => (
                        <tr key={item._id} className="group hover:bg-zinc-50/50 transition-colors">
                            <td className="p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white rounded-lg relative overflow-hidden border border-zinc-100 shrink-0">
                                        {item.images?.[0] ? (
                                            <Image src={item.images[0]} alt={item.name} fill className="object-contain" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-200" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900 text-sm">{item.name}</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">{item.subCategoryId?.name || ''}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-5">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100">
                                    {item.categoryId?.name}
                                </span>
                            </td>
                            <td className="p-5">
                                <span className="font-medium text-zinc-600 text-sm">AED {item.sellingPrice}</span>
                            </td>
                            <td className="p-5">
                                <button className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                    item.inStock
                                        ? "bg-green-50 text-green-700 border-green-100"
                                        : "bg-red-50 text-red-700 border-red-100"
                                )}>
                                    <div className={cn("w-2 h-2 rounded-full", item.inStock ? "bg-green-600" : "bg-red-600")} />
                                    {item.inStock ? "In Stock" : "Out of Stock"}
                                </button>
                            </td>
                            <td className="p-5 text-right">
                                <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                                    <button
                                        onClick={() => router.push(`/admin/menu/edit/${item._id}`)}
                                        className="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-600 hover:border-orange-200 hover:bg-orange-100 cursor-pointer hover:text-orange-400 transition-all"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(item._id)}
                                        className="p-2 bg-white border border-zinc-200 rounded-lg text-red-500 hover:border-red-200 hover:bg-red-100 cursor-pointer transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            )}
            {/* 6. DELETE CONFIRMATION MODAL */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200 p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900">Delete Product?</h3>
                        <p className="text-sm text-zinc-500 mt-2 mb-6">
                            Are you sure you want to delete this item? This action cannot be undone.
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
                                className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
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