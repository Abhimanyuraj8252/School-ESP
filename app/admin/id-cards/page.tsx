"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Printer, Loader2, Download } from "lucide-react"
import jsPDF from "jspdf"
import { useToast } from "@/hooks/use-toast"

type Student = {
    id: string
    full_name: string
    email: string
    student_profiles: {
        roll_no?: string
        class: string
        section: string
        parent_whatsapp: string
    }
}

export default function IdCardPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedStudents, setSelectedStudents] = useState<string[]>([])
    const [filterClass, setFilterClass] = useState<string>("All")

    const supabase = createClient()
    const { toast } = useToast()

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    id,
                    full_name,
                    email,
                    student_profiles (
                        class,
                        section,
                        parent_whatsapp
                    )
                `)
                .eq('role', 'student')
                .order('full_name', { ascending: true })

            if (error) throw error
            // Transform and filter
            // @ts-ignore
            const validStudents = (data || []).map((u: any) => ({
                ...u,
                student_profiles: Array.isArray(u.student_profiles) ? u.student_profiles[0] : u.student_profiles
            })).filter((u: any) => u.student_profiles);

            setStudents(validStudents)
        } catch (error) {
            console.error("Error fetching students:", JSON.stringify(error, null, 2))
            toast({
                title: "Error",
                description: "Failed to fetch student data. Check console for details.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const filteredStudents = filterClass === "All"
        ? students
        : students.filter(s => s.student_profiles?.class === filterClass)

    const classes = Array.from(new Set(students.map(s => s.student_profiles?.class))).sort()

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedStudents(filteredStudents.map(s => s.id))
        } else {
            setSelectedStudents([])
        }
    }

    const toggleSelect = (id: string) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(s => s !== id))
        } else {
            setSelectedStudents([...selectedStudents, id])
        }
    }

    const generatePDF = () => {
        if (selectedStudents.length === 0) return

        const doc = new jsPDF()
        let x = 10
        let y = 10
        const cardWidth = 85 // mm
        const cardHeight = 55 // mm
        const space = 10

        let col = 0
        let row = 0

        const targets = students.filter(s => selectedStudents.includes(s.id))

        targets.forEach((student, index) => {
            // Check for new page
            if (row > 4) {
                doc.addPage()
                col = 0
                row = 0
                x = 10
                y = 10
            }

            // Draw Card Border
            doc.setDrawColor(0)
            doc.rect(x, y, cardWidth, cardHeight)

            // Header Background
            doc.setFillColor(41, 37, 36) // Slate-900 like
            doc.rect(x, y, cardWidth, 12, 'F')

            // School Name
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(10)
            doc.setFont("helvetica", "bold")
            doc.text("School ESP", x + cardWidth / 2, y + 8, { align: "center" })

            // Content
            doc.setTextColor(0, 0, 0)
            doc.setFontSize(8)
            doc.setFont("helvetica", "normal")

            // Text Details
            const startTextY = y + 20
            const lineHeight = 5

            doc.text(`Name: ${student.full_name}`, x + 5, startTextY)
            doc.text(`ID: ${student.student_profiles.roll_no || 'N/A'}`, x + 5, startTextY + lineHeight)
            doc.text(`Class: ${student.student_profiles.class} - ${student.student_profiles.section}`, x + 5, startTextY + lineHeight * 2)
            doc.text(`Parent Ph: ${student.student_profiles.parent_whatsapp}`, x + 5, startTextY + lineHeight * 3)

            // Placeholder Photo Box on the right
            doc.rect(x + cardWidth - 25, y + 18, 20, 25)
            doc.setFontSize(6)
            doc.text("PHOTO", x + cardWidth - 19, y + 30)

            // Footer
            doc.setFontSize(6)
            doc.setTextColor(100)
            doc.text("Valid for 2025-26", x + cardWidth / 2, y + cardHeight - 3, { align: "center" })

            // Move Position
            col++
            if (col > 1) { // 2 cards per row
                col = 0
                row++
                x = 10
                y += cardHeight + space
            } else {
                x += cardWidth + space
            }
        })

        doc.save("student_id_cards.pdf")
        toast({
            title: "Success",
            description: `Generated ${targets.length} ID Cards`,
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">ID Card Generator</h1>
                    <p className="text-muted-foreground">Select students to generate printable ID cards.</p>
                </div>
                <Button onClick={generatePDF} disabled={selectedStudents.length === 0} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Generate PDF ({selectedStudents.length})
                </Button>
            </div>

            <div className="flex items-center gap-4 py-4">
                <div className="w-48">
                    <Label htmlFor="class-filter" className="sr-only">Filter by Class</Label>
                    <Select value={filterClass} onValueChange={setFilterClass}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Classes</SelectItem>
                            {classes.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="border rounded-lg bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Class/Sec</TableHead>
                            <TableHead>Roll No</TableHead>
                            <TableHead>Parent Phone</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedStudents.includes(student.id)}
                                            onCheckedChange={() => toggleSelect(student.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{student.full_name}</TableCell>
                                    <TableCell>{student.student_profiles.class} - {student.student_profiles.section}</TableCell>
                                    <TableCell>{student.student_profiles.roll_no || '-'}</TableCell>
                                    <TableCell>{student.student_profiles.parent_whatsapp}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
