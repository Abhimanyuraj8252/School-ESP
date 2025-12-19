"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, CheckCircle, Clock } from "lucide-react"

export default function AssignmentsPage() {
    const assignments = [
        { id: 1, subject: "Mathematics", title: "Algebra Worksheet 3.2", dueDate: "Oct 25, 2025", status: "Pending", type: "Homework" },
        { id: 2, subject: "Science", title: "Lab Report: Chemical Reactions", dueDate: "Oct 22, 2025", status: "Submitted", type: "Lab" },
        { id: 3, subject: "English", title: "Essay: Macbeth Character Analysis", dueDate: "Oct 20, 2025", status: "Late", type: "Essay" },
        { id: 4, subject: "History", title: "World War II Timeline", dueDate: "Oct 15, 2025", status: "Graded", type: "Project" },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>

            <div className="grid gap-4">
                {assignments.map((assignment) => (
                    <Card key={assignment.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                                        {assignment.subject}
                                    </span>
                                    <span className="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded">
                                        {assignment.type}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900">{assignment.title}</h3>
                                <div className="flex items-center text-sm text-gray-500 gap-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" /> Due: {assignment.dueDate}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                                {assignment.status === "Pending" && (
                                    <Button className="w-full md:w-auto">
                                        Submit Now
                                    </Button>
                                )}
                                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1
                                    ${assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                        assignment.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                                            assignment.status === 'Graded' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                    }`}>
                                    {assignment.status === 'Graded' && <CheckCircle className="w-3 h-3" />}
                                    {assignment.status === 'Pending' && <Clock className="w-3 h-3" />}
                                    {assignment.status}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
