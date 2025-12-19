"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    const pathname = usePathname()

    // Hide footer on dashboard pages
    if (pathname?.startsWith('/student') ||
        pathname?.startsWith('/teacher') ||
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/office') ||
        pathname?.startsWith('/dashboard')) {
        return null
    }

    return (
        <footer className="bg-primary-dark text-white pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* School Info */}
                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-4 font-serif text-white">School ESP</h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Empowering students to achieve excellence through holistic education and character building.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-secondary transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-secondary transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-secondary transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-secondary">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/admissions" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Admissions
                                </Link>
                            </li>
                            <li>
                                <Link href="/academics" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Academics
                                </Link>
                            </li>
                            <li>
                                <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Gallery
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-secondary">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-sm text-gray-300">
                                <MapPin size={18} className="mt-0.5 shrink-0" />
                                <span>123 Education Lane, Academic City, State 12345</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-gray-300">
                                <Phone size={18} className="shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-gray-300">
                                <Mail size={18} className="shrink-0" />
                                <span>info@schoolesp.edu</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter (Optional) */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-secondary">Stay Updated</h4>
                        <p className="text-gray-300 text-sm mb-4">
                            Subscribe to our newsletter for the latest updates.
                        </p>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-secondary"
                            />
                            <button className="bg-secondary text-primary font-bold py-2 rounded-md hover:bg-secondary-light transition-colors text-sm">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} School ESP. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
