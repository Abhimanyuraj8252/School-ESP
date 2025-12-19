"use client"

import { Button } from "@/components/ui/button"
import { motion, Variants } from "framer-motion"
import { ArrowRight, BookOpen, Trophy, Users } from "lucide-react"
import Link from "next/link"

import NoticesPopup from "@/components/NoticesPopup"

export default function Home() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    }

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <NoticesPopup />
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Bundle */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30 z-10" />
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transform scale-105 animate-slow-zoom" />
                </div>

                {/* Hero Content */}
                <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                    <div className="max-w-4xl">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            <motion.div variants={itemVariants} className="inline-block">
                                <span className="bg-secondary/20 text-secondary-light border border-secondary/30 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
                                    Admissions Open 2025–26
                                </span>
                            </motion.div>

                            <motion.h1
                                variants={itemVariants}
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white leading-tight"
                            >
                                Shaping Minds, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light to-secondary">
                                    Defining Futures.
                                </span>
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="text-xl sm:text-2xl text-gray-200 max-w-2xl font-light leading-relaxed"
                            >
                                Experience a world-class education that balances academic rigor with character building, nestled in an environment of innovation.
                            </motion.p>

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-5 pt-4"
                            >
                                <Link href="/admissions">
                                    <Button size="lg" className="h-14 px-8 text-lg bg-secondary hover:bg-secondary-light text-primary font-bold rounded-full shadow-[0_0_20px_rgba(202,138,4,0.3)] hover:shadow-[0_0_30px_rgba(202,138,4,0.5)] transition-all transform hover:-translate-y-1">
                                        Apply for Admission
                                    </Button>
                                </Link>
                                <Link href="/academics">
                                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg text-white border-white/30 hover:bg-white/10 hover:border-white rounded-full transition-all bg-transparent backdrop-blur-sm">
                                        Explore Academics
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 hidden md:block"
                >
                    <div className="flex flex-col items-center gap-2 text-white/50 text-xs tracking-widest uppercase">
                        <span>Scroll</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
                    </div>
                </motion.div>
            </section>

            {/* Quick Stats / Values - Premium Cards */}
            <section className="relative z-30 -mt-20 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: BookOpen, title: "Academic Excellence", desc: "Cambridge & IB Curriculum" },
                            { icon: Users, title: "Expert Pedagogy", desc: "12:1 Student-Teacher Ratio" },
                            { icon: Trophy, title: "Holistic Development", desc: "Sports, Arts & Leadership" }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-slate-800 transition-all duration-500 transform hover:-translate-y-2"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-primary/5 group-hover:bg-primary transition-colors rounded-xl flex items-center justify-center">
                                        <stat.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-6xl font-serif font-black text-gray-100 dark:text-slate-800 -z-10 group-hover:text-gray-50 transition-colors select-none">
                                        0{idx + 1}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{stat.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 font-medium">{stat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About / Vision Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full lg:w-1/2 relative"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" alt="Campus Life" className="w-full h-auto object-cover transform transition hover:scale-105 duration-700" />
                                <div className="absolute inset-0 bg-primary/10 hover:bg-transparent transition-colors duration-500" />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -z-10" />
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full lg:w-1/2 space-y-8"
                        >
                            <div>
                                <h2 className="text-secondary font-bold tracking-widest uppercase mb-2">Our Vision</h2>
                                <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                                    Educating the <br />
                                    <span className="relative inline-block">
                                        Current Generation
                                        <span className="absolute bottom-2 left-0 w-full h-3 bg-secondary/20 -z-10 transform -rotate-1" />
                                    </span>
                                </h3>
                            </div>

                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                Beyond textbooks and examinations, we cultivate an ecosystem where curiosity thrives. School ESP is more than an institution; it's a launchpad for the innovators of tomorrow.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Global Partnerships', 'Innovation Labs', 'Green Campus', 'Leadership Program'].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-secondary" />
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/about">
                                <Button variant="link" className="text-primary text-lg font-bold p-0 mt-4 hover:text-secondary transition-colors group">
                                    Discover Our Philosophy
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}


