import { Suspense } from "react";
import { Search } from "lucide-react";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import Header from "@/components/home/Header";
import CategoryList from "@/components/home/CategoryList";
import ProductList from "@/components/home/ProductList";

export default function Home() {
    return (
        <main className="pb-24 pt-2 px-4">
            {/* 1. Header */}
            <Header />

            {/* 2. Search Bar */}
            <div className="mb-6 relative group">
                <input
                    type="text"
                    placeholder="Search for restaurants or dishes..."
                    className="w-full bg-zinc-100 dark:bg-zinc-800 py-3.5 pl-12 pr-4 rounded-xl text-sm outline-none text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-orange-500/50 transition-all"
                />
                <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-3.5 group-focus-within:text-orange-500 transition-colors" />
            </div>

            {/* 3. Categories */}
            {/* We create a specific Category Skeleton fallback here to match the internal one.
               This prevents layout shift when hydration happens.
            */}
            <Suspense fallback={
                <div className="grid grid-cols-4 gap-4 pb-2 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                            <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                            <div className="w-14 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                        </div>
                    ))}
                </div>
            }>
                <CategoryList />
            </Suspense>

            {/* 4. Title */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Most Selling Items
                </h2>
                <span className="text-xs text-orange-500 font-semibold cursor-pointer">
                  See All
                </span>
            </div>

            {/* 5. Product List */}
            {/* CRITICAL: Use the SAME CardSkeleton here.
               This satisfies Next.js 'useSearchParams' requirement
               AND provides a seamless UI experience.
            */}
            <Suspense fallback={
                <div className="flex flex-col gap-4">
                    <CardSkeleton /><CardSkeleton /><CardSkeleton />
                </div>
            }>
                <ProductList />
            </Suspense>
        </main>
    );
}