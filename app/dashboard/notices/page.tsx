"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Calendar, Megaphone } from "lucide-react"

export default function NoticesPage() {
    const notices = [
        { id: 1, title: "Half-Yearly Exams Schedule Released", date: "Oct 12, 2025", category: "Academic", content: "The schedule for the upcoming half-yearly examinations has been released. Please check the exams section for details." },
        { id: 2, title: "Sports Day Registration Open", date: "Oct 10, 2025", category: "Events", content: "Registration for the annual sports day is now open. Interested students can register with their class teachers." },
        { id: 3, title: "School Closed on Monday", date: "Oct 08, 2025", category: "General", content: "The school will remain closed on Monday, Oct 14th, due to a public holiday." },
        { id: 4, title: "Science Fair Winners Announced", date: "Oct 05, 2025", category: "Academic", content: "Congratulations to all the winners of the Inter-School Science Fair!" },
        { id: 5, title: "Winter Uniform Policy", date: "Oct 01, 2025", category: "General", content: "Students are required to wear the winter uniform starting from Nov 1st." },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>

            <div className="grid gap-4">
                {notices.map((notice) => (
                    <Card key={notice.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className={`p-2 rounded-full ${notice.category === 'Academic' ? 'bg-blue-100 text-blue-600' :
                                notice.category === 'Events' ? 'bg-green-100 text-green-600' :
                                    'bg-orange-100 text-orange-600'
                                }`}>
                                {notice.category === 'Academic' && <Megaphone className="w-5 h-5" />}
                                {notice.category === 'Events' && <Calendar className="w-5 h-5" />}
                                {notice.category === 'General' && <Bell className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-lg">{notice.title}</CardTitle>
                                <p className="text-xs text-gray-500">{notice.date}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 text-sm">
                                {notice.content}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
