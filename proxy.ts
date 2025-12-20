import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const protectedRoutes = ["/admin", "/create-store"];
const publicRoutes = ["/login", "/verify"];

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get("session")?.value;
    const session: any = token ? await verifyToken(token) : null;

    // console.log("sessions",session);

    // 1. LOGGED-IN USERS (Redirect away from public pages)
    if (session) {
        // Check if storeId is present and not the string "undefined"
        const hasStore = session.storeId && session.storeId !== "undefined";

        // A. If on Login or Verify
        if (publicRoutes.some(route => path.startsWith(route))) {
            if (hasStore) {
                return NextResponse.redirect(new URL("/admin/dashboard", request.nextUrl));
            } else {
                return NextResponse.redirect(new URL("/create-store", request.nextUrl));
            }
        }

        // B. If on Create Store BUT already have a store
        if (path.startsWith("/create-store") && hasStore) {
            return NextResponse.redirect(new URL("/admin/dashboard", request.nextUrl));
        }
    }

    // 2. GUESTS (Protect private pages)
    if (!session) {
        if (protectedRoutes.some(route => path.startsWith(route))) {
            return NextResponse.redirect(new URL("/login", request.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};