"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {ChevronLeft, Minus, Plus, Tag, Trash2} from "lucide-react";
import { useAppStore } from "@/store/useStore";

// 1. Define the type to fix the "any" error
interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    // Add other properties if your store has them (rating, reviews, etc.)
}

export default function CartPage() {
    const router = useRouter();

    // Zustand store hooks
    const cart = useAppStore((state) => state.cart);
    const addToCart = useAppStore((state) => state.addToCart);
    const removeFromCart = useAppStore((state) => state.removeFromCart);

    const [couponCode, setCouponCode] = useState("");

    // 2. Calculate Totals using useMemo for performance
    const { itemTotal, taxes, deliveryFee, grandTotal } = useMemo(() => {
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const tax = total * 0.05; // 5% Tax example
        const delivery = total > 0 ? 20.00 : 0; // Matching screenshot (20.00)

        return {
            itemTotal: total,
            taxes: tax,
            deliveryFee: delivery,
            grandTotal: total + tax + delivery
        };
    }, [cart]);

    // 3. Handlers with strict types
    const handleDecrease = (item: CartItem) => {
        if (item.quantity > 1) {
            // Assuming your store handles negative quantity to subtract
            // You might need to cast 'item' to 'Product' if your store types are strict
            addToCart(item as any, -1);
        } else {
            removeFromCart(item.id);
        }
    };

    const handleIncrease = (item: CartItem) => {
        addToCart(item as any, 1);
    };

    // --- Empty State ---
    if (cart.length === 0) {
        return (
            <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">
                <header className="p-4 flex items-center gap-4  dark:bg-zinc-950 z-10">
                    <button onClick={() => router.back()} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                        <ChevronLeft className="w-6 h-6 text-zinc-800 dark:text-white" />
                    </button>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Your Cart</h1>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
                    <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                        <Trash2 className="w-10 h-10 text-zinc-400" />
                    </div>
                    <h2 className="text-lg font-bold mb-2">Your cart is empty</h2>
                    <p className="text-sm text-zinc-500">Go add some delicious food!</p>
                </div>
            </div>
        );
    }

    return (
        // pb-40 ensures the content isn't hidden behind the fixed checkout button
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-40">

            {/* Header */}
            <header className="sticky top-0 z-20  dark:bg-zinc-950 px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-zinc-900 dark:text-white" />
                </button>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Your Cart</h1>
            </header>

            <div className="p-4 flex flex-col gap-6">
                {/* Cart Items List */}
                <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                        >
                            {/* Image */}
                            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-zinc-900 dark:text-white truncate pr-2">
                                    {item.name}
                                </h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 mb-2">
                                    AED {item.price.toFixed(2)}
                                </p>
                            </div>

                            {/* Quantity Controls (Matches Screenshot) */}
                            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800 rounded-full p-1 border border-zinc-200 dark:border-zinc-700">
                                {/* Decrease Button (Gray) */}
                                <button
                                    onClick={() => handleDecrease(item)}
                                    className="w-8 h-8 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 rounded-full shadow-sm text-zinc-600 dark:text-zinc-200 active:scale-95 transition-transform"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>

                                <span className="text-sm font-bold w-4 text-center text-zinc-900 dark:text-white">
                                  {item.quantity}
                                </span>

                                {/* Increase Button (Orange) */}
                                <button
                                    onClick={() => handleIncrease(item)}
                                    className="w-8 h-8 flex items-center justify-center bg-primary rounded-full shadow-sm text-white active:scale-95 transition-transform"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Offers & Benefits */}
                <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">Offers & Benefits</h2>
                    <div className="flex gap-2 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                        <div className="flex items-center gap-3 flex-1 pl-3">
                            <Tag className="w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="w-full bg-transparent text-sm outline-none text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400"
                            />
                        </div>
                        <button className="bg-primary text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/20">
                            Apply
                        </button>
                    </div>
                </div>

                {/* Bill Details */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Bill Details</h2>

                    <div className="flex flex-col gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                        <div className="flex justify-between">
                            <span>Item Total</span>
                            <span className="text-zinc-900 dark:text-white font-medium">AED {itemTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes & Charges</span>
                            <span className="text-zinc-900 dark:text-white font-medium">AED {taxes.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span className="text-zinc-900 dark:text-white font-medium">AED {deliveryFee.toFixed(2)}</span>
                        </div>

                        {/* Dashed Separator */}
                        <div className="my-2 border-t border-dashed border-zinc-300 dark:border-zinc-700" />

                        <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-white">
                            <span>To Pay</span>
                            <span>AED {grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FIXED BOTTOM CHECKOUT BUTTON */}
            <div className="fixed bottom-20 left-0 w-full  p-4  z-30">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={() => router.push('/checkout')}
                        className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 active:scale-95 transition-transform"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}