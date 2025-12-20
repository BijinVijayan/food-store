"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Plus, Trash2, Save, Loader2, LayoutGrid, Layers, ImageIcon } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

// Interface for SubCategory Items
interface SubCatItem {
    id: string;
    name: string;
    file: File | null;
    preview: string | null;
}

export default function AddCategoryPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Main Category Form State
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Sub-Categories State
    const [subCatInput, setSubCatInput] = useState("");
    const [subCatFile, setSubCatFile] = useState<File | null>(null);
    const [subCatPreview, setSubCatPreview] = useState<string | null>(null);
    const [subCategories, setSubCategories] = useState<SubCatItem[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const subCatFileInputRef = useRef<HTMLInputElement>(null);

    // Handlers: Main Image
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handlers: Sub-Category Image
    const handleSubCatImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSubCatFile(file);
            setSubCatPreview(URL.createObjectURL(file));
        }
    };

    // Handlers: Add Sub-Category
    const addSubCategory = () => {
        if (!subCatInput.trim()) return;

        const newItem: SubCatItem = {
            id: crypto.randomUUID(), // Unique ID for UI list
            name: subCatInput.trim(),
            file: subCatFile,
            preview: subCatPreview
        };

        setSubCategories([...subCategories, newItem]);

        // Reset Sub-Cat Inputs
        setSubCatInput("");
        setSubCatFile(null);
        setSubCatPreview(null);
        if (subCatFileInputRef.current) subCatFileInputRef.current.value = "";
    };

    const removeSubCategory = (id: string) => {
        setSubCategories(subCategories.filter((item) => item.id !== id));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSubCategory();
        }
    };

    const handleSubmit = async () => {
        if (!name) return alert("Please enter a category name");

        setIsLoading(true);
        try {
            // 1. Upload Main Category Image
            let imageUrl = "";
            if (imageFile) {
                imageUrl = await uploadToCloudinary(imageFile);
            }

            // 2. Upload Sub-Category Images (Parallel)
            const processedSubCategories = await Promise.all(
                subCategories.map(async (sub) => {
                    let subUrl = "";
                    if (sub.file) {
                        subUrl = await uploadToCloudinary(sub.file);
                    }
                    // Return the structure expected by the API
                    return {
                        name: sub.name,
                        image: subUrl
                    };
                })
            );

            // 3. Send to API
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    image: imageUrl,
                    subCategories: processedSubCategories
                }),
            });

            if (!res.ok) throw new Error("Failed to create category");

            router.push("/admin/categories");
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl pb-20">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900">Add Category</h1>
                <p className="text-zinc-500 mt-1">
                    Create a new menu category to organize your dishes. Categories will appear in the main navigation.
                </p>
            </div>

            <div className="space-y-6">

                {/* 1. Basic Details Card */}
                <div className="bg-white p-6 rounded-2xl border border-zinc-100">
                    <div className="flex items-center gap-2 mb-6">
                        <LayoutGrid className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold text-zinc-900">Basic Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-zinc-700">Category Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Starters, Main Course"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-zinc-400"
                            />
                        </div>

                        {/* Icon Upload */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-zinc-700">Category Icon</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-3 px-4 py-2 rounded-xl border border-zinc-200 border-dashed cursor-pointer hover:bg-zinc-50 hover:border-red-300 transition-all group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <Upload className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm text-zinc-500 truncate group-hover:text-zinc-700">
                                        {imageFile ? imageFile.name : "Choose an image file..."}
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageSelect}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Sub-Categories Card */}
                <div className="bg-white p-6 rounded-2xl border border-zinc-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Layers className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold text-zinc-900">Sub-Categories</h2>
                    </div>
                    <p className="text-sm text-zinc-500 mb-6">
                        Add sub-groups to better organize items within this category.
                    </p>

                    {/* Input Area */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start">
                        {/* Sub-Category Image Trigger */}
                        <div
                            onClick={() => subCatFileInputRef.current?.click()}
                            className="w-[52px] h-[52px] shrink-0 rounded-xl border border-zinc-200 border-dashed flex items-center justify-center cursor-pointer hover:bg-zinc-50 hover:border-primary transition-all relative overflow-hidden group bg-zinc-50"
                        >
                            {subCatPreview ? (
                                <Image src={subCatPreview} alt="Preview" fill className="object-cover" />
                            ) : (
                                <ImageIcon className="w-5 h-5 text-zinc-400 group-hover:text-primary" />
                            )}
                            <input
                                ref={subCatFileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleSubCatImageSelect}
                            />
                        </div>

                        {/* Text Input */}
                        <input
                            type="text"
                            placeholder="Enter sub-category name (e.g. Vegetarian)"
                            value={subCatInput}
                            onChange={(e) => setSubCatInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-zinc-400 h-[52px]"
                        />

                        {/* Add Button */}
                        <button
                            onClick={addSubCategory}
                            className="px-6 h-[52px] bg-primary text-center hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shrink-0"
                        >
                            <Plus className="w-5 h-5" />
                            Add
                        </button>
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                        {subCategories.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-zinc-100 rounded-xl">
                                <p className="text-sm text-zinc-400">No sub-categories added yet</p>
                            </div>
                        )}

                        {subCategories.map((sub) => (
                            <div
                                key={sub.id}
                                className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-xl group hover:border-red-200 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-10 h-10 rounded-lg bg-zinc-200 relative overflow-hidden shrink-0 border border-zinc-200">
                                        {sub.preview ? (
                                            <Image src={sub.preview} alt={sub.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-medium text-zinc-700">{sub.name}</span>
                                </div>
                                <button
                                    onClick={() => removeSubCategory(sub.id)}
                                    className="p-2 text-zinc-400 hover:text-primary hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white border-t border-zinc-100 z-10">
                <div className="max-w-4xl mx-auto flex justify-end gap-3">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center gap-2 transition-all active:scale-95"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Category
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
}