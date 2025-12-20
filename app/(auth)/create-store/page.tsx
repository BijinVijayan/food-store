"use client";

import { useState, Suspense } from "react"; // Import Suspense
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
    ChevronLeft,
    Upload,
    Check,
    MapPin,
    Loader2,
    Store,
    AlertCircle,
    Phone
} from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

// 1. Create a separate component for the form logic that uses useSearchParams
function CreateStoreForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        ownerName: "",
        location: "",
        currency: "AED",
        slug: "",
        description: "",
        address: "",
        phone: ""
    });

    // Image State
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // Handlers
    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!email) {
            setError("Session expired. Please log in again.");
            setIsLoading(false);
            return;
        }

        try {
            // 1. Upload Images to Cloudinary
            let logoUrl = "";
            let coverUrl = "";

            if (logoFile) logoUrl = await uploadToCloudinary(logoFile);
            if (coverFile) coverUrl = await uploadToCloudinary(coverFile);

            // 2. Submit Data to API
            const res = await fetch("/api/stores/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    ownerName: formData.ownerName,
                    slug: formData.slug,
                    location: formData.location,
                    currency: "AED",
                    description: formData.description,
                    address: formData.address,
                    phone: formData.phone ? `+971${formData.phone}` : "",
                    email,
                    logo: logoUrl,
                    coverImage: coverUrl
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create store");
            }

            // 3. Redirect to Dashboard
            router.push("/admin/dashboard");

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="sm:bg-white p-8 sm:p-12 sm:rounded-[2rem] sm:border border-gray-100 relative">

            <h2 className="text-xl font-bold text-gray-900 mb-6">Brand Assets</h2>

            {/* Image Uploads */}
            <div className="relative mb-10 group">
                <div className="relative w-full h-48 sm:h-56 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-orange-50/30 hover:border-orange-200 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                    {coverPreview ? (
                        <Image src={coverPreview} alt="Cover Preview" fill className="object-cover" />
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                            <p className="font-bold text-gray-900">Upload Cover Image</p>
                            <p className="text-xs text-gray-400 mt-1">1200x400 recommended</p>
                        </>
                    )}
                    <input type="file" accept="image/*" onChange={handleCoverSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                <div className="absolute -bottom-6 left-8 sm:left-12 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[6px] border-white shadow-lg bg-white overflow-hidden group/logo cursor-pointer">
                    {logoPreview ? (
                        <Image src={logoPreview} alt="Logo Preview" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <Store className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleLogoSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
            </div>

            {/* Shop Name & Owner Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                <div className="space-y-2">
                    <label htmlFor="shopName" className="text-sm font-bold text-gray-700">Shop Name</label>
                    <input
                        type="text"
                        id="shopName"
                        required
                        placeholder="e.g. The Burger Joint"
                        value={formData.name}
                        onChange={(e) => setFormData({
                            ...formData,
                            name: e.target.value,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                        })}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="ownerName" className="text-sm font-bold text-gray-700">Owner Full Name</label>
                    <input
                        type="text"
                        id="ownerName"
                        required
                        placeholder="e.g. Jane Doe"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 font-medium"
                    />
                </div>
            </div>

            {/* Currency & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Currency</label>
                    <input
                        type="text"
                        value="AED - United Arab Emirates"
                        disabled
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 font-medium text-sm cursor-not-allowed outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">URL Slug</label>
                    <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                        <span className="px-4 py-3.5 bg-gray-50 text-gray-500 border-r border-gray-200 text-xs sm:text-sm font-medium whitespace-nowrap">
                            app.resto.com/
                        </span>
                        <input
                            type="text"
                            readOnly
                            value={formData.slug}
                            placeholder="your-slug"
                            className="flex-1 px-4 py-3.5 outline-none placeholder-gray-400 text-gray-600 font-medium bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Location & Phone Number Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {/* Location */}
                <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-bold text-gray-700">Location / City</label>
                    <div className="relative group">
                        <input
                            type="text"
                            id="location"
                            placeholder="e.g. Dubai"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 font-medium"
                        />
                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                </div>

                {/* Phone Number with Fixed Prefix */}
                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-bold text-gray-700">Phone Number</label>
                    <div className="relative group">
                        {/* Prefix */}
                        <div className="absolute left-4 top-3.5 flex items-center gap-2 pointer-events-none">
                            <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <span className="text-gray-500 font-medium border-r border-gray-300 pr-2">+971</span>
                        </div>

                        <input
                            type="tel"
                            id="phone"
                            placeholder="50 123 4567"
                            value={formData.phone}
                            onChange={(e) => {
                                // Only allow numbers
                                const val = e.target.value.replace(/\D/g, '');
                                setFormData({ ...formData, phone: val });
                            }}
                            className="w-full pl-[5.5rem] pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="mt-6 space-y-2">
                <label htmlFor="address" className="text-sm font-bold text-gray-700">Full Address</label>
                <textarea
                    id="address"
                    rows={2}
                    placeholder="Building Name, Street, Unit No..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 resize-none font-medium"
                />
            </div>

            {/* Description */}
            <div className="mt-6 space-y-2">
                <label htmlFor="description" className="text-sm font-bold text-gray-700">Short Description</label>
                <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe your cuisine and atmosphere..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 resize-none font-medium"
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm animate-in fade-in">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-10">
                <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors px-4 py-2">
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <button type="submit" disabled={isLoading} className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-xl shadow-primary/20 transition-all active:scale-95">
                    {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating...</span></> : <span>Complete Setup</span>}
                </button>
            </div>

        </form>
    );
}

// 2. Main Page Component - Wraps the form in Suspense
export default function CreateStorePage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans flex justify-center py-12 px-0 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full">

                {/* --- Header --- */}
                <div className="text-center mb-10 px-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Restaurant Setup</h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Tell us a little about your venue to get started.
                    </p>
                </div>

                {/* --- Progress Bar --- */}
                <div className="mb-10 max-w-xl max-sm:px-5 mx-auto w-full">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        <span className="text-gray-900">Step 2: Shop Details</span>
                        <span>2 of 3</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: '66%' }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-400 mt-3 px-1">
                        <span className="text-green-600 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Account</span>
                        <span className="text-primary font-bold">Details</span>
                        <span>Dashboard</span>
                    </div>
                </div>

                {/* --- Suspense Boundary Wrapper --- */}
                <Suspense fallback={
                    <div className="flex justify-center items-center h-96">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                }>
                    <CreateStoreForm />
                </Suspense>

                <div className="text-center text-sm text-gray-400 mt-8 font-medium">
                    Need help? <button className="text-primary hover:text-orange-600 hover:underline">Read the setup guide</button> or <button className="text-primary hover:text-orange-600 hover:underline">contact support.</button>
                </div>
            </div>
        </div>
    );
}