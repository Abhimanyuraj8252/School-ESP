"use client"

import { useEffect, useState } from "react"
import { getStudentProfile, getFeeTransactions } from "@/app/actions/student"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, IndianRupee } from "lucide-react"
import { downloadReceipt } from "@/utils/receiptGenerator"

export default function StudentFeesPage() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        async function load() {
            const p = await getStudentProfile()
            if (p) {
                setProfile(p)
                const data = await getFeeTransactions(p.id)
                setTransactions(data)
            }
            setLoading(false)
        }
        load()
    }, [])

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Fee Payment History</h1>
                <p className="text-gray-500">View your transactions and download receipts.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IndianRupee className="h-5 w-5 text-secondary" /> Payment Record
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Loading...</div>
                    ) : transactions.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                            No payments found.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Receipt No</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((txn) => (
                                    <TableRow key={txn.id}>
                                        <TableCell className="font-mono text-xs">{txn.id.slice(0, 8).toUpperCase()}</TableCell>
                                        <TableCell>{txn.description || "School Fee"}</TableCell>
                                        <TableCell>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right font-bold text-green-700">
                                            ₹ {txn.amount}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2 text-blue-600 hover:text-blue-700"
                                                onClick={() => downloadReceipt(txn, profile)}
                                            >
                                                <Download className="h-4 w-4" /> Receipt
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
