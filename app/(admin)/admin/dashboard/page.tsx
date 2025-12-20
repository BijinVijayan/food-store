import { Wallet, FileText, ChefHat, Users } from "lucide-react";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import RecentActivity from "@/components/admin/dashboard/RecentActivity";
import {getCurrentUser} from "@/lib/actions/session";

export default async function DashboardPage() {
    const data = await getCurrentUser();
    const user = data?.user;
    return (
        <div className="space-y-6 md:space-y-8">

            {/* Title Section: Stack on mobile, Row on Desktop */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">Welcome Back, {user?.name}</h1>
                    <p className="text-zinc-500 mt-2 text-sm md:text-base">Here&#39;s what&#39;s happening in your restaurant today.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="hidden md:block bg-white px-4 py-2 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600">
                        {
                            new Date().toLocaleDateString('en-US', {
                                timeZone: 'Asia/Dubai',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })
                        }
                    </div>
                    <button className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 md:py-2 rounded-xl font-bold shadow-sm shadow-orange-500/20 text-sm">
                        + New Order
                    </button>
                </div>
            </div>

            {/* Stats Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatsCard
                    label="Total Revenue"
                    value="AED 12,450"
                    trend="12%"
                    trendUp={true}
                    subtext="vs yesterday"
                    icon={Wallet}
                />
                <StatsCard
                    label="Total Orders"
                    value="86"
                    trend="5%"
                    trendUp={true}
                    subtext="vs yesterday"
                    icon={FileText}
                />
                <StatsCard
                    label="Pending Kitchen"
                    value="12"
                    trend="2%"
                    trendUp={true}
                    subtext="vs last hour"
                    icon={ChefHat}
                />
                <StatsCard
                    label="Total Customers"
                    value="1,240"
                    trend="8%"
                    trendUp={true}
                    subtext="vs yesterday"
                    icon={Users}
                />
            </div>

            {/* Chart & Activity Grid: Stack vertically on mobile/tablet, 2:1 Split on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>
                <div className="lg:col-span-1">
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
}