"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Calendar, CheckSquare, Users, FileText } from "lucide-react"

export default function TeacherDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
            <p className="text-gray-500 mb-8">Good morning, Teacher.</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">My Classes</CardTitle>
                        <BookOpen className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-gray-500">Active sections</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
                        <Users className="w-4 h-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-gray-500">Across all classes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Today's Schedule</CardTitle>
                        <Calendar className="w-4 h-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4 Hrs</div>
                        <p className="text-xs text-gray-500">Remaining</p>
                    </CardContent>
                </Card>
                <Link href="/teacher/dashboard/attendance">
                    <Card className="hover:bg-slate-50 cursor-pointer transition">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Attendance</CardTitle>
                            <CheckSquare className="w-4 h-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Manage</div>
                            <p className="text-xs text-gray-500">Mark daily attendance</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/teacher/dashboard/exams">
                    <Card className="hover:bg-slate-50 cursor-pointer transition">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Exam Marks</CardTitle>
                            <FileText className="w-4 h-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Entry</div>
                            <p className="text-xs text-gray-500">Upload marks & sheets</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/teacher/dashboard/homework">
                    <Card className="hover:bg-slate-50 cursor-pointer transition">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Homework</CardTitle>
                            <BookOpen className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Post</div>
                            <p className="text-xs text-gray-500">Assign work & notices</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-bold mb-4">Class Schedule</h3>
                <p className="text-sm text-gray-500">Schedule placeholder...</p>
            </div>
        </div>
    )
}
