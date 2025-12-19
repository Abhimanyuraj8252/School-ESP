"use client"

import { useState } from "react"
import { searchStudentsGlobal, getStudentFullDetails } from "@/app/actions/office"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, User, CreditCard, BookOpen } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function Student360Page() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [viewData, setViewData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleSearch = async () => {
        setLoading(true)
        setViewData(null) // Clear view
        const data = await searchStudentsGlobal(query)
        setResults(data)
        setLoading(false)
    }

    const handleSelect = async (id: string) => {
        setLoading(true)
        const details = await getStudentFullDetails(id)
        setViewData(details)
        setLoading(false)
        setResults([]) // Clear list to show view
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Student 360° View</h1>

            {/* Search Bar */}
            <div className="flex gap-4">
                <Input
                    placeholder="Search by Name or Roll No..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="max-w-md"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                    <Search className="mr-2 h-4 w-4" /> Search
                </Button>
            </div>

            {/* Search Results List */}
            {results.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Search Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            {results.map(student => (
                                <div
                                    key={student.id}
                                    onClick={() => handleSelect(student.id)}
                                    className="flex justify-between p-4 border rounded hover:bg-slate-50 cursor-pointer"
                                >
                                    <div>
                                        <p className="font-bold">{student.name}</p>
                                        <p className="text-sm text-gray-500">{student.roll_no} | Class {student.class}-{student.section}</p>
                                    </div>
                                    <Button variant="ghost" size="sm">View Details</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 360 Detail View */}
            {viewData && (
                <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Profile Card */}
                    <Card className="md:col-span-1 h-fit">
                        <CardHeader className="text-center">
                            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <User className="h-12 w-12 text-slate-400" />
                            </div>
                            <CardTitle>{viewData.profile.name}</CardTitle>
                            <CardDescription>Roll No: {viewData.profile.roll_no}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 text-sm gap-y-2">
                                <span className="text-gray-500">Class:</span>
                                <span className="font-medium">{viewData.profile.class} - {viewData.profile.section}</span>
                                <span className="text-gray-500">Father:</span>
                                <span className="font-medium">{viewData.profile.father_name || "N/A"}</span>
                                <span className="text-gray-500">Contact:</span>
                                <span className="font-medium">{viewData.profile.parent_whatsapp || "N/A"}</span>
                            </div>
                            <Button className="w-full" variant="outline">Edit Profile</Button>
                            <Button className="w-full" variant="secondary">Reset Password</Button>
                        </CardContent>
                    </Card>

                    {/* Tabs / Content */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Financials */}
                        <Card>
                            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CreditCard className="h-4 w-4" /> Fee History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {viewData.transactions?.length === 0 ? (
                                    <p className="text-sm text-gray-500">No transactions found.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {viewData.transactions.map((txn: any) => (
                                            <div key={txn.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="font-medium">{txn.description || "Fee Payment"}</p>
                                                    <p className="text-xs text-gray-400">{new Date(txn.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">₹ {txn.amount}</p>
                                                    <Badge variant={txn.status === 'verified' ? 'default' : 'outline'} className="text-[10px] h-5">
                                                        {txn.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Academics */}
                        <Card>
                            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BookOpen className="h-4 w-4" /> Academic Results
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {viewData.results?.length === 0 ? (
                                    <p className="text-sm text-gray-500">No results found.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {viewData.results.map((res: any) => (
                                            <div key={res.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="font-medium">{res.subjects?.name} ({res.exam_type})</p>
                                                    <p className="text-xs text-gray-400">
                                                        Marks: {res.marks_obtained} / {res.max_marks}
                                                    </p>
                                                </div>
                                                <Button size="sm" variant="ghost" className="h-7 text-xs">View Copy</Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            )}
        </div>
    )
}
