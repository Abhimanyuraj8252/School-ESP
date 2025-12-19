"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

export default function ExamsPage() {
    const examSchedule = [
        { subject: "Mathematics", date: "Oct 25, 2025", time: "09:00 AM - 12:00 PM", room: "Hall A" },
        { subject: "Science", date: "Oct 27, 2025", time: "09:00 AM - 12:00 PM", room: "Lab 2" },
        { subject: "English", date: "Oct 29, 2025", time: "09:00 AM - 12:00 PM", room: "Room 101" },
        { subject: "Social Studies", date: "Oct 31, 2025", time: "09:00 AM - 12:00 PM", room: "Room 102" },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Exam Schedule</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Upcoming Exams (Term 1)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Subject</th>
                                    <th scope="col" className="px-6 py-3">Time</th>
                                    <th scope="col" className="px-6 py-3">Room</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examSchedule.map((exam, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {exam.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            {exam.subject}
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {exam.time}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                {exam.room}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
