export default function CardSkeleton() {
    return (
        <div className="flex gap-4 p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 animate-pulse">
            {/* Image Placeholder */}
            <div className="w-28 h-28 shrink-0 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            {/* Details Placeholder Section */}
            <div className="flex flex-col flex-1 justify-between py-1">
                <div className="space-y-3">
                    {/* Title Line */}
                    <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />

                    {/* Rating Line */}
                    <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                </div>
                <div className="flex justify-between items-end">
                    {/* Price */}
                    <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                    {/* Add Button Box */}
                    <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                </div>
            </div>
        </div>
    );
}