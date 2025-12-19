"use client"

import { Button } from "@/components/ui/button"
import { BarChart, CreditCard, FileText, LayoutDashboard, LogOut, UserPlus, Users, Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function OfficeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const navItems = [
        { name: "Home Website", href: "/", icon: LayoutDashboard },
        { name: "Dashboard", href: "/office/dashboard", icon: LayoutDashboard },
        { name: "Admissions", href: "/office/admissions", icon: UserPlus },
        { name: "Collect Fees", href: "/office/fees", icon: CreditCard },
        { name: "Students 360", href: "/office/students", icon: Users },
        { name: "Admit Cards", href: "/office/admit-cards", icon: FileText },
        { name: "Reports", href: "/office/reports", icon: BarChart },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 z-20">
                <div className="p-6 h-20 flex items-center border-b border-gray-100">
                    <span className="text-2xl font-serif font-bold text-primary">Office Portal</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start mb-1 ${isActive ? "font-medium" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}
                                >
                                    <item.icon className="mr-3 h-4 w-4" />
                                    {item.name}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <form action="/auth/signout" method="post">
                        <Button type="submit" variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                            <LogOut className="mr-3 h-4 w-4" />
                            Logout
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6 text-gray-700" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <div className="p-6 h-20 flex items-center border-b border-gray-100">
                            <SheetTitle className="text-2xl font-serif font-bold text-primary">Office Portal</SheetTitle>
                        </div>
                        <nav className="flex-1 p-4 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            className={`w-full justify-start mb-1 ${isActive ? "font-medium" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}
                                        >
                                            <item.icon className="mr-3 h-4 w-4" />
                                            {item.name}
                                        </Button>
                                    </Link>
                                )
                            })}
                        </nav>
                        <div className="p-4 border-t border-gray-100">
                            <form action="/auth/signout" method="post">
                                <Button type="submit" variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <LogOut className="mr-3 h-4 w-4" />
                                    Logout
                                </Button>
                            </form>
                        </div>
                    </SheetContent>
                </Sheet>

                <span className="text-xl font-bold font-serif text-primary">Office Portal</span>
                <Link href="/auth">
                    <LogOut className="h-5 w-5 text-gray-600" />
                </Link>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 md:ml-64">
                {children}
            </main>
        </div>
    )
}
