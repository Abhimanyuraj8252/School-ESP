"use client"

import { useState, useEffect } from "react"
import { createNotice, deleteNotice, getNotices } from "@/app/actions/cms"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Megaphone, Loader2 } from "lucide-react"

export default function CMSPage() {
    const [notices, setNotices] = useState<any[]>([])
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isPublic, setIsPublic] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadNotices()
    }, [])

    const loadNotices = async () => {
        const data = await getNotices(false)
        setNotices(data)
    }

    const handleCreate = async () => {
        if (!title || !content) return alert("Title and Content required")

        setLoading(true)
        const res = await createNotice(title, content, isPublic)
        if (res.error) {
            alert(res.error)
        } else {
            setTitle("")
            setContent("")
            loadNotices()
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this notice?")) return
        await deleteNotice(id)
        loadNotices()
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Content Management System</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Editor */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-indigo-600" /> Post Notice
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Winter Vacation" />
                        </div>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="Details..." />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="public" checked={isPublic} onCheckedChange={(c) => setIsPublic(!!c)} />
                            <Label htmlFor="public">Show on Home Page</Label>
                        </div>
                        <Button className="w-full" onClick={handleCreate} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Publish Notice"}
                        </Button>
                    </CardContent>
                </Card>

                {/* List */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>All Notices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {notices.map(n => (
                                <div key={n.id} className="flex justify-between items-start p-4 border rounded-lg bg-white">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {n.is_public && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">Public</span>}
                                            <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="font-bold text-lg">{n.title}</h3>
                                        <p className="text-gray-600 text-sm">{n.content}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(n.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
