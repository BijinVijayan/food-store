// lib/cloudinary.ts

export const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    // Send to our OWN server endpoint, not Cloudinary directly
    const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Image upload failed");
    }

    return data.url;
};