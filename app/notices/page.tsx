"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Megaphone, Bell } from "lucide-react"

export default function PublicNoticesPage() {
    const [notices, setNotices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('notices')
                .select('*')
                .eq('is_public', true)
                .order('created_at', { ascending: false })

            setNotices(data || [])
            setLoading(false)
        }
        load()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
                        <Megaphone className="w-10 h-10 text-secondary" />
                        School Notice Board
                    </h1>
                    <p className="text-lg text-slate-600 mt-2">
                        Latest announcements and updates associated with school activities.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center p-12 text-slate-400">Loading notices...</div>
                ) : notices.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-lg border shadow-sm">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-slate-600">No New Notices</h3>
                        <p className="text-slate-500">Check back later for updates.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {notices.map((notice) => (
                            <Card key={notice.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-secondary">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl text-slate-900">
                                            {notice.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(notice.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                        {notice.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
