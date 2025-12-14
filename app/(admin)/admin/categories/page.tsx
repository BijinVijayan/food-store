"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    Edit2,
    ChevronDown,
    MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data Structure
const CATEGORIES = [
    {
        id: 1,
        name: "Pizza",
        count: "12 Products",
        updated: "Updated 2h ago",
        image: "/images/categories/pizza-category.webp",
        subCategories: [
            { id: "sub1", name: "Classic Pizzas", count: "5 items" },
            { id: "sub2", name: "Gourmet Selection", count: "4 items" },
            { id: "sub3", name: "Vegan Options", count: "3 items" },
        ]
    },
    {
        id: 2,
        name: "Burgers",
        count: "8 Products",
        updated: "Updated yesterday",
        image: "/images/categories/burger.webp",
        subCategories: [
            { id: "sub4", name: "Beef Burgers", count: "5 items" },
            { id: "sub5", name: "Chicken Burgers", count: "3 items" },
        ]
    },
    {
        id: 3,
        name: "Beverages",
        count: "15 Products",
        updated: "Updated 3d ago",
        image: "/images/categories/beverages.avif",
        subCategories: [
            { id: "sub6", name: "Soft Drinks", count: "8 items" },
            { id: "sub7", name: "Juices", count: "4 items" },
            { id: "sub8", name: "Coffee", count: "3 items" },
        ]
    },
    {
        id: 4,
        name: "Desserts",
        count: "6 Products",
        updated: "Updated 1w ago",
        image: "/images/categories/Desserts.webp",
        subCategories: [
            { id: "sub9", name: "Cakes", count: "4 items" },
            { id: "sub10", name: "Ice Cream", count: "2 items" },
        ]
    },
];

export default function CategoriesPage() {
    const [expanded, setExpanded] = useState<number | null>(1); // Default open first one
    const [searchTerm, setSearchTerm] = useState("");

    const toggleExpand = (id: number) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">

            {/* 1. Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Menu Categories</h1>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                        <span>Dashboard</span>
                        <span>›</span>
                        <span className="text-zinc-900 font-medium">Categories</span>
                    </div>
                </div>

                <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm text-sm shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all w-full md:w-auto">
                    <Plus className="w-5 h-5" />
                    <span>Add Category</span>
                </button>
            </div>

            {/* 2. Controls Bar */}
            <div className="bg-transparent p-2 rounded-2xl  flex flex-col md:flex-row gap-2">
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

            {/* 3. Category List */}
            <div className="space-y-4">
                {CATEGORIES.map((cat) => {
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
                                {/* Drag Handle (Desktop) */}
                                <div className="hidden md:flex gap-0 text-zinc-300 cursor-grab hover:text-zinc-400">
                                    <MoreVertical className="w-5 h-5" />
                                    <MoreVertical className="w-5 h-5 -ml-3.5" />
                                </div>

                                {/* Icon */}
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-50 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-100">
                                    {/* Placeholder for Icon Image */}
                                    {/*<div className="w-8 h-8 rounded-full bg-orange-100" />*/}
                                     <Image src={cat.image} width={40} height={40} alt={cat.name} className={"w-full rounded-2xl"} />
                                </div>

                                {/* Info */}
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

                                {/* Actions */}
                                <div className="flex items-center gap-2 md:gap-4">
                                    <button className="p-2 cursor-pointer text-zinc-400 hover:text-orange-500 transition-colors hidden sm:block">
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

                            {/* Sub-Categories Section (Collapsible) */}
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
                                            <button className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                                                <Plus className="w-3 h-3" /> Add New
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {/* Sub Category Items */}
                                            {cat.subCategories.map((sub) => (
                                                <div
                                                    key={sub.id}
                                                    className="bg-white p-3 rounded-xl border border-zinc-100 flex items-center justify-between group hover:border-orange-200 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${getRowColor(cat.id)}`} />
                                                        <div>
                                                            <p className="font-bold text-sm text-zinc-800">{sub.name}</p>
                                                            <p className="text-xs text-zinc-400">{sub.count}</p>
                                                        </div>
                                                    </div>
                                                    <Edit2 className="w-4 h-4 text-zinc-300 group-hover:text-orange-500 transition-colors" />
                                                </div>
                                            ))}

                                            {/* Add Button Card */}
                                            <button className="border-2 border-dashed border-zinc-200 rounded-xl p-3 flex items-center justify-center gap-2 text-zinc-400 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all group">
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
                })}
            </div>

        </div>
    );
}

// Helper to give random colors to sub-category dots
function getRowColor(id: number) {
    const colors = [
        "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-yellow-500"
    ];
    return colors[id % colors.length];
}