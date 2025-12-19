"use client"

import { useState, useEffect, useTransition } from "react"
import { getStudentsByClass, uploadStudentResult } from "@/app/actions/teacher"
import { getSubjects } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, UploadCloud, CheckCircle, FileUp } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

// Initialize Client for Storage Upload (Client Side is better for file upload)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Student = {
    id: string
    name: string // Assuming name is in students table, might need join if in users
    roll_no: string
}

type Subject = {
    id: string
    name: string
}

export default function ResultUploadPage() {
    const [selectedClass, setSelectedClass] = useState("10")
    const [selectedSubject, setSelectedSubject] = useState("")
    const [examType, setExamType] = useState("Mid-Term")

    const [students, setStudents] = useState<Student[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [loading, setLoading] = useState(false)

    // Form States per student
    const [marksInput, setMarksInput] = useState<Record<string, string>>({})
    const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({})
    const [completedState, setCompletedState] = useState<Record<string, boolean>>({})

    useEffect(() => {
        loadData()
    }, [selectedClass])

    const loadData = async () => {
        setLoading(true)
        const [stuData, subData] = await Promise.all([
            getStudentsByClass(selectedClass),
            getSubjects(selectedClass)
        ])
        setStudents(stuData || []) // Fallback if no students yet
        setSubjects(subData || [])
        setLoading(false)
    }

    const handleFileUpload = async (studentId: string, file: File) => {
        setUploadingState(prev => ({ ...prev, [studentId]: true }))

        try {
            // 1. Upload File
            const fileExt = file.name.split('.').pop()
            const fileName = `${selectedClass}/${selectedSubject}/${studentId}_${Date.now()}.${fileExt}`
            const { data, error } = await supabase.storage
                .from('exam-copies')
                .upload(fileName, file)

            if (error) throw error

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('exam-copies')
                .getPublicUrl(fileName)

            // 3. Save Record (Marks + URL)
            const marks = parseFloat(marksInput[studentId] || "0")
            const result = await uploadStudentResult(
                studentId,
                selectedSubject,
                examType,
                marks,
                100, // Max Marks Default
                publicUrl
            )

            if (result.error) throw new Error(result.error)

            setCompletedState(prev => ({ ...prev, [studentId]: true }))

        } catch (e: any) {
            alert("Upload Failed: " + e.message)
        } finally {
            setUploadingState(prev => ({ ...prev, [studentId]: false }))
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Result Upload Center</h1>
                    <p className="text-muted-foreground">Upload marks and answer sheets for your class.</p>
                </div>
                <div className="flex gap-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {["9", "10", "11-Sci", "12-Sci"].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={examType} onValueChange={setExamType}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Exam" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Unit Test 1">Unit Test 1</SelectItem>
                            <SelectItem value="Mid-Term">Mid-Term</SelectItem>
                            <SelectItem value="Finals">Finals</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="border-indigo-100 shadow-sm">
                <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-indigo-900 flex items-center gap-2">
                            <FileUp className="h-5 w-5" /> Bulk Upload Matrix
                        </CardTitle>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-[200px] bg-white">
                                <SelectValue placeholder="Select Subject First" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {!selectedSubject ? (
                        <div className="p-12 text-center text-muted-foreground">
                            Please select a Subject to begin uploading marks.
                        </div>
                    ) : (
                        <div className="rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead className="w-[100px]">Roll No</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead className="w-[150px]">Marks (Out of 100)</TableHead>
                                        <TableHead>Answer Sheet (copy)</TableHead>
                                        <TableHead className="w-[150px]">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-mono text-xs">{student.roll_no}</TableCell>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={marksInput[student.id] || ""}
                                                    onChange={(e) => setMarksInput({ ...marksInput, [student.id]: e.target.value })}
                                                    className="w-24"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="file"
                                                        className="w-full text-xs"
                                                        accept="image/*,application/pdf"
                                                        onChange={(e) => {
                                                            if (e.target.files?.[0]) handleFileUpload(student.id, e.target.files[0])
                                                        }}
                                                        disabled={uploadingState[student.id]}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {uploadingState[student.id] ? (
                                                    <span className="flex items-center text-blue-600 text-xs font-medium">
                                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Uploading...
                                                    </span>
                                                ) : completedState[student.id] ? (
                                                    <span className="flex items-center text-green-600 text-xs font-bold">
                                                        <CheckCircle className="mr-1 h-3 w-3" /> Saved
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Pending</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
