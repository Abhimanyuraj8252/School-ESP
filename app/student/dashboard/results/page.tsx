"use client"

import { useEffect, useState } from "react"
import { getStudentProfile, getStudentResults } from "@/app/actions/student"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function StudentResultsPage() {
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        async function load() {
            const p = await getStudentProfile()
            if (p) {
                setProfile(p)
                const data = await getStudentResults(p.id)
                setResults(data)
            }
            setLoading(false)
        }
        load()
    }, [])

    const handleDownload = (exam: string, examResults: any[]) => {
        if (!profile) return
        import("@/utils/marksheetGenerator").then(mod => {
            mod.downloadMarksheet(profile, examResults, exam)
        })
    }

    // Helper to group by exam
    function groupBy(array: any[], key: string) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Academic Performance</h1>
                <p className="text-gray-500">View your marks and check answer sheet copies.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Result History</CardTitle>
                </CardHeader>
                <h2 className="text-xl font-semibold mb-4 text-indigo-900 border-b pb-2">Academic Record</h2>
                {Object.entries(groupBy(results, 'exam_type') as Record<string, any[]>).map(([exam, examResults]) => (
                    <div key={exam} className="mb-8 bg-white p-6 rounded-lg border shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">{exam} Examination</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                onClick={() => {
                                    import("@/utils/marksheetGenerator").then(mod => {
                                        // Need full student object here, assume profile is available in context or passed
                                        // Since we are inside the component loop, we need access to 'profile' state
                                        // Dispatching a custom event or assuming a prop? 
                                        // Let's use a closure variable 'currentProfile' if available in scope
                                        // Refactor: We need profile in scope.
                                        // I'll call a handleDownload function defined in component.
                                        handleDownload(exam, examResults)
                                    })
                                }}
                            >
                                <Download className="h-4 w-4" /> Download Marksheet
                            </Button>
                        </div>
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="text-right">Marks</TableHead>
                                    <TableHead className="text-right">Max</TableHead>
                                    <TableHead className="text-center">Answer Copy</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* @ts-ignore */}
                                {examResults.map((res: any) => (
                                    <TableRow key={res.id}>
                                        <TableCell className="font-medium">{res.subjects?.name || "Subject"}</TableCell>
                                        <TableCell className="text-right font-bold text-green-700">{res.marks_obtained}</TableCell>
                                        <TableCell className="text-right text-gray-500">{res.max_marks}</TableCell>
                                        <TableCell className="text-center">
                                            {res.copy_url ? (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl h-[90vh]">
                                                        <DialogHeader><DialogTitle>{res.subjects?.name} Copy</DialogTitle></DialogHeader>
                                                        <iframe src={res.copy_url} className="w-full h-full rounded border bg-slate-100" />
                                                    </DialogContent>
                                                </Dialog>
                                            ) : <span className="text-gray-300">-</span>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ))}
            </Card>
        </div>
    )
}
