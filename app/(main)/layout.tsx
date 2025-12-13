import BottomNav from "@/components/layout/BottomNav";
import ProductModal from "@/components/ProductModal";

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 max-w-md">
            <main className="flex-1 pb-20">
                {children}
            </main>
            <BottomNav />

            {/*modal*/}
            <ProductModal />
        </div>
    );
}