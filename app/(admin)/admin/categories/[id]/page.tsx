"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Upload, Plus, Trash2, Save, Loader2, Layers, ImageIcon, AlertTriangle } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface SubCatItem {
    id: string;      // Real ID for existing, Temp ID for new
    name: string;
    imageFile: File | null;
    preview: string | null;
    isNew: boolean;  // Flag to track if it's new or existing
}

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // State
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Sub-Categories State
    const [subCatInput, setSubCatInput] = useState("");
    const [subCatFile, setSubCatFile] = useState<File | null>(null);
    const [subCatPreview, setSubCatPreview] = useState<string | null>(null);
    const [subCategories, setSubCategories] = useState<SubCatItem[]>([]);

    // Delete Modal State
    const [deleteTarget, setDeleteTarget] = useState<{ id: string, isNew: boolean } | null>(null);
    const [isDeletingSub, setIsDeletingSub] = useState(false);

    const mainFileInputRef = useRef<HTMLInputElement>(null);
    const subCatFileInputRef = useRef<HTMLInputElement>(null);

    // 1. Fetch Data
    useEffect(() => {
        if (!categoryId) return;
        async function fetchCategory() {
            try {
                const res = await fetch(`/api/admin/categories/${categoryId}`);
                const data = await res.json();

                if (data.category) {
                    setName(data.category.name);
                    setImagePreview(data.category.image);

                    // Map existing subcategories
                    const mappedSubs = data.subCategories.map((sub: any) => ({
                        id: sub._id,
                        name: sub.name,
                        imageFile: null,
                        preview: sub.image,
                        isNew: false // Mark as existing
                    }));
                    setSubCategories(mappedSubs);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCategory();
    }, [categoryId]);

    // --- Handlers ---

    const handleMainImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
    };

    const handleSubCatImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setSubCatFile(file); setSubCatPreview(URL.createObjectURL(file)); }
    };

    const addSubCategory = () => {
        if (!subCatInput.trim()) return;
        const newItem: SubCatItem = {
            id: crypto.randomUUID(), // Temp ID
            name: subCatInput.trim(),
            imageFile: subCatFile,
            preview: subCatPreview,
            isNew: true // Mark as new
        };
        setSubCategories([...subCategories, newItem]);

        // Reset inputs
        setSubCatInput("");
        setSubCatFile(null);
        setSubCatPreview(null);
        if(subCatFileInputRef.current) subCatFileInputRef.current.value = "";
    };

    // Open Modal logic
    const confirmRemoveSubCategory = (id: string, isNew: boolean) => {
        setDeleteTarget({ id, isNew });
    };

    // Actual Delete Logic (Executed from Modal)
    const executeRemoveSubCategory = async () => {
        if (!deleteTarget) return;

        const { id, isNew } = deleteTarget;

        if (isNew) {
            // It's local only, just remove from state
            setSubCategories(prev => prev.filter(s => s.id !== id));
            setDeleteTarget(null);
        } else {
            // It's existing in DB. We must delete it from DB.
            setIsDeletingSub(true);
            try {
                // Call the DELETE API
                const res = await fetch(`/api/admin/subcategories/${id}`, {
                    method: "DELETE"
                });

                if (res.ok) {
                    // If successful, remove from UI
                    setSubCategories(prev => prev.filter(s => s.id !== id));
                    setDeleteTarget(null);
                } else {
                    alert("Failed to delete sub-category");
                }
            } catch (error) {
                console.error("Delete error", error);
                alert("Something went wrong");
            } finally {
                setIsDeletingSub(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSubCategory();
        }
    };

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            // 1. Upload Main Image (if changed)
            let mainImageUrl = imagePreview || "";
            if (imageFile) mainImageUrl = await uploadToCloudinary(imageFile);

            // 2. Process SubCats
            const processedSubCats = await Promise.all(
                subCategories.map(async (sub) => {
                    let subImageUrl = sub.preview || "";
                    if (sub.imageFile) subImageUrl = await uploadToCloudinary(sub.imageFile);

                    return {
                        id: sub.isNew ? null : sub.id, // Send ID only if existing
                        name: sub.name,
                        image: subImageUrl
                    };
                })
            );

            // 3. PUT Request
            const res = await fetch(`/api/admin/categories/${categoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    image: mainImageUrl,
                    subCategories: processedSubCats
                }),
            });

            if (!res.ok) throw new Error("Update failed");
            router.push("/admin/categories");
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("Update Failed");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-10 flex h-[90vh] justify-center items-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="max-w-5xl pb-20 relative">
            <div className="mb-8"><h1 className="text-2xl font-bold text-zinc-900">Edit Category</h1></div>

            <div className="space-y-6">
                {/* Main Details */}
                <div className="bg-white p-6 rounded-2xl border border-zinc-100 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Category Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-orange-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Cover Image</label>
                            <div onClick={() => mainFileInputRef.current?.click()} className="flex items-center gap-3 px-4 py-2 rounded-xl border border-zinc-200 border-dashed cursor-pointer hover:bg-zinc-50">
                                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                                    {imagePreview ? <Image src={imagePreview} alt="Preview" fill className="object-cover" /> : <Upload className="w-5 h-5 text-zinc-400" />}
                                </div>
                                <span className="text-sm text-zinc-500">Change image...</span>
                                <input ref={mainFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleMainImageSelect} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub Categories Section */}
                <div className="bg-white p-6 rounded-2xl border border-zinc-100 ">
                    <div className="flex flex-wrap gap-3 mb-6 items-start">
                        <div onClick={() => subCatFileInputRef.current?.click()} className="w-[52px] h-[52px] shrink-0 rounded-xl border border-zinc-200 border-dashed flex items-center justify-center cursor-pointer hover:bg-zinc-50 relative overflow-hidden">
                            {subCatPreview ? <Image src={subCatPreview} alt="Preview" fill className="object-cover" /> : <ImageIcon className="w-5 h-5 text-zinc-400" />}
                            <input ref={subCatFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleSubCatImageSelect} />
                        </div>
                        <input type="text" placeholder="Sub-category name" value={subCatInput} onChange={(e) => setSubCatInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 focus:border-orange-500 outline-none" />
                        <button onClick={addSubCategory} className="max-sm:w-full  px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium"><Plus className="w-5 h-5 mx-auto" /></button>
                    </div>
                    <div className="space-y-3">
                        {subCategories.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
                                <div className="flex items-center flex-wrap gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-200 relative overflow-hidden shrink-0">
                                        {sub.preview ? <Image src={sub.preview} alt={sub.name} fill className="object-cover" /> : <Layers className="w-4 h-4 text-zinc-400 m-auto mt-3" />}
                                    </div>
                                    <span className="font-medium text-zinc-700">
                                        {sub.name}
                                        {sub.isNew && <span className="ml-2 text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">New</span>}
                                    </span>
                                </div>
                                {/* Use the Confirmation Handler */}
                                <button onClick={() => confirmRemoveSubCategory(sub.id, sub.isNew)} className="p-3 bg-white text-zinc-400 transform transition-all hover:text-red-500 rounded-xl hover:bg-red-50">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white border-t border-zinc-100 z-10 flex justify-end gap-3">
                <button onClick={() => router.back()} className="px-6 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50">Cancel</button>
                <button onClick={handleUpdate} disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 flex items-center gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Update Category
                </button>
            </div>

            {/* --- CONFIRMATION MODAL --- */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900">Delete Sub-Category?</h3>
                            <p className="text-sm text-zinc-500 mt-2">
                                {deleteTarget.isNew
                                    ? "This item hasn't been saved yet. Removing it is safe."
                                    : "Are you sure? This will delete the sub-category AND all associated products immediately."
                                }
                                <br />This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex border-t border-zinc-100">
                            <button
                                disabled={isDeletingSub}
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 py-4 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors border-r border-zinc-100"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isDeletingSub}
                                onClick={executeRemoveSubCategory}
                                className="flex-1 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeletingSub ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                                    </>
                                ) : (
                                    "Yes, Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}