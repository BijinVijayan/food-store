import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { Resend } from "resend";

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Valid email is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Generate a random 5-digit OTP
        const otp = Math.floor(10000 + Math.random() * 90000).toString();

        // Set expiry to 10 minutes from now
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Find and update, or create if doesn't exist (upsert)
        await User.findOneAndUpdate(
            { email },
            {
                email,
                otp,
                otpExpires: expiresAt
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // --- SENDING REAL EMAIL VIA RESEND ---
        const { data, error } = await resend.emails.send({
            from: "RestoAdmin <onboarding@resend.dev>",
            to: [email],
            subject: "Your Login Code",
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Welcome to RestoAdmin</h2>
                    <p>Your login verification code is:</p>
                    <h1 style="color: #E51D29; letter-spacing: 2px;">${otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `,
        });

        if (error) {
            console.error("Resend Error:", error);
            return NextResponse.json(
                { error: "Failed to send email" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("Send OTP Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}