"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { Loader2 } from "lucide-react"

type GalleryItem = {
    id: number
    title: string
    category: string
    image_url: string
}

const categories = ["All", "Campus", "Events", "Sports", "Arts"]

export default function GalleryPage() {
    const [filter, setFilter] = useState("All")
    const [images, setImages] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data, error } = await supabase
                    .from("gallery")
                    .select("*")
                    .order("created_at", { ascending: false })

                if (!error && data) {
                    setImages(data)
                }
            } catch (error) {
                console.error("Error fetching gallery:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchGallery()
    }, [])

    const filteredImages = filter === "All"
        ? images
        : images.filter(img => img.category === filter)

    return (
        <div className="pt-20 min-h-screen pb-20">
            <section className="bg-slate-900 text-white py-20 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Campus Life</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Glimpses of our vibrant community, state-of-the-art facilities, and memorable events.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4">
                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={filter === cat ? "default" : "outline"}
                            onClick={() => setFilter(cat)}
                            className={`rounded-full px-6 transition-all ${filter === cat
                                ? "bg-secondary text-primary hover:bg-secondary-light"
                                : "hover:border-secondary hover:text-secondary"
                                }`}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {filteredImages.map((image) => (
                                <motion.div
                                    layout
                                    key={image.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 cursor-pointer"
                                >
                                    <img
                                        src={image.image_url}
                                        alt={image.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="text-center p-4">
                                            <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
                                            <span className="text-secondary text-sm">{image.category}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
