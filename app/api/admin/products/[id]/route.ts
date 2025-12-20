import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { getSession } from "@/lib/auth";

type RouteParams = {
    params: Promise<{ id: string }>;
};

// GET Single Product (For Edit Page Pre-fill)
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        await dbConnect();
        const product = await Product.findById(id);

        if (!product) return NextResponse.json({ error: "Not Found" }, { status: 404 });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// PUT: Update Product
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const body = await request.json();

        await dbConnect();

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { ...body },
            { new: true }
        );

        return NextResponse.json({ success: true, product: updatedProduct });

    } catch (error) {
        return NextResponse.json({ error: "Update Failed" }, { status: 500 });
    }
}

// DELETE: Delete Product
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await dbConnect();

        await Product.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Product Deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
    }
}