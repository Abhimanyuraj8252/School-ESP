"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Megaphone, Globe, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Notice = {
    id: number
    title: string
    content: string
    is_public: boolean
    created_at: string
}

export default function NoticesPage() {
    const [notices, setNotices] = useState<Notice[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [newNotice, setNewNotice] = useState({ title: "", content: "", is_public: false })
    const supabase = createClient()
    const { toast } = useToast()

    useEffect(() => {
        fetchNotices()
    }, [])

    const fetchNotices = async () => {
        try {
            const { data, error } = await supabase
                .from("notices")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setNotices(data || [])
        } catch (error) {
            console.error("Error fetching notices:", error)
            toast({
                title: "Error",
                description: "Failed to fetch notices",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { error } = await supabase.from("notices").insert([newNotice])
            if (error) throw error

            toast({
                title: "Success",
                description: "Notice created successfully",
            })
            setIsOpen(false)
            setNewNotice({ title: "", content: "", is_public: false })
            fetchNotices()
        } catch (error) {
            console.error("Error adding notice:", error)
            toast({
                title: "Error",
                description: "Failed to create notice",
                variant: "destructive",
            })
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this notice?")) return

        try {
            const { error } = await supabase.from("notices").delete().eq("id", id)
            if (error) throw error

            toast({
                title: "Success",
                description: "Notice deleted",
            })
            setNotices(notices.filter(n => n.id !== id))
        } catch (error) {
            console.error("Error deleting notice:", error)
            toast({
                title: "Error",
                description: "Failed to delete notice",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Digital Notice Board</h1>
                    <p className="text-muted-foreground">Manage announcements for students and the public website.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Notice
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Notice</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={newNotice.title}
                                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    value={newNotice.content}
                                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="public"
                                    checked={newNotice.is_public}
                                    onCheckedChange={(checked) => setNewNotice({ ...newNotice, is_public: checked })}
                                />
                                <Label htmlFor="public">Make Public (Visible on Website Homepage)</Label>
                            </div>
                            <Button type="submit" className="w-full">Post Notice</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading notices...</TableCell>
                            </TableRow>
                        ) : notices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No notices found. Add one to get started.</TableCell>
                            </TableRow>
                        ) : (
                            notices.map((notice) => (
                                <TableRow key={notice.id}>
                                    <TableCell className="font-medium">{notice.title}</TableCell>
                                    <TableCell className="max-w-md truncate">{notice.content}</TableCell>
                                    <TableCell>
                                        {notice.is_public ? (
                                            <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs w-fit">
                                                <Globe className="w-3 h-3 mr-1" /> Public
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs w-fit">
                                                <Lock className="w-3 h-3 mr-1" /> Internal
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{new Date(notice.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(notice.id)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
