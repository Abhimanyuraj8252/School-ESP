"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export default function AcademicsPage() {
    const levels = [
        {
            title: "Pre-Primary",
            description: "Foundation years focusing on play-based learning and social skills.",
            features: ["Montessori Method", "Activity Room", "Soft Skills"]
        },
        {
            title: "Primary",
            description: "Building core concepts in numeracy, literacy, and sciences.",
            features: ["Integrated Curriculum", "Project Work", "Creative Arts"]
        },
        {
            title: "Secondary",
            description: "Deepening knowledge and preparing for board examinations.",
            features: ["Specialized Labs", "Career Counseling", "Competitive Prep"]
        }
    ]

    return (
        <div className="pt-20 min-h-screen pb-16">
            {/* Hero */}
            <section className="bg-primary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-6xl font-serif font-bold mb-6"
                    >
                        Academic Excellence
                    </motion.h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                        A curriculum designed to inspire curiosity and foster critical thinking.
                    </p>
                </div>
            </section>

            {/* Levels */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {levels.map((level, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border-t-4 border-secondary"
                            >
                                <h3 className="text-2xl font-bold text-primary mb-3">{level.title}</h3>
                                <p className="text-gray-600 mb-6 min-h-[60px]">{level.description}</p>
                                <ul className="space-y-3">
                                    {level.features.map((feature, i) => (
                                        <li key={i} className="flex items-center text-sm text-gray-700">
                                            <CheckCircle2 className="w-5 h-5 text-secondary mr-2 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Overview */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-serif font-bold text-primary mb-6">Innovative Teaching Methodology</h2>
                            <div className="space-y-6 text-gray-600 leading-relaxed">
                                <p>
                                    Our unique approach combines traditional wisdom with modern technology. We emphasize experiential learning where students learn by doing.
                                </p>
                                <p>
                                    Classrooms are equipped with smart boards, and our digital library provides access to vast resources. Regular assessments ensure that no child is left behind.
                                </p>
                                <Button variant="outline" className="mt-4 border-primary text-primary hover:bg-primary hover:text-white">
                                    Download Curriculum
                                </Button>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
                                alt="Classroom"
                                className="rounded-2xl shadow-lg w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
