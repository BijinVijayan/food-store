"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import QRCode from "qrcode";
import {
    Armchair,
    Loader2,
    ArrowRight,
    QrCode,
    Users,
    ArrowLeft
} from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

// Define Store Interface
interface StoreData {
    _id: string;
    slug: string;
}

export default function AddTablePage() {
    const router = useRouter();
    const params = useParams();
    const hallId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<"loading" | "form" | "creating" | "generating" | "uploading">("loading");

    // Store State
    const [store, setStore] = useState<StoreData | null>(null);

    // Form State
    const [name, setName] = useState("");
    const [seats, setSeats] = useState(2);

    // --- 1. Fetch Store from YOUR /api/admin/me ---
    useEffect(() => {
        async function fetchStore() {
            try {
                // 👇 Call your existing API
                const res = await fetch("/api/admin/me");
                const data = await res.json();

                // 👇 Check if store exists in response
                if (res.ok && data.store) {
                    setStore(data.store);
                    setStep("form");
                } else {
                    alert("Could not load store details. Please try again.");
                    router.back();
                }
            } catch (error) {
                console.error("Failed to fetch store", error);
                alert("Error loading store data");
            }
        }
        fetchStore();
    }, [router]);

    // Helper: Convert Data URL to File
    const dataURLtoFile = (dataurl: string, filename: string) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const handleSubmit = async () => {
        if (!name.trim()) return alert("Please enter a table name");
        if (seats < 1) return alert("Seats must be at least 1");

        if (!store?.slug) return alert("Store data missing. Cannot generate QR.");

        setIsLoading(true);

        try {
            // STEP A: Create Table first to get the unique _id
            setStep("creating");
            const createRes = await fetch(`/api/admin/tables/${hallId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    seats,
                    qrCodeImage: "pending", // Placeholder
                }),
            });

            const createData = await createRes.json();
            if (!createData.success) throw new Error(createData.error || "Failed to create table");

            const tableId = createData.table._id;

            // STEP B: Generate QR Code using Store Slug from /api/admin/me
            setStep("generating");
            const qrContent = `https://food-booking-web.vercel.app/qr/${store.slug}-${hallId}-${tableId}`;

            const qrDataUrl = await QRCode.toDataURL(qrContent, {
                width: 400,
                margin: 2,
                color: { dark: '#000000', light: '#ffffff' }
            });

            // STEP C: Upload QR Image
            setStep("uploading");
            const qrFile = dataURLtoFile(qrDataUrl, `qr-${store.slug}-${name}.png`);
            const qrImageUrl = await uploadToCloudinary(qrFile);

            // STEP D: Update Table with final QR Image URL
            const updateRes = await fetch(`/api/admin/tables/${hallId}/${tableId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    qrCodeImage: qrImageUrl
                }),
            });

            if (!updateRes.ok) throw new Error("Failed to save QR code");

            router.push(`/admin/halls`);
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
            setStep("form");
        } finally {
            setIsLoading(false);
        }
    };

    if (step === "loading") {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;
    }

    return (
        <div className="max-w-3xl pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Add New Table</h1>
                    <p className="text-sm text-zinc-500">Create a table and auto-generate its unique QR code.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden relative">
                <div className="p-8 md:p-10 space-y-8">

                    {/* Field: Table Name */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Table Name / Number</label>
                        <div className="relative group">
                            <Armchair className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. T-01"
                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-orange-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Field: Seats */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Seating Capacity</label>
                        <div className="relative group">
                            <Users className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
                            <input
                                type="number"
                                min="1"
                                value={seats}
                                onChange={(e) => setSeats(parseInt(e.target.value))}
                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-orange-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                            <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-blue-900">QR Generation</h4>
                            <p className="text-xs text-blue-600 mt-1">
                                {/*<strong>Store:</strong> {store?.slug} <br/>*/}
                                {/*This will be encoded in the QR code for redirection.*/}
                                A unique QR code will be created automatically when you save this table. You can print it later for customers to scan.

                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex items-center justify-end gap-4">
                        <button
                            onClick={() => router.back()}
                            disabled={isLoading}
                            className="px-6 py-3 cursor-pointer text-zinc-500 font-bold hover:bg-zinc-50 rounded-xl transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-8 py-3 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[180px] justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {step === 'creating' && 'Creating...'}
                                    {step === 'generating' && 'Generating...'}
                                    {step === 'uploading' && 'Finalizing...'}
                                </>
                            ) : (
                                <>
                                    Save Table
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}