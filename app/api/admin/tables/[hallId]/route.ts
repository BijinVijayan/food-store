import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Table from "@/models/Table";
import { getSession } from "@/lib/auth";

type RouteParams = {
    params: Promise<{ hallId: string }>;
};

// GET: List all tables for a hall
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { hallId } = await params;
        await dbConnect();

        const tables = await Table.find({ hallId }).sort({ createdAt: 1 });

        return NextResponse.json({ success: true, tables });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// POST: Create a new table in a hall
export async function POST(request: Request, { params }: RouteParams) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { hallId } = await params;
        const body = await request.json();
        const { name, seats, qrCodeImage } = body; // Assuming qrCodeImage is sent

        if (!name || !seats || !qrCodeImage) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        const newTable = await Table.create({
            name,
            seats,
            qrCodeImage,
            hallId,
            isOccupied: false
        });

        return NextResponse.json({ success: true, table: newTable });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// PUT: Update a table (status, name, seats)
export async function PUT(request: Request) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { tableId, name, seats, isOccupied } = body;

        if (!tableId) return NextResponse.json({ error: "Table ID required" }, { status: 400 });

        await dbConnect();

        const updatedTable = await Table.findByIdAndUpdate(
            tableId,
            { name, seats, isOccupied },
            { new: true }
        );

        return NextResponse.json({ success: true, table: updatedTable });
    } catch (error) {
        return NextResponse.json({ error: "Update Failed" }, { status: 500 });
    }
}

// DELETE: Delete a table
export async function DELETE(request: Request) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(request.url);
        const tableId = url.searchParams.get("tableId");

        if (!tableId) return NextResponse.json({ error: "Table ID required" }, { status: 400 });

        await dbConnect();

        await Table.findByIdAndDelete(tableId);

        return NextResponse.json({ success: true, message: "Table deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
    }
}