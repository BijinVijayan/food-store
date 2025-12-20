import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hall from "@/models/Hall";
import { getSession } from "@/lib/auth";
import Table from "@/models/Table";

type RouteParams = {
    params: Promise<{ id: string }>;
};

// GET: Single Hall
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        await dbConnect();
        const hall = await Hall.findById(id);
        if (!hall) return NextResponse.json({ error: "Not Found" }, { status: 404 });
        return NextResponse.json({ success: true, hall });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// PUT: Update Hall
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const body = await request.json();
        const { name, image, isActive } = body;

        await dbConnect();

        const updatedHall = await Hall.findByIdAndUpdate(
            id,
            { name, image, isActive },
            { new: true }
        );

        return NextResponse.json({ success: true, hall: updatedHall, message: "Hall updated" });

    } catch (error) {
        return NextResponse.json({ error: "Update Failed" }, { status: 500 });
    }
}

// DELETE: Remove Hall and its Tables
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await dbConnect();

        // 1. Delete all tables associated with this hall
        await Table.deleteMany({ hallId: id });

        // 2. Delete the hall itself
        const deletedHall = await Hall.findByIdAndDelete(id);

        if (!deletedHall) {
            return NextResponse.json({ error: "Hall not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Hall and associated tables deleted successfully"
        });
    } catch (error) {
        console.error("Delete Hall Error:", error);
        return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
    }
}