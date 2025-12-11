"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Star, Minus, Plus } from "lucide-react"; // Import Minus/Plus
import { useAppStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export default function ProductModal() {
    // 1. Get cart and actions from store
    const { viewingProduct, setViewingProduct, addToCart, removeFromCart, cart } = useAppStore();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!viewingProduct) return null;

    // 2. Helper to get live quantity from store
    const getCartQuantity = () => {
        const item = cart.find((i) => i.id === viewingProduct.id);
        return item ? item.quantity : 0;
    };

    const quantity = getCartQuantity();

    const handleClose = () => {
        setViewingProduct(null);
        setCurrentImageIndex(0);
    };

    // 3. Handlers for direct cart manipulation
    const handleIncrease = () => {
        addToCart(viewingProduct, 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            addToCart(viewingProduct, -1);
        } else {
            removeFromCart(viewingProduct.id);
        }
    };

    return (
        <AnimatePresence>
            {viewingProduct && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 w-full h-[80vh] md:h-[75vh] bg-white dark:bg-zinc-950 z-[70] rounded-t-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* --- TOP: Image Carousel --- */}
                        <div className="relative h-[45%] w-full bg-zinc-100 dark:bg-zinc-900">
                            <button
                                onClick={handleClose}
                                className="absolute top-6 right-6 z-10 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div
                                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
                                onScroll={(e) => {
                                    const scrollLeft = e.currentTarget.scrollLeft;
                                    const width = e.currentTarget.offsetWidth;
                                    setCurrentImageIndex(Math.round(scrollLeft / width));
                                }}
                            >
                                {viewingProduct.images.map((src, idx) => (
                                    <div key={idx} className="min-w-full h-full relative snap-center">
                                        <Image
                                            src={src}
                                            alt={viewingProduct.name}
                                            fill
                                            sizes="100vw"
                                            className="object-cover"
                                            priority={idx === 0}
                                        />
                                    </div>
                                ))}
                            </div>

                            {viewingProduct.images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {viewingProduct.images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all",
                                                idx === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* --- BOTTOM: Content --- */}
                        <div className="flex-1 flex flex-col p-6 px-5 overflow-y-auto">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight mb-1">
                                        {viewingProduct.name}
                                    </h2>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-primary text-primary" />
                                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                            {viewingProduct.rating}
                                        </span>
                                        <span className="text-sm text-zinc-400">
                                            ({viewingProduct.reviews} ratings)
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-primary text-nowrap">
                                    AED {viewingProduct.price}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                                    {viewingProduct.description}
                                </p>
                            </div>
                            <div className="flex-1" />
                        </div>

                        {/* --- FOOTER: Actions --- */}
                        <div className="p-4 ">
                            <div className="flex gap-3 items-center">
                                {/* Wishlist */}
                                <button className="h-[56px] w-[56px] flex items-center justify-center rounded-xl border-2 border-primary dark:border-primary text-primary bg-white dark:bg-zinc-900 transition-colors">
                                    <Heart className="w-6 h-6 fill-current" />
                                </button>

                                {/* Dynamic Button Section */}
                                {quantity === 0 ? (
                                    // STATE A: ADD TO CART
                                    <button
                                        onClick={handleIncrease}
                                        className="flex-1 h-[56px] bg-primary hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        <span>Add to Cart</span>
                                    </button>
                                ) : (
                                    // STATE B: QUANTITY CONTROLLER
                                    <div className="flex-1 h-[56px] flex items-center justify-between bg-zinc-100 dark:bg-zinc-900 rounded-xl px-2">
                                        <button
                                            onClick={handleDecrease}
                                            className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-full shadow-sm text-zinc-600 dark:text-zinc-200 active:scale-90 transition-transform"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>

                                        <span className="text-xl font-bold text-zinc-900 dark:text-white">
                                            {quantity}
                                        </span>

                                        <button
                                            onClick={handleIncrease}
                                            className="w-11 h-11 flex items-center justify-center bg-primary rounded-full shadow-sm text-white active:scale-90 transition-transform"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}