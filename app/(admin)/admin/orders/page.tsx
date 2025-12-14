"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Filter,
    Plus,
    Clock,
    ChefHat,
    CheckCircle2,
    DollarSign,
    MapPin,
    ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const ORDERS = [
    {
        id: "#1023",
        location: "Table 5",
        type: "dine-in",
        customer: { name: "John Doe", img: "/images/avatars/john.jpg" },
        items: "2x Burger, 1x Fries",
        total: "85 AED",
        time: "15m ago",
        status: "Cooking"
    },
    {
        id: "#1024",
        location: "Delivery",
        type: "delivery",
        customer: { name: "Jane Smith", img: "/images/avatars/jane.jpg" },
        items: "1x Pizza, 2x Coke",
        total: "65 AED",
        time: "5m ago",
        status: "Pending"
    },
    {
        id: "#1025",
        location: "Table 2",
        type: "dine-in",
        customer: { name: "Mike Ross", img: "/images/avatars/mike.jpg" },
        items: "3x Steak, 1x Wine",
        total: "450 AED",
        time: "22m ago",
        status: "Ready"
    },
    {
        id: "#1026",
        location: "Pickup",
        type: "pickup",
        customer: { name: "Sarah C.", img: "/images/avatars/sarah.jpg" },
        items: "1x Salad, 1x Water",
        total: "35 AED",
        time: "30m ago",
        status: "Ready"
    },
    {
        id: "#1027",
        location: "Table 8",
        type: "dine-in",
        customer: { name: "Bruce W.", img: "/images/avatars/bruce.jpg" },
        items: "1x Lobster, 1x Champagne",
        total: "320 AED",
        time: "2m ago",
        status: "Pending"
    },
];

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState("active");

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">

            {/* 1. Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Orders Management</h1>
                    <p className="text-zinc-500 text-sm">Track and manage your restaurant&#39;s incoming orders.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2 text-sm cursor-pointer bg-white border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 flex items-center gap-2 transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="px-5 py-2 text-sm cursor-pointer bg-primary hover:bg-orange-600 text-white rounded-xl font-semibold shadow-sm shadow-primary/20 flex items-center gap-2 transition-transform active:scale-95">
                        <Plus className="w-4 h-4" /> New Order
                    </button>
                </div>
            </div>

            {/* 2. Tabs */}
            <div className="border-b border-zinc-200 flex gap-8">
                <button
                    onClick={() => setActiveTab("active")}
                    className={cn(
                        "pb-3 text-sm font-bold border-b-2 transition-colors",
                        activeTab === "active" ? "border-primary text-orange-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
                    )}
                >
                    Active Orders
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={cn(
                        "pb-3 text-sm font-bold border-b-2 transition-colors",
                        activeTab === "history" ? "border-primary text-orange-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
                    )}
                >
                    Completed History
                </button>
            </div>

            {/* 3. Stats Row (Scrollable on Mobile) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Pending" value="12" icon={Clock} color="text-yellow-600" bg="bg-yellow-50" />
                <StatCard label="Cooking" value="8" icon={ChefHat} color="text-orange-600" bg="bg-orange-50" />
                <StatCard label="Ready" value="4" icon={CheckCircle2} color="text-green-600" bg="bg-green-50" />
                <StatCard label="Total Revenue" value="2,450 AED" icon={DollarSign} color="text-blue-600" bg="bg-blue-50" />
            </div>

            {/* 4. Orders List */}
            <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-zinc-100 text-xs uppercase text-zinc-500 font-semibold tracking-wider">
                        <tr>
                            <th className="p-5 text-nowrap">Order ID</th>
                            <th className="p-5">Location</th>
                            <th className="p-5">Customer</th>
                            <th className="p-5">Items Summary</th>
                            <th className="p-5">Total</th>
                            <th className="p-5">Timer</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right pr-8">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                        {ORDERS.map((order) => (
                            <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                                <td className="p-5 font-semibold text-zinc-900">{order.id}</td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2 text-zinc-600">
                                        {order.type === 'delivery' ? <MapPin className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                                        <span className="text-sm font-medium">{order.location}</span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        {/*<div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden">*/}
                                        {/*    /!* Placeholder Avatar *!/*/}
                                        {/*    /!* <Image src={order.customer.img} width={32} height={32} alt={order.customer.name} /> *!/*/}
                                        {/*</div>*/}
                                        <div className="text-sm">
                                            <p className="font-semibold text-zinc-900">{order.customer.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5 text-sm text-zinc-600 max-w-[200px] truncate">{order.items}</td>
                                <td className="p-5 font-semibold text-nowrap text-sm text-zinc-900">{order.total}</td>
                                <td className="p-5">
                               <span className="px-3 py-1.5 bg-orange-100 text-nowrap text-primary rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                                  <Clock className="w-3 h-3" /> {order.time}
                               </span>
                                </td>
                                <td className="p-5"><StatusBadge status={order.status} /></td>
                                <td className="p-5 text-right">
                                    <div className="flex justify-end gap-2 items-center">
                                        <button className="cursor-pointer text-xs font-bold text-zinc-500 hover:text-primary">View Details</button>
                                        <button className="bg-primary cursor-pointer hover:bg-orange-400 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                                            Update Status
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden flex flex-col divide-y divide-zinc-100">
                    {ORDERS.map((order) => (
                        <div key={order.id} className="p-4 bg-white flex flex-col gap-4">
                            {/* Top Row: ID, Timer, Status */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="font-bold text-lg text-zinc-900">{order.id}</span>
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                                        <MapPin className="w-3 h-3" />
                                        {order.location}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StatusBadge status={order.status} />
                                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                           {order.time}
                        </span>
                                </div>
                            </div>

                            {/* Middle: Items & Customer */}
                            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                                <p className="font-medium text-zinc-800 text-sm mb-2">{order.items}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-zinc-300" />
                                        <span className="text-xs font-medium text-zinc-600">{order.customer.name}</span>
                                    </div>
                                    <span className="font-bold text-zinc-900">{order.total}</span>
                                </div>
                            </div>

                            {/* Bottom: Actions */}
                            <div className="flex gap-3">
                                <button className="flex-1 py-2.5 border border-zinc-200 text-zinc-600 font-bold text-sm rounded-xl hover:bg-zinc-50">
                                    View Details
                                </button>
                                <button className="flex-1 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-orange-600 shadow-lg shadow-primary/20">
                                    Update Status
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
                    <span>Showing 1-5 of 24 orders</span>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-50">‹</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-md shadow-primary/20">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50">3</button>
                        <span className="mx-1">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50">10</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50">›</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- Helper Components ---

function StatCard({ label, value, icon: Icon, color, bg }: { label: string, value: string, icon: any, color: string, bg: string }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-zinc-100 flex items-start justify-between min-w-[140px]">
            <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-lg font-extrabold text-zinc-900">{value}</h3>
            </div>
            <div className={cn("p-2 rounded-lg", bg, color)}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Cooking: "bg-yellow-100 text-yellow-700 border-yellow-200",
        Pending: "bg-zinc-100 text-zinc-600 border-zinc-200",
        Ready: "bg-green-100 text-green-700 border-green-200",
    };

    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold border flex items-center justify-center w-fit",
            styles[status] || styles.Pending
        )}>
         {status}
      </span>
    );
}