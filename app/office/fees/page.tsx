"use client"

import { useState, useEffect } from "react"
import { searchStudentsGlobal } from "@/app/actions/office"
import { collectFee, getFeeSettings } from "@/app/actions/fees"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2, CheckCircle2, Plus, Trash2, Calculator, Printer } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function FeeCollectionPage() {
    // Search State
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<any>(null)

    // Fee Heads State
    const [heads, setHeads] = useState<{ id: number, name: string, amount: number }[]>([
        { id: 1, name: "Tuition Fee", amount: 0 }
    ])
    const [paymentMode, setPaymentMode] = useState("cash")
    const [notes, setNotes] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [lastSuccess, setLastSuccess] = useState<any>(null)

    // Settings State
    const [lateFeeConfig, setLateFeeConfig] = useState({ amount: 0, interval: 30 })

    useEffect(() => {
        // Load settings on mount
        getFeeSettings().then(setLateFeeConfig)
    }, [])

    const handleSearch = async () => {
        setIsSearching(true)
        const data = await searchStudentsGlobal(searchQuery)
        setSearchResults(data || [])
        setIsSearching(false)
    }

    // Dynamic Row Logic
    const addHead = () => {
        const newId = heads.length > 0 ? Math.max(...heads.map(h => h.id)) + 1 : 1
        setHeads([...heads, { id: newId, name: "", amount: 0 }])
    }

    const removeHead = (id: number) => {
        setHeads(heads.filter(h => h.id !== id))
    }

    const updateHead = (id: number, field: 'name' | 'amount', value: string | number) => {
        setHeads(heads.map(h => h.id === id ? { ...h, [field]: value } : h))
    }

    // Late Fee Logic
    const applyLateFee = () => {
        // Simplified Logic: Just add the configured amount
        // In a real scenario, we'd check Due Date vs Current Date
        const existing = heads.find(h => h.name === "Late Fee")
        if (existing) return // Already added

        addHead()
        // Wait for state update is tricky in React batching for 'heads', so we just append to the new array directly actually
        // tailored approach:
        const newId = heads.length > 0 ? Math.max(...heads.map(h => h.id)) + 1 : 1
        setHeads(prev => [...prev, { id: newId, name: "Late Fee", amount: lateFeeConfig.amount }])
    }

    const totalAmount = heads.reduce((sum, h) => sum + Number(h.amount), 0)

    const handleCollect = async () => {
        if (!selectedStudent || totalAmount <= 0) return

        setIsSubmitting(true)
        const payload = {
            studentId: selectedStudent.id,
            totalAmount,
            paymentMode,
            heads,
            notes
        }

        const res = await collectFee(payload)
        setIsSubmitting(false)

        if (res.error) {
            alert("Error: " + res.error)
        } else {
            setLastSuccess({
                student: selectedStudent.name,
                classVal: selectedStudent.class,
                sectionVal: selectedStudent.section,
                roll: selectedStudent.roll_no,
                amount: totalAmount,
                mode: paymentMode,
                items: heads // Pass the array of heads {name, amount}
            })
            // Reset
            setSelectedStudent(null)
            setHeads([{ id: 1, name: "Tuition Fee", amount: 0 }])
            setSearchQuery("")
            setSearchResults([])
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Fee Collection Terminal</h1>
            <p className="text-gray-500">Advanced payment entry with dynamic fee heads.</p>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* 1. Student Search Panel */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Find Student</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Name or Roll No..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch} disabled={isSearching} size="icon">
                                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {searchResults.map((student) => (
                                <div
                                    key={student.id}
                                    onClick={() => setSelectedStudent(student)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedStudent?.id === student.id ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`}
                                >
                                    <p className="font-bold">{student.name}</p>
                                    <p className="text-xs text-gray-500">Class: {student.class}-{student.section} | Roll: {student.roll_no}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Collection Form Panel */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>
                            {selectedStudent
                                ? `Collecting for: ${selectedStudent.name} (${selectedStudent.class})`
                                : "Select a student to proceed"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedStudent ? (
                            <div className="space-y-6 animate-in fade-in">

                                {/* Dynamic Fee Heads */}
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50">
                                                <TableHead>Fee Description</TableHead>
                                                <TableHead className="w-[150px]">Amount (₹)</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {heads.map((head) => (
                                                <TableRow key={head.id}>
                                                    <TableCell>
                                                        <Input
                                                            value={head.name}
                                                            onChange={(e) => updateHead(head.id, 'name', e.target.value)}
                                                            placeholder="e.g. Exam Fee"
                                                            className="h-8"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            value={head.amount}
                                                            onChange={(e) => updateHead(head.id, 'amount', Number(e.target.value))}
                                                            className="h-8 font-mono"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeHead(head.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell colSpan={3} className="p-2">
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" onClick={addHead} className="gap-1 border-dashed">
                                                            <Plus className="h-3 w-3" /> Add Item
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={applyLateFee} className="gap-1 bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100">
                                                            <Calculator className="h-3 w-3" /> Apply Late Fee (+₹{lateFeeConfig.amount})
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Total & Mode */}
                                <div className="flex justify-between items-end bg-slate-50 p-4 rounded-lg">
                                    <div className="space-y-2 w-1/2">
                                        <Label>Payment Mode</Label>
                                        <Select value={paymentMode} onValueChange={setPaymentMode}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="upi">UPI / Online</SelectItem>
                                                <SelectItem value="cheque">Cheque</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 mb-1">Total Payable</p>
                                        <p className="text-4xl font-bold tracking-tight text-slate-900">₹ {totalAmount}</p>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                                    onClick={handleCollect}
                                    disabled={isSubmitting || totalAmount <= 0}
                                >
                                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Collect Payment"}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] bg-slate-50 border-2 border-dashed rounded-lg text-slate-400">
                                <Search className="h-10 w-10 mb-2 opacity-50" />
                                <p>Search and select a student to start.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>

            {/* Success Alert */}
            {lastSuccess && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white p-6 rounded-lg shadow-2xl flex items-center gap-4 animate-in slide-in-from-right z-50">
                    <div className="bg-green-500 rounded-full p-2">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold">Collection Successful!</h4>
                        <p className="text-sm text-slate-300">
                            ₹{lastSuccess.amount} collected from {lastSuccess.student}.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    import("@/utils/receiptGenerator").then(mod => {
                                        mod.downloadReceipt(
                                            {
                                                amount: lastSuccess.amount,
                                                payment_mode: lastSuccess.mode,
                                                items: lastSuccess.items // Passing items for detailed table
                                            },
                                            {
                                                name: lastSuccess.student,
                                                class: lastSuccess.classVal,
                                                section: lastSuccess.sectionVal,
                                                roll_no: lastSuccess.roll
                                            }
                                        )
                                    })
                                }}
                            >
                                <Printer className="mr-2 h-3 w-3" /> Download Receipt
                            </Button>
                            <Button
                                variant="link"
                                className="text-white p-0 h-auto text-xs"
                                onClick={() => setLastSuccess(null)}
                            >
                                Dismiss
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
