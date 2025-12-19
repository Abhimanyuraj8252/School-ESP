'use client'

import { saveExamMarks } from "@/app/actions/exams"
import { getStudentsForClass } from "@/app/actions/teacher"
import { AnswerSheetUpload } from "@/components/teacher/AnswerSheetUpload"
import { ClassSelector } from "@/components/teacher/ClassSelector"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

function ExamEntryContent() {
    const searchParams = useSearchParams()
    const className = searchParams.get('class')
    const section = searchParams.get('section')
    // Ideally subject should come from the teacher's assignment too, but for flexibility let's allow selection or manual input if not strictly bound.
    // The ClassSelector returns subject if available.

    // For now, let's add a manual Subject input or selector if the teacher teaches multiple subjects.
    // Let's assume manual input for flexibility in this MVP.
    const [subject, setSubject] = useState("")

    const [students, setStudents] = useState<any[]>([])
    const [marks, setMarks] = useState<Record<string, string>>({}) // student_id -> marks (string used for input)
    const [maxMarks, setMaxMarks] = useState("100")
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [uploadedSheets, setUploadedSheets] = useState<Record<string, string>>({}) // student_id -> url

    useEffect(() => {
        if (className && section) {
            setLoading(true)
            getStudentsForClass(className, section).then(data => {
                setStudents(data)
                setLoading(false)
            })
        }
    }, [className, section])

    const handleMarkChange = (studentId: string, value: string) => {
        setMarks(prev => ({ ...prev, [studentId]: value }))
    }

    const handleSave = async () => {
        if (!className || !section || !subject) {
            toast({ title: "Missing Information", description: "Class, Section and Subject are required", variant: "destructive" })
            return
        }

        setSaving(true)
        const payload = students.map(s => ({
            student_id: s.id,
            marks: parseFloat(marks[s.id] || "0"),
            max_marks: parseFloat(maxMarks),
            copy_image_url: uploadedSheets[s.id]
        })).filter(item => marks[item.student_id] !== undefined)

        const result = await saveExamMarks(className, section, subject, payload)
        setSaving(false)

        if (result.success) {
            toast({ title: "Marks Saved", description: "Exam results recorded successfully." })
        } else {
            toast({ title: "Error", description: "Failed to save marks", variant: "destructive" })
        }
    }

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Enter Exam Marks</h1>

            <div className="flex flex-wrap gap-4 items-end">
                <div>
                    <Label>Select Class</Label>
                    <ClassSelector />
                </div>
                <div>
                    <Label>Subject</Label>
                    <Input
                        placeholder="e.g. Mathematics"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="w-[200px]"
                    />
                </div>
                <div>
                    <Label>Max Marks</Label>
                    <Input
                        type="number"
                        value={maxMarks}
                        onChange={e => setMaxMarks(e.target.value)}
                        className="w-[100px]"
                    />
                </div>
            </div>

            {!className || !section ? (
                <div className="text-center py-10 text-gray-500">Please select a class.</div>
            ) : loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Marks obtained</TableHead>
                                    <TableHead>Answer Sheet</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                className="w-24"
                                                value={marks[student.id] || ""}
                                                onChange={e => handleMarkChange(student.id, e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <AnswerSheetUpload
                                                studentName={student.name}
                                                onUploadComplete={(url) => setUploadedSheets(prev => ({ ...prev, [student.id]: url }))}
                                            />
                                            {uploadedSheets[student.id] && <span className="text-xs text-green-600">Uploaded</span>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving && <Loader2 className="mr-2 animate-spin" />}
                                Save Results
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default function ExamEntryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExamEntryContent />
        </Suspense>
    )
}
