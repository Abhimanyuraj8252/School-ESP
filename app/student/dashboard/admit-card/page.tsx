"use client"

import { useEffect, useState } from "react"
import { getStudentProfile } from "@/app/actions/student"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Printer } from "lucide-react"

export default function AdmitCardPage() {
    const [student, setStudent] = useState<any>(null)

    useEffect(() => {
        getStudentProfile().then(setStudent)
    }, [])

    const handlePrint = () => {
        window.print()
    }

    if (!student) return <div className="p-8 text-center">Loading Admit Card...</div>

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center no-print">
                <h1 className="text-2xl font-bold">Examination Admit Card</h1>
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
                </Button>
            </div>

            {/* Admit Card Layout - A4 Ratio-ish */}
            <div className="bg-white border rounded-lg p-8 shadow-lg print:shadow-none print:border-2" id="admit-card">
                {/* Header */}
                <div className="text-center border-b pb-6 mb-6">
                    <h2 className="text-3xl font-bold uppercase tracking-wide text-slate-900">School ESP High School</h2>
                    <p className="text-slate-500">123 Education Lane, Academic City</p>
                    <div className="mt-4 inline-block bg-slate-900 text-white px-6 py-1 text-lg font-bold uppercase">
                        Unit Test 1 - 2025
                    </div>
                </div>

                {/* Details Grid */}
                <div className="flex gap-8">
                    {/* Photo Area */}
                    <div className="w-32 h-40 bg-slate-100 border flex items-center justify-center text-xs text-slate-400">
                        Passpost Photo
                    </div>

                    {/* Info */}
                    <div className="flex-1 grid grid-cols-2 gap-y-4 text-sm">
                        <div>
                            <span className="block text-slate-500 text-xs uppercase">Student Name</span>
                            <span className="font-bold text-lg">{student.name}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500 text-xs uppercase">Roll Number</span>
                            <span className="font-bold text-lg">{student.roll_no}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500 text-xs uppercase">Class & Section</span>
                            <span className="font-bold">{student.class} - {student.section}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500 text-xs uppercase">Date of Birth</span>
                            <span className="font-bold">01/01/2008</span>
                        </div>
                    </div>
                </div>

                {/* Subject Table */}
                <div className="mt-8">
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="border p-2 text-left text-xs uppercase">Date</th>
                                <th className="border p-2 text-left text-xs uppercase">Subject</th>
                                <th className="border p-2 text-left text-xs uppercase">Time</th>
                                <th className="border p-2 text-left text-xs uppercase">Invigilator Sign</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr>
                                <td className="border p-2">20 Mar 2025</td>
                                <td className="border p-2 font-bold">Mathematics</td>
                                <td className="border p-2">10:00 AM - 01:00 PM</td>
                                <td className="border p-2"></td>
                            </tr>
                            <tr>
                                <td className="border p-2">22 Mar 2025</td>
                                <td className="border p-2 font-bold">Science</td>
                                <td className="border p-2">10:00 AM - 01:00 PM</td>
                                <td className="border p-2"></td>
                            </tr>
                            <tr>
                                <td className="border p-2">24 Mar 2025</td>
                                <td className="border p-2 font-bold">English</td>
                                <td className="border p-2">10:00 AM - 01:00 PM</td>
                                <td className="border p-2"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer instructions */}
                <div className="mt-12 text-xs text-slate-500 space-y-1">
                    <p className="font-bold text-black border-b inline-block mb-1">Important Instructions:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Candidate must carry this Admit Card to the examination hall.</li>
                        <li>Do not carry any electronic gadgets like mobile phones.</li>
                        <li>Reach the center 30 minutes before the exam time.</li>
                    </ul>
                </div>

                <div className="mt-12 flex justify-between items-end pt-8">
                    <div className="text-center">
                        <div className="w-32 border-b border-slate-300 mb-1"></div>
                        <p className="text-xs">Class Teacher Sign</p>
                    </div>
                    <div className="text-center">
                        <div className="w-32 border-b border-slate-300 mb-1"></div>
                        <p className="text-xs">Principal Seal & Sign</p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none; }
                    body { background: white; }
                    #admit-card { border: none; shadow: none; }
                }
            `}</style>
        </div>
    )
}
