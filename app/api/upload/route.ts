import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary auto-configures using the CLOUDINARY_URL environment variable
// No need for manual cloudinary.config() setup if that var is set!

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert the file to a buffer for Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary using a Promise wrapper
        const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "resto-admin", // Optional: organizes images in a folder
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({ url: result.secure_url });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}