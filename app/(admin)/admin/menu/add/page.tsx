"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    UploadCloud,
    Save,
    X,
    ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AddProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        mrp: "",
        sellingPrice: "",
        category: "",
        subCategory: "",
        isVeg: true,
        quantity: 1,
        inStock: true
    });

    // Mock Categories
    const categories = ["Pizza", "Burger", "Sushi", "Drinks", "Dessert"];
    const subCategories = ["Classic", "Gourmet", "Vegan", "Spicy"];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // Create a fake URL for preview (In real app, upload to S3/Cloudinary)
            const url = URL.createObjectURL(e.target.files[0]);
            setImages([...images, url]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push("/admin/menu");
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto pb-24 md:pb-10">

            {/* 1. Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Create New Item</h1>
                    <p className="text-sm text-zinc-500">Add a new dish to your menu</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- LEFT COLUMN: MAIN DETAILS --- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Section: Basic Info */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                        <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"/> Basic Details
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Spicy Chicken Supreme Burger"
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe the ingredients and taste..."
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Pricing & Inventory */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                        <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"/> Pricing & Inventory
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">MRP (Regular Price)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-zinc-400 font-medium">AED</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full pl-14 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-100 outline-none"
                                        value={formData.mrp}
                                        onChange={(e) => setFormData({...formData, mrp: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Selling Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-zinc-400 font-medium">AED</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full pl-14 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-100 outline-none font-bold text-zinc-900"
                                        value={formData.sellingPrice}
                                        onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Default Quantity</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-100 outline-none"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                <span className="font-medium text-zinc-700">Stock Status</span>
                                <button
                                    onClick={() => setFormData({...formData, inStock: !formData.inStock})}
                                    className={cn(
                                        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none",
                                        formData.inStock ? "bg-green-500" : "bg-zinc-300"
                                    )}
                                >
                                  <span className={cn(
                                      "inline-block h-5 w-5 transform rounded-full bg-white transition-transform ml-1",
                                      formData.inStock ? "translate-x-5" : "translate-x-0"
                                  )} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- RIGHT COLUMN: MEDIA & CATEGORIZATION --- */}
                <div className="space-y-8">

                    {/* Section: Media */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                        <h2 className="text-lg font-bold text-zinc-900 mb-6">Product Images</h2>

                        {/* Upload Area */}
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-200 rounded-2xl cursor-pointer hover:bg-orange-50 hover:border-orange-200 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-sm text-zinc-500"><span className="font-bold text-primary">Click to upload</span></p>
                                <p className="text-xs text-zinc-400 mt-1">SVG, PNG, JPG (max 5MB)</p>
                            </div>
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>

                        {/* Preview Grid */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {images.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-100 group">
                                        <Image src={img} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 p-1 bg-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section: Organization */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                        <h2 className="text-lg font-bold text-zinc-900 mb-6">Organization</h2>

                        <div className="space-y-5">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 outline-none appearance-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Sub-Category */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Sub-Category</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 outline-none appearance-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
                                        value={formData.subCategory}
                                        onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                                    >
                                        <option value="">Select Sub-Category</option>
                                        {subCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Diet Type (Radio) */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-3">Diet Type</label>
                                <div className="flex gap-4">
                                    <label className={cn(
                                        "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all",
                                        formData.isVeg ? "border-green-500 bg-green-50 text-green-700" : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                                    )}>
                                        <input
                                            type="radio"
                                            name="diet"
                                            className="hidden"
                                            checked={formData.isVeg}
                                            onChange={() => setFormData({...formData, isVeg: true})}
                                        />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <span className="font-bold text-sm">Veg</span>
                                    </label>

                                    <label className={cn(
                                        "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all",
                                        !formData.isVeg ? "border-red-500 bg-red-50 text-red-700" : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                                    )}>
                                        <input
                                            type="radio"
                                            name="diet"
                                            className="hidden"
                                            checked={!formData.isVeg}
                                            onChange={() => setFormData({...formData, isVeg: false})}
                                        />
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-red-600" />
                                        <span className="font-bold text-sm">Non-Veg</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Actions (Fixed on Mobile, Static on Desktop) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-100 md:static md:bg-transparent md:border-t-0 md:p-0 mt-8 z-30 md:z-0">
                <div className="max-w-5xl mx-auto flex items-center justify-end gap-4 text-sm">
                    <button
                        onClick={() => router.back()}
                        className="cursor-pointer px-6 py-3 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="cursor-pointer flex-1 md:flex-none px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 shadow-lg shadow-primary/20 disabled:bg-orange-300 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Saving..." : (
                            <>
                                <Save className="w-5 h-5" /> Save Product
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
}