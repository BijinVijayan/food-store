import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="relative h-screen w-full flex flex-col justify-end pb-24 px-4">

            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/pizzas-bg.avif"
                    alt="Delicious Pizza"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>
            <div className="absolute top-10 z-10 w-40 h-40 mx-0 self-center">
                <Image
                    src="/images/logo.png"
                    alt="logo"
                    fill
                    className="object-contain shadow-sm"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-6 items-center text-center">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Craving <span className="text-orange-500">Pizza?</span>
                    </h1>
                    <p className="text-zinc-200 text-sm max-w-[280px] mx-auto">
                        Order your favorite meals instantly. Dine-in or delivery, we've got you covered.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    {/* Primary Action */}
                    <Link
                        href="/login"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-orange-500/25"
                    >
                        Get Started
                    </Link>

                    {/* Secondary Action (Browse as Guest) */}
                    <Link
                        href="/home"
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-semibold py-4 rounded-2xl transition-all active:scale-95"
                    >
                        Browse Menu
                    </Link>
                </div>
            </div>
        </div>
    );
}