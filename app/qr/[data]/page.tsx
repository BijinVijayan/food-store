"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { motion, Variants } from "framer-motion";
import { Pizza, UtensilsCrossed, Coffee } from "lucide-react";

// 1. Animation Variants (Strictly Typed)
const containerVariants: Variants = {
    start: {
        transition: {
            staggerChildren: 0.2,
        },
    },
    end: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const bounceVariants: Variants = {
    start: { y: 0 },
    end: {
        y: -20, // Bounce height
        transition: {
            duration: 0.5,
            repeat: Infinity,      // Loop forever
            repeatType: "reverse", // Up and down
            ease: "easeInOut",
        },
    },
};

interface QRHandlerProps {
    params: {
        data: string;
    };
}

export default function QRHandler({ params }: QRHandlerProps) {
    const router = useRouter();
    const setDiningContext = useAppStore((state) => state.setDiningContext);

    useEffect(() => {
        // Logic: Parse the QR data (e.g., "mainhall-t12")
        if (params.data) {
            // 1. Parse the Table ID and Hall ID
            // You might need to decodeURI if the URL is encoded
            const decodedData = decodeURIComponent(params.data);
            const [hall, table] = decodedData.split("-");

            // 2. Set the global state for the session
            if (hall && table) {
                setDiningContext(table, hall);
            }

            // 3. Simulate a short "Setup" delay so users see the animation
            // (This feels more professional than an instant flicker)
            const timer = setTimeout(() => {
                router.push("/home");
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [params.data, setDiningContext, router]);

    // Shared class for the icons
    const iconClass = "w-10 h-10 text-orange-500 fill-orange-500/20";

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-zinc-50 dark:bg-zinc-950 px-4">
            {/* Animation Container */}
            <motion.div
                className="flex gap-6"
                variants={containerVariants}
                initial="start"
                animate="end"
            >
                <motion.div variants={bounceVariants}>
                    <Pizza className={iconClass} />
                </motion.div>

                <motion.div variants={bounceVariants}>
                    <UtensilsCrossed className={iconClass} />
                </motion.div>

                <motion.div variants={bounceVariants}>
                    <Coffee className={iconClass} />
                </motion.div>
            </motion.div>

            {/* Loading Text */}
            <div className="flex flex-col items-center gap-3 text-center">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Hang tight!
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 animate-pulse">
                    We are setting up your table...
                </p>
            </div>
        </div>
    );
}