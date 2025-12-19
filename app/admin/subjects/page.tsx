"use client"

import { useState, useEffect, useTransition } from "react"
import { addSubject, getSubjects, deleteSubject } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus, BookOpen, Loader2 } from "lucide-react"

// Types
type Subject = {
    id: string
    name: string
    class_id: string
    created_at: string
}

export default function SubjectManagementPage() {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedClass, setSelectedClass] = useState<string>("10")
    const [newSubjectName, setNewSubjectName] = useState("")
    const [isPending, startTransition] = useTransition()

    // Classes List (Could be dynamic in future)
    const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11-Sci", "11-Com", "11-Arts", "12-Sci", "12-Com", "12-Arts"]

    useEffect(() => {
        loadSubjects()
    }, [selectedClass])

    const loadSubjects = async () => {
        setLoading(true)
        const data = await getSubjects(selectedClass)
        setSubjects(data)
        setLoading(false)
    }

    const handleAdd = () => {
        if (!newSubjectName) return

        startTransition(async () => {
            const result = await addSubject(selectedClass, newSubjectName)
            if (result.success) {
                setNewSubjectName("")
                loadSubjects() // Refresh
            } else {
                alert("Error adding subject: " + result.error)
            }
        })
    }

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure? This might affect existing results if linked.")) return

        startTransition(async () => {
            const result = await deleteSubject(id)
            if (result.success) {
                loadSubjects()
            } else {
                alert("Error deleting subject")
            }
        })
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Subject Management</h1>
                    <p className="text-muted-foreground">Define subjects for each class to enable Result Uploads.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Control Panel */}
                <Card className="md:col-span-1 h-fit shadow-md border-slate-200">
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="text-lg">Add New Subject</CardTitle>
                        <CardDescription>Select class and enter name</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label>Class</Label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => (
                                        <SelectItem key={c} value={c}>Class {c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Subject Name</Label>
                            <Input
                                placeholder="e.g. Mathematics"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-full bg-slate-900 hover:bg-slate-800"
                            onClick={handleAdd}
                            disabled={isPending || !newSubjectName}
                        >
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Add Subject
                        </Button>
                    </CardContent>
                </Card>

                {/* List Panel */}
                <Card className="md:col-span-2 shadow-md border-slate-200">
                    <CardHeader className="bg-white border-b flex flex-row items-center justify-between pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-indigo-600" />
                                Subjects for Class {selectedClass}
                            </CardTitle>
                            <CardDescription>{subjects.length} subjects found</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground">Loading...</div>
                        ) : subjects.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground bg-slate-50/50">
                                No subjects defined for this class yet.
                            </div>
                        ) : (
                            <div className="rounded-md border-none">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                                            <TableHead className="w-[100px]">Class</TableHead>
                                            <TableHead>Subject Name</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subjects.map((subject) => (
                                            <TableRow key={subject.id}>
                                                <TableCell className="font-medium text-slate-600">
                                                    Class {subject.class_id}
                                                </TableCell>
                                                <TableCell className="font-bold text-slate-800">
                                                    {subject.name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(subject.id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
        </div>
    )
}
