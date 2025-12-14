"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Static Data
const PRODUCTS = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        subCategory: "Classic",
        price: "AED 25.00",
        status: "In Stock",
        image: "/images/products/MargheritaPizza.webp"
    },
    {
        id: 2,
        name: "Classic Cheeseburger",
        category: "Burger",
        subCategory: "Beef",
        price: "AED 15.75",
        status: "In Stock",
        image: "/images/products/cheeseburger.jpg"
    },
    {
        id: 3,
        name: "California Roll (6 pcs)",
        category: "Sushi",
        subCategory: "Maki",
        price: "AED 18.00",
        status: "Out of Stock",
        image: "/images/products/supreme pizza cake.jpg"
    },
    {
        id: 4,
        name: "Spicy Paneer Wrap",
        category: "Wraps",
        subCategory: "Veg",
        price: "AED 12.50",
        status: "In Stock",
        image: "/images/products/paneer.webp"
    },
    {
        id: 5,
        name: "Chocolate Lava Cake",
        category: "Dessert",
        subCategory: "Cakes",
        price: "AED 22.00",
        status: "In Stock",
        image: "/images/products/Chocolate-lava-cake.jpg"
    },
];

export default function MenuPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 md:pb-0">

            {/* 1. Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Menu Items</h1>
                    <p className="text-zinc-500 text-sm">Manage your food inventory and prices</p>
                </div>

                <button className="bg-primary hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all w-full md:w-auto">
                    <Plus className="w-5 h-5" />
                    <span>Add New Product</span>
                </button>
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
                    <select className="bg-zinc-50 px-4 py-3 rounded-xl outline-none text-sm text-zinc-600 font-medium border border-zinc-100 focus:border-orange-200 min-w-[140px] cursor-pointer flex-shrink-0">
                        <option>All Categories</option>
                        <option>Pizza</option>
                        <option>Burgers</option>
                        <option>Drinks</option>
                    </select>

                    <button className="bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-100 text-zinc-600 hover:bg-zinc-100 transition-colors flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">Filter</span>
                    </button>
                </div>
            </div>

            {/* --- VIEW 1: MOBILE CARDS (Visible on Mobile, Hidden on Desktop) --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {PRODUCTS.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-zinc-100 flex flex-col gap-4">
                        {/* Card Top: Image & Details */}
                        <div className="flex items-start gap-4">
                            <div className="w-20 h-20 bg-zinc-100 rounded-xl relative overflow-hidden shrink-0 border border-zinc-100">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-zinc-900 text-base line-clamp-1">{item.name}</h3>
                                </div>
                                <span className="font-bold text-zinc-500 text-nowrap">{item.price}</span>
                                {/*<p className="text-xs text-zinc-500 mt-1 mb-2">{item.subCategory}</p>*/}
                                <div>
                                    <span className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-primary border border-orange-100 uppercase tracking-wide">
                                    {item.category}
                                </span>
                                </div>

                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-zinc-50" />

                        {/* Card Bottom: Status & Actions */}
                        <div className="flex items-center justify-between">
                            {/* Status Toggle */}
                            <button className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                item.status === 'In Stock'
                                    ? "bg-green-50 text-green-700 border-green-100"
                                    : "bg-zinc-100 text-zinc-500 border-zinc-200"
                            )}>
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    item.status === 'In Stock' ? "bg-green-600" : "bg-zinc-400"
                                )} />
                                {item.status}
                            </button>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-500 hover:text-orange-500 hover:border-orange-200 active:scale-95 transition-all">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-500 hover:text-red-500 hover:border-red-200 active:scale-95 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- VIEW 2: DESKTOP TABLE (Hidden on Mobile, Visible on Desktop) --- */}
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
                    {PRODUCTS.map((item) => (
                        <tr key={item.id} className="group hover:bg-zinc-50/50 transition-colors">
                            <td className="p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-zinc-100 rounded-lg relative overflow-hidden border border-zinc-100 shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900 text-sm">{item.name}</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">{item.subCategory}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-5">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100">
                                        {item.category}
                                    </span>
                            </td>
                            <td className="p-5">
                                <span className="font-medium text-zinc-600 text-sm">{item.price}</span>
                            </td>
                            <td className="p-5">
                                <button className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                    item.status === 'In Stock'
                                        ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                                        : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
                                )}>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        item.status === 'In Stock' ? "bg-green-600" : "bg-zinc-400"
                                    )} />
                                    {item.status}
                                </button>
                            </td>
                            <td className="p-5 text-right">
                                <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                                    <button className="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-600 hover:border-orange-200 hover:text-orange-400 transition-all">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-white border border-zinc-200 rounded-lg text-red-500 hover:border-red-200 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex p-4 border-t items-center justify-between text-sm text-zinc-500 bg-white rounded-2xl border-x border-b border-zinc-100">
                <span>Showing 1-5 of 24 items</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50">Prev</button>
                    <button className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-50">Next</button>
                </div>
            </div>
        </div>
    );
}