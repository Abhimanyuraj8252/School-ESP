"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Megaphone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

type Notice = {
    id: number
    title: string
    content: string
    created_at: string
}

export default function NoticesPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [notices, setNotices] = useState<Notice[]>([])
    const supabase = createClient()

    useEffect(() => {
        const fetchNotices = async () => {
            const { data } = await supabase
                .from("notices")
                .select("*")
                .eq("is_public", true)
                .order("created_at", { ascending: false })
                .limit(5) // Show top 5 notices

            if (data && data.length > 0) {
                setNotices(data)
                // Only open if we haven't seen this popup in this session? 
                // For now, always open if there are notices (Simple version)
                setIsOpen(true)
            }
        }
        fetchNotices()
    }, [])

    if (notices.length === 0) return null

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2 text-primary">
                        <Megaphone className="h-6 w-6" />
                        <DialogTitle className="text-xl">Latest Announcements</DialogTitle>
                    </div>
                    <DialogDescription>
                        Stay updated with the latest news from our school.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {notices.map((notice) => (
                        <div key={notice.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-1">{notice.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {notice.content}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end pt-4">
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
