"use client"

import { useEffect, useState, useTransition } from "react"
import { getPendingTransactions, verifyTransaction, revokeTransaction, getDailyStats } from "@/app/actions/finance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X, Loader2, RefreshCw } from "lucide-react"

export default function FinancePage() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [stats, setStats] = useState({ totalCollected: 0, cashPending: 0 })
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const [txns, dailyStats] = await Promise.all([
            getPendingTransactions(),
            getDailyStats()
        ])
        setTransactions(txns)
        setStats(dailyStats)
        setLoading(false)
    }

    const handleVerify = (id: string) => {
        startTransition(async () => {
            const res = await verifyTransaction(id)
            if (res.success) loadData()
        })
    }

    const handleRevoke = (id: string) => {
        if (!confirm("Are you sure you want to revoke this transaction? This will mark it as invalid.")) return
        startTransition(async () => {
            const res = await revokeTransaction(id)
            if (res.success) loadData()
        })
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Control Center</h1>
                    <p className="text-gray-500">Verify cash payments collected by the office.</p>
                </div>
                <Button variant="outline" onClick={loadData} disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Today's Collection (Verified)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">₹ {stats.totalCollected.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pending Verification (Cash)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-600">₹ {stats.cashPending.toLocaleString()}</div>
                        <p className="text-xs text-gray-400 mt-1">Requires your action</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Transactions List */}
            <Card className="border-t-4 border-t-amber-500 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Pending Approvals
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">{transactions.length}</Badge>
                    </CardTitle>
                    <CardDescription>
                        These payments were collected via Cash/Cheque and need admin verification.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded border border-dashed">
                            No pending transactions. All clean!
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Mode</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((txn) => (
                                    <TableRow key={txn.id}>
                                        <TableCell className="text-gray-500 text-xs">
                                            {new Date(txn.created_at).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="font-medium">{txn.student_id}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="uppercase text-xs">{txn.payment_mode}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-gray-900">
                                            ₹ {txn.amount}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 h-8 gap-1"
                                                    onClick={() => handleVerify(txn.id)}
                                                    disabled={isPending}
                                                >
                                                    <Check className="h-4 w-4" /> Verify
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8 gap-1"
                                                    onClick={() => handleRevoke(txn.id)}
                                                    disabled={isPending}
                                                >
                                                    <X className="h-4 w-4" /> Revoke
                                                </Button>
                                            </div>
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
