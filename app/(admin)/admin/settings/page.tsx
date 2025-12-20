"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, MapPin, Phone, Mail, Loader2, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useAdminStore } from "@/store/useAdminStore";
import LogoutButton from "@/components/admin/dashboard/LogoutButton";

export default function SettingsPage() {
    const { store, isLoading: isStoreLoading, fetchAdminData } = useAdminStore();

    const [isSaving, setIsSaving] = useState(false);

    // Default empty state
    const defaultState = {
        name: "",
        address: "",
        phone: "",
        email: "",
        logo: "",
        coverImage: "",
        acceptingOrders: true,
    };

    // Initialize BOTH with defaultState so isDirty is false initially
    const [originalData, setOriginalData] = useState(defaultState);
    const [formData, setFormData] = useState(defaultState);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // 👇 Sync Data when Store Loads
    useEffect(() => {
        if (store) {
            const mappedData = {
                name: store.name || "",
                address: store.address || "",
                phone: store.phone || "",
                email: store.email || "",
                logo: store.logo || "",
                coverImage: store.coverImage || "",
                acceptingOrders: store.acceptingOrders ?? true,
            };

            // Only update if the backend data is different from what we currently have as "original"
            // This prevents infinite loops but ensures the form populates
            if (JSON.stringify(mappedData) !== JSON.stringify(originalData)) {
                setFormData(mappedData);     // <--- THIS WAS COMMENTED OUT. IT IS REQUIRED.
                setOriginalData(mappedData);
            }
        }
    }, [store]); // We only want to re-run if the global store object changes

    // Check dirty state (Show footer only if form is different from original)
    const isDirty = JSON.stringify(formData) !== JSON.stringify(originalData);

    // Handle Image Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'coverImage') => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsSaving(true);
            const url = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, [field]: url }));
        } catch (error) {
            alert("Image upload failed");
        } finally {
            setIsSaving(false);
        }
    };

    // Save Changes
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update");

            await fetchAdminData();

            // Update originalData to match the new saved data
            // This will make isDirty false and hide the footer
            setOriginalData(formData);
            console.log("Settings saved successfully!");

        } catch (error) {
            console.log("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    if (isStoreLoading && !store) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl pb-32">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
                <p className="text-zinc-500 mt-1">
                    Manage your restaurant profile, branding, and operational preferences.
                </p>
            </div>

            <div className="space-y-8">
                {/* 1. Shop Profile Section */}
                <section className="bg-white p-6 rounded-3xl border border-zinc-100">
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">Shop Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Restaurant Name"
                            icon={StoreIcon}
                            value={formData.name}
                            onChange={(v) => setFormData({ ...formData, name: v })}
                        />
                        <InputField
                            label="Address"
                            icon={MapPin}
                            value={formData.address}
                            onChange={(v) => setFormData({ ...formData, address: v })}
                            placeholder="e.g. 123 Food Street, Dubai"
                        />
                        <InputField
                            label="Contact Phone"
                            icon={Phone}
                            value={formData.phone}
                            onChange={(v) => setFormData({ ...formData, phone: v })}
                            placeholder="+971 50 123 4567"
                        />
                        <InputField
                            label="Support Email"
                            icon={Mail}
                            value={formData.email}
                            onChange={(v) => setFormData({ ...formData, email: v })}
                            placeholder="support@restaurant.com"
                        />
                    </div>
                </section>

                {/* 2. Branding Section */}
                <section className="bg-white p-6 rounded-3xl border border-zinc-100">
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">Branding</h2>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Logo Upload */}
                        <div className="w-full md:w-1/5">
                            <label className="block text-sm font-medium text-zinc-700 mb-2">Logo</label>
                            <div
                                onClick={() => logoInputRef.current?.click()}
                                className="relative flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-zinc-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group overflow-hidden"
                            >
                                {formData.logo ? (
                                    <Image src={formData.logo} alt="Logo" fill className="object-cover" />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-xs text-zinc-400">Click to upload</p>
                                    </>
                                )}
                            </div>
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, 'logo')}
                            />
                        </div>

                        {/* Cover Image Upload */}
                        <div className="w-full flex-1">
                            <label className="block text-sm font-medium text-zinc-700 mb-2">Cover Image</label>
                            <div
                                onClick={() => coverInputRef.current?.click()}
                                className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group bg-zinc-50 overflow-hidden"
                            >
                                {formData.coverImage ? (
                                    <Image src={formData.coverImage} alt="Cover" fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center gap-3 text-zinc-400 group-hover:text-orange-600">
                                        <Upload className="w-6 h-6" />
                                        <span className="text-sm font-medium">Click to upload cover</span>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, 'coverImage')}
                            />
                        </div>
                    </div>
                </section>

                {/* 3. Preferences Section */}
                <section className="bg-white p-6 rounded-3xl border border-zinc-100">
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">Preferences</h2>
                    <div className="relative flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div>
                            <h3 className="font-bold text-zinc-900">Accepting Orders</h3>
                            <p className="text-sm text-zinc-500 mt-1">Turn this off to temporarily pause all incoming orders.</p>
                        </div>
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, acceptingOrders: !prev.acceptingOrders }))}
                            className={cn(
                                "relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20",
                                formData.acceptingOrders ? "bg-orange-500" : "bg-zinc-300"
                            )}
                        >
                             <span className={cn(
                                 "inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm",
                                 formData.acceptingOrders ? "translate-x-7" : "translate-x-1"
                             )} />
                        </button>
                    </div>
                </section>

                <section className={"bg-white p-5 rounded-3xl border border-zinc-100"}>
                    <div className={"w-full flex justify-end items-center font-medium gap-4"}>
                        Logout <LogoutButton/>
                    </div>
                </section>
            </div>

            {/* Sticky Save Footer */}
            {/* Added transition-transform and translate logic to hide/show based on isDirty */}
            <div className={`fixed bottom-0 w-full md:left-64 left-0 right-0 bg-white border-t border-zinc-100 p-4 z-30 transition-transform duration-300 ease-in-out ${isDirty ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="max-w-4xl mx-auto flex items-center justify-between sm:justify-end gap-4">
                    <p className="text-sm text-zinc-500 hidden sm:block mr-auto">You have unsaved changes</p>

                    <button
                        onClick={() => setFormData(originalData)}
                        className="px-6 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
                    >
                        Discard
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20 disabled:opacity-70 flex items-center gap-2 transition-all active:scale-95 min-w-[140px] justify-center"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
}

function InputField({ label, icon: Icon, value, onChange, placeholder }: { label: string, icon: any, value: string, onChange: (v: string) => void, placeholder?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">{label}</label>
            <div className="relative group">
                <Icon className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
                />
            </div>
        </div>
    );
}