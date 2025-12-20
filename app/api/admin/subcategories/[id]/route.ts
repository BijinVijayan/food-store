import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SubCategory from "@/models/SubCategory";
import Product from "@/models/Product";
import { getSession } from "@/lib/auth";

type RouteParams = {
    params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await dbConnect();

        // 1. Delete all Products in this Sub-Category
        await Product.deleteMany({ subCategoryId: id });
        // 2. Delete the Sub-Category itself
        const deletedSub = await SubCategory.findByIdAndDelete(id);

        if (!deletedSub) {
            return NextResponse.json({ error: "Sub-category not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Sub-category and associated products deleted" });
    } catch (error) {
        console.error("Delete SubCat Error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}