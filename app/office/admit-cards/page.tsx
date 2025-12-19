"use client"

import { useState } from "react"
import { getStudentsByClass } from "@/app/actions/teacher" // Reusing this action
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer, Loader2 } from "lucide-react"

export default function BulkAdmitCardPage() {
    const [selectedClass, setSelectedClass] = useState("10")
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [generated, setGenerated] = useState(false)

    const handleGenerate = async () => {
        setLoading(true)
        const data = await getStudentsByClass(selectedClass)
        setStudents(data || [])
        setGenerated(true)
        setLoading(false)
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center no-print">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admit Card Generator</h1>
                    <p className="text-gray-500">Generate and print admit cards for an entire class.</p>
                </div>
                <div className="flex gap-4">
                    <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); setGenerated(false); }}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {["9", "10", "11-Sci", "11-Com", "12-Sci"].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleGenerate} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {generated ? "Refresh List" : "Generate Cards"}
                    </Button>
                    {generated && students.length > 0 && (
                        <Button variant="secondary" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" /> Print All
                        </Button>
                    )}
                </div>
            </div>

            {/* Print Area */}
            {generated && (
                <div className="grid grid-cols-1 gap-8 print:block print:gap-0">
                    {students.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">No students found in Class {selectedClass}</div>
                    ) : (
                        students.map((student, index) => (
                            <div key={
                                student.id} className="break-inside-avoid page-break-after-always mb-8 print:mb-0 print:border-none">
                                {/* Single Admit Card Template (Reused Design) */}
                                <div className="bg-white border-2 border-slate-800 rounded-lg p-6 max-w-[210mm] mx-auto h-[140mm] relative">
                                    {/* Header */}
                                    <div className="flex justify-between border-b-2 border-slate-800 pb-2 mb-4">
                                        <div className="flex items-center gap-4">
                                            {/* Logo Placeholder */}
                                            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs">LOGO</div>
                                            <div>
                                                <h2 className="text-2xl font-bold uppercase">School ESP High School</h2>
                                                <p className="text-xs text-slate-600">Affiliated to CBSE | School Code: 12345</p>
                                                <p className="text-xs text-slate-600">Academic Session: 2025-26</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="bg-slate-900 text-white px-4 py-1 font-bold text-sm uppercase inline-block">Admit Card</div>
                                            <p className="text-sm font-bold mt-2">Term-1 Examination</p>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex gap-6">
                                        {/* Photo */}
                                        <div className="w-28 h-36 bg-slate-100 border border-slate-300 flex items-center justify-center text-xs text-slate-400">
                                            PHOTO
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                            <div className="border-b border-dotted border-slate-400">
                                                <span className="text-xs font-bold text-slate-500 block">Student Name</span>
                                                <span className="font-bold">{student.name}</span>
                                            </div>
                                            <div className="border-b border-dotted border-slate-400">
                                                <span className="text-xs font-bold text-slate-500 block">Roll Number</span>
                                                <span className="font-bold font-mono">{student.roll_no}</span>
                                            </div>
                                            <div className="border-b border-dotted border-slate-400">
                                                <span className="text-xs font-bold text-slate-500 block">Class & Section</span>
                                                <span className="font-bold">{student.class} - {student.section}</span>
                                            </div>
                                            <div className="border-b border-dotted border-slate-400">
                                                <span className="text-xs font-bold text-slate-500 block">Father's Name</span>
                                                <span className="font-bold">{student.father_name || "________________"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Exam Table */}
                                    <div className="mt-4">
                                        <table className="w-full text-xs border border-slate-800">
                                            <thead>
                                                <tr className="bg-slate-100 border-b border-slate-800">
                                                    <th className="p-1 border-r border-slate-800 text-left">Subject</th>
                                                    <th className="p-1 border-r border-slate-800 text-left">Date</th>
                                                    <th className="p-1 border-r border-slate-800 text-left">Time</th>
                                                    <th className="p-1 text-left">Sign</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-slate-100">
                                                    <td className="p-1 border-r border-slate-800">Mathematics</td>
                                                    <td className="p-1 border-r border-slate-800">20/03/2025</td>
                                                    <td className="p-1 border-r border-slate-800">10:00 - 01:00</td>
                                                    <td className="p-1"></td>
                                                </tr>
                                                <tr className="border-b border-slate-100">
                                                    <td className="p-1 border-r border-slate-800">Science</td>
                                                    <td className="p-1 border-r border-slate-800">22/03/2025</td>
                                                    <td className="p-1 border-r border-slate-800">10:00 - 01:00</td>
                                                    <td className="p-1"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Signature */}
                                    <div className="absolute bottom-6 w-full pr-12 flex justify-between">
                                        <div className="text-center pt-8">
                                            <div className="border-t border-slate-800 w-32"></div>
                                            <p className="text-xs font-bold">Class Teacher</p>
                                        </div>
                                        <div className="text-center pt-8">
                                            <div className="border-t border-slate-800 w-32"></div>
                                            <p className="text-xs font-bold">Principal</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-4 w-full no-print"></div> {/* Spacer for screen view */}
                            </div>
                        ))
                    )}
                </div>
            )}

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .page-break-after-always { page-break-after: always; }
                    body { background-color: white; }
                    /* Reset margins/paddings for print */
                    @page { margin: 10mm; }
                }
            `}</style>
        </div>
    )
}
