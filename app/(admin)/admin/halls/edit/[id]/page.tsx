"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
    Armchair,
    Loader2,
    ArrowRight,
    Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function EditHallPage() {
    const router = useRouter();
    const params = useParams();
    const hallId = params.id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Form State
    const [name, setName] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Image State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null); // Holds URL or Blob
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Fetch Existing Hall Data
    useEffect(() => {
        if (!hallId) return;

        async function fetchHall() {
            try {
                const res = await fetch(`/api/admin/halls/${hallId}`);
                const data = await res.json();

                if (data.success && data.hall) {
                    setName(data.hall.name);
                    setIsActive(data.hall.isActive);
                    if (data.hall.image) {
                        setImagePreview(data.hall.image);
                    }
                } else {
                    // Handle not found
                    alert("Hall not found");
                    router.push("/admin/halls");
                }
            } catch (error) {
                console.error("Failed to load hall", error);
            } finally {
                setIsFetching(false);
            }
        }

        fetchHall();
    }, [hallId, router]);

    // Handle Image Selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle Update
    const handleSubmit = async () => {
        if (!name.trim()) return alert("Please enter a hall name");

        setIsLoading(true);
        try {
            // 1. Handle Image Upload (Only if a new file is selected)
            let imageUrl = imagePreview; // Default to existing URL

            if (imageFile) {
                // If user picked a new file, upload it
                imageUrl = await uploadToCloudinary(imageFile);
            }

            // 2. Call PUT API
            const res = await fetch(`/api/admin/halls/${hallId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    image: imageUrl,
                    isActive
                }),
            });

            if (!res.ok) throw new Error("Failed to update hall");

            router.push("/admin/halls");
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl pb-20">

            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                    <span>Dashboard</span>
                    <span>›</span>
                    <span>Halls</span>
                    <span>›</span>
                    <span className="text-orange-600 font-medium">Edit Hall</span>
                </div>
                <h1 className="text-3xl font-bold text-zinc-900">Edit Hall</h1>
                <p className="text-zinc-500 mt-2 font-light text-lg">
                    Update the details and status of this dining area.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden relative">
                <div className="p-8 md:p-10 space-y-8">

                    {/* Field: Hall Name */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
                            Hall Name
                        </label>
                        <div className="relative group">
                            <Armchair className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Main Dining Room"
                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-zinc-700 placeholder:text-zinc-400 font-medium"
                            />
                        </div>
                    </div>

                    {/* Field: Hall Image */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
                            Hall Image / Icon
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-full h-48 border-2 border-dashed border-zinc-200 rounded-xl hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer flex flex-col items-center justify-center group overflow-hidden bg-zinc-50"
                        >
                            {imagePreview ? (
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={500}
                                    height={500}
                                    className="object-contain h-full w-auto"
                                />
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Upload className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <p className="text-sm text-zinc-500 font-medium">Click to change image</p>
                                    <p className="text-xs text-zinc-400 mt-1">SVG, PNG, JPG supported</p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageSelect}
                            />
                        </div>
                    </div>

                    {/* Field: Open/Closed Status */}
                    <div className="pt-4 border-t border-zinc-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase block mb-1">
                                    Hall Status
                                </label>
                                <p className="text-sm text-zinc-400">
                                    Is this hall currently open for seating?
                                </p>
                            </div>

                            <button
                                onClick={() => setIsActive(!isActive)}
                                className={cn(
                                    "relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent focus:ring-orange-200",
                                    isActive ? "bg-green-500" : "bg-zinc-300"
                                )}
                            >
                                <span className={cn(
                                    "inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md",
                                    isActive ? "translate-x-7" : "translate-x-1"
                                )} />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 flex items-center justify-end gap-4">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 text-zinc-500 font-bold hover:bg-zinc-50 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Update Hall <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}