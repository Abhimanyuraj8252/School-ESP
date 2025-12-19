"use client"

import { useState, useEffect } from "react"
import { getSessionSettings, updateSessionSettings, getClassesForPromotion, previewPromotion, executePromotion } from "@/app/actions/session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, Calendar, Check, Users } from "lucide-react"

export default function SessionManagerPage() {
    // Settings State
    const [promotionDate, setPromotionDate] = useState("2025-04-01")
    const [savingSettings, setSavingSettings] = useState(false)

    // Promotion Wizard State
    const [classes, setClasses] = useState<string[]>([])
    const [selectedClass, setSelectedClass] = useState("")
    const [nextClass, setNextClass] = useState("")
    const [targetSection, setTargetSection] = useState("A")
    const [students, setStudents] = useState<any[]>([])
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]) // IDs
    const [step, setStep] = useState(1) // 1: Select, 2: Preview, 3: Done
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadInitialData()
    }, [])

    const loadInitialData = async () => {
        const [date, cls] = await Promise.all([getSessionSettings(), getClassesForPromotion()])
        setPromotionDate(date)
        setClasses(cls)
    }

    const handleSaveDate = async () => {
        setSavingSettings(true)
        await updateSessionSettings(promotionDate)
        setSavingSettings(false)
        alert("Session Date Updated")
    }

    const handlePreview = async () => {
        if (!selectedClass) return
        setLoading(true)
        const data = await previewPromotion(selectedClass)
        setStudents(data)
        // Auto-select all by default
        setSelectedStudents(data.map((s: any) => s.id))

        // Auto-guess next class (e.g. "9" -> "10", "10" -> "11")
        const num = parseInt(selectedClass)
        if (!isNaN(num)) setNextClass((num + 1).toString())
        else setNextClass(selectedClass + " (Next)")

        setStep(2)
        setLoading(false)
    }

    const handleExecute = async () => {
        if (!confirm(`Are you sure you want to promote ${selectedStudents.length} students to Class ${nextClass}?`)) return

        setLoading(true)
        await executePromotion(selectedStudents, nextClass, targetSection)
        setLoading(false)
        setStep(3)
    }

    const toggleStudent = (id: string) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(s => s !== id))
        } else {
            setSelectedStudents([...selectedStudents, id])
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Session Manager</h1>

            {/* Global Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" /> Session Configuration
                    </CardTitle>
                    <CardDescription>Set the global new session start date.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end max-w-sm">
                        <div className="space-y-2 w-full">
                            <label className="text-sm font-medium">New Session Start Date</label>
                            <Input type="date" value={promotionDate} onChange={(e) => setPromotionDate(e.target.value)} />
                        </div>
                        <Button onClick={handleSaveDate} disabled={savingSettings}>Save</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Promotion Wizard */}
            <Card className="border-t-4 border-t-indigo-600">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" /> Class Promotion Wizard
                    </CardTitle>
                    <CardDescription>Promote students to the next academic class easily.</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Current Class</label>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Class to Promote" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handlePreview} disabled={!selectedClass || loading} className="w-full">
                                Next: Preview Students <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-slate-50 p-4 rounded-lg">
                                <div className="space-y-4 w-full md:w-auto">
                                    <div className="flex gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Promote To Class</label>
                                            <Input value={nextClass} onChange={(e) => setNextClass(e.target.value)} className="w-32 bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Assign Section</label>
                                            <Select value={targetSection} onValueChange={setTargetSection}>
                                                <SelectTrigger className="w-32 bg-white"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="A">Section A</SelectItem>
                                                    <SelectItem value="B">Section B</SelectItem>
                                                    <SelectItem value="C">Section C</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Selected</p>
                                    <p className="font-bold text-2xl">{selectedStudents.length} / {students.length}</p>
                                </div>
                            </div>

                            <div className="border rounded-md max-h-[400px] overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]"><input type="checkbox" checked={selectedStudents.length === students.length} readOnly /></TableHead>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Current Class</TableHead>
                                            <TableHead>Current Section</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.map(s => (
                                            <TableRow key={s.id}>
                                                <TableCell><input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => toggleStudent(s.id)} /></TableCell>
                                                <TableCell className="font-medium">{s.name}</TableCell>
                                                <TableCell>{s.class}</TableCell>
                                                <TableCell>{s.section}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 flex-1" onClick={handleExecute} disabled={loading || selectedStudents.length === 0}>
                                    Confirm Promotion
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-bold">Promotion Complete!</h2>
                            <p className="text-gray-500 mt-2">
                                {selectedStudents.length} students have been moved to Class {nextClass} - Section {targetSection}.
                            </p>
                            <Button className="mt-6" onClick={() => { setStep(1); loadInitialData(); }}>
                                Promote Another Class
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
