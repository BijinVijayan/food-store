import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hall from "@/models/Hall";
import Store from "@/models/Store";
import { getSession } from "@/lib/auth";

// GET: List all Halls for the user's store
export async function GET() {
    try {
        const session: any = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Find store to get ID
        const store = await Store.findOne({ ownerId: session.userId });
        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        const halls = await Hall.find({ storeId: store._id }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, halls });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// POST: Create a new Hall
export async function POST(request: Request) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { name, image, isActive } = body;

        if (!name) return NextResponse.json({ error: "Hall Name is required" }, { status: 400 });

        await dbConnect();

        const store = await Store.findOne({ ownerId: session.userId });
        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        const newHall = await Hall.create({
            name,
            image,
            isActive: isActive ?? true,
            storeId: store._id
        });

        return NextResponse.json({
            success: true,
            hall: newHall,
            message: "Hall created successfully"
        });

    } catch (error) {
        console.error("Create Hall Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}