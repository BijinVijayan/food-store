"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Category } from "@/app/api/categories/route";

export default function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true); // 1. Add loading state
    const router = useRouter();

    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
                setIsLoading(false);
            });
    }, []);

    const handleSelect = (id: string) => {
        router.push(`/category/${id}`, { scroll: false });
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
                Explore Categories
            </h2>

            <div className="grid grid-cols-4 gap-2 gap-y-4 pb-2">
                {isLoading
                    ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                                {/* Image Placeholder */}
                                <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                {/* Text Placeholder */}
                                <div className="w-14 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                            </div>
                        ))
                    )
                    : (
                        // 4. Actual Data Render
                        categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleSelect(cat.id)}
                                className="flex flex-col items-center gap-2 min-w-[80px] transition-opacity active:opacity-70 group"
                            >
                                <div
                                    className="w-16 h-16 relative rounded-xl overflow-hidden shadow-sm bg-white dark:bg-zinc-800"
                                >
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                </div>
                                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-200">
                                {cat.name}
                            </span>
                            </button>
                        ))
                    )}
            </div>
        </div>
    );
}