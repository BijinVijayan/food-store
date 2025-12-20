"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ChefHat,
    ArrowRight,
    PlayCircle,
    CheckCircle2,
    ShoppingBag,
    Clock,
    Users,
    TrendingUp,
    Menu,
    Box,
    ClipboardList,
    Monitor
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900 overflow-x-hidden">

            {/* --- 1. NAVBAR --- */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <ChefHat className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">RestoAdmin</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
                        <Link href="#" className="hover:text-primary transition-colors">Features</Link>
                        <Link href="#" className="hover:text-primary transition-colors">How it Works</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Pricing</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-5">
                        <Link href="/login" className="text-sm font-bold text-zinc-600 hover:text-zinc-900">Log in</Link>
                        <Link href="/login" className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all">
                            Get Started
                        </Link>
                    </div>

                    <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Menu className="w-6 h-6 text-zinc-600" />
                    </button>
                </div>
            </nav>

            {/* --- 2. HERO SECTION --- */}
            <section className="pt-16 pb-20 lg:pt-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-8">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">New: AI-Powered Menu Optimization</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
                        Streamline your <br className="hidden md:block" />
                        <span className="text-primary inline-block relative">
                 Restaurant
                 <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                 </svg>
              </span> Operations
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The all-in-one platform to manage orders, kitchen workflows, and inventory. Experience the clean, professional admin panel designed for modern hospitality.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-orange-600 text-white rounded-xl font-bold text-lg shadow-sm shadow-primary/20 transition-all active:scale-95">
                            Start Free Trial
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all">
                            <PlayCircle className="w-5 h-5 text-primary" /> Watch Demo
                        </button>
                    </div>

                    <div className="relative max-w-6xl mx-auto">
                        <div className="absolute -inset-4 bg-primary/10 blur-3xl -z-10 rounded-[3rem]"></div>

                        <div className="relative rounded-[2rem] shadow-xl bg-zinc-900 aspect-[16/9] group">
                            <Image
                                src="/images/chef.jpg"
                                alt="Chef in kitchen"
                                fill={true}
                                className="object-cover opacity-90 rounded-[2rem]"
                            />

                            {/* Floating Card: New Order */}
                            <div className="absolute -bottom-6 left-4 z-10 md:-bottom-10 md:left-10 bg-white p-4 rounded-2xl shadow-md border border-white/50 animate-bounce-slow w-56 text-left">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 font-medium">New Order #420</p>
                                        <p className="text-sm font-bold text-zinc-900">$142.50 • Table 5</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card: Kitchen Load */}
                            <div className="absolute -top-8 right-4 md:-top-10 md:-right-10 bg-white p-4 rounded-2xl shadow-xl border border-white/50 animate-bounce-slow delay-700 w-48 text-left">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-bold text-zinc-500 uppercase">Kitchen Load</p>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Optimal</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-extrabold text-zinc-900">92%</span>
                                    <span className="text-xs text-green-600 mb-1 font-bold">↑ 12%</span>
                                </div>
                                <div className="w-full bg-zinc-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-green-500 h-full w-[92%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 3. TRUSTED BY --- */}
            <section className="py-10 border-y border-zinc-100 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-8">Trusted by 2,000+ Modern Kitchens</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
                        {['SliceJoint', 'uk.GreensCo', 'NoodleBar', 'DailyGrind', 'BurgerBox'].map((name) => (
                            <span key={name} className="text-xl md:text-2xl font-black text-zinc-800 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-zinc-800"></span> {name}
                  </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 4. FEATURES SECTION (Bento Grid) --- */}
            <section className="py-24 bg-[#FAFAFA]" id="features">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold text-xs uppercase tracking-widest">Features</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mt-3 mb-4">Everything your restaurant needs.</h2>
                        <p className="text-zinc-500 max-w-2xl mx-auto">Re-imagine how you run your business with tools built for speed and reliability.</p>
                    </div>

                    {/* BENTO GRID LAYOUT */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:auto-rows-[minmax(0,1fr)]">

                        {/* 1. ORDER MANAGEMENT (Wide Card) */}
                        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-zinc-100 transition-all group flex flex-col md:flex-row gap-8 overflow-hidden">
                            <div className="flex-1">
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                                    <ShoppingBag className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-2">Order Management</h3>
                                <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                                    Centralize every order from UberEats, DoorDash, and your own website. Eliminate tablet chaos and never miss a beat during the rush hour.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
                                        <CheckCircle2 className="w-4 h-4 text-primary" /> Multi-channel sync
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
                                        <CheckCircle2 className="w-4 h-4 text-primary" /> Auto-printing to kitchen
                                    </div>
                                </div>
                            </div>
                            {/* UI Mockup */}
                            <div className="flex-1 bg-zinc-50 rounded-2xl p-4 border border-zinc-100 relative">
                                <div className="space-y-3">
                                    {/* Order Item 1 */}
                                    <div className="bg-white p-3 rounded-xl border border-zinc-100 sm:shadow-sm flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">JD</div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-900">Order #1023</p>
                                                <p className="text-[10px] text-zinc-400">2 mins ago</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-zinc-900">$45.00</span>
                                    </div>
                                    {/* Order Item 2 */}
                                    <div className="bg-white p-3 rounded-xl border border-zinc-100 sm:shadow-sm flex justify-between items-center opacity-70">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">UB</div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-900">UberEats #88</p>
                                                <p className="text-[10px] text-zinc-400">5 mins ago</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-zinc-900">$22.50</span>
                                    </div>
                                    {/* Order Item 3 */}
                                    <div className="bg-white p-3 rounded-xl border border-zinc-100 sm:shadow-sm flex justify-between items-center opacity-40">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">DD</div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-900">DoorDash #12</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-zinc-900">$31.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. INVENTORY (Tall Dark Card) */}
                        <div className="md:row-span-2 bg-[#121212] p-8 rounded-3xl shadow-xl text-white flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all"></div>

                            <div className="mb-auto">
                                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 border border-zinc-700">
                                    <Box className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Inventory</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Automated stock tracking that actually works. We deduct ingredients in real-time as dishes are sold.
                                </p>
                            </div>

                            {/* Dark Mode UI Mockup */}
                            <div className="mt-8 space-y-5">
                                <div className="flex justify-between items-end text-xs mb-1">
                                    <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Stock Levels</span>
                                    <span className="text-primary">Alert</span>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-zinc-300 mb-1.5">
                                        <span>Tomatoes (kg)</span>
                                        <span className="text-white">1.2kg</span>
                                    </div>
                                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full w-[15%]"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-zinc-300 mb-1.5">
                                        <span>Mozzarella (kg)</span>
                                        <span className="text-white">4.5kg</span>
                                    </div>
                                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full w-[65%]"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-zinc-300 mb-1.5">
                                        <span>Olive Oil (L)</span>
                                        <span className="text-white">8L</span>
                                    </div>
                                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-yellow-500 h-full w-[45%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. KDS SYSTEM (Bottom Left) */}
                        <div className="bg-white p-8 rounded-3xl border border-zinc-100 transition-all">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                                <Monitor className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">KDS System</h3>
                            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                                Replace messy printers with brilliant screens. Color-coded timing.
                            </p>

                            {/* KDS Mini Mockup */}
                            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-inner">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] text-zinc-400">12:30 PM</span>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-zinc-800 p-2 rounded border-l-2 border-green-500">
                                        <div className="w-16 h-1.5 bg-zinc-600 rounded mb-1"></div>
                                        <div className="w-24 h-1.5 bg-zinc-700 rounded"></div>
                                    </div>
                                    <div className="bg-zinc-800 p-2 rounded border-l-2 border-yellow-500">
                                        <div className="w-12 h-1.5 bg-zinc-600 rounded mb-1"></div>
                                        <div className="w-20 h-1.5 bg-zinc-700 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. STAFF MANAGEMENT (Bottom Middle) */}
                        <div className="bg-white p-8 rounded-3xl border border-zinc-100 transition-all">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">Staff Management</h3>
                            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                                Schedule shifts, track hours, and manage payroll securely.
                            </p>

                            {/* Staff List Mockup */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-zinc-200 rounded-full"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-zinc-900">John D.</span>
                                            <span className="text-[8px] text-zinc-500">Head Chef</span>
                                        </div>
                                    </div>
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-zinc-200 rounded-full"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-zinc-900">Sarah M.</span>
                                            <span className="text-[8px] text-zinc-500">Server</span>
                                        </div>
                                    </div>
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- 5. ANALYTICS SECTION --- */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 relative w-full">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-3xl rounded-full -z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                                alt="Analytics Dashboard"
                                className="w-full rounded-2xl shadow-xl"
                            />
                            <div className="absolute bottom-6 sm:-bottom-6 left-6 bg-zinc-900 text-white p-4 rounded-xl shadow-lg border border-zinc-800">
                                <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Total Profit</p>
                                <p className="text-xl font-bold text-white">$12,450 <span className="text-green-500 text-sm">▲ 14%</span></p>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-wider mb-6">
                                <TrendingUp className="w-3 h-3" /> Analytics
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6">
                                Data-driven decisions <br/> for your menu.
                            </h2>
                            <p className="text-lg text-zinc-500 mb-8 leading-relaxed">
                                Stop guessing which dishes are profitable. Our analytics engine breaks down food costs, preparation times, and customer popularity.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-zinc-900">Profit Margin Analysis</h4>
                                        <p className="text-sm text-zinc-500 mt-1">See exactly how much you make on every burger, pizza, or taco sold with granular cost tracking.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-zinc-900">Peak Hour Staffing</h4>
                                        <p className="text-sm text-zinc-500 mt-1">AI predictions tell you exactly how many chefs and servers you need based on historical sales data.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 6. CTA FOOTER --- */}
            <section className="py-24 bg-zinc-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Ready to optimize your workflow?
                    </h2>
                    <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of restaurants that are improving operations and boosting profits. Start your 14-day free trial today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="px-8 py-4 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl text-lg transition-all shadow-sm shadow-primary/20 active:scale-95 w-full sm:w-auto">
                            Request Demo
                        </button>
                        <button className="px-8 py-4 bg-transparent border border-zinc-700 text-white hover:bg-zinc-800 font-bold rounded-xl text-lg transition-all w-full sm:w-auto">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* --- 7. FOOTER --- */}
            <footer className="bg-white border-t border-zinc-100 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                            <ChefHat className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-zinc-900">RestoAdmin</span>
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-zinc-500">
                        <Link href="#" className="hover:text-zinc-900">Terms</Link>
                        <Link href="#" className="hover:text-zinc-900">Privacy</Link>
                        <Link href="#" className="hover:text-zinc-900">Contact</Link>
                    </div>
                    <p className="text-sm text-zinc-400">© 2024 RestoAdmin Inc.</p>
                </div>
            </footer>

        </div>
    );
}