import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Store from "@/models/Store";
import { getSession } from "@/lib/auth"; // Your auth helper

// 1. GET: Fetch current store settings
export async function GET() {
    try {
        const session: any = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Find the store owned by the logged-in user
        const store = await Store.findOne({ ownerId: session.userId });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        return NextResponse.json({ store });
    } catch (error) {
        console.error("Settings Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// 2. PUT: Update store settings
export async function PUT(request: Request) {
    try {
        const session: any = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        await dbConnect();

        // Update the store where ownerId matches the current user
        const updatedStore = await Store.findOneAndUpdate(
            { ownerId: session.userId },
            {
                $set: {
                    name: body.name,
                    address: body.address,
                    phone: body.phone,
                    email: body.email,
                    logo: body.logo,
                    coverImage: body.coverImage,
                    acceptingOrders: body.acceptingOrders,
                    // You can add description here if you want it editable in settings too
                    // description: body.description
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedStore) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            store: updatedStore,
            message: "Settings updated successfully"
        });

    } catch (error) {
        console.error("Settings Update Error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}