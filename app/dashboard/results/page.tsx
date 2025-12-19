"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, GraduationCap, TrendingUp } from "lucide-react"

export default function ResultsPage() {
    const results = [
        { subject: "Mathematics", marks: 98, total: 100, grade: "A+" },
        { subject: "Science", marks: 95, total: 100, grade: "A+" },
        { subject: "English", marks: 89, total: 100, grade: "A" },
        { subject: "Social Studies", marks: 92, total: 100, grade: "A+" },
        { subject: "Computer Science", marks: 96, total: 100, grade: "A+" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
                    <p className="text-gray-500">Term 1 - Academic Year 2025-2026</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Marksheet
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-primary text-white border-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium opacity-90">Overall Percentage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">94%</div>
                        <p className="text-sm opacity-75 mt-1">Grade: A+</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-gray-500">Total Marks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-gray-900">470<span className="text-xl text-gray-400">/500</span></div>
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Top 5% in class
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-gray-500">Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-gray-900">98%</div>
                        <p className="text-sm text-gray-500 mt-1">Present Days: 145/148</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        Subject Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Subject</th>
                                    <th scope="col" className="px-6 py-3">Marks Obtained</th>
                                    <th scope="col" className="px-6 py-3">Total Marks</th>
                                    <th scope="col" className="px-6 py-3">Grade</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((item, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {item.subject}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.marks}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.total}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400">
                                                {item.grade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-green-600 font-medium">
                                            Pass
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
