import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Store from "@/models/Store";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        // 1. Verify User Session
        const session: any = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Extract all fields including phone
        const {
            name,
            slug,
            logo,
            coverImage,
            location,
            ownerName,
            description,
            address,
            phone,
            email
        } = body;

        // Basic validation
        if (!name || !slug) {
            return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
        }

        await dbConnect();

        // 2. Ensure User exists
        const user = await User.findById(session.userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.storeId) {
            return NextResponse.json({ error: "You already have a store" }, { status: 400 });
        }

        // 3. Check Slug Uniqueness
        const existingStore = await Store.findOne({ slug });
        if (existingStore) {
            return NextResponse.json(
                { error: "Store URL is already taken." },
                { status: 400 }
            );
        }

        // 4. Create Store (Linked to session userId)
        const newStore = await Store.create({
            name,
            slug,
            ownerId: user._id,
            logo,
            coverImage,
            location,
            currency: "AED",
            description,
            address,
            phone,
            email,
        });

        // 5. Update User (Link store and set Owner Name)
        user.storeId = newStore._id;
        user.role = "admin";

        if (ownerName) {
            user.name = ownerName;
        }

        await user.save();

        return NextResponse.json({
            success: true,
            storeId: newStore._id,
            message: "Store created successfully",
        });

    } catch (error) {
        console.error("Create Store Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}