"use client"

import { useState, useEffect } from "react"
import { getAttendanceByDate, submitAttendance } from "@/app/actions/diary"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Check, X, Save } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AttendancePage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedClass, setSelectedClass] = useState("10")
    const [selectedSection, setSelectedSection] = useState("A")

    // Students state with Status property
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadData()
    }, [date, selectedClass, selectedSection])

    const loadData = async () => {
        setLoading(true)
        const data = await getAttendanceByDate(selectedClass, selectedSection, date)
        setStudents(data)
        setLoading(false)
    }

    const toggleStatus = (id: string) => {
        setStudents(prev => prev.map(s => {
            if (s.id !== id) return s
            // Toggle Logic: Present -> Absent -> Leave -> Present
            const nextStatus = s.status === 'Present' ? 'Absent'
                : s.status === 'Absent' ? 'Leave'
                    : 'Present'
            return { ...s, status: nextStatus }
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        const records = students.map(s => ({
            student_id: s.id,
            date: date,
            status: s.status
        }))

        const res = await submitAttendance(records)
        setSaving(false)

        if (res.error) {
            alert("Failed to save: " + res.error)
        } else {
            alert("Attendance Saved Successfully!")
        }
    }

    // Stats
    const presentCount = students.filter(s => s.status === 'Present').length
    const absentCount = students.filter(s => s.status === 'Absent').length

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
                    <p className="text-gray-500">Daily roll call for {date}</p>
                </div>
                <div className="flex gap-4 items-center bg-white p-2 rounded-lg border shadow-sm">
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-[160px]"
                    />
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="9">Class 9</SelectItem>
                            <SelectItem value="10">Class 10</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A">Sec A</SelectItem>
                            <SelectItem value="B">Sec B</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-700">
                    <span className="text-xs uppercase font-bold">Present</span>
                    <div className="text-2xl font-bold">{presentCount}</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
                    <span className="text-xs uppercase font-bold">Absent</span>
                    <div className="text-2xl font-bold">{absentCount}</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-blue-700">
                    <span className="text-xs uppercase font-bold">Total</span>
                    <div className="text-2xl font-bold">{students.length}</div>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400">Loading student list...</div>
                    ) : students.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">No students found in this class.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    onClick={() => toggleStatus(student.id)}
                                    className={cn(
                                        "cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center text-center gap-2 select-none",
                                        student.status === 'Present'
                                            ? "bg-white border-green-100 hover:border-green-300 hover:shadow-md"
                                            : student.status === 'Absent'
                                                ? "bg-red-50 border-red-500 shadow-inner"
                                                : "bg-yellow-50 border-yellow-400"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                                        student.status === 'Present' ? "bg-green-100 text-green-700" :
                                            student.status === 'Absent' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                    )}>
                                        {student.roll_no}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm truncate w-full px-1">{student.name}</p>
                                        <p className={cn(
                                            "text-xs font-bold mt-1 uppercase",
                                            student.status === 'Present' ? "text-green-600" :
                                                student.status === 'Absent' ? "text-red-600" : "text-yellow-600"
                                        )}>
                                            {student.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end sticky bottom-6">
                <Button
                    size="lg"
                    className="shadow-xl bg-slate-900 text-white hover:bg-slate-800"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Attendance
                </Button>
            </div>
        </div>
    )
}
