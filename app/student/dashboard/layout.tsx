'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, CreditCard, FileText, Home, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
    }

    const navItems = [
        { name: 'Home Page', href: '/', icon: Home },
        { name: 'Overview', href: '/student/dashboard', icon: Home },
        { name: 'Exam Results', href: '/student/dashboard/results', icon: FileText },
        { name: "Fees & Payments", href: "/student/dashboard/fees", icon: CreditCard },
        { name: "Homework & Diary", href: "/student/dashboard/diary", icon: BookOpen },
        { name: "Admit Card", href: "/student/dashboard/admit-card", icon: FileText },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold font-serif text-primary">Student Portal</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start text-base font-medium ${isActive
                                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                                    {item.name}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <form action="/auth/signout" method="post">
                        <Button
                            type="submit"
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Log Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
                    <span className="font-bold text-primary font-serif text-lg">Student Portal</span>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
                            <div className="p-6 border-b border-gray-100 flex items-center">
                                <h2 className="text-2xl font-bold font-serif text-primary">Menu</h2>
                            </div>
                            <nav className="flex-1 p-4 space-y-2 mt-4">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <Button
                                                variant="ghost"
                                                className={`w-full justify-start text-base font-medium ${isActive
                                                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                                                {item.name}
                                            </Button>
                                        </Link>
                                    )
                                })}
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <form action="/auth/signout" method="post">
                                        <Button
                                            type="submit"
                                            variant="ghost"
                                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <LogOut className="mr-3 h-5 w-5" />
                                            Log Out
                                        </Button>
                                    </form>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
