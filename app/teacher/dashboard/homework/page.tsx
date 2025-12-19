"use client"

import { useState, useEffect } from "react"
import { getSubjects } from "@/app/actions/admin"
import { assignHomework, getHomeworkForTeacher } from "@/app/actions/diary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Calendar } from "lucide-react"

export default function HomeworkPage() {
    const [selectedClass, setSelectedClass] = useState("10")
    const [selectedSection, setSelectedSection] = useState("A")
    const [subjects, setSubjects] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState<any[]>([])

    // Form
    const [subjectId, setSubjectId] = useState("")
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        async function load() {
            setLoading(true)
            const subs = await getSubjects(selectedClass)
            setSubjects(subs)
            const work = await getHomeworkForTeacher(selectedClass, selectedSection)
            setHistory(work)
            setLoading(false)
        }
        load()
    }, [selectedClass, selectedSection])

    const handleSubmit = async () => {
        if (!subjectId || !title || !dueDate) {
            alert("Please fill all required fields")
            return
        }

        setSubmitting(true)
        const res = await assignHomework(selectedClass, selectedSection, subjectId, title, desc, dueDate)
        if (res.error) {
            alert("Error: " + res.error)
        } else {
            alert("Homework Assigned Successfully!")
            setTitle("")
            setDesc("")
            // Refresh list
            const work = await getHomeworkForTeacher(selectedClass, selectedSection)
            setHistory(work)
        }
        setSubmitting(false)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Digital Diary: Homework</h1>
                <div className="flex gap-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="9">Class 9</SelectItem>
                            <SelectItem value="10">Class 10</SelectItem>
                            <SelectItem value="11-Sci">11 Sci</SelectItem>
                            <SelectItem value="12-Sci">12 Sci</SelectItem>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5 text-indigo-600" /> Assign New Work
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Select value={subjectId} onValueChange={setSubjectId}>
                                <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                <SelectContent>
                                    {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Title / Topic</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chapter 4 Exercises" />
                        </div>

                        <div className="space-y-2">
                            <Label>Description (Optional)</Label>
                            <Textarea
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Details about the assignment..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </div>

                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : "Assign Homework"}
                        </Button>
                    </CardContent>
                </Card>

                {/* History List */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-500" /> Recent Assignments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center p-8 text-gray-400">Loading diary...</div>
                        ) : history.length === 0 ? (
                            <div className="text-center p-8 text-gray-400 bg-gray-50 rounded border border-dashed">
                                No homework assigned recently.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.map((hw) => (
                                    <div key={hw.id} className="group p-4 rounded-lg border hover:border-indigo-200 hover:bg-indigo-50/30 transition flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800">
                                                    {hw.subjects?.name}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    Due: {new Date(hw.due_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-800">{hw.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{hw.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
