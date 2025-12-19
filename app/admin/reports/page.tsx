"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Download, TrendingUp, Users, Wallet, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function AdminReportsPage() {
    const [stats, setStats] = useState({
        revenue: 0,
        students: 0,
        attendance: 0
    })
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Students
                const { count: studentCount } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'student')

                // Fetch Revenue
                const { data: transactions } = await supabase
                    .from('transactions')
                    .select('amount')
                    .eq('status', 'captured')

                const revenue = transactions?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0

                // Fetch Attendance (Mock/Partial)
                // If attendance table exists, we could query it. For now, assume 0 or placeholder if no data.

                setStats({
                    revenue,
                    students: studentCount || 0,
                    attendance: 0 // Placeholder until attendance module is active
                })
            } catch (error) {
                console.error("Error fetching report data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleDownload = async (reportName: string) => {
        toast({ title: "Generating Report...", description: "Please wait." })

        try {
            if (reportName === "Annual Fee Collection Summary") {
                const { data, error } = await supabase
                    .from('transactions')
                    .select('transaction_id, amount, status, created_at, student_id')
                    .order('created_at', { ascending: false })

                if (error) throw error
                if (!data || data.length === 0) {
                    toast({ title: "No Data", description: "No fee transactions found to download." })
                    return
                }

                downloadCSV(data, "fee_collection_summary.csv")
                return
            }

            if (reportName === "Use List (All Students)") {
                const { data, error } = await supabase
                    .from('users')
                    .select('email, full_name, role, created_at')
                    .eq('role', 'student')

                if (error) throw error
                if (!data || data.length === 0) {
                    toast({ title: "No Data", description: "No student records found to download." })
                    return
                }
                downloadCSV(data, "student_list.csv")
                return
            }

            toast({ title: "Coming Soon", description: "This report type is under development." })

        } catch (error: any) {
            console.error("Full Download Error:", JSON.stringify(error, null, 2))

            let message = "Failed to generate report"
            if (error?.message) message = error.message
            else if (typeof error === 'string') message = error
            else if (Object.keys(error).length === 0) message = "Unknown error (Empty response)"

            toast({ title: "Error", description: message, variant: "destructive" })
        }
    }

    const downloadCSV = (data: any[], filename: string) => {
        if (!data || data.length === 0) {
            toast({ title: "No Data", description: "Nothing to download." })
            return
        }

        const headers = Object.keys(data[0])
        const csvContent = [
            headers.join(","),
            ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">System Reports</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-primary text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
                        <Wallet className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                            <>
                                <div className="text-2xl font-bold">₹{stats.revenue.toLocaleString('en-IN')}</div>
                                <p className="text-xs opacity-75 mt-1 border-t border-white/20 pt-2">Lifetime Collection</p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Students</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                            <>
                                <div className="text-2xl font-bold text-gray-900">{stats.students}</div>
                                <p className="text-xs text-gray-500 mt-1">Registered Users</p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Avg. Attendance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">--</div>
                        <p className="text-xs text-gray-500 mt-1">Data Unavailable</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Financial Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {["Annual Fee Collection Summary", "Outstanding Dues Report", "Expense Analysis Q3", "Staff Payroll Summary"].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                                <span className="text-sm font-medium">{item}</span>
                                <Button size="sm" variant="ghost" onClick={() => handleDownload(item)}>Download</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Academic Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {["Use List (All Students)", "Term 1 Class Performance", "Attendance Defaulters List", "Teacher Performance Review"].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                                <span className="text-sm font-medium">{item}</span>
                                <Button size="sm" variant="ghost" onClick={() => handleDownload(item)}>Download</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
