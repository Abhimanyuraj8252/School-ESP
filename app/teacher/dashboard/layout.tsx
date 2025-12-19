'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Calendar, CheckSquare, FileText, Home, LogOut, LayoutDashboard, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from 'next/navigation'

export default function TeacherLayout({
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
        { name: 'Home Website', href: '/', icon: Home },
        { name: 'Overview', href: '/teacher/dashboard', icon: LayoutDashboard },
        { name: 'Attendance', href: '/teacher/dashboard/attendance', icon: CheckSquare },
        { name: 'Exam Marks', href: '/teacher/dashboard/exams', icon: FileText },
        { name: 'Homework', href: '/teacher/dashboard/homework', icon: BookOpen },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-100 h-20 flex items-center">
                    <h1 className="text-2xl font-bold font-serif text-primary">Teacher Portal</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
            <main className="flex-1 md:ml-64 min-h-screen">
                {/* Mobile Header */}
                <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
                    <span className="font-bold text-primary text-xl">Teacher Portal</span>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
                            <div className="p-6 border-b border-gray-100 flex items-center">
                                <SheetTitle className="text-2xl font-bold font-serif text-primary">Menu</SheetTitle>
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
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="p-0">
                    {children}
                </div>
            </main>
        </div>
    )
}
