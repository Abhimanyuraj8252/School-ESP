"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import {
    BarChart3,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    CheckCircle,
    LayoutDashboard,
    Megaphone,
    Image,
    IdCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()

    const navItems = [
        { name: "Home Website", href: "/", icon: LayoutDashboard },
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Students", href: "/admin/students", icon: Users },
        { name: "Verify Payments", href: "/admin/dashboard/transactions", icon: CheckCircle },
        { name: "Notices (Public)", href: "/admin/notices", icon: Megaphone },
        { name: "Public Gallery", href: "/admin/gallery", icon: Image },
        { name: "ID Cards", href: "/admin/id-cards", icon: IdCard },
        { name: "Reports", href: "/admin/reports", icon: BarChart3 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-primary text-white h-screen fixed left-0 top-0 z-30 hidden md:flex flex-col border-r border-slate-800"
            >
                <div className="p-6 flex items-center justify-between h-20 border-b border-primary-light/30">
                    {isSidebarOpen ? (
                        <span className="text-2xl font-serif font-bold">School ESP</span>
                    ) : (
                        <span className="text-2xl font-bold mx-auto">S</span>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`flex items-center p-3 rounded-lg transition-colors ${isActive
                                    ? "bg-secondary text-primary font-bold"
                                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                                    }`}>
                                    <item.icon className="w-5 h-5 min-w-[20px]" />
                                    {isSidebarOpen && (
                                        <span className="ml-3 truncate">{item.name}</span>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-primary-light/30">
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="w-full flex items-center p-3 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer">
                            <LogOut className="w-5 h-5 min-w-[20px]" />
                            {isSidebarOpen && <span className="ml-3">Logout</span>}
                        </button>
                    </form>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-[280px]" : "md:ml-[80px]"}`}>
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="mr-4 hidden md:flex"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </Button>
                        <div className="relative hidden md:block w-96">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search students, payments..."
                                className="pl-10 bg-slate-50 border-gray-200"
                            />
                        </div>
                        {/* Mobile Menu Button */}
                        <div className="md:hidden mr-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" suppressHydrationWarning>
                                        <Menu className="w-6 h-6 text-gray-600" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-72 bg-primary text-white border-r-slate-800">
                                    <div className="p-6 flex items-center justify-between h-20 border-b border-primary-light/30">
                                        <SheetTitle className="text-2xl font-serif font-bold">School ESP</SheetTitle>
                                    </div>

                                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                        {navItems.map((item) => {
                                            const isActive = pathname === item.href
                                            return (
                                                <Link key={item.href} href={item.href}>
                                                    <div className={`flex items-center p-3 rounded-lg transition-colors ${isActive
                                                        ? "bg-secondary text-primary font-bold"
                                                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                                                        }`}>
                                                        <item.icon className="w-5 h-5 min-w-[20px]" />
                                                        <span className="ml-3 truncate">{item.name}</span>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </nav>

                                    <div className="p-4 border-t border-primary-light/30">
                                        <form action="/auth/signout" method="post">
                                            <button type="submit" className="w-full flex items-center p-3 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer">
                                                <LogOut className="w-5 h-5 min-w-[20px]" />
                                                <span className="ml-3">Logout</span>
                                            </button>
                                        </form>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <div className="md:hidden">
                            <Link href="/" className="font-bold text-primary text-xl">
                                School ESP
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </Button>
                        <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">Admin User</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
