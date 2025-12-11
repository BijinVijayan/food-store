"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { Product } from "@/app/api/products/route";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import { useAppStore } from "@/store/useStore";

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "all";

    const addToCart = useAppStore((state) => state.addToCart);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        fetch(`/api/products?category=${category}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            });
    }, [category]);

    // 1. Show multiple skeletons while loading
    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                {/* Create an array of 5 items to map over */}
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
            {products.map((item) => (
                <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                >
                    {/* Image Section */}
                    <div className="relative w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col flex-1 justify-between py-1">
                        <div>
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

                            <button
                                onClick={() => addToCart({ ...item, quantity: 1 })}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-md text-xs font-bold transition-transform active:scale-95 shadow-lg shadow-orange-500/20"
                            >
                                ADD
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}