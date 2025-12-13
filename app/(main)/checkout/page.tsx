"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Home,
    Plus,
    ChevronRight,
    CreditCard,
    Wallet,
    Banknote,
    Briefcase // Added Briefcase for the Work icon
} from "lucide-react";
import { useAppStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
    const router = useRouter();

    // 1. Get Cart Data
    const { cart } = useAppStore();

    // 2. Local State
    const [note, setNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [selectedAddress, setSelectedAddress] = useState("addr1"); // Track selected address
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Mock Addresses Data
    const addresses = [
        {
            id: "addr1",
            type: "Home",
            details: "Villa 12, Jumeirah 1, Dubai",
            icon: Home
        },
        {
            id: "addr2",
            type: "Work",
            details: "Office 303, Business Bay, Dubai",
            icon: Briefcase
        }
    ];

    // 3. Simulate Data Fetching
    useEffect(() => {
        if (cart.length === 0) {
            router.replace("/home");
            return;
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [cart, router]);

    // 4. Calculate Totals
    const { itemTotal, taxes, deliveryFee, grandTotal } = useMemo(() => {
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const tax = total * 0.05;
        const delivery = total > 0 ? 20.00 : 0;

        return {
            itemTotal: total,
            taxes: tax,
            deliveryFee: delivery,
            grandTotal: total + tax + delivery
        };
    }, [cart]);

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            router.push("/orders");
        }, 2000);
    };

    if (cart.length === 0) return null;

    return (
        <div className="flex flex-col min-h-screen bg-zinc-100 dark:bg-zinc-950 pb-24">

            {/* Header (Always Visible) */}
            <header className="sticky top-0 z-20 bg-zinc-100 dark:bg-zinc-950 px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-zinc-900 dark:text-white" />
                </button>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Checkout</h1>
            </header>

            <div className="px-4 flex flex-col gap-6">

                {isLoading ? (
                    // --- SKELETON LOADER ---
                    <div className="flex flex-col gap-6 animate-pulse">
                        {/* Address Skeleton */}
                        <div>
                            <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
                            <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl mb-3" />
                            <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
                        </div>

                        {/* Notes Skeleton */}
                        <div>
                            <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
                            <div className="h-14 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
                        </div>

                        {/* Summary Skeleton */}
                        <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />

                        {/* Payment Skeleton */}
                        <div>
                            <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
                            <div className="flex flex-col gap-3">
                                <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
                                <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
                                <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- REAL CONTENT ---
                    <>
                        {/* 1. Delivery Address Section */}
                        <div>
                            <h2 className="font-bold text-zinc-900 dark:text-white mb-3 text-lg">Delivering to</h2>

                            <div className="flex flex-col gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                {addresses.map((addr) => {
                                    const Icon = addr.icon;
                                    const isSelected = selectedAddress === addr.id;

                                    return (
                                        <button
                                            key={addr.id}
                                            onClick={() => setSelectedAddress(addr.id)}
                                            className={cn(
                                                "w-full text-left bg-white dark:bg-zinc-900 p-1 flex items-start gap-4 relative overflow-hidden transition-all",
                                            )}
                                        >
                                            {/* Selection Radio Circle */}
                                            <div className={cn(
                                                "absolute top-4 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                isSelected ? "border-primary" : "border-zinc-300 dark:border-zinc-600"
                                            )}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>

                                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                                <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                            </div>

                                            <div className="pr-8">
                                                <h3 className="font-bold text-zinc-900 dark:text-white">{addr.type}</h3>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 leading-relaxed">
                                                    {addr.details}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <button className="mt-3 w-full bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <Plus className="w-5 h-5 text-zinc-900 dark:text-white" />
                                    <span className="font-medium text-zinc-900 dark:text-white">Add New Address</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                            </button>
                        </div>

                        {/* 2. Delivery Notes */}
                        <div>
                            <h2 className="font-bold text-zinc-900 dark:text-white mb-3 text-lg">Delivery Notes</h2>
                            <input
                                type="text"
                                placeholder="e.g., Avoid ringing the bell"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-primary/50 transition-colors text-zinc-900 dark:text-white placeholder:text-zinc-400"
                            />
                        </div>

                        {/* 3. Order Summary */}
                        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl  border border-zinc-100 dark:border-zinc-800">
                            <h2 className="font-bold text-zinc-900 dark:text-white mb-4 text-lg">Order Summary</h2>
                            <div className="flex flex-col gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                                <div className="flex justify-between">
                                    <span>Item Total ({cart.length} items)</span>
                                    <span className="text-zinc-900 dark:text-white font-medium">AED {itemTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="text-zinc-900 dark:text-white font-medium">AED {deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes & Charges</span>
                                    <span className="text-zinc-900 dark:text-white font-medium">AED {taxes.toFixed(2)}</span>
                                </div>

                                <div className="my-2 border-t border-dashed border-zinc-200 dark:border-zinc-800" />

                                <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-white">
                                    <span>Grand Total</span>
                                    <span>AED {grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* 4. Payment Method */}
                        <div>
                            <h2 className="font-bold text-zinc-900 dark:text-white mb-3 text-lg">Choose Payment Method</h2>
                            <div className="flex flex-col gap-3">
                                <PaymentOption
                                    id="upi"
                                    label="UPI"
                                    icon={Wallet}
                                    selected={paymentMethod}
                                    onSelect={setPaymentMethod}
                                />
                                <PaymentOption
                                    id="card"
                                    label="Credit/Debit Card"
                                    icon={CreditCard}
                                    selected={paymentMethod}
                                    onSelect={setPaymentMethod}
                                />
                                <PaymentOption
                                    id="cod"
                                    label="Cash on Delivery"
                                    icon={Banknote}
                                    selected={paymentMethod}
                                    onSelect={setPaymentMethod}
                                />
                            </div>
                        </div>
                    </>
                )}

            </div>

            {/* Footer Action */}
            {!isLoading && (
                <div className="fixed bottom-24 left-0 w-full bg-transparent dark:bg-zinc-950  p-4 pb-safe z-30">
                    <div className="max-w-md mx-auto">
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing || isLoading}
                            className="w-full bg-primary hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-sm shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? "Processing..." : isLoading ? "Loading..." : "Place Order"}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

// Helper Component for Payment Options
function PaymentOption({
                           id,
                           label,
                           icon: Icon,
                           selected,
                           onSelect
                       }: {
                        id: string,
                        label: string,
                        icon: any,
                        selected: string,
                        onSelect: (id: string) => void
                    }) {
                        const isSelected = selected === id;

    return (
        <button
            onClick={() => onSelect(id)}
            className={cn(
                "w-full p-3 rounded-2xl border flex items-center justify-between transition-all",
                isSelected
                    ? "bg-white dark:bg-zinc-900 border-primary shadow-sm ring-1 ring-primary/20"
                    : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-md flex items-center justify-center",
                    isSelected ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                    "font-medium",
                    isSelected ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400"
                )}>
           {label}
        </span>
            </div>

            <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                isSelected ? "border-primary" : "border-zinc-300 dark:border-zinc-600"
            )}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
        </button>
    );
}