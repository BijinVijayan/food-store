import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-montserrat",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        template: "%s | RestoAdmin",
        default: "RestoAdmin - Restaurant Management System",
    },
    description: "All-in-one dashboard to manage orders, kitchen workflows, and inventory.",
    applicationName: "RestoAdmin",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "RestoAdmin",
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#ffffff",
};


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${montserrat.variable} font-montserrat antialiased bg-zinc-50 text-zinc-900 min-h-screen flex flex-col`}
        >
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}