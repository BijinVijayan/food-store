import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Store from "@/models/Store";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
    try {
        // 1. Verify Session
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;
        const session: any = token ? await verifyToken(token) : null;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 2. Fetch User & Populated Store
        // .select("-password") removes sensitive fields if you had them
        const user = await User.findById(session.userId).select("-otp -otpExpires");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 3. Fetch Store (if exists)
        let store = null;
        if (user.storeId) {
            store = await Store.findById(user.storeId);
            // console.log("storeeeeeeeeeee", store);
        }

        return NextResponse.json({ user, store });

    } catch (error) {
        console.error("Fetch Me Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}