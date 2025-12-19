"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Debugging logs
    console.log("Navbar Render | Pathname:", pathname)

    // Robust check for dashboard routes
    // Check if path starts with role based routes OR contains 'dashboard'
    const isDashboard = pathname?.startsWith('/student') ||
        pathname?.startsWith('/teacher') ||
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/office') ||
        pathname?.includes('/dashboard')

    if (isDashboard) {
        console.log("Hiding Navbar for dashboard route")
        return null
    }

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Academics", href: "/academics" },
        { name: "Notices", href: "/notices" },
        { name: "Gallery", href: "/gallery" },
        { name: "Admissions", href: "/admissions" },
        { name: "Contact", href: "/contact" },
    ]

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled
                ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-md py-2"
                : "bg-gradient-to-b from-black/50 to-transparent py-4"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                            <span className="text-white font-serif font-bold text-xl">S</span>
                        </div>
                        <span className={`text-2xl font-bold font-serif tracking-wide ${scrolled ? "text-primary" : "text-white drop-shadow-md"}`}>
                            School ESP
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium tracking-wide transition-all hover:text-secondary ${scrolled ? "text-slate-700" : "text-white/90 hover:text-white drop-shadow-sm"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/auth">
                            <Button
                                className={`rounded-full px-6 font-semibold shadow-lg transition-transform hover:scale-105 ${scrolled
                                    ? "bg-primary text-white hover:bg-primary/90"
                                    : "bg-white text-primary hover:bg-secondary hover:text-white"
                                    }`}
                            >
                                Portal Login
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-md transition-colors ${scrolled ? "text-gray-700" : "text-white"
                                }`}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden bg-white/95 backdrop-blur-lg border-b border-gray-200"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <Link href="/auth" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full bg-primary text-white">
                                        Portal Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
