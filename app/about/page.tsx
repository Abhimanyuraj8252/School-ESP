"use client"

import { motion } from "framer-motion"
import { Users, Award, Target } from "lucide-react"

export default function AboutPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    return (
        <div className="pt-20 min-h-screen">
            {/* Header */}
            <section className="bg-primary/5 py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4"
                    >
                        About Our School
                    </motion.h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg hover:text-gray-800 transition-colors">
                        Building a legacy of excellence and character since 1995.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
                        <div className="lg:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"
                                alt="School Campus"
                                className="rounded-2xl shadow-xl w-full hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                        <div className="lg:w-1/2 space-y-6">
                            <motion.div {...fadeIn}>
                                <h2 className="text-3xl font-serif font-bold text-secondary mb-4">Our Heritage</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    Founded with a vision to provide world-class education rooted in traditional values, School ESP has grown from a humble beginning to a premier institution. We believe in nurturing the unique potential of every child.
                                </p>
                            </motion.div>
                            <div className="grid grid-cols-2 gap-6 mt-8">
                                <div className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                    <div className="text-4xl font-bold text-primary mb-2">25+</div>
                                    <div className="text-sm text-gray-600 font-medium">Years of Excellence</div>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                    <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                                    <div className="text-sm text-gray-600 font-medium">Alumni Network</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                        >
                            <Target className="w-10 h-10 text-secondary mb-4" />
                            <h3 className="text-xl font-bold text-primary mb-3">Our Mission</h3>
                            <p className="text-gray-600">
                                To empower students with knowledge, skills, and values to become responsible global citizens.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                        >
                            <Award className="w-10 h-10 text-secondary mb-4" />
                            <h3 className="text-xl font-bold text-primary mb-3">Our Vision</h3>
                            <p className="text-gray-600">
                                To be a center of excellence known for academic rigor and holistic development.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                        >
                            <Users className="w-10 h-10 text-secondary mb-4" />
                            <h3 className="text-xl font-bold text-primary mb-3">Our Values</h3>
                            <p className="text-gray-600">
                                Integrity, Excellence, Respect, and Empathy form the core of our educational philosophy.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}
