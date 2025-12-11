"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Star, Minus, Plus } from "lucide-react"; // Import Icons
import { Product } from "@/app/api/products/route";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import { useAppStore } from "@/store/useStore";

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "all";

    // 1. Get Cart and Actions from Store
    const cart = useAppStore((state) => state.cart);
    const setViewingProduct = useAppStore((state) => state.setViewingProduct);
    const addToCart = useAppStore((state) => state.addToCart);
    const removeFromCart = useAppStore((state) => state.removeFromCart);

    // 2. Helper Method to check quantity
    const getCartQuantity = (productId: string) => {
        const item = cart.find((i) => i.id === productId);
        return item ? item.quantity : 0;
    };

    // 3. Handlers for the buttons
    const handleIncrease = (e: React.MouseEvent, item: Product) => {
        e.stopPropagation();
        addToCart(item, 1);
    };

    const handleDecrease = (e: React.MouseEvent, item: Product) => {
        e.stopPropagation();
        const qty = getCartQuantity(item.id);
        if (qty > 1) {
            addToCart(item, -1); // Decrease by 1
        } else {
            removeFromCart(item.id); // Remove if 0
        }
    };

    useEffect(() => {
        // setLoading(true);
        fetch(`/api/products?category=${category}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            });
    }, [category]);

    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                {[...Array(5)].map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return <div className="text-center py-10 text-zinc-500">No items found in this category.</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {products.map((item) => {
                // Get the current quantity for this specific item
                const quantity = getCartQuantity(item.id);

                return (
                    <div
                        key={item.id}
                        className="flex gap-4 p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800"
                    >
                        {/* Image Section - CLICKABLE */}
                        <div
                            onClick={() => setViewingProduct(item)}
                            className="relative w-28 h-28 shrink-0 rounded-sm overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer active:scale-95 transition-transform"
                        >
                            <Image
                                src={item.images[0]}
                                alt={item.name}
                                fill
                                sizes="112px"
                                className="object-cover"
                            />
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col flex-1 justify-between py-1">
                            {/* Text Header - CLICKABLE */}
                            <div onClick={() => setViewingProduct(item)} className="cursor-pointer">
                                <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-1">
                                    {item.name}
                                </h3>

                                <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                        {item.rating}
                                    </span>
                                    <span className="text-xs text-zinc-400">
                                        ({item.reviews})
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold text-zinc-900 dark:text-white">
                                    AED {item.price.toFixed(2)}
                                </span>

                                {/* 4. Conditional Rendering: ADD vs Counter */}
                                {quantity === 0 ? (
                                    <button
                                        onClick={(e) => handleIncrease(e, item)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-xs font-bold transition-transform active:scale-95 shadow-lg shadow-orange-500/20"
                                    >
                                        ADD
                                    </button>
                                ) : (
                                    <div className="flex items-center bg-zinc-50 dark:bg-zinc-800 rounded-full p-1 ">
                                        {/* Minus Button */}
                                        <button
                                            onClick={(e) => handleDecrease(e, item)}
                                            className="w-7 h-7 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-full text-zinc-600 dark:text-zinc-200 shadow-sm active:scale-90 transition-transform"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>

                                        {/* Quantity Display */}
                                        <span className="w-8 text-center text-xs font-bold text-zinc-900 dark:text-white">
                                            {quantity}
                                        </span>

                                        {/* Plus Button */}
                                        <button
                                            onClick={(e) => handleIncrease(e, item)}
                                            className="w-7 h-7 flex items-center justify-center bg-orange-500 rounded-full text-white shadow-sm active:scale-90 transition-transform"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}