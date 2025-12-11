import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import {Montserrat} from "next/font/google";
import ThemeDebug from "@/components/ThemeDebug";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-montsans",
});

export const metadata: Metadata = {
    title: "Pizza Palace",
    description: "The best food delivered to you.",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Pizza Palace",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={
                `${montserrat.variable} antialiased `
            }
        >
        <Providers>
            {/*<ThemeDebug />*/}
            <div className="flex justify-center min-h-screen w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
                <div className="w-full font-montsans max-w-md min-h-screen shadow-2xl relative overflow-x-hidden">
                    {children}
                </div>
            </div>
        </Providers>
        </body>
        </html>
    );
}
