import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        await dbConnect();

        // 1. Find User
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: new Date() },
        }).select("+otp +otpExpires");

        if (!user) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        // --- DEBUGGING BLOCK ---
        // console.log("--------------------------------");
        // console.log("User Email:", user.email);
        // console.log("Raw StoreID:", user.storeId);
        // console.log("Type of StoreID:", typeof user.storeId);
        // console.log("--------------------------------");
        // -----------------------

        // 2. Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // 3. Generate Token
        const token = await signToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            storeId: user.storeId
        });

        // 4. Strict Check for New User
        // We ensure storeId is falsy OR it's an empty object/string
        const isNewUser = !user.storeId || user.storeId.toString() === "";

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            isNewUser, // Check your terminal to see if this is true/false
        });

        response.cookies.set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (error) {
        console.error("Verify Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}