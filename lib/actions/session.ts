import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { cache } from "react";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Store from "@/models/Store";

export const getCurrentUser = cache(async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return null;

    const session: any = await verifyToken(token);
    if (!session?.userId) return null;

    try {
        await dbConnect();

        // Fetch User
        const user = await User.findById(session.userId).select("-otp -otpExpires");
        if (!user) return null;

        // Fetch Store (if needed)
        let store = null;
        if (user.storeId) {
            store = await Store.findById(user.storeId);
        }

        return {
            user: JSON.parse(JSON.stringify(user)),
            store: JSON.parse(JSON.stringify(store)),
        };
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
});