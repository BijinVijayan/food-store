import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category"; // Required for population
import SubCategory from "@/models/SubCategory"; // Required for population
import { getSession } from "@/lib/auth";

// GET: Fetch All Products
export async function GET() {
    try {
        await dbConnect();

        // Fetch products and populate category names for the UI
        const products = await Product.find()
            .populate("categoryId", "name")
            .populate("subCategoryId", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error("Fetch Products Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// POST: Create Product (Your existing code)
export async function POST(request: Request) {
    try {
        const session: any = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const {
            name, description, mrp, sellingPrice,
            categoryId, subCategoryId,
            images, isVeg, stockQuantity, inStock
        } = body;

        if (!name || !sellingPrice || !categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        const newProduct = await Product.create({
            name,
            description,
            mrp: parseFloat(mrp),
            sellingPrice: parseFloat(sellingPrice),
            images,
            categoryId,
            subCategoryId: subCategoryId || null,
            isVeg,
            stockQuantity: parseInt(stockQuantity),
            inStock,
            isActive: true
        });

        return NextResponse.json({
            success: true,
            product: newProduct,
            message: "Product created successfully",
        });

    } catch (error) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}