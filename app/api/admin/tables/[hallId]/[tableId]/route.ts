import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Table from "@/models/Table";
import { getSession } from "@/lib/auth";

type RouteParams = {
    params: Promise<{ hallId: string; tableId: string }>;
};

// PUT: Update Table (Name, Seats, Status, QR)
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { tableId } = await params;
        const body = await request.json();

        await dbConnect();

        const updatedTable = await Table.findByIdAndUpdate(
            tableId,
            { ...body },
            { new: true }
        );

        if (!updatedTable) return NextResponse.json({ error: "Table not found" }, { status: 404 });

        return NextResponse.json({ success: true, table: updatedTable });
    } catch (error) {
        return NextResponse.json({ error: "Update Failed" }, { status: 500 });
    }
}

// DELETE: Remove Table
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { tableId } = await params;
        await dbConnect();

        const deletedTable = await Table.findByIdAndDelete(tableId);

        if (!deletedTable) return NextResponse.json({ error: "Table not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Table deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
    }
}