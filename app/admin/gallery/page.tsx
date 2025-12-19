"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

type GalleryItem = {
    id: number
    title: string
    category: string
    image_url: string
    created_at: string
}

const CATEGORIES = ["Campus", "Events", "Sports", "Arts"]

export default function AdminGalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [newItem, setNewItem] = useState({ title: "", category: "Campus" })
    const [file, setFile] = useState<File | null>(null)

    const supabase = createClient()
    const { toast } = useToast()

    useEffect(() => {
        fetchGallery()
    }, [])

    const fetchGallery = async () => {
        try {
            const { data, error } = await supabase
                .from("gallery")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setItems(data || [])
        } catch (error) {
            console.error("Error fetching gallery:", error)
            toast({
                title: "Error",
                description: "Failed to fetch gallery items",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        try {
            setUploading(true)

            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(filePath)

            // 3. Insert into DB
            const { error: dbError } = await supabase.from("gallery").insert([{
                title: newItem.title,
                category: newItem.category,
                image_url: publicUrl
            }])

            if (dbError) throw dbError

            toast({
                title: "Success",
                description: "Image uploaded successfully",
            })
            setIsOpen(false)
            setNewItem({ title: "", category: "Campus" })
            setFile(null)
            fetchGallery()
        } catch (error) {
            console.error("Error uploading image:", error)
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive",
            })
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this image?")) return

        try {
            const { error } = await supabase.from("gallery").delete().eq("id", id)
            if (error) throw error

            toast({
                title: "Success",
                description: "Image deleted",
            })
            setItems(items.filter(item => item.id !== id))
        } catch (error) {
            console.error("Error deleting image:", error)
            toast({
                title: "Error",
                description: "Failed to delete image",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gallery Manager</h1>
                    <p className="text-muted-foreground">Upload and manage photos for the public website.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Upload Photo
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload New Photo</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title / Caption</Label>
                                <Input
                                    id="title"
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    required
                                    placeholder="e.g. Annual Sports Day"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={newItem.category}
                                    onValueChange={(val) => setNewItem({ ...newItem, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file">Photo</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={uploading}>
                                {uploading ? "Uploading..." : "Upload Photo"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">Loading gallery...</div>
                ) : items.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-white rounded-lg border shadow-sm flex flex-col items-center justify-center p-8">
                        <ImageIcon className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="font-semibold text-lg">No photos yet</h3>
                        <p className="max-w-sm mx-auto mt-2">Upload photos to showcase your school's campus, events, and activities.</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 border shadow-sm">
                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <Image
                                src={item.image_url}
                                alt={item.title}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
                                <span className="text-gray-300 text-xs">{item.category}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
