"use client"

import { useEffect, useState } from "react"
import { getStudentProfile, getStudentHomework } from "@/app/actions/student"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, Clock } from "lucide-react"

export default function StudentDiaryPage() {
    const [homework, setHomework] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const profile = await getStudentProfile()
            if (profile) {
                const data = await getStudentHomework(profile)
                setHomework(data)
            }
            setLoading(false)
        }
        load()
    }, [])

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Digital Diary</h1>
                <p className="text-gray-500">Homework, Assignments, and Class Notices.</p>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center p-12 text-gray-400">Loading diary...</div>
                ) : homework.length === 0 ? (
                    <div className="text-center p-12 bg-gray-50 border border-dashed rounded-lg text-gray-400">
                        No homework assigned recently.
                    </div>
                ) : (
                    homework.map((hw) => (
                        <Card key={hw.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                                {hw.subjects?.name || "General"}
                                            </Badge>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Assigned: {new Date(hw.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <CardTitle className="text-xl text-gray-800">{hw.title}</CardTitle>
                                    </div>
                                    {hw.due_date && (
                                        <div className="text-right">
                                            <div className="text-xs text-red-500 font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
                                                <Clock className="w-3 h-3" /> Due Date
                                            </div>
                                            <div className="text-lg font-bold text-gray-700">
                                                {new Date(hw.due_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                    {hw.description || "No description provided."}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
