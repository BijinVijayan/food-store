import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import Product from "@/models/Product"; // Ensure this model exists
import { getSession } from "@/lib/auth";

// GET: Fetch All (for List Page)
export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find().sort({ createdAt: -1 }).lean();

        // Populate counts and subcats
        const data = await Promise.all(categories.map(async (cat: any) => {
            const subCats = await SubCategory.find({ categoryId: cat._id }).lean();
            const totalProducts = await Product.countDocuments({ categoryId: cat._id });

            const subCatsWithCount = await Promise.all(subCats.map(async (sub: any) => {
                const subCount = await Product.countDocuments({ subCategoryId: sub._id });
                return { ...sub, id: sub._id, count: `${subCount} items` };
            }));

            return {
                id: cat._id,
                name: cat.name,
                image: cat.image || "",
                count: `${totalProducts} Products`,
                updated: new Date(cat.updatedAt).toLocaleDateString(),
                subCategories: subCatsWithCount
            };
        }));

        return NextResponse.json({ success: true, categories: data });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// POST: Create New (Your provided code)
export async function POST(request: Request) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { name, image, subCategories } = body;

        if (!name) return NextResponse.json({ error: "Category Name is required" }, { status: 400 });

        await dbConnect();

        const newCategory = await Category.create({ name, image, isAvailable: true });

        let createdSubCats: any[] = [];
        if (subCategories && Array.isArray(subCategories)) {
            const subCatDocs = subCategories.map((sub: { name: string, image: string }) => ({
                name: sub.name,
                image: sub.image || "",
                categoryId: newCategory._id,
                isAvailable: true
            }));
            createdSubCats = await SubCategory.insertMany(subCatDocs);
        }

        return NextResponse.json({
            success: true,
            category: newCategory,
            subCategories: createdSubCats,
            message: "Category created successfully",
        });

    } catch (error) {
        console.error("Create Category Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}