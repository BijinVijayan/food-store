"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Search, Minus, Plus } from "lucide-react";
import { useAppStore } from "@/store/useStore";
import { Product } from "@/app/api/products/route";
import FloatingCart from "@/components/cart/FloatingCart";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import { cn } from "@/lib/utils";

// Mock Sub-categories for demo purposes
const SUB_CATEGORIES: Record<string, string[]> = {
    pizza: ["All Pizzas", "Classic", "Gourmet", "Vegetarian"],
    burger: ["All Burgers", "Beef", "Chicken", "Vegan"],
    dessert: ["All Desserts", "Cakes", "Ice Cream"],
    default: ["All Items", "Popular", "New"]
};

export default function CategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categorySlug = params.slug as string;

    const { cart, addToCart, removeFromCart, setViewingProduct } = useAppStore();

    const [activeSub, setActiveSub] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const subCategories = SUB_CATEGORIES[categorySlug] || SUB_CATEGORIES["default"];

    const getQuantity = (id: string) => {
        return cart.find((i) => i.id === id)?.quantity || 0;
    };

    useEffect(() => {
        setLoading(true);
        const subParam = activeSub === 0 ? "all" : subCategories[activeSub].toLowerCase();

        fetch(`/api/products?category=${categorySlug}&subcategory=${subParam}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            });
    }, [categorySlug, activeSub, subCategories]);

    return (
        <div className="flex flex-col min-h-screen bg-zinc-100 dark:bg-zinc-950 pb-32">

            {/* 1. Header */}
            <header className="sticky top-0 z-20 bg-zinc-100 dark:bg-zinc-950 pt-2 pb-0">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-zinc-900 dark:text-white" />
                        </button>
                        <h1 className="text-xl font-bold capitalize text-zinc-900 dark:text-white">
                            {categorySlug}
                        </h1>
                    </div>
                    <Search className="w-6 h-6 text-zinc-900 dark:text-white" />
                </div>

                {/* 2. Sub-Category Filter Chips */}
                <div className="flex overflow-x-auto no-scrollbar px-4 pb-4 gap-3">
                    {subCategories.map((sub, idx) => (
                        <button
                            key={sub}
                            onClick={() => setActiveSub(idx)}
                            className={cn(
                                "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                                activeSub === idx
                                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                            )}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </header>

            {/* 3. Product List */}
            <div className="px-4 flex flex-col gap-4">
                {loading ? (
                    // Skeletons
                    [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
                ) : products.length === 0 ? (
                    // Empty State Check
                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                        <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                            <Search className="w-8 h-8 text-zinc-400" />
                        </div>
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">No items found</p>
                        <p className="text-sm text-zinc-500">Try selecting a different category.</p>
                    </div>
                ) : (
                    products.map((item) => {
                        const qty = getQuantity(item.id);

                        return (
                            <div key={item.id} className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 flex gap-4">
                                {/* Image */}
                                <div
                                    onClick={() => setViewingProduct(item)}
                                    className="relative w-28 h-28 shrink-0 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                                >
                                    <Image
                                        src={item.images[0]}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="112px"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        {/* Veg/Non-Veg Icon */}
                                        <div className="mb-1.5">
                                            {item.isVeg ? (
                                                <div className="border border-green-600 p-[2px] w-4 h-4 flex items-center justify-center rounded-[2px]">
                                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                </div>
                                            ) : (
                                                <div className="border border-red-600 p-[2px] w-4 h-4 flex items-center justify-center rounded-[2px]">
                                                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-red-600"></div>
                                                </div>
                                            )}
                                            <span className="sr-only">{item.isVeg ? "Veg" : "Non-Veg"}</span>
                                        </div>

                                        <h3 className="font-bold text-zinc-900 dark:text-white leading-tight mb-1 cursor-pointer" onClick={() => setViewingProduct(item)}>
                                            {item.name}
                                        </h3>

                                        <div className="text-base font-bold text-zinc-900 dark:text-white">
                                            AED {item.price.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="self-end">
                                        {qty === 0 ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addToCart(item, 1); }}
                                                className="bg-orange-500 text-white text-xs font-bold px-6 py-2 rounded-md shadow-md shadow-orange-500/20 active:scale-95 transition-transform"
                                            >
                                                ADD
                                            </button>
                                        ) : (
                                            <div className="flex items-center bg-orange-500 rounded-md p-1 h-8 shadow-md shadow-orange-500/20">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (qty > 1) {
                                                            addToCart(item, -1);
                                                        } else {
                                                            removeFromCart(item.id);
                                                        }
                                                    }}
                                                    className="w-7 h-full flex items-center justify-center text-white active:scale-90 transition-transform"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-6 text-center text-xs font-bold text-white">
                                                    {qty}
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); addToCart(item, 1); }}
                                                    className="w-7 h-full flex items-center justify-center text-white active:scale-90 transition-transform"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* 4. Floating Cart */}
            <FloatingCart />
        </div>
    );
}