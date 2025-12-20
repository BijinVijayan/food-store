"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, UploadCloud, Save, X, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";

// Types
interface SubCategory { id: string; name: string; }
interface Category { id: string; name: string; subCategories: SubCategory[]; }

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    // Data
    const [categories, setCategories] = useState<Category[]>([]);
    const [availableSubCats, setAvailableSubCats] = useState<SubCategory[]>([]);

    // Form
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        mrp: "",
        sellingPrice: "",
        categoryId: "",
        subCategoryId: "",
        isVeg: true,
        stockQuantity: 0,
        inStock: true
    });

    // 1. Fetch Categories & Product Data
    useEffect(() => {
        async function loadData() {
            try {
                // A. Fetch Categories
                const catRes = await fetch("/api/admin/categories");
                const catData = await catRes.json();
                const allCats = catData.categories || [];
                setCategories(allCats);

                // B. Fetch Product Details
                const prodRes = await fetch(`/api/admin/products/${productId}`);
                const prodData = await prodRes.json();

                if (prodData.product) {
                    const p = prodData.product;
                    setFormData({
                        name: p.name,
                        description: p.description || "",
                        mrp: p.mrp,
                        sellingPrice: p.sellingPrice,
                        categoryId: p.categoryId,
                        subCategoryId: p.subCategoryId || "",
                        isVeg: p.isVeg,
                        stockQuantity: p.stockQuantity,
                        inStock: p.inStock
                    });

                    // Set Images
                    setImagePreviews(p.images || []);

                    // Set Available Subcats
                    const selectedCat = allCats.find((c: any) => c.id === p.categoryId);
                    if (selectedCat) {
                        setAvailableSubCats(selectedCat.subCategories);
                    }
                }
            } catch (error) {
                console.error("Load Error", error);
            } finally {
                setIsPageLoading(false);
            }
        }
        if (productId) loadData();
    }, [productId]);

    // Handle Category Change
    const handleCategoryChange = (catId: string) => {
        const selectedCat = categories.find(c => c.id === catId);
        setFormData({ ...formData, categoryId: catId, subCategoryId: "" });
        setAvailableSubCats(selectedCat ? selectedCat.subCategories : []);
    };

    // Handle Image Upload (Local Preview)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImageFiles([...imageFiles, ...files]);
            setImagePreviews([...imagePreviews, ...newPreviews]);
        }
    };

    // Remove Image
    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        // Note: For simplicity, we aren't filtering the File array perfectly here if you mix removing old vs new.
        // In a strictly robust app, keep "existingImages" and "newFiles" separate.
        // Here we just re-upload what's needed or keep existing URLs on save.
    };

    // UPDATE Handler
    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            // 1. Upload NEW images
            const newUploadedUrls = await Promise.all(
                imageFiles.map(async (file) => await uploadToCloudinary(file))
            );

            // 2. Combine with Existing Images (that start with http)
            const existingUrls = imagePreviews.filter(url => url.startsWith("http") || url.startsWith("https"));
            const finalImages = [...existingUrls, ...newUploadedUrls];

            const payload = { ...formData, images: finalImages };

            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Update Failed");

            router.push("/admin/menu");

        } catch (error) {
            alert("Update Failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (isPageLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="max-w-6xl mx-auto pb-24 md:pb-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Edit Product</h1>
                    <p className="text-sm text-zinc-500">Update item details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- LEFT COLUMN --- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                        <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"/> Basic Details
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Product Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                        <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"/> Pricing & Inventory
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">MRP</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-zinc-400 font-medium">AED</span>
                                    <input
                                        type="text"
                                        className="w-full pl-14 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-100 outline-none"
                                        value={formData.mrp}
                                        onChange={(e) => setFormData({...formData, mrp: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Selling Price <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-zinc-400 font-medium">AED</span>
                                    <input
                                        type="text"
                                        className="w-full pl-14 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-100 outline-none font-bold text-zinc-900"
                                        value={formData.sellingPrice}
                                        onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-100 outline-none"
                                    value={formData.stockQuantity}
                                    onChange={(e) => setFormData({...formData, stockQuantity: parseInt(e.target.value) || 0})}
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

                {/* --- RIGHT COLUMN --- */}
                <div className="space-y-8">
                    {/* Media */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                        <h2 className="text-lg font-bold text-zinc-900 mb-6">Product Images</h2>
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-200 rounded-2xl cursor-pointer hover:bg-orange-50 hover:border-orange-200 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-6 h-6 text-primary mb-3" />
                                <p className="text-sm text-zinc-500">Click to upload</p>
                            </div>
                            <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {imagePreviews.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-100 group">
                                        <Image src={img} alt="Preview" fill className="object-cover" />
                                        <button onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Categorization */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                        <h2 className="text-lg font-bold text-zinc-900 mb-6">Organization</h2>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 outline-none appearance-none"
                                        value={formData.categoryId}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">Sub-Category</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 outline-none appearance-none disabled:opacity-50"
                                        value={formData.subCategoryId}
                                        onChange={(e) => setFormData({...formData, subCategoryId: e.target.value})}
                                        disabled={!formData.categoryId || availableSubCats.length === 0}
                                    >
                                        <option value="">Select Sub-Category</option>
                                        {availableSubCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Diet Radio Buttons */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-3">Diet Type</label>
                                <div className="flex gap-4">
                                    <label className={cn("flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer", formData.isVeg ? "border-green-500 bg-green-50 text-green-700" : "border-zinc-200")}>
                                        <input type="radio" className="hidden" checked={formData.isVeg} onChange={() => setFormData({...formData, isVeg: true})} />
                                        <div className="w-3 h-3 rounded-full bg-green-500" /> Veg
                                    </label>
                                    <label className={cn("flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer", !formData.isVeg ? "border-red-500 bg-red-50 text-red-700" : "border-zinc-200")}>
                                        <input type="radio" className="hidden" checked={!formData.isVeg} onChange={() => setFormData({...formData, isVeg: false})} />
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-red-600" /> Non-Veg
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-100 md:static md:bg-transparent md:border-t-0 md:p-0 mt-8 z-30 md:z-0">
                <div className="max-w-5xl mx-auto flex items-center justify-end gap-4 text-sm">
                    <button onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-zinc-200 font-bold hover:bg-zinc-50">Cancel</button>
                    <button onClick={handleUpdate} disabled={isLoading} className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 flex items-center gap-2">
                        {isLoading ?<> <Loader2 className="w-5 h-5 animate-spin" />  Updating </> : <><Save className="w-5 h-5" /> Update Product</>}
                    </button>
                </div>
            </div>
        </div>
    );
}