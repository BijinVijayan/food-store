import { MapPin, Bell } from "lucide-react";

export default function Header() {
    return (
        <header className="flex justify-between items-center mb-6 pt-2">
            <div className="flex items-center pl-1">
                {/*<div className={"w-16 h-16"}>*/}
                {/*    <Image*/}
                {/*        src="/images/logo.png"*/}
                {/*        alt="Delicious Pizza"*/}
                {/*        width={256}*/}
                {/*        height={256}*/}
                {/*        className="object-cover rounded-full"*/}
                {/*        priority*/}
                {/*    />*/}
                {/*</div>*/}
                <div className="flex flex-col">
                    <span className="font-bold text-lg text-zinc-900 dark:text-white">Harvest Hearth</span>
                    <div className="flex items-center gap-1 text-orange-500">
                        <MapPin className="w-3 h-3 text-orange-500" />
                        <p className="text-zinc-500 text-xs">24th Street, Al Karama</p>
                    </div>
                </div>
            </div>

            <button className="relative p-2 bg-white dark:bg-zinc-800 rounded-full shadow-sm border border-zinc-100 dark:border-zinc-700">
                <Bell className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
        </header>
    );
}