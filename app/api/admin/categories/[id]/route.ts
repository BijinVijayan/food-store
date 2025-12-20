import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import { getSession } from "@/lib/auth";
import Product from "@/models/Product";

// Define the type for route params in Next.js 15
type RouteParams = {
    params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        await dbConnect();
        const category = await Category.findById(id);
        if (!category) return NextResponse.json({ error: "Not Found" }, { status: 404 });

        const subCategories = await SubCategory.find({ categoryId: id });
        return NextResponse.json({ category, subCategories });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// PUT Update
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const body = await request.json();
        const { name, image, subCategories } = body;

        await dbConnect();

        // 1. Update Parent Category
        await Category.findByIdAndUpdate(id, { name, image });

        // 2. Sync Sub-Categories (Smart Upsert)
        if (subCategories && Array.isArray(subCategories)) {
            for (const sub of subCategories) {
                if (sub.id) {
                    // CASE A: Existing SubCategory -> Update it
                    await SubCategory.findByIdAndUpdate(sub.id, {
                        name: sub.name,
                        image: sub.image
                    });
                } else {
                    // CASE B: New SubCategory -> Create it
                    await SubCategory.create({
                        name: sub.name,
                        image: sub.image || "",
                        categoryId: id,
                        isAvailable: true
                    });
                }
            }
        }

        return NextResponse.json({ success: true, message: "Category updated" });
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
// DELETE Category
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Await params for Next.js 15
        const { id } = await params;

        await dbConnect();

        // 1. Delete all Products belonging to this Category
        // This prevents "orphaned" products that have no category
        await Product.deleteMany({ categoryId: id });
        // 2. Delete all Sub-Categories belonging to this Category
        await SubCategory.deleteMany({ categoryId: id });
        // 3. Finally, Delete the Parent Category itself
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Category and all associated data deleted successfully"
        });

    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}